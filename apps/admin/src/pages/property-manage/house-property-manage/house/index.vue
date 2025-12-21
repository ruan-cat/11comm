<script lang="ts" setup>
definePage({
	meta: {
		title: "房屋管理",
		icon: "mdi:home-city",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.house"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type HouseManageFormProps, defaultForm, HouseManagementFormVO } from "./components/form";
import HouseManageForm from "./components/form.vue";
import type { HouseListItem, HouseQueryParams } from "@01s-11comm/type";
import { buildingUnitOptions, houseTypeOptions, houseStatusOptions } from "@01s-11comm/type";

const houseManageFormInstance = ref<InstanceType<typeof HouseManageForm> | null>(null);

/** 模拟表格数据 */
const allTableData: HouseListItem[] = [
	{
		houseCode: "A-101",
		floor: "1",
		owner: "张三",
		houseType: "住宅",
		houseArea: "120",
		rent: "3000",
		houseStatus: "已入住",
		validUntil: "2025-12-31",
		ownerMembers: "3",
		ownerVehicles: "1",
		ownerHouses: "1",
		complaints: "0",
		repairs: "2",
		houseArrears: "0",
		ownerArrears: "0",
		houseContract: "有",
	},
	{
		houseCode: "A-102",
		floor: "1",
		owner: "李四",
		houseType: "住宅",
		houseArea: "100",
		rent: "2500",
		houseStatus: "空闲",
		validUntil: "2025-06-30",
		ownerMembers: "0",
		ownerVehicles: "0",
		ownerHouses: "1",
		complaints: "1",
		repairs: "0",
		houseArrears: "500",
		ownerArrears: "500",
		houseContract: "有",
	},
];

/** 表格数据 */
const tableData = ref<HouseListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋",
		prop: "houseCode",
		width: 120,
	},
	{
		label: "楼层",
		prop: "floor",
		width: 100,
	},
	{
		label: "业主",
		prop: "owner",
		width: 120,
	},
	{
		label: "类型",
		prop: "houseType",
		width: 100,
	},
	{
		label: "房屋面积",
		prop: "houseArea",
		width: 120,
	},
	{
		label: "租金",
		prop: "rent",
		width: 100,
	},
	{
		label: "房屋状态",
		prop: "houseStatus",
		width: 100,
	},
	{
		label: "有效期",
		prop: "validUntil",
		width: 120,
	},
	{
		label: "业主成员",
		prop: "ownerMembers",
		width: 100,
	},
	{
		label: "业主车辆",
		prop: "ownerVehicles",
		width: 100,
	},
	{
		label: "业主房屋",
		prop: "ownerHouses",
		width: 100,
	},
	{
		label: "投诉",
		prop: "complaints",
		width: 100,
	},
	{
		label: "报修",
		prop: "repairs",
		width: 100,
	},
	{
		label: "房屋欠费",
		prop: "houseArrears",
		width: 100,
	},
	{
		label: "业主欠费",
		prop: "ownerArrears",
		width: 100,
	},
	{
		label: "房屋合同",
		prop: "houseContract",
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
	title: "房屋管理",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		let filteredData = allTableData;

		if (plusSearchModel.value.houseCode) {
			filteredData = filteredData.filter((item) => item.houseCode.includes(String(plusSearchModel.value.houseCode)));
		}
		if (plusSearchModel.value.houseStatus) {
			filteredData = filteredData.filter((item) => item.houseStatus === plusSearchModel.value.houseStatus);
		}
		if (plusSearchModel.value.houseType) {
			filteredData = filteredData.filter((item) => item.houseType === plusSearchModel.value.houseType);
		}
		if (plusSearchModel.value.buildingUnit) {
			filteredData = filteredData.filter((item) => item.houseCode.includes(String(plusSearchModel.value.buildingUnit)));
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

/** 房屋管理_列表查询_VO */
interface HouseQueryVO {
	houseCode: string;
	houseStatus: string;
	houseType: string;
	buildingUnit: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & HouseQueryVO = {
	houseCode: "",
	houseStatus: "",
	houseType: "",
	buildingUnit: "",
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
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "houseCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "houseStatus",
		valueType: "select",
		options: houseStatusOptions,
	},
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.type")),
		prop: "houseType",
		valueType: "select",
		options: houseTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.unionId")),
		prop: "buildingUnit",
		valueType: "select",
		options: buildingUnitOptions,
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: HouseListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const title = `${modeText.value}房屋管理`;

	const formData: HouseManagementFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				house: row?.houseCode || "",
				floor: row?.floor || "",
				owner: row?.owner || "",
				type: row?.houseType || "",
				houseArea: row?.houseArea || "",
				rent: row?.rent || "",
				houseStatus: row?.houseStatus || "",
				validUntil: row?.validUntil || "",
			});

	const props: HouseManageFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(HouseManageForm, {
				ref: houseManageFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = houseManageFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = houseManageFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					houseManageFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await houseManageFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true; //加载
						await testAsync(); //异步函数
						button.btn.loading = false; //不加载
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
