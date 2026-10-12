-- LabVault: seed.sql
-- Demo data seeding script for "DS Lab" workspace with nested course hierarchy

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  ws_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  unit1_id uuid := '22222222-2222-2222-2222-222222222221'::uuid;
  unit2_id uuid := '22222222-2222-2222-2222-222222222222'::uuid;
  exp1_id uuid := '33333333-3333-3333-3333-333333333331'::uuid;
  exp2_id uuid := '33333333-3333-3333-3333-333333333332'::uuid;
  q1_id uuid := '44444444-4444-4444-4444-444444444441'::uuid;
  q2_id uuid := '44444444-4444-4444-4444-444444444442'::uuid;
  block1_id uuid := '55555555-5555-5555-5555-555555555551'::uuid;
  block2_id uuid := '55555555-5555-5555-5555-555555555552'::uuid;
  block3_id uuid := '55555555-5555-5555-5555-555555555553'::uuid;
begin
  -- 1. Create demo user profile if not exists
  insert into public.profiles (id, display_name, avatar_color)
  values (demo_user_id, 'Prof. Alan Turing', '#58a6ff')
  on conflict (id) do nothing;

  -- 2. Create workspace "DS Lab"
  insert into public.workspaces (id, name, description, created_by, join_code, join_code_role)
  values (
    ws_id,
    'DS Lab',
    'Data Structures & Algorithms Laboratory assignments, units, and solutions.',
    demo_user_id,
    'DS2026',
    'viewer'
  )
  on conflict (id) do nothing;

  -- 3. Membership
  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, demo_user_id, 'admin')
  on conflict (workspace_id, user_id) do update set role = 'admin';

  -- 4. Copy templates for full program wrappers
  insert into public.copy_templates (workspace_id, language, prefix, suffix)
  values
  (
    ws_id,
    'java',
    E'import java.util.Scanner;\n\npublic class Main {\n    static final int MAX = 100;\n    static int top = -1;\n    static int[] stack = new int[MAX];\n\n',
    E'\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println("--- Array Stack Demo ---");\n        insertElement(10);\n        insertElement(20);\n        insertElement(30);\n        System.out.println("isFull: " + (isFull() == 1));\n        System.out.println("isEmpty: " + (isEmpty() == 1));\n    }\n}\n'
  ),
  (
    ws_id,
    'cpp',
    E'#include <iostream>\n#define MAX 100\nusing namespace std;\n\nint stackArr[MAX];\nint top = -1;\n\n',
    E'\nint main() {\n    cout << "--- Array Stack Demo ---\\n";\n    insertElement(10);\n    insertElement(20);\n    insertElement(30);\n    cout << "isFull: " << (isFull() ? "true" : "false") << "\\n";\n    cout << "isEmpty: " << (isEmpty() ? "true" : "false") << "\\n";\n    return 0;\n}\n'
  )
  on conflict (workspace_id, language) do update
  set prefix = excluded.prefix, suffix = excluded.suffix;

  -- 5. Folders
  -- Unit 1
  insert into public.nodes (id, workspace_id, parent_id, title, type, position_index, default_language, status, created_by)
  values (unit1_id, ws_id, null, 'Unit 1: Stacks & Queues', 'folder', 'a0', 'java', 'in_progress', demo_user_id)
  on conflict (id) do nothing;

  -- Unit 2
  insert into public.nodes (id, workspace_id, parent_id, title, type, position_index, default_language, status, created_by)
  values (unit2_id, ws_id, null, 'Unit 2: Linked Lists & Trees', 'folder', 'a1', 'java', 'todo', demo_user_id)
  on conflict (id) do nothing;

  -- Experiment 1 inside Unit 1
  insert into public.nodes (id, workspace_id, parent_id, title, type, position_index, default_language, status, created_by)
  values (exp1_id, ws_id, unit1_id, 'Experiment 1: Linear Data Structures', 'folder', 'a0', 'java', 'in_progress', demo_user_id)
  on conflict (id) do nothing;

  -- Experiment 2 inside Unit 1
  insert into public.nodes (id, workspace_id, parent_id, title, type, position_index, default_language, status, created_by)
  values (exp2_id, ws_id, unit1_id, 'Experiment 2: Circular Queues', 'folder', 'a1', 'java', 'done', demo_user_id)
  on conflict (id) do nothing;

  -- Question 1.1.2: Array Stack
  insert into public.nodes (
    id, workspace_id, parent_id, title, type, position_index,
    description_md, default_language, status, tags,
    sample_input, sample_output, console_output, created_by
  )
  values (
    q1_id,
    ws_id,
    exp1_id,
    'Array Stack',
    'question',
    'a0',
    E'## Problem Statement\nImplement a **Stack** data structure of fixed capacity `MAX = 100` using a sequential 1D array.\n\n### Requirements\n1. `int isFull()`: Return `1` if stack is full (`top == MAX - 1`), else `0`.\n2. `int isEmpty()`: Return `1` if stack has no elements (`top == -1`), else `0`.\n3. `void insertElement(int val)`: Push `val` onto the top of the stack after overflow check.\n\n### Complexity\n- **Time**: $O(1)$ for all operations\n- **Space**: $O(MAX)$ auxiliary storage',
    'java',
    'in_progress',
    ARRAY['stack', 'arrays', 'data-structures'],
    'push 10\npush 20\nisFull\nisEmpty',
    'Pushed 10\nPushed 20\nisFull: false\nisEmpty: false',
    E'[Compilation successful]\nStack initialized with MAX=100\n[Push] Inserted 10 at top=0\n[Push] Inserted 20 at top=1\n[Push] Inserted 30 at top=2\nisFull: false\nisEmpty: false\nAll test assertions passed (3/3)',
    demo_user_id
  )
  on conflict (id) do nothing;

  -- Question 2: Infix to Postfix conversion
  insert into public.nodes (
    id, workspace_id, parent_id, title, type, position_index,
    description_md, default_language, status, tags, created_by
  )
  values (
    q2_id,
    ws_id,
    exp1_id,
    'Infix to Postfix Conversion',
    'question',
    'a1',
    'Convert an arithmetic infix expression into postfix using operator precedence and stack.',
    'java',
    'todo',
    ARRAY['stack', 'expressions', 'parsing'],
    demo_user_id
  )
  on conflict (id) do nothing;

  -- 6. Code Blocks for Question 1.1.2 "Array Stack"
  -- Block 1: int isFull
  insert into public.question_blocks (id, node_id, block_title, position_index, created_by)
  values (block1_id, q1_id, 'int isFull()', 'a0', demo_user_id)
  on conflict (id) do nothing;

  -- Block 2: int isEmpty
  insert into public.question_blocks (id, node_id, block_title, position_index, created_by)
  values (block2_id, q1_id, 'int isEmpty()', 'a1', demo_user_id)
  on conflict (id) do nothing;

  -- Block 3: void insertElement
  insert into public.question_blocks (id, node_id, block_title, position_index, created_by)
  values (block3_id, q1_id, 'void insertElement(int val)', 'a2', demo_user_id)
  on conflict (id) do nothing;

  -- 7. Block Variants (Java and C++ for every block)
  -- Block 1: isFull (Java)
  insert into public.block_variants (block_id, language, code_content, version)
  values (
    block1_id,
    'java',
    E'// Check if stack is full\npublic static int isFull() {\n    if (top == MAX - 1) {\n        return 1;\n    }\n    return 0;\n}',
    1
  )
  on conflict (block_id, language) do update set code_content = excluded.code_content;

  -- Block 1: isFull (C++)
  insert into public.block_variants (block_id, language, code_content, version)
  values (
    block1_id,
    'cpp',
    E'// Check if stack is full\nint isFull() {\n    if (top >= MAX - 1) {\n        return 1;\n    }\n    return 0;\n}',
    1
  )
  on conflict (block_id, language) do update set code_content = excluded.code_content;

  -- Block 2: isEmpty (Java)
  insert into public.block_variants (block_id, language, code_content, version)
  values (
    block2_id,
    'java',
    E'// Check if stack has no elements\npublic static int isEmpty() {\n    if (top == -1) {\n        return 1;\n    }\n    return 0;\n}',
    1
  )
  on conflict (block_id, language) do update set code_content = excluded.code_content;

  -- Block 2: isEmpty (C++)
  insert into public.block_variants (block_id, language, code_content, version)
  values (
    block2_id,
    'cpp',
    E'// Check if stack has no elements\nint isEmpty() {\n    if (top == -1) {\n        return 1;\n    }\n    return 0;\n}',
    1
  )
  on conflict (block_id, language) do update set code_content = excluded.code_content;

  -- Block 3: insertElement (Java)
  insert into public.block_variants (block_id, language, code_content, version)
  values (
    block3_id,
    'java',
    E'// Push element onto stack with overflow guard\npublic static void insertElement(int val) {\n    if (isFull() == 1) {\n        System.err.println("Stack Overflow! Cannot push " + val);\n        return;\n    }\n    top++;\n    stack[top] = val;\n    System.out.println("Pushed: " + val);\n}',
    1
  )
  on conflict (block_id, language) do update set code_content = excluded.code_content;

  -- Block 3: insertElement (C++)
  insert into public.block_variants (block_id, language, code_content, version)
  values (
    block3_id,
    'cpp',
    E'// Push element onto stack with overflow guard\nvoid insertElement(int val) {\n    if (isFull() == 1) {\n        cerr << "Stack Overflow! Cannot push " << val << "\\n";\n        return;\n    }\n    top++;\n    stackArr[top] = val;\n    cout << "Pushed: " << val << "\\n";\n}',
    1
  )
  on conflict (block_id, language) do update set code_content = excluded.code_content;

  -- 8. Block comments
  insert into public.block_comments (id, block_id, user_id, body, line_ref, resolved)
  values
  (
    gen_random_uuid(),
    block3_id,
    demo_user_id,
    'Double check that isFull() is called before incrementing top to avoid index out of bounds.',
    2,
    true
  ),
  (
    gen_random_uuid(),
    block1_id,
    demo_user_id,
    'We can also do: return (top == MAX - 1) ? 1 : 0;',
    3,
    false
  );

  -- 9. Versions snapshot
  insert into public.block_versions (block_id, language, code_content, saved_by)
  values
  (
    block1_id,
    'java',
    E'// Initial draft\npublic static int isFull() {\n    return top == MAX - 1 ? 1 : 0;\n}',
    demo_user_id
  );

end $$;
