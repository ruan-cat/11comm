<script lang="ts" setup>
definePage({
	meta: {
		// 优惠类型
		title: "property-manage_expense-manage.discount-type.pageTitle",
		icon: "mdi:tag-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountType"),
	},
});

import { h, ref, computed } from "vue";
import { sleep } from "@antfu/utils";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";

import { useMode, type Mode } from "@/composables/use-mode";
import type { DiscountTypeFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import type { DiscountTypeFormVO, DiscountType, DiscountTypeListItem, DiscountTypeQueryParams } from "@01s-11comm/type";
import { discountTypeOptions } from "@01s-11comm/type";
import DiscountTypeForm from "./components/form.vue";
import { useDiscountTypeListQuery } from "@/api/property-manage/expense-manage/discount-type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 模式控制 */
const { setMode, isAdd, isEdit, isInfo } = useMode();

const DiscountTypeFormInstance = ref<InstanceType<typeof DiscountTypeForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<DiscountTypeQueryParams> = {
	name: "",
	status: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

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
} = useDiscountTypeListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{ ...defaultPureTableIndexColumn, headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))) },
	{
		prop: "id",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-type.fields.discountId")),
		),
		width: 120,
		fixed: true,
	},
	{
		prop: "name",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-type.fields.discountName")),
		),
		width: 200,
	},
	{
		prop: "discountType",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-type.fields.discountType")),
		),
		width: 200,
	},
	{
		prop: "ruleName",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-type.fields.ruleName")),
		),
		width: 200,
	},
	{
		prop: "rule",
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_expense-manage.discount-type.fields.rule"))),
		width: 200,
	},
	{
		prop: "createTime",
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.discount-type.fields.createTime")),
		),
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.discount-type.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 折扣ID */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.search.discountId")),
		prop: "id",
		valueType: "input",
	},
	/** 折扣名称 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.search.discountName")),
		prop: "name",
		valueType: "input",
	},
	/** 折扣类型 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.search.discountType")),
		prop: "discountType",
		valueType: "select",
		options: discountTypeOptions,
	},
	/** 规则名称 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.search.ruleName")),
		prop: "ruleName",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 删除优惠类型 */
async function handleDelete(row: DiscountTypeListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("property-manage_expense-manage.discount-type.deleteConfirmMessage"), { name: row.name }),
			transformI18n($t("property-manage_expense-manage.discount-type.deleteConfirmTitle")),
			{
				confirmButtonText: transformI18n($t("property-manage_expense-manage.discount-type.deleteConfirmOk")),
				cancelButtonText: transformI18n($t("property-manage_expense-manage.discount-type.deleteConfirmCancel")),
				type: "warning",
			},
		);

		/** TODO: 替换为真实的API调用 */
		/** 模拟删除操作 */
		console.log("删除优惠类型:", row.id);

		/** 显示成功提示 */
		ElMessage.success(transformI18n($t("property-manage_expense-manage.discount-type.deleteSuccess")));

		/** 重新加载数据 */
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			console.error("删除失败:", error);
			ElMessage.error(transformI18n($t("property-manage_expense-manage.discount-type.deleteFailed")));
		}
	}
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
function openDialog(params: { mode: Mode; row?: DiscountTypeListItem }) {
	const { row } = params;
	setMode(params.mode);

	/** 业务对象 */
	const discountTypeFormVO: DiscountTypeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? cloneDeep({
					...defaultForm,
					discountName: row?.name || "",
					discountType: (row?.discountType || "百分比折扣") as DiscountType,
					ruleName: row?.ruleName || "",
					rule: row?.rule || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: DiscountTypeFormProps = {
		form: discountTypeFormVO,
		defaultValues: discountTypeFormVO,
		disabled: isInfo.value,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.discount-type.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.discount-type.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(DiscountTypeForm, {
				ref: DiscountTypeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			if (!isInfo.value) {
				const formComputed = DiscountTypeFormInstance.value?.formComputed;
				if (formComputed) {
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				}
			} else {
				closeDialog(options, index);
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (!isInfo.value) {
						const formComputed = DiscountTypeFormInstance.value?.formComputed;
						if (formComputed) {
							await useDoBeforeClose({ defaultValues, formComputed, index, options });
						}
					} else {
						closeDialog(options, index);
					}
				},
			},
			...(isInfo.value
				? []
				: [
						{
							label: () => transformI18n($t("common.buttons.reset")),
							type: "warning" as const,
							btnClick: () => {
								/** 手动重置表单 */
								DiscountTypeFormInstance.value?.plusFormInstance?.handleReset();
							},
						},
						{
							label: () => transformI18n($t("common.buttons.submit")),
							type: "success" as const,
							btnClick: async ({ dialog: { options, index }, button }) => {
								/** 提交表单时 校验 */
								const res = await DiscountTypeFormInstance.value?.plusFormInstance?.handleSubmit();
								if (res) {
									button.btn.loading = true;
									await testAsync();
									button.btn.loading = false;
									closeDialog(options, index);
									await doFetch();
								}
							},
						},
					]),
		],
	});
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
	/* 样式预留 */
}
</style>
