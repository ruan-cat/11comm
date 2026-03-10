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

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type SchedulingSettingFormProps, defaultForm } from "./components/form";
import type { SchedulingSettingFormVO } from "@01s-11comm/type";
import SchedulingSettingForm from "./components/form.vue";
import type { SchedulingSetting, SchedulingSettingListQuery } from "@01s-11comm/type";
import { schedulingStatusOptions } from "@01s-11comm/type";
import { useSchedulingSettingListQuery } from "@/api/setting-manage/organize-manage/scheduling-setting";

import { useMode, type Mode } from "@/composables/use-mode";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";

import { message } from "@/utils/message";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<SchedulingSettingListQuery> = {
	name: "",
	type: "",
	cycle: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

// 使用排班设置列表查询 Hook
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useSchedulingSettingListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.name")),
		prop: "name",
		minWidth: 200,
		fixed: true,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.type")),
		prop: "type",
		width: 120,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.cycle")),
		prop: "cycle",
		width: 100,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.effectiveTime")),
		prop: "effectiveTime",
		width: 180,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.staff")),
		prop: "staff",
		width: 120,
	},
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.status")),
		prop: "status",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("settingManage.organizeManage.schedulingSetting.tableTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.organizeManage.schedulingSetting.fields.status")),
		prop: "status",
		valueType: "select",
		options: schedulingStatusOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 弹框组件实例 */
const schedulingSettingFormInstance = ref<InstanceType<typeof SchedulingSettingForm> | null>(null);

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
function openDialog(params: { mode: Mode; row?: SchedulingSetting }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formVO: SchedulingSettingFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					name: row?.name || "",
					type: row?.type || "",
					cycle: row?.cycle || "1",
					effectiveTime: row?.effectiveTime || "",
					staff: row?.staff || "",
					status: row?.status || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: SchedulingSettingFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}${transformI18n($t("settingManage.organizeManage.schedulingSetting.dialogTitle"))}`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(SchedulingSettingForm, {
				ref: schedulingSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = schedulingSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = schedulingSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					schedulingSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 修改操作 */
function handleEdit(row: SchedulingSetting) {
	openDialog({ mode: "edit", row });
}

/** 删除操作 */
function handleDelete(row: SchedulingSetting) {
	console.log("删除排班", row);
}

/** 停用/启用操作 */
function handleToggleStatus(row: SchedulingSetting) {
	const newStatus = row.status === "enabled" ? "disabled" : "enabled";
	// 这里只是模拟，实际应该调用API
	console.log(`${row.status === "enabled" ? "停用" : "启用"}排班`, row);
	message(`排班已${newStatus === "enabled" ? "启用" : "停用"}`, { type: "success" });
}

onMounted(async () => {
	// 数据自动加载
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
						<ElButton :type="row.状态 === '启用' ? 'info' : 'primary'" @click="handleToggleStatus(row)">
							{{
								row.状态 === "启用"
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
