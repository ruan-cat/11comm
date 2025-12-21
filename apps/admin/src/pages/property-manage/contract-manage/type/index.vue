<script lang="ts" setup>
definePage({
	meta: {
		title: "合同类型",
		icon: "carbon:category",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.contractManage.type"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog, updateDialog, closeAllDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";

import { useMode, type Mode } from "@/composables/use-mode";
import { type AddFormProps, defaultForm, type ContractTypeFormVO, type IsAuditType } from "./components/form";
import AddForm from "./components/form.vue";
import { useTypeListQuery } from "@/api/property-manage/contract-manage/type";
import { type TypeListItem, type TypeQueryParams, auditTypeOptions } from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";

/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const addFormInstance = ref<InstanceType<typeof AddForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<TypeQueryParams> = {
	typeName: "",
	description: "",
	isAudit: undefined,
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
} = useTypeListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "类型名称",
		prop: "typeName",
		width: 120,
	},
	{
		label: "是否审核",
		prop: "isAudit",
		width: 120,
	},
	{
		label: "描述",
		prop: "description",
		minWidth: 200,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 360,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同类型",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 合同类型名称 */
	{
		label: "合同类型名称",
		prop: "typeName",
		valueType: "input",
	},
	/** 审核类型 */
	{
		label: "审核类型",
		prop: "isAudit",
		valueType: "select",
		options: auditTypeOptions,
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: TypeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同类型`;

	/** 业务对象 */
	const contractTypeFormVO: ContractTypeFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					typeName: row?.typeName || "",
					isAudit: (row?.isAudit === "是" ? "是" : "否") as IsAuditType,
					description: row?.description || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: AddFormProps = {
		form: contractTypeFormVO,
		defaultValues: contractTypeFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(AddForm, {
				ref: addFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = addFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = addFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					addFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await addFormInstance.value.plusFormInstance.handleSubmit();
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

/** 删除合同类型 */
function handleDelete(row: TypeListItem) {
	consola.log("删除合同类型:", row.typeName);
}

/** 查看合同模板 */
function handleViewTemplate(row: TypeListItem) {
	consola.log("查看合同模板:", row.typeName);
}

/** 扩展功能 */
function handleExtend(row: TypeListItem) {
	consola.log("扩展功能:", row.typeName);
}

/** 添加审核人员 */
function addAuditPeople() {
	consola.log("添加审核人员");
}

/** 挂载完后进行初始化 */
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
				<ElButton type="primary" @click="addAuditPeople"> 添加审核人员 </ElButton>
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
						<ElButton type="info" @click="handleExtend(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.extent")) }}
						</ElButton>
						<ElButton type="info" @click="handleViewTemplate(row)">
							{{ transformI18n($t("property-manage_contract-manage.contract-type.button.template")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
