/**
 * 登出 API
 * @description 用户退出登录，清除会话 Cookie
 */

import { defineHandler, deleteCookie } from "nitro/h3";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	try {
		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 尝试从 Cookie 中清除会话 */
		try {
			await authClient.signOut();
		} catch {
			/** 忽略登出错误，确保 Cookie 清除成功 */
		}

		/** 清除认证 Cookie */
		deleteCookie(event, "authorized-token", {
			path: "/",
		});

		/** 清除刷新 Token Cookie */
		deleteCookie(event, "refresh-token", {
			path: "/",
		});

		const response: JsonVO<null> = {
			success: true,
			code: 200,
			message: "登出成功",
			data: null,
		};

		return response;
	} catch (error: any) {
		console.error("[Sign Out] Error:", error);

		/** 即使出错也清除 Cookie */
		deleteCookie(event, "authorized-token", { path: "/" });
		deleteCookie(event, "refresh-token", { path: "/" });

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "登出失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
