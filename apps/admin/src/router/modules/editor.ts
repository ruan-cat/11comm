import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { editor } from "@/router/enums";

export default {
	path: "/editor",
	redirect: "/editor/index",
	meta: {
		icon: "ep/edit",
		title: $t("common.menus.pureEditor"),
		rank: RouterOrderEnums.editor,
	},
	children: [
		{
			path: "/editor/index",
			name: "Editor",
			component: () => import("@/views/editor/index.vue"),
			meta: {
				title: $t("common.menus.pureEditor"),
				keepAlive: true,
			},
		},
	],
} satisfies RouteConfigsTable;
