import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { codemirror } from "@/router/enums";

export default {
	path: "/codemirror",
	redirect: "/codemirror/index",
	meta: {
		icon: "ri/code-s-slash-line",
		title: "CodeMirror",
		rank: RouterOrderEnums.codemirror,
	},
	children: [
		{
			path: "/codemirror/index",
			name: "CodeMirror",
			component: () => import("@/views/codemirror/index.vue"),
			meta: {
				title: "CodeMirror",
			},
		},
	],
} satisfies RouteConfigsTable;
