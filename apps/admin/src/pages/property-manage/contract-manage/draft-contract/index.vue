<script lang="ts" setup>
definePage({
	meta: {
		title: "起草合同",
		icon: "f7:menu",
		roles: ["物业团队"],
	},
});

import { ref, computed, watch, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import AddForm from "./components/addForm.vue";
import { 合同草稿表单_VO, type AddFormProps, defaultForm } from "./components/addForm";

const AddFormInstance = ref<InstanceType<typeof AddForm> | null>(null);

interface 业务受理_列表数据 {
	合同名称: string;
	合同编号: string;
	父合同编号: string;
	合同类型: string;
	经办人: string;
	合同金额: string;
	开始时间: string;
	结束时间: string;
	状态: string;
}

const tableDataItem: 业务受理_列表数据 = {
	合同名称: "合同名称",
	合同编号: "合同编号",
	父合同编号: "父合同编号",
	合同类型: "合同类型",
	经办人: "经办人",
	合同金额: "合同金额",
	开始时间: "开始时间",
	结束时间: "结束时间",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<业务受理_列表数据[]>(
	Array(10)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "合同名称",
		prop: "合同名称",
		width: 90,
		fixed: true,
	},
	{
		label: "合同编号",
		prop: "合同编号",
		width: 90,
	},
	{
		label: "父合同编号",
		prop: "父合同编号",
		width: 100,
	},
	{
		label: "合同类型",
		prop: "合同类型",
		width: 90,
	},
	{
		label: "经办人",
		prop: "经办人",
		width: 70,
	},
	{
		label: "合同金额",
		prop: "合同金额",
		width: 90,
		align: "right",
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 90,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 90,
	},
	{
		label: "状态",
		prop: "状态",
		width: 65,
		formatter: (row: 业务受理_列表数据) => {
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
		label: transformI18n($t("common.table.operation")),
		minWidth: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "起草合同信息",
	columns: columns.value,
});

/**
 * 表格搜索栏数据模型
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
interface 合同类型_列表查询_VO {
	合同名称?: string;
	输入合同编号?: string;
	选择合同类型?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同类型_列表查询_VO = {
	合同名称: "",
	输入合同编号: "",
	选择合同类型: "",
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
	// 巡检人
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
/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
}

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

// 表单数据
const formData = ref<合同草稿表单_VO>(cloneDeep(defaultForm));

// 对话框索引，用于关闭对话框
let dialogIndex = -1;

// 处理表单提交
function handleFormSubmit() {
	console.log("提交表单数据:", formData.value);
	// 这里可以添加表单提交的逻辑
	// 提交成功后关闭对话框
}

// 处理表单重置
function handleFormReset() {
	console.log("重置表单数据");
	// 这里可以添加表单重置的额外逻辑
}

// 处理表单关闭
function handleFormClose() {}

// 编辑合同
function handleEdit(row: 业务受理_列表数据) {
	// 这里应该根据 row 的数据获取完整的合同信息
	// 为了演示，这里使用默认表单并修改部分字段
	formData.value = {
		...cloneDeep(defaultForm),
		合同名称: row.合同名称,
		合同编号: row.合同编号,
		合同类型: row.合同类型,
		经办人: row.经办人,
		合同金额: row.合同金额,
		开始时间: row.开始时间,
		结束时间: row.结束时间, // 保留默认的合同附件数组
		合同附件: cloneDeep(defaultForm.合同附件),
	};
}

function addPeopeleClick() {
	addDialog({
		title: "基础用法",
		contentRenderer: () => h("p", "添加审核人员"),
	});
}

function onBaseClick() {
	/** 弹框标题 */
	const title = "起草合同";

	/** 表单组件需要的props */
	const formProps: AddFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(AddForm, {
				ref: AddFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = AddFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = AddFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					AddFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await AddFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						// 模拟异步操作
						await sleep(1300);
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="onBaseClick">
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
						<ElButton type="warning" @click="onBaseClick"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
						<ElButton type="tag">
							{{ transformI18n($t("property-manage_contract-manage.draft-contract.print")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 20px;
}
</style>
