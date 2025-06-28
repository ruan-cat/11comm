<script lang="ts" setup>
definePage({
	meta: {
		title: "合同类型",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.type"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import { getContractList } from "../../../../api/contract";
import { onMounted } from "vue";
import { defaultAddDialogParams } from "@/config/constant";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";

import { type AddFormProps, defaultForm } from "./components/addForm";
import AddForm from "./components/addForm.vue";

const AddFormInstance = ref<InstanceType<typeof AddForm> | null>(null);

interface 合同类型_列表数据 {
	类型名称: string;
	是否审核: string;
	描述: string;
	创建时间: string;
	操作: string;
}

const tableDataItem: 合同类型_列表数据 = {
	类型名称: "类型名称",
	是否审核: "是否审核",
	描述: "描述",
	创建时间: "创建时间",
	操作: "操作",
};

/** 表格数据 */
const tableData = ref<合同类型_列表数据[]>(
	Array(10)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/* 获取合同类型列表数据 */
const getContractListApi = async () => {
	const query = {
		audit: null,
		pageIndex: 1,
		pageSize: 10,
		typeName: null,
	};
	const res = await getContractList(query);
	// 获取表格类型
	tableData.value = res.data.list;
};

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "类型名称",
		prop: "类型名称",
		width: 120,
		fixed: true,
	},
	{
		label: "是否审核",
		prop: "是否审核",
		width: 120,
	},
	{
		label: "描述",
		prop: "描述",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 240,
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
 * 表格搜索栏数据模型
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
interface 合同类型_列表查询_VO {
	合同类型名称?: string;
	审核类型?: string;
}

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
	// 巡检人
	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.contracttypename")),
		prop: "合同类型名称",
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
	console.log("页数变化:", pageSize);
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

// 重新搜索
function handleReSearch() {
	console.log("重新搜索");
}

// 搜索模块
async function handleSearch() {
	console.log("搜索");
}

// 添加合同类型
function onBaseClick() {
	/** 弹框标题 */
	const title = "添加合同类型";

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

// 添加审核人员
function addPeopeleClick() {
	addDialog({
		title: "基础用法",
		contentRenderer: () => h(AddForm),
	});
}

// 挂载完后进行初始化
onMounted(() => {
	// 获取合同类型列表数据
	getContractListApi();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="onBaseClick"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
				<ElButton type="primary" @click="addPeopeleClick">
					{{ transformI18n($t("property-manage_contract-manage.contract-type.addpeople")) }}
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
						<ElButton type="info">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.extent")) }}
						</ElButton>
						<ElButton type="info">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.template")) }}
						</ElButton>
						<ElButton type="warning" @click="addPeopeleClick">
							{{ transformI18n($t("common.buttons.edit")) }}
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
</style>
