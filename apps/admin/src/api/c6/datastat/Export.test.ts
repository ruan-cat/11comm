import { describe, it, expect } from "vitest";
import {
	exportFeeDetail,
	exportChargeDetail,
	exportMonthDetail,
	exportReceiptsStat,
	exportReceiptsDetail,
	exportPaymentMethod,
	exportArrearsStat,
	exportMonthFee,
	type FeeDetailExportQueryParams,
	type ChargeDetailExportQueryParams,
	type MonthDetailExportQueryParams,
	type ReceiptsExportQueryParams,
	type ReceiptsDetailExportQueryParams,
	type MonthFeeQueryParams,
} from "./Export";

describe("导出接口测试", () => {
	describe("欠费明细导出", () => {
		it("调用欠费明细导出接口，仅传入必填参数", async () => {
			const params: FeeDetailExportQueryParams = {
				pageIndex: 1,
				pageSize: 10,
			};
			const { execute } = exportFeeDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});

		it("调用欠费明细导出接口，按房屋筛选", async () => {
			const params: FeeDetailExportQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				room_name: "1001",
			};
			const { execute } = exportFeeDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});

		it("调用欠费明细导出接口，按业主筛选", async () => {
			const params: FeeDetailExportQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				name: "张三",
				link: "13800138000",
			};
			const { execute } = exportFeeDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("收缴情况导出", () => {
		it("调用收缴情况导出接口，传入完整参数", async () => {
			const params: ChargeDetailExportQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				fee_name: "物业费",
			};
			const { execute } = exportChargeDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});

		it("调用收缴情况导出接口，传入不同费用类型", async () => {
			const params: ChargeDetailExportQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				fee_name: "水电费",
			};
			const { execute } = exportChargeDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("月度明细导出", () => {
		it("调用月度明细导出接口，导出收款明细", async () => {
			const params: MonthDetailExportQueryParams = {
				communityId: "test-community-id",
				startDate: "2024-01-01",
				endDate: "2024-01-31",
				exportType: 1, // 导出收款明细
			};
			const { execute } = exportMonthDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});

		it("调用月度明细导出接口，导出欠费明细", async () => {
			const params: MonthDetailExportQueryParams = {
				communityId: "test-community-id",
				startDate: "2024-01-01",
				endDate: "2024-01-31",
				exportType: 2, // 导出欠费明细
			};
			const { execute } = exportMonthDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("收款统计导出", () => {
		it("调用收款统计导出接口，传入完整参数", async () => {
			const params: ReceiptsExportQueryParams = {
				communityId: "test-community-id",
				startDate: "2024-01-01",
				endDate: "2024-01-31",
				communityName: "测试社区",
			};
			const { execute } = exportReceiptsStat(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});

		it("调用收款统计导出接口，仅传入必填参数", async () => {
			const params: ReceiptsExportQueryParams = {
				communityId: "test-community-id",
			};
			const { execute } = exportReceiptsStat(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("收款明细导出", () => {
		it("调用收款明细导出接口", async () => {
			const params: ReceiptsDetailExportQueryParams = {
				communityId: "test-community-id",
				startDate: "2024-01-01",
				endDate: "2024-01-31",
			};
			const { execute } = exportReceiptsDetail(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("缴费方式统计导出", () => {
		it("调用缴费方式统计导出接口", async () => {
			const params = {
				communityId: "test-community-id",
				startDate: "2024-01-01",
				endDate: "2024-01-31",
			};
			const { execute } = exportPaymentMethod(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("欠费统计导出", () => {
		it("调用欠费统计导出接口", async () => {
			const { execute } = exportArrearsStat();
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});

	describe("月欠费明细导出", () => {
		it("调用月欠费明细导出接口", async () => {
			const params: MonthFeeQueryParams = {
				pageIndex: 1,
				pageSize: 10,
				fee_name: "物业费",
				building: "A栋",
				start_time: "2024-01-01",
				end_time: "2024-12-31",
			};
			const { execute } = exportMonthFee(params);
			const res = await execute();
			expect(res).toBeDefined();
			// 根据实际返回数据结构进行断言
		});
	});
}); 