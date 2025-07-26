import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addRelatedUnit, queryRelatedUnitList, queryNoRelatedUnitList, removeRelatedUnit } from "./related-unit";

describe("j2/组织管理/数据权限/关联单元", () => {
	it("使用 query 接口 - 添加关联单元", async () => {
		const { execute, data } = addRelatedUnit({
			onSuccess(data) {
				console.warn("addRelatedUnit onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRelatedUnit onError", error);
			},
		});

		await execute({
			params: {
				communityId: "2022120695590004",
				createTime: "2022-01-01 00:00:00",
				dpId: "102022122028720443",
				dpUnitId: "102022122003870444",
				floorId: "732022081690440002",
				floorNum: "D",
				statusCd: "1",
				unitId: "742022082058950007",
				unitNum: "1",
				BId: "",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取已关联单元列表（条件+分页）", async () => {
		const { execute, data } = queryRelatedUnitList({
			onSuccess(data) {
				console.warn("queryRelatedUnitList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryRelatedUnitList onError", error);
			},
		});

		await execute({
			params: {
				dpId: "102025051938291445",
				pageIndex: 1,
				pageSize: 10,
				statusCd: "0",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取未关联单元列表（条件+分页）", async () => {
		const { execute, data } = queryNoRelatedUnitList({
			onSuccess(data) {
				console.warn("queryNoRelatedUnitList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryNoRelatedUnitList onError", error);
			},
		});

		await execute({
			params: {
				communityId: "2024022692080516",
				dpId: "102025051938291445",
				floorNum: "1",
				pageIndex: 1,
				pageSize: 10,
				statusCd: "0",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除关联单元", async () => {
		const { execute, data } = removeRelatedUnit({
			onSuccess(data) {
				console.warn("removeRelatedUnit onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeRelatedUnit onError", error);
			},
		});

		await execute({
			params: {
				dpUnitId: "102022122003870444",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
