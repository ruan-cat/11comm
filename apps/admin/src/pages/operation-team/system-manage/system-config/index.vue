<script lang="ts" setup>
definePage({
	meta: {
		title: "系统配置",
		icon: "mdi:cog",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.systemConfig"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type SystemConfigListItem, type SystemConfigQueryParams, systemConfigTypeOptions, systemConfigGroupOptions, systemConfigStatusOptions } from "@01s-11comm/type";
import { useSystemConfigListQuery } from "@/api/operation-team/system-manage/system-config";
import { type SystemConfigFormProps, defaultForm, type 系统配置表单_VO } from "./components/form";
import SystemConfigForm from "./components/form.vue";

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 弹框组件实例 */
const systemConfigFormInstance = ref<InstanceType<typeof SystemConfigForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<SystemConfigQueryParams> = {
	configName: "",
	configType: undefined,
	configGroup: undefined,
	status: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useSystemConfigListQuery(plusSearchDefaultValues);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "配置ID",
		prop: "configId",
		width: 120,
	},
	{
		label: "配置名称",
		prop: "configName",
		minWidth: 200,
	},
	{
		label: "配置值",
		prop: "configValue",
		minWidth: 180,
	},
	{
		label: "配置类型",
		prop: "configType",
		width: 100,
	},
	{
		label: "配置分组",
		prop: "configGroup",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 80,
	},
	{
		label: "描述",
		prop: "description",
		minWidth: 200,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 160,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);


/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "系统配置",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 配置名称 */
	{
		label: "配置名称",
		prop: "configName",
		valueType: "input",
	},

	/** 配置类型 */
	{
		label: "配置类型",
		prop: "configType",
		valueType: "select",
		options: systemConfigTypeOptions,
	},

	/** 配置分组 */
	{
		label: "配置分组",
		prop: "configGroup",
		valueType: "select",
		options: systemConfigGroupOptions,
	},

	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: systemConfigStatusOptions,
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

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: SystemConfigListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 系统配置表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? cloneDeep({
					...defaultForm,
					配置名称: row?.configName || "",
					配置值: row?.configValue || "",
					配置类型: (row?.configType || "文本") as "文本" | "数字" | "布尔值" | "JSON" | "日期时间" | "文件路径" | "URL",
					配置分组: (row?.configGroup || "系统基础") as
						| "系统基础"
						| "业务配置"
						| "第三方服务"
						| "安全设置"
						| "通知设置"
						| "日志配置"
						| "缓存配置",
					状态: (row?.status || "启用") as "启用" | "禁用",
					描述: row?.description || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: SystemConfigFormProps = {
		form: 系统配置表单_VO,
		defaultValues: 系统配置表单_VO,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 弹框标题 */
	const title = `${modeText.value}系统配置`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(SystemConfigForm, {
				ref: systemConfigFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = systemConfigFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = systemConfigFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					systemConfigFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await systemConfigFormInstance.value.plusFormInstance.handleSubmit();
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
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 删除系统配置 */
async function handleDelete(row: SystemConfigListItem) {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟删除操作 */
		consola.log("删除系统配置:", row.configId);

		/** 模拟异步操作 */
		await sleep(1000);

		/** 重新加载数据 */
		doFetch();
	} catch (error) {
		console.error("删除失败:", error);
		/** TODO: 显示错误提示 */
	}
}

onMounted(async () => {
	// await loadTableData();
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
