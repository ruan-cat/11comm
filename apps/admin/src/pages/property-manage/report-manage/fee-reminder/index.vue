<script lang="ts" setup>
definePage({
	meta: {
		// 费用提醒
		title: "property-manage_report-manage.fee-reminder.pageTitle",
		icon: "mdi:bell-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.feeReminder"),
	},
});

import dayjs from "dayjs";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import ExpirationReminders from "./components/Expiration-reminders.vue";
import PrepaymentReminders from "./components/Prepayment-reminders.vue";
import type { ReminderForOverduePaymentsListItem, ReminderForOverduePaymentsQueryParams } from "@01s-11comm/type";
import { expenseItemNameOptions, reminderTypeOptions } from "@01s-11comm/type";
import { useFeeReminderListQuery } from "@/api/property-manage/report-manage/fee-reminder";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_report-manage.fee-reminder.fields.time"))),
		prop: "time",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.expenseItemId")),
		),
		prop: "expenseItemId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.expenseItemName")),
		),
		prop: "expenseItemName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.receivableAmount")),
		),
		prop: "receivableAmount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.community")),
		),
		prop: "小区",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.reminderType")),
		),
		prop: "提醒类型",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.expirationTime")),
		),
		prop: "到期时间",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.fee-reminder.fields.receivableAmount")),
		),
		prop: "应收金额",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_report-manage.fee-reminder.fields.status"))),
		prop: "状态",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.fee-reminder.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & Partial<ReminderForOverduePaymentsQueryParams> = {
	time: "",
	expenseItemId: "",
	expenseItemName: "",
};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

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

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.fee-reminder.search.time")),
		prop: "time",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.fee-reminder.search.expenseItemId")),
		prop: "expenseItemId",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.fee-reminder.search.expenseItemName")),
		prop: "expenseItemName",
		valueType: "select",
		options: expenseItemNameOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_report-manage.fee-reminder.search.reminderType")),
		prop: "提醒类型",
		valueType: "select",
		options: reminderTypeOptions,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
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
				<!-- @vue-ignore -->
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
			{{ transformI18n($t("property-manage_report-manage.fee-reminder.sections.prepaymentReminders")) }}
			<ExpirationReminders />
		</div>
		<div>
			{{ transformI18n($t("property-manage_report-manage.fee-reminder.sections.expirationReminders")) }}
			<PrepaymentReminders />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
