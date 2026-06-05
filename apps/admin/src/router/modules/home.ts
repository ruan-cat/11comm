import { $t } from "../../plugins/i18n.ts";
import { RouterOrderEnums } from "@/router/enums";

const { VITE_HIDE_HOME } = import.meta.env;

/**
 * 按照布局组件的要求来改造路由
 * @description
 * 旧方案曾在首页路由上直接挂载 `Layout` 组件；当前统一由 meta layout 处理布局，
 * 因此首页路由只声明业务入口和 `layout: "index"`，避免重复包裹布局组件。
 */
const newHomeRoute2 = {
	path: "/",
	name: "Home",
	redirect: "/welcome",
	meta: {
		icon: "ep/home-filled",
		title: $t("common.menus.pureHome"),
		rank: RouterOrderEnums.home,
		layout: "index",
	},
	children: [
		{
			path: "/welcome",
			name: "Welcome",
			component: () => import("@/views/welcome/index.vue"),
			meta: {
				title: $t("common.menus.pureHome"),
				showLink: VITE_HIDE_HOME === "true" ? false : true,
			},
		},
	],
} satisfies RouteConfigsTable;

export default newHomeRoute2;
