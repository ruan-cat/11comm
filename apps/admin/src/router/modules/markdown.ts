import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { markdown } from "@/router/enums";

export default {
	path: "/markdown",
	redirect: "/markdown/index",
	meta: {
		icon: "ri/markdown-line",
		title: $t("common.menus.pureMarkdown"),
		rank: RouterOrderEnums.markdown,
	},
	children: [
		{
			path: "/markdown/index",
			name: "Markdown",
			component: () => import("@/views/markdown/index.vue"),
			meta: {
				title: $t("common.menus.pureMarkdown"),
				extraIcon: "IF-pure-iconfont-new svg",
			},
		},
	],
} satisfies RouteConfigsTable;
