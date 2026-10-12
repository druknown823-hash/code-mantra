// Notion-style Clean Solution Page (Zero Clutter, Pure Solutions)
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Copy,
  Plus,
  Check,
  ClipboardPaste,
  Sliders,
  Share2,
  Trash2,
  Sparkles,
  FileCode,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { VaultNode, QuestionBlock } from '../../types';
import { BlockCard } from './BlockCard';
import { useVaultStore } from '../../stores/useVaultStore';
import { assembleFullProgram, copyToClipboard, triggerHaptic, readClipboardText } from '../../utils/clipboard';
import { getNewPositionIndex, sortByPosition } from '../../utils/tree';

interface Props {
  node: VaultNode;
}

const SortableBlockWrapper: React.FC<{
  block: QuestionBlock;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({ block, index, total, onMoveUp, onMoveDown }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-manipulation">
      <BlockCard
        block={block}
        index={index}
        totalBlocks={total}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

export const QuestionPage: React.FC<Props> = ({ node }) => {
  const {
    currentLanguage,
    setCurrentLanguage,
    blocks,
    variants,
    templates,
    role,
    copyOptions,
    appPerspective,
    setAppPerspective,
    setCopyOptionsOpen,
    createBlock,
    updateBlock,
    updateNode,
    softDeleteNode,
    showToast,
    addRecentCopy,
    setSmartPasteData,
    setShareModalOpen,
  } = useVaultStore();

  const [isCopiedAll, setIsCopiedAll] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(node.title);

  // Filter blocks for this solution page
  const activeBlocks = sortByPosition(
    blocks.filter((b) => b.node_id === node.id && !b.deleted_at)
  );

  const sensors = useSensors(
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    triggerHaptic(15);
    const oldIndex = activeBlocks.findIndex((b) => b.id === active.id);
    const newIndex = activeBlocks.findIndex((b) => b.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(activeBlocks, oldIndex, newIndex);
      const prevPos = newIndex > 0 ? reordered[newIndex - 1].position_index : null;
      const nextPos = newIndex < reordered.length - 1 ? reordered[newIndex + 1].position_index : null;
      const calculatedPos = getNewPositionIndex(prevPos, nextPos);

      updateBlock(active.id as string, { position_index: calculatedPos });
    }
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    triggerHaptic(5);
    const prevBlock = activeBlocks[idx - 1];
    const prevPrevBlock = idx > 1 ? activeBlocks[idx - 2] : null;
    const newPos = getNewPositionIndex(
      prevPrevBlock ? prevPrevBlock.position_index : null,
      prevBlock.position_index
    );
    updateBlock(activeBlocks[idx].id, { position_index: newPos });
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= activeBlocks.length - 1) return;
    triggerHaptic(5);
    const nextBlock = activeBlocks[idx + 1];
    const nextNextBlock = idx + 2 < activeBlocks.length ? activeBlocks[idx + 2] : null;
    const newPos = getNewPositionIndex(
      nextBlock.position_index,
      nextNextBlock ? nextNextBlock.position_index : null
    );
    updateBlock(activeBlocks[idx].id, { position_index: newPos });
  };

  // 1-Tap Copy All Code
  const handleCopyAll = async () => {
    triggerHaptic(10);
    const currentTemplate = templates.find((t) => t.language === currentLanguage);
    const fullCode = assembleFullProgram(
      activeBlocks,
      variants,
      currentLanguage,
      copyOptions,
      currentTemplate
    );

    const success = await copyToClipboard(fullCode);
    if (success) {
      setIsCopiedAll(true);
      const lineCount = fullCode.split('\n').length;
      showToast(`Copied all solution code (${lineCount} lines)`, { icon: 'copy' });
      addRecentCopy({
        text: fullCode,
        title: `${node.title} (${currentLanguage.toUpperCase()})`,
        language: currentLanguage,
        lineCount,
      });

      setTimeout(() => {
        setIsCopiedAll(false);
      }, 1200);
    }
  };

  const handleAddBlock = () => {
    triggerHaptic(10);
    const lastPos = activeBlocks.length > 0 ? activeBlocks[activeBlocks.length - 1].position_index : null;
    const nextPos = getNewPositionIndex(lastPos, null);
    const newId = crypto.randomUUID();

    createBlock(
      {
        id: newId,
        node_id: node.id,
        block_title: `fn_${activeBlocks.length + 1}() {`,
        position_index: nextPos,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      currentLanguage === 'cpp' ? `    // C++ solution\n}` : '',
      currentLanguage === 'java' ? `    // Java solution\n}` : ''
    );
  };

  const handleQuickPaste = async () => {
    triggerHaptic(10);
    const text = await readClipboardText();
    setSmartPasteData({
      text: text || '',
    });
  };

  const handleTitleSubmit = () => {
    if (titleInput.trim() && titleInput !== node.title) {
      updateNode(node.id, { title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const isComputerMode = appPerspective === 'computer' && role !== 'viewer';

  return (
    <div className="flex-1 overflow-y-auto pb-32 bg-[#191919]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Notion-style Clean Page Header */}
        <div className="flex items-center justify-between border-b border-[#2c2c2c] pb-4">
          <div className="min-w-0 flex-1">
            {isEditingTitle && isComputerMode ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="text-3xl sm:text-4xl font-bold text-[#ffffff] bg-transparent border-b border-[#58a6ff] outline-none w-full"
              />
            ) : (
              <h1
                onClick={() => isComputerMode && setIsEditingTitle(true)}
                className={`text-3xl sm:text-4xl font-extrabold text-[#ffffff] tracking-tight truncate ${
                  isComputerMode ? 'cursor-pointer hover:opacity-80' : ''
                }`}
                title={node.title}
              >
                {node.title}
              </h1>
            )}
            <p className="text-xs text-[#8b949e] mt-1">
              {activeBlocks.length} solution snippet{activeBlocks.length === 1 ? '' : 's'} • Ready to copy
            </p>
          </div>

          {/* Perspective Mode Switcher & Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mode Switcher pill (Desktop Creator vs Mobile Fast Copy) */}
            <div className="flex items-center bg-[#252525] p-1 rounded-xl border border-[#383838]">
              <button
                type="button"
                onClick={() => setAppPerspective('mobile')}
                className={`touch-target h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  appPerspective === 'mobile'
                    ? 'bg-[#58a6ff] text-black shadow'
                    : 'text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
                title="Mobile Mode (Pure 1-Tap Copy)"
              >
                <Smartphone size={13} />
                <span className="hidden sm:inline">Mobile (Copy)</span>
              </button>
              <button
                type="button"
                onClick={() => setAppPerspective('computer')}
                className={`touch-target h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  appPerspective === 'computer'
                    ? 'bg-[#58a6ff] text-black shadow'
                    : 'text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
                title="Computer Mode (Upload & Edit)"
              >
                <Laptop size={13} />
                <span className="hidden sm:inline">Computer (Edit)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
              title="Share Link"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Computer Mode: Upload & Creation Controls */}
        {isComputerMode && (
          <div className="p-3 bg-[#202020] border border-[#2e2e2e] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#8b949e] font-medium">Computer Mode Active:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickPaste}
                className="touch-target px-3 py-1.5 bg-[#2b2b2b] hover:bg-[#383838] text-[#f0f6fc] rounded-xl border border-[#383838] flex items-center gap-1.5 font-semibold"
              >
                <ClipboardPaste size={14} />
                <span>Paste & Split Functions</span>
              </button>
              <button
                type="button"
                onClick={handleAddBlock}
                className="touch-target px-3 py-1.5 bg-[#58a6ff] hover:bg-[#79c0ff] text-black rounded-xl flex items-center gap-1.5 font-semibold"
              >
                <Plus size={14} />
                <span>Add Snippet Block</span>
              </button>
            </div>
          </div>
        )}

        {/* Vertical Stack of Notion Solution Code Blocks */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {activeBlocks.map((block, idx) => (
                <SortableBlockWrapper
                  key={block.id}
                  block={block}
                  index={idx}
                  total={activeBlocks.length}
                  onMoveUp={() => handleMoveUp(idx)}
                  onMoveDown={() => handleMoveDown(idx)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty state if no blocks */}
        {activeBlocks.length === 0 && (
          <div className="text-center py-16 text-[#8b949e] bg-[#202020] rounded-2xl border border-[#2c2c2c] p-6">
            <FileCode size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No solution code added to this page yet.</p>
            <button
              type="button"
              onClick={handleAddBlock}
              className="mt-4 touch-target px-4 py-2 bg-[#58a6ff] text-black font-semibold rounded-xl text-xs"
            >
              + Add First Code Snippet
            </button>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM THUMB ZONE (Mobile 1-Tap Copy Fortress) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161616]/95 backdrop-blur-md border-t border-[#2c2c2c] p-3 shadow-2xl safe-area-bottom">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          {/* Hero Action: 1-Tap [Copy All] with options chevron */}
          <div className="flex items-center flex-1 max-w-sm">
            <button
              type="button"
              onClick={handleCopyAll}
              className={`flex-1 touch-target h-12 px-4 rounded-l-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                isCopiedAll
                  ? 'bg-[#238636] text-white shadow-[#238636]/30'
                  : 'bg-[#238636] hover:bg-[#2ea043] text-white'
              }`}
              aria-label="Copy All Code"
            >
              {isCopiedAll ? <Check size={18} /> : <Copy size={18} />}
              <span>{isCopiedAll ? 'All Snippets Copied ✓' : 'Copy All Code'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCopyOptionsOpen(true)}
              className="touch-target h-12 px-3 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-r-xl border-l border-white/20 active:scale-95 transition-all"
              title="Copy Options"
              aria-label="Copy Options"
            >
              <Sliders size={18} />
            </button>
          </div>

          {/* Quick Paste or Add Block if in Computer Mode */}
          {isComputerMode && (
            <button
              type="button"
              onClick={handleAddBlock}
              className="touch-target h-12 px-3 bg-[#252525] hover:bg-[#303030] text-[#f0f6fc] border border-[#383838] rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Block</span>
            </button>
          )}

          {/* Global Language Toggle (C++ | Java) */}
          <div className="flex items-center bg-[#252525] p-1 rounded-xl border border-[#383838] select-none">
            <button
              type="button"
              onClick={() => setCurrentLanguage('cpp')}
              className={`touch-target h-10 px-3.5 rounded-lg text-xs font-mono font-bold transition-all ${
                currentLanguage === 'cpp'
                  ? 'bg-[#58a6ff] text-black shadow-md'
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              C++
            </button>
            <button
              type="button"
              onClick={() => setCurrentLanguage('java')}
              className={`touch-target h-10 px-3.5 rounded-lg text-xs font-mono font-bold transition-all ${
                currentLanguage === 'java'
                  ? 'bg-[#58a6ff] text-black shadow-md'
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              Java
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
