<script lang="ts" setup>
definePage({
	meta: {
		title: "devTeam.configManage.center.pageTitle",
		icon: "mdi:cog",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.center"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type ConfigCenterListItem,
	type ConfigCenterQueryParams,
	configTypeOptions,
	configStatusOptions,
} from "@01s-11comm/type";
import { openDialog } from "./components/dialog";
import { useConfigCenterListQuery } from "@/api/dev-team/config-manage/center";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
	status: "",
	configKey: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 配置项名称
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configName")),
		prop: "configName",
		valueType: "input",
	},

	// 配置类型
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configType")),
		prop: "configType",
		valueType: "select",
		options: configTypeOptions,
	},

	// 状态
	{
		label: transformI18n($t("devTeam.configManage.center.fields.status")),
		prop: "status",
		valueType: "select",
		options: configStatusOptions,
	},

	// 配置键名
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configKey")),
		prop: "configKey",
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
} = useConfigCenterListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configName")),
		prop: "configName",
		width: 150,
		fixed: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configType")),
		prop: "configType",
		width: 120,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configKey")),
		prop: "configKey",
		width: 200,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configValue")),
		prop: "configValue",
		width: 150,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.defaultValue")),
		prop: "defaultValue",
		width: 150,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configDescription")),
		prop: "configDescription",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.status")),
		prop: "status",
		width: 80,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.sortOrder")),
		prop: "sortOrder",
		width: 80,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.remark")),
		prop: "remark",
		minWidth: 150,
		showOverflowTooltip: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.createTime")),
		prop: "createTime",
		width: 160,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.updateTime")),
		prop: "updateTime",
		width: 160,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.creator")),
		prop: "creator",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github.com/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 200,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("devTeam.configManage.center.pageTitle")),
	columns: columns.value,
});

/** 查看详情 */
function viewDetails(row: ConfigCenterListItem) {
	console.log(transformI18n($t("devTeam.configManage.center.logs.viewDetails")), row);
	// TODO: 实现查看详情功能，可以打开一个只读的弹框显示完整信息
}

/** 复制配置 */
function copyConfig(row: ConfigCenterListItem) {
	console.log(transformI18n($t("devTeam.configManage.center.logs.copyConfig")), row);
	// TODO: 实现复制配置功能，可以基于当前配置创建新的配置
	// 预填充表单数据，但修改配置键名等唯一字段
}

/** 切换状态 */
function toggleStatus(row: ConfigCenterListItem) {
	console.log(transformI18n($t("devTeam.configManage.center.logs.toggleStatusAction")), row);
	// TODO: 实现状态切换功能
	// 可以直接调用API或打开确认弹框
	const newStatus = row.status === "enabled" ? "disabled" : "enabled";
	console.log(
		`${transformI18n($t("devTeam.configManage.center.logs.toggleStatus"))}: ${row.configName}, ${row.status} -> ${newStatus}`,
	);
}

/** 删除配置 */
function deleteConfig(row: ConfigCenterListItem) {
	console.log(transformI18n($t("devTeam.configManage.center.logs.deleteConfig")), row);
	// TODO: 实现删除功能，应该显示确认弹框
	// 确认后调用删除API并刷新列表
	console.log(
		`${transformI18n($t("devTeam.configManage.center.logs.confirmDelete"))}: ${row.configName} (${row.configKey})`,
	);
}

/** 导出配置 */
function exportConfig() {
	console.log(transformI18n($t("devTeam.configManage.center.logs.exportConfig")));
	// TODO: 实现导出功能
	// 可以导出当前搜索结果或全部配置
}

/** 导入配置 */
function importConfig() {
	console.log(transformI18n($t("devTeam.configManage.center.logs.importConfig")));
	// TODO: 实现导入功能
	// 可以打开文件选择弹框，支持Excel、JSON等格式
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
				<ElButton type="info" @click="exportConfig">
					{{ transformI18n($t("devTeam.configManage.center.buttons.export")) }}
				</ElButton>
				<ElButton type="info" @click="importConfig">
					{{ transformI18n($t("devTeam.configManage.center.buttons.import")) }}
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
						<ElButton type="primary" @click="viewDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="copyConfig(row)">
							{{ transformI18n($t("devTeam.configManage.center.buttons.copy")) }}
						</ElButton>
						<ElButton :type="row.status === 'enabled' ? 'warning' : 'info'" @click="toggleStatus(row)">
							{{
								row.status === "enabled"
									? transformI18n($t("devTeam.configManage.center.buttons.disable"))
									: transformI18n($t("devTeam.configManage.center.buttons.enable"))
							}}
						</ElButton>
						<ElButton type="danger" @click="deleteConfig(row)">
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
