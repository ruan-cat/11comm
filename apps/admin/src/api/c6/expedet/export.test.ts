import { describe, it } from "vitest";
import {
	exportOwnerFeeDetaile,
	exportContractFeeDetaile,
	exportBuildingFeeDetaile,
	type OwnerFeeDetaileExportParams,
	type ContractFeeDetaileExportParams,
	type BuildingFeeDetaileExportParams,
} from "./export";

describe("费用明细导出模块", () => {
	describe("业主费用明细导出", () => {
		it("调用业主费用明细导出接口，不传参数", async () => {
			const { execute, data } = exportOwnerFeeDetaile();
			const res = await execute();
			console.warn("业主费用明细导出接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用业主费用明细导出接口，传入查询参数", async () => {
			const params: OwnerFeeDetaileExportParams = {
				pageIndex: 1,
				pageSize: 10,
				name: "张三",
				room_name: "1001",
				link: "13800138000",
			};
			const { execute, data } = exportOwnerFeeDetaile(params);
			const res = await execute();
			console.warn("业主费用明细导出接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用业主费用明细导出接口，测试分页", async () => {
			const params: OwnerFeeDetaileExportParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = exportOwnerFeeDetaile(params);
			const res = await execute();
			console.warn("业主费用明细导出接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});

	describe("合同费用明细导出", () => {
		it("调用合同费用明细导出接口，不传参数", async () => {
			const { execute, data } = exportContractFeeDetaile();
			const res = await execute();
			console.warn("合同费用明细导出接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用合同费用明细导出接口，传入查询参数", async () => {
			const params: ContractFeeDetaileExportParams = {
				pageIndex: 1,
				pageSize: 10,
				contract_name: "HT2024001",
				name: "张三",
				link: "13800138000",
			};
			const { execute, data } = exportContractFeeDetaile(params);
			const res = await execute();
			console.warn("合同费用明细导出接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用合同费用明细导出接口，测试分页", async () => {
			const params: ContractFeeDetaileExportParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = exportContractFeeDetaile(params);
			const res = await execute();
			console.warn("合同费用明细导出接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});

	describe("房屋费用明细导出", () => {
		it("调用房屋费用明细导出接口，不传参数", async () => {
			const { execute, data } = exportBuildingFeeDetaile();
			const res = await execute();
			console.warn("房屋费用明细导出接口 - 无参数测试", {
				response: res,
				data: data.value,
			});
		});

		it("调用房屋费用明细导出接口，传入查询参数", async () => {
			const params: BuildingFeeDetaileExportParams = {
				pageIndex: 1,
				pageSize: 10,
				room_name: "A1-101",
				name: "张三",
				link: "13800138000",
			};
			const { execute, data } = exportBuildingFeeDetaile(params);
			const res = await execute();
			console.warn("房屋费用明细导出接口 - 带参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用房屋费用明细导出接口，测试分页", async () => {
			const params: BuildingFeeDetaileExportParams = {
				pageIndex: 2,
				pageSize: 5,
			};
			const { execute, data } = exportBuildingFeeDetaile(params);
			const res = await execute();
			console.warn("房屋费用明细导出接口 - 分页测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});
}); 