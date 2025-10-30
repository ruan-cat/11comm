<script lang="ts" setup>
definePage({
	meta: {
		title: "车位信息",
		icon: "mdi:garage",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.carportInfo"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	tableData as mockTableData,
	停车场Options,
	车位状态Options,
	车位类型Options,
	type 车位信息_列表数据,
	type 车位信息_表单_VO,
} from "./test-data";
import { type CarportInfoFormProps, defaultForm } from "./components/form";
import CarportInfoForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";

/** 表格数据 */
const tableData = ref<车位信息_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "停车场",
		prop: "停车场",
		width: 120,
	},
	{
		label: "车位",
		prop: "车位",
		width: 120,
	},
	{
		label: "车位状态",
		prop: "车位状态",
		width: 120,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		width: 120,
	},
	{
		label: "面积",
		prop: "面积",
		width: 120,
	},
	{
		label: "业主姓名",
		prop: "业主姓名",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "车辆号码",
		prop: "车辆号码",
		width: 120,
	},
	{
		label: "购买日期",
		prop: "购买日期",
		width: 120,
	},
	{
		label: "到期日期",
		prop: "到期日期",
		width: 120,
	},
	{
		label: "月租费用",
		prop: "月租费用",
		width: 120,
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
	title: "车位信息",
	columns: columns.value,
});

interface 车位信息_列表查询_VO {
	停车场?: string;
	车位?: string;
	车位状态?: string;
	车位类型?: string;
	业主姓名?: string;
	联系电话?: string;
	车辆号码?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 车位信息_列表查询_VO = {
	停车场: "",
	车位: "",
	车位状态: "",
	车位类型: "",
	业主姓名: "",
	联系电话: "",
	车辆号码: "",
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
		label: "停车场",
		prop: "停车场",
		valueType: "select",
		options: 停车场Options,
	},
	{
		label: "车位编号",
		prop: "车位",
		valueType: "input",
	},
	{
		label: "车位状态",
		prop: "车位状态",
		valueType: "select",
		options: 车位状态Options,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		valueType: "select",
		options: 车位类型Options,
	},
	{
		label: "业主姓名",
		prop: "业主姓名",
		valueType: "input",
	},
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
	},
	{
		label: "车辆号码",
		prop: "车辆号码",
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
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.停车场) {
			filteredData = filteredData.filter((item) => item.停车场.includes(plusSearchModel.value.停车场!));
		}
		if (plusSearchModel.value.车位) {
			filteredData = filteredData.filter((item) => item.车位.includes(plusSearchModel.value.车位!));
		}
		if (plusSearchModel.value.车位状态) {
			filteredData = filteredData.filter((item) => item.车位状态 === plusSearchModel.value.车位状态);
		}
		if (plusSearchModel.value.车位类型) {
			filteredData = filteredData.filter((item) => item.车位类型 === plusSearchModel.value.车位类型);
		}
		if (plusSearchModel.value.业主姓名) {
			filteredData = filteredData.filter((item) => item.业主姓名?.includes(plusSearchModel.value.业主姓名!));
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.联系电话?.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.车辆号码) {
			filteredData = filteredData.filter((item) => item.车辆号码?.includes(plusSearchModel.value.车辆号码!));
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

/** 模式控制 */
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

/** 车位信息表单组件实例 */
const carportInfoFormInstance = ref<InstanceType<typeof CarportInfoForm> | null>(null);

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 车位信息_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 车位信息表单_VO: 车位信息_表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					停车场: row?.停车场 || "",
					车位: row?.车位 || "",
					车位状态: row?.车位状态 || "",
					车位类型: row?.车位类型 || "",
					面积: row?.面积 || "",
					业主姓名: row?.业主姓名 || "",
					联系电话: row?.联系电话 || "",
					车辆号码: row?.车辆号码 || "",
					购买日期: row?.购买日期 || "",
					到期日期: row?.到期日期 || "",
					月租费用: row?.月租费用 || 0,
					备注: row?.备注 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: CarportInfoFormProps = {
		form: 车位信息表单_VO,
		defaultValues: 车位信息表单_VO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}车位信息`;

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(CarportInfoForm, {
				ref: carportInfoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = carportInfoFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = carportInfoFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					carportInfoFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await carportInfoFormInstance.value.plusFormInstance.handleSubmit();
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

/** 新增车位信息 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑车位信息 */
function handleEdit(row: 车位信息_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 查看车位信息 */
function handleView(row: 车位信息_列表数据) {
	openDialog({ mode: "info", row });
}

/** 删除车位信息 */
async function handleDelete(row: 车位信息_列表数据) {
	// TODO: 实现删除功能
	consola.log("删除车位信息:", row);
}

/** 生命周期钩子 */
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
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
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

<style lang="scss" scoped>
.index-root {
}
</style>
