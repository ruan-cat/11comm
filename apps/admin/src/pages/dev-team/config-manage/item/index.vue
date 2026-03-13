<script lang="ts" setup>
definePage({
	meta: {
		// 配置项
		title: "devTeam.configManage.item.pageTitle",
		icon: "tabler:settings-2",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.item"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type ConfigItemListItem,
	type ConfigItemQueryParams,
	configItemTypeOptions,
	itemEnableStatusOptions,
} from "@01s-11comm/type";
import { useConfigItemListQuery } from "@/api/dev-team/config-manage/item";

import { type ConfigItemFormProps, defaultForm } from "./components/form";
import type { ConfigItemFormVO } from "@01s-11comm/type";
import ConfigItemForm from "./components/form.vue";
const configItemFormInstance = ref<InstanceType<typeof ConfigItemForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ConfigItemQueryParams> = {
	configName: "",
	configCode: "",
	configType: "",
	isEnabled: "",
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
} = useConfigItemListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configName")),
		prop: "configName",
		width: 150,
		fixed: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configCode")),
		prop: "configCode",
		width: 150,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configType")),
		prop: "configType",
		width: 120,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configValue")),
		prop: "configValue",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.description")),
		prop: "description",
		width: 180,
		showOverflowTooltip: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.isEnabled")),
		prop: "isEnabled",
		width: 100,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.createTime")),
		prop: "createTime",
		width: 160,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.updateTime")),
		prop: "updateTime",
		width: 160,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.creator")),
		prop: "creator",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("devTeam.configManage.item.pageTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 配置项名称
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configName")),
		prop: "configName",
		valueType: "input",
	},

	// 配置项编码
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configCode")),
		prop: "configCode",
		valueType: "input",
	},

	// 配置项类型
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configType")),
		prop: "configType",
		valueType: "select",
		options: configItemTypeOptions,
	},

	// 是否启用
	{
		label: transformI18n($t("devTeam.configManage.item.fields.isEnabled")),
		prop: "isEnabled",
		valueType: "select",
		options: itemEnableStatusOptions,
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
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: ConfigItemListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}${transformI18n($t("devTeam.configManage.item.pageTitle"))}`;

	/** 业务对象 */
	const formData: ConfigItemFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					configItemName: row?.itemName || "",
					configItemCode: row?.itemKey || "",
					configItemType: row?.dataType || "",
					configItemValue: row?.validationRule || "",
					configItemDescription: "",
					isEnabled: "",
					remark: "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const props: ConfigItemFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ConfigItemForm, {
				ref: configItemFormInstance,
				...props,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = configItemFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = configItemFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					configItemFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await configItemFormInstance.value?.plusFormInstance?.handleSubmit();
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
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
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
