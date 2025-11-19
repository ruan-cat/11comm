<script lang="ts" setup>
definePage({
	meta: {
		title: "字典",
		icon: "mdi:book",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.dictionary"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 字典_列表数据, type 字典_列表查询_VO, tableData as mockTableData } from "./test-data";

import { type DictionaryFormProps, defaultForm, type 字典表单_VO } from "./components/form";
import DictionaryForm from "./components/form.vue";
const dictionaryFormInstance = ref<InstanceType<typeof DictionaryForm> | null>(null);

/** 表格数据 */
const tableData = ref<字典_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "字典名称",
		prop: "字典名称",
		width: 180,
	},
	{
		label: "字典编码",
		prop: "字典编码",
		width: 150,
	},
	{
		label: "字典类型",
		prop: "字典类型",
		width: 120,
	},
	{
		label: "字典项数量",
		prop: "字典项数量",
		width: 120,
	},
	{
		label: "字典描述",
		prop: "字典描述",
		width: 200,
	},
	{
		label: "是否启用",
		prop: "是否启用",
		width: 100,
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
		label: "创建人",
		prop: "创建人",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 320,
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
	title: "字典",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 字典_列表查询_VO = {
	字典名称: "",
	字典编码: "",
	字典类型: "",
	是否启用: "",
	创建时间范围: ["", ""],
	创建开始时间: "",
	创建结束时间: "",
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
	// 字典名称
	{
		label: "字典名称",
		prop: "字典名称",
		valueType: "input",
	},

	// 字典编码
	{
		label: "字典编码",
		prop: "字典编码",
		valueType: "input",
	},

	// 字典类型
	{
		label: "字典类型",
		prop: "字典类型",
		valueType: "select",
		options: mockTableData.reduce(
			(acc, item) => {
				if (!acc.some((option) => option.value === item.字典类型)) {
					acc.push({ label: item.字典类型, value: item.字典类型 });
				}
				return acc;
			},
			[] as { label: string; value: string }[],
		),
	},

	// 是否启用
	{
		label: "是否启用",
		prop: "是否启用",
		valueType: "select",
		options: mockTableData.reduce(
			(acc, item) => {
				if (!acc.some((option) => option.value === item.是否启用)) {
					acc.push({ label: item.是否启用, value: item.是否启用 });
				}
				return acc;
			},
			[] as { label: string; value: string }[],
		),
	},

	// 创建时间范围
	{
		label: "创建时间范围",
		prop: "创建时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.创建开始时间 = value?.[0] ?? "";
				plusSearchModel.value.创建结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.创建开始时间 = "";
				plusSearchModel.value.创建结束时间 = "";
			},
		},
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.字典名称) {
			filteredData = filteredData.filter((item) => item.字典名称.includes(plusSearchModel.value.字典名称!));
		}
		if (plusSearchModel.value.字典编码) {
			filteredData = filteredData.filter((item) => item.字典编码.includes(plusSearchModel.value.字典编码!));
		}
		if (plusSearchModel.value.字典类型) {
			filteredData = filteredData.filter((item) => item.字典类型 === plusSearchModel.value.字典类型);
		}
		if (plusSearchModel.value.是否启用) {
			filteredData = filteredData.filter((item) => item.是否启用 === plusSearchModel.value.是否启用);
		}
		if (plusSearchModel.value.创建开始时间 && plusSearchModel.value.创建结束时间) {
			filteredData = filteredData.filter((item) => {
				const createTime = new Date(item.创建时间).getTime();
				const startTime = new Date(plusSearchModel.value.创建开始时间!).getTime();
				const endTime = new Date(plusSearchModel.value.创建结束时间!).getTime();
				return createTime >= startTime && createTime <= endTime;
			});
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
function openDialog(params: { mode: Mode; row?: 字典_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}字典`;

	/** 业务对象 */
	const 字典表单_VO: 字典表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					字典名称: row?.字典名称 || "",
					字典编码: row?.字典编码 || "",
					字典类型: row?.字典类型 || "",
					字典描述: row?.字典描述 || "",
					是否启用: row?.是否启用 || "",
					备注: row?.备注 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: DictionaryFormProps = {
		form: 字典表单_VO,
		defaultValues: 字典表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(DictionaryForm, {
				ref: dictionaryFormInstance,
				...props,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = dictionaryFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = dictionaryFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					dictionaryFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await dictionaryFormInstance.value?.plusFormInstance?.handleSubmit();
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

const { gotoDetailPage } = useGotoDetailsPage();

/** 跳转到字典项管理页面 */
function gotoDictionaryItemsPage(row: 字典_列表数据) {
	// @ts-ignore 未来需要修复类型错误 看情况添加详情页
	gotoDetailPage({
		name: "dev-team-config-manage--detail-page-dictionary-items-[id]",
		params: {
			id: row.id,
		},
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.view")) }} </ElButton>
						<ElButton type="info" @click="gotoDictionaryItemsPage(row)"> 字典项管理 </ElButton>
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
