<script lang="ts" setup>
definePage({
	meta: {
		title: "组织信息",
		icon: "f7:menu",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.orgInfo"),
	},
});

// TODO: 生成组织信息的接口，并对接此处的接口。

import { ref, computed, reactive, onMounted, nextTick } from "vue";
import { transformI18n } from "plugins/i18n.ts";
import { useRenderIcon } from "components/ReIcon/src/hooks.ts";
import { ReTreeLineIcon } from "components/ReTreeLineIcon";
import { useReTreeLineIcon } from "components/ReTreeLineIcon/src/use-re-tree-line-icon.ts";
import type { TreeNodeWithIcon, TreeSelectEvent, ReTreeLineIconInstance } from "components/ReTreeLineIcon/src/types.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	mockOrganizationTreeData,
	mockEmployeeData,
	getEmployeesByOrgId,
	type OrganizationTreeNode,
	type Employee,
} from "./test-data.ts";

// 组织树数据已经兼容TreeNodeWithIcon接口，直接使用
const organizationTreeData = ref<OrganizationTreeNode[]>(mockOrganizationTreeData);

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

// 树组件加载状态
const treeLoading = ref(false);

const employeeData = ref<Employee[]>(mockEmployeeData);

// 表格相关配置
const columns = ref<TableColumnList>([
	{
		label: "姓名",
		prop: "name",
		width: 120,
		fixed: true,
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
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 200,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 29,
});

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: employeeData.value,
	columns: [],
	pagination: pagination.value,
});

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
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & EmployeeSearchForm = {
	employeeName: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 员工名称
	{
		label: "员工名称",
		prop: "employeeName",
		valueType: "input",
		fieldProps: {
			placeholder: "请填写员工名称",
		},
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 100,
	labelPosition: "right",
	hasUnfold: false, // 隐藏展开收缩按钮
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
	}
}

// 树选择变化事件
function handleTreeSelectionChange(node: TreeNodeWithIcon | null) {
	localSelectedOrg.value = node as OrganizationTreeNode | null;
}

// 根据组织加载员工
function loadEmployeesByOrg(org: OrganizationTreeNode) {
	// 这里应该调用API获取该组织下的员工
	// console.log("加载组织员工:", org.name);
	console.log("加载组织员工:", getSelectedNode()?.name);
}

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
}

// 搜索员工
function handleSearch() {
	console.log("搜索员工:", plusSearchModel.value);
}

// 重新搜索
async function handleReSearch() {
	console.log("重新搜索");
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
onMounted(() => {
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
						<el-button type="primary" :icon="useRenderIcon('ep:plus')" @click="handleAddOrg">
							{{ transformI18n($t("common.buttons.add")) }}
						</el-button>
						<el-button type="warning" :icon="useRenderIcon('ep:edit')" @click="handleEditOrg">
							{{ transformI18n($t("common.buttons.edit")) }}
						</el-button>
						<el-button type="danger" :icon="useRenderIcon('ep:delete')" @click="handleDeleteOrg">
							{{ transformI18n($t("common.buttons.del")) }}
						</el-button>
					</div>

					<!-- 使用新的树组件 -->
					<div class="tree-container">
						<ReTreeLineIcon
							ref="treeRef"
							:tree-data="organizationTreeData"
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
				<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

				<!-- 员工表格区域 -->
				<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
					<template #buttons>
						<el-button type="info" :icon="useRenderIcon('ep:document')" @click="handleExportDoc"> 文档 </el-button>
						<el-button type="primary" :icon="useRenderIcon('ep:plus')" @click="handleAddEmployee">
							{{ transformI18n($t("common.buttons.add")) }}
						</el-button>
					</template>

					<template #default="{ size, dynamicColumns }">
						<!-- @vue-ignore -->
						<PureTable
							:="pureTableProps"
							:columns="dynamicColumns"
							:size="size"
							@page-size-change="handlePageSizeChange"
							@page-current-change="handleCurrentPageChange"
						>
							<template #operation="{ row }">
								<el-button type="warning" :icon="useRenderIcon('ep:edit')" @click="handleEditEmployee(row)">
									{{ transformI18n($t("common.buttons.edit")) }}
								</el-button>
								<el-button type="danger" :icon="useRenderIcon('ep:delete')" @click="handleDeleteEmployee(row)">
									{{ transformI18n($t("common.buttons.del")) }}
								</el-button>
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
