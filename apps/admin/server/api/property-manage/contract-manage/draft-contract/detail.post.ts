/**
 * @file 合同起草详情接口
 * @description Draft contract detail API
 * POST /api/property-manage/contract-manage/draft-contract/detail
 */

import type { ContractDraftDetailVO, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import {
	draftContractDetailBodySchema,
	getDraftContractDetailRecord,
} from "server/services/property-manage/contract-manage/draft-contract-service";

export default defineHandler(async (event): Promise<JsonVO<ContractDraftDetailVO>> => {
	try {
		const body = await readValidatedBody(event, draftContractDetailBodySchema.parse);
		const response: JsonVO<ContractDraftDetailVO> = await getDraftContractDetailRecord(event, body);

		return response;
	} catch (error: any) {
		console.error("[Draft Contract Detail] Error:", error);
		const errorResponse: JsonVO<ContractDraftDetailVO> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error?.message || String(error),
			stack: error?.stack,
		};

		return errorResponse;
	}
});
