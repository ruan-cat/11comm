<script lang="ts" setup>
definePage({
	meta: {
		// 报表信息
		title: "operationTeam.reportConfiguration.reportInfo.pageTitle",
		icon: "mdi:file-chart",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportInfo"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { ReportInfoFormVO, ReportInfoListItem, ReportInfoQueryParams } from "@01s-11comm/type";
import { useReportInfoListQuery } from "@/api/operation-team/report-configuration/report-info";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { type ReportInfoFormProps, defaultForm } from "./components/form";
import ReportInfoForm from "./components/form.vue";

const reportInfoFormInstance = ref<InstanceType<typeof ReportInfoForm> | null>(null);
const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const plusSearchModelRef: FieldValues & Partial<ReportInfoQueryParams> = {
	reportCode: "",
	groupId: "",
	reportName: "",
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
} = useReportInfoListQuery(plusSearchDefaultValues);

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.reportCode"))),
		prop: "reportCode",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.groupName"))),
		prop: "groupName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.reportName"))),
		prop: "reportName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.description"))),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("operationTeam.reportConfiguration.reportInfo.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.reportCode")),
		prop: "reportCode",
		valueType: "input",
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.groupId")),
		prop: "groupId",
		valueType: "input",
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportInfo.fields.reportName")),
		prop: "reportName",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	searchText: renderI18n($t("common.buttons.search")),
	resetText: renderI18n($t("common.buttons.reset")),
});

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
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
	row?: ReportInfoListItem;
}

const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const formVO: ReportInfoFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					reportGroup: row?.groupId || "",
					optionTitle: row?.reportName || "",
					sort: row?.sortOrder?.toString() || "",
					description: row?.description || "",
				})
			: structuredClone(defaultForm);

	const formProps: ReportInfoFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? renderI18n($t("operationTeam.reportConfiguration.reportInfo.dialogs.addTitle"))
				: renderI18n($t("operationTeam.reportConfiguration.reportInfo.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(ReportInfoForm, {
				ref: reportInfoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = reportInfoFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportInfoFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => renderI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await reportInfoFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.info")) }}
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
