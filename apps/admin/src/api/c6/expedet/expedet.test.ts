import { describe, it } from "vitest";
import {
	queryOwnerDetail,
	type OwnerFeeDetaileQueryParams,
	queryBuildingDetail,
	type BuildingFeeDetaileQueryParams,
	queryContractDetail,
	type ContractFeeDetaileQueryParams,
	queryCarDetail,
	type CarFeeDetaileQueryParams,
} from "./expedet";

describe("费用明细查询模块", () => {
	// ==================== 业主明细查询测试 ====================
	describe("queryOwnerDetail", () => {
		it("调用业主明细查询接口，不传参数", async () => {
			const { execute, data } = queryOwnerDetail();
			const res = await execute();
			console.warn("业主明细查询接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用业主明细查询接口，传入查询参数", async () => {
			const params: OwnerFeeDetaileQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				start_time: "2024-01-01",
				end_time: "2024-12-31",
				room_name: "1001",
				name: "张三",
				link: "13800138000",
			};
			const { execute, data } = queryOwnerDetail({
				data: params,
			});
			const res = await execute();
			console.warn("业主明细查询接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用业主明细查询接口，测试分页", async () => {
			const params: OwnerFeeDetaileQueryParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = queryOwnerDetail({
				data: params,
			});
			const res = await execute();
			console.warn("业主明细查询接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});

	// ==================== 房屋明细查询测试 ====================
	describe("queryBuildingDetail", () => {
		it("调用房屋明细查询接口，不传参数", async () => {
			const { execute, data } = queryBuildingDetail();
			const res = await execute();
			console.warn("房屋明细查询接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用房屋明细查询接口，传入查询参数", async () => {
			const params: BuildingFeeDetaileQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				start_time: "2024-01-01",
				end_time: "2024-12-31",
				room_name: "A1-101",
				name: "张三",
				link: "13800138000",
			};
			const { execute, data } = queryBuildingDetail({
				data: params,
			});
			const res = await execute();
			console.warn("房屋明细查询接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用房屋明细查询接口，测试分页", async () => {
			const params: BuildingFeeDetaileQueryParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = queryBuildingDetail({
				data: params,
			});
			const res = await execute();
			console.warn("房屋明细查询接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});

	// ==================== 合同明细查询测试 ====================
	describe("queryContractDetail", () => {
		it("调用合同费用明细查询接口，不传参数", async () => {
			const { execute, data } = queryContractDetail();
			const res = await execute();
			console.warn("合同费用明细查询接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用合同费用明细查询接口，传入查询参数", async () => {
			const params: ContractFeeDetaileQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				start_time: "2024-01-01",
				end_time: "2024-12-31",
				contract_num: "HT2024001",
				name: "张三",
				link: "13800138000",
			};
			const { execute, data } = queryContractDetail({
				data: params,
			});
			const res = await execute();
			console.warn("合同费用明细查询接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用合同费用明细查询接口，测试分页", async () => {
			const params: ContractFeeDetaileQueryParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = queryContractDetail({
				data: params,
			});
			const res = await execute();
			console.warn("合同费用明细查询接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});

	// ==================== 车辆明细查询测试 ====================
	describe("queryCarDetail", () => {
		it("调用车辆明细查询接口，不传参数", async () => {
			const { execute, data } = queryCarDetail();
			const res = await execute();
			console.warn("车辆明细查询接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用车辆明细查询接口，传入查询参数", async () => {
			const params: CarFeeDetaileQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				start_time: "2024-01-01",
				end_time: "2024-12-31",
				car_num: "京A12345",
				name: "张三",
				link: "13800138000",
			};
			const { execute, data } = queryCarDetail({
				data: params,
			});
			const res = await execute();
			console.warn("车辆明细查询接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用车辆明细查询接口，测试分页", async () => {
			const params: CarFeeDetaileQueryParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = queryCarDetail({
				data: params,
			});
			const res = await execute();
			console.warn("车辆明细查询接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});
});
