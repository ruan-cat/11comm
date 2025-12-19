<script lang="ts" setup>
definePage({
	meta: {
		title: "业主账户",
		icon: "mdi:wallet-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerAccount"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type { OwnerAccountListItem, OwnerAccountQueryParams, accountTypeOptions, 业主账户表单_VO } from "@01s-11comm/type";
import type { TableColumnList } from "@pureadmin/table";
import { type OwnerAccountFormProps, defaultForm } from "./components/form";
import OwnerAccountForm from "./components/form.vue";
import { useOwnerAccountListQuery } from "@/api/property-manage/house-property-manage/owner-account";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<OwnerAccountQueryParams> = {
	accountName: "",
	idCard: "",
	phone: "",
	accountType: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "账户名称",
		prop: "accountName",
		valueType: "input",
	},
	{
		label: "身份证号",
		prop: "idCard",
		valueType: "input",
	},
	{
		label: "联系方式",
		prop: "phone",
		valueType: "input",
	},
	{
		label: "账户类型",
		prop: "accountType",
		valueType: "select",
		options: accountTypeOptions,
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
} = useOwnerAccountListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "账户编号",
		prop: "accountNo",
		width: 120,
	},
	{
		label: "账户名称",
		prop: "accountName",
		width: 120,
	},
	{
		label: "身份证号",
		prop: "idCard",
		width: 160,
	},
	{
		label: "手机号",
		prop: "phone",
		width: 120,
	},
	{
		label: "账户类型",
		prop: "accountType",
		width: 150,
	},
	{
		label: "账户金额",
		prop: "accountBalance",
		width: 120,
	},
	{
		label: "扣款房号",
		prop: "deductHouseNo",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "备注",
		prop: "remark",
		width: 150,
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
	title: "业主账户",
	columns: columns.value,
});

const ownerAccountFormInstance = ref<InstanceType<typeof OwnerAccountForm> | null>(null);

// 模式控制
const { modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: OwnerAccountListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主账户`;

	/** 业务对象 */
	const 业主账户表单_VO: 业主账户表单_VO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				accountType: row?.accountType || "通用账户",
				ownerPhone: row?.phone || "",
				ownerName: row?.accountName || "",
				prepaidAmount: row?.accountBalance?.replace(/,/g, "") || "",
				paymentMethod: "现金",
				remark: row?.remark || "",
			});

	/** 表单组件需要的props */
	const formProps: OwnerAccountFormProps = {
		form: 业主账户表单_VO,
		defaultValues: 业主账户表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(OwnerAccountForm, {
				ref: ownerAccountFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = ownerAccountFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownerAccountFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownerAccountFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ownerAccountFormInstance.value?.plusFormInstance?.handleSubmit();
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
