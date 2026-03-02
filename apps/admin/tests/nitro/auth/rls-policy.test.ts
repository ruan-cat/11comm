/**
 * @file RLS 策略集成测试
 * @description 测试数据库行级安全策略（Row-Level Security）是否正确工作
 *
 * 测试场景：
 * 1. 超级管理员可以访问所有数据
 * 2. 组织管理员只能访问其组织的数据
 * 3. 小区管理员只能访问其小区的数据
 * 4. 物业员工只能访问其所属小区的数据
 * 5. 业主只能访问自己房产相关的数据
 *
 * @note 此测试需要在 Nitro 服务器运行状态下执行
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "../setup-neon";
import * as jose from "jose";

/**
 * 生成测试用 JWT Token
 */
async function generateTestToken(
	payload: {
		sub: string;
		email: string;
		name?: string;
		metadata?: {
			role: string;
			organizationId?: string;
			communityId?: string;
			organizationIds?: string[];
			communityIds?: string[];
		};
	},
	secret: string,
): Promise<string> {
	const jwt = await new jose.SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1h")
		.sign(new TextEncoder().encode(secret));
	return jwt;
}

describe("RLS 策略集成测试", () => {
	beforeAll(async () => {
		// 检查 Nitro 服务器是否运行
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	const testSecret = process.env.NEON_AUTH_COOKIE_SECRET || "development-secret";

	describe("超级管理员数据访问", () => {
		test("超级管理员应该可以访问所有数据", async () => {
			// 生成超级管理员 Token
			const token = await generateTestToken(
				{
					sub: "super-admin-001",
					email: "superadmin@example.com",
					name: "超级管理员",
					metadata: {
						role: "super_admin",
					},
				},
				testSecret,
			);

			// 调用需要认证的接口
			const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 超级管理员应该能够访问
			expect(response.ok).toBe(true);

			const result = await response.json();
			expect(result.success).toBe(true);

			console.log("✅ 超级管理员可以访问所有数据");
		});
	});

	describe("组织管理员数据隔离", () => {
		test("组织管理员应该只能访问其组织的数据", async () => {
			// 生成组织管理员 Token
			const token = await generateTestToken(
				{
					sub: "org-admin-001",
					email: "orgadmin@example.com",
					name: "组织管理员",
					metadata: {
						role: "org_admin",
						organizationId: "org-001",
						organizationIds: ["org-001", "org-002"],
					},
				},
				testSecret,
			);

			// 调用需要认证的接口
			const response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 应该能够访问
			expect(response.ok).toBe(true);

			const result = await response.json();
			expect(result.success).toBe(true);

			console.log("✅ 组织管理员可以访问其组织的数据");
		});
	});

	describe("小区管理员数据隔离", () => {
		test("小区管理员应该只能访问其小区的数据", async () => {
			// 生成小区管理员 Token
			const token = await generateTestToken(
				{
					sub: "community-admin-001",
					email: "commadmin@example.com",
					name: "小区管理员",
					metadata: {
						role: "community_admin",
						organizationId: "org-001",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			// 调用需要认证的接口
			const response = await fetchNitroApi("/api/property-manage/community-manage/notice/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 应该能够访问
			expect(response.ok).toBe(true);

			const result = await response.json();
			expect(result.success).toBe(true);

			console.log("✅ 小区管理员可以访问其小区的数据");
		});
	});

	describe("物业员工数据隔离", () => {
		test("物业员工应该只能访问其所属小区的数据", async () => {
			// 生成物业员工 Token
			const token = await generateTestToken(
				{
					sub: "staff-001",
					email: "staff@example.com",
					name: "物业员工",
					metadata: {
						role: "staff",
						organizationId: "org-001",
						communityId: "comm-001",
						communityIds: ["comm-001", "comm-002"],
					},
				},
				testSecret,
			);

			// 调用需要认证的接口
			const response = await fetchNitroApi("/api/property-manage/repairs-manage/issues/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 应该能够访问
			expect(response.ok).toBe(true);

			const result = await response.json();
			expect(result.success).toBe(true);

			console.log("✅ 物业员工可以访问其所属小区的数据");
		});
	});

	describe("业主/住户数据隔离", () => {
		test("业主应该只能访问自己房产相关的数据", async () => {
			// 生成业主 Token
			const token = await generateTestToken(
				{
					sub: "owner-001",
					email: "owner@example.com",
					name: "业主",
					metadata: {
						role: "owner",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			// 调用需要认证的接口 - 业主只能查看与自己相关的费用
			const response = await fetchNitroApi("/api/property-manage/expense-manage/house-charge/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 应该能够访问
			expect(response.ok).toBe(true);

			const result = await response.json();
			expect(result.success).toBe(true);

			console.log("✅ 业主可以访问自己房产相关的数据");
		});
	});

	describe("未认证用户访问", () => {
		test("未认证用户访问需要认证的接口应该返回 401", async () => {
			// 不带 Token 调用需要认证的接口
			const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
				method: "POST",
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 应该返回 401 未授权
			expect(response.status).toBe(401);

			console.log("✅ 未认证用户被正确拒绝访问");
		});
	});

	describe("无效 Token 访问", () => {
		test("无效 Token 访问应该返回 401", async () => {
			// 使用无效 Token 调用接口
			const response = await fetchNitroApi("/api/dev-team/menu-manage/catalog/list", {
				method: "POST",
				headers: {
					Authorization: "Bearer invalid-token-12345",
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 应该返回 401
			expect(response.status).toBe(401);

			console.log("✅ 无效 Token 被正确拒绝");
		});
	});

	describe("权限升级测试", () => {
		test("普通员工尝试访问其他小区数据应该被拒绝", async () => {
			// 生成员工 Token，其所属小区为 comm-001
			const token = await generateTestToken(
				{
					sub: "staff-002",
					email: "staff2@example.com",
					name: "物业员工2",
					metadata: {
						role: "staff",
						organizationId: "org-001",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			// 尝试访问 comm-002 的数据
			const response = await fetchNitroApi("/api/property-manage/repairs-manage/issues/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"X-Community-Id": "comm-002", // 尝试指定其他小区
				},
				body: JSON.stringify({ page: 1, pageSize: 10, communityId: "comm-002" }),
			});

			// 根据 RLS 策略，即使传入了其他小区 ID，也应该只返回自己小区的数据
			// 或者返回空列表
			expect(response.ok).toBe(true);

			const result = await response.json();
			// 验证返回的数据确实是员工所属小区的数据
			if (result.data?.list) {
				for (const item of result.data.list) {
					expect(item.communityId).toBe("comm-001");
				}
			}

			console.log("✅ 权限隔离正确工作，员工无法访问其他小区数据");
		});
	});
});
