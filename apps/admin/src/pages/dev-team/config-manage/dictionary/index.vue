<script lang="ts" setup>
definePage({
	meta: {
		title: "字典",
		icon: "mdi:book",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.dictionary"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type DictionaryListItem,
	type DictionaryQueryParams,
	dictionaryTypeOptions,
	enableStatusOptions,
} from "@01s-11comm/type";
import { useDictionaryListQuery } from "@/api/dev-team/config-manage/dictionary";

import { type DictionaryFormProps, type DictionaryFormVO, defaultForm } from "./components/form";
import DictionaryForm from "./components/form.vue";
const dictionaryFormInstance = ref<InstanceType<typeof DictionaryForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<DictionaryQueryParams> = {
	dictionaryName: "",
	dictionaryCode: "",
	dictionaryType: "",
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
} = useDictionaryListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "字典名称",
		prop: "dictionaryName",
		width: 180,
		fixed: true,
	},
	{
		label: "字典编码",
		prop: "dictionaryCode",
		width: 150,
	},
	{
		label: "字典类型",
		prop: "dictionaryType",
		width: 120,
	},
	{
		label: "字典项数量",
		prop: "itemCount",
		width: 120,
	},
	{
		label: "字典描述",
		prop: "description",
		width: 200,
		showOverflowTooltip: true,
	},
	{
		label: "是否启用",
		prop: "isEnabled",
		width: 100,
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
		label: "创建人",
		prop: "creator",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 320,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "字典",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 字典名称
	{
		label: "字典名称",
		prop: "dictionaryName",
		valueType: "input",
	},

	// 字典编码
	{
		label: "字典编码",
		prop: "dictionaryCode",
		valueType: "input",
	},

	// 字典类型
	{
		label: "字典类型",
		prop: "dictionaryType",
		valueType: "select",
		options: dictionaryTypeOptions,
	},

	// 是否启用
	{
		label: "是否启用",
		prop: "isEnabled",
		valueType: "select",
		options: enableStatusOptions,
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
function openDialog(params: { mode: Mode; row?: DictionaryListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}字典`;

	/** 业务对象 */
	const formData: DictionaryFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					dictionaryName: row?.dictionaryName || "",
					dictionaryCode: row?.dictionaryCode || "",
					dictionaryType: row?.dictionaryType || "",
					dictionaryDescription: row?.description || "",
					isEnabled: row?.isEnabled || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const props: DictionaryFormProps = {
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
			h(DictionaryForm, {
				ref: dictionaryFormInstance,
				...props,
				mode,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = dictionaryFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = dictionaryFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					dictionaryFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await dictionaryFormInstance.value?.plusFormInstance?.handleSubmit();
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

const { gotoDetailPage } = useGotoDetailsPage();

/** 跳转到字典项管理页面 */
function gotoDictionaryItemsPage(row: DictionaryListItem) {
	// @ts-ignore 未来需要修复类型错误 看情况添加详情页
	gotoDetailPage({
		name: "dev-team-config-manage--detail-page-dictionary-items-[id]",
		params: {
			id: row.id,
		},
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
						<ElButton type="info" @click="gotoDictionaryItemsPage(row)"> 字典项管理 </ElButton>
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
