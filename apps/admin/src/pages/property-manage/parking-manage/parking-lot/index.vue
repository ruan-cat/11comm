<script lang="ts" setup>
definePage({
	meta: {
		title: "停车场管理",
		icon: "mdi:parking",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.parkingLot"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 车位信息_列表数据, type 车位信息_列表查询_VO, tableData as mockTableData } from "./test-data";

import { type 停车场表单Props, defaultForm, type 停车场表单_VO } from "./components/form";
import 停车场表单 from "./components/form.vue";
const 停车场表单Instance = ref<InstanceType<typeof 停车场表单> | null>(null);

/** 表格数据 */
const tableData = ref<车位信息_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "停车场编号",
		prop: "停车场编号",
		width: 120,
	},
	{
		label: "停车场类型",
		prop: "停车场类型",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		width: 120,
	},
	{
		label: "外部编码",
		prop: "外部编码",
		width: 120,
	},
	{
		label: "备注",
		prop: "备注",
		width: 150,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
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
	title: "停车场管理",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.停车场ID) {
			filteredData = filteredData.filter((item) => item.停车场ID.includes(plusSearchModel.value.停车场ID!));
		}
		if (plusSearchModel.value.停车场编号) {
			filteredData = filteredData.filter((item) => item.停车场编号.includes(plusSearchModel.value.停车场编号!));
		}
		if (plusSearchModel.value.停车场类型) {
			filteredData = filteredData.filter((item) => item.停车场类型 === plusSearchModel.value.停车场类型);
		}
		if (plusSearchModel.value.车位类型) {
			filteredData = filteredData.filter((item) => item.车位类型 === plusSearchModel.value.车位类型);
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
const plusSearchModelRef: FieldValues & 车位信息_列表查询_VO = {
	停车场ID: "",
	停车场编号: "",
	停车场类型: "",
	车位类型: "",
	面积: "",
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
	// 停车场ID
	{
		label: "停车场ID",
		prop: "停车场ID",
		valueType: "input",
	},

	// 停车场编号
	{
		label: "停车场编号",
		prop: "停车场编号",
		valueType: "input",
	},

	// 停车场类型
	{
		label: "停车场类型",
		prop: "停车场类型",
		valueType: "select",
		options: [
			{ label: "地面停车场", value: "地面停车场" },
			{ label: "地下停车场", value: "地下停车场" },
			{ label: "立体停车场", value: "立体停车场" },
			{ label: "路边停车位", value: "路边停车位" },
		],
	},

	// 车位类型
	{
		label: "车位类型",
		prop: "车位类型",
		valueType: "select",
		options: [
			{ label: "标准车位", value: "标准车位" },
			{ label: "大型车位", value: "大型车位" },
			{ label: "无障碍车位", value: "无障碍车位" },
			{ label: "充电桩车位", value: "充电桩车位" },
			{ label: "访客车位", value: "访客车位" },
		],
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
function openDialog(params: { mode: Mode; row?: 车位信息_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}停车场管理`;

	/** 业务对象 */
	const 车位信息_列表数据: 停车场表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					停车场编号: row?.停车场编号 || "",
					停车场类型: row?.停车场类型 || "地下停车场",
					车位类型: row?.车位类型 || "标准车位",
					外部编码: row?.外部编码 || "",
					备注: row?.备注 || "",
					停车场ID: row?.停车场ID || "",
					创建时间: row?.创建时间 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: 停车场表单Props = {
		form: 车位信息_列表数据,
		defaultValues: 车位信息_列表数据,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(停车场表单, {
				ref: 停车场表单Instance,
				...props,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = 停车场表单Instance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = 停车场表单Instance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					停车场表单Instance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await 停车场表单Instance.value?.plusFormInstance?.handleSubmit();
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
