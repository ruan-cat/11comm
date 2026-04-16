import { describe, expect, test } from "vitest";
import {
	buildDraftContractCreatePayload,
	countBlockingDraftUploadSessions,
	mapDraftContractDetailToForm,
} from "../utils";

describe("draft-contract utils", () => {
	test("maps detail attachments into form attachments", () => {
		const form = mapDraftContractDetailToForm({
			id: "detail-1",
			contractName: "示例合同",
			contractNumber: "HT-001",
			contractType: "采购合同",
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
			endTime: "2026-04-20 10:00:00",
			signingTime: "2026-04-15 09:30:00",
			description: "说明",
			status: "draft",
			attachments: [
				{
					id: "att-1",
					contractId: "detail-1",
					attachmentName: "合同正文",
					contractNumber: "HT-001",
					contractName: "示例合同",
					attachmentType: "pdf",
					createTime: "2026-04-15 10:00:00",
					updateTime: "2026-04-15 10:00:00",
					storageProvider: "r2",
					uploadStatus: "ready",
					uploadSessionId: "session-1",
					bucketName: "01s-11comm-files",
					fileUrl: "https://example.com/contract.pdf",
					objectKey: "contract-manage/draft_contract/session-1/contract.pdf",
					mimeType: "application/pdf",
					fileSize: 1024,
				},
			],
			createTime: "2026-04-15 10:00:00",
			updateTime: "2026-04-15 10:00:00",
		});

		expect(form.attachments).toHaveLength(1);
		expect(form.attachments[0].uploadSessionId).toBe("session-1");
		expect(form.attachments[0].attachmentName).toBe("合同正文");
	});

	test("builds create payload from completed uploads only", () => {
		const payload = buildDraftContractCreatePayload({
			contractName: "示例合同",
			contractNumber: "HT-001",
			contractType: "采购合同",
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
			endTime: "2026-04-20 10:00:00",
			signingTime: "2026-04-15 09:30:00",
			description: "说明",
			attachments: [
				{
					uploadSessionId: "session-1",
					attachmentName: "合同正文",
					attachmentType: "pdf",
					fileName: "contract.pdf",
					fileSize: 1024,
					mimeType: "application/pdf",
					storageProvider: "r2",
					bucketName: "01s-11comm-files",
					fileUrl: "https://example.com/contract.pdf",
					objectKey: "contract-manage/draft_contract/session-1/contract.pdf",
					objectEtag: null,
					fileHash: null,
					uploadStatus: "ready",
				},
			],
		});

		expect(payload.newUploadSessionIds).toEqual(["session-1"]);
		expect(payload.attachmentMetas).toEqual([
			{
				uploadSessionId: "session-1",
				attachmentName: "合同正文",
				attachmentType: "pdf",
			},
		]);
	});

	test("counts blocking upload sessions", () => {
		expect(
			countBlockingDraftUploadSessions([
				{ bizType: "draft_contract", status: "uploading" } as any,
				{ bizType: "draft_contract", status: "completed" } as any,
				{ bizType: "change", status: "uploading" } as any,
			]),
		).toBe(1);
	});
});
