import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { modifyMyCommunity, queryMyCommunity } from ".";

describe("j5/我的小区", () => {
	it("使用 modifyMyCommunity 接口 - 修改入驻小区（部分信息）", async () => {
		const { execute, data } = modifyMyCommunity({
			onSuccess(data) {
				console.warn("修改入驻小区成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改入驻小区失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				communityArea: 0,
				qrCode:
					"http://192.168.88.135:8888/group1/M00/00/00/oYYBAGg3uneAF2b1ABlDoPCCwso590.jpg?token=01028c66161ea1f19bb87cfc25bb4d23&ts=1748482679",
				tel: "18909711443",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryMyCommunity 接口 - 查看入驻小区", async () => {
		const { execute, data } = queryMyCommunity({
			onSuccess(data) {
				console.warn("查看入驻小区成功", printFormat(data));
			},
			onError(error) {
				console.warn("查看入驻小区失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
