<script lang="ts" setup>
definePage({
	meta: {
		// 排班表
		title: "settingManage.organizeManage.workingSchedule.pageTitle",
		icon: "mdi:calendar",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.workingSchedule"),
	},
});

import { h, ref } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useWorkingScheduleListQuery } from "@/api/setting-manage/organize-manage/working-schedule";
import type { ScheduleType, WorkingSchedule, WorkingScheduleFormVO, WorkingScheduleListQuery } from "@01s-11comm/type";
import { WorkingScheduleFormProps, defaultForm } from "./components/form";
import WorkingScheduleForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<WorkingScheduleListQuery> = {
	name: "",
	type: "morning",
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
} = useWorkingScheduleListQuery(plusSearchDefaultValues);

const scheduleTypeLabelMap = {
	morning: "settingManage.organizeManage.workingSchedule.options.morning",
	afternoon: "settingManage.organizeManage.workingSchedule.options.afternoon",
	evening: "settingManage.organizeManage.workingSchedule.options.evening",
	night: "settingManage.organizeManage.workingSchedule.options.night",
	full_day: "settingManage.organizeManage.workingSchedule.options.allDay",
} as const;

const weekdayLabelMap = {
	1: "settingManage.organizeManage.workingSchedule.options.monday",
	2: "settingManage.organizeManage.workingSchedule.options.tuesday",
	3: "settingManage.organizeManage.workingSchedule.options.wednesday",
	4: "settingManage.organizeManage.workingSchedule.options.thursday",
	5: "settingManage.organizeManage.workingSchedule.options.friday",
	6: "settingManage.organizeManage.workingSchedule.options.saturday",
	7: "settingManage.organizeManage.workingSchedule.options.sunday",
} as const;

function translateScheduleTypeLabel(value?: ScheduleType | string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = scheduleTypeLabelMap[value as keyof typeof scheduleTypeLabelMap];
	return key ? transformI18n($t(key)) : value;
}

function translateWeekdayLabel(value?: number | string | null) {
	if (value === null || value === undefined || value === "" || Number(value) === 0) {
		return "";
	}

	const key = weekdayLabelMap[Number(value) as keyof typeof weekdayLabelMap];
	return key ? transformI18n($t(key)) : String(value);
}

function translateEnabledLabel(value?: boolean | null) {
	return value
		? transformI18n($t("settingManage.organizeManage.workingSchedule.status.enabled"))
		: transformI18n($t("settingManage.organizeManage.workingSchedule.status.disabled"));
}

const translatedScheduleTypeOptions = withLocale(() => [
	{ label: transformI18n($t("settingManage.organizeManage.workingSchedule.options.morning")), value: "morning" },
	{ label: transformI18n($t("settingManage.organizeManage.workingSchedule.options.afternoon")), value: "afternoon" },
	{ label: transformI18n($t("settingManage.organizeManage.workingSchedule.options.evening")), value: "evening" },
	{ label: transformI18n($t("settingManage.organizeManage.workingSchedule.options.night")), value: "night" },
	{ label: transformI18n($t("settingManage.organizeManage.workingSchedule.options.allDay")), value: "full_day" },
]);

const workingScheduleFormInstance = ref<InstanceType<typeof WorkingScheduleForm> | null>(null);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.workingSchedule.fields.name"))),
		prop: "name",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.workingSchedule.fields.type"))),
		prop: "type",
		width: 120,
		cellRenderer: ({ row }) => translateScheduleTypeLabel(row.type),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.workingSchedule.fields.startTime")),
		),
		prop: "startTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.workingSchedule.fields.endTime")),
		),
		prop: "endTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.workingSchedule.fields.weekday")),
		),
		prop: "weekday",
		width: 100,
		cellRenderer: ({ row }) => translateWeekdayLabel(row.weekday),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.workingSchedule.fields.managerName")),
		),
		prop: "managerName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.workingSchedule.fields.phone")),
		),
		prop: "phone",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.workingSchedule.fields.status")),
		),
		prop: "enabled",
		width: 100,
		cellRenderer: ({ row }) => translateEnabledLabel(row.enabled),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.organizeManage.workingSchedule.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.name")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedScheduleTypeOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.type")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	labelWidth: 140,
	...plusSearchButtonTexts,
});

const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

function openDialog({ mode, row }: { mode: Mode; row?: WorkingSchedule }) {
	setMode(mode);

	const formVO: WorkingScheduleFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					name: row?.name || "",
					type: row?.type || "morning",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					weekday: row?.weekday || 1,
					managerName: row?.managerName || "",
					phone: row?.phone || "",
					description: row?.description || "",
					enabled: row?.enabled ?? true,
				})
			: cloneDeep(defaultForm);

	const props: WorkingScheduleFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("settingManage.organizeManage.workingSchedule.dialogs.addTitle"))
				: transformI18n($t("settingManage.organizeManage.workingSchedule.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(WorkingScheduleForm, {
				ref: workingScheduleFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = workingScheduleFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = workingScheduleFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					workingScheduleFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await workingScheduleFormInstance.value?.plusFormInstance?.handleSubmit();
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

const { setMode, isAdd, isEdit } = useMode();

function handleEditSchedule(row: WorkingSchedule) {
	openDialog({ mode: "edit", row });
}

function handleDeleteSchedule(row: WorkingSchedule) {
	console.log("删除排班:", row);
}

function handleExportSchedule() {
	console.log("导出排班表");
}
</script>

<template>
	<section :key="locale" class="working-schedule-container">
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
				<ElButton type="info" @click="handleExportSchedule">
					{{ transformI18n($t("settingManage.organizeManage.common.buttons.export")) }}
				</ElButton>
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
						<ElButton type="warning" @click="handleEditSchedule(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDeleteSchedule(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.working-schedule-container {
}
</style>
