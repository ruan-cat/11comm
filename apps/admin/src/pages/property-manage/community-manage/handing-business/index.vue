<script lang="ts" setup>
definePage({
	meta: {
		title: "业务受理",
		icon: "mdi:briefcase",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.handingBusiness"),
	},
});

import { ref, computed, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import type { HandingBusinessListItem, HandingBusinessQueryParams } from "@01s-11comm/type";
import { useHandingBusinessListQuery } from "@/api/property-manage/community-manage/handing-business";
import type { HandingBusinessFormProps, 业务受理表单_VO } from "./components/form";
import { defaultForm, 列表数据转表单数据, feeTypeOptions, 状态Options } from "./components/form";
import HandingBusinessForm from "./components/form.vue";

const handingBusinessFormInstance = ref<InstanceType<typeof HandingBusinessForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
const plusSearchModelRef: FieldValues & Partial<HandingBusinessQueryParams> = {
	feeItem: "",
	feeType: undefined,
	status: undefined,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useHandingBusinessListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "费用项目",
		prop: "feeItem",
		width: 120,
	},
	{
		label: "费用标识",
		prop: "feeId",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "feeType",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "amountReceivable",
		width: 120,
	},
	{
		label: "建账时间",
		prop: "accountCreationTime",
		width: 160,
	},
	{
		label: "应收时间段",
		prop: "receivablePeriod",
		width: 180,
	},
	{
		label: "说明",
		prop: "description",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业务受理",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 费用项目 */
	{
		label: "费用项目",
		prop: "feeItem",
		valueType: "input",
	},

	/** 费用标识 */
	{
		label: "费用标识",
		prop: "feeId",
		valueType: "input",
	},

	/** 费用类型 */
	{
		label: "费用类型",
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
	},

	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: 状态Options,
	},

	/** 建账时间范围 */
	{
		label: "建账时间范围",
		prop: "建账时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.accountCreationStartTime = value?.[0] ?? "";
				plusSearchModel.value.accountCreationEndTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.accountCreationStartTime = "";
				plusSearchModel.value.accountCreationEndTime = "";
			},
		},
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: HandingBusinessListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
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
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业务受理`;

	/** 业务对象 */
	const 业务受理表单_VO: 业务受理表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value && row
			? 列表数据转表单数据(row)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: HandingBusinessFormProps = {
		form: 业务受理表单_VO,
		defaultValues: 业务受理表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(HandingBusinessForm, {
				ref: handingBusinessFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = handingBusinessFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = handingBusinessFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					handingBusinessFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await handingBusinessFormInstance.value.plusFormInstance.handleSubmit();
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

/** 删除单个业务受理 */
async function handleDelete(row: HandingBusinessListItem) {
	try {
		await ElMessageBox.confirm(`确认删除业务受理记录：${row.feeId} - ${row.feeItem}？`, "删除确认", {
			confirmButtonText: transformI18n($t("common.buttons.del")),
			cancelButtonText: transformI18n($t("common.buttons.cancel")),
			type: "warning",
		});

		// TODO: 调用删除API
		// 模拟删除操作
		await new Promise((resolve) => setTimeout(resolve, 300));

		// 刷新表格数据
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			// TODO: 显示错误提示
		}
	}
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
