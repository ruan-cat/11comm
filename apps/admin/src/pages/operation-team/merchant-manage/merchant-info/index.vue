<script lang="ts" setup>
definePage({
	meta: {
		title: "商户信息",
		icon: "mdi:storefront",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantInfo"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { useMode, type Mode } from "@/composables/use-mode";
import type { PlusColumn } from "plus-pro-components";
import {
	type 商户信息_列表数据,
	type 商户信息_列表查询_VO,
	tableData as mockTableData,
	商户类型选项,
	经营状态选项,
} from "./test-data";
import {
	type 商户信息_表单_VO,
	type 商户类型,
	type 经营状态,
	type MerchantInfoFormProps,
	defaultForm,
} from "./components/form";
import MerchantInfoForm from "./components/form.vue";
const merchantInfoFormInstance = ref<InstanceType<typeof MerchantInfoForm> | null>(null);

/** 表格数据 */
const tableData = ref<商户信息_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "商户编号",
		prop: "商户编号",
		width: 120,
	},
	{
		label: "商户名称",
		prop: "商户名称",
		minWidth: 150,
	},
	{
		label: "商户地址",
		prop: "商户地址",
		minWidth: 200,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 130,
	},
	{
		label: "商户类型",
		prop: "商户类型",
		width: 100,
	},
	{
		label: "企业法人",
		prop: "企业法人",
		width: 100,
	},
	{
		label: "成立日期",
		prop: "成立日期",
		width: 110,
	},
	{
		label: "经营状态",
		prop: "经营状态",
		width: 100,
	},
	{
		label: "所属小区",
		prop: "所属小区",
		width: 150,
	},
	{
		label: "营业时间",
		prop: "营业时间",
		width: 120,
	},
	{
		label: "经营面积(㎡)",
		prop: "经营面积",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 260,
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
	title: "商户管理",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 商户信息_列表查询_VO = {
	商户名称: "",
	商户类型: "",
	联系电话: "",
	经营状态: "",
	所属小区: "",
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
	// 商户名称
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantName")),
		prop: "商户名称",
		valueType: "input",
	},

	// 商户类型
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantType")),
		prop: "商户类型",
		valueType: "select",
		options: 商户类型选项,
	},

	// 联系电话
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.contactPhone")),
		prop: "联系电话",
		valueType: "input",
	},

	// 经营状态
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.operatingStatus")),
		prop: "经营状态",
		valueType: "select",
		options: 经营状态选项,
	},

	// 所属小区
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.belongCommunity")),
		prop: "所属小区",
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
		if (plusSearchModel.value.商户名称) {
			filteredData = filteredData.filter((item) => item.商户名称.includes(plusSearchModel.value.商户名称!));
		}
		if (plusSearchModel.value.商户类型) {
			filteredData = filteredData.filter((item) => item.商户类型 === plusSearchModel.value.商户类型);
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.联系电话.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.经营状态) {
			filteredData = filteredData.filter((item) => item.经营状态 === plusSearchModel.value.经营状态);
		}
		if (plusSearchModel.value.所属小区) {
			filteredData = filteredData.filter((item) => item.所属小区.includes(plusSearchModel.value.所属小区!));
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 商户信息_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}商户信息`;

	/** 业务对象 */
	const 商户信息_表单_VO: 商户信息_表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? ({
					...defaultForm,
					商户编号: row?.商户编号 || "",
					商户名称: row?.商户名称 || "",
					商户地址: row?.商户地址 || "",
					联系电话: row?.联系电话 || "",
					商户类型: (row?.商户类型 || "餐饮服务") as 商户类型,
					企业法人: row?.企业法人 || "",
					成立日期: row?.成立日期 || "",
					经营状态: (row?.经营状态 || "正常营业") as 经营状态,
					所属小区: row?.所属小区 || "",
					营业时间: row?.营业时间 || "",
					经营面积: row?.经营面积 || "",
					营业执照号: row?.营业执照号 || "",
					开户银行: row?.开户银行 || "",
					银行账号: row?.银行账号 || "",
					联系人手机: row?.联系人手机 || "",
					备注: row?.备注 || "",
				} as 商户信息_表单_VO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: MerchantInfoFormProps = {
		form: 商户信息_表单_VO,
		defaultValues: 商户信息_表单_VO,
		mode,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(MerchantInfoForm, {
				ref: merchantInfoFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = merchantInfoFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = merchantInfoFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options: _options, index: _index } }) => {
					merchantInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await merchantInfoFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 处理新增商户 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 处理编辑商户 */
function handleEdit(row: 商户信息_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 处理查看详情 */
function handleViewDetails(row: 商户信息_列表数据) {
	openDialog({ mode: "info", row });
}

/** 处理删除商户 */
function handleDelete(row: 商户信息_列表数据) {
	ElMessageBox.confirm(`确定要删除商户"${row.商户名称}"吗？此操作不可撤销。`, "删除确认", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			/** TODO: 调用删除API */
			ElMessage.success("删除成功");
			await loadTableData();
		})
		.catch(() => {
			ElMessage.info("已取消删除");
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
						<ElButton type="info" @click="handleViewDetails(row)">
							{{ transformI18n($t("operation-team_merchant-manage.merchant-info.viewDetails")) }}
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
