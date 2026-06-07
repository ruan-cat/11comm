import { test, describe } from "vitest";
import { expect } from "vitest";

import { asRecord, mergeInput } from "../../server/shared/runtime/legacy-endpoint-input";

describe("legacy endpoint input runtime", () => {
	test("merges query and body records with body taking precedence", () => {
		expect(
			mergeInput(
				{
					page: "1",
					orderId: "QUERY_ORDER",
				},
				{
					orderId: "BODY_ORDER",
					auditResult: "approved",
				},
			),
		).toEqual({
			page: "1",
			orderId: "BODY_ORDER",
			auditResult: "approved",
		});
	});

	test("drops non-object query and body values before dispatching legacy handlers", () => {
		expect(asRecord(null)).toEqual({});
		expect(asRecord(["invalid"])).toEqual({});
		expect(asRecord("invalid")).toEqual({});
		expect(mergeInput("invalid", ["also invalid"])).toEqual({});
	});
});
