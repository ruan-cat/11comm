<script lang="ts" setup>
definePage({
	meta: {
		title: "物业公司",
		icon: "mdi:office-building",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.dataManage.propertyManagementCompany"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PropertyCompanyListItem, type PropertyCompanyQueryParams } from "@01s-11comm/type";
import { usePropertyCompanyListQuery } from "@/api/operation-team/data-manage/property-company";
import { type PropertyManagementCompanyFormProps, defaultForm, type 物业公司表单_VO } from "./components/form";
import PropertyManagementCompanyForm from "./components/form.vue";

const PropertyManagementCompanyFormInstance = ref<InstanceType<typeof PropertyManagementCompanyForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	usePropertyCompanyListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "companyId",
		width: 120,
	},
	{
		label: "名称",
		prop: "companyName",
		minWidth: 200,
	},
	{
		label: "地址",
		prop: "address",
		minWidth: 250,
	},
	{
		label: "管理员",
		prop: "administrator",
		width: 100,
	},
	{
		label: "电话",
		prop: "phone",
		width: 150,
	},
	{
		label: "公司法人",
		prop: "legalRepresentative",
		width: 100,
	},
	{
		label: "成立日期",
		prop: "establishmentDate",
		width: 120,
	},
	{
		label: "地标",
		prop: "landmark",
		width: 150,
	},
	{
		label: "开通小区数量",
		prop: "communityCount",
		width: 120,
	},
	{
		label: "公司类型",
		prop: "companyType",
		width: 100,
	},
	{
		label: "服务等级",
		prop: "serviceLevel",
		width: 100,
	},
	{
		label: "运营状态",
		prop: "operationStatus",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "createTime",
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
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}
/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
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
const plusSearchModelRef: FieldValues & Partial<PropertyCompanyQueryParams> = {
	companyId: "",
	companyName: "",
	phone: "",
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
	/** 物业编号 */
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.propertyManagementNumber")),
		prop: "companyId",
		valueType: "input",
	},

	/** 物业名称 */
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.name")),
		prop: "companyName",
		valueType: "input",
	},

	/** 物业电话 */
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.phone")),
		prop: "phone",
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<PropertyCompanyQueryParams>);
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
function openDialog(params: { mode: Mode; row?: PropertyCompanyListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}物业公司`;

	/** 业务对象 */
	const 物业公司表单_VO: 物业公司表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					编号: row?.companyId || "",
					名称: row?.companyName || "",
					地址: row?.address || "",
					电话: row?.phone || "",
					管理员: row?.administrator || "",
					公司法人: row?.legalRepresentative || "",
					成立日期: row?.establishmentDate || "",
					地标: row?.landmark || "",
					开通小区数量: row?.communityCount || 0,
					公司类型: row?.companyType || "",
					服务等级: row?.serviceLevel || "",
					运营状态: row?.operationStatus || "",
					备注: row?.remarks || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: PropertyManagementCompanyFormProps = {
		form: 物业公司表单_VO,
		defaultValues: 物业公司表单_VO,
		mode,
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
				...props,
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
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = PropertyManagementCompanyFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options: _options, index: _index } }) => {
					PropertyManagementCompanyFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await PropertyManagementCompanyFormInstance.value?.plusFormInstance?.handleSubmit();
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

const { gotoDetailPage } = useGotoDetailsPage();

/** 跳转到 管理小区页面 */
function gotoManageCommunityPage(row: PropertyCompanyListItem) {
	gotoDetailPage({
		name: "operation-team-data-manage--detail-page-manage-community-[id]",
		params: {
			id: row.companyId,
		},
	});
}
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

		<PureTableBar :="pureTableBarProps" @refresh="refetch">
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
						<ElButton type="info">
							{{ transformI18n($t("operation-team_data-manage.property-management-company.limitLogin")) }}
						</ElButton>
						<ElButton type="info">
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