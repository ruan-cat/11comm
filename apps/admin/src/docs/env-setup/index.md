# 环境变量配置与获取

本文档说明项目的环境变量配置体系及获取流程。

## 1. 环境变量文件概览

项目中存在多个环境变量文件，各有不同用途：

|           文件位置            |        作用        | 是否提交到 Git |               说明               |
| :---------------------------: | :----------------: | :------------: | :------------------------------: |
|         `.env.vercel`         |  Vercel 项目配置   |       是       | 存储 Vercel 项目名称、组织 ID 等 |
|            `.env`             | 敏感凭证（根目录） |       否       |   存储 VERCEL_TOKEN 等敏感信息   |
|       `apps/admin/.env`       |    数据库连接等    |       否       | 从 Vercel 拉取的 Neon 数据库凭证 |
| `apps/admin/.env.development` |    开发环境配置    |       是       |         前端开发环境变量         |
| `apps/admin/.env.production`  |    生产环境配置    |       是       |         前端生产环境变量         |

## 2. 环境变量获取流程

### 2.1. 前置条件

在执行环境变量拉取之前，需要确保：

1. **根目录 `.env` 文件**：包含 `VERCEL_TOKEN` 变量
2. **根目录 `.env.vercel` 文件**：包含 Vercel 项目配置（已提交到 Git）

### 2.2. 获取 VERCEL_TOKEN

1. 登录 [Vercel Dashboard](https://vercel.com/account/tokens)
2. 创建新的 Token（推荐设置合适的过期时间）
3. 在项目根目录创建 `.env` 文件，添加：

```bash
VERCEL_TOKEN=你的Token值
```

::: warning 注意
`.env` 文件包含敏感信息，已在 `.gitignore` 中被忽略，不会提交到 Git 仓库。
:::

### 2.3. 执行环境变量拉取

在 `apps/admin` 目录下执行：

```bash
pnpm env:pull
```

该命令会自动执行以下步骤：

1. 读取根目录 `.env.vercel` 获取 `VERCEL_PROJECT_NAME`
2. 读取根目录 `.env` 获取 `VERCEL_TOKEN`
3. 执行 `vercel link` 命令链接到指定项目
4. 执行 `vercel env pull` 拉取环境变量到 `apps/admin/.env`

### 2.4. 执行结果

成功执行后，`apps/admin/.env` 将包含从 Vercel 拉取的环境变量，主要包括：

- `DATABASE_URL` - Neon 数据库连接字符串（带连接池）
- `DATABASE_URL_UNPOOLED` - Neon 数据库直连字符串
- 其他 Neon 数据库相关的 `POSTGRES_*` 变量

## 3. 环境变量文件详解

### 3.1. `.env.vercel`（根目录）

```bash
# Vercel 项目配置变量
VERCEL_PROJECT_NAME=01s-vercel
VERCEL_ORG_ID=team_cUeGw4TtOCLp0bbuH8kA7BYH
VERCEL_PROJECT_ID=prj_0dbaKzhoqP9C3A7C4QDkzjSprN2L
```

这些变量用于：

- `vercel-deploy-tool.config.ts` - 项目部署配置
- `scripts/env-pull.ts` - 环境变量拉取脚本

### 3.2. `.env`（根目录）

```bash
VERCEL_TOKEN=你的Token
```

用于 Vercel CLI 的身份认证。

## 4. 在 CI/CD 中使用

### 4.1. GitHub Actions

在 GitHub Actions 中，可以通过 Secrets 设置环境变量：

1. 进入仓库 Settings -> Secrets and variables -> Actions
2. 添加以下 Secrets：
   - `VERCEL_TOKEN`

工作流示例：

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
      - name: Pull Env Variables
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          echo "VERCEL_TOKEN=$VERCEL_TOKEN" > .env
          cd apps/admin && pnpm env:pull
```

## 5. 相关命令

|       命令       |    位置    |         说明         |
| :--------------: | :--------: | :------------------: |
| `pnpm env:pull`  | apps/admin | 拉取 Vercel 环境变量 |
|  `pnpm db:push`  | apps/admin | 推送 Schema 到数据库 |
| `pnpm db:studio` | apps/admin | 启动 Drizzle Studio  |
|  `pnpm deploy`   |   根目录   |  部署项目到 Vercel   |

## 6. 故障排查

### 6.1. 常见问题

**问题：** 运行 `pnpm env:pull` 报错 "缺少必要的环境变量"

**解决方案：**

1. 确认根目录存在 `.env` 文件且包含 `VERCEL_TOKEN`
2. 确认根目录存在 `.env.vercel` 文件（从 Git 拉取即有）

**问题：** Token 无效或过期

**解决方案：**

1. 前往 [Vercel Token 页面](https://vercel.com/account/tokens) 重新创建 Token
2. 更新根目录 `.env` 文件中的 `VERCEL_TOKEN`

### 6.2. 测试环境变量读取

项目根目录提供了测试用例验证环境变量读取：

```bash
pnpm vitest run tests/vercel-env.test.ts
```

该测试会验证 `.env.vercel` 中的三个配置变量是否能正常读取。
