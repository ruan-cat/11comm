import { isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRouter, useRoute, type LocationQueryRaw, type RouteParamsRaw } from "vue-router";
import { createDetailTagTitle, isDetailRouteParameter, normalizeDetailRouteParameter } from "./detail-parameter";

export function useDetail() {
	const route = useRoute();
	const router = useRouter();
	const getParameter = isEmpty(route.params) ? route.query : route.params;

	function toDetail(parameter: LocationQueryRaw | RouteParamsRaw, model: "query" | "params") {
		if (!isDetailRouteParameter(parameter)) {
			console.warn("toDetail: 详情页参数缺少 id，已取消本次跳转");
			return;
		}

		/** 详情页跳转参数统一归一化为字符串 */
		const normalizedParameter = normalizeDetailRouteParameter(parameter);
		/** 标签标题 */
		const detailTagTitle = createDetailTagTitle(normalizedParameter);

		if (model === "query") {
			// 保存信息到标签页
			useMultiTagsStoreHook().handleTags("push", {
				path: `/tabs/query-detail`,
				name: "TabQueryDetail",
				query: normalizedParameter,
				meta: {
					title: detailTagTitle,
					// 如果使用的是非国际化精简版title可以像下面这么写
					// title: `No.${index} - 详情信息`,
					// 最大打开标签数
					dynamicLevel: 3,
				},
			});
			// 路由跳转
			// @ts-ignore - TabQueryDetail 路由名称暂不在自动生成的路由类型中
			router.push({ name: "TabQueryDetail", query: normalizedParameter });
		} else if (model === "params") {
			useMultiTagsStoreHook().handleTags("push", {
				path: `/tabs/params-detail/:id`,
				name: "TabParamsDetail",
				params: normalizedParameter,
				meta: {
					title: detailTagTitle,
					// 如果使用的是非国际化精简版title可以像下面这么写
					// title: `No.${index} - 详情信息`,
				},
			});
			// @ts-ignore - TabParamsDetail 路由名称暂不在自动生成的路由类型中
			router.push({ name: "TabParamsDetail", params: normalizedParameter });
		}
	}

	// 用于页面刷新，重新获取浏览器地址栏参数并保存到标签页
	const initToDetail = (model: "query" | "params") => {
		if (getParameter) toDetail(getParameter, model);
	};

	return { toDetail, initToDetail, getParameter, router };
}
