// LabVault Tree Drawer & Sidebar with Multi-Select and Infinite Hierarchy
import React, { useState } from 'react';
import {
  FolderPlus,
  FilePlus,
  Sparkles,
  Search,
  Users,
  Trash,
  Settings,
  ChevronDown,
  X,
  CheckSquare,
  Square,
  Trash2,
  Move,
  FolderSync,
  Layers,
} from 'lucide-react';
import { TreeRow } from './TreeRow';
import { useVaultStore } from '../../stores/useVaultStore';
import { buildComputedTree, flattenTree } from '../../utils/tree';
import { triggerHaptic } from '../../utils/clipboard';
import { VaultNode } from '../../types';

export const TreeDrawer: React.FC = () => {
  const {
    workspace,
    nodes,
    selectedNodeId,
    expandedFolderIds,
    isDrawerOpen,
    setDrawerOpen,
    setSelectedNodeId,
    toggleFolderExpanded,
    setSearchOpen,
    setMembersOpen,
    setTrashOpen,
    setGenerateSeriesParentId,
    createNode,
    softDeleteNode,
    updateNode,
    role,
    currentLanguage,
    showToast,
  } = useVaultStore();

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());

  // Compute hierarchy with outline numbering and progress rings
  const computedTree = buildComputedTree(nodes);
  const flattenedNodes = flattenTree(computedTree, expandedFolderIds);

  const toggleMultiSelectId = (id: string) => {
    setSelectedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    triggerHaptic(15);
    selectedNodeIds.forEach((id) => softDeleteNode(id));
    showToast(`Deleted ${selectedNodeIds.size} items`, { icon: 'trash' });
    setSelectedNodeIds(new Set());
    setIsMultiSelectMode(false);
  };

  const handleBulkStatusChange = (status: any) => {
    triggerHaptic(10);
    selectedNodeIds.forEach((id) => updateNode(id, { status }));
    showToast(`Updated status for ${selectedNodeIds.size} items`, { icon: 'check' });
    setSelectedNodeIds(new Set());
    setIsMultiSelectMode(false);
  };

  const handleAddRootFolder = () => {
    triggerHaptic(10);
    const newId = crypto.randomUUID();
    createNode({
      id: newId,
      workspace_id: workspace.id,
      parent_id: null,
      title: 'New Unit / Topic',
      type: 'folder',
      position_index: 'z9',
      description_md: '',
      default_language: currentLanguage,
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
    <>
      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-in fade-in"
        />
      )}

      {/* Drawer / Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-[#161b22] border-r border-[#30363d] flex flex-col transition-transform duration-200 ease-out select-none ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Workspace Header */}
        <div className="p-3.5 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1f6feb] to-[#238636] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              LV
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#f0f6fc] truncate flex items-center gap-1">
                <span>{workspace.name}</span>
              </h2>
              <span className="text-[11px] font-mono text-[#58a6ff] uppercase font-semibold">
                Role: {role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="lg:hidden touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Bar: Search & Quick Add */}
        <div className="p-2 border-b border-[#30363d] flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex-1 touch-target h-9 px-3 bg-[#0d1117] hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] rounded-xl border border-[#30363d] text-xs flex items-center gap-2 transition-colors"
          >
            <Search size={14} />
            <span>Search (⌘K)...</span>
          </button>

          {role !== 'viewer' && (
            <button
              type="button"
              onClick={() => setGenerateSeriesParentId(null)}
              className="touch-target h-9 px-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] rounded-xl border border-[#30363d] text-xs font-semibold flex items-center gap-1"
              title="Generate Series at Root"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">Series</span>
            </button>
          )}

          {role !== 'viewer' && (
            <button
              type="button"
              onClick={handleAddRootFolder}
              className="touch-target h-9 w-9 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded-xl border border-[#30363d] flex items-center justify-center"
              title="Add Root Folder"
            >
              <FolderPlus size={15} />
            </button>
          )}
        </div>

        {/* Multi-Select Action Banner (if active) */}
        {isMultiSelectMode && (
          <div className="p-2.5 bg-[#58a6ff]/10 border-b border-[#58a6ff]/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
            <span className="text-[#58a6ff] font-semibold">
              {selectedNodeIds.size} selected
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleBulkStatusChange('done')}
                className="px-2 py-1 bg-[#238636] text-white rounded text-[11px] font-medium"
              >
                Mark Done
              </button>
              {role === 'admin' && (
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-2 py-1 bg-[#da3633] text-white rounded text-[11px] font-medium"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => { setIsMultiSelectMode(false); setSelectedNodeIds(new Set()); }}
                className="p-1 text-[#8b949e] hover:text-[#f0f6fc]"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Tree List (Virtualized / Scrollable) */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {flattenedNodes.length === 0 ? (
            <div className="py-16 text-center text-[#8b949e] px-4">
              <FolderPlus size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs">No items in workspace yet.</p>
              {role !== 'viewer' && (
                <button
                  type="button"
                  onClick={handleAddRootFolder}
                  className="mt-3 touch-target px-3 py-1.5 bg-[#58a6ff] text-black font-semibold rounded-lg text-xs"
                >
                  Create First Folder
                </button>
              )}
            </div>
          ) : (
            flattenedNodes.map((node) => (
              <TreeRow
                key={node.id}
                node={node}
                isExpanded={expandedFolderIds.has(node.id)}
                isSelected={selectedNodeId === node.id}
                isMultiSelectMode={isMultiSelectMode}
                isMultiSelected={selectedNodeIds.has(node.id)}
                onToggleExpand={() => toggleFolderExpanded(node.id)}
                onSelect={() => {
                  setSelectedNodeId(node.id);
                  if (node.type === 'folder') toggleFolderExpanded(node.id);
                }}
                onToggleMultiSelect={() => toggleMultiSelectId(node.id)}
              />
            ))
          )}
        </div>

        {/* Drawer Footer Navigation */}
        <div className="p-3 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between text-xs text-[#8b949e] safe-area-bottom">
          <button
            type="button"
            onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
            className="touch-target p-1.5 hover:text-[#f0f6fc] rounded transition-colors flex items-center gap-1.5"
            title="Multi-select mode"
          >
            <CheckSquare size={16} />
            <span className="text-[11px]">Select</span>
          </button>

          <button
            type="button"
            onClick={() => setMembersOpen(true)}
            className="touch-target p-1.5 hover:text-[#f0f6fc] rounded transition-colors flex items-center gap-1.5"
            title="Workspace Members"
          >
            <Users size={16} />
            <span className="text-[11px]">Members</span>
          </button>

          <button
            type="button"
            onClick={() => setTrashOpen(true)}
            className="touch-target p-1.5 hover:text-[#f0f6fc] rounded transition-colors flex items-center gap-1.5"
            title="Trash Bin (30-day restore)"
          >
            <Trash size={16} />
            <span className="text-[11px]">Trash</span>
          </button>
        </div>
      </aside>
    </>
  );
};
