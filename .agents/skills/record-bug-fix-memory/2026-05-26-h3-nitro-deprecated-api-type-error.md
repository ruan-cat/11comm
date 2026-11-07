# 2026-05-26 H3/Nitro 类型错误与废弃 API 事故

## 1. 问题现象

`server/middleware/1.logger.ts` 出现 `Property 'respondWith' does not exist on type 'H3Event<EventHandlerRequest>'` 类型错误；`tests/nitro/auth/` 下的测试文件出现 `Cannot find module '../setup-neon'` 模块解析错误。

## 2. 实际根因

`event.respondWith()` 是 H3 v1 的 API，H3 v2 中已被移除。原代码保留了 Cloudflare Workers 的 `respondWith` 分支，但本项目仅运行在 Node.js 环境，该废弃 API 分支不应存在。测试文件中的导入路径 `../setup-neon` 解析错误，实际文件位于 `tests/setup-neon.ts`，需要 `../../setup-neon`。

## 3. 关键误导点

`respondWith` 错误看起来像环境兼容性问题，容易让人去找 Cloudflare Workers 相关的 polyfill 或配置。实际应直接移除该废弃 API 的整个代码分支。

## 4. 有效修复

移除 `server/middleware/1.logger.ts` 中的 Cloudflare Workers 分支代码，只保留 `event.node.res.once("finish", ...)` 的 Node.js 日志方式；将测试文件中 `../setup-neon` 导入路径修正为 `../../setup-neon`。

## 5. 验证方式

`pnpm exec tsc --noEmit` 后 4 个修复文件均无类型错误输出。

## 6. 后续约束

本项目仅运行 Node.js 环境，写中间件时不要保留 Cloudflare Workers、Deno 等其他运行时的兼容代码分支。H3 函数必须从 `"nitro/h3"` 导入，不要从 `"h3"` 直接导入。测试文件移动目录后，必须同步检查所有 `import` 路径层级。
