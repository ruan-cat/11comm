<script lang="ts" setup>
definePage({
	meta: {
		title: "业主信息",
		icon: "mdi:account-card",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerInformation"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type { OwnerInformationListItem, OwnerInformationQueryParams, OwnerInformationFormVO } from "@01s-11comm/type";
import { personTypeOptions } from "@01s-11comm/type";
import { useOwnerInformationListQuery } from "@/api/property-manage/house-property-manage/owner-information";

import { type OwnerInformationFormProps, defaultForm } from "./components/form";
import OwnerInformationForm from "./components/form.vue";
/** 表格组件实例 */
const OwnerInformationFormInstance = ref<InstanceType<typeof OwnerInformationForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<OwnerInformationQueryParams> = {
	personType: "",
	ownerName: "",
	houseNo: "",
	phone: "",
	idCard: "",
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
} = useOwnerInformationListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 人员类型
	{
		label: "人员类型",
		prop: "personType",
		valueType: "select",
		options: personTypeOptions,
	},

	// 客户名称
	{
		label: "客户名称",
		prop: "ownerName",
		valueType: "input",
	},

	// 房屋编号
	{
		label: "房屋编号",
		prop: "houseNo",
		valueType: "input",
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "phone",
		valueType: "input",
	},

	// 身份证
	{
		label: "身份证",
		prop: "idCard",
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

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{ label: "名称", prop: "name", width: 120 },
	{ label: "状态", prop: "status", width: 120 },
	{ label: "创建时间", prop: "createTime", width: 160 },
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
	title: "业主信息",
	columns: columns.value,
});

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: OwnerInformationListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主信息`;

	/** 业务对象 */
	const formData: OwnerInformationFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				人员类型: "个人",
				人员角色: "业主",
				客户名称: row?.name || "",
				联系手机: "",
				性别: "男",
				备用手机: "",
				地址: "",
				门禁钥匙: "",
				身份证: "",
				备注: "",
			});

	/** 表单组件需要的props */
	const formProps: OwnerInformationFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(OwnerInformationForm, {
				ref: OwnerInformationFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnerInformationFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = OwnerInformationFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					OwnerInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await OwnerInformationFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 测试异步函数 */
async function testAsync() {
	await sleep(1300);
}
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
