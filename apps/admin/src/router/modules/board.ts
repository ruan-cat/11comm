import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { board } from "@/router/enums";

const IFrame = () => import("@/layout/frame.vue");

export default {
	path: "/board",
	redirect: "/board/index",
	meta: {
		icon: "ri/artboard-line",
		title: $t("common.menus.pureBoard"),
		rank: RouterOrderEnums.board,
	},
	children: [
		{
			path: "/board/index",
			name: "FrameBoard",
			component: IFrame,
			meta: {
				title: $t("common.menus.pureBoard"),
				extraIcon: "IF-pure-iconfont-new svg",
			},
		},
	],
} satisfies RouteConfigsTable;
