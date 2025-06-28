import { useRouter, useRoute, RouteLocationRaw, NavigationFailure, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { useRouteInfoStoreHook } from "@/store/modules/route-info";
import { getRouteByName } from "@/router/utils";
import type { RouteRecordName } from "vue-router";

/**
 * 跳转详情页路由工具
 * @description 处理详情页跳转逻辑，自动保存前驱页面信息
 */
export function useGotoDetailPage() {
  const router = useRouter();
  const route = useRoute();
  const routeInfoStore = useRouteInfoStoreHook();

  /**
   * 跳转到详情页
   * @param to 路由位置，与 router.push 参数相同
   * @returns Promise<void | NavigationFailure>
   */
  async function gotoDetailPage(to: RouteLocationRaw): Promise<void | NavigationFailure | undefined> {
    try {
      // 1. 获取目标路由名称
      let routeName: RouteRecordName | undefined;
      
      if (typeof to === "string") {
        // 如果是字符串路径，尝试通过路径找到路由名称
        const matchedRoute = router.resolve(to);
        routeName = matchedRoute.name;
      } else if ("name" in to) {
        // 如果是对象且包含name属性
        routeName = to.name as RouteRecordName;
      } else if ("path" in to) {
        // 如果是对象且包含path属性
        const matchedRoute = router.resolve(to.path);
        routeName = matchedRoute.name;
      }

      if (!routeName) {
        console.warn("gotoDetailPage: 无法确定目标路由名称");
        return router.push(to);
      }

      // 2. 获取目标路由信息
      const targetRoute = getRouteByName(routeName);
      if (!targetRoute) {
        console.warn(`gotoDetailPage: 未找到名为 ${String(routeName)} 的路由`);
        return router.push(to);
      }

      // 3. 获取当前路由路径（前驱页面路径）
      const currentPath = route.path;

      // 4. 设置路由信息
      routeInfoStore.setRouteInfo({
        key: routeName,
        info: {
          meta: {
            // 设置 activePath 为前驱页面的路径
            activePath: currentPath
          }
        }
      });

      // 5. 跳转到目标路由
      return router.push(to);
    } catch (error) {
      console.error("跳转详情页出错:", error);
      return Promise.reject(error);
    }
  }

  /**
   * 详情页路由守卫处理函数
   * @param to 目标路由
   * @param from 来源路由
   * @param next 路由守卫 next 函数
   */
  function handleDetailPageBeforeEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) {
    try {
      // 1. 获取当前路由名称
      const routeName = to.name;
      if (!routeName) {
        console.warn("handleDetailPageBeforeEnter: 路由名称不存在");
        return;
      }

      // 2. 获取存储的路由信息
      const routeInfo = routeInfoStore.getRouteInfo(routeName);
      if (!routeInfo || !routeInfo.meta) {
        console.warn(`handleDetailPageBeforeEnter: 未找到路由 ${String(routeName)} 的信息`);
        return;
      }

      // 3. 设置目标路由的 meta.activePath
      if (routeInfo.meta.activePath && to.meta) {
        to.meta.activePath = routeInfo.meta.activePath;
      }
    } catch (error) {
      console.error("处理详情页路由守卫出错:", error);
    }
  }

  return {
    gotoDetailPage,
    handleDetailPageBeforeEnter
  };
}

/**
 * 跳转到详情页
 * @description 独立函数，可直接在组件外部使用
 * @param to 路由位置，与 router.push 参数相同
 * @returns Promise<void | NavigationFailure>
 */
export async function gotoDetailPage(to: RouteLocationRaw): Promise<void | NavigationFailure | undefined> {
  const { gotoDetailPage: gotoDetailPageFn } = useGotoDetailPage();
  return gotoDetailPageFn(to);
}

/**
 * 详情页路由守卫处理函数
 * @description 独立函数，可直接在路由配置中使用
 * @param to 目标路由
 * @param from 来源路由
 * @param next 路由守卫 next 函数
 */
export function handleDetailPageBeforeEnter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { handleDetailPageBeforeEnter: handleFn } = useGotoDetailPage();
  handleFn(to, from, next);
}