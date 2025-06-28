import Request, { type RequestCallback } from "../request";
import { userStore } from "@/stores/user";

// 定义一个功能模块基础url，方便替换
const currBaseUrl = "/login/";

/**
 * 登录接口
 * @param data 登录数据
 * @param success 登录成功回调
 * @param fail 登录失败回调
 */
export const login = async (data: any, success: RequestCallback, fail: RequestCallback) => {
	const $store = userStore();
	try {
		// 发送登录请求
		const res = await Request.requestForm(Request.POST, currBaseUrl + "auth-login", data);
		// 处理登录结果
		if (res.data) {
			// 记录Token到本地
			if (res.data) {
				$store.setToken(res.data);
				// 执行成功回调
				success(res);
				return;
			}
			// 执行失败回调
			fail(res);
		}
	} catch (err) {
		// 打印错误信息
		console.warn(err);
		// 执行失败回调
		fail(err);
	}
};
