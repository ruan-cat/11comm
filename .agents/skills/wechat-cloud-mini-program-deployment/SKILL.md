---
name: wechat-cloud-mini-program-deployment
description: 项目级微信云小程序部署指南。用于处理微信小程序、CloudBase、miniprogram-ci、预览、上传、合法域名和云开发环境关联相关任务。
---

# 微信云小程序部署

本 skill 面向未来代理，用于在 `01s-11comm` 项目内处理微信小程序与微信云开发相关部署、诊断和验收工作。执行时必须先确认当前任务边界，避免把微信云开发、微信登录、Nitro API、H5/Vercel 发布链路混为一谈。

## 触发时机

当用户提到以下任一事项时，使用本 skill：

- 微信小程序、微信云小程序、微信开发者工具、小程序预览或小程序上传。
- CloudBase、微信云开发、云开发环境 ID、云开发环境关联。
- `miniprogram-ci`、CI 预览二维码、CI 上传版本。
- 小程序合法域名、request/download/upload/socket 域名配置排查。
- 小程序构建产物路径、`WECHAT_MP_PROJECT_PATH`、`manifest.config.ts` 中的小程序配置。
- 小程序上传后发布流程、体验版、审核、正式发布边界说明。

## 必读文件

开始修改或执行命令前，先读取与当前任务相关的事实来源：

- OpenSpec change：读取当前用户指定或当前任务对应的 OpenSpec change，尤其是 `proposal.md`、`design.md`、`tasks.md` 和相关 delta spec。
- 官方 CloudBase skill：如任务涉及 CloudBase 环境查询、MCP、CLI、云开发控制台、云函数、云存储、云数据库或微信云开发概念，读取 `.agents/skills/cloudbase/SKILL.md`；如果在 Claude Code 环境中，则读取 `.claude/skills/cloudbase/SKILL.md`。
- `apps/app/package.json`：确认 app 子项目脚本、`homepage` 和包名。
- `.mcp.json`：确认当前项目暴露的 MCP 服务与 CloudBase MCP 配置。
- `apps/app/manifest.config.ts`：确认小程序 AppID、云开发、H5、小程序平台差异和 manifest 配置来源。

如果用户只要求写文档或做小范围说明，不要扩展到大范围代码侦察；只读取必要上下文。

## CloudBase 官方 Skill 管理

本项目已项目级安装官方 `tencentcloudbase/cloudbase-skills` 的 `cloudbase` skill，用于提供 CloudBase MCP、CLI、控制台、云函数、云托管、云存储、数据库和微信云开发操作知识。它是上游操作手册，不是本项目架构决策来源。

管理规则：

1. 本 skill 是项目边界入口，优先级高于官方 `cloudbase` skill。
2. 官方 `cloudbase` skill 只在 CloudBase 相关操作中按需读取；不要因为它覆盖 CloudBase Auth、NoSQL、云函数或云存储，就把这些能力引入本项目主链路。
3. 本项目 A 方案固定为：微信登录、`code2Session`、token、refresh、logout、me、Bearer scoped auth、actor/role/tenant 和受保护 API 全部由 `apps/api` Nitro 承担。
4. 官方 `cloudbase` skill 可用于查询环境、理解 MCP 工具、排查 CloudBase 控制台/CLI、辅助预览上传和记录运维证据。
5. 如果官方 `cloudbase` skill 与本 skill、OpenSpec 或 `CLAUDE.md`/`AGENTS.md` 冲突，以本项目文件为准，并在报告中记录冲突点。
6. 官方 `cloudbase` skill 只同步到实际使用的 agent 入口；`.qoder/skills/cloudbase` 和 `.trae/skills/cloudbase` 不应存在，若后续同步工具误生成，必须立即删除。

更新官方 skill 时使用项目级命令，不使用全局安装：

```bash
skills add tencentcloudbase/cloudbase-skills --skill cloudbase -a codex -a claude-code -a cursor -a antigravity -y --copy
```

## 推荐命令

优先使用项目内脚本和本地依赖，禁止全局安装工具。

```bash
pnpm -F @01s-11comm/app build:mp:prod
pnpm -F @01s-11comm/app mp:doctor
pnpm -F @01s-11comm/app mp:preview
pnpm -F @01s-11comm/app mp:upload
```

CloudBase 相关能力优先通过现有 CLI、MCP 或本地依赖查看帮助，不要擅自全局安装：

```bash
pnpm exec cloudbase --help
pnpm exec cloudbase-mcp --help
```

如果项目没有本地可用的 CloudBase CLI 或 MCP 命令，应如实说明当前环境缺少可执行入口，并建议按项目依赖或 MCP 配置补齐，而不是使用 `npm install -g` 或 `pnpm add -g`。

## 环境变量

小程序 CI 与 CloudBase 相关任务通常涉及以下环境变量：

- `WECHAT_MP_APPID`：微信小程序 AppID。
- `WECHAT_MP_PRIVATE_KEY_PATH`：微信小程序 CI 私钥文件路径，必须指向仓库外的文件。
- `WECHAT_MP_CI_ROBOT`：微信小程序 CI 机器人编号。
- `WECHAT_MP_UPLOAD_VERSION`：上传版本号。
- `WECHAT_MP_UPLOAD_DESC`：上传描述。
- `WECHAT_MP_PROJECT_PATH`：小程序构建产物或项目路径。
- `WECHAT_MP_QRCODE_OUTPUT`：预览二维码输出路径。
- `CLOUDBASE_ENV_ID`：CloudBase 云开发环境 ID。
- `TENCENTCLOUD_SECRETID`：腾讯云 SecretId。
- `TENCENTCLOUD_SECRETKEY`：腾讯云 SecretKey。
- `TENCENTCLOUD_SESSIONTOKEN`：腾讯云临时会话 Token。

严禁提交真实密钥、私钥、Token、二维码敏感产物或包含真实凭据的 `.env` 文件。文档和示例只能使用占位符。

## 红线

- 禁止使用 `npm install -g`、`pnpm add -g` 或其他全局安装方式。
- CloudBase 不承载微信登录 `code2Session`、token 签发或 Nitro auth 职责。
- CloudBase 不作为本项目主 API、主数据库或主对象存储方案；主 API、DB、storage 边界仍按项目既有架构执行。
- 禁止新增 `vercel.json` 来绕过或污染现有 Vercel monorepo 部署策略。
- 禁止破坏 H5/Vercel 构建链；小程序构建、预览、上传调整不得影响 `apps/app` 的 H5 产物和 Vercel 发布。
- `mp:upload` 或 `miniprogram-ci upload` 不等于微信正式发布；上传后仍需要在微信公众平台进行体验、审核和发布流程。
- 不要把小程序合法域名配置写死到代码里；应确认微信公众平台配置、项目环境变量和运行时请求地址一致。
- 不要把 CloudBase 环境 ID、腾讯云密钥或微信 CI 私钥提交到仓库。

## 操作流程

1. 先读必读文件，确认当前 OpenSpec change、app 脚本、MCP 配置和 manifest 配置。
2. 明确任务类型：构建、doctor、预览、上传、CloudBase 诊断、合法域名排查或文档更新。
3. 检查环境变量是否齐全，只报告变量名和缺失项，不输出真实值。
4. 优先运行 `mp:doctor` 或对应 help/version 命令建立证据，再执行预览或上传。
5. 上传前确认 `WECHAT_MP_UPLOAD_VERSION` 与 `WECHAT_MP_UPLOAD_DESC`，并提醒上传不等于正式发布。
6. 涉及 CloudBase 时，先用 CLI/MCP help 确认可用能力；不要把 CloudBase 扩展成主 API/DB/storage。
7. 完成后用验收清单闭环，避免只凭配置存在就声称完成。

## 验收清单

根据任务范围选择必要检查。交付时只声明已被证据覆盖的事项：

- `pnpm -F @01s-11comm/app mp:doctor`
- `miniprogram-ci` help 或 version 检查，优先通过项目脚本或本地依赖间接确认。
- `pnpm exec cloudbase --help`
- `pnpm exec cloudbase-mcp --help`
- `openspec validate {change-id} --strict`
- 敏感信息扫描：确认没有提交真实 AppID 私钥、腾讯云密钥、Token、`.env` 凭据或二维码敏感产物。
- `vercel.json` 扫描：确认没有新增或污染 `vercel.json`。
- `git diff --check`

如果用户明确要求不要运行大范围验证，只做文档或小范围改动，应遵守范围，并在最终反馈中说明未运行的验证项。
