import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { table } from "@/router/enums";

export default {
	path: "/table",
	redirect: "/table/index",
	meta: {
		icon: "ri/table-line",
		title: $t("common.menus.pureTable"),
		rank: RouterOrderEnums.table,
	},
	children: [
		{
			path: "/table/index",
			name: "PureTable",
			component: () => import("@/views/table/index.vue"),
			meta: {
				title: $t("common.menus.pureTableBase"),
			},
		},
		{
			path: "/table/high",
			name: "PureTableHigh",
			component: () => import("@/views/table/high.vue"),
			meta: {
				title: $t("common.menus.pureTableHigh"),
			},
		},
		{
			path: "/table/edit",
			name: "PureTableEdit",
			component: () => import("@/views/table/edit.vue"),
			meta: {
				title: $t("common.menus.pureTableEdit"),
			},
		},
		{
			path: "/table/virtual",
			name: "VxeTable",
			component: () => import("@/views/table/virtual.vue"),
			meta: {
				title: $t("common.menus.pureVxeTable"),
			},
		},
	],
} satisfies RouteConfigsTable;
