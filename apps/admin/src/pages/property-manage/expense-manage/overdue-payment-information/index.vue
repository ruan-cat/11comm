<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费信息",
		icon: "mdi:alert-circle-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.overduePaymentInformation"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type OverduePaymentInformationFormProps,
	defaultForm,
	type OverduePaymentInformationFormVO,
} from "./components/form";
import OverduePaymentInformationForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { useOverduePaymentInformationListQuery } from "@/api/property-manage/expense-manage/overdue-payment-information";
import {
	type OverduePaymentInformationListItem,
	type OverduePaymentInformationQueryParams,
	chargeObjectOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { addDialog, closeDialog } from "@/components/ReDialog";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const overduePaymentInformationFormInstance = ref<InstanceType<typeof OverduePaymentInformationForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues &
	Partial<OverduePaymentInformationQueryParams> & { 欠费时间范围?: [string, string] } = {
	chargeObject: "",
	ownerName: "",
	phoneNumber: "",
	startTime: "",
	endTime: "",
	欠费时间范围: ["", ""],
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
	// 收费对象
	{
		label: "收费对象",
		prop: "chargeObject",
		valueType: "select",
		options: chargeObjectOptions,
	},
	// 业主名称
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
	},
	// 手机号
	{
		label: "手机号",
		prop: "phoneNumber",
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
} = useOverduePaymentInformationListQuery(plusSearchDefaultValues);

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
		label: "收费对象",
		prop: "chargeObject",
		width: 100,
	},
	{
		label: "业主名称",
		prop: "ownerName",
		width: 120,
	},
	{
		label: "手机号",
		prop: "phoneNumber",
		width: 140,
	},
	{
		label: "欠费时间段",
		prop: "startTime", // Will be formatted
		width: 200,
		formatter: (row: OverduePaymentInformationListItem) => `${row.startTime} 至 ${row.endTime}`,
	},
	{
		label: "合计金额",
		prop: "totalAmount",
		width: 120,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 280,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费信息",
	columns: columns.value,
});

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: OverduePaymentInformationListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}欠费信息`;

	/** 业务对象 */
	const overduePaymentInformationFormVO: OverduePaymentInformationFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					chargeObject: row?.chargeObject || "",
					ownerName: row?.ownerName || "",
					phoneNumber: row?.phoneNumber || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					overdueTimeRange: [row?.startTime || "", row?.endTime || ""],
					overdueAmount: row?.totalAmount || "",
					paymentStatus: "未缴费", // Default
					contactAddress: "", // Default
					overdueDescription: "", // Default
				} as OverduePaymentInformationFormVO)
			: structuredClone({
					...defaultForm,
					chargeObject: row?.chargeObject || "",
					ownerName: row?.ownerName || "",
					phoneNumber: row?.phoneNumber || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					overdueTimeRange: [row?.startTime || "", row?.endTime || ""],
					overdueAmount: row?.totalAmount || "",
					paymentStatus: "未缴费", // Default
					contactAddress: "", // Default
					overdueDescription: "", // Default
				} as OverduePaymentInformationFormVO);

	/** 表单组件需要的props */
	const formProps: OverduePaymentInformationFormProps = {
		form: overduePaymentInformationFormVO,
		defaultValues: overduePaymentInformationFormVO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(OverduePaymentInformationForm, {
				ref: overduePaymentInformationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = overduePaymentInformationFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = overduePaymentInformationFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button: _button }) => {
					overduePaymentInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await overduePaymentInformationFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}

/** 操作按钮点击处理 */
function handleOperationClick(operation: string, row: OverduePaymentInformationListItem) {
	switch (operation) {
		case "欠费缴费":
			// 可以添加缴费相关的逻辑
			console.log("欠费缴费操作", row);
			break;
		case "查看详情":
			openDialog({ mode: "info", row });
			break;
		case "查看费用":
			// 可以添加查看费用明细的逻辑
			console.log("查看费用操作", row);
			break;
		default:
			console.log(`${operation} 操作`, row);
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
				<ElButton type="primary"> 欠费缴费 </ElButton>
				<ElButton type="info"> 导出欠费清单 </ElButton>
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
						<ElButton type="warning" @click="handleOperationClick('欠费缴费', row)"> 欠费缴费 </ElButton>
						<ElButton type="info" @click="handleOperationClick('查看详情', row)"> 查看详情 </ElButton>
						<ElButton type="primary" @click="handleOperationClick('查看费用', row)"> 查看费用 </ElButton>
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
