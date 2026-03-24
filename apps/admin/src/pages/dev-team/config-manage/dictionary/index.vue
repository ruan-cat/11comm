<script lang="ts" setup>
definePage({
	meta: {
		// 字典
		title: "devTeam.configManage.dictionary.pageTitle",
		icon: "mdi:book",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.dictionary"),
	},
});

import { computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import {
	type DictionaryListItem,
	type DictionaryQueryParams,
	type DictionaryFormVO,
	dictionaryTypeOptions,
	enableStatusOptions,
} from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useDictionaryListQuery } from "@/api/dev-team/config-manage/dictionary";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type DictionaryFormProps, defaultForm } from "./components/form";
import DictionaryForm from "./components/form.vue";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

const dictionaryTypeLabelKeyMap = {
	system: "devTeam.configManage.dictionary.form.options.system",
	business: "devTeam.configManage.dictionary.form.options.business",
	region: "devTeam.configManage.dictionary.form.options.region",
	status: "devTeam.configManage.dictionary.form.options.status",
	config: "devTeam.configManage.dictionary.form.options.config",
} as const;

const enableStatusLabelKeyMap = {
	enabled: "devTeam.configManage.dictionary.form.options.enabled",
	disabled: "devTeam.configManage.dictionary.form.options.disabled",
} as const;

const translatedDictionaryTypeOptions = computed(() =>
	dictionaryTypeOptions.map((option) => ({
		...option,
		label: transformI18n(dictionaryTypeLabelKeyMap[String(option.value) as keyof typeof dictionaryTypeLabelKeyMap]),
	})),
);

const translatedEnableStatusOptions = computed(() =>
	enableStatusOptions.map((option) => ({
		...option,
		label: transformI18n(enableStatusLabelKeyMap[String(option.value) as keyof typeof enableStatusLabelKeyMap]),
	})),
);

const plusSearchModelRef: FieldValues & Partial<DictionaryQueryParams> = {
	dictionaryName: "",
	dictionaryCode: "",
	dictionaryType: "",
	isEnabled: "",
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
} = useDictionaryListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryName"))),
		prop: "dictionaryName",
		width: 180,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode"))),
		prop: "dictionaryCode",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryType"))),
		prop: "dictionaryType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.itemCount"))),
		prop: "itemCount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.description"))),
		prop: "description",
		width: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.isEnabled"))),
		prop: "isEnabled",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.creator"))),
		prop: "creator",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 320,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.configManage.dictionary.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryName")),
		prop: "dictionaryName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode")),
		prop: "dictionaryCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryType")),
		prop: "dictionaryType",
		valueType: "select",
		options: translatedDictionaryTypeOptions.value,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.isEnabled")),
		prop: "isEnabled",
		valueType: "select",
		options: translatedEnableStatusOptions.value,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { setMode, isAdd, isEdit } = useMode();
const [isLoadingT, setIsLoadingT] = useToggle(false);
const dictionaryFormInstance = ref<InstanceType<typeof DictionaryForm> | null>(null);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

function openDialog(params: { mode: Mode; row?: DictionaryListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formData: DictionaryFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					dictionaryName: row?.dictionaryName || "",
					dictionaryCode: row?.dictionaryCode || "",
					dictionaryType: row?.dictionaryType || "",
					dictionaryDescription: row?.dictionaryDescription || "",
					remark: row?.remark || "",
				})
			: cloneDeep(defaultForm);

	const props: DictionaryFormProps = {
		form: formData,
		defaultValues: formData,
	};
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("devTeam.configManage.dictionary.dialogs.addTitle"))
				: transformI18n($t("devTeam.configManage.dictionary.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(DictionaryForm, {
				ref: dictionaryFormInstance,
				...props,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = dictionaryFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = dictionaryFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					dictionaryFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await dictionaryFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

const { gotoDetailPage } = useGotoDetailsPage();

function gotoDictionaryItemsPage(row: DictionaryListItem) {
	// @ts-ignore 未来需要修复类型错误，当前保留已有跳转逻辑
	gotoDetailPage({
		name: "dev-team-config-manage--detail-page-dictionary-items-[id]",
		params: {
			id: row.id,
		},
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
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="info" @click="gotoDictionaryItemsPage(row)">
							{{ transformI18n($t("devTeam.configManage.dictionary.buttons.manageItems")) }}
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
