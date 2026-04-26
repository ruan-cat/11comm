import { test, describe } from "vitest";
import { expect } from "vitest";

import { applyStandardHeaders, buildCorsHeaders, isOriginAllowed } from "../../server/shared/runtime/cors";

describe("api cors policy", () => {
	test("allows configured origins only when a list is present", () => {
		expect(isOriginAllowed("https://app.example.com", ["https://app.example.com"])).toBe(true);
		expect(isOriginAllowed("https://other.example.com", ["https://app.example.com"])).toBe(false);
	});

	test("does not use wildcard when credentials are enabled", () => {
		const headers = buildCorsHeaders({
			origin: "https://app.example.com",
			allowedOrigins: [],
			credentials: true,
		});

		expect(headers["access-control-allow-origin"]).toBe("https://app.example.com");
		expect(headers["access-control-allow-credentials"]).toBe("true");
		expect(headers["access-control-allow-origin"]).not.toBe("*");
	});

	test("builds preflight and standard response headers", () => {
		const headers = buildCorsHeaders({
			origin: "https://app.example.com",
			allowedOrigins: ["https://app.example.com"],
			requestHeaders: "content-type,x-request-id",
			preflight: true,
		});

		expect(headers).toMatchObject({
			"access-control-allow-origin": "https://app.example.com",
			"access-control-allow-methods": expect.stringContaining("OPTIONS"),
			"access-control-allow-headers": "content-type,x-request-id",
			vary: "Origin",
		});
	});

	test("writes headers to plain test events", () => {
		const event = { res: { headers: new Headers() } };

		applyStandardHeaders(event as any, {
			"x-request-id": "req_test",
			"access-control-allow-origin": "https://app.example.com",
		});

		expect(event.res.headers.get("x-request-id")).toBe("req_test");
		expect(event.res.headers.get("access-control-allow-origin")).toBe("https://app.example.com");
	});
});
