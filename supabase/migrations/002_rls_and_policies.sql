-- LabVault: 002_rls_and_policies.sql
-- Role-based access control and security definer helper functions

-- Security Definer role check function
create or replace function public.has_role(ws uuid, min_role member_role)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  user_current_role member_role;
  user_uuid uuid := auth.uid();
begin
  if user_uuid is null then
    return false;
  end if;

  -- If user created the workspace, they implicitly have admin role
  if exists (select 1 from workspaces where id = ws and created_by = user_uuid) then
    return true;
  end if;

  select role into user_current_role
  from workspace_members
  where workspace_id = ws and user_id = user_uuid;

  if user_current_role is null then
    return false;
  end if;

  -- Role hierarchy check
  if min_role = 'viewer' then
    return true; -- viewer, contributor, or admin qualifies
  elsif min_role = 'contributor' then
    return user_current_role in ('contributor', 'admin');
  elsif min_role = 'admin' then
    return user_current_role = 'admin';
  end if;

  return false;
end;
$$;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.join_requests enable row level security;
alter table public.nodes enable row level security;
alter table public.question_blocks enable row level security;
alter table public.block_variants enable row level security;
alter table public.block_versions enable row level security;
alter table public.block_comments enable row level security;
alter table public.copy_templates enable row level security;
alter table public.share_links enable row level security;
alter table public.activity_log enable row level security;

-- PROFILES POLICIES
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- WORKSPACES POLICIES
create policy "workspaces_select_member" on public.workspaces
  for select using (created_by = auth.uid() or has_role(id, 'viewer'));

create policy "workspaces_insert_auth" on public.workspaces
  for insert with check (auth.uid() is not null);

create policy "workspaces_update_admin" on public.workspaces
  for update using (has_role(id, 'admin'));

create policy "workspaces_delete_admin" on public.workspaces
  for delete using (has_role(id, 'admin'));

-- WORKSPACE MEMBERS POLICIES
create policy "members_select" on public.workspace_members
  for select using (has_role(workspace_id, 'viewer'));

create policy "members_insert_admin" on public.workspace_members
  for insert with check (has_role(workspace_id, 'admin'));

create policy "members_update_admin" on public.workspace_members
  for update using (has_role(workspace_id, 'admin'));

create policy "members_delete_admin_or_self" on public.workspace_members
  for delete using (user_id = auth.uid() or has_role(workspace_id, 'admin'));

-- JOIN REQUESTS POLICIES
create policy "join_requests_select" on public.join_requests
  for select using (user_id = auth.uid() or has_role(workspace_id, 'admin'));

create policy "join_requests_insert" on public.join_requests
  for insert with check (user_id = auth.uid());

create policy "join_requests_update_admin" on public.join_requests
  for update using (has_role(workspace_id, 'admin'));

-- NODES POLICIES
create policy "nodes_select" on public.nodes
  for select using (
    has_role(workspace_id, 'viewer') or
    exists (
      select 1 from public.share_links sl
      where sl.node_id = nodes.id
        and (sl.expires_at is null or sl.expires_at > now())
        and sl.revoked = false
    )
  );

create policy "nodes_insert_contributor" on public.nodes
  for insert with check (has_role(workspace_id, 'contributor'));

create policy "nodes_update_contributor" on public.nodes
  for update using (has_role(workspace_id, 'contributor'));

create policy "nodes_delete_admin" on public.nodes
  for delete using (has_role(workspace_id, 'admin'));

-- QUESTION BLOCKS POLICIES
create policy "blocks_select" on public.question_blocks
  for select using (
    has_role((select workspace_id from public.nodes n where n.id = question_blocks.node_id), 'viewer')
  );

create policy "blocks_insert_contributor" on public.question_blocks
  for insert with check (
    has_role((select workspace_id from public.nodes n where n.id = question_blocks.node_id), 'contributor')
  );

create policy "blocks_update_contributor" on public.question_blocks
  for update using (
    has_role((select workspace_id from public.nodes n where n.id = question_blocks.node_id), 'contributor')
  );

create policy "blocks_delete_admin" on public.question_blocks
  for delete using (
    has_role((select workspace_id from public.nodes n where n.id = question_blocks.node_id), 'admin')
  );

-- BLOCK VARIANTS POLICIES
create policy "variants_select" on public.block_variants
  for select using (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_variants.block_id),
      'viewer'
    )
  );

create policy "variants_insert_contributor" on public.block_variants
  for insert with check (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_variants.block_id),
      'contributor'
    )
  );

create policy "variants_update_contributor" on public.block_variants
  for update using (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_variants.block_id),
      'contributor'
    )
  );

create policy "variants_delete_admin" on public.block_variants
  for delete using (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_variants.block_id),
      'admin'
    )
  );

-- BLOCK VERSIONS POLICIES
create policy "versions_select" on public.block_versions
  for select using (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_versions.block_id),
      'viewer'
    )
  );

create policy "versions_insert_contributor" on public.block_versions
  for insert with check (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_versions.block_id),
      'contributor'
    )
  );

-- BLOCK COMMENTS POLICIES
create policy "comments_select" on public.block_comments
  for select using (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_comments.block_id),
      'viewer'
    )
  );

create policy "comments_insert_contributor" on public.block_comments
  for insert with check (
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_comments.block_id),
      'contributor'
    )
  );

create policy "comments_update_author_or_admin" on public.block_comments
  for update using (
    user_id = auth.uid() or
    has_role(
      (select n.workspace_id from public.nodes n
       join public.question_blocks b on b.node_id = n.id
       where b.id = block_comments.block_id),
      'admin'
    )
  );

-- COPY TEMPLATES POLICIES
create policy "copy_templates_select" on public.copy_templates
  for select using (has_role(workspace_id, 'viewer'));

create policy "copy_templates_all_admin" on public.copy_templates
  for all using (has_role(workspace_id, 'admin'));

-- SHARE LINKS POLICIES
create policy "share_links_select_public" on public.share_links
  for select using (revoked = false and (expires_at is null or expires_at > now()));

create policy "share_links_manage_admin" on public.share_links
  for all using (
    has_role((select workspace_id from public.nodes n where n.id = share_links.node_id), 'admin')
  );

-- ACTIVITY LOG POLICIES
create policy "activity_log_select" on public.activity_log
  for select using (has_role(workspace_id, 'viewer'));

create policy "activity_log_insert" on public.activity_log
  for insert with check (has_role(workspace_id, 'contributor'));
