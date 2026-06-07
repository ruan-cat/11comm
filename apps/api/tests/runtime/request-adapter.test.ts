import { test, describe } from "vitest";
import { beforeEach, expect, vi } from "vitest";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		getMethod: vi.fn(),
		getQuery: vi.fn(),
		getRequestURL: vi.fn(),
		readBody: vi.fn(),
	};
});

const { getMethod, getQuery, getRequestURL, readBody } = await import("nitro/h3");
const { toEndpointDispatchInput } = await import("../../server/shared/runtime/request-adapter");

const mockedGetMethod = vi.mocked(getMethod);
const mockedGetQuery = vi.mocked(getQuery);
const mockedGetRequestURL = vi.mocked(getRequestURL);
const mockedReadBody = vi.mocked(readBody);

describe("request adapter runtime", () => {
	beforeEach(() => {
		mockedGetMethod.mockReset();
		mockedGetQuery.mockReset();
		mockedGetRequestURL.mockReset();
		mockedReadBody.mockReset();
	});

	test("normalizes GET event into dispatch input without reading body", async () => {
		const event = createEvent();
		mockedGetMethod.mockReturnValue("get");
		mockedGetQuery.mockReturnValue({ orderId: "WO_001", page: "1" });
		mockedGetRequestURL.mockReturnValue(new URL("https://api.test/app/workorder/detail?orderId=WO_001&page=1"));

		const input = await toEndpointDispatchInput(event);

		expect(mockedReadBody).not.toHaveBeenCalled();
		expect(input).toEqual({
			method: "GET",
			path: "/app/workorder/detail",
			query: { orderId: "WO_001", page: "1" },
			body: undefined,
			event,
		});
	});

	test("keeps POST body and request path for dispatch input", async () => {
		const event = createEvent();
		const body = { orderId: "WO_001", auditResult: "approved" };
		mockedGetMethod.mockReturnValue("post");
		mockedGetQuery.mockReturnValue({ traceId: "TRACE_001" });
		mockedGetRequestURL.mockReturnValue(new URL("https://api.test/app/workorder/detail?traceId=TRACE_001"));
		mockedReadBody.mockResolvedValue(body);

		const input = await toEndpointDispatchInput(event);

		expect(mockedReadBody).toHaveBeenCalledWith(event);
		expect(input).toEqual({
			method: "POST",
			path: "/app/workorder/detail",
			query: { traceId: "TRACE_001" },
			body,
			event,
		});
	});
});

function createEvent() {
	return {
		req: {
			headers: new Headers({ "x-request-id": "request-adapter-test" }),
		},
		res: {
			headers: new Headers(),
		},
		context: {},
	} as any;
}
