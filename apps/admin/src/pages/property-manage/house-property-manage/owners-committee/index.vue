<script lang="ts" setup>
definePage({
	meta: {
		// 业委会
		title: "property-manage_house-property-manage.owners-committee.pageTitle",
		icon: "mdi:account-tie",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownersCommittee"),
	},
});

import { h, ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type { OwnersCommitteeListItem, OwnersCommitteeQueryParams, OwnersCommitteeFormVO } from "@01s-11comm/type";
import { ownersCommitteeStatusOptions } from "@01s-11comm/type";
import { type OwnersCommitteeFormProps, defaultForm } from "./components/form";
import OwnersCommitteeForm from "./components/form.vue";
import { useOwnersCommitteeListQuery } from "@/api/property-manage/house-property-manage/owners-committee";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<OwnersCommitteeQueryParams> = {
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
} = useOwnersCommitteeListQuery(plusSearchDefaultValues);

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
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.fullName")),
		prop: "fullName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.status")),
		prop: "status",
		valueType: "select",
		options: ownersCommitteeStatusOptions,
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
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.fullName")),
		),
		prop: "fullName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.gender")),
		),
		prop: "gender",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.phone")),
		),
		prop: "phone",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.idNumber")),
		),
		prop: "idNumber",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.address")),
		),
		prop: "address",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.position")),
		),
		prop: "position",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.post")),
		),
		prop: "post",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.tenure")),
		),
		prop: "tenure",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owners-committee.fields.status")),
		),
		prop: "status",
		width: 100,
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
	title: transformI18n($t("property-manage_house-property-manage.owners-committee.tableTitle")),
	columns: columns.value,
}));

/** 表单组件实例 */
const ownersCommitteeFormInstance = ref<InstanceType<typeof OwnersCommitteeForm> | null>(null);

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();
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
function openDialog(params: { mode: Mode; row?: OwnersCommitteeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formData: OwnersCommitteeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				fullName: row?.fullName || "",
				gender: row?.gender || "男",
				phone: row?.phone || "",
				idNumber: row?.idNumber || "",
				address: row?.address || "",
				position: row?.position || "",
				post: row?.post || "",
				tenure: row?.tenure || "",
				status: row?.status || "启用",
			});

	/** 表单组件需要的props */
	const formProps: OwnersCommitteeFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_house-property-manage.owners-committee.dialogs.addTitle"))
				: transformI18n($t("property-manage_house-property-manage.owners-committee.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(OwnersCommitteeForm, {
				ref: ownersCommitteeFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = ownersCommitteeFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownersCommitteeFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownersCommitteeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ownersCommitteeFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await sleep(1300);
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
