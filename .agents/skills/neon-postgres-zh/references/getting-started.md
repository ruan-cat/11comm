# Neon 快速开始

帮助用户在项目中开始使用 Neon 的交互式指南。设置他们的 Neon 项目（带有连接字符串）并将他们的数据库连接到代码。

获取官方入门指南：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/get-started/signing-up
```

## 交互式设置流程

### 第 1 步：检查组织和项目

**首先，检查组织：**

- 如果他们有 1 个组织：默认为该组织
- 如果他们有多个组织：列出所有组织并询问使用哪一个

**然后，检查所选组织内的项目：**

- **无项目**：询问他们是否要创建新项目
- **1 个项目**：询问 "您想使用 '{project_name}' 还是创建一个新项目？"
- **多个项目 (<6)**：列出所有项目并让他们选择
- **许多项目 (6+)**：列出最近的项目，提供创建新项目或通过名称/ID 指定的选项

### 第 2 步：数据库设置

**获取连接字符串：**

- 使用 MCP 服务器获取所选项目的连接字符串

**为他们的环境配置它：**

- 大多数项目使用带有 `DATABASE_URL` 的 `.env` 文件
- 对于其他设置，检查项目结构并询问

**在修改 .env 之前：**

1. 尝试先读取 .env 文件
2. 如果可读：使用 search_replace 更新或追加
3. 如果不可读：使用 append 命令或显示要手动添加的行：

```plain
DATABASE_URL=postgresql://user:password@host/database
```

### 第 3 步：安装依赖项

根据部署平台和运行时推荐驱动程序。有关详细指导，请参阅 `connection-methods.md`。

**快速推荐：**

| 环境                     | 驱动                       | 安装命令                               |
| ------------------------ | -------------------------- | -------------------------------------- |
| Vercel (Edge/Serverless) | `@neondatabase/serverless` | `npm install @neondatabase/serverless` |
| Cloudflare Workers       | `@neondatabase/serverless` | `npm install @neondatabase/serverless` |
| AWS Lambda               | `@neondatabase/serverless` | `npm install @neondatabase/serverless` |
| 传统 Node.js             | `pg`                       | `npm install pg`                       |
| 长时间运行的服务器       | 带有连接池的 `pg`          | `npm install pg`                       |

有关详细的 serverless 驱动程序使用方法，请参阅 `neon-serverless.md`。
对于复杂场景（多运行时、混合架构），请参考 `connection-methods.md`。

### 第 4 步：了解项目

**如果是空/新项目：**
简要询问（1-2 个问题）：

- 他们正在构建什么？
- 有什么特定的技术栈？

**如果是已有项目：**
跳过问题 - 从代码库推断。更新相关代码以使用驱动程序。

### 第 5 步：身份验证（可选）

**如果项目不需要身份验证则跳过**（CLI 工具、脚本、静态站点）。

**如果项目可以从身份验证中受益：**
询问："您的应用需要用户身份验证吗？Neon Auth 可以处理登录/注册、社交登录和会话管理。"

**如果他们想要身份验证：**

- 使用 MCP 服务器 `provision_neon_auth` 工具
- 引导完成特定于框架的设置
- 配置环境变量
- 设置基本身份验证代码

有关详细的身份验证设置，请参阅 `neon-auth.md`。有关身份验证 + 数据库查询，请参阅 `neon-js.md`。

### 第 6 步：ORM 设置

**检查现有的 ORM**（Prisma, Drizzle, TypeORM）。

**如果未找到 ORM：**
询问："想设置 ORM 以进行类型安全的数据库查询吗？"

如果是，根据项目建议。如果否，继续使用原生 SQL。

有关 Drizzle ORM 集成，请参阅 `neon-drizzle.md`。

### 第 7 步：模式设置

**检查现有的模式：**

- SQL 迁移文件
- ORM 模式（Prisma, Drizzle）
- 数据库初始化脚本

**如果找到现有模式：**
询问："找到了现有的模式定义。想将这些迁移到您的 Neon 数据库吗？"

**如果没有模式：**
询问他们是否想要：

1. 创建一个简单的示例模式（用户表）
2. 一起设计自定义模式
3. 暂时跳过模式设置

**示例模式：**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 第 8 步：下一步

"一切就绪！我可以帮助您做以下事情：

- Neon 特定功能（分支、自动扩缩容、缩减到零）
- 生产环境的连接池
- 编写查询或构建 API 端点
- 数据库迁移和模式更改
- 性能优化"

## 安全最佳实践

1. 切勿将连接字符串提交到版本控制
2. 对所有凭据使用环境变量
3. 首选 SSL 连接（Neon 默认）
4. 使用最小权限数据库角色
5. 定期轮换 API 密钥和密码

## 恢复支持

如果用户说 "继续 Neon 设置"，检查已配置的内容：

- MCP 服务器连接
- 带有 DATABASE_URL 的 .env 文件
- 已安装依赖项
- 已创建模式

然后从他们离开的地方继续。

## 开发者工具

为了获得最佳开发体验，请设置 Neon 的开发者工具：

```bash
npx neon init
```

这将安装 VSCode 扩展并为 AI 辅助开发配置 MCP 服务器。

有关详细设置说明，请参阅 `devtools.md`。

## 文档资源

| 主题        | URL                                                |
| ----------- | -------------------------------------------------- |
| 快速开始    | https://neon.com/docs/get-started/signing-up       |
| 连接到 Neon | https://neon.com/docs/connect/connect-intro        |
| 连接字符串  | https://neon.com/docs/connect/connect-from-any-app |
| 框架指南    | https://neon.com/docs/get-started/frameworks       |
| ORM 指南    | https://neon.com/docs/get-started/orms             |
| VSCode 扩展 | https://neon.com/docs/local/vscode-extension       |
| MCP 服务器  | https://neon.com/docs/ai/neon-mcp-server           |
