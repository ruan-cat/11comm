<script lang="ts" setup>
definePage({
	meta: {
		title: "到期合同",
		icon: "mdi:calendar-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.expire"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import {
	type 到期合同_列表数据,
	type 到期合同_列表查询_VO,
	合同类型Options,
	处理状态Options,
	tableData as allTableData,
} from "./test-data";
import { type ContractExpireFormProps, defaultForm, type 合同到期表单_VO } from "./components/form";
import ContractExpireForm from "./components/form.vue";
const contractExpireFormInstance = ref<InstanceType<typeof ContractExpireForm> | null>(null);

/** 表格数据 */
const tableData = ref<到期合同_列表数据[]>([]);

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
		label: "合同金额",
		prop: "合同金额",
		width: 120,
	},
	{
		label: "到期时间",
		prop: "到期时间",
		width: 160,
	},
	{
		label: "处理状态",
		prop: "处理状态",
		width: 100,
		formatter: (row: 到期合同_列表数据) => {
			const statusMap = {
				未处理: "未处理",
				处理中: "处理中",
				已续签: "已续签",
				已终止: "已终止",
				已延期: "已延期",
			};
			return statusMap[row.处理状态] || row.处理状态;
		},
	},
	{
		label: "处理人",
		prop: "处理人",
		width: 100,
	},
	{
		label: "处理时间",
		prop: "处理时间",
		width: 160,
	},
	{
		label: "备注",
		prop: "备注",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "到期合同",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 到期合同_列表查询_VO = {
	合同名称: "",
	输入合同编号: "",
	选择合同类型: "",
	选择处理状态: "",
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
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
	},
	{
		label: "合同编号",
		prop: "输入合同编号",
		valueType: "input",
	},
	{
		label: "合同类型",
		prop: "选择合同类型",
		valueType: "select",
		options: 合同类型Options,
	},
	{
		label: "处理状态",
		prop: "选择处理状态",
		valueType: "select",
		options: 处理状态Options,
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.合同名称) {
			filteredData = filteredData.filter((item) => item.合同名称.includes(plusSearchModel.value.合同名称!));
		}
		if (plusSearchModel.value.输入合同编号) {
			filteredData = filteredData.filter((item) => String(item.合同编号).includes(String(plusSearchModel.value.输入合同编号)));
		}
		if (plusSearchModel.value.选择合同类型) {
			filteredData = filteredData.filter((item) => item.合同类型 === plusSearchModel.value.选择合同类型);
		}
		if (plusSearchModel.value.选择处理状态) {
			filteredData = filteredData.filter((item) => item.处理状态 === plusSearchModel.value.选择处理状态);
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
	row?: 到期合同_列表数据;
}

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
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同到期处理`;

	/** 业务对象 */
	const 合同到期表单 = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					合同名称: row?.合同名称 || "",
					合同编号: row?.合同编号 || "",
					合同类型: row?.合同类型 || "",
					甲方: row?.甲方 || "",
					乙方: row?.乙方 || "",
					甲方联系人: row?.甲方联系人 || "",
					甲方联系电话: row?.甲方联系电话 || "",
					乙方联系人: row?.乙方联系人 || "",
					乙方联系电话: row?.乙方联系电话 || "",
					经办人: row?.经办人 || "",
					经办电话: row?.经办电话 || "",
					合同金额: row?.合同金额 || "",
					开始时间: row?.开始时间 || "",
					结束时间: row?.结束时间 || "",
					签订时间: row?.签订时间 || "",
					到期处理类型: row?.到期处理类型 || "续签",
					处理人: row?.处理人 || "",
					说明: row?.说明 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContractExpireFormProps = {
		form: 合同到期表单 as 合同到期表单_VO,
		defaultValues: 合同到期表单 as 合同到期表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(ContractExpireForm, {
				ref: contractExpireFormInstance,
				form: defaultForm,
				defaultValues: defaultForm,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = contractExpireFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = contractExpireFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					contractExpireFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await contractExpireFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'add', row })">
							续签处理
						</ElButton>
						<ElButton type="danger" @click="openDialog({ mode: 'add', row })">
							终止处理
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
