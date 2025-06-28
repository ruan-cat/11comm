import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

const oldHomeRoute = {
	path: "/",
	name: "Home",
	component: Layout,
	redirect: "/welcome",
	meta: {
		icon: "ep/home-filled",
		title: $t("common.menus.pureHome"),
		rank: RouterOrderEnums.home,
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

/**
 * 按照布局组件的要求来改造路由
 */
const newHomeRoute1 = {
	path: "/welcome",
	name: "Welcome",
	component: () => import("@/views/welcome/index.vue"),
	meta: {
		title: $t("common.menus.pureHome"),
		showLink: VITE_HIDE_HOME === "true" ? false : true,
	},
} satisfies RouteConfigsTable;

const newHomeRoute2 = {
	path: "/",
	name: "Home",
	// 业务变更 按照布局组件要求 路由不应该配置任何布局组件
	// component: Layout,
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

// export default oldHomeRoute;
// export default newHomeRoute1;
export default newHomeRoute2;
