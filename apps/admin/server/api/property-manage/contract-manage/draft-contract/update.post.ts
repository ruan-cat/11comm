/**
 * @file 合同起草更新接口
 * @description Draft contract update API
 * POST /api/property-manage/contract-manage/draft-contract/update
 */

import type { ContractDraftDetailVO, DraftContractUpdatePayload, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import {
	draftContractUpdateBodySchema,
	updateDraftContractRecord,
} from "server/services/property-manage/contract-manage/draft-contract-service";

export default defineHandler(async (event): Promise<JsonVO<ContractDraftDetailVO>> => {
	try {
		const body = (await readValidatedBody(
			event,
			draftContractUpdateBodySchema.parse,
		)) as unknown as DraftContractUpdatePayload;
		const response: JsonVO<ContractDraftDetailVO> = await updateDraftContractRecord(event, body);

		return response;
	} catch (error: any) {
		console.error("[Draft Contract Update] Error:", error);
		const errorResponse: JsonVO<ContractDraftDetailVO> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};

		return errorResponse;
	}
});
