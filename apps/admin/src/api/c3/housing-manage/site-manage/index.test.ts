import { describe, it } from "vitest";
import {
	addSpace,
	modifySpace,
	removeSpace,
	querySpaceList,
	querySpaceTime,
	modifySpaceTime,
	queryVenueList,
	addVenue,
	modifyVenue,
	deleteVenue,
	queryVenueReservations,
	addReservation,
	queryOrderList,
	removeOrder,
} from ".";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { AxiosRequestConfig } from "axios";

describe("场地管理接口测试", () => {
	it("添加场地", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					name: "测试场地",
					feeMoney: 100,
					adminName: "张三",
					tel: "13800138000",
					state: "1",
				},
			},
		};

		const { execute, data } = addSpace(options);

		await execute();
		console.warn("添加场地", data.value);
	});

	it("修改场地", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					spaceId: "123",
					name: "修改后的场地",
					feeMoney: 200,
					adminName: "李四",
					tel: "13900139000",
					state: "1",
				},
			},
		};

		const { execute, data } = modifySpace(options);

		await execute();
		console.warn("修改场地", data.value);
	});

	it("删除场地", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: ["123", "456"],
			},
		};

		const { execute, data } = removeSpace(options);

		await execute();
		console.warn("删除场地", data.value);
	});

	it("获取场地列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					space_id: "102025052134500010",
					name: "食堂",
					state: "1001",
				},
			},
		};

		const { execute, data } = querySpaceList(options);

		await execute();
		console.warn("获取场地列表", data.value);
	});

	it("获取场地开放时间", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					space_id: "102025052134500010",
				},
			},
		};

		const { execute, data } = querySpaceTime(options);

		await execute();
		console.warn("获取场地开放时间", data.value);
	});

	it("修改场地开放时间", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					space_id: "102025052134500010",
					hours: 9,
					is_open: "1",
					time_id: "123",
				},
			},
		};

		const { execute, data } = modifySpaceTime(options);

		await execute();
		console.warn("修改场地开放时间", data.value);
	});

	it("获取场馆列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					name: "篮球场",
					id: "d934050a8bb373e8f8eed0bf7507ec17",
				},
			},
		};

		const { execute, data } = queryVenueList(options);

		await execute();
		console.warn("获取场馆列表", data.value);
	});

	it("新增场馆", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					name: "篮球场",
					remark: "室内篮球场",
					startTime: "08:00",
					endTime: "22:00",
				},
			},
		};

		const { execute, data } = addVenue(options);

		await execute();
		console.warn("新增场馆", data.value);
	});

	it("修改场馆", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					name: "修改后的篮球场",
					remark: "室外篮球场",
					startTime: "06:00",
					endTime: "23:00",
					venueId: "123",
				},
			},
		};

		const { execute, data } = modifyVenue(options);

		await execute();
		console.warn("修改场馆", data.value);
	});

	it("删除场馆", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: ["123", "456"],
			},
		};

		const { execute, data } = deleteVenue(options);

		await execute();
		console.warn("删除场馆", data.value);
	});

	it("获取场馆场地预约列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					appointmentTime: "2024-03-20",
				},
			},
		};

		const { execute, data } = queryVenueReservations(options);

		await execute();
		console.warn("获取场馆场地预约列表", data.value);
	});

	it("添加预约", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					spaceId: "102025052134500010",
					venueId: "102025052134500011",
					personName: "张三",
					personTel: "13800138000",
					appointmentDate: "2024-03-20",
					appointmentTime: "14:00",
					receivableAmount: 100,
					receivedAmount: 100,
					payWay: "1",
					state: "1",
					remark: "测试预约",
					venueName: "篮球场",
					spaceName: "1号场地",
				},
			},
		};

		const { execute, data } = addReservation(options);

		await execute();
		console.warn("添加预约", data.value);
	});

	it("获取预约订单列表", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					pageIndex: 1,
					pageSize: 10,
					communityId: "2024022692080516",
					spaceId: "102025051649290124",
					state: "S",
					personName: "张三",
					personTel: "12345678910",
					appointmentTime: "2024-03-20",
				},
			},
		};

		const { execute, data } = queryOrderList(options);

		await execute();
		console.warn("获取预约订单列表", data.value);
	});

	it("取消预约", async () => {
		const options: UseAxiosOptionsJsonVO & { config?: AxiosRequestConfig } = {
			immediate: false,
			config: {
				data: {
					cspId: "102025052134500010",
				},
			},
		};

		const { execute, data } = removeOrder(options);

		await execute();
		console.warn("取消预约", data.value);
	});
});
