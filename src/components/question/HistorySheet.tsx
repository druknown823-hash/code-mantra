import React, { useState } from 'react';
import { X, History, RotateCcw, GitCommit, Check } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic } from '../../utils/clipboard';

export const HistorySheet: React.FC = () => {
  const {
    historyModalBlock,
    setHistoryModalBlock,
    blocks,
    variants,
    versions,
    updateBlockVariant,
    showToast,
  } = useVaultStore();

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  if (!historyModalBlock) return null;

  const currentBlock = blocks.find((b) => b.id === historyModalBlock.blockId);
  const currentVariant = variants[historyModalBlock.blockId]?.[historyModalBlock.language];
  const blockVersions = versions.filter(
    (v) => v.block_id === historyModalBlock.blockId && v.language === historyModalBlock.language
  );

  const activeVersion = selectedVersionId
    ? blockVersions.find((v) => v.id === selectedVersionId)
    : blockVersions[0];

  const handleRestore = (code: string) => {
    triggerHaptic(10);
    updateBlockVariant(historyModalBlock.blockId, historyModalBlock.language, code, true);
    showToast(`Restored version from ${new Date(activeVersion?.saved_at || '').toLocaleTimeString()}`, {
      icon: 'check',
    });
    setHistoryModalBlock(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#58a6ff]" />
            <div>
              <h3 className="text-base font-semibold text-[#f0f6fc]">
                Version History: {currentBlock?.block_title}
              </h3>
              <p className="text-xs text-[#8b949e] font-mono uppercase font-bold">
                {historyModalBlock.language} Snapshots
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHistoryModalBlock(null)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row text-sm">
          {/* Version list */}
          <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-[#30363d] overflow-y-auto max-h-48 sm:max-h-full p-2 space-y-1">
            <div className="p-2 text-xs font-semibold text-[#8b949e] uppercase">
              Snapshots ({blockVersions.length})
            </div>
            {blockVersions.length === 0 ? (
              <p className="text-xs text-[#8b949e] p-3 text-center">
                No past snapshots saved yet. Edit to create auto-snapshots.
              </p>
            ) : (
              blockVersions.map((v, i) => {
                const isSelected = activeVersion?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVersionId(v.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#f0f6fc]'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <GitCommit size={14} className={isSelected ? 'text-[#58a6ff]' : ''} />
                      <span>Snapshot #{blockVersions.length - i}</span>
                    </div>
                    <span className="text-[11px] text-[#8b949e] block mt-1">
                      {new Date(v.saved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Diff / Code Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#8b949e]">
                {activeVersion ? 'Historical Snapshot Content' : 'Current Content'}
              </span>
              {activeVersion && (
                <button
                  type="button"
                  onClick={() => handleRestore(activeVersion.code_content)}
                  className="touch-target px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow"
                >
                  <RotateCcw size={14} />
                  <span>Restore Snapshot</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-[#30363d] bg-[#161b22] p-3 font-mono text-xs text-[#c9d1d9] whitespace-pre select-text">
              {activeVersion?.code_content || currentVariant?.code_content || '// Empty'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
