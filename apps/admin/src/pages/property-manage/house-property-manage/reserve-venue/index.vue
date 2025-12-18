<script lang="ts" setup>
definePage({
	meta: {
		title: "场地预约",
		icon: "mdi:calendar-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.reserveVenue"),
	},
});

import { ref, computed, watch, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type ReserveVenueFormProps, defaultForm } from "./components/form";
import ReserveVenueForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";

const reserveVenueFormInstance = ref<InstanceType<typeof ReserveVenueForm> | null>(null);

/** 表格数据 */
const tableData = ref<场地预约_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "预约人",
		prop: "预约人",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 130,
	},
	{
		label: "预约时间",
		prop: "预约时间",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 100,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 100,
	},
	{
		label: "场地类型",
		prop: "场地类型",
		width: 100,
	},
	{
		label: "预约状态",
		prop: "预约状态",
		width: 100,
	},
	{
		label: "使用人数",
		prop: "使用人数",
		width: 100,
	},
	{
		label: "备注",
		prop: "备注",
		minWidth: 150,
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.预约人) {
			filteredData = filteredData.filter((item) => item.预约人.includes(plusSearchModel.value.预约人!));
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.联系电话.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.预约时间) {
			filteredData = filteredData.filter((item) => item.预约时间 === plusSearchModel.value.预约时间);
		}
		if (plusSearchModel.value.场地类型) {
			filteredData = filteredData.filter((item) => item.场地类型 === plusSearchModel.value.场地类型);
		}
		if (plusSearchModel.value.预约状态) {
			filteredData = filteredData.filter((item) => item.预约状态 === plusSearchModel.value.预约状态);
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
	title: "场地预约",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 场地预约_列表查询_VO = {
	预约人: "",
	联系电话: "",
	预约时间: "",
	场地类型: "",
	预约状态: "",
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
	// 预约人
	{
		label: "预约人",
		prop: "预约人",
		valueType: "input",
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
	},

	// 预约时间
	{
		label: "预约时间",
		prop: "预约时间",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},

	// 场地类型
	{
		label: "场地类型",
		prop: "场地类型",
		valueType: "select",
		options: 场地类型Options.map((item) => ({ label: item.label, value: item.value })),
	},

	// 预约状态
	{
		label: "预约状态",
		prop: "预约状态",
		valueType: "select",
		options: 预约状态Options.map((item) => ({ label: item.label, value: item.value })),
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
const { mode, modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 场地预约_列表数据;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}场地预约`;

	/** 业务对象 */
	const 场地预约VO: 场地预约_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				预约人: row?.预约人 || "",
				联系电话: row?.联系电话 || "",
				预约时间: row?.预约时间 || "",
				开始时间: row?.开始时间 || "",
				结束时间: row?.结束时间 || "",
				场地类型: row?.场地类型 || "篮球馆",
				预约状态: row?.预约状态 || "待审核",
				使用人数: row?.使用人数 || 1,
				备注: row?.备注 || "",
			});

	/** 表单组件需要的props */
	const props: ReserveVenueFormProps = {
		form: 场地预约VO,
		defaultValues: 场地预约VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(ReserveVenueForm, {
				ref: reserveVenueFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reserveVenueFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = reserveVenueFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					reserveVenueFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reserveVenueFormInstance.value?.plusFormInstance?.handleSubmit();
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
