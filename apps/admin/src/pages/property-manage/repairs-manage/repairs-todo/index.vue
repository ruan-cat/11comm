<script lang="ts" setup>
definePage({
	meta: {
		title: "报修待办",
		icon: "mdi:clipboard-clock",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsTodo"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type RepairsTodoFormProps, defaultForm, type RepairsTodoFormVO } from "./components/form";
import type { RepairsTodoListItem } from "@01s-11comm/type";
import RepairsTodoForm from "./components/form.vue";
import { useRepairsTodoListQuery } from "@/api/property-manage/repairs-manage/repairs-todo";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const repairsTodoFormInstance = ref<InstanceType<typeof RepairsTodoForm> | null>(null);

/** 模拟数据 */
const mockTableData: RepairsTodoListItem[] = [
	{
		id: "1",
		name: "待办工单1",
		status: "待处理",
		createTime: "2024-01-01 08:00:00",
		updateTime: "2024-01-01 08:00:00",
		remark: "紧急维修",
		workOrderNumber: "RW202401010001",
		location: "1栋2单元101",
		repairType: "水电维修",
		maintenanceType: "紧急维修",
		reporter: "张三",
		contactInfo: "13800138000",
		appointmentTime: "2024-01-01 14:00:00",
	},
	{
		id: "2",
		name: "待办工单2",
		status: "处理中",
		createTime: "2024-01-01 09:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "一般维修",
		workOrderNumber: "RW202401010002",
		location: "2栋3单元202",
		repairType: "设备维修",
		maintenanceType: "计划维修",
		reporter: "李四",
		contactInfo: "13800138001",
		appointmentTime: "2024-01-01 16:00:00",
	},
];

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "工单编号",
		prop: "workOrderNumber",
		width: 140,
	},
	{
		label: "位置",
		prop: "location",
		width: 150,
	},
	{
		label: "报修类型",
		prop: "repairType",
		width: 120,
	},
	{
		label: "维修类型",
		prop: "maintenanceType",
		width: 120,
	},
	{
		label: "报修人",
		prop: "reporter",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "contactInfo",
		width: 140,
	},
	{
		label: "预约时间",
		prop: "appointmentTime",
		width: 150,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报修待办",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RepairsTodoQueryParams = {
	name: "",
	status: "",
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
} = useRepairsTodoListQuery(plusSearchDefaultValues);

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

	// 状态
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairStatus")),
		prop: "status",
		valueType: "select",
		options: 报修状态Options,
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
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: RepairsTodoListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}报修待办`;

	/** 业务对象 */
	const formValue: RepairsTodoFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					workOrderNumber: row?.workOrderNumber || "",
					location: row?.location || "",
					repairType: row?.repairType || "",
					maintenanceType: row?.maintenanceType || "",
					reporter: row?.reporter || "",
					contactInfo: row?.contactInfo || "",
					appointmentTime: row?.appointmentTime || "",
					status: row?.status || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(formValue);

	/** 表单组件需要的props */
	const formProps: RepairsTodoFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(RepairsTodoForm, {
				ref: repairsTodoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = repairsTodoFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = repairsTodoFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					repairsTodoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await repairsTodoFormInstance.value?.plusFormInstance?.handleSubmit();
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
function handleEdit(row: RepairsTodoListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: RepairsTodoListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: RepairsTodoListItem) {
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
