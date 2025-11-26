<script lang="ts" setup>
definePage({
	meta: {
		title: "房屋装修",
		icon: "mdi:hammer",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.houseDecoration"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type 房屋装修_列表数据,
	type 房屋装修_列表查询_VO,
	房屋状态选项,
	延期状态选项,
	tableData as mockTableData,
} from "./test-data";

import { type HouseDecorationFormProps, defaultForm, type 房屋装修表单_VO, type 房屋装修状态类型, type 是否延期类型, type 是否违规类型 } from "./components/form";
import HouseDecorationForm from "./components/form.vue";

/** 表单组件实例 */
const houseDecorationFormInstance = ref<InstanceType<typeof HouseDecorationForm> | null>(null);

/** 表格数据 */
const tableData = ref<房屋装修_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋",
		prop: "房屋",
		width: 120,
	},
	{
		label: "联系人",
		prop: "联系人",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		width: 120,
	},
	{
		label: "装修时间",
		prop: "装修时间",
		width: 120,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		width: 120,
	},
	{
		label: "装修单位",
		prop: "装修单位",
		width: 120,
	},
	{
		label: "负责人电话",
		prop: "负责人电话",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: "是否延期",
		prop: "是否延期",
		width: 120,
	},
	{
		label: "延期时间",
		prop: "延期时间",
		width: 120,
	},
	{
		label: "是否违规",
		prop: "是否违规",
		width: 120,
	},
	{
		label: "违规说明",
		prop: "违规说明",
		width: 120,
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
	title: "房屋装修",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.房屋编号) {
			filteredData = filteredData.filter((item) => item.房屋.includes(plusSearchModel.value.房屋编号!));
		}
		if (plusSearchModel.value.联系人) {
			filteredData = filteredData.filter((item) => item.联系人.includes(plusSearchModel.value.联系人!));
		}
		if (plusSearchModel.value.联系电话) {
			filteredData = filteredData.filter((item) => item.联系电话.includes(plusSearchModel.value.联系电话!));
		}
		if (plusSearchModel.value.房屋状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.房屋状态);
		}
		if (plusSearchModel.value.延期状态) {
			filteredData = filteredData.filter((item) => item.是否延期 === plusSearchModel.value.延期状态);
		}
		if (plusSearchModel.value.装修时间) {
			filteredData = filteredData.filter((item) => item.装修时间.includes(plusSearchModel.value.装修时间!));
		}
		if (plusSearchModel.value.装修申请开始时间 && plusSearchModel.value.装修申请结束时间) {
			filteredData = filteredData.filter((item) => {
				const applyTime = new Date(item.申请时间).getTime();
				const startTime = new Date(plusSearchModel.value.装修申请开始时间!).getTime();
				const endTime = new Date(plusSearchModel.value.装修申请结束时间!).getTime();
				return applyTime >= startTime && applyTime <= endTime;
			});
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
const plusSearchModelRef: FieldValues & 房屋装修_列表查询_VO = {
	房屋编号: "",
	联系人: "",
	联系电话: "",
	房屋状态: "",
	延期状态: "",
	装修时间: "",
	装修申请开始时间: "",
	装修申请结束时间: "",
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
	/** 房屋编号 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	/** 联系人 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.contacts")),
		prop: "联系人",
		valueType: "input",
	},

	/** 联系电话 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "联系电话",
		valueType: "input",
	},

	/** 房屋状态 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "房屋状态",
		valueType: "select",
		options: 房屋状态选项,
	},

	/** 延期状态 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.deferredStatus")),
		prop: "延期状态",
		valueType: "select",
		options: 延期状态选项,
	},

	/** 装修时间 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.renovationTime")),
		prop: "装修时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	/** 申请时间范围 */
	{
		label: "申请时间范围",
		prop: "装修申请开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.装修申请开始时间 = value?.[0] ?? "";
				plusSearchModel.value.装修申请结束时间 = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.装修申请开始时间 = "";
				plusSearchModel.value.装修申请结束时间 = "";
			},
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

const { gotoDetailPage } = useGotoDetailsPage();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 房屋装修_列表数据;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

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
	const title = `${modeText.value}房屋装修`;

	/** 业务对象 */
	const 房屋装修表单_VO: 房屋装修表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					房屋: row?.房屋 || "",
					联系人: row?.联系人 || "",
					联系电话: row?.联系电话 || "",
					装修时间: row?.装修时间 || "",
					申请时间: row?.申请时间 || "",
					装修单位: row?.装修单位 || "",
					负责人电话: row?.负责人电话 || "",
					状态: (row?.状态 as 房屋装修状态类型) || "待审核",
					是否延期: (row?.是否延期 as 是否延期类型) || "否",
					延期时间: row?.延期时间 || "",
					是否违规: (row?.是否违规 as 是否违规类型) || "否",
					违规说明: row?.违规说明 || "",
					备注: row?.备注 || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: HouseDecorationFormProps = {
		form: 房屋装修表单_VO,
		defaultValues: 房屋装修表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(HouseDecorationForm, {
				ref: houseDecorationFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = houseDecorationFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					// console.log(options, index);
					const formComputed = houseDecorationFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					// 手动重置表单
					houseDecorationFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await houseDecorationFormInstance.value.plusFormInstance.handleSubmit();
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

/** 跳转到 装修跟踪页面 */
function gotoHouseDecorationPage(row: 房屋装修_列表数据) {
	console.log("row", row);
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page-house-decoration-[id]",
		params: {
			id: row.房屋,
		},
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
						<ElButton type="info">
							{{ transformI18n($t("propertyManage_communityManage.house-decoration.decorationOk")) }}
						</ElButton>
						<ElButton type="info" @click="gotoHouseDecorationPage(row)">
							{{ transformI18n($t("propertyManage_communityManage.house-decoration.trackingRecord")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
