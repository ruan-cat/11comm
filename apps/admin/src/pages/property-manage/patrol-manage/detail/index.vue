<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检明细",
		icon: "mdi:clipboard-text",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.detail"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { cloneDeep } from "lodash-es";
import {
	type 巡检明细_列表数据,
	type 巡检明细_列表查询_VO,
	巡检方式Options,
	任务状态Options,
	巡检点状态Options,
	tableData as mockTableData,
} from "./test-data";
import { type 巡查明细表单Props, defaultForm, type 巡查明细表单_VO } from "./components/form";
import PatrolDetailForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<巡检明细_列表数据[]>([]);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const patrolDetailFormInstance = ref<InstanceType<typeof PatrolDetailForm> | null>(null);

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "任务详情ID",
		prop: "任务详情ID",
		width: 120,
	},
	{
		label: "巡检点名称",
		prop: "巡检点名称",
		width: 120,
	},
	{
		label: "巡检计划名称",
		prop: "巡检计划名称",
		width: 120,
	},
	{
		label: "巡检路线名称",
		prop: "巡检路线名称",
		width: 120,
	},
	{
		label: "巡检人开始结束时间",
		prop: "巡检人开始结束时间",
		width: 160,
	},
	{
		label: "巡检点开始结束时间",
		prop: "巡检点开始结束时间",
		width: 160,
	},
	{
		label: "实际巡检时间",
		prop: "实际巡检时间",
		width: 150,
	},
	{
		label: "实际签到状态",
		prop: "实际签到状态",
		width: 100,
	},
	{
		label: "计划巡检人",
		prop: "计划巡检人",
		width: 100,
	},
	{
		label: "实际巡检人",
		prop: "实际巡检人",
		width: 100,
	},
	{
		label: "巡检方式",
		prop: "巡检方式",
		width: 100,
	},
	{
		label: "任务状态",
		prop: "任务状态",
		width: 100,
	},
	{
		label: "巡检点状态",
		prop: "巡检点状态",
		width: 100,
	},
	{
		label: "巡检情况",
		prop: "巡检情况",
		width: 150,
	},
	{
		label: "巡检照片",
		prop: "巡检照片",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 160,
	},
	{
		label: "位置信息",
		prop: "位置信息",
		width: 150,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检明细",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.巡检人) {
			filteredData = filteredData.filter((item) => item.实际巡检人.includes(plusSearchModel.value.巡检人!));
		}
		if (plusSearchModel.value.巡检开始时间) {
			filteredData = filteredData.filter((item) => item.实际巡检时间 >= plusSearchModel.value.巡检开始时间!);
		}
		if (plusSearchModel.value.巡检结束时间) {
			filteredData = filteredData.filter((item) => item.实际巡检时间 <= plusSearchModel.value.巡检结束时间!);
		}
		if (plusSearchModel.value.巡检方式) {
			filteredData = filteredData.filter((item) => item.巡检方式 === plusSearchModel.value.巡检方式);
		}
		if (plusSearchModel.value.任务状态) {
			filteredData = filteredData.filter((item) => item.任务状态 === plusSearchModel.value.任务状态);
		}
		if (plusSearchModel.value.巡检点状态) {
			filteredData = filteredData.filter((item) => item.巡检点状态 === plusSearchModel.value.巡检点状态);
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡检明细_列表查询_VO = {
	巡检人: "",
	巡检开始时间: "",
	巡检结束时间: "",
	巡检方式: "",
	任务状态: "",
	巡检点状态: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 巡检人 */
	{
		label: "巡检人",
		prop: "巡检人",
		valueType: "input",
	},

	/** 巡检开始时间 */
	{
		label: "巡检开始时间",
		prop: "巡检开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	/** 巡检结束时间 */
	{
		label: "巡检结束时间",
		prop: "巡检结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	/** 巡检方式 */
	{
		label: "巡检方式",
		prop: "巡检方式",
		valueType: "select",
		options: 巡检方式Options,
	},

	/** 任务状态 */
	{
		label: "任务状态",
		prop: "任务状态",
		valueType: "select",
		options: 任务状态Options,
	},

	/** 巡检点状态 */
	{
		label: "巡检点状态",
		prop: "巡检点状态",
		valueType: "select",
		options: 巡检点状态Options,
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
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 巡检明细_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 巡查明细表单_VO: 巡查明细表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					巡检点名称: row?.巡检点名称 || "",
					巡检计划名称: row?.巡检计划名称 || "",
					巡检路线名称: row?.巡检路线名称 || "",
					计划巡检人: row?.计划巡检人 || "",
					巡检方式: row?.巡检方式 || "步行巡检",
					位置信息: row?.位置信息 || "",
					巡检情况: row?.巡检情况 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: 巡查明细表单Props = {
		form: 巡查明细表单_VO,
		defaultValues: 巡查明细表单_VO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}巡检明细`;

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(PatrolDetailForm, {
				ref: patrolDetailFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolDetailFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = patrolDetailFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					patrolDetailFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolDetailFormInstance.value?.plusFormInstance?.handleSubmit();
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

onMounted(async () => {
	await loadTableData();
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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
