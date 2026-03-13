<script lang="ts" setup>
definePage({
	meta: {
		// 排班设置
		title: "settingManage.organizeManage.schedulingSetting.pageTitle",
		icon: "mdi:calendar-clock",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.schedulingSetting"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { useSchedulingSettingListQuery } from "@/api/setting-manage/organize-manage/scheduling-setting";
import type { SchedulingSetting, SchedulingSettingFormVO, SchedulingSettingListQuery } from "@01s-11comm/type";
import { schedulingStatusOptions } from "@01s-11comm/type";
import { defaultForm, type SchedulingSettingFormProps } from "./components/form";
import SchedulingSettingForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<SchedulingSettingListQuery> = {
	name: "",
	type: "",
	cycle: "",
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
} = useSchedulingSettingListQuery(plusSearchDefaultValues);

const schedulingTypeLabelMap = {
	fixed: "settingManage.organizeManage.schedulingSetting.form.options.type.fixed",
	rotation: "settingManage.organizeManage.schedulingSetting.form.options.type.rotation",
	flexible: "settingManage.organizeManage.schedulingSetting.form.options.type.flexible",
} as const;

const schedulingStatusLabelMap = {
	enabled: "settingManage.organizeManage.schedulingSetting.form.options.status.enabled",
	disabled: "settingManage.organizeManage.schedulingSetting.form.options.status.disabled",
} as const;

function translateSchedulingTypeLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = schedulingTypeLabelMap[value as keyof typeof schedulingTypeLabelMap];
	return key ? renderI18n($t(key)) : value;
}

function translateSchedulingStatusLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = schedulingStatusLabelMap[value as keyof typeof schedulingStatusLabelMap];
	return key ? renderI18n($t(key)) : value;
}

const translatedSchedulingStatusOptions = withLocale(() =>
	schedulingStatusOptions.map((option) => ({
		...option,
		label: translateSchedulingStatusLabel(String(option.value)),
	})),
);

const schedulingSettingFormInstance = ref<InstanceType<typeof SchedulingSettingForm> | null>(null);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.name"))),
		prop: "name",
		minWidth: 200,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.type"))),
		prop: "type",
		width: 120,
		cellRenderer: ({ row }) => translateSchedulingTypeLabel(row.type),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.cycle"))),
		prop: "cycle",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.effectiveTime"))),
		prop: "effectiveTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.staff"))),
		prop: "staff",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.status"))),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateSchedulingStatusLabel(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: renderI18n($t("settingManage.organizeManage.schedulingSetting.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.name")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedSchedulingStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.status")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	labelWidth: 140,
	searchText: renderI18n($t("common.buttons.search")),
	resetText: renderI18n($t("common.buttons.reset")),
});

const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const { setMode, isAdd, isEdit } = useMode();

function openDialog({ mode, row }: { mode: Mode; row?: SchedulingSetting }) {
	setMode(mode);

	const formVO: SchedulingSettingFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					name: row?.name || "",
					type: row?.type || "",
					cycle: row?.cycle || "1",
					effectiveTime: row?.effectiveTime || "",
					staff: row?.staff || "",
					status: row?.status || "",
				})
			: cloneDeep(defaultForm);

	const props: SchedulingSettingFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? renderI18n($t("settingManage.organizeManage.schedulingSetting.dialogs.addTitle"))
				: renderI18n($t("settingManage.organizeManage.schedulingSetting.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(SchedulingSettingForm, {
				ref: schedulingSettingFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = schedulingSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => renderI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = schedulingSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => renderI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					schedulingSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => renderI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await schedulingSettingFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

function handleEdit(row: SchedulingSetting) {
	openDialog({ mode: "edit", row });
}

function handleDelete(row: SchedulingSetting) {
	console.log("删除排班", row);
}

function handleToggleStatus(row: SchedulingSetting) {
	const newStatus = row.status === "enabled" ? "disabled" : "enabled";
	console.log(`${row.status === "enabled" ? "停用" : "启用"}排班`, row);
	message(
		newStatus === "enabled"
			? renderI18n($t("settingManage.organizeManage.common.buttons.enable"))
			: renderI18n($t("settingManage.organizeManage.common.buttons.disable")),
		{ type: "success" },
	);
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton :type="row.status === 'enabled' ? 'info' : 'primary'" @click="handleToggleStatus(row)">
							{{
								row.status === "enabled"
									? transformI18n($t("settingManage.organizeManage.common.buttons.disable"))
									: transformI18n($t("settingManage.organizeManage.common.buttons.enable"))
							}}
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
