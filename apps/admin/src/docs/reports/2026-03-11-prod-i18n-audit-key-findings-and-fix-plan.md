# 2026-03-11 生产环境 i18n 巡检关键结论与修复计划报告

## 1. 背景与目标

根据本次任务要求，已围绕生产站点 `https://01s-11.ruan-cat.com/` 的 i18n 使用质量，结合代码侧逐页排查，形成可落地的修复线索与实施计划。

本报告目标：

1. 固化关键结论，避免上下文丢失；
2. 输出页面/路由/文件映射，便于后续直接修复；
3. 提供分批次修复计划与验收标准。

---

## 2. 本次巡检范围与方式

### 2.1 巡检范围

- 首页仪表盘：`apps/admin/src/views/welcome/**`
- 开发团队模块：`apps/admin/src/pages/dev-team/**`
- 组织管理模块：`apps/admin/src/pages/setting-manage/organize-manage/**`

### 2.2 检查方式

- 线上可见页面巡检（结合既有巡检结论）
- 源码硬编码扫描（中文文本检索）
- i18n 机制核验（`transformI18n` 与 locales 装载规则）

---

## 3. 关键结论（必须保留）

1. 当前问题是“模块级”而非“单点问题”：
   - `welcome`、`dev-team`、`setting-manage/organize-manage` 均存在大面积中文硬编码。
2. `common.yaml` 的通用按钮 key 可复用，但业务词条覆盖明显不足。
3. `transformI18n` 对未知 key 会回退原文，导致：
   - 页面可正常显示；
   - 但英文切换时仍显示中文，形成隐性漏国际化。
4. 当前 `locales` 中已存在多个业务域文件，说明本项目支持业务分域 i18n；
   - 但尚未形成 `dev-team`、`setting-manage/organize-manage`、`welcome` 的成体系词条。

---

## 4. 证据汇总（扫描结果）

### 4.1 中文硬编码文件数量（本轮检索）

- `apps/admin/src/views/welcome/**`：5 个文件
- `apps/admin/src/pages/dev-team/**`：31 个文件
- `apps/admin/src/pages/setting-manage/organize-manage/**`：24 个文件

> 说明：该数量用于风险量级评估；后续修复以“页面入口 + 直接渲染路径”优先。

### 4.2 机制证据

- i18n 加载规则：`apps/admin/src/plugins/i18n.ts` 使用 `import.meta.glob("../../locales/**")`，支持新增业务 yaml 自动被加载。
- 回退行为：`transformI18n` 在 key 不存在时直接返回原 message。

---

## 5. 高优先问题清单（页面 -> 文件映射）

> 优先级说明：
>
> - P0：首页/核心入口，且存在大量可见硬编码
> - P1：业务列表页主入口，影响范围大
> - P2：子组件/表单深层文案

| 优先级 | 页面/路由线索             | 主要问题类型                               | 对应源码文件                                                                                                                                  |
| ------ | ------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| P0     | 首页 Welcome              | 标题、提示、时间线文本硬编码               | `apps/admin/src/views/welcome/index.vue`                                                                                                      |
| P0     | 首页 Welcome 数据源       | 卡片名称、周几、动态文案硬编码             | `apps/admin/src/views/welcome/data.ts`                                                                                                        |
| P0     | 首页统计表格              | 列名、过滤文本、空态、tooltip 硬编码       | `apps/admin/src/views/welcome/components/table/columns.tsx` / `.../table/index.vue`                                                           |
| P0     | 首页柱状图                | legend / xAxis / series 文案硬编码         | `apps/admin/src/views/welcome/components/charts/ChartBar.vue`                                                                                 |
| P1     | 开发团队-配置中心         | 页面标题、表格标题、搜索项、按钮混合硬编码 | `apps/admin/src/pages/dev-team/config-manage/center/index.vue`                                                                                |
| P1     | 开发团队-字典管理         | 页面标题、列名、搜索项、业务按钮硬编码     | `apps/admin/src/pages/dev-team/config-manage/dictionary/index.vue`                                                                            |
| P1     | 开发团队-配置项管理       | 页面标题、列名、搜索项硬编码               | `apps/admin/src/pages/dev-team/config-manage/item/index.vue`                                                                                  |
| P1     | 开发团队-配置类型         | 页面标题、列名、搜索项硬编码               | `apps/admin/src/pages/dev-team/config-manage/type/index.vue`                                                                                  |
| P1     | 开发团队-菜单目录/分组/项 | `definePage.meta.title` 与列表文案硬编码   | `apps/admin/src/pages/dev-team/menu-manage/catalog/index.vue` / `group/index.vue` / `item/index.vue`                                          |
| P1     | 开发团队-刷新缓存         | 页面标题、操作按钮与提示硬编码             | `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/index.vue`                                                                          |
| P1     | 组织管理-组织信息         | 标题、消息提示、列名硬编码                 | `apps/admin/src/pages/setting-manage/organize-manage/org-info/index.vue`                                                                      |
| P1     | 组织管理-人员信息         | 标题、按钮、提示硬编码                     | `apps/admin/src/pages/setting-manage/organize-manage/staff-info/index.vue`                                                                    |
| P1     | 组织管理-角色权限         | tab 文案、按钮、提示硬编码                 | `apps/admin/src/pages/setting-manage/organize-manage/role-permission/index.vue`                                                               |
| P1     | 组织管理-数据权限         | tab 文案、列名、提示硬编码                 | `apps/admin/src/pages/setting-manage/organize-manage/data-permission/index.vue`                                                               |
| P1     | 组织管理-排班相关         | 标题、确认弹窗、提示文本硬编码             | `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/index.vue` / `scheduling-setting/index.vue` / `shift-setting/index.vue` |

---

## 6. 修复策略（推荐执行顺序）

### 6.1 第一批（P0）

先完成 `welcome` 全链路：

1. `welcome/index.vue`
2. `welcome/data.ts`
3. `welcome/components/table/columns.tsx`
4. `welcome/components/table/index.vue`
5. `welcome/components/charts/ChartBar.vue`

目标：先保证首页中英切换全部生效。

### 6.2 第二批（P1-开发团队）

按 `rank-route-keys.ts` 的三级业务路径顺序修复：

- `devTeam.configManage.*`
- `devTeam.menuManage.*`
- `devTeam.cacheManage.refreshCache`

### 6.3 第三批（P1-组织管理）

按 `settingManage.organizeManage.*` 顺序修复：

- `orgInfo` -> `staffInfo` -> `rolePermission` -> `dataPermission` -> `workingSchedule` -> `schedulingSetting` -> `shiftSetting`

---

## 7. i18n 词条补齐建议

### 7.1 复用原则

- 通用按钮优先复用：`common.buttons.*`
- 通用表格操作优先复用：`common.table.operation`

### 7.2 建议新增业务域（后续修复阶段实施）

- `apps/admin/locales/zh-CN/dev-team.yaml`
- `apps/admin/locales/en/dev-team.yaml`
- `apps/admin/locales/zh-CN/setting-manage_organize-manage.yaml`
- `apps/admin/locales/en/setting-manage_organize-manage.yaml`
- `apps/admin/locales/zh-CN/welcome.yaml`
- `apps/admin/locales/en/welcome.yaml`

> 备注：命名可在实施时再统一确认；i18n 插件会自动加载上述路径下新增 yaml。

---

## 8. 验收标准（必须满足）

1. 目标页面切换到英文后，不再出现中文硬编码。
2. 页面内按钮、表头、提示、空态、图例、轴标签都可随语言切换。
3. 不新增重复的通用按钮 key（优先复用 `common.*`）。
4. 不破坏现有页面交互与数据请求逻辑。

---

## 9. 当前状态与后续动作

### 9.1 当前状态

- 已完成：问题范围确认、关键文件定位、修复优先级排序。
- 已完成（第一批 Welcome）：
  - `apps/admin/src/views/welcome/index.vue`
  - `apps/admin/src/views/welcome/data.ts`
  - `apps/admin/src/views/welcome/components/table/columns.tsx`
  - `apps/admin/src/views/welcome/components/table/index.vue`
  - `apps/admin/src/views/welcome/components/charts/ChartBar.vue`
  - `apps/admin/locales/zh-CN/welcome.yaml`
  - `apps/admin/locales/en/welcome.yaml`
- 已完成（第二批 Dev-Team 第一轮，config-manage 主页面）：
  - `apps/admin/src/pages/dev-team/config-manage/index.vue`
  - `apps/admin/src/pages/dev-team/config-manage/center/index.vue`
  - `apps/admin/src/pages/dev-team/config-manage/center/components/dialog.ts`
  - `apps/admin/src/pages/dev-team/config-manage/dictionary/index.vue`
  - `apps/admin/src/pages/dev-team/config-manage/item/index.vue`
  - `apps/admin/src/pages/dev-team/config-manage/type/index.vue`
  - `apps/admin/locales/zh-CN/dev-team.yaml`
  - `apps/admin/locales/en/dev-team.yaml`
- 已完成（2026-03-11 本轮生产环境英文模式复核）：
  - 通过 Chrome DevTools 直接访问并复核以下页面：
    - `#/dev-team/menu-manage/catalog`
    - `#/dev-team/menu-manage/group`
    - `#/dev-team/menu-manage/item`
    - `#/dev-team/cache-manage/refresh-cache`
    - `#/setting-manage/organize-manage/org-info`
    - `#/setting-manage/organize-manage/staff-info`
    - `#/setting-manage/organize-manage/role-permission`
    - `#/setting-manage/organize-manage/data-permission`
    - `#/setting-manage/organize-manage/working-schedule`
    - `#/setting-manage/organize-manage/scheduling-setting`
    - `#/setting-manage/organize-manage/shift-setting`
  - 复核结论：
    - 英文模式下仍存在大量中文页面标题、左侧菜单标题、表头、搜索标签、tab 文案、业务按钮与提示文本。
    - `dev-team` 顶层与二级菜单 `开发团队` / `菜单管理` / `缓存管理` 也未完成 i18n。
    - `setting-manage` 顶层与二级菜单 `设置` / `组织管理` 未完成 i18n。
- 已完成（2026-03-11 本轮代码修复进行中）：
  - 已将以下入口页 `meta.title` 替换为 i18n key，并按要求补充中文注释：
    - `apps/admin/src/pages/dev-team/index.vue`
    - `apps/admin/src/pages/dev-team/menu-manage/index.vue`
    - `apps/admin/src/pages/dev-team/cache-manage/index.vue`
    - `apps/admin/src/pages/dev-team/menu-manage/catalog/index.vue`
    - `apps/admin/src/pages/dev-team/menu-manage/group/index.vue`
    - `apps/admin/src/pages/dev-team/menu-manage/item/index.vue`
    - `apps/admin/src/pages/dev-team/cache-manage/refresh-cache/index.vue`
    - `apps/admin/src/pages/setting-manage/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/org-info/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/staff-info/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/role-permission/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/data-permission/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/index.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/index.vue`
  - 已新增并开始使用业务域 locale 文件：
    - `apps/admin/locales/zh-CN/setting-manage_organize-manage.yaml`
    - `apps/admin/locales/en/setting-manage_organize-manage.yaml`
  - 已继续扩展 `apps/admin/locales/zh-CN/dev-team.yaml` 与 `apps/admin/locales/en/dev-team.yaml`，覆盖 `menuManage` 与 `cacheManage.refreshCache` 页面可见文案。
- 已完成（2026-03-11 本轮弹窗 / 表单层线上复核）：
  - 通过 Chrome DevTools 直接点击并复核以下页面的新增弹窗：
    - `#/setting-manage/organize-manage/staff-info`
    - `#/setting-manage/organize-manage/role-permission`
    - `#/setting-manage/organize-manage/shift-setting`
  - 复核结论：
    - 弹窗标题仍表现为 `Add员工`、`Add角色权限`、`Add班次设置` 这类“英文动作 + 中文业务名”的混合文案。
    - 表单内部仍存在中文标签、中文 placeholder、中文校验消息与中文选项值标签。
    - `staff-info` 线上“照片”字段当前渲染为普通输入框，现有上传插槽本身未在线上正确生效；本轮仅处理该字段的 i18n，不调整其上传逻辑。
- 已完成（2026-03-11 本轮弹窗 / 表单层代码修复）：
  - 已修复以下直连表单组件的标签、placeholder、校验提示与选项文案 i18n：
    - `apps/admin/src/pages/dev-team/menu-manage/catalog/components/form.vue`
    - `apps/admin/src/pages/dev-team/menu-manage/group/components/form.vue`
    - `apps/admin/src/pages/dev-team/menu-manage/item/components/form.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/org-info/components/form.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/staff-info/components/form.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/role-permission/components/form.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/working-schedule/components/form.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/scheduling-setting/components/form.vue`
    - `apps/admin/src/pages/setting-manage/organize-manage/shift-setting/components/form.vue`
  - 已同步补齐以下 locale 词条，用于承接表单层文案：
    - `apps/admin/locales/zh-CN/dev-team.yaml`
    - `apps/admin/locales/en/dev-team.yaml`
    - `apps/admin/locales/zh-CN/setting-manage_organize-manage.yaml`
    - `apps/admin/locales/en/setting-manage_organize-manage.yaml`
- 未完成：
  - `dev-team` 与 `setting-manage/organize-manage` 仍需继续做整页英文模式回归验证。
  - 顶层 / 二级菜单路由文案是否已被当前本地改动完全覆盖，仍需在本地运行态复核。
  - 仓库当前 `vue-tsc` 存在大量既有服务端 Drizzle 类型报错，本轮无法用全量类型检查作为 i18n 变更的纯净验收手段。

### 9.2 下一步动作

1. 对已修改入口页与直连弹窗执行本地英文模式人工回归；
2. 继续收口仍未覆盖的 `dev-team` 其余页面与组织管理残余运行时提示；
3. 将最终完成页清单补充为“已修复/待继续”状态。

---

## 10. 附：本报告用途

本报告用于在跨会话、多代理并行和上下文压缩情况下保存核心结论，避免信息丢失与重复排查。
