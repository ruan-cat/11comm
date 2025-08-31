import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	queryUnitBuildingStructure,
	queryAllBuildingStructure,
	queryFloorBuildingStructure,
	queryCommunityStructure,
} from ".";

describe("j5/楼栋结构图", () => {
	it("使用 queryUnitBuildingStructure 接口 - 获取指定单元楼栋结构", async () => {
		const { execute, data } = queryUnitBuildingStructure({
			onSuccess(data) {
				console.warn("获取指定单元楼栋结构成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取指定单元楼栋结构失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				unitId: "742023120517690335",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryAllBuildingStructure 接口 - 获取一次性获取所有结构", async () => {
		const { execute, data } = queryAllBuildingStructure({
			onSuccess(data) {
				console.warn("获取所有楼栋结构成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取所有楼栋结构失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryFloorBuildingStructure 接口 - 获取指定社区楼栋结构", async () => {
		const { execute, data } = queryFloorBuildingStructure({
			onSuccess(data) {
				console.warn("获取指定社区楼栋结构成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取指定社区楼栋结构失败", printFormat(error));
			},
		});

		await execute({
			params: {
				floorId: "732024012265490076",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryCommunityStructure 接口 - 获取指定小区结构", async () => {
		const { execute, data } = queryCommunityStructure({
			onSuccess(data) {
				console.warn("获取指定小区结构成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取指定小区结构失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
