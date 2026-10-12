import React, { useState, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Copy,
  Check,
  Edit2,
  Trash2,
  Move,
  Plus,
  Pin,
  Sparkles,
  CopyCheck,
} from 'lucide-react';
import { VaultNode } from '../../types';
import { ProgressRing } from './ProgressRing';
import { useVaultStore } from '../../stores/useVaultStore';
import { assembleFullProgram, copyToClipboard, triggerHaptic } from '../../utils/clipboard';
import { getNewPositionIndex } from '../../utils/tree';

interface Props {
  node: VaultNode;
  isExpanded: boolean;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  isMultiSelected: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onToggleMultiSelect: () => void;
}

export const TreeRow: React.FC<Props> = ({
  node,
  isExpanded,
  isSelected,
  isMultiSelectMode,
  isMultiSelected,
  onToggleExpand,
  onSelect,
  onToggleMultiSelect,
}) => {
  const {
    role,
    currentLanguage,
    blocks,
    variants,
    templates,
    setSelectedNodeId,
    updateNode,
    softDeleteNode,
    createNode,
    setMoveNodeTargetId,
    setGenerateSeriesParentId,
    showToast,
    addRecentCopy,
    presenceUsers,
  } = useVaultStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(node.title);
  const [showMenu, setShowMenu] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isCopiedFromRow, setIsCopiedFromRow] = useState(false);

  // Touch swipe handling
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Collaborator presence count
  const usersInThisNode = presenceUsers.filter((u) => u.node_id === node.id);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    // Only swipe if horizontal motion is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      // Swipe right: up to 80px (Copy all code)
      // Swipe left: up to -80px (Delete / Edit)
      if (deltaX > 0 && node.type === 'question') {
        setSwipeOffset(Math.min(90, deltaX));
      } else if (deltaX < 0 && role !== 'viewer') {
        setSwipeOffset(Math.max(-90, deltaX));
      }
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 60 && node.type === 'question') {
      // Trigger instant copy all code from tree!
      handleQuickCopyFromTree();
    } else if (swipeOffset < -60 && role !== 'viewer') {
      setShowMenu(true);
    }
    setSwipeOffset(0);
  };

  // 1-Tap copy all code directly from the tree row!
  const handleQuickCopyFromTree = async () => {
    triggerHaptic(10);
    const questionBlocks = blocks.filter((b) => b.node_id === node.id && !b.deleted_at);
    const template = templates.find((t) => t.language === currentLanguage);

    const fullCode = assembleFullProgram(
      questionBlocks,
      variants,
      currentLanguage,
      { separator: 'banner', wrapInBoilerplate: false, deduplicateImports: true },
      template
    );

    const ok = await copyToClipboard(fullCode);
    if (ok) {
      setIsCopiedFromRow(true);
      const lines = fullCode.split('\n').length;
      showToast(`Copied "${node.title}" (${lines} lines)`, { icon: 'copy' });
      addRecentCopy({
        text: fullCode,
        title: node.title,
        language: currentLanguage,
        lineCount: lines,
      });

      setTimeout(() => setIsCopiedFromRow(false), 1200);
    }
  };

  const handleTitleSubmit = () => {
    if (titleInput.trim() && titleInput !== node.title) {
      updateNode(node.id, { title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddChild = (type: 'folder' | 'question') => {
    const newId = crypto.randomUUID();
    createNode({
      id: newId,
      workspace_id: node.workspace_id,
      parent_id: node.id,
      title: type === 'folder' ? 'New Folder' : 'New Question',
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
    if (!isExpanded) onToggleExpand();
    setShowMenu(false);
  };

  const indentPadding = Math.min((node.depth || 0) * 16 + 8, 120);

  return (
    <div className="relative overflow-hidden group select-none">
      {/* Background Swipe Actions Indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none text-xs font-semibold">
        <div
          className={`flex items-center gap-1.5 text-[#3fb950] transition-opacity ${
            swipeOffset > 30 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Copy size={16} />
          <span>Copy All Code</span>
        </div>
        <div
          className={`flex items-center gap-1.5 text-[#da3633] transition-opacity ${
            swipeOffset < -30 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>Actions</span>
          <Trash2 size={16} />
        </div>
      </div>

      {/* Main Row Surface */}
      <div
        style={{
          paddingLeft: `${indentPadding}px`,
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`touch-target min-h-[48px] w-full flex items-center justify-between pr-2 border-b border-[#30363d]/40 transition-colors ${
          isSelected
            ? 'bg-[#58a6ff]/15 text-[#58a6ff] border-l-4 border-l-[#58a6ff]'
            : 'hover:bg-[#21262d]/70 text-[#c9d1d9]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 py-1">
          {/* Multi-select Checkbox */}
          {isMultiSelectMode && (
            <input
              type="checkbox"
              checked={isMultiSelected}
              onChange={onToggleMultiSelect}
              className="w-4 h-4 accent-[#58a6ff] mr-1"
            />
          )}

          {/* Folder Chevron */}
          {node.type === 'folder' ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="touch-target p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded transition-transform"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          ) : (
            <div className="w-6 flex items-center justify-center text-sm flex-shrink-0">
              📄
            </div>
          )}

          {/* Folder Icon */}
          {node.type === 'folder' && (
            <div className="relative flex items-center justify-center text-sm flex-shrink-0 mr-1">
              {isExpanded ? '📂' : '📁'}
            </div>
          )}

          {/* Node Title (Notion style) */}
          <div className="min-w-0 flex-1 truncate" onClick={onSelect}>
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="bg-[#0d1117] text-[#f0f6fc] border border-[#58a6ff] rounded px-1.5 py-0.5 text-xs outline-none w-full"
              />
            ) : (
              <span
                className={`text-xs font-medium truncate block cursor-pointer ${
                  isSelected ? 'text-[#58a6ff] font-semibold' : 'text-[#f0f6fc]'
                }`}
                title={node.title}
              >
                {node.title}
              </span>
            )}
          </div>
        </div>

        {/* Right Row Indicators: Presence dot, Quick Copy, ⋯ Menu */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Presence count */}
          {usersInThisNode.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" title="Active users viewing" />
          )}

          {/* Quick Copy Icon on Questions (1-Tap from tree!) */}
          {node.type === 'question' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickCopyFromTree();
              }}
              className="touch-target p-1.5 text-[#8b949e] hover:text-[#3fb950] rounded transition-colors"
              title="Copy All Code"
            >
              {isCopiedFromRow ? <Check size={15} className="text-[#3fb950]" /> : <Copy size={15} />}
            </button>
          )}

          {/* Overflow Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded transition-colors"
              aria-label="Item menu"
            >
              <MoreVertical size={15} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl py-1 z-50 text-xs animate-in fade-in"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              >
                {node.type === 'folder' && role !== 'viewer' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAddChild('folder')}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#21262d] flex items-center gap-2"
                    >
                      <Plus size={14} />
                      <span>Add Sub-folder</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddChild('question')}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#21262d] flex items-center gap-2"
                    >
                      <Plus size={14} />
                      <span>Add Question</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenerateSeriesParentId(node.id)}
                      className="w-full px-3 py-2 text-left text-[#58a6ff] hover:bg-[#21262d] flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      <span>Generate Series...</span>
                    </button>
                    <div className="my-1 border-t border-[#30363d]" />
                  </>
                )}

                {role !== 'viewer' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(true)}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#21262d] flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      <span>Rename</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMoveNodeTargetId(node.id)}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#21262d] flex items-center gap-2"
                    >
                      <Move size={14} />
                      <span>Move to...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateNode(node.id, { is_pinned: !node.is_pinned })}
                      className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#21262d] flex items-center gap-2"
                    >
                      <Pin size={14} />
                      <span>{node.is_pinned ? 'Unpin' : 'Pin to Top'}</span>
                    </button>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <div className="my-1 border-t border-[#30363d]" />
                    <button
                      type="button"
                      onClick={() => softDeleteNode(node.id)}
                      className="w-full px-3 py-2 text-left text-[#da3633] hover:bg-[#da3633]/10 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
