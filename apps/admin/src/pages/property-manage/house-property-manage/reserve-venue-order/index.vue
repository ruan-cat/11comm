<script lang="ts" setup>
definePage({
	meta: {
		title: "场地预约订单",
		icon: "mdi:calendar-clock",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.reserveVenueOrder"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";

import { type ReserveVenueOrderFormProps, defaultForm } from "./components/form";
import ReserveVenueOrderForm from "./components/form.vue";
import {
	type 场地预约订单_列表数据,
	type 场地预约订单_列表查询_VO,
	tableData as mockTableData,
	预约状态Options,
	预约场地Options,
	type 场地预约订单_VO,
} from "./test-data";

const reserveVenueOrderFormInstance = ref<InstanceType<typeof ReserveVenueOrderForm> | null>(null);

/** 表格数据 */
const tableData = ref<场地预约订单_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "订单编号",
		prop: "订单编号",
		width: 120,
	},
	{
		label: "场馆",
		prop: "场馆",
		width: 120,
	},
	{
		label: "场地",
		prop: "场地",
		width: 120,
	},
	{
		label: "预约人",
		prop: "预约人",
		width: 120,
	},
	{
		label: "预约电话",
		prop: "预约电话",
		width: 120,
	},
	{
		label: "预约日期",
		prop: "预约日期",
		width: 120,
	},
	{
		label: "预约时间",
		prop: "预约时间",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		width: 120,
	},
	{
		label: "实收金额",
		prop: "实收金额",
		width: 120,
	},
	{
		label: "支付方式",
		prop: "支付方式",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		label: "备注",
		prop: "备注",
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "场地预约订单",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 场地预约订单_列表查询_VO = {
	预约时间: "",
	预约人: "",
	预约电话: "",
	选择状态: "",
	预约场地: "",
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
	// 预约时间
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldTime")),
		prop: "预约时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	// 预约人
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldMan")),
		prop: "预约人",
		valueType: "input",
	},

	// 预约电话
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldPhone")),
		prop: "预约电话",
		valueType: "input",
	},

	// 预约状态
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.orderState")),
		prop: "选择状态",
		valueType: "select",
		options: 预约状态Options,
	},

	// 预约场地
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldType")),
		prop: "预约场地",
		valueType: "select",
		options: 预约场地Options,
	},

	// 装修申请开始时间
	// {
	// 	label: transformI18n($t("propertyManage_communityManage.house-decoration.startTimeForDecorationApplication")),
	// 	prop: "装修申请开始时间",
	// 	valueType: "date-picker",
	// 	fieldProps: {
	// 		type: "date",
	// 		valueFormat: "YYYY-MM-DD",
	// 		format: "YYYY-MM-DD",
	// 	},
	// },

	// 装修申请结束时间
	// {
	// 	label: transformI18n($t("propertyManage_communityManage.house-decoration.endTimeForDecorationApplication")),
	// 	prop: "装修申请结束时间",
	// 	valueType: "date-picker",
	// 	fieldProps: {
	// 		type: "date",
	// 		valueFormat: "YYYY-MM-DD",
	// 		format: "YYYY-MM-DD",
	// 	},
	// },
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.预约时间) {
			filteredData = filteredData.filter((item) => item.预约日期.includes(plusSearchModel.value.预约时间!));
		}
		if (plusSearchModel.value.预约人) {
			filteredData = filteredData.filter((item) => item.预约人.includes(plusSearchModel.value.预约人!));
		}
		if (plusSearchModel.value.预约电话) {
			filteredData = filteredData.filter((item) => item.预约电话.includes(plusSearchModel.value.预约电话!));
		}
		if (plusSearchModel.value.选择状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.选择状态);
		}
		if (plusSearchModel.value.预约场地) {
			filteredData = filteredData.filter((item) => item.场地 === plusSearchModel.value.预约场地);
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
/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 场地预约订单_列表数据;
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
	const title = `${modeText.value}场地预约订单`;

	/** 业务对象 */
	const 场地预约订单表单_VO: 场地预约订单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const props: ReserveVenueOrderFormProps = {
		form: 场地预约订单表单_VO,
		defaultValues: 场地预约订单表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ReserveVenueOrderForm, {
				ref: reserveVenueOrderFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reserveVenueOrderFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = reserveVenueOrderFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					reserveVenueOrderFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reserveVenueOrderFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
