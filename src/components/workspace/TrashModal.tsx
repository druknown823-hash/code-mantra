import React from 'react';
import { X, Trash2, RotateCcw, AlertTriangle, FileCode, Folder } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic } from '../../utils/clipboard';

export const TrashModal: React.FC = () => {
  const {
    isTrashOpen,
    setTrashOpen,
    nodes,
    blocks,
    restoreNode,
    permanentDeleteNode,
    restoreBlock,
    showToast,
  } = useVaultStore();

  if (!isTrashOpen) return null;

  const deletedNodes = nodes.filter((n) => n.deleted_at);
  const deletedBlocks = blocks.filter((b) => b.deleted_at);

  const handleRestoreNode = (id: string) => {
    triggerHaptic(10);
    restoreNode(id);
  };

  const handlePermanentDelete = (id: string) => {
    triggerHaptic(15);
    permanentDeleteNode(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-[#da3633]" />
            <div>
              <h3 className="text-base font-semibold text-[#f0f6fc]">Trash Bin</h3>
              <p className="text-xs text-[#8b949e]">Items restorable within 30 days</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTrashOpen(false)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {deletedNodes.length === 0 && deletedBlocks.length === 0 ? (
            <div className="text-center py-12 text-[#8b949e]">
              <Trash2 size={36} className="mx-auto mb-2 opacity-30" />
              <p>Trash is empty.</p>
              <p className="text-xs mt-1">Soft-deleted items will appear here for 30 days.</p>
            </div>
          ) : (
            <>
              {deletedNodes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8b949e] uppercase">
                    Deleted Folders & Questions ({deletedNodes.length})
                  </span>
                  {deletedNodes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-2">
                        {n.type === 'folder' ? (
                          <Folder size={16} className="text-[#e3b341] flex-shrink-0" />
                        ) : (
                          <FileCode size={16} className="text-[#58a6ff] flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium text-[#f0f6fc] truncate">
                          {n.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRestoreNode(n.id)}
                          className="touch-target px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <RotateCcw size={13} />
                          <span>Restore</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePermanentDelete(n.id)}
                          className="touch-target p-1.5 text-[#8b949e] hover:text-[#da3633] rounded-lg"
                          title="Delete Permanently"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {deletedBlocks.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8b949e] uppercase">
                    Deleted Function Blocks ({deletedBlocks.length})
                  </span>
                  {deletedBlocks.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between gap-3"
                    >
                      <span className="text-xs font-mono font-medium text-[#f0f6fc] truncate">
                        {b.block_title}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          restoreBlock(b.id);
                          showToast(`Restored block "${b.block_title}"`, { icon: 'check' });
                        }}
                        className="touch-target px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <RotateCcw size={13} />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
