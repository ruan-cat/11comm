<script lang="ts" setup>
definePage({
	meta: {
		title: "电话报修",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.phoneReportRepairs"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type PhoneRepairsFormProps, defaultForm } from "./components/form";
import PhoneRepairsForm from "./components/form.vue";

const phoneRepairsFormInstance = ref<InstanceType<typeof PhoneRepairsForm> | null>(null);

interface 电话报修_列表数据 {
	工单编号: string;
	位置: string;
	报修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	超时时间: string;
	提交时间: string;
	状态: string;
	备注: string;
}

const tableDataItem: 电话报修_列表数据 = {
	工单编号: "工单编号",
	位置: "位置",
	报修类型: "报修类型",
	报修人: "报修人",
	联系方式: "联系方式",
	预约时间: "预约时间",
	超时时间: "超时时间",
	提交时间: "提交时间",
	状态: "状态",
	备注: "备注",
};

/** 表格数据 */
const tableData = ref<电话报修_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "工单编号",
		prop: "工单编号",
		width: 120,
		fixed: true,
	},
	{
		label: "位置",
		prop: "位置",
		width: 120,
	},
	{
		label: "报修类型",
		prop: "报修类型",
		width: 120,
	},
	{
		label: "报修人",
		prop: "报修人",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "联系方式",
		width: 120,
	},
	{
		label: "预约时间",
		prop: "预约时间",
		width: 120,
	},
	{
		label: "超时时间",
		prop: "超时时间",
		width: 120,
	},
	{
		label: "提交时间",
		prop: "提交时间",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
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

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "电话报修",
	columns: columns.value,
});

interface 电话报修_列表查询_VO {
	工单编号?: string;
	报修人?: string;
	报修电话?: string;
	报修类型?: string;
	报修状态?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 电话报修_列表查询_VO = {
	工单编号: "",
	报修人: "",
	报修电话: "",
	报修类型: "",
	报修状态: "",
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
	// 工单编号
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.workOrderNumber")),
		prop: "工单编号",
		valueType: "input",
	},

	// 报修人
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairman")),
		prop: "报修人",
		valueType: "input",
	},

	// 报修电话
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairPhone")),
		prop: "报修电话",
		valueType: "input",
	},

	// 报修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairType")),
		prop: "报修类型",
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

	// 报修状态
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairStatus")),
		prop: "报修状态",
		valueType: "select",
		options: [
			{
				label: "状态1",
				value: "状态1",
			},
			{
				label: "状态2",
				value: "状态2",
			},
		],
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

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 电话报修_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
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
	const title = `${modeText.value}电话报修`;

	/** 表单组件需要的props */
	const formProps: PhoneRepairsFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: PhoneRepairsFormProps = {
		form: {
			...defaultForm,
			报修范围: "1",
			报修类型: "1",
			报修人: "",
			联系方式: "",
			预约时间: "",
			报修内容: "",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value
		? formProps
		: {
				form: isEdit.value ? testEditProps.form : cloneDeep(row),
				defaultValues: cloneDeep(row),
			};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(PhoneRepairsForm, {
				ref: phoneRepairsFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = phoneRepairsFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = phoneRepairsFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					phoneRepairsFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await phoneRepairsFormInstance.value.plusFormInstance.handleSubmit();
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
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->
		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("propertyManage_repairsManage.repairs.registration")) }}
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
