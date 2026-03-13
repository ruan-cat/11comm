<script lang="ts" setup>
definePage({
	meta: {
		// 注册协议
		title: "operationTeam.systemManage.registerProtocol.pageTitle",
		icon: "mdi:file-document-outline",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.registerProtocol"),
	},
});

import { computed, h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
	OperationTeamRegisterProtocol,
	OperationTeamRegisterProtocolListQuery,
	RegisterProtocolFormVO,
} from "@01s-11comm/type";
import {
	isMandatoryOptions,
	operationRegisterProtocolEnabledOptions,
	protocolTypeOptions,
} from "@01s-11comm/type";
import { useRegisterProtocolListQuery } from "@/api/operation-team/system-manage/register-protocol";
import { type RegisterProtocolFormProps, defaultForm } from "./components/form";
import RegisterProtocolForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

const protocolTypeLabelMap = {
	用户注册协议: "operationTeam.systemManage.registerProtocol.options.protocolTypes.userRegistration",
	隐私政策: "operationTeam.systemManage.registerProtocol.options.protocolTypes.privacyPolicy",
	服务条款: "operationTeam.systemManage.registerProtocol.options.protocolTypes.serviceTerms",
	免责声明: "operationTeam.systemManage.registerProtocol.options.protocolTypes.disclaimer",
	版权声明: "operationTeam.systemManage.registerProtocol.options.protocolTypes.copyright",
} as const;

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

function translateProtocolTypeLabel(value?: string) {
	const key = value ? protocolTypeLabelMap[value as keyof typeof protocolTypeLabelMap] : undefined;
	return key ? renderI18n($t(key)) : value;
}

function translateEnabledLabel(value?: boolean | number | string) {
	if (value === true || value === "启用" || value === "Enabled") {
		return renderI18n($t("operationTeam.systemManage.registerProtocol.options.enabledStatuses.enabled"));
	}
	if (value === false || value === "禁用" || value === "Disabled") {
		return renderI18n($t("operationTeam.systemManage.registerProtocol.options.enabledStatuses.disabled"));
	}
	return value === undefined || value === null ? "" : String(value);
}

function translateRequiredLabel(value?: boolean | number | string) {
	if (value === true || value === "是" || value === "Yes") {
		return renderI18n($t("operationTeam.systemManage.registerProtocol.options.requiredStatuses.yes"));
	}
	if (value === false || value === "否" || value === "No") {
		return renderI18n($t("operationTeam.systemManage.registerProtocol.options.requiredStatuses.no"));
	}
	return value === undefined || value === null ? "" : String(value);
}

const translatedProtocolTypeOptions = withLocale(() =>
	protocolTypeOptions.map((item) => ({
		...item,
		label: translateProtocolTypeLabel(String(item.value)),
	})),
);

const translatedEnabledOptions = withLocale(() =>
	operationRegisterProtocolEnabledOptions.map((item) => ({
		...item,
		label: translateEnabledLabel(item.value),
	})),
);

const translatedRequiredOptions = withLocale(() =>
	isMandatoryOptions.map((item) => ({
		...item,
		label: translateRequiredLabel(item.value),
	})),
);

const registerProtocolFormInstance = ref<InstanceType<typeof RegisterProtocolForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<OperationTeamRegisterProtocolListQuery> = {
	title: "",
	protocolType: undefined,
	isEnabled: undefined,
	isRequired: undefined,
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
} = useRegisterProtocolListQuery(plusSearchDefaultValues);

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolId"))),
		prop: "id",
		width: 120,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolName"))),
		prop: "title",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolType"))),
		prop: "protocolType",
		width: 150,
		cellRenderer: ({ row }) => translateProtocolTypeLabel(row.protocolType),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolVersion"))),
		prop: "version",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.enabledStatus"))),
		prop: "isEnabled",
		width: 100,
		cellRenderer: ({ row }) => translateEnabledLabel(row.isEnabled),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.isRequired"))),
		prop: "isRequired",
		width: 120,
		cellRenderer: ({ row }) => translateRequiredLabel(row.isRequired),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.remark"))),
		prop: "remark",
		minWidth: 250,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.effectiveTime"))),
		prop: "effectiveTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.expireTime"))),
		prop: "expireTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.operator"))),
		prop: "operator",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("operationTeam.systemManage.registerProtocol.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("operationTeam.systemManage.registerProtocol.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolName")),
		prop: "title",
		valueType: "input",
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolType")),
		prop: "protocolType",
		valueType: "select",
		options: translatedProtocolTypeOptions.value,
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.enabledStatus")),
		prop: "isEnabled",
		valueType: "select",
		options: translatedEnabledOptions.value,
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.isRequired")),
		prop: "isRequired",
		valueType: "select",
		options: translatedRequiredOptions.value,
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
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

interface OpenDialogParams {
	mode: Mode;
	row?: OperationTeamRegisterProtocol;
}

const { setMode, isAdd, isEdit, isInfo } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const title = isAdd.value
		? () => renderI18n($t("operationTeam.systemManage.registerProtocol.dialogs.addTitle"))
		: isEdit.value
			? () => renderI18n($t("operationTeam.systemManage.registerProtocol.dialogs.editTitle"))
			: () => renderI18n($t("operationTeam.systemManage.registerProtocol.dialogs.infoTitle"));

	const formVO: RegisterProtocolFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value || isInfo.value
			? (structuredClone({
					...defaultForm,
					protocolName: row?.title || "",
					protocolType: row?.protocolType || "用户注册协议",
					protocolVersion: row?.version || "v1.0.0",
					status: row?.isEnabled ? "Enabled" : "Disabled",
					isMandatory: row?.isRequired ? "Yes" : "No",
					protocolSummary: row?.remark || "",
					protocolContent: row?.content || "",
					effectiveDate: row?.effectiveTime || "",
					expirationDate: row?.expireTime || "",
					sortWeight: 0,
				}) as RegisterProtocolFormVO)
			: structuredClone(defaultForm);

	const props: RegisterProtocolFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		width: "80%",
		top: "10vh",
		props,
		contentRenderer: () =>
			h(RegisterProtocolForm, {
				ref: registerProtocolFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = registerProtocolFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = registerProtocolFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					registerProtocolFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: isInfo.value
					? () => renderI18n($t("common.buttons.cancel"))
					: () => renderI18n($t("common.buttons.submit")),
				type: isInfo.value ? "info" : "success",
				btnClick: isInfo.value
					? async ({ dialog: { options, index } }) => {
							const formComputed = registerProtocolFormInstance.value?.formComputed;
							if (formComputed) {
								await useDoBeforeClose({ defaultValues, formComputed, index, options });
							}
						}
					: async ({ dialog: { options, index }, button }) => {
							const res = await registerProtocolFormInstance.value?.plusFormInstance?.handleSubmit();
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
				<!-- @vue-ignore 忽略 treeProps 所需的 checkStrictly 类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:loading="isFetching"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="danger">{{ transformI18n($t("common.buttons.del")) }}</ElButton>
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
