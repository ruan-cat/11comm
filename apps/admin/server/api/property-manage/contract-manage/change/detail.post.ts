/**
 * @file 合同变更详情接口
 * @description Change detail API
 * POST /api/property-manage/contract-manage/change/detail
 */

import type { ContractChangeDetailVO, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	changeDetailBodySchema,
	getChangeDetailRecord,
} from "server/services/property-manage/contract-manage/change-service";

export default defineHandler(async (event): Promise<JsonVO<ContractChangeDetailVO>> => {
	try {
		const db = useDb(event);
		const body = await readValidatedBody(event, changeDetailBodySchema.parse);
		const response: JsonVO<ContractChangeDetailVO> = await getChangeDetailRecord(db, body);

		return response;
	} catch (error: any) {
		console.error("[Change Detail] Error:", error);
		const errorResponse: JsonVO<ContractChangeDetailVO> = {
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
