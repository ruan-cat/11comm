<script lang="ts" setup>
definePage({
	meta: {
		title: "排班设置",
		icon: "mdi:calendar-clock",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.schedulingSetting"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 排班设置_列表数据, type 排班设置_列表查询_VO, schedulingSettingTableData, 状态Options } from "./test-data";
import { type SchedulingSettingFormProps, defaultForm, type 排班设置表单_VO } from "./components/form";
import SchedulingSettingForm from "./components/form.vue";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表格数据 */
const tableData = ref<排班设置_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "班次名称",
		prop: "班次名称",
		minWidth: 200,
		fixed: true,
	},
	{
		label: "排班类型",
		prop: "排班类型",
		width: 120,
	},
	{
		label: "排班周期",
		prop: "排班周期",
		width: 100,
	},
	{
		label: "生效时间",
		prop: "生效时间",
		width: 180,
	},
	{
		label: "人员",
		prop: "人员",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 180,
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

/** 表格组件配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "排班设置",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 排班设置_列表查询_VO = {
	排班名称: "",
	状态: "",
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
		label: "排班名称",
		prop: "排班名称",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
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

/** 弹框组件实例 */
const schedulingSettingFormInstance = ref<InstanceType<typeof SchedulingSettingForm> | null>(null);

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 排班设置_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 排班设置表单_VO: 排班设置表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					班次名称: row?.班次名称 || "",
					排班类型: row?.排班类型 || "",
					排班周期: row?.排班周期 || 1,
					生效时间: row?.生效时间 || "",
					人员: row?.人员 || "",
					状态: row?.状态 || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: SchedulingSettingFormProps = {
		form: 排班设置表单_VO,
		defaultValues: 排班设置表单_VO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}排班设置`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(SchedulingSettingForm, {
				ref: schedulingSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = schedulingSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = schedulingSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					schedulingSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await schedulingSettingFormInstance.value.plusFormInstance.handleSubmit();
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = schedulingSettingTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.排班名称) {
			filteredData = filteredData.filter((item) => item.班次名称.includes(plusSearchModel.value.排班名称!));
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
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

/** 修改操作 */
function handleEdit(row: 排班设置_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 删除操作 */
function handleDelete(row: 排班设置_列表数据) {
	console.log("删除排班", row);
}

/** 停用/启用操作 */
function handleToggleStatus(row: 排班设置_列表数据) {
	const newStatus = row.状态 === "启用" ? "停用" : "启用";
	console.log(`${row.状态 === "启用" ? "停用" : "启用"}排班`, row);

	// 更新状态
	const index = tableData.value.findIndex((item) => item.班次名称 === row.班次名称 && item.创建时间 === row.创建时间);
	if (index > -1) {
		tableData.value[index].状态 = newStatus;
		message(`排班已${newStatus}`, { type: "success" });
	}
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton :type="row.状态 === '启用' ? 'info' : 'primary'" @click="handleToggleStatus(row)">
							{{ row.状态 === "启用" ? "停用" : "启用" }}
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