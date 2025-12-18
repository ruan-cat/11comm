<script lang="ts" setup>
definePage({
	meta: {
		title: "初始化小区",
		icon: "mdi:home-import-outline",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.initializeCell"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { type InitializeCellFormProps, defaultForm } from "./components/form";
import InitializeCellForm from "./components/form.vue";

import { type FormatFormProps, defaultForm as formatDefaultForm } from "./components/format-form";
import FormatForm from "./components/format-form.vue";

const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);
const formatFormInstance = ref<InstanceType<typeof FormatForm> | null>(null);

/** 表格数据 */
const tableData = ref<初始化小区_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区ID",
		prop: "小区ID",
		width: 120,
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
		headerRenderer: () => transformI18n($t("common.table.operation")),
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.小区ID) {
			filteredData = filteredData.filter((item) => item.小区ID.includes(plusSearchModel.value.小区ID!));
		}
		if (plusSearchModel.value.小区名称) {
			filteredData = filteredData.filter((item) => item.小区名称.includes(plusSearchModel.value.小区名称!));
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

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);

/**
 * 测试异步函数
 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/**
 * 打开弹框
 */
function openDialog(params: { mode: Mode; row?: 初始化小区_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);
	/** 弹框标题 */
	const title = `${modeText.value}初始化小区`;
	/** 业务对象 */
	const 初始化小区表单: 初始化小区表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					小区ID: row?.小区ID || "",
					小区名称: row?.小区名称 || "",
					附近地标: row?.附近地标 || "",
					城市编码: row?.城市编码 || "",
					状态: row?.状态 || "",
				})
			: cloneDeep({
					...defaultForm,
					小区ID: row?.小区ID || "",
					小区名称: row?.小区名称 || "",
					附近地标: row?.附近地标 || "",
					城市编码: row?.城市编码 || "",
					状态: row?.状态 || "",
				});
	/** 表单组件需要的props */
	const formProps: InitializeCellFormProps = {
		form: 初始化小区表单,
		defaultValues: 初始化小区表单,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		width: "600px",

		contentRenderer: () =>
			h(InitializeCellForm, {
				ref: initializeCellFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = initializeCellFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = initializeCellFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
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
					/** 提交表单时 校验 */
					const res = await initializeCellFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await loadTableData();
						consola.success("操作成功！");
					}
				},
			},
		],
	});
}

/**
 * 打开格式化确认弹框
 */
function openFormatDialog(row: 初始化小区_列表数据) {
	/** 弹框标题 */
	const title = "温馨提示！";

	/** 表单组件需要的props */
	const formProps: FormatFormProps = {
		form: cloneDeep(formatDefaultForm),
		defaultValues: cloneDeep(formatDefaultForm),
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							查看
						</ElButton>
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
