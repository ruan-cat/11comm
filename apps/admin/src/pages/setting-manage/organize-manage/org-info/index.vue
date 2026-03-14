<script lang="ts" setup>
definePage({
	meta: {
		// 组织信息
		title: "settingManage.organizeManage.orgInfo.pageTitle",
		icon: "mdi:domain",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.orgInfo"),
	},
});

import { nextTick, onMounted, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ReTreeLineIcon } from "components/ReTreeLineIcon";
import { useReTreeLineIcon } from "components/ReTreeLineIcon/src/use-re-tree-line-icon.ts";
import type { ReTreeLineIconInstance, TreeNodeWithIcon, TreeSelectEvent } from "components/ReTreeLineIcon/src/types.ts";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { useEmployeeListQuery, useOrganizationTreeQuery } from "@/api/setting-manage/organize-manage/org-info";
import type { Employee, OrganizationTreeNode } from "@01s-11comm/type";

interface EmployeeSearchForm {
	employeeName?: string;
}

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const { data: organizationTreeData, isFetching: treeLoading } = useOrganizationTreeQuery();

const plusSearchModelRef: FieldValues & EmployeeSearchForm = {
	employeeName: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching: tableLoading,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useEmployeeListQuery(plusSearchDefaultValues);

const treeRef = ref<ReTreeLineIconInstance | null>(null);

const {
	hasSelection,
	getSelectedNode,
	searchKeyword,
	selectedNodeName,
	selectNode,
	toggleExpansion,
	searchNodes,
	resetTree,
	onMounted: onTreeMounted,
} = useReTreeLineIcon(treeRef, {
	watchSelection: true,
	autoSearch: false,
});

const localSelectedOrg = ref<OrganizationTreeNode | null>(null);
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.orgInfo.fields.name"))),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.orgInfo.fields.phone"))),
		prop: "phone",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.orgInfo.fields.position"))),
		prop: "position",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.orgInfo.fields.email"))),
		prop: "email",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.orgInfo.fields.address"))),
		prop: "address",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.orgInfo.fields.gender"))),
		prop: "gender",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.organizeManage.orgInfo.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.orgInfo.search.employeeName")),
		prop: "employeeName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.orgInfo.search.employeeName")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

const treeSearchOptions = withLocale(() => ({
	searchable: true,
	searchPlaceholder: transformI18n($t("settingManage.organizeManage.orgInfo.search.orgNamePlaceholder")),
}));

const treeExpansionOptions = {
	showExpansionControl: true,
	controlPosition: "dropdown" as const,
};

function handleTreeNodeClick(event: TreeSelectEvent) {
	localSelectedOrg.value = event.selected ? (event.node as OrganizationTreeNode) : null;

	if (localSelectedOrg.value) {
		loadEmployeesByOrg(localSelectedOrg.value);
		return;
	}

	updateParams({ orgId: undefined, pageIndex: 1 });
}

function handleTreeSelectionChange(node: TreeNodeWithIcon | null) {
	localSelectedOrg.value = node as OrganizationTreeNode | null;
}

function loadEmployeesByOrg(org: OrganizationTreeNode) {
	updateParams({ orgId: org.id, pageIndex: 1 });
}

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		employeeName: plusSearchModel.value.employeeName,
		pageIndex: 1,
	});
}

function handleAddOrg() {
	void testAsync();
}

function handleEditOrg() {
	if (!localSelectedOrg.value) {
		ElMessage.warning(transformI18n($t("settingManage.organizeManage.common.messages.selectOrgFirst")));
		return;
	}

	void getSelectedNode();
}

function handleDeleteOrg() {
	if (!localSelectedOrg.value) {
		ElMessage.warning(transformI18n($t("settingManage.organizeManage.common.messages.selectOrgFirst")));
		return;
	}

	void localSelectedOrg.value;
}

function handleAddEmployee() {
	void testAsync();
}

function handleExportDoc() {
	void testAsync();
}

function handleEditEmployee(row: Employee) {
	void row;
}

function handleDeleteEmployee(row: Employee) {
	void row;
}

onMounted(async () => {
	await nextTick();
	onTreeMounted();
	void hasSelection.value;
	void selectedNodeName.value;
	void searchKeyword.value;
	void selectNode;
	void toggleExpansion;
	void searchNodes;
	void resetTree;
});
</script>

<template>
	<section :key="locale" class="org-info-container">
		<el-row :gutter="20" class="h-full">
			<el-col :span="6" class="left-content">
				<el-card shadow="never" class="h-full">
					<template #header>
						<div class="card-header flex items-center justify-between">
							<span class="font-medium">{{ transformI18n($t("settingManage.organizeManage.orgInfo.treeTitle")) }}</span>
						</div>
					</template>

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

			<el-col :span="18" class="right-content">
				<PlusSearch
					:key="locale"
					v-model="plusSearchModel"
					:="plusSearchProps"
					:columns="plusSearchColumns"
					:search-text="plusSearchButtonTexts.searchText"
					:reset-text="plusSearchButtonTexts.resetText"
					@search="handleSearch"
					@reset="handleReSearch"
				/>

				<PureTableBar :="pureTableBarProps" @refresh="doFetch">
					<template #buttons>
						<ElButton type="info" @click="handleExportDoc">
							{{ transformI18n($t("settingManage.organizeManage.common.buttons.document")) }}
						</ElButton>
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
