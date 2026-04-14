# 2026-04-15 Nitro + Neon + Cloudflare R2 大文件分片上传、断点续传设计与面试材料

## 文档定位

这份文档同时服务两件事：

- 作为 `11comm admin` 项目后续实现“大文件分片上传 + 断点续传 + CRUD 闭环”的设计规格
- 作为前端面试时可直接复述的备考材料，重点突出前端能力、可靠性设计和工程抽象能力

当前已经确认的技术路线如下：

- 前端：浏览器直传 `Cloudflare R2 multipart`
- 服务端：`Nitro` 只负责控制面，不搬运大文件
- 数据库：`Neon Postgres` 只存上传任务元数据、分片状态、附件业务记录
- 业务落点：`property-manage/contract-manage/draft-contract` 与 `property-manage/contract-manage/change`

本次不采用的路线：

- 不把大文件二进制直接存到 Neon/Postgres
- 不走“前端切片传 Nitro，再由 Nitro 转存 R2”的中转方案
- 不把 `tus/Uppy` 作为主实现，但会作为扩展视野保留

## 为什么这样选型

### 为什么不用整文件直传

整文件直传在大文件场景下有几个明显问题：

- 网络中断后往往只能整文件重传
- 服务端压力大，业务服务器要承接整条文件流
- 很难实现稳定的暂停、恢复、重试和编辑态附件维护

### 为什么不用 Neon 存文件本体

Neon 官方推荐的模式是“对象存储放文件，Postgres 存元数据和引用”。这也是本次采用的模式。

- Neon 适合结构化数据、状态管理、业务查询
- R2 适合大文件对象、multipart、生命周期和低成本存储
- 这样职责清晰，后续扩展也更容易

参考：

- Neon 文件存储建议：<https://neon.com/docs/guides/file-storage>
- Cloudflare R2 multipart：<https://developers.cloudflare.com/r2/objects/upload-objects/>
- Cloudflare R2 CORS：<https://developers.cloudflare.com/r2/buckets/cors/>
- Cloudflare R2 presigned URL：<https://developers.cloudflare.com/r2/api/s3/presigned-urls/>

## 当前已完成的基础设施收口

这部分已经在 Cloudflare 侧完成：

- R2 bucket：`01s-11comm-files`
- 自定义域：`01s-11comm-files.ruan-cat.com`
- S3 endpoint：`https://3412269ab0def154c8806e38acd1b493.r2.cloudflarestorage.com`

这意味着后续实现时，文件对象的最终访问域名将统一收口到：

```text
https://01s-11comm-files.ruan-cat.com/<object-key>
```

后续仍需要补一项基础配置：

- 为前端上传来源域名配置最终 `CORS` 规则

## 一、业务范围与最小闭环

本次实现不是做一个孤立的“上传 demo”，而是落在已有合同管理业务里，形成完整闭环。

### 业务页面

- `draft-contract`
- `change`

### 两个页面都要具备的闭环

- `list`
- `detail`
- `create`
- `update`
- `delete`

### 上传能力接入点

- `draft-contract`：新增合同草稿和编辑合同草稿时上传附件
- `change`：新增合同变更和编辑合同变更时上传附件

### 设计目标

- 体现前端切片、并发、重试、暂停、恢复能力
- 体现“上传与业务提交解耦”的工程设计能力
- 体现编辑态附件差量更新的完整业务闭环

## 二、总体架构

系统分为两条链路：

### 控制面

由 `Nitro + Neon` 负责：

- 创建上传会话
- 恢复上传会话
- 查询已上传分片
- 为每个分片签发临时上传 URL
- 完成 multipart upload
- 写入正式附件业务记录

### 数据面

由浏览器直传 `R2` 负责：

- 前端按固定 `chunkSize` 切片
- 每个 part 使用 Nitro 下发的临时签名 URL 上传到 R2
- 完成后返回 `ETag`
- 全部分片完成后由 Nitro 触发 multipart complete

### 核心收益

- 大文件流量不经过业务服务器
- 服务端仍掌握上传权限与最终合并控制权
- 前端能完整体现断点续传能力

## 三、数据模型设计

保留现有 `ct_attachments`，新增两张上传控制表。

### 1. `ct_upload_sessions`

作用：表示一次大文件上传会话，对应一个 R2 multipart upload。

建议字段：

- `id`
- `bizType`：`draft_contract` | `change`
- `bizId`：可空，创建表单阶段可能还没有正式业务 ID
- `fileName`
- `mimeType`
- `fileSize`
- `chunkSize`
- `totalParts`
- `resumeFingerprint`
- `r2Bucket`
- `r2ObjectKey`
- `r2UploadId`
- `status`：`initiated` | `uploading` | `paused` | `completed` | `aborted` | `expired`
- `uploadedPartsCount`
- `completedAt`
- `expiresAt`
- `remark`
- 时间戳字段

建议索引：

- `resumeFingerprint`
- `status`
- `bizType`

### 2. `ct_upload_session_parts`

作用：记录每个已上传 part 的结果，用于断点恢复。

建议字段：

- `id`
- `sessionId`
- `partNumber`
- `etag`
- `partSize`
- `uploadedAt`
- 时间戳字段

建议唯一约束：

- `(sessionId, partNumber)`

### 3. 扩展 `ct_attachments`

现有 `ct_attachments` 只够表达传统附件信息，不够承载对象存储元数据。建议增加：

- `changeId`：可空，供变更业务关联使用
- `storageProvider`：固定 `r2`
- `bucketName`
- `objectKey`
- `fileUrl`
- `mimeType`
- `fileHash`：第一版可空
- `uploadSessionId`
- `uploadStatus`：`ready` | `deleted`

### 数据模型上的核心原则

- 上传中的临时状态，放在 `upload_sessions` / `upload_session_parts`
- 最终业务附件，放在 `ct_attachments`
- 不让“传了一半的文件”直接污染业务附件表

## 四、Nitro 接口设计

上传控制接口和业务 CRUD 接口分离。

### 上传控制接口

#### 1. `upload/init.post`

作用：

- 根据文件信息和 `resumeFingerprint` 创建上传会话
- 或者恢复已有未完成会话

输入建议：

- `bizType`
- `fileName`
- `mimeType`
- `fileSize`
- `chunkSize`
- `resumeFingerprint`

输出建议：

- `sessionId`
- `chunkSize`
- `totalParts`
- `objectKey`
- `status`

#### 2. `upload/status.post`

作用：

- 查询某个上传会话下已完成的 part

输入建议：

- `sessionId`

输出建议：

- `uploadedParts: { partNumber, etag }[]`
- `status`

#### 3. `upload/sign-part.post`

作用：

- 为单个 part 生成临时上传 URL

输入建议：

- `sessionId`
- `partNumber`

输出建议：

- `signedUrl`
- `expiresIn`

#### 4. `upload/complete.post`

作用：

- 使用前端回传的 `partNumber + etag` 完成 multipart upload
- 写入 `ct_attachments`

输入建议：

- `sessionId`
- `parts: { partNumber, etag }[]`
- `attachmentName`
- `attachmentType`

输出建议：

- `attachmentId`
- `fileUrl`

#### 5. `upload/abort.post`

作用：

- 主动取消上传，终止 multipart

输入建议：

- `sessionId`

### 业务 CRUD 接口

保持正常业务闭环：

- `draft-contract/list.post`
- `draft-contract/detail.post`
- `draft-contract/create.post`
- `draft-contract/update.post`
- `draft-contract/delete.post`
- `change/list.post`
- `change/detail.post`
- `change/create.post`
- `change/update.post`
- `change/delete.post`

### 业务提交时附件字段

新增和编辑不直接传文件，只传“已经完成上传的结果”。

#### create

- `newUploadSessionIds`
- `attachmentMetas`

#### update

- `retainAttachmentIds`
- `deleteAttachmentIds`
- `newUploadSessionIds`
- `attachmentMetas`

## 五、前端上传状态机

前端的核心能力都集中在上传状态机里。

### 状态定义

- `idle`
- `fingerprinting`
- `initiating`
- `uploading`
- `paused`
- `resuming`
- `completing`
- `completed`
- `failed`
- `aborted`

### 行为流程

1. 用户选择文件
2. 前端生成 `resumeFingerprint`
3. 调 `upload/init`
4. 调 `upload/status`
5. 只上传缺失的 part
6. 每个 part 上传成功后记录 `ETag`
7. 全部分片完成后调 `upload/complete`
8. 完成后再把附件结果纳入业务表单提交

### 断点续传规则

- 本地缓存 `resumeFingerprint -> sessionId`
- 页面刷新后重新对账服务端状态
- 只补传缺失分片
- 已完成分片不重复上传

### 分片策略

第一版建议固定 `chunkSize`，例如 `5MB` 到 `10MB` 量级。

设计考虑：

- chunk 太小，请求数太多
- chunk 太大，失败时重传成本高

### 并发策略

第一版建议分片并发窗口固定为 `3~4`

原因：

- 太高会让浏览器和网络波动更明显
- 太低则上传体验偏慢

### 文件指纹策略

第一版建议先用轻量方案：

```text
sha256(file.name + file.size + file.lastModified + chunkSize)
```

这样可以低成本支持恢复，不需要先完整读取整个大文件。

后续增强方案：

- 抽样 hash
- 全量文件 hash

这部分可以作为面试时的“优化扩展点”。

## 六、页面闭环与交互设计

### `draft-contract`

定位：

- 新增合同草稿
- 编辑合同草稿
- 维护合同草稿附件

建议交互：

- 列表页保留 `新建 / 查看 / 编辑 / 删除`
- 表单内部划分为：
  - 基础信息区
  - 业务字段区
  - 附件上传区

附件区应展示：

- 文件名
- 文件大小
- 分片上传进度
- 当前状态
- `暂停 / 继续 / 重试 / 移除`

提交规则：

- 有 `uploading` 或 `failed` 附件时禁止提交
- 只允许提交已完成上传的附件引用

### `change`

定位：

- 新增合同变更
- 编辑合同变更
- 演示编辑态附件差量更新

建议交互：

- 同样保留 `新建 / 查看 / 编辑 / 删除`
- 编辑态区分三种附件：
  - 保留旧附件
  - 删除旧附件
  - 新增新附件

这是本次设计里非常适合作为面试亮点的部分，因为它能体现：

- 不是简单覆盖附件数组
- 而是对编辑态附件做差量维护

## 七、共享前端上传组件

建议把上传能力抽成一个共享组件，避免散落在两个业务页里。

### 组件职责

- 文件切片
- 会话创建与恢复
- 分片上传调度
- 暂停、继续、重试
- 上传状态展示
- 输出已完成附件结果

### 推荐输入

- `bizType`
- `modelValue`
- `attachmentTypeOptions`

### 推荐输出

- 已完成附件列表
- 上传中状态
- 差量附件结果

### 设计原则

- 上传组件只负责上传控制
- 不直接耦合 `draft-contract` 和 `change` 的业务字段

这样后续如果别的业务页也需要大文件上传，可以继续复用。

## 八、可靠性设计

### 1. 分片级重试

- 单个 part 失败时单独重试
- 第一版建议最大重试次数 `3`
- 超过后标记该文件 `failed`

### 2. 会话级恢复

- 刷新页面后通过 `resumeFingerprint` 找回 `sessionId`
- 再向服务端查询已上传 part

### 3. 接口级幂等

#### `upload/init`

- 对相同 `resumeFingerprint + bizType + fileSize` 优先复用未完成旧会话

#### `upload/complete`

- 已完成会话再次提交时直接返回已有结果

### 4. 编辑态幂等

- 以后端收到的 `retainAttachmentIds / deleteAttachmentIds / newUploadSessionIds` 为准
- 避免整份附件数组覆盖带来的误删

### 5. R2 残留清理

- 支持手动 `abort`
- 配置 bucket 生命周期规则，清理超时未完成 multipart

## 九、安全边界设计

虽然本次采用 `公共桶 + 自定义域` 方案方便演示，但上传权限不能直接暴露给浏览器。

### 正确做法

- 浏览器不持有长期 `Access Key / Secret`
- 前端上传每个 part 前，先从 Nitro 获取临时签名 URL
- 临时签名 URL 绑定：
  - 指定 bucket
  - 指定 object key
  - 指定 uploadId
  - 指定 partNumber
  - 短时间过期

### 这样做的好处

- 浏览器可以直传 R2
- 但长期权限仍掌握在服务端
- 可以限制上传行为只发生在受控对象键空间内

## 十、CORS 设计

最终 CORS 需要只放开必要来源。

### AllowedOrigins

- 本地开发地址
- 生产后台地址

### AllowedMethods

- `PUT`
- `GET`
- `HEAD`

### AllowedHeaders

- 必要请求头

### ExposeHeaders

- `ETag`

设计原则：

- 不做过度放开
- 只开放浏览器上传所需最小集合

## 十一、面试时的主线回答

下面这段可以直接作为面试时的高密度回答模版：

> 我会把大文件上传拆成控制面和数据面。控制面由 Nitro 和 Neon 负责，保存上传会话、分片状态、附件元数据；数据面由浏览器直传 Cloudflare R2。前端先按固定 chunkSize 切片，基于文件指纹创建或恢复 upload session，再查询已上传分片，只补传缺失 part。每个分片通过 Nitro 下发的临时签名 URL 上传到 R2，成功后记录 ETag，全部完成后由服务端执行 multipart complete，并落正式附件记录。这样能同时支持分片上传、断点续传、单片失败重试、页面刷新恢复、编辑态附件差量更新，而且不会把大文件流量压到业务服务器上。

### 可以继续展开的追问点

- 为什么不用整文件直传
- 为什么不把文件存数据库
- 为什么前端直传 R2，而不是服务端中转
- 为什么上传和业务提交要解耦
- 如何保证编辑时附件不会误删
- 如何做幂等、重试、恢复

## 十二、扩展视野：tus / Uppy

这次不作为主实现，但可以作为面试时主动补充的“行业视野”。

### `Uppy`

优点：

- UI 和上传插件生态成熟
- 适合快速做工业化上传体验

缺点：

- 如果面试官继续问底层实现，仍然需要自己解释上传原理

### `tus`

优点：

- 专门面向断点续传的开放协议
- 协议标准化程度高

缺点：

- 需要额外引入 tus 服务端与协议心智
- 对这次 “Nitro + R2 + 轻后端” 目标来说偏重

### 面试表达建议

可以补一句：

> 如果项目后续想进一步标准化上传协议、接入更成熟生态，也可以评估 tus 或 Uppy；但这次为了突出前端对分片、续传、幂等和对象存储直传的理解，我选择自己实现核心链路。

## 十三、后续实施范围

后续真正进入实现时，至少包含这些内容：

- 扩展 `contract-manage` 的 schema
- 新增上传控制表与迁移
- 新增 Nitro 上传控制接口
- 补齐 `draft-contract` CRUD 接口
- 补齐 `change` CRUD 接口
- 补齐前端 API hooks 与 vue-query 封装
- 抽出共享断点续传组件
- 为 R2 配置最终 CORS
- 将 `.superpowers/` 加入 `.gitignore`

## 十四、最终推荐结论

本次最值得落地的实现主线是：

- 真实业务场景放在 `A：合同草稿 / 合同变更附件`
- 前端直传 `Cloudflare R2 multipart`
- `Nitro` 负责签名、状态、complete、abort
- `Neon` 负责上传任务、分片状态、附件元数据、业务 CRUD
- 两个页面都补成完整 `list/detail/create/update/delete`

这条路线同时满足：

- 项目落地价值
- 面试表达价值
- 前端能力体现
- 后端实现足够轻
