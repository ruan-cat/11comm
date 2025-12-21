<script lang="ts" setup>
definePage({
	meta: {
		title: "费用提醒",
		icon: "mdi:bell-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.feeReminder"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import ExpirationReminders from "./components/Expiration-reminders.vue";
import PrepaymentReminders from "./components/Prepayment-reminders.vue";
import type {
	ReminderForOverduePaymentsListItem,
	ReminderForOverduePaymentsQueryParams,
	expenseItemNameOptions,
} from "@01s-11comm/type";
import { useFeeReminderListQuery } from "@/api/property-manage/report-manage/fee-reminder";

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "时间",
		prop: "time",
		width: 120,
	},
	{
		label: "费用项ID",
		prop: "expenseItemId",
		width: 120,
	},
	{
		label: "费用项名称",
		prop: "expenseItemName",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "receivableAmount",
		width: 120,
	},
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "提醒类型",
		prop: "提醒类型",
		minWidth: 140,
	},
	{
		label: "到期时间",
		prop: "到期时间",
		minWidth: 180,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		minWidth: 140,
	},
	{
		label: "状态",
		prop: "状态",
		minWidth: 140,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用提醒",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ReminderForOverduePaymentsQueryParams> = {
	time: "",
	expenseItemId: "",
	expenseItemName: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useFeeReminderListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "时间",
		prop: "time",
		valueType: "input",
	},
	{
		label: "费用项ID",
		prop: "expenseItemId",
		valueType: "input",
	},
	{
		label: "费用项名称",
		prop: "expenseItemName",
		valueType: "select",
		options: expenseItemNameOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "提醒类型",
		prop: "提醒类型",
		valueType: "select",
		options: 提醒类型Options,
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
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="info" @click="doFetch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>

		<div>
			预缴费提醒
			<ExpirationReminders />
		</div>
		<div>
			到期提醒
			<PrepaymentReminders />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
