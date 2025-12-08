<!--
  一次性提示词
 -->

# 设计数据结构重构的任务清单，设定一揽子长效运行的数据格式更改任务

1. 全面阅读项目全部的 `test-data.ts` 文件。明确清楚一共有多少个文件需要被检查处理。
2. 模仿 `.taskmaster\has-done-tasks\list-pages-tasks.json` 的格式，新建一揽子的 `test-data.ts` 文件数据格式处理任务。
3. 新建的任务清单，存储在 `.taskmaster\tasks\tasks.json` 文件内。
4. 具体的数据格式处理任务如下：
   - 全部的 `test-data.ts` 文件，必须满足 `.claude\agents\make-list-page.md` 文档的格式要求。
   - 针对 tableData 数组，该数组必须是一个字面量数组。不允许使用函数生成的方式，生成数组。必须使用字面量的形式，直接写数组元素出来。
