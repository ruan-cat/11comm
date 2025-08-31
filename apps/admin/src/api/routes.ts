import { http } from "@/utils/http";

type Result = {
	success: boolean;
	data: Array<any>;
};

/**
 * 获得异步路由
 * @description
 * TODO: 此处只需要严格要求后端生成指定格式的菜单即可
 *
 * 只要后端返回的菜单 满足前端的路由对象格式 即可。
 */
export const getAsyncRoutes = () => {
	return http.request<Result>("get", "/get-async-routes");
};
