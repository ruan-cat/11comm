<script lang="ts" setup>
definePage({
	meta: {
		// 巡检明细
		title: "property-manage_patrol-manage.detail.pageTitle",
		icon: "mdi:clipboard-text",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.detail"),
	},
});

import { h, ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type PatrolDetailFormProps, defaultForm } from "./components/form";
import { type PatrolDetailFormVO, type PatrolMethodType } from "@01s-11comm/type";
import {
	type PatrolDetailListItem,
	type PatrolDetailQueryParams,
	patrolMethodOptions,
	taskStatusOptions,
	patrolPointStatusOptions,
} from "@01s-11comm/type";
import PatrolDetailForm from "./components/form.vue";
import { useDetailListQuery } from "@/api/property-manage/patrol-manage/detail";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const patrolDetailFormInstance = ref<InstanceType<typeof PatrolDetailForm> | null>(null);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.detail.fields.taskDetailId"))),
		prop: "taskDetailId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPointName")),
		),
		prop: "patrolPointName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPlanName")),
		),
		prop: "patrolPlanName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolRouteName")),
		),
		prop: "patrolRouteName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPersonStartEndTime")),
		),
		prop: "patrolPersonStartEndTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPointStartEndTime")),
		),
		prop: "patrolPointStartEndTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.actualPatrolTime")),
		),
		prop: "actualPatrolTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.actualCheckInStatus")),
		),
		prop: "actualCheckInStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.plannedPatrolPerson")),
		),
		prop: "plannedPatrolPerson",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.actualPatrolPerson")),
		),
		prop: "actualPatrolPerson",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.detail.fields.patrolMethod"))),
		prop: "patrolMethod",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.detail.fields.taskStatus"))),
		prop: "taskStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPointStatus")),
		),
		prop: "patrolPointStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_patrol-manage.detail.fields.patrolSituation")),
		),
		prop: "patrolSituation",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPhotos"))),
		prop: "patrolPhotos",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.detail.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.detail.fields.locationInfo"))),
		prop: "locationInfo",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_patrol-manage.detail.tableTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & Partial<PatrolDetailQueryParams> = {
	patrolPerson: "",
	patrolStartTime: "",
	patrolEndTime: "",
	patrolMethod: "",
	taskStatus: "",
	patrolPointStatus: "",
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
} = useDetailListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.fields.plannedPatrolPerson")),
		prop: "patrolPerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.fields.patrolStartTime")),
		prop: "patrolStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.fields.patrolEndTime")),
		prop: "patrolEndTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.fields.patrolMethod")),
		prop: "patrolMethod",
		valueType: "select",
		options: patrolMethodOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.fields.taskStatus")),
		prop: "taskStatus",
		valueType: "select",
		options: taskStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.fields.patrolPointStatus")),
		prop: "patrolPointStatus",
		valueType: "select",
		options: patrolPointStatusOptions,
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: PatrolDetailListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const patrolDetailFormVO: PatrolDetailFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					patrolPointName: row?.patrolPointName || "",
					patrolPlanName: row?.patrolPlanName || "",
					patrolRouteName: row?.patrolRouteName || "",
					plannedPatrolPerson: row?.plannedPatrolPerson || "",
					patrolMethod: (row?.patrolMethod as PatrolMethodType) || "",
					location: row?.locationInfo || "",
					patrolSituation: row?.patrolSituation || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: PatrolDetailFormProps = {
		form: patrolDetailFormVO,
		defaultValues: patrolDetailFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_patrol-manage.detail.dialogs.addTitle"))
				: transformI18n($t("property-manage_patrol-manage.detail.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(PatrolDetailForm, {
				ref: patrolDetailFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolDetailFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolDetailFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolDetailFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolDetailFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
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
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
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
