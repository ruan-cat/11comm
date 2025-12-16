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
import { type WaterAndElectricityMeterReadingFormProps, defaultForm, type 水电抄表表单_VO } from "./components/form";
import WaterAndElectricityMeterReadingForm from "./components/form.vue";
import { meterTypeOptions } from "@01s-11comm/type";

/** 水电抄表_列表数据 */
interface WaterMeterReadingListItem {
	id: string;
	meterId: string;
	meterType: string;
	objectName: string;
	lastReading: string;
	currentReading: string;
	lastReadingTime: string;
	currentReadingTime: string;
	createTime: string;
}

/** 模拟表格数据 */
const mockTableData: WaterMeterReadingListItem[] = [
	{
		id: "1",
		meterId: "SB202401001",
		meterType: "水表",
		objectName: "A栋101室",
		lastReading: "1234",
		currentReading: "1356",
		lastReadingTime: "2024-01-01 10:00:00",
		currentReadingTime: "2024-02-01 10:00:00",
		createTime: "2024-01-01 10:00:00",
	},
	{
		id: "2",
		meterId: "DB202401001",
		meterType: "电表",
		objectName: "A栋102室",
		lastReading: "5678",
		currentReading: "5890",
		lastReadingTime: "2024-01-01 10:00:00",
		currentReadingTime: "2024-02-01 10:00:00",
		createTime: "2024-01-02 11:00:00",
	},
];

const WaterAndElectricityMeterReadingFormInstance = ref<InstanceType<
	typeof WaterAndElectricityMeterReadingForm
> | null>(null);

/** 表格数据 */
const tableData = ref<WaterMeterReadingListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "表ID",
		prop: "meterId",
		width: 150,
	},
	{
		label: "表类型",
		prop: "meterType",
		width: 100,
	},
	{
		label: "对象名称",
		prop: "objectName",
		width: 140,
	},
	{
		label: "上期度数",
		prop: "lastReading",
		width: 100,
	},
	{
		label: "本期度数",
		prop: "currentReading",
		width: 100,
	},
	{
		label: "上期读表时间",
		prop: "lastReadingTime",
		width: 180,
	},
	{
		label: "本期读表时间",
		prop: "currentReadingTime",
		width: 180,
	},
	{
		label: "创建时间",
		prop: "createTime",
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

/** 水电抄表_列表查询_VO */
interface WaterMeterReadingQueryVO {
	meterType: string;
	meterId: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & WaterMeterReadingQueryVO = {
	meterType: "",
	meterId: "",
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
	{
		label: transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.tableType")),
		prop: "meterType",
		valueType: "select",
		options: meterTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.tableId")),
		prop: "meterId",
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
		let filteredData = mockTableData;

		if (plusSearchModel.value.meterType) {
			filteredData = filteredData.filter((item) => item.meterType.includes(plusSearchModel.value.meterType!));
		}
		if (plusSearchModel.value.meterId) {
			filteredData = filteredData.filter((item) => item.meterId.includes(plusSearchModel.value.meterId!));
		}

		pagination.value.total = filteredData.length;

		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
	}
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: WaterMeterReadingListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 删除水电抄表记录 */
async function handleDelete(row: WaterMeterReadingListItem) {
	consola.log("删除水电抄表记录:", row);
	await loadTableData();
}

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

	const title = `${modeText.value}水电抄表`;

	const formData: 水电抄表表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					费用类型: row?.meterType === "水表" ? "水费" : row?.meterType === "电表" ? "电费" : "水费",
					收费项目: row?.meterType === "水表" || row?.meterType === "电表" ? row?.meterType as "水表" | "电表" : "水表",
					抄表类型: (row?.meterType || "水表") as "水表" | "电表",
					收费对象: row?.objectName || "",
					上期度数: row?.lastReading || "",
					本期度数: row?.currentReading || "",
					上期读表时间: row?.lastReadingTime || "",
					本期读表时间: row?.currentReadingTime || "",
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
