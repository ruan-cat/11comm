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

import { ref, computed, h } from "vue";
import { ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import { useI18n } from "vue-i18n";
import { type ShiftSettingFormProps, defaultForm } from "./components/form";
import type { ShiftSettingFormVO, ShiftSetting, ShiftSettingListQuery } from "@01s-11comm/type";
import ShiftSettingForm from "./components/form.vue";
import { useShiftSettingListQuery } from "@/api/setting-manage/organize-manage/shift-setting";

import { useMode, type Mode } from "@/composables/use-mode";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";

import { message } from "@/utils/message";

const { t } = useI18n();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ShiftSettingListQuery> = {
	name: "",
	type: "",
	startTime: "",
	endTime: "",
	enabled: true,
	description: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

// 使用班次设置列表查询 Hook
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useShiftSettingListQuery(plusSearchDefaultValues);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const shiftSettingFormInstance = ref<InstanceType<typeof ShiftSettingForm> | null>(null);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

const defaultAddDialogParams = {
	width: "50%",
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	contentRenderer: () => h("div"),
};

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: ShiftSetting }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}${transformI18n(t("settingManage.organizeManage.shiftSetting.dialogTitle"))}`;

	/** 业务对象 */
	const formVO: ShiftSettingFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					name: row?.name || "",
					type: row?.type || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					enabled: row?.enabled ?? true,
					description: row?.description || "",
				})
			: structuredClone({
					...defaultForm,
					name: row?.name || "",
					type: row?.type || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					enabled: row?.enabled ?? true,
					description: row?.description || "",
				});

	/** 表单组件需要的props */
	const formProps: ShiftSettingFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: {
			...formProps,
			mode,
		},
		contentRenderer: () =>
			h(ShiftSettingForm, {
				ref: shiftSettingFormInstance,
				...formProps,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = shiftSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = shiftSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index } }) => {
					shiftSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (shiftSettingFormInstance.value?.plusFormInstance) {
						const res = await shiftSettingFormInstance.value.plusFormInstance.handleSubmit();
						if (res) {
							button.btn.loading = true;
							await testAsync();
							button.btn.loading = false;
							closeDialog(options, index);
							doFetch();
						}
					}
				},
			},
		],
	});
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.name")),
		prop: "name",
		width: 200,
		fixed: true,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.startTime")),
		prop: "startTime",
		width: 120,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.endTime")),
		prop: "endTime",
		width: 120,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.type")),
		prop: "type",
		width: 120,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.status")),
		prop: "enabled",
		width: 100,
		cellRenderer: ({ row }) =>
			row.enabled
				? transformI18n(t("settingManage.organizeManage.shiftSetting.status.enabled"))
				: transformI18n(t("settingManage.organizeManage.shiftSetting.status.disabled")),
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.description")),
		prop: "description",
		minWidth: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 360,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n(t("settingManage.organizeManage.shiftSetting.tableTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.name")),
		prop: "name",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 新增操作 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 修改操作 */
function handleEdit(row: ShiftSetting) {
	openDialog({ mode: "edit", row });
}

/** 查看操作 */
function handleView(row: ShiftSetting) {
	openDialog({ mode: "info", row });
}

/** 删除操作 */
async function handleDelete(row: ShiftSetting) {
	try {
		await ElMessageBox.confirm(
			transformI18n(t("settingManage.organizeManage.shiftSetting.dialogs.confirmDelete", { name: row.name })),
			transformI18n(t("settingManage.organizeManage.common.dialogs.confirmTitle")),
			{
				confirmButtonText: transformI18n(t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n(t("common.buttons.cancel")),
				type: "warning",
			},
		);

		// 模拟删除操作
		console.log("删除班次", row);
		message(transformI18n(t("settingManage.organizeManage.shiftSetting.messages.deleted")), { type: "success" });
		doFetch();
	} catch (error) {
		// 用户取消删除操作
	}
}

/** 停用/启用操作 */
async function handleToggleStatus(row: ShiftSetting) {
	const action = row.enabled
		? transformI18n(t("settingManage.organizeManage.common.buttons.disable"))
		: transformI18n(t("settingManage.organizeManage.common.buttons.enable"));

	try {
		await ElMessageBox.confirm(
			transformI18n(t("settingManage.organizeManage.shiftSetting.dialogs.confirmToggle", { action, name: row.name })),
			transformI18n(t("settingManage.organizeManage.common.dialogs.confirmTitle")),
			{
				confirmButtonText: transformI18n(t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n(t("common.buttons.cancel")),
				type: "warning",
			},
		);

		// 模拟更新状态
		console.log(`${action}班次`, row);
		message(transformI18n(t("settingManage.organizeManage.shiftSetting.messages.statusUpdated", { action })), {
			type: "success",
		});
		doFetch();
	} catch (error) {
		// 用户取消操作
	}
}

/** 文件操作 */
function handleFile() {
	message(transformI18n(t("settingManage.organizeManage.common.messages.fileComingSoon")), { type: "info" });
}

/** 组件挂载时加载数据 */
onMounted(async () => {
	// 数据已通过 TanStack Query 自动加载
});
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
				<ElButton type="info" @click="handleFile">
					{{ transformI18n(t("settingManage.organizeManage.common.buttons.file")) }}
				</ElButton>
				<ElButton type="primary" @click="handleAdd">
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
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n(t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton :type="row.enabled ? 'info' : 'primary'" @click="handleToggleStatus(row)">
							{{
								row.enabled
									? transformI18n(t("settingManage.organizeManage.common.buttons.disable"))
									: transformI18n(t("settingManage.organizeManage.common.buttons.enable"))
							}}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped></style>
