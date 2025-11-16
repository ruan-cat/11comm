import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryOwnerDetail, queryBuildingDetail, queryContractDetail, queryCarDetail } from "./expedet";

describe("费用明细查询模块", () => {
	// ==================== 业主明细查询测试 ====================
	describe("queryOwnerDetail", () => {
		it("调用业主明细查询接口，不传参数", async () => {
			const { execute, data } = queryOwnerDetail({
				onSuccess(data) {
					console.warn("queryOwnerDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryOwnerDetail onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用业主明细查询接口，传入查询参数", async () => {
			const { execute, data } = queryOwnerDetail({
				onSuccess(data) {
					console.warn("queryOwnerDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryOwnerDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 1,
					pageSize: 10,
					start_time: "2024-01-01",
					end_time: "2024-12-31",
					room_name: "1001",
					name: "张三",
					link: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用业主明细查询接口，测试分页", async () => {
			const { execute, data } = queryOwnerDetail({
				onSuccess(data) {
					console.warn("queryOwnerDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryOwnerDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 5,
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	// ==================== 房屋明细查询测试 ====================
	describe("queryBuildingDetail", () => {
		it("调用房屋明细查询接口，不传参数", async () => {
			const { execute, data } = queryBuildingDetail({
				onSuccess(data) {
					console.warn("queryBuildingDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryBuildingDetail onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用房屋明细查询接口，传入查询参数", async () => {
			const { execute, data } = queryBuildingDetail({
				onSuccess(data) {
					console.warn("queryBuildingDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryBuildingDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 1,
					pageSize: 10,
					start_time: "2024-01-01",
					end_time: "2024-12-31",
					room_name: "A1-101",
					name: "张三",
					link: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用房屋明细查询接口，测试分页", async () => {
			const { execute, data } = queryBuildingDetail({
				onSuccess(data) {
					console.warn("queryBuildingDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryBuildingDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 5,
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	// ==================== 合同明细查询测试 ====================
	describe("queryContractDetail", () => {
		it("调用合同费用明细查询接口，不传参数", async () => {
			const { execute, data } = queryContractDetail({
				onSuccess(data) {
					console.warn("queryContractDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryContractDetail onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用合同费用明细查询接口，传入查询参数", async () => {
			const { execute, data } = queryContractDetail({
				onSuccess(data) {
					console.warn("queryContractDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryContractDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 1,
					pageSize: 10,
					start_time: "2024-01-01",
					end_time: "2024-12-31",
					contract_num: "HT2024001",
					name: "张三",
					link: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用合同费用明细查询接口，测试分页", async () => {
			const { execute, data } = queryContractDetail({
				onSuccess(data) {
					console.warn("queryContractDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryContractDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 5,
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	// ==================== 车辆明细查询测试 ====================
	describe("queryCarDetail", () => {
		it("调用车辆明细查询接口，不传参数", async () => {
			const { execute, data } = queryCarDetail({
				onSuccess(data) {
					console.warn("queryCarDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryCarDetail onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用车辆明细查询接口，传入查询参数", async () => {
			const { execute, data } = queryCarDetail({
				onSuccess(data) {
					console.warn("queryCarDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryCarDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 1,
					pageSize: 10,
					start_time: "2024-01-01",
					end_time: "2024-12-31",
					car_num: "京A12345",
					name: "张三",
					link: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用车辆明细查询接口，测试分页", async () => {
			const { execute, data } = queryCarDetail({
				onSuccess(data) {
					console.warn("queryCarDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("queryCarDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 5,
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});
});
