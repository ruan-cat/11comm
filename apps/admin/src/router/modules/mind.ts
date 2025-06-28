import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { mind } from "@/router/enums";

const IFrame = () => import("@/layout/frame.vue");

export default {
	path: "/mind-map",
	redirect: "/mind-map/index",
	meta: {
		icon: "ri/mind-map",
		title: $t("common.menus.pureMindMap"),
		rank: RouterOrderEnums.mind,
	},
	children: [
		{
			path: "/mind-map/index",
			name: "FrameMindMap",
			component: IFrame,
			meta: {
				title: $t("common.menus.pureMindMap"),
				keepAlive: true,
				frameSrc: "https://wanglin2.github.io/mind-map/#/",
			},
		},
	],
} satisfies RouteConfigsTable;
