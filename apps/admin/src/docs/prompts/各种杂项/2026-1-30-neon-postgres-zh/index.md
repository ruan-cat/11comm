<!-- 一次性任务 已完成 -->

# 制作`neon-postgres`的一系列技能翻译

/openspec:proposal 为我翻译文件

1. 被翻译文件： `.agents\skills\neon-postgres` 目录内全部的 markdown 文件。包括 skills 和 references 内全部子目录的文件。
2. 翻译语言： 将文件从`英文`翻译成`中文`。
3. 中文翻译文件目录： `neon-postgres-zh` 目录。需要在保留 skills 技能文件的文件存储格式的前提下，保留目录层级的前提下，新建相同命名的文件，并完成翻译。
4. 保持技能格式： 你翻译的文件，本质上是对一个 claude code 技能文件做翻译，所以你的翻译必须保留 skills 格式。
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
5. 指定明确的复查机制： 你要翻译的内容非常多，为了避免你在翻译的时候出现明显的缺漏，你应该自己建立一套复查机制，确保翻译的内容按部就班完成，且不会缺漏。
6. 新建多个子代理并行完成任务： 这是数量庞大的相似任务，请你在开始翻译时，适当的新建多个 Background 背景子代理，同时并发地完成翻译任务。
