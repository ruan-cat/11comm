/**
 * 获取当前用户信息 API
 * @description 获取已登录用户的详细信息
 */

import { defineHandler } from "nitro/h3";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 当前用户信息 */
interface CurrentUser {
	id: string;
	email: string;
	name: string | null;
	role: string;
	organizationId: string | null;
	communityId: string | null;
	metadata: Record<string, any>;
}

export default defineHandler(async (event) => {
	try {
		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 获取当前会话 */
		const { data: sessionData, error: sessionError } = await authClient.getSession();

		if (sessionError) {
			console.error("[Auth Me] Session error:", sessionError);

			const errorResponse: JsonVO<null> = {
				success: false,
				code: 401,
				message: "会话验证失败",
				data: null,
				error: sessionError.message,
			};
			return errorResponse;
		}

		/** 检查是否有会话 */
		if (!sessionData?.session) {
			const noSessionResponse: JsonVO<null> = {
				success: false,
				code: 401,
				message: "未登录或会话已过期",
				data: null,
			};
			return noSessionResponse;
		}

		/** 获取用户信息 */
		const user = sessionData.user;
		const metadata = (user as any).metadata || {};

		const userInfo: CurrentUser = {
			id: user.id,
			email: user.email || "",
			name: user.name,
			role: metadata.role || "user",
			organizationId: metadata.organizationId || null,
			communityId: metadata.communityId || null,
			metadata,
		};

		const response: JsonVO<CurrentUser> = {
			success: true,
			code: 200,
			message: "获取成功",
			data: userInfo,
		};

		return response;
	} catch (error: any) {
		console.error("[Auth Me] Error:", error);

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "获取用户信息失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
