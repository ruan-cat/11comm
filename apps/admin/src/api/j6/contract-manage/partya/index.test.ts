import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	getContractPartyaNameList,
	deleteContractPartya,
	getContractPartyaList,
	addContractPartya,
	updateContractPartya,
} from "./index";

describe("j6/合同管理/合同甲方", () => {
	it("使用 query 接口 - 获取合同甲方名称列表", async () => {
		const { execute, data } = getContractPartyaNameList({
			onSuccess(data) {
				console.warn("getContractPartyaNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractPartyaNameList onError", error);
			},
		});
		await execute({
			params: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除合同甲方", async () => {
		const { execute, data } = deleteContractPartya({
			onSuccess(data) {
				console.warn("deleteContractPartya onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteContractPartya onError", error);
			},
		});
		await execute({
			data: {
				partyaId: "3339711443",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同甲方列表（条件+分页）", async () => {
		const { execute, data } = getContractPartyaList({
			onSuccess(data) {
				console.warn("getContractPartyaList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractPartyaList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				partyA: "爱情物业公司1",
				aContacts: "张经理",
				aLink: "13800138000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加合同甲方", async () => {
		const { execute, data } = addContractPartya({
			onSuccess(data) {
				console.warn("addContractPartya onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addContractPartya onError", error);
			},
		});
		await execute({
			data: {
				partyA: "爱情物业公司12",
				acontacts: "李经理",
				alink: "14234567890",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改合同甲方", async () => {
		const { execute, data } = updateContractPartya({
			onSuccess(data) {
				console.warn("updateContractPartya onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateContractPartya onError", error);
			},
		});
		await execute({
			data: {
				partyA: "爱情物业公司1（已修改）",
				partyaId: "3339711443",
				aContacts: "王经理",
				aLink: "13800138000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
