# Legacy Nitro 退役执行计划

> 面向 Codex goal 可恢复执行。本文定义退役前的执行顺序、证据门禁和回滚策略；只有对应门禁全部通过后，`apps/admin/server` 或 `apps/app/server` 才能进入真实删除步骤。

## 目标与边界

本计划用于把 `apps/admin/server`、`apps/app/server` 中仍承担运行时职责的 legacy Nitro 代码，有序迁移或退役到独立 `apps/api`。执行目标不是一次性删除旧目录，而是建立可恢复、可审计、可回滚的目录级状态机，并在每个文件组具备证据后再进入 rename/delete dry-run。

严格边界：

- 不把 `apps/api` 已存在 handler 误判为旧服务可删；handler 存在只说明目标侧有承接入口。
- 不把本地 mock、单元测试、HTTP 200、manifest allowlist 或 shadow allowlist 单独作为退役证据。
- 不把 admin 证据借给 app，也不把 app 证据借给 admin；每个旧目录必须按自身调用端、数据源、fallback 和生产环境证据独立关闭。
- 不在 fallback-only、guarded write、R2 upload、DB readiness 未闭环时删除源目录。

## 当前阻断总览

| 范围                | 仍阻断的 legacy 源                                                                              | 必须承接到 `apps/api` 的能力                                                                           | 删除前最低状态                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `apps/admin/server` | legacy `db/**`、seed、Nitro config、Drizzle compatibility、R2/upload 源依赖                     | Drizzle/Neon 连接、schema 导出链、seed 执行口径、R2 multipart 控制面、上传状态读回、旧 config 行为替代 | `API_READY` + `CALLER_CUTOVER` + `DATA_READY` + `SHADOW_OFF_VERIFIED` + `DRY_RUN_PASS`            |
| `apps/app/server`   | legacy-dispatch、Nitro build、mock/test 对 `server/modules/**` 的直接依赖、fallback-only 旧路径 | app exact legacy handlers、fallback/shadow-off 策略、测试依赖重定向、生产 app H5 环境验证              | `EXACT_COVERED` 或 `FALLBACK_REPLACED` + `TESTS_REWIRED` + `SHADOW_OFF_VERIFIED` + `DRY_RUN_PASS` |
| `apps/api`          | 尚未完全承接旧服务运行时职责                                                                    | Drizzle/Neon/R2/seed、app exact handlers、fallback/shadow-off、readiness、真实环境验证                 | `TARGET_OWNER`，并能独立通过 admin/app/API 三端验证                                               |

## 目录级状态机

每个待退役目录都必须维护以下状态，不允许跳级：

1. `DISCOVERED`
   - 已通过 fresh scan 识别目录、入口、导入者和 runtime route。
   - 证据文件：route inventory、retirement ledger、rg 调用端结果。

2. `BLOCKED_SOURCE_DEPENDENCY`
   - 目录仍被调用端、构建、测试、fallback、seed、R2、Drizzle 或 config 依赖。
   - 任何一项阻断存在时，退役决策必须保持 `keep-source` 或 `blocked`。

3. `TARGET_MAPPED`
   - `apps/api` 已有明确目标模块、handler、repository 或服务入口。
   - 只说明目标侧存在映射，不说明数据源、生产和回滚完成。

4. `CALLER_CUTOVER_VERIFIED`
   - admin/app 客户端、server 内部调用、mock/test 引用均不再直接依赖旧目录。
   - 证据必须包含 `rg` 结果、构建或测试结果，以及至少一个运行时调用证据。

5. `DATA_READY_VERIFIED`
   - Drizzle/Neon/R2/seed/readiness 已由 `apps/api` 承接。
   - 写入口必须有 write/read/rollback 或明确 blocked-for-execution 证据。

6. `SHADOW_OFF_VERIFIED`
   - 在 shadow/fallback 关闭条件下，目标 handler 仍能完成真实请求。
   - app fallback-only 路径必须先变成 exact handler 或明确迁移替代，不能仅靠旧 fallback 通过。

7. `DRY_RUN_PASS`
   - 已执行目录 rename/delete dry-run，所有验证命令在临时 rename 后通过。
   - dry-run 后必须恢复目录名，并记录恢复命令与结果。

8. `DELETE_APPROVED`
   - 文件组证据矩阵全绿，主代理或人工评审明确批准。
   - 才允许进入真实删除任务；本文不授予删除许可。

## 文件组证据矩阵

执行时为每个文件组补齐一行矩阵。未补齐时不得执行真实删除。

| 文件组                          | 源路径                                                       | 目标路径或替代能力                                                            | 调用端证据                                    | 数据源证据                              | fallback/shadow 证据                    | dry-run 证据             | 回滚证据 | 状态    |
| ------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------- | --------------------------------------- | ------------------------ | -------- | ------- | ------- |
| admin db                        | `apps/admin/server/db/**`                                    | `apps/api` Drizzle/Neon 连接与 `apps/type` schema                             | `rg "server/db                                | from .\*db"` 无旧依赖                   | Neon main 样本、迁移、readiness         | shadow-off 访问 API 成功 | pending  | pending | blocked |
| admin seed                      | `apps/admin/server/seed/**` 或旧 seed 入口                   | `apps/api` seed 命令与数据初始化流程                                          | `rg "seed"` 不指向 admin server               | seed dry-run 或受控环境执行证据         | 不依赖旧 admin Nitro                    | pending                  | pending  | blocked |
| admin nitro config              | `apps/admin/server/**` Nitro config 入口                     | `apps/api` 独立 Nitro 配置与 admin 客户端 API base                            | admin 构建不读取旧 Nitro server               | 不适用或 readiness                      | admin shadow-off 浏览器验证             | pending                  | pending  | blocked |
| admin drizzle compatibility     | 旧 compatibility wrapper                                     | `apps/api` repository/service 层                                              | 无旧 wrapper import                           | Drizzle query 真实库样本                | API readiness 通过                      | pending                  | pending  | blocked |
| admin R2/upload                 | `apps/admin/server` 上传相关模块                             | `apps/api` R2 multipart init/sign/status/abort/complete                       | contract upload caller 切到 API               | R2 session 状态读回、残留清理           | shadow-off 上传流程                     | pending                  | pending  | blocked |
| app legacy-dispatch             | `apps/app/server` dispatch 入口                              | `apps/api` app exact handlers 或替代 registry                                 | app H5 与 API hooks 不走旧 dispatch           | 按业务域真实库样本                      | fallback 关闭后请求成功                 | pending                  | pending  | blocked |
| app Nitro build                 | `apps/app/server` Nitro build 配置                           | app 只作为前端构建，API 由 `apps/api` 提供                                    | `pnpm -F @01s-11comm/app build` 不依赖 server | 不适用                                  | app H5 指向 API                         | pending                  | pending  | blocked |
| app mock/test direct dependency | `apps/app` mock/test 直接 import `server/modules/**`         | 测试 fixture、API contract 或 `apps/api` 模块                                 | `rg "server/modules" apps/app` 仅剩允许清单   | 测试数据来源明确                        | fallback off 测试路径通过               | pending                  | pending  | blocked |
| app fallback-only               | `apps/app/server/modules/**/endpoints.ts` fallback-only 路径 | `apps/api/server/modules/**/legacy-endpoints.ts` exact handler 或明确废弃策略 | 每条路径 caller 分类完成                      | 真实库、blocked write 或 not-applicable | `requires-old-app-server-fallback` 清零 | pending                  | pending  | blocked |

## `apps/api` 承接清单

`apps/api` 必须先成为唯一运行时承接方，再讨论旧目录删除。

### Drizzle/Neon/seed

- `apps/api` 的 Drizzle 配置必须读取 `apps/type` schema，不从 admin/app legacy server 读取表定义。
- Neon readiness 不能只停留在 `READY_CONFIGURED-only`；关键 list/detail/create/update/delete 至少要有真实库样本或明确 blocked-for-execution 决策。
- seed 需要有单独命令、环境变量说明、执行范围和回滚口径，不能依赖 `apps/admin/server` 的旧 seed 入口。

### R2/upload

- R2 multipart 的 `init`、`sign-part`、`status`、`abort`、`complete` 必须在 `apps/api` 内有目标实现与生产证据。
- abort-only 证据不能升级为 complete 可用；complete 后对象清理、session 终态和 R2 residual 检查必须单独记录。
- 上传页面证据必须覆盖调用端，不能只用控制面 HTTP 证据替代。

### app exact handlers

- app legacy-dispatch 中每条还在用的 `/app/**` 或 `/callComponent/**` 路径，需要进入 `apps/api/server/modules/**/legacy-endpoints.ts` exact handler，或明确标为不再支持并有调用端移除证据。
- fallback-only 路径不能进入删除候选；只有 `requires-old-app-server-fallback` 清零后，才能对 `apps/app/server` 做 rename dry-run。
- guarded write、支付、催缴、维修创建、评价等写入口必须保留 blocked 或补齐 write/read/rollback，不得用查询接口证据替代。

### fallback/shadow-off/readiness

- admin 和 app 都需要在 shadow/fallback 关闭条件下验证目标 `apps/api`。
- `apps/api` readiness 必须包含启动、健康检查、关键 endpoint 样本、错误路径样本和生产环境 URL 来源核对。
- 生产地址必须从各子项目 `package.json` 的 `homepage` 字段读取，不能从历史报告或截图反推。

## Codex goal 可恢复执行步骤

每次恢复 goal 时，先读取本文、`admin-retirement-ledger.md`、`app-retirement-ledger.md`、`old-service-retirement-candidates.md` 和最新 `agent-progress.md`。不要从聊天记忆推断当前状态。

### 阶段 1：刷新阻断清单

- [ ] 运行只读 fresh scan，按 admin/app/API 三侧分别记录：
  - `rg "apps/admin/server|server/db|server/seed|server/modules|legacy-dispatch|fallback" apps`
  - `rg "server/modules" apps/app`
  - `rg "R2|upload|multipart|drizzle|Neon|seed|DB_READY|READY_CONFIGURED" apps/admin apps/app apps/api apps/type`
- [ ] 把每个命中归入文件组证据矩阵，不直接删除或移动。
- [ ] 若发现新阻断，先更新计划或 ledger 草案，再继续执行。

### 阶段 2：补齐 `apps/api` 承接

- [ ] 逐文件组确认 `apps/api` 目标模块存在，并记录目标路径。
- [ ] 对 Drizzle/Neon/seed/R2/readiness 分别采集目标侧证据。
- [ ] 对 app fallback-only 路径，按业务模块补 exact handler 或记录废弃依据。
- [ ] 对写入口保持 `blocked-for-execution`，除非已有受控写入、读回和回滚证据。

### 阶段 3：调用端切流

- [ ] admin 客户端必须指向 `apps/api`，并在 shadow-off 条件下完成页面或 HTTP 验证。
- [ ] app 客户端必须指向 `apps/api`，legacy-dispatch 不再参与已迁移路径。
- [ ] mock/test 不能直接 import `apps/app/server/modules/**`；需要改为 fixture、contract 或 `apps/api` 可测试入口。
- [ ] 每次切流后补充文件组矩阵的调用端证据。

### 阶段 4：dry-run rename/delete

只允许在矩阵对应文件组全部达到 `SHADOW_OFF_VERIFIED` 后执行。

推荐 dry-run 顺序：

1. 对单个文件组做临时 rename，例如把候选目录改成 `*.retirement-dry-run`。
2. 运行该文件组对应验证命令。
3. 立即恢复原目录名。
4. 记录 rename、验证、恢复三段命令输出。
5. 多个文件组不得合并 dry-run，避免无法定位失败来源。

示例命令只作为执行模板，实际路径必须由当轮 fresh scan 确认：

```powershell
Rename-Item -LiteralPath apps\app\server\modules\repair -NewName repair.retirement-dry-run
pnpm -F @01s-11comm/app test
Rename-Item -LiteralPath apps\app\server\modules\repair.retirement-dry-run -NewName repair
```

## 验证命令清单

按文件组选择最小但充分的命令组合。命令失败时不得继续删除步骤。

| 验证范围           | 命令                                                                       | 通过标准                                     |
| ------------------ | -------------------------------------------------------------------------- | -------------------------------------------- |
| OpenSpec 格式      | `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` | 无 schema 或格式错误                         |
| type schema/export | `pnpm -F @01s-11comm/type build`                                           | 类型项目构建通过                             |
| API build          | `pnpm -F @01s-11comm/api build`                                            | 独立 API 可构建                              |
| API tests          | `pnpm -F @01s-11comm/api test`                                             | handler/repository/readiness 测试通过        |
| admin build        | `pnpm -F @01s-11comm/admin build`                                          | admin 不依赖旧 Nitro server 构建             |
| admin tests        | `pnpm -F @01s-11comm/admin test`                                           | admin API hooks、页面或服务端测试通过        |
| app build          | `pnpm -F @01s-11comm/app build`                                            | app 不依赖旧 Nitro build 构建                |
| app tests          | `pnpm -F @01s-11comm/app test`                                             | app mock/test 不再直连旧 `server/modules/**` |
| 本地三端           | 启动 `apps/api`、admin、app 本地服务                                       | Network 指向 `apps/api`，无旧 server 请求    |
| 生产三端           | 读取各 `package.json#homepage` 后验证                                      | 生产 API/admin/app 样本请求通过              |

Windows PowerShell 下避免超长单行命令；dry-run 和验证命令应分段执行并保留输出。

## 回滚策略

每个退役动作必须先定义回滚动作。

- rename dry-run 回滚：立即把 `*.retirement-dry-run` 改回原目录名，并重新运行失败前的最小验证命令。
- 真实删除回滚：从同一分支的上一提交恢复被删文件；若未提交，不得进入真实删除。
- 环境切流回滚：恢复 admin/app API base、shadow/fallback 开关和 readiness 配置，并验证旧路径仍可服务。
- 数据回滚：seed、写入口、R2 complete 必须有独立恢复方案；没有恢复方案的写入口保持 blocked。
- 文档回滚：如果证据被证伪，立即把对应文件组状态退回 `BLOCKED_SOURCE_DEPENDENCY`，不得只在聊天中说明。

## 删除许可门槛

同时满足以下条件后，才能由主代理或人工评审开启真实删除任务：

- 目录级状态机达到 `DELETE_APPROVED`。
- 文件组证据矩阵所有必填列都有具体文件、命令或生产证据引用。
- `apps/api` 已承接 Drizzle/Neon/R2/seed、app exact handlers、fallback/shadow-off、readiness 和真实环境验证。
- admin 侧不再有 legacy db/seed、Nitro config、Drizzle compatibility、R2/upload 源依赖。
- app 侧不再有 legacy-dispatch、Nitro build、mock/test 直连 `server/modules/**`、fallback-only 阻断。
- dry-run rename/delete 已逐文件组通过，并有恢复成功记录。
- 回滚策略已经被实际演练或至少通过命令级 dry-run 验证。

## 当前结论

截至本文草案建立时，退役决策保持保守：`apps/admin/server` 与 `apps/app/server` 均不得真实删除。下一轮 Codex goal 应先补齐证据矩阵和 `apps/api` 承接能力，再按目录级状态机推进 dry-run。
