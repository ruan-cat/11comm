import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { result } from "@/router/enums";

export default {
	path: "/result",
	redirect: "/result/success",
	meta: {
		icon: "ri/checkbox-circle-line",
		title: $t("common.menus.pureResult"),
		rank: RouterOrderEnums.result,
	},
	children: [
		{
			path: "/result/success",
			name: "Success",
			component: () => import("@/views/result/success.vue"),
			meta: {
				title: $t("common.menus.pureSuccess"),
			},
		},
		{
			path: "/result/fail",
			name: "Fail",
			component: () => import("@/views/result/fail.vue"),
			meta: {
				title: $t("common.menus.pureFail"),
			},
		},
	],
} satisfies RouteConfigsTable;
