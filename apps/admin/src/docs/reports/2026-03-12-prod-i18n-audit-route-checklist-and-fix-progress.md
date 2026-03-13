<!-- 未来完成 i18n 后，可以删除 -->

# 2026-03-12 生产环境 i18n 路由清单与修复进度

## 1. 审计方式

- 审计站点：`https://01s-11.ruan-cat.com/`
- 审计方式：Chrome DevTools MCP 直接访问生产环境，在英文模式下逐页切换路由复核
- 对照基线：`apps/admin/src/docs/reports/2026-03-11-prod-i18n-audit-key-findings-and-fix-plan.md`
- 本轮本地回归：`http://localhost:8080/` 英文模式复核
- 当前续做策略：基于此前的生产审计清单，只继续在本地 `http://localhost:8080/` 做修复与复核，不再重新巡检生产环境页面

## 2. 生产环境问题清单

### 2.1 已在本地完成修复

- `[x]` `#/setting-manage/system-manage/change-password`
- `[x]` `#/setting-manage/system-manage/system-config`
- `[x]` `#/setting-manage/system-manage/register-protocol`
- `[x]` `#/setting-manage/system-manage/initialize-cell`
- `[x]` `#/setting-manage/system-manage/community-configuration`
- `[x]` `#/operation-team/data-manage/community-information`
- `[x]` `#/operation-team/data-manage/property-management-company`

说明：

- 本地英文模式已确认上述 7 个页面不再出现 raw key。
- `register-protocol` 页面的协议正文仍然来自接口 / mock 数据，正文内容当前仍是中文数据，不属于组件层 key 未接入问题。
- `community-configuration`、`initialize-cell` 页面中部分中文仍来自样例数据值，例如小区名、配置名、初始化项目结果，这类属于数据层内容，不是按钮 / 表头 / 搜索项 / route meta.title 漏接 i18n。
- `community-information`、`property-management-company` 页面本轮同时按 `.claude/skills/frontend-development` 重新对齐了列表页搜索模型声明顺序，并把搜索重置改回 `structuredClone`。
- `property-management-company` 页面本地复核时额外暴露出一个原有导入路径拼写错误，已做最小修正恢复路由加载，否则无法继续验证 i18n。

### 2.2 已在本地完成菜单 / 模块入口标题修复

- `[x]` 顶部菜单 `operationTeam.pageTitle`
- `[x]` 顶部菜单 `propertyManage.pageTitle`
- `[x]` `#/operation-team/system-manage`
- `[x]` `#/operation-team/data-manage`
- `[x]` `#/operation-team/merchant-manage`
- `[x]` `#/operation-team/report-configuration`
- `[x]` `#/property-manage/community-manage`
- `[x]` `#/property-manage/contract-manage`
- `[x]` `#/property-manage/expense-manage`
- `[x]` `#/property-manage/house-property-manage`
- `[x]` `#/property-manage/parking-manage`
- `[x]` `#/property-manage/patrol-manage`
- `[x]` `#/property-manage/repairs-manage`
- `[x]` `#/property-manage/report-manage`

说明：

- 本轮先把全局菜单和二级模块入口的 `definePage.meta.title` 改成规范的 i18n key，并补齐中文注释。
- 这样英文模式下顶部导航和大部分模块入口菜单已经不再直接显示中文标题。

### 2.3 仍待继续修复的页面组

- `[ ]` `#/operation-team/system-manage/change-password`
- `[ ]` `#/operation-team/system-manage/system-config`
- `[ ]` `#/operation-team/system-manage/register-protocol`
- `[ ]` `#/operation-team/system-manage/initialize-cell`
- `[ ]` `#/operation-team/system-manage/community-configuration`
- `[ ]` `#/operation-team/merchant-manage/merchant-info`
- `[ ]` `#/operation-team/merchant-manage/merchant-admin`
- `[ ]` `#/operation-team/report-configuration/report-group`
- `[ ]` `#/operation-team/report-configuration/report-info`
- `[ ]` `#/operation-team/report-configuration/report-component`
- `[ ]` `#/property-manage/community-manage/*`
- `[ ]` `#/property-manage/contract-manage/*`
- `[ ]` `#/property-manage/expense-manage/*`
- `[ ]` `#/property-manage/house-property-manage/*`
- `[ ]` `#/property-manage/parking-manage/*`
- `[ ]` `#/property-manage/patrol-manage/*`
- `[ ]` `#/property-manage/repairs-manage/*`
- `[ ]` `#/property-manage/report-manage/*`

说明：

- 上述页面在生产环境英文模式下仍能看到中文表头、搜索项、按钮、弹框标题或业务提示文案。
- `operation-team` 与 `property-manage` 的深层页面数量较多，本轮先完成了 `setting-manage/system-manage` 整组和全局导航标题的收口，剩余页面继续按模块分批推进。

## 3. 本轮已修改文件

- `apps/admin/locales/zh-CN/setting-manage_system-manage.yaml`
- `apps/admin/locales/en/setting-manage_system-manage.yaml`
- `apps/admin/locales/zh-CN/operation-team.yaml`
- `apps/admin/locales/en/operation-team.yaml`
- `apps/admin/locales/zh-CN/property-manage.yaml`
- `apps/admin/locales/en/property-manage.yaml`
- `apps/admin/src/pages/setting-manage/system-manage/index.vue`
- `apps/admin/src/pages/setting-manage/system-manage/change-password/index.vue`
- `apps/admin/src/pages/setting-manage/system-manage/system-config/index.vue`
- `apps/admin/src/pages/setting-manage/system-manage/system-config/components/form.vue`
- `apps/admin/src/pages/setting-manage/system-manage/register-protocol/index.vue`
- `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/index.vue`
- `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/components/form.vue`
- `apps/admin/src/pages/setting-manage/system-manage/initialize-cell/components/format-form.vue`
- `apps/admin/src/pages/setting-manage/system-manage/community-configuration/index.vue`
- `apps/admin/src/pages/setting-manage/system-manage/community-configuration/components/form.vue`
- `apps/admin/src/pages/operation-team/index.vue`
- `apps/admin/src/pages/operation-team/system-manage/index.vue`
- `apps/admin/src/pages/operation-team/data-manage/index.vue`
- `apps/admin/locales/zh-CN/operation-team_data-manage.yaml`
- `apps/admin/locales/en/operation-team_data-manage.yaml`
- `apps/admin/src/pages/operation-team/data-manage/community-information/index.vue`
- `apps/admin/src/pages/operation-team/data-manage/community-information/components/form.vue`
- `apps/admin/src/pages/operation-team/data-manage/property-management-company/index.vue`
- `apps/admin/src/pages/operation-team/data-manage/property-management-company/components/form.vue`
- `apps/admin/src/pages/operation-team/merchant-manage/index.vue`
- `apps/admin/src/pages/operation-team/report-configuration/index.vue`
- `apps/admin/src/pages/property-manage/index.vue`
- `apps/admin/src/pages/property-manage/community-manage/index.vue`
- `apps/admin/src/pages/property-manage/contract-manage/index.vue`
- `apps/admin/src/pages/property-manage/expense-manage/index.vue`
- `apps/admin/src/pages/property-manage/house-property-manage/index.vue`
- `apps/admin/src/pages/property-manage/parking-manage/index.vue`
- `apps/admin/src/pages/property-manage/patrol-manage/index.vue`
- `apps/admin/src/pages/property-manage/repairs-manage/index.vue`
- `apps/admin/src/pages/property-manage/report-manage/index.vue`

## 4. 本轮验收记录

- 本地 `vue-tsc --noEmit` / `tsc --noEmit` 针对 `src/pages/setting-manage/system-manage/**` 的筛选结果已经无新增报错输出。
- 本地 `vue-tsc --noEmit` / `tsc --noEmit` 针对 `operation-team/data-manage` 与 `src/plugins/i18n.ts` 的筛选结果无新增报错输出。
- 本地 Chrome MCP 英文模式复核：
  - `setting-manage/system-manage` 菜单标题已英文化
  - 顶部导航里的 `Operations Team`、`Property Menu` 已英文化
  - `community-configuration` 页面搜索项、表头、按钮、面包屑已英文化
  - `operation-team/data-manage/community-information` 页面标题、搜索项、表头、按钮、弹框标题与表单字段已英文化
  - `operation-team/data-manage/property-management-company` 页面标题、搜索项、表头、按钮、弹框标题与表单字段已英文化
  - 两个页面控制台都未再出现 i18n key 未命中的警告；仅剩 Element Plus 表单缺少 `id/name` 的通用 issue，不属于本轮 i18n 范围

## 5. 下一步

1. 继续按模块修复 `operation-team/system-manage` 5 个页面的表格、搜索项、弹框和选项文本。
2. 继续修复 `operation-team/merchant-manage`、`operation-team/report-configuration` 的页面层 i18n。
3. 再按 `property-manage` 的二级模块逐组推进深层页面和弹框表单。
