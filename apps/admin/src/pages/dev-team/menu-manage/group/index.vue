<script lang="ts" setup>
definePage({
	meta: {
		// 菜单组
		title: "devTeam.menuManage.group.pageTitle",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});

import { ref } from "vue";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { MenuGroupQueryParams } from "@01s-11comm/type";
import { menuGroupStatusOptions } from "@01s-11comm/type";
import { useMenuGroupListQuery } from "@/api/dev-team/menu-manage/group";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<MenuGroupQueryParams> = {
	groupId: "",
	groupName: "",
	groupCode: "",
	status: undefined,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useMenuGroupListQuery(plusSearchDefaultValues);

const statusLabelKeyMap = {
	enabled: $t("devTeam.menuManage.group.form.options.status.enabled"),
	disabled: $t("devTeam.menuManage.group.form.options.status.disabled"),
	启用: $t("devTeam.menuManage.group.form.options.status.enabled"),
	禁用: $t("devTeam.menuManage.group.form.options.status.disabled"),
} as const;

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedStatusOptions = computed(() =>
	menuGroupStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.groupId"))),
		prop: "groupId",
		width: 120,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.groupName"))),
		prop: "groupName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.groupCode"))),
		prop: "groupCode",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.sortNo"))),
		prop: "sortNo",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.status"))),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatus(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.description"))),
		prop: "description",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.menuManage.group.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.menuManage.group.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupId")),
		prop: "groupId",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupName")),
		prop: "groupName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.groupCode")),
		prop: "groupCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.menuManage.group.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.menuManage.group.form.placeholders.status")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
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
