import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			title: $t("common.menus.pureLogin"),
			showLink: false,
			rank: 101,
			layout: "simple",
		},
	},
	{
		path: "/redirect",
		// 业务变更 按照布局组件要求 路由不应该配置任何布局组件
		// component: Layout,
		meta: {
			title: $t("common.status.pureLoad"),
			showLink: false,
			rank: 102,
		},
		children: [
			{
				path: "/redirect/:path(.*)",
				name: "Redirect",
				component: () => import("@/layout/redirect.vue"),
			},
		],
	},
	// 下面是一个无layout菜单的例子（一个全屏空白页面），因为这种情况极少发生，所以只需要在前端配置即可（配置路径：src/router/modules/remaining.ts）
	{
		path: "/empty",
		name: "Empty",
		component: () => import("@/views/empty/index.vue"),
		meta: {
			title: $t("common.menus.pureEmpty"),
			showLink: false,
			rank: 103,
		},
	},
	{
		path: "/account-settings",
		name: "AccountSettings",
		component: () => import("@/views/account-settings/index.vue"),
		meta: {
			title: $t("common.buttons.pureAccountSettings"),
			showLink: false,
			rank: 104,
			layout: "simple",
		},
	},
] satisfies Array<RouteConfigsTable>;
