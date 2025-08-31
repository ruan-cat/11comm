import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addOrganization,
	associateEmployee,
	deleteOrganization,
	getOrganizationTree,
	modifyOrganization,
	queryBeforeAssociate,
	getOrgEmployeeList,
} from "./index";

describe("j4/组织信息管理", () => {
	it("使用 addOrganization 接口 - 添加新的组织", async () => {
		const { execute, data } = addOrganization({
			onSuccess(data) {
				console.warn("addOrganization onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addOrganization onError", error);
			},
		});
		await execute({
			data: {
				description: "测试组织描述",
				orgname: "测试组织",
				parentOrgId: "parent-org-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 associateEmployee 接口 - 将员工关联到组织", async () => {
		const { execute, data } = associateEmployee({
			onSuccess(data) {
				console.warn("associateEmployee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("associateEmployee onError", error);
			},
		});
		await execute({
			data: {
				orgId: "test-org-id",
				userIds: ["user1", "user2", "user3"],
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteOrganization 接口 - 删除指定组织", async () => {
		const { execute, data } = deleteOrganization({
			onSuccess(data) {
				console.warn("deleteOrganization onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteOrganization onError", error);
			},
		});
		await execute({
			data: {
				orgId: "test-org-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getOrganizationTree 接口 - 获取组织结构树", async () => {
		const { execute, data } = getOrganizationTree({
			onSuccess(data) {
				console.warn("getOrganizationTree onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getOrganizationTree onError", error);
			},
		});
		await execute({
			params: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyOrganization 接口 - 修改组织信息", async () => {
		const { execute, data } = modifyOrganization({
			onSuccess(data) {
				console.warn("modifyOrganization onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyOrganization onError", error);
			},
		});
		await execute({
			data: {
				orgId: "test-org-id",
				description: "修改后描述",
				orgname: "修改后组织名称",
				parentOrgId: "new-parent-org-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryBeforeAssociate 接口 - 关联员工前查询可用员工列表", async () => {
		const { execute, data } = queryBeforeAssociate({
			onSuccess(data) {
				console.warn("queryBeforeAssociate onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryBeforeAssociate onError", error);
			},
		});
		await execute({
			params: {
				orgId: "test-org-id",
				pageIndex: 1,
				pageSize: 10,
				name: "测试员工",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getOrgEmployeeList 接口 - 获取指定组织的员工列表", async () => {
		const { execute, data } = getOrgEmployeeList({
			onSuccess(data) {
				console.warn("getOrgEmployeeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getOrgEmployeeList onError", error);
			},
		});
		await execute({
			params: {
				orgId: "test-org-id",
				pageIndex: 1,
				pageSize: 10,
				name: "员工姓名",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
