import React, { useState } from 'react';
import { X, Sparkles, FolderPlus, FilePlus } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { generateNodeSeries } from '../../utils/tree';
import { VaultNode } from '../../types';
import { triggerHaptic } from '../../utils/clipboard';

export const GenerateSeriesModal: React.FC = () => {
  const {
    generateSeriesParentId,
    setGenerateSeriesParentId,
    workspace,
    nodes,
    profile,
    createNode,
    showToast,
  } = useVaultStore();

  const [prefix, setPrefix] = useState('Experiment');
  const [startNum, setStartNum] = useState(1);
  const [count, setCount] = useState(5);
  const [nodeType, setNodeType] = useState<'folder' | 'question'>('folder');

  if (generateSeriesParentId === null) return null;

  const parentNode = nodes.find((n) => n.id === generateSeriesParentId);
  const siblings = nodes.filter(
    (n) => n.parent_id === generateSeriesParentId && !n.deleted_at
  );
  const lastPos = siblings.length > 0 ? siblings[siblings.length - 1].position_index : null;

  const handleGenerate = () => {
    triggerHaptic(10);
    const { nodes: newNodes } = generateNodeSeries(
      prefix.trim(),
      startNum,
      Math.min(30, Math.max(1, count)),
      nodeType,
      workspace.id,
      generateSeriesParentId,
      profile.id,
      lastPos
    );

    for (const n of newNodes) {
      createNode(n as VaultNode);
    }

    showToast(`Generated ${newNodes.length} ${nodeType}s successfully!`, { icon: 'check' });
    setGenerateSeriesParentId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#58a6ff]" />
            <div>
              <h3 className="text-base font-semibold text-[#f0f6fc]">Generate Series</h3>
              <p className="text-xs text-[#8b949e]">
                {parentNode ? `Inside "${parentNode.title}"` : 'At Workspace Root'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGenerateSeriesParentId(null)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          {/* Node Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
              Item Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setNodeType('folder'); setPrefix('Experiment'); }}
                className={`touch-target p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  nodeType === 'folder'
                    ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]'
                    : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                }`}
              >
                <FolderPlus size={16} />
                <span>Folders</span>
              </button>
              <button
                type="button"
                onClick={() => { setNodeType('question'); setPrefix('Question'); }}
                className={`touch-target p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  nodeType === 'question'
                    ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]'
                    : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                }`}
              >
                <FilePlus size={16} />
                <span>Questions</span>
              </button>
            </div>
          </div>

          {/* Title Prefix */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
              Title Prefix
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. Experiment, Question, Unit"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-[#f0f6fc] outline-none focus:border-[#58a6ff]"
            />
          </div>

          {/* Start Number & Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                Starting Number
              </label>
              <input
                type="number"
                min={1}
                value={startNum}
                onChange={(e) => setStartNum(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-[#f0f6fc] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                Total Count (1 - 30)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-[#f0f6fc] outline-none"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
            <span className="text-[11px] font-semibold text-[#8b949e] uppercase block mb-1">
              Items to be created:
            </span>
            <p className="text-xs text-[#58a6ff] font-mono">
              "{prefix} {startNum}" ... "{prefix} {startNum + Math.max(1, count) - 1}" ({count} total)
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex gap-3 safe-area-bottom">
          <button
            type="button"
            onClick={() => setGenerateSeriesParentId(null)}
            className="flex-1 touch-target py-2.5 rounded-xl border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prefix.trim() || count < 1}
            className="flex-1 touch-target py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles size={16} />
            <span>Generate Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
