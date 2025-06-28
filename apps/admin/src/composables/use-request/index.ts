import { defineAxiosInstance } from "@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts";

/** 专用于 useAxios 的请求实例 */
const useAxiosHttp = new PureHttp(true);

// 设置请求实例
defineAxiosInstance(useAxiosHttp.getInstance());

export { useRequestIn01s as useRequest } from "@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts";
