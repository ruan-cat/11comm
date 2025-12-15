<script lang="ts" setup>
definePage({
	meta: {
		title: "配置项",
		icon: "tabler:settings-2",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.item"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type ConfigItemListItem,
	type ConfigItemQueryParams,
	configItemTypeOptions,
	itemEnableStatusOptions,
} from "@01s-11comm/type";
import { useConfigItemListQuery } from "@/api/dev-team/config-manage/item";

import { type ConfigItemFormProps, type ConfigItemFormVO, defaultForm } from "./components/form";
import ConfigItemForm from "./components/form.vue";
const configItemFormInstance = ref<InstanceType<typeof ConfigItemForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useConfigItemListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "配置项名称",
		prop: "configName",
		width: 150,
		fixed: true,
	},
	{
		label: "配置项编码",
		prop: "configCode",
		width: 150,
	},
	{
		label: "配置项类型",
		prop: "configType",
		width: 120,
	},
	{
		label: "配置项值",
		prop: "configValue",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: "配置项描述",
		prop: "description",
		width: 180,
		showOverflowTooltip: true,
	},
	{
		label: "是否启用",
		prop: "isEnabled",
		width: 100,
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
		label: "创建人",
		prop: "creator",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 260,
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

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
}));

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "配置项",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ConfigItemQueryParams> = {
	configName: "",
	configCode: "",
	configType: "",
	isEnabled: "",
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
	// 配置项名称
	{
		label: "配置项名称",
		prop: "configName",
		valueType: "input",
	},

	// 配置项编码
	{
		label: "配置项编码",
		prop: "configCode",
		valueType: "input",
	},

	// 配置项类型
	{
		label: "配置项类型",
		prop: "configType",
		valueType: "select",
		options: configItemTypeOptions,
	},

	// 是否启用
	{
		label: "是否启用",
		prop: "isEnabled",
		valueType: "select",
		options: itemEnableStatusOptions,
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
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<ConfigItemQueryParams>);
}

const { modeText, setMode, isAdd, isEdit } = useMode();

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
function openDialog(params: { mode: Mode; row?: ConfigItemListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}配置项`;

	/** 业务对象 */
	const formData: ConfigItemFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					configItemName: row?.configName || "",
					configItemCode: row?.configCode || "",
					configItemType: row?.configType || "",
					configItemValue: row?.configValue || "",
					configItemDescription: row?.description || "",
					isEnabled: row?.isEnabled || "",
					remark: row?.remark || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: ConfigItemFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ConfigItemForm, {
				ref: configItemFormInstance,
				...props,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = configItemFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = configItemFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					configItemFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await configItemFormInstance.value?.plusFormInstance?.handleSubmit();
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

		<PureTableBar :="pureTableBarProps" @refresh="refetch">
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.view")) }} </ElButton>
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
