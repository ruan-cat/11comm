# 2026-05-25 admin resolver fresh scan 复核

本文支撑 `tasks.md` 中 task 509、task 522 与 task 523 的 fresh scan 和后续回归修复收口。task 521 继续保持未完成，因为本轮没有完成全量 admin legacy endpoint 调用端台账。

## 扫描范围

- 扫描 `apps/admin/src/api/**/index.ts`，覆盖 196 个 `index.ts`。
- 扫描 `apps/admin/src/**/*.{ts,vue}`，用于发现绕过 `apps/admin/src/api/**/index.ts` 的页面局部 API。
- 复核 `apps/admin/src/router/rank/rank-route-keys.ts` 中的业务路径归属。

## 主要结论

| 分类                  | 证据                                                                                                                                                                                                                                                                                  | 结论                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| hook 层 resolver 覆盖 | 196 个 `apps/admin/src/api/**/index.ts` 中 109 个包含 `/api/` 字面量，全部使用 `resolveAdminApiRequestUrl(...)`                                                                                                                                                                       | hook index 层未发现绕过 resolver 的旧 `/api/**`               |
| 业务页面 regression   | 首轮扫描发现 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/api.ts` 直接定义 `BASE_URL = "/api/property-manage/contract-manage/draft-contract"`；后续已改为 `resolveAdminApiRequestUrl("/api/property-manage/contract-manage/draft-contract", import.meta.env)` | 这是 rank 业务路径下的真实绕过项，已用专门测试和实现修复      |
| 业务路径归属          | `apps/admin/src/router/rank/rank-route-keys.ts` 存在 `propertyManage.contractManage.draftContract`                                                                                                                                                                                    | 不能把该绕过项归类为 edge 或 system                           |
| system 例外           | `apps/admin/src/api/auth.ts` 直接调用 `/api/auth/**` 与 OAuth 跳转                                                                                                                                                                                                                    | 非 rank 业务路径，单独评审，不混入 admin list resolver 完成率 |
| edge 例外             | `contract-manage/upload` 已使用 resolver 但属于 upload/R2 链路；`org-info/tree` 已使用 resolver 但属于 tree 非 list                                                                                                                                                                   | 继续按 upload/R2 或 edge route 专项处理                       |
| shared 层             | `apps/admin/src/utils/http/api-base-url.ts` 与 `apps/admin/src/composables/use-list-query/index.ts` 仍是共享 resolver/list-query 层                                                                                                                                                   | 共享层本身正常                                                |
| debug/docs/test       | `src/docs/**`、`tests/**`、`@/api/...` import 命中不算旧 `/api/**` 业务 regression                                                                                                                                                                                                    | 不纳入 admin resolver 完成率                                  |

## 任务判定

- task 522 可关闭：fresh scan 已确认 hook index 层覆盖，并把硬编码旧 `/api/**` regression 记录为新任务。
- task 523 可关闭：无法按 `rank-route-keys.ts` 匹配或不应进入普通业务路径的 system、edge、shared、debug/docs/test 已分类。
- task 509 可关闭：首轮发现的 `draft-contract/api.ts` 真实业务 regression 已在同日修复并通过验证；此结论不包含 task 521 的全量调用端台账。
- task 521 不可关闭：本轮没有为每个 admin legacy endpoint 建立完整的业务路径、前端 hook、页面入口和 old `/api/**` 调用端证据台账。

## 回归修复复核

修复范围只包含 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/api.ts` 与 `apps/admin/src/pages/property-manage/contract-manage/draft-contract/tests/api.test.ts`。实现侧新增 `resolveAdminApiRequestUrl` 导入，并把 `BASE_URL` 从裸旧路径改为 resolver 解析结果；四个子端点继续从 `BASE_URL` 拼接。

TDD 证据：新增 `api.test.ts` 后，先运行 `pnpm -F @01s-11comm/admin exec vitest run src/pages/property-manage/contract-manage/draft-contract/tests/api.test.ts`，红灯阶段 3 个测试中 2 个按预期失败，失败点是 shadow proxy 与 direct base URL 场景仍命中裸旧路径。修复实现后，`pnpm -F @01s-11comm/admin exec vitest run src/pages/property-manage/contract-manage/draft-contract/tests/api.test.ts src/api/property-manage/contract-manage/tests/phase7-shadow-resolver.test.ts` 通过，2 文件 36 测试通过；`pnpm -F @01s-11comm/admin typecheck` 通过。

复核证据：定向扫描 `const BASE_URL = "/api/property-manage/contract-manage/draft-contract"` 在 `draft-contract/api.ts` 中已无命中；只剩 resolver 参数和测试期望 URL。后台只读复核子代理也确认该页面和直接相邻 `contract-manage` 前端运行时代码未发现同类裸 `/api/**` 请求基址风险。

边界说明：本次只能关闭 task 509 和新增的 `draft-contract` resolver regression 修复任务，不代表 task 521 的全量 admin legacy endpoint 调用端台账完成，也不代表 admin 页面 Network、shadow-off/fallback、生产 admin H5、生产 `DB_READY`、CRUD 写入闭环或旧 `apps/admin/server` 退役完成。
