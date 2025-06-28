<script lang="ts" setup>
definePage({
	meta: {
		title: "业主账户",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerAccount"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type OwnerAccountFormProps, defaultForm } from "./components/form";
import OwnerAccountForm from "./components/form.vue";

const ownerAccountFormInstance = ref<InstanceType<typeof OwnerAccountForm> | null>(null);

interface 业主账户_列表数据 {
	账户编号: string;
	账户名称: string;
	身份证号: string;
	手机号: string;
	账户类型: string;
	账户金额: string;
	扣款房号: string;
	创建时间: string;
	备注: string;
}

const tableDataItem: 业主账户_列表数据 = {
	账户编号: "账户编号",
	账户名称: "账户名称",
	身份证号: "身份证号",
	手机号: "手机号",
	账户类型: "账户类型",
	账户金额: "账户金额",
	扣款房号: "扣款房号",
	创建时间: "创建时间",
	备注: "备注",
};

/** 表格数据 */
const tableData = ref<业主账户_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "账户编号",
		prop: "账户编号",
		width: 120,
		fixed: true,
	},
	{
		label: "账户名称",
		prop: "账户名称",
		width: 120,
	},
	{
		label: "身份证号",
		prop: "身份证号",
		width: 120,
	},
	{
		label: "手机号",
		prop: "手机号",
		width: 120,
	},
	{
		label: "账户类型",
		prop: "账户类型",
		width: 120,
	},
	{
		label: "账户金额",
		prop: "账户金额",
		width: 120,
	},
	{
		label: "扣款房号",
		prop: "扣款房号",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
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

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业主账户",
	columns: columns.value,
});

interface 业主账户_列表查询_VO {
	账户名称?: string;
	身份证号?: string;
	联系方式?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业主账户_列表查询_VO = {
	账户名称: "",
	身份证号: "",
	联系方式: "",
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
	// 账户名称
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.accountName")),
		prop: "账户名称",
		valueType: "input",
	},

	// 身份证号
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.idCard")),
		prop: "身份证号",
		valueType: "input",
	},

	// 联系方式
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.phone")),
		prop: "联系方式",
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

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 业主账户_列表数据;
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
	const title = `${modeText.value}业主账户`;

	/** 表单组件需要的props */
	const formProps: OwnerAccountFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: OwnerAccountFormProps = {
		form: {
			...defaultForm,
			账户类型: "通用账户",
			业主手机: "",
			业主名称: "1",
			预存金额: "",
			支付方式: "现金",
			备注: "",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value
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
			h(OwnerAccountForm, {
				ref: ownerAccountFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ownerAccountFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = ownerAccountFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					ownerAccountFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await ownerAccountFormInstance.value.plusFormInstance.handleSubmit();
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

/** 跳转到 装修跟踪页面 */
function gotoOwnerAccountPage(row: 业主账户_列表数据) {
	console.log("row", row);
	gotoDetailPage({
		name: "property-manage-house-property-manage--detail-page-owner-account-[id]",
		params: {
			id: row.账户编号,
		},
	});
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

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
						<ElButton type="default" @click="gotoOwnerAccountPage(row)">
							{{ transformI18n($t("propertyManage_housePropertyManage.houses.account")) }}
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
