<!--
  一次性提示词
  已完成 已完成任务文件的新建
 -->

# 设计数据结构重构的任务清单，设定一揽子长效运行的数据格式更改任务

1. 全面阅读项目全部的 `test-data.ts` 文件。明确清楚一共有多少个文件需要被检查处理。
2. 模仿 `.taskmaster\has-done-tasks\list-pages-tasks.json` 的格式，新建一揽子的 `test-data.ts` 文件数据格式处理任务。
3. 新建的任务清单，存储在 `.taskmaster\tasks\tasks.json` 文件内。
4. 具体的数据格式处理任务如下：
   - 全部的 `test-data.ts` 文件，必须满足 `.claude\agents\make-list-page.md` 文档的格式要求。
   - 针对 tableData 数组，该数组必须是一个字面量数组。不允许使用函数生成的方式，生成数组。必须使用字面量的形式，直接写数组元素出来。

## 01 回答问题

1. 当前 .taskmaster/tasks/tasks.json 已有 100 条列表页改造任务，全为 status=done，metadata 标注 totalTasks=82（与实际条数不符）。请确认：新的 test-data 重构任务是覆盖现有文件重写。
2. 已统计到 99 个 test-data.ts（完整列表存于 tmp_test_data_list.txt 便于复用，不应该包含任何**特殊路径** apps/admin/src/pages/operation-team/data-manage/-detail-page/manage-community-[id]-test-data.ts）。
3. 任务字段偏好： 你应该去认真阅读 `taskmaster` 的任务文件格式规范，而不是问我怎么填写。这些具体任务字段的写法，应该由你去看清楚 https://github.com/eyaltoledano/claude-task-master 的文档。
4. tags 不需要增加任何业务标签。
5. command 字段留空字符串。
6. metadata 需更新吗。例如 version、description、created/updated、totalTasks/completedTasks 的期望值。
7. 需要在任务 description 中直接写明格式要求（遵循 .claude/agents/make-list-page.md，tableData 必须字面量数组等）。
8. 充分使用 `.taskmaster\tmp_test_data_list.txt` 的文件地址。
