<script lang="ts" setup>
definePage({
	meta: {
		/** 初始化小区 */
		title: "settingManage.systemManage.initializeCell.pageTitle",
		icon: "mdi:home-import-outline",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.initializeCell"),
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
	createInitializeCell,
	deleteInitializeCell,
	updateInitializeCell,
	useInitializeCommunityListQuery,
} from "@/api/setting-manage/system-manage/initialize-cell";
import type { InitializeCommunityListItem, InitializeCommunityQueryParams } from "@01s-11comm/type";
import { type FormatFormProps, defaultForm as formatDefaultForm } from "./components/format-form";
import FormatForm from "./components/format-form.vue";
import { type InitializeCellFormData, type InitializeCommunityFormProps, defaultForm } from "./components/form";
import InitializeCellForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();
const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);
const formatFormInstance = ref<InstanceType<typeof FormatForm> | null>(null);

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const initItemTextMap = computed(() => ({
	初始化楼栋: transformI18n($t("settingManage.systemManage.initializeCell.options.items.building")),
	初始化房屋: transformI18n($t("settingManage.systemManage.initializeCell.options.items.house")),
	初始化车位: transformI18n($t("settingManage.systemManage.initializeCell.options.items.parking")),
}));

const initStatusTextMap = computed(() => ({
	已完成: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.completed")),
	初始化中: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.inProgress")),
	待初始化: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.pending")),
}));

function translateInitItemLabel(value?: string | null) {
	return translateFromRecord(initItemTextMap.value, value);
}

function translateInitStatusLabel(value?: string | null) {
	return translateFromRecord(initStatusTextMap.value, value);
}

const translatedInitItemOptions = computed(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.items.building")),
		value: "初始化楼栋",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.items.house")),
		value: "初始化房屋",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.items.parking")),
		value: "初始化车位",
	},
]);

const translatedInitStatusOptions = computed(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.pending")),
		value: "待初始化",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.inProgress")),
		value: "初始化中",
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.completed")),
		value: "已完成",
	},
]);

/** 搜索默认值与正式初始化小区列表接口参数保持一致，重置时用 cloneDeep 恢复空查询。 */
const plusSearchModelRef: FieldValues & Partial<InitializeCommunityQueryParams> = {
	initItem: "",
	initStatus: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

/** 列表查询接真实接口，搜索模型字段必须与 InitializeCommunityQueryParams 保持一致。 */
const {
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useInitializeCommunityListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.initializeCell.fields.initItem")),
		),
		prop: "initItem",
		minWidth: 150,
		cellRenderer: ({ row }) => translateInitItemLabel(row.initItem),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.initializeCell.fields.initStatus")),
		),
		prop: "initStatus",
		width: 120,
		cellRenderer: ({ row }) => translateInitStatusLabel(row.initStatus),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.systemManage.initializeCell.fields.configParams")),
		),
		prop: "configParams",
		minWidth: 220,
		cellRenderer: ({ row }) => stringifyConfigParams(row.configParams),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 300,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.systemManage.initializeCell.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.initItem")),
		prop: "initItem",
		valueType: "select",
		options: translatedInitItemOptions.value,
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.initStatus")),
		prop: "initStatus",
		valueType: "select",
		options: translatedInitStatusOptions.value,
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

/** 后端 configParams 可能是对象，弹窗详情/编辑时统一转成 textarea 可编辑的 JSON 字符串。 */
function stringifyConfigParams(value: unknown) {
	if (value === undefined || value === null || value === "") {
		return "{}";
	}
	if (typeof value === "string") {
		return value;
	}
	return JSON.stringify(value, null, 2);
}

/** 提交前把 textarea 字符串还原为接口需要的 JSON 值，空字符串不传 configParams。 */
function parseConfigParams(value: string) {
	const trimmedValue = value.trim();
	if (!trimmedValue) {
		return undefined;
	}
	return JSON.parse(trimmedValue);
}

/** 详情/编辑弹窗直接使用列表行作为详情来源，只挑选表单允许提交的字段。 */
function toFormData(row?: Partial<InitializeCommunityListItem>): InitializeCellFormData {
	return {
		...cloneDeep(defaultForm),
		initItem: row?.initItem || "",
		initStatus: row?.initStatus || "",
		configParams: stringifyConfigParams(row?.configParams),
	};
}

/** 从 PlusForm 暴露的 computed 解包并深拷贝，作为 create/update 前的表单快照。 */
function getCurrentInitializeCellFormData(): InitializeCellFormData | undefined {
	const formComputed = initializeCellFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as InitializeCellFormData;
}

/** CUD 接口 payload 使用解析后的 configParams，不能把 textarea 字符串直接提交给后端。 */
function toMutationPayload(formData: InitializeCellFormData) {
	return {
		initItem: formData.initItem,
		initStatus: formData.initStatus,
		configParams: parseConfigParams(formData.configParams),
	};
}

/** 统一承载新增、编辑和只读详情弹窗，info 模式只展示详情并隐藏 footer。 */
function openDialog(params: { mode: Mode; row?: InitializeCommunityListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const resolvedForm = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	const formProps: InitializeCommunityFormProps = {
		form: resolvedForm,
		defaultValues: cloneDeep(resolvedForm),
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
		width: "600px",
		hideFooter: isInfo.value,
		contentRenderer: () =>
			h(InitializeCellForm, {
				ref: initializeCellFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentInitializeCellFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentInitializeCellFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					initializeCellFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (isInfo.value) {
						return;
					}

					const res = await initializeCellFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentInitializeCellFormData();
							if (!formData) {
								return;
							}
							const payload = toMutationPayload(formData);

							/** 新增/编辑都使用解析后的 configParams，成功后关闭弹窗并刷新列表。 */
							if (isAdd.value) {
								await createInitializeCell(payload);
							} else if (isEdit.value && row?.id) {
								await updateInitializeCell({
									id: row.id,
									...formData,
									...payload,
								});
							}
							closeDialog(options, index);
							await doFetch();
						} catch (error) {
							ElMessage.error(error instanceof SyntaxError ? "configParams JSON 格式无效" : String(error));
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

function viewInitializeCellDetails(row: InitializeCommunityListItem) {
	openDialog({
		mode: "info",
		row,
	});
}

function editInitializeCell(row: InitializeCommunityListItem) {
	openDialog({
		mode: "edit",
		row,
	});
}

/** 删除接口只需要后端主键 id，确认框展示初始化项目仅用于人工识别目标记录。 */
async function deleteInitializeCellRow(row: InitializeCommunityListItem) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.initItem}`,
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

	await deleteInitializeCell({
		id: row.id,
	});
	ElMessage.success(transformI18n($t("common.buttons.del")));
	await doFetch();
}

function openFormatDialog(row: InitializeCommunityListItem) {
	/** 格式化弹窗只做二次确认展示，不接入列表 CUD payload。 */
	const formProps: FormatFormProps = {
		form: cloneDeep(formatDefaultForm),
		defaultValues: cloneDeep(formatDefaultForm),
		initItem: row.initItem,
		initStatus: row.initStatus || "",
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => transformI18n($t("settingManage.systemManage.initializeCell.dialogs.formatTitle")),
		props: formProps,
		width: "500px",
		contentRenderer: () =>
			h(FormatForm, {
				ref: formatFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = formatFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("settingManage.systemManage.initializeCell.buttons.mistake")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = formatFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("settingManage.systemManage.initializeCell.buttons.confirmFormat")),
				type: "danger",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await formatFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						closeDialog(options, index);
						ElMessage.success(transformI18n($t("settingManage.systemManage.initializeCell.messages.formatSuccess")));
						if (button.btn) {
							button.btn.loading = false;
						}
					}
				},
			},
		],
	});
}

function handleFormat(row: InitializeCommunityListItem) {
	openFormatDialog(row);
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
						<ElButton type="info" @click="viewInitializeCellDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editInitializeCell(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteInitializeCellRow(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton type="info" @click="handleFormat(row)">
							{{ transformI18n($t("settingManage.systemManage.initializeCell.buttons.format")) }}
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
