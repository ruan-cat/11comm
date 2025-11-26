<script lang="ts" setup>
definePage({
	meta: {
		title: "楼栋结构图",
		icon: "mdi:domain",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.buildingSpaceStructureDiagram"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 楼栋结构图_列表数据,
	type 楼栋结构图_列表查询_VO,
	建筑结构选项,
	楼栋状态选项,
	tableData as mockTableData,
} from "./test-data";

import { type BuildingSpaceStructureDiagramFormProps, defaultForm, type 楼栋结构图表单_VO } from "./components/form";
import BuildingSpaceStructureDiagramForm from "./components/form.vue";

/** 表单组件实例 */
const buildingSpaceStructureDiagramFormInstance = ref<InstanceType<typeof BuildingSpaceStructureDiagramForm> | null>(null);

/** 表格数据 */
const tableData = ref<楼栋结构图_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "楼栋编号",
		prop: "楼栋编号",
		width: 120,
	},
	{
		label: "楼栋名称",
		prop: "楼栋名称",
		width: 120,
	},
	{
		label: "总楼层",
		prop: "总楼层",
		width: 100,
	},
	{
		label: "总户数",
		prop: "总户数",
		width: 100,
	},
	{
		label: "建筑面积",
		prop: "建筑面积",
		width: 120,
	},
	{
		label: "建筑结构",
		prop: "建筑结构",
		width: 140,
	},
	{
		label: "建成年份",
		prop: "建成年份",
		width: 100,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "最后更新时间",
		prop: "最后更新时间",
		width: 160,
	},
	{
		label: "负责人",
		prop: "负责人",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
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
	title: "楼栋结构图",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.楼栋编号) {
			filteredData = filteredData.filter((item) => item.楼栋编号.includes(plusSearchModel.value.楼栋编号!));
		}
		if (plusSearchModel.value.楼栋名称) {
			filteredData = filteredData.filter((item) => item.楼栋名称.includes(plusSearchModel.value.楼栋名称!));
		}
		if (plusSearchModel.value.建筑结构) {
			filteredData = filteredData.filter((item) => item.建筑结构 === plusSearchModel.value.建筑结构);
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}
		if (plusSearchModel.value.建成年份) {
			filteredData = filteredData.filter((item) => item.建成年份.includes(plusSearchModel.value.建成年份!));
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
const plusSearchModelRef: FieldValues & 楼栋结构图_列表查询_VO = {
	楼栋编号: "",
	楼栋名称: "",
	建筑结构: "",
	状态: "",
	建成年份: "",
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
	/** 楼栋编号 */
	{
		label: "楼栋编号",
		prop: "楼栋编号",
		valueType: "input",
	},

	/** 楼栋名称 */
	{
		label: "楼栋名称",
		prop: "楼栋名称",
		valueType: "input",
	},

	/** 建筑结构 */
	{
		label: "建筑结构",
		prop: "建筑结构",
		valueType: "select",
		options: 建筑结构选项,
	},

	/** 状态 */
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 楼栋状态选项,
	},

	/** 建成年份 */
	{
		label: "建成年份",
		prop: "建成年份",
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

const { gotoDetailPage } = useGotoDetailsPage();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 楼栋结构图_列表数据;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}楼栋结构图`;

	/** 业务对象 */
	const 楼栋结构图表单_VO: 楼栋结构图表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					楼栋编号: row?.楼栋编号 || "",
					楼栋名称: row?.楼栋名称 || "",
					总楼层: row?.总楼层 || 0,
					总户数: row?.总户数 || 0,
					建筑面积: row?.建筑面积 || 0,
					建筑结构: row?.建筑结构 || "",
					建成年份: row?.建成年份 || "",
					图纸路径: row?.图纸路径 || "",
					状态: row?.状态 || "正常使用",
					负责人: row?.负责人 || "",
					联系电话: row?.联系电话 || "",
					备注: row?.备注 || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: BuildingSpaceStructureDiagramFormProps = {
		form: 楼栋结构图表单_VO,
		defaultValues: 楼栋结构图表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(BuildingSpaceStructureDiagramForm, {
				ref: buildingSpaceStructureDiagramFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = buildingSpaceStructureDiagramFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					// console.log(options, index);
					const formComputed = buildingSpaceStructureDiagramFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					// 手动重置表单
					buildingSpaceStructureDiagramFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await buildingSpaceStructureDiagramFormInstance.value.plusFormInstance.handleSubmit();
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

/** 查看图纸 */
function viewDrawing(row: 楼栋结构图_列表数据) {
	console.log("查看图纸:", row.图纸路径);
	// TODO: 实现查看图纸的逻辑
}

/** 下载图纸 */
function downloadDrawing(row: 楼栋结构图_列表数据) {
	console.log("下载图纸:", row.图纸路径);
	// TODO: 实现下载图纸的逻辑
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
						<ElButton type="info" @click="viewDrawing(row)">
							查看图纸
						</ElButton>
						<ElButton type="info" @click="downloadDrawing(row)">
							下载图纸
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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