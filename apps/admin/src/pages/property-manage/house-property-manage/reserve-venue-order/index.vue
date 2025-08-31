<script lang="ts" setup>
definePage({
	meta: {
		title: "场地预约订单",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.reserveVenueOrder"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type ReserveVenueOrderFormProps, defaultForm } from "./components/form";
import ReserveVenueOrderForm from "./components/form.vue";

const reserveVenueOrderFormInstance = ref<InstanceType<typeof ReserveVenueOrderForm> | null>(null);

interface 场地预约订单_列表数据 {
	订单编号: string;
	场馆: string;
	场地: string;
	预约人: string;
	预约电话: string;
	预约日期: string;
	预约时间: string;
	应收金额: string;
	实收金额: string;
	支付方式: string;
	状态: string;
	创建时间: string;
	备注: string;
}

const tableDataItem: 场地预约订单_列表数据 = {
	订单编号: "102025052255590204	",
	场馆: "室内体育馆",
	场地: "羽毛球馆",
	预约人: "张三",
	预约电话: "18909711234",
	预约日期: "2025-05-22",
	预约时间: "11,13,",
	应收金额: "360.00",
	实收金额: "360.00",
	支付方式: "微信",
	状态: "预约成功",
	创建时间: "2025-05-22 00:10:27	",
	备注: "54",
};

/** 表格数据 */
const tableData = ref<场地预约订单_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "订单编号",
		prop: "订单编号",
		width: 120,
		fixed: true,
	},
	{
		label: "场馆",
		prop: "场馆",
		width: 120,
	},
	{
		label: "场地",
		prop: "场地",
		width: 120,
	},
	{
		label: "预约人",
		prop: "预约人",
		width: 120,
	},
	{
		label: "预约电话",
		prop: "预约电话",
		width: 120,
	},
	{
		label: "预约日期",
		prop: "预约日期",
		width: 120,
	},
	{
		label: "预约时间",
		prop: "预约时间",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		width: 120,
	},
	{
		label: "实收金额",
		prop: "实收金额",
		width: 120,
	},
	{
		label: "支付方式",
		prop: "支付方式",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		label: "备注",
		prop: "备注",
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
	title: "场地预约订单",
	columns: columns.value,
});

interface 场地预约订单_列表查询_VO {
	预约时间?: string;
	预约人?: string;
	预约电话?: string;
	选择状态?: string;
	预约场地?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 场地预约订单_列表查询_VO = {
	预约时间: "",
	预约人: "",
	预约电话: "",
	选择状态: "",
	预约场地: "",
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
	// 预约时间
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldTime")),
		prop: "预约时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	// 预约人
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldMan")),
		prop: "预约人",
		valueType: "input",
	},

	// 预约电话
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldPhone")),
		prop: "预约电话",
		valueType: "input",
	},

	// 预约状态
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.orderState")),
		prop: "选择状态",
		valueType: "select",
		options: [
			{
				label: "预约成功",
				value: "预约成功",
			},
			{
				label: "预约失败",
				value: "预约失败",
			},
			{
				label: "待审核",
				value: "待审核",
			},
			{
				label: "待支付",
				value: "待支付",
			},
		],
	},

	// 预约场地
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-order.fieldType")),
		prop: "预约场地",
		valueType: "select",
		options: [
			{
				label: "健身房",
				value: "健身房",
			},

			{
				label: "第三会议室",
				value: "第三会议室",
			},

			{
				label: "高新健身房",
				value: "高新健身房",
			},

			{
				label: "会议室",
				value: "会议室",
			},

			{
				label: "篮球馆",
				value: "篮球馆",
			},

			{
				label: "羽毛球馆",
				value: "羽毛球馆",
			},
			{
				label: "棒球馆",
				value: "棒球馆",
			},
			{
				label: "乒乓球馆",
				value: "乒乓球馆",
			},
		],
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
	showNumber: 5,
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
	row?: 场地预约订单_列表数据;
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
	const title = `${modeText.value}场地预约订单`;

	/** 表单组件需要的props */
	const formProps: ReserveVenueOrderFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: ReserveVenueOrderFormProps = {
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
			h(ReserveVenueOrderForm, {
				ref: reserveVenueOrderFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reserveVenueOrderFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = reserveVenueOrderFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					reserveVenueOrderFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reserveVenueOrderFormInstance.value.plusFormInstance.handleSubmit();
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
