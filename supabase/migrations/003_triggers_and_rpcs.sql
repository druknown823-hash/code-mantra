-- LabVault: 003_triggers_and_rpcs.sql
-- RPCs, rate-limiting, updated_at triggers, and activity logging

-- Rate limit table for join code attempts
create table if not exists public.join_code_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_join_code_attempts_user_time
  on public.join_code_attempts (user_id, attempted_at desc);

-- RPC: join_workspace with 5 attempts/min rate limiting
create or replace function public.join_workspace(code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  recent_attempts_count integer;
  target_ws record;
begin
  if current_user_id is null then
    return jsonb_build_object('success', false, 'error', 'Must be authenticated');
  end if;

  -- 1. Rate limiting check: 5 attempts per minute
  select count(*) into recent_attempts_count
  from public.join_code_attempts
  where user_id = current_user_id
    and attempted_at > now() - interval '1 minute';

  if recent_attempts_count >= 5 then
    return jsonb_build_object(
      'success', false,
      'error', 'Too many attempts. Rate limit exceeded (max 5 attempts per minute). Please wait.'
    );
  end if;

  -- Record this attempt
  insert into public.join_code_attempts (user_id) values (current_user_id);

  -- Clean up old rate limit records
  delete from public.join_code_attempts
  where attempted_at < now() - interval '1 hour';

  -- 2. Look up workspace by join code
  select * into target_ws
  from public.workspaces
  where upper(join_code) = upper(trim(code));

  if target_ws.id is null then
    return jsonb_build_object('success', false, 'error', 'Invalid join code');
  end if;

  if target_ws.join_code_expires_at is not null and target_ws.join_code_expires_at < now() then
    return jsonb_build_object('success', false, 'error', 'This join code has expired');
  end if;

  -- Check if already a member
  if exists (
    select 1 from public.workspace_members
    where workspace_id = target_ws.id and user_id = current_user_id
  ) then
    return jsonb_build_object(
      'success', true,
      'workspace_id', target_ws.id,
      'status', 'already_member',
      'message', 'You are already a member of this workspace'
    );
  end if;

  -- If workspace requires approval, add to join_requests
  if target_ws.require_approval then
    insert into public.join_requests (workspace_id, user_id, status)
    values (target_ws.id, current_user_id, 'pending')
    on conflict (workspace_id, user_id)
    do update set status = 'pending', created_at = now();

    return jsonb_build_object(
      'success', true,
      'workspace_id', target_ws.id,
      'status', 'pending_approval',
      'message', 'Request submitted! An administrator will review your request.'
    );
  end if;

  -- Add user as member directly
  insert into public.workspace_members (workspace_id, user_id, role)
  values (target_ws.id, current_user_id, target_ws.join_code_role)
  on conflict (workspace_id, user_id)
  do update set role = target_ws.join_code_role;

  -- Log activity
  insert into public.activity_log (workspace_id, user_id, action, meta)
  values (
    target_ws.id,
    current_user_id,
    'member_joined',
    jsonb_build_object('role', target_ws.join_code_role, 'via', 'join_code')
  );

  return jsonb_build_object(
    'success', true,
    'workspace_id', target_ws.id,
    'status', 'joined',
    'role', target_ws.join_code_role,
    'workspace_name', target_ws.name
  );
end;
$$;

-- Trigger: auto-update updated_at timestamp
create or replace function public.trigger_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.trigger_set_updated_at();

create or replace trigger set_nodes_updated_at
  before update on public.nodes
  for each row execute function public.trigger_set_updated_at();

create or replace trigger set_blocks_updated_at
  before update on public.question_blocks
  for each row execute function public.trigger_set_updated_at();

create or replace trigger set_variants_updated_at
  before update on public.block_variants
  for each row execute function public.trigger_set_updated_at();

create or replace trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.trigger_set_updated_at();

-- Auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_color, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Coder'),
    '#58a6ff',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
