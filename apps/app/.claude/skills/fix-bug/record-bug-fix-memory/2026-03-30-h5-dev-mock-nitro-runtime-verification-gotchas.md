# 2026-03-30 H5 开发态 mock / nitro 双模式联调踩坑记录

## 1. 问题现象

`add-nitro-api-runtime` 归档后，表面上 OpenSpec 校验、运行时测试和归档动作都已经完成，但真正切到 H5 开发态联调时暴露出两类严重问题：

1. `pnpm run dev:h5:mock` 能拉起页面，但浏览器里的真实业务请求返回 `404`，例如：
   - `GET /dev-api/app/activities.listActivitiess`
   - `GET /dev-api/app/dict.queryRepairStates`
2. `pnpm run dev:h5:nitro` 直接启动失败，终端报 Node 无法加载 Nitro 运行时 TypeScript 文件，浏览器侧最终表现为 `3101` 没监听、页面请求失败。

这说明“迁移测试通过”不等于“H5 浏览器里的 mock / nitro 双模式都能真实可用”。

## 2. 实际根因

这次不是单点 bug，而是 3 组运行时假设同时失效：

1. mock 侧存在重复前缀拼接：
   - Alova `baseURL` 已经是 `/dev-api`
   - 运行时请求基址补全还会再次 prepend `/dev-api`
   - mock 定义层历史上也会再补一次代理前缀
   最终会在部分请求路径上形成 `/dev-api/dev-api/...`，浏览器自然拿到 `404`。
2. `vite-plugin-mock-dev-server` 在当前仓库的 Vite 6 配置下，对 alias 快照很敏感；如果直接让它吃完整 alias 集，mock 编译阶段会出现兼容性问题。
3. Nitro standalone 运行路径实际上部分走的是“原生 Node 直接执行 `server/**/*.ts`”：
   - Node 22 需要 `--experimental-strip-types` 才能直接吃 TypeScript
   - Nitro 会把 `server/modules/**` 当作自己的 `modules` 目录自动扫描，和仓库业务模块目录撞名
   - 一旦走原生 Node 解析，`server/**` 内的 `@/` alias 和无扩展名相对导入都不成立

## 3. 关键误导点

最容易把排错带偏的误导信号有 4 个：

1. 看到浏览器 `404`，很容易先怀疑新迁移的 Nitro endpoint 没挂上；但第一条可信线索其实是浏览器 Network 里的真实请求 URL，里面已经出现了错误的重复 `/dev-api` 前缀。
2. 看到 `dev:h5:nitro` 报 TypeScript 导入失败，很容易把注意力放到单个模块文件；但真正的问题是整个 `server/**` 运行时导入约束，不是某一个 endpoint 文件坏了。
3. 看到运行时测试通过，很容易误以为 H5 联调也已经通过；但这些测试并没有替代真实浏览器页面、真实 dev server、真实网络路径的端到端验证。
4. 看到跨端口请求失败，很容易直接改 CORS、代理或 `baseURL`；但如果 `3101` 根本没监听，或者请求 URL 先天就拼错，改这些都只是在错误方向上继续加码。

## 4. 有效修复

这次最终证明有效的修复组合是：

1. 收敛 mock URL 前缀拼接，保证 `/dev-api` 只会被补一次：
   - `src/http/runtime-base.ts`
   - `src/api/mock/shared/utils.ts`
2. 在 `vite.config.ts` 里把 mock 编译阶段看到的 alias 收窄到当前插件真正需要的最小集合，避免 Vite 6 下的 mock 插件兼容性问题。
3. 给 Nitro standalone 的命令和 dev 脚本统一注入 `NODE_OPTIONS=--experimental-strip-types`：
   - `package.json`
   - `scripts/dev-h5-nitro.mjs`
4. 在 Nitro 配置中忽略业务目录 `modules/**/*`，避免和 Nitro 自身模块扫描机制冲突：
   - `nitro.config.ts`
   - `vite.config.ts`
5. 把 `server/**/*.ts` 的运行时导入改成原生 Node 可解析的形式：
   - 相对导入显式带 `.ts`
   - 禁止在 `server/**` 运行时代码里继续使用 `@/` alias
6. 增加专门的回归测试，防止以后再把 `server/**` 写回到 Node 无法直接执行的状态：
   - `src/tests/nitro-runtime/server-node-imports.test.ts`

## 5. 验证方式

这条经验成立时，至少要看到下面这些 fresh 证据同时成立：

1. `pnpm exec vitest run src/tests/nitro-runtime` 通过，结果为 `37` 个测试文件、`103` 个测试全部通过。
2. `pnpm run build:nitro:node` 通过，说明 standalone Node 产物可构建。
3. `pnpm run dev:h5:mock` 拉起后，浏览器打开
   - `http://127.0.0.1:3000/#/pages/activity/index?currentCommunityId=COMM_001`
   并且真实请求
   - `GET http://127.0.0.1:3000/dev-api/app/activities.listActivitiess...`
   - `GET http://127.0.0.1:3000/dev-api/app/dict.queryRepairStates`
   都返回 `200`。
4. `pnpm run dev:h5:nitro` 拉起后，`http://127.0.0.1:3101/__nitro/health` 返回 `{"status":"ok","runtime":"nitro-standalone",...}`，并且同一活动页的真实请求
   - `GET http://127.0.0.1:3101/app/activities.listActivitiess...`
   - `GET http://127.0.0.1:3101/app/dict.queryRepairStates`
   都返回 `200`。
5. 最终验证必须基于 fresh 进程、fresh 页面和 fresh Network 记录，不能只根据历史日志、缓存页面或单轮单测结果下结论。

## 6. 后续约束

以后只要再做 Nitro / mock 运行时改造，必须先记住下面几条：

1. “OpenSpec 完成 + runtime 单测通过”不代表前端 H5 联调完成；`dev:h5:mock` 和 `dev:h5:nitro` 都必须做浏览器实测。
2. 只要某段代码位于 `server/**` 且可能被 standalone Nitro / 原生 Node 直接执行，就不要使用 `@/` alias，也不要省略相对导入的 `.ts` 扩展名。
3. 仓库业务模块目录 `server/modules/**` 不能让 Nitro 按内置 modules 机制自动扫描，相关 ignore 配置不能随手删。
4. 浏览器里一旦出现 `/dev-api/dev-api/...`，先检查 URL 前缀补全链路，不要先去改后端接口表或 endpoint registry。
5. 浏览器里一旦出现跨端口请求失败，先确认 `3101` 是否真的启动、`/__nitro/health` 是否可用，再决定是否排查 CORS 或 dispatcher。
