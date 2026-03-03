# 2026-03-03 构建配置和依赖检查报告

## 1. 依赖项检查

### 1.1 apps/admin/package.json

**发现问题**：存在 Neon Auth 相关依赖

```json
"@neondatabase/auth": "0.2.0-beta.1"
```

**位置**：`apps/admin/package.json:86`

**影响**：该依赖会被打包到生产环境，导致运行时尝试加载鉴权功能

### 1.2 根目录 package.json

**检查结果**：未发现 Neon Auth 相关依赖

## 2. Nitro 配置检查

### 2.1 nitro.config.ts 中的鉴权配置

**文件**：`apps/admin/nitro.config.ts`

**发现问题**：

1. **runtimeConfig 中的鉴权配置**（第 56-58 行）：

   ```typescript
   /** Neon Auth 服务基础 URL */
   neonAuthBaseUrl: getVercelEnv("NEON_AUTH_BASE_URL") || process.env.NEON_AUTH_BASE_URL || "",
   /** Neon Auth Cookie 密钥（至少 32 字符） */
   neonAuthCookieSecret: getVercelEnv("NEON_AUTH_COOKIE_SECRET") || process.env.NEON_AUTH_COOKIE_SECRET || "",
   ```

2. **Cloudflare wrangler 配置中的鉴权环境变量**（第 140-145 行）：
   ```typescript
   ...(getVercelEnv("NEON_AUTH_BASE_URL") && {
     comm_admin_11__NEON_AUTH_BASE_URL: getVercelEnv("NEON_AUTH_BASE_URL"),
   }),
   ...(getVercelEnv("NEON_AUTH_COOKIE_SECRET") && {
     comm_admin_11__NEON_AUTH_COOKIE_SECRET: getVercelEnv("NEON_AUTH_COOKIE_SECRET"),
   }),
   ```

## 3. 环境变量检查

### 3.1 apps/admin/.env

**发现问题**：存在大量 Neon Auth 相关环境变量

1. **Neon Auth 认证配置**（第 38-51 行）：

   ```bash
   # Neon Auth 服务基础 URL
   NEON_AUTH_BASE_URL=https://ep-cold-surf-a1x1hkmn.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth

   # Cookie 加密密钥（至少 32 字符）
   NEON_AUTH_COOKIE_SECRET=njwWxbW4uNsGoqm+QE8hufLX/xl8664iEaf3L/FTGoY=

   # 前端基础 URL（用于 OAuth 回调）
   PUBLIC_BASE_URL=http://localhost:8080
   ```

2. **OAuth 第三方登录配置**（第 54-69 行）：

   ```bash
   # GitHub OAuth（可选）
   # GITHUB_CLIENT_ID=your_github_client_id
   # GITHUB_CLIENT_SECRET=your_github_client_secret

   # 微信小程序 OAuth（可选）
   # WECHAT_MINI_PROGRAM_APPID=your_appid
   # WECHAT_MINI_PROGRAM_SECRET=your_secret

   # OAuth 回调错误处理配置
   OAUTH_SHOW_ERROR_DETAILS=false
   ```

## 4. 构建产物检查

### 4.1 构建产物目录

**位置**：`apps/admin/.output/`

**检查结果**：构建产物存在，且包含大量鉴权相关代码

### 4.2 构建产物中的鉴权 API 端点

**发现问题**：构建产物中存在 10 个鉴权相关的 API 端点

```log
apps\admin\.output\server\_routes\api\auth\callback\$provider\get.mjs
apps\admin\.output\server\_routes\api\auth\migrate\post.mjs
apps\admin\.output\server\_routes\api\auth\sign_in\post.mjs
apps\admin\.output\server\_routes\api\auth\sign_out\post.mjs
apps\admin\.output\server\_routes\api\auth\forgot_password\post.mjs
apps\admin\.output\server\_routes\api\auth\migrate\verify\post.mjs
apps\admin\.output\server\_routes\api\auth\refresh\post.mjs
apps\admin\.output\server\_routes\api\auth\sign_up\post.mjs
apps\admin\.output\server\_routes\api\auth\oauth\$provider\get.mjs
apps\admin\.output\server\_routes\api\auth\me\get.mjs
```

### 4.3 构建产物中的鉴权库

**发现问题**：构建产物中包含 4 个鉴权相关的库文件

```log
.output/server/_chunks/auth-client.mjs
.output/server/_chunks/_libs/@neondatabase/auth.mjs
.output/server/_chunks/_libs/@supabase/auth-js.mjs
.output/server/_libs/better-auth.mjs
```

### 4.4 源代码检查

**检查结果**：

- `apps/admin/server/` 目录中**未发现**任何鉴权相关文件
- `apps/admin/server/` 目录中**未发现**任何 `@neondatabase/auth` 导入

**结论**：源代码已经清理干净，但构建产物未更新

## 5. 问题总结

### 5.1 根本原因

1. **源代码已清理**：`apps/admin/server/` 目录中的鉴权代码已被删除
2. **构建产物未更新**：`.output/` 目录中仍保留着旧的鉴权代码
3. **生产环境部署旧代码**：生产环境部署的是旧的构建产物，导致运行时尝试加载 `@neondatabase/auth` 包

### 5.2 500 错误原因推测

生产环境访问 `https://01s-11comm.ruan-cat.com/` 出现 500 错误，可能是因为：

1. 构建产物中的鉴权代码尝试导入 `@neondatabase/auth` 包
2. 但该包在 `package.json` 中仍然存在，可能在生产环境中加载失败
3. 或者鉴权中间件/插件在启动时初始化失败

## 6. 建议

### 6.1 立即执行的清理操作

1. **删除依赖**：

   ```bash
   cd apps/admin
   pnpm remove @neondatabase/auth
   ```

2. **清理 Nitro 配置**：
   - 删除 `nitro.config.ts` 中的 `neonAuthBaseUrl` 和 `neonAuthCookieSecret` 配置
   - 删除 Cloudflare wrangler 配置中的 Neon Auth 环境变量

3. **清理环境变量**：
   - 删除 `.env` 文件中的 Neon Auth 相关配置（第 38-69 行）

4. **清理构建产物**：

   ```bash
   cd apps/admin
   rm -rf .output
   ```

5. **重新构建**：

   ```bash
   cd apps/admin
   pnpm build:prod
   ```

6. **重新部署**：
   ```bash
   # 根据部署平台选择对应命令
   pnpm build:prod:cloudflare  # Cloudflare
   pnpm build:prod:vercel      # Vercel
   ```

### 6.2 验证步骤

1. 构建后检查 `.output/server/` 目录，确认不再包含鉴权相关文件
2. 本地运行 `pnpm preview` 测试构建产物
3. 部署到生产环境后访问 `https://01s-11comm.ruan-cat.com/` 验证

## 7. 附加说明

### 7.1 为什么源代码已清理但构建产物未更新

可能的原因：

1. 删除源代码后未执行重新构建
2. 或者构建缓存导致使用了旧的构建产物
3. 或者部署流程中使用了缓存的构建产物

### 7.2 预防措施

建议在 CI/CD 流程中添加：

1. 构建前清理 `.output/` 目录
2. 构建后验证构建产物中不包含已删除的代码
3. 部署前运行集成测试
