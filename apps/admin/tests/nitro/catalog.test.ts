/**
 * @file 菜单目录列表接口测试
 * @description 测试 /api/dev-team/menu-manage/catalog/list 接口
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "../setup-neon";

describe("菜单目录列表接口测试", () => {
	beforeAll(async () => {
		// 检查 Nitro 服务器是否运行
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	test("GET /api/dev-team/menu-manage/catalog/list - 获取菜单目录列表", async () => {
		// 调用接口
		const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
			method: "POST",
			body: JSON.stringify({
				page: 1,
				pageSize: 10,
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			data: {
				list: Array<{
					label: string;
					name: string;
				}>;
				total: number;
				pageIndex: number;
				pageSize: number;
				totalPages: number;
			};
		};

		// 验证响应结构
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toBeDefined();
		expect(result.data.list).toBeInstanceOf(Array);
		expect(typeof result.data.total).toBe("number");
		expect(result.data.pageIndex).toBe(1);
		expect(result.data.pageSize).toBe(10);

		// 验证列表项结构（如果返回了数据）
		if (result.data.list.length > 0) {
			const firstItem = result.data.list[0];
			expect(firstItem.label).toBeDefined();
			expect(firstItem.name).toBeDefined();
		}

		console.log("✅ 菜单目录列表接口测试通过");
		console.log(`📊 总数: ${result.data.total}, 页码: ${result.data.pageIndex}`);
	});

	test("POST /api/dev-team/menu-manage/catalog/list - 带查询条件的列表查询", async () => {
		// 调用接口，带查询条件
		const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
			method: "POST",
			body: JSON.stringify({
				page: 1,
				pageSize: 5,
				name: "测试", // 假设有测试数据
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			data: {
				list: Array<Record<string, unknown>>;
				total: number;
			};
		};

		// 验证响应结构
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(Array.isArray(result.data.list)).toBe(true);

		console.log("✅ 带查询条件的列表查询测试通过");
	});

	test("POST /api/dev-team/menu-manage/catalog/list - 分页参数测试", async () => {
		// 测试不同分页参数
		const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
			method: "POST",
			body: JSON.stringify({
				page: 2,
				pageSize: 5,
			}),
		});

		expect(response.ok).toBe(true);

		const result = (await response.json()) as {
			data: {
				pageIndex: number;
				pageSize: number;
			};
		};

		expect(result.data.pageIndex).toBe(2);
		expect(result.data.pageSize).toBe(5);

		console.log("✅ 分页参数测试通过");
	});
});
