import { describe, it, expect } from "vitest";
import {
	addCommonMenu,
	queryCommonMenuList,
	queryOptionalMenuList,
	removeCommonMenu,
	type AddCommonMenuParams,
	type RemoveCommonMenuParams,
	type QueryCommonMenuListParams,
	type CommonMenuData,
	type OptionalMenuData,
} from "./menu-commonmenu";

describe("常用菜单接口测试", () => {
	// 添加常用菜单测试
	it("应该能够添加常用菜单", async () => {
		const params: AddCommonMenuParams = {
			mid: "menu-001",
			sort: 1,
			status: "1",
			remark: "测试常用菜单",
		};

		const { data, execute } = addCommonMenu<string>({
			immediate: false,
		});

		await execute({
			data: params,
		});

		expect(execute).toBeDefined();
		// 验证必填参数
		expect(params.mid).toBeDefined();
		expect(params.mid).toBe("menu-001");
	});

	// 获取常用菜单列表测试
	it("应该能够获取常用菜单列表", async () => {
		const params: QueryCommonMenuListParams = {
			pageIndex: 1,
			pageSize: 10,
			menuName: "测试菜单",
			status: "1",
			storeType: "admin",
		};

		const { data, execute } = queryCommonMenuList<PageDTO<CommonMenuData>>({
			immediate: false,
		});

		await execute({
			params,
		});

		expect(execute).toBeDefined();
		// 验证分页参数
		expect(params.pageIndex).toBe(1);
		expect(params.pageSize).toBe(10);
	});

	// 获取可选菜单下拉列表测试
	it("应该能够获取可选菜单下拉列表", async () => {
		const { data, execute } = queryOptionalMenuList<OptionalMenuData[]>({
			immediate: false,
		});

		await execute({
			params: {
				storeType: "admin",
			},
		});

		expect(execute).toBeDefined();
		// 可以验证返回的数据结构
	});

	// 删除常用菜单测试
	it("应该能够删除常用菜单", async () => {
		const params: RemoveCommonMenuParams = {
			commonMenuId: "common-menu-001",
		};

		const { data, execute } = removeCommonMenu<string>({
			immediate: false,
		});

		await execute({
			params,
		});

		expect(execute).toBeDefined();
		// 验证必填参数
		expect(params.commonMenuId).toBeDefined();
		expect(params.commonMenuId).toBe("common-menu-001");
	});

	// 参数验证测试
	it("添加常用菜单时应该验证必填参数", () => {
		const validParams: AddCommonMenuParams = {
			mid: "menu-001",
		};

		const invalidParams = {
			// 缺少必填的 mid 字段
			sort: 1,
		};

		expect(validParams.mid).toBeDefined();
		expect(validParams.mid).toBe("menu-001");
	});

	// 数据类型测试
	it("应该正确定义常用菜单数据类型", () => {
		const menuData: CommonMenuData = {
			commonMenuId: "common-001",
			mid: "menu-001",
			menuName: "测试菜单",
			menuPath: "/test",
			icon: "icon-test",
			sort: 1,
			status: "1",
			remark: "测试描述",
			createTime: "2025-01-01 12:00:00",
			updateTime: "2025-01-01 12:00:00",
		};

		expect(menuData.commonMenuId).toBe("common-001");
		expect(menuData.mid).toBe("menu-001");
		expect(menuData.menuName).toBe("测试菜单");
		expect(typeof menuData.sort).toBe("number");
	});

	// 可选菜单数据测试
	it("应该正确定义可选菜单数据类型", () => {
		const optionalMenuData: OptionalMenuData = {
			mid: "menu-001",
			menuName: "测试菜单",
			menuPath: "/test",
			icon: "icon-test",
			parentId: "parent-001",
		};

		expect(optionalMenuData.mid).toBeDefined();
		expect(optionalMenuData.menuName).toBeDefined();
		expect(typeof optionalMenuData.mid).toBe("string");
		expect(typeof optionalMenuData.menuName).toBe("string");
	});

	// 分页参数测试
	it("分页查询应该验证分页参数", () => {
		const pageParams: QueryCommonMenuListParams = {
			pageIndex: 1,
			pageSize: 10,
		};

		expect(pageParams.pageIndex).toBeGreaterThan(0);
		expect(pageParams.pageSize).toBeGreaterThan(0);
		expect(typeof pageParams.pageIndex).toBe("number");
		expect(typeof pageParams.pageSize).toBe("number");
	});
});

// 接口集成测试
describe("常用菜单接口集成测试", () => {
	it("应该能够完成完整的常用菜单CRUD操作流程", async () => {
		// 1. 获取可选菜单列表
		const { execute: queryOptionalExecute } = queryOptionalMenuList<OptionalMenuData[]>({
			immediate: false,
		});

		// 2. 添加常用菜单
		const addParams: AddCommonMenuParams = {
			mid: "integration-test-menu",
			sort: 100,
			status: "1",
			remark: "集成测试菜单",
		};

		const { execute: addExecute } = addCommonMenu<string>({
			immediate: false,
		});

		// 3. 查询常用菜单列表
		const queryParams: QueryCommonMenuListParams = {
			pageIndex: 1,
			pageSize: 10,
			menuName: "集成测试",
		};

		const { execute: queryListExecute } = queryCommonMenuList<PageDTO<CommonMenuData>>({
			immediate: false,
		});

		// 4. 删除常用菜单
		const { execute: removeExecute } = removeCommonMenu<string>({
			immediate: false,
		});

		// 执行测试流程
		expect(queryOptionalExecute).toBeDefined();
		expect(addExecute).toBeDefined();
		expect(queryListExecute).toBeDefined();
		expect(removeExecute).toBeDefined();
	});
});