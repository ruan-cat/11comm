<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费催缴",
		icon: "mdi:bell-alert-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reminderForOverduePayments"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { ReminderForOverduePaymentsFormProps } from "./components/form";
import ReminderForOverduePaymentsForm from "./components/form.vue";
import type {
	ReminderForOverduePaymentsListItem,
	ReminderForOverduePaymentsQueryParams,
	ReminderForOverduePaymentsFormVO,
} from "@01s-11comm/type";
import { reminderMethodOptions, reminderStatusOptions } from "@01s-11comm/type";
import { useMode, type Mode } from "@/composables/use-mode";

/** 默认表单数据 */
const defaultForm: ReminderForOverduePaymentsFormVO = {
	ownerName: "",
	paymentObject: "",
	feeName: "",
	reminderAmount: "",
	reminderMethod: "",
	reminderStatus: "",
	reminderTime: "",
	reminderRemark: "",
};

const reminderForOverduePaymentsFormInstance = ref<InstanceType<typeof ReminderForOverduePaymentsForm> | null>(null);

/**
 * 模拟表格数据
 */
const mockTableData: ReminderForOverduePaymentsListItem[] = [
	{
		id: "1",
		name: "业主A",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
	},
	{
		id: "2",
		name: "业主B",
		status: "禁用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
	},
];

const plusSearchModelRef: FieldValues & ReminderForOverduePaymentsQueryParams = {
	name: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

const { modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 表格数据 */
const tableData = ref<ReminderForOverduePaymentsListItem[]>([]);

/**
 * 加载表格数据
 * @description 根据搜索条件过滤数据并进行分页处理
 */
async function loadTableData() {
	try {
		let filteredData = [...mockTableData];

		// 根据名称过滤
		if (plusSearchModel.value.name?.trim()) {
			filteredData = filteredData.filter((item) => item.name.includes(plusSearchModel.value.name!.trim()));
		}

		// 根据状态过滤
		if (plusSearchModel.value.status) {
			filteredData = filteredData.filter((item) => item.status === plusSearchModel.value.status);
		}

		// 更新分页信息
		pagination.value.total = filteredData.length;
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;

		// 分页数据
		tableData.value = filteredData.slice(startIndex, endIndex);
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		// 重置数据状态
		tableData.value = [];
		pagination.value.total = 0;
		pureTableProps.value.data = [];
	}
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "名称",
		prop: "name",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 180,
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

/**
 * 重置搜索条件并重新加载数据
 * @description 将搜索条件重置为默认值并重新加载表格数据
 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/**
 * 执行搜索
 * @description 根据当前搜索条件执行搜索操作
 */
async function handleSearch() {
	try {
		pagination.value.currentPage = 1;
		await loadTableData();
	} catch (error) {
		console.error("执行搜索失败:", error);
	}
}

/**
 * 处理页数变化
 * @param pageSize 新的每页显示数量
 * @description 当用户修改每页显示数量时重新加载数据
 */
async function handlePageSizeChange(pageSize: number) {
	try {
		if (pageSize <= 0) {
			console.warn("页数设置无效:", pageSize);
			return;
		}
		pagination.value.pageSize = pageSize;
		pagination.value.currentPage = 1; // 重置到第一页
		await loadTableData();
	} catch (error) {
		console.error("处理页数变化失败:", error);
	}
}

/**
 * 处理页码变化
 * @param currentPage 新的页码
 * @description 当用户切换页码时重新加载数据
 */
async function handleCurrentPageChange(currentPage: number) {
	try {
		if (currentPage <= 0) {
			console.warn("页码设置无效:", currentPage);
			return;
		}
		pagination.value.currentPage = currentPage;
		await loadTableData();
	} catch (error) {
		console.error("处理页码变化失败:", error);
	}
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 名称 */
	{
		label: "名称",
		prop: "name",
		valueType: "input",
	},
	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: reminderStatusOptions,
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

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费催缴",
	columns: columns.value,
});

/**
 * 打开弹框
 * @param params 弹框参数，包含模式和行数据
 * @param params.mode 弹框模式：新增、编辑、查看详情
 * @param params.row 当前的行数据（编辑和查看详情时需要）
 * @description 根据不同模式打开相应的弹框，支持新增、编辑和查看详情功能
 */
function openDialog(params: { mode: Mode; row?: ReminderForOverduePaymentsListItem }) {
	try {
		const { mode, row } = params;

		// 验证模式参数
		if (!["add", "edit", "info"].includes(mode)) {
			console.error("无效的弹框模式:", mode);
			return;
		}

		setMode(mode);

		/** 弹框标题 */
		const title = `${modeText.value}欠费催缴`;

		/** 业务对象 */
		const formData = isAdd.value
			? cloneDeep(defaultForm)
			: isEdit.value
				? cloneDeep({
						...defaultForm,
						ownerName: row?.name || "",
						reminderStatus: row?.status || "",
					})
				: cloneDeep({
						...defaultForm,
						ownerName: row?.name || "",
						reminderStatus: row?.status || "",
					});

		/** 表单组件需要的props */
		const formProps: ReminderForOverduePaymentsFormProps = {
			form: formData,
			defaultValues: formData,
		};

		/** 根据不同模式下 变化的表单默认重置对象 */
		const defaultValues = formProps.defaultValues;

		addDialog({
			...defaultAddDialogParams,
			title,
			props: formProps,

			contentRenderer: () =>
				h(ReminderForOverduePaymentsForm, {
					ref: reminderForOverduePaymentsFormInstance,
					...formProps,
				}),

			async doBeforeClose({ options, index }) {
				const formComputed = reminderForOverduePaymentsFormInstance.value?.formComputed;
				if (formComputed) {
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				}
			},

			footerButtons: [
				{
					label: transformI18n($t("common.buttons.cancel")),
					type: "info",
					btnClick: async ({ dialog: { options, index }, button }) => {
						const formComputed = reminderForOverduePaymentsFormInstance.value?.formComputed;
						if (formComputed) {
							await useDoBeforeClose({ defaultValues, formComputed, index, options });
						}
					},
				},

				{
					label: transformI18n($t("common.buttons.reset")),
					type: "warning",
					btnClick: ({ dialog: { options, index }, button }) => {
						reminderForOverduePaymentsFormInstance.value?.plusFormInstance?.handleReset();
					},
				},

				{
					label: transformI18n($t("common.buttons.submit")),
					type: "success",
					btnClick: async ({ dialog: { options, index }, button }) => {
						const res = await reminderForOverduePaymentsFormInstance.value?.plusFormInstance?.handleSubmit();
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
	} catch (error) {
		console.error("打开弹框失败:", error);
	}
}

/**
 * 组件挂载时的生命周期钩子
 * @description 组件挂载时自动加载表格数据
 */
onMounted(async () => {
	try {
		await loadTableData();
	} catch (error) {
		console.error("组件初始化失败:", error);
	}
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
						<ElButton type="info">立即催缴</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">查看详情</ElButton>
						<ElButton type="danger">{{ transformI18n($t("common.buttons.del")) }}</ElButton>
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
