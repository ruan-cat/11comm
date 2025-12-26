<script lang="ts" setup>
definePage({
	meta: {
		title: "工单池",
		icon: "mdi:clipboard-multiple",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.issues"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";

import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type IssuesSettingFormProps, defaultForm } from "./components/form";
import { type IssuesFormVO, type IssuesListItem, type IssuesQueryParams } from "@01s-11comm/type";
import IssuesSettingForm from "./components/form.vue";
import {
	repairTypeOptions,
	repairStatusOptions,
	repairCategoryOptions,
	repairsSettingTypeOptions,
} from "@01s-11comm/type";
import { useIssuesListQuery } from "@/api/property-manage/repairs-manage/issues";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const issuesSettingFormInstance = ref<InstanceType<typeof IssuesSettingForm> | null>(null);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "工单编码",
		prop: "workOrderCode",
		width: 120,
	},
	{
		label: "位置",
		prop: "location",
		width: 120,
	},
	{
		label: "报修类型",
		prop: "repairType",
		width: 120,
	},
	{
		label: "维修类型",
		prop: "maintenanceType",
		width: 100,
	},
	{
		label: "报修人",
		prop: "reporter",
		width: 100,
	},
	{
		label: "联系方式",
		prop: "contactInfo",
		width: 120,
	},
	{
		label: "预约开始结束时间",
		prop: "appointmentTimeRange",
		width: 180,
	},
	{
		label: "提交时间",
		prop: "submitTime",
		width: 150,
	},
	{
		label: "提单时长",
		prop: "orderDuration",
		width: 100,
	},
	{
		label: "完成时间",
		prop: "completeTime",
		width: 150,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "工单池",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<IssuesQueryParams> = {
	workOrderNumber: "",
	reporter: "",
	reporterPhone: "",
	repairType: "",
	repairSettingType: "",
	repairLocation: "",
	maintenanceType: "",
	startTime: "",
	endTime: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useIssuesListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 工单编号
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
	},

	// 报修人
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairman")),
		prop: "reporter",
		valueType: "input",
	},

	// 报修电话
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairPhone")),
		prop: "reporterPhone",
		valueType: "input",
	},

	// 报修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},

	// 报修设置类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairReportingSettingType")),
		prop: "repairSettingType",
		valueType: "select",
		options: repairsSettingTypeOptions,
	},

	// 报修位置
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairLocation")),
		prop: "repairLocation",
		valueType: "input",
	},

	// 维修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.maintenanceType")),
		prop: "maintenanceType",
		valueType: "select",
		options: repairCategoryOptions,
	},

	// 开始时间
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},

	// 结束时间
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 测试异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: IssuesListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}工单池`;

	/** 业务对象 */
	const issuesFormVO: IssuesFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					workOrderCode: row?.workOrderCode || "",
					location: row?.location || "",
					repairType: row?.repairType || "",
					maintenanceType: row?.maintenanceType || "",
					reporter: row?.reporter || "",
					contactInfo: row?.contactInfo || "",
					appointmentTimeRange: row?.appointmentTimeRange || "",
					submitTime: row?.submitTime || "",
					orderDuration: row?.orderDuration || "",
					completeTime: row?.completeTime || "",
					status: row?.status || "",
					violationDescription: row?.violationDescription || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(issuesFormVO);

	/** 表单组件需要的props */
	const formProps: IssuesSettingFormProps = {
		form: issuesFormVO,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(IssuesSettingForm, {
				ref: issuesSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = issuesSettingFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = issuesSettingFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					issuesSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await issuesSettingFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 新增按钮点击事件 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑按钮点击事件 */
function handleEdit(row: IssuesListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: IssuesListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: IssuesListItem) {
	// TODO: 实现删除逻辑
	consola.log("删除", row);
	await doFetch();
}
</script>

<template>
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="handleAdd">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
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
