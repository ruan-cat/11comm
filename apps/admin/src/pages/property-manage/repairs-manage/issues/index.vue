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
import { cloneDeep } from "lodash-es";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type IssuesSettingFormProps, defaultForm, type 工单池表单_VO } from "./components/form";
import IssuesSettingForm from "./components/form.vue";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const issuesSettingFormInstance = ref<InstanceType<typeof IssuesSettingForm> | null>(null);

/** 表格数据 */
const tableData = ref<工单池_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "工单编码",
		prop: "工单编码",
		width: 120,
	},
	{
		label: "位置",
		prop: "位置",
		width: 120,
	},
	{
		label: "报修类型",
		prop: "报修类型",
		width: 120,
	},
	{
		label: "维修类型",
		prop: "维修类型",
		width: 100,
	},
	{
		label: "报修人",
		prop: "报修人",
		width: 100,
	},
	{
		label: "联系方式",
		prop: "联系方式",
		width: 120,
	},
	{
		label: "预约开始结束时间",
		prop: "预约开始结束时间",
		width: 180,
	},
	{
		label: "提交时间",
		prop: "提交时间",
		width: 150,
	},
	{
		label: "提单时长",
		prop: "提单时长",
		width: 100,
	},
	{
		label: "完成时间",
		prop: "完成时间",
		width: 150,
	},
	{
		label: "状态",
		prop: "状态",
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
const plusSearchModelRef: FieldValues & 工单池_列表查询_VO = {
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
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

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
		options: 报修类型Options,
	},

	// 报修设置类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairReportingSettingType")),
		prop: "报修设置类型",
		valueType: "select",
		options: 报修设置类型Options,
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
		options: 维修类型Options,
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
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
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
			filteredData = filteredData.filter((item) => item.工单编码.includes(plusSearchModel.value.工单编号!));
		}
		if (plusSearchModel.value.报修人) {
			filteredData = filteredData.filter((item) => item.报修人.includes(plusSearchModel.value.报修人!));
		}
		if (plusSearchModel.value.报修电话) {
			filteredData = filteredData.filter((item) => item.联系方式.includes(plusSearchModel.value.报修电话!));
		}
		if (plusSearchModel.value.报修类型) {
			filteredData = filteredData.filter((item) => item.报修类型 === plusSearchModel.value.报修类型);
		}
		if (plusSearchModel.value.报修位置) {
			filteredData = filteredData.filter((item) => item.位置.includes(plusSearchModel.value.报修位置!));
		}
		if (plusSearchModel.value.维修类型) {
			filteredData = filteredData.filter((item) => item.维修类型 === plusSearchModel.value.维修类型);
		}
		if (plusSearchModel.value.开始时间) {
			filteredData = filteredData.filter((item) => item.提交时间 >= plusSearchModel.value.开始时间!);
		}
		if (plusSearchModel.value.结束时间) {
			filteredData = filteredData.filter((item) => item.提交时间 <= plusSearchModel.value.结束时间!);
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
const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 工单池_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}工单池`;

	/** 业务对象 */
	const 工单池表单VO: 工单池表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					工单编码: row?.工单编码 || "",
					位置: row?.位置 || "",
					报修类型: row?.报修类型 || "",
					维修类型: row?.维修类型 || "",
					报修人: row?.报修人 || "",
					联系方式: row?.联系方式 || "",
					预约开始结束时间: row?.预约开始结束时间 || "",
					提交时间: row?.提交时间 || "",
					提单时长: row?.提单时长 || "",
					完成时间: row?.完成时间 || "",
					状态: row?.状态 || "",
					违规说明: row?.违规说明 || "",
					备注: row?.备注 || "",
				})
			: cloneDeep(defaultForm);
	const defaultValues = cloneDeep(工单池表单VO);

	/** 表单组件需要的props */
	const formProps: IssuesSettingFormProps = {
		form: 工单池表单VO,
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
function handleEdit(row: 工单池_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: 工单池_列表数据) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: 工单池_列表数据) {
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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

