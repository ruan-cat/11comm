import type { JsonVO } from "@01s-11comm/type";
import { setResponseStatus, type H3Event } from "nitro/h3";
import { toAuthError } from "./errors";

export function authSuccess<T>(data: T, message = "操作成功"): JsonVO<T> {
	return { success: true, code: 200, message, data };
}

export function authFailure(event: H3Event, error: unknown): JsonVO<null> {
	const authError = toAuthError(error);
	setResponseStatus(event, authError.statusCode);
	return { success: false, code: authError.statusCode, message: authError.message, data: null };
}
