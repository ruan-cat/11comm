/**
 * @file 合同变更更新接口
 * @description Change update API
 * POST /api/property-manage/contract-manage/change/update
 */

import type { ChangeUpdatePayload, ContractChangeDetailVO, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	changeUpdateBodySchema,
	updateChangeRecord,
} from "server/services/property-manage/contract-manage/change-service";

export default defineHandler(async (event): Promise<JsonVO<ContractChangeDetailVO>> => {
	try {
		const db = useDb(event);
		const body = (await readValidatedBody(event, changeUpdateBodySchema.parse)) as unknown as ChangeUpdatePayload;
		const response: JsonVO<ContractChangeDetailVO> = await updateChangeRecord(db, body);

		return response;
	} catch (error: any) {
		console.error("[Change Update] Error:", error);
		const errorResponse: JsonVO<ContractChangeDetailVO> = {
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
