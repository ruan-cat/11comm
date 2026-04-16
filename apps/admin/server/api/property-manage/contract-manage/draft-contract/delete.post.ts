/**
 * @file 合同起草删除接口
 * @description Draft contract delete API
 * POST /api/property-manage/contract-manage/draft-contract/delete
 */

import type { DraftContractDeletePayload, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import {
	deleteDraftContractRecord,
	draftContractDeleteBodySchema,
} from "server/services/property-manage/contract-manage/draft-contract-service";

export default defineHandler(async (event): Promise<JsonVO<null>> => {
	try {
		const body = (await readValidatedBody(
			event,
			draftContractDeleteBodySchema.parse,
		)) as unknown as DraftContractDeletePayload;
		const response: JsonVO<null> = await deleteDraftContractRecord(event, body);

		return response;
	} catch (error: any) {
		console.error("[Draft Contract Delete] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "删除失败",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};

		return errorResponse;
	}
});
