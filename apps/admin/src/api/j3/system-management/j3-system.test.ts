import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	modifyCommunitySetting,
	queryCommunitySettingList,
	queryCommunitySettingKeyList,
	queryCommunitiesList,
	modifyStaffPwd,
	updateRegisterProtocol,
	updateSystemInfo,
	removeData,
} from "./j3-system";

describe("系统管理接口测试", () => {
	it("提交配置项修改", async () => {
		const { execute, data } = modifyCommunitySetting({
			onSuccess(data) {
				console.warn("提交配置项修改成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				settingItems: [
					{
						csId: "112023082032880000",
						settingValue: "0",
					},
				],
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("获取配置项数据", async () => {
		const { execute, data } = queryCommunitySettingList({
			onSuccess(data) {
				console.warn("获取配置项数据成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				communityId: "2023052267100146",
				settingType: "2002",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("获取配置项列表", async () => {
		const { execute, data } = queryCommunitySettingKeyList({
			onSuccess(data) {
				console.warn("获取配置项列表成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				communityId: "2023052267100146",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("获取小区列表（分页+条件）", async () => {
		const { execute, data } = queryCommunitiesList({
			onSuccess(data) {
				console.warn("获取小区列表成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				communityId: "2024021911282483",
				name: "万科森林公园",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改密码", async () => {
		const { execute, data } = modifyStaffPwd({
			onSuccess(data) {
				console.warn("修改密码成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				newPwd: "121234",
				oldPwd: "123456",
				userId: "U123456",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改注册协议", async () => {
		const { execute, data } = updateRegisterProtocol({
			onSuccess(data) {
				console.warn("修改注册协议成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				merchantProtocol: "注册协议条款的确认和接受...",
				statusCd: "0",
				userProtocol: "注册协议条款的确认和接受...",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改系统配置", async () => {
		const { execute, data } = updateSystemInfo({
			onSuccess(data) {
				console.warn("修改系统配置成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				companyName: "java110团队",
				defaultCommunityId: "2023052267100146",
				imgUrl: "http://mallapp.homecommunity.cn",
				logoUrl: "/img/logo.png",
				mallUrl: "http://mallapp.homecommunity.cn",
				ownerTitle: "HC智慧家园",
				propertyTitle: "HC掌上物业",
				qqMapKey: "123123",
				subSystemTitle: "智慧物业系统",
				systemSimpleTitle: "HC",
				systemTitle: "HC小区管理系统",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("格式化数据", async () => {
		const { execute, data } = removeData({
			onSuccess(data) {
				console.warn("格式化数据成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				communityId: "2024021911282483",
				password: "admin",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
