<script lang="ts" setup>
definePage({
	meta: {
		title: "合同收费",
		icon: "mdi:file-document-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.contracteCharge"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { tableData as allTableData, 合同类型Options, type 合同收费_列表数据 } from "./test-data";
import { type ContracteChargeFormProps, defaultForm, type 合同收费表单_VO } from "./components/form";
import ContracteChargeForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<合同收费_列表数据[]>([]);
/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "合同编号",
		prop: "合同编号",
		width: 120,
	},
	{
		label: "父合同编号",
		prop: "父合同编号",
		width: 120,
	},
	{
		label: "合同名称",
		prop: "合同名称",
		width: 120,
	},
	{
		label: "合同类型",
		prop: "合同类型",
		width: 120,
	},
	{
		label: "乙方",
		prop: "乙方",
		width: 120,
	},
	{
		label: "合同金额",
		prop: "合同金额",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 200,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 290,
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
	title: "合同收费",
	columns: columns.value,
});

/** 业务类型定义 */
type 合同收费_列表查询_VO = {
	合同编号?: string;
	合同名称?: string;
	合同类型?: string;
};

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同收费_列表查询_VO = {
	合同编号: "",
	合同名称: "",
	合同类型: "",
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
	// 合同编号
	{
		label: "合同编号",
		prop: "合同编号",
		valueType: "input",
	},

	// 合同名称
	{
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
	},
	// 合同类型
	{
		label: "合同类型",
		prop: "合同类型",
		valueType: "select",
		options: 合同类型Options,
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
		let filteredData = allTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.合同编号) {
			filteredData = filteredData.filter((item) => item.合同编号.includes(plusSearchModel.value.合同编号!));
		}
		if (plusSearchModel.value.合同名称) {
			filteredData = filteredData.filter((item) => item.合同名称.includes(plusSearchModel.value.合同名称!));
		}
		if (plusSearchModel.value.合同类型) {
			filteredData = filteredData.filter((item) => item.合同类型 === plusSearchModel.value.合同类型);
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

// 弹框相关功能
const contracteChargeFormInstance = ref<InstanceType<typeof ContracteChargeForm> | null>(null);
/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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
function openDialog(params: { mode: Mode; row?: 合同收费_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同收费`;

	/** 业务对象 */
	const 业务对象: 合同收费表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					费用类型: "物业费",
					收费项目: row?.合同名称 || "",
					合同状态: "待审核",
					计费起始时间: row?.开始时间 || "",
					计费结束时间: row?.结束时间 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContracteChargeFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(ContracteChargeForm, {
				ref: contracteChargeFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = contracteChargeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = contracteChargeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					contracteChargeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await contracteChargeFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="info"> 缴费 </ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info"> 查看费用 </ElButton>
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
