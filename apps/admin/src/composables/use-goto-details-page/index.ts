import { useRouter, useRoute } from "vue-router";
import type {
	RouteLocationRaw,
	NavigationGuardNext,
	RouteLocationNormalized,
	RouteRecordName,
	NavigationGuardWithThis,
} from "vue-router";
import { getRouteByName } from "@/router/utils";
import { useDetailsPageRouterInfoStoreHook } from "@/store/modules/details-page-router-info";

/** 跳转详情页参数类型 - 兼容 router.push 的参数类型 */
export type GotoDetailPageParams = RouteLocationRaw;

/**
 * 路由守卫参数类型
 * @deprecated 暂时不需要使用
 */
export interface BeforeEnterParams {
	to: RouteLocationNormalized;
	from: RouteLocationNormalized;
	next: NavigationGuardNext;
}

/**
 * 跳转详情页路由工具
 * @description 高度耦合的路由跳转工具，与详情页路由信息存储工具配合使用
 */
export function useGotoDetailsPage() {
	const router = useRouter();
	const route = useRoute();
	const detailsPageRouterInfoStore = useDetailsPageRouterInfoStoreHook();

	/**
	 * 前驱页设置路由数据并跳转到详情页
	 * @param params 路由跳转参数，兼容 router.push 的参数类型
	 * @description
	 * 1. 根据传参的具名路由，获取目标路由信息
	 * 2. 获取当前页面（前驱页）的路由地址
	 * 3. 存储路由信息，设置 activePath 为前驱页地址
	 * 4. 执行路由跳转
	 */
	function gotoDetailPage(params: GotoDetailPageParams) {
		try {
			// 1. 处理路由参数，获取路由名称
			let routeName: RouteRecordName | undefined;
			let routeParams: any = undefined;
			let routeQuery: any = undefined;

			if (typeof params === "string") {
				// 如果是字符串路径，无法获取名称，直接跳转
				console.warn("gotoDetailPage: 建议使用命名路由以获得更好的路由信息存储支持");
				return router.push(params);
			} else if (typeof params === "object" && params !== null) {
				// 使用类型断言来处理复杂的类型化路由类型
				const routeObj = params as any;
				if (routeObj.name) {
					routeName = String(routeObj.name) as RouteRecordName;
					routeParams = routeObj.params;
					routeQuery = routeObj.query;
				} else {
					// 其他情况直接跳转
					console.warn("gotoDetailPage: 无法识别路由名称，直接执行跳转");
					return router.push(params);
				}
			} else {
				// 其他情况直接跳转
				console.warn("gotoDetailPage: 无法识别路由参数，直接执行跳转");
				return router.push(params);
			}

			// 2. 根据路由名称获取目标路由信息
			const targetRoute = getRouteByName(routeName);
			if (!targetRoute) {
				console.warn(`gotoDetailPage: 未找到名为 "${routeName}" 的路由`);
				return router.push(params);
			}

			// 3. 获取当前页面（前驱页）的路由地址
			const currentPath = router.currentRoute.value.path;

			// 3. 设置当前路由的 activePath 信息（按照文档要求）
			if (targetRoute.meta) {
				targetRoute.meta.activePath = currentPath;
			}

			// 4. 存储路由信息
			detailsPageRouterInfoStore.setRouteInfo({
				key: routeName as RouteRecordName, // 后继页的路由名称
				info: {
					meta: {
						activePath: currentPath, // 前驱页的路由地址
						targetRouteName: routeName,
						timestamp: Date.now(),
					},
					// 其他的路由信息 可以酌情设置
					params: routeParams,
					query: routeQuery,
				},
			});

			// 5. 执行路由跳转
			return router.push(params);
		} catch (error) {
			console.error("gotoDetailPage: 跳转过程中发生错误", error);
			// 发生错误时仍然尝试跳转
			return router.push(params);
		}
	}

	/**
	 * 后继页路由守卫处理函数
	 * @param to 目标路由
	 * @param from 来源路由
	 * @param next 路由守卫继续函数
	 * @description
	 * 1. 获取当前路由地址
	 * 2. 从存储中获取路由信息
	 * 3. 设置 to.meta.activePath 为前驱页地址
	 */
	function handleDetailPageBeforeEnter(
		to: RouteLocationNormalized,
		from: RouteLocationNormalized,
		next: NavigationGuardNext,
	) {
		try {
			// 1. 准备当前路由信息（按照文档要求）
			const route = useRoute();

			// 2. 从当前路由信息内，获取路由名称（按照文档要求）
			const routeName = to.name;

			if (!routeName) {
				console.warn("handleDetailPageBeforeEnter: 路由名称不存在");
				next();
				return;
			}

			// 3. 根据当前路由名称，从 getRouteInfo 函数内获取到需要使用的路由信息
			const routeInfo = detailsPageRouterInfoStore.getRouteInfo(routeName as RouteRecordName);

			consola.log("handleDetailPageBeforeEnter: 获取到的路由信息", routeInfo);

			// 4. 根据传入的 to 参数，设置 to 参数的 meta.activePath 值
			if (routeInfo?.meta?.activePath) {
				to.meta.activePath = routeInfo.meta.activePath;
			} else {
				console.warn(`handleDetailPageBeforeEnter: 未找到路由名称 "${routeName}" 的路由信息`);
			}
			// 无论成功与否 都要无条件合并其他元信息
			merge(to.meta, routeInfo.meta);

			// 5. 继续路由守卫流程
			next();
		} catch (error) {
			console.error("handleDetailPageBeforeEnter: 处理路由守卫时发生错误", error);
			// 发生错误时仍然继续路由流程
			next();
		}
	}

	return {
		gotoDetailPage,
		handleDetailPageBeforeEnter,
	};
}

type _BeforeEnter = NavigationGuardWithThis<any>;
type _BeforeEnterParmas = Parameters<_BeforeEnter>;
/** 本质上就是 RouteLocationNormalized */
type _To = _BeforeEnterParmas[0];
/** 本质上就是 RouteLocationNormalizedLoaded */
type _From = _BeforeEnterParmas[1];
/** 本质上就是 NavigationGuardNext */
type _Next = _BeforeEnterParmas[2];

/**
 * 独立的路由守卫处理函数
 * @description 可以直接在路由配置中使用的函数
 */
export function handleDetailPageBeforeEnter(to: _To, from: _From, next: _Next) {
	const { handleDetailPageBeforeEnter: handler } = useGotoDetailsPage();
	return handler(to, from, next);
}

/**
 * 独立的路由跳转函数
 * @description 可以直接调用的函数，不需要在组件中使用
 */
export function gotoDetailPage(params: GotoDetailPageParams) {
	const { gotoDetailPage: handler } = useGotoDetailsPage();
	return handler(params);
}
