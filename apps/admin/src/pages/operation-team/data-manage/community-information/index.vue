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
import {
	type 小区信息_列表数据,
	type 小区信息_列表查询_VO,
	tableData as mockTableData,
	searchOptions,
} from "./test-data";
import { type CommunityInformationFormProps, defaultForm, type 小区信息表单_VO } from "./components/form";
import CommunityInformationForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<小区信息_列表数据[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区ID",
		prop: "小区ID",
		width: 120,
	},
	{
		label: "小区名称",
		prop: "小区名称",
		minWidth: 150,
	},
	{
		label: "物业公司",
		prop: "物业公司",
		minWidth: 200,
	},
	{
		label: "附近地标",
		prop: "附近地标",
		width: 150,
	},
	{
		label: "省份",
		prop: "省份",
		width: 100,
	},
	{
		label: "城市",
		prop: "城市",
		width: 100,
	},
	{
		label: "区县",
		prop: "区县",
		width: 100,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "管理员",
		prop: "管理员",
		width: 100,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
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
	pagination.value.currentPage = 1;
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
	title: "小区信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 小区信息_列表查询_VO = {
	小区ID: "",
	小区名称: "",
	省: "",
	城市: "",
	区县: "",
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
		prop: "小区ID",
		valueType: "input",
	},

	// 小区名称
	{
		label: transformI18n($t("operation-team_data-manage.community-information.communityName")),
		prop: "小区名称",
		valueType: "input",
	},

	// 省
	{
		label: transformI18n($t("operation-team_data-manage.community-information.province")),
		prop: "省",
		valueType: "select",
		options: searchOptions.provinces,
	},

	// 城市
	{
		label: transformI18n($t("operation-team_data-manage.community-information.city")),
		prop: "城市",
		valueType: "select",
		options: searchOptions.cities,
	},

	// 区县
	{
		label: transformI18n($t("operation-team_data-manage.community-information.district")),
		prop: "区县",
		valueType: "select",
		options: searchOptions.districts,
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
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 小区信息_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 小区信息表单_VO: 小区信息表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					小区ID: row?.小区ID || "",
					小区名称: row?.小区名称 || "",
					物业公司: row?.物业公司 || "",
					附近地标: row?.附近地标 || "",
					城市编码: row?.城市编码 || "",
					创建时间: row?.创建时间 || "",
					社区编码: row?.社区编码 || "",
					状态: row?.状态 || "正常运营",
					省份: row?.省份 || "",
					城市: row?.城市 || "",
					区县: row?.区县 || "",
					详细地址: row?.详细地址 || "",
					联系电话: row?.联系电话 || "",
					管理员: row?.管理员 || "",
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.小区ID) {
			filteredData = filteredData.filter((item) => item.小区ID.includes(plusSearchModel.value.小区ID!));
		}
		if (plusSearchModel.value.小区名称) {
			filteredData = filteredData.filter((item) => item.小区名称.includes(plusSearchModel.value.小区名称!));
		}
		if (plusSearchModel.value.省) {
			filteredData = filteredData.filter((item) => item.省份 === plusSearchModel.value.省);
		}
		if (plusSearchModel.value.城市) {
			filteredData = filteredData.filter((item) => item.城市 === plusSearchModel.value.城市);
		}
		if (plusSearchModel.value.区县) {
			filteredData = filteredData.filter((item) => item.区县 === plusSearchModel.value.区县);
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
		// TODO: 显示错误提示
	}
}

async function handleReSearch() {
	console.log("重新搜索");
	// 重置搜索条件并重新加载数据
	pagination.value.currentPage = 1;
	await loadTableData();
}

async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	// 根据搜索条件过滤数据
	pagination.value.currentPage = 1;
	await loadTableData();
}

// 页面初始化
onMounted(async () => {
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" @reset="handleReSearch" />

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
