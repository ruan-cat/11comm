/**
 * @file 组织管理-组织信息-组织树接口
 * @description Organization info tree API
 * POST /api/setting-manage/organize-manage/org-info/tree
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, OrganizationTreeNode } from "@01s-11comm/type";
import { mockOrganizationTreeData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<OrganizationTreeNode[]>> => {
	/** 返回标准格式 */
	const response: JsonVO<OrganizationTreeNode[]> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: mockOrganizationTreeData,
	};

	return response;
});
