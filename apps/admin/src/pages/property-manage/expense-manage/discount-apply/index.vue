<script lang="ts" setup>
definePage({
	meta: {
		title: "优惠申请",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountApply"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type DiscountApplyFormProps, defaultForm } from "./components/form";
import DiscountApplyForm from "./components/form.vue";

const DiscountApplyFormInstance = ref<InstanceType<typeof DiscountApplyForm> | null>(null);

interface 优惠申请_列表数据 {
	"房屋(楼栋-单元-房屋)": string;
	折扣ID: string;
	折扣名称: string;
	申请类型: string;
	申请人: string;
	申请电话: string;
	开始时间: string;
	结束时间: string;
	状态: string;
	创建时间: string;
	使用状态: string;
	返还类型: string;
	返还金额: string;
}

const tableDataItem: 优惠申请_列表数据 = {
	"房屋(楼栋-单元-房屋)": "房屋(楼栋-单元-房屋)",
	折扣ID: "折扣ID",
	折扣名称: "折扣名称",
	申请类型: "申请类型",
	申请人: "申请人",
	申请电话: "申请电话",
	开始时间: "开始时间",
	结束时间: "结束时间",
	状态: "状态",
	创建时间: "创建时间",
	使用状态: "使用状态",
	返还类型: "返还类型",
	返还金额: "返还金额",
};
/** 表格数据 */
const tableData = ref<优惠申请_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
/** 表格配置 */
const columns = ref<TableColumnList>([
	{
		prop: "房屋(楼栋-单元-房屋)",
		label: "房屋(楼栋-单元-房屋)",
		width: 200,
		fixed: true,
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
		// label: transformI18n($t("table.operation")),
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

// 表格组件配置
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

/** 表格搜索栏组件 配置  */
interface 优惠申请_列表查询_VO {
	"房屋(楼栋-单元-房屋)"?: string;
	申请类型?: string;
	使用状态?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 优惠申请_列表查询_VO = {
	"房屋(楼栋-单元-房屋)": "",
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
	// 房屋(楼栋-单元-房屋)
	{
		label: transformI18n($t("propertyManage_expensesManage.discount-apply.houseInfo")),
		prop: "房屋(楼栋-单元-房屋)",
		valueType: "input",
	},
	// 申请类型
	{
		label: transformI18n($t("propertyManage_expensesManage.discount-apply.applyType")),
		prop: "申请类型",
		valueType: "select",
		options: [
			{ label: "123", value: "123" },
			{ label: "空置房", value: "类型1" },
		],
	},
	// 使用状态
	{
		label: transformI18n($t("propertyManage_expensesManage.discount-apply.useStatus")),
		prop: "使用状态",
		valueType: "select",
		options: [
			{ label: "申请验房", value: "申请验房" },
			{ label: "验房通过", value: "验房通过" },
			{ label: "验房不通过", value: "验房不通过" },
			{ label: "审批通过", value: "审批通过" },
			{ label: "审批不通过", value: "审批不通过" },
		],
	},
]);
/** 表格搜索栏 表单配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 220,
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
	row?: 优惠申请_列表数据;
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
	const title = `${modeText.value}优惠申请`;

	/** 表单组件需要的props */
	const formProps: DiscountApplyFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: DiscountApplyFormProps = {
		form: {
			...defaultForm,
			房屋: "楼栋-单元-房屋",
			申请类型: "空置房",
			费用项目: "费用项目",
			申请人: "张三",
			申请电话: "13712345678",
			开始时间: "2025-05-01",
			结束时间: "2025-05-31",
			申请名说明: "折扣名称",
			图片材料: "",
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
					// console.log(options, index, button);
					const formComputed = DiscountApplyFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					DiscountApplyFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
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
</script>

<template>
	<section class="index-root">
		<!-- 表格搜索栏组件 -->
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />
		<!-- {{ plusSearchModel }} -->
		<!-- 表格操作栏和表格组件 -->
		<PureTableBar v-bind="pureTableBarProps">
			<template #buttons>
				<ElButton type="primary">
					{{ transformI18n($t("propertyManage_expensesManage.discount-apply.discountType")) }}
				</ElButton>
				<ElButton type="success" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("propertyManage_expensesManage.discount-apply.phoneApply")) }}
				</ElButton>
				<ElButton type="primary">
					{{ transformI18n($t("propertyManage_expensesManage.discount-apply.export")) }}
				</ElButton>
			</template>
			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					v-bind="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">{{
							transformI18n($t("common.buttons.edit"))
						}}</ElButton>
						<ElButton type="info">{{ transformI18n($t("common.buttons.info")) }}</ElButton>
						<ElButton type="danger">{{ transformI18n($t("common.buttons.del")) }}</ElButton>
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
