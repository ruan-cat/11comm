# 环境变量配置指南

## 1. 认证相关环境变量

### 1.1 必需配置

| 环境变量                  | 说明                            | 示例                                                               |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------ |
| `NEON_AUTH_BASE_URL`      | Neon Auth 服务基础 URL          | `https://ep-xxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth` |
| `NEON_AUTH_COOKIE_SECRET` | Cookie 签名密钥（至少 32 字符） | `your-32-character-secret-key`                                     |
| `PUBLIC_BASE_URL`         | 前端应用基础 URL                | `http://localhost:8080`                                            |

### 1.2 OAuth 配置（可选）

**GitHub OAuth：**
| 环境变量 | 说明 |
|----------|------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |

**微信小程序 OAuth：**
| 环境变量 | 说明 |
|----------|------|
| `WECHAT_MINI_PROGRAM_APPID` | 微信小程序 AppID |
| `WECHAT_MINI_PROGRAM_SECRET` | 微信小程序 AppSecret |

## 2. 开发环境配置

### 2.1 本地开发

创建 `.env.local` 文件：

```bash
# Neon Auth（开发用）
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.ap-southeast-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=development-secret-key-at-least-32-chars

# 前端
PUBLIC_BASE_URL=http://localhost:8080

# OAuth（可选）
GITHUB_CLIENT_ID=your-dev-client-id
GITHUB_CLIENT_SECRET=your-dev-client-secret
```

### 2.2 生产环境

在 Vercel 或 Cloudflare 中配置环境变量：

```bash
# Neon Auth
NEON_AUTH_BASE_URL=<生产环境URL>
NEON_AUTH_COOKIE_SECRET=<生产环境密钥>

# OAuth
GITHUB_CLIENT_ID=<生产Client ID>
GITHUB_CLIENT_SECRET=<生产Client Secret>
```

## 3. 环境变量加载顺序

系统按以下顺序加载环境变量（后者覆盖前者）：

1. `.env` - 基础配置
2. `.env.local` - 本地覆盖
3. `.env.production` - 生产覆盖
4. 系统环境变量

## 4. 密钥生成

### 4.1 生成 Cookie 密钥

```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 使用 OpenSSL
openssl rand -base64 32
```

### 4.2 密钥要求

- 长度：至少 32 字符
- 复杂度：建议使用随机字符串
- 保密：不要提交到版本控制

## 5. OAuth 配置步骤

### 5.1 GitHub OAuth

1. 打开 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth App
3. 设置回调 URL：`https://your-domain.com/api/auth/callback/github`
4. 复制 Client ID 和 Client Secret

### 5.2 Google OAuth

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 凭据
3. 设置授权回调 URL
4. 复制 Client ID 和 Client Secret

## 6. 故障排查

### 6.1 常见问题

| 问题                      | 解决方案                          |
| ------------------------- | --------------------------------- |
| NEON_AUTH_BASE_URL 未设置 | 检查环境变量是否正确加载          |
| Token 验证失败            | 确认 NEON_AUTH_COOKIE_SECRET 一致 |
| OAuth 回调失败            | 检查回调 URL 配置是否匹配         |

### 6.2 调试模式

设置以下环境变量开启调试：

```bash
OAUTH_SHOW_ERROR_DETAILS=true
```
