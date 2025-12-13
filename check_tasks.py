import os
import re

tasks_file = r"openspec/changes/migrate-static-data-to-nitro-query/tasks.md"
base_dir = "."

# 读取任务文件
with open(tasks_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到所有任务
tasks = re.findall(r'- \[ \] (\d+\.\d+\.\d+(?:\.\d+)*) (.+)', content)

completed = 0
for task_num, task_desc in tasks[:50]:
    if '`' in task_desc:
        match = re.search(r'`(.+?)`', task_desc)
        if match:
            file_path = os.path.join(base_dir, match.group(1).replace('/', os.sep))
            exists = os.path.exists(file_path)
            if exists:
                completed += 1
                print(f"[OK] {task_num}")
            else:
                print(f"[NO] {task_num}: {match.group(1)}")

print(f"Summary: {completed}/50 files exist")
