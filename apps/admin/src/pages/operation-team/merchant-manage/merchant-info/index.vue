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
import {
	type MerchantInfoListItem,
	type MerchantInfoQueryParams,
	merchantTypeOptions,
	businessStatusOptions,
} from "@01s-11comm/type";
import { useMerchantInfoListQuery } from "@/api/operation-team/merchant-manage/merchant-info";
import {
	type 商户信息_表单_VO,
	type 商户类型,
	type 经营状态,
	type MerchantInfoFormProps,
	defaultForm,
} from "./components/form";
import MerchantInfoForm from "./components/form.vue";
const merchantInfoFormInstance = ref<InstanceType<typeof MerchantInfoForm> | null>(null);

/** 搜索栏双向绑定变量 */
const plusSearchModelRef: FieldValues & Partial<MerchantInfoQueryParams> = {
	merchantName: "",
	merchantType: undefined,
	contactPhone: "",
	businessStatus: undefined,
	affiliatedCommunity: "",
};

/** 重置功能用的默认值 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 响应式搜索变量 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useMerchantInfoListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "商户编号",
		prop: "merchantId",
		width: 120,
	},
	{
		label: "商户名称",
		prop: "merchantName",
		minWidth: 150,
	},
	{
		label: "商户地址",
		prop: "merchantAddress",
		minWidth: 200,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		width: 130,
	},
	{
		label: "商户类型",
		prop: "merchantType",
		width: 100,
	},
	{
		label: "企业法人",
		prop: "legalRepresentative",
		width: 100,
	},
	{
		label: "成立日期",
		prop: "establishmentDate",
		width: 110,
	},
	{
		label: "经营状态",
		prop: "businessStatus",
		width: 100,
	},
	{
		label: "所属小区",
		prop: "affiliatedCommunity",
		width: 150,
	},
	{
		label: "营业时间",
		prop: "businessHours",
		width: 120,
	},
	{
		label: "经营面积(㎡)",
		prop: "businessArea",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
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

/** 表格组件 配置 */
/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "商户管理",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 商户名称
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantName")),
		prop: "merchantName",
		valueType: "input",
	},

	// 商户类型
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.merchantType")),
		prop: "merchantType",
		valueType: "select",
		options: merchantTypeOptions,
	},

	// 联系电话
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},

	// 经营状态
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.operatingStatus")),
		prop: "businessStatus",
		valueType: "select",
		options: businessStatusOptions,
	},

	// 所属小区
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.belongCommunity")),
		prop: "affiliatedCommunity",
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
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<MerchantInfoQueryParams>);
}

/** 模式控制 */
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: MerchantInfoListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}商户信息`;

	/** 业务对象 */
	const 商户信息_表单_VO: 商户信息_表单_VO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? ({
					...defaultForm,
					商户编号: row?.merchantId || "",
					商户名称: row?.merchantName || "",
					商户地址: row?.merchantAddress || "",
					联系电话: row?.contactPhone || "",
					商户类型: (row?.merchantType || "餐饮服务") as 商户类型,
					企业法人: row?.legalRepresentative || "",
					成立日期: row?.establishmentDate || "",
					经营状态: (row?.businessStatus || "正常营业") as 经营状态,
					所属小区: row?.affiliatedCommunity || "",
					营业时间: row?.businessHours || "",
					经营面积: row?.businessArea || "",
					营业执照号: row?.businessLicenseNo || "",
					开户银行: row?.bankName || "",
					银行账号: row?.bankAccount || "",
					联系人手机: row?.contactMobile || "",
					备注: row?.remarks || "",
				} as 商户信息_表单_VO)
			: structuredClone(defaultForm);

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
function handleEdit(row: MerchantInfoListItem) {
	openDialog({ mode: "edit", row });
}

/** 处理查看详情 */
function handleViewDetails(row: MerchantInfoListItem) {
	openDialog({ mode: "info", row });
}

/** 处理删除商户 */
function handleDelete(row: MerchantInfoListItem) {
	ElMessageBox.confirm(`确定要删除商户"${row.merchantName}"吗？此操作不可撤销。`, "删除确认", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			/** TODO: 调用删除API */
			ElMessage.success("删除成功");
			doFetch();
		})
		.catch(() => {
			ElMessage.info("已取消删除");
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
					:loading="isFetching"
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
