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

import { type RolePermissionFormProps, defaultForm, type RolePermissionFormVO } from "./components/form";
import RolePermissionForm from "./components/form.vue";
import type { RolePermission, RolePermissionListQuery } from "@01s-11comm/type";
import { useRolePermissionListQuery } from "@/api/setting-manage/organize-manage/role-permission";
import { addDialog, closeDialog } from "@/components/ReDialog";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

// 使用角色权限列表查询 Hook
const { tableData, total, pageIndex, pageSize, isLoading, updateParams, refetch } = useRolePermissionListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "角色名称",
		prop: "name",
		width: 150,
	},
	{
		label: "角色编码",
		prop: "code",
		width: 150,
	},
	{
		label: "状态",
		prop: "enabled",
		width: 100,
		cellRenderer: ({ row }) => (row.enabled ? "启用" : "禁用"),
	},
	{
		label: "描述",
		prop: "description",
		minWidth: 200,
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
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 表格组件 配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: columns.value,
	pagination: pagination.value,
	loading: isLoading.value,
}));

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "角色权限管理",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RolePermissionListQuery = {
	name: "",
	code: "",
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
		prop: "name",
		valueType: "input",
	},
	{
		label: "角色编码",
		prop: "code",
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

const defaultAddDialogParams = {
	width: "50%",
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	contentRenderer: () => h("div"),
};

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: RolePermission }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formVO: RolePermissionFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					id: row?.id || "",
					name: row?.name || "",
					code: row?.code || "",
					enabled: row?.enabled ?? true,
					description: row?.description || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: RolePermissionFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}角色权限`;

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
			const formComputed = rolePermissionFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = rolePermissionFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					rolePermissionFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (rolePermissionFormInstance.value?.plusFormInstance) {
						const res = await rolePermissionFormInstance.value.plusFormInstance.handleSubmit();
						if (res) {
							button.btn.loading = true;
							await testAsync();
							button.btn.loading = false;
							closeDialog(options, index);
							refetch();
						}
					}
				},
			},
		],
	});
}

// ========== 事件处理函数 ==========

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	updateParams({
		name: undefined,
		code: undefined,
		pageIndex: 1,
	});
}

/** 执行搜索 */
async function handleSearch() {
	updateParams({
		name: plusSearchModel.value.name,
		code: plusSearchModel.value.code,
		pageIndex: 1,
	});
}

/** 处理页数变化 */
async function handlePageSizeChange(val: number) {
	pageSize.value = val;
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(val: number) {
	pageIndex.value = val;
}

// 表格操作函数
function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: RolePermission) {
	openDialog({ mode: "edit", row });
}

function handleDelete(row: RolePermission) {
	ElMessage.warning(`删除功能暂未实现: ${row.name}`);
}

function handleViewPermissions(row: RolePermission) {
	ElMessage.info(`查看权限功能暂未实现: ${row.name}`);
}

// ========== 生命周期 ==========
onMounted(async () => {
	// 加载表格数据 (auto loaded by hook)
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
