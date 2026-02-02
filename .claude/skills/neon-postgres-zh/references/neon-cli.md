# Neon CLI

Neon CLI 是一个命令行界面，用于直接从终端管理 Neon Serverless Postgres。它提供与 Neon 平台 API 相同的功能，非常适合脚本编写、CI/CD 管道和喜欢终端工作流的开发人员。

## 安装

**macOS (Homebrew):**

```bash
brew install neonctl
```

**npm (跨平台):**

```bash
npm install -g neonctl
```

## 身份验证

验证您的 Neon 帐户：

```bash
neonctl auth
```

这将打开浏览器进行 OAuth 身份验证并将凭据存储在本地。

对于 CI/CD 或非交互式环境，请使用 API 密钥：

```bash
export NEON_API_KEY=your-api-key
```

从以下位置获取您的 API 密钥：https://console.neon.tech/app/settings/api-keys

## 常用命令

### 项目管理

```bash
# 列出所有项目
neonctl projects list

# 创建新项目
neonctl projects create --name my-project

# 获取项目详情
neonctl projects get <project-id>

# 删除项目
neonctl projects delete <project-id>
```

### 分支操作

```bash
# 列出分支
neonctl branches list --project-id <project-id>

# 创建分支
neonctl branches create --project-id <project-id> --name dev

# 删除分支
neonctl branches delete <branch-id> --project-id <project-id>
```

### 连接字符串

```bash
# 获取连接字符串
neonctl connection-string --project-id <project-id>

# 获取特定分支的连接字符串
neonctl connection-string --project-id <project-id> --branch-id <branch-id>

# 获取池化连接字符串
neonctl connection-string --project-id <project-id> --pooled
```

### SQL 执行

```bash
# 运行 SQL 查询
neonctl sql "SELECT * FROM users LIMIT 10" --project-id <project-id>

# 从文件运行 SQL
neonctl sql --file schema.sql --project-id <project-id>
```

### 数据库管理

```bash
# 列出数据库
neonctl databases list --project-id <project-id> --branch-id <branch-id>

# 创建数据库
neonctl databases create --project-id <project-id> --name mydb

# 列出角色
neonctl roles list --project-id <project-id> --branch-id <branch-id>
```

## 输出格式

CLI 支持多种输出格式：

```bash
# JSON 输出 (脚本默认)
neonctl projects list --output json

# 表格输出 (人类可读)
neonctl projects list --output table

# YAML 输出
neonctl projects list --output yaml
```

## CI/CD 集成

示例 GitHub Actions 工作流：

```yaml
- name: Create preview branch
  env:
    NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
  run: |
    neonctl branches create \
      --project-id ${{ vars.NEON_PROJECT_ID }} \
      --name preview-${{ github.event.pull_request.number }}
```

## CLI vs MCP Server vs SDKs

| 工具           | 适用场景                             |
| -------------- | ------------------------------------ |
| Neon CLI       | 终端工作流、脚本、CI/CD 管道         |
| MCP Server     | 与 Claude, Cursor 等进行 AI 辅助开发 |
| TypeScript SDK | Node.js/TypeScript 应用中的编程访问  |
| Python SDK     | Python 应用程序中的编程访问          |
| REST API       | 任何语言中的直接 HTTP 集成           |

## 文档资源

| 主题     | URL                                                   |
| -------- | ----------------------------------------------------- |
| CLI 参考 | https://neon.com/docs/reference/neon-cli              |
| CLI 安装 | https://neon.com/docs/reference/cli-install           |
| CLI 认证 | https://neon.com/docs/reference/cli-auth              |
| CLI 项目 | https://neon.com/docs/reference/cli-projects          |
| CLI 分支 | https://neon.com/docs/reference/cli-branches          |
| CLI 连接 | https://neon.com/docs/reference/cli-connection-string |

获取 CLI 文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/reference/neon-cli
```
