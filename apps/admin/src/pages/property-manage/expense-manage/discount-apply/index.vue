<script lang="ts" setup>
definePage({
	meta: {
		title: "优惠申请",
		icon: "mdi:percent-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountApply"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import {
	type 优惠申请_列表数据,
	type 优惠申请_列表查询_VO,
	申请类型Options,
	使用状态Options,
	tableData as allTableData,
} from "./test-data";
import { type DiscountApplyFormProps, defaultForm, type 优惠申请表单_VO } from "./components/form";
import DiscountApplyForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<优惠申请_列表数据[]>([]);
/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		prop: "房屋",
		label: "房屋",
		width: 200,
	},
	{
		prop: "折扣ID",
		label: "折扣ID",
		width: 120,
	},
	{
		prop: "折扣名称",
		label: "折扣名称",
		width: 120,
	},
	{
		prop: "申请类型",
		label: "申请类型",
		width: 120,
	},
	{
		prop: "申请人",
		label: "申请人",
		width: 120,
	},
	{
		prop: "申请电话",
		label: "申请电话",
		width: 120,
	},
	{
		prop: "开始时间",
		label: "开始时间",
		width: 120,
	},
	{
		prop: "结束时间",
		label: "结束时间",
		width: 120,
	},
	{
		prop: "状态",
		label: "状态",
		width: 120,
	},
	{
		prop: "创建时间",
		label: "创建时间",
		width: 120,
	},
	{
		prop: "使用状态",
		label: "使用状态",
		width: 120,
	},
	{
		prop: "返还类型",
		label: "返还类型",
		width: 120,
	},
	{
		prop: "返还金额",
		label: "返还金额",
		width: 120,
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
	title: "优惠申请",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 优惠申请_列表查询_VO = {
	房屋: "",
	申请类型: "",
	使用状态: "",
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
	// 房屋
	{
		label: "房屋",
		prop: "房屋",
		valueType: "input",
	},
	// 申请类型
	{
		label: "申请类型",
		prop: "申请类型",
		valueType: "select",
		options: 申请类型Options,
	},
	// 使用状态
	{
		label: "使用状态",
		prop: "使用状态",
		valueType: "select",
		options: 使用状态Options,
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
		if (plusSearchModel.value.房屋) {
			filteredData = filteredData.filter((item) => item.房屋.includes(plusSearchModel.value.房屋!));
		}
		if (plusSearchModel.value.申请类型) {
			filteredData = filteredData.filter((item) => item.申请类型 === plusSearchModel.value.申请类型);
		}
		if (plusSearchModel.value.使用状态) {
			filteredData = filteredData.filter((item) => item.使用状态 === plusSearchModel.value.使用状态);
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
const DiscountApplyFormInstance = ref<InstanceType<typeof DiscountApplyForm> | null>(null);
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
function openDialog(params: { mode: Mode; row?: 优惠申请_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}优惠申请`;

	/** 业务对象 */
	const 业务对象: 优惠申请表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					房屋: row?.房屋 || "",
					申请类型: row?.申请类型 || "空置房",
					费用项目: row?.折扣名称 || "",
					申请人: row?.申请人 || "",
					申请电话: row?.申请电话 || "",
					开始时间: row?.开始时间 || "",
					结束时间: row?.结束时间 || "",
					申请名说明: row?.折扣名称 || "",
					图片材料: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: DiscountApplyFormProps = {
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
			h(DiscountApplyForm, {
				ref: DiscountApplyFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = DiscountApplyFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = DiscountApplyFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					DiscountApplyFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await DiscountApplyFormInstance.value.plusFormInstance.handleSubmit();
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
				<ElButton type="info">
					{{ transformI18n($t("propertyManage_expensesManage.discount-apply.discountType")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("propertyManage_expensesManage.discount-apply.phoneApply")) }}
				</ElButton>
				<ElButton type="info">
					{{ transformI18n($t("propertyManage_expensesManage.discount-apply.export")) }}
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
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="danger">
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
