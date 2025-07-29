import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addPropertyCompany,
	addJoinCommunity,
	getCompanyList,
	getJoinCommunityList,
	modifyPropertyCompany,
	quitJoinCommunity,
	resetCompanyPassword,
	deleteCompany,
	getCommunityMenuGroupList,
	limitCompanyLogin,
	updateCommunityMenuGroup,
} from "./index";

describe("j4/物业公司管理", () => {
	it("使用 addPropertyCompany 接口 - 添加物业公司", async () => {
		const { execute, data } = addPropertyCompany({
			onSuccess(data) {
				console.warn("addPropertyCompany onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addPropertyCompany onError", error);
			},
		});
		await execute({
			data: {
				address: "王者峡谷",
				createDate: "2023-01-01",
				functions: ["巡检", "OA"],
				nearbyLandmarks: "狮子头",
				openCommunityName: "YF小区",
				storeName: "坤坤物业",
				tel: "111111111",
				userName: "111111111",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyPropertyCompany 接口 - 修改物业公司信息", async () => {
		const { execute, data } = modifyPropertyCompany({
			onSuccess(data) {
				console.warn("modifyPropertyCompany onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyPropertyCompany onError", error);
			},
		});
		await execute({
			url: "/j4-datamanager/modifyCompany/102025051526950478",
			data: {
				address: "王者峡谷",
				createDate: "2023-01-01",
				nearbyLandmarks: "狮子头",
				storeName: "坤坤物业",
				tel: "111111111",
				userName: "111111111",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getCompanyList 接口 - 获取物业公司列表", async () => {
		const { execute, data } = getCompanyList({
			onSuccess(data) {
				console.warn("getCompanyList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getCompanyList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				storeName: "坤坤物业",
				tel: "111111111",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteCompany 接口 - 删除物业公司", async () => {
		const { execute, data } = deleteCompany({
			onSuccess(data) {
				console.warn("deleteCompany onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteCompany onError", error);
			},
		});
		await execute({
			url: "/j4-datamanager/updateCompany/102025051526950478",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 resetCompanyPassword 接口 - 重置物业公司密码", async () => {
		const { execute, data } = resetCompanyPassword({
			onSuccess(data) {
				console.warn("resetCompanyPassword onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("resetCompanyPassword onError", error);
			},
		});
		await execute({
			url: "/j4-datamanager/resetCompanyPassword/102025051526950478",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 limitCompanyLogin 接口 - 限制物业登录", async () => {
		const { execute, data } = limitCompanyLogin({
			onSuccess(data) {
				console.warn("limitCompanyLogin onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("limitCompanyLogin onError", error);
			},
		});
		await execute({
			url: "/j4-datamanager/limitCompanyLogin/102025051526950478/operate/disable",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 addJoinCommunity 接口 - 加入小区", async () => {
		const { execute, data } = addJoinCommunity({
			onSuccess(data) {
				console.warn("addJoinCommunity onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addJoinCommunity onError", error);
			},
		});
		await execute({
			data: {
				communityId: "2022092200930358",
				communityName: "YF小区",
				menuGroups: [
					{
						name: "报表管理",
						statusCd: "0",
					},
				],
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getJoinCommunityList 接口 - 获取加入小区列表", async () => {
		const { execute, data } = getJoinCommunityList({
			onSuccess(data) {
				console.warn("getJoinCommunityList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getJoinCommunityList onError", error);
			},
		});
		await execute({
			params: {
				communityMemberId: "10202305221014333605000192",
				pageIndex: 1,
				pageSize: 10,
				communityName: "YF小区",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 quitJoinCommunity 接口 - 退出小区", async () => {
		const { execute, data } = quitJoinCommunity({
			onSuccess(data) {
				console.warn("quitJoinCommunity onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("quitJoinCommunity onError", error);
			},
		});
		await execute({
			url: "/j4-datamanager/quitJoinCommunity/2022092200930358",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getCommunityMenuGroupList 接口 - 获取小区功能", async () => {
		const { execute, data } = getCommunityMenuGroupList({
			onSuccess(data) {
				console.warn("getCommunityMenuGroupList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getCommunityMenuGroupList onError", error);
			},
		});
		await execute({
			url: "/j4-datamanager/getCommunityMenuGroupList/2022092200930358",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 updateCommunityMenuGroup 接口 - 修改小区功能", async () => {
		const { execute, data } = updateCommunityMenuGroup({
			onSuccess(data) {
				console.warn("updateCommunityMenuGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateCommunityMenuGroup onError", error);
			},
		});
		await execute({
			data: {
				communityId: "2022092200930358",
				communityName: "YF小区",
				menuGroups: [
					{
						name: "报表管理",
						statusCd: "0",
					},
				],
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
