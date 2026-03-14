<script lang="ts" setup>
definePage({
	meta: {
		// 业主信息
		title: "property-manage_house-property-manage.owner-information.pageTitle",
		icon: "mdi:account-card",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerInformation"),
	},
});

import { ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type { OwnerInformationListItem, OwnerInformationQueryParams, OwnerInformationFormVO } from "@01s-11comm/type";
import { personTypeOptions } from "@01s-11comm/type";
import { useOwnerInformationListQuery } from "@/api/property-manage/house-property-manage/owner-information";

import { type OwnerInformationFormProps, defaultForm } from "./components/form";
import OwnerInformationForm from "./components/form.vue";
/** 表格组件实例 */
const OwnerInformationFormInstance = ref<InstanceType<typeof OwnerInformationForm> | null>(null);

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

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
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	// 人员类型
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.personType")),
		prop: "personType",
		valueType: "select",
		options: personTypeOptions,
	},

	// 客户名称
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},

	// 房屋编号
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.houseNo")),
		prop: "houseNo",
		valueType: "input",
	},

	// 联系电话
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.phone")),
		prop: "phone",
		valueType: "input",
	},

	// 身份证
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.idCard")),
		prop: "idCard",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-information.fields.name")),
		),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-information.fields.status")),
		),
		prop: "status",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_house-property-manage.owner-information.fields.createTime")),
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
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_house-property-manage.owner-information.tableTitle")),
	columns: columns.value,
}));

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

	/** 业务对象 */
	const formData: OwnerInformationFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				personnelType: "个人",
				personnelRole: "业主",
				customerName: row?.name || "",
				contactPhone: "",
				gender: "男",
				backupPhone: "",
				address: "",
				accessKey: "",
				idCard: "",
				remark: "",
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
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_house-property-manage.owner-information.dialogs.addTitle"))
				: transformI18n($t("property-manage_house-property-manage.owner-information.dialogs.editTitle")),
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
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = OwnerInformationFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					OwnerInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
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
