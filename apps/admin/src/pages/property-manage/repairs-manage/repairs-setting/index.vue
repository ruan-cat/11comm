<script lang="ts" setup>
definePage({
	meta: {
		// 报修设置
		title: "propertyManage_repairsManage.repairs-setting.pageTitle",
		icon: "mdi:settings",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsSetting"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type RepairsSettingFormProps, defaultForm } from "./components/form";
import RepairsSettingForm from "./components/form.vue";
import { useRepairsSettingListQuery } from "@/api/property-manage/repairs-manage/repairs-setting";
import {
	dispatchMethodOptions,
	repairsSettingTypeOptions,
	areaOptions,
	returnVisitSettingOptions,
} from "@01s-11comm/type";
import type {
	RepairsSettingListItem,
	RepairsSettingFormVO,
	RepairsSettingType,
	DispatchMethodType,
	AreaType,
	OwnerDisplayType,
	NotificationMethodType,
	ReturnVisitSettingType,
	RepairsSettingQueryParams,
} from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const repairsSettingFormInstance = ref<InstanceType<typeof RepairsSettingForm> | null>(null);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.typeName")),
		),
		prop: "typeName",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.settingType")),
		),
		prop: "settingType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.dispatchMethod")),
		),
		prop: "dispatchMethod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.publicArea")),
		),
		prop: "publicArea",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.ownerDisplay")),
		),
		prop: "ownerDisplay",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.notificationMethod")),
		),
		prop: "notificationMethod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.returnVisitSetting")),
		),
		prop: "returnVisitSetting",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-setting.fields.createTime")),
		),
		prop: "createTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_repairsManage.repairs-setting.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & RepairsSettingQueryParams = {
	typeName: "",
	dispatchMethod: "",
	settingType: "",
	publicArea: "",
	returnVisitSetting: "",
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
} = useRepairsSettingListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.search.typeName")),
		prop: "typeName",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.search.dispatchMethod")),
		prop: "dispatchMethod",
		valueType: "select",
		options: dispatchMethodOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.search.settingType")),
		prop: "settingType",
		valueType: "select",
		options: repairsSettingTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.search.publicArea")),
		prop: "publicArea",
		valueType: "select",
		options: areaOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.search.returnVisitSetting")),
		prop: "returnVisitSetting",
		valueType: "select",
		options: returnVisitSettingOptions,
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

interface OpenDialogParams {
	mode: Mode;
	row?: RepairsSettingListItem;
}

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: RepairsSettingListItem) {
	openDialog({ mode: "edit", row });
}

function handleView(row: RepairsSettingListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: RepairsSettingListItem) {
	consola.log("删除", row);
	await doFetch();
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const formValue: RepairsSettingFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					typeName: row?.typeName || "",
					settingType: (row?.settingType as RepairsSettingType | undefined) || defaultForm.settingType,
					dispatchMethod: (row?.dispatchMethod as DispatchMethodType | undefined) || defaultForm.dispatchMethod,
					publicArea: (row?.publicArea as AreaType | undefined) || defaultForm.publicArea,
					ownerDisplay: (row?.ownerDisplay as OwnerDisplayType | undefined) || defaultForm.ownerDisplay,
					notificationMethod:
						(row?.notificationMethod as NotificationMethodType | undefined) || defaultForm.notificationMethod,
					returnVisitSetting:
						(row?.returnVisitSetting as ReturnVisitSettingType | undefined) || defaultForm.returnVisitSetting,
					description: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(formValue);

	const formProps: RepairsSettingFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.repairs-setting.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.repairs-setting.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(RepairsSettingForm, {
				ref: repairsSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = repairsSettingFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = repairsSettingFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					repairsSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await repairsSettingFormInstance.value?.plusFormInstance?.handleSubmit();
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
				<ElButton type="primary" @click="handleAdd">
					{{ transformI18n($t("propertyManage_repairsManage.repairs-setting.buttons.add")) }}
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
