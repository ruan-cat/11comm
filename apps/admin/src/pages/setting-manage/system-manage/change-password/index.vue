<script lang="ts" setup>
definePage({
	meta: {
		/** 修改密码 */
		title: "settingManage.systemManage.changePassword.pageTitle",
		icon: "mdi:key",
		rank: getRouteRank("settingManage.systemManage.changePassword"),
	},
});

import { ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	createChangePasswordRecord,
	deleteChangePasswordRecord,
	updateChangePasswordRecord,
	useChangePasswordRecordListQuery,
} from "@/api/setting-manage/system-manage/change-password";
import type { ChangePasswordRecord, ChangePasswordRecordListQuery } from "@01s-11comm/type";
import {
	changePasswordRecordDepartmentOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordTypeOptions,
} from "@01s-11comm/type";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { type ChangePasswordRecordFormData, type ChangePasswordRecordFormProps, defaultForm } from "./components/form";
import ChangePasswordRecordForm from "./components/form.vue";

const changePasswordRecordFormInstance = ref<InstanceType<typeof ChangePasswordRecordForm> | null>(null);
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

/** 搜索默认值与正式密码修改记录列表接口参数保持一致，包含单点时间和时间范围。 */
const plusSearchModelRef: FieldValues & Partial<ChangePasswordRecordListQuery> = {
	username: "",
	realName: "",
	department: "",
	changeTime: "",
	changeType: "",
	status: "",
	changeTimeRange: ["", ""],
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

/** 列表查询接真实接口，搜索模型字段必须与 ChangePasswordRecordListQuery 保持一致。 */
const {
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

/** 搜索栏结构和按钮文案统一由 useI18nConfig 驱动，避免语言切换后按钮文案不刷新。 */
const plusSearchProps = searchProps(plusSearchDefaultValues, plusSearchButtonTexts);

/** 重置搜索时同时清空本地模型和 query hook 参数，避免旧条件继续请求正式接口。 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 搜索统一回到第一页，再把 PlusSearch 当前模型传给正式列表 hook。 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { setMode, isAdd, isEdit, isInfo } = useMode();

/** 详情/编辑弹窗直接使用列表行作为详情来源，只挑选表单允许提交的字段。 */
function toFormData(row?: Partial<ChangePasswordRecord>): ChangePasswordRecordFormData {
	return {
		...cloneDeep(defaultForm),
		username: row?.username || "",
		realName: row?.realName || "",
		department: row?.department || "",
		changeTime: row?.changeTime || "",
		changeIp: row?.changeIp || "",
		changeType: row?.changeType || "",
		operator: row?.operator || "",
		status: row?.status || "",
		remark: row?.remark || "",
	};
}

function getDialogTitle() {
	if (isAdd.value) {
		return transformI18n($t("common.buttons.add"));
	}
	if (isEdit.value) {
		return transformI18n($t("common.buttons.edit"));
	}
	return transformI18n($t("common.buttons.info"));
}

/** 从 PlusForm 暴露的 computed 解包并深拷贝，作为 create/update 的提交 payload。 */
function getCurrentChangePasswordRecordFormData(): ChangePasswordRecordFormData | undefined {
	const formComputed = changePasswordRecordFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as ChangePasswordRecordFormData;
}

/** 统一承载新增、编辑和只读详情弹窗，info 模式只展示详情并隐藏 footer。 */
function openDialog(params: { mode: Mode; row?: ChangePasswordRecord }) {
	const { mode, row } = params;
	setMode(mode);

	const formData = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	const props: ChangePasswordRecordFormProps = {
		form: formData,
		defaultValues: formData,
	};
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: getDialogTitle,
		props,
		hideFooter: isInfo.value,
		contentRenderer: () =>
			h(ChangePasswordRecordForm, {
				ref: changePasswordRecordFormInstance,
				...props,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentChangePasswordRecordFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentChangePasswordRecordFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					changePasswordRecordFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (isInfo.value) {
						return;
					}

					const res = await changePasswordRecordFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentChangePasswordRecordFormData();
							if (!formData) {
								return;
							}

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，成功后刷新列表。 */
							if (isAdd.value) {
								await createChangePasswordRecord(formData);
							} else if (isEdit.value && row?.id) {
								await updateChangePasswordRecord({
									id: row.id,
									...formData,
								});
							}
							closeDialog(options, index);
							await doFetch();
						} finally {
							if (button.btn) {
								button.btn.loading = false;
							}
						}
					}
				},
			},
		],
	});
}

function viewChangePasswordRecordDetails(row: ChangePasswordRecord) {
	openDialog({
		mode: "info",
		row,
	});
}

function editChangePasswordRecord(row: ChangePasswordRecord) {
	openDialog({
		mode: "edit",
		row,
	});
}

/** 删除接口只需要后端主键 id，确认框展示用户名仅用于人工识别目标记录。 */
async function deleteChangePasswordRecordRow(row: ChangePasswordRecord) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.username}`,
			transformI18n($t("common.buttons.del")),
			{
				type: "warning",
				confirmButtonText: transformI18n($t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
			},
		);
	} catch {
		return;
	}

	await deleteChangePasswordRecord({
		id: row.id,
	});
	ElMessage.success(transformI18n($t("common.buttons.del")));
	await doFetch();
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
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="viewChangePasswordRecordDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editChangePasswordRecord(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteChangePasswordRecordRow(row)">
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
