# 实施任务清单

本迁移任务共分为 **6 个阶段**，预计 **490 个子任务**，总工期约 **12 周**。

---

## 阶段 1: 基础设施搭建 (15 任务，1 周)

### 1.1 初始化 apps/type 类型库

- [x] 1.1.1 创建 `apps/type/package.json`（配置为 monorepo 包）
- [x] 1.1.2 创建 `apps/type/tsconfig.json`（TypeScript 配置）
- [x] 1.1.3 创建 `apps/type/src/common/index.ts`（导出 JsonVO, PageDTO, OptionsType）
- [x] 1.1.4 创建 `apps/type/src/business` 目录结构（dev-team, operation-team, property-manage, setting-manage）
- [x] 1.1.5 创建 `apps/type/index.ts` 统一导出文件
- [x] 1.1.6 运行 `pnpm install` 安装 apps/type 依赖
- [x] 1.1.7 运行 `pnpm -F @01s-11comm/type typecheck` 测试类型检查

### 1.2 配置 Nitro 服务端

- [x] 1.2.1 修改 `apps/admin/nitro.config.ts`（设置 `serverDir: "server"`）
- [x] 1.2.2 创建 `apps/admin/server/api` 目录
- [x] 1.2.3 添加 server 别名到 nitro.config.ts（可选）

### 1.3 安装 @tanstack/vue-query

- [x] 1.3.1 运行 `pnpm add @tanstack/vue-query -F @01s-11comm/admin`
- [x] 1.3.2 修改 `apps/admin/src/main.ts` 初始化 VueQueryPlugin
- [x] 1.3.3 配置默认 query 选项（staleTime: 5min, gcTime: 10min）

### 1.4 创建通用工具

- [x] 1.4.1 创建 `apps/admin/src/composables/use-list-query/index.ts`
- [x] 1.4.2 编写 `BaseListQueryParams` 接口
- [x] 1.4.3 编写 `useListQuery` 函数实现

---

## 阶段 2: dev-team 模块迁移 (40 任务，1 周)

### 2.1 config-manage/center

- [x] 2.1.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/center.ts`
- [x] 2.1.2 创建 `server/api/dev-team/config-manage/center/mock-data.ts`
- [x] 2.1.3 创建 `server/api/dev-team/config-manage/center/list.post.ts`
- [x] 2.1.4 创建 `src/api/dev-team/config-manage/center/index.ts`（TanStack Query hook）
- [x] 2.1.5 更新 `src/pages/dev-team/config-manage/center/index.vue` 使用新接口

### 2.2 config-manage/dictionary

- [x] 2.2.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/dictionary.ts`
- [x] 2.2.2 创建 `server/api/dev-team/config-manage/dictionary/mock-data.ts`
- [x] 2.2.3 创建 `server/api/dev-team/config-manage/dictionary/list.post.ts`
- [x] 2.2.4 创建 `src/api/dev-team/config-manage/dictionary/index.ts`
- [x] 2.2.5 更新 `src/pages/dev-team/config-manage/dictionary/index.vue`

### 2.3 config-manage/type

- [x] 2.3.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/type.ts`
- [x] 2.3.2 创建 `server/api/dev-team/config-manage/type/mock-data.ts`
- [x] 2.3.3 创建 `server/api/dev-team/config-manage/type/list.post.ts`
- [x] 2.3.4 创建 `src/api/dev-team/config-manage/type/index.ts`
- [x] 2.3.5 更新 `src/pages/dev-team/config-manage/type/index.vue`

### 2.4 config-manage/item

- [x] 2.4.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/item.ts`
- [x] 2.4.2 创建 `server/api/dev-team/config-manage/item/mock-data.ts`
- [x] 2.4.3 创建 `server/api/dev-team/config-manage/item/list.post.ts`
- [x] 2.4.4 创建 `src/api/dev-team/config-manage/item/index.ts`
- [x] 2.4.5 更新 `src/pages/dev-team/config-manage/item/index.vue`

### 2.5 menu-manage/catalog

- [x] 2.5.1 迁移类型到 `apps/type/src/business/dev-team/menu-manage/catalog.ts`
- [x] 2.5.2 创建 `server/api/dev-team/menu-manage/catalog/mock-data.ts`
- [x] 2.5.3 创建 `server/api/dev-team/menu-manage/catalog/list.post.ts`
- [x] 2.5.4 创建 `src/api/dev-team/menu-manage/catalog/index.ts`
- [x] 2.5.5 更新 `src/pages/dev-team/menu-manage/catalog/index.vue`

### 2.6 menu-manage/group

- [x] 2.6.1 迁移类型到 `apps/type/src/business/dev-team/menu-manage/group.ts`
- [x] 2.6.2 创建 `server/api/dev-team/menu-manage/group/mock-data.ts`
- [x] 2.6.3 创建 `server/api/dev-team/menu-manage/group/list.post.ts`
- [x] 2.6.4 创建 `src/api/dev-team/menu-manage/group/index.ts`
- [x] 2.6.5 更新 `src/pages/dev-team/menu-manage/group/index.vue`

### 2.7 menu-manage/item

- [x] 2.7.1 迁移类型到 `apps/type/src/business/dev-team/menu-manage/item.ts`
- [x] 2.7.2 创建 `server/api/dev-team/menu-manage/item/mock-data.ts`
- [x] 2.7.3 创建 `server/api/dev-team/menu-manage/item/list.post.ts`
- [x] 2.7.4 创建 `src/api/dev-team/menu-manage/item/index.ts`
- [x] 2.7.5 更新 `src/pages/dev-team/menu-manage/item/index.vue`

### 2.8 cache-manage/refresh-cache

- [x] 2.8.1 迁移类型到 `apps/type/src/business/dev-team/cache-manage/refresh-cache.ts`
- [x] 2.8.2 创建 `server/api/dev-team/cache-manage/refresh-cache/mock-data.ts`
- [x] 2.8.3 创建 `server/api/dev-team/cache-manage/refresh-cache/list.post.ts`
- [x] 2.8.4 创建 `src/api/dev-team/cache-manage/refresh-cache/index.ts`
- [x] 2.8.5 更新 `src/pages/dev-team/cache-manage/refresh-cache/index.vue`

---

## 阶段 3: operation-team 模块迁移 (60 任务，2 周)

> 注：operation-team 有 12 个页面，每个页面 5 个步骤，共 60 任务

### 3.1 data-manage/community-information

- [x] 3.1.1 迁移类型到 `apps/type/src/business/operation-team/data-manage/community-information.ts`
- [x] 3.1.2 创建 `server/api/operation-team/data-manage/community-information/mock-data.ts`
- [x] 3.1.3 创建 `server/api/operation-team/data-manage/community-information/list.post.ts`
- [x] 3.1.4 创建 `src/api/operation-team/data-manage/community-information/index.ts`
- [x] 3.1.5 更新 `src/pages/operation-team/data-manage/community-information/index.vue`

### 3.2 data-manage/property-management-company

- [x] 3.2.1 迁移类型到 `apps/type/src/business/operation-team/data-manage/property-company.ts`
- [x] 3.2.2 创建 `server/api/operation-team/data-manage/property-company/mock-data.ts`
- [x] 3.2.3 创建 `server/api/operation-team/data-manage/property-company/list.post.ts`
- [x] 3.2.4 创建 `src/api/operation-team/data-manage/property-company/index.ts`
- [x] 3.2.5 更新 `src/pages/operation-team/data-manage/property-management-company/index.vue`

### 3.3 merchant-manage/merchant-admin

- [x] 3.3.1 迁移类型到 `apps/type/src/business/operation-team/merchant-manage/merchant-admin.ts`
- [x] 3.3.2 创建 `server/api/operation-team/merchant-manage/merchant-admin/mock-data.ts`
- [x] 3.3.3 创建 `server/api/operation-team/merchant-manage/merchant-admin/list.post.ts`
- [x] 3.3.4 创建 `src/api/operation-team/merchant-manage/merchant-admin/index.ts`
- [x] 3.3.5 更新 `src/pages/operation-team/merchant-manage/merchant-admin/index.vue`

### 3.4 merchant-manage/merchant-info

- [x] 3.4.1 迁移类型到 `apps/type/src/business/operation-team/merchant-manage/merchant-info.ts`
- [x] 3.4.2 创建 `server/api/operation-team/merchant-manage/merchant-info/mock-data.ts`
- [x] 3.4.3 创建 `server/api/operation-team/merchant-manage/merchant-info/list.post.ts`
- [x] 3.4.4 创建 `src/api/operation-team/merchant-manage/merchant-info/index.ts`
- [x] 3.4.5 更新 `src/pages/operation-team/merchant-manage/merchant-info/index.vue`

### 3.5 report-configuration/report-component

- [x] 3.5.1 迁移类型到 `apps/type/src/business/operation-team/report-configuration/report-component.ts`
- [x] 3.5.2 创建 `server/api/operation-team/report-configuration/report-component/mock-data.ts`
- [x] 3.5.3 创建 `server/api/operation-team/report-configuration/report-component/list.post.ts`
- [x] 3.5.4 创建 `src/api/operation-team/report-configuration/report-component/index.ts`
- [x] 3.5.5 更新 `src/pages/operation-team/report-configuration/report-component/index.vue`

### 3.6 report-configuration/report-group

- [x] 3.6.1 迁移类型到 `apps/type/src/business/operation-team/report-configuration/report-group.ts`
- [x] 3.6.2 创建 `server/api/operation-team/report-configuration/report-group/mock-data.ts`
- [x] 3.6.3 创建 `server/api/operation-team/report-configuration/report-group/list.post.ts`
- [x] 3.6.4 创建 `src/api/operation-team/report-configuration/report-group/index.ts`
- [x] 3.6.5 更新 `src/pages/operation-team/report-configuration/report-group/index.vue`

### 3.7 report-configuration/report-info

- [x] 3.7.1 迁移类型到 `apps/type/src/business/operation-team/report-configuration/report-info.ts`
- [x] 3.7.2 创建 `server/api/operation-team/report-configuration/report-info/mock-data.ts`
- [x] 3.7.3 创建 `server/api/operation-team/report-configuration/report-info/list.post.ts`
- [x] 3.7.4 创建 `src/api/operation-team/report-configuration/report-info/index.ts`
- [x] 3.7.5 更新 `src/pages/operation-team/report-configuration/report-info/index.vue`

### 3.8 system-manage/change-password

- [x] 3.8.1 迁移类型到 `apps/type/src/business/operation-team/system-manage/change-password.ts`
- [x] 3.8.2 创建 `server/api/operation-team/system-manage/change-password/mock-data.ts`
- [x] 3.8.3 创建 `server/api/operation-team/system-manage/change-password/list.post.ts`
- [x] 3.8.4 创建 `src/api/operation-team/system-manage/change-password/index.ts`
- [x] 3.8.5 更新 `src/pages/operation-team/system-manage/change-password/index.vue`

### 3.9 system-manage/community-configuration

- [x] 3.9.1 迁移类型到 `apps/type/src/business/operation-team/system-manage/community-configuration.ts`
- [x] 3.9.2 创建 `server/api/operation-team/system-manage/community-configuration/mock-data.ts`
- [x] 3.9.3 创建 `server/api/operation-team/system-manage/community-configuration/list.post.ts`
- [x] 3.9.4 创建 `src/api/operation-team/system-manage/community-configuration/index.ts`
- [x] 3.9.5 更新 `src/pages/operation-team/system-manage/community-configuration/index.vue`

### 3.10 system-manage/initialize-cell

- [x] 3.10.1 迁移类型到 `apps/type/src/business/operation-team/system-manage/initialize-cell.ts`
- [x] 3.10.2 创建 `server/api/operation-team/system-manage/initialize-cell/mock-data.ts`
- [x] 3.10.3 创建 `server/api/operation-team/system-manage/initialize-cell/list.post.ts`
- [x] 3.10.4 创建 `src/api/operation-team/system-manage/initialize-cell/index.ts`
- [x] 3.10.5 更新 `src/pages/operation-team/system-manage/initialize-cell/index.vue`

### 3.11 system-manage/register-protocol

- [x] 3.11.1 迁移类型到 `apps/type/src/business/operation-team/system-manage/register-protocol.ts`
- [x] 3.11.2 创建 `server/api/operation-team/system-manage/register-protocol/mock-data.ts`
- [x] 3.11.3 创建 `server/api/operation-team/system-manage/register-protocol/list.post.ts`
- [x] 3.11.4 创建 `src/api/operation-team/system-manage/register-protocol/index.ts`
- [x] 3.11.5 更新 `src/pages/operation-team/system-manage/register-protocol/index.vue`

### 3.12 system-manage/system-config

- [x] 3.12.1 迁移类型到 `apps/type/src/business/operation-team/system-manage/system-config.ts`
- [x] 3.12.2 创建 `server/api/operation-team/system-manage/system-config/mock-data.ts`
- [x] 3.12.3 创建 `server/api/operation-team/system-manage/system-config/list.post.ts`
- [x] 3.12.4 创建 `src/api/operation-team/system-manage/system-config/index.ts`
- [x] 3.12.5 更新 `src/pages/operation-team/system-manage/system-config/index.vue`

---

## 阶段 4: property-manage 模块迁移 (300 任务，6 周)

> 注：property-manage 有 60 个页面，每个页面 5 个步骤，共 300 任务

### 4.1 community-manage 子模块 (8 页面 = 40 任务)

#### 4.1.1 community-manage/building-space-structure-diagram

- [x] 4.1.1.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/building-space-structure-diagram.ts`
- [x] 4.1.1.2 创建 `server/api/property-manage/community-manage/building-space-structure-diagram/mock-data.ts`
- [x] 4.1.1.3 创建 `server/api/property-manage/community-manage/building-space-structure-diagram/list.post.ts`
- [x] 4.1.1.4 创建 `src/api/property-manage/community-manage/building-space-structure-diagram/index.ts`
- [x] 4.1.1.5 更新 `src/pages/property-manage/community-manage/building-space-structure-diagram/index.vue`

#### 4.1.2 community-manage/handing-business

- [x] 4.1.2.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/handing-business.ts`
- [x] 4.1.2.2 创建 `server/api/property-manage/community-manage/handing-business/mock-data.ts`
- [x] 4.1.2.3 创建 `server/api/property-manage/community-manage/handing-business/list.post.ts`
- [x] 4.1.2.4 创建 `src/api/property-manage/community-manage/handing-business/index.ts`
- [ ] 4.1.2.5 更新 `src/pages/property-manage/community-manage/handing-business/index.vue`

#### 4.1.3 community-manage/house-decoration

- [x] 4.1.3.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/house-decoration.ts`
- [x] 4.1.3.2 创建 `server/api/property-manage/community-manage/house-decoration/mock-data.ts`
- [x] 4.1.3.3 创建 `server/api/property-manage/community-manage/house-decoration/list.post.ts`
- [x] 4.1.3.4 创建 `src/api/property-manage/community-manage/house-decoration/index.ts`
- [x] 4.1.3.5 更新 `src/pages/property-manage/community-manage/house-decoration/index.vue`

#### 4.1.4 community-manage/my

- [x] 4.1.4.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/my.ts`
- [x] 4.1.4.2 创建 `server/api/property-manage/community-manage/my/mock-data.ts`
- [x] 4.1.4.3 创建 `server/api/property-manage/community-manage/my/list.post.ts`
- [x] 4.1.4.4 创建 `src/api/property-manage/community-manage/my/index.ts`
- [ ] 4.1.4.5 更新 `src/pages/property-manage/community-manage/my/index.vue`

#### 4.1.5 community-manage/notice

- [x] 4.1.5.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/notice.ts`
- [x] 4.1.5.2 创建 `server/api/property-manage/community-manage/notice/mock-data.ts`
- [x] 4.1.5.3 创建 `server/api/property-manage/community-manage/notice/list.post.ts`
- [x] 4.1.5.4 创建 `src/api/property-manage/community-manage/notice/index.ts`
- [ ] 4.1.5.5 更新 `src/pages/property-manage/community-manage/notice/index.vue`

#### 4.1.6 community-manage/parking-space-structure-diagram

- [x] 4.1.6.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/parking-space-structure-diagram.ts`
- [x] 4.1.6.2 创建 `server/api/property-manage/community-manage/parking-space-structure-diagram/mock-data.ts`
- [x] 4.1.6.3 创建 `server/api/property-manage/community-manage/parking-space-structure-diagram/list.post.ts`
- [x] 4.1.6.4 创建 `src/api/property-manage/community-manage/parking-space-structure-diagram/index.ts`
- [ ] 4.1.6.5 更新 `src/pages/property-manage/community-manage/parking-space-structure-diagram/index.vue`

#### 4.1.7 community-manage/property-register

- [x] 4.1.7.1 迁移类型到 `apps/type/src/business/property-manage/community-manage/property-register.ts`
- [x] 4.1.7.2 创建 `server/api/property-manage/community-manage/property-register/mock-data.ts`
- [x] 4.1.7.3 创建 `server/api/property-manage/community-manage/property-register/list.post.ts`
- [x] 4.1.7.4 创建 `src/api/property-manage/community-manage/property-register/index.ts`
- [ ] 4.1.7.5 更新 `src/pages/property-manage/community-manage/property-register/index.vue`

### 4.2 contract-manage 子模块 (5 页面 = 25 任务)

#### 4.2.1 contract-manage/change

- [x] 4.2.1.1 迁移类型到 `apps/type/src/business/property-manage/contract-manage/change.ts`
- [x] 4.2.1.2 创建 `server/api/property-manage/contract-manage/change/mock-data.ts`
- [x] 4.2.1.3 创建 `server/api/property-manage/contract-manage/change/list.post.ts`
- [x] 4.2.1.4 创建 `src/api/property-manage/contract-manage/change/index.ts`
- [ ] 4.2.1.5 更新 `src/pages/property-manage/contract-manage/change/index.vue`

#### 4.2.2 contract-manage/draft-contract

- [x] 4.2.2.1 迁移类型到 `apps/type/src/business/property-manage/contract-manage/draft-contract.ts`
- [x] 4.2.2.2 创建 `server/api/property-manage/contract-manage/draft-contract/mock-data.ts`
- [x] 4.2.2.3 创建 `server/api/property-manage/contract-manage/draft-contract/list.post.ts`
- [x] 4.2.2.4 创建 `src/api/property-manage/contract-manage/draft-contract/index.ts`
- [ ] 4.2.2.5 更新 `src/pages/property-manage/contract-manage/draft-contract/index.vue`

#### 4.2.3 contract-manage/expire

- [x] 4.2.3.1 迁移类型到 `apps/type/src/business/property-manage/contract-manage/expire.ts`
- [x] 4.2.3.2 创建 `server/api/property-manage/contract-manage/expire/mock-data.ts`
- [x] 4.2.3.3 创建 `server/api/property-manage/contract-manage/expire/list.post.ts`
- [x] 4.2.3.4 创建 `src/api/property-manage/contract-manage/expire/index.ts`
- [ ] 4.2.3.5 更新 `src/pages/property-manage/contract-manage/expire/index.vue`

#### 4.2.4 contract-manage/first-party

- [x] 4.2.4.1 迁移类型到 `apps/type/src/business/property-manage/contract-manage/first-party.ts`
- [x] 4.2.4.2 创建 `server/api/property-manage/contract-manage/first-party/mock-data.ts`
- [x] 4.2.4.3 创建 `server/api/property-manage/contract-manage/first-party/list.post.ts`
- [x] 4.2.4.4 创建 `src/api/property-manage/contract-manage/first-party/index.ts`
- [ ] 4.2.4.5 更新 `src/pages/property-manage/contract-manage/first-party/index.vue`

#### 4.2.5 contract-manage/type

- [x] 4.2.5.1 迁移类型到 `apps/type/src/business/property-manage/contract-manage/type.ts`
- [x] 4.2.5.2 创建 `server/api/property-manage/contract-manage/type/mock-data.ts`
- [x] 4.2.5.3 创建 `server/api/property-manage/contract-manage/type/list.post.ts`
- [x] 4.2.5.4 创建 `src/api/property-manage/contract-manage/type/index.ts`
- [ ] 4.2.5.5 更新 `src/pages/property-manage/contract-manage/type/index.vue`

### 4.3 expense-manage 子模块 (16 页面 = 80 任务)

#### 4.3.1 expense-manage/cancel-fee

- [x] 4.3.1.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/cancel-fee.ts`
- [x] 4.3.1.2 创建 `server/api/property-manage/expense-manage/cancel-fee/mock-data.ts`
- [x] 4.3.1.3 创建 `server/api/property-manage/expense-manage/cancel-fee/list.post.ts`
- [x] 4.3.1.4 创建 `src/api/property-manage/expense-manage/cancel-fee/index.ts`
- [ ] 4.3.1.5 更新 `src/pages/property-manage/expense-manage/cancel-fee/index.vue`

#### 4.3.2 expense-manage/contracte-charge

- [x] 4.3.2.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/contracte-charge.ts`
- [x] 4.3.2.2 创建 `server/api/property-manage/expense-manage/contracte-charge/mock-data.ts`
- [x] 4.3.2.3 创建 `server/api/property-manage/expense-manage/contracte-charge/list.post.ts`
- [x] 4.3.2.4 创建 `src/api/property-manage/expense-manage/contracte-charge/index.ts`
- [ ] 4.3.2.5 更新 `src/pages/property-manage/expense-manage/contracte-charge/index.vue`

#### 4.3.3 expense-manage/discount-apply

- [x] 4.3.3.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/discount-apply.ts`
- [x] 4.3.3.2 创建 `server/api/property-manage/expense-manage/discount-apply/mock-data.ts`
- [x] 4.3.3.3 创建 `server/api/property-manage/expense-manage/discount-apply/list.post.ts`
- [x] 4.3.3.4 创建 `src/api/property-manage/expense-manage/discount-apply/index.ts`
- [ ] 4.3.3.5 更新 `src/pages/property-manage/expense-manage/discount-apply/index.vue`

#### 4.3.4 expense-manage/discount-setting

- [x] 4.3.4.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/discount-setting.ts`
- [x] 4.3.4.2 创建 `server/api/property-manage/expense-manage/discount-setting/mock-data.ts`
- [x] 4.3.4.3 创建 `server/api/property-manage/expense-manage/discount-setting/list.post.ts`
- [x] 4.3.4.4 创建 `src/api/property-manage/expense-manage/discount-setting/index.ts`
- [ ] 4.3.4.5 更新 `src/pages/property-manage/expense-manage/discount-setting/index.vue`

#### 4.3.5 expense-manage/discount-type

- [x] 4.3.5.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/discount-type.ts`
- [x] 4.3.5.2 创建 `server/api/property-manage/expense-manage/discount-type/mock-data.ts`
- [x] 4.3.5.3 创建 `server/api/property-manage/expense-manage/discount-type/list.post.ts`
- [x] 4.3.5.4 创建 `src/api/property-manage/expense-manage/discount-type/index.ts`
- [ ] 4.3.5.5 更新 `src/pages/property-manage/expense-manage/discount-type/index.vue`

#### 4.3.6 expense-manage/expense-item-setting

- [x] 4.3.6.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts`
- [x] 4.3.6.2 创建 `server/api/property-manage/expense-manage/expense-item-setting/mock-data.ts`
- [x] 4.3.6.3 创建 `server/api/property-manage/expense-manage/expense-item-setting/list.post.ts`
- [x] 4.3.6.4 创建 `src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- [ ] 4.3.6.5 更新 `src/pages/property-manage/expense-manage/expense-item-setting/index.vue`

#### 4.3.7 expense-manage/expense-summary-table

- [x] 4.3.7.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/expense-summary-table.ts`
- [x] 4.3.7.2 创建 `server/api/property-manage/expense-manage/expense-summary-table/mock-data.ts`
- [x] 4.3.7.3 创建 `server/api/property-manage/expense-manage/expense-summary-table/list.post.ts`
- [x] 4.3.7.4 创建 `src/api/property-manage/expense-manage/expense-summary-table/index.ts`
- [ ] 4.3.7.5 更新 `src/pages/property-manage/expense-manage/expense-summary-table/index.vue`

#### 4.3.8 expense-manage/house-charge

- [x] 4.3.8.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/house-charge.ts`
- [x] 4.3.8.2 创建 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`
- [x] 4.3.8.3 创建 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
- [x] 4.3.8.4 创建 `src/api/property-manage/expense-manage/house-charge/index.ts`
- [ ] 4.3.8.5 更新 `src/pages/property-manage/expense-manage/house-charge/index.vue`

#### 4.3.9 expense-manage/meter-reading-type

- [x] 4.3.9.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/meter-reading-type.ts`
- [x] 4.3.9.2 创建 `server/api/property-manage/expense-manage/meter-reading-type/mock-data.ts`
- [x] 4.3.9.3 创建 `server/api/property-manage/expense-manage/meter-reading-type/list.post.ts`
- [x] 4.3.9.4 创建 `src/api/property-manage/expense-manage/meter-reading-type/index.ts`
- [ ] 4.3.9.5 更新 `src/pages/property-manage/expense-manage/meter-reading-type/index.vue`

#### 4.3.10 expense-manage/overdue-payment-information

- [x] 4.3.10.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/overdue-payment-information.ts`
- [x] 4.3.10.2 创建 `server/api/property-manage/expense-manage/overdue-payment-information/mock-data.ts`
- [x] 4.3.10.3 创建 `server/api/property-manage/expense-manage/overdue-payment-information/list.post.ts`
- [x] 4.3.10.4 创建 `src/api/property-manage/expense-manage/overdue-payment-information/index.ts`
- [ ] 4.3.10.5 更新 `src/pages/property-manage/expense-manage/overdue-payment-information/index.vue`

#### 4.3.11 expense-manage/payment-review

- [x] 4.3.11.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/payment-review.ts`
- [x] 4.3.11.2 创建 `server/api/property-manage/expense-manage/payment-review/mock-data.ts`
- [x] 4.3.11.3 创建 `server/api/property-manage/expense-manage/payment-review/list.post.ts`
- [x] 4.3.11.4 创建 `src/api/property-manage/expense-manage/payment-review/index.ts`
- [ ] 4.3.11.5 更新 `src/pages/property-manage/expense-manage/payment-review/index.vue`

#### 4.3.12 expense-manage/refund-review

- [x] 4.3.12.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/refund-review.ts`
- [x] 4.3.12.2 创建 `server/api/property-manage/expense-manage/refund-review/mock-data.ts`
- [x] 4.3.12.3 创建 `server/api/property-manage/expense-manage/refund-review/list.post.ts`
- [x] 4.3.12.4 创建 `src/api/property-manage/expense-manage/refund-review/index.ts`
- [ ] 4.3.12.5 更新 `src/pages/property-manage/expense-manage/refund-review/index.vue`

#### 4.3.13 expense-manage/reminder-for-overdue-payments

- [x] 4.3.13.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/reminder-for-overdue-payments.ts`
- [x] 4.3.13.2 创建 `server/api/property-manage/expense-manage/reminder-for-overdue-payments/mock-data.ts`
- [x] 4.3.13.3 创建 `server/api/property-manage/expense-manage/reminder-for-overdue-payments/list.post.ts`
- [x] 4.3.13.4 创建 `src/api/property-manage/expense-manage/reminder-for-overdue-payments/index.ts`
- [ ] 4.3.13.5 更新 `src/pages/property-manage/expense-manage/reminder-for-overdue-payments/index.vue`

#### 4.3.14 expense-manage/reprint-voucher

- [x] 4.3.14.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/reprint-voucher.ts`
- [x] 4.3.14.2 创建 `server/api/property-manage/expense-manage/reprint-voucher/mock-data.ts`
- [x] 4.3.14.3 创建 `server/api/property-manage/expense-manage/reprint-voucher/list.post.ts`
- [x] 4.3.14.4 创建 `src/api/property-manage/expense-manage/reprint-voucher/index.ts`
- [ ] 4.3.14.5 更新 `src/pages/property-manage/expense-manage/reprint-voucher/index.vue`

#### 4.3.15 expense-manage/vehicle-charge

- [x] 4.3.15.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/vehicle-charge.ts`
- [x] 4.3.15.2 创建 `server/api/property-manage/expense-manage/vehicle-charge/mock-data.ts`
- [x] 4.3.15.3 创建 `server/api/property-manage/expense-manage/vehicle-charge/list.post.ts`
- [x] 4.3.15.4 创建 `src/api/property-manage/expense-manage/vehicle-charge/index.ts`
- [ ] 4.3.15.5 更新 `src/pages/property-manage/expense-manage/vehicle-charge/index.vue`

#### 4.3.16 expense-manage/water-and-electricity-meter-reading

- [x] 4.3.16.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/water-and-electricity-meter-reading.ts`
- [x] 4.3.16.2 创建 `server/api/property-manage/expense-manage/water-and-electricity-meter-reading/mock-data.ts`
- [x] 4.3.16.3 创建 `server/api/property-manage/expense-manage/water-and-electricity-meter-reading/list.post.ts`
- [x] 4.3.16.4 创建 `src/api/property-manage/expense-manage/water-and-electricity-meter-reading/index.ts`
- [ ] 4.3.16.5 更新 `src/pages/property-manage/expense-manage/water-and-electricity-meter-reading/index.vue`

### 4.4 house-property-manage 子模块 (11 页面 = 55 任务)

#### 4.4.1 house-property-manage/house

- [x] 4.4.1.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/house.ts`
- [x] 4.4.1.2 创建 `server/api/property-manage/house-property-manage/house/mock-data.ts`
- [x] 4.4.1.3 创建 `server/api/property-manage/house-property-manage/house/list.post.ts`
- [x] 4.4.1.4 创建 `src/api/property-manage/house-property-manage/house/index.ts`
- [ ] 4.4.1.5 更新 `src/pages/property-manage/house-property-manage/house/index.vue`

#### 4.4.2 house-property-manage/invoice

- [x] 4.4.2.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/invoice.ts`
- [x] 4.4.2.2 创建 `server/api/property-manage/house-property-manage/invoice/mock-data.ts`
- [x] 4.4.2.3 创建 `server/api/property-manage/house-property-manage/invoice/list.post.ts`
- [x] 4.4.2.4 创建 `src/api/property-manage/house-property-manage/invoice/index.ts`
- [ ] 4.4.2.5 更新 `src/pages/property-manage/house-property-manage/invoice/index.vue`

#### 4.4.3 house-property-manage/invoice-title

- [x] 4.4.3.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/invoice-title.ts`
- [x] 4.4.3.2 创建 `server/api/property-manage/house-property-manage/invoice-title/mock-data.ts`
- [x] 4.4.3.3 创建 `server/api/property-manage/house-property-manage/invoice-title/list.post.ts`
- [x] 4.4.3.4 创建 `src/api/property-manage/house-property-manage/invoice-title/index.ts`
- [ ] 4.4.3.5 更新 `src/pages/property-manage/house-property-manage/invoice-title/index.vue`

#### 4.4.4 house-property-manage/owner-account

- [x] 4.4.4.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/owner-account.ts`
- [x] 4.4.4.2 创建 `server/api/property-manage/house-property-manage/owner-account/mock-data.ts`
- [x] 4.4.4.3 创建 `server/api/property-manage/house-property-manage/owner-account/list.post.ts`
- [x] 4.4.4.4 创建 `src/api/property-manage/house-property-manage/owner-account/index.ts`
- [ ] 4.4.4.5 更新 `src/pages/property-manage/house-property-manage/owner-account/index.vue`

#### 4.4.5 house-property-manage/owner-information

- [x] 4.4.5.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/owner-information.ts`
- [x] 4.4.5.2 创建 `server/api/property-manage/house-property-manage/owner-information/mock-data.ts`
- [x] 4.4.5.3 创建 `server/api/property-manage/house-property-manage/owner-information/list.post.ts`
- [x] 4.4.5.4 创建 `src/api/property-manage/house-property-manage/owner-information/index.ts`
- [ ] 4.4.5.5 更新 `src/pages/property-manage/house-property-manage/owner-information/index.vue`

#### 4.4.6 house-property-manage/owner-member

- [x] 4.4.6.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/owner-member.ts`
- [x] 4.4.6.2 创建 `server/api/property-manage/house-property-manage/owner-member/mock-data.ts`
- [x] 4.4.6.3 创建 `server/api/property-manage/house-property-manage/owner-member/list.post.ts`
- [x] 4.4.6.4 创建 `src/api/property-manage/house-property-manage/owner-member/index.ts`
- [ ] 4.4.6.5 更新 `src/pages/property-manage/house-property-manage/owner-member/index.vue`

#### 4.4.7 house-property-manage/owners-committee

- [x] 4.4.7.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/owners-committee.ts`
- [x] 4.4.7.2 创建 `server/api/property-manage/house-property-manage/owners-committee/mock-data.ts`
- [x] 4.4.7.3 创建 `server/api/property-manage/house-property-manage/owners-committee/list.post.ts`
- [x] 4.4.7.4 创建 `src/api/property-manage/house-property-manage/owners-committee/index.ts`
- [ ] 4.4.7.5 更新 `src/pages/property-manage/house-property-manage/owners-committee/index.vue`

#### 4.4.8 house-property-manage/reserve-venue

- [x] 4.4.8.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/reserve-venue.ts`
- [x] 4.4.8.2 创建 `server/api/property-manage/house-property-manage/reserve-venue/mock-data.ts`
- [x] 4.4.8.3 创建 `server/api/property-manage/house-property-manage/reserve-venue/list.post.ts`
- [x] 4.4.8.4 创建 `src/api/property-manage/house-property-manage/reserve-venue/index.ts`
- [ ] 4.4.8.5 更新 `src/pages/property-manage/house-property-manage/reserve-venue/index.vue`

#### 4.4.9 house-property-manage/reserve-venue-order

- [x] 4.4.9.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/reserve-venue-order.ts`
- [x] 4.4.9.2 创建 `server/api/property-manage/house-property-manage/reserve-venue-order/mock-data.ts`
- [x] 4.4.9.3 创建 `server/api/property-manage/house-property-manage/reserve-venue-order/list.post.ts`
- [x] 4.4.9.4 创建 `src/api/property-manage/house-property-manage/reserve-venue-order/index.ts`
- [ ] 4.4.9.5 更新 `src/pages/property-manage/house-property-manage/reserve-venue-order/index.vue`

#### 4.4.10 house-property-manage/site-management

- [x] 4.4.10.1 迁移类型到 `apps/type/src/business/property-manage/house-property-manage/site-management.ts`
- [x] 4.4.10.2 创建 `server/api/property-manage/house-property-manage/site-management/mock-data.ts`
- [x] 4.4.10.3 创建 `server/api/property-manage/house-property-manage/site-management/list.post.ts`
- [x] 4.4.10.4 创建 `src/api/property-manage/house-property-manage/site-management/index.ts`
- [ ] 4.4.10.5 更新 `src/pages/property-manage/house-property-manage/site-management/index.vue`

### 4.5 parking-manage 子模块 (4 页面 = 20 任务)

#### 4.5.1 parking-manage/carport-apply

- [x] 4.5.1.1 迁移类型到 `apps/type/src/business/property-manage/parking-manage/carport-apply.ts`
- [x] 4.5.1.2 创建 `server/api/property-manage/parking-manage/carport-apply/mock-data.ts`
- [x] 4.5.1.3 创建 `server/api/property-manage/parking-manage/carport-apply/list.post.ts`
- [x] 4.5.1.4 创建 `src/api/property-manage/parking-manage/carport-apply/index.ts`
- [ ] 4.5.1.5 更新 `src/pages/property-manage/parking-manage/carport-apply/index.vue`

#### 4.5.2 parking-manage/carport-info

- [x] 4.5.2.1 迁移类型到 `apps/type/src/business/property-manage/parking-manage/carport-info.ts`
- [x] 4.5.2.2 创建 `server/api/property-manage/parking-manage/carport-info/mock-data.ts`
- [x] 4.5.2.3 创建 `server/api/property-manage/parking-manage/carport-info/list.post.ts`
- [x] 4.5.2.4 创建 `src/api/property-manage/parking-manage/carport-info/index.ts`
- [ ] 4.5.2.5 更新 `src/pages/property-manage/parking-manage/carport-info/index.vue`

#### 4.5.3 parking-manage/owner-vehicle

- [x] 4.5.3.1 迁移类型到 `apps/type/src/business/property-manage/parking-manage/owner-vehicle.ts`
- [x] 4.5.3.2 创建 `server/api/property-manage/parking-manage/owner-vehicle/mock-data.ts`
- [x] 4.5.3.3 创建 `server/api/property-manage/parking-manage/owner-vehicle/list.post.ts`
- [x] 4.5.3.4 创建 `src/api/property-manage/parking-manage/owner-vehicle/index.ts`
- [ ] 4.5.3.5 更新 `src/pages/property-manage/parking-manage/owner-vehicle/index.vue`

#### 4.5.4 parking-manage/parking-lot

- [x] 4.5.4.1 迁移类型到 `apps/type/src/business/property-manage/parking-manage/parking-lot.ts`
- [x] 4.5.4.2 创建 `server/api/property-manage/parking-manage/parking-lot/mock-data.ts`
- [x] 4.5.4.3 创建 `server/api/property-manage/parking-manage/parking-lot/list.post.ts`
- [x] 4.5.4.4 创建 `src/api/property-manage/parking-manage/parking-lot/index.ts`
- [ ] 4.5.4.5 更新 `src/pages/property-manage/parking-manage/parking-lot/index.vue`

### 4.6 patrol-manage 子模块 (6 页面 = 30 任务)

#### 4.6.1 patrol-manage/detail

- [x] 4.6.1.1 迁移类型到 `apps/type/src/business/property-manage/patrol-manage/detail.ts`
- [x] 4.6.1.2 创建 `server/api/property-manage/patrol-manage/detail/mock-data.ts`
- [x] 4.6.1.3 创建 `server/api/property-manage/patrol-manage/detail/list.post.ts`
- [x] 4.6.1.4 创建 `src/api/property-manage/patrol-manage/detail/index.ts`
- [ ] 4.6.1.5 更新 `src/pages/property-manage/patrol-manage/detail/index.vue`

#### 4.6.2 patrol-manage/item

- [x] 4.6.2.1 迁移类型到 `apps/type/src/business/property-manage/patrol-manage/item.ts`
- [x] 4.6.2.2 创建 `server/api/property-manage/patrol-manage/item/mock-data.ts`
- [x] 4.6.2.3 创建 `server/api/property-manage/patrol-manage/item/list.post.ts`
- [x] 4.6.2.4 创建 `src/api/property-manage/patrol-manage/item/index.ts`
- [ ] 4.6.2.5 更新 `src/pages/property-manage/patrol-manage/item/index.vue`

#### 4.6.3 patrol-manage/path

- [x] 4.6.3.1 迁移类型到 `apps/type/src/business/property-manage/patrol-manage/path.ts`
- [x] 4.6.3.2 创建 `server/api/property-manage/patrol-manage/path/mock-data.ts`
- [x] 4.6.3.3 创建 `server/api/property-manage/patrol-manage/path/list.post.ts`
- [x] 4.6.3.4 创建 `src/api/property-manage/patrol-manage/path/index.ts`
- [ ] 4.6.3.5 更新 `src/pages/property-manage/patrol-manage/path/index.vue`

#### 4.6.4 patrol-manage/plan

- [x] 4.6.4.1 迁移类型到 `apps/type/src/business/property-manage/patrol-manage/plan.ts`
- [x] 4.6.4.2 创建 `server/api/property-manage/patrol-manage/plan/mock-data.ts`
- [x] 4.6.4.3 创建 `server/api/property-manage/patrol-manage/plan/list.post.ts`
- [x] 4.6.4.4 创建 `src/api/property-manage/patrol-manage/plan/index.ts`
- [ ] 4.6.4.5 更新 `src/pages/property-manage/patrol-manage/plan/index.vue`

#### 4.6.5 patrol-manage/point

- [x] 4.6.5.1 迁移类型到 `apps/type/src/business/property-manage/patrol-manage/point.ts`
- [x] 4.6.5.2 创建 `server/api/property-manage/patrol-manage/point/mock-data.ts`
- [x] 4.6.5.3 创建 `server/api/property-manage/patrol-manage/point/list.post.ts`
- [x] 4.6.5.4 创建 `src/api/property-manage/patrol-manage/point/index.ts`
- [ ] 4.6.5.5 更新 `src/pages/property-manage/patrol-manage/point/index.vue`

#### 4.6.6 patrol-manage/task

- [x] 4.6.6.1 迁移类型到 `apps/type/src/business/property-manage/patrol-manage/task.ts`
- [x] 4.6.6.2 创建 `server/api/property-manage/patrol-manage/task/mock-data.ts`
- [x] 4.6.6.3 创建 `server/api/property-manage/patrol-manage/task/list.post.ts`
- [x] 4.6.6.4 创建 `src/api/property-manage/patrol-manage/task/index.ts`
- [ ] 4.6.6.5 更新 `src/pages/property-manage/patrol-manage/task/index.vue`

### 4.7 repairs-manage 子模块 (7 页面 = 35 任务)

#### 4.7.1 repairs-manage/issues

- [x] 4.7.1.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/issues.ts`
- [x] 4.7.1.2 创建 `server/api/property-manage/repairs-manage/issues/mock-data.ts`
- [x] 4.7.1.3 创建 `server/api/property-manage/repairs-manage/issues/list.post.ts`
- [x] 4.7.1.4 创建 `src/api/property-manage/repairs-manage/issues/index.ts`
- [ ] 4.7.1.5 更新 `src/pages/property-manage/repairs-manage/issues/index.vue`

#### 4.7.2 repairs-manage/mandatory-return-issue

- [x] 4.7.2.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/mandatory-return-issue.ts`
- [x] 4.7.2.2 创建 `server/api/property-manage/repairs-manage/mandatory-return-issue/mock-data.ts`
- [x] 4.7.2.3 创建 `server/api/property-manage/repairs-manage/mandatory-return-issue/list.post.ts`
- [x] 4.7.2.4 创建 `src/api/property-manage/repairs-manage/mandatory-return-issue/index.ts`
- [ ] 4.7.2.5 更新 `src/pages/property-manage/repairs-manage/mandatory-return-issue/index.vue`

#### 4.7.3 repairs-manage/phone-report-repairs

- [x] 4.7.3.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/phone-report-repairs.ts`
- [x] 4.7.3.2 创建 `server/api/property-manage/repairs-manage/phone-report-repairs/mock-data.ts`
- [x] 4.7.3.3 创建 `server/api/property-manage/repairs-manage/phone-report-repairs/list.post.ts`
- [x] 4.7.3.4 创建 `src/api/property-manage/repairs-manage/phone-report-repairs/index.ts`
- [ ] 4.7.3.5 更新 `src/pages/property-manage/repairs-manage/phone-report-repairs/index.vue`

#### 4.7.4 repairs-manage/repairs-have-done

- [x] 4.7.4.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/repairs-have-done.ts`
- [x] 4.7.4.2 创建 `server/api/property-manage/repairs-manage/repairs-have-done/mock-data.ts`
- [x] 4.7.4.3 创建 `server/api/property-manage/repairs-manage/repairs-have-done/list.post.ts`
- [x] 4.7.4.4 创建 `src/api/property-manage/repairs-manage/repairs-have-done/index.ts`
- [ ] 4.7.4.5 更新 `src/pages/property-manage/repairs-manage/repairs-have-done/index.vue`

#### 4.7.5 repairs-manage/repairs-setting

- [x] 4.7.5.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/repairs-setting.ts`
- [x] 4.7.5.2 创建 `server/api/property-manage/repairs-manage/repairs-setting/mock-data.ts`
- [x] 4.7.5.3 创建 `server/api/property-manage/repairs-manage/repairs-setting/list.post.ts`
- [x] 4.7.5.4 创建 `src/api/property-manage/repairs-manage/repairs-setting/index.ts`
- [ ] 4.7.5.5 更新 `src/pages/property-manage/repairs-manage/repairs-setting/index.vue`

#### 4.7.6 repairs-manage/repairs-todo

- [x] 4.7.6.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/repairs-todo.ts`
- [x] 4.7.6.2 创建 `server/api/property-manage/repairs-manage/repairs-todo/mock-data.ts`
- [x] 4.7.6.3 创建 `server/api/property-manage/repairs-manage/repairs-todo/list.post.ts`
- [x] 4.7.6.4 创建 `src/api/property-manage/repairs-manage/repairs-todo/index.ts`
- [ ] 4.7.6.5 更新 `src/pages/property-manage/repairs-manage/repairs-todo/index.vue`

#### 4.7.7 repairs-manage/return-visit

- [x] 4.7.7.1 迁移类型到 `apps/type/src/business/property-manage/repairs-manage/return-visit.ts`
- [x] 4.7.7.2 创建 `server/api/property-manage/repairs-manage/return-visit/mock-data.ts`
- [x] 4.7.7.3 创建 `server/api/property-manage/repairs-manage/return-visit/list.post.ts`
- [x] 4.7.7.4 创建 `src/api/property-manage/repairs-manage/return-visit/index.ts`
- [ ] 4.7.7.5 更新 `src/pages/property-manage/repairs-manage/return-visit/index.vue`

### 4.8 report-manage 子模块 (14 页面 = 70 任务)

> 注：report-manage 子模块包含较多统计报表页面

#### 4.8.1 report-manage/arrears-details-list

- [x] 4.8.1.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/arrears-details-list.ts`
- [x] 4.8.1.2 创建 `server/api/property-manage/report-manage/arrears-details-list/mock-data.ts`
- [x] 4.8.1.3 创建 `server/api/property-manage/report-manage/arrears-details-list/list.post.ts`
- [x] 4.8.1.4 创建 `src/api/property-manage/report-manage/arrears-details-list/index.ts`
- [ ] 4.8.1.5 更新 `src/pages/property-manage/report-manage/arrears-details-list/index.vue`

#### 4.8.2 report-manage/data-statistics

- [x] 4.8.2.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/data-statistics.ts`
- [x] 4.8.2.2 创建 `server/api/property-manage/report-manage/data-statistics/mock-data.ts`
- [x] 4.8.2.3 创建 `server/api/property-manage/report-manage/data-statistics/list.post.ts`
- [x] 4.8.2.4 创建 `src/api/property-manage/report-manage/data-statistics/index.ts`
- [ ] 4.8.2.5 更新 `src/pages/property-manage/report-manage/data-statistics/index.vue`

#### 4.8.3 report-manage/deposit-report

- [x] 4.8.3.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/deposit-report.ts`
- [x] 4.8.3.2 创建 `server/api/property-manage/report-manage/deposit-report/mock-data.ts`
- [x] 4.8.3.3 创建 `server/api/property-manage/report-manage/deposit-report/list.post.ts`
- [x] 4.8.3.4 创建 `src/api/property-manage/report-manage/deposit-report/index.ts`
- [ ] 4.8.3.5 更新 `src/pages/property-manage/report-manage/deposit-report/index.vue`

#### 4.8.4 report-manage/expense-summary-table

- [x] 4.8.4.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/expense-summary-table.ts`
- [x] 4.8.4.2 创建 `server/api/property-manage/report-manage/expense-summary-table/mock-data.ts`
- [x] 4.8.4.3 创建 `server/api/property-manage/report-manage/expense-summary-table/list.post.ts`
- [x] 4.8.4.4 创建 `src/api/property-manage/report-manage/expense-summary-table/index.ts`
- [ ] 4.8.4.5 更新 `src/pages/property-manage/report-manage/expense-summary-table/index.vue`

#### 4.8.5 report-manage/fee-reminder

- [x] 4.8.5.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/fee-reminder.ts`
- [x] 4.8.5.2 创建 `server/api/property-manage/report-manage/fee-reminder/mock-data.ts`
- [x] 4.8.5.3 创建 `server/api/property-manage/report-manage/fee-reminder/list.post.ts`
- [x] 4.8.5.4 创建 `src/api/property-manage/report-manage/fee-reminder/index.ts`
- [ ] 4.8.5.5 更新 `src/pages/property-manage/report-manage/fee-reminder/index.vue`

#### 4.8.6 report-manage/no-charge-house

- [x] 4.8.6.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/no-charge-house.ts`
- [x] 4.8.6.2 创建 `server/api/property-manage/report-manage/no-charge-house/mock-data.ts`
- [x] 4.8.6.3 创建 `server/api/property-manage/report-manage/no-charge-house/list.post.ts`
- [x] 4.8.6.4 创建 `src/api/property-manage/report-manage/no-charge-house/index.ts`
- [ ] 4.8.6.5 更新 `src/pages/property-manage/report-manage/no-charge-house/index.vue`

#### 4.8.7 report-manage/outstanding-fees-analysis

- [x] 4.8.7.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/outstanding-fees-analysis.ts`
- [x] 4.8.7.2 创建 `server/api/property-manage/report-manage/outstanding-fees-analysis/mock-data.ts`
- [x] 4.8.7.3 创建 `server/api/property-manage/report-manage/outstanding-fees-analysis/list.post.ts`
- [x] 4.8.7.4 创建 `src/api/property-manage/report-manage/outstanding-fees-analysis/index.ts`
- [ ] 4.8.7.5 更新 `src/pages/property-manage/report-manage/outstanding-fees-analysis/index.vue`

#### 4.8.8 report-manage/owner-payment-details

- [x] 4.8.8.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/owner-payment-details.ts`
- [x] 4.8.8.2 创建 `server/api/property-manage/report-manage/owner-payment-details/mock-data.ts`
- [x] 4.8.8.3 创建 `server/api/property-manage/report-manage/owner-payment-details/list.post.ts`
- [x] 4.8.8.4 创建 `src/api/property-manage/report-manage/owner-payment-details/index.ts`
- [ ] 4.8.8.5 更新 `src/pages/property-manage/report-manage/owner-payment-details/index.vue`

#### 4.8.9 report-manage/patrol-report

- [x] 4.8.9.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/patrol-report.ts`
- [x] 4.8.9.2 创建 `server/api/property-manage/report-manage/patrol-report/mock-data.ts`
- [x] 4.8.9.3 创建 `server/api/property-manage/report-manage/patrol-report/list.post.ts`
- [x] 4.8.9.4 创建 `src/api/property-manage/report-manage/patrol-report/index.ts`
- [ ] 4.8.9.5 更新 `src/pages/property-manage/report-manage/patrol-report/index.vue`

#### 4.8.10 report-manage/payment-details-form

- [x] 4.8.10.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/payment-details-form.ts`
- [x] 4.8.10.2 创建 `server/api/property-manage/report-manage/payment-details-form/mock-data.ts`
- [x] 4.8.10.3 创建 `server/api/property-manage/report-manage/payment-details-form/list.post.ts`
- [x] 4.8.10.4 创建 `src/api/property-manage/report-manage/payment-details-form/index.ts`
- [ ] 4.8.10.5 更新 `src/pages/property-manage/report-manage/payment-details-form/index.vue`

#### 4.8.11 report-manage/repair-report-form

- [x] 4.8.11.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/repair-report-form.ts`
- [x] 4.8.11.2 创建 `server/api/property-manage/report-manage/repair-report-form/mock-data.ts`
- [x] 4.8.11.3 创建 `server/api/property-manage/report-manage/repair-report-form/list.post.ts`
- [x] 4.8.11.4 创建 `src/api/property-manage/report-manage/repair-report-form/index.ts`
- [ ] 4.8.11.5 更新 `src/pages/property-manage/report-manage/repair-report-form/index.vue`

#### 4.8.12 report-manage/repair-reports-summary-table

- [x] 4.8.12.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/repair-reports-summary-table.ts`
- [x] 4.8.12.2 创建 `server/api/property-manage/report-manage/repair-reports-summary-table/mock-data.ts`
- [x] 4.8.12.3 创建 `server/api/property-manage/report-manage/repair-reports-summary-table/list.post.ts`
- [x] 4.8.12.4 创建 `src/api/property-manage/report-manage/repair-reports-summary-table/index.ts`
- [ ] 4.8.12.5 更新 `src/pages/property-manage/report-manage/repair-reports-summary-table/index.vue`

#### 4.8.13 report-manage/statement-expenses

- [x] 4.8.13.1 迁移类型到 `apps/type/src/business/property-manage/report-manage/statement-expenses.ts`
- [x] 4.8.13.2 创建 `server/api/property-manage/report-manage/statement-expenses/mock-data.ts`
- [x] 4.8.13.3 创建 `server/api/property-manage/report-manage/statement-expenses/list.post.ts`
- [x] 4.8.13.4 创建 `src/api/property-manage/report-manage/statement-expenses/index.ts`
- [ ] 4.8.13.5 更新 `src/pages/property-manage/report-manage/statement-expenses/index.vue`

---

## 阶段 5: setting-manage 模块迁移 (35 任务，1 周)

> 注：setting-manage 有 7 个页面，每个页面 5 个步骤，共 35 任务

### 5.1 organize-manage/data-permission

- [ ] 5.1.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/data-permission.ts`
- [ ] 5.1.2 创建 `server/api/setting-manage/organize-manage/data-permission/mock-data.ts`
- [ ] 5.1.3 创建 `server/api/setting-manage/organize-manage/data-permission/list.post.ts`
- [ ] 5.1.4 创建 `src/api/setting-manage/organize-manage/data-permission/index.ts`
- [ ] 5.1.5 更新 `src/pages/setting-manage/organize-manage/data-permission/index.vue`

### 5.2 organize-manage/org-info

- [ ] 5.2.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/org-info.ts`
- [ ] 5.2.2 创建 `server/api/setting-manage/organize-manage/org-info/mock-data.ts`
- [ ] 5.2.3 创建 `server/api/setting-manage/organize-manage/org-info/list.post.ts`
- [ ] 5.2.4 创建 `src/api/setting-manage/organize-manage/org-info/index.ts`
- [ ] 5.2.5 更新 `src/pages/setting-manage/organize-manage/org-info/index.vue`

### 5.3 organize-manage/role-permission

- [ ] 5.3.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/role-permission.ts`
- [ ] 5.3.2 创建 `server/api/setting-manage/organize-manage/role-permission/mock-data.ts`
- [ ] 5.3.3 创建 `server/api/setting-manage/organize-manage/role-permission/list.post.ts`
- [ ] 5.3.4 创建 `src/api/setting-manage/organize-manage/role-permission/index.ts`
- [ ] 5.3.5 更新 `src/pages/setting-manage/organize-manage/role-permission/index.vue`

### 5.4 organize-manage/scheduling-setting

- [ ] 5.4.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/scheduling-setting.ts`
- [ ] 5.4.2 创建 `server/api/setting-manage/organize-manage/scheduling-setting/mock-data.ts`
- [ ] 5.4.3 创建 `server/api/setting-manage/organize-manage/scheduling-setting/list.post.ts`
- [ ] 5.4.4 创建 `src/api/setting-manage/organize-manage/scheduling-setting/index.ts`
- [ ] 5.4.5 更新 `src/pages/setting-manage/organize-manage/scheduling-setting/index.vue`

### 5.5 organize-manage/shift-setting

- [ ] 5.5.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/shift-setting.ts`
- [ ] 5.5.2 创建 `server/api/setting-manage/organize-manage/shift-setting/mock-data.ts`
- [ ] 5.5.3 创建 `server/api/setting-manage/organize-manage/shift-setting/list.post.ts`
- [ ] 5.5.4 创建 `src/api/setting-manage/organize-manage/shift-setting/index.ts`
- [ ] 5.5.5 更新 `src/pages/setting-manage/organize-manage/shift-setting/index.vue`

### 5.6 organize-manage/staff-info

- [ ] 5.6.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/staff-info.ts`
- [ ] 5.6.2 创建 `server/api/setting-manage/organize-manage/staff-info/mock-data.ts`
- [ ] 5.6.3 创建 `server/api/setting-manage/organize-manage/staff-info/list.post.ts`
- [ ] 5.6.4 创建 `src/api/setting-manage/organize-manage/staff-info/index.ts`
- [ ] 5.6.5 更新 `src/pages/setting-manage/organize-manage/staff-info/index.vue`

### 5.7 organize-manage/working-schedule

- [ ] 5.7.1 迁移类型到 `apps/type/src/business/setting-manage/organize-manage/working-schedule.ts`
- [ ] 5.7.2 创建 `server/api/setting-manage/organize-manage/working-schedule/mock-data.ts`
- [ ] 5.7.3 创建 `server/api/setting-manage/organize-manage/working-schedule/list.post.ts`
- [ ] 5.7.4 创建 `src/api/setting-manage/organize-manage/working-schedule/index.ts`
- [ ] 5.7.5 更新 `src/pages/setting-manage/organize-manage/working-schedule/index.vue`

---

## 阶段 6: 验证和清理 (83 任务，1.5 周)

### 6.1 Nitro 代码写法检查和修复 (27 任务)

#### 6.1.1 dev-team 模块代码检查 (10 任务)

- [x] 6.1.1.1 检查 `server/api/dev-team/config-manage/center/list.post.ts` 的代码写法
- [x] 6.1.1.2 检查 `server/api/dev-team/config-manage/dictionary/list.post.ts` 的代码写法
- [x] 6.1.1.3 检查 `server/api/dev-team/config-manage/type/list.post.ts` 的代码写法
- [x] 6.1.1.4 检查 `server/api/dev-team/config-manage/item/list.post.ts` 的代码写法
- [x] 6.1.1.5 检查 `server/api/dev-team/menu-manage/catalog/list.post.ts` 的代码写法
- [x] 6.1.1.6 检查 `server/api/dev-team/menu-manage/group/list.post.ts` 的代码写法
- [x] 6.1.1.7 检查 `server/api/dev-team/menu-manage/item/list.post.ts` 的代码写法
- [x] 6.1.1.8 检查 `server/api/dev-team/cache-manage/refresh-cache/list.post.ts` 的代码写法
- [ ] 6.1.1.9 修复 dev-team 模块所有不符合规范的接口代码
- [x] 6.1.1.10 运行 `pnpm typecheck` 确认 dev-team 模块修复后无报错

#### 6.1.2 operation-team 模块代码检查 (11 任务)

- [x] 6.1.2.1 检查 `server/api/operation-team/data-manage/community-information/list.post.ts` 的代码写法
- [x] 6.1.2.2 检查 `server/api/operation-team/data-manage/property-company/list.post.ts` 的代码写法
- [x] 6.1.2.3 检查 `server/api/operation-team/merchant-manage/merchant-admin/list.post.ts` 的代码写法
- [x] 6.1.2.4 检查 `server/api/operation-team/merchant-manage/merchant-info/list.post.ts` 的代码写法
- [x] 6.1.2.5 检查 `server/api/operation-team/report-configuration/report-component/list.post.ts` 的代码写法
- [x] 6.1.2.6 检查 `server/api/operation-team/report-configuration/report-group/list.post.ts` 的代码写法
- [x] 6.1.2.7 检查 `server/api/operation-team/report-configuration/report-info/list.post.ts` 的代码写法
- [x] 6.1.2.8 检查 `server/api/operation-team/system-manage/system-config/list.post.ts` 的代码写法
- [ ] 6.1.2.9 检查其他 operation-team 接口的代码写法（如已生成）
- [ ] 6.1.2.10 修复 operation-team 模块所有不符合规范的接口代码
- [x] 6.1.2.11 运行 `pnpm typecheck` 确认 operation-team 模块修复后无报错

#### 6.1.3 property-manage 模块代码检查 (6 任务)

- [x] 6.1.3.1 检查 `server/api/property-manage/house-property-manage/house/list.post.ts` 的代码写法
- [x] 6.1.3.2 检查 `server/api/property-manage/community-manage/handing-business/list.post.ts` 的代码写法
- [x] 6.1.3.3 检查 `server/api/property-manage/community-manage/notice/list.post.ts` 的代码写法
- [ ] 6.1.3.4 检查其他已生成的 property-manage 接口的代码写法
- [ ] 6.1.3.5 修复 property-manage 模块所有不符合规范的接口代码
- [x] 6.1.3.6 运行 `pnpm typecheck` 确认 property-manage 模块修复后无报错

### 6.2 类型检查 (3 任务)

- [ ] 6.2.1 运行 `pnpm -F @01s-11comm/type typecheck`
- [ ] 6.2.2 运行 `pnpm -F @01s-11comm/admin typecheck`
- [ ] 6.2.3 修复所有类型错误

### 6.3 功能测试 (8 任务)

- [ ] 6.3.1 手动测试 dev-team 模块所有列表页（8 页面）
- [ ] 6.3.2 手动测试 operation-team 模块所有列表页（12 页面）
- [ ] 6.3.3 手动测试 property-manage 模块所有列表页（60+ 页面）
- [ ] 6.3.4 手动测试 setting-manage 模块所有列表页（7 页面）
- [ ] 6.3.5 验证所有搜索功能正常
- [ ] 6.3.6 验证所有分页功能正常
- [ ] 6.3.7 验证 loading 状态显示正确
- [ ] 6.3.8 验证错误状态提示正确

### 6.4 代码清理（删除旧 test-data.ts 文件）(35 任务)

#### 6.4.1 dev-team 模块清理 (9 任务)

- [x] 6.4.1.1 删除 `apps/admin/src/pages/dev-team/config-manage/center/test-data.ts`
- [x] 6.4.1.2 删除 `apps/admin/src/pages/dev-team/config-manage/dictionary/test-data.ts`
- [x] 6.4.1.3 删除 `apps/admin/src/pages/dev-team/config-manage/type/test-data.ts`
- [x] 6.4.1.4 删除 `apps/admin/src/pages/dev-team/config-manage/item/test-data.ts`
- [x] 6.4.1.5 删除 `apps/admin/src/pages/dev-team/menu-manage/catalog/test-data.ts`
- [x] 6.4.1.6 删除 `apps/admin/src/pages/dev-team/menu-manage/group/test-data.ts`
- [x] 6.4.1.7 删除 `apps/admin/src/pages/dev-team/menu-manage/item/test-data.ts`
- [x] 6.4.1.8 删除 `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/test-data.ts`
- [x] 6.4.1.9 运行 `pnpm typecheck` 确认 dev-team 模块无报错

#### 6.4.2 operation-team 模块清理 (13 任务)

- [x] 6.4.2.1 删除 `apps/admin/src/pages/operation-team/data-manage/community-information/test-data.ts`
- [x] 6.4.2.2 删除 `apps/admin/src/pages/operation-team/data-manage/property-management-company/test-data.ts`
- [x] 6.4.2.3 删除 `apps/admin/src/pages/operation-team/merchant-manage/merchant-admin/test-data.ts`
- [x] 6.4.2.4 删除 `apps/admin/src/pages/operation-team/merchant-manage/merchant-info/test-data.ts`
- [x] 6.4.2.5 删除 `apps/admin/src/pages/operation-team/report-configuration/report-component/test-data.ts`
- [x] 6.4.2.6 删除 `apps/admin/src/pages/operation-team/report-configuration/report-group/test-data.ts`
- [x] 6.4.2.7 删除 `apps/admin/src/pages/operation-team/report-configuration/report-info/test-data.ts`
- [x] 6.4.2.8 删除 `apps/admin/src/pages/operation-team/system-manage/change-password/test-data.ts`
- [x] 6.4.2.9 删除 `apps/admin/src/pages/operation-team/system-manage/community-configuration/test-data.ts`
- [x] 6.4.2.10 删除 `apps/admin/src/pages/operation-team/system-manage/initialize-cell/test-data.ts`
- [x] 6.4.2.11 删除 `apps/admin/src/pages/operation-team/system-manage/register-protocol/test-data.ts`
- [x] 6.4.2.12 删除 `apps/admin/src/pages/operation-team/system-manage/system-config/test-data.ts`
- [x] 6.4.2.13 运行 `pnpm typecheck` 确认 operation-team 模块无报错

#### 6.4.3 property-manage 模块清理 (3 任务)

- [x] 6.4.3.1 使用脚本批量删除 `apps/admin/src/pages/property-manage/**/test-data.ts`（所有子模块）
- [ ] 6.4.3.2 手动验证关键页面的 test-data.ts 已删除（抽查 10 个页面）
- [x] 6.4.3.3 运行 `pnpm typecheck` 确认 property-manage 模块无报错

#### 6.4.4 setting-manage 模块清理 (8 任务)

- [x] 6.4.4.1 删除 `apps/admin/src/pages/setting-manage/organize-manage/data-permission/test-data.ts`
- [x] 6.4.4.2 删除 `apps/admin/src/pages/setting-manage/organize-manage/org-info/test-data.ts`
- [x] 6.4.4.3 删除 `apps/admin/src/pages/setting-manage/organize-manage/role-permission/test-data.ts`
- [x] 6.4.4.4 删除 `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/test-data.ts`
- [x] 6.4.4.5 删除 `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/test-data.ts`
- [x] 6.4.4.6 删除 `apps/admin/src/pages/setting-manage/organize-manage/staff-info/test-data.ts`
- [x] 6.4.4.7 删除 `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/test-data.ts`
- [x] 6.4.4.8 运行 `pnpm typecheck` 确认 setting-manage 模块无报错

#### 6.4.5 全局验证 (3 任务)

- [ ] 6.4.5.1 全局搜索确认没有遗留的 test-data.ts 文件（`find apps/admin/src/pages -name "test-data.ts"`）
- [ ] 6.4.5.2 运行 `pnpm -F @01s-11comm/admin typecheck` 确认整个项目无报错
- [ ] 6.4.5.3 全局搜索确认没有代码仍然导入 test-data.ts（`grep -r "from.*test-data" apps/admin/src/pages`）

### 6.5 文档更新 (4 任务)

- [ ] 6.5.1 更新 `.claude/agents/make-list-page.md`（反映新的数据获取方式）
- [ ] 6.5.2 编写迁移总结报告到 `apps/admin/src/docs/reports/`
- [ ] 6.5.3 更新 `CLAUDE.md` 项目说明
- [ ] 6.5.4 更新相关 API 文档

### 6.6 OpenSpec 验证和归档准备 (3 任务)

- [ ] 6.6.1 运行 `openspec validate migrate-static-data-to-nitro-query --strict`
- [ ] 6.6.2 修复所有验证错误
- [ ] 6.6.3 准备归档文档（等待部署后执行归档）

### 6.7 CI/CD 配置 (3 任务)

- [ ] 6.7.1 确保 apps/type 在 CI 中正确构建
- [ ] 6.7.2 添加类型检查到 CI 流程
- [ ] 6.7.3 添加 Nitro 接口测试（可选）

---

## 任务统计

|   阶段   |           名称           | 任务数  |  预计时间  |
| :------: | :----------------------: | :-----: | :--------: |
|    1     |       基础设施搭建       |   15    |    1 周    |
|    2     |    dev-team 模块迁移     |   40    |    1 周    |
|    3     | operation-team 模块迁移  |   60    |    2 周    |
|    4     | property-manage 模块迁移 |   355   |    6 周    |
|    5     | setting-manage 模块迁移  |   35    |    1 周    |
|    6     |        验证和清理        |   83    |  1.5 周   |
| **总计** |                          | **588** | **12.5 周** |

**注：**
- 阶段 6 的任务数从 30 增加到 83，主要增加了：
  - Nitro 代码写法检查和修复（27 任务）：确保所有已生成的 Nitro 接口符合 v3 规范
  - 代码清理部分细化（35 任务）：确保所有旧 test-data.ts 文件都能被及时删除

## 进度统计

### 已完成任务

|      模块       | 已完成 |  总数   |  完成率   |
| :-------------: | :----: | :-----: | :-------: |
|    基础设施     |   15   |   15    |   100%    |
|    dev-team     |   34   |   40    |   85.0%   |
| operation-team  |   24   |   60    |    40%    |
| property-manage |   9    |   355   |   2.5%    |
| setting-manage  |   0    |   35    |    0%     |
|   验证和清理    |   0    |   83    |    0%     |
|    **总计**     | **82** | **588** | **13.9%** |

## 注意事项

1. **增量迁移**：必须按阶段顺序执行，每完成一个模块立即验证
2. **类型检查**：每个阶段结束后运行 typecheck 确保无报错
3. **功能验证**：每迁移一个页面，手动测试搜索和分页功能
4. **脚本自动化**：建议在阶段 2 完成后编写自动化脚本，减少阶段 3-5 的工作量
5. **风险控制**：如果某个页面迁移失败，立即回滚并分析原因，不要继续迁移下一个
6. **及时删除旧文件**：完成 Nitro 接口迁移后，必须在阶段 6 统一删除所有旧的 test-data.ts 文件，不允许新旧文件长期共存
   - 删除前确保 mock-data.ts、list.post.ts、TanStack Query Hook 和页面更新都已完成
   - 删除后立即运行 typecheck 确保无依赖引用错误
   - 使用全局搜索工具验证没有遗留的 test-data.ts 文件

## 关键里程碑

- **Week 1**: 基础设施就绪，试点页面完成 ✅
- **Week 2**: dev-team 模块完成，验证迁移流程（进行中）
- **Week 4**: operation-team 模块完成
- **Week 10**: property-manage 模块完成
- **Week 11**: setting-manage 模块完成
- **Week 12**: 全部验证通过，文档更新完成
