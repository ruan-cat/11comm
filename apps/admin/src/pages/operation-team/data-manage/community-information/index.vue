<script lang="ts" setup>
definePage({
	meta: {
		title: "小区信息",
		icon: "mdi:home-city",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.dataManage.communityInformation"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type CommunityInfoListItem, type CommunityInfoQueryParams, communitySearchOptions } from "@01s-11comm/type";
import { useCommunityInfoListQuery } from "@/api/operation-team/data-manage/community-information";
import { type CommunityInformationFormProps, defaultForm, type 小区信息表单_VO } from "./components/form";
import CommunityInformationForm from "./components/form.vue";

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	total,
	pageIndex,
	pageSize,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useCommunityInfoListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区ID",
		prop: "communityId",
		width: 120,
	},
	{
		label: "小区名称",
		prop: "communityName",
		minWidth: 150,
	},
	{
		label: "物业公司",
		prop: "propertyCompany",
		minWidth: 200,
	},
	{
		label: "附近地标",
		prop: "nearbyLandmark",
		width: 150,
	},
	{
		label: "省份",
		prop: "province",
		width: 100,
	},
	{
		label: "城市",
		prop: "city",
		width: 100,
	},
	{
		label: "区县",
		prop: "district",
		width: 100,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		width: 120,
	},
	{
		label: "管理员",
		prop: "administrator",
		width: 100,
	},
	{
		label: "状态",
		prop: "status",
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
	loading: isFetching.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "小区信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<CommunityInfoQueryParams> = {
	communityId: "",
	communityName: "",
	province: "",
	city: "",
	district: "",
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
	// 小区ID
	{
		label: transformI18n($t("operation-team_data-manage.community-information.communityID")),
		prop: "communityId",
		valueType: "input",
	},

	// 小区名称
	{
		label: transformI18n($t("operation-team_data-manage.community-information.communityName")),
		prop: "communityName",
		valueType: "input",
	},

	// 省
	{
		label: transformI18n($t("operation-team_data-manage.community-information.province")),
		prop: "province",
		valueType: "select",
		options: communitySearchOptions.provinces,
	},

	// 城市
	{
		label: transformI18n($t("operation-team_data-manage.community-information.city")),
		prop: "city",
		valueType: "select",
		options: communitySearchOptions.cities,
	},

	// 区县
	{
		label: transformI18n($t("operation-team_data-manage.community-information.district")),
		prop: "district",
		valueType: "select",
		options: communitySearchOptions.districts,
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

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const communityInformationFormInstance = ref<InstanceType<typeof CommunityInformationForm> | null>(null);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: CommunityInfoListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 小区信息表单_VO: 小区信息表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					小区ID: row?.communityId || "",
					小区名称: row?.communityName || "",
					物业公司: row?.propertyCompany || "",
					附近地标: row?.nearbyLandmark || "",
					城市编码: row?.cityCode || "",
					创建时间: row?.createTime || "",
					社区编码: row?.communityCode || "",
					状态: row?.status || "正常运营",
					省份: row?.province || "",
					城市: row?.city || "",
					区县: row?.district || "",
					详细地址: row?.detailedAddress || "",
					联系电话: row?.contactPhone || "",
					管理员: row?.administrator || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: CommunityInformationFormProps = {
		form: 小区信息表单_VO,
		defaultValues: 小区信息表单_VO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}小区信息`;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(CommunityInformationForm, {
				ref: communityInformationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = communityInformationFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = communityInformationFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					communityInformationFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await communityInformationFormInstance.value.plusFormInstance.handleSubmit();
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
	} as Partial<CommunityInfoQueryParams>);
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
