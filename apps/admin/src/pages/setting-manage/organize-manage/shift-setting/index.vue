<script lang="ts" setup>
definePage({
	meta: {
		title: "班次设置",
		icon: "mdi:clock-time-eight",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.shiftSetting"),
	},
});

import { ref, computed, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import { type ShiftSettingFormProps, defaultForm, type 班次设置表单_VO } from "./components/form";
import ShiftSettingForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<班次设置_列表数据[]>([]);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const shiftSettingFormInstance = ref<InstanceType<typeof ShiftSettingForm> | null>(null);

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
function openDialog(params: { mode: Mode; row?: 班次设置_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}班次设置`;

	/** 业务对象 */
	const 班次设置表单对象: 班次设置表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					编号: row?.编号 || "",
					班次名称: row?.班次名称 || "",
					时段: row?.时段 || "",
					状态: row?.状态 || "启用",
					备注说明: row?.备注说明 || "",
				})
			: cloneDeep({
					...defaultForm,
					编号: row?.编号 || "",
					班次名称: row?.班次名称 || "",
					时段: row?.时段 || "",
					状态: row?.状态 || "启用",
					备注说明: row?.备注说明 || "",
				});

	/** 表单组件需要的props */
	const formProps: ShiftSettingFormProps = {
		form: 班次设置表单对象,
		defaultValues: 班次设置表单对象,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: {
			...formProps,
			mode,
		},
		contentRenderer: () =>
			h(ShiftSettingForm, {
				ref: shiftSettingFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = shiftSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = shiftSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					shiftSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (shiftSettingFormInstance.value?.plusFormInstance) {
						const res = await shiftSettingFormInstance.value.plusFormInstance.handleSubmit();
						if (res) {
							button.btn.loading = true;
							await testAsync();
							button.btn.loading = false;
							closeDialog(options, index);
							await loadTableData(); // 重新加载数据
						}
					}
				},
			},
		],
	});
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "班次名称",
		prop: "班次名称",
		width: 200,
		fixed: true,
	},
	{
		label: "时段",
		prop: "时段",
		width: 180,
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
		label: "备注说明",
		prop: "备注说明",
		minWidth: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 360,
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

/** 表格组件配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "班次信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 班次设置_列表查询_VO = {
	班次名称: "",
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
		label: "班次名称",
		prop: "班次名称",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置 */
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
		if (plusSearchModel.value.班次名称) {
			filteredData = filteredData.filter((item) => item.班次名称.includes(plusSearchModel.value.班次名称!));
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

/** 新增操作 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 修改操作 */
function handleEdit(row: 班次设置_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 查看操作 */
function handleView(row: 班次设置_列表数据) {
	openDialog({ mode: "info", row });
}

/** 删除操作 */
async function handleDelete(row: 班次设置_列表数据) {
	try {
		await ElMessageBox.confirm(`确认删除班次 "${row.班次名称}" 吗？`, "提示", {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			type: "warning",
		});

		// 模拟删除操作
		const index = tableData.value.findIndex((item) => item.编号 === row.编号);
		if (index > -1) {
			tableData.value.splice(index, 1);
			message("删除成功", { type: "success" });
			await loadTableData();
		}
	} catch (error) {
		// 用户取消删除操作
	}
}

/** 停用/启用操作 */
async function handleToggleStatus(row: 班次设置_列表数据) {
	const newStatus = row.状态 === "启用" ? "停止" : "启用";
	const action = row.状态 === "启用" ? "停用" : "启用";

	try {
		await ElMessageBox.confirm(`确认${action}班次 "${row.班次名称}" 吗？`, "提示", {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			type: "warning",
		});

		// 更新状态
		const index = tableData.value.findIndex((item) => item.编号 === row.编号);
		if (index > -1) {
			tableData.value[index].状态 = newStatus;
			message(`班次已${newStatus}`, { type: "success" });
		}
	} catch (error) {
		// 用户取消操作
	}
}

/** 文件操作 */
function handleFile() {
	message("文件功能开发中", { type: "info" });
}

/** 组件挂载时加载数据 */
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
				<ElButton type="info" @click="handleFile">
					{{ transformI18n($t("common.buttons.file")) }}
				</ElButton>
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
						<ElButton type="info" @click="handleView(row)"> 查看 </ElButton>
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
