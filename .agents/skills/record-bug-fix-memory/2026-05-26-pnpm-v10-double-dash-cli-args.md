# 2026-05-26 pnpm v10 双横线参数透传事故

## 1. 问题现象

GitHub Actions 中 `vercel-deploy-tool.yaml` 工作流部署失败，报错 `error: too many arguments for 'deploy'. Expected 0 arguments but got 2.`，实际执行的命令为 `vdt deploy -- --diff-base ef2fee6...`。同时 dotenvx 打印 `[MISSING_ENV_FILE] missing .env file` 警告，该警告为非致命的次要问题。

## 2. 实际根因

工作流中使用 `pnpm run deploy -- --diff-base ${{ github.event.before }}` 传递参数。在 pnpm v10 中，`--` 分隔符会被原样透传到脚本命令中（与 npm 不同，npm 会消费掉 `--`）。`deploy` 脚本内部已有一个 `--` 用于分隔 dotenvx 选项与子命令，pnpm 追加的 `-- --diff-base ef2fee6` 使最终执行变为 `vdt deploy -- --diff-base ef2fee6`。commander.js 遇到 `--` 后停止选项解析，将后续内容当作位置参数，而 `deploy` 子命令定义了 0 个位置参数，因此报错。

## 3. 关键误导点

容易误以为 `vdt deploy` 不支持 `--diff-base` 选项，或误以为 dotenvx 的 `.env` 缺失警告是主要错误。实际上 `vdt deploy` 支持 `--diff-base <ref>`，问题纯粹出在 pnpm 的 `--` 透传行为上。

## 4. 有效修复

将工作流中 `pnpm run deploy -- --diff-base ${{ github.event.before }}` 改为 `pnpm run deploy --diff-base ${{ github.event.before }}`，移除额外的 `--`。pnpm v10 中脚本名后面的选项会直接追加到脚本命令末尾。

## 5. 验证方式

工作流重新触发后，`vdt deploy --diff-base <ref>` 正确解析选项，部署流程正常完成。

## 6. 后续约束

在 pnpm v10+ 的 CI 工作流中，通过 `pnpm run <script>` 向脚本传递额外选项时，不要使用 `--` 分隔符。直接写 `pnpm run <script> --flag value` 即可。当脚本内部已使用 `--` 分隔符（如 `dotenvx run ... -- subcommand`）时，额外的 `--` 会产生双重分隔，破坏子命令选项解析。
