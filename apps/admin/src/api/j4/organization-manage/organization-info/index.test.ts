import { describe, it } from "vitest";
import { printFormat } from "@/utils/print";
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
	it("使用 addOrganization 接口 - 添加新的组织", () => {
		const { execute, data } = addOrganization({
			onError: (error) => console.warn("addOrganization 接口请求失败:", error),
		});

		execute({
			data: {
				description: "测试组织描述",
				orgname: "测试组织",
				parentOrgId: "parent-org-id",
			},
		});

		console.warn("addOrganization 接口响应数据:", printFormat(data));
	});

	it("使用 associateEmployee 接口 - 将员工关联到组织", () => {
		const { execute, data } = associateEmployee({
			onError: (error) => console.warn("associateEmployee 接口请求失败:", error),
		});

		execute({
			data: {
				orgId: "test-org-id",
				userIds: ["user1", "user2", "user3"],
			},
		});

		console.warn("associateEmployee 接口响应数据:", printFormat(data));
	});

	it("使用 deleteOrganization 接口 - 删除指定组织", () => {
		const { execute, data } = deleteOrganization({
			onError: (error) => console.warn("deleteOrganization 接口请求失败:", error),
		});

		execute({
			data: {
				orgId: "test-org-id",
			},
		});

		console.warn("deleteOrganization 接口响应数据:", printFormat(data));
	});

	it("使用 getOrganizationTree 接口 - 获取组织结构树", () => {
		const { execute, data } = getOrganizationTree({
			onError: (error) => console.warn("getOrganizationTree 接口请求失败:", error),
		});

		execute({
			params: {},
		});

		console.warn("getOrganizationTree 接口响应数据:", printFormat(data));
	});

	it("使用 modifyOrganization 接口 - 修改组织信息", () => {
		const { execute, data } = modifyOrganization({
			onError: (error) => console.warn("modifyOrganization 接口请求失败:", error),
		});

		execute({
			data: {
				orgId: "test-org-id",
				description: "修改后描述",
				orgname: "修改后组织名称",
				parentOrgId: "new-parent-org-id",
			},
		});

		console.warn("modifyOrganization 接口响应数据:", printFormat(data));
	});

	it("使用 queryBeforeAssociate 接口 - 关联员工前查询可用员工列表", () => {
		const { execute, data } = queryBeforeAssociate({
			onError: (error) => console.warn("queryBeforeAssociate 接口请求失败:", error),
		});

		execute({
			params: {
				orgId: "test-org-id",
				pageIndex: 1,
				pageSize: 10,
				name: "测试员工",
			},
		});

		console.warn("queryBeforeAssociate 接口响应数据:", printFormat(data));
	});

	it("使用 getOrgEmployeeList 接口 - 获取指定组织的员工列表", () => {
		const { execute, data } = getOrgEmployeeList({
			onError: (error) => console.warn("getOrgEmployeeList 接口请求失败:", error),
		});

		execute({
			params: {
				orgId: "test-org-id",
				pageIndex: 1,
				pageSize: 10,
				name: "员工姓名",
			},
		});

		console.warn("getOrgEmployeeList 接口响应数据:", printFormat(data));
	});
});
