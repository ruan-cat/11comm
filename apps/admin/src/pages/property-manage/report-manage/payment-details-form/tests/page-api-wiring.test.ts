import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const pageSourcePath = resolve(__dirname, "../index.vue");

describe("payment-details-form page api wiring", () => {
	test("uses the shadow-aware list query hook instead of local mock table data", () => {
		const source = readFileSync(pageSourcePath, "utf8");

		expect(source).toContain("usePaymentDetailsFormListQuery");
		expect(source).not.toContain("mockTableData");
	});
});
