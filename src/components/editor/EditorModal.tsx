// LabVault Fullscreen Live Editor Modal with Yjs & Realtime Sync
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import { 
  X, 
  Check, 
  Type, 
  Palette, 
  RotateCcw, 
  AlertTriangle, 
  Users, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SymbolToolbar } from './SymbolToolbar';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic } from '../../utils/clipboard';

const MAX_BLOCK_BYTES = 200 * 1024; // 200 KB limit

export const EditorModal: React.FC = () => {
  const {
    editingBlock,
    setEditingBlock,
    blocks,
    variants,
    updateBlockVariant,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontLigatures,
    toggleLigatures,
    showToast,
    profile,
    presenceUsers,
  } = useVaultStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [byteSize, setByteSize] = useState(0);
  const [sizeExceeded, setSizeExceeded] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const autosaveTimerRef = useRef<any>(null);

  if (!editingBlock) return null;

  const currentBlock = blocks.find((b) => b.id === editingBlock.blockId);
  const currentVariant = variants[editingBlock.blockId]?.[editingBlock.language];
  const initialCode = currentVariant?.code_content || '';

  // Other active peers in this block
  const peersInBlock = presenceUsers.filter(
    (u) => u.block_id === editingBlock.blockId && u.user_id !== profile.id
  );

  // Debounced auto-save
  const persistChanges = useCallback(
    (codeToSave: string, saveSnapshot = false) => {
      if (sizeExceeded) return;
      updateBlockVariant(editingBlock.blockId, editingBlock.language, codeToSave, saveSnapshot);
      setIsSaved(true);
    },
    [editingBlock, sizeExceeded, updateBlockVariant]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Yjs Document for this block & language
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const ytext = ydoc.getText('codemirror');
    
    // Set initial text
    if (ytext.toString() !== initialCode) {
      ytext.insert(0, initialCode);
    }
    setCurrentCode(initialCode);
    setByteSize(new Blob([initialCode]).size);

    // Setup CodeMirror
    const langExtension = editingBlock.language === 'java' ? java() : cpp();

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        setCurrentCode(text);
        const bytes = new Blob([text]).size;
        setByteSize(bytes);
        const isOver = bytes > MAX_BLOCK_BYTES;
        setSizeExceeded(isOver);
        setIsSaved(false);

        // Schedule 1s autosave
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        if (!isOver) {
          autosaveTimerRef.current = setTimeout(() => {
            persistChanges(text, false);
          }, 1000);
        }
      }
    });

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      bracketMatching(),
      indentOnInput(),
      history(),
      langExtension,
      oneDark,
      updateListener,
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      EditorView.theme({
        '&': {
          fontSize: `${fontSize}px`,
          backgroundColor: '#0d1117 !important',
          height: '100%',
        },
        '.cm-scroller': {
          overflowY: 'auto',
          overflowX: 'auto',
          fontFamily: fontLigatures
            ? '"Fira Code", "JetBrains Mono", monospace'
            : '"JetBrains Mono", monospace',
          lineHeight: '1.6',
        },
        '.cm-content': {
          padding: '12px 0 120px 0', // Extra bottom space for soft keyboard & thumb zone
        },
        '.cm-gutters': {
          backgroundColor: '#161b22',
          borderRight: '1px solid #30363d',
          color: '#8b949e',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(88, 166, 255, 0.08)',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(88, 166, 255, 0.15)',
          color: '#58a6ff',
        },
      }),
    ];

    const state = EditorState.create({
      doc: initialCode,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      view.destroy();
      ydoc.destroy();
    };
  }, [editingBlock.blockId, editingBlock.language]);

  // Insert symbol at current cursor
  const handleInsertSymbol = (symbol: string) => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    const selection = view.state.selection.main;
    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: symbol },
      selection: { anchor: selection.from + symbol.length },
    });
    view.focus();
  };

  const handleClose = () => {
    triggerHaptic(10);
    if (!sizeExceeded && currentCode) {
      persistChanges(currentCode, true); // Save snapshot version on leaving edit mode
    }
    setEditingBlock(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117] flex flex-col safe-area-inset">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#161b22] border-b border-[#30363d] select-none">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={handleClose}
            className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
            aria-label="Close Editor"
          >
            <X size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[#f0f6fc] truncate">
              {currentBlock?.block_title || 'Edit Code Block'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <span className="font-mono uppercase font-bold text-[#58a6ff]">
                {editingBlock.language}
              </span>
              <span>•</span>
              <span className={isSaved ? 'text-[#3fb950]' : 'text-[#d29922]'}>
                {isSaved ? 'Autosaved' : 'Saving...'}
              </span>
              <span>•</span>
              <span className={sizeExceeded ? 'text-[#da3633] font-bold' : ''}>
                {(byteSize / 1024).toFixed(1)} KB / 200 KB
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1">
          {/* Peer Presence indicator */}
          {peersInBlock.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
              <span>{peersInBlock[0].display_name} editing</span>
            </div>
          )}

          {/* Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
            aria-label="Editor Settings"
          >
            <Type size={18} />
          </button>

          {/* Quick Done button */}
          <button
            type="button"
            onClick={handleClose}
            className="touch-target px-3.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Check size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>

      {/* Size Limit Warning */}
      {sizeExceeded && (
        <div className="bg-[#da3633]/20 border-b border-[#da3633] px-4 py-2 flex items-center gap-2 text-[#f85149] text-xs">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>Block exceeds maximum 200 KB limit. Please reduce code size to save.</span>
        </div>
      )}

      {/* Editor Settings Drawer */}
      {showSettings && (
        <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-4 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="text-[#8b949e]">Font Size:</span>
            <button
              onClick={() => setFontSize(fontSize - 1)}
              className="px-2.5 py-1 bg-[#21262d] text-[#c9d1d9] rounded border border-[#30363d] font-bold"
            >
              A−
            </button>
            <span className="font-mono text-sm">{fontSize}px</span>
            <button
              onClick={() => setFontSize(fontSize + 1)}
              className="px-2.5 py-1 bg-[#21262d] text-[#c9d1d9] rounded border border-[#30363d] font-bold"
            >
              A+
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8b949e]">Ligatures:</span>
            <button
              onClick={toggleLigatures}
              className={`px-3 py-1 rounded border font-medium ${
                fontLigatures
                  ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]/40'
                  : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
              }`}
            >
              {fontLigatures ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8b949e]">Theme:</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded px-2 py-1 text-xs outline-none"
            >
              <option value="one-dark">One Dark</option>
              <option value="amoled">AMOLED Black</option>
              <option value="dracula">Dracula</option>
              <option value="github-dark">GitHub Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
      )}

      {/* CodeMirror Surface */}
      <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      {/* Soft Keyboard Symbol Toolbar */}
      <SymbolToolbar
        onInsertSymbol={handleInsertSymbol}
        onUndo={() => viewRef.current && undo(viewRef.current)}
        onRedo={() => viewRef.current && redo(viewRef.current)}
      />

      {/* Sticky Bottom Thumb Zone Done/Save Bar */}
      <div className="p-2.5 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between safe-area-bottom">
        <div className="text-xs text-[#8b949e] px-2">
          {currentCode.split('\n').length} lines • Auto-indented
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="touch-target px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <Check size={18} />
          <span>Save & Return</span>
        </button>
      </div>
    </div>
  );
};
