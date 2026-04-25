## Why

本项目当前有 140 个页面需要从 Vue2 迁移到 Vue3，目前仅完成 52 个（37%），剩余 88 个页面（63%）未完成迁移。同时，已迁移的 52 个页面中有 20 个存在 Skills 合规性问题（通过率仅 62%），需要修复以符合项目技术规范。完成这些迁移和修复是项目技术栈升级的关键里程碑，直接影响项目的可维护性、性能和开发效率。

## What Changes

### 未完成页面迁移（88 个页面）

**高优先级模块（43 个页面）**：

- resource_modules（资源采购）- 29 个页面：采购申请流程、资源管理、物品管理、调拨管理、库存管理、出入库管理
- fee_modules（费用管理）- 14 个页面：费用管理、充值管理、报表统计

**中优先级模块（24 个页面）**：

- oa_modules（OA 工作流）- 8 个页面：工作流管理、表单管理、审核流程
- property_modules（房屋管理）- 11 个页面（剩余）：房屋基础管理、业主管理、装修管理
- parking_modules（车辆管理）- 5 个页面：车辆管理、道闸管理

**低优先级模块（21 个页面）**：

- notice_modules（公告管理）- 2 个页面（剩余）：公告列表、公告详情
- basic_modules（基础模块）- 5 个页面（剩余）：个人中心、用户信息、密码修改等
- other_modules（其他功能）- 14 个页面：预约管理、抄表管理、优惠券管理、物品发布、视频管理、访客管理等

### Skills 合规性修复（20 个问题）

**P0 级别问题（必须修复）**：

- api-error-handling 问题（8 个文件）：inspection 模块所有文件缺少 onError 回调
- z-paging 问题（5 个文件）：complaint、property、activity 模块的列表页未使用 z-paging 组件
- use-wd-form 问题（7 个文件）：repair、complaint 模块的表单页未使用 wd-form 组件

## Capabilities

### New Capabilities

- `batch-page-migration`: 批量页面迁移能力 - 支持按模块批量迁移 88 个未完成页面，包含代码迁移、组件迁移、样式迁移、API 迁移、路由迁移的完整流程
- `skills-compliance-fix`: Skills 合规性修复能力 - 修复已迁移页面中的 20 个合规性问题，确保符合项目技术规范
- `agent-team-workflow`: 子代理团队工作流 - 建立技能指导子代理、代码迁移子代理、审核子代理的协作机制，确保迁移质量
- `migration-progress-tracking`: 迁移进度跟踪能力 - 实时跟踪 140 个页面的迁移状态和合规性检查结果

### Modified Capabilities

无现有能力需要修改。

## Impact

### 影响的代码模块

**未迁移模块（88 个文件）**：

- `src/pages-sub/purchase/` - 5 个文件
- `src/pages-sub/resource/` - 24 个文件
- `src/pages-sub/fee/` - 8 个文件
- `src/pages-sub/report/` - 6 个文件
- `src/pages-sub/oa/` - 8 个文件
- `src/pages-sub/property/` - 11 个文件
- `src/pages-sub/parking/` - 5 个文件
- `src/pages-sub/appointment/` - 2 个文件
- `src/pages-sub/meter/` - 6 个文件
- `src/pages-sub/coupon/` - 3 个文件
- `src/pages-sub/item/` - 2 个文件
- `src/pages-sub/video/` - 2 个文件
- `src/pages-sub/visit/` - 2 个文件
- `src/pages/profile/` - 5 个文件
- `src/pages/notice/` - 2 个文件
- `src/pages/webview/` - 1 个文件

**需要修复的模块（20 个文件）**：

- `src/pages-sub/inspection/` - 8 个文件（缺少 api-error-handling）
- `src/pages-sub/complaint/` - 6 个文件（缺少 z-paging 或 use-wd-form）
- `src/pages-sub/property/` - 2 个文件（缺少 z-paging）
- `src/pages-sub/repair/` - 1 个文件（缺少 use-wd-form）
- `src/pages/activity/` - 1 个文件（缺少 z-paging）

### 依赖的 Skills 技能

所有迁移任务必须严格遵循以下技能规范：

- `code-migration`: Vue2 Options API → Vue3 Composition API + TypeScript
- `component-migration`: ColorUI + uni-app 内置组件 → wot-design-uni
- `style-migration`: ColorUI 类名 → UnoCSS 原子类
- `api-migration`: Java110Context + uni.request → Alova + TypeScript + Mock
- `route-migration`: pages.json → 约定式路由
- `use-wd-form`: 表单页面必须使用 wd-form 组件
- `z-paging-integration`: 列表页面必须使用 z-paging 组件
- `api-error-handling`: 所有 API 调用必须有 onError 回调
- `beautiful-component-design`: 组件美化规范（FormSectionTitle、Carbon Icons 等）
- `use-uniapp-dynamic-page-title`: 动态页面标题设置

### 团队协作模式

采用子代理团队模式完成迁移：

- **技能指导子代理**：负责学习全部 Skills 文档，提供技术指导
- **代码迁移子代理**：根据任务清单和技能指导完成具体迁移
- **审核子代理**：根据 Skills 规范审核迁移结果

每个路径对应的文件迁移都需要新建独立的子代理团队，确保质量和效率。

### 系统影响

- **开发效率**：完成迁移后，所有页面将使用统一的 Vue3 + TypeScript 技术栈，提升开发效率
- **代码质量**：修复合规性问题后，代码将完全符合项目规范，提升可维护性
- **技术债务**：彻底清除 Vue2 遗留代码，减少技术债务
- **项目进度**：完成 140 个页面的迁移是项目技术升级的关键里程碑
