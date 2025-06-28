import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

// import { form } from "@/router/enums";

export default {
	path: "/form",
	redirect: "/form/index",
	meta: {
		icon: "ri/edit-box-line",
		title: $t("common.menus.pureSchemaForm"),
		rank: RouterOrderEnums.form,
	},
	children: [
		{
			path: "/form/index",
			name: "SchemaForm",
			component: () => import("@/views/schema-form/index.vue"),
			meta: {
				title: $t("common.menus.pureSchemaForm"),
			},
		},
	],
} satisfies RouteConfigsTable;
