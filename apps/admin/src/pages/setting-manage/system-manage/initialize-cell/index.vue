<script lang="ts" setup>
definePage({
	meta: {
		title: "初始化小区",
		icon: "mdi:home-import-outline",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.initializeCell"),
	},
});

import { ref, computed, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { type InitializeCommunityFormProps, defaultForm } from "./components/form";
import InitializeCellForm from "./components/form.vue";

import { type FormatFormProps, defaultForm as formatDefaultForm } from "./components/format-form";
import FormatForm from "./components/format-form.vue";

import type {
	InitializeCommunityListItem,
	InitializeCommunityFormVO,
	InitializeCommunityQueryParams,
} from "@01s-11comm/type";
import { useInitializeCommunityListQuery } from "@/api/setting-manage/system-manage/initialize-cell";

const initializeCellFormInstance = ref<InstanceType<typeof InitializeCellForm> | null>(null);
const formatFormInstance = ref<InstanceType<typeof FormatForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<InitializeCommunityQueryParams> = {
	initItem: "",
	initStatus: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useInitializeCommunityListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "初始化项目",
		prop: "initItem",
		minWidth: 150,
	},
	{
		label: "初始化状态",
		prop: "initStatus",
		width: 120,
	},
	{
		label: "配置参数",
		prop: "configParams",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 120,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "初始化小区",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 初始化项目
	{
		label: "初始化项目",
		prop: "initItem",
		valueType: "input",
	},

	// 初始化状态
	{
		label: "初始化状态",
		prop: "initStatus",
		valueType: "input",
	},
]);

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
async function handleSearch() {
	updateParams(plusSearchModel.value);
}

/** 表格搜索栏组件 配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);

/**
 * 测试异步函数
 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/**
 * 打开弹框
 */
function openDialog(params: { mode: Mode; row?: InitializeCommunityListItem }) {
	const { mode, row } = params;
	setMode(mode);
	/** 弹框标题 */
	const title = `${modeText.value}初始化小区`;
	/** 业务对象 */
	const initializeCommunityForm: InitializeCommunityFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					initItem: row?.initItem || "",
					initStatus: row?.initStatus || "",
					configParams: row?.configParams,
				})
			: structuredClone({
					...defaultForm,
					initItem: row?.initItem || "",
					initStatus: row?.initStatus || "",
					configParams: row?.configParams,
				});
	/** 表单组件需要的props */
	const formProps: InitializeCommunityFormProps = {
		form: initializeCommunityForm,
		defaultValues: initializeCommunityForm,
	};

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		width: "600px",

		contentRenderer: () =>
			h(InitializeCellForm, {
				ref: initializeCellFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = initializeCellFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = initializeCellFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues: formProps.defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					initializeCellFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await initializeCellFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
						consola.success("操作成功！");
					}
				},
			},
		],
	});
}

/**
 * 打开格式化确认弹框
 */
function openFormatDialog(row: InitializeCommunityListItem) {
	/** 弹框标题 */
	const title = "温馨提示！";

	/** 表单组件需要的props */
	const formProps: FormatFormProps = {
		form: structuredClone(formatDefaultForm),
		defaultValues: structuredClone(formatDefaultForm),
		initItem: row.initItem,
		initStatus: row.initStatus,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		width: "500px",

		contentRenderer: () =>
			h(FormatForm, {
				ref: formatFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = formatFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: "点错了",
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = formatFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: "确认格式化",
				type: "danger",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await formatFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						/** 这里可以添加实际的格式化逻辑 */
						consola.success("格式化操作完成！");
					}
				},
			},
		],
	});
}

/**
 * 格式化操作
 */
function handleFormat(row: InitializeCommunityListItem) {
	console.log("格式化操作", row);
	openFormatDialog(row);
}
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })"> 查看 </ElButton>
						<ElButton type="info" @click="handleFormat(row)"> 格式化 </ElButton>
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
