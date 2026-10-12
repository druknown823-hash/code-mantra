import { generateKeyBetween } from 'fractional-indexing';
import { VaultNode, QuestionBlock } from '../types';

/**
 * Generate a new fractional index between two siblings
 */
export function getNewPositionIndex(prevIndex: string | null, nextIndex: string | null): string {
  try {
    return generateKeyBetween(prevIndex, nextIndex);
  } catch (err) {
    console.warn('Fractional indexing calculation fallback', err);
    if (!prevIndex && !nextIndex) return 'a0';
    if (!prevIndex) return 'a0';
    return prevIndex + '0';
  }
}

/**
 * Sort items deterministically by fractional position_index
 */
export function sortByPosition<T extends { position_index: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.position_index.localeCompare(b.position_index));
}

/**
 * Compute dynamic outline numbers (1, 1.1, 1.1.2) and rolled-up question progress
 * for the entire workspace tree.
 */
export function buildComputedTree(nodes: VaultNode[]): VaultNode[] {
  // Filter out soft-deleted nodes
  const activeNodes = nodes.filter(n => !n.deleted_at);

  // Group by parent_id
  const childrenMap = new Map<string | null, VaultNode[]>();
  for (const node of activeNodes) {
    const parent = node.parent_id || null;
    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, []);
    }
    childrenMap.get(parent)!.push({ ...node });
  }

  // Sort siblings by position_index
  for (const [parentId, list] of childrenMap.entries()) {
    childrenMap.set(parentId, sortByPosition(list));
  }

  // Recursive compute outline and stats
  function computeSubtree(parentId: string | null, prefix = '', depth = 0): VaultNode[] {
    const siblings = childrenMap.get(parentId) || [];
    
    return siblings.map((node, index) => {
      const outline = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      const children = computeSubtree(node.id, outline, depth + 1);

      let totalQuestions = node.type === 'question' ? 1 : 0;
      let doneQuestions = (node.type === 'question' && node.status === 'done') ? 1 : 0;

      for (const child of children) {
        totalQuestions += child.total_questions || 0;
        doneQuestions += child.done_questions || 0;
      }

      const progressPercent = totalQuestions > 0 ? Math.round((doneQuestions / totalQuestions) * 100) : 0;

      return {
        ...node,
        outline_number: outline,
        depth,
        children,
        total_questions: totalQuestions,
        done_questions: doneQuestions,
        progress_percent: progressPercent,
      };
    });
  }

  return computeSubtree(null);
}

/**
 * Flatten tree for easy virtualization / rendering while preserving depth and hierarchy
 */
export function flattenTree(computedNodes: VaultNode[], expandedIds: Set<string>): VaultNode[] {
  const result: VaultNode[] = [];

  function traverse(nodes: VaultNode[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.type === 'folder' && expandedIds.has(node.id) && node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(computedNodes);
  return result;
}

/**
 * Compute breadcrumbs from current node back to root
 */
export function getBreadcrumbPath(nodeId: string | null, allNodes: VaultNode[]): VaultNode[] {
  if (!nodeId) return [];

  const nodeMap = new Map<string, VaultNode>();
  for (const n of allNodes) {
    nodeMap.set(n.id, n);
  }

  const path: VaultNode[] = [];
  let curr = nodeMap.get(nodeId);

  while (curr) {
    path.unshift(curr);
    if (!curr.parent_id) break;
    curr = nodeMap.get(curr.parent_id);
  }

  return path;
}

/**
 * Validate that moving `nodeId` into `newParentId` does not cause cycles
 */
export function canReparentNode(nodeId: string, newParentId: string | null, allNodes: VaultNode[]): boolean {
  if (!newParentId) return true; // Moving to root is always valid
  if (nodeId === newParentId) return false;

  const nodeMap = new Map<string, VaultNode>();
  for (const n of allNodes) nodeMap.set(n.id, n);

  let curr = nodeMap.get(newParentId);
  while (curr) {
    if (curr.id === nodeId) return false; // Cycle detected
    if (!curr.parent_id) break;
    curr = nodeMap.get(curr.parent_id);
  }

  return true;
}

/**
 * Generate a series of nodes (e.g. "Experiment 1..10" or "Question 1..15")
 */
export function generateNodeSeries(
  titlePrefix: string,
  startNum: number,
  count: number,
  type: 'folder' | 'question',
  workspaceId: string,
  parentId: string | null,
  userId: string,
  lastIndex: string | null
): { nodes: Partial<VaultNode>[]; lastPos: string } {
  const result: Partial<VaultNode>[] = [];
  let currentPos = lastIndex;

  for (let i = 0; i < count; i++) {
    const num = startNum + i;
    const nextPos = getNewPositionIndex(currentPos, null);
    result.push({
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      parent_id: parentId,
      title: `${titlePrefix} ${num}`,
      type,
      position_index: nextPos,
      description_md: type === 'folder' ? `Folder for ${titlePrefix} ${num}` : `Problem specification for ${titlePrefix} ${num}`,
      default_language: 'java',
      status: 'todo',
      tags: [],
      is_pinned: false,
      deleted_at: null,
      created_by: userId,
      updated_by: userId,
    });
    currentPos = nextPos;
  }

  return { nodes: result, lastPos: currentPos || 'a0' };
}
