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
} from "./index";

describe("j3/系统管理", () => {
	it("使用 modifyCommunitySetting 接口 - 提交配置项修改", async () => {
		const { execute, data } = modifyCommunitySetting({
			onSuccess(data) {
				console.warn("modifyCommunitySetting onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyCommunitySetting onError", error);
			},
		});
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

	it("使用 queryCommunitySettingList 接口 - 获取配置项数据", async () => {
		const { execute, data } = queryCommunitySettingList({
			onSuccess(data) {
				console.warn("queryCommunitySettingList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryCommunitySettingList onError", error);
			},
		});
		await execute({
			params: {
				communityId: "2023052267100146",
				settingType: "2002",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryCommunitySettingKeyList 接口 - 获取配置项列表", async () => {
		const { execute, data } = queryCommunitySettingKeyList({
			onSuccess(data) {
				console.warn("queryCommunitySettingKeyList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryCommunitySettingKeyList onError", error);
			},
		});
		await execute({
			params: {
				communityId: "2023052267100146",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryCommunitiesList 接口 - 获取小区列表（分页+条件）", async () => {
		const { execute, data } = queryCommunitiesList({
			onSuccess(data) {
				console.warn("queryCommunitiesList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryCommunitiesList onError", error);
			},
		});
		await execute({
			params: {
				communityId: "2024021911282483",
				name: "万科森林公园",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyStaffPwd 接口 - 修改密码", async () => {
		const { execute, data } = modifyStaffPwd({
			onSuccess(data) {
				console.warn("modifyStaffPwd onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyStaffPwd onError", error);
			},
		});
		await execute({
			data: {
				newPwd: "121234",
				oldPwd: "123456",
				userId: "U123456",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 updateRegisterProtocol 接口 - 修改注册协议", async () => {
		const { execute, data } = updateRegisterProtocol({
			onSuccess(data) {
				console.warn("updateRegisterProtocol onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateRegisterProtocol onError", error);
			},
		});
		await execute({
			data: {
				merchantProtocol: "注册协议条款的确认和接受...",
				statusCd: "0",
				userProtocol: "注册协议条款的确认和接受...",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 updateSystemInfo 接口 - 修改系统配置", async () => {
		const { execute, data } = updateSystemInfo({
			onSuccess(data) {
				console.warn("updateSystemInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateSystemInfo onError", error);
			},
		});
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

	it("使用 removeData 接口 - 格式化数据", async () => {
		const { execute, data } = removeData({
			onSuccess(data) {
				console.warn("removeData onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeData onError", error);
			},
		});
		await execute({
			params: {
				communityId: "2024021911282483",
				password: "admin",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
