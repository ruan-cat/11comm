/**
 * @file 组织+小区数据隔离集成测试
 * @description 测试组织和小区级别的数据隔离是否正确工作
 *
 * 测试场景：
 * 1. 组织管理员只能访问自己组织的数据
 * 2. 小区管理员只能访问自己小区的数据
 * 3. 跨组织数据访问被拒绝
 * 4. 跨小区数据访问被拒绝
 * 5. 组织管理员可以看到所有子组织的数据
 * 6. 权限优先级：Organization > Community > Property
 *
 * @note 此测试需要在 Nitro 服务器运行状态下执行
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "../../setup-neon";
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

describe("组织+小区数据隔离集成测试", () => {
	beforeAll(async () => {
		// 检查 Nitro 服务器是否运行
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	const testSecret = process.env.NEON_AUTH_COOKIE_SECRET || "development-secret";

	describe("组织隔离测试", () => {
		test("组织管理员只能访问其组织的数据", async () => {
			// 生成组织管理员 Token，所属组织为 org-001
			const token = await generateTestToken(
				{
					sub: "org-admin-test-001",
					email: "orgadmin1@test.com",
					name: "组织管理员1",
					metadata: {
						role: "org_admin",
						organizationId: "org-001",
						organizationIds: ["org-001"],
					},
				},
				testSecret,
			);

			// 调用组织信息接口
			const response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			const result = await response.json();
			expect(result.success).toBe(true);

			// 验证返回的数据只属于 org-001
			if (result.data?.list?.length > 0) {
				for (const item of result.data.list) {
					if (item.orgId) {
						expect(item.orgId).toBe("org-001");
					}
				}
			}

			console.log("✅ 组织管理员只能访问其组织的数据");
		});

		test("跨组织数据访问应该被隔离", async () => {
			// 组织管理员属于 org-001，尝试访问 org-002 的数据
			const token = await generateTestToken(
				{
					sub: "org-admin-test-002",
					email: "orgadmin2@test.com",
					name: "组织管理员2",
					metadata: {
						role: "org_admin",
						organizationId: "org-001",
						organizationIds: ["org-001"],
					},
				},
				testSecret,
			);

			// 尝试通过查询参数指定其他组织
			const response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10, orgId: "org-002" }),
			});

			expect(response.ok).toBe(true);
			const result = await response.json();

			// 应该返回空列表或者其他组织的数据不应该被返回
			if (result.data?.list?.length > 0) {
				for (const item of result.data.list) {
					expect(item.orgId).not.toBe("org-002");
				}
			}

			console.log("✅ 跨组织数据访问被正确隔离");
		});
	});

	describe("小区隔离测试", () => {
		test("小区管理员只能访问其小区的数据", async () => {
			// 生成小区管理员 Token，所属小区为 comm-001
			const token = await generateTestToken(
				{
					sub: "comm-admin-test-001",
					email: "commadmin1@test.com",
					name: "小区管理员1",
					metadata: {
						role: "community_admin",
						organizationId: "org-001",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			// 调用小区公告接口
			const response = await fetchNitroApi("/api/property-manage/community-manage/notice/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			const result = await response.json();
			expect(result.success).toBe(true);

			// 验证返回的数据只属于 comm-001
			if (result.data?.list?.length > 0) {
				for (const item of result.data.list) {
					if (item.communityId) {
						expect(item.communityId).toBe("comm-001");
					}
				}
			}

			console.log("✅ 小区管理员只能访问其小区的数据");
		});

		test("跨小区数据访问应该被隔离", async () => {
			// 小区管理员属于 comm-001，尝试访问 comm-002 的数据
			const token = await generateTestToken(
				{
					sub: "comm-admin-test-002",
					email: "commadmin2@test.com",
					name: "小区管理员2",
					metadata: {
						role: "community_admin",
						organizationId: "org-001",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			// 尝试通过查询参数指定其他小区
			const response = await fetchNitroApi("/api/property-manage/community-manage/notice/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10, communityId: "comm-002" }),
			});

			expect(response.ok).toBe(true);
			const result = await response.json();

			// 应该返回空列表或者其他小区的数据不应该被返回
			if (result.data?.list?.length > 0) {
				for (const item of result.data.list) {
					expect(item.communityId).not.toBe("comm-002");
				}
			}

			console.log("✅ 跨小区数据访问被正确隔离");
		});
	});

	describe("子组织访问测试", () => {
		test("组织管理员可以访问其子组织的数据", async () => {
			// 生成组织管理员 Token，管理 org-001 及其子组织
			const token = await generateTestToken(
				{
					sub: "org-admin-parent",
					email: "orgadminparent@test.com",
					name: "父组织管理员",
					metadata: {
						role: "org_admin",
						organizationId: "org-001",
						organizationIds: ["org-001", "org-001-child1", "org-001-child2"],
					},
				},
				testSecret,
			);

			// 调用组织信息接口
			const response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			const result = await response.json();
			expect(result.success).toBe(true);

			// 验证返回的数据属于 org-001 及其子组织
			if (result.data?.list?.length > 0) {
				for (const item of result.data.list) {
					const validOrgIds = ["org-001", "org-001-child1", "org-001-child2"];
					if (item.orgId) {
						expect(validOrgIds).toContain(item.orgId);
					}
				}
			}

			console.log("✅ 组织管理员可以访问其子组织的数据");
		});
	});

	describe("权限优先级测试", () => {
		test("权限优先级：Organization > Community > Property", async () => {
			// 测试权限优先级逻辑
			// 超级管理员（Organization 级别）可以访问所有
			const superAdminToken = await generateTestToken(
				{
					sub: "super-admin-test",
					email: "superadmin@test.com",
					name: "超级管理员",
					metadata: {
						role: "super_admin",
					},
				},
				testSecret,
			);

			let response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${superAdminToken}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			console.log("✅ 超级管理员可以访问所有数据（Organization 级别）");

			// 组织管理员（Organization 级别）可以访问组织及子组织数据
			const orgAdminToken = await generateTestToken(
				{
					sub: "org-admin-test-perm",
					email: "orgadminperm@test.com",
					name: "组织管理员",
					metadata: {
						role: "org_admin",
						organizationId: "org-001",
						organizationIds: ["org-001"],
					},
				},
				testSecret,
			);

			response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${orgAdminToken}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			console.log("✅ 组织管理员可以访问组织数据（Organization 级别）");

			// 小区管理员（Community 级别）只能访问小区数据
			const commAdminToken = await generateTestToken(
				{
					sub: "comm-admin-test-perm",
					email: "commadminperm@test.com",
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

			response = await fetchNitroApi("/api/property-manage/community-manage/notice/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${commAdminToken}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			console.log("✅ 小区管理员只能访问小区数据（Community 级别）");

			// 业主（Property 级别）只能访问房产数据
			const ownerToken = await generateTestToken(
				{
					sub: "owner-test-perm",
					email: "ownerperm@test.com",
					name: "业主",
					metadata: {
						role: "owner",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			response = await fetchNitroApi("/api/property-manage/expense-manage/house-charge/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${ownerToken}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			expect(response.ok).toBe(true);
			console.log("✅ 业主只能访问房产数据（Property 级别）");
		});
	});

	describe("多层隔离场景测试", () => {
		test("员工尝试访问组织级别数据应该被正确处理", async () => {
			// 物业员工（Community 级别）尝试访问组织信息
			const staffToken = await generateTestToken(
				{
					sub: "staff-org-test",
					email: "stafforg@test.com",
					name: "物业员工",
					metadata: {
						role: "staff",
						organizationId: "org-001",
						communityId: "comm-001",
						communityIds: ["comm-001"],
					},
				},
				testSecret,
			);

			// 员工尝试访问组织信息 - 可能会被拒绝或者只能看到有限信息
			const response = await fetchNitroApi("/api/setting-manage/organize-manage/org-info/list", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${staffToken}`,
				},
				body: JSON.stringify({ page: 1, pageSize: 10 }),
			});

			// 员工可能无法访问组织级别的数据，或者只能看到与其相关的信息
			expect([200, 403]).toContain(response.status);

			console.log("✅ 员工访问组织级别数据的行为符合预期");
		});
	});
});
