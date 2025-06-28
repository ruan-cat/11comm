import { describe, it } from "vitest";
import { exportOverExperem, exportPreExperem, type OverExperemExportParams, type PreExperemExportParams } from "./export";

describe("费用提醒导出模块", () => {
	describe("exportOverExperem - 导出到期费用提醒", () => {
		it("调用导出到期费用提醒接口，传入基础参数", async () => {
			const params: OverExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				FileName: "到期费用提醒列表",
			};
			const { execute, data } = exportOverExperem(params);
			const res = await execute();
			console.warn("导出到期费用提醒接口 - 基础参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出到期费用提醒接口，传入完整查询参数", async () => {
			const params: OverExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				BuildingNo: "20130414039",
				Name: "张三",
				Telephone: "12345678900",
				Expenses: "物业费",
				FileName: "到期费用提醒列表-物业费",
			};
			const { execute, data } = exportOverExperem(params);
			const res = await execute();
			console.warn("导出到期费用提醒接口 - 完整参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出到期费用提醒接口，测试按房屋编号导出", async () => {
			const params: OverExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				BuildingNo: "20130414039",
				FileName: "到期费用提醒列表-20130414039",
			};
			const { execute, data } = exportOverExperem(params);
			const res = await execute();
			console.warn("导出到期费用提醒接口 - 按房屋编号导出测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出到期费用提醒接口，测试按业主信息导出", async () => {
			const params: OverExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				Name: "张三",
				Telephone: "12345678900",
				FileName: "到期费用提醒列表-张三",
			};
			const { execute, data } = exportOverExperem(params);
			const res = await execute();
			console.warn("导出到期费用提醒接口 - 按业主信息导出测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出到期费用提醒接口，测试按费用项导出", async () => {
			const params: OverExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				Expenses: "物业费",
				FileName: "到期费用提醒列表-物业费",
			};
			const { execute, data } = exportOverExperem(params);
			const res = await execute();
			console.warn("导出到期费用提醒接口 - 按费用项导出测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});

	describe("exportPreExperem - 导出预缴费用提醒", () => {
		it("调用导出预缴费用提醒接口，传入基础参数", async () => {
			const params: PreExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
			};
			const { execute, data } = exportPreExperem(params);
			const res = await execute();
			console.warn("导出预缴费用提醒接口 - 基础参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出预缴费用提醒接口，传入完整查询参数", async () => {
			const params: PreExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				objName: "20130414039",
				ownerName: "张三",
				link: "121323232",
				feeName: "Water",
			};
			const { execute, data } = exportPreExperem(params);
			const res = await execute();
			console.warn("导出预缴费用提醒接口 - 完整参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出预缴费用提醒接口，测试按房屋编号导出", async () => {
			const params: PreExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				objName: "20130414039",
			};
			const { execute, data } = exportPreExperem(params);
			const res = await execute();
			console.warn("导出预缴费用提醒接口 - 按房屋编号导出测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出预缴费用提醒接口，测试按业主信息导出", async () => {
			const params: PreExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				ownerName: "张三",
				link: "121323232",
			};
			const { execute, data } = exportPreExperem(params);
			const res = await execute();
			console.warn("导出预缴费用提醒接口 - 按业主信息导出测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用导出预缴费用提醒接口，测试按费用项导出", async () => {
			const params: PreExperemExportParams = {
				pageIndex: 1,
				pageSize: 10,
				feeName: "Water",
			};
			const { execute, data } = exportPreExperem(params);
			const res = await execute();
			console.warn("导出预缴费用提醒接口 - 按费用项导出测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});
});

