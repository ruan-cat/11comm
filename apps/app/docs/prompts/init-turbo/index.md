# 初始化 turbo 配置

请深度思考。

1. 安装 turbo 依赖。开发环境依赖即可。
2. 在 monorepo 内，`apps/app/turbo.json` 必须作为 package-level 配置使用 `"extends": ["//"]` 继承根 `turbo.json`，避免形成第二个 Turbo root。
3. 配置 app 构建串行调度：`build:nitro:vercel` 依赖 `build:h5:prod`，让 CI 先构建 H5 生产产物，再构建 Nitro Vercel 产物；`docs:build` 保留为独立 turbo 任务，供本地构建 VitePress 文档。
4. 运行 ci 任务，用于测试。
