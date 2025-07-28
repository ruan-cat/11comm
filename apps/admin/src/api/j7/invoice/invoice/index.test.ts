import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addInvoice,
	deleteInvoice,
	queryInvoice,
	queryInvoiceDetail,
	queryInvoiceDetails,
	queryAuditRecords,
	queryInvoiceDownloadLink,
	registerInvoice,
	auditInvoice,
	uploadInvoice,
} from "./index";

describe("j7/发票管理", () => {
	it("使用 body 接口 - 申请发票", async () => {
		const { execute, data } = addInvoice({
			onSuccess(data) {
				console.warn("addInvoice onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addInvoice onError", error);
			},
		});
		await execute({
			data: {
				applyTel: "18899995566",
				communityId: "2025051506460033",
				createUserId: "302025051540540000",
				createUserName: "douya",
				invoiceAmount: 233,
				invoiceType: "1001",
				itemName: "1001",
				itemObjId: "112025052002260030",
				oiId: "102025051675600020",
				ownerName: "233",
				payTime: "2025-05-14 19:40:51",
				remark: "无",
				state: "W",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除发票", async () => {
		const { execute, data } = deleteInvoice({
			onSuccess(data) {
				console.warn("deleteInvoice onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteInvoice onError", error);
			},
		});
		await execute({
			params: {
				invoiceId: "102025051675600020",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取发票列表（条件+分页）", async () => {
		const { execute, data } = queryInvoice({
			onSuccess(data) {
				console.warn("queryInvoice onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryInvoice onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				applyTel: "123456",
				createUserName: "asd",
				invoiceCode: "123789",
				invoiceType: "1001",
				ownerName: "孙悟空",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取发票详情", async () => {
		const { execute, data } = queryInvoiceDetail({
			onSuccess(data) {
				console.warn("queryInvoiceDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryInvoiceDetail onError", error);
			},
		});
		await execute({
			params: {
				applyId: "102025051675600020",
				communityId: "2025051506460033",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 发票详情----开票明细", async () => {
		const { execute, data } = queryInvoiceDetails({
			onSuccess(data) {
				console.warn("queryInvoiceDetails onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryInvoiceDetails onError", error);
			},
		});
		await execute({
			params: {
				applyId: "111111111111111111",
				communityId: "2024022647620054",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 发票详情----审核记录", async () => {
		const { execute, data } = queryAuditRecords({
			onSuccess(data) {
				console.warn("queryAuditRecords onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAuditRecords onError", error);
			},
		});
		await execute({
			params: {
				applyId: "111111111111111111",
				communityId: "2024022647620054",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	// 警告 接口返回值不满足格式，不是JsonVO 故前端不对接该接口。
	// it("使用 query 接口 - 发票详情----查看发票", async () => {
	// 	const { execute, data } = queryInvoiceDownloadLink({
	// 		onSuccess(data) {
	// 			console.warn("queryInvoiceDownloadLink onSuccess", printFormat(data));
	// 		},
	// 		onError(error) {
	// 			console.error("queryInvoiceDownloadLink onError", error);
	// 		},
	// 	});
	// 	await execute({
	// 		params: {
	// 			applyId: "111111111111111111",
	// 			communityId: "2024022647620054",
	// 			pageIndex: 1,
	// 			pageSize: 10,
	// 		},
	// 	});
	// 	console.warn("查看简单的 data.value ", printFormat(data.value));
	// });

	it("使用 body 接口 - 登记发票", async () => {
		const { execute, data } = registerInvoice({
			onSuccess(data) {
				console.warn("registerInvoice onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("registerInvoice onError", error);
			},
		});
		await execute({
			data: {
				applyId: "102025051675600020",
				communityId: "2025051506460033",
				eventType: "5005",
				remark: "发票登记操作",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 审核发票", async () => {
		const { execute, data } = auditInvoice({
			onSuccess(data) {
				console.warn("auditInvoice onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("auditInvoice onError", error);
			},
		});
		await execute({
			data: {
				applyId: "102025051675600020",
				applyTel: "18899995566",
				communityId: "2025051506460033",
				createUserId: "302025051540540000",
				createUserName: "douya",
				invoiceAmount: 233,
				invoiceType: "1001",
				itemName: "1001",
				itemObjId: "112025052002260030",
				oiId: "102025051675600020",
				ownerName: "233",
				payTime: "2025-05-14 19:40:51",
				remark: "审核通过",
				state: "G",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	// 警告 该接口无法通过 vitest 做文件上传测试 ，需要手动测试
	// it("使用 body 接口 - 上传发票", async () => {
	// 	const { execute, data } = uploadInvoice({
	// 		onSuccess(data) {
	// 			console.warn("uploadInvoice onSuccess", printFormat(data));
	// 		},
	// 		onError(error) {
	// 			console.error("uploadInvoice onError", error);
	// 		},
	// 	});

	// 	// 创建模拟的文件对象
	// 	const file = new File(["发票图片内容"], "invoice.jpg", {
	// 		type: "image/jpeg",
	// 	});

	// 	await execute({
	// 		data: {
	// 			applyId: "102025051675600020",
	// 			communityId: "2025051506460033",
	// 			uploadFiles: [file],
	// 		},
	// 	});
	// 	console.warn("查看简单的 data.value ", printFormat(data.value));
	// });
});
