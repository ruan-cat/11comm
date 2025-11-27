<script lang="ts" setup>
definePage({
	meta: {
		title: "初始化单元格",
		icon: "mdi:home-import-outline",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.initializeCell"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type 初始化单元格_列表数据, type 初始化单元格_列表查询_VO, tableData as mockTableData } from "./test-data";
import {
	type InitializeCellFormProps,
	defaultForm,
	type 初始化单元格表单_VO,
	单元格类型Options,
	状态Options,
} from "./components/form";
import InitializeCellForm from "./components/form.vue";

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 弹框组件实例 */
const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);

/** 表格数据 */
const tableData = ref<初始化单元格_列表数据[]>([]);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "单元格ID",
		prop: "单元格ID",
		width: 120,
	},
	{
		label: "单元格名称",
		prop: "单元格名称",
		minWidth: 160,
	},
	{
		label: "单元格类型",
		prop: "单元格类型",
		width: 120,
	},
	{
		label: "建筑物名称",
		prop: "建筑物名称",
		minWidth: 140,
	},
	{
		label: "楼层",
		prop: "楼层",
		width: 120,
	},
	{
		label: "单元号",
		prop: "单元号",
		width: 100,
	},
	{
		label: "户数",
		prop: "户数",
		width: 80,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "描述",
		prop: "描述",
		minWidth: 200,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "更新时间",
		width: 160,
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
	title: "初始化单元格",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 初始化单元格_列表查询_VO = {
	单元格名称: "",
	单元格类型: "",
	建筑物名称: "",
	状态: "",
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
	/** 单元格名称 */
	{
		label: "单元格名称",
		prop: "单元格名称",
		valueType: "input",
	},

	/** 单元格类型 */
	{
		label: "单元格类型",
		prop: "单元格类型",
		valueType: "select",
		options: 单元格类型Options,
	},

	/** 建筑物名称 */
	{
		label: "建筑物名称",
		prop: "建筑物名称",
		valueType: "input",
	},

	/** 状态 */
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 初始化单元格_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 初始化单元格表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? cloneDeep({
					...defaultForm,
					单元格名称: row?.单元格名称 || "",
					单元格类型: (row?.单元格类型 || "住宅单元") as
						| "住宅单元"
						| "商业单元"
						| "车库单元"
						| "办公单元"
						| "会所单元"
						| "物业单元"
						| "运动单元"
						| "教育单元"
						| "医疗单元"
						| "仓储单元"
						| "文化单元",
					建筑物ID: row?.建筑物ID || "",
					建筑物名称: row?.建筑物名称 || "",
					楼层: row?.楼层 || "",
					单元号: row?.单元号 || "",
					户数: row?.户数 || 0,
					状态: (row?.状态 || "未初始化") as "已初始化" | "未初始化" | "初始化中" | "初始化失败",
					描述: row?.描述 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: InitializeCellFormProps = {
		form: 初始化单元格表单_VO,
		defaultValues: 初始化单元格表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 弹框标题 */
	const title = `${modeText.value}初始化单元格`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(InitializeCellForm, {
				ref: initializeCellFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = initializeCellFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = initializeCellFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					initializeCellFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await initializeCellFormInstance.value.plusFormInstance.handleSubmit();
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.单元格名称) {
			filteredData = filteredData.filter((item) => item.单元格名称.includes(plusSearchModel.value.单元格名称!));
		}
		if (plusSearchModel.value.单元格类型) {
			filteredData = filteredData.filter((item) => item.单元格类型 === plusSearchModel.value.单元格类型);
		}
		if (plusSearchModel.value.建筑物名称) {
			filteredData = filteredData.filter((item) => item.建筑物名称.includes(plusSearchModel.value.建筑物名称!));
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
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

/** 删除初始化单元格 */
async function handleDelete(row: 初始化单元格_列表数据) {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟删除操作 */
		consola.log("删除初始化单元格:", row.单元格ID);

		/** 模拟异步操作 */
		await sleep(1000);

		/** 重新加载数据 */
		await loadTableData();
	} catch (error) {
		console.error("删除失败:", error);
		/** TODO: 显示错误提示 */
	}
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
