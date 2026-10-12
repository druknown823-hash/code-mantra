// LabVault - Core Data Types & Interfaces

export type MemberRole = 'admin' | 'contributor' | 'viewer';
export type NodeType = 'folder' | 'question';
export type QuestionStatus = 'todo' | 'in_progress' | 'done' | 'needs_review';
export type CodeLanguage = 'java' | 'cpp';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_color: string;
  avatar_url?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  created_by: string;
  join_code: string;
  join_code_expires_at?: string | null;
  join_code_role: MemberRole;
  require_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profile?: UserProfile;
}

export interface JoinRequest {
  id: string;
  workspace_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profile?: UserProfile;
}

export interface VaultNode {
  id: string;
  workspace_id: string;
  parent_id: string | null;
  title: string;
  type: NodeType;
  position_index: string;
  description_md: string;
  default_language: CodeLanguage;
  status: QuestionStatus;
  tags: string[];
  is_pinned: boolean;
  sample_input?: string;
  sample_output?: string;
  console_output?: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  // Computed client-side properties:
  outline_number?: string;
  depth?: number;
  total_questions?: number;
  done_questions?: number;
  progress_percent?: number;
  children?: VaultNode[];
}

export interface QuestionBlock {
  id: string;
  node_id: string;
  block_title: string;
  position_index: string;
  updated_by?: string;
  updated_at: string;
  deleted_at: string | null;
  created_at: string;
  variants?: Record<CodeLanguage, BlockVariant>;
}

export interface BlockVariant {
  block_id: string;
  language: CodeLanguage;
  code_content: string;
  version: number;
  updated_by?: string;
  updated_at: string;
}

export interface BlockVersion {
  id: string;
  block_id: string;
  language: CodeLanguage;
  code_content: string;
  saved_by?: string;
  saved_at: string;
}

export interface BlockComment {
  id: string;
  block_id: string;
  parent_id?: string | null;
  user_id: string;
  body: string;
  line_ref?: number | null;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface CopyTemplate {
  workspace_id: string;
  language: CodeLanguage;
  prefix: string;
  suffix: string;
}

export interface ShareLink {
  token: string;
  node_id: string;
  created_by: string;
  expires_at?: string | null;
  revoked: boolean;
  created_at: string;
}

export interface ActivityLogItem {
  id: string;
  workspace_id: string;
  user_id: string;
  action: string;
  node_id?: string | null;
  block_id?: string | null;
  meta: Record<string, any>;
  created_at: string;
  profile?: UserProfile;
}

export interface UserPresence {
  user_id: string;
  display_name: string;
  avatar_color: string;
  node_id?: string | null;
  block_id?: string | null;
  language?: CodeLanguage;
  cursor?: { line: number; ch: number };
  last_active: number;
}

export interface CopyOptions {
  separator: 'blank' | 'banner' | 'none';
  wrapInBoilerplate: boolean;
  deduplicateImports: boolean;
  selectedBlockIds?: string[];
}

export interface RecentCopyItem {
  id: string;
  text: string;
  title: string;
  language: CodeLanguage;
  lineCount: number;
  timestamp: number;
}
