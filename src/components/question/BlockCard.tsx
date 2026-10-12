// Notion-style Solution Block with 1-Tap Mobile Copy
import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ClipboardPaste, 
  Edit3, 
  History, 
  MoreVertical, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  CopyCheck,
  WrapText,
  Plus
} from 'lucide-react';
import { QuestionBlock, BlockVariant } from '../../types';
import { CodeMirrorViewer } from '../editor/CodeMirrorViewer';
import { useVaultStore } from '../../stores/useVaultStore';
import { copyToClipboard, triggerHaptic, readClipboardText } from '../../utils/clipboard';

interface Props {
  block: QuestionBlock;
  index: number;
  totalBlocks: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  dragHandleProps?: any;
}

export const BlockCard: React.FC<Props> = ({
  block,
  index,
  totalBlocks,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}) => {
  const {
    currentLanguage,
    variants,
    role,
    fontSize,
    appPerspective,
    setEditingBlock,
    setHistoryModalBlock,
    setSmartPasteData,
    softDeleteBlock,
    createBlock,
    updateBlock,
    updateBlockVariant,
    showToast,
    addRecentCopy,
  } = useVaultStore();

  const [isCopied, setIsCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(block.block_title);
  const [localWrap, setLocalWrap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const currentVariant: BlockVariant | undefined = variants[block.id]?.[currentLanguage];
  const oppositeLang = currentLanguage === 'java' ? 'cpp' : 'java';
  const oppositeVariant: BlockVariant | undefined = variants[block.id]?.[oppositeLang];

  // Guaranteed fallback to opposite language variant so code is NEVER missing
  const codeContent = currentVariant?.code_content ?? oppositeVariant?.code_content ?? '';
  const hasCode = Boolean(codeContent.trim());

  // 1-Tap Copy
  const handleCopy = async () => {
    triggerHaptic(10);
    const success = await copyToClipboard(codeContent);
    if (success) {
      setIsCopied(true);
      const lines = codeContent.split('\n').length;
      const displayName = block.block_title?.trim() || 'Snippet';
      showToast(`Copied ${displayName} (${lines} lines)`, { icon: 'copy' });
      addRecentCopy({
        text: codeContent,
        title: displayName,
        language: currentLanguage,
        lineCount: lines,
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 1200);
    }
  };

  const handlePaste = async () => {
    triggerHaptic(10);
    const clipboardContent = await readClipboardText();
    setSmartPasteData({
      text: clipboardContent || '',
      targetBlockId: block.id,
    });
  };

  const handleTitleSubmit = () => {
    if (titleInput.trim() && titleInput !== block.block_title) {
      updateBlock(block.id, { block_title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const isComputerMode = appPerspective === 'computer' && role !== 'viewer';
  const hasTitle = Boolean(block.block_title && block.block_title.trim() && block.block_title !== 'Main Solution');

  return (
    <div className="space-y-1.5 font-sans select-none">
      {/* Notion-style Title Label & Actions above Code Block */}
      <div className={`flex items-center justify-between px-1 ${!hasTitle && !isComputerMode ? 'pb-0.5' : ''}`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Drag handle & order buttons (Visible in Computer Mode) */}
          {isComputerMode && (
            <div className="flex items-center gap-1 text-[#8b949e]">
              <div
                {...dragHandleProps}
                className="p-1 hover:text-[#f0f6fc] cursor-grab active:cursor-grabbing rounded"
                title="Drag to reorder"
              >
                <GripVertical size={14} />
              </div>
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="p-0.5 hover:text-[#f0f6fc] disabled:opacity-20"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === totalBlocks - 1}
                className="p-0.5 hover:text-[#f0f6fc] disabled:opacity-20"
              >
                <ArrowDown size={12} />
              </button>
            </div>
          )}

          {/* Clean Label (e.g. struct Node {, Node* createNode(int value) {) */}
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-[#202020] text-[#f0f6fc] border border-[#58a6ff] rounded px-2 py-0.5 text-xs font-mono font-medium outline-none"
            />
          ) : hasTitle ? (
            <h3
              onClick={() => isComputerMode && setIsEditingTitle(true)}
              className={`font-mono text-sm font-medium text-[#c9d1d9] truncate ${
                isComputerMode ? 'cursor-pointer hover:text-[#58a6ff]' : ''
              }`}
            >
              {block.block_title}
            </h3>
          ) : isComputerMode ? (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="font-mono text-xs text-[#6e7681] hover:text-[#58a6ff] italic transition-colors"
            >
              + Add label
            </button>
          ) : null}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Hero 1-Tap Copy Button (Always visible & prominent!) */}
          <button
            type="button"
            onClick={handleCopy}
            className={`touch-target px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              isCopied
                ? 'bg-[#238636] text-white shadow-[#238636]/30'
                : 'bg-[#252525] hover:bg-[#303030] text-[#f0f6fc] border border-[#383838]'
            }`}
            aria-label="Copy snippet"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied ✓' : 'Copy'}</span>
          </button>

          {/* Computer mode tools */}
          {isComputerMode && (
            <>
              <button
                type="button"
                onClick={handlePaste}
                className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
                title="Paste code into block"
              >
                <ClipboardPaste size={15} />
              </button>

              <button
                type="button"
                onClick={() => setEditingBlock({ blockId: block.id, language: currentLanguage })}
                className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
                title="Edit block in full editor"
              >
                <Edit3 size={15} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
                >
                  <MoreVertical size={15} />
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 w-44 bg-[#202020] border border-[#383838] rounded-xl shadow-2xl py-1 z-40 text-xs animate-in fade-in"
                    onClick={() => setShowMenu(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setHistoryModalBlock({ blockId: block.id, language: currentLanguage })}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#2c2c2c] flex items-center gap-2"
                    >
                      <History size={13} />
                      <span>Version History</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalWrap(!localWrap)}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#2c2c2c] flex items-center gap-2"
                    >
                      <WrapText size={13} />
                      <span>Toggle Wrap</span>
                    </button>
                    <div className="my-1 border-t border-[#383838]" />
                    <button
                      type="button"
                      onClick={() => softDeleteBlock(block.id)}
                      className="w-full px-3 py-2 text-left text-[#da3633] hover:bg-[#da3633]/10 flex items-center gap-2"
                    >
                      <Trash2 size={13} />
                      <span>Delete Block</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notion-style Code Surface (Rounded-2xl, #202020 background) */}
      <div 
        onClick={handleCopy}
        className="rounded-2xl border border-[#2e2e2e] bg-[#202020] p-3 shadow-md hover:border-[#58a6ff]/40 transition-all cursor-pointer relative group"
        title="Tap anywhere to copy code snippet"
      >
        {hasCode ? (
          <CodeMirrorViewer
            code={codeContent}
            language={currentLanguage}
            lineWrapping={localWrap}
            fontSize={fontSize}
          />
        ) : (
          <div className="py-8 text-center text-xs text-[#8b949e]">
            <p>No {currentLanguage.toUpperCase()} code in this block.</p>
            {isComputerMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBlock({ blockId: block.id, language: currentLanguage });
                }}
                className="mt-2 touch-target px-3 py-1 bg-[#58a6ff] text-black font-semibold rounded-lg text-xs"
              >
                + Add Code
              </button>
            )}
          </div>
        )}

        {/* Subtle quick copy overlay hint on hover */}
        <div className="absolute right-3 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#8b949e] pointer-events-none">
          Tap block to copy
        </div>
      </div>
    </div>
  );
};
