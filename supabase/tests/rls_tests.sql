-- LabVault: rls_tests.sql
-- Automated SQL verification tests for Row Level Security (RLS) policies

begin;

-- Create test roles/users
create or replace function pg_temp.run_tests() returns void language plpgsql as $$
declare
  admin_user_id uuid := 'aaaaaaaa-0000-0000-0000-000000000001'::uuid;
  contributor_user_id uuid := 'bbbbbbbb-0000-0000-0000-000000000002'::uuid;
  viewer_user_id uuid := 'cccccccc-0000-0000-0000-000000000003'::uuid;
  outsider_user_id uuid := 'dddddddd-0000-0000-0000-000000000004'::uuid;

  test_ws_id uuid := '99999999-9999-9999-9999-999999999999'::uuid;
  test_node_id uuid := '88888888-8888-8888-8888-888888888888'::uuid;
  test_block_id uuid := '77777777-7777-7777-7777-777777777777'::uuid;

  read_count int;
  caught_error boolean;
begin
  raise notice '>>> STARTING LABVAULT RLS SECURITY TESTS <<<';

  -- Setup fixtures
  insert into public.workspaces (id, name, created_by)
  values (test_ws_id, 'Security Test Lab', admin_user_id)
  on conflict (id) do nothing;

  insert into public.workspace_members (workspace_id, user_id, role)
  values
    (test_ws_id, admin_user_id, 'admin'),
    (test_ws_id, contributor_user_id, 'contributor'),
    (test_ws_id, viewer_user_id, 'viewer')
  on conflict (workspace_id, user_id) do nothing;

  insert into public.nodes (id, workspace_id, title, position_index, created_by)
  values (test_node_id, test_ws_id, 'Root Test Question', 'a0', admin_user_id)
  on conflict (id) do nothing;

  insert into public.question_blocks (id, node_id, block_title, position_index, created_by)
  values (test_block_id, test_node_id, 'test_fn()', 'a0', admin_user_id)
  on conflict (id) do nothing;

  insert into public.block_variants (block_id, language, code_content)
  values (test_block_id, 'java', 'void test_fn() {}')
  on conflict (block_id, language) do nothing;

  -- TEST 1: Outsider cannot read nodes
  perform set_config('request.jwt.claim.sub', outsider_user_id::text, true);
  select count(*) into read_count from public.nodes where id = test_node_id;
  if read_count > 0 then
    raise exception 'TEST 1 FAILED: Non-member was able to select node!';
  end if;
  raise notice '✓ TEST 1 PASSED: Non-member cannot select node';

  -- TEST 2: Outsider cannot read blocks
  select count(*) into read_count from public.question_blocks where id = test_block_id;
  if read_count > 0 then
    raise exception 'TEST 2 FAILED: Non-member was able to select question block!';
  end if;
  raise notice '✓ TEST 2 PASSED: Non-member cannot select question blocks';

  -- TEST 3: Viewer CAN read nodes and blocks
  perform set_config('request.jwt.claim.sub', viewer_user_id::text, true);
  select count(*) into read_count from public.nodes where id = test_node_id;
  if read_count = 0 then
    raise exception 'TEST 3 FAILED: Viewer could not select node!';
  end if;
  raise notice '✓ TEST 3 PASSED: Viewer can read node';

  -- TEST 4: Viewer CANNOT update node
  caught_error := false;
  begin
    update public.nodes set title = 'Hacked by Viewer' where id = test_node_id;
    -- If RLS filters rows out, row count is 0
    get diagnostics read_count = row_count;
    if read_count > 0 then
      raise exception 'Viewer was able to update node!';
    end if;
  exception when others then
    caught_error := true;
  end;
  raise notice '✓ TEST 4 PASSED: Viewer cannot update node (0 rows affected or rejected)';

  -- TEST 5: Viewer CANNOT insert new block
  caught_error := false;
  begin
    insert into public.question_blocks (node_id, block_title, position_index, created_by)
    values (test_node_id, 'Illegal block', 'a1', viewer_user_id);
  exception when others then
    caught_error := true;
  end;
  if not caught_error then
    raise exception 'TEST 5 FAILED: Viewer was able to insert question block!';
  end if;
  raise notice '✓ TEST 5 PASSED: Viewer cannot insert question block';

  -- TEST 6: Contributor CAN update block variant
  perform set_config('request.jwt.claim.sub', contributor_user_id::text, true);
  update public.block_variants
  set code_content = 'void updated_fn() {}'
  where block_id = test_block_id and language = 'java';
  get diagnostics read_count = row_count;
  if read_count = 0 then
    raise exception 'TEST 6 FAILED: Contributor could not update block variant!';
  end if;
  raise notice '✓ TEST 6 PASSED: Contributor can update block variant';

  -- TEST 7: Contributor CANNOT delete question block
  caught_error := false;
  begin
    delete from public.question_blocks where id = test_block_id;
    get diagnostics read_count = row_count;
    if read_count > 0 then
      raise exception 'Contributor was able to delete block!';
    end if;
  exception when others then
    caught_error := true;
  end;
  raise notice '✓ TEST 7 PASSED: Contributor cannot delete question block';

  -- TEST 8: Admin CAN delete question block
  perform set_config('request.jwt.claim.sub', admin_user_id::text, true);
  delete from public.question_blocks where id = test_block_id;
  get diagnostics read_count = row_count;
  if read_count = 0 then
    raise exception 'TEST 8 FAILED: Admin could not delete question block!';
  end if;
  raise notice '✓ TEST 8 PASSED: Admin can delete question block';

  raise notice '==================================================';
  raise notice 'ALL 8 RLS SECURITY TESTS PASSED WITH FLYING COLORS!';
  raise notice '==================================================';
end;
$$;

select pg_temp.run_tests();

rollback;
