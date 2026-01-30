# Neon 平台 API

Neon 平台 API 允许您以编程方式管理 Neon 项目、分支、数据库和资源。您可以直接使用 REST API 或通过官方 SDK 使用。

## 选项

| 方法           | 包/URL                              | 适用场景                 |
| -------------- | ----------------------------------- | ------------------------ |
| REST API       | `https://console.neon.tech/api/v2/` | 任何语言，直接 HTTP 调用 |
| TypeScript SDK | `@neondatabase/api-client`          | Node.js, TypeScript 项目 |
| Python SDK     | `neon-api`                          | Python 脚本和应用程序    |
| CLI            | `neonctl`                           | 基于终端的管理           |

## 文档

```bash
# REST API 文档
curl -H "Accept: text/markdown" https://neon.com/docs/reference/api-reference

# TypeScript SDK
curl -H "Accept: text/markdown" https://neon.com/docs/reference/typescript-sdk

# Python SDK
curl -H "Accept: text/markdown" https://neon.com/docs/reference/python-sdk

# CLI
curl -H "Accept: text/markdown" https://neon.com/docs/reference/neon-cli
```

交互式 API 参考：https://api-docs.neon.tech/reference/getting-started-with-neon-api

## 子资源

有关详细信息，请参考相应的子资源：

### REST API 详情

| 主题                     | 资源                             |
| ------------------------ | -------------------------------- |
| 指南，身份验证，速率限制 | `neon-rest-api/guidelines.md`    |
| 项目                     | `neon-rest-api/projects.md`      |
| 分支，数据库，角色       | `neon-rest-api/branches.md`      |
| 计算端点                 | `neon-rest-api/endpoints.md`     |
| API 密钥                 | `neon-rest-api/keys.md`          |
| 操作                     | `neon-rest-api/operations.md`    |
| 组织                     | `neon-rest-api/organizations.md` |

### SDK

| 语言       | 资源                     |
| ---------- | ------------------------ |
| TypeScript | `neon-typescript-sdk.md` |
| Python     | `neon-python-sdk.md`     |

## 快速开始

### 身份验证

所有 API 请求都需要 Neon API 密钥：

```bash
Authorization: Bearer $NEON_API_KEY
```

### API 密钥类型

| 类型     | 范围                   | 适用场景            |
| -------- | ---------------------- | ------------------- |
| 个人     | 用户有权访问的所有项目 | 个人使用，脚本编写  |
| 组织     | 整个组织               | CI/CD，全组织自动化 |
| 项目范围 | 仅限单个项目           | 特定于项目的集成    |

### 速率限制

- 每分钟 700 个请求（约每秒 11 个）
- 每个路由每秒最多爆发 40 个请求
- 通过重试/退避处理 `429 Too Many Requests`

## 常用操作快速参考

| 操作         | REST API                                   | TypeScript SDK              | Python SDK            |
| ------------ | ------------------------------------------ | --------------------------- | --------------------- |
| 列出项目     | `GET /projects`                            | `listProjects({})`          | `projects()`          |
| 创建项目     | `POST /projects`                           | `createProject({...})`      | `project_create(...)` |
| 获取连接 URI | `GET /projects/{id}/connection_uri`        | `getConnectionUri({...})`   | `connection_uri(...)` |
| 创建分支     | `POST /projects/{id}/branches`             | `createProjectBranch(...)`  | `branch_create(...)`  |
| 启动端点     | `POST /projects/{id}/endpoints/{id}/start` | `startProjectEndpoint(...)` | `endpoint_start(...)` |

## 错误处理

| 状态码 | 含义       | 操作               |
| ------ | ---------- | ------------------ |
| 401    | 未授权     | 检查 API 密钥      |
| 404    | 未找到     | 验证资源 ID        |
| 429    | 速率限制   | 实施带有退避的重试 |
| 500    | 服务器错误 | 重试或联系支持     |
