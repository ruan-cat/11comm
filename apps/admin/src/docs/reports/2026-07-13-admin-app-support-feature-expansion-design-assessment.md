<!-- 已了解 -->

# 2026-07-13 评估 11comm Admin App 功能扩张设计文档的时效性

## 1. 评估目标

验证 `docs/superpowers/specs/2026-04-25-11comm-admin-app-support-feature-expansion-design.md`（以下简称“本规格”）是否仍然适合作项目后续执行的依据，判断其内容是否过时、是否需要重构，并给出下一步建议。

## 2. 结论摘要

**本规格已经严重过时，不应再作为当前执行依据。**

项目自 2026-04-25 至今（2026-07-13）发生了结构性变化：

- `apps/admin/server` 与 `apps/app/server` 已被删除，统一 API 责任已收拢到 `apps/api`。
- `apps/api` 已经建设了 30+ 个 legacy adapter 模块、160+ 条 admin 路由、228 个模块文件，覆盖了本规格中列举的绝大多数 app legacy 业务域。
- `apps/type` 的 schema 仍停留在原有 admin 业务域（16 个 schema 文件），尚未扩展出 app 运营、资源库存、巡检维保等新领域的事实来源。
- `apps/admin/src/views` 中几乎没有与 `rank-route-keys.ts` 对应的业务页面，admin 后台仍停留在“路由骨架 + 模板示例页”状态。
- 相关的 OpenSpec 长任务 `migrate-superpowers-docs-to-openspec-longtask` 已于 2026-07-11 归档。

因此，本规格中关于“阶段 0~6 路线图”“不删除旧 server”“只做规格沉淀不做代码实现”等核心假设均已与代码库事实不符。如果继续按本规格推进，会导致重复建设或与已完成工作冲突。

## 3. 本规格的关键过时点

### 3.1 旧 Nitro server 的存在假设已不成立

本规格第 10 章“分阶段路线图”阶段 0 明确写明：

> “不删除 `apps/admin/server` 和 `apps/app/server`。”

第 12 章“明确不要做的事情”再次强调：

> “不直接删除 `/app/**`、`/callComponent/**` 兼容路径。”（指旧服务职责）

但实际情况：

```log
$ ls apps/admin/server
不存在

$ ls apps/app/server
不存在

$ git log --oneline -- apps/admin/server | head -1
5b62f58d 🔥 chore: retire admin built-in Nitro server

$ git log --oneline -- apps/app/server | head -1
ae764381 🗑️ chore(app): 删除内置 Nitro server（Phase7 §7B 退役）
```

旧服务不仅已经被删除，而且相关退役审计、台账、证据矩阵都已经作为 OpenSpec artifact 归档在 `openspec/changes/archive/2026-07-11-migrate-superpowers-docs-to-openspec-longtask/` 中。

### 3.2 “只做规格沉淀、不做代码实现”已不符合事实

本规格第 1 章写明：

> “本文档只做规格沉淀，不做代码实现，不直接提交 git。”

但 2026-04-25 至今，代码库新增了大量实现。仅 `apps/api` 一侧：

```log
$ find apps/api/server/routes/api -type f | wc -l
160

$ find apps/api/server/modules -type f | wc -l
228

$ find apps/api/server/modules -maxdepth 1 -type d | sort
activity
appointment
community
complaint
contact
contract
coupon
dev
fee
floor
house
inspection
item-release
maintenance
meter
notice
oa-workflow
operation
owner
parking
patrol
profile
property-application
purchase
renovation
repair
resource
room-unit
setting
staff
video
visit
work-order
```

上述模块已经覆盖了本规格 F-01 至 F-12 中提到的绝大多数 app legacy 域。以 `repair` 为例，`apps/api/server/modules/repair/legacy-endpoints.ts` 已经注册了 23 条 `/app/**` 与 `/callComponent/**` 兼容端点：

```typescript
export const repairLegacyEndpointDefinitions: EndpointDefinition[] = [
  { url: "/app/ownerRepair.listOwnerRepairs", method: ["GET", "POST"], ... },
  { url: "/app/ownerRepair.saveOwnerRepair", method: "POST", ... },
  { url: "/app/ownerRepair.repairDispatch", method: "POST", ... },
  { url: "/app/ownerRepair.grabbingRepair", method: "POST", ... },
  { url: "/app/repair.replyRepairAppraise", method: "POST", ... },
  { url: "/callComponent/ownerRepair.appraiseRepair", method: "POST", ... },
  // ... 共 23 条
];
```

### 3.3 推荐的“方案 A/B/C”已被实际方案超越

本规格第 4 章讨论了三种方案：

- 方案 A：照搬 app legacy API
- 方案 B：以 admin 业务域为主线补齐能力（推荐）
- 方案 C：先做统一 API，不补 admin 页面

实际项目走的是一条更激进的路线：

1. 先建设独立 `apps/api` 统一 Nitro 服务；
2. 将 `apps/admin/server` 和 `apps/app/server` 的接口职责迁移到 `apps/api`；
3. 通过 `runtime.ts` + `legacy-adapter.ts` + `admin-adapter.ts` + `repository.ts` + `service.ts` 的分层模式同时支撑 legacy app 端点和规范 admin 端点；
4. 退役并删除旧服务。

这与本规格的“阶段 0~6”路线图在时间线和动作顺序上都不一致。

### 3.4 优先级与路线图需要重新校准

本规格第 6 章的优先级和第 10 章的阶段路线图基于“旧服务仍在、统一 API 尚未建立”的前提。当前统一 API 已经建立，旧服务已经删除，因此：

- P0“基础设施与兼容底座”已大部分完成；
- 阶段 0“统一 API 与盘点”和阶段 6“legacy 收口”之间的边界已经模糊；
- 真正剩下的工作集中在 **schema 补全** 和 **admin 页面补齐** 两个层面。

## 4. 当前项目的真实状态

### 4.1 API 层：统一服务已经成型

| 维度            | 事实                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------- |
| 独立 Nitro 服务 | `apps/api` 存在，homepage 为 `https://01s-11-server.ruan-cat.com`                                  |
| admin 规范路由  | `apps/api/server/routes/api/**` 共 160 个文件，覆盖 `rank-route-keys.ts` 中的三级业务路径          |
| app legacy 适配 | `apps/api/server/modules/*/legacy-endpoints.ts` 覆盖 30+ 业务域                                    |
| 运行时分层      | `runtime.ts` → `repository.ts` → `service.ts` → `admin-adapter.ts` / `legacy-adapter.ts`           |
| 测试覆盖        | `apps/api/tests/legacy`、`tests/admin`、`tests/modules`、`tests/runtime`、`tests/infra` 等目录存在 |
| 构建与部署      | 支持 `build:node`、`build:vercel`、`build:cloudflare`                                              |

### 4.2 Schema 层：仅覆盖现有 admin 域

```log
$ find apps/type/src/business -name schema.ts | sort
apps/type/src/business/auth/schema.ts
apps/type/src/business/operation-team/schema.ts
apps/type/src/business/property-manage/community-manage/schema.ts
apps/type/src/business/property-manage/contract-manage/schema.ts
apps/type/src/business/property-manage/expense-manage/schema.ts
apps/type/src/business/property-manage/house-property-manage/schema.ts
apps/type/src/business/property-manage/parking-manage/schema.ts
apps/type/src/business/property-manage/patrol-manage/schema.ts
apps/type/src/business/property-manage/repairs-manage/schema.ts
apps/type/src/business/property-manage/report-manage/schema.ts
apps/type/src/business/setting-manage/dictionary-manage/schema.ts
apps/type/src/business/setting-manage/menu-manage/schema.ts
apps/type/src/business/setting-manage/organize-manage/schema.ts
apps/type/src/business/setting-manage/role-manage/schema.ts
apps/type/src/business/setting-manage/system-manage/schema.ts
apps/type/src/business/setting-manage/user-manage/schema.ts
```

共 16 个 schema 文件，全部对应已有 admin 业务路径。本规格建议的 app 运营、资源库存、巡检维保、OA 流程、设备视频等新领域尚未沉淀为 `apps/type/src/business` 下的独立 schema。

### 4.3 Admin 页面层：严重缺失

```log
$ find apps/admin/src/views -maxdepth 4 -type d | wc -l
104

$ find apps/admin/src/views -maxdepth 4 -type d \( -iname "property*" -o -iname "repair*" -o -iname "expense*" -o -iname "parking*" -o -iname "patrol*" -o -iname "report*" -o -iname "community*" -o -iname "house*" -o -iname "owner*" \) | sort
apps/admin/src/views/monitor/logs/operation
```

`apps/admin/src/views` 几乎全是 pure-admin 模板示例页（`table`、`components`、`editor`、`able` 等），与 `rank-route-keys.ts` 中 100+ 条三级业务路径对应的业务页面基本不存在。说明 admin 后台目前仍是“路由注册 + 接口占位”状态，没有形成本规格第 9 章定义的“列表、详情、创建、编辑、删除、业务动作”完整闭环。

### 4.4 OpenSpec 主线已归档

```log
$ find openspec/changes/archive/2026-07-11-migrate-superpowers-docs-to-openspec-longtask -type f | wc -l
47
```

该 OpenSpec change 包含 `tasks.md`、`design.md`、13 份 `specs/*/spec.md`、退役台账、证据矩阵、审计报告等，并已于 2026-07-11 归档。本规格所依赖的“旧 Superpowers 文档转写”工作已经完成。

## 5. 缺口分析：是否需要“尽快补全很多接口”？

### 5.1 不是“接口数量不够”的问题

`apps/api` 的 legacy adapter 已经覆盖了 app 端绝大多数旧接口，admin 规范路由也已经按照 `rank-route-keys.ts` 建立。当前更紧迫的问题不是“补接口”，而是：

1. **接口背后的数据模型不完整**：大量 legacy adapter 仍使用内存 repository 或 mock 数据（`runtime.ts` 在无 `DATABASE_URL` 时回退到 `createRepairRepository()` 等无参构造）。
2. **admin 缺少操作界面**：后台管理员无法真正录入、审核、追踪业务数据。
3. **新领域 schema 缺失**：活动、积分、优惠券、预约、资源库存、OA 流程、设备视频等还没有统一事实来源。

### 5.2 真正需要尽快补全的领域

按本规格原定的 P1“app 高频用户闭环”重新评估，当前最需要补齐的是：

| 领域           | 当前状态                                                           | 缺口                                              |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| 公告           | `apps/api/server/modules/notice` 已存在                            | 缺 `apps/type` 独立 schema、缺 admin 公告管理页   |
| 活动           | `apps/api/server/modules/activity` 已存在                          | 缺 schema、缺 admin 活动管理页                    |
| 报修           | `apps/api/server/modules/repair` 已存在                            | 有 adapter、有 repository 骨架，但 admin 页面缺失 |
| 费用           | `apps/api/server/modules/fee` + `expense-manage` schema 已存在     | admin 页面缺失                                    |
| 停车           | `apps/api/server/modules/parking` + `parking-manage` schema 已存在 | admin 页面缺失                                    |
| 房屋/业主/成员 | `house-property-manage` schema 已存在                              | admin 页面缺失                                    |

可以看出，API 适配层先行，**schema 与 admin UI 严重滞后**。

## 6. 改进建议

### 6.1 立即将本规格标记为归档/替代

建议在本规格头部追加如下声明：

```markdown
> ⚠️ 本文档已过时（superseded）。
> 自 2026-07-11 起，相关迁移工作已通过 OpenSpec change `migrate-superpowers-docs-to-openspec-longtask` 完成归档；
> 旧服务 `apps/admin/server`、`apps/app/server` 已删除，统一 API 责任已收拢至 `apps/api`。
> 后续功能扩张请基于当前代码库重新制定 OpenSpec change。
```

### 6.2 新建 OpenSpec change 替代本规格

建议创建新的 OpenSpec change，例如 `admin-app-capability-backfill`，重点解决：

1. **Schema 补全**：按 `apps/type/src/business/{domain}/{module}/schema.ts` 的 Trinity Pattern，补齐 app 运营、资源库存、巡检维保、OA 流程、设备视频等新域。
2. **Admin 页面补齐**：按 `rank-route-keys.ts` 的三级路径，逐个业务域落地列表、详情、表单、业务动作页面。
3. **数据层落地**：将已有 legacy adapter 从内存/mock repository 切换到 Drizzle repository，确保 `DATABASE_URL` 存在时走真实数据库。
4. **端到端验收**：每个模块必须完成“admin 操作 → apps/api → app 查询/动作 → admin 看到状态变化”的闭环。

### 6.3 按“域”而非“阶段”组织新计划

本规格的第 10 章阶段路线图已经失去时间参考意义。新计划建议按业务域拆分为独立 OpenSpec change 或 task batch：

| 新任务/change                       | 范围                                       | 优先级 |
| ----------------------------------- | ------------------------------------------ | ------ |
| `app-operation-schema-and-admin`    | 公告、活动、优惠券、积分、预约、app 首页   | P1     |
| `property-core-admin-pages`         | 社区、楼栋、单元、房屋、业主、成员管理后台 | P1     |
| `repair-complaint-work-order-admin` | 报修、投诉、工单后台 + 状态流              | P1     |
| `fee-meter-payment-admin`           | 费用、抄表、支付、催缴后台                 | P2     |
| `parking-access-video-admin`        | 停车、道闸、通行、视频、访客后台           | P2     |
| `inspection-maintenance-admin`      | 巡检、点检、维保后台                       | P2     |
| `resource-inventory-purchase-admin` | 物资、仓库、采购、调拨、物品放行           | P3     |
| `oa-workflow-admin`                 | 流程、表单、任务、审批                     | P3     |
| `report-data-center`                | 跨域报表与数据看板                         | P3     |

### 6.4 优先补齐 Admin 页面，而不是继续扩展 legacy adapter

当前 `apps/api` 的 legacy adapter 已经相当完整，继续大量新增 legacy 接口边际收益低。建议把主要投入放到：

1. 为每个已有 admin 业务路径创建真实的 Vue 页面；
2. 将页面与 `apps/api/server/routes/api/**` 的规范接口对接；
3. 通过规范接口写入真实数据库，让 app legacy 端点读取到真实数据。

### 6.5 同步更新技能文档

一旦新增 schema，必须同步：

- `.claude/skills/neon-db-query/SKILL.md` 的数据库表清单；
- `.claude/skills/project-schema-registry/SKILL.md` 中的领域引用；
- 相关 `rank-route-keys.ts` 评审记录。

## 7. 验证清单

| 检查项                             | 证据                                                                                     | 状态                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| 本规格文件已阅读                   | `docs/superpowers/specs/2026-04-25-11comm-admin-app-support-feature-expansion-design.md` | ✅                      |
| `apps/admin/server` 是否存在       | `ls apps/admin/server` → 不存在                                                          | ❌ 已删除               |
| `apps/app/server` 是否存在         | `ls apps/app/server` → 不存在                                                            | ❌ 已删除               |
| `apps/api` 是否成为唯一 Nitro 服务 | `apps/api/package.json` homepage + 160 routes + 228 module files                         | ✅                      |
| app legacy 模块覆盖范围            | `apps/api/server/modules/*` 30+ 域                                                       | ✅ 广泛覆盖             |
| admin 规范路由覆盖范围             | `apps/api/server/routes/api/**` 160 文件                                                 | ✅ 覆盖 rank-route-keys |
| `apps/type` schema 数量            | 16 个 schema.ts                                                                          | ⚠️ 仅覆盖现有 admin 域  |
| admin 业务页面是否存在             | `apps/admin/src/views` 无对应业务目录                                                    | ❌ 严重缺失             |
| OpenSpec 迁移任务状态              | `openspec/changes/archive/2026-07-11-migrate-superpowers-docs-to-openspec-longtask/`     | ✅ 已归档               |

## 8. 最终判断

- **是否过时**：是，本规格已严重过时。
- **是否需要大幅重构**：不需要在原文件上重构，建议直接归档并新建 OpenSpec change。
- **项目是否完成大部分功能**：API 兼容层完成度高，但 schema 和 admin 页面完成度低，不能算“完成大部分功能”。
- **是否需要尽快补全很多接口**：不是“接口”问题，而是 **schema 事实来源** 和 **admin 管理界面** 需要尽快补齐，否则 app 端数据仍然不可维护。
