/**
 * @file 组织管理-组织信息-组织树接口
 * @description Organization info tree API
 * POST /api/setting-manage/organize-manage/org-info/tree
 */

import { defineHandler, readBody } from "nitro/h3";
import { useDb } from "server/db";
import { smOrganizations } from "@01s-11comm/type";
import type { JsonVO, OrganizationTreeNode } from "@01s-11comm/type";
import { asc } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<OrganizationTreeNode[]>> => {
	try {
		const db = useDb(event);

		// 查询所有组织数据
		const data = await db
			.select({
				id: smOrganizations.id,
				orgName: smOrganizations.orgName,
				orgCode: smOrganizations.orgCode,
				orgType: smOrganizations.orgType,
				sortOrder: smOrganizations.sortOrder,
				parentId: smOrganizations.parentId,
				remark: smOrganizations.remark,
			})
			.from(smOrganizations)
			.orderBy(asc(smOrganizations.sortOrder), asc(smOrganizations.orgName));

		// 构建树形结构
		const treeMap = new Map<string, OrganizationTreeNode>();
		const roots: OrganizationTreeNode[] = [];

		// 先创建所有节点
		data.forEach((item) => {
			treeMap.set(item.id, {
				id: item.id,
				name: item.orgName || "",
				code: item.orgCode || "",
				type: item.orgType as any,
				sort: item.sortOrder || 0,
				parentId: item.parentId || undefined,
				description: item.remark || undefined,
				children: [],
			});
		});

		// 构建树形关系
		data.forEach((item) => {
			const node = treeMap.get(item.id)!;
			if (item.parentId && treeMap.has(item.parentId)) {
				const parent = treeMap.get(item.parentId)!;
				parent.children = parent.children || [];
				parent.children.push(node);
			} else {
				roots.push(node);
			}
		});

		const response: JsonVO<OrganizationTreeNode[]> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: roots,
		};

		return response;
	} catch (error: any) {
		console.error("[Org Info Tree] Error:", error);
		const errorResponse: JsonVO<OrganizationTreeNode[]> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: [],
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
