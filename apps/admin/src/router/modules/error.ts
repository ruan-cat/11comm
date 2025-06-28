import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { error } from "@/router/enums";

export default {
	path: "/error",
	redirect: "/error/403",
	meta: {
		icon: "ep/warning",
		showLink: false,
		title: $t("common.menus.pureError"),
		rank: RouterOrderEnums.error,
	},
	children: [
		{
			path: "/error/403",
			name: "403",
			component: () => import("@/views/error/403.vue"),
			meta: {
				title: $t("common.menus.pureFourZeroOne"),
			},
		},
		{
			path: "/error/404",
			name: "404",
			component: () => import("@/views/error/404.vue"),
			meta: {
				title: $t("common.menus.pureFourZeroFour"),
			},
		},
		{
			path: "/error/500",
			name: "500",
			component: () => import("@/views/error/500.vue"),
			meta: {
				title: $t("common.menus.pureFive"),
			},
		},
	],
} satisfies RouteConfigsTable;
