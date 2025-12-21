<script lang="ts" setup>
definePage({
	meta: {
		title: "组织信息",
		icon: "mdi:domain",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.orgInfo"),
	},
});

import { ref, computed, onMounted, nextTick, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { cloneDeep } from "lodash-es";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";

import { ReTreeLineIcon } from "components/ReTreeLineIcon";
import { useReTreeLineIcon } from "components/ReTreeLineIcon/src/use-re-tree-line-icon.ts";
import type { TreeNodeWithIcon, TreeSelectEvent, ReTreeLineIconInstance } from "components/ReTreeLineIcon/src/types.ts";
import { ElMessage } from "element-plus";

import type { OrganizationTreeNode, Employee, EmployeeListQuery } from "@01s-11comm/type";
import { useEmployeeListQuery, useOrganizationTreeQuery } from "@/api/setting-manage/organize-manage/org-info";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

// 使用组织树查询 Hook
const { data: organizationTreeData, isFetching: treeLoading } = useOrganizationTreeQuery();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & EmployeeSearchForm = {
	employeeName: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

// 使用员工列表查询 Hook
const {
	tableData,
	pureTableProps,
	isFetching: tableLoading,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useEmployeeListQuery(plusSearchDefaultValues);

// 树组件状态
const treeRef = ref<ReTreeLineIconInstance | null>(null);

// 使用新的组合式API
const {
	selectedNode,
	hasSelection,
	selectedNodeName,
	searchKeyword,
	getSelectedNode,
	selectNode,
	clearSelection,
	toggleExpansion,
	searchNodes,
	resetTree,
	onMounted: onTreeMounted,
} = useReTreeLineIcon(treeRef, {
	watchSelection: true,
	autoSearch: false, // 我们手动控制搜索
});

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "姓名",
		prop: "name",
		width: 120,
	},
	{
		label: "手机号",
		prop: "phone",
		width: 140,
	},
	{
		label: "岗位",
		prop: "position",
		width: 120,
	},
	{
		label: "邮箱",
		prop: "email",
		width: 200,
	},
	{
		label: "地址",
		prop: "address",
		width: 200,
	},
	{
		label: "性别",
		prop: "gender",
		width: 80,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "关联员工",
	columns: columns.value,
});

// PlusSearch 搜索表单数据接口
interface EmployeeSearchForm {
	employeeName?: string;
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "员工名称",
		prop: "employeeName",
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

// 树组件搜索配置
const treeSearchOptions = {
	searchable: true,
	searchPlaceholder: "请输入组织名称",
};

// 树组件展开折叠配置
const treeExpansionOptions = {
	showExpansionControl: true,
	controlPosition: "dropdown" as const,
};

// ========== 事件处理函数 ==========

// 本地选中状态（可写）
const localSelectedOrg = ref<OrganizationTreeNode | null>(null);

// 测试异步函数
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

// 示例：如何使用组合式API获取树的状态
function demonstrateTreeAPI() {
	console.log("当前选中节点:", getSelectedNode());
	console.log("是否有选中:", hasSelection.value);
	console.log("选中节点名称:", selectedNodeName.value);
	console.log("搜索关键字:", searchKeyword.value);
}

// 树节点点击事件
function handleTreeNodeClick(event: TreeSelectEvent) {
	localSelectedOrg.value = event.selected ? (event.node as OrganizationTreeNode) : null;

	// 根据选中的组织加载关联员工
	if (localSelectedOrg.value) {
		loadEmployeesByOrg(localSelectedOrg.value);
	} else {
		// 取消选择时，加载所有或重置
		updateParams({ orgId: undefined, pageIndex: 1 });
	}
}

// 树选择变化事件
function handleTreeSelectionChange(node: TreeNodeWithIcon | null) {
	localSelectedOrg.value = node as OrganizationTreeNode | null;
}

// 根据组织加载员工
function loadEmployeesByOrg(org: OrganizationTreeNode) {
	updateParams({ orgId: org.id, pageIndex: 1 });
}

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
async function handleSearch() {
	updateParams({
		employeeName: plusSearchModel.value.employeeName,
		pageIndex: 1,
	});
}

// 组织操作
function handleAddOrg() {
	console.log("添加组织");
}

function handleEditOrg() {
	if (!localSelectedOrg.value) {
		ElMessage.warning("请先选择一个组织");
		return;
	}
	console.log("修改组织:", localSelectedOrg.value);
}

function handleDeleteOrg() {
	if (!localSelectedOrg.value) {
		ElMessage.warning("请先选择一个组织");
		return;
	}
	console.log("删除组织:", localSelectedOrg.value);
}

// 员工操作
function handleAddEmployee() {
	console.log("关联员工");
}

function handleExportDoc() {
	console.log("导出文档");
}

function handleEditEmployee(row: Employee) {
	console.log("编辑员工:", row);
}

function handleDeleteEmployee(row: Employee) {
	console.log("删除员工:", row);
}

// ========== 生命周期 ==========
onMounted(async () => {
	// 初始化树组件API
	nextTick(() => {
		onTreeMounted();
		// 演示API使用
		demonstrateTreeAPI();
	});
});
</script>

<template>
	<section class="org-info-container">
		<el-row :gutter="20" class="h-full">
			<!-- 左侧组织树 -->
			<el-col :span="6" class="left-content">
				<el-card shadow="never" class="h-full">
					<template #header>
						<div class="card-header flex items-center justify-between">
							<span class="font-medium">组织结构</span>
						</div>
					</template>

					<!-- 组织操作按钮 -->
					<div class="mb-4">
						<ElButton type="primary" @click="handleAddOrg">
							{{ transformI18n($t("common.buttons.add")) }}
						</ElButton>
						<ElButton type="warning" @click="handleEditOrg">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDeleteOrg">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</div>

					<!-- 使用新的树组件 -->
					<div class="tree-container">
						<ReTreeLineIcon
							ref="treeRef"
							:tree-data="organizationTreeData || []"
							:loading="treeLoading"
							:search-options="treeSearchOptions"
							:expansion-options="treeExpansionOptions"
							:default-expand-all="true"
							@node-click="handleTreeNodeClick"
							@selection-change="handleTreeSelectionChange"
						/>
					</div>
				</el-card>
			</el-col>

			<!-- 右侧员工管理 -->
			<el-col :span="18" class="right-content">
				<!-- PlusSearch 搜索栏 -->
				<PlusSearch
					v-model="plusSearchModel"
					:="plusSearchProps"
					:columns="plusSearchColumns"
					@search="handleSearch"
					@reset="handleReSearch"
				/>

				<!-- 员工表格区域 -->
				<PureTableBar :="pureTableBarProps" @refresh="doFetch">
					<template #buttons>
						<ElButton type="info" @click="handleExportDoc"> 文档 </ElButton>
						<ElButton type="primary" @click="handleAddEmployee">
							{{ transformI18n($t("common.buttons.add")) }}
						</ElButton>
					</template>

					<template #default="{ size, dynamicColumns }">
						<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
						<PureTable
							:="pureTableProps"
							:columns="dynamicColumns"
							:size="size"
							:loading="tableLoading"
							@page-size-change="handlePageSizeChange"
							@page-current-change="handleCurrentPageChange"
						>
							<template #operation="{ row }">
								<ElButton type="warning" @click="handleEditEmployee(row)">
									{{ transformI18n($t("common.buttons.edit")) }}
								</ElButton>
								<ElButton type="danger" @click="handleDeleteEmployee(row)">
									{{ transformI18n($t("common.buttons.del")) }}
								</ElButton>
							</template>
						</PureTable>
					</template>
				</PureTableBar>
			</el-col>
		</el-row>
	</section>
</template>

<style lang="scss" scoped>
.org-info-container {
	height: calc(100vh - 140px);
	overflow: hidden;

	.left-content,
	.right-content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.right-content {
		:deep(.el-card__body) {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
	}

	.tree-container {
		flex: 1;
		overflow: hidden;
		height: calc(100vh - 280px);
	}
}
</style>
