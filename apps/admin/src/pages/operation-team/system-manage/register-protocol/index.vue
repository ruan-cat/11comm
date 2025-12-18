<script lang="ts" setup>
definePage({
	meta: {
		title: "注册协议",
		icon: "mdi:file-document-outline",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.registerProtocol"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type RegisterProtocolListItem, type RegisterProtocolQueryParams, protocolTypeOptions, registerProtocolStatusOptions, isMandatoryOptions, type RegisterProtocolListItem as 注册协议_列表数据 } from "@01s-11comm/type";
import { useRegisterProtocolListQuery } from "@/api/operation-team/system-manage/register-protocol";
import { type RegisterProtocolFormProps, defaultForm, type 注册协议表单_VO, type 协议类型枚举, type 状态枚举, type 是否强制同意枚举 } from "./components/form";
import RegisterProtocolForm from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";

/** 表单组件实例 */
const registerProtocolFormInstance = ref<InstanceType<typeof RegisterProtocolForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
	useRegisterProtocolListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "协议ID",
		prop: "protocolId",
		width: 120,
		fixed: true,
	},
	{
		label: "协议名称",
		prop: "protocolName",
		minWidth: 200,
	},
	{
		label: "协议类型",
		prop: "protocolType",
		width: 150,
	},
	{
		label: "协议版本",
		prop: "protocolVersion",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
	},
	{
		label: "是否强制同意",
		prop: "isMandatory",
		width: 120,
	},
	{
		label: "协议摘要",
		prop: "summary",
		minWidth: 250,
	},
	{
		label: "生效日期",
		prop: "effectiveDate",
		width: 120,
	},
	{
		label: "失效日期",
		prop: "expirationDate",
		width: 120,
	},
	{
		label: "排序权重",
		prop: "sortOrder",
		width: 100,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "updateTime",
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
	title: "注册协议",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<RegisterProtocolQueryParams> = {
	protocolName: "",
	protocolType: undefined,
	status: undefined,
	isMandatory: undefined,
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
	// 协议名称
	{
		label: "协议名称",
		prop: "protocolName",
		valueType: "input",
	},

	// 协议类型
	{
		label: "协议类型",
		prop: "protocolType",
		valueType: "select",
		options: protocolTypeOptions,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: registerProtocolStatusOptions,
	},

	// 是否强制同意
	{
		label: "是否强制同意",
		prop: "isMandatory",
		valueType: "select",
		options: isMandatoryOptions,
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
	} as Partial<RegisterProtocolQueryParams>);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: RegisterProtocolListItem;
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

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
	const title = `${modeText.value}注册协议`;

	/** 业务对象 */
	const 注册协议表单_VO: 注册协议表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? (cloneDeep({
					...defaultForm,
					协议名称: row?.protocolName || "",
					协议类型: (row?.protocolType || "用户注册协议") as 协议类型枚举,
					协议版本: row?.protocolVersion || "v1.0.0",
					状态: (row?.status || "草稿") as 状态枚举,
					是否强制同意: (row?.isMandatory || "是") as 是否强制同意枚举,
					协议摘要: row?.summary || "",
					协议内容: row?.content || "",
					生效日期: row?.effectiveDate || "",
					失效日期: row?.expirationDate || "",
					排序权重: row?.sortOrder || 0,
				}) as 注册协议表单_VO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: RegisterProtocolFormProps = {
		form: 注册协议表单_VO,
		defaultValues: 注册协议表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		width: "80%",
		top: "10vh",
		props,

		contentRenderer: () =>
			h(RegisterProtocolForm, {
				ref: registerProtocolFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = registerProtocolFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = registerProtocolFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					registerProtocolFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: isInfo.value ? "关闭" : transformI18n($t("common.buttons.submit")),
				type: isInfo.value ? "info" : "success",
				btnClick: isInfo.value
					? async ({ dialog: { options, index }, button }) => {
							const formComputed = registerProtocolFormInstance.value.formComputed;
							await useDoBeforeClose({ defaultValues, formComputed, index, options });
						}
					: async ({ dialog: { options, index }, button }) => {
							/** 提交表单时 校验 */
							const res = await registerProtocolFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="danger">{{ transformI18n($t("common.buttons.del")) }}</ElButton>
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
