import { test, describe } from "vitest";
import { expect } from "vitest";

import * as apiBaseUrl from "../api-base-url";
import {
	isAdminApiShadowEnabled,
	resolveAdminApiBaseUrl,
	resolveAdminShadowApiBaseUrl,
	type AdminApiBaseEnv,
} from "../api-base-url";

type AdminApiRequestUrlResolver = (path: string, env: AdminApiBaseEnv) => string;

function resolveAdminApiRequestUrl(path: string, env: AdminApiBaseEnv) {
	return (
		apiBaseUrl as typeof apiBaseUrl & {
			resolveAdminApiRequestUrl?: AdminApiRequestUrlResolver;
		}
	).resolveAdminApiRequestUrl?.(path, env);
}

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

	test("uses reverse proxy prefix for the admin http client when reverse proxy is enabled", () => {
		expect(
			resolveAdminApiBaseUrl({
				VITE_IS_REVERSE_PROXY: "true",
				VITE_PROXY_PREFIX: "/dev-api",
				VITE_BASE_URL: "https://mock.example.com",
			}),
		).toBe("/dev-api");
	});

	test("uses vite base url and empty default for the admin http client", () => {
		expect(resolveAdminApiBaseUrl({ VITE_BASE_URL: "https://mock.example.com" })).toBe("https://mock.example.com");
		expect(resolveAdminApiBaseUrl({})).toBe("");
	});

	test("resolves shadow api base through the admin dev proxy", () => {
		expect(
			resolveAdminShadowApiBaseUrl({
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_USE_PROXY: "true",
			}),
		).toBe("/api-shadow");
	});

	test("resolves shadow api base through the direct apps/api base url", () => {
		expect(
			resolveAdminShadowApiBaseUrl({
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_USE_PROXY: "false",
			}),
		).toBe("http://127.0.0.1:3102");
	});

	test("enables admin shadow api only when the flag is true", () => {
		expect(isAdminApiShadowEnabled({ VITE_11COMM_API_SHADOW_ENABLE: "true" })).toBe(true);
		expect(isAdminApiShadowEnabled({ VITE_11COMM_API_SHADOW_ENABLE: "false" })).toBe(false);
		expect(isAdminApiShadowEnabled({})).toBe(false);
	});

	test("keeps module request urls on legacy relative api paths when shadow is disabled", () => {
		expect(
			resolveAdminApiRequestUrl("/api/property-manage/expense-manage/house-charge/list", {
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			}),
		).toBe("/api/property-manage/expense-manage/house-charge/list");
	});

	test("resolves module request urls through the admin shadow proxy when enabled", () => {
		expect(
			resolveAdminApiRequestUrl("/api/property-manage/expense-manage/house-charge/list", {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			}),
		).toBe("/api-shadow/api/property-manage/expense-manage/house-charge/list");
	});

	test("resolves module request urls through the direct apps/api base url when enabled", () => {
		expect(
			resolveAdminApiRequestUrl("/api/property-manage/expense-manage/house-charge/list", {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "false",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			}),
		).toBe("http://127.0.0.1:3102/api/property-manage/expense-manage/house-charge/list");
	});
});
