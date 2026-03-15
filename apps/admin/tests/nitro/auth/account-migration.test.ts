/**
 * @file 账户迁移接口测试
 * @description 测试账户迁移相关接口
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "../../setup-neon";

describe("账户迁移接口测试", () => {
	beforeAll(async () => {
		// 检查 Nitro 服务器是否运行
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	/**
	 * 测试获取迁移列表接口
	 * GET /api/auth/migrate/list
	 */
	test("GET /api/auth/migrate/list - 获取未迁移账户列表", async () => {
		// 调用接口
		const response = await fetchNitroApi("/api/auth/migrate/list", {
			method: "GET",
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			message: string;
			data: {
				staff: Array<{
					id: string;
					name: string;
					email?: string;
					phone?: string;
					userType: "staff" | "owner";
				}>;
				owners: Array<{
					id: string;
					name: string;
					email?: string;
					phone?: string;
					userType: "staff" | "owner";
				}>;
				total: number;
			};
		};

		// 验证响应结构
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toBeDefined();
		expect(result.data.staff).toBeInstanceOf(Array);
		expect(result.data.owners).toBeInstanceOf(Array);
		expect(typeof result.data.total).toBe("number");
		expect(result.data.total).toBe(result.data.staff.length + result.data.owners.length);

		console.log("✅ 获取未迁移账户列表接口测试通过");
		console.log(`📊 总数: ${result.data.total}, 员工: ${result.data.staff.length}, 业主: ${result.data.owners.length}`);
	});

	/**
	 * 测试获取迁移统计接口
	 * GET /api/auth/migrate/stats
	 */
	test("GET /api/auth/migrate/stats - 获取迁移统计信息", async () => {
		// 调用接口
		const response = await fetchNitroApi("/api/auth/migrate/stats", {
			method: "GET",
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			message: string;
			data: {
				totalStaff: number;
				migratedStaff: number;
				totalOwners: number;
				migratedOwners: number;
				staffProgress: string;
				ownerProgress: string;
			};
		};

		// 验证响应结构
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toBeDefined();
		expect(typeof result.data.totalStaff).toBe("number");
		expect(typeof result.data.migratedStaff).toBe("number");
		expect(typeof result.data.totalOwners).toBe("number");
		expect(typeof result.data.migratedOwners).toBe("number");
		expect(typeof result.data.staffProgress).toBe("string");
		expect(typeof result.data.ownerProgress).toBe("string");

		// 验证进度百分比格式
		expect(result.data.staffProgress).toMatch(/^\d+%|0%$/);
		expect(result.data.ownerProgress).toMatch(/^\d+%|0%$/);

		// 验证已迁移数量不超过总数
		expect(result.data.migratedStaff).toBeLessThanOrEqual(result.data.totalStaff);
		expect(result.data.migratedOwners).toBeLessThanOrEqual(result.data.totalOwners);

		console.log("✅ 获取迁移统计接口测试通过");
		console.log(`📊 员工: ${result.data.migratedStaff}/${result.data.totalStaff} (${result.data.staffProgress})`);
		console.log(`📊 业主: ${result.data.migratedOwners}/${result.data.totalOwners} (${result.data.ownerProgress})`);
	});

	/**
	 * 测试账户迁移接口 - 参数验证错误
	 * POST /api/auth/migrate
	 */
	test("POST /api/auth/migrate - 参数验证错误", async () => {
		// 调用接口，传入无效参数
		const response = await fetchNitroApi("/api/auth/migrate", {
			method: "POST",
			body: JSON.stringify({
				accounts: [], // 空数组，应该返回错误
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			message: string;
		};

		// 验证返回错误
		expect(result.success).toBe(false);
		expect(result.code).toBe(400);

		console.log("✅ 账户迁移参数验证错误测试通过");
	});

	/**
	 * 测试账户迁移接口 - 无效的账户数据
	 * POST /api/auth/migrate
	 */
	test("POST /api/auth/migrate - 无效的账户数据格式", async () => {
		// 调用接口，传入无效数据格式
		const response = await fetchNitroApi("/api/auth/migrate", {
			method: "POST",
			body: JSON.stringify({
				accounts: [
					{
						oldId: "invalid-uuid", // 无效的 UUID
						email: "not-an-email", // 无效的邮箱
						password: "123", // 密码太短
						userType: "staff",
					},
				],
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			message: string;
		};

		// 验证返回错误
		expect(result.success).toBe(false);
		expect(result.code).toBe(400);

		console.log("✅ 账户迁移无效数据格式测试通过");
	});

	/**
	 * 测试迁移验证接口 - 参数验证错误
	 * POST /api/auth/migrate/verify
	 */
	test("POST /api/auth/migrate/verify - 参数验证错误", async () => {
		// 调用接口，传入无效参数
		const response = await fetchNitroApi("/api/auth/migrate/verify", {
			method: "POST",
			body: JSON.stringify({
				email: "not-an-email", // 无效的邮箱
				password: "", // 密码为空
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			message: string;
		};

		// 验证返回错误
		expect(result.success).toBe(false);
		expect(result.code).toBe(400);

		console.log("✅ 迁移验证参数验证错误测试通过");
	});

	/**
	 * 测试迁移验证接口 - 错误的凭据
	 * POST /api/auth/migrate/verify
	 */
	test("POST /api/auth/migrate/verify - 错误的凭据", async () => {
		// 调用接口，使用错误的凭据
		const response = await fetchNitroApi("/api/auth/migrate/verify", {
			method: "POST",
			body: JSON.stringify({
				email: "nonexistent@example.com",
				password: "wrongpassword",
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = (await response.json()) as {
			success: boolean;
			code: number;
			message: string;
			data: {
				success: boolean;
				error?: string;
			};
		};

		// 验证返回错误
		expect(result.success).toBe(false);
		expect(result.code).toBe(401);
		expect(result.data.success).toBe(false);

		console.log("✅ 迁移验证错误凭据测试通过");
	});

	/**
	 * 测试迁移列表接口 - 返回数据格式完整性
	 * GET /api/auth/migrate/list
	 */
	test("GET /api/auth/migrate/list - 返回数据格式完整性", async () => {
		// 调用接口
		const response = await fetchNitroApi("/api/auth/migrate/list", {
			method: "GET",
		});

		expect(response.ok).toBe(true);

		const result = (await response.json()) as {
			data: {
				staff: Array<Record<string, unknown>>;
				owners: Array<Record<string, unknown>>;
			};
		};

		// 如果有数据，验证字段结构
		if (result.data.staff.length > 0) {
			const firstStaff = result.data.staff[0];
			expect(firstStaff.id).toBeDefined();
			expect(firstStaff.name).toBeDefined();
			expect(firstStaff.userType).toBe("staff");
		}

		if (result.data.owners.length > 0) {
			const firstOwner = result.data.owners[0];
			expect(firstOwner.id).toBeDefined();
			expect(firstOwner.name).toBeDefined();
			expect(firstOwner.userType).toBe("owner");
		}

		console.log("✅ 迁移列表返回数据格式完整性测试通过");
	});
});
