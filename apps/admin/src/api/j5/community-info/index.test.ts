import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addCommunity,
	modifyCommunity,
	queryCommunityList,
	queryCityAreas,
	queryNotEnteredCommunityList,
	deleteCommunity,
} from ".";

describe("j5/小区信息", () => {
	it("使用 addCommunity 接口 - 添加小区", async () => {
		const { execute, data } = addCommunity({
			onSuccess(data) {
				console.warn("添加小区成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加小区失败", printFormat(error));
			},
		});

		await execute({
			data: {
				address: "北京省北京市西城区北石槽镇阳光花园",
				cityCode: "110102",
				feePrice: 0,
				name: "xx小区",
				nearbyLandmarks: "东方明珠",
				payFeeMonth: 12,
				tel: "12345678901",
				value: "221221",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyCommunity 接口 - 修改小区", async () => {
		const { execute, data } = modifyCommunity({
			onSuccess(data) {
				console.warn("修改小区成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改小区失败", printFormat(error));
			},
		});

		await execute({
			data: {
				address: "北京省北京市西城区北石槽镇阳光花园",
				cityCode: "110102",
				communityId: "2024022692080516",
				feePrice: 0,
				name: "xx小区",
				nearbyLandmarks: "东方明珠",
				payFeeMonth: 12,
				tel: "12345678901",
				value: "221221",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryCommunityList 接口 - 获取小区列表（条件+分页）", async () => {
		const { execute, data } = queryCommunityList({
			onSuccess(data) {
				console.warn("获取小区列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取小区列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				cityCode: "630103",
				communityId: "2023052267100146",
				name: "HC演示小区3",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryCityAreas 接口 - 获取城市地名列表", async () => {
		const { execute, data } = queryCityAreas({
			onSuccess(data) {
				console.warn("获取城市地名列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取城市地名列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				areaLevel: "202",
				parentAreaCode: "120000",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryNotEnteredCommunityList 接口 - 获取未入驻物业的小区名称列表", async () => {
		const { execute, data } = queryNotEnteredCommunityList({
			onSuccess(data) {
				console.warn("获取未入驻物业小区列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取未入驻物业小区列表失败", printFormat(error));
			},
		});

		await execute({
			params: {},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteCommunity 接口 - 删除小区", async () => {
		const { execute, data } = deleteCommunity({
			onSuccess(data) {
				console.warn("删除小区成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除小区失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022692080516",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
