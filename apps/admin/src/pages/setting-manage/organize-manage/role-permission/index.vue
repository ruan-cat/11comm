<script lang="ts" setup>
definePage({
	meta: {
		title: "角色权限",
		icon: "mdi:shield-key",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.rolePermission"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { cloneDeep } from "lodash-es";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { h } from "vue";


import { type RolePermissionFormProps, defaultForm, type 角色权限表单_VO } from "./components/form";
import RolePermissionForm from "./components/form.vue";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

// 表格数据
const tableData = ref<角色权限[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "角色名称",
		prop: "角色名称",
		width: 150,
	},
	{
		label: "角色编码",
		prop: "角色编码",
		width: 150,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "描述",
		prop: "描述",
		minWidth: 200,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 180,
	},
	{
		label: "更新时间",
		prop: "更新时间",
		width: 180,
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "角色权限管理",
	columns: columns.value,
});

// PlusSearch 搜索表单数据接口
interface RolePermissionSearchForm extends 角色权限_列表查询_VO {}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RolePermissionSearchForm = {
	角色名称: "",
	状态: undefined,
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
		label: "角色名称",
		prop: "角色名称",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
		],
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

// ========== 命令式弹框相关 ==========

// 表单组件实例
const rolePermissionFormInstance = ref<InstanceType<typeof RolePermissionForm> | null>(null);

// 测试异步函数
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
function openDialog(params: { mode: Mode; row?: 角色权限 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 角色权限表单VO: 角色权限表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					id: row?.id || "",
					角色名称: row?.角色名称 || "",
					角色编码: row?.角色编码 || "",
					状态: row?.状态 || "启用",
					描述: row?.描述 || "",
					权限列表: row?.权限列表 || [],
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: RolePermissionFormProps = {
		form: 角色权限表单VO,
		defaultValues: 角色权限表单VO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}角色权限`;

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(RolePermissionForm, {
				ref: rolePermissionFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = rolePermissionFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = rolePermissionFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					rolePermissionFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await rolePermissionFormInstance.value.plusFormInstance.handleSubmit();
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

// ========== 事件处理函数 ==========

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = tableData.value;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.角色名称) {
			filteredData = filteredData.filter((item) => item.角色名称.includes(plusSearchModel.value.角色名称!));
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = paginatedData;
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

// 表格操作函数
function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: 角色权限) {
	openDialog({ mode: "edit", row });
}

function handleDelete(row: 角色权限) {
	ElMessage.warning(`删除功能暂未实现: ${row.角色名称}`);
}

function handleViewPermissions(row: 角色权限) {
	ElMessage.info(`查看权限功能暂未实现: ${row.角色名称}`);
}

// ========== 生命周期 ==========
onMounted(async () => {
	// 加载表格数据
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<!-- PlusSearch 搜索栏 -->
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<!-- 表格区域 -->
		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="handleViewPermissions(row)"> 权限配置 </ElButton>
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

<style lang="scss" scoped>
.index-root {
}
</style>
