import { describe, it } from "vitest";
import {
	addHouseFee,
	modifyHouseFee,
	deleteHouseFee,
	payHouseFee,
	queryHouseFeeList,
	getHouseFeeDetail,
	getHouseFeeItems,
	getPaymentRecords,
} from ".";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { AxiosRequestConfig } from "axios";

describe("房屋收费接口测试", () => {
	it("创建房屋费用", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					house_id: "001-001-01",
					fee_type: "物业费",
					charge_project: "房屋管理费",
					start_time: "2025-01-12",
					end_time: "2025-01-12",
					amount: 100,
					config_id: "92202305221013595234000152",
				},
			},
		};

		const { execute, data } = addHouseFee(options);

		await execute();
		console.warn("创建房屋费用", data.value);
	});

	it("变更房屋费用", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_id: "12238832129789792256",
					create_time: "2025-05-21 00:00:00",
					start_time: "2025-05-21 23:59:55",
					end_time: "2025-05-21 23:59:59",
				},
			},
		};

		const { execute, data } = modifyHouseFee(options);

		await execute();
		console.warn("变更房屋费用", data.value);
	});

	it("取消房屋费用", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_id: "902025052181251299",
				},
			},
		};

		const { execute, data } = deleteHouseFee(options);

		await execute();
		console.warn("取消房屋费用", data.value);
	});

	it("缴纳房屋费用", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_id: "902025052181251299",
					cycle: 1,
					real_cycle: 101,
					pay_fee_start_time: "2025-02-21",
					pay_fee_end_time: "2025-02-21",
					amount_due: 110,
					pay_amount: 110,
					amount: 110,
					remark: "这是一条备注",
					community_id: "752023063035460053",
					flag: true,
					account_type: "752023063035460053",
					account_name: "752023063035460053",
					account_amount: 110,
				},
			},
		};

		const { execute, data } = payHouseFee(options);

		await execute();
		console.warn("缴纳房屋费用", data.value);
	});

	it("获取房屋费用列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					communityId: "2024022692080516",
					roomNum: "01-1-1",
					status: "2008001",
					ownerNameLike: "kid",
				},
			},
		};

		const { execute, data } = queryHouseFeeList(options);

		await execute();
		console.warn("获取房屋费用列表", data.value);
	});

	it("获取房屋费用详情", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					fee_id: "902025051980230067",
				},
			},
		};

		const { execute, data } = getHouseFeeDetail(options);

		await execute();
		console.warn("获取房屋费用详情", data.value);
	});

	it("获取房屋费用项信息", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					communityId: "2024022692080516",
					roomNum: "01-1-1",
				},
			},
		};

		const { execute, data } = getHouseFeeItems(options);

		await execute();
		console.warn("获取房屋费用项信息", data.value);
	});

	it("获取缴纳记录", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					detail_id: "912025053026800053",
					receipt_id: "ע",
					pay_obj: "1-1-101",
					cycle: 1,
					receive_received: "ϖ????????????",
					pay_path: "ϖ????????????",
					pay_period: "ϖ????????????",
					pay_time: "2025-05-30 08:42:39",
					receive_id: "YFίҵ",
					status_cd: "0",
					opt: "Y",
				},
			},
		};

		const { execute, data } = getPaymentRecords(options);

		await execute();
		console.warn("获取缴纳记录", data.value);
	});
});
