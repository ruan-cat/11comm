<script lang="ts" setup>
definePage({
	meta: {
		title: "注册协议",
		icon: "mdi:file-document-outline",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.registerProtocol"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 注册协议_列表数据, type 注册协议_列表查询_VO, tableData as mockTableData, 协议类型Options, 状态Options, 是否强制同意Options } from "./test-data";

import { type RegisterProtocolFormProps, defaultForm, type 注册协议表单_VO, type 协议类型枚举, type 状态枚举, type 是否强制同意枚举 } from "./components/form";
import RegisterProtocolForm from "./components/form.vue";

/** 表单组件实例 */
const registerProtocolFormInstance = ref<InstanceType<typeof RegisterProtocolForm> | null>(null);

/** 表格数据 */
const tableData = ref<注册协议_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "协议ID",
		prop: "协议ID",
		width: 120,
		fixed: true,
	},
	{
		label: "协议名称",
		prop: "协议名称",
		minWidth: 200,
	},
	{
		label: "协议类型",
		prop: "协议类型",
		width: 150,
	},
	{
		label: "协议版本",
		prop: "协议版本",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "是否强制同意",
		prop: "是否强制同意",
		width: 120,
	},
	{
		label: "协议摘要",
		prop: "协议摘要",
		minWidth: 250,
	},
	{
		label: "生效日期",
		prop: "生效日期",
		width: 120,
	},
	{
		label: "失效日期",
		prop: "失效日期",
		width: 120,
	},
	{
		label: "排序权重",
		prop: "排序权重",
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
	title: "注册协议",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.协议名称) {
			filteredData = filteredData.filter((item) => item.协议名称.includes(plusSearchModel.value.协议名称!));
		}
		if (plusSearchModel.value.协议类型) {
			filteredData = filteredData.filter((item) => item.协议类型 === plusSearchModel.value.协议类型);
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}
		if (plusSearchModel.value.是否强制同意) {
			filteredData = filteredData.filter((item) => item.是否强制同意 === plusSearchModel.value.是否强制同意);
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

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 注册协议_列表查询_VO = {
	协议名称: "",
	协议类型: "",
	状态: "",
	是否强制同意: "",
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
	// 协议名称
	{
		label: "协议名称",
		prop: "协议名称",
		valueType: "input",
	},

	// 协议类型
	{
		label: "协议类型",
		prop: "协议类型",
		valueType: "select",
		options: 协议类型Options,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
	},

	// 是否强制同意
	{
		label: "是否强制同意",
		prop: "是否强制同意",
		valueType: "select",
		options: 是否强制同意Options,
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 注册协议_列表数据;
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

/** 测试异步函数 */
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
	const title = `${modeText.value}注册协议`;

	/** 业务对象 */
	const 注册协议表单_VO: 注册协议表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? (cloneDeep({
					...defaultForm,
					协议名称: row?.协议名称 || "",
					协议类型: (row?.协议类型 || "用户注册协议") as 协议类型枚举,
					协议版本: row?.协议版本 || "v1.0.0",
					状态: (row?.状态 || "草稿") as 状态枚举,
					是否强制同意: (row?.是否强制同意 || "是") as 是否强制同意枚举,
					协议摘要: row?.协议摘要 || "",
					协议内容: row?.协议内容 || "",
					生效日期: row?.生效日期 || "",
					失效日期: row?.失效日期 || "",
					排序权重: row?.排序权重 || 0,
				}) as 注册协议表单_VO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: RegisterProtocolFormProps = {
		form: 注册协议表单_VO,
		defaultValues: 注册协议表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		width: "80%",
		top: "10vh",
		props,

		contentRenderer: () =>
			h(RegisterProtocolForm, {
				ref: registerProtocolFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = registerProtocolFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = registerProtocolFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					registerProtocolFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: isInfo.value ? "关闭" : transformI18n($t("common.buttons.submit")),
				type: isInfo.value ? "info" : "success",
				btnClick: isInfo.value
					? async ({ dialog: { options, index }, button }) => {
							const formComputed = registerProtocolFormInstance.value.formComputed;
							await useDoBeforeClose({ defaultValues, formComputed, index, options });
						}
					: async ({ dialog: { options, index }, button }) => {
							/** 提交表单时 校验 */
							const res = await registerProtocolFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
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