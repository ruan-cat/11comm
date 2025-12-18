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
	type MerchantAdminListItem,
	type MerchantAdminQueryParams,
	merchantAdminStatusOptions,
} from "@01s-11comm/type";
import { useMerchantAdminListQuery } from "@/api/operation-team/merchant-manage/merchant-admin";
import { type MerchantAdminFormProps, defaultForm, type 商户管理员表单_VO } from "./components/form";
import MerchantAdminForm from "./components/form.vue";

const MerchantAdminFormInstance = ref<InstanceType<typeof MerchantAdminForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<MerchantAdminQueryParams> = {
	adminName: "",
	adminPhone: "",
	adminId: "",
	status: undefined,
};

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

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
} = useMerchantAdminListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "物业公司",
		prop: "propertyName",
		minWidth: 200,
	},
	{
		label: "管理员",
		prop: "adminName",
		width: 120,
	},
	{
		label: "管理员电话",
		prop: "adminPhone",
		width: 130,
	},
	{
		label: "管理员ID",
		prop: "adminId",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "隶属小区数量",
		prop: "affiliatedCommunityCount",
		width: 120,
	},
	{
		label: "登录次数",
		prop: "loginCount",
		width: 100,
	},
	{
		label: "最后登录时间",
		prop: "lastLoginTime",
		width: 160,
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "商户管理员",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 物业名称
	{
		label: "物业名称",
		prop: "propertyName",
		valueType: "input",
	},

	// 管理员
	{
		label: "管理员",
		prop: "adminName",
		valueType: "input",
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "contactPhone",
		valueType: "input",
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: merchantAdminStatusOptions,
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
	} as Partial<MerchantAdminQueryParams>);
}

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
function openDialog(params: { mode: Mode; row?: MerchantAdminListItem }) {
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
					物业公司: row?.propertyName || "",
					管理员姓名: row?.adminName || "",
					管理员电话: row?.adminPhone || "",
					管理员邮箱: "",
					身份证号码: "",
					账户状态: row?.status || "正常",
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
	// await loadTableData(); // TanStack query handles this
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
