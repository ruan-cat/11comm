<script lang="ts" setup>
definePage({
	meta: {
		title: "业主成员",
		icon: "mdi:account-group",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerMember"),
	},
});

import { ref, computed } from "vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { transformI18n } from "@/plugins/i18n";
import type { OwnerMemberListItem, OwnerMemberQueryParams, OwnerMemberFormVO } from "@01s-11comm/type";
import { ownerMemberStatusOptions } from "@01s-11comm/type";
import { type OwnerMemberFormProps, defaultForm } from "./components/form";
import OwnerMemberForm from "./components/form.vue";
import { useOwnerMemberListQuery } from "@/api/property-manage/house-property-manage/owner-member";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<OwnerMemberQueryParams> = {
	name: "",
	status: "",
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
} = useOwnerMemberListQuery(plusSearchDefaultValues);

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
	{
		label: "名称",
		prop: "name",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: ownerMemberStatusOptions,
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
	{
		label: "成员人脸",
		prop: "memberFace",
		width: 120,
	},
	{
		label: "名称",
		prop: "name",
		width: 120,
	},
	{
		label: "性别",
		prop: "gender",
		width: 80,
	},
	{
		label: "类型",
		prop: "type",
		width: 100,
	},
	{
		label: "身份证",
		prop: "idCard",
		width: 160,
	},
	{
		label: "联系方式",
		prop: "contact",
		width: 120,
	},
	{
		label: "家庭住址",
		prop: "homeAddress",
		width: 180,
	},
	{
		label: "门禁钥匙",
		prop: "accessKey",
		width: 100,
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
	title: "业主成员",
	columns: columns.value,
});

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 表单组件实例 */
const ownerMemberFormInstance = ref<InstanceType<typeof OwnerMemberForm> | null>(null);
/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: OwnerMemberListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主成员`;

	/** 业务对象 */
	const formData: OwnerMemberFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				memberFace: row?.memberFace || "",
				name: row?.name || "",
				gender: row?.gender || "男",
				type: row?.type || "家庭成员",
				idCard: row?.idCard || "",
				contact: row?.contact || "",
				homeAddress: row?.homeAddress || "",
				accessKey: row?.accessKey || "",
			});

	/** 表单组件需要的props */
	const formProps: OwnerMemberFormProps = {
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
			h(OwnerMemberForm, {
				ref: ownerMemberFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = ownerMemberFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownerMemberFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownerMemberFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ownerMemberFormInstance.value?.plusFormInstance?.handleSubmit();
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
