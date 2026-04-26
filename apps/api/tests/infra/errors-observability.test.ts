import { test, describe } from "vitest";
import { expect, vi } from "vitest";

import { buildErrorResponse, createApiError, getErrorStatusCode, toApiError } from "../../server/shared/runtime/errors";
import { getApiRequestContext, initializeApiRequestContext } from "../../server/shared/runtime/request-context";
import { logApiError, logApiRequest } from "../../server/shared/runtime/observability";

describe("api errors and observability", () => {
	test("initializes request id from inbound header and writes it to response headers", () => {
		const event = {
			req: { headers: new Headers({ "x-request-id": "incoming-request-id" }) },
			res: { headers: new Headers() },
			context: {},
		};

		const context = initializeApiRequestContext(event as any);

		expect(context.requestId).toBe("incoming-request-id");
		expect(event.res.headers.get("x-request-id")).toBe("incoming-request-id");
		expect(getApiRequestContext(event as any)).toMatchObject({ requestId: "incoming-request-id" });
	});

	test("normalizes unknown errors into public error responses", () => {
		const apiError = toApiError(new Error("database down"));
		const response = buildErrorResponse(apiError, { requestId: "req_1", exposeDetails: false });

		expect(getErrorStatusCode(apiError)).toBe(500);
		expect(response).toMatchObject({
			success: false,
			code: 500,
			message: "Internal Server Error",
			data: null,
			requestId: "req_1",
		});
		expect(response.error).toBeUndefined();
	});

	test("preserves public api error status and logs structured fields", () => {
		const logger = { info: vi.fn(), error: vi.fn() };
		const error = createApiError("Missing endpoint", 404, { expose: true, code: "ENDPOINT_NOT_FOUND" });

		logApiRequest(logger as any, {
			requestId: "req_2",
			method: "GET",
			path: "/app/missing",
			statusCode: 404,
			durationMs: 12,
		});
		logApiError(logger as any, error, {
			requestId: "req_2",
			method: "GET",
			path: "/app/missing",
		});

		expect(buildErrorResponse(error, { requestId: "req_2" })).toMatchObject({
			success: false,
			code: 404,
			message: "Missing endpoint",
			errorCode: "ENDPOINT_NOT_FOUND",
		});
		expect(logger.info).toHaveBeenCalledWith(expect.objectContaining({ requestId: "req_2", statusCode: 404 }));
		expect(logger.error).toHaveBeenCalledWith(
			expect.objectContaining({ requestId: "req_2", errorCode: "ENDPOINT_NOT_FOUND" }),
		);
	});
});
