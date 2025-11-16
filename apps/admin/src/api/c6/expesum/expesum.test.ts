import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { expesumQuery, expesumQueryBuildingRates, expesumQueryFeeItemRates, expesumExport } from "./expesum";

describe("费用汇总模块", () => {
	describe("expesumQuery", () => {
		it("调用费用汇总查询接口，不传参数", async () => {
			const { execute, data } = expesumQuery({
				onSuccess(data) {
					console.warn("expesumQuery onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumQuery onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用费用汇总查询接口，传入查询参数", async () => {
			const { execute, data } = expesumQuery({
				onSuccess(data) {
					console.warn("expesumQuery onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumQuery onError", error);
				},
			});
			await execute({
				data: {
					timeBegin: "2025-01-01",
					timeEnd: "2025-12-31",
					ownerName: "张三",
					buildNumber: "A1",
					ownerPhone: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("expesumQueryBuildingRates", () => {
		it("调用楼栋收费率查询接口，不传参数", async () => {
			const { execute, data } = expesumQueryBuildingRates({
				onSuccess(data) {
					console.warn("expesumQueryBuildingRates onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumQueryBuildingRates onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用楼栋收费率查询接口，传入查询参数", async () => {
			const { execute, data } = expesumQueryBuildingRates({
				onSuccess(data) {
					console.warn("expesumQueryBuildingRates onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumQueryBuildingRates onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					buildingName: "A栋",
					startDate: "2025-01-01",
					endDate: "2025-12-31",
					ownerName: "张三",
					ownerNumber: "13800138000",
					communityIds: "123",
					feeTypes: "物业费",
					roomNum: "A1-101",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("expesumQueryFeeItemRates", () => {
		it("调用费用项目费率查询接口，不传参数", async () => {
			const { execute, data } = expesumQueryFeeItemRates({
				onSuccess(data) {
					console.warn("expesumQueryFeeItemRates onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumQueryFeeItemRates onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用费用项目费率查询接口，传入查询参数", async () => {
			const { execute, data } = expesumQueryFeeItemRates({
				onSuccess(data) {
					console.warn("expesumQueryFeeItemRates onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumQueryFeeItemRates onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					buildingName: "A栋",
					startDate: "2025-01-01",
					endDate: "2025-12-31",
					ownerName: "张三",
					ownerNumber: "13800138000",
					communityIds: "123",
					feeTypes: "物业费",
					roomNum: "A1-101",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("expesumExport", () => {
		it("调用费用汇总导出接口，不传参数", async () => {
			const { execute, data } = expesumExport({
				onSuccess(data) {
					console.warn("expesumExport onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumExport onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用费用汇总导出接口，传入查询参数", async () => {
			const { execute, data } = expesumExport({
				onSuccess(data) {
					console.warn("expesumExport onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("expesumExport onError", error);
				},
			});
			await execute({
				data: {
					timeBegin: "2025-01-01",
					timeEnd: "2025-12-31",
					ownerName: "张三",
					buildNumber: "A1",
					ownerPhone: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});
});
