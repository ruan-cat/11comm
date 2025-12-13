# 项目上下文

## 1. Purpose

01s-11comm 智慧社区/物业管理平台（pnpm + Turbo monorepo），核心是 `apps/admin`（Vue3 管理端）与配套示例；目标是为社区/物业提供数字化运营（公告、住户、收费、设备、值班、缓存管理等）。

## 2. 技术栈

- 包管理/构建：pnpm、Turbo、Vite
- 语言/框架：TypeScript、Vue 3 (Composition API)
- UI：Element Plus、Plus Pro Components、Tailwind CSS、SCSS
- 路由：unplugin-vue-router（基于文件的路由）
- 状态：Pinia
- 网络：Axios + @ruan-cat/utils（封装）
- 类型管理：**@01s-11comm/type**（新增业务类型库）
- 其它：Nitro（全栈构建/适配）、lodash-es、VueUse

## 3. 项目约定

### 3.1 代码风格

- ESLint + Prettier + Stylelint；遵循仓库现有 lint 规则
- 自定义组件以 `Re*` 前缀
- API/接口分模块建子目录，不集中放单一 `index.ts`（参考 @/change/@/draft/@/expire）
- JS/TS 注释使用 JSDoc 形式
- 测试中辅助函数用全局导入，勿在测试文件内重复定义
- **类型管理**：所有业务相关类型定义应统一存放在 `@01s-11comm/type` 包中，确保类型共享和一致性

### 3.2 架构模式

- Monorepo（`apps/admin` 为主，`apps/type` 为新增类型库，`apps/vue-pure-admin` 为模板参考）
- 组合式函数抽共享逻辑；定义路由用 `definePage` 宏
- API 按业务模块 c1-c7、j1-j8 组织，增量规范用 OpenSpec 管理
- **类型库**：所有共享业务类型统一存放在 `@01s-11comm/type` 包中，其他包通过 `workspace:^` 依赖
- 默认单文件实现优先，<100 行新增为宜；需跨域/复杂才引入 `design.md`

### 3.3 测试策略

- 单元/UI：`pnpm test` 或 `pnpm -F @01s-11comm/admin test`
- Lint：`pnpm -F @01s-11comm/admin lint`（或 `lint:eslint` / `lint:prettier` / `lint:stylelint`）
- 类型检查：**`pnpm typecheck`**（提交前必跑，对整个项目进行类型检查）
  - 管理应用：`pnpm -F @01s-11comm/admin typecheck`
  - 类型库：`pnpm -F @01s-11comm/type typecheck`
  - 单个包检查：`pnpm -F <package-name> typecheck`
- 构建验证：`pnpm build` 或 `pnpm -F @01s-11comm/admin build`

### 3.4 Git 工作流

- 建议 feature 分支 + PR；提交前跑 lint 与 typecheck
- 提案未获批前不进主分支；部署后将变更归档至 `openspec/changes/archive/`

## 4. 领域上下文

- 物业/社区运营：公告、住户/房屋、缴费、设备、值班排班、缓存刷新、数据看板
- 路由与菜单按 rank/文件结构生成；多语言 zh-CN/en 支持
- API 模块前缀 c1-c7、j1-j8 对应不同业务域

## 5. 重要约束

- 类型检查为强制项；遵循 OpenSpec 提案→实施→归档流程
- 二次封装 `useRequest` 时 `options` 参数必填
- Markdown 表格需居中对齐；多级标题需手动编号
- 避免破坏性改动；如需破坏性变更必须先提案

## 6. 外部依赖

- 第三方：Element Plus、Plus Pro Components、Nitro、VueUse、lodash-es
- 内部/自研：@ruan-cat/utils（Axios 包装）、任务生成器 taskmaster-ai（.taskmaster）、OpenSpec 规范体系
