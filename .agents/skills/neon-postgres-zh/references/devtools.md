# Neon 开发者工具

Neon 提供开发者工具来增强你的本地开发工作流程，包括 VSCode 扩展和用于 AI 辅助开发的 MCP 服务器。

## 使用 neon init 快速设置

设置所有 Neon 开发者工具的最快方法：

```bash
npx neon init
```

此命令：

- 安装 Neon VSCode 扩展
- 为 AI 助手配置 Neon MCP 服务器
- 为 Neon 开发设置本地环境

获取完整 CLI 参考：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/reference/cli-init
```

## VSCode 扩展

Neon VSCode 扩展提供：

- **数据库资源管理器**：浏览项目、分支、表和数据
- **SQL 编辑器**：使用 IntelliSense 编写和执行查询
- **分支管理**：创建、切换和管理数据库分支
- **连接字符串访问**：快速复制连接字符串

**从 VSCode 安装：**

1. 打开扩展 (Cmd/Ctrl+Shift+X)
2. 搜索 "Neon"
3. 安装 Neon 发布的 "Neon"

**或通过命令行安装：**

```bash
code --install-extension neon.neon-vscode
```

获取详细文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/local/vscode-extension
```

## Neon MCP 服务器

Neon MCP (Model Context Protocol) 服务器使 Claude、Cursor 和 GitHub Copilot 等 AI 助手能够直接与你的 Neon 数据库交互。

### 功能

MCP 服务器为 AI 助手提供：

- **项目管理**：列出、创建、描述和删除项目
- **分支操作**：创建分支、比较模式、从父级重置
- **SQL 执行**：运行查询和事务
- **模式操作**：描述表、获取数据库结构
- **迁移**：通过安全检查准备和完成数据库迁移
- **查询调优**：分析和优化慢查询
- **Neon Auth**：为你的分支配置身份验证

### 设置

**选项 1：通过 neon init (推荐)**

```bash
npx neon init
```

**选项 2：手动配置**

添加到你的 AI 助手的 MCP 配置中：

```json
{
	"mcpServers": {
		"neon": {
			"command": "npx",
			"args": ["-y", "@neondatabase/mcp-server-neon"],
			"env": {
				"NEON_API_KEY": "your-api-key"
			}
		}
	}
}
```

从以下位置获取你的 API 密钥：https://console.neon.tech/app/settings/api-keys

### 常用 MCP 操作

| 操作                         | 作用               |
| ---------------------------- | ------------------ |
| `list_projects`              | 显示所有 Neon 项目 |
| `create_project`             | 创建新项目         |
| `run_sql`                    | 执行 SQL 查询      |
| `get_connection_string`      | 获取数据库连接 URL |
| `create_branch`              | 创建数据库分支     |
| `prepare_database_migration` | 安全地准备模式更改 |
| `provision_neon_auth`        | 设置 Neon Auth     |

获取完整 MCP 服务器文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/ai/neon-mcp-server
```

## 文档资源

| 主题          | URL                                          |
| ------------- | -------------------------------------------- |
| CLI Init 命令 | https://neon.com/docs/reference/cli-init     |
| VSCode 扩展   | https://neon.com/docs/local/vscode-extension |
| MCP 服务器    | https://neon.com/docs/ai/neon-mcp-server     |
| Neon CLI 参考 | https://neon.com/docs/reference/neon-cli     |
