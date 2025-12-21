<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费明细表",
		icon: "mdi:cash-minus",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.arrearsDetailsList"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";

import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
  ArrearsDetailsFormVO,
  ArrearsDetailsFormProps,
  ArrearsDetailsListListItem,
  ArrearsDetailsListQueryParams
} from "@01s-11comm/type";
import { defaultArrearsDetailsForm } from "@01s-11comm/type";
import ArrearsDetailsForm from "./components/form.vue";
import { useArrearsDetailsListQuery } from "@/api/property-manage/report-manage/arrears-details-list";

const smallTotal = ref<number>(0);
const largeTotal = ref<number>(0);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const arrearsDetailsFormInstance = ref<InstanceType<typeof ArrearsDetailsForm> | null>(null);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "费用编号",
		prop: "费用编号",
		width: 100,
	},
	{
		label: "房号",
		prop: "房号",
		width: 150,
	},
	{
		label: "业主",
		prop: "业主",
		width: 120,
	},
	{
		label: "业主电话",
		prop: "业主电话",
		width: 140,
	},
	{
		label: "面积",
		prop: "面积",
		width: 90,
	},
	{
		label: "费用项",
		prop: "费用项",
		width: 150,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 140,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 140,
	},
	{
		label: "欠费时长(天)",
		prop: "欠费时长",
		width: 130,
	},
	{
		label: "欠费金额",
		prop: "欠费金额",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费明细表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ArrearsDetailsListQueryParams> = {
	name: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
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
} = useArrearsDetailsListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	//费用大类
	{
		label: "费用大类",
		prop: "feeCategory",
		valueType: "select",
		options: [],
	},
	//房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "roomNumber",
		valueType: "input",
	},
	// 开始时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	// 结束时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	//小区
	{
		label: transformI18n($t("propertyManage_reportManage.report.cell")),
		prop: "community",
		valueType: "select",
		options: [],
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "ownerName",
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}


/** 测试异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ArrearsDetailsListListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}欠费明细表`;

	/** 业务对象 */
	const formValue: ArrearsDetailsFormVO = isAdd.value
		? structuredClone(defaultArrearsDetailsForm)
		: isEdit.value
			? structuredClone({
					...defaultArrearsDetailsForm,
					feeNumber: row?.feeNumber || "",
					roomNumber: row?.roomNumber || "",
					owner: row?.owner || "",
					ownerPhone: row?.ownerPhone || "",
					area: row?.area || "",
					feeItem: row?.feeItem || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					arrearsDuration: row?.arrearsDuration || "",
					arrearsAmount: row?.arrearsAmount || "",
				})
			: structuredClone(defaultArrearsDetailsForm);
	const defaultValues = structuredClone(formValue);

	/** 表单组件需要的props */
	const formProps: ArrearsDetailsFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(ArrearsDetailsForm, {
				ref: arrearsDetailsFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = arrearsDetailsFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = arrearsDetailsFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					arrearsDetailsFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await arrearsDetailsFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await loadTableData();
					}
				},
			},
		],
	});
}

/** 新增按钮点击事件 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑按钮点击事件 */
function handleEdit(row: ArrearsDetailsListListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: ArrearsDetailsListListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: ArrearsDetailsListListItem) {
	consola.log("删除", row);
	// TODO: 调用删除API并刷新列表
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
				<ElButton type="primary" @click="handleAdd">
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
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>

		<section class="summary">
			<div>小计 欠费 : {{ smallTotal }} 元</div>
			<div>大计 欠费 : {{ largeTotal }} 元</div>
			<div>费用开始时间：所创建费用的计费起始时间</div>
			<div>欠费时长（天）：押金费用项欠费时长是费用开始时间到当天的天数</div>
			<div>除押金外的费用项欠费时长是费用的开始时间到费用的结束时间的天数</div>
			<div>欠费金额：欠费周期内应缴费用</div>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
.summary {
	margin-top: 12px;
}
</style>
