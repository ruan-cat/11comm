import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { list } from "@/router/enums";

export default {
	path: "/list",
	redirect: "/list/card",
	meta: {
		icon: "ri/list-unordered",
		title: $t("common.menus.pureList"),
		rank: RouterOrderEnums.list,
	},
	children: [
		{
			path: "/list/card",
			name: "CardList",
			component: () => import("@/views/list/card/index.vue"),
			meta: {
				icon: "ri/bank-card-line",
				title: $t("common.menus.pureCardList"),
				showParent: true,
			},
		},
	],
} satisfies RouteConfigsTable;
