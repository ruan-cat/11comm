<script lang="ts" setup>
definePage({
	meta: {
		// 业主成员
		title: "property-manage_house-property-manage.owner-member.pageTitle",
		icon: "mdi:account-group",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerMember"),
	},
});

import { h, ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type { OwnerMemberListItem, OwnerMemberQueryParams, OwnerMemberFormVO } from "@01s-11comm/type";
import { ownerMemberStatusOptions } from "@01s-11comm/type";
import { type OwnerMemberFormProps, defaultForm } from "./components/form";
import OwnerMemberForm from "./components/form.vue";
import { useOwnerMemberListQuery } from "@/api/property-manage/house-property-manage/owner-member";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

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
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

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
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
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
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.status")),
		prop: "status",
		valueType: "select",
		options: ownerMemberStatusOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.memberFace")),
		),
		prop: "memberFace",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.name")),
		),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.gender")),
		),
		prop: "gender",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.type")),
		),
		prop: "type",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.idCard")),
		),
		prop: "idCard",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.contact")),
		),
		prop: "contact",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.homeAddress")),
		),
		prop: "homeAddress",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.accessKey")),
		),
		prop: "accessKey",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-member.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_house-property-manage.owner-member.tableTitle")),
	columns: columns.value,
}));

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

	/** 业务对象 */
	const formData: OwnerMemberFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
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
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_house-property-manage.owner-member.dialogs.addTitle"))
				: transformI18n($t("property-manage_house-property-manage.owner-member.dialogs.editTitle")),
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
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownerMemberFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownerMemberFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
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
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
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
