<script lang="ts" setup>
definePage({
	meta: {
		title: "菜单目录",
		icon: "mdi:folder",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.catalog"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type 菜单目录_列表数据,
	type 菜单目录表单_VO,
	type 菜单目录_列表查询_VO,
	组类型选项,
	归属商户选项,
	tableData as allTableData,
} from "./test-data";
import {
	type CatalogFormProps,
	defaultForm,
} from "./components/form";
import CatalogForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<菜单目录_列表数据[]>([]);

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
		prop: "类型文本",
		width: 120,
	},
	{
		label: "归属商户",
		prop: "归属商户文本",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "更新时间",
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
	title: "菜单目录",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.name) {
			filteredData = filteredData.filter((item) =>
				item.name.includes(plusSearchModel.value.name!)
			);
		}
		if (plusSearchModel.value.groupType) {
			filteredData = filteredData.filter((item) => item.groupType === plusSearchModel.value.groupType);
		}
		if (plusSearchModel.value.storeType) {
			filteredData = filteredData.filter((item) => item.storeType === plusSearchModel.value.storeType);
		}

		// 更新总数
		pagination.value.total = filteredData.length;

		// 分页处理
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		// 更新表格配置
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		// TODO: 显示错误提示
	}
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 菜单目录_列表查询_VO = {
	name: "",
	groupType: "",
	storeType: "",
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
		options: 组类型选项,
	},

	// 归属商户
	{
		label: "归属商户",
		prop: "storeType",
		valueType: "select",
		options: 归属商户选项,
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
function openDialog(params: { mode: Mode; row?: 菜单目录_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 菜单目录表单_VO: 菜单目录表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					gid: row?.gid || "",
					icon: row?.icon || "",
					name: row?.name || "",
					seq: Number(row?.seq) || 0,
					description: "",
					groupType: row?.groupType || "",
					label: row?.label || "",
					storeType: row?.storeType || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: CatalogFormProps = {
		form: 菜单目录表单_VO,
		defaultValues: 菜单目录表单_VO,
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
						await loadTableData();
					}
				},
			},
		],
	});
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.view")) }}
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
