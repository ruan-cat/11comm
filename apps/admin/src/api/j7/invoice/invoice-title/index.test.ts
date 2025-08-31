import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addInvoiceTitle, modifyInvoiceTitle, queryInvoiceTitle, removeInvoiceTitle } from "./index";

describe("j7/发票抬头管理", () => {
	it("使用 body 接口 - 添加发票抬头数据", async () => {
		const { execute, data } = addInvoiceTitle({
			onSuccess(data) {
				console.warn("addInvoiceTitle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addInvoiceTitle onError", error);
			},
		});
		await execute({
			data: {
				invoiceAddress: "水电费水电费",
				invoiceName: "是是是",
				invoiceNum: "是是是",
				invoiceType: "1001",
				ownerId: "772023063013350000",
				ownerName: "qq2",
				remark: "是的",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改发票抬头数据", async () => {
		const { execute, data } = modifyInvoiceTitle({
			onSuccess(data) {
				console.warn("modifyInvoiceTitle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyInvoiceTitle onError", error);
			},
		});
		await execute({
			data: {
				invoiceAddress: "北京市朝阳区修改地址",
				invoiceName: "修改后的公司名称",
				invoiceNum: "修改后的纳税号",
				invoiceType: "2002",
				oiId: "102023100981180000",
				ownerId: "772023063013350000",
				ownerName: "qq2",
				remark: "修改后的备注",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取发票抬头列表（条件+分页）", async () => {
		const { execute, data } = queryInvoiceTitle({
			onSuccess(data) {
				console.warn("queryInvoiceTitle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryInvoiceTitle onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				invoiceName: "学问大套袋公司1",
				invoiceType: "1001",
				ownerName: "xx24",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除发票抬头", async () => {
		const { execute, data } = removeInvoiceTitle({
			onSuccess(data) {
				console.warn("removeInvoiceTitle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeInvoiceTitle onError", error);
			},
		});
		await execute({
			params: {
				oiId: "102023100981180000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
