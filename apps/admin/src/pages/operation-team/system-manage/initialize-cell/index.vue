<script lang="ts" setup>
definePage({
	meta: {
		title: "初始化单元格",
		icon: "mdi:home-import-outline",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.initializeCell"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type InitializeCellListItem,
	type InitializeCellQueryParams,
	cellTypeOptions,
	initializeCellStatusOptions,
} from "@01s-11comm/type";
import { useInitializeCellListQuery } from "@/api/operation-team/system-manage/initialize-cell";
import { type InitializeCellFormProps, defaultForm, type InitializeCellFormVO } from "./components/form";
import InitializeCellForm from "./components/form.vue";

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 弹框组件实例 */
const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<InitializeCellQueryParams> = {
	cellName: "",
	cellType: undefined,
	buildingName: "",
	status: undefined,
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
} = useInitializeCellListQuery(plusSearchDefaultValues);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "单元格ID",
		prop: "cellId",
		width: 120,
	},
	{
		label: "单元格名称",
		prop: "cellName",
		minWidth: 160,
	},
	{
		label: "单元格类型",
		prop: "cellType",
		width: 120,
	},
	{
		label: "建筑物名称",
		prop: "buildingName",
		minWidth: 140,
	},
	{
		label: "楼层",
		prop: "floor",
		width: 120,
	},
	{
		label: "单元号",
		prop: "unitNumber",
		width: 100,
	},
	{
		label: "户数",
		prop: "houseCount",
		width: 80,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "描述",
		prop: "description",
		minWidth: 200,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 160,
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
	title: "初始化单元格",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 单元格名称 */
	{
		label: "单元格名称",
		prop: "cellName",
		valueType: "input",
	},

	/** 单元格类型 */
	{
		label: "单元格类型",
		prop: "cellType",
		valueType: "select",
		options: cellTypeOptions,
	},

	/** 建筑物名称 */
	{
		label: "建筑物名称",
		prop: "buildingName",
		valueType: "input",
	},

	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: initializeCellStatusOptions,
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: InitializeCellListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 初始化单元格表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? cloneDeep({
					...defaultForm,
					单元格名称: row?.cellName || "",
					单元格类型: (row?.cellType || "住宅单元") as
						| "住宅单元"
						| "商业单元"
						| "车库单元"
						| "办公单元"
						| "会所单元"
						| "物业单元"
						| "运动单元"
						| "教育单元"
						| "医疗单元"
						| "仓储单元"
						| "文化单元",
					建筑物ID: row?.buildingId || "",
					建筑物名称: row?.buildingName || "",
					楼层: row?.floor || "",
					单元号: row?.unitNumber || "",
					户数: row?.houseCount || 0,
					状态: (row?.status || "未初始化") as "已初始化" | "未初始化" | "初始化中" | "初始化失败",
					描述: row?.description || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: InitializeCellFormProps = {
		form: 初始化单元格表单_VO,
		defaultValues: 初始化单元格表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 弹框标题 */
	const title = `${modeText.value}初始化单元格`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(InitializeCellForm, {
				ref: initializeCellFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = initializeCellFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = initializeCellFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					initializeCellFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await initializeCellFormInstance.value.plusFormInstance.handleSubmit();
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

/** 删除初始化单元格 */
async function handleDelete(row: InitializeCellListItem) {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟删除操作 */
		consola.log("删除初始化单元格:", row.cellId);

		/** 模拟异步操作 */
		await sleep(1000);

		/** 重新加载数据 */
		doFetch();
	} catch (error) {
		console.error("删除失败:", error);
		/** TODO: 显示错误提示 */
	}
}

onMounted(async () => {
	// await loadTableData();
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
}
</style>
