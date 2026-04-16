/**
 * @file Contract upload complete API
 * @description Contract upload complete API
 * POST /api/property-manage/contract-manage/upload/complete
 */

import { createUploadCompleteSchema, type JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	createContractUploadService,
	createDbUploadRepository,
	type UploadCompleteVO,
} from "server/services/property-manage/contract-manage/upload-service";

export default defineHandler(async (event): Promise<JsonVO<UploadCompleteVO>> => {
	try {
		const repository = createDbUploadRepository(useDb(event));
		const service = createContractUploadService({ repository });
		const body = await readValidatedBody(event, createUploadCompleteSchema.parse);
		const response: JsonVO<UploadCompleteVO> = await service.completeUpload(body as any);
		return response;
	} catch (error: any) {
		console.error("[Contract Upload Complete] Error:", error);
		return {
			success: false,
			code: 500,
			message: "complete failed",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};
	}
});
