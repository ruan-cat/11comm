<script lang="ts" setup>
definePage({
	meta: {
		/** 系统配置 */
		title: "settingManage.systemManage.systemConfig.pageTitle",
		icon: "mdi:application-cog",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});

import { computed, h, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import {
	createSystemConfig,
	deleteSystemConfig,
	type SystemConfigListQueryParams,
	updateSystemConfig,
	useSystemConfigListQuery,
} from "@/api/setting-manage/system-manage/system-config";
import type { SystemConfigListItem } from "@01s-11comm/type";
import type { SystemConfigFormData, SystemConfigFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import SystemConfigForm from "./components/form.vue";

type SystemConfigRow = SystemConfigListItem & {
	id: string;
	configType?: string | null;
	configDescription?: string | null;
	category?: string | null;
	description?: string | null;
	status?: "enabled" | "disabled" | string | null;
};

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();
const systemConfigFormInstance = ref<InstanceType<typeof SystemConfigForm> | null>(null);

const configTypeOptions = [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.text")),
		value: "text",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.number")),
		value: "number",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.boolean")),
		value: "boolean",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.json")),
		value: "json",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.url")),
		value: "url",
	},
];

const statusOptions = [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.enabled")),
		value: "enabled",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.disabled")),
		value: "disabled",
	},
];

/** 搜索默认值与正式系统配置列表接口参数保持一致，重置时用 cloneDeep 恢复空查询。 */
const plusSearchModelRef: FieldValues & Partial<SystemConfigListQueryParams> = {
	configKey: "",
	configType: "",
	status: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

/** 列表查询接真实接口，搜索模型字段必须与 SystemConfigListQueryParams 保持一致。 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useSystemConfigListQuery(plusSearchDefaultValues);

function translateConfigTypeLabel(value?: string | null) {
	if (value === "text" || value === "文本") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.text"));
	}
	if (value === "number" || value === "数字") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.number"));
	}
	if (value === "boolean" || value === "布尔") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.boolean"));
	}
	if (value === "json" || value === "JSON") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.json"));
	}
	if (value === "url" || value === "URL") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.url"));
	}
	return value || "";
}

function translateStatusLabel(value?: string | null) {
	if (value === "enabled") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.enabled"));
	}
	if (value === "disabled") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.disabled"));
	}
	return value || "";
}

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configId"))),
		prop: "configId",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configKey"))),
		prop: "configKey",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.systemConfig.fields.configValue")),
		),
		prop: "configValue",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType")),
		),
		prop: "configType",
		width: 120,
		cellRenderer: ({ row }) => translateConfigTypeLabel(row.configType ?? row.category),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.systemConfig.fields.description")),
		),
		prop: "configDescription",
		minWidth: 220,
		cellRenderer: ({ row }) => row.configDescription ?? row.description ?? "",
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.status"))),
		prop: "status",
		width: 120,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
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
	title: transformI18n($t("settingManage.systemManage.systemConfig.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configKey")),
		prop: "configKey",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType")),
		prop: "configType",
		valueType: "select",
		options: configTypeOptions,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions,
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

/** 详情/编辑弹窗直接使用列表行作为详情来源，并兼容旧 category/description 字段。 */
function toFormData(row?: Partial<SystemConfigRow>): SystemConfigFormData {
	return {
		...cloneDeep(defaultForm),
		configKey: row?.configKey || "",
		configValue: row?.configValue || "",
		configType: row?.configType ?? row?.category ?? "text",
		configDescription: row?.configDescription ?? row?.description ?? "",
		status: row?.status === "disabled" ? "disabled" : "enabled",
	};
}

/** 从 PlusForm 暴露的 computed 解包并深拷贝，作为 create/update 的提交 payload。 */
function getCurrentSystemConfigFormData(): SystemConfigFormData | undefined {
	const formComputed = systemConfigFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as SystemConfigFormData;
}

/** 统一承载新增、编辑和只读详情弹窗，info 模式只展示详情并隐藏 footer。 */
function openDialog(params: { mode: Mode; row?: SystemConfigRow }) {
	const { mode, row } = params;
	setMode(mode);

	const formData = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	const formProps: SystemConfigFormProps = {
		form: formData,
		defaultValues: cloneDeep(formData),
		mode,
	};

	const title = isAdd.value
		? () => transformI18n($t("operationTeam.systemManage.systemConfig.dialogs.addTitle"))
		: isEdit.value
			? () => transformI18n($t("settingManage.systemManage.systemConfig.dialogs.editTitle"))
			: () => transformI18n($t("operationTeam.systemManage.systemConfig.dialogs.infoTitle"));

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		width: "50%",
		title,
		props: formProps,
		hideFooter: isInfo.value,
		contentRenderer: () =>
			h(SystemConfigForm, {
				ref: systemConfigFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentSystemConfigFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentSystemConfigFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					systemConfigFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (isInfo.value) {
						return;
					}

					const res = await systemConfigFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentSystemConfigFormData();
							if (!formData) {
								return;
							}

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，成功后刷新列表。 */
							if (isAdd.value) {
								await createSystemConfig(formData);
							} else if (isEdit.value && row?.id) {
								await updateSystemConfig({
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

function viewSystemConfigDetails(row: SystemConfigRow) {
	openDialog({
		mode: "info",
		row,
	});
}

function editSystemConfig(row: SystemConfigRow) {
	openDialog({
		mode: "edit",
		row,
	});
}

/** 删除接口只需要后端主键 id，确认框展示配置键仅用于人工识别目标记录。 */
async function deleteSystemConfigRow(row: SystemConfigRow) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.configKey}`,
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

	await deleteSystemConfig({
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
						<ElButton type="info" @click="viewSystemConfigDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editSystemConfig(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteSystemConfigRow(row)">
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
