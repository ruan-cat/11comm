<script lang="ts" setup>
definePage({
	meta: {
		title: "小区配置",
		icon: "mdi:cog",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.systemManage.communityConfiguration"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type CommunityConfigListItem,
	type CommunityConfigQueryParams,
	settingTypeOptions,
	communityConfigStatusOptions,
} from "@01s-11comm/type";
import { useCommunityConfigListQuery } from "@/api/operation-team/system-manage/community-configuration";
import { type CommunityConfigurationFormProps, defaultForm, type FormVO } from "./components/form";
import CommunityConfigurationForm from "./components/form.vue";

const communityConfigurationFormInstance = ref<InstanceType<typeof CommunityConfigurationForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<CommunityConfigQueryParams> = {
	communityId: "",
	communityName: "",
	settingName: "",
	settingType: undefined,
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
} = useCommunityConfigListQuery(plusSearchDefaultValues);

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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "小区配置",
	columns: columns.value,
});

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

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: CommunityConfigListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const formVO: FormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					csId: row?.csId || "",
					communityId: row?.communityId || "",
					小区名称: row?.communityName || "",
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
			const formComputed = communityConfigurationFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = communityConfigurationFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					communityConfigurationFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await communityConfigurationFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						// doFetch(); // TanStack Query handles doFetching if needed, or we can call it manually
					}
				},
			},
		],
	});
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
