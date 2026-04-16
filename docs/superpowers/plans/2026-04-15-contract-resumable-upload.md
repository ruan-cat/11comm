# Contract Resumable Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `property-manage/contract-manage/draft-contract` 与 `property-manage/contract-manage/change` 两个既有业务路径中落地 Cloudflare R2 multipart 分片上传、断点续传和完整 CRUD 闭环，并保留可复述的面试材料。

**Architecture:** 文件数据面由浏览器使用 R2 multipart 直传，自定义域名统一走 `https://01s-11comm-files.ruan-cat.com/<object-key>`；控制面由 Nitro 负责上传会话、分片签名、完成合并和中止上传；结构化状态由 Neon Postgres 保存到上传会话表、分片表和正式附件表。前端抽一个共享上传组件和上传状态机，`draft-contract` 与 `change` 两页共用，但 `change` 额外支持旧附件保留/删除/新增的差量维护。

**Tech Stack:** Vue 3, TanStack Query, Nitro v3, H3, Drizzle ORM, Zod, Neon Postgres, Cloudflare R2, AWS SDK v3, Vitest, localforage

---

## Locked File Responsibilities

### 类型与 Schema

- `apps/type/src/business/property-manage/contract-manage/schema.ts`
  - 扩展 `ct_attachments`
  - 新增 `ct_upload_sessions`
  - 新增 `ct_upload_session_parts`
  - 导出对应 Trinity Pattern 的 Zod schema 和类型
- `apps/type/src/business/property-manage/contract-manage/upload.ts`
  - 上传控制面的纯业务类型
  - 共享给 Nitro 和前端 API hooks 使用
- `apps/type/src/business/property-manage/contract-manage/draft-contract.ts`
  - 补齐 `detail/create/update/delete` 需要的 VO / payload 类型
  - 去掉 `attachments?: any[]`
- `apps/type/src/business/property-manage/contract-manage/change.ts`
  - 补齐 `detail/create/update/delete` 需要的 VO / payload 类型
  - 定义编辑态附件差量提交结构
- `apps/type/src/business/property-manage/contract-manage/attachment.ts`
  - 补充与 R2 对象信息一致的附件列表/详情类型
- `apps/type/src/business/property-manage/contract-manage/index.ts`
  - 统一导出 `upload.ts` 和更新后的业务类型

### 服务端控制面

- `apps/admin/server/utils/r2-env.ts`
  - 统一读取 `R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_PUBLIC_BASE_URL`
- `apps/admin/server/utils/r2-client.ts`
  - 统一创建 S3Client
  - 统一封装 multipart 相关 command
- `apps/admin/server/utils/contract-manage-upload.ts`
  - 上传会话查询、恢复、签名、完成、取消
  - 构建 object key
  - 映射 `ct_upload_sessions` 与 `ct_upload_session_parts`
- `apps/admin/server/api/property-manage/contract-manage/upload/init.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/upload/status.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/upload/sign-part.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/upload/complete.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/upload/abort.post.ts`
  - 上传控制面 API

### 服务端业务 CRUD

- `apps/admin/server/api/property-manage/contract-manage/draft-contract/detail.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/draft-contract/create.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/draft-contract/update.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/draft-contract/delete.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/draft-contract/list.post.ts`
  - 草稿合同 CRUD + 附件物化
- `apps/admin/server/api/property-manage/contract-manage/change/detail.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/change/create.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/change/update.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/change/delete.post.ts`
- `apps/admin/server/api/property-manage/contract-manage/change/list.post.ts`
  - 合同变更 CRUD + 编辑态附件差量处理

### 前端 API 与共享上传组件

- `apps/admin/src/api/property-manage/contract-manage/upload/index.ts`
  - 上传控制面 API 调用和 mutation helper
- `apps/admin/src/api/property-manage/contract-manage/draft-contract/index.ts`
  - 补齐 detail/create/update/delete hooks
- `apps/admin/src/api/property-manage/contract-manage/change/index.ts`
  - 补齐 detail/create/update/delete hooks
- `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/types.ts`
- `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/upload-cache.ts`
- `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/use-resumable-upload.ts`
- `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/index.vue`
  - 共用上传状态机、localforage 缓存、队列 UI

### 页面集成

- `apps/admin/src/pages/property-manage/contract-manage/draft-contract/index.vue`
- `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/form.ts`
- `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/form.vue`
- `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/detail.vue`
  - 草稿合同完整 CRUD 与上传接入
- `apps/admin/src/pages/property-manage/contract-manage/change/index.vue`
- `apps/admin/src/pages/property-manage/contract-manage/change/components/form.ts`
- `apps/admin/src/pages/property-manage/contract-manage/change/components/form.vue`
- `apps/admin/src/pages/property-manage/contract-manage/change/components/detail.vue`
  - 合同变更完整 CRUD 与差量附件接入

### 测试与基础设施

- `apps/admin/server/utils/r2-env.test.ts`
- `apps/admin/server/utils/contract-manage-upload.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/upload/init.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/upload/status.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/upload/complete.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/upload/abort.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/detail.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/create.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/update.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/delete.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/change/detail.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/change/create.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/change/update.test.ts`
- `apps/admin/tests/nitro/property-manage/contract-manage/change/delete.test.ts`
- `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/tests/use-resumable-upload.test.ts`
- `apps/admin/scripts/r2-contract-upload-cors.json`
- `.gitignore`
- `.claude/skills/neon-db-query/SKILL.md`

## Task 1: 建立 R2 运行时契约与依赖

**Files:**

- Create: `apps/admin/server/utils/r2-env.ts`
- Create: `apps/admin/server/utils/r2-env.test.ts`
- Create: `apps/admin/server/utils/r2-client.ts`
- Modify: `apps/admin/package.json`

- [ ] **Step 1: 先写 `r2-env` 的失败用例，锁定环境变量契约**

```ts
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("getR2EnvRequired", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	test("missing key throws readable error", async () => {
		const { getR2EnvRequired } = await import("./r2-env");
		expect(() => getR2EnvRequired("R2_BUCKET")).toThrow(/R2_BUCKET/);
	});

	test("reads explicitly configured runtime env", async () => {
		vi.stubEnv("R2_BUCKET", "01s-11comm-files");
		const { getR2EnvRequired } = await import("./r2-env");
		expect(getR2EnvRequired("R2_BUCKET")).toBe("01s-11comm-files");
	});
});
```

- [ ] **Step 2: 运行失败用例，确认仓库里还没有这层 helper**

Run: `pnpm -F @01s-11comm/admin exec vitest run server/utils/r2-env.test.ts`

Expected:

- FAIL，报错包含 `Cannot find module './r2-env'`

- [ ] **Step 3: 安装 AWS SDK v3，并实现 `r2-env.ts` / `r2-client.ts`**

Run: `pnpm -F @01s-11comm/admin add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`

Add `apps/admin/server/utils/r2-env.ts`:

```ts
export const R2_ENV_KEYS = [
	"R2_ENDPOINT",
	"R2_BUCKET",
	"R2_ACCESS_KEY_ID",
	"R2_SECRET_ACCESS_KEY",
	"R2_PUBLIC_BASE_URL",
] as const;

export type R2EnvKey = (typeof R2_ENV_KEYS)[number];

export function getR2EnvRequired(key: R2EnvKey): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(
			`Missing required R2 environment variable: ${key}. Configure it in Vercel Project Settings or local env files.`,
		);
	}
	return value;
}
```

Add `apps/admin/server/utils/r2-client.ts`:

```ts
import { S3Client } from "@aws-sdk/client-s3";
import { getR2EnvRequired } from "./r2-env";

export function createR2Client() {
	return new S3Client({
		region: "auto",
		endpoint: getR2EnvRequired("R2_ENDPOINT"),
		credentials: {
			accessKeyId: getR2EnvRequired("R2_ACCESS_KEY_ID"),
			secretAccessKey: getR2EnvRequired("R2_SECRET_ACCESS_KEY"),
		},
		forcePathStyle: true,
	});
}
```

- [ ] **Step 4: 重新运行测试，确认环境 helper 可用**

Run: `pnpm -F @01s-11comm/admin exec vitest run server/utils/r2-env.test.ts`

Expected:

- PASS，输出 `2 passed`

- [ ] **Step 5: 提交这一层基础设施**

```bash
git add apps/admin/package.json pnpm-lock.yaml apps/admin/server/utils/r2-env.ts apps/admin/server/utils/r2-env.test.ts apps/admin/server/utils/r2-client.ts
git commit -m "feat(admin): add R2 runtime helpers"
```

## Task 2: 扩展 contract-manage 类型与数据库 Schema

**Files:**

- Create: `apps/type/src/business/property-manage/contract-manage/upload.ts`
- Modify: `apps/type/src/business/property-manage/contract-manage/schema.ts`
- Modify: `apps/type/src/business/property-manage/contract-manage/draft-contract.ts`
- Modify: `apps/type/src/business/property-manage/contract-manage/change.ts`
- Modify: `apps/type/src/business/property-manage/contract-manage/attachment.ts`
- Modify: `apps/type/src/business/property-manage/contract-manage/index.ts`
- Modify: `.claude/skills/neon-db-query/SKILL.md`
- Create: `apps/admin/drizzle/2026_04_15_contract_manage_resumable_upload.sql`

- [ ] **Step 1: 新建上传控制面业务类型，替换掉 `attachments?: any[]` 的空洞定义**

Add `apps/type/src/business/property-manage/contract-manage/upload.ts`:

```ts
import { z } from "zod";

export type UploadBizType = "draft_contract" | "change";
export type UploadSessionStatus = "initiated" | "uploading" | "paused" | "completed" | "aborted" | "expired";

export interface UploadPartState {
	partNumber: number;
	etag: string;
	partSize: number;
}

export interface CompletedAttachmentAsset {
	uploadSessionId: string;
	attachmentName: string;
	attachmentType: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
	fileUrl: string;
	objectKey: string;
}

export const createUploadInitSchema = z.object({
	bizType: z.enum(["draft_contract", "change"]),
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
	fileSize: z.number().int().positive(),
	chunkSize: z.number().int().positive(),
	resumeFingerprint: z.string().min(1),
});

export const createUploadCompleteSchema = z.object({
	sessionId: z.string().uuid(),
	parts: z.array(
		z.object({
			partNumber: z.number().int().positive(),
			etag: z.string().min(1),
		}),
	),
});
```

Update `draft-contract.ts` / `change.ts` form VO:

```ts
import { z } from "zod";
import type { CompletedAttachmentAsset } from "./upload";

attachments: CompletedAttachmentAsset[];

export const createDraftContractSchema = z.object({
	contract: z.object({
		contractName: z.string().min(1),
		contractNumber: z.string().min(1),
		contractType: z.string().min(1),
	}),
	newUploadSessionIds: z.array(z.string().uuid()).default([]),
	attachmentMetas: z.array(
		z.object({
			uploadSessionId: z.string().uuid(),
			attachmentName: z.string().min(1),
			attachmentType: z.string().min(1),
		}),
	),
});

export const updateDraftContractSchema = createDraftContractSchema.extend({
	id: z.string().uuid(),
	retainAttachmentIds: z.array(z.string().uuid()).default([]),
	deleteAttachmentIds: z.array(z.string().uuid()).default([]),
});
```

- [ ] **Step 2: 在 `schema.ts` 中加入上传会话表、分片表和扩展后的附件字段**

Insert into `apps/type/src/business/property-manage/contract-manage/schema.ts`:

```ts
export const ctUploadSessions = pgTable("ct_upload_sessions", {
	id: primaryId(),
	bizType: varchar("biz_type", { length: 50 }).notNull(),
	bizId: uuid("biz_id"),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }),
	fileSize: integer("file_size").notNull(),
	chunkSize: integer("chunk_size").notNull(),
	totalParts: integer("total_parts").notNull(),
	resumeFingerprint: varchar("resume_fingerprint", { length: 128 }).notNull(),
	r2Bucket: varchar("r2_bucket", { length: 100 }).notNull(),
	r2ObjectKey: text("r2_object_key").notNull(),
	r2UploadId: text("r2_upload_id").notNull(),
	status: varchar("status", { length: 30 }).notNull().default("initiated"),
	uploadedPartsCount: integer("uploaded_parts_count").notNull().default(0),
	objectEtag: varchar("object_etag", { length: 255 }),
	publicUrl: text("public_url"),
	completedAt: timestamp("completed_at"),
	expiresAt: timestamp("expires_at"),
	remark: remarkField(),
	...timestamps,
});

export const ctUploadSessionParts = pgTable("ct_upload_session_parts", {
	id: primaryId(),
	sessionId: uuid("session_id")
		.references(() => ctUploadSessions.id, { onDelete: "cascade" })
		.notNull(),
	partNumber: integer("part_number").notNull(),
	etag: varchar("etag", { length: 255 }).notNull(),
	partSize: integer("part_size").notNull(),
	uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
	...timestamps,
});
```

Extend `ctAttachments`:

```ts
changeId: uuid("change_id").references(() => ctChanges.id),
storageProvider: varchar("storage_provider", { length: 30 }).notNull().default("r2"),
bucketName: varchar("bucket_name", { length: 100 }),
objectKey: text("object_key"),
fileUrl: text("file_url"),
mimeType: varchar("mime_type", { length: 100 }),
fileHash: varchar("file_hash", { length: 128 }),
uploadSessionId: uuid("upload_session_id").references(() => ctUploadSessions.id),
uploadStatus: varchar("upload_status", { length: 30 }).notNull().default("ready"),
```

- [ ] **Step 3: 生成固定文件名迁移，并把上传表加入数据库表清单**

Run:

```bash
cd apps/admin
pnpm exec drizzle-kit generate --config drizzle.config.ts --name 2026_04_15_contract_manage_resumable_upload --prefix none
cd ../..
```

Expected:

- 生成 `apps/admin/drizzle/2026_04_15_contract_manage_resumable_upload.sql`
- `apps/admin/drizzle/meta/*` 同步更新

Update `.claude/skills/neon-db-query/SKILL.md` with:

```md
- `ct_upload_sessions`：合同上传会话表，存储 R2 multipart 会话、指纹、对象键、完成状态
- `ct_upload_session_parts`：合同上传分片表，存储每个已上传 part 的 etag 与 part size
```

- [ ] **Step 4: 跑类型检查，确认类型项目和 admin 都能消费新导出**

Run:

```bash
pnpm -F @01s-11comm/type typecheck
pnpm -F @01s-11comm/admin typecheck
```

Expected:

- 两条命令都 PASS

- [ ] **Step 5: 提交类型层和迁移层**

```bash
git add apps/type/src/business/property-manage/contract-manage/upload.ts apps/type/src/business/property-manage/contract-manage/schema.ts apps/type/src/business/property-manage/contract-manage/draft-contract.ts apps/type/src/business/property-manage/contract-manage/change.ts apps/type/src/business/property-manage/contract-manage/attachment.ts apps/type/src/business/property-manage/contract-manage/index.ts apps/admin/drizzle/2026_04_15_contract_manage_resumable_upload.sql apps/admin/drizzle/meta .claude/skills/neon-db-query/SKILL.md
git commit -m "feat(type): add contract upload session schema"
```

## Task 3: 实现 R2 上传控制面 Nitro API

**Files:**

- Create: `apps/admin/server/utils/contract-manage-upload.ts`
- Create: `apps/admin/server/utils/contract-manage-upload.test.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/upload/init.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/upload/status.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/upload/sign-part.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/upload/complete.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/upload/abort.post.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/upload/init.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/upload/status.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/upload/complete.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/upload/abort.test.ts`

- [ ] **Step 1: 先写控制面测试，固定接口行为**

Add `apps/admin/tests/nitro/property-manage/contract-manage/upload/init.test.ts`:

```ts
import { beforeAll, describe, expect, test } from "vitest";
import { checkNitroServer, fetchNitroApi } from "setup-neon";

describe("upload/init", () => {
	beforeAll(async () => {
		expect(await checkNitroServer()).toBe(true);
	});

	test("creates or restores multipart session", async () => {
		const response = await fetchNitroApi("/api/property-manage/contract-manage/upload/init", {
			method: "POST",
			body: JSON.stringify({
				bizType: "draft_contract",
				fileName: "contract.pdf",
				mimeType: "application/pdf",
				fileSize: 12 * 1024 * 1024,
				chunkSize: 5 * 1024 * 1024,
				resumeFingerprint: "fingerprint-demo",
			}),
		});

		expect(response.ok).toBe(true);
	});
});
```

Add `apps/admin/server/utils/contract-manage-upload.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { buildContractUploadObjectKey } from "./contract-manage-upload";

describe("buildContractUploadObjectKey", () => {
	test("keeps biz partition and original extension", () => {
		const key = buildContractUploadObjectKey("draft_contract", "session-1", "contract.pdf");
		expect(key).toMatch(/^contract-manage\/draft_contract\/session-1\/.+\.pdf$/);
	});
});
```

- [ ] **Step 2: 运行测试，确认当前接口目录为空且 helper 未实现**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run server/utils/contract-manage-upload.test.ts
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/upload/init.test.ts
```

Expected:

- 第一条 FAIL，报 `Cannot find module './contract-manage-upload'`
- 第二条 FAIL，报 404 或接口不存在

- [ ] **Step 3: 实现上传 service 和 5 个 Nitro 端点**

Add `apps/admin/server/utils/contract-manage-upload.ts`:

```ts
import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	ListPartsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ctUploadSessionParts, ctUploadSessions } from "@01s-11comm/type";
import { createR2Client } from "./r2-client";
import { getR2EnvRequired } from "./r2-env";

export function buildContractUploadObjectKey(bizType: string, sessionId: string, fileName: string) {
	const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
	return `contract-manage/${bizType}/${sessionId}/${Date.now()}${ext}`;
}

export async function materializeDraftContractAttachments(
	db: any,
	contractId: string,
	sessionIds: string[],
	metas: any[],
) {}
export async function syncDraftContractAttachments(db: any, payload: any) {}
export async function materializeChangeAttachments(db: any, changeId: string, sessionIds: string[], metas: any[]) {}
export async function syncChangeAttachments(db: any, payload: any) {}
```

Add `apps/admin/server/api/property-manage/contract-manage/upload/init.post.ts`:

```ts
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { createUploadInitSchema, type JsonVO } from "@01s-11comm/type";
import { initContractUploadSession } from "server/utils/contract-manage-upload";

export default defineHandler(async (event) => {
	const db = useDb(event);
	const body = await readValidatedBody(event, createUploadInitSchema.parse);
	const data = await initContractUploadSession(db, body);
	const response: JsonVO<typeof data> = { success: true, code: 200, message: "初始化成功", data };
	return response;
});
```

Use the same response envelope for:

- `status.post.ts`
- `sign-part.post.ts`
- `complete.post.ts`
- `abort.post.ts`

Critical rule in `complete.post.ts`:

```ts
await db.update(ctUploadSessions).set({
	status: "completed",
	objectEtag: completed.ETag ?? null,
	publicUrl,
	completedAt: new Date(),
});
```

- [ ] **Step 4: 跑控制面测试并补一个手工 smoke**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run server/utils/contract-manage-upload.test.ts
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/upload/init.test.ts tests/nitro/property-manage/contract-manage/upload/status.test.ts tests/nitro/property-manage/contract-manage/upload/complete.test.ts tests/nitro/property-manage/contract-manage/upload/abort.test.ts
```

Expected:

- helper unit tests PASS
- upload Nitro tests PASS

- [ ] **Step 5: 提交上传控制面**

```bash
git add apps/admin/server/utils/contract-manage-upload.ts apps/admin/server/utils/contract-manage-upload.test.ts apps/admin/server/api/property-manage/contract-manage/upload apps/admin/tests/nitro/property-manage/contract-manage/upload
git commit -m "feat(admin): add contract upload control plane"
```

## Task 4: 补齐 `draft-contract` 服务端 CRUD 与附件物化

**Files:**

- Modify: `apps/admin/server/api/property-manage/contract-manage/draft-contract/list.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/draft-contract/detail.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/draft-contract/create.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/draft-contract/update.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/draft-contract/delete.post.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/detail.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/create.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/update.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/delete.test.ts`

- [ ] **Step 1: 先写 CRUD 测试，锁定草稿合同接口路径**

Add `apps/admin/tests/nitro/property-manage/contract-manage/draft-contract/create.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { fetchNitroApi } from "setup-neon";

describe("draft-contract/create", () => {
	test("creates contract and materializes uploaded attachments", async () => {
		const response = await fetchNitroApi("/api/property-manage/contract-manage/draft-contract/create", {
			method: "POST",
			body: JSON.stringify({
				contractName: "服务合同草稿 A",
				contractNumber: "DC-2026-001",
				contractType: "service",
				partyA: "甲方公司",
				partyB: "乙方公司",
				newUploadSessionIds: ["00000000-0000-0000-0000-000000000001"],
			}),
		});

		expect(response.ok).toBe(true);
	});
});
```

- [ ] **Step 2: 跑失败测试，确认 CRUD 还没有实现**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/draft-contract/create.test.ts tests/nitro/property-manage/contract-manage/draft-contract/detail.test.ts tests/nitro/property-manage/contract-manage/draft-contract/update.test.ts tests/nitro/property-manage/contract-manage/draft-contract/delete.test.ts
```

Expected:

- FAIL，404 或接口不存在

- [ ] **Step 3: 按 `create/update/delete/detail` 补齐 Nitro 端点，并在 create/update 时物化附件**

Add `create.post.ts`:

```ts
import { defineHandler, readValidatedBody } from "nitro/h3";
import { ctContracts, createDraftContractSchema } from "@01s-11comm/type";
import { useDb } from "server/db";
import { materializeDraftContractAttachments } from "server/utils/contract-manage-upload";

export default defineHandler(async (event) => {
	const db = useDb(event);
	const body = await readValidatedBody(event, createDraftContractSchema.parse);
	const [contract] = await db.insert(ctContracts).values(body.contract).returning();
	await materializeDraftContractAttachments(db, contract.id, body.newUploadSessionIds, body.attachmentMetas);
	return { success: true, code: 200, message: "创建成功", data: contract };
});
```

Add `update.post.ts`:

```ts
await syncDraftContractAttachments(db, {
	contractId: body.id,
	retainAttachmentIds: body.retainAttachmentIds,
	deleteAttachmentIds: body.deleteAttachmentIds,
	newUploadSessionIds: body.newUploadSessionIds,
	attachmentMetas: body.attachmentMetas,
});
```

Add `delete.post.ts`:

```ts
await db.update(ctContracts).set({ deletedAt: new Date() }).where(eq(ctContracts.id, body.id));
```

`detail.post.ts` must return:

```ts
{
	...contract,
	attachments,
}
```

- [ ] **Step 4: 跑草稿合同 Nitro 测试**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/draft-contract/list.test.ts tests/nitro/property-manage/contract-manage/draft-contract/detail.test.ts tests/nitro/property-manage/contract-manage/draft-contract/create.test.ts tests/nitro/property-manage/contract-manage/draft-contract/update.test.ts tests/nitro/property-manage/contract-manage/draft-contract/delete.test.ts
```

Expected:

- 5 条测试全部 PASS

- [ ] **Step 5: 提交草稿合同 CRUD**

```bash
git add apps/admin/server/api/property-manage/contract-manage/draft-contract apps/admin/tests/nitro/property-manage/contract-manage/draft-contract
git commit -m "feat(admin): add draft contract CRUD"
```

## Task 5: 补齐 `change` 服务端 CRUD 与编辑态附件差量维护

**Files:**

- Modify: `apps/admin/server/api/property-manage/contract-manage/change/list.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/change/detail.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/change/create.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/change/update.post.ts`
- Create: `apps/admin/server/api/property-manage/contract-manage/change/delete.post.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/change/detail.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/change/create.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/change/update.test.ts`
- Create: `apps/admin/tests/nitro/property-manage/contract-manage/change/delete.test.ts`

- [ ] **Step 1: 先写 `change/update` 的失败测试，把差量附件协议固定下来**

Add `apps/admin/tests/nitro/property-manage/contract-manage/change/update.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { fetchNitroApi } from "setup-neon";

describe("change/update", () => {
	test("updates change record with retain/delete/new attachment split", async () => {
		const response = await fetchNitroApi("/api/property-manage/contract-manage/change/update", {
			method: "POST",
			body: JSON.stringify({
				id: "00000000-0000-0000-0000-000000000002",
				retainAttachmentIds: ["00000000-0000-0000-0000-000000000010"],
				deleteAttachmentIds: ["00000000-0000-0000-0000-000000000011"],
				newUploadSessionIds: ["00000000-0000-0000-0000-000000000012"],
			}),
		});

		expect(response.ok).toBe(true);
	});
});
```

- [ ] **Step 2: 运行失败测试，确认 update 差量逻辑尚未接入**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/change/update.test.ts
```

Expected:

- FAIL，404 或接口不存在

- [ ] **Step 3: 实现合同变更 CRUD，并让 update 使用差量附件同步**

Add `update.post.ts`:

```ts
await syncChangeAttachments(db, {
	changeId: body.id,
	retainAttachmentIds: body.retainAttachmentIds,
	deleteAttachmentIds: body.deleteAttachmentIds,
	newUploadSessionIds: body.newUploadSessionIds,
	attachmentMetas: body.attachmentMetas,
});
```

Add `create.post.ts`:

```ts
const [change] = await db.insert(ctChanges).values(body.change).returning();
await materializeChangeAttachments(db, change.id, body.newUploadSessionIds, body.attachmentMetas);
```

`detail.post.ts` must return change + attachment list:

```ts
return {
	success: true,
	code: 200,
	message: "查询成功",
	data: { ...change, attachments },
};
```

- [ ] **Step 4: 跑合同变更 Nitro 测试**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/change/list.test.ts tests/nitro/property-manage/contract-manage/change/detail.test.ts tests/nitro/property-manage/contract-manage/change/create.test.ts tests/nitro/property-manage/contract-manage/change/update.test.ts tests/nitro/property-manage/contract-manage/change/delete.test.ts
```

Expected:

- 5 条测试全部 PASS

- [ ] **Step 5: 提交变更合同 CRUD**

```bash
git add apps/admin/server/api/property-manage/contract-manage/change apps/admin/tests/nitro/property-manage/contract-manage/change
git commit -m "feat(admin): add contract change CRUD"
```

## Task 6: 实现前端上传 API 层与共享上传组件

**Files:**

- Create: `apps/admin/src/api/property-manage/contract-manage/upload/index.ts`
- Modify: `apps/admin/src/api/property-manage/contract-manage/draft-contract/index.ts`
- Modify: `apps/admin/src/api/property-manage/contract-manage/change/index.ts`
- Create: `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/types.ts`
- Create: `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/upload-cache.ts`
- Create: `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/use-resumable-upload.ts`
- Create: `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/index.vue`
- Create: `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/tests/use-resumable-upload.test.ts`

- [ ] **Step 1: 先写上传状态机单测，固定指纹、恢复和缺片上传规则**

Add `apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload/tests/use-resumable-upload.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { buildResumeFingerprint, pickMissingPartNumbers } from "../use-resumable-upload";

describe("use-resumable-upload", () => {
	test("buildResumeFingerprint uses file metadata and chunkSize", async () => {
		const file = new File(["hello"], "contract.pdf", { type: "application/pdf", lastModified: 123 });
		const fingerprint = await buildResumeFingerprint(file, 5 * 1024 * 1024);
		expect(fingerprint).toMatch(/^[a-f0-9]{64}$/);
	});

	test("pickMissingPartNumbers only returns gaps", () => {
		expect(pickMissingPartNumbers(5, [{ partNumber: 1 }, { partNumber: 3 }])).toEqual([2, 4, 5]);
	});
});
```

- [ ] **Step 2: 跑失败测试，确认共享上传逻辑还没落地**

Run: `pnpm -F @01s-11comm/admin exec vitest run src/pages/property-manage/contract-manage/components/resumable-upload/tests/use-resumable-upload.test.ts`

Expected:

- FAIL，报找不到 `use-resumable-upload`

- [ ] **Step 3: 实现上传 API module、缓存层和共享 composable**

Add `apps/admin/src/api/property-manage/contract-manage/upload/index.ts`:

```ts
import axios from "axios";

export function uploadInit(payload: any) {
	return axios.post("/api/property-manage/contract-manage/upload/init", payload);
}

export function uploadStatus(payload: any) {
	return axios.post("/api/property-manage/contract-manage/upload/status", payload);
}
```

Extend `apps/admin/src/api/property-manage/contract-manage/draft-contract/index.ts` and `change/index.ts` with exact hook names used by page integration:

```ts
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { MaybeRef } from "vue";

export function useDraftContractDetailQuery(id: MaybeRef<string | undefined>) {}
export function useDraftContractCreateMutation() {}
export function useDraftContractUpdateMutation() {}
export function useDraftContractDeleteMutation() {}

export function useChangeDetailQuery(id: MaybeRef<string | undefined>) {}
export function useChangeCreateMutation() {}
export function useChangeUpdateMutation() {}
export function useChangeDeleteMutation() {}
```

Add `use-resumable-upload.ts`:

```ts
import localforage from "localforage";
import { uploadComplete, uploadInit, uploadSignPart, uploadStatus } from "@/api/property-manage/contract-manage/upload";

export async function buildResumeFingerprint(file: File, chunkSize: number) {
	const raw = `${file.name}:${file.size}:${file.lastModified}:${chunkSize}`;
	const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
	return Array.from(new Uint8Array(hashBuffer))
		.map((item) => item.toString(16).padStart(2, "0"))
		.join("");
}
```

The composable must expose:

```ts
{
	files,
	startUpload,
	pauseUpload,
	resumeUpload,
	retryUpload,
	removeUpload,
	completedAssets,
	hasBlockingUpload,
}
```

Add `index.vue` queue UI:

```vue
<template>
	<div class="space-y-3">
		<el-upload :auto-upload="false" :show-file-list="false" drag multiple @change="handleSelect">
			<div>点击或拖拽文件到这里，按分片直传 R2</div>
		</el-upload>
		<el-card v-for="item in files" :key="item.localId">
			<div class="flex items-center justify-between">
				<span>{{ item.file.name }}</span>
				<el-progress :percentage="item.progress" />
			</div>
		</el-card>
	</div>
</template>
```

- [ ] **Step 4: 跑单测并做一次前端类型检查**

Run:

```bash
pnpm -F @01s-11comm/admin exec vitest run src/pages/property-manage/contract-manage/components/resumable-upload/tests/use-resumable-upload.test.ts
pnpm -F @01s-11comm/admin typecheck
```

Expected:

- 单测 PASS
- 类型检查 PASS

- [ ] **Step 5: 提交上传 UI 核心层**

```bash
git add apps/admin/src/api/property-manage/contract-manage/upload/index.ts apps/admin/src/api/property-manage/contract-manage/draft-contract/index.ts apps/admin/src/api/property-manage/contract-manage/change/index.ts apps/admin/src/pages/property-manage/contract-manage/components/resumable-upload
git commit -m "feat(admin): add resumable upload UI core"
```

## Task 7: 接入 `draft-contract` 页面完整闭环

**Files:**

- Modify: `apps/admin/src/pages/property-manage/contract-manage/draft-contract/index.vue`
- Modify: `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/form.ts`
- Modify: `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/form.vue`
- Create: `apps/admin/src/pages/property-manage/contract-manage/draft-contract/components/detail.vue`

- [ ] **Step 1: 先把草稿合同表单默认值和详情组件的类型补齐**

Update `components/form.ts`:

```ts
import type { CompletedAttachmentAsset, ContractDraftFormVO } from "@01s-11comm/type";

export const defaultForm: ContractDraftFormVO = {
	contractName: "",
	contractNumber: "",
	contractType: "",
	partyA: "",
	partyAContact: "",
	partyAPhone: "",
	partyB: "",
	partyBContact: "",
	partyBPhone: "",
	handler: "",
	handlerPhone: "",
	contractAmount: "",
	startTime: "",
	endTime: "",
	signingTime: "",
	description: "",
	attachments: [] as CompletedAttachmentAsset[],
};
```

Add `components/detail.vue`:

```vue
<template>
	<el-descriptions :column="2" border>
		<el-descriptions-item label="合同名称">{{ detail.contractName }}</el-descriptions-item>
		<el-descriptions-item label="合同编号">{{ detail.contractNumber }}</el-descriptions-item>
	</el-descriptions>
	<el-table :data="detail.attachments">
		<el-table-column prop="attachmentName" label="附件名称" />
		<el-table-column prop="fileUrl" label="访问地址" />
	</el-table>
</template>
```

- [ ] **Step 2: 在 `form.vue` 中接入共享上传组件，阻止未完成附件提交**

Insert into `components/form.vue`:

```vue
<ResumableUpload
	v-model="props.form.attachments"
	biz-type="draft_contract"
	:attachment-type-options="attachmentTypeOptions"
/>
```

Guard submit:

```ts
if (hasBlockingUpload.value) {
	ElMessage.warning("请先处理完成所有上传中的附件");
	return;
}
```

- [ ] **Step 3: 在 `index.vue` 里补齐 detail/create/update/delete 流程**

Use hooks:

```ts
const { data: detailData, refetch: refetchDetail } = useDraftContractDetailQuery(selectedId);
const createMutation = useDraftContractCreateMutation();
const updateMutation = useDraftContractUpdateMutation();
const deleteMutation = useDraftContractDeleteMutation();
```

Submit payload:

```ts
const payload = {
	...form,
	newUploadSessionIds: form.attachments.map((item) => item.uploadSessionId),
	attachmentMetas: form.attachments.map((item) => ({
		uploadSessionId: item.uploadSessionId,
		attachmentName: item.attachmentName,
		attachmentType: item.attachmentType,
	})),
};
```

- [ ] **Step 4: 手动验证草稿合同页**

Run:

```bash
pnpm -F @01s-11comm/admin dev
```

Manual checklist:

- 打开 `propertyManage.contractManage.draftContract`
- 新建一条草稿合同
- 选择一个 12MB 左右文件，看到分片进度
- 暂停后继续
- 上传完成后提交创建
- 在详情弹窗看到附件 URL 类似 `https://01s-11comm-files.ruan-cat.com/contract-manage/draft_contract/session-1/1710000000000.pdf`
- 再次编辑，保留旧附件并补一个新附件

- [ ] **Step 5: 提交草稿合同页面接入**

```bash
git add apps/admin/src/pages/property-manage/contract-manage/draft-contract
git commit -m "feat(admin): integrate draft contract resumable upload"
```

## Task 8: 接入 `change` 页面完整闭环与差量附件编辑

**Files:**

- Modify: `apps/admin/src/pages/property-manage/contract-manage/change/index.vue`
- Modify: `apps/admin/src/pages/property-manage/contract-manage/change/components/form.ts`
- Modify: `apps/admin/src/pages/property-manage/contract-manage/change/components/form.vue`
- Create: `apps/admin/src/pages/property-manage/contract-manage/change/components/detail.vue`

- [ ] **Step 1: 把 `change` 表单 VO 改成可同时表示旧附件和新附件**

Update `components/form.ts`:

```ts
export interface ChangeAttachmentDraft {
	id?: string;
	attachmentName: string;
	attachmentType: string;
	fileUrl?: string;
	uploadSessionId?: string;
	source: "existing" | "new";
}
```

Use in default form:

```ts
attachments: [] as ChangeAttachmentDraft[],
```

- [ ] **Step 2: 在 `form.vue` 中实现“保留/删除/新增”三态交互**

Split attachments:

```ts
const existingAttachments = computed(() => props.form.attachments.filter((item) => item.source === "existing"));
const newAttachments = computed(() => props.form.attachments.filter((item) => item.source === "new"));
```

Delete old attachment UI:

```vue
<el-tag v-for="item in existingAttachments" :key="item.id" closable @close="markExistingAttachmentDeleted(item.id!)">
	{{ item.attachmentName }}
</el-tag>
```

Add new upload UI:

```vue
<ResumableUpload v-model="newUploadAssets" biz-type="change" :attachment-type-options="attachmentTypeOptions" />
```

- [ ] **Step 3: 在 `index.vue` 里把差量结果组装给 update API**

Submit payload:

```ts
const payload = {
	...form,
	retainAttachmentIds: form.attachments.filter((item) => item.source === "existing").map((item) => item.id!),
	deleteAttachmentIds,
	newUploadSessionIds: newUploadAssets.value.map((item) => item.uploadSessionId),
	attachmentMetas: newUploadAssets.value.map((item) => ({
		uploadSessionId: item.uploadSessionId,
		attachmentName: item.attachmentName,
		attachmentType: item.attachmentType,
	})),
};
```

- [ ] **Step 4: 手动验证合同变更页**

Run:

```bash
pnpm -F @01s-11comm/admin dev
```

Manual checklist:

- 打开 `propertyManage.contractManage.change`
- 新建一条合同变更并上传附件
- 编辑该记录时，保留一个旧附件、删除一个旧附件、新增一个新附件
- 提交后重新打开详情，确认附件列表只剩保留项和新增项

- [ ] **Step 5: 提交合同变更页面接入**

```bash
git add apps/admin/src/pages/property-manage/contract-manage/change
git commit -m "feat(admin): integrate change resumable upload"
```

## Task 9: 收尾基础设施、CORS 与全链路验证

**Files:**

- Create: `apps/admin/scripts/r2-contract-upload-cors.json`
- Modify: `.gitignore`
- Modify: `apps/admin/src/docs/resume/2026-04-15-nitro-neon-r2-resumable-upload-interview-design.md`

- [ ] **Step 1: 把 `.superpowers/` 纳入 Git 忽略**

Update `.gitignore`:

```gitignore
.superpowers/
```

- [ ] **Step 2: 固化 R2 CORS 文件并推送到 Cloudflare**

Add `apps/admin/scripts/r2-contract-upload-cors.json`:

```json
[
	{
		"AllowedOrigins": ["http://localhost:8080", "https://01s-11comm.ruan-cat.com"],
		"AllowedMethods": ["GET", "HEAD", "PUT"],
		"AllowedHeaders": ["content-type", "x-amz-content-sha256", "x-amz-date", "authorization"],
		"ExposeHeaders": ["ETag"],
		"MaxAgeSeconds": 3600
	}
]
```

Run:

```bash
wrangler r2 bucket cors set 01s-11comm-files --file apps/admin/scripts/r2-contract-upload-cors.json
```

Expected:

- CLI 输出 `Successfully set CORS policy`

- [ ] **Step 3: 如实现命名与设计文档有偏差，回写面试文档**

Update `apps/admin/src/docs/resume/2026-04-15-nitro-neon-r2-resumable-upload-interview-design.md` only if final implementation changed any of these names:

- `ct_upload_sessions`
- `ct_upload_session_parts`
- `newUploadSessionIds`
- `retainAttachmentIds`
- `deleteAttachmentIds`
- `01s-11comm-files.ruan-cat.com`

Required diff shape:

```md
- `upload/complete` 只关闭上传链路，不直接写 `ct_attachments`
- `draft-contract/create|update` 与 `change/create|update` 负责物化附件
```

- [ ] **Step 4: 跑全链路验证命令**

Run:

```bash
pnpm -F @01s-11comm/type typecheck
pnpm -F @01s-11comm/admin typecheck
pnpm -F @01s-11comm/admin exec vitest run server/utils/r2-env.test.ts server/utils/contract-manage-upload.test.ts
pnpm -F @01s-11comm/admin exec vitest run tests/nitro/property-manage/contract-manage/upload/init.test.ts tests/nitro/property-manage/contract-manage/upload/status.test.ts tests/nitro/property-manage/contract-manage/upload/complete.test.ts tests/nitro/property-manage/contract-manage/upload/abort.test.ts tests/nitro/property-manage/contract-manage/draft-contract/list.test.ts tests/nitro/property-manage/contract-manage/draft-contract/detail.test.ts tests/nitro/property-manage/contract-manage/draft-contract/create.test.ts tests/nitro/property-manage/contract-manage/draft-contract/update.test.ts tests/nitro/property-manage/contract-manage/draft-contract/delete.test.ts tests/nitro/property-manage/contract-manage/change/list.test.ts tests/nitro/property-manage/contract-manage/change/detail.test.ts tests/nitro/property-manage/contract-manage/change/create.test.ts tests/nitro/property-manage/contract-manage/change/update.test.ts tests/nitro/property-manage/contract-manage/change/delete.test.ts
pnpm -F @01s-11comm/admin exec vitest run src/pages/property-manage/contract-manage/components/resumable-upload/tests/use-resumable-upload.test.ts
```

Expected:

- 所有类型检查 PASS
- 服务端 helper 单测 PASS
- contract-manage Nitro 测试 PASS
- 上传状态机单测 PASS

- [ ] **Step 5: 提交基础设施和最终同步**

```bash
git add .gitignore apps/admin/scripts/r2-contract-upload-cors.json apps/admin/src/docs/resume/2026-04-15-nitro-neon-r2-resumable-upload-interview-design.md
git commit -m "chore(admin): finalize resumable upload infrastructure"
```
