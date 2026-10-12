import React from 'react';
import { X, Check, Copy, Code2, Sliders } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { assembleFullProgram, copyToClipboard, triggerHaptic } from '../../utils/clipboard';

export const CopyOptionsSheet: React.FC = () => {
  const {
    isCopyOptionsOpen,
    setCopyOptionsOpen,
    copyOptions,
    setCopyOptions,
    blocks,
    variants,
    currentLanguage,
    templates,
    showToast,
    addRecentCopy,
    selectedNodeId,
    nodes,
  } = useVaultStore();

  if (!isCopyOptionsOpen) return null;

  const activeQuestionBlocks = blocks.filter(
    (b) => b.node_id === selectedNodeId && !b.deleted_at
  );
  const activeNode = nodes.find((n) => n.id === selectedNodeId);
  const currentTemplate = templates.find((t) => t.language === currentLanguage);

  const handleCopyNow = async () => {
    triggerHaptic(10);
    const fullCode = assembleFullProgram(
      activeQuestionBlocks,
      variants,
      currentLanguage,
      copyOptions,
      currentTemplate
    );

    const success = await copyToClipboard(fullCode);
    if (success) {
      const lineCount = fullCode.split('\n').length;
      showToast(`All code copied (${lineCount} lines)`, { icon: 'copy' });
      addRecentCopy({
        text: fullCode,
        title: `${activeNode?.title || 'Program'} (${currentLanguage.toUpperCase()})`,
        language: currentLanguage,
        lineCount,
      });
      setCopyOptionsOpen(false);
    }
  };

  const toggleBlockSelection = (blockId: string) => {
    const current = copyOptions.selectedBlockIds || activeQuestionBlocks.map((b) => b.id);
    const next = current.includes(blockId)
      ? current.filter((id) => id !== blockId)
      : [...current, blockId];
    setCopyOptions({ selectedBlockIds: next });
  };

  const isAllSelected = !copyOptions.selectedBlockIds || 
    copyOptions.selectedBlockIds.length === activeQuestionBlocks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[#58a6ff]" />
            <h3 className="text-base font-semibold text-[#f0f6fc]">Copy Options</h3>
          </div>
          <button
            type="button"
            onClick={() => setCopyOptionsOpen(false)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Separator style */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
              Block Separator Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'banner', label: 'Comment Banner' },
                { id: 'blank', label: 'Blank Line' },
                { id: 'none', label: 'Compact / None' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCopyOptions({ separator: item.id as any })}
                  className={`touch-target px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    copyOptions.separator === item.id
                      ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]'
                      : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:bg-[#30363d]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Boilerplate wrapping */}
          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center justify-between">
            <div>
              <p className="font-medium text-[#f0f6fc]">Wrap in Boilerplate Template</p>
              <p className="text-xs text-[#8b949e]">
                {currentLanguage === 'java' 
                  ? 'Includes class Main { ... } & main method'
                  : 'Includes #include <iostream> & int main()'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={copyOptions.wrapInBoilerplate}
              onChange={(e) => setCopyOptions({ wrapInBoilerplate: e.target.checked })}
              className="w-5 h-5 accent-[#58a6ff] cursor-pointer"
            />
          </div>

          {/* Deduplicate & hoist imports */}
          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center justify-between">
            <div>
              <p className="font-medium text-[#f0f6fc]">Hoist & Deduplicate Imports</p>
              <p className="text-xs text-[#8b949e]">Moves all import/#include headers to the top</p>
            </div>
            <input
              type="checkbox"
              checked={copyOptions.deduplicateImports}
              onChange={(e) => setCopyOptions({ deduplicateImports: e.target.checked })}
              className="w-5 h-5 accent-[#58a6ff] cursor-pointer"
            />
          </div>

          {/* Block Selection list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                Include Code Blocks ({activeQuestionBlocks.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setCopyOptions({
                    selectedBlockIds: isAllSelected ? [] : activeQuestionBlocks.map((b) => b.id),
                  })
                }
                className="text-xs text-[#58a6ff] hover:underline"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {activeQuestionBlocks.map((block) => {
                const selected =
                  !copyOptions.selectedBlockIds ||
                  copyOptions.selectedBlockIds.includes(block.id);
                return (
                  <label
                    key={block.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#21262d] border border-[#30363d] cursor-pointer hover:bg-[#30363d]/60 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleBlockSelection(block.id)}
                      className="w-4 h-4 accent-[#58a6ff]"
                    />
                    <span className="font-mono text-xs text-[#f0f6fc] truncate">
                      {block.block_title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex gap-3 safe-area-bottom">
          <button
            type="button"
            onClick={() => setCopyOptionsOpen(false)}
            className="flex-1 touch-target py-2.5 rounded-xl border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCopyNow}
            className="flex-1 touch-target py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Copy size={16} />
            <span>Copy All Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
