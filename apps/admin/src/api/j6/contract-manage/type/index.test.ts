import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addContractType,
	addContractExtendInfo,
	deleteContractTypeExtend,
	getContractTypeNameList,
	modifyContractExtendInfo,
	modifyContractTemplate,
	getContractTypeList,
	getContractTemplate,
	getContractTypeExtendInfoList,
	deleteContractType,
	updateContractType,
} from "./index";

describe("j6/合同管理/合同类型", () => {
	it("使用 body 接口 - 新增合同类型", async () => {
		const { execute, data } = addContractType({
			onSuccess(data) {
				console.warn("addContractType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addContractType onError", error);
			},
		});
		await execute({
			data: {
				audit: "1001",
				auditName: "审核",
				remark: "租赁合同类型",
				typeName: "租赁合同",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加合同扩展信息", async () => {
		const { execute, data } = addContractExtendInfo({
			onSuccess(data) {
				console.warn("addContractExtendInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addContractExtendInfo onError", error);
			},
		});
		await execute({
			data: {
				contractTypeId: "812025051612450000",
				listShow: true,
				required: true,
				specCd: "822025051998170000",
				specHoldplace: "装修时需缴纳的押金",
				specName: "装修保证金",
				specShow: true,
				specType: "input",
				specValueType: "整数",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除合同类型扩展信息", async () => {
		const { execute, data } = deleteContractTypeExtend({
			onSuccess(data) {
				console.warn("deleteContractTypeExtend onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteContractTypeExtend onError", error);
			},
		});
		await execute({
			data: {
				contractTypeId: "20",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同类型名称列表", async () => {
		const { execute, data } = getContractTypeNameList({
			onSuccess(data) {
				console.warn("getContractTypeNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractTypeNameList onError", error);
			},
		});
		await execute({
			params: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改合同扩展信息", async () => {
		const { execute, data } = modifyContractExtendInfo({
			onSuccess(data) {
				console.warn("modifyContractExtendInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyContractExtendInfo onError", error);
			},
		});
		await execute({
			data: {
				contractTypeId: "812025051612450000",
				listShow: true,
				required: true,
				specCd: "822025051998170000",
				specHoldplace: "装修时需缴纳的押金（已修改）",
				specName: "装修保证金",
				specShow: true,
				specType: "input",
				specValueType: "金额",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改合同类型模板", async () => {
		const { execute, data } = modifyContractTemplate({
			onSuccess(data) {
				console.warn("modifyContractTemplate onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyContractTemplate onError", error);
			},
		});
		await execute({
			data: {
				context: "#甲方##乙方##合同名称##签订时间#\n\n这是修改后的合同模板内容。",
				contractTypeId: "1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同类型列表（条件+分页）", async () => {
		const { execute, data } = getContractTypeList({
			onSuccess(data) {
				console.warn("getContractTypeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractTypeList onError", error);
			},
		});
		await execute({
			params: {
				audit: "1001",
				pageIndex: 1,
				pageSize: 10,
				typeName: "租赁",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同类型模板", async () => {
		const { execute, data } = getContractTemplate({
			onSuccess(data) {
				console.warn("getContractTemplate onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractTemplate onError", error);
			},
		});
		await execute({
			params: {
				contractTypeId: "812021111097320100",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同类型扩展信息列表（条件+分页）", async () => {
		const { execute, data } = getContractTypeExtendInfoList({
			onSuccess(data) {
				console.warn("getContractTypeExtendInfoList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getContractTypeExtendInfoList onError", error);
			},
		});
		await execute({
			params: {
				contractTypeId: "1931246780848820226",
				pageIndex: 1,
				pageSize: 10,
				specCd: "",
				specName: "装修保证金",
				specShow: "Y",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除合同类型", async () => {
		const { execute, data } = deleteContractType({
			onSuccess(data) {
				console.warn("deleteContractType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteContractType onError", error);
			},
		});
		await execute({
			data: {
				contractTypeId: "812025051807070600",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改合同类型", async () => {
		const { execute, data } = updateContractType({
			onSuccess(data) {
				console.warn("updateContractType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateContractType onError", error);
			},
		});
		await execute({
			data: {
				audit: "1001",
				auditName: "审核",
				remark: "租赁合同类型（已修改）",
				typeName: "租赁合同",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
