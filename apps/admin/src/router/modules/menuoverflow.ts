import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { menuoverflow } from "@/router/enums";

export default {
	path: "/menuoverflow",
	redirect: "/menuoverflow/index",
	meta: {
		title: $t("common.menus.pureMenuOverflow"),
		rank: RouterOrderEnums.menuoverflow,
	},
	children: [
		{
			path: "/menuoverflow/index",
			name: "MenuOverflow",
			component: () => import("@/views/menuoverflow/index.vue"),
			meta: {
				title: $t("common.menus.pureChildMenuOverflow"),
				showParent: true,
			},
		},
	],
} satisfies RouteConfigsTable;
