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
	type HouseDecorationListItem,
	type HouseDecorationQueryParams,
	type HouseDecorationStatusType,
	type IsDelayedType,
	decorationStatusOptions,
	delayStatusOptions,
} from "@01s-11comm/type";
import { useHouseDecorationListQuery } from "@/api/property-manage/community-manage/house-decoration";
import { type HouseDecorationFormProps, defaultForm } from "./components/form";
import type { HouseDecorationFormVO } from "@01s-11comm/type";
import HouseDecorationForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
/** 表单组件实例 */
const houseDecorationFormInstance = ref<InstanceType<typeof HouseDecorationForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<HouseDecorationQueryParams> = {
	houseNumber: "",
	contactName: "",
	contactPhone: "",
	status: undefined,
	isDelayed: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useHouseDecorationListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋",
		prop: "houseNumber",
		width: 120,
	},
	{
		label: "联系人",
		prop: "contactName",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		width: 120,
	},
	{
		label: "装修时间",
		prop: "decorationTime",
		width: 120,
	},
	{
		label: "申请时间",
		prop: "applicationTime",
		width: 120,
	},
	{
		label: "装修单位",
		prop: "decorationCompany",
		width: 120,
	},
	{
		label: "负责人电话",
		prop: "managerPhone",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		label: "是否延期",
		prop: "isDelayed",
		width: 120,
	},
	{
		label: "延期时间",
		prop: "delayTime",
		width: 120,
	},
	{
		label: "是否违规",
		prop: "isViolated",
		width: 120,
	},
	{
		label: "违规说明",
		prop: "violationDescription",
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "房屋装修",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 房屋编号 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "houseNumber",
		valueType: "input",
	},

	/** 联系人 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.contacts")),
		prop: "contactName",
		valueType: "input",
	},

	/** 联系电话 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "contactPhone",
		valueType: "input",
	},

	/** 房屋状态 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "status",
		valueType: "select",
		options: decorationStatusOptions,
	},

	/** 延期状态 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.deferredStatus")),
		prop: "isDelayed",
		valueType: "select",
		options: delayStatusOptions,
	},

	/** 装修时间 */
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.renovationTime")),
		prop: "decorationTime",
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
		prop: "applicationStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			onChange(value: string[] | null) {
				plusSearchModel.value.applicationStartTime = value?.[0] ?? "";
				plusSearchModel.value.applicationEndTime = value?.[1] ?? "";
			},
			onClear() {
				plusSearchModel.value.applicationStartTime = "";
				plusSearchModel.value.applicationEndTime = "";
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
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

const { gotoDetailPage } = useGotoDetailsPage();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: HouseDecorationListItem;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}房屋装修`;

	/** 业务对象 */
	const formData: HouseDecorationFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					houseNumber: row?.houseNumber || "",
					contactName: row?.contactName || "",
					contactPhone: row?.contactPhone || "",
					decorationTime: row?.decorationTime || "",
					applicationTime: row?.applicationTime || "",
					decorationCompany: row?.decorationCompany || "",
					managerPhone: row?.managerPhone || "",
					status: (row?.status as HouseDecorationStatusType) || "待审核",
					isDelayed: (row?.isDelayed as IsDelayedType) || "否",
					delayTime: row?.delayTime || "",
					isViolated: (row?.isViolated as IsDelayedType) || "否",
					violationDescription: row?.violationDescription || "",
					remarks: row?.remarks || "",
				}
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const props: HouseDecorationFormProps = {
		form: formData,
		defaultValues: formData,
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
function gotoHouseDecorationPage(row: HouseDecorationListItem) {
	console.log("row", row);
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page-house-decoration-[id]",
		params: {
			id: row.houseNumber,
		},
	});
}

onMounted(async () => {
	// await loadTableData();
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
					:loading="isFetching"
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
