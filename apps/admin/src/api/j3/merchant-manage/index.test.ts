import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { modifyMerchantAdminStatus, queryMerchantAdminList, queryMerchantList } from "./index";

describe("j3/商户管理", () => {
	it("使用 modifyMerchantAdminStatus 接口 - 限制登录", async () => {
		const { execute, data } = modifyMerchantAdminStatus({
			onSuccess(data) {
				console.warn("modifyMerchantAdminStatus onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyMerchantAdminStatus onError", error);
			},
		});
		await execute({
			data: {
				status: "48002",
				userId: "302024021945972500",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryMerchantAdminList 接口 - 获取商户管理员列表（条件+分页）", async () => {
		const { execute, data } = queryMerchantAdminList({
			onSuccess(data) {
				console.warn("queryMerchantAdminList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryMerchantAdminList onError", error);
			},
		});
		await execute({
			params: {
				name: "HC演示物业2",
				pageIndex: 1,
				pageSize: 10,
				storeName: "HC演示物业2",
				tel: "18909711443",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryMerchantList 接口 - 获取商户列表（条件+分页）", async () => {
		const { execute, data } = queryMerchantList({
			onSuccess(data) {
				console.warn("queryMerchantList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryMerchantList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				storeName: "YF物业",
				storeType: "商家",
				tel: "18502260001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
