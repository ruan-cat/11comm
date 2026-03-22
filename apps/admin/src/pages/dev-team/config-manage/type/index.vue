<script lang="ts" setup>
definePage({
	meta: {
		// 字典类型
		title: "devTeam.configManage.type.pageTitle",
		icon: "lucide:book-open",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.type"),
	},
});

import { ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { type DictionaryTypeQueryParams, dictionaryTypeStatusOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useDictionaryTypeListQuery } from "@/api/dev-team/config-manage/type";
import { useI18nConfig } from "@/composables/use-i18n-config";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const statusLabelKeyMap = {
	enabled: $t("devTeam.configManage.type.options.status.enabled"),
	disabled: $t("devTeam.configManage.type.options.status.disabled"),
} as const;

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedDictionaryTypeStatusOptions = computed(() =>
	dictionaryTypeStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const plusSearchModelRef: FieldValues & Partial<DictionaryTypeQueryParams> = {
	dictionaryNumber: "",
	dictionaryName: "",
	dictionaryType: "",
	status: "",
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
} = useDictionaryTypeListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.dictionaryNumber"))),
		prop: "dictionaryNumber",
		width: 120,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.dictionaryName"))),
		prop: "dictionaryName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.dictionaryType"))),
		prop: "dictionaryType",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.status"))),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatus(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.remark"))),
		prop: "remark",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.updateTime"))),
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
	title: transformI18n($t("devTeam.configManage.type.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryNumber")),
		prop: "dictionaryNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryName")),
		prop: "dictionaryName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryType")),
		prop: "dictionaryType",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedDictionaryTypeStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.status")),
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
