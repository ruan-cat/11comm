# 旧 admin Nitro 接口测试历史说明

`apps/admin/tests/nitro/**` 曾用于旧 admin 内置 Nitro 的 HTTP 冒烟测试。当前后台项目已经切到独立 `apps/api` 承接接口、数据库、R2 和 seed 运维；admin 包不再提供 `test:nitro` 命令，也不再把这批旧测试作为 `apps/admin/server/**` 删除门禁。

现行验证入口如下：

| 验证范围                         | 当前入口                                                                        |
| :------------------------------- | :------------------------------------------------------------------------------ |
| admin 前端调用端与 URL resolver  | `apps/admin/src/**/tests/*.test.ts`                                             |
| admin 对应接口、DB、R2、manifest | `apps/api/tests/admin/**`、`apps/api/tests/infra/**`                            |
| 旧 Nitro 退役门禁                | `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md` 的 §7 |

下面内容仅保留为历史对照，不代表当前可执行命令。

## 1. 背景说明

### 1.1. 为什么要独立的 Nitro 接口测试

项目中存在两种不同的测试场景，它们对运行环境的需求完全不同：

|    测试类型    |               运行环境                |              测试目标               |
| :------------: | :-----------------------------------: | :---------------------------------: |
|  前端组件测试  | jsdom（浏览器环境的 JavaScript 模拟） |  Vue 组件、组合式函数、UI 交互逻辑  |
| Nitro 接口测试 |      Node.js（完整的运行时环境）      | 后端 API 接口、数据库操作、业务逻辑 |

### 1.2. jsdom 环境的局限性

jsdom 是一个 JavaScript 实现的 Web 标准模拟库，但它存在以下局限性：

- **缺少 Node.js 原生模块**：无法使用 `fs`、`path`、`crypto` 等 Node.js 内置模块
- **无法连接数据库**：无法建立 PostgreSQL/Neon 数据库连接
- **网络能力有限**：无法完整模拟 HTTP 请求的底层行为

### 1.3. Nitro 接口的依赖

Nitro 接口依赖以下环境能力：

- **Neon 数据库连接**：使用 Drizzle ORM 连接 Neon PostgreSQL 数据库
- **Node.js 原生模块**：服务端代码可能使用文件操作、加密等功能
- **完整的网络栈**：需要处理 HTTP 请求/响应的完整生命周期

因此，需要独立的测试命令来区分前端测试和后端接口测试，确保每种测试都能在正确的环境中运行。

## 2. 命令说明

### 2.1. 测试命令对比

|       命令        |                       说明                       |  环境   |      测试目标       |
| :---------------: | :----------------------------------------------: | :-----: | :-----------------: |
|    `pnpm test`    | 启动 Vitest 测试（jsdom 环境，用于前端组件测试） |  jsdom  |  Vue 组件、UI 测试  |
| `pnpm test:nitro` |                已废弃，仅历史对照                | Node.js | 旧 admin 内置 Nitro |

### 2.2. 命令使用示例

```bash
# 运行前端组件测试（jsdom 环境）
pnpm test

# 旧命令已废弃；请改用 apps/api 的专项测试
pnpm -F @01s-11comm/api exec vitest run tests/admin
```

## 3. 使用流程

### 3.1. 启动 Nitro 接口测试的步骤

旧 Nitro 接口测试曾需要先启动 admin 开发服务器：

**步骤 1：启动开发服务器**

在终端 1 中运行：

```bash
pnpm dev
```

等待开发服务器启动完成，确保 Nitro 服务正常运行。

**步骤 2：运行接口测试**

在终端 2 中运行：

```bash
pnpm test:nitro
```

测试执行完成后，可以关闭开发服务器（终端 1）。

### 3.2. 注意事项

- **历史说明**：`test:nitro` 命令已经从 admin package 移除，当前不要再按本流程运行
- **端口占用**：确保 `pnpm dev` 和 `pnpm test:nitro` 使用的端口不冲突
- **数据库连接**：确保 Neon 数据库服务正常运行，否则接口测试会失败

## 4. 测试文件位置

### 4.1. 测试文件组织

|     测试类型      |                文件位置                |
| :---------------: | :------------------------------------: |
|   前端组件测试    |          `tests/**/*.test.ts`          |
| 旧 Nitro 接口测试 | `tests/nitro/**/*.test.ts`，仅历史对照 |

### 4.2. 文件示例

```plain
apps/admin/
├── tests/
│   ├── components/
│   │   └── example.test.ts        # 前端组件测试
│   └── nitro/
│       ├── community.test.ts      # 社区管理接口测试
│       └── user.test.ts          # 用户管理接口测试
```

## 5. 配置说明

### 5.1. Vitest 配置机制

项目曾使用 Vitest 通过 `--node` 参数区分不同的测试环境；当前 admin Vitest 配置只保留前端 jsdom 测试。

|      参数      |                    说明                     |
| :------------: | :-----------------------------------------: |
| 无参数（默认） |          jsdom 环境，运行前端测试           |
|    `--node`    | 旧用法，当前不再切换到 admin Nitro 测试配置 |

### 5.2. 配置位置

- **前端测试配置**：`vitest.config.ts`（默认 jsdom 环境）
- **旧 Nitro 测试配置**：已从 active Vitest 配置移除；请迁到 `apps/api/tests/**`

### 5.3. 工作原理

`test:nitro` 命令内部实际执行的是：

```bash
vitest --node --run tests/nitro/
```

其中 `--node` 参数告诉 Vitest 使用 Node.js 环境而非 jsdom，从而可以：

- 导入 Node.js 原生模块（`fs`、`path`、`crypto` 等）
- 建立数据库连接（通过 Drizzle ORM）
- 模拟完整的 HTTP 请求生命周期
