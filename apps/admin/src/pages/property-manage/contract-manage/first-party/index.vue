<script lang="ts" setup>
definePage({
	meta: {
		title: "合同甲方",
		icon: "mdi:account-group",
		roles: ["物业团队"],
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type FirstPartyFormProps, defaultForm, type FirstPartyFormVO } from "./components/form";
import FirstPartyForm from "./components/form.vue";
import { useFirstPartyListQuery } from "@/api/property-manage/contract-manage/first-party";
import { type FirstPartyListItem, type FirstPartyQueryParams } from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";


/** 表单组件实例 */
const firstPartyFormInstance = ref<InstanceType<typeof FirstPartyForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
	useFirstPartyListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "甲方",
		prop: "partyA",
		width: 200,
	},
	{
		label: "甲方联系人",
		prop: "contactPerson",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		width: 130,
	},
	{
		label: "地址",
		prop: "address",
		minWidth: 250,
	},
	{
		label: "统一社会信用代码",
		prop: "creditCode",
		width: 180,
	},
	{
		label: "成立日期",
		prop: "establishmentDate",
		width: 120,
	},
	{
		label: "法定代表人",
		prop: "legalRepresentative",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
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
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isFetching.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同甲方",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<FirstPartyQueryParams> = {
	partyA: "",
	contactPerson: "",
	contactPhone: "",
	legalRepresentative: "",
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
	{
		label: "甲方",
		prop: "partyA",
		valueType: "input",
	},

	{
		label: "甲方联系人",
		prop: "contactPerson",
		valueType: "input",
	},

	{
		label: "联系电话",
		prop: "contactPhone",
		valueType: "input",
	},

	{
		label: "法定代表人",
		prop: "legalRepresentative",
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
	} as Partial<FirstPartyQueryParams>);
}

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: FirstPartyListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同甲方`;

	/** 业务对象 */
	const firstPartyFormVO: FirstPartyFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					partyA: row?.partyA || "",
					contactPerson: row?.contactPerson || "",
					contactPhone: row?.contactPhone || "",
					address: row?.address || "",
					creditCode: row?.creditCode || "",
					establishmentDate: row?.establishmentDate || "",
					legalRepresentative: row?.legalRepresentative || "",
					businessScope: row?.businessScope || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: FirstPartyFormProps = {
		form: firstPartyFormVO,
		defaultValues: firstPartyFormVO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(FirstPartyForm, {
				ref: firstPartyFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = firstPartyFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = firstPartyFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					// 手动重置表单
					firstPartyFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await firstPartyFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
