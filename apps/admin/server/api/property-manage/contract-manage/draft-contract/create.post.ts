/**
 * @file 合同起草创建接口
 * @description Draft contract create API
 * POST /api/property-manage/contract-manage/draft-contract/create
 */

import type { ContractDraftDetailVO, DraftContractCreatePayload, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import {
	createDraftContractRecord,
	draftContractCreateBodySchema,
} from "server/services/property-manage/contract-manage/draft-contract-service";

export default defineHandler(async (event): Promise<JsonVO<ContractDraftDetailVO>> => {
	try {
		const body = (await readValidatedBody(
			event,
			draftContractCreateBodySchema.parse,
		)) as unknown as DraftContractCreatePayload;
		const response: JsonVO<ContractDraftDetailVO> = await createDraftContractRecord(event, body);

		return response;
	} catch (error: any) {
		console.error("[Draft Contract Create] Error:", error);
		const errorResponse: JsonVO<ContractDraftDetailVO> = {
			success: false,
			code: 500,
			message: "创建失败",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};

		return errorResponse;
	}
});
