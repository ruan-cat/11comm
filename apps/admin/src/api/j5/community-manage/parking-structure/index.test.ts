import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { queryParkingStructure } from ".";

describe("j5/车位结构图", () => {
	it("使用 queryParkingStructure 接口 - 获取指定单元车位结构", async () => {
		const { execute, data } = queryParkingStructure({
			onSuccess(data) {
				console.warn("获取指定单元车位结构成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取指定单元车位结构失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				unitId: "742023120517690335",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
