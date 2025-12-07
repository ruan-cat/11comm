<script lang="ts" setup>
definePage({
	meta: {
		title: "取消费用",
		icon: "mdi:close-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.cancelFee"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type 取消费用_列表数据,
	type 取消费用_列表查询_VO,
	审核状态Options,
	tableData as allTableData,
} from "./test-data";
import { type CancelFeeFormProps, defaultForm, type 取消费用表单_VO } from "./components/form";
import CancelFeeForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<取消费用_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "批次号",
		prop: "批次号",
		width: 140,
	},
	{
		label: "员工",
		prop: "员工",
		width: 120,
	},
	{
		label: "时间",
		prop: "时间",
		width: 160,
	},
	{
		label: "取消原因",
		prop: "取消原因",
		minWidth: 200,
	},
	{
		label: "审核状态",
		prop: "审核状态",
		width: 120,
	},
	{
		label: "审核意见",
		prop: "审核意见",
		minWidth: 180,
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
	title: "取消费用",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.批次号) {
			filteredData = filteredData.filter((item) => item.批次号.includes(plusSearchModel.value.批次号!));
		}
		if (plusSearchModel.value.员工) {
			filteredData = filteredData.filter((item) => item.员工.includes(plusSearchModel.value.员工!));
		}
		if (plusSearchModel.value.时间) {
			filteredData = filteredData.filter((item) => item.时间.includes(plusSearchModel.value.时间!));
		}
		if (plusSearchModel.value.取消原因) {
			filteredData = filteredData.filter((item) => item.取消原因.includes(plusSearchModel.value.取消原因!));
		}
		if (plusSearchModel.value.审核状态) {
			filteredData = filteredData.filter((item) => item.审核状态 === plusSearchModel.value.审核状态);
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 取消费用_列表查询_VO = {
	批次号: "",
	员工: "",
	时间: "",
	取消原因: "",
	审核状态: "",
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
	// 批次号
	{
		label: "批次号",
		prop: "批次号",
		valueType: "input",
	},

	// 员工
	{
		label: "员工",
		prop: "员工",
		valueType: "input",
	},

	// 时间
	{
		label: "时间",
		prop: "时间",
		valueType: "input",
	},

	// 取消原因
	{
		label: "取消原因",
		prop: "取消原因",
		valueType: "input",
	},

	// 审核状态
	{
		label: "审核状态",
		prop: "审核状态",
		valueType: "select",
		options: 审核状态Options,
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
const cancelFeeFormInstance = ref<InstanceType<typeof CancelFeeForm> | null>(null);
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
function openDialog(params: { mode: Mode; row?: 取消费用_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}取消费用审核`;

	/** 业务对象 */
	const 业务对象: 取消费用表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				批次号: row?.批次号 || "",
				员工: row?.员工 || "",
				时间: row?.时间 || "",
				取消原因: row?.取消原因 || "",
				审核状态: row?.审核状态 || "",
				审核意见: row?.审核意见 || "",
			});

	/** 表单组件需要的props */
	const props: CancelFeeFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(CancelFeeForm, {
				ref: cancelFeeFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = cancelFeeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = cancelFeeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					cancelFeeFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await cancelFeeFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
