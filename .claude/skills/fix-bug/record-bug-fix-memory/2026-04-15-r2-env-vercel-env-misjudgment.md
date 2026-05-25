# 2026-04-15 r2-env.ts 与 Vercel / R2 环境变量误判事故

## 1. 问题现象

实现 R2 上传时，容易误以为 Vercel 会像 Marketplace 集成一样自动注入 Cloudflare R2 所需环境变量，导致服务端代码设计成"平台自动提供"。

## 2. 实际根因

Cloudflare R2 并不是 Vercel 内建托管存储，本项目使用的是 Cloudflare 自己的 S3 兼容凭据。Vercel 这里只是普通宿主平台，`process.env` 里拿到的值全部来自项目自定义环境变量，而不是平台预置变量。

## 3. 关键误导点

看到部署平台是 Vercel，容易把"在 Vercel 上运行"误解成"Vercel 会自动知道 Cloudflare R2 的 bucket、endpoint、access key"。

## 4. 有效修复

把 `R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_PUBLIC_BASE_URL` 明确配置为 Vercel 项目的自定义 env，并让 `r2-env.ts` 只负责读取和校验这些值。

## 5. 验证方式

服务端启动时不再缺少 R2 配置；`sign-part` 和 `complete` 能基于这些 env 正常生成 presigned URL 并完成 multipart 上传。

## 6. 后续约束

以后再提到"Vercel 里如何获取 Cloudflare R2 信息"，默认答案应该是"从项目自定义环境变量读取"，不要写成仿佛 Vercel 平台会自动提供。
