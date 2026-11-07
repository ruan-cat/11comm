# 2026-04-15 合同上传链路的浏览器直传 R2 联调事故

## 1. 问题现象

`draft-contract` 和 `change` 页面里的分段上传在浏览器中会停在失败态，前端能拿到 `init/status/sign-part` 响应，但文件始终无法真正上传完成。

## 2. 实际根因

断点续传链路有两个前置条件必须同时成立。第一，Neon 目标库必须已经存在 `ct_upload_sessions` / `ct_upload_parts` 等表，否则 `upload/init` 会因为 relation 不存在而失败。第二，Cloudflare R2 bucket 必须允许本地开发源站的 CORS 预检，否则浏览器对 presigned URL 的 `OPTIONS` / `PUT` 会被拦截。

## 3. 关键误导点

页面 toast 和本地状态不足以证明上传链路可用。真正可信的信号是浏览器 Network 面板里的真实请求顺序：`upload/init -> upload/status -> upload/sign-part -> OPTIONS presigned-url -> PUT presigned-url`。

## 4. 有效修复

先执行数据库迁移，确保上传会话表已经存在；再为 R2 bucket 配置允许 `http://localhost:8080` 的跨域规则，至少覆盖 `PUT`、`GET`、`HEAD`，并保证预检请求可通过。

## 5. 验证方式

浏览器里能连续看到 `init/status/sign-part/complete` 成功；R2 presigned URL 的 `OPTIONS` 不再返回 403；文件在页面内可新增、回显、删除，且对象真实落到 bucket 对应业务目录。

## 6. 后续约束

以后遇到"前端看起来像上传坏了"的问题，先用浏览器网络请求拆开控制面和数据面，不要先改页面组件。断点续传是否可用，必须以浏览器真实 `OPTIONS/PUT` 和服务端真实 `complete` 为准。
