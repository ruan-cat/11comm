import { test, describe } from "vitest";
import { expect } from "vitest";

import { resolveAdminApiBaseUrl, resolveAdminShadowApiBaseUrl } from "../api-base-url";

describe("admin api base url strategy", () => {
	test("keeps existing base url when shadow api is disabled", () => {
		expect(
			resolveAdminApiBaseUrl({
				VITE_IS_REVERSE_PROXY: "false",
				VITE_PROXY_PREFIX: "/dev-api",
				VITE_BASE_URL: "https://mock.example.com",
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			}),
		).toBe("https://mock.example.com");
	});

	test("resolves shadow api base without changing default base url", () => {
		expect(
			resolveAdminShadowApiBaseUrl({
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_USE_PROXY: "true",
			}),
		).toBe("/api-shadow");
	});
});
