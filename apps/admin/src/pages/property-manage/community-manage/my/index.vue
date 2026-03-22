<script lang="ts" setup>
definePage({
	meta: {
		// 我的小区
		title: "propertyManage_communityManage.my.pageTitle",
		icon: "mdi:home-account",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.my"),
	},
});

import { h, ref, computed } from "vue";
import { ElMessage, ElMessageBox, ElTag } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useMyListQuery } from "@/api/property-manage/community-manage/my";
import type { CommunityManageMyFormProps } from "./components/form";
import { defaultForm } from "./components/form";
import type {
	CommunityManageMyFormVO,
	CommunityStatusType,
	MyCommunityListItem,
	MyCommunityQueryParams,
} from "@01s-11comm/type";
import CommunityManageForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<MyCommunityQueryParams> = {
	province: "",
	city: "",
	district: "",
	communityName: "",
	communityCode: "",
	status: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useMyListQuery(plusSearchDefaultValues);

const communityManageFormInstance = ref<InstanceType<typeof CommunityManageForm> | null>(null);
const { setMode, isAdd, isEdit, isInfo } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const provinceLabelKeyMap = {
	福建省: "propertyManage_communityManage.my.options.province.fujian",
	广东省: "propertyManage_communityManage.my.options.province.guangdong",
	浙江省: "propertyManage_communityManage.my.options.province.zhejiang",
	江苏省: "propertyManage_communityManage.my.options.province.jiangsu",
	北京市: "propertyManage_communityManage.my.options.province.beijing",
	上海市: "propertyManage_communityManage.my.options.province.shanghai",
	四川省: "propertyManage_communityManage.my.options.province.sichuan",
	湖北省: "propertyManage_communityManage.my.options.province.hubei",
	山东省: "propertyManage_communityManage.my.options.province.shandong",
	湖南省: "propertyManage_communityManage.my.options.province.hunan",
	河北省: "propertyManage_communityManage.my.options.province.hebei",
	河南省: "propertyManage_communityManage.my.options.province.henan",
	江西省: "propertyManage_communityManage.my.options.province.jiangxi",
	安徽省: "propertyManage_communityManage.my.options.province.anhui",
} as const;

const statusLabelKeyMap = {
	operating: "propertyManage_communityManage.my.options.status.operating",
	preparing: "propertyManage_communityManage.my.options.status.preparing",
	maintenance: "propertyManage_communityManage.my.options.status.maintenance",
	disabled: "propertyManage_communityManage.my.options.status.disabled",
} as const;

function translateOptionLabel<T extends Record<string, string>>(value: string | undefined | null, labelMap: T) {
	if (!value) {
		return value ?? "";
	}

	const key = labelMap[value as keyof T];
	return key ? transformI18n($t(key)) : value;
}

const provinceOptions = computed(() =>
	Object.entries(provinceLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const statusOptions = computed(() =>
	Object.entries(statusLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.province"))),
		prop: "province",
		minWidth: 120,
		cellRenderer: ({ row }) => translateOptionLabel(row.province, provinceLabelKeyMap),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.city"))),
		prop: "city",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.district"))),
		prop: "district",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.communityName"))),
		prop: "communityName",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.communityCode"))),
		prop: "communityCode",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.createTime"))),
		prop: "createTime",
		minWidth: 170,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.updateTime"))),
		prop: "updateTime",
		minWidth: 170,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.my.fields.status"))),
		prop: "status",
		minWidth: 120,
		cellRenderer: ({ row }) => {
			const typeMap: Record<string, "success" | "warning" | "info" | "danger"> = {
				operating: "success",
				preparing: "warning",
				maintenance: "info",
				disabled: "danger",
			};
			return h(ElTag, { type: typeMap[row.status] ?? "info" }, () =>
				translateOptionLabel(row.status, statusLabelKeyMap),
			);
		},
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_communityManage.my.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.province")),
		prop: "province",
		valueType: "select",
		options: provinceOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.province")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.city")),
		prop: "city",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.city")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.district")),
		prop: "district",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.district")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.communityName")),
		prop: "communityName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.name")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.communityCode")),
		prop: "communityCode",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.code")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.status")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

function openDialog({ mode, row }: { mode: Mode; row?: MyCommunityListItem }) {
	setMode(mode);

	const formData: CommunityManageMyFormVO =
		isAdd.value || !row
			? cloneDeep(defaultForm)
			: cloneDeep({
					...defaultForm,
					province: (row.province as CommunityManageMyFormVO["province"]) || "福建省",
					city: row.city || "",
					district: row.district || "",
					name: row.communityName || "",
					code: row.communityCode || "",
					status: (row.status as CommunityStatusType) || "operating",
				});

	const props: CommunityManageMyFormProps = {
		form: formData,
		defaultValues: formData,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("propertyManage_communityManage.my.dialogs.addTitle"));
			}

			if (isEdit.value) {
				return transformI18n($t("propertyManage_communityManage.my.dialogs.editTitle"));
			}

			return transformI18n($t("propertyManage_communityManage.my.dialogs.infoTitle"));
		},
		props,
		contentRenderer: () =>
			h(CommunityManageForm, {
				ref: communityManageFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = communityManageFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = communityManageFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			...(isInfo.value
				? []
				: ([
						{
							label: () => transformI18n($t("common.buttons.reset")),
							type: "warning",
							btnClick: () => {
								communityManageFormInstance.value?.plusFormInstance?.handleReset();
							},
						},
						{
							label: () => transformI18n($t("common.buttons.submit")),
							type: "success",
							btnClick: async ({ dialog: { options, index }, button }) => {
								const res = await communityManageFormInstance.value?.plusFormInstance?.handleSubmit();
								if (res) {
									button.btn.loading = true;
									await testAsync();
									button.btn.loading = false;
									closeDialog(options, index);
									await doFetch();
								}
							},
						},
					] as any)),
		],
	});
}

function handleEdit(row: MyCommunityListItem) {
	openDialog({ mode: "edit", row });
}

function handleView(row: MyCommunityListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: MyCommunityListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.my.dialogs.confirmDelete"), {
				communityName: row.communityName,
			}),
			transformI18n($t("propertyManage_communityManage.my.dialogs.deleteTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		await testAsync();
		ElMessage.success(transformI18n($t("propertyManage_communityManage.my.messages.deleteSuccess")));
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(transformI18n($t("propertyManage_communityManage.my.messages.deleteFailed")));
		}
	}
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
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="handleEdit(row)">
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
