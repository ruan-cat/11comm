<script lang="ts" setup>
definePage({
	meta: {
		// 修改密码
		title: "settingManage.systemManage.changePassword.pageTitle",
		icon: "mdi:key",
		rank: getRouteRank("settingManage.systemManage.changePassword"),
	},
});

import { ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useChangePasswordRecordListQuery } from "@/api/setting-manage/system-manage/change-password";
import type { ChangePasswordRecordListQuery } from "@01s-11comm/type";
import {
	changePasswordRecordDepartmentOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordTypeOptions,
} from "@01s-11comm/type";
import type { FieldValues, PlusColumn } from "plus-pro-components";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const departmentTextMap = computed(() => ({
	物业团队: transformI18n($t("settingManage.systemManage.changePassword.options.departments.property")),
	开发团队: transformI18n($t("settingManage.systemManage.changePassword.options.departments.development")),
	运营团队: transformI18n($t("settingManage.systemManage.changePassword.options.departments.operation")),
	财务部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.finance")),
	客服部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.customer")),
	维修部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.maintenance")),
	安保部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.security")),
	绿化部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.greening")),
	未知部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.unknown")),
}));

const changeTypeTextMap = computed(() => ({
	用户自行修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.selfService")),
	管理员重置: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.adminReset")),
	强制修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.forceChange")),
	首次登录修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.firstLogin")),
	首次设置: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.firstSetup")),
	主动修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.activeChange")),
}));

const statusTextMap = computed(() => ({
	成功: transformI18n($t("settingManage.systemManage.changePassword.options.statuses.success")),
	失败: transformI18n($t("settingManage.systemManage.changePassword.options.statuses.failed")),
	待审核: transformI18n($t("settingManage.systemManage.changePassword.options.statuses.pending")),
}));

function translateDepartmentLabel(value?: string | null) {
	return translateFromRecord(departmentTextMap.value, value);
}

function translateChangeTypeLabel(value?: string | null) {
	return translateFromRecord(changeTypeTextMap.value, value);
}

function translateStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

const translatedDepartmentOptions = computed(() =>
	changePasswordRecordDepartmentOptions.map((item) => ({
		...item,
		label: translateDepartmentLabel(String(item.value)),
	})),
);

const translatedChangeTypeOptions = computed(() =>
	changePasswordRecordTypeOptions.map((item) => ({
		...item,
		label: translateChangeTypeLabel(String(item.value)),
	})),
);

const translatedStatusOptions = computed(() =>
	changePasswordRecordStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const plusSearchModelRef: FieldValues & Partial<ChangePasswordRecordListQuery> = {
	username: "",
	realName: "",
	department: "",
	changeTime: "",
	changeType: "",
	status: "",
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
			transformI18n($t("settingManage.systemManage.changePassword.fields.recordId")),
		),
		prop: "id",
		width: 120,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.username")),
		),
		prop: "username",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.realName")),
		),
		prop: "realName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.department")),
		),
		prop: "department",
		width: 120,
		cellRenderer: ({ row }) => translateDepartmentLabel(row.department),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.changeTime")),
		),
		prop: "changeTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.changeIp")),
		),
		prop: "changeIp",
		width: 130,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.changeType")),
		),
		prop: "changeType",
		width: 140,
		cellRenderer: ({ row }) => translateChangeTypeLabel(row.changeType),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.operator")),
		),
		prop: "operator",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.systemManage.changePassword.fields.status"))),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.systemManage.changePassword.fields.remark"))),
		prop: "remark",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 160,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.systemManage.changePassword.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.username")),
		prop: "username",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.realName")),
		prop: "realName",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.department")),
		prop: "department",
		valueType: "select",
		options: translatedDepartmentOptions.value,
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.changeType")),
		prop: "changeType",
		valueType: "select",
		options: translatedChangeTypeOptions.value,
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.changeTime")),
		prop: "changeTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.changeTimeRange")),
		prop: "changeTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, plusSearchButtonTexts);

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
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation>
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.detail")) }}
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
