<script lang="ts" setup>
definePage({
	meta: {
		// 系统配置
		title: "operationTeam.systemManage.systemConfig.pageTitle",
		icon: "mdi:cog",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.systemConfig"),
	},
});

import { computed, h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type { SystemConfigFormVO, OperationTeamSystemConfig, OperationTeamSystemConfigListQuery } from "@01s-11comm/type";
import {
	systemConfigEnabledOptions,
	systemConfigSystemOptions,
	systemConfigTypeOptions,
} from "@01s-11comm/type";
import { useSystemConfigListQuery } from "@/api/operation-team/system-manage/system-config";
import { type SystemConfigFormProps, defaultForm } from "./components/form";
import SystemConfigForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const configTypeLabelMap = {
	文本: "operationTeam.systemManage.systemConfig.options.configTypes.text",
	数字: "operationTeam.systemManage.systemConfig.options.configTypes.number",
	布尔: "operationTeam.systemManage.systemConfig.options.configTypes.boolean",
	JSON: "operationTeam.systemManage.systemConfig.options.configTypes.json",
	URL: "operationTeam.systemManage.systemConfig.options.configTypes.url",
} as const;

function translateConfigTypeLabel(value?: string) {
	const key = value ? configTypeLabelMap[value as keyof typeof configTypeLabelMap] : undefined;
	return key ? transformI18n($t(key)) : value;
}

function translateEnabledLabel(value?: boolean | number | string) {
	if (value === true || value === "启用" || value === "Enabled") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.enabled"));
	}
	if (value === false || value === "禁用" || value === "Disabled") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.disabled"));
	}
	return value === undefined || value === null ? "" : String(value);
}

function translateSystemLabel(value?: boolean | number | string) {
	if (value === true || value === "是" || value === "Yes") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.systems.yes"));
	}
	if (value === false || value === "否" || value === "No") {
		return transformI18n($t("operationTeam.systemManage.systemConfig.options.systems.no"));
	}
	return value === undefined || value === null ? "" : String(value);
}

const translatedConfigTypeOptions = withLocale(() =>
	systemConfigTypeOptions.map((item) => ({
		...item,
		label: translateConfigTypeLabel(String(item.value)),
	})),
);

const translatedEnabledOptions = withLocale(() =>
	systemConfigEnabledOptions.map((item) => ({
		...item,
		label: translateEnabledLabel(item.value),
	})),
);

const translatedSystemOptions = withLocale(() =>
	systemConfigSystemOptions.map((item) => ({
		...item,
		label: translateSystemLabel(item.value),
	})),
);

const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

const systemConfigFormInstance = ref<InstanceType<typeof SystemConfigForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<OperationTeamSystemConfigListQuery> = {
	configName: "",
	configType: undefined,
	isEnabled: undefined,
	isSystem: undefined,
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
} = useSystemConfigListQuery(plusSearchDefaultValues);

const { setMode, isAdd, isEdit, isInfo } = useMode();

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configId"))),
		prop: "id",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configName"))),
		prop: "configName",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configValue"))),
		prop: "configValue",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType"))),
		prop: "configType",
		width: 100,
		cellRenderer: ({ row }) => translateConfigTypeLabel(row.configType),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.isSystem"))),
		prop: "isSystem",
		width: 100,
		cellRenderer: ({ row }) => translateSystemLabel(row.isSystem),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.isEnabled"))),
		prop: "isEnabled",
		width: 100,
		cellRenderer: ({ row }) => translateEnabledLabel(row.isEnabled),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.description"))),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operationTeam.systemManage.systemConfig.fields.updateTime"))),
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

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("operationTeam.systemManage.systemConfig.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configName")),
		prop: "configName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType")),
		prop: "configType",
		valueType: "select",
		options: translatedConfigTypeOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.isEnabled")),
		prop: "isEnabled",
		valueType: "select",
		options: translatedEnabledOptions.value,
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.isSystem")),
		prop: "isSystem",
		valueType: "select",
		options: translatedSystemOptions.value,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function openDialog(params: { mode: Mode; row?: OperationTeamSystemConfig }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO: SystemConfigFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? cloneDeep({
					...defaultForm,
					configName: row?.configName || "",
					configValue: row?.configValue || "",
					configKey: row?.configKey || "",
					configType: row?.configType || "文本",
					description: row?.description || "",
					isSystem: row?.isSystem ?? false,
					status: row?.isEnabled ? "Enabled" : "Disabled",
				})
			: cloneDeep(defaultForm);

	const formProps: SystemConfigFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	const defaultValues = formProps.defaultValues;

	const title = isAdd.value
		? () => transformI18n($t("operationTeam.systemManage.systemConfig.dialogs.addTitle"))
		: isEdit.value
			? () => transformI18n($t("operationTeam.systemManage.systemConfig.dialogs.editTitle"))
			: () => transformI18n($t("operationTeam.systemManage.systemConfig.dialogs.infoTitle"));

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(SystemConfigForm, {
				ref: systemConfigFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = systemConfigFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = systemConfigFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
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
					const res = await systemConfigFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

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

async function handleDelete(row: OperationTeamSystemConfig) {
	try {
		consola.log("删除系统配置:", row.id);
		await sleep(1000);
		doFetch();
	} catch (error) {
		console.error("删除失败:", error);
	}
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
				<!-- @vue-ignore 忽略 treeProps 所需的 checkStrictly 类型 -->
				<PureTable
					:="pureTableProps"
					:data="tableData"
					:columns="dynamicColumns"
					:loading="isFetching"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
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
