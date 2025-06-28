import { describe, it } from "vitest";
import {
	queryChargeItemList,
	queryFeeItemList,
	queryFeeItemLog,
	addFeeItem,
	modifyFeeItem,
	deleteFeeItem,
	queryDiscountList,
	addDiscount,
	deleteDiscount,
	getFeeItemInfo,
} from "./Expense-item-settings";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { AxiosRequestConfig } from "axios";

describe("费用项设置接口测试", () => {
	it("获取费用项名称列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					community_id: "922025052064590009",
					feeType: "888800010012",
				},
			},
		};

		const { execute, data } = queryChargeItemList(options);

		await execute();
		console.warn("获取费用项名称列表", data.value);
	});

	it("获取费用项列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					community_id: "922025052064590009",
					fee_type_cd: "888800010012",
					feeId: "922025052064590009",
					chargeItem: "物业费",
					fee_flag: "2006012",
					payment_cd: "1200",
					deduct_from: "1",
				},
			},
		};

		const { execute, data } = queryFeeItemList(options);

		await execute();
		console.warn("获取费用项列表", data.value);
	});

	it("获取费用项修改记录", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					config_id: "d934050a8bb373e8f8eed0bf7507ec17",
				},
			},
		};

		const { execute, data } = queryFeeItemLog(options);

		await execute();
		console.warn("获取费用项修改记录", data.value);
	});

	it("添加费用项", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_type_cd: "888800010012",
					fee_flag: "2006012",
					payment_cycle: "1",
					fee_name: "物业费",
					payment_cd: "1200",
					prepayment_period: "1",
					start_time: "2024-03-20",
					end_time: "2024-12-31",
					units: "元/月",
					deduct_from: "1",
					pay_online: "1",
					scale: "1",
					decimal_place: 2,
					computing_formula: "面积*单价",
					square_price: "3.5",
					additional_amount: "0",
					community_id: "922025052064590009",
				},
			},
		};

		const { execute, data } = addFeeItem(options);

		await execute();
		console.warn("添加费用项", data.value);
	});

	it("修改费用项", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_type_cd: "888800010012",
					fee_flag: "2006012",
					payment_cycle: "1",
					fee_name: "修改后的物业费",
					payment_cd: "1200",
					prepayment_period: "1",
					start_time: "2024-03-20",
					end_time: "2024-12-31",
					units: "元/月",
					deduct_from: "1",
					pay_online: "1",
					scale: "1",
					decimal_place: 2,
					computing_formula: "面积*单价",
					square_price: "4.0",
					additional_amount: "0",
					community_id: "922025052064590009",
					config_id: "d934050a8bb373e8f8eed0bf7507ec17",
				},
			},
		};

		const { execute, data } = modifyFeeItem(options);

		await execute();
		console.warn("修改费用项", data.value);
	});

	it("删除费用项", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					config_id: "d934050a8bb373e8f8eed0bf7507ec17",
				},
			},
		};

		const { execute, data } = deleteFeeItem(options);

		await execute();
		console.warn("删除费用项", data.value);
	});

	it("获取折扣信息", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					discount_name: "testBewater",
					discount_rule: "test",
					discount_type: "weiyue",
					start_time: "2024.1",
					end_time: "2025.2",
					discount_end_time: "2025.3",
				},
			},
		};

		const { execute, data } = queryDiscountList(options);

		await execute();
		console.warn("获取折扣信息", data.value);
	});

	it("添加折扣", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					discount_type: "weiyue",
					discount_name: "testBewater",
					start_time: "2024.1",
					end_time: "2025.2",
					discount_end_time: "2025.3",
				},
			},
		};

		const { execute, data } = addDiscount(options);

		await execute();
		console.warn("添加折扣", data.value);
	});

	it("删除折扣", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					discount_id: "d934050a8bb373e8f8eed0bf7507ec17",
				},
			},
		};

		const { execute, data } = deleteDiscount(options);

		await execute();
		console.warn("删除折扣", data.value);
	});

	it("获取费用项基础信息", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_id: "922025052064590009",
					fee_type: "888800010012",
					fee_project: "物业费",
					fee_flag: "2006012",
					urge_type: "1",
					pay_type: "1200",
					pay_cycle: "1",
					valid_time: "2024-03-20",
					pay_formula: "面积*单价",
					pay_price: "3.5",
					pay_extra: "0",
					account_deduction: "1",
				},
			},
		};

		const { execute, data } = getFeeItemInfo(options);

		await execute();
		console.warn("获取费用项基础信息", data.value);
	});
});
