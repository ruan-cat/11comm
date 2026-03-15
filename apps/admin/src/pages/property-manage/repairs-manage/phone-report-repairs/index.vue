<script lang="ts" setup>
definePage({
	meta: {
		// 电话报修
		title: "propertyManage_repairsManage.phone-report-repairs.pageTitle",
		icon: "mdi:phone-settings",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.phoneReportRepairs"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PhoneRepairsFormProps, defaultForm } from "./components/form";
import PhoneRepairsForm from "./components/form.vue";
import type { PhoneReportRepairsListItem, PhoneReportRepairsQueryParams, PhoneRepairsFormVO } from "@01s-11comm/type";
import { repairTypeOptions, repairStatusOptions } from "@01s-11comm/type";
import { usePhoneReportRepairsListQuery } from "@/api/property-manage/repairs-manage/phone-report-repairs";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

const phoneRepairsFormInstance = ref<InstanceType<typeof PhoneRepairsForm> | null>(null);

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.workOrderNumber")),
		),
		prop: "workOrderNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.location")),
		),
		prop: "location",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.repairType")),
		),
		prop: "repairType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.reporter")),
		),
		prop: "reporter",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.contactInfo")),
		),
		prop: "contactInfo",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.appointmentTime")),
		),
		prop: "appointmentTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.overtimeTime")),
		),
		prop: "overtimeTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.submitTime")),
		),
		prop: "submitTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.phone-report-repairs.fields.status")),
		),
		prop: "status",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & PhoneReportRepairsQueryParams = {
	workOrderNumber: "",
	reporter: "",
	contactPhone: "",
	repairType: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = usePhoneReportRepairsListQuery(plusSearchDefaultValues);

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.search.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.search.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.search.status")),
		prop: "status",
		valueType: "select",
		options: repairStatusOptions,
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: PhoneReportRepairsListItem;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const formValue: PhoneRepairsFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					repairType: row?.repairType || defaultForm.repairType,
					reporter: row?.reporter || "",
					contactInfo: row?.contactInfo || "",
					appointmentTime: row?.appointmentTime || "",
					repairDescription: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(formValue);

	const formProps: PhoneRepairsFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.phone-report-repairs.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(PhoneRepairsForm, {
				ref: phoneRepairsFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = phoneRepairsFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = phoneRepairsFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					phoneRepairsFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await phoneRepairsFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: PhoneReportRepairsListItem) {
	openDialog({ mode: "edit", row });
}

function handleView(row: PhoneReportRepairsListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: PhoneReportRepairsListItem) {
	consola.log("删除", row);
	await doFetch();
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
				<ElButton type="primary" @click="handleAdd">
					{{ transformI18n($t("propertyManage_repairsManage.phone-report-repairs.buttons.registration")) }}
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
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
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
