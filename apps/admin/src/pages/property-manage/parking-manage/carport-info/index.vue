<script lang="ts" setup>
definePage({
	meta: {
		title: "车位信息",
		icon: "mdi:garage",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportInfo"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { type CarportInfoFormProps, defaultForm } from "./components/form";
import CarportInfoForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { parkingSpaceStatusOptions, parkingSpaceTypeOptions, parkingLotOptions } from "@01s-11comm/type";
import type { CarportInfoListItem } from "@01s-11comm/type";

/** 表格数据 */
const tableData = ref<CarportInfoListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "停车场",
		prop: "停车场",
		width: 120,
	},
	{
		label: "车位",
		prop: "车位",
		width: 120,
	},
	{
		label: "车位状态",
		prop: "车位状态",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		width: 120,
	},
	{
		label: "面积",
		prop: "面积",
		width: 120,
	},
	{
		label: "业主姓名",
		prop: "业主姓名",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "车辆号码",
		prop: "车辆号码",
		width: 120,
	},
	{
		label: "购买日期",
		prop: "购买日期",
		width: 120,
	},
	{
		label: "到期日期",
		prop: "到期日期",
		width: 120,
	},
	{
		label: "月租费用",
		prop: "月租费用",
		width: 120,
	},
	{
		label: "备注",
		prop: "备注",
		minWidth: 150,
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
	title: "车位信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & {
	/** 停车场 Parking lot */
	parkingLot: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus: string;
	/** 车位类型 Parking space type */
	parkingSpaceType: string;
	/** 业主姓名 Owner name */
	ownerName: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 车辆号码 Vehicle number */
	vehicleNumber: string;
} = {
	parkingLot: "",
	parkingSpace: "",
	parkingSpaceStatus: "",
	parkingSpaceType: "",
	ownerName: "",
	contactPhone: "",
	vehicleNumber: "",
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
		label: "停车场",
		prop: "parkingLot",
		valueType: "select",
		options: parkingLotOptions,
	},
	{
		label: "车位编号",
		prop: "parkingSpace",
		valueType: "input",
	},
	{
		label: "车位状态",
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
	},
	{
		label: "车位类型",
		prop: "parkingSpaceType",
		valueType: "select",
		options: parkingSpaceTypeOptions,
	},
	{
		label: "业主姓名",
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		valueType: "input",
	},
	{
		label: "车辆号码",
		prop: "vehicleNumber",
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** TODO: 使用 TanStack Query Hook 替代 mockTableData */
		/** 当前暂时使用空数组，后续接入真实API */
		let filteredData: CarportInfoListItem[] = [];

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.parkingLot) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.parkingLot!));
		}
		if (plusSearchModel.value.parkingSpace) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.parkingSpace!));
		}
		if (plusSearchModel.value.parkingSpaceStatus) {
			filteredData = filteredData.filter((item) => item.status === plusSearchModel.value.parkingSpaceStatus);
		}
		if (plusSearchModel.value.parkingSpaceType) {
			filteredData = filteredData.filter((item) => item.status === plusSearchModel.value.parkingSpaceType);
		}
		if (plusSearchModel.value.ownerName) {
			filteredData = filteredData.filter((item) => item.name?.includes(plusSearchModel.value.ownerName!));
		}
		if (plusSearchModel.value.contactPhone) {
			filteredData = filteredData.filter((item) => item.name?.includes(plusSearchModel.value.contactPhone!));
		}
		if (plusSearchModel.value.vehicleNumber) {
			filteredData = filteredData.filter((item) => item.name?.includes(plusSearchModel.value.vehicleNumber!));
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

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 车位信息表单组件实例 */
const carportInfoFormInstance = ref<InstanceType<typeof CarportInfoForm> | null>(null);

/** 打开弹框 */
function openDialog({ mode, row }: { mode: Mode; row?: CarportInfoListItem }) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车位信息`;

	/** 业务对象 */
	const carportInfoFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: CarportInfoFormProps = {
		form: carportInfoFormVO,
		defaultValues: carportInfoFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(CarportInfoForm, {
				ref: carportInfoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = carportInfoFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportInfoFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await carportInfoFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 生命周期钩子 */
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
