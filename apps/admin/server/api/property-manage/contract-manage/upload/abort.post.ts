/**
 * @file Contract upload abort API
 * @description Contract upload abort API
 * POST /api/property-manage/contract-manage/upload/abort
 */

import { createUploadAbortSchema, type JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	createContractUploadService,
	createDbUploadRepository,
	type UploadAbortVO,
} from "server/services/property-manage/contract-manage/upload-service";

export default defineHandler(async (event): Promise<JsonVO<UploadAbortVO>> => {
	try {
		const repository = createDbUploadRepository(useDb(event));
		const service = createContractUploadService({ repository });
		const body = await readValidatedBody(event, createUploadAbortSchema.parse);
		const response: JsonVO<UploadAbortVO> = await service.abortUpload(body as any);
		return response;
	} catch (error: any) {
		console.error("[Contract Upload Abort] Error:", error);
		return {
			success: false,
			code: 500,
			message: "abort failed",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};
	}
});
