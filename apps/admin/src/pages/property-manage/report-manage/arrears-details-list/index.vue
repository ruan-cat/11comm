<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费明细表",
		icon: "mdi:cash-minus",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.arrearsDetailsList"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ArrearsDetailsFormProps, defaultForm, type 欠费明细表单_VO } from "./components/form";
import ArrearsDetailsForm from "./components/form.vue";

const smallTotal = ref<number>(0);
const largeTotal = ref<number>(0);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const arrearsDetailsFormInstance = ref<InstanceType<typeof ArrearsDetailsForm> | null>(null);

/** 表格数据 */
const tableData = ref<欠费明细_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "费用编号",
		prop: "费用编号",
		width: 100,
	},
	{
		label: "房号",
		prop: "房号",
		width: 150,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "业主电话",
		prop: "业主电话",
		width: 140,
	},
	{
		label: "面积",
		prop: "面积",
		width: 90,
	},
	{
		label: "费用项",
		prop: "费用项",
		width: 150,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 140,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 140,
	},
	{
		label: "欠费时长(天)",
		prop: "欠费时长",
		width: 130,
	},
	{
		label: "欠费金额",
		prop: "欠费金额",
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

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费明细表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 欠费明细_列表查询_VO = {
	费用大类: "",
	填写房屋编号: "",
	开始时间: "",
	结束时间: "",
	小区: "",
	填写业主名称: "",
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
	//费用大类
	{
		label: "费用大类",
		prop: "费用大类",
		valueType: "select",
		options: 费用大类Options,
	},
	//房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "填写房屋编号",
		valueType: "input",
	},
	// 开始时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.startTime")),
		prop: "开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	// 结束时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.endTime")),
		prop: "结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	//小区
	{
		label: transformI18n($t("propertyManage_reportManage.report.cell")),
		prop: "小区",
		valueType: "select",
		options: 小区Options,
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "填写业主名称",
		valueType: "input",
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

async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 加载表格数据 */
async function loadTableData() {
	try {
		let filteredData = mockTableData;

		if (plusSearchModel.value.费用大类) {
			filteredData = filteredData.filter((item) => item.费用项.includes(plusSearchModel.value.费用大类!));
		}
		if (plusSearchModel.value.填写房屋编号) {
			filteredData = filteredData.filter((item) => item.房号.includes(plusSearchModel.value.填写房屋编号!));
		}
		if (plusSearchModel.value.小区) {
			filteredData = filteredData.filter((item) => item.房号.includes(plusSearchModel.value.小区!));
		}
		if (plusSearchModel.value.填写业主名称) {
			filteredData = filteredData.filter((item) => item.业主.includes(plusSearchModel.value.填写业主名称!));
		}
		if (plusSearchModel.value.开始时间) {
			filteredData = filteredData.filter((item) => item.开始时间 >= plusSearchModel.value.开始时间!);
		}
		if (plusSearchModel.value.结束时间) {
			filteredData = filteredData.filter((item) => item.结束时间 <= plusSearchModel.value.结束时间!);
		}

		pagination.value.total = filteredData.length;
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);
		pureTableProps.value.data = tableData.value;

		smallTotal.value = filteredData.reduce((sum, item) => sum + Number(item.欠费金额), 0);
		largeTotal.value = smallTotal.value;
	} catch (error) {
		console.error("加载数据失败:", error);
	}
}

/** 测试异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 欠费明细_列表数据;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}欠费明细表`;

	/** 业务对象 */
	const formValue: 欠费明细表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					费用编号: row?.费用编号 || "",
					房号: row?.房号 || "",
					业主: row?.业主 || "",
					业主电话: row?.业主电话 || "",
					面积: row?.面积 || "",
					费用项: row?.费用项 || "",
					开始时间: row?.开始时间 || "",
					结束时间: row?.结束时间 || "",
					欠费时长: row?.欠费时长 || "",
					欠费金额: row?.欠费金额 || "",
				})
			: cloneDeep(defaultForm);
	const defaultValues = cloneDeep(formValue);

	/** 表单组件需要的props */
	const formProps: ArrearsDetailsFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(ArrearsDetailsForm, {
				ref: arrearsDetailsFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = arrearsDetailsFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = arrearsDetailsFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					arrearsDetailsFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await arrearsDetailsFormInstance.value?.plusFormInstance?.handleSubmit();
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
function handleEdit(row: 欠费明细_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: 欠费明细_列表数据) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: 欠费明细_列表数据) {
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

		<section class="summary">
			<div>小计 欠费 : {{ smallTotal }} 元</div>
			<div>大计 欠费 : {{ largeTotal }} 元</div>
			<div>费用开始时间：所创建费用的计费起始时间</div>
			<div>欠费时长（天）：押金费用项欠费时长是费用开始时间到当天的天数</div>
			<div>除押金外的费用项欠费时长是费用的开始时间到费用的结束时间的天数</div>
			<div>欠费金额：欠费周期内应缴费用</div>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
.summary {
	margin-top: 12px;
}
</style>
