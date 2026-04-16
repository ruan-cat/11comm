/**
 * @file Contract upload init API
 * @description Contract upload init API
 * POST /api/property-manage/contract-manage/upload/init
 */

import { createUploadInitSchema, type JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	createContractUploadService,
	createDbUploadRepository,
	type UploadInitVO,
} from "server/services/property-manage/contract-manage/upload-service";

export default defineHandler(async (event): Promise<JsonVO<UploadInitVO>> => {
	try {
		const repository = createDbUploadRepository(useDb(event));
		const service = createContractUploadService({ repository });
		const body = await readValidatedBody(event, createUploadInitSchema.parse);
		const response: JsonVO<UploadInitVO> = await service.initUpload(body as any);
		return response;
	} catch (error: any) {
		console.error("[Contract Upload Init] Error:", error);
		return {
			success: false,
			code: 500,
			message: "init failed",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};
	}
});
