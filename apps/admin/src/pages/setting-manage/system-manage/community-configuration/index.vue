<script lang="ts" setup>
definePage({
	meta: {
		/** 小区配置 */
		title: "settingManage.systemManage.communityConfiguration.pageTitle",
		icon: "mdi:cog",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.systemManage.communityConfiguration"),
	},
});

import { computed, h, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	createCommunityConfiguration,
	deleteCommunityConfiguration,
	updateCommunityConfiguration,
	useCommunityConfigurationListQuery,
} from "@/api/setting-manage/system-manage/community-configuration";
import type { SettingManagementCommunityConfigurationListQuery, SmCommunityConfiguration } from "@01s-11comm/type";
import { settingTypeOptions } from "@01s-11comm/type";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import {
	type CommunityConfigurationFormData,
	type CommunityConfigurationFormProps,
	defaultForm,
} from "./components/form";
import CommunityConfigurationForm from "./components/form.vue";

const communityConfigurationFormInstance = ref<InstanceType<typeof CommunityConfigurationForm> | null>(null);
const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const settingTypeTextMap = computed(() => ({
	系统设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.system")),
	业务设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.business")),
	界面设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.ui")),
	功能设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.feature")),
	安全设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.security")),
}));

const statusTextMap = computed(() => ({
	启用: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.enabled")),
	禁用: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.disabled")),
	待审核: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.pending")),
}));

function translateSettingTypeLabel(value?: string | null) {
	return translateFromRecord(settingTypeTextMap.value, value);
}

function translateCommunityStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

const translatedSettingTypeOptions = computed(() =>
	settingTypeOptions.map((item) => ({
		...item,
		label: translateSettingTypeLabel(String(item.value)),
	})),
);

/** 搜索默认值与正式小区配置列表接口参数保持一致，重置时用 cloneDeep 恢复空查询。 */
const plusSearchModelRef: FieldValues & Partial<SettingManagementCommunityConfigurationListQuery> = {
	settingName: "",
	settingType: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

/** 列表查询接真实接口，搜索模型字段必须与 SettingManagementCommunityConfigurationListQuery 保持一致。 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useCommunityConfigurationListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configId"))),
		prop: "csId",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.initializeCell.fields.communityId")),
		),
		prop: "communityId",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.communityName")),
		),
		prop: "communityName",
		width: 150,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName")),
		),
		prop: "settingName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingValue")),
		),
		prop: "settingValue",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType")),
		),
		prop: "settingType",
		width: 120,
		cellRenderer: ({ row }) => translateSettingTypeLabel(row.settingType),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.status")),
		),
		prop: "statusCd",
		width: 100,
		cellRenderer: ({ row }) => translateCommunityStatusLabel(row.statusText || row.statusCd),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.changePassword.fields.operator")),
		),
		prop: "operator",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.remark")),
		),
		prop: "remark",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.communityConfiguration.fields.updateTime")),
		),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.systemManage.communityConfiguration.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName")),
		prop: "settingName",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType")),
		prop: "settingType",
		valueType: "select",
		options: translatedSettingTypeOptions.value,
	},
]);

/** 搜索栏配置由 useI18nConfig 统一注入，模板里单独绑定按钮文案以支持动态切换语言。 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

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
function toFormData(row?: Partial<SmCommunityConfiguration>): CommunityConfigurationFormData {
	return {
		...cloneDeep(defaultForm),
		csId: row?.csId || "",
		communityId: row?.communityId || "",
		communityName: row?.communityName || "",
		settingName: row?.settingName || "",
		settingValue: row?.settingValue || "",
		settingType: row?.settingType || "",
		statusCd: row?.statusCd || "0",
		remark: row?.remark || "",
		operator: row?.operator || "",
	};
}

/** 从 PlusForm 暴露的 computed 解包并深拷贝，作为 create/update 的提交 payload。 */
function getCurrentCommunityConfigurationFormData(): CommunityConfigurationFormData | undefined {
	const formComputed = communityConfigurationFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as CommunityConfigurationFormData;
}

/** 统一承载新增、编辑和只读详情弹窗，info 模式只展示详情并隐藏 footer。 */
function openDialog(params: { mode: Mode; row?: SmCommunityConfiguration }) {
	const { mode, row } = params;
	setMode(mode);

	const formData = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	const formProps: CommunityConfigurationFormProps = {
		form: formData,
		defaultValues: formData,
	};

	const title = isAdd.value
		? () => transformI18n($t("settingManage.systemManage.communityConfiguration.dialogs.addTitle"))
		: isEdit.value
			? () => transformI18n($t("settingManage.systemManage.communityConfiguration.dialogs.editTitle"))
			: () => transformI18n($t("settingManage.systemManage.communityConfiguration.dialogs.infoTitle"));

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		width: "50%",
		title,
		props: formProps,
		hideFooter: isInfo.value,
		contentRenderer: () =>
			h(CommunityConfigurationForm, {
				ref: communityConfigurationFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentCommunityConfigurationFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentCommunityConfigurationFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					communityConfigurationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (isInfo.value) {
						return;
					}

					const res = await communityConfigurationFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentCommunityConfigurationFormData();
							if (!formData) {
								return;
							}

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，成功后刷新列表。 */
							if (isAdd.value) {
								await createCommunityConfiguration(formData);
							} else if (isEdit.value && row?.id) {
								await updateCommunityConfiguration({
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

function viewCommunityConfigurationDetails(row: SmCommunityConfiguration) {
	openDialog({
		mode: "info",
		row,
	});
}

function editCommunityConfiguration(row: SmCommunityConfiguration) {
	openDialog({
		mode: "edit",
		row,
	});
}

/** 删除接口只需要后端主键 id，确认框展示小区名仅用于人工识别目标记录。 */
async function deleteCommunityConfigurationRow(row: SmCommunityConfiguration) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.communityName}`,
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

	await deleteCommunityConfiguration({
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
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
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
						<ElButton type="info" @click="viewCommunityConfigurationDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editCommunityConfiguration(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteCommunityConfigurationRow(row)">
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
