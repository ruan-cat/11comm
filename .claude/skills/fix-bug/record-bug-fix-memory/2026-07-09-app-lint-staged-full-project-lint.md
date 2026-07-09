# 2026-07-09 App lint-staged 误触发全量 lint 事故

## 1. 问题现象

App 子项目在提交少量 staged 文件时，`lint-staged.config.js` 会执行 `pnpm -F @01s-11comm/app lint:fix`。

该命令会继续运行 App 包内的 `lint:oxlint && lint:eslint`，导致 pre-commit 扫描整个 `apps/app`，而不是只处理本次提交的少量文件。

## 2. 实际根因

`lint-staged.config.js` 已经拿到了 staged 文件列表，但旧实现只用列表判断是否存在 App 文件，然后丢弃文件列表并运行包级全量脚本。

真正的问题不是 linter 本身慢，而是 lint-staged 入口没有把 staged 文件参数继续传递给 linter。

## 3. 关键误导点

`lint:fix` 这个脚本名看起来像是可复用的修复命令，但在 App 包内它是项目级命令，不是文件级命令。

在 lint-staged 中复用包级脚本，会把"提交前校验少量文件"误变成"提交前校验整个子项目"。

## 4. 有效修复

在 `lint-staged.config.js` 内改为根据 staged 文件生成 App 文件级命令：

- 将 `apps/app/...` 转成 App 工作目录下的相对路径。
- 用 `pnpm --dir ./apps/app exec oxlint ... <files>` 只处理 JS/TS/Vue 文件。
- 用 `pnpm --dir ./apps/app exec eslint ... <files>` 处理 App lint 文件集合。
- 保持 App Markdown、根目录 Prettier 和二进制文件的既有分流逻辑。

## 5. 验证方式

- `node --check lint-staged.config.js`
- `git diff --check -- lint-staged.config.js`
- 通过 `node --input-type=module` 调用配置函数，确认 App TS 只生成文件级 oxlint/eslint 命令，且不再包含 `lint:fix`。
- `pnpm --dir .\apps\app exec oxlint --debug=files --no-error-on-unmatched-pattern src\typings.d.ts`
- `pnpm --dir .\apps\app exec eslint --fix-dry-run --no-warn-ignored --ignore-pattern "docs/.vitepress/**" src\typings.d.ts`

## 6. 后续约束

未来修改 lint-staged 时，不要把包级 `lint:fix`、`lint`、`format` 之类全量脚本直接挂到 staged 文件入口。

如果必须复用包内工具链，应使用 `pnpm --dir <package> exec <tool> <files>` 或等价方式，把 staged 文件作为显式参数传入，并确认工具支持这些文件类型。
