/**
 * @file 合同变更删除接口
 * @description Change delete API
 * POST /api/property-manage/contract-manage/change/delete
 */

import type { ChangeDeletePayload, JsonVO } from "@01s-11comm/type";
import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import {
	changeDeleteBodySchema,
	deleteChangeRecord,
} from "server/services/property-manage/contract-manage/change-service";

export default defineHandler(async (event): Promise<JsonVO<null>> => {
	try {
		const db = useDb(event);
		const body = (await readValidatedBody(event, changeDeleteBodySchema.parse)) as unknown as ChangeDeletePayload;
		const response: JsonVO<null> = await deleteChangeRecord(db, body);

		return response;
	} catch (error: any) {
		console.error("[Change Delete] Error:", error);
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
