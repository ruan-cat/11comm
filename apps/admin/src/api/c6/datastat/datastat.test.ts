import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	datastatQueryAccess,
	datastatQueryExpense,
	datastatQueryWorkOrder,
	datastatQueryOther,
	datastatQueryReceipts,
	datastatQueryReceiptsDetail,
	datastatQueryWorkOrderDetail,
} from "./datastat";

describe("数据统计模块", () => {
	describe("datastatQueryAccess", () => {
		it("调用出入类统计查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryAccess({
				onSuccess(data) {
					console.warn("datastatQueryAccess onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryAccess onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用出入类统计查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryAccess({
				onSuccess(data) {
					console.warn("datastatQueryAccess onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryAccess onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("datastatQueryExpense", () => {
		it("调用费用统计查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryExpense({
				onSuccess(data) {
					console.warn("datastatQueryExpense onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryExpense onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用费用统计查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryExpense({
				onSuccess(data) {
					console.warn("datastatQueryExpense onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryExpense onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
					feeType: "物业费",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("datastatQueryWorkOrder", () => {
		it("调用工单统计查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryWorkOrder({
				onSuccess(data) {
					console.warn("datastatQueryWorkOrder onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryWorkOrder onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用工单统计查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryWorkOrder({
				onSuccess(data) {
					console.warn("datastatQueryWorkOrder onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryWorkOrder onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
					workOrderType: "维修",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("datastatQueryOther", () => {
		it("调用其他统计查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryOther({
				onSuccess(data) {
					console.warn("datastatQueryOther onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryOther onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用其他统计查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryOther({
				onSuccess(data) {
					console.warn("datastatQueryOther onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryOther onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("datastatQueryReceipts", () => {
		it("调用收据查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryReceipts({
				onSuccess(data) {
					console.warn("datastatQueryReceipts onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryReceipts onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用收据查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryReceipts({
				onSuccess(data) {
					console.warn("datastatQueryReceipts onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryReceipts onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
					receiptNo: "R202505010001",
					ownerName: "张三",
					ownerPhone: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("datastatQueryReceiptsDetail", () => {
		it("调用收据明细查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryReceiptsDetail({
				onSuccess(data) {
					console.warn("datastatQueryReceiptsDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryReceiptsDetail onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用收据明细查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryReceiptsDetail({
				onSuccess(data) {
					console.warn("datastatQueryReceiptsDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryReceiptsDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
					receiptNo: "R202505010001",
					feeType: "物业费",
					ownerName: "张三",
					ownerPhone: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});

	describe("datastatQueryWorkOrderDetail", () => {
		it("调用工单查询接口，不传参数", async () => {
			const { execute, data } = datastatQueryWorkOrderDetail({
				onSuccess(data) {
					console.warn("datastatQueryWorkOrderDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryWorkOrderDetail onError", error);
				},
			});
			await execute();
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});

		it("调用工单查询接口，传入查询参数", async () => {
			const { execute, data } = datastatQueryWorkOrderDetail({
				onSuccess(data) {
					console.warn("datastatQueryWorkOrderDetail onSuccess", printFormat(data));
				},
				onError(error) {
					console.error("datastatQueryWorkOrderDetail onError", error);
				},
			});
			await execute({
				params: {
					pageIndex: 2,
					pageSize: 20,
					communityId: "123",
					startDate: "2025-05-01",
					endDate: "2025-05-31",
					workOrderType: "维修",
					workOrderStatus: "待处理",
					ownerName: "张三",
					ownerPhone: "13800138000",
				},
			});
			console.warn("查看简单的 data.value ", printFormat(data.value));
		});
	});
});
