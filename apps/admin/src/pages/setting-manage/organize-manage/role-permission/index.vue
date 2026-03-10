<script lang="ts" setup>
definePage({
	meta: {
		// 角色权限
		title: "settingManage.organizeManage.rolePermission.pageTitle",
		icon: "mdi:shield-key",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.rolePermission"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { h } from "vue";

import { type RolePermissionFormProps, defaultForm } from "./components/form";
import type { RolePermissionFormVO } from "@01s-11comm/type";
import RolePermissionForm from "./components/form.vue";
import type { RolePermission, RolePermissionListQuery } from "@01s-11comm/type";
import { useRolePermissionListQuery } from "@/api/setting-manage/organize-manage/role-permission";
import { addDialog, closeDialog } from "@/components/ReDialog";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<RolePermissionListQuery> = {
	name: "",
	code: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

// 使用角色权限列表查询 Hook
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useRolePermissionListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.name")),
		prop: "name",
		width: 150,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.code")),
		prop: "code",
		width: 150,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.status")),
		prop: "enabled",
		width: 100,
		cellRenderer: ({ row }) =>
			row.enabled
				? transformI18n($t("settingManage.organizeManage.rolePermission.status.enabled"))
				: transformI18n($t("settingManage.organizeManage.rolePermission.status.disabled")),
	},
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.description")),
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

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("settingManage.organizeManage.rolePermission.tableTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.code")),
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
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
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
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					id: row?.id || "",
					name: row?.name || "",
					code: row?.code || "",
					enabled: row?.enabled ?? true,
					description: row?.description || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: RolePermissionFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}${transformI18n($t("settingManage.organizeManage.rolePermission.dialogTitle"))}`;

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
							doFetch();
						}
					}
				},
			},
		],
	});
}

// ========== 事件处理函数 ==========

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

// 表格操作函数
function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: RolePermission) {
	openDialog({ mode: "edit", row });
}

function handleDelete(row: RolePermission) {
	ElMessage.warning(
		transformI18n($t("settingManage.organizeManage.common.messages.deletePending", { name: row.name })),
	);
}

function handleViewPermissions(row: RolePermission) {
	ElMessage.info(
		transformI18n($t("settingManage.organizeManage.common.messages.viewPermissionPending", { name: row.name })),
	);
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
		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="handleViewPermissions(row)">
							{{ transformI18n($t("settingManage.organizeManage.common.buttons.permissionConfig")) }}
						</ElButton>
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

<style lang="scss" scoped></style>
