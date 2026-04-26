import { consola } from "consola";
import type { ApiError } from "./errors";
import { toApiError } from "./errors";

export interface StructuredLogger {
	info: (payload: Record<string, unknown>) => void;
	error: (payload: Record<string, unknown>) => void;
}

export interface ApiRequestLogInput {
	requestId: string;
	method: string;
	path: string;
	statusCode: number;
	durationMs: number;
}

export interface ApiErrorLogInput {
	requestId: string;
	method: string;
	path: string;
}

export const apiLogger: StructuredLogger = consola.withTag("@01s-11comm/api") as StructuredLogger;

export function logApiRequest(logger: StructuredLogger, input: ApiRequestLogInput): void {
	logger.info({
		event: "api.request",
		...input,
	});
}

export function logApiError(logger: StructuredLogger, error: ApiError | unknown, input: ApiErrorLogInput): void {
	const apiError = toApiError(error);
	logger.error({
		event: "api.error",
		requestId: input.requestId,
		method: input.method,
		path: input.path,
		statusCode: apiError.statusCode,
		errorCode: apiError.code,
		message: apiError.message,
	});
}
