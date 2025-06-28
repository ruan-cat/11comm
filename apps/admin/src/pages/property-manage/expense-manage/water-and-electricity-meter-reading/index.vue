<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup>
definePage({
	meta: {
		title: "水电抄表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.waterAndElectricityMeterReading"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type WaterAndElectricityMeterReadingFormProps, defaultForm } from "./components/form";
import WaterAndElectricityMeterReadingForm from "./components/form.vue";

const WaterAndElectricityMeterReadingFormInstance = ref<InstanceType<
	typeof WaterAndElectricityMeterReadingForm
> | null>(null);

interface 水电抄表_列表数据 {
	表ID: string;
	表类型: string;
	对象名称: string;
	上期度数: string;
	本期度数: string;
	上期读表时间: string;
	本期读表时间: string;
	创建时间: string;
}
const tableDataItem: 水电抄表_列表数据 = {
	表ID: "表ID",
	表类型: "表类型",
	对象名称: "对象名称",
	上期度数: "上期度数",
	本期度数: "本期度数",
	上期读表时间: "上期读表时间",
	本期读表时间: "本期读表时间",
	创建时间: "创建时间",
};
/** 表格数据 */
const tableData = ref<水电抄表_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
/** 表格配置 */
const columns = ref<TableColumnList>([
	{
		prop: "表ID",
		label: "表ID",
		width: 200,
		fixed: true,
	},
	{
		prop: "表类型",
		label: "表类型",
		width: 120,
	},
	{
		prop: "对象名称",
		label: "对象名称",
		width: 120,
	},
	{
		prop: "上期度数",
		label: "上期度数",
		width: 120,
	},
	{
		prop: "本期度数",
		label: "本期度数",
		width: 120,
	},
	{
		prop: "上期读表时间",
		label: "上期读表时间",
		width: 200,
	},
	{
		prop: "本期读表时间",
		label: "本期读表时间",
		width: 200,
	},
	{
		prop: "创建时间",
		label: "创建时间",
		width: 200,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 200,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
}

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

/** 表格搜索栏组件 表单配置 */
interface 水电抄表_列表查询_VO {
	表类型?: string;
	表ID?: string;
}
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
		options: [
			{ label: "水表", value: "水表" },
			{ label: "电表", value: "电表" },
			{ label: "抄表", value: "抄表" },
		],
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

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 水电抄表_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
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

	/** 表单组件需要的props */
	const formProps: WaterAndElectricityMeterReadingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: WaterAndElectricityMeterReadingFormProps = {
		form: {
			...defaultForm,
			费用类型: "水费",
			收费项目: "动态水表",
			抄表类型: "水表",
			收费对象: "111-1-12",
			上期度数: "119",
			本期度数: "",
			上期读表时间: "2025-01-01 00:00:00",
			本期读表时间: "",
			备注: "",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value
		? formProps
		: {
				form: isEdit.value ? testEditProps.form : cloneDeep(row),
				defaultValues: cloneDeep(row),
			};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

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
					// console.log(options, index, button);
					const formComputed = WaterAndElectricityMeterReadingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					WaterAndElectricityMeterReadingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
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
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.meterReading")) }}
				</ElButton>
				<ElButton type="success">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.meterReadingType")) }}
				</ElButton>
				<ElButton type="default">
					{{ transformI18n($t("propertyManage_expensesManage.water-and-electricity-meter-reading.readingImport1")) }}
				</ElButton>
				<ElButton type="default">
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
