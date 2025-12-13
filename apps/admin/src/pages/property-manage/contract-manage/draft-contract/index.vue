<script lang="ts" setup>
definePage({
	meta: {
		title: "起草合同",
		icon: "mdi:file-edit",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.draftContract"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import ContractDraftForm from "./components/form.vue";
import { 合同草稿表单_VO, type ContractDraftFormProps, defaultForm } from "./components/form";
const contractDraftFormInstance = ref<InstanceType<typeof ContractDraftForm> | null>(null);

/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 表格数据 */
const tableData = ref<合同草稿_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "合同名称",
		prop: "合同名称",
		width: 150,
	},
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
		label: "合同类型",
		prop: "合同类型",
		width: 100,
	},
	{
		label: "经办人",
		prop: "经办人",
		width: 80,
	},
	{
		label: "合同金额",
		prop: "合同金额",
		width: 100,
		align: "right",
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 100,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 100,
	},
	{
		label: "状态",
		prop: "状态",
		width: 80,
		formatter: (row: 合同草稿_列表数据) => {
			const statusMap = {
				草稿: '<span class="text-gray-500">草稿</span>',
				审批中: '<span class="text-blue-500">审批中</span>',
				已生效: '<span class="text-green-500">已生效</span>',
				已终止: '<span class="text-red-500">已终止</span>',
			};
			return statusMap[row.状态] || row.状态;
		},
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
	title: "起草合同信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同类型_列表查询_VO = {
	合同名称: "",
	合同编号: "",
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
	// 合同名称
	{
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
	},

	// 合同编号
	{
		label: "合同编号",
		prop: "合同编号",
		valueType: "input",
	},

	// 合同类型
	{
		label: "合同类型",
		prop: "合同类型",
		valueType: "select",
		options: contractTypeOptionsData,
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
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.合同名称) {
			filteredData = filteredData.filter((item) => item.合同名称.includes(plusSearchModel.value.合同名称!));
		}
		if (plusSearchModel.value.合同编号) {
			filteredData = filteredData.filter((item) => item.合同编号.includes(plusSearchModel.value.合同编号!));
		}
		if (plusSearchModel.value.合同类型) {
			filteredData = filteredData.filter((item) => item.合同类型 === plusSearchModel.value.合同类型);
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

async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 合同草稿_列表数据;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}起草合同`;

	/** 业务对象 */
	const contractDraftFormVO: 合同草稿表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					合同名称: row?.合同名称 || "",
					合同编号: row?.合同编号 || "",
					合同类型: row?.合同类型 || "",
					经办人: row?.经办人 || "",
					合同金额: row?.合同金额 || "",
					开始时间: row?.开始时间 || "",
					结束时间: row?.结束时间 || "",
					// 保留其他表单字段的默认值
					甲方: defaultForm.甲方,
					甲方联系人: defaultForm.甲方联系人,
					甲方联系电话: defaultForm.甲方联系电话,
					乙方: defaultForm.乙方,
					乙方联系人: defaultForm.乙方联系人,
					乙方联系电话: defaultForm.乙方联系电话,
					经办电话: defaultForm.经办电话,
					签订时间: defaultForm.签订时间,
					说明: defaultForm.说明,
					// 保留默认的合同附件数组
					合同附件: cloneDeep(defaultForm.合同附件),
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContractDraftFormProps = {
		form: contractDraftFormVO,
		defaultValues: contractDraftFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(ContractDraftForm, {
				ref: contractDraftFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = contractDraftFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = contractDraftFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					contractDraftFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await contractDraftFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await loadTableData(); // 重新加载数据
					}
				},
			},
		],
	});
}

// 处理打印操作
function handlePrint(row: 合同草稿_列表数据) {
	consola.log("打印合同:", row.合同名称);
	// TODO: 实现打印功能
}

// 处理删除操作
function handleDelete(row: 合同草稿_列表数据) {
	consola.log("删除合同:", row.合同名称);
	// TODO: 实现删除功能
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
					{{ transformI18n($t("property-manage_contract-manage.draft-contract.add")) }}
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
						<ElButton type="info" @click="handlePrint(row)">
							{{ transformI18n($t("property-manage_contract-manage.draft-contract.print")) }}
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
