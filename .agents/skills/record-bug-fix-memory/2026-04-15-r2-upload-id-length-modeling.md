# 2026-04-15 ct_upload_sessions.r2_upload_id 长度建模错误事故

## 1. 问题现象

`upload/init` 走到创建 multipart upload 后，数据库写入上传会话失败，表现为字段长度超限或后续链路异常。

## 2. 实际根因

Cloudflare R2 返回的 multipart `UploadId` 实测长度可以明显超过 255；把 `ct_upload_sessions.r2_upload_id` 建成 `varchar(255)` 是错误建模。

## 3. 关键误导点

一开始容易怀疑是脏数据或某次异常返回，但真实联调时拿到的 `UploadId` 长度达到 300+，说明问题在 schema 上限本身。

## 4. 有效修复

把 `r2_upload_id` 从 `varchar(255)` 改为 `text`，并生成对应迁移。

## 5. 验证方式

`upload/init` 成功创建上传会话并落库，后续 `status/sign-part/complete` 能基于同一 `uploadId` 继续执行。

## 6. 后续约束

面对第三方云厂商返回的 opaque token、upload id、cursor 之类字段时，优先用 `text` 建模，不要先拍脑袋给一个 255 长度上限。
