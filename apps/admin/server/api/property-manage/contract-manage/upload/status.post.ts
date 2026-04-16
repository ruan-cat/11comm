/**
 * @file Contract upload status API
 * @description Contract upload status API
 * POST /api/property-manage/contract-manage/upload/status
 */

import { createUploadStatusSchema, type JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	createContractUploadService,
	createDbUploadRepository,
	type UploadStatusVO,
} from "server/services/property-manage/contract-manage/upload-service";

export default defineHandler(async (event): Promise<JsonVO<UploadStatusVO>> => {
	try {
		const repository = createDbUploadRepository(useDb(event));
		const service = createContractUploadService({ repository });
		const body = await readValidatedBody(event, createUploadStatusSchema.parse);
		const response: JsonVO<UploadStatusVO> = await service.getStatus(body as any);
		return response;
	} catch (error: any) {
		console.error("[Contract Upload Status] Error:", error);
		return {
			success: false,
			code: 500,
			message: "status query failed",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};
	}
});
