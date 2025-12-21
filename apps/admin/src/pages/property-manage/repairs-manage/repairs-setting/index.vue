<script lang="ts" setup>
definePage({
	meta: {
		title: "报修设置",
		icon: "mdi:settings",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsSetting"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type RepairsSettingFormProps,
	defaultForm,
	type 报修设置表单_VO,
	type 报修设置类型,
	type 派单方式类型,
	type 区域类型,
	type 业主端展示类型,
	type 通知方式类型,
	type 回访设置类型,
} from "./components/form";
import RepairsSettingForm from "./components/form.vue";
import { useRepairsSettingListQuery } from "@/api/property-manage/repairs-manage/repairs-setting";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const repairsSettingFormInstance = ref<InstanceType<typeof RepairsSettingForm> | null>(null);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "类型名称",
		prop: "类型名称",
		width: 140,
	},
	{
		label: "报修设置类型",
		prop: "报修设置类型",
		width: 120,
	},
	{
		label: "派单方式",
		prop: "派单方式",
		width: 120,
	},
	{
		label: "区域",
		prop: "区域",
		width: 120,
	},
	{
		label: "业主端展示",
		prop: "业主端展示",
		width: 120,
	},
	{
		label: "通知方式",
		prop: "通知方式",
		width: 120,
	},
	{
		label: "是否回访",
		prop: "是否回访",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报修设置",
	columns: columns.value,
});

interface 报修设置_列表查询_VO {
	类型名称?: string;
	派单方式?: string;
	报修设置类型?: string;
	区域选择?: string;
	是否回访?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef = {
	类型名称: "",
	派单方式: "",
	报修设置类型: "",
	区域: "",
	是否回访: "",
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
} = useRepairsSettingListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 类型名称
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.typeName")),
		prop: "类型名称",
		valueType: "input",
	},

	// 派单方式
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.orderMethod")),
		prop: "派单方式",
		valueType: "select",
		options: 派单方式Options,
	},

	// 报修设置类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairReportingSettingType")),
		prop: "报修设置类型",
		valueType: "select",
		options: 报修设置类型Options,
	},

	// 区域
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.regionalSelection")),
		prop: "区域",
		valueType: "select",
		options: 区域Options,
	},

	// 是否回访
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.whetherToMakeAReturnVisit")),
		prop: "是否回访",
		valueType: "select",
		options: 回访设置Options,
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

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 报修设置_列表数据;
}

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 新增按钮点击事件 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑按钮点击事件 */
function handleEdit(row: 报修设置_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: 报修设置_列表数据) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: 报修设置_列表数据) {
	consola.log("删除", row);
	await doFetch();
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}报修设置`;

	/** 业务对象 */
	const formValue: 报修设置表单_VO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					类型名称: row?.类型名称 || "",
					设置类型: (row?.报修设置类型 as 报修设置类型 | undefined) || defaultForm.设置类型,
					派单方式: (row?.派单方式 as 派单方式类型 | undefined) || defaultForm.派单方式,
					公共区域: (row?.区域 as 区域类型 | undefined) || defaultForm.公共区域,
					业主端展示: (row?.业主端展示 as 业主端展示类型 | undefined) || defaultForm.业主端展示,
					通知方式: (row?.通知方式 as 通知方式类型 | undefined) || defaultForm.通知方式,
					回访设置: (row?.是否回访 as 回访设置类型 | undefined) || defaultForm.回访设置,
					说明: row?.备注 || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(formValue);

	/** 表单组件需要的props */
	const formProps: RepairsSettingFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(RepairsSettingForm, {
				ref: repairsSettingFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = repairsSettingFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = repairsSettingFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					repairsSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await repairsSettingFormInstance.value?.plusFormInstance?.handleSubmit();
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
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="handleAdd">
					{{ transformI18n($t("propertyManage_repairsManage.repairs.add")) }}
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
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
