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
	type BuildingSpaceStructureDiagramListItem,
	type BuildingSpaceStructureDiagramQueryParams,
	buildingStructureOptions,
	buildingStatusOptions,
} from "@01s-11comm/type";
import { useBuildingSpaceStructureDiagramListQuery } from "@/api/property-manage/community-manage/building-space-structure-diagram";
import { type BuildingSpaceStructureDiagramFormProps, defaultForm, type 楼栋结构图表单_VO } from "./components/form";
import BuildingSpaceStructureDiagramForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";

/** 表单组件实例 */
const buildingSpaceStructureDiagramFormInstance = ref<InstanceType<typeof BuildingSpaceStructureDiagramForm> | null>(
	null,
);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<BuildingSpaceStructureDiagramQueryParams> = {
	buildingId: "",
	buildingName: "",
	buildingStructure: undefined,
	status: undefined,
	constructionYear: "",
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
} = useBuildingSpaceStructureDiagramListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "楼栋编号",
		prop: "buildingId",
		width: 120,
	},
	{
		label: "楼栋名称",
		prop: "buildingName",
		width: 120,
	},
	{
		label: "总楼层",
		prop: "totalFloors",
		width: 100,
	},
	{
		label: "总户数",
		prop: "totalHouseholds",
		width: 100,
	},
	{
		label: "建筑面积",
		prop: "buildingArea",
		width: 120,
	},
	{
		label: "建筑结构",
		prop: "buildingStructure",
		width: 140,
	},
	{
		label: "建成年份",
		prop: "constructionYear",
		width: 100,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "最后更新时间",
		prop: "lastUpdateTime",
		width: 160,
	},
	{
		label: "负责人",
		prop: "personInCharge",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
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
	title: "楼栋结构图",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 楼栋编号 */
	{
		label: "楼栋编号",
		prop: "buildingId",
		valueType: "input",
	},

	/** 楼栋名称 */
	{
		label: "楼栋名称",
		prop: "buildingName",
		valueType: "input",
	},

	/** 建筑结构 */
	{
		label: "建筑结构",
		prop: "buildingStructure",
		valueType: "select",
		options: buildingStructureOptions,
	},

	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: buildingStatusOptions,
	},

	/** 建成年份 */
	{
		label: "建成年份",
		prop: "constructionYear",
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
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

const { gotoDetailPage } = useGotoDetailsPage();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: BuildingSpaceStructureDiagramListItem;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

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
	const title = `${modeText.value}楼栋结构图`;

	/** 业务对象 */
	const 楼栋结构图表单_VO: 楼栋结构图表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					楼栋编号: row?.buildingId || "",
					楼栋名称: row?.buildingName || "",
					总楼层: row?.totalFloors || 0,
					总户数: row?.totalHouseholds || 0,
					建筑面积: row?.buildingArea || 0,
					建筑结构: row?.buildingStructure || "",
					建成年份: row?.constructionYear || "",
					图纸路径: row?.drawingPath || "",
					状态: row?.status || "正常使用",
					负责人: row?.personInCharge || "",
					联系电话: row?.contactPhone || "",
					备注: row?.remarks || "",
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
function viewDrawing(row: BuildingSpaceStructureDiagramListItem) {
	console.log("查看图纸:", row.drawingPath);
	// TODO: 实现查看图纸的逻辑
}

/** 下载图纸 */
function downloadDrawing(row: BuildingSpaceStructureDiagramListItem) {
	console.log("下载图纸:", row.drawingPath);
	// TODO: 实现下载图纸的逻辑
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
						<ElButton type="info" @click="viewDrawing(row)"> 查看图纸 </ElButton>
						<ElButton type="info" @click="downloadDrawing(row)"> 下载图纸 </ElButton>
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
