import { describe, expect, test } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryPayDet } from "./index";

describe("queryPayDet 接口测试", () => {
	test("基础调用", async () => {
		let hasError = false;
		const { execute, data } = queryPayDet({
			onSuccess(data) {
				console.warn("queryPayDet onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("queryPayDet onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("带参数调用", async () => {
		let hasError = false;
		const { execute, data } = queryPayDet({
			onSuccess(data) {
				console.warn("queryPayDet onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("queryPayDet onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				paymentStartTime: "2024-01-01",
				paymentEndTime: "2024-01-31",
				paymentMethod: "微信支付",
				expenseStatus: "已缴费",
				houseOrPlateNumber: "1001",
				expenseType: "物业费",
				chargeItem: "月度物业费",
				chargeStartTime: "2024-01-01",
				chargeEndTime: "2024-01-31",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
