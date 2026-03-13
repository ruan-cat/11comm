<script lang="ts" setup>
definePage({
	meta: {
		// 菜单目录
		title: "devTeam.menuManage.catalog.pageTitle",
		icon: "mdi:folder",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.catalog"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import {
	type MenuCatalogFormData,
	type MenuCatalogListItem,
	type MenuCatalogQueryParams,
	groupTypeOptions,
	storeTypeOptions,
} from "@01s-11comm/type";
import { useMenuCatalogListQuery } from "@/api/dev-team/menu-manage/catalog";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { type RemovePageIndexAndPageSize } from "@/utils/remove-pageIndex-and-pageSize";
import { type CatalogFormProps, defaultForm } from "./components/form";
import CatalogForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const groupTypeOptionLabelMap = {
	system: $t("devTeam.menuManage.catalog.form.options.system"),
	merchant: $t("devTeam.menuManage.catalog.form.options.merchant"),
	custom: $t("devTeam.menuManage.catalog.form.options.custom"),
	temp: $t("devTeam.menuManage.catalog.form.options.temp"),
} as const;

const storeTypeOptionLabelMap = {
	property: $t("devTeam.menuManage.catalog.form.options.property"),
	merchant: $t("devTeam.menuManage.catalog.form.options.merchantPlatform"),
	owner: $t("devTeam.menuManage.catalog.form.options.owner"),
	common: $t("devTeam.menuManage.catalog.form.options.common"),
} as const;

function translateGroupType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = groupTypeOptionLabelMap[value as keyof typeof groupTypeOptionLabelMap];
	return key ? renderI18n(key) : value;
}

function translateStoreType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = storeTypeOptionLabelMap[value as keyof typeof storeTypeOptionLabelMap];
	return key ? renderI18n(key) : value;
}

const translatedGroupTypeOptions = withLocale(() =>
	groupTypeOptions.map((option) => ({
		...option,
		label: translateGroupType(String(option.value)),
	})),
);

const translatedStoreTypeOptions = withLocale(() =>
	storeTypeOptions.map((option) => ({
		...option,
		label: translateStoreType(String(option.value)),
	})),
);

const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<MenuCatalogQueryParams> = {
	name: "",
	type: "",
	status: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useMenuCatalogListQuery(plusSearchDefaultValues);

const columns = withLocale<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.name"))),
		prop: "name",
		width: 150,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.icon"))),
		prop: "icon",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.label"))),
		prop: "label",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.seq"))),
		prop: "seq",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.groupType"))),
		prop: "groupType",
		width: 120,
		cellRenderer: ({ row }) => translateGroupType(row.groupType ?? row.typeText),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.storeType"))),
		prop: "storeType",
		width: 120,
		cellRenderer: ({ row }) => translateStoreType(row.storeType ?? row.storeTypeText),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("devTeam.menuManage.catalog.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("devTeam.menuManage.catalog.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("devTeam.menuManage.catalog.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: renderI18n($t("devTeam.menuManage.catalog.fields.groupType")),
		prop: "groupType",
		valueType: "select",
		options: translatedGroupTypeOptions.value,
	},
	{
		label: renderI18n($t("devTeam.menuManage.catalog.fields.storeType")),
		prop: "storeType",
		valueType: "select",
		options: translatedStoreTypeOptions.value,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	searchText: renderI18n($t("common.buttons.search")),
	resetText: renderI18n($t("common.buttons.reset")),
});

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { setMode, isAdd, isEdit } = useMode();
const catalogFormInstance = ref<InstanceType<typeof CatalogForm> | null>(null);
const [isLoadingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog(params: { mode: Mode; row?: MenuCatalogListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const menuCatalogFormData: MenuCatalogFormData = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					gid: row?.gid || "",
					icon: row?.icon || "",
					name: row?.name || "",
					seq: Number(row?.seq) || 0,
					description: "",
					groupType: row?.groupType || "system",
					label: row?.label || "",
					storeType: row?.storeType || "property",
				})
			: structuredClone(defaultForm);

	const formProps: CatalogFormProps = {
		form: menuCatalogFormData,
		defaultValues: structuredClone(menuCatalogFormData),
	};
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? renderI18n($t("devTeam.menuManage.catalog.dialogs.addTitle"))
				: renderI18n($t("devTeam.menuManage.catalog.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(CatalogForm, {
				ref: catalogFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = catalogFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = catalogFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					catalogFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => renderI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await catalogFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						doFetch();
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
				<!-- @vue-ignore -->
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
