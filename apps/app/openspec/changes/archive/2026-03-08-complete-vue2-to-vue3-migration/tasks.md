## 1. 准备阶段

- [x] 1.1 验证所有 Skills 文档完整且最新
- [x] 1.2 确认路由映射表（route-migration-map.yml）准确无误
- [x] 1.3 创建迁移进度追踪系统
- [x] 1.4 初始化 140 个页面的状态为"未开始"

## 2. 阶段 1：合规性修复（P0 问题）

### 2.1 修复 api-error-handling 问题（inspection 模块 - 8 个文件）

- [x] 2.1.1 修复 src/pages-sub/inspection/task-list.vue - 添加 onError 回调
- [x] 2.1.2 修复 src/pages-sub/inspection/today-report.vue - 添加 onError 回调
- [x] 2.1.3 修复 src/pages-sub/inspection/staff-no-task.vue - 添加 onError 回调
- [x] 2.1.4 修复 src/pages-sub/inspection/execute.vue - 添加 onError 回调
- [x] 2.1.5 修复 src/pages-sub/inspection/execute-single.vue - 添加 onError 回调
- [x] 2.1.6 修复 src/pages-sub/inspection/execute-qrcode.vue - 添加 onError 回调
- [x] 2.1.7 修复 src/pages-sub/inspection/transfer.vue - 添加 onError 回调
- [x] 2.1.8 修复 src/pages-sub/inspection/reexamine.vue - 添加 onError 回调

### 2.2 修复 z-paging 问题（5 个文件）

- [x] 2.2.1 修复 src/pages-sub/complaint/list.vue - 添加 z-paging 组件
- [x] 2.2.2 修复 src/pages-sub/complaint/finish.vue - 添加 z-paging 组件
- [x] 2.2.3 修复 src/pages-sub/property/apply-room.vue - 添加 z-paging 组件
- [x] 2.2.4 修复 src/pages-sub/property/apply-room-record.vue - 添加 z-paging 组件
- [x] 2.2.5 修复 src/pages/activity/index.vue - 添加 z-paging 组件

### 2.3 修复 use-wd-form 问题（7 个文件）

- [x] 2.3.1 修复 src/pages-sub/repair/appraise-reply.vue - 添加 wd-form 组件
- [x] 2.3.2 修复 src/pages-sub/complaint/order.vue - 添加 wd-form 组件
- [x] 2.3.3 修复 src/pages-sub/complaint/handle.vue - 添加 wd-form 组件
- [x] 2.3.4 修复 src/pages-sub/complaint/audit.vue - 添加 wd-form 组件
- [x] 2.3.5 修复 src/pages-sub/complaint/appraise-reply.vue - 添加 wd-form 组件

### 2.4 合规性修复验收

- [x] 2.4.1 对所有修复文件进行合规性检查
- [x] 2.4.2 生成合规性修复报告
- [x] 2.4.3 确认合规性通过率达到 100%

## 3. 阶段 2：高优先级模块迁移

### 3.1 resource_modules - 采购申请流程（5 个页面）

- [x] 3.1.1 迁移 src/pages-sub/purchase/request.vue（采购申请）

  **基本信息**：
  - **源文件**：`gitee-example/pages/purchaseRequest/purchaseRequest.vue`
  - **目标文件**：`src/pages-sub/purchase/request.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：采购申请

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
     - 团队名称：`migration-request`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.1.2 迁移 src/pages-sub/purchase/review.vue（采购审核）

  **基本信息**：
  - **源文件**：`gitee-example/pages/purchaseReview/purchaseReview.vue`
  - **目标文件**：`src/pages-sub/purchase/review.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：采购审核

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
     - 团队名称：`migration-review`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.1.3 迁移 src/pages-sub/purchase/list.vue（采购列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/purchaseList/purchaseList.vue`
  - **目标文件**：`src/pages-sub/purchase/list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：采购列表

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-list`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.1.4 迁移 src/pages-sub/purchase/schedule.vue（采购进度）

  **基本信息**：
  - **源文件**：`gitee-example/pages/purchasingSchedule/purchasingSchedule.vue`
  - **目标文件**：`src/pages-sub/purchase/schedule.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：采购进度

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-schedule`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.1.5 迁移 src/pages-sub/purchase/urgent-apply.vue（紧急采购申请）

  **基本信息**：
  - **源文件**：`gitee-example/pages/urgentPurchaseApplyStep/urgentPurchaseApplyStep.vue`
  - **目标文件**：`src/pages-sub/purchase/urgent-apply.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：紧急采购申请

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
     - 团队名称：`migration-urgent-apply`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 3.2 resource_modules - 资源管理（5 个页面）

- [x] 3.2.1 迁移 src/pages-sub/resource/add-purchase-apply.vue（新增采购申请）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/addPurchaseApply.vue`
  - **目标文件**：`src/pages-sub/resource/add-purchase-apply.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：新增采购申请

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
     - 团队名称：`migration-add-purchase-apply`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.2.2 迁移 src/pages-sub/resource/edit-purchase-apply.vue（编辑采购申请）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/editPurchaseApply.vue`
  - **目标文件**：`src/pages-sub/resource/edit-purchase-apply.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：编辑采购申请

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
     - 团队名称：`migration-edit-purchase-apply`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.2.3 迁移 src/pages-sub/resource/purchase-apply-detail.vue（采购申请详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/purchaseApplyDetail.vue`
  - **目标文件**：`src/pages-sub/resource/purchase-apply-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：采购申请详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-purchase-apply-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.2.4 迁移 src/pages-sub/resource/purchase-apply-manage.vue（采购申请管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/purchaseApplyManage.vue`
  - **目标文件**：`src/pages-sub/resource/purchase-apply-manage.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：采购申请管理

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
     - 团队名称：`migration-purchase-apply-manage`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.2.5 迁移 src/pages-sub/resource/purchase-apply-audit.vue（采购申请审核）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/purchaseApplyAuditOrders.vue`
  - **目标文件**：`src/pages-sub/resource/purchase-apply-audit.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：采购申请审核

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
     - 团队名称：`migration-purchase-apply-audit`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 3.3 resource_modules - 物品管理（5 个页面）

- [x] 3.3.1 迁移 src/pages-sub/resource/add-item-out.vue（新增物品出库）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/addItemOut.vue`
  - **目标文件**：`src/pages-sub/resource/add-item-out.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：新增物品出库

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
     - 团队名称：`migration-add-item-out`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.3.2 迁移 src/pages-sub/resource/item-enter.vue（物品入库）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/itemEnterDo.vue`
  - **目标文件**：`src/pages-sub/resource/item-enter.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：物品入库

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-item-enter`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.3.3 迁移 src/pages-sub/resource/item-out.vue（物品出库）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/itemOutDo.vue`
  - **目标文件**：`src/pages-sub/resource/item-out.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：物品出库

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-item-out`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.3.4 迁移 src/pages-sub/resource/item-out-manage.vue（物品出库管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/itemOutManage.vue`
  - **目标文件**：`src/pages-sub/resource/item-out-manage.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：物品出库管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-item-out-manage`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.3.5 迁移 src/pages-sub/resource/item-out-audit.vue（物品出库审核）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/itemOutAuditOrders.vue`
  - **目标文件**：`src/pages-sub/resource/item-out-audit.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：物品出库审核

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
     - 团队名称：`migration-item-out-audit`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 3.4 resource_modules - 调拨管理（5 个页面）

- [x] 3.4.1 迁移 src/pages-sub/resource/allocation-apply.vue（调拨申请）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/allocationStorehouseApply.vue`
  - **目标文件**：`src/pages-sub/resource/allocation-apply.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：调拨申请

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
     - 团队名称：`migration-allocation-apply`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.4.2 迁移 src/pages-sub/resource/allocation-detail.vue（调拨详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/allocationStorehouseApplyDetail.vue`
  - **目标文件**：`src/pages-sub/resource/allocation-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：调拨详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-allocation-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.4.3 迁移 src/pages-sub/resource/allocation-manage.vue（调拨管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/allocationStorehouseManage.vue`
  - **目标文件**：`src/pages-sub/resource/allocation-manage.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：调拨管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-allocation-manage`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.4.4 迁移 src/pages-sub/resource/allocation-audit.vue（调拨审核）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/allocationStorehouseAuditOrders.vue`
  - **目标文件**：`src/pages-sub/resource/allocation-audit.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：调拨审核

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
     - 团队名称：`migration-allocation-audit`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.4.5 迁移 src/pages-sub/resource/allocation-enter.vue（调拨入库）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resource/allocationEnterDo.vue`
  - **目标文件**：`src/pages-sub/resource/allocation-enter.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：调拨入库

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-allocation-enter`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

### 3.5 resource_modules - 库存管理（4 个页面）

- [x] 3.5.1 迁移 src/pages-sub/resource/store-manage.vue（库存管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resourceStoreManage/resourceStoreManage.vue`
  - **目标文件**：`src/pages-sub/resource/store-manage.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：库存管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-store-manage`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.5.2 迁移 src/pages-sub/resource/store-return.vue（库存退货）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resourceStoreReturn/resourceStoreReturn.vue`
  - **目标文件**：`src/pages-sub/resource/store-return.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：库存退货

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-store-return`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.5.3 迁移 src/pages-sub/resource/store-scrap.vue（库存报废）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resourceStoreScrap/resourceStoreScrap.vue`
  - **目标文件**：`src/pages-sub/resource/store-scrap.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：库存报废

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-store-scrap`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 3.5.4 迁移 src/pages-sub/resource/store-transfer.vue（库存调拨）

  **基本信息**：
  - **源文件**：`gitee-example/pages/resourceStoreTransfer/resourceStoreTransfer.vue`
  - **目标文件**：`src/pages-sub/resource/store-transfer.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：库存调拨

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-store-transfer`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

### 3.6 resource_modules - 出入库管理（1 个页面）

- [x] 3.6.1 迁移 src/pages-sub/resource/out-storage-request.vue（出库申请）

  **基本信息**：
  - **源文件**：`gitee-example/pages/pOutOfStorageRequest/pOutOfStorageRequest.vue`
  - **目标文件**：`src/pages-sub/resource/out-storage-request.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：出库申请

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
     - 团队名称：`migration-out-storage-request`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 3.7 resource_modules 验收

- [x] 3.7.1 对 resource_modules 所有文件进行合规性检查
- [x] 3.7.2 生成 resource_modules 迁移报告
- [x] 3.7.3 确认 resource_modules 迁移完成

### 3.8 fee_modules - 费用管理（6 个页面）

- [x] 3.8.1 迁移 src/pages-sub/fee/create.vue（创建费用）

  **基本信息**：
  - **源文件**：`gitee-example/pages/fee/createFee.vue`
  - **目标文件**：`src/pages-sub/fee/create.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：创建费用

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
     - 团队名称：`migration-create`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.8.2 迁移 src/pages-sub/fee/owe-callable.vue（欠费催缴）

  **基本信息**：
  - **源文件**：`gitee-example/pages/fee/oweFeeCallable.vue`
  - **目标文件**：`src/pages-sub/fee/owe-callable.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：欠费催缴

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-owe-callable`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.8.3 迁移 src/pages-sub/fee/write-owe-callable.vue（填写欠费催缴）

  **基本信息**：
  - **源文件**：`gitee-example/pages/fee/writeOweFeeCallable.vue`
  - **目标文件**：`src/pages-sub/fee/write-owe-callable.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：填写欠费催缴

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
     - 团队名称：`migration-write-owe-callable`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.8.4 迁移 src/pages-sub/fee/room-pay.vue（房间缴费）

  **基本信息**：
  - **源文件**：`gitee-example/pages/fee/roomPayFee.vue`
  - **目标文件**：`src/pages-sub/fee/room-pay.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：房间缴费

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
     - 团队名称：`migration-room-pay`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.8.5 迁移 src/pages-sub/fee/pay-qrcode.vue（二维码缴费）

  **基本信息**：
  - **源文件**：`gitee-example/pages/fee/payFeeByQrCode.vue`
  - **目标文件**：`src/pages-sub/fee/pay-qrcode.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：二维码缴费

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
     - 团队名称：`migration-pay-qrcode`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.8.6 迁移 src/pages-sub/fee/detail.vue（费用详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/feeDetail/feeDetail.vue`
  - **目标文件**：`src/pages-sub/fee/detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：费用详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 3.9 fee_modules - 充值管理（2 个页面）

- [x] 3.9.1 迁移 src/pages-sub/fee/charge.vue（充值）

  **基本信息**：
  - **源文件**：`gitee-example/pages/charge/charge.vue`
  - **目标文件**：`src/pages-sub/fee/charge.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：充值

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
     - 团队名称：`migration-charge`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 3.9.2 迁移 src/pages-sub/fee/charge-detail.vue（充值详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/charge/chargeDetail.vue`
  - **目标文件**：`src/pages-sub/fee/charge-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：充值详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-charge-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 3.10 fee_modules - 报表统计（6 个页面）

- [x] 3.10.1 迁移 src/pages-sub/report/fee-summary.vue（费用汇总报表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/report/reportFeeSummary.vue`
  - **目标文件**：`src/pages-sub/report/fee-summary.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：费用汇总报表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-fee-summary`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.10.2 迁移 src/pages-sub/report/pay-fee-detail.vue（缴费明细报表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/report/reportPayFeeDetail.vue`
  - **目标文件**：`src/pages-sub/report/pay-fee-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：缴费明细报表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-pay-fee-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.10.3 迁移 src/pages-sub/report/room-fee.vue（房间费用报表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/report/reportRoomFee.vue`
  - **目标文件**：`src/pages-sub/report/room-fee.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：房间费用报表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-room-fee`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.10.4 迁移 src/pages-sub/report/data-report.vue（数据报表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/report/dataReport.vue`
  - **目标文件**：`src/pages-sub/report/data-report.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：数据报表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-data-report`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.10.5 迁移 src/pages-sub/report/charge-machine-order.vue（充电桩订单）

  **基本信息**：
  - **源文件**：`gitee-example/pages/report/chargeMachineOrder.vue`
  - **目标文件**：`src/pages-sub/report/charge-machine-order.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：充电桩订单

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-charge-machine-order`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 3.10.6 迁移 src/pages-sub/report/open-door-log.vue（开门记录）

  **基本信息**：
  - **源文件**：`gitee-example/pages/report/openDoorLog.vue`
  - **目标文件**：`src/pages-sub/report/open-door-log.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：开门记录

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-open-door-log`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 3.11 fee_modules 验收

- [x] 3.11.1 对 fee_modules 所有文件进行合规性检查
- [x] 3.11.2 生成 fee_modules 迁移报告
- [x] 3.11.3 确认 fee_modules 迁移完成

### 3.12 高优先级模块阶段验收

- [x] 3.12.1 生成高优先级模块迁移总结报告
- [x] 3.12.2 确认 43 个页面全部迁移完成
- [x] 3.12.3 确认合规性通过率 100%

## 4. 阶段 3：中优先级模块迁移

### 4.1 oa_modules - OA 工作流（8 个页面）

- [x] 4.1.1 迁移 src/pages-sub/oa/workflow.vue（OA 工作流）

  **基本信息**：
  - **源文件**：`gitee-example/pages/oaWorkflow/oaWorkflow.vue`
  - **目标文件**：`src/pages-sub/oa/workflow.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：OA 工作流

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-workflow`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.1.2 迁移 src/pages-sub/oa/workflow-form.vue（新建工作流表单）

  **基本信息**：
  - **源文件**：`gitee-example/pages/newOaWorkflowForm/newOaWorkflowForm.vue`
  - **目标文件**：`src/pages-sub/oa/workflow-form.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：新建工作流表单

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-workflow-form`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.1.3 迁移 src/pages-sub/oa/workflow-form-edit.vue（编辑工作流表单）

  **基本信息**：
  - **源文件**：`gitee-example/pages/newOaWorkflowFormEdit/newOaWorkflowFormEdit.vue`
  - **目标文件**：`src/pages-sub/oa/workflow-form-edit.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：编辑工作流表单

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
     - 团队名称：`migration-workflow-form-edit`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 4.1.4 迁移 src/pages-sub/oa/workflow-todo.vue（工作流待办）

  **基本信息**：
  - **源文件**：`gitee-example/pages/newOaWorkflowUndo/newOaWorkflowUndo.vue`
  - **目标文件**：`src/pages-sub/oa/workflow-todo.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：工作流待办

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-workflow-todo`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.1.5 迁移 src/pages-sub/oa/workflow-audit.vue（工作流审核）

  **基本信息**：
  - **源文件**：`gitee-example/pages/newOaWorkflowUndoAudit/newOaWorkflowUndoAudit.vue`
  - **目标文件**：`src/pages-sub/oa/workflow-audit.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：工作流审核

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
     - 团队名称：`migration-workflow-audit`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 4.1.6 迁移 src/pages-sub/oa/workflow-finish.vue（工作流已完成）

  **基本信息**：
  - **源文件**：`gitee-example/pages/newOaWorkflowFinish/newOaWorkflowFinish.vue`
  - **目标文件**：`src/pages-sub/oa/workflow-finish.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：工作流已完成

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-workflow-finish`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.1.7 迁移 src/pages-sub/oa/workflow-detail.vue（工作流详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/newOaWorkflowDetail/newOaWorkflowDetail.vue`
  - **目标文件**：`src/pages-sub/oa/workflow-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：工作流详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-workflow-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.1.8 迁移 src/pages-sub/oa/audit-todo.vue（审核待办）

  **基本信息**：
  - **源文件**：`gitee-example/pages/audit/undoAudit.vue`
  - **目标文件**：`src/pages-sub/oa/audit-todo.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：审核待办

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
     - 团队名称：`migration-audit-todo`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 4.2 oa_modules 验收

- [x] 4.2.1 对 oa_modules 所有文件进行合规性检查
- [x] 4.2.2 生成 oa_modules 迁移报告
- [x] 4.2.3 确认 oa_modules 迁移完成

### 4.3 property_modules - 房屋基础管理（4 个页面）

- [x] 4.3.1 迁移 src/pages-sub/property/room-list.vue（房间列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomList/roomList.vue`
  - **目标文件**：`src/pages-sub/property/room-list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：房间列表

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-room-list`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.3.2 迁移 src/pages-sub/property/room-detail.vue（房间详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomDetail/roomDetail.vue`
  - **目标文件**：`src/pages-sub/property/room-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：房间详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-room-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.3.3 迁移 src/pages-sub/property/floor-list.vue（楼层列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/floorList/floorList.vue`
  - **目标文件**：`src/pages-sub/property/floor-list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：楼层列表

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-floor-list`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.3.4 迁移 src/pages-sub/property/unit-list.vue（单元列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/unitList/unitList.vue`
  - **目标文件**：`src/pages-sub/property/unit-list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：单元列表

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-unit-list`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

### 4.4 property_modules - 业主管理（3 个页面）

- [x] 4.4.1 迁移 src/pages-sub/property/owner-list.vue（业主列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/owner/owner.vue`
  - **目标文件**：`src/pages-sub/property/owner-list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：业主列表

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-owner-list`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.4.2 迁移 src/pages-sub/property/add-owner.vue（新增业主）

  **基本信息**：
  - **源文件**：`gitee-example/pages/owner/addOwner.vue`
  - **目标文件**：`src/pages-sub/property/add-owner.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：新增业主

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
     - 团队名称：`migration-add-owner`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 4.4.3 迁移 src/pages-sub/property/edit-owner.vue（编辑业主）

  **基本信息**：
  - **源文件**：`gitee-example/pages/owner/editOwner.vue`
  - **目标文件**：`src/pages-sub/property/edit-owner.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：编辑业主

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
     - 团队名称：`migration-edit-owner`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 4.5 property_modules - 装修管理（5 个页面）

- [x] 4.5.1 迁移 src/pages-sub/property/renovation.vue（装修管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomRenovation/roomRenovation.vue`
  - **目标文件**：`src/pages-sub/property/renovation.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：装修管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-renovation`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.5.2 迁移 src/pages-sub/property/renovation-detail.vue（装修详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomRenovationDetail/roomRenovationDetail.vue`
  - **目标文件**：`src/pages-sub/property/renovation-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：装修详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-renovation-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.5.3 迁移 src/pages-sub/property/renovation-record.vue（装修记录）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomRenovationRecord/roomRenovationRecord.vue`
  - **目标文件**：`src/pages-sub/property/renovation-record.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：装修记录

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-renovation-record`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.5.4 迁移 src/pages-sub/property/renovation-record-detail.vue（装修记录详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomRenovationRecordDetail/roomRenovationRecordDetail.vue`
  - **目标文件**：`src/pages-sub/property/renovation-record-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：装修记录详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-renovation-record-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.5.5 迁移 src/pages-sub/property/renovation-record-handle.vue（装修记录处理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/roomRenovationRecordHandle/roomRenovationRecordHandle.vue`
  - **目标文件**：`src/pages-sub/property/renovation-record-handle.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：装修记录处理

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
     - 团队名称：`migration-renovation-record-handle`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 4.6 property_modules 验收

- [x] 4.6.1 对 property_modules 所有文件进行合规性检查
- [x] 4.6.2 生成 property_modules 迁移报告
- [x] 4.6.3 确认 property_modules 迁移完成

### 4.7 parking_modules - 车辆管理（5 个页面）

- [x] 4.7.1 迁移 src/pages-sub/parking/owner-car.vue（业主车辆）

  **基本信息**：
  - **源文件**：`gitee-example/pages/car/ownerCar.vue`
  - **目标文件**：`src/pages-sub/parking/owner-car.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：业主车辆

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-owner-car`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.7.2 迁移 src/pages-sub/parking/car-in.vue（车辆入场）

  **基本信息**：
  - **源文件**：`gitee-example/pages/car/carInParkingArea.vue`
  - **目标文件**：`src/pages-sub/parking/car-in.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：车辆入场

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-car-in`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.7.3 迁移 src/pages-sub/parking/car-out.vue（车辆出场）

  **基本信息**：
  - **源文件**：`gitee-example/pages/car/carOutParkingArea.vue`
  - **目标文件**：`src/pages-sub/parking/car-out.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：车辆出场

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-car-out`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 4.7.4 迁移 src/pages-sub/parking/barrier-gate.vue（道闸管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/car/barrierGate.vue`
  - **目标文件**：`src/pages-sub/parking/barrier-gate.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：道闸管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-barrier-gate`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 4.7.5 迁移 src/pages-sub/parking/barrier-video.vue（视频管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/car/barrierVideo.vue`
  - **目标文件**：`src/pages-sub/parking/barrier-video.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：视频管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-barrier-video`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

### 4.8 parking_modules 验收

- [x] 4.8.1 对 parking_modules 所有文件进行合规性检查
- [x] 4.8.2 生成 parking_modules 迁移报告
- [x] 4.8.3 确认 parking_modules 迁移完成

### 4.9 中优先级模块阶段验收

- [x] 4.9.1 生成中优先级模块迁移总结报告
- [x] 4.9.2 确认 24 个页面全部迁移完成
- [x] 4.9.3 确认合规性通过率 100%

## 5. 阶段 4：低优先级模块迁移

### 5.1 notice_modules - 公告管理（2 个页面）

- [x] 5.1.1 迁移 src/pages/notice/index.vue（公告列表页）

  **基本信息**：
  - **源文件**：`gitee-example/pages/notice/notice.vue`
  - **目标文件**：`src/pages/notice/index.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：公告列表页

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-index`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 5.1.2 迁移 src/pages/notice/detail.vue（公告详情页）

  **基本信息**：
  - **源文件**：`gitee-example/pages/notice/detail/noticeDetail.vue`
  - **目标文件**：`src/pages/notice/detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：公告详情页

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.2 notice_modules 验收

- [x] 5.2.1 对 notice_modules 所有文件进行合规性检查
- [x] 5.2.2 生成 notice_modules 迁移报告
- [x] 5.2.3 确认 notice_modules 迁移完成

### 5.3 basic_modules - 基础模块（5 个页面）

- [x] 5.3.1 迁移 src/pages/profile/index.vue（我的页面）

  **基本信息**：
  - **源文件**：`gitee-example/pages/my/my.vue`
  - **目标文件**：`src/pages/profile/index.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：我的页面

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-index`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 5.3.2 迁移 src/pages/profile/attendance.vue（员工考勤）

  **基本信息**：
  - **源文件**：`gitee-example/pages/my/staffDetailAttendance.vue`
  - **目标文件**：`src/pages/profile/attendance.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：员工考勤

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-attendance`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 5.3.3 迁移 src/pages/profile/user-info.vue（用户信息）

  **基本信息**：
  - **源文件**：`gitee-example/pages/userInfo/userInfo.vue`
  - **目标文件**：`src/pages/profile/user-info.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：用户信息

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-user-info`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 5.3.4 迁移 src/pages/profile/change-password.vue（修改密码）

  **基本信息**：
  - **源文件**：`gitee-example/pages/changePwd/changePwd.vue`
  - **目标文件**：`src/pages/profile/change-password.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：修改密码

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
     - 团队名称：`migration-change-password`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 5.3.5 迁移 src/pages/profile/change-community.vue（切换小区）

  **基本信息**：
  - **源文件**：`gitee-example/pages/changeCommunity/changeCommunity.vue`
  - **目标文件**：`src/pages/profile/change-community.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：切换小区

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-change-community`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.4 basic_modules 验收

- [x] 5.4.1 对 basic_modules 所有文件进行合规性检查
- [x] 5.4.2 生成 basic_modules 迁移报告
- [x] 5.4.3 确认 basic_modules 迁移完成

### 5.5 other_modules - 预约管理（2 个页面）

- [x] 5.5.1 迁移 src/pages-sub/appointment/index.vue（预约管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/appointment/appointment.vue`
  - **目标文件**：`src/pages-sub/appointment/index.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：预约管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-index`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 5.5.2 迁移 src/pages-sub/appointment/queue.vue（排队预约）

  **基本信息**：
  - **源文件**：`gitee-example/pages/appointment/hou_one.vue`
  - **目标文件**：`src/pages-sub/appointment/queue.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：排队预约

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-queue`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.6 other_modules - 抄表管理（6 个页面）

- [x] 5.6.1 迁移 src/pages-sub/meter/reading.vue（抄表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/meter/meterReading.vue`
  - **目标文件**：`src/pages-sub/meter/reading.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：抄表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-reading`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 5.6.2 迁移 src/pages-sub/meter/add-meter.vue（新增水表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/meter/addmeter.vue`
  - **目标文件**：`src/pages-sub/meter/add-meter.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：新增水表

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
     - 团队名称：`migration-add-meter`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 5.6.3 迁移 src/pages-sub/meter/qrcode-meter.vue（二维码水表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/meter/qrcodeMeter.vue`
  - **目标文件**：`src/pages-sub/meter/qrcode-meter.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：二维码水表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-qrcode-meter`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 5.6.4 迁移 src/pages-sub/meter/share-meter.vue（共享水表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/meter/shareMeter.vue`
  - **目标文件**：`src/pages-sub/meter/share-meter.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：共享水表

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-share-meter`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

- [x] 5.6.5 迁移 src/pages-sub/meter/add-share-reading.vue（新增共享抄表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/meter/addShareReading.vue`
  - **目标文件**：`src/pages-sub/meter/add-share-reading.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：新增共享抄表

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
     - 团队名称：`migration-add-share-reading`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 5.6.6 迁移 src/pages-sub/meter/audit-share-reading.vue（审核共享抄表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/meter/auditShareReading.vue`
  - **目标文件**：`src/pages-sub/meter/audit-share-reading.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：审核共享抄表

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
     - 团队名称：`migration-audit-share-reading`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 5.7 other_modules - 优惠券管理（3 个页面）

- [x] 5.7.1 迁移 src/pages-sub/coupon/write-off-coupon.vue（核销优惠券）

  **基本信息**：
  - **源文件**：`gitee-example/pages/coupon/writeOffCoupon.vue`
  - **目标文件**：`src/pages-sub/coupon/write-off-coupon.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：核销优惠券

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
     - 团队名称：`migration-write-off-coupon`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 5.7.2 迁移 src/pages-sub/coupon/write-off-integral.vue（核销积分）

  **基本信息**：
  - **源文件**：`gitee-example/pages/coupon/writeOffIntegral.vue`
  - **目标文件**：`src/pages-sub/coupon/write-off-integral.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：核销积分

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
     - 团队名称：`migration-write-off-integral`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 5.7.3 迁移 src/pages-sub/coupon/write-off-reserve.vue（核销预约）

  **基本信息**：
  - **源文件**：`gitee-example/pages/coupon/wirteOffReserve.vue`
  - **目标文件**：`src/pages-sub/coupon/write-off-reserve.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：核销预约

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
     - 团队名称：`migration-write-off-reserve`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

### 5.8 other_modules - 物品发布（2 个页面）

- [x] 5.8.1 迁移 src/pages-sub/item/release.vue（物品发布）

  **基本信息**：
  - **源文件**：`gitee-example/pages/itemRelease/itemRelease.vue`
  - **目标文件**：`src/pages-sub/item/release.vue`
  - **页面类型**：表单页面（包含用户输入、表单校验、提交操作）
  - **业务功能**：物品发布

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
     - 团队名称：`migration-release`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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

  **预计耗时**：2-3 小时

- [x] 5.8.2 迁移 src/pages-sub/item/release-detail.vue（物品详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/itemRelease/itemReleaseDetail.vue`
  - **目标文件**：`src/pages-sub/item/release-detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：物品详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-release-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.9 other_modules - 视频管理（2 个页面）

- [x] 5.9.1 迁移 src/pages-sub/video/list.vue（视频列表）

  **基本信息**：
  - **源文件**：`gitee-example/pages/video/videoList.vue`
  - **目标文件**：`src/pages-sub/video/list.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：视频列表

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-list`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 5.9.2 迁移 src/pages-sub/video/play.vue（视频播放）

  **基本信息**：
  - **源文件**：`gitee-example/pages/video/playVideo.vue`
  - **目标文件**：`src/pages-sub/video/play.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：视频播放

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-play`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.10 other_modules - 访客管理（2 个页面）

- [x] 5.10.1 迁移 src/pages-sub/visit/index.vue（访客管理）

  **基本信息**：
  - **源文件**：`gitee-example/pages/visit/visit.vue`
  - **目标文件**：`src/pages-sub/visit/index.vue`
  - **页面类型**：列表页面（包含分页、筛选、刷新）
  - **业务功能**：访客管理

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

  6. **z-paging-integration**（`.claude/skills/z-paging-integration/SKILL.md`）
     - 使用 z-paging 组件实现分页
     - 与 useRequest 回调钩子模式集成
     - 处理分页、筛选、刷新

  7. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
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
     - 团队名称：`migration-index`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 使用 `<z-paging>` 组件实现分页
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
  - [ ] **分页规范**：
    - 使用 z-paging 组件
    - 使用 useRequest 回调钩子模式集成
    - 支持下拉刷新和上拉加载
    - 支持筛选条件变化时重新加载
  - [ ] **合规性检查**：
    - 通过 z-paging-integration 合规性检查
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：2-3 小时

- [x] 5.10.2 迁移 src/pages-sub/visit/detail.vue（访客详情）

  **基本信息**：
  - **源文件**：`gitee-example/pages/visit/visitDetail.vue`
  - **目标文件**：`src/pages-sub/visit/detail.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：访客详情

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-detail`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.11 other_modules - 通用页面（1 个页面）

- [x] 5.11.1 迁移 src/pages/webview/index.vue（网页视图）

  **基本信息**：
  - **源文件**：`gitee-example/pages/hcWebView/hcWebView.vue`
  - **目标文件**：`src/pages/webview/index.vue`
  - **页面类型**：详情页面（只读展示，无表单输入）
  - **业务功能**：网页视图

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

  6. **beautiful-component-design**（`.claude/skills/beautiful-component-design/SKILL.md`）
     - 使用 Carbon Icons 添加语义化图标
     - 响应式设计和美化

  7. **api-error-handling**（`.claude/skills/api-error-handling/SKILL.md`）
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
     - 团队名称：`migration-index`
     - 创建 3 个子代理：
       - 技能指导子代理（学习所有 Skills 文档）
       - 代码迁移子代理（执行具体迁移）
       - 审核子代理（验证合规性）

  3. **技能指导子代理工作**
     - 阅读所有必需技能的主文件（SKILL.md）
     - 阅读相关子文档
     - 生成针对本页面的技能指导文档

  4. **代码迁移子代理工作**
     - 按照技能指导逐步迁移
     - 遇到问题时向技能指导子代理询问
     - 记录迁移过程中的关键决策

  5. **审核子代理工作**
     - 使用多重搜索策略验证合规性
     - 逐项检查技能规范
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
    - 通过 api-error-handling 合规性检查
    - 通过 beautiful-component-design 合规性检查

  **预计耗时**：1.5-2 小时

### 5.12 other_modules 验收

- [x] 5.12.1 对 other_modules 所有文件进行合规性检查
- [x] 5.12.2 生成 other_modules 迁移报告
- [x] 5.12.3 确认 other_modules 迁移完成

### 5.13 低优先级模块阶段验收

- [x] 5.13.1 生成低优先级模块迁移总结报告
- [x] 5.13.2 确认 21 个页面全部迁移完成
- [x] 5.13.3 确认合规性通过率 100%

## 6. 阶段 5：全面验收

- [x] 6.1 对所有 140 个页面进行全面的合规性检查
- [x] 6.2 生成最终的迁移进度报告
- [x] 6.3 确认所有页面迁移完成且合规性通过率 100%
- [x] 6.4 更新项目文档
- [x] 6.5 归档迁移相关文档和报告
