# GEMINI 项目上下文：11comm 智慧社区前端

本文档为 AI 助手提供关于 `11comm` 项目的指导性上下文。

## 项目概览

这是 "11comm 智慧社区" 项目的前端 monorepo 仓库。它使用现代 JavaScript/TypeScript 技术栈构建，通过 `pnpm` 工作区进行管理，并由 `Turborepo` 进行编排。

主要应用程序是 `apps/admin`，这是一个功能丰富的管理后台，基于流行的 `vue-pure-admin` 模板开发。

### 核心技术

- **Monorepo:** pnpm Workspaces + Turborepo
- **框架:** Vue.js 3
- **UI 框架:** Element Plus
- **样式:** Tailwind CSS, Sass/SCSS
- **状态管理:** Pinia
- **路由:** Vue Router
- **构建工具:** Vite
- **测试:** Vitest
- **文档:** VitePress

### 架构

该仓库采用 monorepo 结构：

- `apps/`: 包含主要的应用程序包。
  - `apps/admin`: 主要的 Vue.js 管理后台应用。
- `examples/`: 包含示例代码，这些代码被排除在主工作区和构建流程之外。
- `scripts/`: 包含仓库的操作脚本（例如，部署脚本）。
- `package.json`: 定义共享依赖和整个 monorepo 范围脚本的根配置文件。
- `pnpm-workspace.yaml`: 定义 pnpm 工作区的结构，仅包含 `apps/*` 目录。
- `turbo.json`: 配置构建系统，定义任务依赖和缓存策略。

## 构建与运行

### 关键命令

所有命令都应在仓库的根目录运行。

- **安装依赖:**

  ```bash
  pnpm install
  ```

- **运行开发服务器:**
  要在开发模式下启动 `admin` 应用并开启热重载：

  ```bash
  pnpm dev
  ```

  这是 `pnpm -F=@01s-11comm/admin dev` 的别名。

- **生产环境构建:**
  要为 `admin` 应用创建生产环境的构建包：

  ```bash
  pnpm build
  ```

  此命令使用 Turborepo 高效地构建必要的包。输出目录位于 `apps/admin/dist`。

- **运行测试:**
  要使用 Vitest 运行单元测试和组件测试：

  ```bash
  pnpm test
  ```

- **部署:**
  项目包含一个自定义的部署脚本。

  ```bash
  pnpm deploy
  ```

- **文档:**
  项目使用 VitePress 生成文档。
  - 在本地运行文档服务器: `pnpm -F=@01s-11comm/admin docs:dev`
  - 构建静态文档网站: `pnpm -F=@01s-11comm/admin docs:build`

## 开发规范

- **代码风格:** 项目使用 `Prettier` 进行代码格式化，使用 `ESLint` 进行代码检查。运行 `pnpm format` 可以格式化整个代码库。
- **提交:** 项目可能遵循“约定式提交”规范，因为项目中存在 `commitlint` 和 `cz-git`。使用 `pnpm commit` 来创建一个合规的提交信息。
- **变更集 (Changesets):** 项目使用 `changeset` 来进行版本管理和生成变更日志。要添加一个新的变更集，请运行 `pnpm changeset:add`。
