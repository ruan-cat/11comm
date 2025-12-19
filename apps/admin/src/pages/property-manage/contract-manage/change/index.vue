<script lang="ts" setup>
definePage({
	meta: {
		title: "合同变更",
		icon: "mdi:swap-horizontal",
		roles: ["物业团队"],
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { defaultAddDialogParams } from "@/config/constant";
import { useMode, type Mode } from "@/composables/use-mode";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { type ContractChangeFormProps, defaultForm, type ContractChangeFormVO } from "./components/form";
import ContractChangeForm from "./components/form.vue";
import { useChangeListQuery } from "@/api/property-manage/contract-manage/change";
import { type ChangeListItem, type ChangeQueryParams, contractTypeOptions, changeStatusOptions } from "@01s-11comm/type";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ChangeQueryParams> = {
	contractName: "",
	contractNumber: "",
	contractType: undefined,
	partyA: "",
	partyB: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "合同名称",
		prop: "contractName",
		valueType: "input",
	},
	{
		label: "合同编号",
		prop: "contractNumber",
		valueType: "input",
	},
	{
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
	},
]);

/** 表格搜索栏组件配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

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
} = useChangeListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 搜索处理函数 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "合同名称",
		prop: "contractName",
		width: 160,
	},
	{
		label: "合同编号",
		prop: "contractNumber",
		width: 140,
	},
	{
		label: "合同类型",
		prop: "contractType",
		width: 120,
	},
	{
		label: "甲方",
		prop: "partyA",
		width: 140,
	},
	{
		label: "乙方",
		prop: "partyB",
		width: 140,
	},
	{
		label: "变更类型",
		prop: "changeType",
		width: 120,
	},
	{
		label: "变更人",
		prop: "changer",
		width: 100,
	},
	{
		label: "申请时间",
		prop: "applyTime",
		width: 160,
	},
	{
		label: "说明",
		prop: "description",
		width: 200,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
		formatter: (row: ChangeListItem) => {
			const statusMap = {
				待审核: "待审核",
				审核中: "审核中",
				已通过: "已通过",
				已拒绝: "已拒绝",
				已撤回: "已撤回",
			};
			return statusMap[row.status] || row.status;
		},
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "合同变更",
	columns: columns.value,
});

/** 表单组件实例引用 */
const ContractChangeFormInstance = ref<InstanceType<typeof ContractChangeForm> | null>(null);

/** 模式相关状态管理 */
const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 异步操作加载状态 */
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框参数接口 */
interface OpenDialogParams {
	/** 操作模式 */
	mode: Mode;
	/** 行数据 */
	row?: ChangeListItem;
}

/** 打开弹框函数 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}合同变更`;

	/** 业务对象 */
	const 合同变更表单业务对象 = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					contractName: row?.contractName || "",
					contractNumber: row?.contractNumber || "",
					contractType: row?.contractType || "",
					partyA: row?.partyA || "",
					partyAContact: "",
					partyAPhone: "",
					partyB: row?.partyB || "",
					partyBContact: "",
					partyBPhone: "",
					handler: "",
					handlerPhone: "",
					contractAmount: "",
					startTime: "",
					endTime: "",
					signingTime: "",
					changeType: row?.changeType || "合同金额",
					changer: row?.changer || "",
					description: row?.description || "",
					beforeChange: "",
					afterChange: "",
					attachments: [],
				} as ContractChangeFormVO)
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: ContractChangeFormProps = {
		form: 合同变更表单业务对象 as ContractChangeFormVO,
		defaultValues: 合同变更表单业务对象 as ContractChangeFormVO,
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
			h(ContractChangeForm, {
				ref: ContractChangeFormInstance,
				...formProps,
				mode: mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ContractChangeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ContractChangeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					ContractChangeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await ContractChangeFormInstance.value?.plusFormInstance?.handleSubmit();
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
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.subjectChange")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.termadjustment")) }}
				</ElButton>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("property-manage_contract-manage.contract-change.assetchange")) }}
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("property-manage_contract-manage.contract-change.details")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("property-manage_contract-manage.contract-change.cencel")) }}
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
