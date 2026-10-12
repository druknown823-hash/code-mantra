import fs from 'fs';
import path from 'path';

const parsed = JSON.parse(fs.readFileSync('scripts/parsedData.json', 'utf-8'));

let tsOutput = `// CodeTantra Real Synced Solutions Data
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
    prefix: \`#include <iostream>\\nusing namespace std;\\n\\n\`,
    suffix: \`\\nint main() {\\n    return 0;\\n}\\n\`,
  },
  {
    workspace_id: INITIAL_WORKSPACE.id,
    language: 'java',
    prefix: \`public class Main {\\n\\n\`,
    suffix: \`\\n}\\n\`,
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
`;

const initialBlocks = [];
const initialVariants = {};

parsed.forEach((sol, solIdx) => {
  const pageId = `page-${sol.title.replace(/\./g, '-')}`;
  const posIndex = `p_${String(solIdx).padStart(3, '0')}`;

  tsOutput += `  {
    id: ${JSON.stringify(pageId)},
    workspace_id: INITIAL_WORKSPACE.id,
    parent_id: DS_PRACT_ID,
    title: ${JSON.stringify(sol.title)},
    type: 'question',
    position_index: ${JSON.stringify(posIndex)},
    description_md: '',
    default_language: 'cpp',
    status: 'done',
    tags: ['practical', 'solution'],
    is_pinned: ${sol.title === '1.11.1' ? 'true' : 'false'},
    deleted_at: null,
    created_by: DEMO_USER.id,
    updated_by: DEMO_USER.id,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },\n`;

  sol.blocks.forEach((blk, blkIdx) => {
    const blockId = `block-${sol.title.replace(/\./g, '-')}-${blkIdx}`;
    const blkPos = `b_${String(blkIdx).padStart(2, '0')}`;

    const cleanLabel = (blk.label === 'Main Solution') ? '' : blk.label;

    initialBlocks.push({
      id: blockId,
      node_id: pageId,
      block_title: cleanLabel,
      position_index: blkPos,
      updated_by: '00000000-0000-0000-0000-000000000001',
      updated_at: new Date().toISOString(),
      deleted_at: null,
      created_at: new Date().toISOString(),
    });

    initialVariants[blockId] = {
      cpp: {
        block_id: blockId,
        language: 'cpp',
        code_content: blk.code,
        version: 1,
        updated_by: '00000000-0000-0000-0000-000000000001',
        updated_at: new Date().toISOString(),
      },
      java: {
        block_id: blockId,
        language: 'java',
        code_content: blk.code,
        version: 1,
        updated_by: '00000000-0000-0000-0000-000000000001',
        updated_at: new Date().toISOString(),
      }
    };
  });
});

tsOutput += `];\n\n`;

tsOutput += `export const INITIAL_BLOCKS: QuestionBlock[] = ${JSON.stringify(initialBlocks, null, 2)};\n\n`;
tsOutput += `export const INITIAL_VARIANTS: Record<string, Record<string, BlockVariant>> = ${JSON.stringify(initialVariants, null, 2)};\n\n`;
tsOutput += `export const INITIAL_COMMENTS: BlockComment[] = [];\n`;
tsOutput += `export const INITIAL_ACTIVITY: ActivityLogItem[] = [];\n`;

fs.writeFileSync('src/services/seedData.ts', tsOutput, 'utf-8');
console.log('Successfully wrote src/services/seedData.ts with all 22 Notion synced solutions!');
