// LabVault Storage & Data Persistence Engine
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
  CodeLanguage
} from '../types';
import { 
  INITIAL_WORKSPACE, 
  INITIAL_NODES, 
  INITIAL_BLOCKS, 
  INITIAL_VARIANTS, 
  INITIAL_TEMPLATES, 
  INITIAL_COMMENTS, 
  INITIAL_ACTIVITY, 
  DEMO_USER 
} from './seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  WORKSPACE: 'lv_v4_workspace',
  NODES: 'lv_v4_nodes',
  BLOCKS: 'lv_v4_blocks',
  VARIANTS: 'lv_v4_variants',
  VERSIONS: 'lv_v4_versions',
  COMMENTS: 'lv_v4_comments',
  TEMPLATES: 'lv_v4_templates',
  ACTIVITY: 'lv_v4_activity',
  PROFILE: 'lv_v4_profile',
  OFFLINE_QUEUE: 'lv_v4_offline_queue',
  ROLE: 'lv_v4_user_role',
};

class StorageEngine {
  private inMemoryCache: {
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
  };

  constructor() {
    this.inMemoryCache = this.loadLocalSnapshot();
  }

  private loadLocalSnapshot() {
    try {
      const wsStr = localStorage.getItem(STORAGE_KEYS.WORKSPACE);
      const nodesStr = localStorage.getItem(STORAGE_KEYS.NODES);
      const blocksStr = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      const variantsStr = localStorage.getItem(STORAGE_KEYS.VARIANTS);
      const versionsStr = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      const commentsStr = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const templatesStr = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      const activityStr = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      const profileStr = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const roleStr = localStorage.getItem(STORAGE_KEYS.ROLE);

      return {
        workspace: wsStr ? JSON.parse(wsStr) : INITIAL_WORKSPACE,
        nodes: nodesStr ? JSON.parse(nodesStr) : INITIAL_NODES,
        blocks: blocksStr ? JSON.parse(blocksStr) : INITIAL_BLOCKS,
        variants: variantsStr ? JSON.parse(variantsStr) : INITIAL_VARIANTS,
        versions: versionsStr ? JSON.parse(versionsStr) : [],
        comments: commentsStr ? JSON.parse(commentsStr) : INITIAL_COMMENTS,
        templates: templatesStr ? JSON.parse(templatesStr) : INITIAL_TEMPLATES,
        activity: activityStr ? JSON.parse(activityStr) : INITIAL_ACTIVITY,
        profile: profileStr ? JSON.parse(profileStr) : DEMO_USER,
        role: (roleStr as MemberRole) || 'admin',
      };
    } catch (e) {
      console.warn('Error reading from localStorage, initializing with defaults', e);
      return {
        workspace: INITIAL_WORKSPACE,
        nodes: INITIAL_NODES,
        blocks: INITIAL_BLOCKS,
        variants: INITIAL_VARIANTS,
        versions: [],
        comments: INITIAL_COMMENTS,
        templates: INITIAL_TEMPLATES,
        activity: INITIAL_ACTIVITY,
        profile: DEMO_USER,
        role: 'admin' as MemberRole,
      };
    }
  }

  public saveSnapshot() {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSPACE, JSON.stringify(this.inMemoryCache.workspace));
      localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(this.inMemoryCache.nodes));
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(this.inMemoryCache.blocks));
      localStorage.setItem(STORAGE_KEYS.VARIANTS, JSON.stringify(this.inMemoryCache.variants));
      localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(this.inMemoryCache.versions));
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(this.inMemoryCache.comments));
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(this.inMemoryCache.templates));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(this.inMemoryCache.activity));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.inMemoryCache.profile));
      localStorage.setItem(STORAGE_KEYS.ROLE, this.inMemoryCache.role);
    } catch (e) {
      console.error('Failed to save snapshot to localStorage', e);
    }
  }

  // Getters
  public getWorkspace(): Workspace { return this.inMemoryCache.workspace; }
  public getNodes(): VaultNode[] { return this.inMemoryCache.nodes; }
  public getBlocks(): QuestionBlock[] { return this.inMemoryCache.blocks; }
  public getVariants(): Record<string, Record<string, BlockVariant>> { return this.inMemoryCache.variants; }
  public getVersions(): BlockVersion[] { return this.inMemoryCache.versions; }
  public getComments(): BlockComment[] { return this.inMemoryCache.comments; }
  public getTemplates(): CopyTemplate[] { return this.inMemoryCache.templates; }
  public getActivity(): ActivityLogItem[] { return this.inMemoryCache.activity; }
  public getProfile(): UserProfile { return this.inMemoryCache.profile; }
  public getRole(): MemberRole { return this.inMemoryCache.role; }

  // Setters & Mutations
  public setRole(role: MemberRole) {
    this.inMemoryCache.role = role;
    this.saveSnapshot();
  }

  public setProfile(profile: UserProfile) {
    this.inMemoryCache.profile = profile;
    this.saveSnapshot();
  }

  public addNode(node: VaultNode) {
    this.inMemoryCache.nodes.push(node);
    this.logActivity('created_node', node.id, null, { title: node.title, type: node.type });
    this.saveSnapshot();
  }

  public addMultipleNodes(nodes: VaultNode[]) {
    this.inMemoryCache.nodes.push(...nodes);
    this.logActivity('bulk_created_nodes', null, null, { count: nodes.length });
    this.saveSnapshot();
  }

  public updateNode(nodeId: string, updates: Partial<VaultNode>) {
    const idx = this.inMemoryCache.nodes.findIndex(n => n.id === nodeId);
    if (idx !== -1) {
      this.inMemoryCache.nodes[idx] = {
        ...this.inMemoryCache.nodes[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveSnapshot();
    }
  }

  public softDeleteNode(nodeId: string) {
    const idx = this.inMemoryCache.nodes.findIndex(n => n.id === nodeId);
    if (idx !== -1) {
      this.inMemoryCache.nodes[idx].deleted_at = new Date().toISOString();
      this.logActivity('deleted_node', nodeId, null, { title: this.inMemoryCache.nodes[idx].title });
      this.saveSnapshot();
    }
  }

  public restoreNode(nodeId: string) {
    const idx = this.inMemoryCache.nodes.findIndex(n => n.id === nodeId);
    if (idx !== -1) {
      this.inMemoryCache.nodes[idx].deleted_at = null;
      this.saveSnapshot();
    }
  }

  public permanentDeleteNode(nodeId: string) {
    this.inMemoryCache.nodes = this.inMemoryCache.nodes.filter(n => n.id !== nodeId);
    this.saveSnapshot();
  }

  // Block Mutations
  public addBlock(block: QuestionBlock, javaCode = '', cppCode = '') {
    this.inMemoryCache.blocks.push(block);
    if (!this.inMemoryCache.variants[block.id]) {
      this.inMemoryCache.variants[block.id] = {};
    }
    this.inMemoryCache.variants[block.id].java = {
      block_id: block.id,
      language: 'java',
      code_content: javaCode,
      version: 1,
      updated_by: this.inMemoryCache.profile.id,
      updated_at: new Date().toISOString(),
    };
    this.inMemoryCache.variants[block.id].cpp = {
      block_id: block.id,
      language: 'cpp',
      code_content: cppCode,
      version: 1,
      updated_by: this.inMemoryCache.profile.id,
      updated_at: new Date().toISOString(),
    };
    this.logActivity('added_block', block.node_id, block.id, { block_title: block.block_title });
    this.saveSnapshot();
  }

  public updateBlock(blockId: string, updates: Partial<QuestionBlock>) {
    const idx = this.inMemoryCache.blocks.findIndex(b => b.id === blockId);
    if (idx !== -1) {
      this.inMemoryCache.blocks[idx] = {
        ...this.inMemoryCache.blocks[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveSnapshot();
    }
  }

  public softDeleteBlock(blockId: string) {
    const idx = this.inMemoryCache.blocks.findIndex(b => b.id === blockId);
    if (idx !== -1) {
      this.inMemoryCache.blocks[idx].deleted_at = new Date().toISOString();
      this.saveSnapshot();
    }
  }

  public restoreBlock(blockId: string) {
    const idx = this.inMemoryCache.blocks.findIndex(b => b.id === blockId);
    if (idx !== -1) {
      this.inMemoryCache.blocks[idx].deleted_at = null;
      this.saveSnapshot();
    }
  }

  // Variant Mutations
  public updateVariant(blockId: string, language: CodeLanguage, codeContent: string, saveSnapshotVersion = false) {
    if (!this.inMemoryCache.variants[blockId]) {
      this.inMemoryCache.variants[blockId] = {};
    }

    const currentVariant = this.inMemoryCache.variants[blockId][language];
    const prevVersion = currentVariant?.version || 1;
    const newVersion = prevVersion + 1;

    this.inMemoryCache.variants[blockId][language] = {
      block_id: blockId,
      language,
      code_content: codeContent,
      version: newVersion,
      updated_by: this.inMemoryCache.profile.id,
      updated_at: new Date().toISOString(),
    };

    if (saveSnapshotVersion && codeContent.trim()) {
      this.inMemoryCache.versions.unshift({
        id: crypto.randomUUID(),
        block_id: blockId,
        language,
        code_content: codeContent,
        saved_by: this.inMemoryCache.profile.id,
        saved_at: new Date().toISOString(),
      });
    }

    this.saveSnapshot();
  }

  // Comments
  public addComment(comment: BlockComment) {
    this.inMemoryCache.comments.unshift(comment);
    this.saveSnapshot();
  }

  public toggleResolveComment(commentId: string) {
    const c = this.inMemoryCache.comments.find(item => item.id === commentId);
    if (c) {
      c.resolved = !c.resolved;
      c.updated_at = new Date().toISOString();
      this.saveSnapshot();
    }
  }

  public deleteComment(commentId: string) {
    this.inMemoryCache.comments = this.inMemoryCache.comments.filter(item => item.id !== commentId);
    this.saveSnapshot();
  }

  // Templates
  public updateTemplate(template: CopyTemplate) {
    const idx = this.inMemoryCache.templates.findIndex(
      t => t.workspace_id === template.workspace_id && t.language === template.language
    );
    if (idx !== -1) {
      this.inMemoryCache.templates[idx] = template;
    } else {
      this.inMemoryCache.templates.push(template);
    }
    this.saveSnapshot();
  }

  // Activity Logger
  private logActivity(action: string, nodeId: string | null, blockId: string | null, meta: Record<string, any>) {
    this.inMemoryCache.activity.unshift({
      id: crypto.randomUUID(),
      workspace_id: this.inMemoryCache.workspace.id,
      user_id: this.inMemoryCache.profile.id,
      action,
      node_id: nodeId,
      block_id: blockId,
      meta,
      created_at: new Date().toISOString(),
      profile: this.inMemoryCache.profile,
    });
  }

  // Reset to initial demo state
  public resetToDemo() {
    this.inMemoryCache = {
      workspace: INITIAL_WORKSPACE,
      nodes: INITIAL_NODES,
      blocks: INITIAL_BLOCKS,
      variants: INITIAL_VARIANTS,
      versions: [],
      comments: INITIAL_COMMENTS,
      templates: INITIAL_TEMPLATES,
      activity: INITIAL_ACTIVITY,
      profile: DEMO_USER,
      role: 'admin',
    };
    this.saveSnapshot();
  }
}

export const storage = new StorageEngine();
