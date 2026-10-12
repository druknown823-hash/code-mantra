-- LabVault: 001_initial_schema.sql
-- Production schema for collaborative mobile code repository

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'member_role') then
    create type member_role as enum ('admin', 'contributor', 'viewer');
  end if;
  if not exists (select 1 from pg_type where typname = 'node_type') then
    create type node_type as enum ('folder', 'question');
  end if;
  if not exists (select 1 from pg_type where typname = 'question_status') then
    create type question_status as enum ('todo', 'in_progress', 'done', 'needs_review');
  end if;
  if not exists (select 1 from pg_type where typname = 'code_lang') then
    create type code_lang as enum ('java', 'cpp');
  end if;
end $$;

-- 1. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_color text not null default '#58a6ff',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Workspaces
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2 and char_length(name) <= 100),
  description text default '',
  created_by uuid references auth.users(id) on delete set null,
  join_code char(6) unique,
  join_code_expires_at timestamptz,
  join_code_role member_role not null default 'viewer',
  require_approval boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Workspace Members
create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'viewer',
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

-- 4. Join Requests
create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- 5. Nodes (Folders & Questions with Fractional Indexing)
create table if not exists public.nodes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  parent_id uuid references public.nodes(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0 and char_length(title) <= 200),
  type node_type not null default 'question',
  position_index text not null,
  description_md text default '',
  default_language code_lang not null default 'java',
  status question_status not null default 'todo',
  tags text[] not null default '{}',
  is_pinned boolean not null default false,
  sample_input text default '',
  sample_output text default '',
  console_output text default '',
  deleted_at timestamptz null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Question Blocks
create table if not exists public.question_blocks (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.nodes(id) on delete cascade,
  block_title text not null check (char_length(trim(block_title)) > 0 and char_length(block_title) <= 120),
  position_index text not null,
  deleted_at timestamptz null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Block Variants (Java / C++ per block)
create table if not exists public.block_variants (
  block_id uuid not null references public.question_blocks(id) on delete cascade,
  language code_lang not null,
  code_content text not null default '',
  version integer not null default 1,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (block_id, language),
  constraint max_block_size check (octet_length(code_content) <= 204800) -- 200 KB limit
);

-- 8. Block Versions (History Snapshots)
create table if not exists public.block_versions (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.question_blocks(id) on delete cascade,
  language code_lang not null,
  code_content text not null,
  saved_by uuid references auth.users(id) on delete set null,
  saved_at timestamptz not null default now()
);

-- 9. Block Comments
create table if not exists public.block_comments (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.question_blocks(id) on delete cascade,
  parent_id uuid references public.block_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  line_ref integer null,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Copy Templates (Boilerplate wrappers)
create table if not exists public.copy_templates (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  language code_lang not null,
  prefix text not null default '',
  suffix text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, language)
);

-- 11. Share Links
create table if not exists public.share_links (
  token text primary key,
  node_id uuid not null references public.nodes(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- 12. Activity Log
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  node_id uuid references public.nodes(id) on delete set null,
  block_id uuid references public.question_blocks(id) on delete set null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- INDEXES
create index if not exists idx_nodes_tree on public.nodes (workspace_id, parent_id, position_index);
create index if not exists idx_nodes_deleted on public.nodes (workspace_id, deleted_at);
create index if not exists idx_blocks_node on public.question_blocks (node_id, position_index);
create index if not exists idx_blocks_deleted on public.question_blocks (deleted_at);
create index if not exists idx_variants_block on public.block_variants (block_id);
create index if not exists idx_versions_block on public.block_versions (block_id, language, saved_at desc);
create index if not exists idx_comments_block on public.block_comments (block_id, resolved);
create index if not exists idx_activity_workspace on public.activity_log (workspace_id, created_at desc);
create index if not exists idx_workspace_members_user on public.workspace_members (user_id);
create index if not exists idx_share_links_node on public.share_links (node_id);

-- Full-text and trigram search indexes
create index if not exists idx_nodes_title_trgm on public.nodes using gin (title gin_trgm_ops);
create index if not exists idx_nodes_search on public.nodes using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description_md, ''))
);
create index if not exists idx_variants_code_search on public.block_variants using gin (
  to_tsvector('simple', coalesce(code_content, ''))
);
