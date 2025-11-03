<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检路线",
		icon: "mdi:map-marker-path",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.path"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolPathFormProps, defaultForm } from "./components/form";
import { type 巡检路线_列表数据, type 巡检路线_列表查询_VO, type 巡检路线_表单数据, tableData as mockTableData } from "./test-data";
import PatrolPathForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<巡检路线_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "巡检点ID",
		prop: "巡检点ID",
		width: 120,
	},
	{
		label: "巡检点名称",
		prop: "巡检点名称",
		width: 150,
	},
	{
		label: "巡检点类型",
		prop: "巡检点类型",
		width: 120,
	},
	{
		label: "巡检位置",
		prop: "巡检位置",
		width: 180,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 100,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 100,
	},
	{
		label: "排序",
		prop: "排序",
		width: 80,
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检路线",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡检路线_列表查询_VO = {
	巡检路线: "",
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
	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionRoute")),
		prop: "巡检路线",
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.巡检路线) {
			filteredData = filteredData.filter((item) =>
				item.巡检点名称.includes(plusSearchModel.value.巡检路线!)
			);
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

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

const patrolPathFormInstance = ref<InstanceType<typeof PatrolPathForm> | null>(null);

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 巡检路线_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 巡检路线表单VO: 巡检路线_表单数据 = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || mode === 'info'
			? cloneDeep({
					...defaultForm,
					巡检点ID: row?.巡检点ID || "",
					巡检点名称: row?.巡检点名称 || "",
					巡检点类型: row?.巡检点类型 || "",
					巡检位置: row?.巡检位置 || "",
					开始时间: row?.开始时间 || "",
					结束时间: row?.结束时间 || "",
					排序: row?.排序 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: PatrolPathFormProps = {
		form: 巡检路线表单VO,
		defaultValues: 巡检路线表单VO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}巡检路线`;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(PatrolPathForm, {
				ref: patrolPathFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolPathFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolPathFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolPathFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolPathFormInstance.value.plusFormInstance.handleSubmit();
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

/** 删除数据 */
async function handleDelete(row: 巡检路线_列表数据) {
	console.log("删除数据:", row);
	// TODO: 实现删除逻辑
	await loadTableData();
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
