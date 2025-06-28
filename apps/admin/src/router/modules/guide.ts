import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { guide } from "@/router/enums";

export default {
	path: "/guide",
	redirect: "/guide/index",
	meta: {
		icon: "ep/guide",
		title: $t("common.menus.pureGuide"),
		rank: RouterOrderEnums.guide,
	},
	children: [
		{
			path: "/guide/index",
			name: "Guide",
			component: () => import("@/views/guide/index.vue"),
			meta: {
				title: $t("common.menus.pureGuide"),
			},
		},
	],
} satisfies RouteConfigsTable;
