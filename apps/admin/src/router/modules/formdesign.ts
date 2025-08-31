import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { formdesign } from "@/router/enums";

const IFrame = () => import("@/layout/frame.vue");

export default {
	path: "/form-design",
	redirect: "/form-design/index",
	meta: {
		icon: "ri/terminal-window-line",
		title: $t("common.menus.pureFormDesign"),
		rank: RouterOrderEnums.formdesign,
	},
	children: [
		{
			path: "/form-design/index",
			name: "FormDesign",
			component: IFrame,
			meta: {
				title: $t("common.menus.pureFormDesign"),
				keepAlive: true,
				frameSrc: "https://haixin-fang.github.io/vue-form-design/playground/index.html",
				frameLoading: false,
			},
		},
	],
} satisfies RouteConfigsTable;
