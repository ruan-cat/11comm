import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addContract,
	deleteContract,
	printContract,
	modifyContract,
	getContractDetail,
	getContractList,
	getContractChangeRecord,
	selectContractList,
} from "./index";

describe("j6/合同管理/起草合同", () => {
	it("使用 body 接口 - 起草合同", async () => {
		const { execute, data } = addContract({
			onSuccess(data) {
				console.warn("addContract onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addContract onError", error);
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
				contractCode: "HT001",
				contractName: "租赁合同",
				contractType: "812025051667530100",
				endTime: "2025-12-31 23:59:59",
				objId: "39",
				objType: "3333",
				operator: "王经理",
				operatorLink: "18812345678",
				partyA: "甲方公司",
				partyB: "乙方公司",
				rooms: [],
				signingTime: "2025-01-01 10:00:00",
				staffName: "业务员",
				startTime: "2025-01-01 00:00:00",
				tempfile: "temp001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除合同", async () => {
		const { execute, data } = deleteContract({
			onSuccess(data) {
				console.warn("deleteContract onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteContract onError", error);
			},
		});
		await execute({
			params: {
				contractId: "812025051694590145",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 打印合同", async () => {
		const { execute, data } = printContract({
			onSuccess(data) {
				console.warn("printContract onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("printContract onError", error);
			},
		});
		await execute({
			params: {
				contractId: "812025051694590145",
				contractTypeId: "812025051667530100",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改合同", async () => {
		const { execute, data } = modifyContract({
			onSuccess(data) {
				console.warn("modifyContract onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyContract onError", error);
			},
		});
		await execute({
			data: {
				aContracts: "张三",
				aLink: "13800138000",
				amount: "60000",
				audit: "2002",
				bContracts: "李四",
				bLink: "13900139000",
				contractCode: "HT001",
				contractName: "修改后的租赁合同",
				contractType: "812025051667530100",
				endTime: "2025-12-31 23:59:59",
				objId: "39",
				objType: "3333",
				operator: "王经理",
				operatorLink: "18812345678",
				partyA: "甲方公司",
				partyB: "乙方公司",
				rooms: [],
				signingTime: "2025-01-01 10:00:00",
				staffName: "业务员",
				startTime: "2025-01-01 00:00:00",
				tempfile: "temp001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同详情", async () => {
		const { execute, data } = getContractDetail({
			onSuccess(data) {
				console.warn("getContractDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractDetail onError", error);
			},
		});
		await execute({
			params: {
				contractTypeId: "812025051667530100",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同列表（条件+分页）", async () => {
		const { execute, data } = getContractList({
			onSuccess(data) {
				console.warn("getContractList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractList onError", error);
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

	it("使用 query 接口 - 获取合同修改记录（条件+分页）", async () => {
		const { execute, data } = getContractChangeRecord({
			onSuccess(data) {
				console.warn("getContractChangeRecord onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractChangeRecord onError", error);
			},
		});
		await execute({
			params: {
				contractId: "812025051694590145",
				staffNameLike: "业务员",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 选择合同列表（条件+分页）", async () => {
		const { execute, data } = selectContractList({
			onSuccess(data) {
				console.warn("selectContractList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("selectContractList onError", error);
			},
		});
		await execute({
			params: {
				contractNameLike: "租赁",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
