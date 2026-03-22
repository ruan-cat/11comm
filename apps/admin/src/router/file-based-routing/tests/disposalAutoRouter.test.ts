import { describe, expect, it } from "vitest";
import type { RouteRecordRaw } from "vue-router";
import { disposalAutoRouter } from "../process-auto-routes";

describe("disposalAutoRouter", () => {
	it("应该将空路径子路由的属性合并到父路由", () => {
		const routes = [
			{
				path: "/property-manage",
				children: [
					{
						path: "",
						name: "PropertyManage",
						meta: {
							title: "物业管理",
						},
					},
					{
						path: "community-manage",
						name: "CommunityManage",
					},
				],
			},
		] as RouteRecordRaw[];

		const result = disposalAutoRouter(routes);

		expect(result[0].name).toBe("PropertyManage");
		expect(result[0].meta?.title).toBe("物业管理");
		expect(result[0].children).toHaveLength(1);
		expect(result[0].children?.[0].path).toBe("/property-manage/community-manage");
	});

	it("应该递归拼接嵌套路由的完整路径", () => {
		const routes = [
			{
				path: "/operation-team",
				children: [
					{
						path: "data-manage",
						children: [
							{
								path: "manage-community-[id]",
								name: "ManageCommunity",
							},
						],
					},
				],
			},
		] as RouteRecordRaw[];

		const result = disposalAutoRouter(routes);
		const manageCommunityRoute = result[0].children?.[0].children?.[0];

		expect(manageCommunityRoute?.path).toBe("/operation-team/data-manage/manage-community-[id]");
	});
});
