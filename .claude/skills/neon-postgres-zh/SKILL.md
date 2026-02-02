---
name: neon-postgres-zh
description: 使用 Neon Serverless Postgres 的指南和最佳实践。涵盖入门、使用 Neon 进行本地开发、选择连接方式、Neon 功能、身份验证 (@neondatabase/auth)、PostgREST 风格的数据 API (@neondatabase/neon-js)、Neon CLI 以及 Neon 的平台 API/SDK。用于任何与 Neon 相关的问题。
---

# Neon Serverless Postgres

Neon 是一个无服务器 Postgres 平台，它将计算和存储分离，以提供自动扩缩容、分支、即时恢复和缩减到零的功能。它与 Postgres 完全兼容，适用于任何支持 Postgres 的语言、框架或 ORM。

## Neon 文档

在提出与 Neon 相关的声明之前，请务必参考 Neon 文档。文档是所有 Neon 相关信息的真实来源。

下面你会找到一份按关注领域组织的资源列表。这旨在帮助你找到正确的文档页面以获取和补充更多上下文。

你可以使用 `curl` 命令以 markdown 格式获取文档页面：

**文档：**

```bash
# 获取所有 Neon 文档列表
curl https://neon.com/llms.txt

# 以 markdown 格式获取任何文档页面
curl -H "Accept: text/markdown" https://neon.com/docs/<path>
```

不要猜测文档页面。使用 `llms.txt` 索引查找相关 URL 或关注下面资源中的链接。

## 资源概览

根据用户需求参考相应的资源文件：

### 核心指南

|    领域     |                资源                |                    适用场景                     |
| :---------: | :--------------------------------: | :---------------------------------------------: |
| 什么是 Neon |    `references/what-is-neon.md`    |         了解 Neon 概念、架构、核心资源          |
|  参考文档   |  `references/referencing-docs.md`  |             查找官方文档，验证信息              |
|  功能特性   |      `references/features.md`      |      分支、自动扩缩容、缩减到零、即时恢复       |
|  快速开始   |  `references/getting-started.md`   |       设置项目、连接字符串、依赖项、模式        |
|  连接方式   | `references/connection-methods.md` |         根据平台和运行环境选择驱动程序          |
| 开发者工具  |      `references/devtools.md`      | VSCode 扩展、MCP 服务器、Neon CLI (`neon init`) |

### 数据库驱动与 ORM

用于无服务器/边缘函数的 HTTP/WebSocket 查询。

|       领域        |              资源               |                     适用场景                     |
| :---------------: | :-----------------------------: | :----------------------------------------------: |
| Serverless Driver | `references/neon-serverless.md` | `@neondatabase/serverless` - HTTP/WebSocket 查询 |
|    Drizzle ORM    |  `references/neon-drizzle.md`   |             Drizzle ORM 与 Neon 集成             |

### 认证与数据 API SDK

Neon 的身份验证和 PostgREST 风格数据 API。

|    领域     |           资源            |                            适用场景                            |
| :---------: | :-----------------------: | :------------------------------------------------------------: |
|  Neon Auth  | `references/neon-auth.md` |               `@neondatabase/auth` - 仅身份验证                |
| Neon JS SDK |  `references/neon-js.md`  | `@neondatabase/neon-js` - Auth + Data API (PostgREST 风格查询) |

### Neon 平台 API 与 CLI

通过 REST API、SDK 或 CLI 以编程方式管理 Neon 资源。

|      领域      |                资源                 |           适用场景           |
| :------------: | :---------------------------------: | :--------------------------: |
| 平台 API 概览  |  `references/neon-platform-api.md`  | 通过 REST API 管理 Neon 资源 |
|    Neon CLI    |      `references/neon-cli.md`       | 终端工作流、脚本、CI/CD 管道 |
| TypeScript SDK | `references/neon-typescript-sdk.md` |  `@neondatabase/api-client`  |
|   Python SDK   |   `references/neon-python-sdk.md`   |        `neon-api` 包         |
