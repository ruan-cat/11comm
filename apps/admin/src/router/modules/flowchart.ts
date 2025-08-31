import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { flowchart } from "@/router/enums";

export default {
	path: "/flow-chart",
	redirect: "/flow-chart/index",
	meta: {
		icon: "ep/set-up",
		title: $t("common.menus.pureFlowChart"),
		rank: RouterOrderEnums.flowchart,
	},
	children: [
		{
			path: "/flow-chart/index",
			name: "FlowChart",
			component: () => import("@/views/flow-chart/index.vue"),
			meta: {
				title: $t("common.menus.pureFlowChart"),
			},
		},
	],
} satisfies RouteConfigsTable;
