# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 术语说明

在我和你沟通时，我会使用以下术语，便于你理解。

### 全局术语

在任何沟通下，这些术语都生效。

- `make-dialog` ： `生成弹框子代理` ，这是生成基于 addDialog 函数的命令式弹框的子代理。
- `make-form-for-dialog` ： `生成用于弹框的表单子代理` ，这是生成用于命令式弹框的表单组件 的子代理。

## 注意事项

1. 每次你完成更改时，都**不要运行**任何类型检查命令。我们项目不需要你去运行类型检查命令。

## 常用开发命令

这是一个用于 11comm 智慧社区 (Smart Community) 项目的 pnpm + Turbo monorepo。

### 构建命令

```bash
# 构建所有项目
pnpm build

# 专门构建管理应用
pnpm build:admin
# 或者从根目录运行
pnpm -F @01s-11comm/admin build

# 以staging模式构建
pnpm -F @01s-11comm/admin build:staging

# 构建文档
pnpm -F @01s-11comm/admin docs:build
```

### 开发命令

```bash
# 以开发模式运行管理应用
pnpm -F @01s-11comm/admin dev
# 或者切换到apps/admin目录并运行
cd apps/admin && pnpm dev
```

### 测试命令

```bash
# 使用UI运行测试
pnpm test
# 管理应用特定的测试
pnpm -F @01s-11comm/admin test
```

### 代码检查和格式化

```bash
# 检查和格式化管理应用
pnpm -F @01s-11comm/admin lint

# 单独的检查命令
pnpm -F @01s-11comm/admin lint:eslint
pnpm -F @01s-11comm/admin lint:prettier
pnpm -F @01s-11comm/admin lint:stylelint

# 格式化代码
pnpm format
```

### 类型检查

```bash
# 对管理应用进行类型检查
pnpm -F @01s-11comm/admin typecheck
```

## 项目架构

### Monorepo 结构

- `apps/admin/` - 基于 vue-pure-admin 的主要 Vue3 管理应用
- `apps/vue-pure-admin/` - Pure admin 模板（参考用）
- `examples/` - 示例应用（01s-origin, 10wms）
- 根级别管理 monorepo 依赖和共享配置

### 管理应用架构 (`apps/admin/`)

**技术栈：**

- Vue 3 + TypeScript + Vite
- Element Plus (UI 组件)
- Plus Pro Components (表单组件)
- Pinia (状态管理)
- Vue Router with unplugin-vue-router (基于文件的路由)
- Tailwind CSS + SCSS
- Axios + @ruan-cat/utils 用于 API 请求

**关键目录：**

- `src/api/` - 按模块组织的 API 接口定义 (c1-c7, j1-j8)
- `src/views/` - 基于文件的路由页面
- `src/components/` - 可复用组件（自定义组件使用 Re\*前缀）
- `src/store/` - Pinia 状态管理存储
- `src/utils/` - 工具函数和 HTTP 配置
- `src/router/` - 路由配置和模块
- `src/composables/` - Vue 组合式函数的共享逻辑

**组件命名：**

- 自定义组件使用"Re"前缀（ReDialog, ReDrawer 等）
- 组件按功能组织在专用文件夹中

**API 组织：**

- API 按业务模块组织（c1-c7 用于不同区域，j1-j8 用于不同功能）
- 使用@ruan-cat/utils 增强 axios 功能
- 测试文件与 API 模块共同定位（.test.ts 文件）

**路由：**

- 使用 unplugin-vue-router 的基于文件的路由
- 菜单排序的路由等级系统（`src/router/rank/`）
- 从文件结构动态生成路由

**状态管理：**

- `src/store/modules/`中的模块化 Pinia 存储
- 包括用户、应用、权限、多标签和自定义存储

**国际化：**

- Vue i18n，在`locales/`中使用 YAML 区域设置文件
- 支持中文（zh-CN）和英文（en）

### 关键技术和库

**必需学习（根据 technical-doc.md）：**

- lodash-es 用于工具函数
- Vue 3 composition API（ref, computed, watch, slots, props）
- VueUse 用于组合式函数（特别是 useAxios）
- @ruan-cat/utils 用于增强 axios 包装器
- Element Plus 组件（Form, Table, Dialog, Tree 等）
- Plus Pro Components 用于高级表单
- unplugin-vue-router 用于基于文件的路由

**架构模式：**

- 使用 pnpm 工作空间和 Turbo 的 Monorepo
- 使用 definePage 进行路由配置的基于文件的路由
- 共享逻辑的组合式驱动开发
- 基于模块的 API 组织
- 组件驱动的 UI 开发

## 开发工作流

1. 使用 pnpm 进行包管理
2. Turbo 处理构建编排
3. 基于文件的路由 - 在 src/views/中创建.vue 文件用于新页面
4. 使用 definePage()宏进行路由配置
5. API 接口按业务模块组织
6. 遵循现有组件模式（自定义组件使用 Re\*前缀）
7. 使用组合式函数处理共享逻辑
8. 测试文件与实现文件共同定位

## 生成接口时的代码风格

以下文件的代码风格，可供你学习。在接下来的接口生成中，请使用这些代码风格：

- `apps\admin\src\api\c5\payment-audit\index.ts`
- `apps\admin\src\api\c5\payment-audit\index.test.ts`

- `apps\admin\src\api\c5\arrears\index.ts`
- `apps\admin\src\api\c5\arrears\index.test.ts`
