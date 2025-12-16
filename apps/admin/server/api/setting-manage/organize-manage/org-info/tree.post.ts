/**
 * @file 组织管理-组织信息-组织树接口
 * @description Organization info tree API
 */

import { defineEventHandler } from "h3";
import type { JsonVO, OrganizationTreeNode } from "@01s-11comm/type";
import { mockOrganizationTreeData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<OrganizationTreeNode[]>> => {
	return {
		code: 200,
		message: "success",
		success: true,
		data: mockOrganizationTreeData,
	};
});
