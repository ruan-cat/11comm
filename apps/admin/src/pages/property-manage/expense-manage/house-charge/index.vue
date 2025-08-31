<script lang="ts" setup>
definePage({
	meta: {
		title: "房屋收费",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.houseCharge"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type HouseChargeFormProps, defaultForm } from "./components/form";
import HouseChargeForm from "./components/form.vue";

const HouseChargeFormInstance = ref<InstanceType<typeof HouseChargeForm> | null>(null);

interface 房屋收费_列表数据 {
	费用项目: string;
	费用标识: string;
	费用类型: string;
	应收金额: String;
	建账时间: string;
	应收时间段: string;
	说明: string;
	状态: string;
}

const tableDataItem: 房屋收费_列表数据 = {
	费用项目: "物业费",
	费用标识: "周期性费用",
	费用类型: "物业费",
	应收金额: "0.1",
	建账时间: "2025-05-22 00:00:00",
	应收时间段: "2026-05-28~",
	说明: "单价：0.0  附加费：500.0",
	状态: "有效",
};

/** 表格数据 */
const tableData = ref<房屋收费_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "费用项目",
		prop: "费用项目",
		width: 120,
		fixed: true,
	},
	{
		label: "费用标识",
		prop: "费用标识",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		width: 120,
	},
	{
		label: "建账时间",
		prop: "建账时间",
		width: 120,
	},
	{
		label: "应收时间段",
		prop: "应收时间段",
		width: 120,
	},
	{
		label: "说明",
		prop: "说明",
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
/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "房屋收费",
	columns: columns.value,
});

interface 房屋收费_列表查询_VO {
	房屋编号?: string;
	业主名称?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 房屋收费_列表查询_VO = {
	房屋编号: "",
	业主名称: "",
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
	// 房屋编号
	{
		label: transformI18n($t("propertyManage_expensesManage.house-charges.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 业主名称
	{
		label: transformI18n($t("propertyManage_expensesManage.house-charges.ownerName")),
		prop: "业主名称",
		valueType: "input",
	},

	// 装修申请开始时间
	// {
	// 	label: transformI18n($t("propertyManage_communityManage.house-decoration.startTimeForDecorationApplication")),
	// 	prop: "装修申请开始时间",
	// 	valueType: "date-picker",
	// 	fieldProps: {
	// 		type: "date",
	// 		valueFormat: "YYYY-MM-DD",
	// 		format: "YYYY-MM-DD",
	// 	},
	// },

	// 装修申请结束时间
	// {
	// 	label: transformI18n($t("propertyManage_communityManage.house-decoration.endTimeForDecorationApplication")),
	// 	prop: "装修申请结束时间",
	// 	valueType: "date-picker",
	// 	fieldProps: {
	// 		type: "date",
	// 		valueFormat: "YYYY-MM-DD",
	// 		format: "YYYY-MM-DD",
	// 	},
	// },
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 2,
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
	row?: 房屋收费_列表数据;
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
	const title = `${modeText.value}房屋收费`;

	/** 表单组件需要的props */
	const formProps: HouseChargeFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: HouseChargeFormProps = {
		form: {
			...defaultForm,
			费用类型: "水费",
			收费项目: "水费历史欠费",
			费用标识: "周期性费用",
			付费类型: "预付费",
			计费单价: "230.1",
			账户抵扣: "是",
			状态: "启用",
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
			h(HouseChargeForm, {
				ref: HouseChargeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = HouseChargeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = HouseChargeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					HouseChargeFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await HouseChargeFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
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
