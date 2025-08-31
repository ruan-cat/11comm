import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getChangeDetail, getContractChangeList, modifyAssetChange } from "./index";

describe("j6/合同管理/合同变更", () => {
	it("使用 query 接口 - 查看变更明细", async () => {
		const { execute, data } = getChangeDetail({
			onSuccess(data) {
				console.warn("getChangeDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getChangeDetail onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				planId: "121212",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同变更列表（条件+分页）", async () => {
		const { execute, data } = getContractChangeList({
			onSuccess(data) {
				console.warn("getContractChangeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractChangeList onError", error);
			},
		});
		await execute({
			params: {
				contractType: "UPDATE",
				pageIndex: 1,
				pageSize: 10,
				contractName: "测试合同",
				contractCode: "001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 主体变更--租期调整--资产变更", async () => {
		const { execute, data } = modifyAssetChange({
			onSuccess(data) {
				console.warn("modifyAssetChange onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyAssetChange onError", error);
			},
		});
		await execute({
			data: {
				acontacts: "张三",
				alink: "13800138000",
				amount: 1000,
				audit: "2002",
				bcontacts: "李四",
				blink: "13900139000",
				changeRemark: "合同变更测试",
				contractCode: "001",
				contractId: "812025051620220200",
				contractName: "测试变更合同主体",
				contractType: "812025051667530100",
				contractTypeName: "测试合同类型",
				endTime: "2025-05-27 00:00:00",
				operator: "王经理",
				operatorLink: "18812345678",
				param: "contractChangeMainBody",
				partyA: "甲方公司",
				partyB: "乙方公司",
				planType: "1001",
				rooms: [],
				signingTime: "2025-05-16 10:33:54",
				staffName: "业务员",
				startTime: "2025-05-16 00:00:00",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
