<script lang="ts" setup>
definePage({
	meta: {
		// 班次设置
		title: "settingManage.organizeManage.shiftSetting.pageTitle",
		icon: "mdi:clock-time-eight",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.shiftSetting"),
	},
});

import { h, ref, computed } from "vue";
import { ElMessageBox } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useShiftSettingListQuery } from "@/api/setting-manage/organize-manage/shift-setting";
import { message } from "@/utils/message";
import { defaultForm, type ShiftSettingFormProps } from "./components/form";
import type { ShiftSetting, ShiftSettingFormVO, ShiftSettingListQuery } from "@01s-11comm/type";
import ShiftSettingForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<ShiftSettingListQuery> = {
	name: "",
	type: "",
	startTime: "",
	endTime: "",
	enabled: true,
	description: "",
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
} = useShiftSettingListQuery(plusSearchDefaultValues);

const { setMode, isAdd, isEdit } = useMode();
const shiftSettingFormInstance = ref<InstanceType<typeof ShiftSettingForm> | null>(null);

const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const shiftTypeLabelMap = {
	白班: "settingManage.organizeManage.shiftSetting.form.options.type.day",
	夜班: "settingManage.organizeManage.shiftSetting.form.options.type.night",
	中班: "settingManage.organizeManage.shiftSetting.form.options.type.middle",
	全天: "settingManage.organizeManage.shiftSetting.form.options.type.allDay",
	day: "settingManage.organizeManage.shiftSetting.form.options.type.day",
	night: "settingManage.organizeManage.shiftSetting.form.options.type.night",
	middle: "settingManage.organizeManage.shiftSetting.form.options.type.middle",
	allDay: "settingManage.organizeManage.shiftSetting.form.options.type.allDay",
} as const;

function translateShiftTypeLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = shiftTypeLabelMap[value as keyof typeof shiftTypeLabelMap];
	return key ? transformI18n($t(key)) : value;
}

function translateShiftStatusLabel(value?: boolean | null) {
	return value
		? transformI18n($t("settingManage.organizeManage.shiftSetting.status.enabled"))
		: transformI18n($t("settingManage.organizeManage.shiftSetting.status.disabled"));
}

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.shiftSetting.fields.name"))),
		prop: "name",
		width: 200,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.shiftSetting.fields.startTime")),
		),
		prop: "startTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.shiftSetting.fields.endTime"))),
		prop: "endTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.shiftSetting.fields.type"))),
		prop: "type",
		width: 120,
		cellRenderer: ({ row }) => translateShiftTypeLabel(row.type),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.shiftSetting.fields.status"))),
		prop: "enabled",
		width: 100,
		cellRenderer: ({ row }) => translateShiftStatusLabel(row.enabled),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.shiftSetting.fields.description")),
		),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 360,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.organizeManage.shiftSetting.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.name")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function openDialog({ mode, row }: { mode: Mode; row?: ShiftSetting }) {
	setMode(mode);

	const formVO: ShiftSettingFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				name: row?.name || "",
				type: row?.type || "",
				startTime: row?.startTime || "",
				endTime: row?.endTime || "",
				enabled: row?.enabled ?? true,
				description: row?.description || "",
			});

	const props: ShiftSettingFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("settingManage.organizeManage.shiftSetting.dialogs.addTitle"));
			}

			if (isEdit.value) {
				return transformI18n($t("settingManage.organizeManage.shiftSetting.dialogs.editTitle"));
			}

			return transformI18n($t("settingManage.organizeManage.shiftSetting.dialogTitle"));
		},
		props,
		contentRenderer: () =>
			h(ShiftSettingForm, {
				ref: shiftSettingFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = shiftSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = shiftSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					shiftSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await shiftSettingFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: ShiftSetting) {
	openDialog({ mode: "edit", row });
}

function handleView(row: ShiftSetting) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: ShiftSetting) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("settingManage.organizeManage.shiftSetting.dialogs.confirmDelete"), { name: row.name }),
			transformI18n($t("settingManage.organizeManage.common.dialogs.confirmTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		message(transformI18n($t("settingManage.organizeManage.shiftSetting.messages.deleted")), { type: "success" });
		doFetch();
	} catch {}
}

async function handleToggleStatus(row: ShiftSetting) {
	const action = row.enabled
		? transformI18n($t("settingManage.organizeManage.common.buttons.disable"))
		: transformI18n($t("settingManage.organizeManage.common.buttons.enable"));

	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("settingManage.organizeManage.shiftSetting.dialogs.confirmToggle"), { action, name: row.name }),
			transformI18n($t("settingManage.organizeManage.common.dialogs.confirmTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		message(i18n.global.t($t("settingManage.organizeManage.shiftSetting.messages.statusUpdated"), { action }), {
			type: "success",
		});
		doFetch();
	} catch {}
}

function handleFile() {
	message(transformI18n($t("settingManage.organizeManage.common.messages.fileComingSoon")), { type: "info" });
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
				<ElButton type="info" @click="handleFile">
					{{ transformI18n($t("settingManage.organizeManage.common.buttons.file")) }}
				</ElButton>
				<ElButton type="primary" @click="handleAdd">
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton :type="row.enabled ? 'info' : 'primary'" @click="handleToggleStatus(row)">
							{{
								row.enabled
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
