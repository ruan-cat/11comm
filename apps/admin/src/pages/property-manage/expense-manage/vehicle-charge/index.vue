<script lang="ts" setup>
definePage({
	meta: {
		title: "车辆收费",
		icon: "mdi:car-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.vehicleCharge"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type { VehicleChargeFormProps } from "./components/form";
import VehicleChargeForm from "./components/form.vue";
import type { VehicleChargeListItem, VehicleChargeQueryParams, VehicleChargeFormVO } from "@01s-11comm/type";
import { parkingSpaceStatusOptions } from "@01s-11comm/type";

/** 默认表单数据 */
const defaultForm: VehicleChargeFormVO = {
	licensePlateNumber: "",
	ownerName: "",
	parkingSpaceStatus: "",
	chargeAmount: "",
	chargeTime: "",
	chargeMethod: "",
	remark: "",
};

/** 模拟表格数据 */
const mockTableData: VehicleChargeListItem[] = [
	{
		id: "1",
		name: "车辆A",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
	},
	{
		id: "2",
		name: "车辆B",
		status: "禁用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
	},
];

const VehicleChargeFormInstance = ref<InstanceType<typeof VehicleChargeForm> | null>(null);

/** 表格数据 */
const tableData = ref<VehicleChargeListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		prop: "name",
		label: "名称",
		width: 200,
	},
	{
		prop: "status",
		label: "状态",
		width: 200,
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 200,
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
	title: "车辆收费",
	columns: columns.value,
});
/** 车辆收费_列表查询_VO */
interface VehicleChargeQueryVO {
	parkingLotSpace: string;
	licensePlateNumber: string;
	ownerName: string;
	parkingSpaceStatus: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & VehicleChargeQueryVO = {
	parkingLotSpace: "",
	licensePlateNumber: "",
	ownerName: "",
	parkingSpaceStatus: "",
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
		prop: "parkingLotSpace",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.vehicleSpaceNumber")),
		valueType: "input",
	},
	{
		prop: "licensePlateNumber",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.vehicleLicensePlate")),
		valueType: "input",
	},
	{
		prop: "ownerName",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.ownerName")),
		valueType: "input",
	},
	{
		prop: "parkingSpaceStatus",
		label: transformI18n($t("propertyManage_expensesManage.vehicle-charge.vehicleSpaceStatus")),
		valueType: "select",
		options: parkingSpaceStatusOptions,
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
		let filteredData = mockTableData;

		if (plusSearchModel.value.licensePlateNumber) {
			const searchValue = String(plusSearchModel.value.licensePlateNumber).trim();
			filteredData = filteredData.filter((item) => item.name.includes(searchValue));
		}
		if (plusSearchModel.value.ownerName) {
			const searchValue = String(plusSearchModel.value.ownerName).trim();
			filteredData = filteredData.filter((item) => item.name.includes(searchValue));
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
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
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
	row?: VehicleChargeListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车辆收费`;

	/** 业务对象 */
	const formData: VehicleChargeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					licensePlateNumber: row?.name || "",
					ownerName: "",
					parkingSpaceStatus: "已出售",
					chargeAmount: "",
					chargeTime: "2025-01-01",
					chargeMethod: "",
					remark: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: VehicleChargeFormProps = {
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
