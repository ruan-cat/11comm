<script lang="ts" setup>
definePage({
	meta: {
		title: "强制回单",
		icon: "mdi:clipboard-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.mandatoryReturnIssue"),
	},
});

import { ref, computed, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type MandatoryReturnIssueFormProps, defaultForm } from "./components/form";
import MandatoryReturnIssueForm from "./components/form.vue";
import { useMandatoryReturnIssueListQuery } from "@/api/property-manage/repairs-manage/mandatory-return-issue";
import type {
	MandatoryReturnIssueListItem,
	MandatoryReturnIssueQueryParams,
	MandatoryReturnIssueFormVO,
} from "@01s-11comm/type";
import { repairTypeOptions, mandatoryReturnIssueStatusOptions } from "@01s-11comm/type";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const mandatoryReturnIssueFormInstance = ref<InstanceType<typeof MandatoryReturnIssueForm> | null>(null);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "工单编号",
		prop: "workOrderNumber",
		width: 120,
	},
	{
		label: "位置",
		prop: "location",
		width: 120,
	},
	{
		label: "报修类型",
		prop: "repairType",
		width: 120,
	},
	{
		label: "报修人",
		prop: "reporter",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "contactInfo",
		width: 120,
	},
	{
		label: "预约时间",
		prop: "appointmentTime",
		width: 120,
	},
	{
		label: "提交时间",
		prop: "submitTime",
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
	title: "强制回单",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & MandatoryReturnIssueQueryParams = {
	repairType: "",
	reporter: "",
	contactPhone: "",
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
} = useMandatoryReturnIssueListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "报修类型",
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: "报修人",
		prop: "reporter",
		valueType: "input",
	},
	{
		label: "报修电话",
		prop: "contactPhone",
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

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: MandatoryReturnIssueListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}强制回单`;

	/** 业务对象 */
	const 业务对象: MandatoryReturnIssueFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				workOrderNumber: row?.workOrderNumber || "",
				location: row?.location || "",
				repairType: row?.repairType || "",
				reporter: row?.reporter || "",
				contactInfo: row?.contactInfo || "",
				appointmentTime: row?.appointmentTime || "",
				submitTime: row?.submitTime || "",
				status: row?.status || "",
				remark: row?.remark || "",
			});
	const defaultValues = structuredClone(业务对象);

	/** 表单组件需要的props */
	const formProps: MandatoryReturnIssueFormProps = {
		form: 业务对象,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(MandatoryReturnIssueForm, {
				ref: mandatoryReturnIssueFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = mandatoryReturnIssueFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = mandatoryReturnIssueFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					mandatoryReturnIssueFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await mandatoryReturnIssueFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 新增按钮点击事件 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑按钮点击事件 */
function handleEdit(row: MandatoryReturnIssueListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: MandatoryReturnIssueListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: MandatoryReturnIssueListItem) {
	// TODO: 实现删除逻辑
}

/** 强制回单按钮点击事件 */
async function handleMandatoryReturn(row: MandatoryReturnIssueListItem) {
	// TODO: 实现强制回单逻辑
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

		<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
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
						<ElButton type="warning" @click="handleMandatoryReturn(row)">
							{{ transformI18n($t("propertyManage_repairsManage.repairs.return")) }}
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
