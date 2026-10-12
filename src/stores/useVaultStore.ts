// LabVault Zustand Global State Store
import { create } from 'zustand';
import { 
  Workspace, 
  VaultNode, 
  QuestionBlock, 
  BlockVariant, 
  BlockVersion, 
  BlockComment, 
  CopyTemplate, 
  ActivityLogItem, 
  UserProfile, 
  MemberRole, 
  CodeLanguage, 
  CopyOptions, 
  RecentCopyItem, 
  UserPresence 
} from '../types';
import { storage } from '../services/storage';
import { buildComputedTree } from '../utils/tree';
import { triggerHaptic } from '../utils/clipboard';

interface ToastState {
  id: string;
  message: string;
  undoAction?: () => void;
  icon?: 'check' | 'copy' | 'info' | 'trash';
}

interface VaultState {
  // Core data
  workspace: Workspace;
  nodes: VaultNode[];
  blocks: QuestionBlock[];
  variants: Record<string, Record<string, BlockVariant>>;
  versions: BlockVersion[];
  comments: BlockComment[];
  templates: CopyTemplate[];
  activity: ActivityLogItem[];
  profile: UserProfile;
  role: MemberRole;

  // Navigation & selection
  selectedNodeId: string | null;
  expandedFolderIds: Set<string>;
  currentLanguage: CodeLanguage;
  isDrawerOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;

  // Active Modals & Sheets
  editingBlock: { blockId: string; language: CodeLanguage } | null;
  historyModalBlock: { blockId: string; language: CodeLanguage } | null;
  commentModalBlockId: string | null;
  moveNodeTargetId: string | null;
  generateSeriesParentId: string | null;
  smartPasteData: { text: string; targetBlockId?: string } | null;
  isTrashOpen: boolean;
  isMembersOpen: boolean;
  isShareModalOpen: boolean;
  isCopyOptionsOpen: boolean;
  isRecentCopiedOpen: boolean;

  // Clipboard & UI Settings
  copyOptions: CopyOptions;
  recentCopies: RecentCopyItem[];
  theme: 'one-dark' | 'dracula' | 'github-dark' | 'amoled' | 'light';
  appPerspective: 'computer' | 'mobile';
  fontSize: number;
  fontLigatures: boolean;
  lineWrapping: boolean;
  isOnline: boolean;
  toasts: ToastState[];

  // Presence & Collab
  presenceUsers: UserPresence[];

  // Actions
  refreshFromStorage: () => void;
  setAppPerspective: (mode: 'computer' | 'mobile') => void;
  setSelectedNodeId: (id: string | null) => void;
  toggleFolderExpanded: (folderId: string) => void;
  setDrawerOpen: (open: boolean) => void;
  setCurrentLanguage: (lang: CodeLanguage) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setRole: (role: MemberRole) => void;
  setTheme: (theme: 'one-dark' | 'dracula' | 'github-dark' | 'amoled' | 'light') => void;
  setFontSize: (size: number) => void;
  toggleLigatures: () => void;
  toggleLineWrapping: () => void;
  setCopyOptions: (options: Partial<CopyOptions>) => void;
  addRecentCopy: (item: Omit<RecentCopyItem, 'id' | 'timestamp'>) => void;
  showToast: (message: string, options?: { undoAction?: () => void; icon?: 'check' | 'copy' | 'info' | 'trash' }) => void;
  removeToast: (id: string) => void;

  // Modal setters
  setEditingBlock: (item: { blockId: string; language: CodeLanguage } | null) => void;
  setHistoryModalBlock: (item: { blockId: string; language: CodeLanguage } | null) => void;
  setCommentModalBlockId: (blockId: string | null) => void;
  setMoveNodeTargetId: (nodeId: string | null) => void;
  setGenerateSeriesParentId: (parentId: string | null) => void;
  setSmartPasteData: (data: { text: string; targetBlockId?: string } | null) => void;
  setTrashOpen: (open: boolean) => void;
  setMembersOpen: (open: boolean) => void;
  setShareModalOpen: (open: boolean) => void;
  setCopyOptionsOpen: (open: boolean) => void;
  setRecentCopiedOpen: (open: boolean) => void;
  setPresenceUsers: (users: UserPresence[]) => void;

  // Mutators
  createNode: (node: VaultNode) => void;
  updateNode: (nodeId: string, updates: Partial<VaultNode>) => void;
  softDeleteNode: (nodeId: string) => void;
  restoreNode: (nodeId: string) => void;
  permanentDeleteNode: (nodeId: string) => void;
  createBlock: (block: QuestionBlock, javaCode?: string, cppCode?: string) => void;
  updateBlock: (blockId: string, updates: Partial<QuestionBlock>) => void;
  softDeleteBlock: (blockId: string) => void;
  restoreBlock: (blockId: string) => void;
  updateBlockVariant: (blockId: string, language: CodeLanguage, code: string, saveSnapshot?: boolean) => void;
  addComment: (blockId: string, body: string, lineRef?: number | null) => void;
  toggleResolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  updateCopyTemplate: (template: CopyTemplate) => void;
}

const DEFAULT_COPY_OPTIONS: CopyOptions = {
  separator: 'banner',
  wrapInBoilerplate: false,
  deduplicateImports: true,
};

export const useVaultStore = create<VaultState>((set, get) => ({
  workspace: storage.getWorkspace(),
  nodes: storage.getNodes(),
  blocks: storage.getBlocks(),
  variants: storage.getVariants(),
  versions: storage.getVersions(),
  comments: storage.getComments(),
  templates: storage.getTemplates(),
  activity: storage.getActivity(),
  profile: storage.getProfile(),
  role: storage.getRole(),

  // Initial selection: 1.11.1 (from Notion screenshot 4)
  selectedNodeId: 'page-1-11-1',
  expandedFolderIds: new Set([
    'ds-root-page',
    'ds-pract-folder',
  ]),
  currentLanguage: 'cpp',
  isDrawerOpen: false,
  isSearchOpen: false,
  searchQuery: '',

  editingBlock: null,
  historyModalBlock: null,
  commentModalBlockId: null,
  moveNodeTargetId: null,
  generateSeriesParentId: null,
  smartPasteData: null,
  isTrashOpen: false,
  isMembersOpen: false,
  isShareModalOpen: false,
  isCopyOptionsOpen: false,
  isRecentCopiedOpen: false,

  copyOptions: (() => {
    try {
      const saved = localStorage.getItem('lv_copy_options');
      return saved ? JSON.parse(saved) : DEFAULT_COPY_OPTIONS;
    } catch {
      return DEFAULT_COPY_OPTIONS;
    }
  })(),
  recentCopies: (() => {
    try {
      const saved = localStorage.getItem('lv_recent_copies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),
  theme: 'one-dark',
  appPerspective: 'mobile',
  fontSize: 14,
  fontLigatures: true,
  lineWrapping: false,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  toasts: [],
  presenceUsers: [],

  refreshFromStorage: () => {
    set({
      workspace: storage.getWorkspace(),
      nodes: storage.getNodes(),
      blocks: storage.getBlocks(),
      variants: storage.getVariants(),
      versions: storage.getVersions(),
      comments: storage.getComments(),
      templates: storage.getTemplates(),
      activity: storage.getActivity(),
      profile: storage.getProfile(),
      role: storage.getRole(),
    });
  },

  setAppPerspective: (mode) => set({ appPerspective: mode }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id, isDrawerOpen: false }),

  toggleFolderExpanded: (folderId) => {
    set((state) => {
      const next = new Set(state.expandedFolderIds);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return { expandedFolderIds: next };
    });
  },

  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setCurrentLanguage: (lang) => {
    triggerHaptic(5);
    set({ currentLanguage: lang });
  },
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setRole: (role) => {
    storage.setRole(role);
    set({ role });
  },
  setTheme: (theme) => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-amoled', 'theme-dracula', 'theme-github-dark');
    if (theme === 'light') root.classList.add('theme-light');
    if (theme === 'amoled') root.classList.add('theme-amoled');
    set({ theme });
  },
  setFontSize: (size) => set({ fontSize: Math.max(11, Math.min(22, size)) }),
  toggleLigatures: () => set((s) => ({ fontLigatures: !s.fontLigatures })),
  toggleLineWrapping: () => set((s) => ({ lineWrapping: !s.lineWrapping })),

  setCopyOptions: (options) => {
    set((state) => {
      const updated = { ...state.copyOptions, ...options };
      localStorage.setItem('lv_copy_options', JSON.stringify(updated));
      return { copyOptions: updated };
    });
  },

  addRecentCopy: (item) => {
    set((state) => {
      const newItem: RecentCopyItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      const updated = [newItem, ...state.recentCopies.slice(0, 9)];
      localStorage.setItem('lv_recent_copies', JSON.stringify(updated));
      return { recentCopies: updated };
    });
  },

  showToast: (message, options) => {
    const id = crypto.randomUUID();
    const newToast: ToastState = {
      id,
      message,
      undoAction: options?.undoAction,
      icon: options?.icon || 'check',
    };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, 2400);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // Modal setters
  setEditingBlock: (item) => set({ editingBlock: item }),
  setHistoryModalBlock: (item) => set({ historyModalBlock: item }),
  setCommentModalBlockId: (blockId) => set({ commentModalBlockId: blockId }),
  setMoveNodeTargetId: (nodeId) => set({ moveNodeTargetId: nodeId }),
  setGenerateSeriesParentId: (parentId) => set({ generateSeriesParentId: parentId }),
  setSmartPasteData: (data) => set({ smartPasteData: data }),
  setTrashOpen: (open) => set({ isTrashOpen: open }),
  setMembersOpen: (open) => set({ isMembersOpen: open }),
  setShareModalOpen: (open) => set({ isShareModalOpen: open }),
  setCopyOptionsOpen: (open) => set({ isCopyOptionsOpen: open }),
  setRecentCopiedOpen: (open) => set({ isRecentCopiedOpen: open }),
  setPresenceUsers: (users) => set({ presenceUsers: users }),

  // Mutators
  createNode: (node) => {
    storage.addNode(node);
    get().refreshFromStorage();
    get().showToast(`Created ${node.title}`, { icon: 'info' });
  },

  updateNode: (nodeId, updates) => {
    storage.updateNode(nodeId, updates);
    get().refreshFromStorage();
  },

  softDeleteNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;
    storage.softDeleteNode(nodeId);
    get().refreshFromStorage();

    get().showToast(`Deleted "${node.title}"`, {
      icon: 'trash',
      undoAction: () => {
        storage.restoreNode(nodeId);
        get().refreshFromStorage();
        get().showToast(`Restored "${node.title}"`, { icon: 'check' });
      },
    });
  },

  restoreNode: (nodeId) => {
    storage.restoreNode(nodeId);
    get().refreshFromStorage();
    get().showToast('Item restored', { icon: 'check' });
  },

  permanentDeleteNode: (nodeId) => {
    storage.permanentDeleteNode(nodeId);
    get().refreshFromStorage();
    get().showToast('Permanently deleted', { icon: 'trash' });
  },

  createBlock: (block, javaCode, cppCode) => {
    storage.addBlock(block, javaCode, cppCode);
    get().refreshFromStorage();
    get().showToast(`Added block ${block.block_title}`, { icon: 'check' });
  },

  updateBlock: (blockId, updates) => {
    storage.updateBlock(blockId, updates);
    get().refreshFromStorage();
  },

  softDeleteBlock: (blockId) => {
    const block = get().blocks.find((b) => b.id === blockId);
    storage.softDeleteBlock(blockId);
    get().refreshFromStorage();
    get().showToast(`Removed block "${block?.block_title || ''}"`, {
      icon: 'trash',
      undoAction: () => {
        storage.restoreBlock(blockId);
        get().refreshFromStorage();
      },
    });
  },

  restoreBlock: (blockId) => {
    storage.restoreBlock(blockId);
    get().refreshFromStorage();
  },

  updateBlockVariant: (blockId, language, code, saveSnapshot = false) => {
    storage.updateVariant(blockId, language, code, saveSnapshot);
    get().refreshFromStorage();
  },

  addComment: (blockId, body, lineRef) => {
    const newComment: BlockComment = {
      id: crypto.randomUUID(),
      block_id: blockId,
      user_id: get().profile.id,
      body,
      line_ref: lineRef || null,
      resolved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: get().profile,
    };
    storage.addComment(newComment);
    get().refreshFromStorage();
    get().showToast('Comment posted', { icon: 'info' });
  },

  toggleResolveComment: (commentId) => {
    storage.toggleResolveComment(commentId);
    get().refreshFromStorage();
  },

  deleteComment: (commentId) => {
    storage.deleteComment(commentId);
    get().refreshFromStorage();
  },

  updateCopyTemplate: (template) => {
    storage.updateTemplate(template);
    get().refreshFromStorage();
    get().showToast('Copy template saved', { icon: 'check' });
  },
}));
