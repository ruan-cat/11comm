<script lang="ts" setup>
definePage({
	meta: {
		// 报表组件
		title: "operationTeam.reportConfiguration.reportComponent.pageTitle",
		icon: "mdi:chart-pie",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportComponent"),
	},
});

import { computed, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type ReportComponentListItem,
	type ReportComponentQueryParams,
	componentTypeOptions,
	queryMethodOptions,
	type ComponentType,
	type QueryMethod,
	type ReportComponentFormVO,
} from "@01s-11comm/type";
import { useReportComponentListQuery } from "@/api/operation-team/report-configuration/report-component";
import { type ReportComponentFormProps, defaultForm } from "./components/form";
import ReportComponentForm from "./components/form.vue";
import { addDialog, closeDialog } from "@/components/ReDialog";

const reportComponentFormInstance = ref<InstanceType<typeof ReportComponentForm> | null>(null);
const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const componentTypeLabelKeyMap: Record<string, string> = {
	表格: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.table"),
	table: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.table"),
	图表: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.chart"),
	chart: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.chart"),
	摘要: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.summary"),
	summary: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.summary"),
	文本: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.text"),
	text: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.text"),
	图片: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.image"),
	image: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.image"),
	按钮: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.button"),
	button: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.button"),
	输入框: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.input"),
	input: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.input"),
	下拉框: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.select"),
	select: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.select"),
	日期选择器: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.datePicker"),
	datePicker: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.datePicker"),
};

const queryMethodLabelKeyMap = {
	sql: $t("operationTeam.reportConfiguration.reportComponent.form.options.queryMethods.sql"),
	api: $t("operationTeam.reportConfiguration.reportComponent.form.options.queryMethods.api"),
	local: $t("operationTeam.reportConfiguration.reportComponent.form.options.queryMethods.local"),
} as const;

function translateComponentType(value?: string) {
	if (!value) {
		return value;
	}
	return transformI18n(componentTypeLabelKeyMap[value] ?? value);
}

function translateQueryMethod(value?: string) {
	if (!value) {
		return value;
	}
	return transformI18n(queryMethodLabelKeyMap[value as keyof typeof queryMethodLabelKeyMap] ?? value);
}

const translatedComponentTypeOptions = computed(() => {
	return componentTypeOptions.map((option) => ({
		...option,
		label: transformI18n(componentTypeLabelKeyMap[String(option.value)]),
	}));
});

const translatedQueryMethodOptions = computed(() => {
	return queryMethodOptions.map((option) => ({
		...option,
		label: transformI18n(queryMethodLabelKeyMap[String(option.value) as keyof typeof queryMethodLabelKeyMap]),
	}));
});

const plusSearchModelRef: FieldValues & Partial<ReportComponentQueryParams> = {
	componentId: "",
	componentName: "",
	componentType: undefined,
	queryMethod: undefined,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useReportComponentListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.componentId")),
		),
		prop: "id",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.componentName")),
		),
		prop: "componentName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.componentType")),
		),
		prop: "componentType",
		width: 120,
		cellRenderer: ({ row }) => translateComponentType(row.componentType),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.queryMethod")),
		),
		prop: "queryMethod",
		width: 120,
		cellRenderer: ({ row }) => translateQueryMethod(row.queryMethod),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.description")),
		),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 160,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("operationTeam.reportConfiguration.reportComponent.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.componentId")),
		prop: "componentId",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.componentName")),
		prop: "componentName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.componentType")),
		prop: "componentType",
		valueType: "select",
		options: translatedComponentTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n(
				$t("operationTeam.reportConfiguration.reportComponent.form.placeholders.componentType"),
			),
		},
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportComponent.fields.queryMethod")),
		prop: "queryMethod",
		valueType: "select",
		options: translatedQueryMethodOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.queryMethod")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

interface OpenDialogParams {
	mode: Mode;
	row?: ReportComponentListItem;
}

const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("simulate async submit", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("simulate async submit", isFetchingT.value);
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const reportComponentFormVO: ReportComponentFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					componentName: row?.componentName || "",
					componentType: (row?.componentType || defaultForm.componentType) as ComponentType,
					queryMethod: (row?.queryMethod || defaultForm.queryMethod) as QueryMethod,
					sql: row?.sql || "",
					java: row?.java || "",
					description: row?.description || "",
				})
			: structuredClone(defaultForm);

	const props: ReportComponentFormProps = {
		form: reportComponentFormVO,
		defaultValues: reportComponentFormVO,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("operationTeam.reportConfiguration.reportComponent.dialogs.addTitle"))
				: transformI18n($t("operationTeam.reportConfiguration.reportComponent.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(ReportComponentForm, {
				ref: reportComponentFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = reportComponentFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportComponentFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportComponentFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await reportComponentFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
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
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
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
