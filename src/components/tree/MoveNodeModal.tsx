import React, { useState } from 'react';
import { X, Folder, Move, Check, AlertCircle } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { canReparentNode, getNewPositionIndex } from '../../utils/tree';
import { triggerHaptic } from '../../utils/clipboard';

export const MoveNodeModal: React.FC = () => {
  const {
    moveNodeTargetId,
    setMoveNodeTargetId,
    nodes,
    updateNode,
    showToast,
  } = useVaultStore();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  if (!moveNodeTargetId) return null;

  const targetNode = nodes.find((n) => n.id === moveNodeTargetId);
  if (!targetNode) return null;

  // Filter available destination folders
  const allFolders = nodes.filter((n) => n.type === 'folder' && !n.deleted_at);

  const handleMove = () => {
    triggerHaptic(10);
    if (!canReparentNode(targetNode.id, selectedFolderId, nodes)) {
      showToast('Cannot move a folder into its own sub-folder!', { icon: 'info' });
      return;
    }

    const siblings = nodes.filter(
      (n) => n.parent_id === selectedFolderId && !n.deleted_at
    );
    const lastPos = siblings.length > 0 ? siblings[siblings.length - 1].position_index : null;
    const nextPos = getNewPositionIndex(lastPos, null);

    updateNode(targetNode.id, {
      parent_id: selectedFolderId,
      position_index: nextPos,
    });

    const destName = selectedFolderId
      ? nodes.find((n) => n.id === selectedFolderId)?.title
      : 'Root';

    showToast(`Moved "${targetNode.title}" to ${destName}`, { icon: 'check' });
    setMoveNodeTargetId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Move size={18} className="text-[#58a6ff]" />
            <div>
              <h3 className="text-base font-semibold text-[#f0f6fc]">Move Item</h3>
              <p className="text-xs text-[#8b949e] truncate max-w-xs">
                Move "{targetNode.title}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMoveNodeTargetId(null)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-sm">
          <p className="text-xs font-semibold text-[#8b949e] uppercase mb-2">
            Select Destination Folder
          </p>

          {/* Root option */}
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
              selectedFolderId === null
                ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#f0f6fc]'
                : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Folder size={16} className="text-[#58a6ff]" />
              <span className="font-medium text-xs text-[#f0f6fc]">Workspace Root (Top Level)</span>
            </div>
            {selectedFolderId === null && <Check size={16} className="text-[#58a6ff]" />}
          </button>

          {/* Folder items */}
          {allFolders.map((folder) => {
            const isValid = canReparentNode(targetNode.id, folder.id, nodes);
            const isSelected = selectedFolderId === folder.id;

            return (
              <button
                key={folder.id}
                type="button"
                disabled={!isValid}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                  !isValid
                    ? 'opacity-40 cursor-not-allowed bg-[#0d1117] border-[#30363d]'
                    : isSelected
                    ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#f0f6fc]'
                    : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Folder size={16} className={isValid ? 'text-[#e3b341]' : 'text-[#8b949e]'} />
                  <span className="font-medium text-xs text-[#f0f6fc] truncate">
                    {folder.title}
                  </span>
                </div>
                {isSelected && <Check size={16} className="text-[#58a6ff]" />}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex gap-3 safe-area-bottom">
          <button
            type="button"
            onClick={() => setMoveNodeTargetId(null)}
            className="flex-1 touch-target py-2.5 rounded-xl border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleMove}
            className="flex-1 touch-target py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Move size={16} />
            <span>Confirm Move</span>
          </button>
        </div>
      </div>
    </div>
  );
};
