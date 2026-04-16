/**
 * @file 合同变更创建接口
 * @description Change create API
 * POST /api/property-manage/contract-manage/change/create
 */

import type { ChangeCreatePayload, ContractChangeDetailVO, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	changeCreateBodySchema,
	createChangeRecord,
} from "server/services/property-manage/contract-manage/change-service";

export default defineHandler(async (event): Promise<JsonVO<ContractChangeDetailVO>> => {
	try {
		const db = useDb(event);
		const body = (await readValidatedBody(event, changeCreateBodySchema.parse)) as unknown as ChangeCreatePayload;
		const response: JsonVO<ContractChangeDetailVO> = await createChangeRecord(db, body);

		return response;
	} catch (error: any) {
		console.error("[Change Create] Error:", error);
		const errorResponse: JsonVO<ContractChangeDetailVO> = {
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
