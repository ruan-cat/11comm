<script lang="ts" setup>
definePage({
	meta: {
		title: "排班表",
		icon: "mdi:calendar",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.workingSchedule"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { cloneDeep } from "@pureadmin/utils";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";

import type { WorkingSchedule, WorkingScheduleListQuery, ScheduleType } from "@01s-11comm/type";
import { useWorkingScheduleListQuery } from "@/api/setting-manage/organize-manage/working-schedule";

import { WorkingScheduleFormProps, defaultForm } from "./components/form";
import WorkingScheduleForm from "./components/form.vue";

/** 表单组件实例引用 */
const workingScheduleFormInstance = ref<InstanceType<typeof WorkingScheduleForm> | null>(null);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<WorkingScheduleListQuery> = {
	name: "",
	type: "morning",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

// 使用排班表列表查询 Hook
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useWorkingScheduleListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "排班名称",
		prop: "name",
		width: 150,
	},
	{
		label: "排班类型",
		prop: "type",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "startTime",
		width: 120,
	},
	{
		label: "结束时间",
		prop: "endTime",
		width: 120,
	},
	{
		label: "星期几",
		prop: "weekday",
		width: 100,
	},
	{
		label: "负责人",
		prop: "managerName",
		width: 120,
	},
	{
		label: "联系电话",
		prop: "phone",
		width: 140,
	},
	{
		label: "状态",
		prop: "enabled",
		width: 80,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

// 表格操作栏配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "排班管理",
	columns: columns.value,
});

// PlusSearch 搜索表单数据接口
interface ScheduleSearchForm {
	name?: string;
	type?: string;
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "排班名称",
		prop: "name",
		valueType: "input",
	},
	{
		label: "排班类型",
		prop: "type",
		valueType: "select",
		options: [
			{ label: "早班", value: "morning" },
			{ label: "中班", value: "afternoon" },
			{ label: "晚班", value: "evening" },
			{ label: "夜班", value: "night" },
			{ label: "全天", value: "全天" },
		],
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

// ========== 事件处理函数 ==========

// 测试异步函数
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
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

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: WorkingSchedule;
}

const defaultAddDialogParams = {
	width: "50%",
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	contentRenderer: () => h("div"),
};

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}排班`;

	/** 表单组件需要的props */
	const formProps: WorkingScheduleFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const editProps: WorkingScheduleFormProps = {
		form: {
			name: row?.name || "",
			type: row?.type || "morning",
			startTime: row?.startTime || "",
			endTime: row?.endTime || "",
			weekday: row?.weekday || 1,
			managerName: row?.managerName || "",
			phone: row?.phone || "",
			description: row?.description || "",
			enabled: row?.enabled ?? true,
		},
		defaultValues: {
			name: row?.name || "",
			type: row?.type || "morning",
			startTime: row?.startTime || "",
			endTime: row?.endTime || "",
			weekday: row?.weekday || 1,
			managerName: row?.managerName || "",
			phone: row?.phone || "",
			description: row?.description || "",
			enabled: row?.enabled ?? true,
		},
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value ? formProps : editProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
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
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = workingScheduleFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					workingScheduleFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
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

function handleAddSchedule() {
	openDialog({ mode: "add" });
}

function handleEditSchedule(row: WorkingSchedule) {
	openDialog({ mode: "edit", row });
}

function handleDeleteSchedule(row: WorkingSchedule) {
	console.log("删除排班:", row);
}

function handleExportSchedule() {
	console.log("导出排班表");
}

// ========== 生命周期 ==========
onMounted(async () => {
	// 数据由 useWorkingScheduleListQuery 自动加载
});
</script>

<template>
	<section class="working-schedule-container">
		<!-- PlusSearch 搜索栏 -->
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<!-- 排班表格区域 -->
		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="info" @click="handleExportSchedule"> 导出 </ElButton>
				<ElButton type="primary" @click="handleAddSchedule">
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
