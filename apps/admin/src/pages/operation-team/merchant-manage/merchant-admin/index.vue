<script lang="ts" setup>
definePage({
	meta: {
		title: "商户管理员",
		icon: "mdi:account-tie",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantAdmin"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type 商户管理员_列表数据,
	type 商户管理员_列表查询_VO,
	tableData as mockTableData,
	状态选项,
} from "./test-data";

import { type MerchantAdminFormProps, defaultForm, type 商户管理员表单_VO } from "./components/form";
import MerchantAdminForm from "./components/form.vue";
const MerchantAdminFormInstance = ref<InstanceType<typeof MerchantAdminForm> | null>(null);

/** 表格数据 */
const tableData = ref<商户管理员_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "物业公司",
		prop: "物业名称",
		minWidth: 200,
	},
	{
		label: "管理员",
		prop: "管理员",
		width: 120,
	},
	{
		label: "管理员电话",
		prop: "管理员电话",
		width: 130,
	},
	{
		label: "管理员ID",
		prop: "管理员ID",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
	},
	{
		label: "隶属小区数量",
		prop: "隶属小区数量",
		width: 120,
	},
	{
		label: "登录次数",
		prop: "登录次数",
		width: 100,
	},
	{
		label: "最后登录时间",
		prop: "最后登录时间",
		width: 160,
	},
	{
		label: "创建时间",
		prop: "创建时间",
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
	title: "商户管理员",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 商户管理员_列表查询_VO = {
	物业名称: "",
	管理员: "",
	联系电话: "",
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
	// 物业名称
	{
		label: "物业名称",
		prop: "物业名称",
		valueType: "input",
	},

	// 管理员
	{
		label: "管理员",
		prop: "管理员",
		valueType: "input",
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态选项,
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
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.物业名称) {
			filteredData = filteredData.filter((item) => item.物业名称.includes(plusSearchModel.value.物业名称!));
		}
		if (plusSearchModel.value.管理员) {
			filteredData = filteredData.filter((item) => item.管理员.includes(plusSearchModel.value.管理员!));
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.管理员电话.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
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
function openDialog(params: { mode: Mode; row?: 商户管理员_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}商户管理员`;

	/** 业务对象 */
	const 商户管理员表单_VO: 商户管理员表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					物业公司: row?.物业名称 || "",
					管理员姓名: row?.管理员 || "",
					管理员电话: row?.管理员电话 || "",
					管理员邮箱: "",
					身份证号码: "",
					账户状态: row?.状态 || "正常",
					登录密码: "",
					确认密码: "",
					联系地址: "",
					备注: "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: MerchantAdminFormProps = {
		form: 商户管理员表单_VO,
		defaultValues: 商户管理员表单_VO,
		mode,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(MerchantAdminForm, {
				ref: MerchantAdminFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = MerchantAdminFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = MerchantAdminFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options: _options, index: _index } }) => {
					MerchantAdminFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await MerchantAdminFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info">隶属小区</ElButton>
						<ElButton type="info">登录</ElButton>
						<ElButton type="warning">限制登录</ElButton>
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
