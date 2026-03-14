<script lang="ts" setup>
definePage({
	meta: {
		// 合同甲方
		title: "property-manage_contract-manage.first-party.pageTitle",
		icon: "mdi:account-group",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.firstParty"),
	},
});

import { ref, onMounted, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type FirstPartyFormVO,
	type FirstPartyListItem,
	type FirstPartyQueryParams,
	contractFirstPartyTypeOptions,
	firstPartyStatusOptions,
} from "@01s-11comm/type";
import { type FirstPartyFormProps, defaultForm } from "./components/form";
import FirstPartyForm from "./components/form.vue";
import { useFirstPartyListQuery } from "@/api/property-manage/contract-manage/first-party";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表单组件实例 */
const firstPartyFormInstance = ref<InstanceType<typeof FirstPartyForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<FirstPartyQueryParams> = {
	partyA: "",
	contactPerson: "",
	contactPhone: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useFirstPartyListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.partyA")),
		),
		prop: "partyA",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.contactPerson")),
		),
		prop: "contactPerson",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.contactPhone")),
		),
		prop: "contactPhone",
		width: 130,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.address")),
		),
		prop: "address",
		minWidth: 250,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.creditCode")),
		),
		prop: "creditCode",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.establishmentDate")),
		),
		prop: "establishmentDate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.first-party.fields.legalRepresentative")),
		),
		prop: "legalRepresentative",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_contract-manage.first-party.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.partyA")),
		prop: "partyA",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.contactPerson")),
		prop: "contactPerson",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.legalRepresentative")),
		prop: "legalRepresentative",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: FirstPartyListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = () => {
		if (isAdd.value) {
			return transformI18n($t("property-manage_contract-manage.first-party.dialogs.addTitle"));
		}
		return transformI18n($t("property-manage_contract-manage.first-party.dialogs.editTitle"));
	};

	/** 业务对象 */
	const firstPartyFormVO: FirstPartyFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					partyA: row?.partyA || "",
					contactPerson: row?.contactPerson || "",
					contactPhone: row?.contactPhone || "",
					address: row?.address || "",
					creditCode: row?.creditCode || "",
					establishmentDate: row?.establishmentDate || "",
					legalRepresentative: row?.legalRepresentative || "",
					businessScope: row?.businessScope || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: FirstPartyFormProps = {
		form: firstPartyFormVO,
		defaultValues: firstPartyFormVO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(FirstPartyForm, {
				ref: firstPartyFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = firstPartyFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = firstPartyFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					// 手动重置表单
					firstPartyFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await firstPartyFormInstance.value.plusFormInstance.handleSubmit();
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

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
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
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
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
