/**
 * @file 合同变更 CRUD 与差量附件协议测试
 * @description 测试 /api/property-manage/contract-manage/change/* 接口链路
 */

import { beforeAll, describe, expect, test } from "vitest";
import { checkNitroServer, fetchNitroApi, NITRO_BASE_URL } from "setup-neon";

describe("合同变更 CRUD 与差量附件协议测试", () => {
	beforeAll(async () => {
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务端未运行，请先运行 'pnpm dev' 启动服务端`);
			console.warn(`📍 预期服务端地址: ${NITRO_BASE_URL}`);
		}
	});

	test("POST /api/property-manage/contract-manage/change/create|update|detail|delete - 支持差量附件维护", async () => {
		const contractNumber = `CHANGE-${crypto.randomUUID()}`;
		const firstSessionId = crypto.randomUUID();
		const secondSessionId = crypto.randomUUID();
		const thirdSessionId = crypto.randomUUID();

		const createResponse = await fetchNitroApi("/api/property-manage/contract-manage/change/create", {
			method: "POST",
			body: JSON.stringify({
				contractName: "变更测试合同",
				contractNumber,
				contractType: "服务合同",
				partyA: "甲方测试",
				partyAContact: "张三",
				partyAPhone: "13800000000",
				partyB: "乙方测试",
				partyBContact: "李四",
				partyBPhone: "13900000000",
				handler: "王五",
				handlerPhone: "13700000000",
				contractAmount: "120000.00",
				startTime: "2026-04-15 10:00:00",
				endTime: "2026-04-30 18:00:00",
				signingTime: "2026-04-15 10:30:00",
				changeType: "合同金额",
				changer: "测试人",
				description: "首次变更说明",
				beforeChange: "100000.00",
				afterChange: "120000.00",
				newUploadSessionIds: [firstSessionId, secondSessionId],
				attachmentMetas: [
					{
						uploadSessionId: firstSessionId,
						attachmentName: "附件A",
						attachmentType: "合同正本",
					},
					{
						uploadSessionId: secondSessionId,
						attachmentName: "附件B",
						attachmentType: "补充协议",
					},
				],
				remark: "create remark",
			}),
		});

		expect(createResponse.ok).toBe(true);
		const createResult = await createResponse.json();
		expect(createResult.success).toBe(true);
		expect(createResult.data).toBeDefined();
		expect(createResult.data.attachments).toHaveLength(2);
		expect(createResult.data.attachments.map((item: any) => item.contractNumber)).toEqual([
			contractNumber,
			contractNumber,
		]);
		expect(createResult.data.attachments.map((item: any) => item.contractName)).toEqual([
			createResult.data.contractName,
			createResult.data.contractName,
		]);

		const changeId = createResult.data.id;
		const attachmentAId = createResult.data.attachments[0].id;
		const attachmentBId = createResult.data.attachments[1].id;

		const detailResponse = await fetchNitroApi("/api/property-manage/contract-manage/change/detail", {
			method: "POST",
			body: JSON.stringify({ id: changeId }),
		});

		expect(detailResponse.ok).toBe(true);
		const detailResult = await detailResponse.json();
		expect(detailResult.success).toBe(true);
		expect(detailResult.data.attachments).toHaveLength(2);
		expect(detailResult.data.attachments.map((item: any) => item.attachmentName)).toEqual(["附件A", "附件B"]);

		const updateResponse = await fetchNitroApi("/api/property-manage/contract-manage/change/update", {
			method: "POST",
			body: JSON.stringify({
				id: changeId,
				contractName: "变更测试合同-已更新",
				contractNumber,
				contractType: "服务合同",
				partyA: "甲方测试",
				partyAContact: "张三",
				partyAPhone: "13800000000",
				partyB: "乙方测试",
				partyBContact: "李四",
				partyBPhone: "13900000000",
				handler: "王五",
				handlerPhone: "13700000000",
				contractAmount: "130000.00",
				startTime: "2026-04-15 10:00:00",
				endTime: "2026-04-30 18:00:00",
				signingTime: "2026-04-15 10:30:00",
				changeType: "合同金额",
				changer: "测试人",
				description: "更新后的变更说明",
				beforeChange: "120000.00",
				afterChange: "130000.00",
				retainAttachmentIds: [attachmentAId],
				deleteAttachmentIds: [attachmentBId],
				newUploadSessionIds: [thirdSessionId],
				attachmentMetas: [
					{
						uploadSessionId: thirdSessionId,
						attachmentName: "附件C",
						attachmentType: "补充协议",
					},
				],
				remark: "update remark",
			}),
		});

		expect(updateResponse.ok).toBe(true);
		const updateResult = await updateResponse.json();
		expect(updateResult.success).toBe(true);
		expect(updateResult.data.attachments).toHaveLength(2);

		const updatedAttachmentNames = updateResult.data.attachments.map((item: any) => item.attachmentName);
		expect(updatedAttachmentNames).toEqual(["附件A", "附件C"]);

		const updatedDetailResponse = await fetchNitroApi("/api/property-manage/contract-manage/change/detail", {
			method: "POST",
			body: JSON.stringify({ id: changeId }),
		});

		expect(updatedDetailResponse.ok).toBe(true);
		const updatedDetailResult = await updatedDetailResponse.json();
		expect(updatedDetailResult.success).toBe(true);
		expect(updatedDetailResult.data.contractName).toBe("变更测试合同-已更新");
		expect(updatedDetailResult.data.description).toBe("更新后的变更说明");
		expect(updatedDetailResult.data.attachments).toHaveLength(2);
		expect(updatedDetailResult.data.attachments.map((item: any) => item.attachmentName)).toEqual(["附件A", "附件C"]);

		expect(updatedDetailResult.data.attachments.map((item: any) => item.contractNumber)).toEqual([
			contractNumber,
			contractNumber,
		]);
		expect(updatedDetailResult.data.attachments.map((item: any) => item.contractName)).toEqual([
			updatedDetailResult.data.contractName,
			updatedDetailResult.data.contractName,
		]);

		const deleteResponse = await fetchNitroApi("/api/property-manage/contract-manage/change/delete", {
			method: "POST",
			body: JSON.stringify({ ids: [changeId] }),
		});

		expect(deleteResponse.ok).toBe(true);
		const deleteResult = await deleteResponse.json();
		expect(deleteResult.success).toBe(true);

		const missingDetailResponse = await fetchNitroApi("/api/property-manage/contract-manage/change/detail", {
			method: "POST",
			body: JSON.stringify({ id: changeId }),
		});

		expect(missingDetailResponse.ok).toBe(true);
		const missingDetailResult = await missingDetailResponse.json();
		expect(missingDetailResult.success).toBe(false);
		expect(missingDetailResult.code).toBe(404);
	}, 30000);
});
