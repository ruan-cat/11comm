import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addAnnouncement,
	modifyAnnouncement,
	deleteAnnouncement,
	queryAnnouncementDetail,
	queryAnnouncementList,
} from ".";

describe("j5/小区公示", () => {
	it("使用 addAnnouncement 接口 - 添加公示", async () => {
		const { execute, data } = addAnnouncement({
			onSuccess(data) {
				console.warn("添加公示成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加公示失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				context: "大刀的",
				headerImg: "https://xxx.jpg",
				pubType: "1000",
				title: "这是一个 公示",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyAnnouncement 接口 - 修改公示", async () => {
		const { execute, data } = modifyAnnouncement({
			onSuccess(data) {
				console.warn("修改公示成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改公示失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				context: "大刀的",
				headerImg: "https://xxx.jpg",
				pubId: "102024022092656180",
				pubType: "1000",
				title: "这是一个 公示",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteAnnouncement 接口 - 删除公示", async () => {
		const { execute, data } = deleteAnnouncement({
			onSuccess(data) {
				console.warn("删除公示成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除公示失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				pubId: "102024022092656180",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryAnnouncementDetail 接口 - 获取公示详情", async () => {
		const { execute, data } = queryAnnouncementDetail({
			onSuccess(data) {
				console.warn("获取公示详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取公示详情失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				pubId: "102023040772260002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryAnnouncementList 接口 - 获取公示列表（条件+分页）", async () => {
		const { execute, data } = queryAnnouncementList({
			onSuccess(data) {
				console.warn("获取公示列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取公示列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				pubType: "1000",
				title: "测试公告",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
