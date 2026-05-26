<script lang="ts" setup>
definePage({
	meta: {
		/** 配置中心 */
		title: "devTeam.configManage.center.pageTitle",
		icon: "mdi:cog",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.center"),
	},
});

import { computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	type ConfigCenterListItem,
	type ConfigCenterQueryParams,
	configTypeOptions,
	configStatusOptions,
} from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { openDialog } from "./components/dialog";
import {
	deleteConfigCenter,
	getConfigCenterDetail,
	updateConfigCenter,
	useConfigCenterListQuery,
} from "@/api/dev-team/config-manage/center";
import { useI18nConfig } from "@/composables/use-i18n-config";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const configTypeLabelKeyMap = {
	system: $t("devTeam.configManage.center.form.options.system"),
	business: $t("devTeam.configManage.center.form.options.business"),
	api: $t("devTeam.configManage.center.form.options.api"),
	database: $t("devTeam.configManage.center.form.options.database"),
	cache: $t("devTeam.configManage.center.form.options.cache"),
	security: $t("devTeam.configManage.center.form.options.security"),
	email: $t("devTeam.configManage.center.form.options.email"),
	file: $t("devTeam.configManage.center.form.options.file"),
} as const;

const statusLabelKeyMap = {
	enabled: $t("devTeam.configManage.center.form.options.enabled"),
	disabled: $t("devTeam.configManage.center.form.options.disabled"),
} as const;

function translateConfigType(value?: string) {
	if (!value) {
		return value;
	}

	const key = configTypeLabelKeyMap[value as keyof typeof configTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateStatus(value?: string) {
	if (!value) {
		return value;
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedConfigTypeOptions = computed(() =>
	configTypeOptions.map((option) => ({
		...option,
		label: transformI18n(configTypeLabelKeyMap[String(option.value) as keyof typeof configTypeLabelKeyMap]),
	})),
);

const translatedStatusOptions = computed(() =>
	configStatusOptions.map((option) => ({
		...option,
		label: transformI18n(statusLabelKeyMap[String(option.value) as keyof typeof statusLabelKeyMap]),
	})),
);

/** 搜索默认值与正式列表接口参数保持一致，重置时用 cloneDeep 恢复空查询。 */
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
	status: "",
	configKey: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useConfigCenterListQuery(plusSearchDefaultValues);

/** 搜索栏选项只翻译 label，提交给正式 API 的 configType/status 仍保留原始枚举值。 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configName")),
		prop: "configName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configType")),
		prop: "configType",
		valueType: "select",
		options: translatedConfigTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.configType")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configKey")),
		prop: "configKey",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.configName"))),
		prop: "configName",
		width: 150,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.configType"))),
		prop: "configType",
		width: 120,
		cellRenderer: ({ row }) => translateConfigType(row.configType),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.configKey"))),
		prop: "configKey",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.configValue"))),
		prop: "configValue",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.defaultValue"))),
		prop: "defaultValue",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.configDescription"))),
		prop: "configDescription",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.status"))),
		prop: "status",
		width: 80,
		cellRenderer: ({ row }) => translateStatus(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.sortOrder"))),
		prop: "sortOrder",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.remark"))),
		prop: "remark",
		minWidth: 150,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.center.fields.creator"))),
		prop: "createdBy",
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
	title: transformI18n($t("devTeam.configManage.center.pageTitle")),
	columns: columns.value,
}));

/** 详情、复制、删除都只向接口传 id，避免把列表行的展示字段误当查询条件。 */
function toDetailPayload(row: ConfigCenterListItem) {
	return {
		id: row.id,
	};
}

/** 后端详情可能返回空值或历史状态值，列表和表单统一收敛为当前前端支持的状态枚举。 */
function normalizeStatus(status: unknown): ConfigCenterListItem["status"] {
	return status === "disabled" ? "disabled" : "enabled";
}

/** 详情接口是弹窗数据源，这里补齐列表/表单依赖的空值边界，避免 PlusForm 收到 undefined。 */
function mapDetailToListItem(detail: Record<string, unknown>): ConfigCenterListItem {
	return {
		...(detail as ConfigCenterListItem),
		configName: String(detail.configName || ""),
		configType: String(detail.configType || ""),
		configKey: String(detail.configKey || ""),
		configValue: String(detail.configValue || ""),
		defaultValue: String(detail.defaultValue || ""),
		configDescription: String(detail.configDescription || ""),
		status: normalizeStatus(detail.status),
		sortOrder: Number(detail.sortOrder || 0),
		remark: String(detail.remark || ""),
		createTime: String(detail.createTime || ""),
		updateTime: String(detail.updateTime || ""),
	};
}

async function viewDetails(row: ConfigCenterListItem) {
	const response = await getConfigCenterDetail(toDetailPayload(row));
	const detail = response.data;
	if (!detail) {
		return;
	}

	openDialog({
		mode: "info",
		/** info 模式只使用详情接口返回值展示，弹窗内部会隐藏 footer，不允许提交。 */
		row: mapDetailToListItem(detail as Record<string, unknown>),
	});
}

async function copyConfig(row: ConfigCenterListItem) {
	const response = await getConfigCenterDetail(toDetailPayload(row));
	const detail = response.data;
	if (!detail) {
		return;
	}

	openDialog({
		mode: "add",
		/** 复制新增以详情接口结果为来源，但提交时不带原 id。 */
		row: mapDetailToListItem(detail as Record<string, unknown>),
		onSubmitted: doFetch,
	});
}

async function toggleStatus(row: ConfigCenterListItem) {
	const nextStatus = row.status === "enabled" ? "disabled" : "enabled";
	/** 启停只提交 id 与目标状态，成功后刷新列表同步正式接口返回值。 */
	await updateConfigCenter({
		id: row.id,
		status: nextStatus,
	});
	ElMessage.success(transformI18n($t("devTeam.configManage.center.logs.toggleStatus")));
	await doFetch();
}

async function deleteConfig(row: ConfigCenterListItem) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("devTeam.configManage.center.logs.confirmDelete"))}: ${row.configName} (${row.configKey})`,
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

	/** 删除接口 payload 只允许 id，不能把整行配置值提交给删除接口。 */
	await deleteConfigCenter({
		id: row.id,
	});
	ElMessage.success(transformI18n($t("common.buttons.del")));
	await doFetch();
}

function exportConfig() {
	/** 预留导出入口，当前只补注释不改变空实现。 */
}

function importConfig() {
	/** 预留导入入口，当前只补注释不改变空实现。 */
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
				<ElButton type="primary" @click="openDialog({ mode: 'add', onSubmitted: doFetch })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
				<ElButton type="info" @click="exportConfig">
					{{ transformI18n($t("devTeam.configManage.center.buttons.export")) }}
				</ElButton>
				<ElButton type="info" @click="importConfig">
					{{ transformI18n($t("devTeam.configManage.center.buttons.import")) }}
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
						<ElButton type="primary" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row, onSubmitted: doFetch })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="copyConfig(row)">
							{{ transformI18n($t("devTeam.configManage.center.buttons.copy")) }}
						</ElButton>
						<ElButton :type="row.status === 'enabled' ? 'warning' : 'info'" @click="toggleStatus(row)">
							{{
								row.status === "enabled"
									? transformI18n($t("devTeam.configManage.center.buttons.disable"))
									: transformI18n($t("devTeam.configManage.center.buttons.enable"))
							}}
						</ElButton>
						<ElButton type="danger" @click="deleteConfig(row)">
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
