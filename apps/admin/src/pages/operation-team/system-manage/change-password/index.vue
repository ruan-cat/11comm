<script lang="ts" setup>
definePage({
	meta: {
		// 修改密码记录
		title: "operationTeam.systemManage.changePassword.pageTitle",
		icon: "mdi:lock-reset",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.changePassword"),
	},
});

import { ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ChangePasswordRecordListItem, ChangePasswordRecordQueryParams } from "@01s-11comm/type";
import {
	changeMethodOptions,
	changePasswordStatusOptions,
	changePasswordSuccessOptions,
	departmentOptions,
	userRoleOptions,
} from "@01s-11comm/type";
import { useChangePasswordRecordListQuery } from "@/api/operation-team/system-manage/change-password";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const userRoleTextMap = computed(() => ({
	管理员: transformI18n($t("operationTeam.systemManage.changePassword.options.userRoles.admin")),
	普通用户: transformI18n($t("operationTeam.systemManage.changePassword.options.userRoles.normal")),
	访客: transformI18n($t("operationTeam.systemManage.changePassword.options.userRoles.visitor")),
}));

const departmentTextMap = computed(() => ({
	物业团队: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.property")),
	开发团队: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.development")),
	运营团队: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.operation")),
	财务部门: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.finance")),
	客服部门: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.customer")),
	维修部门: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.maintenance")),
	安保部门: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.security")),
	绿化部门: transformI18n($t("operationTeam.systemManage.changePassword.options.departments.greening")),
}));

const changeMethodTextMap = computed(() => ({
	用户自行修改: transformI18n($t("operationTeam.systemManage.changePassword.options.changeMethods.selfService")),
	管理员重置: transformI18n($t("operationTeam.systemManage.changePassword.options.changeMethods.adminReset")),
	强制修改: transformI18n($t("operationTeam.systemManage.changePassword.options.changeMethods.forceChange")),
	首次登录修改: transformI18n($t("operationTeam.systemManage.changePassword.options.changeMethods.firstLogin")),
}));

const statusTextMap = computed(() => ({
	成功: transformI18n($t("operationTeam.systemManage.changePassword.options.statuses.success")),
	失败: transformI18n($t("operationTeam.systemManage.changePassword.options.statuses.failed")),
	待审核: transformI18n($t("operationTeam.systemManage.changePassword.options.statuses.pending")),
}));

const successTextMap = computed(() => ({
	是: transformI18n($t("operationTeam.systemManage.changePassword.options.successes.yes")),
	否: transformI18n($t("operationTeam.systemManage.changePassword.options.successes.no")),
	Yes: transformI18n($t("operationTeam.systemManage.changePassword.options.successes.yes")),
	No: transformI18n($t("operationTeam.systemManage.changePassword.options.successes.no")),
}));

function translateUserRoleLabel(value?: string | null) {
	return translateFromRecord(userRoleTextMap.value, value);
}

function translateDepartmentLabel(value?: string | null) {
	return translateFromRecord(departmentTextMap.value, value);
}

function translateChangeMethodLabel(value?: string | null) {
	return translateFromRecord(changeMethodTextMap.value, value);
}

function translateStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

function translateSuccessLabel(value?: boolean | string | number | null) {
	if (value === true) {
		return transformI18n($t("operationTeam.systemManage.changePassword.options.successes.yes"));
	}
	if (value === false) {
		return transformI18n($t("operationTeam.systemManage.changePassword.options.successes.no"));
	}
	if (typeof value === "string") {
		return successTextMap.value[value] ?? value;
	}
	return value === null || value === undefined ? "" : String(value);
}

const translatedUserRoleOptions = computed(() =>
	userRoleOptions.map((item) => ({
		...item,
		label: translateUserRoleLabel(String(item.value)),
	})),
);

const translatedDepartmentOptions = computed(() =>
	departmentOptions.map((item) => ({
		...item,
		label: translateDepartmentLabel(String(item.value)),
	})),
);

const translatedChangeMethodOptions = computed(() =>
	changeMethodOptions.map((item) => ({
		...item,
		label: translateChangeMethodLabel(String(item.value)),
	})),
);

const translatedStatusOptions = computed(() =>
	changePasswordStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const translatedSuccessOptions = computed(() =>
	changePasswordSuccessOptions.map((item) => ({
		...item,
		label: translateSuccessLabel(item.value),
	})),
);

const plusSearchModelRef: FieldValues &
	Partial<ChangePasswordRecordQueryParams> & { changeTimeRange: [string, string] } = {
	username: "",
	realName: "",
	userRole: undefined,
	department: undefined,
	changeMethod: undefined,
	status: undefined,
	success: undefined,
	startTime: "",
	endTime: "",
	changeTimeRange: ["", ""],
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
} = useChangePasswordRecordListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.username")),
		),
		prop: "username",
		width: 120,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.realName")),
		),
		prop: "realName",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.userRole")),
		),
		prop: "userRole",
		width: 120,
		cellRenderer: ({ row }) => translateUserRoleLabel(row.userRole),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.department")),
		),
		prop: "department",
		width: 120,
		cellRenderer: ({ row }) => translateDepartmentLabel(row.department),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.changePassword.fields.phone"))),
		prop: "phone",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.changeTime")),
		),
		prop: "changeTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.changeIpAddress")),
		),
		prop: "ipAddress",
		width: 130,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.location")),
		),
		prop: "location",
		minWidth: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.changeMethod")),
		),
		prop: "changeMethod",
		width: 120,
		cellRenderer: ({ row }) => translateChangeMethodLabel(row.changeMethod),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.operationStatus")),
		),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.changePassword.fields.success"))),
		prop: "success",
		width: 100,
		cellRenderer: ({ row }) => translateSuccessLabel(row.success),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.failureReason")),
		),
		prop: "failureReason",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.changePassword.fields.operator")),
		),
		prop: "operator",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 200,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("operationTeam.systemManage.changePassword.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.username")),
		prop: "username",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.realName")),
		prop: "realName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.userRole")),
		prop: "userRole",
		valueType: "select",
		options: translatedUserRoleOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.department")),
		prop: "department",
		valueType: "select",
		options: translatedDepartmentOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.changeMethod")),
		prop: "changeMethod",
		valueType: "select",
		options: translatedChangeMethodOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.operationStatus")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.success")),
		prop: "success",
		valueType: "select",
		options: translatedSuccessOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.changePassword.fields.changeTimeRange")),
		prop: "changeTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.startTime = value?.[0] ?? "";
				plusSearchModel.value.endTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.startTime = "";
				plusSearchModel.value.endTime = "";
			},
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

function viewDetails(row: ChangePasswordRecordListItem) {
	console.log("查看详情", row);
}

function exportRecords() {
	console.log("导出记录");
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
				<ElButton type="primary">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
				<ElButton type="success" @click="exportRecords">
					{{ transformI18n($t("common.buttons.export")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:loading="isFetching"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.detail")) }}
						</ElButton>
						<ElButton type="warning">
							{{ transformI18n($t("common.buttons.edit")) }}
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
