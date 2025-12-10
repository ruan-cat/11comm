# 项目部署

1. 通常运行 `apps\admin\package.json` 的 `build` 命令，就能完成项目构建了。
2. 先完成项目构建，再开始考虑项目部署。

## 部署到 cloudflare worker 内

本项目现在使用了 nitro 插件，将整个 vite 项目变成了 nuxt 产物的全栈项目。其在 cloudflare worker 的配置写法如下截图所示：

### 不使用 nitro 的部署方式（dist 目录结构）

1. 构建命令： `pnpm i && pnpm run build:cloudflare:admin`
2. 部署命令： `npx wrangler deploy --assets=./apps/admin/dist --compatibility-date 2025-06-29`

![2025-12-10-13-52-41](https://gh-img-store.ruan-cat.com/01s-docs/11comm/2025-12-10-13-52-41.png)

### 使用 nitro 的部署方式（.output 目录结构）

1. 构建命令： `pnpm i && pnpm run build:cloudflare:admin`
2. 部署命令： `npx wrangler --cwd=./apps/admin/.output deploy`

![2025-12-10-13-55-28](https://gh-img-store.ruan-cat.com/01s-docs/11comm/2025-12-10-13-55-28.png)

### 构建命令要点

1. 生成 `pnpm-lock.yaml` 依赖锁文件：
   > 用指定的 `pnpm i` 命令，主动安装依赖，这样就可以在服务器环境内生成显性的 `pnpm-lock.yaml` 依赖锁文件，就可以在后续使用 pnpm 包管理器了。在 cloudflare worker 内，必须要识别到准确的 `pnpm-lock.yaml` 文件才能使用 pnpm。
