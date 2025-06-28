import { describe, it, expect, beforeEach } from "vitest";
import { setRedirectByRank } from "../index";
import type { RouteRecordRaw } from "vue-router";

describe("setRedirectByRank", () => {
	describe("基础功能测试", () => {
		it("应该为有子路由的父路由设置重定向", () => {
			const routes = [
				{
					path: "/parent",
					name: "Parent",
					children: [
						{
							path: "/parent/child1",
							name: "Child1",
						},
						{
							path: "/parent/child2",
							name: "Child2",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/parent/child1");
		});

		it("应该跳过详情页路由，选择第一个非详情页子路由", () => {
			const routes = [
				{
					path: "/parent",
					name: "Parent",
					children: [
						{
							path: "/parent/child-detail-page",
							name: "ChildDetailPage",
						},
						{
							path: "/parent/normal-child",
							name: "NormalChild",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/parent/normal-child");
		});

		it("应该跳过详情页路由本身", () => {
			const routes = [
				{
					path: "/detail-page",
					name: "DetailPage",
					children: [
						{
							path: "/detail-page/child1",
							name: "Child1",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			// 详情页路由不应该设置重定向
			expect(routes[0].redirect).toBeUndefined();
		});

		it("应该处理没有子路由的情况", () => {
			const routes = [
				{
					path: "/leaf",
					name: "Leaf",
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBeUndefined();
		});

		it("应该处理空children数组的情况", () => {
			const routes = [
				{
					path: "/empty-children",
					name: "EmptyChildren",
					children: [],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBeUndefined();
		});
	});

	describe("嵌套路由测试", () => {
		it("应该递归处理多层嵌套路由", () => {
			const routes = [
				{
					path: "/level1",
					name: "Level1",
					children: [
						{
							path: "/level1/level2",
							name: "Level2",
							children: [
								{
									path: "/level1/level2/level3-detail-page",
									name: "Level3DetailPage",
								},
								{
									path: "/level1/level2/level3-normal",
									name: "Level3Normal",
								},
							],
						},
						{
							path: "/level1/level2-other",
							name: "Level2Other",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			// 第一层重定向
			expect(routes[0].redirect).toBe("/level1/level2");
			// 第二层重定向 - 跳过详情页
			expect(routes[0].children![0].redirect).toBe("/level1/level2/level3-normal");
		});

		it("应该处理复杂的多分支嵌套结构", () => {
			const routes = [
				{
					path: "/management",
					name: "Management",
					children: [
						{
							path: "/management/user",
							name: "UserManagement",
							children: [
								{
									path: "/management/user/detail-page",
									name: "UserDetailPage",
								},
								{
									path: "/management/user/list",
									name: "UserList",
								},
								{
									path: "/management/user/create",
									name: "UserCreate",
								},
							],
						},
						{
							path: "/management/role",
							name: "RoleManagement",
							children: [
								{
									path: "/management/role/list",
									name: "RoleList",
								},
							],
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/management/user");
			expect(routes[0].children![0].redirect).toBe("/management/user/list");
			expect(routes[0].children![1].redirect).toBe("/management/role/list");
		});
	});

	describe("边界情况测试", () => {
		it("应该处理全部子路由都是详情页的情况", () => {
			const routes = [
				{
					path: "/all-details",
					name: "AllDetails",
					children: [
						{
							path: "/all-details/detail-page-1",
							name: "DetailPage1",
						},
						{
							path: "/all-details/detail-page-2",
							name: "DetailPage2",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			// 如果所有子路由都是详情页，则不设置重定向
			expect(routes[0].redirect).toBeUndefined();
		});

		it("应该处理路径为根路径的情况", () => {
			const routes = [
				{
					path: "/",
					name: "Root",
					children: [
						{
							path: "/home",
							name: "Home",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/home");
		});

		it("应该处理没有path的子路由", () => {
			const routes = [
				{
					path: "/parent",
					name: "Parent",
					children: [
						{
							name: "ChildWithoutPath",
						},
						{
							path: "/parent/normal-child",
							name: "NormalChild",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/parent/normal-child");
		});

		it("应该处理空路由数组", () => {
			const routes = [] as any;

			// 应该不抛出错误
			expect(() => setRedirectByRank(routes)).not.toThrow();
		});

		it("应该处理子路由path为空字符串的情况", () => {
			const routes = [
				{
					path: "/parent",
					name: "Parent",
					children: [
						{
							path: "",
							name: "EmptyPath",
						},
						{
							path: "/parent/normal",
							name: "Normal",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			// 应该跳过空路径，选择正常路径
			expect(routes[0].redirect).toBe("/parent/normal");
		});
	});

	describe("路径构建测试", () => {
		it("应该正确处理多级路径的拼接", () => {
			const routes = [
				{
					path: "/system/management",
					name: "SystemManagement",
					children: [
						{
							path: "/system/management/users/list",
							name: "UsersList",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/system/management/users/list");
		});

		it("应该正确处理重复斜杠的清理", () => {
			const routes = [
				{
					path: "/parent/",
					name: "Parent",
					children: [
						{
							path: "/parent/child",
							name: "Child",
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/parent/child");
		});
	});

	describe("实际业务场景测试", () => {
		it("应该正确处理类似物业管理的路由结构", () => {
			const routes = [
				{
					path: "/property-manage",
					name: "PropertyManage",
					children: [
						{
							path: "/property-manage/community-manage",
							name: "CommunityManage",
							children: [
								{
									path: "/property-manage/community-manage/house-decoration-detail-page",
									name: "HouseDecorationDetailPage",
								},
								{
									path: "/property-manage/community-manage/my",
									name: "My",
								},
								{
									path: "/property-manage/community-manage/handing-business",
									name: "HandingBusiness",
								},
							],
						},
						{
							path: "/property-manage/parking-manage",
							name: "ParkingManage",
							children: [
								{
									path: "/property-manage/parking-manage/carport-apply",
									name: "CarportApply",
								},
							],
						},
					],
				},
			] as any;

			setRedirectByRank(routes);

			expect(routes[0].redirect).toBe("/property-manage/community-manage");
			expect(routes[0].children![0].redirect).toBe("/property-manage/community-manage/my");
			expect(routes[0].children![1].redirect).toBe("/property-manage/parking-manage/carport-apply");
		});
	});
});
