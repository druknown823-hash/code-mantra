import React from 'react';
import {
  Folder,
  FileCode,
  Plus,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  Share2,
  Copy,
} from 'lucide-react';
import { VaultNode, QuestionStatus } from '../../types';
import { ProgressRing } from '../tree/ProgressRing';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic, assembleFullProgram, copyToClipboard } from '../../utils/clipboard';

interface Props {
  node: VaultNode;
}

export const FolderView: React.FC<Props> = ({ node }) => {
  const {
    nodes,
    blocks,
    variants,
    templates,
    currentLanguage,
    setSelectedNodeId,
    setGenerateSeriesParentId,
    createNode,
    role,
    showToast,
    addRecentCopy,
    setShareModalOpen,
  } = useVaultStore();

  const childNodes = nodes.filter((n) => n.parent_id === node.id && !n.deleted_at);

  const handleAddChild = (type: 'folder' | 'question') => {
    triggerHaptic(10);
    const newId = crypto.randomUUID();
    createNode({
      id: newId,
      workspace_id: node.workspace_id,
      parent_id: node.id,
      title: type === 'folder' ? 'New Sub-folder' : 'New Lab Question',
      type,
      position_index: 'a0',
      description_md: '',
      default_language: currentLanguage,
      status: 'todo',
      tags: [],
      is_pinned: false,
      deleted_at: null,
      created_by: node.created_by,
      updated_by: node.created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const handleCopyAllInFolder = async () => {
    triggerHaptic(10);
    const descendantQuestionIds = new Set<string>();

    function collectQuestions(parentId: string) {
      for (const child of nodes.filter((n) => n.parent_id === parentId && !n.deleted_at)) {
        if (child.type === 'question') descendantQuestionIds.add(child.id);
        else collectQuestions(child.id);
      }
    }
    collectQuestions(node.id);

    const folderBlocks = blocks.filter(
      (b) => descendantQuestionIds.has(b.node_id) && !b.deleted_at
    );
    const template = templates.find((t) => t.language === currentLanguage);

    const code = assembleFullProgram(
      folderBlocks,
      variants,
      currentLanguage,
      { separator: 'banner', wrapInBoilerplate: false, deduplicateImports: true },
      template
    );

    const ok = await copyToClipboard(code);
    if (ok) {
      const lines = code.split('\n').length;
      showToast(`Copied all code in folder (${lines} lines)`, { icon: 'copy' });
      addRecentCopy({
        text: code,
        title: `${node.title} (All Questions)`,
        language: currentLanguage,
        lineCount: lines,
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 p-4 max-w-4xl mx-auto space-y-5">
      {/* Folder Header Banner */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e3b341]/15 border border-[#e3b341]/30 flex items-center justify-center text-[#e3b341]">
              <Folder size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {node.outline_number && (
                  <span className="font-mono text-xs font-bold text-[#58a6ff] bg-[#58a6ff]/10 px-2 py-0.5 rounded border border-[#58a6ff]/30">
                    {node.outline_number}
                  </span>
                )}
                <span className="text-xs text-[#8b949e]">Folder / Unit</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] mt-1">
                {node.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
              title="Share Folder"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {node.description_md && (
          <p className="text-sm text-[#8b949e] leading-relaxed">
            {node.description_md}
          </p>
        )}

        {/* Rolled-up Progress & Stats */}
        <div className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ProgressRing percent={node.progress_percent || 0} size={38} strokeWidth={4} />
            <div>
              <div className="text-xs font-bold text-[#f0f6fc]">
                {node.progress_percent || 0}% Completed
              </div>
              <div className="text-[11px] text-[#8b949e]">
                {node.done_questions || 0} of {node.total_questions || 0} questions done
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAllInFolder}
            className="touch-target px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow transition-all active:scale-95"
          >
            <Copy size={15} />
            <span>Copy All Folder Code</span>
          </button>
        </div>
      </div>

      {/* Sub-Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Contents ({childNodes.length})
          </h2>

          {role !== 'viewer' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setGenerateSeriesParentId(node.id)}
                className="touch-target px-2.5 py-1 text-xs text-[#58a6ff] hover:bg-[#21262d] rounded-lg border border-[#30363d] flex items-center gap-1 font-medium"
              >
                <Sparkles size={13} />
                <span>Generate Series</span>
              </button>
            </div>
          )}
        </div>

        {childNodes.length === 0 ? (
          <div className="p-8 text-center bg-[#161b22] border border-[#30363d] rounded-2xl text-[#8b949e]">
            <Folder size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">This folder is empty.</p>
            {role !== 'viewer' && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleAddChild('question')}
                  className="touch-target px-3 py-1.5 bg-[#58a6ff] text-black font-semibold rounded-lg text-xs"
                >
                  ＋ Add Question
                </button>
                <button
                  type="button"
                  onClick={() => handleAddChild('folder')}
                  className="touch-target px-3 py-1.5 bg-[#21262d] text-[#c9d1d9] font-medium rounded-lg text-xs border border-[#30363d]"
                >
                  ＋ Add Sub-folder
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {childNodes.map((child) => (
              <div
                key={child.id}
                onClick={() => setSelectedNodeId(child.id)}
                className="p-3.5 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="text-xl flex-shrink-0">
                    {child.type === 'folder' ? '📁' : '📄'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#f0f6fc] truncate">
                        {child.title}
                      </span>
                      {child.type === 'question' && (
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                            child.status === 'done'
                              ? 'bg-[#238636]/20 text-[#3fb950]'
                              : child.status === 'in_progress'
                              ? 'bg-[#d29922]/20 text-[#d29922]'
                              : 'bg-[#8b949e]/20 text-[#8b949e]'
                          }`}
                        >
                          {child.status}
                        </span>
                      )}
                    </div>
                    {child.description_md && (
                      <p className="text-xs text-[#8b949e] truncate mt-0.5">
                        {child.description_md}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight size={16} className="text-[#8b949e] group-hover:text-[#58a6ff] transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
