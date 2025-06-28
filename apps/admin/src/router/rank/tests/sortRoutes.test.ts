import { describe, it, expect } from "vitest";
import { sortRoutes } from "../index";

describe("sortRoutes 函数测试", () => {
	describe("基础排序功能", () => {
		it("应该根据 meta.rank 对路由进行升序排序", () => {
			const mockRoutes = [
				{
					path: "/route-c",
					name: "RouteC",
					meta: {
						title: "路由C",
						rank: 30000,
					},
				},
				{
					path: "/route-a",
					name: "RouteA",
					meta: {
						title: "路由A",
						rank: 10000,
					},
				},
				{
					path: "/route-b",
					name: "RouteB",
					meta: {
						title: "路由B",
						rank: 20000,
					},
				},
			] as any;

			const result = sortRoutes(mockRoutes);

			expect(result[0].name).toBe("RouteA");
			expect(result[1].name).toBe("RouteB");
			expect(result[2].name).toBe("RouteC");
		});

		it("应该直接修改原数组而不是创建新数组", () => {
			const mockRoutes = [
				{
					path: "/route-c",
					name: "RouteC",
					meta: {
						title: "路由C",
						rank: 30000,
					},
				},
				{
					path: "/route-a",
					name: "RouteA",
					meta: {
						title: "路由A",
						rank: 10000,
					},
				},
			] as any;

			const originalReference = mockRoutes;
			const result = sortRoutes(mockRoutes);

			// 返回的应该是同一个数组引用
			expect(result).toBe(originalReference);
			// 原数组应该被修改
			expect(mockRoutes[0].name).toBe("RouteA");
		});
	});

	describe("默认rank分配", () => {
		it("应该为没有rank的路由分配默认值", () => {
			const routesWithoutRank = [
				{
					path: "/no-rank-1",
					name: "NoRank1",
					meta: {
						title: "无排序1",
					},
				},
				{
					path: "/no-rank-2",
					name: "NoRank2",
					meta: {
						title: "无排序2",
					},
				},
			] as any;

			sortRoutes(routesWithoutRank);

			expect(routesWithoutRank[0].meta?.rank).toBe(20000);
			expect(routesWithoutRank[1].meta?.rank).toBe(20001);
		});

		it("应该为没有meta的路由创建meta对象并分配rank", () => {
			const routesWithoutMeta = [
				{
					path: "/no-meta",
					name: "NoMeta",
				},
			] as any;

			sortRoutes(routesWithoutMeta);

			expect(routesWithoutMeta[0].meta).toBeDefined();
			expect(routesWithoutMeta[0].meta?.title).toBe("NoMeta");
			expect(routesWithoutMeta[0].meta?.rank).toBe(20000);
		});
	});

	describe("树形结构递归排序", () => {
		it("应该递归排序children路由", () => {
			const treeRoutes = [
				{
					path: "/parent-b",
					name: "ParentB",
					meta: {
						title: "父路由B",
						rank: 20000,
					},
					children: [
						{
							path: "child-2",
							name: "Child2",
							meta: {
								title: "子路由2",
								rank: 200,
							},
						},
						{
							path: "child-1",
							name: "Child1",
							meta: {
								title: "子路由1",
								rank: 100,
							},
						},
					],
				},
				{
					path: "/parent-a",
					name: "ParentA",
					meta: {
						title: "父路由A",
						rank: 10000,
					},
					children: [
						{
							path: "child-y",
							name: "ChildY",
							meta: {
								title: "子路由Y",
								rank: 300,
							},
						},
						{
							path: "child-x",
							name: "ChildX",
							meta: {
								title: "子路由X",
								rank: 100,
							},
						},
					],
				},
			] as any;

			sortRoutes(treeRoutes);

			// 父级路由应该按rank排序
			expect(treeRoutes[0].name).toBe("ParentA");
			expect(treeRoutes[1].name).toBe("ParentB");

			// 子路由也应该按rank排序
			expect(treeRoutes[0].children?.[0].name).toBe("ChildX");
			expect(treeRoutes[0].children?.[1].name).toBe("ChildY");
			expect(treeRoutes[1].children?.[0].name).toBe("Child1");
			expect(treeRoutes[1].children?.[1].name).toBe("Child2");
		});

		it("应该处理多层嵌套的路由树", () => {
			const deepTreeRoutes = [
				{
					path: "/level1",
					name: "Level1",
					meta: {
						title: "一级路由",
						rank: 10000,
					},
					children: [
						{
							path: "level2",
							name: "Level2",
							meta: {
								title: "二级路由",
								rank: 100,
							},
							children: [
								{
									path: "level3-b",
									name: "Level3B",
									meta: {
										title: "三级路由B",
										rank: 20,
									},
								},
								{
									path: "level3-a",
									name: "Level3A",
									meta: {
										title: "三级路由A",
										rank: 10,
									},
								},
							],
						},
					],
				},
			] as any;

			sortRoutes(deepTreeRoutes);

			const level3Routes = deepTreeRoutes[0].children?.[0].children;
			expect(level3Routes?.[0].name).toBe("Level3A");
			expect(level3Routes?.[1].name).toBe("Level3B");
		});
	});

	describe("边界情况处理", () => {
		it("应该处理空数组", () => {
			const emptyRoutes = [] as any;
			const result = sortRoutes(emptyRoutes);

			expect(result).toEqual([]);
		});

		it("应该处理null或undefined输入", () => {
			const result1 = sortRoutes(null as any);
			const result2 = sortRoutes(undefined as any);

			expect(result1).toEqual([]);
			expect(result2).toEqual([]);
		});

		it("应该处理只有一个路由的情况", () => {
			const singleRoute = [
				{
					path: "/single",
					name: "Single",
					meta: {
						title: "单个路由",
						rank: 10000,
					},
				},
			] as any;

			const result = sortRoutes(singleRoute);

			expect(result.length).toBe(1);
			expect(result[0].name).toBe("Single");
		});

		it("应该处理相同rank值的路由", () => {
			const sameRankRoutes = [
				{
					path: "/same-1",
					name: "Same1",
					meta: {
						title: "相同排序1",
						rank: 10000,
					},
				},
				{
					path: "/same-2",
					name: "Same2",
					meta: {
						title: "相同排序2",
						rank: 10000,
					},
				},
			] as any;

			const result = sortRoutes(sameRankRoutes);

			expect(result.length).toBe(2);
			// 相同rank的路由保持原有顺序
			expect(result[0].name).toBe("Same1");
			expect(result[1].name).toBe("Same2");
		});
	});

	describe("混合场景测试", () => {
		it("应该正确处理有rank和无rank路由混合的情况", () => {
			const mixedRoutes = [
				{
					path: "/no-rank",
					name: "NoRank",
					meta: {
						title: "无排序",
					},
				},
				{
					path: "/with-rank",
					name: "WithRank",
					meta: {
						title: "有排序",
						rank: 5000,
					},
				},
			] as any;

			sortRoutes(mixedRoutes);

			// 有rank的路由应该排在前面
			expect(mixedRoutes[0].name).toBe("WithRank");
			expect(mixedRoutes[1].name).toBe("NoRank");
			expect(mixedRoutes[1].meta?.rank).toBe(20000); // 默认分配的rank (第一个无rank路由，index=0，所以是20000+0=20000)
		});

		it("应该处理复杂的混合树形结构", () => {
			const complexRoutes = [
				{
					path: "/parent-no-rank",
					name: "ParentNoRank",
					meta: {
						title: "无排序父路由",
					},
					children: [
						{
							path: "child-with-rank",
							name: "ChildWithRank",
							meta: {
								title: "有排序子路由",
								rank: 50,
							},
						},
						{
							path: "child-no-rank",
							name: "ChildNoRank",
							meta: {
								title: "无排序子路由",
							},
						},
					],
				},
				{
					path: "/parent-with-rank",
					name: "ParentWithRank",
					meta: {
						title: "有排序父路由",
						rank: 5000,
					},
					children: [],
				},
			] as any;

			sortRoutes(complexRoutes);

			// 有rank的父路由应该排在前面
			expect(complexRoutes[0].name).toBe("ParentWithRank");
			expect(complexRoutes[1].name).toBe("ParentNoRank");

			// 子路由也应该正确排序
			const children = complexRoutes[1].children;
			expect(children[0].name).toBe("ChildWithRank");
			expect(children[1].name).toBe("ChildNoRank");
		});
	});
});
