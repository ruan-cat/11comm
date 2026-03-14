<script lang="ts" setup>
definePage({
	meta: {
		// 菜单项
		title: "devTeam.menuManage.item.pageTitle",
		icon: "mdi:format-list-text",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.item"),
	},
});

import { cloneDeep, ref } from "vue";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { booleanOptions, menuItemStatusOptions, menuTypeOptions, type MenuItemQueryParams } from "@01s-11comm/type";
import { useMenuItemListQuery } from "@/api/dev-team/menu-manage/item";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<MenuItemQueryParams> = {
	menuId: "",
	menuName: "",
	parentMenu: "",
	menuType: undefined,
	status: undefined,
	isExternal: undefined,
	isCached: undefined,
	isHidden: undefined,
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useMenuItemListQuery(plusSearchDefaultValues);

const menuTypeLabelKeyMap = {
	catalog: $t("devTeam.menuManage.item.form.options.catalog"),
	menu: $t("devTeam.menuManage.item.form.options.menu"),
	button: $t("devTeam.menuManage.item.form.options.button"),
	目录: $t("devTeam.menuManage.item.form.options.catalog"),
	菜单: $t("devTeam.menuManage.item.form.options.menu"),
	按钮: $t("devTeam.menuManage.item.form.options.button"),
} as const;

const statusLabelKeyMap = {
	enabled: $t("devTeam.menuManage.item.form.options.enabled"),
	disabled: $t("devTeam.menuManage.item.form.options.disabled"),
	启用: $t("devTeam.menuManage.item.form.options.enabled"),
	禁用: $t("devTeam.menuManage.item.form.options.disabled"),
} as const;

const booleanLabelKeyMap = {
	true: $t("devTeam.menuManage.item.form.options.yes"),
	false: $t("devTeam.menuManage.item.form.options.no"),
	是: $t("devTeam.menuManage.item.form.options.yes"),
	否: $t("devTeam.menuManage.item.form.options.no"),
} as const;

function translateMenuType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = menuTypeLabelKeyMap[value as keyof typeof menuTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateBoolean(value?: string | number | boolean | null) {
	if (value === null || value === undefined) {
		return "";
	}

	const key = booleanLabelKeyMap[String(value) as keyof typeof booleanLabelKeyMap];
	return key ? transformI18n(key) : String(value);
}

const translatedMenuTypeOptions = withLocale(() =>
	menuTypeOptions.map((option) => ({
		...option,
		label: translateMenuType(String(option.value)),
	})),
);

const translatedStatusOptions = withLocale(() =>
	menuItemStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const translatedBooleanOptions = withLocale(() =>
	booleanOptions.map((option) => ({
		...option,
		label: translateBoolean(option.value),
	})),
);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.menuId"))),
		prop: "menuId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.menuName"))),
		prop: "menuName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.parentMenu"))),
		prop: "parentMenu",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.menuType"))),
		prop: "menuType",
		width: 100,
		cellRenderer: ({ row }) => translateMenuType(row.menuType),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.routePath"))),
		prop: "routePath",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.componentPath"))),
		prop: "componentPath",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.permissionKey"))),
		prop: "permissionKey",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.sortNo"))),
		prop: "sortNo",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.status"))),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatus(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.isExternal"))),
		prop: "isExternal",
		width: 100,
		cellRenderer: ({ row }) => translateBoolean(row.isExternal),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.isCached"))),
		prop: "isCached",
		width: 100,
		cellRenderer: ({ row }) => translateBoolean(row.isCached),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.isHidden"))),
		prop: "isHidden",
		width: 100,
		cellRenderer: ({ row }) => translateBoolean(row.isHidden),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.item.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.menuManage.item.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.menuId")),
		prop: "menuId",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.menuName")),
		prop: "menuName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.parentMenu")),
		prop: "parentMenu",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.menuType")),
		prop: "menuType",
		valueType: "select",
		options: translatedMenuTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.menuManage.item.form.placeholders.menuType")),
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.menuManage.item.form.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.isExternal")),
		prop: "isExternal",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.menuManage.item.form.placeholders.isExternal")),
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.isCached")),
		prop: "isCached",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.menuManage.item.form.placeholders.isCached")),
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.isHidden")),
		prop: "isHidden",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.menuManage.item.form.placeholders.isHidden")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation>
						<ElButton type="warning">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
