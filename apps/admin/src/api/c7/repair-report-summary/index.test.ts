import { describe, it } from "vitest";
import { queryRepairReportSummary, type RepairReportSummaryQueryParams } from "./index";

describe("报修汇总列表模块", () => {
	describe("queryRepairReportSummary", () => {
		it("调用报修汇总列表查询接口，传入基础参数", async () => {
			const params: RepairReportSummaryQueryParams = {
				pageIndex: 1,
				pageSize: 10,
			};
			const { execute, data } = queryRepairReportSummary(params);
			const res = await execute();
			console.warn("报修汇总列表查询接口 - 基础参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用报修汇总列表查询接口，传入完整查询参数", async () => {
			const params: RepairReportSummaryQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				createStartTime: "2024-01-01",
				createEndTime: "2024-01-31",
				finishStartTime: "2024-01-01",
				finishEndTime: "2024-01-31",
				communityName: "测试小区",
				staffName: "张三",
				state: "处理中",
			};
			const { execute, data } = queryRepairReportSummary(params);
			const res = await execute();
			console.warn("报修汇总列表查询接口 - 完整参数测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用报修汇总列表查询接口，测试按时间范围查询", async () => {
			const params: RepairReportSummaryQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				createStartTime: "2024-01-01",
				createEndTime: "2024-01-31",
			};
			const { execute, data } = queryRepairReportSummary(params);
			const res = await execute();
			console.warn("报修汇总列表查询接口 - 按时间范围查询测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用报修汇总列表查询接口，测试按完结时间范围查询", async () => {
			const params: RepairReportSummaryQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				finishStartTime: "2024-01-01",
				finishEndTime: "2024-01-31",
			};
			const { execute, data } = queryRepairReportSummary(params);
			const res = await execute();
			console.warn("报修汇总列表查询接口 - 按完结时间范围查询测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用报修汇总列表查询接口，测试按小区和员工查询", async () => {
			const params: RepairReportSummaryQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				communityName: "测试小区",
				staffName: "张三",
			};
			const { execute, data } = queryRepairReportSummary(params);
			const res = await execute();
			console.warn("报修汇总列表查询接口 - 按小区和员工查询测试", {
				params,
				response: res,
				data: data.value,
			});
		});

		it("调用报修汇总列表查询接口，测试按状态查询", async () => {
			const params: RepairReportSummaryQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				state: "处理中",
			};
			const { execute, data } = queryRepairReportSummary(params);
			const res = await execute();
			console.warn("报修汇总列表查询接口 - 按状态查询测试", {
				params,
				response: res,
				data: data.value,
			});
		});
	});
}); 