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
} from ".";

describe("物业公司管理接口测试", () => {
	describe("物业公司基础信息管理", () => {
		it("添加物业公司", async () => {
			const { execute, data } = addPropertyCompany({
				onSuccess(data) {
					console.warn("添加物业公司成功", printFormat(data));
				},
				onError(error) {
					console.warn("添加物业公司失败", printFormat(error));
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
		});

		it("修改物业公司信息", async () => {
			const { execute, data } = modifyPropertyCompany({
				onSuccess(data) {
					console.warn("修改物业公司成功", printFormat(data));
				},
				onError(error) {
					console.warn("修改物业公司失败", printFormat(error));
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
		});

		it("获取物业公司列表", async () => {
			const { execute, data } = getCompanyList({
				onSuccess(data) {
					console.warn("获取物业公司列表成功", printFormat(data));
				},
				onError(error) {
					console.warn("获取物业公司列表失败", printFormat(error));
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
		});

		it("删除物业公司", async () => {
			const { execute, data } = deleteCompany({
				onSuccess(data) {
					console.warn("删除物业公司成功", printFormat(data));
				},
				onError(error) {
					console.warn("删除物业公司失败", printFormat(error));
				},
			});

			await execute({
				url: "/j4-datamanager/updateCompany/102025051526950478",
			});
		});

		it("重置物业公司密码", async () => {
			const { execute, data } = resetCompanyPassword({
				onSuccess(data) {
					console.warn("重置物业公司密码成功", printFormat(data));
				},
				onError(error) {
					console.warn("重置物业公司密码失败", printFormat(error));
				},
			});

			await execute({
				url: "/j4-datamanager/resetCompanyPassword/102025051526950478",
			});
		});

		it("限制物业登录", async () => {
			const { execute, data } = limitCompanyLogin({
				onSuccess(data) {
					console.warn("限制物业登录成功", printFormat(data));
				},
				onError(error) {
					console.warn("限制物业登录失败", printFormat(error));
				},
			});

			await execute({
				url: "/j4-datamanager/limitCompanyLogin/102025051526950478/operate/disable",
			});
		});
	});

	describe("物业公司小区管理", () => {
		it("加入小区", async () => {
			const { execute, data } = addJoinCommunity({
				onSuccess(data) {
					console.warn("加入小区成功", printFormat(data));
				},
				onError(error) {
					console.warn("加入小区失败", printFormat(error));
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
		});

		it("获取加入小区列表", async () => {
			const { execute, data } = getJoinCommunityList({
				onSuccess(data) {
					console.warn("获取加入小区列表成功", printFormat(data));
				},
				onError(error) {
					console.warn("获取加入小区列表失败", printFormat(error));
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
		});

		it("退出小区", async () => {
			const { execute, data } = quitJoinCommunity({
				onSuccess(data) {
					console.warn("退出小区成功", printFormat(data));
				},
				onError(error) {
					console.warn("退出小区失败", printFormat(error));
				},
			});

			await execute({
				url: "/j4-datamanager/quitJoinCommunity/2022092200930358",
			});
		});

		it("获取小区功能", async () => {
			const { execute, data } = getCommunityMenuGroupList({
				onSuccess(data) {
					console.warn("获取小区功能成功", printFormat(data));
				},
				onError(error) {
					console.warn("获取小区功能失败", printFormat(error));
				},
			});

			await execute({
				url: "/j4-datamanager/getCommunityMenuGroupList/2022092200930358",
			});
		});

		it("修改小区功能", async () => {
			const { execute, data } = updateCommunityMenuGroup({
				onSuccess(data) {
					console.warn("修改小区功能成功", printFormat(data));
				},
				onError(error) {
					console.warn("修改小区功能失败", printFormat(error));
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
		});
	});
});
