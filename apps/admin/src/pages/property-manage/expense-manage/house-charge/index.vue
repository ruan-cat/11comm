<script lang="ts" setup>
definePage({
	meta: {
		title: "房屋收费",
		icon: "mdi:home-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.houseCharge"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type HouseChargeFormProps, defaultForm, type 房屋收费_VO } from "./components/form";
import HouseChargeForm from "./components/form.vue";

// 从类型库导入正确的类型
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";
import { statusOptions } from "@01s-11comm/type";

/** 表单组件实例 */
const houseChargeFormInstance = ref<InstanceType<typeof HouseChargeForm> | null>(null);

/** 表格数据 */
const tableData = ref<HouseChargeListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "名称",
		prop: "name",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 180,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 180,
	},
	{
		label: "备注",
		prop: "remark",
		minWidth: 200,
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
	title: "房屋收费",
	columns: columns.value,
});

/** 模拟数据 */
const mockTableData: HouseChargeListItem[] = [
	{
		id: "1",
		name: "物业费",
		status: "启用",
		createTime: "2023-01-01 00:00:00",
		updateTime: "2023-01-01 00:00:00",
		remark: "物业费收费标准",
	},
	{
		id: "2",
		name: "水费",
		status: "启用",
		createTime: "2023-01-01 00:00:00",
		updateTime: "2023-01-01 00:00:00",
		remark: "水费收费标准",
	},
];

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.name) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.name!));
		}
		if (plusSearchModel.value.status) {
			filteredData = filteredData.filter((item) => item.status === plusSearchModel.value.status);
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & HouseChargeQueryParams = {
	name: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
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
	/** 名称 */
	{
		label: "名称",
		prop: "name",
		valueType: "input",
	},

	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: statusOptions,
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
/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: HouseChargeListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}房屋收费`;

	/** 业务对象 */
	const 房屋收费表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? ({
					...defaultForm,
					费用类型: "物业费",
					收费项目: row?.name || "",
					费用标识: "周期性费用",
					付费类型: "预付费",
					"缴费周期(单位:月)": "1",
					"预付期(单位:天)": "30",
					单位: "元/平方米·月",
					账户抵扣: "是",
					手机缴费: "是",
					进位方式: "四舍五入",
					保留小数位: "2位",
					状态: row?.status || "启用",
					计算公式: "",
					计费单价: "",
					固定费用: "",
				} as 房屋收费_VO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: HouseChargeFormProps = {
		form: 房屋收费表单_VO,
		defaultValues: 房屋收费表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,

		contentRenderer: () =>
			h(HouseChargeForm, {
				ref: houseChargeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = houseChargeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = houseChargeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					houseChargeFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await houseChargeFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.info")) }}
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
