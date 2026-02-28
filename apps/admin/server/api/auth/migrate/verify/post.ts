/**
 * 验证迁移后账户登录 API
 * @description 验证迁移后的账户是否可以通过 Neon Auth 正常登录
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 验证请求参数 */
const verifySchema = z.object({
	email: z.string().email("请输入有效的邮箱地址"),
	password: z.string().min(1, "请输入密码"),
});

/** 验证响应数据 */
interface VerifyResponse {
	success: boolean;
	error?: string;
}

export default defineHandler(async (event) => {
	try {
		/** 获取并验证请求参数 */
		const body = await readBody(event);
		const { email, password } = verifySchema.parse(body);

		/** 验证账户登录 */
		const authClient = useAuthClient(event);

		const { data, error } = await authClient.signIn.email({
			email,
			password,
		});

		const success = !error && !!data?.session;

		const response: JsonVO<VerifyResponse> = {
			success,
			code: success ? 200 : 401,
			message: success ? "验证成功，账户可以正常登录" : "登录验证失败",
			data: {
				success,
				error: error?.message,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Verify Migrated Account] Error:", error);

		/** 参数验证错误 */
		if (error instanceof z.ZodError) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: error.errors[0]?.message || "请求参数无效",
				data: null,
				error: error.message,
			};
			return errorResponse;
		}

		/** 通用错误 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "验证失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
