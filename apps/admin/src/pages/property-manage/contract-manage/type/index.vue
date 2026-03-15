<script lang="ts" setup>
definePage({
	meta: {
		// 合同类型
		title: "property-manage_contract-manage.contract-type.pageTitle",
		icon: "carbon:category",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.type"),
	},
});

import { h, ref, computed } from "vue";
import { sleep } from "@antfu/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";

import { useMode, type Mode } from "@/composables/use-mode";
import type { AddFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import type { ContractTypeFormVO, IsAuditType, TypeListItem, TypeQueryParams } from "@01s-11comm/type";
import { auditTypeOptions } from "@01s-11comm/type";
import AddForm from "./components/form.vue";
import { useTypeListQuery } from "@/api/property-manage/contract-manage/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { cloneDeep } from "@pureadmin/utils";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { setMode, isAdd, isEdit } = useMode();

const addFormInstance = ref<InstanceType<typeof AddForm> | null>(null);

const auditLabelMap = {
	yes: "property-manage_contract-manage.contract-type.options.auditYes",
	no: "property-manage_contract-manage.contract-type.options.auditNo",
} as const;

function translateAuditLabel(value?: string | null) {
	if (!value) return value ?? "";
	const key = auditLabelMap[value as keyof typeof auditLabelMap];
	return key ? transformI18n($t(key)) : value;
}

const translatedAuditTypeOptions = computed(() =>
	auditTypeOptions.map((option) => ({
		...option,
		label: translateAuditLabel(String(option.value)),
	})),
);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<TypeQueryParams> = {
	typeName: "",
	description: "",
	isAudit: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useTypeListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-type.fields.typeName")),
		),
		prop: "typeName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-type.fields.isAudit")),
		),
		prop: "isAudit",
		width: 120,
		cellRenderer: ({ row }) => translateAuditLabel(row.isAudit),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-type.fields.description")),
		),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_contract-manage.contract-type.fields.createTime")),
		),
		prop: "createTime",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 360,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_contract-manage.contract-type.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 合同类型名称 */
	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.search.typeName")),
		prop: "typeName",
		valueType: "input",
	},
	/** 审核类型 */
	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.search.isAudit")),
		prop: "isAudit",
		valueType: "select",
		options: translatedAuditTypeOptions.value,
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: TypeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const contractTypeFormVO: ContractTypeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					typeName: row?.typeName || "",
					isAudit: (row?.isAudit === "是" ? "是" : "否") as IsAuditType,
					description: row?.description || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: AddFormProps = {
		form: contractTypeFormVO,
		defaultValues: contractTypeFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_contract-manage.contract-type.dialogs.addTitle"))
				: transformI18n($t("property-manage_contract-manage.contract-type.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(AddForm, {
				ref: addFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = addFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = addFormInstance.value?.formComputed;
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
					addFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await addFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 删除合同类型 */
function handleDelete(row: TypeListItem) {
	consola.log("删除合同类型:", row.typeName);
}

/** 查看合同模板 */
function handleViewTemplate(row: TypeListItem) {
	consola.log("查看合同模板:", row.typeName);
}

/** 扩展功能 */
function handleExtend(row: TypeListItem) {
	consola.log("扩展功能:", row.typeName);
}

/** 添加审核人员 */
function addAuditPeople() {
	consola.log("添加审核人员");
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
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
				<ElButton type="primary" @click="addAuditPeople">
					{{ transformI18n($t("property-manage_contract-manage.contract-type.addpeople")) }}
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
						<ElButton type="info" @click="handleExtend(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.extent")) }}
						</ElButton>
						<ElButton type="info" @click="handleViewTemplate(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.template")) }}
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
