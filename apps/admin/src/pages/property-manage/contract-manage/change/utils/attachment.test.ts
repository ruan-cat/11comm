import { describe, expect, test } from "vitest";
import {
	buildChangeAttachmentDiff,
	buildChangeCreatePayload,
	buildChangeUpdatePayload,
	createExistingChangeAttachmentDraft,
	createNewChangeAttachmentDraft,
	mergeChangeAttachmentDrafts,
} from "./attachment";

describe("change attachment helper", () => {
	test("可以把旧附件和新上传附件合并为草稿", () => {
		const existing = createExistingChangeAttachmentDraft({
			id: "att-1",
			contractId: "contract-1",
			attachmentName: "旧合同.pdf",
			contractNumber: "HT-001",
			contractName: "演示合同",
			attachmentType: "pdf",
			storageProvider: "r2",
			uploadStatus: "ready",
			createTime: "2026-04-15 10:00:00",
			updateTime: "2026-04-15 10:00:00",
		});

		const merged = mergeChangeAttachmentDrafts(
			[existing],
			[
				{
					uploadSessionId: "session-1",
					attachmentName: "新附件",
					attachmentType: "docx",
					fileName: "new.docx",
					fileSize: 128,
					mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					fileUrl: "https://example.com/new.docx",
					objectKey: "contract/new.docx",
				},
			],
		);

		expect(merged).toHaveLength(2);
		expect(merged[0].source).toBe("existing");
		expect(merged[1].source).toBe("new");
	});

	test("差量组装会正确区分保留、删除和新增附件", () => {
		const diff = buildChangeAttachmentDiff([
			{
				id: "att-1",
				contractId: "contract-1",
				attachmentName: "保留附件",
				contractNumber: "HT-001",
				contractName: "演示合同",
				attachmentType: "pdf",
				storageProvider: "r2",
				uploadStatus: "ready",
				createTime: "2026-04-15 10:00:00",
				updateTime: "2026-04-15 10:00:00",
				source: "existing",
				deleted: false,
			},
			{
				id: "att-2",
				contractId: "contract-1",
				attachmentName: "删除附件",
				contractNumber: "HT-001",
				contractName: "演示合同",
				attachmentType: "pdf",
				storageProvider: "r2",
				uploadStatus: "ready",
				createTime: "2026-04-15 10:00:00",
				updateTime: "2026-04-15 10:00:00",
				source: "existing",
				deleted: true,
			},
			createNewChangeAttachmentDraft({
				uploadSessionId: "session-1",
				attachmentName: "新增附件",
				attachmentType: "xlsx",
				fileName: "new.xlsx",
				fileSize: 256,
				mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				fileUrl: "https://example.com/new.xlsx",
				objectKey: "contract/new.xlsx",
			}),
		]);

		expect(diff.retainAttachmentIds).toEqual(["att-1"]);
		expect(diff.deleteAttachmentIds).toEqual(["att-2"]);
		expect(diff.newUploadSessionIds).toEqual(["session-1"]);
		expect(diff.attachmentMetas).toEqual([
			{
				uploadSessionId: "session-1",
				attachmentName: "新增附件",
				attachmentType: "xlsx",
			},
		]);
	});

	test("创建态和更新态 payload 都会带上附件差量", () => {
		const baseForm = {
			contractName: "演示合同",
			contractNumber: "HT-001",
			contractType: "服务合同",
			partyA: "甲方",
			partyAContact: "张三",
			partyAPhone: "13800000000",
			partyB: "乙方",
			partyBContact: "李四",
			partyBPhone: "13900000000",
			handler: "王五",
			handlerPhone: "13700000000",
			contractAmount: "1000",
			startTime: "2026-04-15 10:00:00",
			endTime: "2026-04-16 10:00:00",
			signingTime: "2026-04-15 09:30:00",
			changeType: "合同主体" as const,
			changer: "审查员",
			description: "说明",
			beforeChange: "before",
			afterChange: "after",
			changeTime: "2026-04-15 12:00:00",
		};

		const createPayload = buildChangeCreatePayload(baseForm, [
			createNewChangeAttachmentDraft({
				uploadSessionId: "session-create",
				attachmentName: "新增附件",
				attachmentType: "pdf",
				fileName: "create.pdf",
				fileSize: 1,
				mimeType: "application/pdf",
				fileUrl: "https://example.com/create.pdf",
				objectKey: "contract/create.pdf",
			}),
		]);

		const updatePayload = buildChangeUpdatePayload(
			{
				...baseForm,
				id: "change-1",
			},
			[
				{
					id: "att-1",
					contractId: "contract-1",
					attachmentName: "保留附件",
					contractNumber: "HT-001",
					contractName: "演示合同",
					attachmentType: "pdf",
					storageProvider: "r2",
					uploadStatus: "ready",
					createTime: "2026-04-15 10:00:00",
					updateTime: "2026-04-15 10:00:00",
					source: "existing",
					deleted: false,
				},
			],
		);

		expect(createPayload.newUploadSessionIds).toEqual(["session-create"]);
		expect(updatePayload.retainAttachmentIds).toEqual(["att-1"]);
	});
});
