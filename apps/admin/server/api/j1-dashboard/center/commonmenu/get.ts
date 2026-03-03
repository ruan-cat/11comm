/**
 * 首页常用菜单 Mock 数据接口
 * @description 返回开发中心的常用菜单列表
 */

import { defineHandler } from "nitro/h3";
import type { JsonVO, CommonMenuInfo } from "@01s-11comm/type";

/** Mock 数据 */
const mockData: CommonMenuInfo[] = [
	{
		icon: "ep/home-filled",
		muId: "MENU001",
		name: "首页",
		seq: "1",
	},
	{
		icon: "ep/user",
		muId: "MENU002",
		name: "用户管理",
		seq: "2",
	},
	{
		icon: "ep/setting",
		muId: "MENU003",
		name: "系统设置",
		seq: "3",
	},
];

export default defineHandler(async (event) => {
	try {
		const response: JsonVO<CommonMenuInfo[]> = {
			success: true,
			code: 200,
			message: "获取成功",
			data: mockData,
		};

		return response;
	} catch (error: any) {
		console.error("[Get Common Menu] Error:", error);

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "获取常用菜单失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
