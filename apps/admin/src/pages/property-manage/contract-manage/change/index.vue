<script lang="ts" setup>
definePage({
	meta: {
		title: "合同变更",
		icon: "mdi:swap-horizontal",
		roles: ["物业团队"],
	},
});

import { ref, computed, onMounted } from "vue";
import { h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";
import { useMode } from "@/composables/use-mode";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { consola } from "consola";

import { type 业务受理_列表数据, type 合同类型_列表查询_VO, tableData as mockTableData } from "./test-data";
import { type AddFormProps, defaultForm } from "./components/addForm";
import AddForm from "./components/addForm.vue";

/** 表单组件实例引用 */
const AddFormInstance = ref<InstanceType<typeof AddForm> | null>(null);

/** 表格数据 */
const tableData = ref<业务受理_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "合同名称",
		prop: "合同名称",
		width: 160,
	},
	{
		label: "合同编号",
		prop: "合同编号",
		width: 140,
	},
	{
		label: "合同类型",
		prop: "合同类型",
		width: 120,
	},
	{
		label: "甲方",
		prop: "甲方",
		width: 140,
	},
	{
		label: "乙方",
		prop: "乙方",
		width: 140,
	},
	{
		label: "变更类型",
		prop: "变更类型",
		width: 120,
	},
	{
		label: "变更人",
		prop: "变更人",
		width: 100,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		width: 160,
	},
	{
		label: "说明",
		prop: "说明",
		width: 200,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
		formatter: (row: 业务受理_列表数据) => {
			const statusMap = {
				待审核: "待审核",
				审核中: "审核中",
				已通过: "已通过",
				已拒绝: "已拒绝",
				已撤回: "已撤回",
			};
			return statusMap[row.状态] || row.状态;
		},
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同变更",
	columns: columns.value,
});

/**
 * 表格搜索栏双向绑定的变量原始数据
 * @description 为了满足搜索栏组件的校验需求这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同类型_列表查询_VO = {
	合同名称: "",
	输入合同编号: "",
	选择合同类型: "",
};

/** 表格搜索栏重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量双向绑定的响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
	},

	{
		label: "输入合同编号",
		prop: "输入合同编号",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.addpeopleplaceholder")),
		prop: "审核类型",
		valueType: "select",
		options: [
			{
				label: "类型1",
				value: "类型1",
			},
			{
				label: "类型2",
				value: "类型2",
			},
		],
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 表格组件配置 */
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

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化即后端的pageIndex */
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
		if (plusSearchModel.value.合同名称) {
			filteredData = filteredData.filter((item) => item.合同名称.includes(plusSearchModel.value.合同名称!));
		}
		if (plusSearchModel.value.输入合同编号) {
			filteredData = filteredData.filter((item) => item.合同编号.includes(plusSearchModel.value.输入合同编号!));
		}
		if (plusSearchModel.value.选择合同类型) {
			filteredData = filteredData.filter((item) => item.合同类型 === plusSearchModel.value.选择合同类型);
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

/** 表格搜索栏组件配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 重新搜索处理函数 */
async function handleReSearch() {
	console.log("重新搜索");
	/** 重置搜索条件并重新加载数据 */
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 搜索处理函数 */
async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	/** 根据搜索条件过滤数据 */
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 打开弹框参数接口 */
interface OpenDialogParams {
	/** 操作模式 */
	mode: Mode;
	/** 行数据 */
	row?: 业务受理_列表数据;
}

/** 模式相关状态管理 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 异步操作加载状态 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 测试异步函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框函数 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同变更`;

	/** 表单组件需要的props */
	const formProps: AddFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
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
			h(AddForm, {
				ref: AddFormInstance,
				...formProps,
				mode: mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = AddFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = AddFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					AddFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await AddFormInstance.value?.plusFormInstance?.handleSubmit();
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
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.subjectChange")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.termadjustment")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.assetchange")) }}
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
							{{ transformI18n($t("property-manage_contract-manage.contract-change.details")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("property-manage_contract-manage.contract-change.cencel")) }}
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
