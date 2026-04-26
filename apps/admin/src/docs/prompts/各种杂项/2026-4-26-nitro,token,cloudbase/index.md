<!-- TODO: 长期任务 未开始 -->

# 实现接口服务对接 cloudbase，实现微信小程序的登录业务

目前先编写清楚各种技术实现边界，和各种可能的坑点，划定清楚各个技术栈工具的功能职责。

初步的设计如下：

1. 一个统一的 nitro 接口服务，同时支撑 admin 和 app 两个项目，同时支撑两款应用的鉴权。
2. cloudbase 只负责最纯粹的微信小程序的身份验证、和微信小程序的部署。
3. 文件上传和下载，用的是 cloudflare R2 存储桶。

---

CloudBase：
只放 login 云函数 / 微信身份桥
只负责小程序云开发环境关联
只负责小程序部署相关能力
不放业务数据库
不放文件服务
不放主要业务 API

Vercel Nitro：
放全部业务 API
放 admin API
放小程序 API
放 Neon 数据访问
放 Cloudflare 文件签名和文件元数据管理

Cloudflare：
放文件对象
放 CDN
放图片处理

Neon：
放业务数据源
tenant / mini_app / user / order / file metadata 全部在这里

## request/uploadFile/downloadFile 服务器域名的配置问题

微信公众平台的小程序 request/uploadFile/downloadFile 服务器域名

问题：
在 Cloudflare R2 + Vercel + Nitro v3 下，最推荐的域名规划，能不能用一个唯一的 cloudflare R2 存储桶映射出来的域名来解决呢？我不喜欢要维护那么多的文件相关的域名。

---

可以只维护一个文件域名，例如：
https://files.example.com

但前提是：

1. 不直接使用 R2 S3 presigned URL；
2. 上传必须走 Cloudflare Worker 代理/签名接口；
3. 下载也统一从这个域名走；
4. 微信小程序后台仍然要把同一个域名分别填到 uploadFile / downloadFile，必要时也填到 request。

关于文件接口的架构设计：

微信小程序 / admin
│
├─ 普通业务 API
│ ↓
│ https://api.example.com -> Vercel Nitro
│
├─ 获取上传授权
│ ↓
│ https://api.example.com/mp/files/create-upload
│
├─ 真正上传文件
│ ↓
│ https://<account_id>.r2.cloudflarestorage.com/...
│
└─ 上传完成确认
↓
https://api.example.com/mp/files/complete

Nitro 仍然是唯一后端。
R2 只作为对象存储服务。
小程序直接把文件传给 R2 的 S3 API 域名。

---

<!-- TODO: 这一部分其实我自己没看懂是这么回事 需要重新仔细调研，询问 -->

## nitro 接口获取来自 cloudbase 的 openid 的技术方案设计

问题：（已大概完成初步设计）
关于获取核心 openid，一定要写 CloudBase 云函数的问题，我不想写专门的 cloudbase 云函数来专门获取 openid，在我的 monorepo 内，我不希望搞一个专门的子包来弄这个云函数。因为我清楚这个 cloudbase 云函数要手动部署的，我已经有一个 nitro 接口服务了，还搞一个需要部署的函数，加重了我的部署心智负担。我不喜欢这个设计。

---

我不想写专门的 cloudbase 云函数来专门获取 openid

```txt
小程序 wx.login()
  ↓
拿 code
  ↓
POST /mp/auth/wx-login 到 Nitro
  ↓
Nitro 调微信 jscode2session
  ↓
拿 openid / session_key
  ↓
创建你自己的 session token
```

微信开放接口文档说明，wx.login 拿到的 code 有效期约 5 分钟，服务端需要调用 jscode2session 换取 openid 和 session_key。这个方式不需要 CloudBase 云函数，但你要在 Nitro/Vercel 里保存每个小程序的：appid 和 appSecret

---

Nitro 后端必须持有小程序的 appid 和 appSecret。

Vercel 环境变量里要有：

```txt
WECHAT_MP_APPID=wx1234567890
WECHAT_MP_SECRET=xxxxxxxxxxxx
JWT_SECRET=xxxxxxxxxxxx
```

登录时，小程序请求带上一个你自己定义的 appKey：

```js
await api.post("/mp/auth/wx-login", {
	appKey: "shop-demo-001",
	code,
});
```

Nitro 侧接口设计：

```txt
POST /mp/auth/wx-login
POST /mp/auth/refresh
POST /mp/auth/logout
GET  /mp/me
```

登录接口做这些事：

1. 接收 appKey + code
2. 根据 appKey 查 mini_apps
3. 用 appid + appSecret + code 调微信 code2Session
4. 拿到 openid / unionid / session_key
5. 根据 appid + openid 查/创建用户
6. 签发 access_token
7. 生成 refresh_token，并把 hash 存 Neon
8. 返回 token 给小程序

session_key 不能下发给小程序前端。微信登录流程里，session_key 是服务端侧用于校验/解密用户数据的敏感凭证，不应该暴露给客户端。

## nitro 接口在微信小程序和 admin 管理后台内，统一的 token 管理与鉴权设计

问题：（已经回答，我打算用 Better Auth 完成 admin，但是微信小程序仍旧是自己构架的）
除了现成的 jose 包，还有没有合适的方案？

---

Better Auth
适合：你希望有现成用户、session、OAuth、2FA、multi-session、组织/多租户等能力。
推荐度：中高，但要评估它和微信小程序登录的贴合度。

### 系统不要追求“一种 token 统治所有端”

admin 管理后台：

- 浏览器
- 可用 HttpOnly Cookie
- 权限复杂：RBAC / tenant / operator / audit
- 可以有 CSRF、SameSite、设备管理

微信小程序：

- 非传统浏览器
- 更适合 Authorization: Bearer token
- 登录入口是 wx.login -> code2Session
- 身份核心是 openid / appid / mini_app_id

建议统一的是：

统一签发中心：apps/api/src/auth
统一 actor 模型：event.context.actor
统一权限判断：requireActor / requireRole / requireTenant
统一 refresh token 表
统一审计日志

但 token 载体可以不同：

admin：
HttpOnly Cookie session 或 JWT Cookie

微信小程序：
Authorization: Bearer access_token

### Better Auth 的在微信小程序这边的适配

微信小程序这边要注意：
微信小程序登录不是标准 OAuth 浏览器跳转。
它是 wx.login -> code -> 服务端 code2Session -> openid。

需要：

1. admin 登录用 Better Auth 标准能力。
2. 小程序登录仍然自己写 /mp/auth/wx-login。
3. 然后把小程序用户接入 Better Auth 的 session 或你自己的 token 系统。

可以考虑：

admin：Better Auth
mp：自定义 wx-login + 自己签 access token

### 用户 token 的存储

不考虑 redis 或者是其他的 KV 工具来实现存储。

什么时候需要 Redis/KV？

1. 你要求 access_token 立即失效。
2. 你要做单设备登录。
3. 你要高频记录 session last_seen。
4. 你要做在线状态。
5. 你要做 token blocklist。
6. 你要做高并发限流。

### token 模型设计

access_token：
JWT，自包含，有 exp，后端不存本体。

refresh_token：
随机字符串，后端只存 hash 到 Neon。

### 双端通用的 token 处理流程

后续每次请求：

小程序 / admin
-> 带 access_token
-> Nitro 验签 + 检查 exp
-> 解析 actor
-> 执行业务权限判断

只有刷新 token 时访问 Neon：

POST /auth/refresh
-> 校验 refresh_token hash
-> 检查 expires_at / revoked_at
-> rotate refresh token
-> 签发新的 access token

## 获取 cloudbase 相关的 AI/Skill/MCP 等各种资料

问题：
怎么安装全局 cloudbase MCP？并配置必要的用户验证 token？怎么开通必要的腾讯云服务？
cloudbase 一系列配套的 skills 名称是什么？怎么安装成本地项目级别的 skills？

---

1. CloudBase MCP / AI CLI
   用来让 AI IDE 调用腾讯云开发资源、部署小程序、管理环境、查日志、配置域名。

2. CloudBase Skills
   用来给 AI 补充“云开发/小程序/认证/数据库/部署”的知识规则。

安装全局 CloudBase AI CLI

pnpm install @cloudbase/cli@latest -g

全局安装一次
↓
tcb ai
↓
自动配置/引导 MCP
↓
给 Cursor / CodeBuddy / Claude Code / Codex CLI 等工具用

mcp 本地配置写法

```json
{
	"mcpServers": {
		"cloudbase": {
			"command": "npx",
			"args": ["@cloudbase/cloudbase-mcp@latest"]
		}
	}
}
```

### 需要开通哪些腾讯云服务？

必须：

1. 腾讯云账号
2. 实名认证
3. CloudBase / 云开发环境
4. 微信小程序账号
5. 小程序 AppID
6. 小程序与云开发环境关联
7. 腾讯云 API 密钥 SecretId / SecretKey

按需：

8. 静态网站托管
9. 云函数
10. 云托管 CloudRun
11. 云数据库 NoSQL
12. CloudBase MySQL / 关系型数据库
13. 云存储
14. CLS 日志
15. AI 模型 / Agent 相关能力

CloudBase 云函数：非必须
CloudBase 云存储：非必须
CloudBase MySQL：非必须
CloudRun：非必须

让 CloudBase MCP 帮你“创建云微信小程序、上传预览、发布、调试”，你至少要有：

CloudBase 环境
微信小程序 AppID
微信开发者工具 / miniprogram-ci 能力
对应账号权限

### CloudBase Skills 怎么安装？

npx skills add tencentcloudbase/cloudbase-skills

需要安装的最低限度 skill：

cloudbase-guidelines
miniprogram-development
auth-wechat
cloudbase-cli
cloudbase-platform
ai-model-wechat
ui-design
spec-workflow

让 AI 管 CloudBase 资源：

cloudbase-cli
ops-inspector
cloudrun-development
cloud-functions
http-api

### AI 记忆文件对应的 cloudbase 约束文本

本项目中 CloudBase 仅用于：

- 微信小程序云开发环境关联
- 小程序 AI/Skill/MCP 辅助生成
- 小程序预览、上传、发布
- 微信生态相关配置

不要使用 CloudBase 作为：

- 主业务后端
- 主数据库
- 主文件存储
- openid 获取云函数

主后端为 Vercel Nitro。
主数据库为 Neon。
文件服务为 Cloudflare R2。

## cloudbase 怎么和 unibest 这个 uniapp 模板相配合？

cloudbase 怎么和 unibest 这个 uniapp 模板相配合？怎么部署一个 uniapp 项目，并且部署成云微信小程序？
