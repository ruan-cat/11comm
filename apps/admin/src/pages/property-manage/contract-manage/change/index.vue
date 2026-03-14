<script lang="ts" setup>
definePage({
	meta: {
		// 合同变更
		title: "property-manage_contract-manage.contract-change.pageTitle",
		icon: "mdi:swap-horizontal",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.change"),
	},
});

import { ref, h } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { useChangeListQuery } from "@/api/property-manage/contract-manage/change";
import type { ContractChangeFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import ContractChangeForm from "./components/form.vue";
import {
	type ContractChangeFormVO,
	type ChangeListItem,
	type ChangeQueryParams,
	contractTypeOptions,
} from "@01s-11comm/type";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const statusTextMap = withLocale(() => ({
	待审核: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.pending")),
	审核中: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.reviewing")),
	已通过: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.approved")),
	已拒绝: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.rejected")),
	已撤回: transformI18n($t("property-manage_contract-manage.contract-change.form.options.statuses.withdrawn")),
}));

function translateStatusLabel(value?: string | null) {
	if (!value) return "";
	return statusTextMap.value[value] ?? value;
}

const translatedContractTypeOptions = withLocale(() =>
	contractTypeOptions.map((item) => ({
		...item,
		label: transformI18n(
			$t(
				`property-manage_contract-manage.contract-change.form.options.contractTypes.${
					item.value === "采购合同"
						? "purchase"
						: item.value === "销售合同"
							? "sales"
							: item.value === "服务合同"
								? "service"
								: item.value === "租赁合同"
									? "lease"
									: "purchase"
				}`,
			),
		),
	})),
);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ChangeQueryParams> = {
	contractName: "",
	contractNumber: "",
	contractType: undefined,
	partyA: "",
	partyB: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.fields.contractName")),
		prop: "contractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: translatedContractTypeOptions.value,
	},
]);

/** 表格搜索栏组件配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 使用 TanStack Query 获取数据 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useChangeListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 搜索处理函数 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.contractName")),
		),
		prop: "contractName",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.contractNumber")),
		),
		prop: "contractNumber",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.contractType")),
		),
		prop: "contractType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.partyA")),
		),
		prop: "partyA",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.partyB")),
		),
		prop: "partyB",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.changeType")),
		),
		prop: "changeType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.changer")),
		),
		prop: "changer",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.applyTime")),
		),
		prop: "applyTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.description")),
		),
		prop: "description",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-change.fields.status")),
		),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatusLabel(row.status),
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_contract-manage.contract-change.tableTitle")),
	columns: columns.value,
}));

/** 表单组件实例引用 */
const ContractChangeFormInstance = ref<InstanceType<typeof ContractChangeForm> | null>(null);

/** 模式相关状态管理 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 异步操作加载状态 */
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框函数 */
function openDialog({ mode, row }: { mode: Mode; row?: ChangeListItem }) {
	setMode(mode);

	/** 业务对象 */
	const formData = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					contractName: row?.contractName || "",
					contractNumber: row?.contractNumber || "",
					contractType: row?.contractType || "",
					partyA: row?.partyA || "",
					partyAContact: "",
					partyAPhone: "",
					partyB: row?.partyB || "",
					partyBContact: "",
					partyBPhone: "",
					handler: "",
					handlerPhone: "",
					contractAmount: "",
					startTime: "",
					endTime: "",
					signingTime: "",
					changeType: row?.changeType || "合同金额",
					changer: row?.changer || "",
					description: row?.description || "",
					beforeChange: "",
					afterChange: "",
					attachments: [],
				} as ContractChangeFormVO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContractChangeFormProps = {
		form: formData as ContractChangeFormVO,
		defaultValues: formData as ContractChangeFormVO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		title: () => `${modeText.value}${transformI18n($t("property-manage_contract-manage.contract-change.pageTitle"))}`,
		props: formProps,

		contentRenderer: () =>
			h(ContractChangeForm, {
				ref: ContractChangeFormInstance,
				...formProps,
				mode: mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ContractChangeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ContractChangeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					ContractChangeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await ContractChangeFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
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
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.subjectChange")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.termadjustment")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.assetchange")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("property-manage_contract-manage.contract-change.details")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("property-manage_contract-manage.contract-change.cencel")) }}
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
