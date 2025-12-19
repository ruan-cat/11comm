<script lang="ts" setup>
definePage({
	meta: {
		title: "业主车辆",
		icon: "mdi:car",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.ownerVehicle"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type OwnerVehicleFormProps, defaultForm } from "./components/form";
import OwnerVehicleForm from "./components/form.vue";
import { parkingSpaceStatusOptions } from "@01s-11comm/type";
import type { OwnerVehicleListItem } from "@01s-11comm/type";

const OwnerVehicleFormInstance = ref<InstanceType<typeof OwnerVehicleForm> | null>(null);

/** 模式控制 */
const { mode, modeText, setMode, isAdd } = useMode();

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 表格数据 */
const tableData = ref<OwnerVehicleListItem[]>([]);

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** TODO: 使用 TanStack Query Hook 替代 mockTableData */
		/** 当前暂时使用空数组，后续接入真实API */
		let filteredData: OwnerVehicleListItem[] = [];

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.licensePlate) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.licensePlate!));
		}
		if (plusSearchModel.value.parkingSpaceNumber) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.parkingSpaceNumber!));
		}
		if (plusSearchModel.value.parkingSpaceStatus) {
			filteredData = filteredData.filter(
				(item) =>
					item.status ===
					(plusSearchModel.value.parkingSpaceStatus === "1"
						? "正常"
						: plusSearchModel.value.parkingSpaceStatus === "3"
							? "到期"
							: "无车位"),
			);
		}
		if (plusSearchModel.value.ownerName) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.ownerName!));
		}
		if (plusSearchModel.value.contactInfo) {
			filteredData = filteredData.filter((item) => item.remark?.includes(plusSearchModel.value.contactInfo!));
		}
		if (plusSearchModel.value.memberPlateNumber) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.memberPlateNumber!));
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

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "车牌号",
		prop: "车牌号",
		width: 120,
	},
	{
		label: "成员车辆",
		prop: "成员车辆",
		width: 120,
	},
	{
		label: "房屋号",
		prop: "房屋号",
		width: 120,
	},
	{
		label: "车牌类型",
		prop: "车牌类型",
		width: 120,
	},
	{
		label: "车辆类型",
		prop: "车辆类型",
		width: 120,
	},
	{
		label: "颜色",
		prop: "颜色",
		width: 120,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "车位",
		prop: "车位",
		width: 120,
	},
	{
		label: "有效期",
		prop: "有效期",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
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
	title: "业主车辆",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & {
	/** 车牌号 License plate number */
	licensePlate: string;
	/** 车位编号 Parking space number */
	parkingSpaceNumber: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 联系方式 Contact info */
	contactInfo: string;
	/** 成员车牌号 Member plate number */
	memberPlateNumber: string;
} = {
	licensePlate: "",
	parkingSpaceNumber: "",
	parkingSpaceStatus: "",
	ownerName: "",
	contactInfo: "",
	memberPlateNumber: "",
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
	// 车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.plateNumber")),
		prop: "licensePlate",
		valueType: "input",
	},

	// 车位编号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceNumber")),
		prop: "parkingSpaceNumber",
		valueType: "input",
	},

	// 车位状态
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceStatus")),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
	},

	// 业主名称
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},

	// 联系方式
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.phone")),
		prop: "contactInfo",
		valueType: "input",
	},
	// 成员车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.memberPlateNumber")),
		prop: "memberPlateNumber",
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

/** 打开弹框 */
function openDialog({ mode, row }: { mode: Mode; row?: 业主车辆_列表数据 }) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主车辆`;

	/** 业务对象 */
	const 业主车辆表单_VO: 业主车辆表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: OwnerVehicleFormProps = {
		form: 业主车辆表单_VO,
		defaultValues: 业主车辆表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(OwnerVehicleForm, {
				ref: OwnerVehicleFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnerVehicleFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = OwnerVehicleFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					OwnerVehicleFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await OwnerVehicleFormInstance.value?.plusFormInstance?.handleSubmit();
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
