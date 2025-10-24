<script lang="ts" setup>
definePage({
	meta: {
		title: "合同类型",
		icon: "carbon:category",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.type"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";
import { useMode, type Mode } from "@/composables/use-mode";

/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();
import {
	type 合同类型_列表数据,
	type 合同类型_列表查询_VO,
	审核类型Options,
	tableData as mockTableData,
} from "./test-data";

import { type AddFormProps, defaultForm, type 合同类型表单_VO } from "./components/form";
import AddForm from "./components/form.vue";

const addFormInstance = ref<InstanceType<typeof AddForm> | null>(null);

/** 表格数据 */
const tableData = ref<合同类型_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "类型名称",
		prop: "类型名称",
		width: 120,
	},
	{
		label: "是否审核",
		prop: "是否审核",
		width: 120,
	},
	{
		label: "描述",
		prop: "描述",
		minWidth: 200,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 360,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同类型",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同类型_列表查询_VO = {
	合同类型名称: "",
	审核类型: "",
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
	/** 合同类型名称 */
	{
		label: "合同类型名称",
		prop: "合同类型名称",
		valueType: "input",
	},
	/** 审核类型 */
	{
		label: "审核类型",
		prop: "审核类型",
		valueType: "select",
		options: 审核类型Options,
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
});

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.合同类型名称) {
			filteredData = filteredData.filter((item) => item.类型名称.includes(plusSearchModel.value.合同类型名称!));
		}
		if (plusSearchModel.value.审核类型) {
			filteredData = filteredData.filter((item) => item.是否审核 === plusSearchModel.value.审核类型);
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

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

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
function openDialog(params: { mode: Mode; row?: 合同类型_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同类型`;

	/** 业务对象 */
	const 合同类型表单_VO: 合同类型表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					类型名称: row?.类型名称 || "",
					是否审核: row?.是否审核 === "是" ? "是" : "否",
					描述: row?.描述 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: AddFormProps = {
		form: 合同类型表单_VO,
		defaultValues: 合同类型表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(AddForm, {
				ref: addFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = addFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = addFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					addFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await addFormInstance.value.plusFormInstance.handleSubmit();
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

/** 删除合同类型 */
function handleDelete(row: 合同类型_列表数据) {
	consola.log("删除合同类型:", row.类型名称);
}

/** 查看合同模板 */
function handleViewTemplate(row: 合同类型_列表数据) {
	consola.log("查看合同模板:", row.类型名称);
}

/** 扩展功能 */
function handleExtend(row: 合同类型_列表数据) {
	consola.log("扩展功能:", row.类型名称);
}

/** 添加审核人员 */
function addAuditPeople() {
	consola.log("添加审核人员");
}

/** 挂载完后进行初始化 */
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
				<ElButton type="primary" @click="addAuditPeople"> 添加审核人员 </ElButton>
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
						<ElButton type="info" @click="handleExtend(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.extent")) }}
						</ElButton>
						<ElButton type="info" @click="handleViewTemplate(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.template")) }}
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
