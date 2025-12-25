<script lang="ts" setup>
definePage({
	meta: {
		title: "工单池",
		icon: "mdi:clipboard-multiple",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.issues"),
	},
});

import { ref, computed, onMounted, h } from "vue";
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

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const issuesSettingFormInstance = ref<InstanceType<typeof IssuesSettingForm> | null>(null);

/** 表格数据 */
const tableData = ref<IssuesListItem[]>([]);

/** 模拟数据 - TODO: 替换为真实API调用 */
const mockTableData: IssuesListItem[] = [];

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

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

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
	工单编号: "",
	报修人: "",
	报修电话: "",
	报修类型: "",
	报修设置类型: "",
	报修位置: "",
	维修类型: "",
	开始时间: "",
	结束时间: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 工单编号
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.workOrderNumber")),
		prop: "工单编号",
		valueType: "input",
	},

	// 报修人
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairman")),
		prop: "报修人",
		valueType: "input",
	},

	// 报修电话
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairPhone")),
		prop: "报修电话",
		valueType: "input",
	},

	// 报修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairType")),
		prop: "报修类型",
		valueType: "select",
		options: repairTypeOptions,
	},

	// 报修设置类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairReportingSettingType")),
		prop: "报修设置类型",
		valueType: "select",
		options: repairsSettingTypeOptions,
	},

	// 报修位置
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairLocation")),
		prop: "报修位置",
		valueType: "input",
	},

	// 维修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.maintenanceType")),
		prop: "维修类型",
		valueType: "select",
		options: repairCategoryOptions,
	},

	// 开始时间
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.startTime")),
		prop: "开始时间",
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
		prop: "结束时间",
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
async function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.工单编号) {
			filteredData = filteredData.filter((item) => item.workOrderCode?.includes(String(plusSearchModel.value.工单编号)));
		}
		if (plusSearchModel.value.报修人) {
			filteredData = filteredData.filter((item) => item.reporter?.includes(String(plusSearchModel.value.报修人)));
		}
		if (plusSearchModel.value.报修电话) {
			filteredData = filteredData.filter((item) => item.contactInfo?.includes(String(plusSearchModel.value.报修电话)));
		}
		if (plusSearchModel.value.报修类型) {
			filteredData = filteredData.filter((item) => item.repairType === plusSearchModel.value.报修类型);
		}
		if (plusSearchModel.value.报修位置) {
			filteredData = filteredData.filter((item) => item.location?.includes(String(plusSearchModel.value.报修位置)));
		}
		if (plusSearchModel.value.维修类型) {
			filteredData = filteredData.filter((item) => item.maintenanceType === plusSearchModel.value.维修类型);
		}
		if (plusSearchModel.value.开始时间) {
			filteredData = filteredData.filter((item) => item.submitTime && item.submitTime >= String(plusSearchModel.value.开始时间));
		}
		if (plusSearchModel.value.结束时间) {
			filteredData = filteredData.filter((item) => item.submitTime && item.submitTime <= String(plusSearchModel.value.结束时间));
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
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
						await loadTableData();
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
	await loadTableData();
}

onMounted(async () => {
	await loadTableData();
});
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

		<PureTableBar :="pureTableBarProps" @refresh="loadTableData">
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
