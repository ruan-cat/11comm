import { describe, expect, it } from "vitest";
import { getRouteName } from "../get-route-name";

interface RouteNode {
	parent: RouteNode | null;
	value: {
		rawSegment: string;
	};
}

function createRouteNode(rawSegment: string, parent: RouteNode | null = null): RouteNode {
	return {
		parent,
		value: {
			rawSegment,
		},
	};
}

describe("getRouteName", () => {
	it("应该跳过根节点并用短横线拼接路由名", () => {
		const root = createRouteNode("");
		const propertyManage = createRouteNode("property-manage", root);
		const communityManage = createRouteNode("community-manage", propertyManage);
		const manageCommunity = createRouteNode("manage-community-[id]", communityManage);

		expect(getRouteName(manageCommunity as never)).toBe("property-manage-community-manage-manage-community-[id]");
	});

	it("应该忽略 index 节点的片段", () => {
		const root = createRouteNode("");
		const devTeam = createRouteNode("dev-team", root);
		const menuManage = createRouteNode("menu-manage", devTeam);
		const indexNode = createRouteNode("index", menuManage);

		expect(getRouteName(indexNode as never)).toBe("dev-team-menu-manage");
	});
});
