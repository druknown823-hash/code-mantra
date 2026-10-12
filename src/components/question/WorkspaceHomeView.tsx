// Notion-style Workspace Root Home View (Matches CODE TANTRA Screenshot 1)
import React, { useState } from 'react';
import {
  Folder,
  ChevronRight,
  Download,
  Laptop,
  Smartphone,
  Search,
  Plus,
} from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { ImportExportModal } from '../workspace/ImportExportModal';

export const WorkspaceHomeView: React.FC = () => {
  const {
    workspace,
    nodes,
    setSelectedNodeId,
    appPerspective,
    setAppPerspective,
    setSearchOpen,
    role,
    createNode,
  } = useVaultStore();

  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  // Root level pages (DS, JAVA)
  const rootPages = nodes.filter((n) => n.parent_id === null && !n.deleted_at);

  const handleCreateRootPage = () => {
    const newId = crypto.randomUUID();
    createNode({
      id: newId,
      workspace_id: workspace.id,
      parent_id: null,
      title: 'New Subject',
      type: 'folder',
      position_index: `root_${Date.now()}`,
      description_md: '',
      default_language: 'cpp',
      status: 'todo',
      tags: [],
      is_pinned: false,
      deleted_at: null,
      created_by: workspace.created_by,
      updated_by: workspace.created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 p-6 max-w-3xl mx-auto space-y-8 bg-[#191919]">
      {/* Notion Page Header */}
      <div className="space-y-4 pt-4">
        <div className="text-4xl">📚</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffffff] tracking-tight">
          {workspace.name}
        </h1>
        <p className="text-sm text-[#8b949e]">
          Collaborative Notion repository for lab assignments. Upload from computer, 1-tap copy on phone.
        </p>

        {/* Quick Search Jump */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full touch-target px-4 py-3 bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] rounded-2xl flex items-center justify-between text-xs text-[#8b949e] transition-all"
        >
          <div className="flex items-center gap-2">
            <Search size={16} className="text-[#58a6ff]" />
            <span>Search question by number (e.g. 1.11.1, 1.2.1, struct Node)...</span>
          </div>
          <span className="font-mono bg-[#161616] px-2 py-0.5 rounded border border-[#333333]">
            ⌘K
          </span>
        </button>
      </div>

      {/* Notion Subpages List (DS, JAVA from Screenshot 1) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Course Subjects
          </span>
          {appPerspective === 'computer' && role !== 'viewer' && (
            <button
              type="button"
              onClick={handleCreateRootPage}
              className="text-xs text-[#58a6ff] hover:underline flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Add Subject</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {rootPages.map((page) => (
            <div
              key={page.id}
              onClick={() => setSelectedNodeId(page.id)}
              className="p-4 bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="text-base font-bold text-[#ffffff] group-hover:text-[#58a6ff] transition-colors">
                    {page.title}
                  </h3>
                  <span className="text-xs text-[#8b949e]">
                    Click to view sections (DsLab, Cources)
                  </span>
                </div>
              </div>

              <ChevronRight size={18} className="text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Quick Jump to 1.11.1 from Screenshot 4 */}
      <div className="p-5 bg-gradient-to-br from-[#202020] to-[#181818] border border-[#2e2e2e] rounded-3xl space-y-3">
        <span className="text-xs font-mono font-bold text-[#58a6ff] uppercase tracking-wider">
          Featured Solution
        </span>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-white">
              1.11.1 (Binary Tree Implementation)
            </h4>
            <p className="text-xs text-[#8b949e]">
              Includes struct Node, createNode, and insert functions in C++
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNodeId('page-1-11-1')}
            className="touch-target px-4 py-2 bg-[#58a6ff] hover:bg-[#79c0ff] text-black font-bold rounded-xl text-xs transition-all active:scale-95"
          >
            Open 1.11.1
          </button>
        </div>
      </div>

      {/* Perspective Mode Explanation */}
      <div className="p-4 bg-[#202020] rounded-2xl border border-[#2e2e2e] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-white">Active Perspective: </span>
          <span className="text-[#58a6ff] font-bold uppercase">{appPerspective} mode</span>
          <p className="text-[11px] text-[#8b949e] mt-0.5">
            {appPerspective === 'mobile'
              ? 'Mobile Copy Mode: Ultra-clean, keyboard popup prevented, 1-tap copy everywhere.'
              : 'Computer Mode: Add/edit code blocks, paste solutions, delete pages.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAppPerspective(appPerspective === 'mobile' ? 'computer' : 'mobile')}
            className="touch-target px-3 py-1.5 bg-[#2b2b2b] hover:bg-[#383838] text-white rounded-xl border border-[#383838] font-semibold"
          >
            Switch to {appPerspective === 'mobile' ? 'Computer (Edit)' : 'Mobile (Copy)'}
          </button>

          <button
            type="button"
            onClick={() => setIsImportExportOpen(true)}
            className="touch-target p-2 text-[#8b949e] hover:text-white rounded-xl"
            title="Import or Export ZIP"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </div>
  );
};
