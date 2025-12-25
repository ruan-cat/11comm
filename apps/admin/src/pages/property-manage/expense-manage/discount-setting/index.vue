<script lang="ts" setup>
definePage({
	meta: {
		title: "折扣设置",
		icon: "mdi:label-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountSetting"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { type DiscountSettingFormProps, defaultForm } from "./components/form";
import type { DiscountSettingFormVO } from "@01s-11comm/type";
import DiscountSettingForm from "./components/form.vue";
import { useDiscountSettingListQuery } from "@/api/property-manage/expense-manage/discount-setting";
import {
	type DiscountSettingListItem,
	type DiscountSettingQueryParams,
	discountSettingTypeOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<DiscountSettingQueryParams> = {
	discountId: "",
	discountName: "",
	discountType: "",
	ruleName: "",
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
} = useDiscountSettingListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		prop: "discountId",
		label: "折扣ID",
		width: 120,
		fixed: true,
	},
	{
		prop: "discountName",
		label: "折扣名称",
		width: 200,
	},
	{
		prop: "discountType",
		label: "折扣类型",
		width: 200,
	},
	{
		prop: "ruleName",
		label: "规则名称",
		width: 200,
	},
	{
		prop: "rule",
		label: "规则",
		width: 200,
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "折扣设置",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 折扣ID
	{
		label: "折扣ID",
		prop: "discountId",
		valueType: "input",
	},
	// 折扣名称
	{
		label: "折扣名称",
		prop: "discountName",
		valueType: "input",
	},
	// 折扣类型
	{
		label: "折扣类型",
		prop: "discountType",
		valueType: "select",
		options: discountSettingTypeOptions,
	},
	// 规则名称
	{
		label: "规则名称",
		prop: "ruleName",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

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

// 弹框相关功能
const DiscountSettingFormInstance = ref<InstanceType<typeof DiscountSettingForm> | null>(null);
/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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
function openDialog(params: { mode: Mode; row?: DiscountSettingListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}折扣设置`;

	/** 业务对象 */
	const 业务对象: 折扣设置表单_VO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					discountName: row?.discountName || "",
					discountType: row?.discountType || "百分比折扣",
					rule: row?.ruleName || "", // Assuming ruleName maps to 'rule' in form? Check form definition. Form has 'rule' and 'ruleName'? No, form has '规则' and '规则'.
					description: row?.rule || "", // Assuming 'rule' maps to 'description' in form?
				})
			: structuredClone(defaultForm); // Fallback

	/** 表单组件需要的props */
	const formProps: DiscountSettingFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
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
			h(DiscountSettingForm, {
				ref: DiscountSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = DiscountSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = DiscountSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					DiscountSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await DiscountSettingFormInstance.value.plusFormInstance.handleSubmit();
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
	<section class="index-root">
		<PlusSearch
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
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
