import type { JsonVO } from "@01s-11comm/type";

export interface LegacyResponse<T> {
	code: number;
	msg: string;
	data: T;
}

export function legacySuccess<T>(data: T, msg = "操作成功"): LegacyResponse<T> {
	return {
		code: 0,
		msg,
		data,
	};
}

export function legacyFailure(message: string, code = 500): LegacyResponse<null> {
	return {
		code,
		msg: message,
		data: null,
	};
}

export function adminSuccess<T>(data: T, message = "查询成功"): JsonVO<T> {
	return {
		success: true,
		code: 200,
		message,
		data,
	};
}

export function adminFailure(message: string, error?: unknown): JsonVO<null> {
	return {
		success: false,
		code: 500,
		message,
		data: null,
		error: error instanceof Error ? error.message : error === undefined ? undefined : String(error),
	};
}
