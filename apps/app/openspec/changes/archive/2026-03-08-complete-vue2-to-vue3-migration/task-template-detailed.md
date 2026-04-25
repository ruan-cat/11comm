# 详细任务模板示例

## 单个页面迁移任务的标准格式

以下是一个完整的任务模板示例，展示了如何详细描述每个页面的迁移任务：

---

### 示例 1：表单页面迁移（核销优惠券）

- [ ] 5.7.1 迁移 src/pages-sub/coupon/write-off-coupon.vue（核销优惠券）

  **基本信息**：
  - **源文件**：`gitee-example/pages/coupon/writeOffCoupon.vue`
  - **目标文件**：`src/pages-sub/coupon/write-off-coupon.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：核销优惠券，输入券码或扫码核销

  **必需技能清单**（按执行顺序）：
  1. **code-migration**（`.claude/skills/code-migration/SKILL.md`）
     - Vue2 Options API → Vue3 Composition API
     - JavaScript → TypeScript
     - 生命周期钩子迁移
     - 响应式数据处理

  2. **component-migration**（`.claude/skills/component-migration/SKILL.md`）
     - ColorUI 组件 → wot-design-uni 组件
     - uni-app 内置组件 → wot-design-uni 组件
     - 修复组件使用错误（类型、插槽、嵌套）

  3. **style-migration**（`.claude/skills/style-migration/SKILL.md`）
     - ColorUI 类名 → UnoCSS 原子类
     - 固定像素 → 响应式单位
     - SCSS 变量 → UnoCSS 主题配置

  4. **api-migration**（`.claude/skills/api-migration/SKILL.md`）
     - Java110Context + uni.request → Alova + TypeScript
     - 编写 Mock 接口
     - 定义 TypeScript 接口类型
     - useRequest 集成

  5. **route-migration**（`.claude/skills/route-migration/SKILL.md`）
     - pages.json 配置 → 约定式路由
     - 路由参数处理
     - 页面配置迁移

  6. **use-wd-form**（`.claude/skills/use-wd-form/SKILL.md`）
     - 使用 `<wd-form>` 包裹表单
     - 添加表单验证规则
     - 使用 wd-picker 实现选择功能（禁止使用 wd-radio-group）
     - 表单提交前验证

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 添加 FormSectionTitle 组件（如果需要分区）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  8. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
     - 为所有 useRequest 添加 onError 回调
     - 使用 uni.showToast 显示错误信息

  **迁移步骤**：
  1. **技能触发检查**（强制执行）
     - 打开 `.claude/skills/check-trigger.md`
     - 逐项回答检查问题
     - 生成完整的技能清单
     - 确认多技能协同关系

  2. **创建子代理团队**
     - 使用 TeamCreate 创建 Agent Team
     - 团队名称：`migration-coupon-write-off-coupon`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有 8 个技能的主文件（SKILL.md）
     - 阅读相关子文档：
       - `beautiful-component-design/form-section-title.md`
       - `beautiful-component-design/icon-usage.md`
       - `use-wd-form/` 下的所有子文档
     - 查阅示例文件：
       - `src/pages-sub/repair/add-order.vue`（表单页面示例）
       - `src/pages-sub/repair/handle.vue`（表单页面示例）
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移：
       a. 代码写法迁移（code-migration）
       b. 组件替换（component-migration）
       c. 样式迁移（style-migration）
       d. API 迁移（api-migration）
       e. 路由迁移（route-migration）
       f. 表单规范应用（use-wd-form）
       g. 组件美化（beautiful-component-design）
       h. 错误处理（api-error-handling）
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证：
       - 正则表达式搜索：`Grep: pattern="<wd-form" path="src/pages-sub/coupon/write-off-coupon.vue"`
       - 搜索 onError 回调：`Grep: pattern="onError" path="src/pages-sub/coupon/write-off-coupon.vue"`
       - 搜索 FormSectionTitle：`Grep: pattern="FormSectionTitle" path="src/pages-sub/coupon/write-off-coupon.vue"`
     - 逐项检查技能规范：
       - [ ] 代码使用 Vue3 Composition API + TypeScript
       - [ ] 组件使用 wot-design-uni
       - [ ] 样式使用 UnoCSS 原子类
       - [ ] API 使用 Alova + Mock
       - [ ] 表单使用 `<wd-form>` 组件
       - [ ] 选择功能使用 wd-picker（不是 wd-radio-group）
       - [ ] 分区标题使用 FormSectionTitle（不是 `<view class="section-title">`）
       - [ ] 所有 API 调用有 onError 回调
     - 发现问题时向代码迁移子代理反馈
     - 生成审核报告

  6. **团队清理**
     - 审核通过后，删除代码迁移子代理
     - 保留技能指导和审核子代理供下一个文件使用

  **验收标准**：
  - [ ] **代码规范**：
    - 使用 Vue3 Composition API（`<script setup lang="ts">`）
    - 使用 TypeScript 类型定义
    - 使用 ref/reactive 管理状态
    - 使用 onMounted 等组合式 API

  - [ ] **组件规范**：
    - 使用 wot-design-uni 组件库
    - 表单使用 `<wd-form>` 包裹
    - 选择功能使用 `wd-picker`（不是 wd-radio-group）
    - 分区标题使用 `FormSectionTitle`（不是 `<view class="section-title">`）

  - [ ] **样式规范**：
    - 使用 UnoCSS 原子类
    - 不使用 ColorUI 类名
    - 使用响应式单位（rpx、%、vh/vw）

  - [ ] **API 规范**：
    - 使用 Alova useRequest
    - 定义 TypeScript 接口类型
    - 所有 API 调用有 onError 回调
    - Mock 接口已编写

  - [ ] **路由规范**：
    - 使用约定式路由
    - 文件路径符合 kebab-case 命名

  - [ ] **合规性检查**：
    - 通过 use-wd-form 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时（包含子代理团队协作）

---

### 示例 2：列表页面迁移（采购列表）

- [ ] 3.1.3 迁移 src/pages-sub/purchase/list.vue（采购列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/purchaseList/purchaseList.vue`
  - **目标文件**：`src/pages-sub/purchase/list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：显示采购申请列表，支持分页加载和筛选

  **必需技能清单**（按执行顺序）：
  1. **code-migration**（`.claude/skills/code-migration/SKILL.md`）
  2. **component-migration**（`.claude/skills/component-migration/SKILL.md`）
  3. **style-migration**（`.claude/skills/style-migration/SKILL.md`）
  4. **api-migration**（`.claude/skills/api-migration/SKILL.md`）
  5. **route-migration**（`.claude/skills/route-migration/SKILL.md`）
  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新
  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
  8. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）

  **迁移步骤**：

  （与示例 1 类似，但重点关注 z-paging 集成）
  1. 技能触发检查
  2. 创建子代理团队
  3. 技能指导子代理学习所有技能
  4. 代码迁移子代理执行迁移（特别注意 z-paging 与 useRequest 的集成）
  5. 审核子代理验证合规性
  6. 团队清理

  **验收标准**：
  - [ ] **代码规范**：（同示例 1）
  - [ ] **组件规范**：
    - 使用 wot-design-uni 组件库
    - 使用 `<z-paging>` 组件实现分页
  - [ ] **样式规范**：（同示例 1）
  - [ ] **API 规范**：（同示例 1）
  - [ ] **路由规范**：（同示例 1）
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查

  **预计耗时**：2-3 小时

---

### 示例 3：详情页面迁移（采购详情）

- [ ] 3.2.3 迁移 src/pages-sub/resource/purchase-apply-detail.vue（采购申请详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/purchaseApplyDetail.vue`
  - **目标文件**：`src/pages-sub/resource/purchase-apply-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：显示采购申请的详细信息

  **必需技能清单**（按执行顺序）：
  1. **code-migration**（`.claude/skills/code-migration/SKILL.md`）
  2. **component-migration**（`.claude/skills/component-migration/SKILL.md`）
  3. **style-migration**（`.claude/skills/style-migration/SKILL.md`）
  4. **api-migration**（`.claude/skills/api-migration/SKILL.md`）
  5. **route-migration**（`.claude/skills/route-migration/SKILL.md`）
  6. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加图标
     - 响应式设计

  **注意**：详情页面不需要 use-wd-form 和 z-paging-integration 技能。

  **迁移步骤**：（与示例 1 类似，但不涉及表单和分页）

  **验收标准**：
  - [ ] **代码规范**：（同示例 1）
  - [ ] **组件规范**：
    - 使用 wot-design-uni 组件库
    - 使用 wd-cell-group 和 wd-cell 展示信息
  - [ ] **样式规范**：（同示例 1）
  - [ ] **API 规范**：（同示例 1）
  - [ ] **路由规范**：（同示例 1）
  - [ ] **合规性检查**：
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

---

## 任务模板使用说明

### 如何使用这个模板

1. **识别页面类型**：
   - 表单页面 → 使用示例 1 模板
   - 列表页面 → 使用示例 2 模板
   - 详情页面 → 使用示例 3 模板

2. **填充基本信息**：
   - 从 `docs/prompts/route-migration-map.yml` 获取源文件和目标文件路径
   - 根据业务功能确定页面类型

3. **确定技能清单**：
   - 使用 `.claude/skills/check-trigger.md` 进行技能触发检查
   - 根据页面类型添加或删除技能

4. **调整迁移步骤**：
   - 根据页面复杂度调整步骤细节
   - 确保子代理团队协作流程清晰

5. **定义验收标准**：
   - 根据技能清单定义具体的验收标准
   - 确保每个标准都可被验证

### 模板变体

- **简单页面**（如静态展示页）：可以简化技能清单和验收标准
- **复杂页面**（如多步骤表单）：需要增加更详细的步骤和验收标准
- **特殊页面**（如需要动态标题）：需要添加 `use-uniapp-dynamic-page-title` 技能

---

## 建议

将 `openspec/changes/complete-vue2-to-vue3-migration/tasks.md` 中的所有简单任务项替换为使用此模板的详细任务项。

每个任务项都应该包含：

- 基本信息
- 必需技能清单
- 迁移步骤
- 验收标准
- 预计耗时
