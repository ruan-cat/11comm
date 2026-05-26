import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		getMethod: vi.fn(),
		getQuery: vi.fn(),
		getRequestURL: vi.fn(),
		readBody: vi.fn(),
		setResponseStatus: vi.fn((event: Record<string, any>, statusCode: number) => {
			event.res ??= {};
			event.res.statusCode = statusCode;
		}),
	};
});

vi.mock("../../server/shared/runtime/observability", () => ({
	apiLogger: {
		info: vi.fn(),
		error: vi.fn(),
	},
	logApiRequest: vi.fn(),
	logApiError: vi.fn(),
}));

const { getMethod, getQuery, getRequestURL, readBody, setResponseStatus } = await import("nitro/h3");
const legacyDispatchHandler = (await import("../../server/handlers/legacy-dispatch")).default;

const mockedGetMethod = vi.mocked(getMethod);
const mockedGetQuery = vi.mocked(getQuery);
const mockedGetRequestURL = vi.mocked(getRequestURL);
const mockedReadBody = vi.mocked(readBody);
const mockedSetResponseStatus = vi.mocked(setResponseStatus);

const fallbackBaseUrlSnapshot = process.env.PHASE7_LEGACY_APP_FALLBACK_BASE_URL;
const detailedErrorsSnapshot = process.env.NITRO_PUBLIC_ENABLE_DETAILED_ERRORS;

describe("legacy-dispatch fallback drill", () => {
	beforeEach(() => {
		process.env.PHASE7_LEGACY_APP_FALLBACK_BASE_URL = "http://127.0.0.1:9";
		process.env.NITRO_PUBLIC_ENABLE_DETAILED_ERRORS = "false";
		mockedGetMethod.mockReset();
		mockedGetQuery.mockReset();
		mockedGetRequestURL.mockReset();
		mockedReadBody.mockReset();
		mockedSetResponseStatus.mockClear();
	});

	afterEach(() => {
		restoreOptionalEnv("PHASE7_LEGACY_APP_FALLBACK_BASE_URL", fallbackBaseUrlSnapshot);
		restoreOptionalEnv("NITRO_PUBLIC_ENABLE_DETAILED_ERRORS", detailedErrorsSnapshot);
		vi.restoreAllMocks();
	});

	test("registered exact legacy endpoint is served by apps/api registry when fallback is unreachable", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch");
		mockLegacyGetRequest("/app/floor.queryFloors", { communityId: "COMM_001", page: 1, row: 2 });

		const response = await legacyDispatchHandler(createEvent());

		expect(fetchSpy).not.toHaveBeenCalled();
		expect(mockedSetResponseStatus).not.toHaveBeenCalled();
		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
				hasMore: expect.any(Boolean),
			},
		});
		const data = response.data as { list: Array<{ communityId: string }> };
		expect(data.list).toHaveLength(2);
		expect(data.list.every((floor) => floor.communityId === "COMM_001")).toBe(true);
	});

	test("unregistered app legacy endpoint reaches fallback and returns legacy failure when fallback is unreachable", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("fallback unavailable"));
		mockLegacyGetRequest("/app/task815.unregisteredFallbackProbe");

		const response = await legacyDispatchHandler(createEvent());

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe("http://127.0.0.1:9/app/task815.unregisteredFallbackProbe");
		expect(mockedSetResponseStatus).toHaveBeenCalledWith(expect.any(Object), 404);
		expect(response).toMatchObject({
			code: 404,
			msg: "Endpoint not found: GET /app/task815.unregisteredFallbackProbe",
			data: null,
			errorCode: "ENDPOINT_NOT_FOUND",
		});
	});
});

function mockLegacyGetRequest(path: string, query: Record<string, unknown> = {}) {
	mockedGetMethod.mockReturnValue("GET");
	mockedGetQuery.mockReturnValue(query);
	mockedGetRequestURL.mockReturnValue(new URL(`http://apps-api.test${path}`));
}

function createEvent() {
	return {
		req: {
			headers: new Headers({ "x-request-id": "fallback-drill-request" }),
		},
		res: {
			headers: new Headers(),
		},
		context: {},
	} as any;
}

function restoreOptionalEnv(name: string, value: string | undefined) {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}
