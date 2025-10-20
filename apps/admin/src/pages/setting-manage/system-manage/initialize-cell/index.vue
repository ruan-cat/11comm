<script lang="ts" setup>
definePage({
	meta: {
		title: "初始化小区",
		icon: "mdi:home-import-outline",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.initializeCell"),
	},
});

import { ref, computed, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 初始化小区_列表数据, type 初始化小区_列表查询_VO, tableData as mockTableData } from "./test-data";

import { type FormatFormProps, defaultForm } from "./components/format-form";
import FormatForm from "./components/format-form.vue";

const formatFormInstance = ref<InstanceType<typeof FormatForm> | null>(null);

/** 表格数据 */
const tableData = ref<初始化小区_列表数据[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "小区ID",
		prop: "小区ID",
		minWidth: 120,
	},
	{
		label: "小区名称",
		prop: "小区名称",
		minWidth: 150,
	},
	{
		label: "附近地标",
		prop: "附近地标",
		width: 150,
	},
	{
		label: "城市编码",
		prop: "城市编码",
		width: 200,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		label: transformI18n($t("common.table.operation")),
		width: 120,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: tableData.value.length,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	/** 做异步接口请求 */
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	/** 做异步接口请求 */
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "初始化小区",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 初始化小区_列表查询_VO = {
	小区ID: "",
	小区名称: "",
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
	// 小区ID
	{
		label: "小区ID",
		prop: "小区ID",
		valueType: "input",
	},

	// 小区名称
	{
		label: "小区名称",
		prop: "小区名称",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/**
 * 重新搜索
 */
async function handleReSearch() {
	console.log("重新搜索");
	/** 重置搜索条件并重新加载数据 */
	pagination.value.currentPage = 1;
}

/**
 * 搜索
 */
async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	/** 根据搜索条件过滤数据 */
	pagination.value.currentPage = 1;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);

/**
 * 测试异步函数
 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/**
 * 打开格式化确认弹框
 */
function openFormatDialog(row: 初始化小区_列表数据) {
	/** 弹框标题 */
	const title = "温馨提示！";

	/** 表单组件需要的props */
	const formProps: FormatFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
		小区ID: row.小区ID,
		小区名称: row.小区名称,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		width: "500px",

		contentRenderer: () =>
			h(FormatForm, {
				ref: formatFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = formatFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: "点错了",
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = formatFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: "确认格式化",
				type: "danger",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await formatFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						/** 这里可以添加实际的格式化逻辑 */
						consola.success("格式化操作完成！");
					}
				},
			},
		],
	});
}

/**
 * 格式化操作
 */
function handleFormat(row: 初始化小区_列表数据) {
	console.log("格式化操作", row);
	openFormatDialog(row);
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<!-- 预留按钮插槽 -->
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
						<ElButton type="info" @click="handleFormat(row)"> 格式化 </ElButton>
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
