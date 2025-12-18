<script lang="ts" setup>
definePage({
	meta: {
		title: "排班设置",
		icon: "mdi:calendar-clock",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.schedulingSetting"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type SchedulingSettingFormProps, defaultForm, type SchedulingSettingFormVO } from "./components/form";
import SchedulingSettingForm from "./components/form.vue";
import type { SchedulingSetting } from "@01s-11comm/type";
import { schedulingStatusOptions } from "@01s-11comm/type";
import { useSchedulingSettingListQuery } from "@/api/setting-manage/organize-manage/scheduling-setting";

import { useMode, type Mode } from "@/composables/use-mode";
import { cloneDeep } from "@pureadmin/utils";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";

import { message } from "@/utils/message";

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

// 使用排班设置列表查询 Hook
const { tableData, total, pageIndex, pageSize, isFetching, updateParams, doFetch } = useSchedulingSettingListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "班次名称",
		prop: "name",
		minWidth: 200,
		fixed: true,
	},
	{
		label: "排班类型",
		prop: "type",
		width: 120,
	},
	{
		label: "排班周期",
		prop: "cycle",
		width: 100,
	},
	{
		label: "生效时间",
		prop: "effectiveTime",
		width: 180,
	},
	{
		label: "人员",
		prop: "staff",
		width: 120,
	},
	{
		label: "状态",
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

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 表格组件配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: columns.value,
	pagination: pagination.value,
	loading: isFetching.value,
}));

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "排班设置",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & { name?: string; status?: string } = {
	name: "",
	status: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

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
		label: "状态",
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

	/** 表单组件需要的props */
	const formProps: SchedulingSettingFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}排班设置`;

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
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	updateParams({
		name: undefined,
		status: undefined,
		pageIndex: 1,
	});
}

/** 执行搜索 */
async function handleSearch() {
	updateParams({
		name: plusSearchModel.value.name,
		status: plusSearchModel.value.status,
		pageIndex: 1,
	});
}

/** 处理页数变化 */
async function handlePageSizeChange(val: number) {
	pageSize.value = val;
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(val: number) {
	pageIndex.value = val;
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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
							{{ row.状态 === "启用" ? "停用" : "启用" }}
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
