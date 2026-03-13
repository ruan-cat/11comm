<script lang="ts" setup>
definePage({
	meta: {
		// 配置中心
		title: "devTeam.configManage.center.pageTitle",
		icon: "mdi:cog",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.center"),
	},
});

import { computed, ref } from "vue";
import {
	type ConfigCenterListItem,
	type ConfigCenterQueryParams,
	configTypeOptions,
	configStatusOptions,
} from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { openDialog } from "./components/dialog";
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";
import { useI18nConfig } from "@/composables/use-i18n-config";

const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

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
	return key ? renderI18n(key) : value;
}

function translateStatus(value?: string) {
	if (!value) {
		return value;
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? renderI18n(key) : value;
}

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const translatedConfigTypeOptions = withLocale(() =>
	configTypeOptions.map((option) => ({
		...option,
		label: renderI18n(configTypeLabelKeyMap[String(option.value) as keyof typeof configTypeLabelKeyMap]),
	})),
);

const translatedStatusOptions = withLocale(() =>
	configStatusOptions.map((option) => ({
		...option,
		label: renderI18n(statusLabelKeyMap[String(option.value) as keyof typeof statusLabelKeyMap]),
	})),
);

const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
	status: "",
	configKey: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
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

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("devTeam.configManage.center.fields.configName")),
		prop: "configName",
		valueType: "input",
	},
	{
		label: renderI18n($t("devTeam.configManage.center.fields.configType")),
		prop: "configType",
		valueType: "select",
		options: translatedConfigTypeOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.configManage.center.form.placeholders.configType")),
		},
	},
	{
		label: renderI18n($t("devTeam.configManage.center.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.configManage.center.form.placeholders.status")),
		},
	},
	{
		label: renderI18n($t("devTeam.configManage.center.fields.configKey")),
		prop: "configKey",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	searchText: renderI18n($t("common.buttons.search")),
	resetText: renderI18n($t("common.buttons.reset")),
});

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.configName"))),
		prop: "configName",
		width: 150,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.configType"))),
		prop: "configType",
		width: 120,
		cellRenderer: ({ row }) => translateConfigType(row.configType),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.configKey"))),
		prop: "configKey",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.configValue"))),
		prop: "configValue",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.defaultValue"))),
		prop: "defaultValue",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.configDescription"))),
		prop: "configDescription",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.status"))),
		prop: "status",
		width: 80,
		cellRenderer: ({ row }) => translateStatus(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.sortOrder"))),
		prop: "sortOrder",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.remark"))),
		prop: "remark",
		minWidth: 150,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.configManage.center.fields.creator"))),
		prop: "creator",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 200,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("devTeam.configManage.center.pageTitle")),
	columns: columns.value,
}));

function viewDetails(row: ConfigCenterListItem) {
	console.log(renderI18n($t("devTeam.configManage.center.logs.viewDetails")), row);
}

function copyConfig(row: ConfigCenterListItem) {
	console.log(renderI18n($t("devTeam.configManage.center.logs.copyConfig")), row);
}

function toggleStatus(row: ConfigCenterListItem) {
	console.log(renderI18n($t("devTeam.configManage.center.logs.toggleStatusAction")), row);
	const newStatus = row.status === "enabled" ? "disabled" : "enabled";
	console.log(
		`${renderI18n($t("devTeam.configManage.center.logs.toggleStatus"))}: ${row.configName}, ${row.status} -> ${newStatus}`,
	);
}

function deleteConfig(row: ConfigCenterListItem) {
	console.log(renderI18n($t("devTeam.configManage.center.logs.deleteConfig")), row);
	console.log(`${renderI18n($t("devTeam.configManage.center.logs.confirmDelete"))}: ${row.configName} (${row.configKey})`);
}

function exportConfig() {
	console.log(renderI18n($t("devTeam.configManage.center.logs.exportConfig")));
}

function importConfig() {
	console.log(renderI18n($t("devTeam.configManage.center.logs.importConfig")));
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
				<ElButton type="info" @click="exportConfig">
					{{ transformI18n($t("devTeam.configManage.center.buttons.export")) }}
				</ElButton>
				<ElButton type="info" @click="importConfig">
					{{ transformI18n($t("devTeam.configManage.center.buttons.import")) }}
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
						<ElButton type="primary" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
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
