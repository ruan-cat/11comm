# 2026-05-25 边缘、诊断与占位 route 分类复核

本文只支撑 `tasks.md` 中 task 515 的只读分类收口，不支撑 task 496 的完成判定，也不支撑旧服务退役。

## 分类结论

| route                                   | 旧服务来源                                                                   | `apps/api` 来源                                                                   | manifest 状态                                                                          | 分类                            | 收口结论                                                |
| --------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------- |
| `debug-env.get.ts`                      | `apps/admin/server/api/debug-env.get.ts`                                     | `apps/api/server/routes/api/debug-env.get.ts`                                     | 不进入 `runtimeEndpointManifest`，测试明确排除                                         | 诊断 route                      | 排除业务迁移与退役候选，不作为 Phase7 business endpoint |
| `j1-dashboard/center/commonmenu/get.ts` | `apps/admin/server/api/j1-dashboard/center/commonmenu/get.ts`                | `apps/api/server/routes/api/j1-dashboard/center/commonmenu/get.ts`                | 不进入 `runtimeEndpointManifest`，测试明确排除                                         | placeholder 或待决策 route      | 暂不算业务迁移完成，也不作为退役候选                    |
| `org-info/tree.post.ts`                 | `apps/admin/server/api/setting-manage/organize-manage/org-info/tree.post.ts` | `apps/api/server/routes/api/setting-manage/organize-manage/org-info/tree.post.ts` | 已进入 `runtimeEndpointManifest`，phase 为 `phase7-setting-organize-manage-admin-edge` | 应迁入 `apps/api` 的 edge route | 已部分迁入，但仍不可退役                                |

## 证据

- `apps/api/tests/admin/setting-organize-edge-routes.test.ts` 已断言 `debug-env` 与 `j1-dashboard/center/commonmenu/get` 不进入 manifest，并断言 `org-info/tree` route 分发、adapter 与 repository 树构建。
- `apps/api/server/shared/runtime/runtime-endpoints.ts` 仅包含 `/api/setting-manage/organize-manage/org-info/tree`，不包含 `/api/debug-env` 或 `/api/j1-dashboard/center/commonmenu/get`。
- `org-info/tree` 的生产采样仍是 blocker：生产 tree 返回 `data=[]`，同页 `org-info/list` 有 5 条组织数据，生产 `/__nitro/ready` 为 `READY_CONFIGURED`，不是 `DB_READY`。

## 禁止误判

- 本文只关闭 task 515 的 route 分类复核。
- task 496 继续保持未完成，因为它还缺生产 HTTP gate 通过、生产数据正确性、生产 `DB_READY`、shadow-off/fallback 和 retirement ledger。
- `j1-dashboard/center/commonmenu/get` 新旧响应不一致，且前端调用是 `/j1-dashboard/center/commonmenu`，不是 `/get`，不能写成 exact route 已迁移。
