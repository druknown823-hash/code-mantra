// CodeTantra Real Synced Solutions Data
import { 
  Workspace, 
  VaultNode, 
  QuestionBlock, 
  BlockVariant, 
  BlockComment, 
  CopyTemplate, 
  UserProfile, 
  ActivityLogItem 
} from '../types';

export const DEMO_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  display_name: 'CodeTantra Dev',
  avatar_color: '#58a6ff',
  avatar_url: null,
};

export const INITIAL_WORKSPACE: Workspace = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'CODE TANTRA',
  description: 'Notion-style code solution repository for CodeTantra labs and practical courses.',
  created_by: DEMO_USER.id,
  join_code: 'TANTRA',
  join_code_expires_at: null,
  join_code_role: 'viewer',
  require_approval: false,
  created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_TEMPLATES: CopyTemplate[] = [
  {
    workspace_id: INITIAL_WORKSPACE.id,
    language: 'cpp',
    prefix: `#include <iostream>\nusing namespace std;\n\n`,
    suffix: `\nint main() {\n    return 0;\n}\n`,
  },
  {
    workspace_id: INITIAL_WORKSPACE.id,
    language: 'java',
    prefix: `public class Main {\n\n`,
    suffix: `\n}\n`,
  },
];

const DS_ID = 'ds-root-page';
const JAVA_ID = 'java-root-page';
const DS_LAB_ID = 'ds-lab-folder';
const DS_PRACT_ID = 'ds-pract-folder';
const DS_THEORY_ID = 'ds-theory-folder';

export const INITIAL_NODES: VaultNode[] = [
  // Level 1: DS and JAVA
  {
    id: DS_ID,
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: null,
    title: 'DS',
    type: 'folder',
    position_index: 'a0',
    description_md: '',
    default_language: 'cpp',
    status: 'in_progress',
    tags: ['data-structures', 'cpp'],
    is_pinned: true,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: JAVA_ID,
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: null,
    title: 'JAVA',
    type: 'folder',
    position_index: 'a1',
    description_md: '',
    default_language: 'java',
    status: 'todo',
    tags: ['java', 'oop'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Level 2 inside DS: DsLab, Cources(pract), Cources(theory)
  {
    id: DS_LAB_ID,
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_ID,
    title: 'DsLab',
    type: 'folder',
    position_index: 'a0',
    description_md: '',
    default_language: 'cpp',
    status: 'todo',
    tags: ['lab'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: DS_PRACT_ID,
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_ID,
    title: 'Cources(pract)',
    type: 'folder',
    position_index: 'a1',
    description_md: '',
    default_language: 'cpp',
    status: 'in_progress',
    tags: ['practical'],
    is_pinned: true,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: DS_THEORY_ID,
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_ID,
    title: 'Cources(theory)',
    type: 'folder',
    position_index: 'a2',
    description_md: '',
    default_language: 'cpp',
    status: 'todo',
    tags: ['theory'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-1-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.1.1",
    type: 'question',
    position_index: "p_000",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-2-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.2.1",
    type: 'question',
    position_index: "p_001",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-3-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.3.1",
    type: 'question',
    position_index: "p_002",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-4-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.4.1",
    type: 'question',
    position_index: "p_003",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-5-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.5.1",
    type: 'question',
    position_index: "p_004",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-6-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.6.1",
    type: 'question',
    position_index: "p_005",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-7-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.7.1",
    type: 'question',
    position_index: "p_006",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-8-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.8.1",
    type: 'question',
    position_index: "p_007",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-9-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.9.1",
    type: 'question',
    position_index: "p_008",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-9-2",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.9.2",
    type: 'question',
    position_index: "p_009",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-10-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.10.1",
    type: 'question',
    position_index: "p_010",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-10-2",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.10.2",
    type: 'question',
    position_index: "p_011",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-10-3",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.10.3",
    type: 'question',
    position_index: "p_012",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-10-4",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.10.4",
    type: 'question',
    position_index: "p_013",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-10-5",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.10.5",
    type: 'question',
    position_index: "p_014",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-10-6",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.10.6",
    type: 'question',
    position_index: "p_015",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-11-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.11.1",
    type: 'question',
    position_index: "p_016",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: true,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-12-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.12.1",
    type: 'question',
    position_index: "p_017",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-13-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.13.1",
    type: 'question',
    position_index: "p_018",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-14-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.14.1",
    type: 'question',
    position_index: "p_019",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-15-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.15.1",
    type: 'question',
    position_index: "p_020",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "page-1-16-1",
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: "1.16.1",
    type: 'question',
    position_index: "p_021",
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: false,
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_BLOCKS: QuestionBlock[] = [
  {
    "id": "block-1-1-1-0",
    "node_id": "page-1-1-1",
    "block_title": "",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.913Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-2-1-0",
    "node_id": "page-1-2-1",
    "block_title": "",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-3-1-0",
    "node_id": "page-1-3-1",
    "block_title": "void displayArray",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-3-1-1",
    "node_id": "page-1-3-1",
    "block_title": "int insertElement",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-3-1-2",
    "node_id": "page-1-3-1",
    "block_title": "int deleteElement",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-3-1-3",
    "node_id": "page-1-3-1",
    "block_title": "void searchElement",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-4-1-0",
    "node_id": "page-1-4-1",
    "block_title": "",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-5-1-0",
    "node_id": "page-1-5-1",
    "block_title": "void display",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-5-1-1",
    "node_id": "page-1-5-1",
    "block_title": "void push",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.921Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.921Z"
  },
  {
    "id": "block-1-5-1-2",
    "node_id": "page-1-5-1",
    "block_title": "void pop",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-6-1-0",
    "node_id": "page-1-6-1",
    "block_title": "void push",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-6-1-1",
    "node_id": "page-1-6-1",
    "block_title": "char pop",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-6-1-2",
    "node_id": "page-1-6-1",
    "block_title": "int main",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-7-1-0",
    "node_id": "page-1-7-1",
    "block_title": "void initializeQueue",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-7-1-1",
    "node_id": "page-1-7-1",
    "block_title": "int isFull",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-7-1-2",
    "node_id": "page-1-7-1",
    "block_title": "int isEmpty",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-7-1-3",
    "node_id": "page-1-7-1",
    "block_title": "void insertElement",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-7-1-4",
    "node_id": "page-1-7-1",
    "block_title": "void deleteElement",
    "position_index": "b_04",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-7-1-5",
    "node_id": "page-1-7-1",
    "block_title": "void display status",
    "position_index": "b_05",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-8-1-0",
    "node_id": "page-1-8-1",
    "block_title": "void display",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-8-1-1",
    "node_id": "page-1-8-1",
    "block_title": "void enqueue",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-8-1-2",
    "node_id": "page-1-8-1",
    "block_title": "void dequeue",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-0",
    "node_id": "page-1-9-1",
    "block_title": "void transverse",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-1",
    "node_id": "page-1-9-1",
    "block_title": "void createList",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-2",
    "node_id": "page-1-9-1",
    "block_title": "void insertAtBeginning",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-3",
    "node_id": "page-1-9-1",
    "block_title": "void insertAfterPosition",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-4",
    "node_id": "page-1-9-1",
    "block_title": "void insertAtEnd",
    "position_index": "b_04",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-5",
    "node_id": "page-1-9-1",
    "block_title": "void deleteFromBeggining",
    "position_index": "b_05",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-6",
    "node_id": "page-1-9-1",
    "block_title": "void deleteFromPosition",
    "position_index": "b_06",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-1-7",
    "node_id": "page-1-9-1",
    "block_title": "void deleteFromEnd",
    "position_index": "b_07",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-0",
    "node_id": "page-1-9-2",
    "block_title": "void transverse",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-1",
    "node_id": "page-1-9-2",
    "block_title": "void createList",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-2",
    "node_id": "page-1-9-2",
    "block_title": "void insertAtBeginning",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-3",
    "node_id": "page-1-9-2",
    "block_title": "void insertAtEnd",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-4",
    "node_id": "page-1-9-2",
    "block_title": "void insertAfterPosition",
    "position_index": "b_04",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-5",
    "node_id": "page-1-9-2",
    "block_title": "void deleteFromBeggining",
    "position_index": "b_05",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-6",
    "node_id": "page-1-9-2",
    "block_title": "void deleteFromEnd",
    "position_index": "b_06",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-9-2-7",
    "node_id": "page-1-9-2",
    "block_title": "void deleteFromPosition",
    "position_index": "b_07",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-1-0",
    "node_id": "page-1-10-1",
    "block_title": "void bubbleSort",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-2-0",
    "node_id": "page-1-10-2",
    "block_title": "**In line 4 parameters:** Fill in the function parameters inside `insertionSort(...)`",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-2-1",
    "node_id": "page-1-10-2",
    "block_title": "void insertionSort(int arr[], int n) {",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-3-0",
    "node_id": "page-1-10-3",
    "block_title": "void selectionSort(int arr[], int n) {",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-4-0",
    "node_id": "page-1-10-4",
    "block_title": "void quickSort(int arr[], int low, int high) {",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-5-0",
    "node_id": "page-1-10-5",
    "block_title": "1. Inside `merge` function",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-5-1",
    "node_id": "page-1-10-5",
    "block_title": "Inside `mergeSort` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-5-2",
    "node_id": "page-1-10-5",
    "block_title": "Inside `printArray` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-6-0",
    "node_id": "page-1-10-6",
    "block_title": "Inside `largest` function",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-6-1",
    "node_id": "page-1-10-6",
    "block_title": "Inside `printArray` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-10-6-2",
    "node_id": "page-1-10-6",
    "block_title": "Inside `RadixSort` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-0",
    "node_id": "page-1-11-1",
    "block_title": "struct Node {",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-1",
    "node_id": "page-1-11-1",
    "block_title": "Node* createNode(int value) {",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-2",
    "node_id": "page-1-11-1",
    "block_title": "Node* insert(Node* root, int value) {",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-3",
    "node_id": "page-1-11-1",
    "block_title": "void inorder(Node* root) {",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-4",
    "node_id": "page-1-11-1",
    "block_title": "void preorder(Node* root){",
    "position_index": "b_04",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-5",
    "node_id": "page-1-11-1",
    "block_title": "void postorder(Node* root) {",
    "position_index": "b_05",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-6",
    "node_id": "page-1-11-1",
    "block_title": "int search(Node* root, int key) {",
    "position_index": "b_06",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-11-1-7",
    "node_id": "page-1-11-1",
    "block_title": "Node* deleteNode(Node* root, int key) {",
    "position_index": "b_07",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-12-1-0",
    "node_id": "page-1-12-1",
    "block_title": "Inside `createGraph` function",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-12-1-1",
    "node_id": "page-1-12-1",
    "block_title": "Inside `dfs` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-12-1-2",
    "node_id": "page-1-12-1",
    "block_title": "Inside `bfs` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-12-1-3",
    "node_id": "page-1-12-1",
    "block_title": "Inside `displayGraph` function",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-13-1-0",
    "node_id": "page-1-13-1",
    "block_title": "Under `#define MAX 10`",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-13-1-1",
    "node_id": "page-1-13-1",
    "block_title": "Inside `tsp` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-13-1-2",
    "node_id": "page-1-13-1",
    "block_title": "Inside `main` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-14-1-0",
    "node_id": "page-1-14-1",
    "block_title": "Inside `cycle4` function",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-14-1-1",
    "node_id": "page-1-14-1",
    "block_title": "Inside `applyMove` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-14-1-2",
    "node_id": "page-1-14-1",
    "block_title": "Inside `isSolved` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-14-1-3",
    "node_id": "page-1-14-1",
    "block_title": "Inside `bfs` function",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-15-1-0",
    "node_id": "page-1-15-1",
    "block_title": "Inside `displayCities` function",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-15-1-1",
    "node_id": "page-1-15-1",
    "block_title": "Inside `displayDistanceMatrix` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-15-1-2",
    "node_id": "page-1-15-1",
    "block_title": "Inside `greedyTravelPlan` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-16-1-0",
    "node_id": "page-1-16-1",
    "block_title": "Inside `issueCard` function",
    "position_index": "b_00",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-16-1-1",
    "node_id": "page-1-16-1",
    "block_title": "Inside `findCard` function",
    "position_index": "b_01",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-16-1-2",
    "node_id": "page-1-16-1",
    "block_title": "Inside `displayAll` function",
    "position_index": "b_02",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  },
  {
    "id": "block-1-16-1-3",
    "node_id": "page-1-16-1",
    "block_title": "Inside `returnCard` function",
    "position_index": "b_03",
    "updated_by": "00000000-0000-0000-0000-000000000001",
    "updated_at": "2026-10-11T12:13:30.922Z",
    "deleted_at": null,
    "created_at": "2026-10-11T12:13:30.922Z"
  }
];

export const INITIAL_VARIANTS: Record<string, Record<string, BlockVariant>> = {
  "block-1-1-1-0": {
    "cpp": {
      "block_id": "block-1-1-1-0",
      "language": "cpp",
      "code_content": "int n;\n    cin >> n;\n\n    int matrix1[10][10];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cin >> matrix1[i][j];\n        }\n    }\n\n    int matrix2[10][10];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cin >> matrix2[i][j];\n        }\n    }\n\n    int result[10][10] = {0};\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            for (int k = 0; k < n; k++) {\n                result[i][j] += matrix1[i][k] * matrix2[k][j];\n            }\n        }\n    }\n\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cout << result[i][j];\n            if (j < n - 1) {\n                cout << \" \";\n            }\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-1-1-0",
      "language": "java",
      "code_content": "int n;\n    cin >> n;\n\n    int matrix1[10][10];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cin >> matrix1[i][j];\n        }\n    }\n\n    int matrix2[10][10];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cin >> matrix2[i][j];\n        }\n    }\n\n    int result[10][10] = {0};\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            for (int k = 0; k < n; k++) {\n                result[i][j] += matrix1[i][k] * matrix2[k][j];\n            }\n        }\n    }\n\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cout << result[i][j];\n            if (j < n - 1) {\n                cout << \" \";\n            }\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-2-1-0": {
    "cpp": {
      "block_id": "block-1-2-1-0",
      "language": "cpp",
      "code_content": "// Read elements of the first array\n    for (int i = 0; i < n; i++) {\n        cin >> arr1[i];\n    }\n\n    // Copy elements into the second array\n    for (int i = 0; i < n; i++) {\n        arr2[i] = arr1[i];\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-2-1-0",
      "language": "java",
      "code_content": "// Read elements of the first array\n    for (int i = 0; i < n; i++) {\n        cin >> arr1[i];\n    }\n\n    // Copy elements into the second array\n    for (int i = 0; i < n; i++) {\n        arr2[i] = arr1[i];\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-3-1-0": {
    "cpp": {
      "block_id": "block-1-3-1-0",
      "language": "cpp",
      "code_content": "// write your code here...\n    if (size == 0) {\n        cout << \"Array is empty\" << endl;\n    } else {\n        for (int i = 0; i < size; i++) {\n            cout << arr[i] << \" \";\n            // if (i < size - 1) cout << \" \";\n        }\n        cout << endl;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-3-1-0",
      "language": "java",
      "code_content": "// write your code here...\n    if (size == 0) {\n        cout << \"Array is empty\" << endl;\n    } else {\n        for (int i = 0; i < size; i++) {\n            cout << arr[i] << \" \";\n            // if (i < size - 1) cout << \" \";\n        }\n        cout << endl;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-3-1-1": {
    "cpp": {
      "block_id": "block-1-3-1-1",
      "language": "cpp",
      "code_content": "// write your code here...\n    if (*size >= capacity) {\n        cout << \"Array is full\" << endl;\n        return 0;\n    }\n    arr[*size] = element;\n    (*size)++;\n    return 1;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-3-1-1",
      "language": "java",
      "code_content": "// write your code here...\n    if (*size >= capacity) {\n        cout << \"Array is full\" << endl;\n        return 0;\n    }\n    arr[*size] = element;\n    (*size)++;\n    return 1;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-3-1-2": {
    "cpp": {
      "block_id": "block-1-3-1-2",
      "language": "cpp",
      "code_content": "// write your code here...\n    if (*size == 0) {\n        cout << \"Array is empty\" << endl;\n        return 0;\n    }\n    for (int i = 0; i < *size; i++) {\n        if (arr[i] == element) {\n            for (int j = i; j < *size - 1; j++) {\n                arr[j] = arr[j + 1];\n            }\n            (*size)--;\n            cout << \"Element \" << element << \" deleted\" << endl;\n            return 1;\n        }\n    }\n    cout << \"Element \" << element << \" not found\" << endl;\n    return 0;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-3-1-2",
      "language": "java",
      "code_content": "// write your code here...\n    if (*size == 0) {\n        cout << \"Array is empty\" << endl;\n        return 0;\n    }\n    for (int i = 0; i < *size; i++) {\n        if (arr[i] == element) {\n            for (int j = i; j < *size - 1; j++) {\n                arr[j] = arr[j + 1];\n            }\n            (*size)--;\n            cout << \"Element \" << element << \" deleted\" << endl;\n            return 1;\n        }\n    }\n    cout << \"Element \" << element << \" not found\" << endl;\n    return 0;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-3-1-3": {
    "cpp": {
      "block_id": "block-1-3-1-3",
      "language": "cpp",
      "code_content": "// write your code here...\n    if (size == 0) {\n        cout << \"Array is empty\" << endl;\n        return;\n    }\n    for (int i = 0; i < size; i++) {\n        if (arr[i] == element) {\n            cout << \"Element \" << element << \" found\" << endl;\n            return;\n        }\n    }\n    cout << \"Element \" << element << \" not found\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-3-1-3",
      "language": "java",
      "code_content": "// write your code here...\n    if (size == 0) {\n        cout << \"Array is empty\" << endl;\n        return;\n    }\n    for (int i = 0; i < size; i++) {\n        if (arr[i] == element) {\n            cout << \"Element \" << element << \" found\" << endl;\n            return;\n        }\n    }\n    cout << \"Element \" << element << \" not found\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-4-1-0": {
    "cpp": {
      "block_id": "block-1-4-1-0",
      "language": "cpp",
      "code_content": "// write your code here\n    for (int i = 0; i < n; i++) {\n        cin >> *(ptr + i);\n    }\n\n    for (int i = n - 1; i >= 0; i--) {\n        cout << *(ptr + i) << \" \";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-4-1-0",
      "language": "java",
      "code_content": "// write your code here\n    for (int i = 0; i < n; i++) {\n        cin >> *(ptr + i);\n    }\n\n    for (int i = n - 1; i >= 0; i--) {\n        cout << *(ptr + i) << \" \";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-5-1-0": {
    "cpp": {
      "block_id": "block-1-5-1-0",
      "language": "cpp",
      "code_content": "if (top == -1) {\n        cout << \"Stack is empty\\n\";\n    } else {\n        cout << \"Stack elements:\";\n        for (int i = 0; i <= top; i++) {\n            cout << \" \" << stack[i];\n        }\n        cout << \" \" << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-5-1-0",
      "language": "java",
      "code_content": "if (top == -1) {\n        cout << \"Stack is empty\\n\";\n    } else {\n        cout << \"Stack elements:\";\n        for (int i = 0; i <= top; i++) {\n            cout << \" \" << stack[i];\n        }\n        cout << \" \" << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-5-1-1": {
    "cpp": {
      "block_id": "block-1-5-1-1",
      "language": "cpp",
      "code_content": "if (top == MAX - 1) {\n        cout << \"Stack Overflow\\n\";\n    } else {\n        top++;\n        stack[top] = value;\n        cout << value << \" pushed into stack\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    },
    "java": {
      "block_id": "block-1-5-1-1",
      "language": "java",
      "code_content": "if (top == MAX - 1) {\n        cout << \"Stack Overflow\\n\";\n    } else {\n        top++;\n        stack[top] = value;\n        cout << value << \" pushed into stack\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.921Z"
    }
  },
  "block-1-5-1-2": {
    "cpp": {
      "block_id": "block-1-5-1-2",
      "language": "cpp",
      "code_content": "if (top == -1) {\n        cout << \"Stack Underflow\\n\";\n    } else {\n        cout << stack[top] << \" popped from stack\\n\";\n        top--;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-5-1-2",
      "language": "java",
      "code_content": "if (top == -1) {\n        cout << \"Stack Underflow\\n\";\n    } else {\n        cout << stack[top] << \" popped from stack\\n\";\n        top--;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-6-1-0": {
    "cpp": {
      "block_id": "block-1-6-1-0",
      "language": "cpp",
      "code_content": "if (top < MAX - 1) {\n        top++;\n        stack[top] = c;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-6-1-0",
      "language": "java",
      "code_content": "if (top < MAX - 1) {\n        top++;\n        stack[top] = c;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-6-1-1": {
    "cpp": {
      "block_id": "block-1-6-1-1",
      "language": "cpp",
      "code_content": "// write your code here\n    if (top >= 0) {\n        char c = stack[top];\n        top--;\n        return c;\n    }\n    return '\\0';",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-6-1-1",
      "language": "java",
      "code_content": "// write your code here\n    if (top >= 0) {\n        char c = stack[top];\n        top--;\n        return c;\n    }\n    return '\\0';",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-6-1-2": {
    "cpp": {
      "block_id": "block-1-6-1-2",
      "language": "cpp",
      "code_content": "// Push all characters of the string to the stack\n    for (int i = 0; i < strlen(str); i++) {\n        push(str[i]);\n    }\n\n    // Pop all characters from the stack and print them\n    while (top != -1) {\n        cout << pop();\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-6-1-2",
      "language": "java",
      "code_content": "// Push all characters of the string to the stack\n    for (int i = 0; i < strlen(str); i++) {\n        push(str[i]);\n    }\n\n    // Pop all characters from the stack and print them\n    while (top != -1) {\n        cout << pop();\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-7-1-0": {
    "cpp": {
      "block_id": "block-1-7-1-0",
      "language": "cpp",
      "code_content": "// Write your code here...\n    q->front = -1;\n    q->rear = -1;\n    q->size = 0;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-7-1-0",
      "language": "java",
      "code_content": "// Write your code here...\n    q->front = -1;\n    q->rear = -1;\n    q->size = 0;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-7-1-1": {
    "cpp": {
      "block_id": "block-1-7-1-1",
      "language": "cpp",
      "code_content": "// Write your code here...\n    return (q->size == MAX);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-7-1-1",
      "language": "java",
      "code_content": "// Write your code here...\n    return (q->size == MAX);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-7-1-2": {
    "cpp": {
      "block_id": "block-1-7-1-2",
      "language": "cpp",
      "code_content": "// Write your code here...\n    return (q->size == 0);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-7-1-2",
      "language": "java",
      "code_content": "// Write your code here...\n    return (q->size == 0);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-7-1-3": {
    "cpp": {
      "block_id": "block-1-7-1-3",
      "language": "cpp",
      "code_content": "// Write your code here...\n    if (isFull(q)) {\n        cout << \"Queue Overflow\" << endl;\n        return;\n    }\n\n    if (isEmpty(q)) {\n        q->front = 0;\n    }\n\n    q->rear = (q->rear + 1) % MAX;\n    q->data[q->rear] = element;\n    q->size++;\n\n    cout << \"Inserted element '\" << element << \"'\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-7-1-3",
      "language": "java",
      "code_content": "// Write your code here...\n    if (isFull(q)) {\n        cout << \"Queue Overflow\" << endl;\n        return;\n    }\n\n    if (isEmpty(q)) {\n        q->front = 0;\n    }\n\n    q->rear = (q->rear + 1) % MAX;\n    q->data[q->rear] = element;\n    q->size++;\n\n    cout << \"Inserted element '\" << element << \"'\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-7-1-4": {
    "cpp": {
      "block_id": "block-1-7-1-4",
      "language": "cpp",
      "code_content": "// Write your code here...\n    if (isEmpty(q)) {\n        cout << \"Queue Underflow\" << endl;\n        return;\n    }\n\n    char element = q->data[q->front];\n\n    if (q->front == q->rear) {\n        q->front = -1;\n        q->rear = -1;\n    } else {\n        q->front = (q->front + 1) % MAX;\n    }\n\n    q->size--;\n    cout << \"Deleted element '\" << element << \"'\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-7-1-4",
      "language": "java",
      "code_content": "// Write your code here...\n    if (isEmpty(q)) {\n        cout << \"Queue Underflow\" << endl;\n        return;\n    }\n\n    char element = q->data[q->front];\n\n    if (q->front == q->rear) {\n        q->front = -1;\n        q->rear = -1;\n    } else {\n        q->front = (q->front + 1) % MAX;\n    }\n\n    q->size--;\n    cout << \"Deleted element '\" << element << \"'\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-7-1-5": {
    "cpp": {
      "block_id": "block-1-7-1-5",
      "language": "cpp",
      "code_content": "// Write your code here...\n    if (isEmpty(q)) {\n        cout << \"Queue is empty\" << endl;\n        return;\n    }\n\n    // cout << \"Queue elements: \";\n    int i = q->front;\n    for (int count = 0; count < q->size; count++) {\n        cout << q->data[i] << \" \";\n        i = (i + 1) % MAX;\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-7-1-5",
      "language": "java",
      "code_content": "// Write your code here...\n    if (isEmpty(q)) {\n        cout << \"Queue is empty\" << endl;\n        return;\n    }\n\n    // cout << \"Queue elements: \";\n    int i = q->front;\n    for (int count = 0; count < q->size; count++) {\n        cout << q->data[i] << \" \";\n        i = (i + 1) % MAX;\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-8-1-0": {
    "cpp": {
      "block_id": "block-1-8-1-0",
      "language": "cpp",
      "code_content": "if (front == -1 || front > rear) {\n        cout << \"Queue is empty\\n\";\n    } else {\n        cout << \"Queue elements: \";\n        for (int i = front; i <= rear; i++) {\n            cout << queue[i] << \" \";\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-8-1-0",
      "language": "java",
      "code_content": "if (front == -1 || front > rear) {\n        cout << \"Queue is empty\\n\";\n    } else {\n        cout << \"Queue elements: \";\n        for (int i = front; i <= rear; i++) {\n            cout << queue[i] << \" \";\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-8-1-1": {
    "cpp": {
      "block_id": "block-1-8-1-1",
      "language": "cpp",
      "code_content": "if (rear == MAX - 1) {\n        cout << \"Queue Overflow\\n\";\n    } else {\n        if (front == -1) {\n            front = 0;\n        }\n        rear++;\n        queue[rear] = value;\n        cout << value << \" inserted into queue\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-8-1-1",
      "language": "java",
      "code_content": "if (rear == MAX - 1) {\n        cout << \"Queue Overflow\\n\";\n    } else {\n        if (front == -1) {\n            front = 0;\n        }\n        rear++;\n        queue[rear] = value;\n        cout << value << \" inserted into queue\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-8-1-2": {
    "cpp": {
      "block_id": "block-1-8-1-2",
      "language": "cpp",
      "code_content": "if (front == -1 || front > rear) {\n        cout << \"Queue Underflow\\n\";\n    } else {\n        cout << queue[front] << \" deleted from queue\\n\";\n        front++;\n        // Reset queue to empty state if all elements are deleted\n        if (front > rear) {\n            front = -1;\n            rear = -1;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-8-1-2",
      "language": "java",
      "code_content": "if (front == -1 || front > rear) {\n        cout << \"Queue Underflow\\n\";\n    } else {\n        cout << queue[front] << \" deleted from queue\\n\";\n        front++;\n        // Reset queue to empty state if all elements are deleted\n        if (front > rear) {\n            front = -1;\n            rear = -1;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-0": {
    "cpp": {
      "block_id": "block-1-9-1-0",
      "language": "cpp",
      "code_content": "if (head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n    cout << \"List: \";\n    Node* temp = head;\n    while (temp != NULL) {\n        cout << temp->data << \" -> \";\n        temp = temp->next;\n    }\n    cout << \"NULL\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-0",
      "language": "java",
      "code_content": "if (head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n    cout << \"List: \";\n    Node* temp = head;\n    while (temp != NULL) {\n        cout << temp->data << \" -> \";\n        temp = temp->next;\n    }\n    cout << \"NULL\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-1": {
    "cpp": {
      "block_id": "block-1-9-1-1",
      "language": "cpp",
      "code_content": "// Free existing memory if list already exists\n    Node* current = *head;\n    while (current != NULL) {\n        Node* nextNode = current->next;\n        free(current);\n        current = nextNode;\n    }\n    *head = NULL;\n\n    Node* tail = NULL;\n    for (int i = 1; i <= n; i++) {\n        int val;\n        cout << \"value for node \" << i << \": \";\n        cin >> val;\n        \n        Node* newNode = (Node*)malloc(sizeof(Node));\n        newNode->data = val;\n        newNode->next = NULL;\n\n        if (*head == NULL) {\n            *head = newNode;\n            tail = newNode;\n        } else {\n            tail->next = newNode;\n            tail = newNode;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-1",
      "language": "java",
      "code_content": "// Free existing memory if list already exists\n    Node* current = *head;\n    while (current != NULL) {\n        Node* nextNode = current->next;\n        free(current);\n        current = nextNode;\n    }\n    *head = NULL;\n\n    Node* tail = NULL;\n    for (int i = 1; i <= n; i++) {\n        int val;\n        cout << \"value for node \" << i << \": \";\n        cin >> val;\n        \n        Node* newNode = (Node*)malloc(sizeof(Node));\n        newNode->data = val;\n        newNode->next = NULL;\n\n        if (*head == NULL) {\n            *head = newNode;\n            tail = newNode;\n        } else {\n            tail->next = newNode;\n            tail = newNode;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-2": {
    "cpp": {
      "block_id": "block-1-9-1-2",
      "language": "cpp",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = *head;\n    *head = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-2",
      "language": "java",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = *head;\n    *head = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-3": {
    "cpp": {
      "block_id": "block-1-9-1-3",
      "language": "cpp",
      "code_content": "if (*head == NULL || pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos; i++) {\n        if (temp == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = temp->next;\n    temp->next = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-3",
      "language": "java",
      "code_content": "if (*head == NULL || pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos; i++) {\n        if (temp == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = temp->next;\n    temp->next = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-4": {
    "cpp": {
      "block_id": "block-1-9-1-4",
      "language": "cpp",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = NULL;\n\n    if (*head == NULL) {\n        *head = newNode;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n    temp->next = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-4",
      "language": "java",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = NULL;\n\n    if (*head == NULL) {\n        *head = newNode;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n    temp->next = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-5": {
    "cpp": {
      "block_id": "block-1-9-1-5",
      "language": "cpp",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    *head = (*head)->next;\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-5",
      "language": "java",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    *head = (*head)->next;\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-6": {
    "cpp": {
      "block_id": "block-1-9-1-6",
      "language": "cpp",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if (pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    if (pos == 0) {\n        Node* temp = *head;\n        *head = (*head)->next;\n        free(temp);\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos - 1; i++) {\n        if (temp == NULL || temp->next == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL || temp->next == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* target = temp->next;\n    temp->next = target->next;\n    free(target);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-6",
      "language": "java",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if (pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    if (pos == 0) {\n        Node* temp = *head;\n        *head = (*head)->next;\n        free(temp);\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos - 1; i++) {\n        if (temp == NULL || temp->next == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL || temp->next == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* target = temp->next;\n    temp->next = target->next;\n    free(target);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-1-7": {
    "cpp": {
      "block_id": "block-1-9-1-7",
      "language": "cpp",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if ((*head)->next == NULL) {\n        free(*head);\n        *head = NULL;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next->next != NULL) {\n        temp = temp->next;\n    }\n\n    free(temp->next);\n    temp->next = NULL;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-1-7",
      "language": "java",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if ((*head)->next == NULL) {\n        free(*head);\n        *head = NULL;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next->next != NULL) {\n        temp = temp->next;\n    }\n\n    free(temp->next);\n    temp->next = NULL;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-0": {
    "cpp": {
      "block_id": "block-1-9-2-0",
      "language": "cpp",
      "code_content": "if (head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n    cout << \"List: \";\n    Node* temp = head;\n    while (temp != NULL) {\n        cout << temp->data << \" <-> \";\n        temp = temp->next;\n    }\n    cout << \"NULL\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-0",
      "language": "java",
      "code_content": "if (head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n    cout << \"List: \";\n    Node* temp = head;\n    while (temp != NULL) {\n        cout << temp->data << \" <-> \";\n        temp = temp->next;\n    }\n    cout << \"NULL\" << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-1": {
    "cpp": {
      "block_id": "block-1-9-2-1",
      "language": "cpp",
      "code_content": "*head = NULL;\n    Node* tail = NULL;\n\n    for (int i = 1; i <= n; i++) {\n        int val;\n        cout << \"value for node \" << i << \": \";\n        cin >> val;\n\n        Node* newNode = (Node*)malloc(sizeof(Node));\n        newNode->data = val;\n        newNode->prev = NULL;\n        newNode->next = NULL;\n\n        if (*head == NULL) {\n            *head = newNode;\n            tail = newNode;\n        } else {\n            tail->next = newNode;\n            newNode->prev = tail;\n            tail = newNode;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-1",
      "language": "java",
      "code_content": "*head = NULL;\n    Node* tail = NULL;\n\n    for (int i = 1; i <= n; i++) {\n        int val;\n        cout << \"value for node \" << i << \": \";\n        cin >> val;\n\n        Node* newNode = (Node*)malloc(sizeof(Node));\n        newNode->data = val;\n        newNode->prev = NULL;\n        newNode->next = NULL;\n\n        if (*head == NULL) {\n            *head = newNode;\n            tail = newNode;\n        } else {\n            tail->next = newNode;\n            newNode->prev = tail;\n            tail = newNode;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-2": {
    "cpp": {
      "block_id": "block-1-9-2-2",
      "language": "cpp",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->prev = NULL;\n    newNode->next = *head;\n\n    if (*head != NULL) {\n        (*head)->prev = newNode;\n    }\n    *head = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-2",
      "language": "java",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->prev = NULL;\n    newNode->next = *head;\n\n    if (*head != NULL) {\n        (*head)->prev = newNode;\n    }\n    *head = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-3": {
    "cpp": {
      "block_id": "block-1-9-2-3",
      "language": "cpp",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = NULL;\n\n    if (*head == NULL) {\n        newNode->prev = NULL;\n        *head = newNode;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n\n    temp->next = newNode;\n    newNode->prev = temp;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-3",
      "language": "java",
      "code_content": "Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = NULL;\n\n    if (*head == NULL) {\n        newNode->prev = NULL;\n        *head = newNode;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n\n    temp->next = newNode;\n    newNode->prev = temp;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-4": {
    "cpp": {
      "block_id": "block-1-9-2-4",
      "language": "cpp",
      "code_content": "if (*head == NULL || pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos; i++) {\n        if (temp == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = temp->next;\n    newNode->prev = temp;\n\n    if (temp->next != NULL) {\n        temp->next->prev = newNode;\n    }\n    temp->next = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-4",
      "language": "java",
      "code_content": "if (*head == NULL || pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos; i++) {\n        if (temp == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = temp->next;\n    newNode->prev = temp;\n\n    if (temp->next != NULL) {\n        temp->next->prev = newNode;\n    }\n    temp->next = newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-5": {
    "cpp": {
      "block_id": "block-1-9-2-5",
      "language": "cpp",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    *head = (*head)->next;\n\n    if (*head != NULL) {\n        (*head)->prev = NULL;\n    }\n\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-5",
      "language": "java",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    *head = (*head)->next;\n\n    if (*head != NULL) {\n        (*head)->prev = NULL;\n    }\n\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-6": {
    "cpp": {
      "block_id": "block-1-9-2-6",
      "language": "cpp",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if ((*head)->next == NULL) {\n        free(*head);\n        *head = NULL;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n\n    temp->prev->next = NULL;\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-6",
      "language": "java",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if ((*head)->next == NULL) {\n        free(*head);\n        *head = NULL;\n        return;\n    }\n\n    Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n\n    temp->prev->next = NULL;\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-9-2-7": {
    "cpp": {
      "block_id": "block-1-9-2-7",
      "language": "cpp",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if (pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos; i++) {\n        if (temp == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    if (temp->prev != NULL) {\n        temp->prev->next = temp->next;\n    } else {\n        *head = temp->next;\n    }\n\n    if (temp->next != NULL) {\n        temp->next->prev = temp->prev;\n    }\n\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-9-2-7",
      "language": "java",
      "code_content": "if (*head == NULL) {\n        cout << \"List is empty\" << endl;\n        return;\n    }\n\n    if (pos < 0) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    Node* temp = *head;\n    for (int i = 0; i < pos; i++) {\n        if (temp == NULL) break;\n        temp = temp->next;\n    }\n\n    if (temp == NULL) {\n        cout << \"Position is out of bounds\" << endl;\n        return;\n    }\n\n    if (temp->prev != NULL) {\n        temp->prev->next = temp->next;\n    } else {\n        *head = temp->next;\n    }\n\n    if (temp->next != NULL) {\n        temp->next->prev = temp->prev;\n    }\n\n    free(temp);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-1-0": {
    "cpp": {
      "block_id": "block-1-10-1-0",
      "language": "cpp",
      "code_content": "for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-1-0",
      "language": "java",
      "code_content": "for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-2-0": {
    "cpp": {
      "block_id": "block-1-10-2-0",
      "language": "cpp",
      "code_content": "int arr[], int n",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-2-0",
      "language": "java",
      "code_content": "int arr[], int n",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-2-1": {
    "cpp": {
      "block_id": "block-1-10-2-1",
      "language": "cpp",
      "code_content": "for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-2-1",
      "language": "java",
      "code_content": "for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-3-0": {
    "cpp": {
      "block_id": "block-1-10-3-0",
      "language": "cpp",
      "code_content": "for (int i = 0; i < n - 1; i++) {\n        int minIndex = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n        int temp = arr[minIndex];\n        arr[minIndex] = arr[i];\n        arr[i] = temp;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-3-0",
      "language": "java",
      "code_content": "for (int i = 0; i < n - 1; i++) {\n        int minIndex = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n        int temp = arr[minIndex];\n        arr[minIndex] = arr[i];\n        arr[i] = temp;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-4-0": {
    "cpp": {
      "block_id": "block-1-10-4-0",
      "language": "cpp",
      "code_content": "if (low < high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n        \n        int pi = i + 1;\n\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-4-0",
      "language": "java",
      "code_content": "if (low < high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n        \n        int pi = i + 1;\n\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-5-0": {
    "cpp": {
      "block_id": "block-1-10-5-0",
      "language": "cpp",
      "code_content": "int n1 = mid - left + 1;\n    int n2 = right - mid;\n\n    int L[n1], R[n2];\n\n    for (int i = 0; i < n1; i++)\n        L[i] = arr[left + i];\n    for (int j = 0; j < n2; j++)\n        R[j] = arr[mid + 1 + j];\n\n    int i = 0, j = 0, k = left;\n\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) {\n            arr[k] = L[i];\n            i++;\n        } else {\n            arr[k] = R[j];\n            j++;\n        }\n        k++;\n    }\n\n    while (i < n1) {\n        arr[k] = L[i];\n        i++;\n        k++;\n    }\n\n    while (j < n2) {\n        arr[k] = R[j];\n        j++;\n        k++;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-5-0",
      "language": "java",
      "code_content": "int n1 = mid - left + 1;\n    int n2 = right - mid;\n\n    int L[n1], R[n2];\n\n    for (int i = 0; i < n1; i++)\n        L[i] = arr[left + i];\n    for (int j = 0; j < n2; j++)\n        R[j] = arr[mid + 1 + j];\n\n    int i = 0, j = 0, k = left;\n\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) {\n            arr[k] = L[i];\n            i++;\n        } else {\n            arr[k] = R[j];\n            j++;\n        }\n        k++;\n    }\n\n    while (i < n1) {\n        arr[k] = L[i];\n        i++;\n        k++;\n    }\n\n    while (j < n2) {\n        arr[k] = R[j];\n        j++;\n        k++;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-5-1": {
    "cpp": {
      "block_id": "block-1-10-5-1",
      "language": "cpp",
      "code_content": "if (left < right) {\n        int mid = left + (right - left) / 2;\n\n        mergeSort(arr, left, mid);\n        mergeSort(arr, mid + 1, right);\n\n        merge(arr, left, mid, right);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-5-1",
      "language": "java",
      "code_content": "if (left < right) {\n        int mid = left + (right - left) / 2;\n\n        mergeSort(arr, left, mid);\n        mergeSort(arr, mid + 1, right);\n\n        merge(arr, left, mid, right);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-5-2": {
    "cpp": {
      "block_id": "block-1-10-5-2",
      "language": "cpp",
      "code_content": "for (int i = 0; i < size; i++) {\n        cout << arr[i] << \" \";\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-5-2",
      "language": "java",
      "code_content": "for (int i = 0; i < size; i++) {\n        cout << arr[i] << \" \";\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-6-0": {
    "cpp": {
      "block_id": "block-1-10-6-0",
      "language": "cpp",
      "code_content": "int maxVal = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] > maxVal) {\n            maxVal = a[i];\n        }\n    }\n    return maxVal;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-6-0",
      "language": "java",
      "code_content": "int maxVal = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] > maxVal) {\n            maxVal = a[i];\n        }\n    }\n    return maxVal;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-6-1": {
    "cpp": {
      "block_id": "block-1-10-6-1",
      "language": "cpp",
      "code_content": "for (int i = 0; i < n; i++) {\n        cout << arr[i] << \" \";\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-6-1",
      "language": "java",
      "code_content": "for (int i = 0; i < n; i++) {\n        cout << arr[i] << \" \";\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-10-6-2": {
    "cpp": {
      "block_id": "block-1-10-6-2",
      "language": "cpp",
      "code_content": "int maxVal = largest(a, n);\n\n    for (int exp = 1; maxVal / exp > 0; exp *= 10) {\n        int output[n];\n        int count[10] = {0};\n\n        for (int i = 0; i < n; i++)\n            count[(a[i] / exp) % 10]++;\n\n        for (int i = 1; i < 10; i++)\n            count[i] += count[i - 1];\n\n        for (int i = n - 1; i >= 0; i--) {\n            output[count[(a[i] / exp) % 10] - 1] = a[i];\n            count[(a[i] / exp) % 10]--;\n        }\n\n        for (int i = 0; i < n; i++)\n            a[i] = output[i];\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-10-6-2",
      "language": "java",
      "code_content": "int maxVal = largest(a, n);\n\n    for (int exp = 1; maxVal / exp > 0; exp *= 10) {\n        int output[n];\n        int count[10] = {0};\n\n        for (int i = 0; i < n; i++)\n            count[(a[i] / exp) % 10]++;\n\n        for (int i = 1; i < 10; i++)\n            count[i] += count[i - 1];\n\n        for (int i = n - 1; i >= 0; i--) {\n            output[count[(a[i] / exp) % 10] - 1] = a[i];\n            count[(a[i] / exp) % 10]--;\n        }\n\n        for (int i = 0; i < n; i++)\n            a[i] = output[i];\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-0": {
    "cpp": {
      "block_id": "block-1-11-1-0",
      "language": "cpp",
      "code_content": "int data;\n    Node* left;\n    Node* right;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-0",
      "language": "java",
      "code_content": "int data;\n    Node* left;\n    Node* right;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-1": {
    "cpp": {
      "block_id": "block-1-11-1-1",
      "language": "cpp",
      "code_content": "Node* newNode = new Node();\n    newNode->data = value;\n    newNode->left = nullptr;\n    newNode->right = nullptr;\n    return newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-1",
      "language": "java",
      "code_content": "Node* newNode = new Node();\n    newNode->data = value;\n    newNode->left = nullptr;\n    newNode->right = nullptr;\n    return newNode;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-2": {
    "cpp": {
      "block_id": "block-1-11-1-2",
      "language": "cpp",
      "code_content": "if (root == nullptr) {\n        return createNode(value);\n    }\n    if (value < root->data) {\n        root->left = insert(root->left, value);\n    } else if (value > root->data) {\n        root->right = insert(root->right, value);\n    }\n    return root;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-2",
      "language": "java",
      "code_content": "if (root == nullptr) {\n        return createNode(value);\n    }\n    if (value < root->data) {\n        root->left = insert(root->left, value);\n    } else if (value > root->data) {\n        root->right = insert(root->right, value);\n    }\n    return root;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-3": {
    "cpp": {
      "block_id": "block-1-11-1-3",
      "language": "cpp",
      "code_content": "if (root != nullptr) {\n        inorder(root->left);\n        cout << root->data << \" \";\n        inorder(root->right);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-3",
      "language": "java",
      "code_content": "if (root != nullptr) {\n        inorder(root->left);\n        cout << root->data << \" \";\n        inorder(root->right);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-4": {
    "cpp": {
      "block_id": "block-1-11-1-4",
      "language": "cpp",
      "code_content": "if (root != nullptr) {\n        cout << root->data << \" \";\n        preorder(root->left);\n        preorder(root->right);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-4",
      "language": "java",
      "code_content": "if (root != nullptr) {\n        cout << root->data << \" \";\n        preorder(root->left);\n        preorder(root->right);\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-5": {
    "cpp": {
      "block_id": "block-1-11-1-5",
      "language": "cpp",
      "code_content": "if (root != nullptr) {\n        postorder(root->left);\n        postorder(root->right);\n        cout << root->data << \" \";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-5",
      "language": "java",
      "code_content": "if (root != nullptr) {\n        postorder(root->left);\n        postorder(root->right);\n        cout << root->data << \" \";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-6": {
    "cpp": {
      "block_id": "block-1-11-1-6",
      "language": "cpp",
      "code_content": "if (root == nullptr) return 0;\n    if (root->data == key) return 1;\n    if (key < root->data) return search(root->left, key);\n    return search(root->right, key);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-6",
      "language": "java",
      "code_content": "if (root == nullptr) return 0;\n    if (root->data == key) return 1;\n    if (key < root->data) return search(root->left, key);\n    return search(root->right, key);",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-11-1-7": {
    "cpp": {
      "block_id": "block-1-11-1-7",
      "language": "cpp",
      "code_content": "if (root == nullptr) return root;\n\n    if (key < root->data) {\n        root->left = deleteNode(root->left, key);\n    } else if (key > root->data) {\n        root->right = deleteNode(root->right, key);\n    } else {\n        if (root->left == nullptr) {\n            Node* temp = root->right;\n            delete root;\n            return temp;\n        } else if (root->right == nullptr) {\n            Node* temp = root->left;\n            delete root;\n            return temp;\n        }\n\n        Node* current = root->right;\n        while (current && current->left != nullptr) {\n            current = current->left;\n        }\n\n        root->data = current->data;\n        root->right = deleteNode(root->right, current->data);\n    }\n    return root;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-11-1-7",
      "language": "java",
      "code_content": "if (root == nullptr) return root;\n\n    if (key < root->data) {\n        root->left = deleteNode(root->left, key);\n    } else if (key > root->data) {\n        root->right = deleteNode(root->right, key);\n    } else {\n        if (root->left == nullptr) {\n            Node* temp = root->right;\n            delete root;\n            return temp;\n        } else if (root->right == nullptr) {\n            Node* temp = root->left;\n            delete root;\n            return temp;\n        }\n\n        Node* current = root->right;\n        while (current && current->left != nullptr) {\n            current = current->left;\n        }\n\n        root->data = current->data;\n        root->right = deleteNode(root->right, current->data);\n    }\n    return root;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-12-1-0": {
    "cpp": {
      "block_id": "block-1-12-1-0",
      "language": "cpp",
      "code_content": "int edges;\n    cout << \"Number of vertices: \";\n    cin >> n;\n    cout << \"Number of edges: \";\n    cin >> edges;\n\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            adj[i][j] = 0;\n        }\n    }\n\n    for (int i = 0; i < edges; i++) {\n        int u, v;\n        while (true) {\n            cout << \"Edge: \";\n            cin >> u >> v;\n            if (u >= 0 && u < n && v >= 0 && v < n) {\n                adj[u][v] = 1;\n                adj[v][u] = 1;\n                break;\n            } else {\n                cout << \"Invalid edge\\n\";\n            }\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-12-1-0",
      "language": "java",
      "code_content": "int edges;\n    cout << \"Number of vertices: \";\n    cin >> n;\n    cout << \"Number of edges: \";\n    cin >> edges;\n\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            adj[i][j] = 0;\n        }\n    }\n\n    for (int i = 0; i < edges; i++) {\n        int u, v;\n        while (true) {\n            cout << \"Edge: \";\n            cin >> u >> v;\n            if (u >= 0 && u < n && v >= 0 && v < n) {\n                adj[u][v] = 1;\n                adj[v][u] = 1;\n                break;\n            } else {\n                cout << \"Invalid edge\\n\";\n            }\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-12-1-1": {
    "cpp": {
      "block_id": "block-1-12-1-1",
      "language": "cpp",
      "code_content": "cout << v << \" \";\n    visited[v] = 1;\n    for (int i = 0; i < n; i++) {\n        if (adj[v][i] == 1 && !visited[i]) {\n            dfs(i);\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-12-1-1",
      "language": "java",
      "code_content": "cout << v << \" \";\n    visited[v] = 1;\n    for (int i = 0; i < n; i++) {\n        if (adj[v][i] == 1 && !visited[i]) {\n            dfs(i);\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-12-1-2": {
    "cpp": {
      "block_id": "block-1-12-1-2",
      "language": "cpp",
      "code_content": "int bfsVisited[MAX] = {0};\n    int queue[MAX];\n    int front = 0, rear = 0;\n\n    queue[rear++] = start;\n    bfsVisited[start] = 1;\n\n    while (front < rear) {\n        int current = queue[front++];\n        cout << current << \" \";\n\n        for (int i = 0; i < n; i++) {\n            if (adj[current][i] == 1 && !bfsVisited[i]) {\n                queue[rear++] = i;\n                bfsVisited[i] = 1;\n            }\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-12-1-2",
      "language": "java",
      "code_content": "int bfsVisited[MAX] = {0};\n    int queue[MAX];\n    int front = 0, rear = 0;\n\n    queue[rear++] = start;\n    bfsVisited[start] = 1;\n\n    while (front < rear) {\n        int current = queue[front++];\n        cout << current << \" \";\n\n        for (int i = 0; i < n; i++) {\n            if (adj[current][i] == 1 && !bfsVisited[i]) {\n                queue[rear++] = i;\n                bfsVisited[i] = 1;\n            }\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-12-1-3": {
    "cpp": {
      "block_id": "block-1-12-1-3",
      "language": "cpp",
      "code_content": "cout << \"Adjacency Matrix:\\n\";\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cout << adj[i][j] << \" \";\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-12-1-3",
      "language": "java",
      "code_content": "cout << \"Adjacency Matrix:\\n\";\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cout << adj[i][j] << \" \";\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-13-1-0": {
    "cpp": {
      "block_id": "block-1-13-1-0",
      "language": "cpp",
      "code_content": "int n;\nint dist[MAX][MAX];\nbool visited[MAX];\nint minCost = INT_MAX;\nint currentPath[MAX + 1];\nint bestPath[MAX + 1];",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-13-1-0",
      "language": "java",
      "code_content": "int n;\nint dist[MAX][MAX];\nbool visited[MAX];\nint minCost = INT_MAX;\nint currentPath[MAX + 1];\nint bestPath[MAX + 1];",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-13-1-1": {
    "cpp": {
      "block_id": "block-1-13-1-1",
      "language": "cpp",
      "code_content": "if (count == n && dist[currPos][0] > 0) {\n        int totalCost = cost + dist[currPos][0];\n        if (totalCost < minCost) {\n            minCost = totalCost;\n            for (int i = 0; i < n; i++) {\n                bestPath[i] = currentPath[i];\n            }\n            bestPath[n] = 0;\n        }\n        return;\n    }\n\n    for (int i = 0; i < n; i++) {\n        if (!visited[i] && dist[currPos][i] > 0) {\n            visited[i] = true;\n            currentPath[count] = i;\n            \n            tsp(i, count + 1, cost + dist[currPos][i]);\n            \n            visited[i] = false;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-13-1-1",
      "language": "java",
      "code_content": "if (count == n && dist[currPos][0] > 0) {\n        int totalCost = cost + dist[currPos][0];\n        if (totalCost < minCost) {\n            minCost = totalCost;\n            for (int i = 0; i < n; i++) {\n                bestPath[i] = currentPath[i];\n            }\n            bestPath[n] = 0;\n        }\n        return;\n    }\n\n    for (int i = 0; i < n; i++) {\n        if (!visited[i] && dist[currPos][i] > 0) {\n            visited[i] = true;\n            currentPath[count] = i;\n            \n            tsp(i, count + 1, cost + dist[currPos][i]);\n            \n            visited[i] = false;\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-13-1-2": {
    "cpp": {
      "block_id": "block-1-13-1-2",
      "language": "cpp",
      "code_content": "cin >> n;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cin >> dist[i][j];\n        }\n    }\n\n    visited[0] = true;\n    currentPath[0] = 0;\n\n    tsp(0, 1, 0);\n\n    cout << \"Minimum cost: \" << minCost << endl;\n    cout << \"Path: \";\n    for (int i = 0; i <= n; i++) {\n        cout << bestPath[i]<< \" \";\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-13-1-2",
      "language": "java",
      "code_content": "cin >> n;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            cin >> dist[i][j];\n        }\n    }\n\n    visited[0] = true;\n    currentPath[0] = 0;\n\n    tsp(0, 1, 0);\n\n    cout << \"Minimum cost: \" << minCost << endl;\n    cout << \"Path: \";\n    for (int i = 0; i <= n; i++) {\n        cout << bestPath[i]<< \" \";\n    }\n    cout << endl;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-14-1-0": {
    "cpp": {
      "block_id": "block-1-14-1-0",
      "language": "cpp",
      "code_content": "int temp = state[a];\n    state[a] = state[d];\n    state[d] = state[c];\n    state[c] = state[b];\n    state[b] = temp;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-14-1-0",
      "language": "java",
      "code_content": "int temp = state[a];\n    state[a] = state[d];\n    state[d] = state[c];\n    state[c] = state[b];\n    state[b] = temp;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-14-1-1": {
    "cpp": {
      "block_id": "block-1-14-1-1",
      "language": "cpp",
      "code_content": "switch(move) {\n        case 0: // U\n            cycle4(state, 0, 1, 2, 3);\n            cycle4(state, 8, 20, 13, 16);\n            cycle4(state, 9, 21, 12, 17);\n            break;\n        case 1: // D\n            cycle4(state, 4, 7, 6, 5);\n            cycle4(state, 10, 18, 15, 22);\n            cycle4(state, 11, 19, 14, 23);\n            break;\n        case 2: // F\n            cycle4(state, 8, 9, 10, 11);\n            cycle4(state, 2, 20, 5, 19);\n            cycle4(state, 3, 22, 4, 17);\n            break;\n        case 3: // B\n            cycle4(state, 12, 15, 14, 13);\n            cycle4(state, 0, 16, 6, 23);\n            cycle4(state, 1, 18, 7, 21);\n            break;\n        case 4: // L\n            cycle4(state, 16, 19, 18, 17);\n            cycle4(state, 0, 8, 4, 15);\n            cycle4(state, 3, 11, 7, 12);\n            break;\n        case 5: // R\n            cycle4(state, 20, 21, 22, 23);\n            cycle4(state, 1, 13, 5, 10);\n            cycle4(state, 2, 14, 6, 9);\n            break;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-14-1-1",
      "language": "java",
      "code_content": "switch(move) {\n        case 0: // U\n            cycle4(state, 0, 1, 2, 3);\n            cycle4(state, 8, 20, 13, 16);\n            cycle4(state, 9, 21, 12, 17);\n            break;\n        case 1: // D\n            cycle4(state, 4, 7, 6, 5);\n            cycle4(state, 10, 18, 15, 22);\n            cycle4(state, 11, 19, 14, 23);\n            break;\n        case 2: // F\n            cycle4(state, 8, 9, 10, 11);\n            cycle4(state, 2, 20, 5, 19);\n            cycle4(state, 3, 22, 4, 17);\n            break;\n        case 3: // B\n            cycle4(state, 12, 15, 14, 13);\n            cycle4(state, 0, 16, 6, 23);\n            cycle4(state, 1, 18, 7, 21);\n            break;\n        case 4: // L\n            cycle4(state, 16, 19, 18, 17);\n            cycle4(state, 0, 8, 4, 15);\n            cycle4(state, 3, 11, 7, 12);\n            break;\n        case 5: // R\n            cycle4(state, 20, 21, 22, 23);\n            cycle4(state, 1, 13, 5, 10);\n            cycle4(state, 2, 14, 6, 9);\n            break;\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-14-1-2": {
    "cpp": {
      "block_id": "block-1-14-1-2",
      "language": "cpp",
      "code_content": "for (int i = 0; i < FACES; i++) {\n        if (state[i] != solved[i]) return 0;\n    }\n    return 1;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-14-1-2",
      "language": "java",
      "code_content": "for (int i = 0; i < FACES; i++) {\n        if (state[i] != solved[i]) return 0;\n    }\n    return 1;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-14-1-3": {
    "cpp": {
      "block_id": "block-1-14-1-3",
      "language": "cpp",
      "code_content": "qFront = 0;\n    qRear = 0;\n\n    for (int i = 0; i < FACES; i++) {\n        queue[qRear].state[i] = initial[i];\n    }\n    queue[qRear].moves = 0;\n    qRear++;\n\n    while (qFront < qRear) {\n        Node curr = queue[qFront++];\n\n        if (curr.moves >= 7) continue;\n\n        for (int m = 0; m < 6; m++) {\n            Node next = curr;\n            next.moves = curr.moves + 1;\n            applyMove(next.state, m);\n\n            if (isSolved(next.state)) {\n                return next.moves;\n            }\n\n            if (next.moves < 7 && qRear < MAX_STATES) {\n                queue[qRear++] = next;\n            }\n        }\n    }\n\n    return -1;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-14-1-3",
      "language": "java",
      "code_content": "qFront = 0;\n    qRear = 0;\n\n    for (int i = 0; i < FACES; i++) {\n        queue[qRear].state[i] = initial[i];\n    }\n    queue[qRear].moves = 0;\n    qRear++;\n\n    while (qFront < qRear) {\n        Node curr = queue[qFront++];\n\n        if (curr.moves >= 7) continue;\n\n        for (int m = 0; m < 6; m++) {\n            Node next = curr;\n            next.moves = curr.moves + 1;\n            applyMove(next.state, m);\n\n            if (isSolved(next.state)) {\n                return next.moves;\n            }\n\n            if (next.moves < 7 && qRear < MAX_STATES) {\n                queue[qRear++] = next;\n            }\n        }\n    }\n\n    return -1;",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-15-1-0": {
    "cpp": {
      "block_id": "block-1-15-1-0",
      "language": "cpp",
      "code_content": "cout << \"Cities near Indore:\\n\";\n    for (int i = 0; i < MAX_CITIES; i++) {\n        cout << (i + 1) << \". \" << cities[i] << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-15-1-0",
      "language": "java",
      "code_content": "cout << \"Cities near Indore:\\n\";\n    for (int i = 0; i < MAX_CITIES; i++) {\n        cout << (i + 1) << \". \" << cities[i] << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-15-1-1": {
    "cpp": {
      "block_id": "block-1-15-1-1",
      "language": "cpp",
      "code_content": "cout << \"Distance Matrix (in km):\\n\";\n    cout << left << setw(9) << \"\";\n    for (int i = 0; i < MAX_CITIES; i++) {\n        cout << left << setw(9) << cities[i];\n    }\n    cout << \"\\n\";\n\n    for (int i = 0; i < MAX_CITIES; i++) {\n        cout << left << setw(9) << cities[i];\n        for (int j = 0; j < MAX_CITIES; j++) {\n            cout << left << setw(9) << dist[i][j];\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-15-1-1",
      "language": "java",
      "code_content": "cout << \"Distance Matrix (in km):\\n\";\n    cout << left << setw(9) << \"\";\n    for (int i = 0; i < MAX_CITIES; i++) {\n        cout << left << setw(9) << cities[i];\n    }\n    cout << \"\\n\";\n\n    for (int i = 0; i < MAX_CITIES; i++) {\n        cout << left << setw(9) << cities[i];\n        for (int j = 0; j < MAX_CITIES; j++) {\n            cout << left << setw(9) << dist[i][j];\n        }\n        cout << \"\\n\";\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-15-1-2": {
    "cpp": {
      "block_id": "block-1-15-1-2",
      "language": "cpp",
      "code_content": "cout << \"Greedy Travel Plan (Nearest Neighbour):\\n\";\n    bool visited[MAX_CITIES] = {false};\n    int curr = 0;\n    visited[curr] = true;\n    int totalDist = 0;\n\n    cout << cities[curr];\n\n    for (int i = 0; i < MAX_CITIES - 1; i++) {\n        int nextCity = -1;\n        int minD = INF;\n\n        for (int j = 0; j < MAX_CITIES; j++) {\n            if (!visited[j] && dist[curr][j] < minD) {\n                minD = dist[curr][j];\n                nextCity = j;\n            }\n        }\n\n        visited[nextCity] = true;\n        totalDist += minD;\n        cout << \" -> \" << cities[nextCity];\n        curr = nextCity;\n    }\n\n    totalDist += dist[curr][0];\n    cout << \" -> \" << cities[0] << \"\\n\";\n    cout << \"Total Distance: \" << totalDist << \" km\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-15-1-2",
      "language": "java",
      "code_content": "cout << \"Greedy Travel Plan (Nearest Neighbour):\\n\";\n    bool visited[MAX_CITIES] = {false};\n    int curr = 0;\n    visited[curr] = true;\n    int totalDist = 0;\n\n    cout << cities[curr];\n\n    for (int i = 0; i < MAX_CITIES - 1; i++) {\n        int nextCity = -1;\n        int minD = INF;\n\n        for (int j = 0; j < MAX_CITIES; j++) {\n            if (!visited[j] && dist[curr][j] < minD) {\n                minD = dist[curr][j];\n                nextCity = j;\n            }\n        }\n\n        visited[nextCity] = true;\n        totalDist += minD;\n        cout << \" -> \" << cities[nextCity];\n        curr = nextCity;\n    }\n\n    totalDist += dist[curr][0];\n    cout << \" -> \" << cities[0] << \"\\n\";\n    cout << \"Total Distance: \" << totalDist << \" km\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-16-1-0": {
    "cpp": {
      "block_id": "block-1-16-1-0",
      "language": "cpp",
      "code_content": "int index = hashFunction(bookId);\n    Card* newCard = new Card();\n    newCard->bookId = bookId;\n    strcpy(newCard->title, title);\n    strcpy(newCard->borrower, borrower);\n    \n    newCard->next = hashTable[index];\n    hashTable[index] = newCard;\n    \n    cout << \"Card issued for Book ID \" << bookId << \"\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-16-1-0",
      "language": "java",
      "code_content": "int index = hashFunction(bookId);\n    Card* newCard = new Card();\n    newCard->bookId = bookId;\n    strcpy(newCard->title, title);\n    strcpy(newCard->borrower, borrower);\n    \n    newCard->next = hashTable[index];\n    hashTable[index] = newCard;\n    \n    cout << \"Card issued for Book ID \" << bookId << \"\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-16-1-1": {
    "cpp": {
      "block_id": "block-1-16-1-1",
      "language": "cpp",
      "code_content": "int index = hashFunction(bookId);\n    Card* current = hashTable[index];\n    while (current != nullptr) {\n        if (current->bookId == bookId) {\n            cout << \"Book ID  : \" << current->bookId << \"\\n\";\n            cout << \"Title    : \" << current->title << \"\\n\";\n            cout << \"Borrower : \" << current->borrower << \"\\n\";\n            return;\n        }\n        current = current->next;\n    }\n    cout << \"Card not found for Book ID \" << bookId << \"\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-16-1-1",
      "language": "java",
      "code_content": "int index = hashFunction(bookId);\n    Card* current = hashTable[index];\n    while (current != nullptr) {\n        if (current->bookId == bookId) {\n            cout << \"Book ID  : \" << current->bookId << \"\\n\";\n            cout << \"Title    : \" << current->title << \"\\n\";\n            cout << \"Borrower : \" << current->borrower << \"\\n\";\n            return;\n        }\n        current = current->next;\n    }\n    cout << \"Card not found for Book ID \" << bookId << \"\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-16-1-2": {
    "cpp": {
      "block_id": "block-1-16-1-2",
      "language": "cpp",
      "code_content": "cout << \"Library Card Records:\\n\";\n    for (int i = 0; i < TABLE_SIZE; i++) {\n        if (hashTable[i] != nullptr) {\n            cout << \"Slot \" << i << \": \";\n            Card* current = hashTable[i];\n            while (current != nullptr) {\n                cout << \"[ID:\" << current->bookId << \", \" << current->title << \", \" << current->borrower << \"]\";\n                if (current->next != nullptr) {\n                    cout << \" -> \";\n                }\n                current = current->next;\n            }\n            cout << \"\\n\";\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-16-1-2",
      "language": "java",
      "code_content": "cout << \"Library Card Records:\\n\";\n    for (int i = 0; i < TABLE_SIZE; i++) {\n        if (hashTable[i] != nullptr) {\n            cout << \"Slot \" << i << \": \";\n            Card* current = hashTable[i];\n            while (current != nullptr) {\n                cout << \"[ID:\" << current->bookId << \", \" << current->title << \", \" << current->borrower << \"]\";\n                if (current->next != nullptr) {\n                    cout << \" -> \";\n                }\n                current = current->next;\n            }\n            cout << \"\\n\";\n        }\n    }",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  },
  "block-1-16-1-3": {
    "cpp": {
      "block_id": "block-1-16-1-3",
      "language": "cpp",
      "code_content": "int index = hashFunction(bookId);\n    Card* current = hashTable[index];\n    Card* prev = nullptr;\n    \n    while (current != nullptr) {\n        if (current->bookId == bookId) {\n            if (prev == nullptr) {\n                hashTable[index] = current->next;\n            } else {\n                prev->next = current->next;\n            }\n            delete current;\n            cout << \"Card removed for Book ID \" << bookId << \"\\n\";\n            return;\n        }\n        prev = current;\n        current = current->next;\n    }\n    cout << \"Card not found for Book ID \" << bookId << \"\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    },
    "java": {
      "block_id": "block-1-16-1-3",
      "language": "java",
      "code_content": "int index = hashFunction(bookId);\n    Card* current = hashTable[index];\n    Card* prev = nullptr;\n    \n    while (current != nullptr) {\n        if (current->bookId == bookId) {\n            if (prev == nullptr) {\n                hashTable[index] = current->next;\n            } else {\n                prev->next = current->next;\n            }\n            delete current;\n            cout << \"Card removed for Book ID \" << bookId << \"\\n\";\n            return;\n        }\n        prev = current;\n        current = current->next;\n    }\n    cout << \"Card not found for Book ID \" << bookId << \"\\n\";",
      "version": 1,
      "updated_by": "00000000-0000-0000-0000-000000000001",
      "updated_at": "2026-10-11T12:13:30.922Z"
    }
  }
};

export const INITIAL_COMMENTS: BlockComment[] = [];
export const INITIAL_ACTIVITY: ActivityLogItem[] = [];
