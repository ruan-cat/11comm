<script lang="ts" setup>
definePage({
	meta: {
		title: "水电抄表",
		icon: "mdi:water",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.waterAndElectricityMeterReading"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	tableData as mockTableData,
	type 水电抄表_列表数据,
	type 水电抄表_列表查询_VO,
	表类型Options,
} from "./test-data";
import { type WaterAndElectricityMeterReadingFormProps, defaultForm, type 水电抄表表单_VO } from "./components/form";
import WaterAndElectricityMeterReadingForm from "./components/form.vue";

const WaterAndElectricityMeterReadingFormInstance = ref<InstanceType<
	typeof WaterAndElectricityMeterReadingForm
> | null>(null);

/** 表格数据 */
const tableData = ref<水电抄表_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "表ID",
		prop: "表ID",
		width: 150,
	},
	{
		label: "表类型",
		prop: "表类型",
		width: 100,
	},
	{
		label: "对象名称",
		prop: "对象名称",
		width: 140,
	},
	{
		label: "上期度数",
		prop: "上期度数",
		width: 100,
	},
	{
		label: "本期度数",
		prop: "本期度数",
		width: 100,
	},
	{
		label: "上期读表时间",
		prop: "上期读表时间",
		width: 180,
	},
	{
		label: "本期读表时间",
		prop: "本期读表时间",
		width: 180,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 180,
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 水电抄表_列表查询_VO = {
	表类型: "",
	表ID: "",
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
	// 表类型
	{
		label: transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.tableType")),
		prop: "表类型",
		valueType: "select",
		options: 表类型Options,
	},
	// 表ID
	{
		label: transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.tableId")),
		prop: "表ID",
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps, // 默认配置
	data: tableData.value, // 表格数据
	columns: [], // 列配置
	pagination: pagination.value, // 分页配置
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "水电抄表",
	columns: columns.value,
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
		if (plusSearchModel.value.表类型) {
			filteredData = filteredData.filter((item) => item.表类型.includes(plusSearchModel.value.表类型!));
		}
		if (plusSearchModel.value.表ID) {
			filteredData = filteredData.filter((item) => item.表ID.includes(plusSearchModel.value.表ID!));
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 水电抄表_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}水电抄表`;

	/** 业务对象 */
	const formData: 水电抄表表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					费用类型: row?.表类型 === "水表" ? "水费" : row?.表类型 === "电表" ? "电费" : "水费",
					收费项目: row?.表类型 === "水表" || row?.表类型 === "电表" ? row?.表类型 : "水表",
					抄表类型: row?.表类型 || "水表",
					收费对象: row?.对象名称 || "",
					上期度数: row?.上期度数 || "",
					本期度数: row?.本期度数 || "",
					上期读表时间: row?.上期读表时间 || "",
					本期读表时间: row?.本期读表时间 || "",
					备注: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: WaterAndElectricityMeterReadingFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(WaterAndElectricityMeterReadingForm, {
				ref: WaterAndElectricityMeterReadingFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = WaterAndElectricityMeterReadingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = WaterAndElectricityMeterReadingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					WaterAndElectricityMeterReadingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await WaterAndElectricityMeterReadingFormInstance.value.plusFormInstance.handleSubmit();
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
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.meterReading")) }}
				</ElButton>
				<ElButton type="info">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.meterReadingType")) }}
				</ElButton>
				<ElButton type="info">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.readingImport1")) }}
				</ElButton>
				<ElButton type="info">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.readingImport2")) }}
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">{{ transformI18n($t("common.buttons.del")) }}</ElButton>
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
