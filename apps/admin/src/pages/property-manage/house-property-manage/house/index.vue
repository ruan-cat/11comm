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
import { type HouseManageFormProps, defaultForm } from "./components/form";
import HouseManageForm from "./components/form.vue";
const houseManageFormInstance = ref<InstanceType<typeof HouseManageForm> | null>(null);

/** 表格数据 */
const tableData = ref<房屋管理_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋",
		prop: "房屋",
		width: 120,
	},
	{
		label: "楼层",
		prop: "楼层",
		width: 100,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "类型",
		prop: "类型",
		width: 100,
	},
	{
		label: "房屋面积",
		prop: "房屋面积",
		width: 120,
	},
	{
		label: "租金",
		prop: "租金",
		width: 100,
	},
	{
		label: "房屋状态",
		prop: "房屋状态",
		width: 100,
	},
	{
		label: "有效期",
		prop: "有效期",
		width: 120,
	},
	{
		label: "业主成员",
		prop: "业主成员",
		width: 100,
	},
	{
		label: "业主车辆",
		prop: "业主车辆",
		width: 100,
	},
	{
		label: "业主房屋",
		prop: "业主房屋",
		width: 100,
	},
	{
		label: "投诉",
		prop: "投诉",
		width: 100,
	},
	{
		label: "报修",
		prop: "报修",
		width: 100,
	},
	{
		label: "房屋欠费",
		prop: "房屋欠费",
		width: 100,
	},
	{
		label: "业主欠费",
		prop: "业主欠费",
		width: 100,
	},
	{
		label: "房屋合同",
		prop: "房屋合同",
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
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.房屋编号) {
			filteredData = filteredData.filter((item) => item.房屋.includes(plusSearchModel.value.房屋编号!));
		}
		if (plusSearchModel.value.房屋状态) {
			filteredData = filteredData.filter((item) => item.房屋状态 === plusSearchModel.value.房屋状态);
		}
		if (plusSearchModel.value.房屋类型) {
			filteredData = filteredData.filter((item) => item.类型 === plusSearchModel.value.房屋类型);
		}
		if (plusSearchModel.value.楼栋单元) {
			filteredData = filteredData.filter((item) => item.房屋.includes(plusSearchModel.value.楼栋单元!));
		}

		// 更新总数
		pagination.value.total = filteredData.length;

		// 分页处理
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		// 更新表格配置
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		// TODO: 显示错误提示
	}
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 房屋管理_列表查询_VO = {
	房屋编号: "",
	房屋状态: "",
	房屋类型: "",
	楼栋单元: "",
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
	// 房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 房屋状态
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "房屋状态",
		valueType: "select",
		options: 房屋状态选项,
	},

	// 房屋类型
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.type")),
		prop: "房屋类型",
		valueType: "select",
		options: 房屋类型选项,
	},

	// 楼栋单元
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.unionId")),
		prop: "楼栋单元",
		valueType: "select",
		options: 楼栋单元选项,
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
function openDialog(params: { mode: Mode; row?: 房屋管理_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}房屋管理`;

	/** 业务对象 */
	const 房屋管理表单_VO: 房屋管理表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				房屋: row?.房屋 || "",
				楼层: row?.楼层 || "",
				业主: row?.业主 || "",
				类型: row?.类型 || "",
				房屋面积: row?.房屋面积 || "",
				租金: row?.租金 || "",
				房屋状态: row?.房屋状态 || "",
				有效期: row?.有效期 || "",
			});

	/** 表单组件需要的props */
	const props: HouseManageFormProps = {
		form: 房屋管理表单_VO,
		defaultValues: 房屋管理表单_VO,
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
