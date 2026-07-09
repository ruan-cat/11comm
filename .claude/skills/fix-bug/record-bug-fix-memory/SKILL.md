---
name: record-bug-fix-memory
description: 当用户要求在 bug 已经定位并修复后，记录排错经验、事故结论、AI 记忆更新、复盘摘要或本地 MCP 记忆时使用。这个技能只负责沉淀"发生了什么、为什么会发生、如何修好、以后要记住什么"，不要把它用于实际修复 bug。
metadata:
  template-version: "2.0.0"
---

# 记录 Bug 修复记忆

## 1. 概述

使用这个技能，把已经完成的排错结果沉淀成可复用的长期记忆。

目标是保存根因、有效修复路径、错误假设和验证证据，让后续 agent 不再重复同样的弯路。

核心原则：记录决策链，不记录流水账。

## 2. 存储架构

本技能采用**双层存储架构**：

- **SKILL.md**：只放流程指导 + 案例摘要索引（保持精简，不超过 150 行流程指导）
- **独立案例文件**：每条详细事故记录写成独立的 `YYYY-MM-DD-{slug}.md` 文件，与 SKILL.md 同目录

**禁止**将完整事故记录正文内嵌到 SKILL.md 中。SKILL.md 中只保留摘要索引。

### 2.1. 目录结构

```plain
.claude/skills/fix-bug/record-bug-fix-memory/
├── SKILL.md                              # 流程指导 + 摘要索引
├── 2026-03-28-unocss-color-safelist.md   # 详细案例
├── 2026-03-29-nitro-dual-runtime.md      # 详细案例
└── ...                                   # 更多案例文件
```

### 2.2. 案例文件命名规范

- 格式：`YYYY-MM-DD-{slug}.md`
- slug 使用小写英文 + 短横杠，简明描述事故主题
- 示例：`2026-03-28-unocss-config-driven-color-safelist.md`

### 2.3. 案例文件必填结构

```markdown
# YYYY-MM-DD {事故简述}

## 1. 问题现象

{从用户视角看，哪里坏了}

## 2. 实际根因

{真正出错的地方}

## 3. 关键误导点

{哪个错误假设或误导信号浪费了时间}

## 4. 有效修复

{真正解决问题的改动}

## 5. 验证方式

{证明修复成功的证据}

## 6. 后续约束

{未来 agent 必须先检查什么、避免什么}
```

### 2.4. 摘要索引格式（写在 SKILL.md 的"案例索引"章节中）

```markdown
### {事故简述}（YYYY-MM-DD）

- 详细案例：`YYYY-MM-DD-{slug}.md`
- 适用场景：{一句话描述触发条件}
- 关键约束：{一句话核心教训}
```

## 3. 何时使用

在以下场景使用这个技能：

- 用户要求更新 AI 记忆文档、记录经验教训、补充事故记录、编写复盘摘要。
- bug 已经完成复现，且有效修复路径已经明确。
- 这条经验是仓库特有知识，应该对未来 agent 可见。
- 需要把结论同步到本地 MCP 记忆，例如 Memorix。

以下情况不要使用这个技能：

- bug 还在调查中，根因没有确认。
- 用户要求的是修复实现，而不是经验沉淀。
- 你手里只有猜测、片段证据或临时绕过方案。

## 4. 前置输入

开始写记忆前，必须能回答下面六个问题：

1. 对用户来说，表面现象是什么？
2. 实际根因是什么？
3. 哪个错误假设或误导信号浪费了时间？
4. 最终是哪一个具体改动修好了问题？
5. 用什么验证证明修复成立？
6. 这条记忆应该写到哪里？

如果有任何一个问题答不上来，先完成排错，不要提前写记忆。

## 5. 写到哪里

- **详细案例**：写到本技能目录下的独立 md 文件（默认落点）
- **摘要索引**：同步更新 SKILL.md 的"案例索引"章节
- **跨会话的本地记忆**：写到 Memorix，类型用 `gotcha`、`decision` 或 `problem-solution`
- **仓库级规则**：只有当经验会影响整个仓库的未来 agent 时，才同步写入根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`

## 6. 记录流程

1. 先确认 bug 已经理解清楚并且修复完成。
2. 把结果压缩成 4 到 6 条高信号事实。
3. 创建独立案例文件 `YYYY-MM-DD-{slug}.md`，按必填结构写入详细内容。
4. 在 SKILL.md 的"案例索引"章节追加一条摘要索引。
5. 如果经验影响整个仓库，同步更新根级 AI 记忆文档。
6. 用同样的结论更新 Memorix，并选对记忆类型。
   - 如果当前会话没有实际暴露 Memorix MCP 工具，就必须明确告诉用户"本会话无法写入 Memorix"，不能因为仓库文档声明"可用"就假定真的已经拿到工具。
7. 回读一遍文本，删掉瞬时噪音、猜测和低价值命令历史。
8. 如果用户还要求提交 commit，把提交动作交给单独的 git 工作流处理。

## 7. 写入经验时必须保留的额外信息

如果这次 bug 与仓库已有事故模式相似，写记忆时不要遗漏下面这些额外信息：

- 这次问题是否打破了某个"用户已确认稳定"的基线
- 是否存在"不要乱改"的配置
- 首个可信信号来自哪里，是终端日志、浏览器 console、网络请求，还是构建输出
- 这次修复属于哪一类：依赖实例统一、废弃 API 清理、导入路径修正、类型断言补齐、构建配置兜底、依赖入口兼容、模板层覆盖、样式层补齐、还是启动前置准备
- 这次是否存在误导性很强的假象
- 最终验证是否基于 fresh 进程、fresh 日志和 fresh 页面，而不是历史缓存

## 8. 验证证据写法

未来写事故记录时，优先记录可重复验证的证据，而不是模糊措辞。

- 好的写法：`pnpm exec tsc --noEmit 输出中相关错误为 0`
- 好的写法：`fresh dev.stderr 为空`
- 好的写法：`修复文件均无类型错误输出`
- 好的写法：`pnpm install 后依赖版本一致，peer dependency 无冲突`
- 不好的写法：`应该没问题了`
- 不好的写法：`看起来像是好了`

## 9. 不要写成什么

把根级 AI 记忆经验吸收到技能里，不等于把技能写成修复手册。下面这些内容不应该成为这个技能的主体：

- 大段命令执行流水
- 与当前仓库无关的泛化 debug 理论
- 逐条罗列所有试错过程
- 把某一次临时绕过方案包装成永久规则
- 用"必须执行这些命令"代替"应该记录哪些结论"

## 10. 好记忆的特征

- 解释清楚"为什么会坏"，而不是只写跑了什么命令
- 明确指出第一条可信线索，说明它如何打破错误假设
- 用可复用的方式描述最终修复
- 写出未来 agent 可以重复执行的验证动作
- 让下一次排错明显更短

## 11. 常见错误

- 根因还没确认，就开始写猜测性结论
- 写成很长的 debug 日记，而不是可复用结论
- 仓库级经验写到了错误的位置
- 没把导致绕路的错误假设写出来
- 把修复说明和记忆沉淀混在一起
- 忘了同步本地 MCP 记忆
- 只因为仓库记忆文件声明"有 Memorix"，就跳过当前会话工具可用性核对
- **把完整事故记录正文写进 SKILL.md 而不是独立案例文件**

## 12. 边界

这个技能只负责记忆沉淀和总结。

它不能替代调试、实现、测试和修复工作流。如果 bug 还没修好，先使用合适的调试或实现技能，等结果稳定后再回到这个技能做经验沉淀。

## 13. 案例索引

### `apps/app` lint-staged 误触发全量 lint 事故（2026-07-09）

- 详细案例：`2026-07-09-app-lint-staged-full-project-lint.md`
- 适用场景：lint-staged 中为了处理 App 文件而复用包级 `lint:fix`、`lint` 或 `format` 脚本。
- 关键约束：lint-staged 必须把 staged 文件清单继续传给 linter，禁止用包级全量脚本替代文件级命令。

### `apps/admin/server` 的 drizzle-orm 多实例类型冲突事故（2026-05-26）

- 详细案例：`2026-05-26-drizzle-orm-multi-instance-type-conflict.md`
- 适用场景：Drizzle 查询构建器出现同版本但不同实例的类型不兼容。
- 关键约束：先检查 pnpm 依赖实例数量，再考虑代码或版本调整。

### `apps/admin/server` 的 H3/Nitro 类型错误与废弃 API 事故（2026-05-26）

- 详细案例：`2026-05-26-h3-nitro-deprecated-api-type-error.md`
- 适用场景：H3/Nitro 升级后出现废弃 API 或测试导入路径错误。
- 关键约束：本项目只保留 Node.js 运行时逻辑，不保留无用跨运行时分支。

### `apps/admin` 的 Vue Router 参数类型推断事故（2026-05-26）

- 详细案例：`2026-05-26-vue-router-params-type-inference.md`
- 适用场景：`route.params` 被推断成含 `Record<never, never>` 的联合类型。
- 关键约束：统计类型修复结果时要区分目标错误和已有无关错误。

### `apps/admin/server/db/seed` 的 Drizzle v0.42 insert 类型排除事故（2026-05-26）

- 详细案例：`2026-05-26-drizzle-seed-insert-type-exclusion.md`
- 适用场景：Seed 数据 `.values()` 因默认值列或 nullable 列报 excess property 错误。
- 关键约束：用 `rows<const T ...>` 打破 fresh literal check，不要改 schema 或滥用 `as any`。

### `apps/type` 的软删除与唯一索引冲突事故（2026-05-26）

- 详细案例：`2026-05-26-soft-delete-unique-index-conflict.md`
- 适用场景：软删除后无法重新插入相同唯一值。
- 关键约束：带软删除的唯一索引必须加 `WHERE deleted_at IS NULL`。

### `apps/type` 的外键约束类型不匹配导致迁移失败事故（2026-05-26）

- 详细案例：`2026-05-26-foreign-key-type-mismatch-migration.md`
- 适用场景：Drizzle 迁移因外键两端字段类型不一致失败。
- 关键约束：开发期初始迁移错误优先重建迁移历史，不要用后续迁移覆盖旧错。

### `apps/admin` 的 FieldValues 与 FormVO 类型兼容性事故（2026-05-26）

- 详细案例：`2026-05-26-fieldvalues-formvo-compatibility.md`
- 适用场景：少量 FormVO 与 `FieldValues` 不兼容但同类文件大多正常。
- 关键约束：只修报错类型，避免把不一致误判成全局模式。

### `apps/admin/server` 的 Nitro 接口测试环境配置事故（2026-05-26）

- 详细案例：`2026-05-26-nitro-test-node-env-config.md`
- 适用场景：后端接口测试被放进 jsdom 环境导致数据库能力缺失。
- 关键约束：后端接口测试必须用 node 环境，前端组件测试继续用 jsdom。

### `apps/admin/server/db/seed` 的 Schema 冗余字段与 Patch 脚本脆弱性事故（2026-05-26）

- 详细案例：`2026-05-26-schema-redundant-fields-patch-fragility.md`
- 适用场景：Seed SQL 依赖正则 Patch 脚本反复修补生成结果。
- 关键约束：优先修 schema 源头，禁止用正则长期修改生成 SQL。

### `apps/type` 的跨层级模块循环依赖导致外键缺失事故（2026-05-26）

- 详细案例：`2026-05-26-cross-layer-module-cycle-foreign-key.md`
- 适用场景：低层级模块需要引用高层级表导致循环依赖。
- 关键约束：跨层级引用要重组模块结构，不能强行添加外键。

### 仓库级 Git：Windows CRLF 行尾与「幽灵 modified」事故（2026-05-26）

- 详细案例：`2026-05-26-windows-crlf-ghost-modified.md`
- 适用场景：Windows 上 `git status` 反复显示无语义 diff 的 modified。
- 关键约束：`.gitattributes`、`.editorconfig`、Prettier 和 VSCode 行尾设置必须四层一致。

### `.github/workflows` 的 pnpm v10 `--` 参数透传事故（2026-05-26）

- 详细案例：`2026-05-26-pnpm-v10-double-dash-cli-args.md`
- 适用场景：pnpm run 向 commander CLI 传参时出现多余位置参数。
- 关键约束：pnpm v10+ 传递脚本参数时不要额外加 `--` 分隔符。

### 2026-04-15 合同上传链路的浏览器直传 R2 联调事故（2026-04-15）

- 详细案例：`2026-04-15-contract-upload-r2-browser-direct.md`
- 适用场景：浏览器分段上传 R2 停在失败态但控制面接口看似正常。
- 关键约束：上传链路以浏览器真实 `OPTIONS/PUT` 和服务端 `complete` 为准。

### 2026-04-15 `r2-env.ts` 与 Vercel / R2 环境变量误判事故（2026-04-15）

- 详细案例：`2026-04-15-r2-env-vercel-env-misjudgment.md`
- 适用场景：误以为 Vercel 会自动注入 Cloudflare R2 环境变量。
- 关键约束：R2 配置全部来自 Vercel 项目自定义 env。

### 2026-04-15 `ct_upload_sessions.r2_upload_id` 长度建模错误事故（2026-04-15）

- 详细案例：`2026-04-15-r2-upload-id-length-modeling.md`
- 适用场景：第三方 opaque token 或 upload id 因 varchar 长度不足写库失败。
- 关键约束：云厂商 opaque id、cursor、token 优先用 `text` 建模。

### 2026-04-15 Windows 终端乱码与源码真实乱码混淆事故（2026-04-15）

- 详细案例：`2026-04-15-windows-terminal-garbled-source.md`
- 适用场景：PowerShell 输出中文乱码后误把显示层乱码写回源码。
- 关键约束：修改中文前先确认文件真实 UTF-8 内容，禁止复制终端乱码。

### 2026-04-15 合同附件元数据回填遗漏事故（2026-04-15）

- 详细案例：`2026-04-15-contract-attachment-metadata-backfill.md`
- 适用场景：附件上传保存成功但详情 VO 中合同编号和名称为空。
- 关键约束：附件类详情物化时必须检查业务上下文字段是否透传。

## 14. 本仓库落点覆盖

- 本仓库的 bug 经验优先记录在当前技能目录：`.claude/skills/fix-bug/record-bug-fix-memory/*.md`
- 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 只在用户明确要求同步 AI 记忆文档时才更新
