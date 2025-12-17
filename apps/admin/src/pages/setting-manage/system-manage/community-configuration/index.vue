<script lang="ts" setup>
definePage({
	meta: {
		title: "小区配置",
		icon: "mdi:cog",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.systemManage.communityConfiguration"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { type CommunityConfigurationFormProps, defaultForm, type CommunityConfigurationFormVO } from "./components/form";
import CommunityConfigurationForm from "./components/form.vue";
import type { CommunityConfiguration, CommunityConfigurationListQuery } from "@01s-11comm/type";
import { settingTypeOptions, communityConfigStatusOptions } from "@01s-11comm/type";
import { useCommunityConfigurationListQuery } from "@/api/setting-manage/system-manage/community-configuration";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useToggle } from "@vueuse/core";
import { sleep } from "@antfu/utils";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useDoBeforeClose } from "@/components/ReDialog/utils";

// 使用小区配置列表查询 Hook
const {
	tableData,
	total,
	pageIndex,
	pageSize,
	isLoading,
	updateParams,
	refetch,
	resetParams,
} = useCommunityConfigurationListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区名称",
		prop: "communityName",
		width: 150,
		fixed: true,
	},
	{
		label: "设置名称",
		prop: "settingName",
		width: 150,
	},
	{
		label: "设置值",
		prop: "settingValue",
		width: 120,
	},
	{
		label: "设置类型",
		prop: "settingType",
		width: 120,
	},
	{
		label: "状态",
		prop: "statusText",
		width: 100,
	},
	{
		label: "备注",
		prop: "remark",
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

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
async function handlePageSizeChange(val: number) {
	pageSize.value = val;
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(val: number) {
	pageIndex.value = val;
}

/** 表格组件 配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: columns.value,
	pagination: pagination.value,
	loading: isLoading.value,
}));

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "小区配置",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & CommunityConfigurationListQuery = {
	communityName: "",
	settingName: "",
	settingType: "",
	statusCd: "",
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
	/** 小区名称 */
	{
		label: "小区名称",
		prop: "communityName",
		valueType: "input",
	},

	/** 设置名称 */
	{
		label: "设置名称",
		prop: "settingName",
		valueType: "input",
	},

	/** 设置类型 */
	{
		label: "设置类型",
		prop: "settingType",
		valueType: "select",
		options: settingTypeOptions,
	},

	/** 数据状态 */
	{
		label: "数据状态",
		prop: "statusCd",
		valueType: "select",
		options: communityConfigStatusOptions,
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

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
async function handleSearch() {
	updateParams(plusSearchModel.value);
}

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const communityConfigurationFormInstance = ref<InstanceType<typeof CommunityConfigurationForm> | null>(null);

const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

const defaultAddDialogParams = {
	width: "50%",
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	contentRenderer: () => h("div"),
};

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: CommunityConfiguration }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formVO: CommunityConfigurationFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					csId: row?.csId || "",
					communityId: row?.communityId || "",
					communityName: row?.communityName || "",
					settingName: row?.settingName || "",
					settingValue: row?.settingValue || "",
					settingType: row?.settingType || "",
					statusCd: row?.statusCd || "0",
					remark: row?.remark || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: CommunityConfigurationFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 弹框标题 */
	const title = `${modeText.value}小区配置`;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,
		contentRenderer: () =>
			h(CommunityConfigurationForm, {
				ref: communityConfigurationFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = communityConfigurationFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = communityConfigurationFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					communityConfigurationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					if (communityConfigurationFormInstance.value?.plusFormInstance) {
						const res = await communityConfigurationFormInstance.value.plusFormInstance.handleSubmit();
						if (res) {
							button.btn.loading = true;
							await testAsync();
							button.btn.loading = false;
							closeDialog(options, index);
							refetch();
						}
					}
				},
			},
		],
	});
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.view")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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