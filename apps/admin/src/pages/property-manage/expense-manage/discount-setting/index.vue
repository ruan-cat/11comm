<script lang="ts" setup>
definePage({
	meta: {
		title: "折扣设置",
		icon: "mdi:label-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountSetting"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import {
	type 折扣设置_列表数据,
	type 折扣设置_列表查询_VO,
	折扣类型Options,
	规则Options,
	tableData as allTableData,
} from "./test-data";
import { type DiscountSettingFormProps, defaultForm, type 折扣设置表单_VO } from "./components/form";
import DiscountSettingForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<折扣设置_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		prop: "折扣ID",
		label: "折扣ID",
		width: 120,
		fixed: true,
	},
	{
		prop: "折扣名称",
		label: "折扣名称",
		width: 200,
	},
	{
		prop: "折扣类型",
		label: "折扣类型",
		width: 200,
	},
	{
		prop: "规则名称",
		label: "规则名称",
		width: 200,
	},
	{
		prop: "规则",
		label: "规则",
		width: 200,
	},
	{
		prop: "创建时间",
		label: "创建时间",
		width: 200,
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
	title: "折扣设置",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 折扣设置_列表查询_VO = {
	折扣ID: "",
	折扣名称: "",
	折扣类型: "",
	规则名称: "",
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
	// 折扣ID
	{
		label: "折扣ID",
		prop: "折扣ID",
		valueType: "input",
	},
	// 折扣名称
	{
		label: "折扣名称",
		prop: "折扣名称",
		valueType: "input",
	},
	// 折扣类型
	{
		label: "折扣类型",
		prop: "折扣类型",
		valueType: "select",
		options: 折扣类型Options,
	},
	// 规则名称
	{
		label: "规则名称",
		prop: "规则名称",
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = allTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.折扣ID) {
			filteredData = filteredData.filter((item) => item.折扣ID.includes(plusSearchModel.value.折扣ID!));
		}
		if (plusSearchModel.value.折扣名称) {
			filteredData = filteredData.filter((item) => item.折扣名称.includes(plusSearchModel.value.折扣名称!));
		}
		if (plusSearchModel.value.折扣类型) {
			filteredData = filteredData.filter((item) => item.折扣类型 === plusSearchModel.value.折扣类型);
		}
		if (plusSearchModel.value.规则名称) {
			filteredData = filteredData.filter((item) => item.规则名称.includes(plusSearchModel.value.规则名称!));
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

// 弹框相关功能
const DiscountSettingFormInstance = ref<InstanceType<typeof DiscountSettingForm> | null>(null);
/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

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
function openDialog(params: { mode: Mode; row?: 折扣设置_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}折扣设置`;

	/** 业务对象 */
	const 业务对象: 折扣设置表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					折扣名称: row?.折扣名称 || "",
					折扣类型: row?.折扣类型 || "优惠",
					规则: row?.规则名称 || "",
					描述: row?.规则 || "",
				})
			: cloneDeep({
					...defaultForm,
					折扣名称: row?.折扣名称 || "",
					折扣类型: row?.折扣类型 || "优惠",
					规则: row?.规则名称 || "",
					描述: row?.规则 || "",
				});

	/** 表单组件需要的props */
	const formProps: DiscountSettingFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
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
			h(DiscountSettingForm, {
				ref: DiscountSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = DiscountSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = DiscountSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					DiscountSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await DiscountSettingFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
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
