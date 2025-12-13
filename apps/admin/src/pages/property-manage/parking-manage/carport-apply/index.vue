<script lang="ts" setup>
definePage({
	meta: {
		title: "车位申请",
		icon: "mdi:clipboard-text-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportApply"),
	},
});

import { ref, computed, h, onMounted } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { transformI18n } from "@/plugins/i18n";

import { type CarportApplyFormProps, defaultForm } from "./components/form";
import CarportApplyForm from "./components/form.vue";
/** 表单组件实例 */
const carportApplyFormInstance = ref<InstanceType<typeof CarportApplyForm> | null>(null);

/** 表格数据 */
const tableData = ref<车位申请_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "申请ID",
		prop: "申请ID",
		width: 120,
	},
	{
		label: "车牌号",
		prop: "车牌号",
		width: 120,
	},
	{
		label: "停车位",
		prop: "停车位",
		width: 120,
	},
	{
		label: "汽车品牌",
		prop: "汽车品牌",
		width: 120,
	},
	{
		label: "车辆类型",
		prop: "车辆类型",
		width: 120,
	},
	{
		label: "颜色",
		prop: "颜色",
		width: 120,
	},
	{
		label: "起租时间",
		prop: "起租时间",
		width: 120,
	},
	{
		label: "结租时间",
		prop: "结租时间",
		width: 120,
	},
	{
		label: "申请人",
		prop: "申请人",
		width: 120,
	},
	{
		label: "手机号",
		prop: "手机号",
		width: 120,
	},
	{
		label: "审核结果",
		prop: "审核结果",
		width: 120,
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
	title: "车位申请",
	columns: columns.value,
});
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 车位申请_列表查询_VO = {
	车牌号: "",
	汽车品牌: "",
	手机号: "",
	审核结果: "",
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
	// 车牌号
	{
		label: "车牌号",
		prop: "车牌号",
		valueType: "input",
	},

	// 汽车品牌
	{
		label: "汽车品牌",
		prop: "汽车品牌",
		valueType: "select",
		options: 汽车品牌Options,
	},

	// 手机号
	{
		label: "手机号",
		prop: "手机号",
		valueType: "input",
	},

	// 审核结果
	{
		label: "审核结果",
		prop: "审核结果",
		valueType: "select",
		options: 审核结果Options,
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
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.车牌号) {
			filteredData = filteredData.filter((item) => item.车牌号.includes(plusSearchModel.value.车牌号!));
		}
		if (plusSearchModel.value.汽车品牌) {
			filteredData = filteredData.filter((item) => item.汽车品牌 === plusSearchModel.value.汽车品牌);
		}
		if (plusSearchModel.value.手机号) {
			filteredData = filteredData.filter((item) => item.手机号.includes(plusSearchModel.value.手机号!));
		}
		if (plusSearchModel.value.审核结果) {
			filteredData = filteredData.filter((item) => item.审核结果 === plusSearchModel.value.审核结果);
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 车位申请_列表数据;
}

const { mode, modeText, setMode, isAdd } = useMode();

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
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}车位申请`;

	/** 业务对象 */
	const 车位申请表单_VO: 车位申请_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: CarportApplyFormProps = {
		form: 车位申请表单_VO,
		defaultValues: 车位申请表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(CarportApplyForm, {
				ref: carportApplyFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = carportApplyFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportApplyFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportApplyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await carportApplyFormInstance.value.plusFormInstance.handleSubmit();
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
