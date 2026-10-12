// LabVault Smart Paste & Function Detection Engine
import React, { useState } from 'react';
import { X, Scissors, ClipboardPaste, ArrowRight, Layers, FileCode } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { analyzePastedCode, triggerHaptic } from '../../utils/clipboard';
import { getNewPositionIndex } from '../../utils/tree';
import { QuestionBlock } from '../../types';

export const SmartPasteModal: React.FC = () => {
  const {
    smartPasteData,
    setSmartPasteData,
    selectedNodeId,
    currentLanguage,
    setCurrentLanguage,
    blocks,
    variants,
    createBlock,
    updateBlockVariant,
    showToast,
    profile,
  } = useVaultStore();

  const [customText, setCustomText] = useState(smartPasteData?.text || '');
  const [selectedMode, setSelectedMode] = useState<'split' | 'replace' | 'append' | 'new_block'>('split');

  if (!smartPasteData) return null;

  const targetBlock = smartPasteData.targetBlockId
    ? blocks.find((b) => b.id === smartPasteData.targetBlockId)
    : null;

  const analysis = analyzePastedCode(customText);

  const handleApply = () => {
    triggerHaptic(10);
    if (!selectedNodeId) return;

    // Check if user should switch language
    if (analysis.detectedLanguage && analysis.detectedLanguage !== currentLanguage) {
      setCurrentLanguage(analysis.detectedLanguage);
    }

    const lang = analysis.detectedLanguage || currentLanguage;

    // Mode 1: Split into separate blocks for each detected function
    if (selectedMode === 'split' && analysis.hasMultipleFunctions) {
      const activeBlocks = blocks.filter((b) => b.node_id === selectedNodeId && !b.deleted_at);
      let lastPos = activeBlocks.length > 0 ? activeBlocks[activeBlocks.length - 1].position_index : null;

      for (const fn of analysis.detectedFunctions) {
        const nextPos = getNewPositionIndex(lastPos, null);
        const newBlockId = crypto.randomUUID();
        const newBlock: QuestionBlock = {
          id: newBlockId,
          node_id: selectedNodeId,
          block_title: fn.title,
          position_index: nextPos,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: profile.id,
        };

        createBlock(
          newBlock,
          lang === 'java' ? fn.code : '',
          lang === 'cpp' ? fn.code : ''
        );
        lastPos = nextPos;
      }

      showToast(`Split into ${analysis.detectedFunctions.length} function blocks!`, {
        icon: 'check',
      });
      setSmartPasteData(null);
      return;
    }

    // Mode 2: Replace target block
    if (selectedMode === 'replace' && targetBlock) {
      const prevCode = variants[targetBlock.id]?.[lang]?.code_content || '';
      updateBlockVariant(targetBlock.id, lang, customText, true);

      showToast(`Pasted into "${targetBlock.block_title}"`, {
        icon: 'check',
        undoAction: () => {
          updateBlockVariant(targetBlock.id, lang, prevCode, false);
          showToast('Paste undone', { icon: 'info' });
        },
      });
      setSmartPasteData(null);
      return;
    }

    // Mode 3: Append to target block
    if (selectedMode === 'append' && targetBlock) {
      const prevCode = variants[targetBlock.id]?.[lang]?.code_content || '';
      const combined = `${prevCode}\n\n${customText}`.trim();
      updateBlockVariant(targetBlock.id, lang, combined, true);

      showToast(`Appended code to "${targetBlock.block_title}"`, {
        icon: 'check',
        undoAction: () => {
          updateBlockVariant(targetBlock.id, lang, prevCode, false);
        },
      });
      setSmartPasteData(null);
      return;
    }

    // Mode 4: Create single new block
    const activeBlocks = blocks.filter((b) => b.node_id === selectedNodeId && !b.deleted_at);
    const lastPos = activeBlocks.length > 0 ? activeBlocks[activeBlocks.length - 1].position_index : null;
    const nextPos = getNewPositionIndex(lastPos, null);
    const newBlockId = crypto.randomUUID();

    const title = analysis.detectedFunctions[0]?.title || `Function (${activeBlocks.length + 1})`;
    const newBlock: QuestionBlock = {
      id: newBlockId,
      node_id: selectedNodeId,
      block_title: title,
      position_index: nextPos,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    };

    createBlock(
      newBlock,
      lang === 'java' ? customText : '',
      lang === 'cpp' ? customText : ''
    );

    showToast(`Created block "${title}"`, { icon: 'check' });
    setSmartPasteData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <ClipboardPaste size={18} className="text-[#58a6ff]" />
            <h3 className="text-base font-semibold text-[#f0f6fc]">Smart Paste Analysis</h3>
          </div>
          <button
            type="button"
            onClick={() => setSmartPasteData(null)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          {/* Language Switch recommendation */}
          {analysis.detectedLanguage && analysis.detectedLanguage !== currentLanguage && (
            <div className="p-3 bg-[#58a6ff]/10 border border-[#58a6ff]/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#58a6ff]">
                  Detected {analysis.detectedLanguage.toUpperCase()} code
                </p>
                <p className="text-xs text-[#8b949e]">
                  Your current view is set to {currentLanguage.toUpperCase()}. Switch language?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentLanguage(analysis.detectedLanguage!)}
                className="touch-target px-3 py-1.5 bg-[#58a6ff] hover:bg-[#79c0ff] text-black font-semibold rounded-lg text-xs"
              >
                Switch
              </button>
            </div>
          )}

          {/* Multiple function split detection banner */}
          {analysis.hasMultipleFunctions && (
            <div className="p-3 bg-[#238636]/10 border border-[#238636]/40 rounded-xl">
              <div className="flex items-center gap-2 text-[#3fb950] font-semibold mb-1">
                <Scissors size={16} />
                <span>Smart Split: Found {analysis.detectedFunctions.length} Functions!</span>
              </div>
              <p className="text-xs text-[#8b949e] mb-2">
                We detected {analysis.detectedFunctions.length} distinct function signatures. Would you like to split them into individual blocks?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.detectedFunctions.map((fn, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[#f0f6fc]"
                  >
                    {fn.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
              Paste Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              {analysis.hasMultipleFunctions && (
                <button
                  type="button"
                  onClick={() => setSelectedMode('split')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'split'
                      ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]'
                      : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:bg-[#30363d]'
                  }`}
                >
                  <p className="font-semibold text-xs text-[#f0f6fc] flex items-center gap-1.5">
                    <Scissors size={14} /> Split into {analysis.detectedFunctions.length} Blocks
                  </p>
                  <p className="text-[11px] text-[#8b949e] mt-0.5">One block per function</p>
                </button>
              )}

              {targetBlock && (
                <button
                  type="button"
                  onClick={() => setSelectedMode('replace')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'replace'
                      ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]'
                      : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:bg-[#30363d]'
                  }`}
                >
                  <p className="font-semibold text-xs text-[#f0f6fc] flex items-center gap-1.5">
                    <Layers size={14} /> Replace Block
                  </p>
                  <p className="text-[11px] text-[#8b949e] mt-0.5">Overwrite "{targetBlock.block_title}"</p>
                </button>
              )}

              {targetBlock && (
                <button
                  type="button"
                  onClick={() => setSelectedMode('append')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMode === 'append'
                      ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]'
                      : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:bg-[#30363d]'
                  }`}
                >
                  <p className="font-semibold text-xs text-[#f0f6fc] flex items-center gap-1.5">
                    <ArrowRight size={14} /> Append Code
                  </p>
                  <p className="text-[11px] text-[#8b949e] mt-0.5">Append to bottom</p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMode('new_block')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedMode === 'new_block'
                    ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff]'
                    : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:bg-[#30363d]'
                }`}
              >
                <p className="font-semibold text-xs text-[#f0f6fc] flex items-center gap-1.5">
                  <FileCode size={14} /> New Block
                </p>
                <p className="text-[11px] text-[#8b949e] mt-0.5">Add as new block</p>
              </button>
            </div>
          </div>

          {/* Paste preview / editor fallback */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                Clipboard Content ({analysis.lineCount} lines)
              </label>
              <span className="text-xs text-[#8b949e]">Long-press to paste manually if needed</span>
            </div>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste code snippet here..."
              rows={5}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 font-mono text-xs text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex gap-3 safe-area-bottom">
          <button
            type="button"
            onClick={() => setSmartPasteData(null)}
            className="flex-1 touch-target py-2.5 rounded-xl border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!customText.trim()}
            className="flex-1 touch-target py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <ClipboardPaste size={16} />
            <span>Apply Paste</span>
          </button>
        </div>
      </div>
    </div>
  );
};
