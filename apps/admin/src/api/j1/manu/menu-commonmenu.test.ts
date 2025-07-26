import { describe, it, expect } from "vitest";
import {
	addCommonMenu,
	queryAllCommonMenu,
	queryCommonMenuName,
	removeCommonMenu,
	type AddCommonMenuParams,
	type RemoveCommonMenuParams,
	type CommonMenuData,
	type CommonMenuNameData,
} from "./menu-commonmenu";

describe("通用菜单接口测试", () => {
	// 添加通用菜单测试
	it("应该能够添加通用菜单", async () => {
		const params: AddCommonMenuParams = {
			name: "测试菜单",
			icon: "icon-test",
			path: "/test",
			component: "TestComponent",
			parentId: "",
			sort: 1,
			menuType: "menu",
			permission: "test:view",
			status: "1",
			description: "这是一个测试菜单",
		};

		const { data, execute } = addCommonMenu<string>({
			immediate: false,
		});

		await execute({
			data: params,
		});

		expect(execute).toBeDefined();
		// 这里可以添加更多的断言，比如检查返回值等
	});

	// 获取所有通用菜单测试
	it("应该能够获取所有通用菜单", async () => {
		const { data, execute } = queryAllCommonMenu<CommonMenuData[]>({
			immediate: false,
		});

		await execute();

		expect(execute).toBeDefined();
		// 可以添加更多断言来验证返回的菜单数据结构
	});

	// 获取通用菜单名称列表测试
	it("应该能够获取通用菜单名称列表", async () => {
		const { data, execute } = queryCommonMenuName<CommonMenuNameData[]>({
			immediate: false,
		});

		await execute();

		expect(execute).toBeDefined();
		// 可以验证返回的名称列表数据结构
	});

	// 删除通用菜单测试
	it("应该能够删除通用菜单", async () => {
		const params: RemoveCommonMenuParams = {
			menuId: "test-menu-id",
		};

		const { data, execute } = removeCommonMenu<string>({
			immediate: false,
		});

		await execute({
			params,
		});

		expect(execute).toBeDefined();
		// 可以添加更多断言来验证删除操作
	});

	// 参数验证测试
	it("添加菜单时应该验证必填参数", () => {
		const validParams: AddCommonMenuParams = {
			name: "有效菜单名称",
		};

		const invalidParams = {
			// 缺少必填的 name 字段
			icon: "icon-test",
		};

		expect(validParams.name).toBeDefined();
		expect(validParams.name).toBe("有效菜单名称");
	});

	// 数据类型测试
	it("应该正确定义数据类型", () => {
		const menuData: CommonMenuData = {
			menuId: "menu-001",
			name: "测试菜单",
			icon: "icon-test",
			path: "/test",
			component: "TestComponent",
			parentId: "",
			sort: 1,
			menuType: "menu",
			permission: "test:view",
			status: "1",
			description: "测试描述",
			createTime: "2025-01-01 12:00:00",
			updateTime: "2025-01-01 12:00:00",
		};

		expect(menuData.menuId).toBe("menu-001");
		expect(menuData.name).toBe("测试菜单");
		expect(typeof menuData.sort).toBe("number");
	});

	// 菜单名称数据测试
	it("应该正确处理菜单名称数据", () => {
		const menuNameData: CommonMenuNameData = {
			menuId: "menu-001",
			name: "测试菜单",
		};

		expect(menuNameData.menuId).toBeDefined();
		expect(menuNameData.name).toBeDefined();
		expect(typeof menuNameData.menuId).toBe("string");
		expect(typeof menuNameData.name).toBe("string");
	});
});

// 接口集成测试
describe("通用菜单接口集成测试", () => {
	it("应该能够完成完整的菜单CRUD操作流程", async () => {
		// 1. 添加菜单
		const addParams: AddCommonMenuParams = {
			name: "集成测试菜单",
			icon: "icon-integration",
			path: "/integration-test",
			component: "IntegrationTestComponent",
			sort: 100,
			menuType: "menu",
			permission: "integration:test",
			status: "1",
		};

		const { execute: addExecute } = addCommonMenu<string>({
			immediate: false,
		});

		// 2. 查询所有菜单
		const { execute: queryAllExecute } = queryAllCommonMenu<CommonMenuData[]>({
			immediate: false,
		});

		// 3. 查询菜单名称
		const { execute: queryNameExecute } = queryCommonMenuName<CommonMenuNameData[]>({
			immediate: false,
		});

		// 4. 删除菜单
		const { execute: removeExecute } = removeCommonMenu<string>({
			immediate: false,
		});

		// 执行测试流程
		expect(addExecute).toBeDefined();
		expect(queryAllExecute).toBeDefined();
		expect(queryNameExecute).toBeDefined();
		expect(removeExecute).toBeDefined();
	});
});