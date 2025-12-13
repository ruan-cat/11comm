<script lang="ts" setup>
definePage({
	meta: {
		title: "合同甲方",
		icon: "mdi:account-group",
		roles: ["物业团队"],
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type FirstPartyFormProps, defaultForm, type 合同甲方表单_VO } from "./components/form";
import FirstPartyForm from "./components/form.vue";

/** 表单组件实例 */
const firstPartyFormInstance = ref<InstanceType<typeof FirstPartyForm> | null>(null);

/** 表格数据 */
const tableData = ref<合同甲方_列表数据[]>([]);

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.甲方) {
			filteredData = filteredData.filter((item) => item.甲方.includes(plusSearchModel.value.甲方!));
		}
		if (plusSearchModel.value.甲方联系人) {
			filteredData = filteredData.filter((item) => item.甲方联系人.includes(plusSearchModel.value.甲方联系人!));
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.联系电话.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.法定代表人) {
			filteredData = filteredData.filter((item) => item.法定代表人.includes(plusSearchModel.value.法定代表人!));
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

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

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "甲方",
		prop: "甲方",
		width: 200,
	},
	{
		label: "甲方联系人",
		prop: "甲方联系人",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 130,
	},
	{
		label: "地址",
		prop: "地址",
		minWidth: 250,
	},
	{
		label: "统一社会信用代码",
		prop: "统一社会信用代码",
		width: 180,
	},
	{
		label: "成立日期",
		prop: "成立日期",
		width: 120,
	},
	{
		label: "法定代表人",
		prop: "法定代表人",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同甲方",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 合同甲方_列表数据 = {
	甲方: "",
	甲方联系人: "",
	联系电话: "",
	地址: "",
	统一社会信用代码: "",
	成立日期: "",
	法定代表人: "",
	经营范围: "",
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
		label: "甲方",
		prop: "甲方",
		valueType: "input",
	},

	{
		label: "甲方联系人",
		prop: "甲方联系人",
		valueType: "input",
	},

	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
	},

	{
		label: "法定代表人",
		prop: "法定代表人",
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

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 合同甲方_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同甲方`;

	/** 业务对象 */
	const 合同甲方表单_VO: 合同甲方表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					甲方: row?.甲方 || "",
					甲方联系人: row?.甲方联系人 || "",
					联系电话: row?.联系电话 || "",
					地址: row?.地址 || "",
					统一社会信用代码: row?.统一社会信用代码 || "",
					成立日期: row?.成立日期 || "",
					法定代表人: row?.法定代表人 || "",
					经营范围: row?.经营范围 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: FirstPartyFormProps = {
		form: 合同甲方表单_VO,
		defaultValues: 合同甲方表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(FirstPartyForm, {
				ref: firstPartyFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = firstPartyFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = firstPartyFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					// 手动重置表单
					firstPartyFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await firstPartyFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="danger">
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