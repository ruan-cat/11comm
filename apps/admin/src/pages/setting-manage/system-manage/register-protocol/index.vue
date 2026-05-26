<script lang="ts" setup>
definePage({
	meta: {
		/** 注册协议 */
		title: "settingManage.systemManage.registerProtocol.pageTitle",
		icon: "mdi:file-document",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.registerProtocol"),
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
	createRegisterProtocol,
	deleteRegisterProtocol,
	updateRegisterProtocol,
	useRegisterProtocolListQuery,
} from "@/api/setting-manage/system-manage/register-protocol";
import type { SettingManagementRegisterProtocolDisplay } from "@01s-11comm/type";
import type { RegisterProtocolFormData, RegisterProtocolFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import RegisterProtocolForm from "./components/form.vue";

type RegisterProtocolRow = SettingManagementRegisterProtocolDisplay & {
	protocolType?: string | null;
	protocolTitle?: string | null;
	protocolContent?: string | null;
};

const { createHeaderRenderer } = useI18nConfig();
const registerProtocolFormInstance = ref<InstanceType<typeof RegisterProtocolForm> | null>(null);

const { tableData, pureTableProps, isFetching, doFetch, handlePageSizeChange, handleCurrentPageChange } =
	useRegisterProtocolListQuery({});

/** 注册协议卡片展示列表首条数据，仍以表格行作为详情/编辑/删除的真实来源。 */
const registerProtocol = computed<SettingManagementRegisterProtocolDisplay>(() => {
	if (tableData.value && tableData.value.length > 0) {
		return tableData.value[0];
	}
	return {
		id: "",
		title: "",
		content: "",
		version: "",
		status: "",
		createTime: "",
		updateTime: "",
	};
});

function translateStatusLabel(value?: string | null) {
	if (value === "enabled") {
		return transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.enabled"));
	}
	if (value === "disabled") {
		return transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.disabled"));
	}
	return value || "";
}

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolName")),
		),
		prop: "title",
		minWidth: 220,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolVersion")),
		),
		prop: "version",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operationTeam.systemManage.registerProtocol.fields.status")),
		),
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
	title: transformI18n($t("settingManage.systemManage.registerProtocol.cardTitle")),
	columns: columns.value,
}));

const { setMode, isAdd, isEdit, isInfo } = useMode();

/** 兼容列表展示字段 title/content 与表单提交字段 protocolTitle/protocolContent 的命名差异。 */
function toFormData(row?: Partial<RegisterProtocolRow>): RegisterProtocolFormData {
	return {
		...cloneDeep(defaultForm),
		protocolType: row?.protocolType || "",
		protocolTitle: row?.protocolTitle || row?.title || "",
		protocolContent: row?.protocolContent || row?.content || "",
		version: row?.version || "",
		status: row?.status || "enabled",
	};
}

/** 从 PlusForm 暴露的 computed 解包并深拷贝，作为 create/update 的提交 payload。 */
function getCurrentRegisterProtocolFormData(): RegisterProtocolFormData | undefined {
	const formComputed = registerProtocolFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as RegisterProtocolFormData;
}

/** 统一承载新增、编辑和只读详情弹窗，info 模式只展示详情并隐藏 footer。 */
function openDialog(params: { mode: Mode; row?: RegisterProtocolRow }) {
	const { mode, row } = params;
	setMode(mode);

	const formData = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	const formProps: RegisterProtocolFormProps = {
		form: formData,
		defaultValues: cloneDeep(formData),
		mode,
	};

	const title = isAdd.value
		? () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.addTitle"))
		: isEdit.value
			? () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.editTitle"))
			: () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.infoTitle"));

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		width: "700px",
		hideFooter: isInfo.value,
		contentRenderer: () =>
			h(RegisterProtocolForm, {
				ref: registerProtocolFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentRegisterProtocolFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentRegisterProtocolFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					registerProtocolFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (isInfo.value) {
						return;
					}

					const res = await registerProtocolFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentRegisterProtocolFormData();
							if (!formData) {
								return;
							}

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，成功后刷新列表和顶部卡片。 */
							if (isAdd.value) {
								await createRegisterProtocol(formData);
							} else if (isEdit.value && row?.id) {
								await updateRegisterProtocol({
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

function viewRegisterProtocolDetails(row: RegisterProtocolRow) {
	openDialog({
		mode: "info",
		row,
	});
}

function editRegisterProtocol(row: RegisterProtocolRow) {
	openDialog({
		mode: "edit",
		row,
	});
}

/** 删除接口只需要后端主键 id，确认框展示协议标题仅用于人工识别目标记录。 */
async function deleteRegisterProtocolRow(row: RegisterProtocolRow) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.title}`,
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

	await deleteRegisterProtocol({
		id: row.id,
	});
	ElMessage.success(transformI18n($t("common.buttons.del")));
	await doFetch();
}
</script>

<template>
	<section class="index-root">
		<ElCard class="box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">
						{{ transformI18n($t("settingManage.systemManage.registerProtocol.cardTitle")) }}
					</span>
				</div>
			</template>
			<div v-loading="isFetching" class="protocol-content">
				<div class="title">{{ registerProtocol.title }}</div>
				<div class="content">{{ registerProtocol.content }}</div>
			</div>
		</ElCard>

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
						<ElButton type="info" @click="viewRegisterProtocolDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editRegisterProtocol(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteRegisterProtocolRow(row)">
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
	padding: 20px;
}

.box-card {
	margin-bottom: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.protocol-content {
	padding: 20px;

	.title {
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20px;
	}

	.content {
		line-height: 1.6;
		white-space: pre-wrap;
	}
}
</style>
