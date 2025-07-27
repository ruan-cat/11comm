import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { terminateContract, renewContract, getExpiredContractList } from "./index";

describe("j6/合同管理/到期合同", () => {
	it("使用 query 接口 - 终止合同", async () => {
		const { execute, data } = terminateContract({
			onSuccess(data) {
				console.warn("terminateContract onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("terminateContract onError", error);
			},
		});
		await execute({
			params: {
				contractId: "812025051694590145",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 续签合同", async () => {
		const { execute, data } = renewContract({
			onSuccess(data) {
				console.warn("renewContract onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("renewContract onError", error);
			},
		});
		await execute({
			data: {
				aContracts: "张三",
				aLink: "13800138000",
				amount: "50000",
				audit: "1001",
				bContracts: "李四",
				bLink: "13900139000",
				contractCode: "HT002",
				contractName: "续签租赁合同",
				contractType: "812025051667530100",
				endTime: "2026-12-31 23:59:59",
				objId: "39",
				objType: "3333",
				operator: "王经理",
				operatorLink: "18812345678",
				parentContractCode: "HT001",
				parentContractName: "原租赁合同",
				parentStateName: "已到期",
				partyA: "甲方公司",
				partyB: "乙方公司",
				rooms: [],
				signingTime: "2025-01-01 10:00:00",
				staffName: "业务员",
				startTime: "2025-01-01 00:00:00",
				tempfile: "temp002",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取到期合同列表（条件+分页）", async () => {
		const { execute, data } = getExpiredContractList({
			onSuccess(data) {
				console.warn("getExpiredContractList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getExpiredContractList onError", error);
			},
		});
		await execute({
			params: {
				contractCode: "HT001",
				contractNameLike: "租赁",
				contractType: "812025051667530100",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
