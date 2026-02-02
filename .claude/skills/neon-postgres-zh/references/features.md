# Neon 功能

Neon 关键平台功能的概览。有关详细信息，请获取官方文档。

## 分支 (Branching)

在任何时间点创建数据库的即时、写入时复制克隆。分支是隔离的环境，非常适合开发、测试和预览部署。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/branching
```

**关键点：**

- 分支是即时的（无数据复制）
- 写入时复制意味着分支只存储相对于父级的更改
- 适用于：开发环境、预发布、测试、预览部署
- 分支可以有自己的计算端点

**用例：**

| 用例     | 描述                         |
| -------- | ---------------------------- |
| 开发     | 每个开发人员获得隔离的分支   |
| 预览部署 | 每个 PR/预览 URL 一个分支    |
| 测试     | 通过重新创建分支重置测试数据 |
| 模式迁移 | 在生产之前在分支上测试迁移   |

如果 Neon MCP 服务器可用，你可以使用它来列出和创建分支。否则，请参考 Neon CLI 或平台 API。

## 自动扩缩容 (Autoscaling)

Neon 根据工作负载需求自动扩展计算资源。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/autoscaling
```

**关键点：**

- 在最小和最大计算单元 (CU) 之间扩展
- 响应 CPU 和内存压力
- 不需要人工干预
- 为每个项目或端点配置限制

## 缩减到零 (Scale to Zero)

数据库在一段时间不活动后自动挂起，将成本降低到仅存储。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/scale-to-zero
```

**关键点：**

- 默认在 5 分钟不活动后挂起（可配置）
- 挂起后的第一次查询有约 500ms 的冷启动时间
- 始终维护存储
- 非常适合间歇性使用的开发/预发布环境

## 即时恢复 (Instant Restore)

无需备份即可将数据库恢复到保留窗口内的任何点。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/branch-restore
```

**关键点：**

- 无需预先配置备份的时间点恢复
- 恢复窗口取决于计划（7-30 天）
- 从历史记录中的任何点创建分支
- 时间旅行查询以查看历史数据

## 只读副本 (Read Replicas)

创建只读计算端点以扩展读取工作负载。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/read-replicas
```

**关键点：**

- 只读副本与主副本共享存储（无数据重复）
- 即时创建
- 独立于主副本扩展
- 适用于：分析、报告、读取密集型工作负载

## 连接池 (Connection Pooling)

通过 PgBouncer 内置连接池，实现高效的连接管理。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/connect/connection-pooling
```

**关键点：**

- 通过将 `-pooler` 添加到端点主机名来启用
- 默认事务模式
- 支持多达 10,000 个并发连接
- 对无服务器环境至关重要

## IP 允许列表 (IP Allow Lists)

限制特定 IP 地址或范围对数据库的访问。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/ip-allow
```

## 逻辑复制 (Logical Replication)

将数据复制到/从外部 Postgres 数据库。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/guides/logical-replication-guide
```

## Neon Auth

与你的数据库一起分支的托管身份验证。

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/auth/overview
```

**关键点：**

- 使用电子邮件、社交提供商（Google, GitHub）登录/注册
- 会话管理
- 包含 UI 组件
- 与你的数据库一起分支

有关设置，请参阅 `neon-auth.md`。有关 auth + data API，请参阅 `neon-js.md`。

## 功能文档参考

| 功能        | 文档                                                   | 资源           |
| ----------- | ------------------------------------------------------ | -------------- |
| 分支        | https://neon.com/docs/introduction/branching           | -              |
| 自动扩缩容  | https://neon.com/docs/introduction/autoscaling         | -              |
| 缩减到零    | https://neon.com/docs/introduction/scale-to-zero       | -              |
| 即时恢复    | https://neon.com/docs/introduction/branch-restore      | -              |
| 只读副本    | https://neon.com/docs/introduction/read-replicas       | -              |
| 连接池      | https://neon.com/docs/connect/connection-pooling       | -              |
| IP 允许列表 | https://neon.com/docs/introduction/ip-allow            | -              |
| 逻辑复制    | https://neon.com/docs/guides/logical-replication-guide | -              |
| Neon Auth   | https://neon.com/docs/auth/overview                    | `neon-auth.md` |
| Data API    | https://neon.com/docs/data-api/overview                | `neon-js.md`   |
