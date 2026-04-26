export interface ApiErrorOptions {
	code?: string;
	expose?: boolean;
	cause?: unknown;
}

export interface ApiError extends Error {
	statusCode: number;
	code: string;
	expose: boolean;
	cause?: unknown;
}

export interface ErrorResponseOptions {
	requestId?: string;
	exposeDetails?: boolean;
}

export interface StandardErrorResponse {
	success: false;
	code: number;
	message: string;
	data: null;
	requestId?: string;
	errorCode?: string;
	error?: string;
}

export function createApiError(message: string, statusCode = 500, options: ApiErrorOptions = {}): ApiError {
	const error = new Error(message) as ApiError;
	error.name = "ApiError";
	error.statusCode = statusCode;
	error.code = options.code || statusCodeToErrorCode(statusCode);
	error.expose = options.expose ?? statusCode < 500;
	error.cause = options.cause;
	return error;
}

export function toApiError(error: unknown): ApiError {
	if (isApiError(error)) {
		return error;
	}

	const statusCode = Number((error as any)?.statusCode || (error as any)?.status || 500);
	const message = error instanceof Error ? error.message : String(error || "Internal Server Error");
	return createApiError(message, statusCode, {
		code: (error as any)?.code || statusCodeToErrorCode(statusCode),
		expose: Boolean((error as any)?.expose) || statusCode < 500,
		cause: error,
	});
}

export function getErrorStatusCode(error: unknown): number {
	return toApiError(error).statusCode;
}

export function buildErrorResponse(error: unknown, options: ErrorResponseOptions = {}): StandardErrorResponse {
	const apiError = toApiError(error);
	const expose = options.exposeDetails || apiError.expose;
	return {
		success: false,
		code: apiError.statusCode,
		message: expose ? apiError.message : defaultStatusMessage(apiError.statusCode),
		data: null,
		requestId: options.requestId,
		errorCode: apiError.code,
		error: options.exposeDetails ? apiError.stack || apiError.message : undefined,
	};
}

function isApiError(error: unknown): error is ApiError {
	return Boolean(error && typeof error === "object" && "statusCode" in error && "expose" in error);
}

function statusCodeToErrorCode(statusCode: number): string {
	if (statusCode === 404) {
		return "ENDPOINT_NOT_FOUND";
	}
	if (statusCode === 503) {
		return "SERVICE_UNAVAILABLE";
	}
	return "INTERNAL_SERVER_ERROR";
}

function defaultStatusMessage(statusCode: number): string {
	if (statusCode === 404) {
		return "Not Found";
	}
	if (statusCode === 503) {
		return "Service Unavailable";
	}
	return "Internal Server Error";
}
