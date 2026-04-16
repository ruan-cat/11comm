/**
 * @file Contract upload sign-part API
 * @description Contract upload sign-part API
 * POST /api/property-manage/contract-manage/upload/sign-part
 */

import { createUploadSignPartSchema, type JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	createContractUploadService,
	createDbUploadRepository,
	type UploadSignPartVO,
} from "server/services/property-manage/contract-manage/upload-service";

export default defineHandler(async (event): Promise<JsonVO<UploadSignPartVO>> => {
	try {
		const repository = createDbUploadRepository(useDb(event));
		const service = createContractUploadService({ repository });
		const body = await readValidatedBody(event, createUploadSignPartSchema.parse);
		const response: JsonVO<UploadSignPartVO> = await service.signPart(body as any);
		return response;
	} catch (error: any) {
		console.error("[Contract Upload Sign Part] Error:", error);
		return {
			success: false,
			code: 500,
			message: "sign part failed",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};
	}
});
