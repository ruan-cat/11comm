import type { LocationQueryRaw, RouteParamsRaw } from "vue-router";

/** 详情页参数值 */
type DetailRouteParameterValue = string | number | Array<string | number>;

/** 详情页参数 */
export interface DetailRouteParameter extends Record<string, DetailRouteParameterValue> {
	id: string | number;
}

/** 详情页标签标题 */
export interface DetailTagTitle {
	zh: string;
	en: string;
}

/**
 * 判断是否为可用于详情页跳转的参数
 * @description 详情页参数至少要包含一个 string 或 number 类型的 id 字段
 */
export function isDetailRouteParameter(
	parameter: LocationQueryRaw | RouteParamsRaw,
): parameter is DetailRouteParameter {
	return "id" in parameter && (typeof parameter.id === "string" || typeof parameter.id === "number");
}

/**
 * 将详情页参数归一化为字符串参数
 * @description 与 vue-router 当前路由解析结果保持一致，统一转成字符串
 */
export function normalizeDetailRouteParameter(parameter: DetailRouteParameter) {
	const normalizedEntries = Object.entries(parameter).map(([key, value]) => [key, value.toString()] as const);

	return Object.fromEntries(normalizedEntries) as Record<string, string> & { id: string };
}

/**
 * 根据详情页参数生成标签标题
 * @description 标签标题中的编号统一读取归一化后的 id
 */
export function createDetailTagTitle(parameter: Pick<DetailRouteParameter, "id">): DetailTagTitle {
	return {
		zh: `No.${parameter.id} - 详情信息`,
		en: `No.${parameter.id} - DetailInfo`,
	};
}
