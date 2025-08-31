<script lang="ts" setup>
definePage({
	meta: {
		title: "报修设置",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsSetting"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type RepairsSettingFormProps, defaultForm } from "./components/form";
import RepairsSettingForm from "./components/form.vue";

const repairsSettingFormInstance = ref<InstanceType<typeof RepairsSettingForm> | null>(null);

interface 报修设置_列表数据 {
	类型名称: string;
	报修设置类型: string;
	派单方式: string;
	区域: string;
	业主端展示: string;
	通知方式: string;
	是否回访: string;
	创建时间: string;
	状态: string;
	备注: string;
}

const tableDataItem: 报修设置_列表数据 = {
	类型名称: "类型名称",
	报修设置类型: "报修设置类型",
	派单方式: "派单方式",
	区域: "区域",
	业主端展示: "业主端展示",
	通知方式: "通知方式",
	是否回访: "是否回访",
	创建时间: "创建时间",
	状态: "状态",
	备注: "备注",
};

/** 表格数据 */
const tableData = ref<报修设置_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "类型名称",
		prop: "类型名称",
		width: 120,
		fixed: true,
	},
	{
		label: "报修设置类型",
		prop: "报修设置类型",
		width: 120,
	},
	{
		label: "派单方式",
		prop: "派单方式",
		width: 120,
	},
	{
		label: "区域",
		prop: "区域",
		width: 120,
	},
	{
		label: "业主端展示",
		prop: "业主端展示",
		width: 120,
	},
	{
		label: "通知方式",
		prop: "通知方式",
		width: 120,
	},
	{
		label: "是否回访",
		prop: "是否回访",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
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
	title: "报修设置",
	columns: columns.value,
});

interface 报修设置_列表查询_VO {
	类型名称?: string;
	派单方式?: string;
	报修设置类型?: string;
	区域选择?: string;
	是否回访?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报修设置_列表查询_VO = {
	类型名称: "",
	派单方式: "",
	报修设置类型: "",
	区域选择: "",
	是否回访: "",
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
	// 类型名称
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.typeName")),
		prop: "类型名称",
		valueType: "input",
	},

	// 派单方式
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.orderMethod")),
		prop: "派单方式",
		valueType: "select",
		options: [
			{
				label: "是",
				value: "是",
			},
			{
				label: "否",
				value: "否",
			},
		],
	},

	// 报修设置类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairReportingSettingType")),
		prop: "报修设置类型",
		valueType: "input",
	},

	// 区域选择
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.regionalSelection")),
		prop: "区域选择",
		valueType: "input",
	},

	// 是否回访
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.whetherToMakeAReturnVisit")),
		prop: "是否回访",
		valueType: "select",
		options: [
			{
				label: "待审核",
				value: "待审核",
			},
			{
				label: "审核不通过",
				value: "审核不通过",
			},
			{
				label: "装修中",
				value: "装修中",
			},
			{
				label: "待验收",
				value: "待验收",
			},
			{
				label: "验收成功",
				value: "验收成功",
			},
			{
				label: "验收失败",
				value: "验收失败",
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
	row?: 报修设置_列表数据;
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
	const title = `${modeText.value}费用项设置`;

	/** 表单组件需要的props */
	const formProps: RepairsSettingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: RepairsSettingFormProps = {
		form: {
			...defaultForm,
			类型名称: "45",
			设置类型: "维修单",
			派单方式: "指派",
			公共区域: "房屋",
			业主端展示: "是",
			通知方式: "微信",
			回访设置: "回访",
			说明: "",
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
			h(RepairsSettingForm, {
				ref: repairsSettingFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = repairsSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = repairsSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					repairsSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await repairsSettingFormInstance.value.plusFormInstance.handleSubmit();
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="default"> {{ transformI18n($t("propertyManage_repairsManage.repairs.doc")) }} </ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("propertyManage_repairsManage.repairs.add")) }}
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
						<ElButton type="default">
							{{ transformI18n($t("propertyManage_repairsManage.repairs.binding")) }}
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
