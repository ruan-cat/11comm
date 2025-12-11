# 实施任务清单

本迁移任务共分为 **6 个阶段**，预计 **490 个子任务**，总工期约 **12 周**。

---

## 阶段 1: 基础设施搭建 (15 任务，1 周)

### 1.1 初始化 apps/type 类型库

- [ ] 1.1.1 创建 `apps/type/package.json`（配置为 monorepo 包）
- [ ] 1.1.2 创建 `apps/type/tsconfig.json`（TypeScript 配置）
- [ ] 1.1.3 创建 `apps/type/src/common/index.ts`（导出 JsonVO, PageDTO, OptionsType）
- [ ] 1.1.4 创建 `apps/type/src/business` 目录结构（dev-team, operation-team, property-manage, setting-manage）
- [ ] 1.1.5 创建 `apps/type/index.ts` 统一导出文件
- [ ] 1.1.6 运行 `pnpm install` 安装 apps/type 依赖
- [ ] 1.1.7 运行 `pnpm -F @01s-11comm/type build` 测试构建

### 1.2 配置 Nitro 服务端

- [ ] 1.2.1 修改 `apps/admin/nitro.config.ts`（设置 `serverDir: "server"`）
- [ ] 1.2.2 创建 `apps/admin/server/api` 目录
- [ ] 1.2.3 添加 server 别名到 nitro.config.ts（可选）

### 1.3 安装 @tanstack/vue-query

- [ ] 1.3.1 运行 `pnpm add @tanstack/vue-query -F @01s-11comm/admin`
- [ ] 1.3.2 修改 `apps/admin/src/main.ts` 初始化 VueQueryPlugin
- [ ] 1.3.3 配置默认 query 选项（staleTime: 5min, gcTime: 10min）

### 1.4 创建通用工具

- [ ] 1.4.1 创建 `apps/admin/src/composables/useListQuery.ts`
- [ ] 1.4.2 编写 `BaseListQueryParams` 接口
- [ ] 1.4.3 编写 `useListQuery` 函数实现

---

## 阶段 2: dev-team 模块迁移 (40 任务，1 周)

### 2.1 config-manage/center

- [ ] 2.1.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/center.ts`
- [ ] 2.1.2 创建 `server/api/dev-team/config-manage/center/mock-data.ts`
- [ ] 2.1.3 创建 `server/api/dev-team/config-manage/center/list.post.ts`
- [ ] 2.1.4 创建 `src/api/dev-team/config-manage/center/index.ts`（TanStack Query hook）
- [ ] 2.1.5 更新 `src/pages/dev-team/config-manage/center/index.vue` 使用新接口

### 2.2 config-manage/dictionary

- [ ] 2.2.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/dictionary.ts`
- [ ] 2.2.2 创建 `server/api/dev-team/config-manage/dictionary/mock-data.ts`
- [ ] 2.2.3 创建 `server/api/dev-team/config-manage/dictionary/list.post.ts`
- [ ] 2.2.4 创建 `src/api/dev-team/config-manage/dictionary/index.ts`
- [ ] 2.2.5 更新 `src/pages/dev-team/config-manage/dictionary/index.vue`

### 2.3 config-manage/type

- [ ] 2.3.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/type.ts`
- [ ] 2.3.2 创建 `server/api/dev-team/config-manage/type/mock-data.ts`
- [ ] 2.3.3 创建 `server/api/dev-team/config-manage/type/list.post.ts`
- [ ] 2.3.4 创建 `src/api/dev-team/config-manage/type/index.ts`
- [ ] 2.3.5 更新 `src/pages/dev-team/config-manage/type/index.vue`

### 2.4 config-manage/item

- [ ] 2.4.1 迁移类型到 `apps/type/src/business/dev-team/config-manage/item.ts`
- [ ] 2.4.2 创建 `server/api/dev-team/config-manage/item/mock-data.ts`
- [ ] 2.4.3 创建 `server/api/dev-team/config-manage/item/list.post.ts`
- [ ] 2.4.4 创建 `src/api/dev-team/config-manage/item/index.ts`
- [ ] 2.4.5 更新 `src/pages/dev-team/config-manage/item/index.vue`

### 2.5 menu-manage/catalog

- [ ] 2.5.1 迁移类型到 `apps/type/src/business/dev-team/menu-manage/catalog.ts`
- [ ] 2.5.2 创建 `server/api/dev-team/menu-manage/catalog/mock-data.ts`
- [ ] 2.5.3 创建 `server/api/dev-team/menu-manage/catalog/list.post.ts`
- [ ] 2.5.4 创建 `src/api/dev-team/menu-manage/catalog/index.ts`
- [ ] 2.5.5 更新 `src/pages/dev-team/menu-manage/catalog/index.vue`

### 2.6 menu-manage/group

- [ ] 2.6.1 迁移类型到 `apps/type/src/business/dev-team/menu-manage/group.ts`
- [ ] 2.6.2 创建 `server/api/dev-team/menu-manage/group/mock-data.ts`
- [ ] 2.6.3 创建 `server/api/dev-team/menu-manage/group/list.post.ts`
- [ ] 2.6.4 创建 `src/api/dev-team/menu-manage/group/index.ts`
- [ ] 2.6.5 更新 `src/pages/dev-team/menu-manage/group/index.vue`

### 2.7 menu-manage/item

- [ ] 2.7.1 迁移类型到 `apps/type/src/business/dev-team/menu-manage/item.ts`
- [ ] 2.7.2 创建 `server/api/dev-team/menu-manage/item/mock-data.ts`
- [ ] 2.7.3 创建 `server/api/dev-team/menu-manage/item/list.post.ts`
- [ ] 2.7.4 创建 `src/api/dev-team/menu-manage/item/index.ts`
- [ ] 2.7.5 更新 `src/pages/dev-team/menu-manage/item/index.vue`

### 2.8 cache-manage/refresh-cache

- [ ] 2.8.1 迁移类型到 `apps/type/src/business/dev-team/cache-manage/refresh-cache.ts`
- [ ] 2.8.2 创建 `server/api/dev-team/cache-manage/refresh-cache/mock-data.ts`
- [ ] 2.8.3 创建 `server/api/dev-team/cache-manage/refresh-cache/list.post.ts`
- [ ] 2.8.4 创建 `src/api/dev-team/cache-manage/refresh-cache/index.ts`
- [ ] 2.8.5 更新 `src/pages/dev-team/cache-manage/refresh-cache/index.vue`

---

## 阶段 3: operation-team 模块迁移 (70 任务，2 周)

> 注：operation-team 有 14 个页面，每个页面 5 个步骤，共 70 任务

### 3.1 data-manage 子模块

- [ ] 3.1.1-3.1.5 迁移 `data-manage/property-management-company`
- [ ] 3.2.1-3.2.5 迁移 `data-manage/*`（其他子页面，按实际结构补充）

### 3.2 merchant-manage 子模块

- [ ] 3.3.1-3.3.5 迁移 `merchant-manage/*`

### 3.3 report-configuration 子模块

- [ ] 3.4.1-3.4.5 迁移 `report-configuration/*`

### 3.4 system-manage 子模块

- [ ] 3.5.1-3.5.5 迁移 `system-manage/change-password`
- [ ] 3.6.1-3.6.5 迁移 `system-manage/*`（其他子页面）

---

## 阶段 4: property-manage 模块迁移 (300 任务，6 周)

> 注：property-manage 有 60 个页面，每个页面 5 个步骤，共 300 任务

### 4.1 expense-manage 子模块 (17 页面 = 85 任务)

#### 4.1.1 house-charge

- [ ] 4.1.1.1 迁移类型到 `apps/type/src/business/property-manage/expense-manage/house-charge.ts`
- [ ] 4.1.1.2 创建 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`
- [ ] 4.1.1.3 创建 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
- [ ] 4.1.1.4 创建 `src/api/property-manage/expense-manage/house-charge/index.ts`
- [ ] 4.1.1.5 更新 `src/pages/property-manage/expense-manage/house-charge/index.vue`

#### 4.1.2-4.1.17 其他 expense-manage 子页面

- [ ] 4.1.2.1-4.1.2.5 迁移 `expense-manage/*`（第 2 个页面）
- [ ] 4.1.3.1-4.1.3.5 迁移 `expense-manage/*`（第 3 个页面）
- [ ] ... （依次类推，共 17 个页面）

### 4.2 house-property-manage 子模块 (10 页面 = 50 任务)

- [ ] 4.2.1.1-4.2.1.5 迁移第 1 个页面
- [ ] 4.2.2.1-4.2.2.5 迁移第 2 个页面
- [ ] ... （共 10 个页面）

### 4.3-4.8 其他 property-manage 子模块

- [ ] 4.3.1-4.3.X 迁移 `community-manage` 子模块
- [ ] 4.4.1-4.4.X 迁移 `contract-manage` 子模块
- [ ] 4.5.1-4.5.X 迁移 `parking-manage` 子模块
- [ ] 4.6.1-4.6.X 迁移 `patrol-manage` 子模块
- [ ] 4.7.1-4.7.X 迁移 `repairs-manage` 子模块
- [ ] 4.8.1-4.8.X 迁移 `report-manage` 子模块

---

## 阶段 5: setting-manage 模块迁移 (35 任务，1 周)

> 注：setting-manage 有 7 个页面，每个页面 5 个步骤，共 35 任务

### 5.1 organize-manage 子模块

- [ ] 5.1.1-5.1.5 迁移第 1 个页面
- [ ] 5.2.1-5.2.5 迁移第 2 个页面
- [ ] ... （依次类推）

### 5.2 system-manage 子模块

- [ ] 5.X.1-5.X.5 迁移剩余页面

---

## 阶段 6: 验证和清理 (30 任务，1 周)

### 6.1 类型检查

- [ ] 6.1.1 运行 `pnpm -F @01s-11comm/type typecheck`
- [ ] 6.1.2 运行 `pnpm -F @01s-11comm/admin typecheck`
- [ ] 6.1.3 修复所有类型错误

### 6.2 功能测试

- [ ] 6.2.1 手动测试 dev-team 模块所有列表页（8 页面）
- [ ] 6.2.2 手动测试 operation-team 模块所有列表页（14 页面）
- [ ] 6.2.3 手动测试 property-manage 模块所有列表页（60 页面）
- [ ] 6.2.4 手动测试 setting-manage 模块所有列表页（7 页面）
- [ ] 6.2.5 验证所有搜索功能正常
- [ ] 6.2.6 验证所有分页功能正常
- [ ] 6.2.7 验证 loading 状态显示正确
- [ ] 6.2.8 验证错误状态提示正确

### 6.3 代码清理

- [ ] 6.3.1 删除 `apps/admin/src/pages/dev-team/**/test-data.ts`（8 个文件）
- [ ] 6.3.2 删除 `apps/admin/src/pages/operation-team/**/test-data.ts`（14 个文件）
- [ ] 6.3.3 删除 `apps/admin/src/pages/property-manage/**/test-data.ts`（60 个文件）
- [ ] 6.3.4 删除 `apps/admin/src/pages/setting-manage/**/test-data.ts`（7 个文件）
- [ ] 6.3.5 运行 `pnpm typecheck` 确认无报错

### 6.4 文档更新

- [ ] 6.4.1 更新 `.claude/agents/make-list-page.md`（反映新的数据获取方式）
- [ ] 6.4.2 编写迁移总结报告到 `apps/admin/src/docs/reports/`
- [ ] 6.4.3 更新 `CLAUDE.md` 项目说明
- [ ] 6.4.4 更新相关 API 文档

### 6.5 OpenSpec 验证和归档准备

- [ ] 6.5.1 运行 `openspec validate migrate-static-data-to-nitro-query --strict`
- [ ] 6.5.2 修复所有验证错误
- [ ] 6.5.3 准备归档文档（等待部署后执行归档）

### 6.6 CI/CD 配置

- [ ] 6.6.1 确保 apps/type 在 CI 中正确构建
- [ ] 6.6.2 添加类型检查到 CI 流程
- [ ] 6.6.3 添加 Nitro 接口测试（可选）

---

## 任务统计

|   阶段   |           名称           | 任务数 | 预计时间 |
| :------: | :----------------------: | :----: | :------: |
|    1     |       基础设施搭建       |   15   |   1 周   |
|    2     |    dev-team 模块迁移     |   40   |   1 周   |
|    3     | operation-team 模块迁移  |   70   |   2 周   |
|    4     | property-manage 模块迁移 |  300   |   6 周   |
|    5     | setting-manage 模块迁移  |   35   |   1 周   |
|    6     |        验证和清理        |   30   |   1 周   |
| **总计** |                          | **490** | **12 周** |

## 注意事项

1. **增量迁移**：必须按阶段顺序执行，每完成一个模块立即验证
2. **类型检查**：每个阶段结束后运行 typecheck 确保无报错
3. **功能验证**：每迁移一个页面，手动测试搜索和分页功能
4. **脚本自动化**：建议在阶段 2 完成后编写自动化脚本，减少阶段 3-5 的工作量
5. **风险控制**：如果某个页面迁移失败，立即回滚并分析原因，不要继续迁移下一个

## 关键里程碑

- **Week 1**: 基础设施就绪，试点页面完成
- **Week 2**: dev-team 模块完成，验证迁移流程
- **Week 4**: operation-team 模块完成
- **Week 10**: property-manage 模块完成
- **Week 11**: setting-manage 模块完成
- **Week 12**: 全部验证通过，文档更新完成
