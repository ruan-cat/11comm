<script lang="ts" setup>
definePage({
	meta: {
		title: "物业公司",
		icon: "f7:menu",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.dataManage.propertyManagementCompany"),
	},
});

import { ref } from "vue";
import { transformI18n } from "@/plugins/i18n";
// import { router as adminRouter } from "router/index";
import { type 物业公司_列表数据, type 物业公司_列表查询_VO, tableData as mockTableData } from "./test-data";

import { type PropertyManagementCompanyFormProps, defaultForm } from "./components/form";
import PropertyManagementCompanyForm from "./components/form.vue";
const PropertyManagementCompanyFormInstance = ref<InstanceType<typeof PropertyManagementCompanyForm> | null>(null);

/** 表格数据 */
const tableData = ref<物业公司_列表数据[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "编号",
		prop: "编号",
		width: 120,
		fixed: true,
	},
	{
		label: "名称",
		prop: "名称",
		minWidth: 200,
	},
	{
		label: "地址",
		prop: "地址",
		minWidth: 250,
	},
	{
		label: "管理员",
		prop: "管理员",
		width: 100,
	},
	{
		label: "电话",
		prop: "电话",
		width: 150,
	},
	{
		label: "公司法人",
		prop: "公司法人",
		width: 100,
	},
	{
		label: "成立日期",
		prop: "成立日期",
		width: 120,
	},
	{
		label: "地标",
		prop: "地标",
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
		width: 530,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: tableData.value.length,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
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
	title: "物业公司",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 物业公司_列表查询_VO = {
	物业编号: "",
	物业名称: "",
	物业电话: "",
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
	// 物业编号
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.propertyManagementNumber")),
		prop: "物业编号",
		valueType: "input",
	},

	// 物业名称
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.name")),
		prop: "物业名称",
		valueType: "input",
	},

	// 物业电话
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.phone")),
		prop: "物业电话",
		valueType: "input",
		fieldProps: {
			type: "number",
		},
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

async function handleReSearch() {
	console.log("重新搜索");
	// 重置搜索条件并重新加载数据
	pagination.value.currentPage = 1;
}

async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	// 根据搜索条件过滤数据
	pagination.value.currentPage = 1;
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 物业公司_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
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
	const title = `${modeText.value}物业公司`;

	/** 表单组件需要的props */
	const formProps: PropertyManagementCompanyFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};
	// 模拟情况：从外部获得值
	const testEditProps: PropertyManagementCompanyFormProps = {
		form: {
			...defaultForm,
			名称: row?.名称 || "0011物业",
			地址: row?.地址 || "01星球",
			电话: row?.电话 || "12345667890",
			公司法人: row?.公司法人 || "东东哥",
			成立日期: row?.成立日期 || "2024-6-01",
			地标: row?.地标 || "C++大楼",
			开通小区: "",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value //不要照抄，根据业务情况具体分析
		? formProps
		: {
				form: isEdit.value ? testEditProps.form : cloneDeep(row),
				defaultValues: cloneDeep(row),
			};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(PropertyManagementCompanyForm, {
				ref: PropertyManagementCompanyFormInstance,
				...formProps, //不生效：避免类型报错
				mode: mode, // 传入当前模式
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = PropertyManagementCompanyFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = PropertyManagementCompanyFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					PropertyManagementCompanyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await PropertyManagementCompanyFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true; //加载
						await testAsync(); //异步函数
						button.btn.loading = false; //不加载
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

const { gotoDetailPage } = useGotoDetailsPage();

/** 跳转到 管理小区页面 */
function gotoManageCommunityPage(row: 物业公司_列表数据) {
	gotoDetailPage({
		name: "operation-team-data-manage--detail-page-manage-community-[id]",
		params: {
			id: row.编号,
		},
	});
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

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
						<ElButton type="info" @click="gotoManageCommunityPage(row)">
							{{ transformI18n($t("operation-team_data-manage.property-management-company.manageCommunity")) }}
						</ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.pureLogin")) }} </ElButton>
						<ElButton type="warning">
							{{ transformI18n($t("operation-team_data-manage.property-management-company.limitLogin")) }}
						</ElButton>
						<ElButton type="warning">
							{{ transformI18n($t("operation-team_data-manage.property-management-company.resetPassword")) }}
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
