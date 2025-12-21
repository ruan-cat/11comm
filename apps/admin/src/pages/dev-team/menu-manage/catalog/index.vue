<script lang="ts" setup>
definePage({
	meta: {
		title: "菜单目录",
		icon: "mdi:folder",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.catalog"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type MenuCatalogListItem,
	type MenuCatalogQueryParams,
	type MenuCatalogFormData,
	groupTypeOptions,
	storeTypeOptions,
} from "@01s-11comm/type";
import { useMenuCatalogListQuery } from "@/api/dev-team/menu-manage/catalog";
import { type CatalogFormProps, defaultForm } from "./components/form";
import CatalogForm from "./components/form.vue";
import { type RemovePageIndexAndPageSize } from "@/utils/remove-pageIndex-and-pageSize";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<MenuCatalogQueryParams> = {
	name: "",
	type: "",
	status: "",
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
} = useMenuCatalogListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "菜单组名称",
		prop: "name",
		width: 150,
		fixed: true,
	},
	{
		label: "图标",
		prop: "icon",
		width: 120,
	},
	{
		label: "标签",
		prop: "label",
		width: 100,
	},
	{
		label: "序列",
		prop: "seq",
		width: 80,
	},
	{
		label: "组类型",
		prop: "typeText",
		width: 120,
	},
	{
		label: "归属商户",
		prop: "storeTypeText",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 160,
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
	title: "菜单目录",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 菜单组名称
	{
		label: "菜单组名称",
		prop: "name",
		valueType: "input",
	},

	// 组类型
	{
		label: "组类型",
		prop: "groupType",
		valueType: "select",
		options: groupTypeOptions,
	},

	// 归属商户
	{
		label: "归属商户",
		prop: "storeType",
		valueType: "select",
		options: storeTypeOptions,
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const catalogFormInstance = ref<InstanceType<typeof CatalogForm> | null>(null);

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
function openDialog(params: { mode: Mode; row?: MenuCatalogListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const menuCatalogFormData: MenuCatalogFormData = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					gid: row?.gid || "",
					icon: row?.icon || "",
					name: row?.name || "",
					seq: Number(row?.seq) || 0,
					description: "",
					groupType: row?.groupType || "system",
					label: row?.label || "",
					storeType: row?.storeType || "property",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: CatalogFormProps = {
		form: menuCatalogFormData,
		defaultValues: menuCatalogFormData,
	};

	/** 弹框标题 */
	const title = `${modeText.value}菜单目录`;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(CatalogForm, {
				ref: catalogFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = catalogFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = catalogFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					catalogFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await catalogFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						doFetch();
					}
				},
			},
		],
	});
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
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
