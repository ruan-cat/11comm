# 什么是 Neon

Neon 是一个 Serverless Postgres 平台，旨在帮助您更快地构建可靠且可扩展的应用程序。它将计算和存储分离，提供现代开发者功能，如自动缩放、分支、即时恢复和缩放至零。

如需完整介绍，请获取官方文档：

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/introduction
```

## 核心概念

了解 Neon 的资源层次结构对于有效地使用该平台至关重要。

| 概念     | 描述                                           | 关键关系         |
| -------- | ---------------------------------------------- | ---------------- |
| 组织     | 计费、用户和项目的最高级别容器                 | 包含项目         |
| 项目     | 应用程序所有数据库资源的主要容器               | 包含分支         |
| 分支     | 数据库状态的轻量级、写时复制克隆               | 包含数据库、角色 |
| 计算端点 | 运行中的 PostgreSQL 实例（用于查询的 CPU/RAM） | 附加到分支       |
| 数据库   | 数据的逻辑容器（表、模式、视图）               | 存在于分支内     |
| 角色     | 用于身份验证和授权的 PostgreSQL 角色           | 属于分支         |
| 操作     | 控制平面的异步操作（创建分支、启动计算）       | 与项目关联       |

## 主要区别

1. **Serverless 架构**：计算自动缩放，并在空闲时可以暂停
2. **分支**：无需复制存储即可创建即时数据库副本
3. **计算与存储分离**：仅在计算活动时付费
4. **Postgres 兼容**：适用于任何 Postgres 驱动程序、ORM 或工具

## 文档资源

| 主题            | 文档 URL                                                 |
| --------------- | -------------------------------------------------------- |
| 介绍            | https://neon.com/docs/introduction                       |
| 架构            | https://neon.com/docs/introduction/architecture-overview |
| 计划与计费      | https://neon.com/docs/introduction/about-billing         |
| 区域            | https://neon.com/docs/introduction/regions               |
| Postgres 兼容性 | https://neon.com/docs/reference/compatibility            |

```bash
# 获取架构文档
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/architecture-overview

# 获取计划和计费
curl -H "Accept: text/markdown" https://neon.com/docs/introduction/about-billing
```

## 何时使用 Neon

Neon 非常适合：

- **Serverless 应用程序**：需要数据库访问而无需管理连接的函数
- **开发工作流**：像代码一样分支数据库以进行隔离测试
- **可变工作负载**：在流量高峰期间自动缩放，空闲时缩放至零
- **成本优化**：仅为您使用的活动计算时间和存储付费
