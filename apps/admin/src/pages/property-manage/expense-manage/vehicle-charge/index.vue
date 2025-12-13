<script lang="ts" setup>
definePage({
	meta: {
		title: "车辆收费",
		icon: "mdi:car-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.vehicleCharge"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type Mode } from "@/composables/use-mode";

import { type VehicleChargeFormProps, defaultForm, type 车辆收费表单_VO } from "./components/form";
import VehicleChargeForm from "./components/form.vue";
const VehicleChargeFormInstance = ref<InstanceType<typeof VehicleChargeForm> | null>(null);

/** 表格数据 */
const tableData = ref<车辆收费_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		prop: "车牌号",
		label: "车牌号",
		width: 200,
	},
	{
		prop: "停车场(单位:号)",
		label: "停车场(单位:号)",
		width: 200,
	},
	{
		prop: "车位(单位:号)",
		label: "车位(单位:号)",
		width: 200,
	},
	{
		prop: "业主名称",
		label: "业主名称",
		width: 200,
	},
	{
		prop: "联系方式",
		label: "联系方式",
		width: 200,
	},
	{
		prop: "车位状态",
		label: "车位状态",
		width: 200,
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
	title: "车辆收费",
	columns: columns.value,
});
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 车辆收费_列表查询_VO = {
	"停车场-车位": "",
	车牌号: "",
	业主名称: "",
	车位状态: "",
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
	//停车场-车位
	{
		prop: "停车场-车位",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.vehicleSpaceNumber")),
		valueType: "input",
		// placeholder: "请填写停车场-车位，如 1-101",
		// 框内固定显示
	},
	//车牌号
	{
		prop: "车牌号",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.vehicleLicensePlate")),
		valueType: "input",
	},
	//业主名称
	{
		prop: "业主名称",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.ownerName")),
		valueType: "input",
	},
	//车位状态
	{
		prop: "车位状态",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.vehicleSpaceStatus")),
		valueType: "select",
		options: 车位状态Options,
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value["停车场-车位"]) {
			filteredData = filteredData.filter((item) =>
				`${item["停车场(单位:号)"]}-${item["车位(单位:号)"]}`.includes(plusSearchModel.value["停车场-车位"]!),
			);
		}
		if (plusSearchModel.value.车牌号) {
			filteredData = filteredData.filter((item) => item.车牌号.includes(plusSearchModel.value.车牌号!));
		}
		if (plusSearchModel.value.业主名称) {
			filteredData = filteredData.filter((item) => item.业主名称.includes(plusSearchModel.value.业主名称!));
		}
		if (plusSearchModel.value.车位状态) {
			filteredData = filteredData.filter((item) => item.车位状态 === plusSearchModel.value.车位状态);
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

const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
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
	row?: 车辆收费_列表数据;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车辆收费`;

	/** 业务对象 */
	const 车辆收费表单_VO: 车辆收费表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					收费范围: "小区",
					费用类型: "停车费",
					收费项目: row?.车牌号 || "",
					车位状态: "已出售",
					计费起始时间: "2025-01-01",
					计费结束时间: "2025-12-31",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: VehicleChargeFormProps = {
		form: 车辆收费表单_VO,
		defaultValues: 车辆收费表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(VehicleChargeForm, {
				ref: VehicleChargeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = VehicleChargeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = VehicleChargeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					VehicleChargeFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await VehicleChargeFormInstance.value.plusFormInstance.handleSubmit();
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
		<!-- 表格搜索栏组件 -->
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
							{{ transformI18n($t("propertyManage_expensesManage.vehicle-charge.viewFee")) }}
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
