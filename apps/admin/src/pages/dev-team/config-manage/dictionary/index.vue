<script lang="ts" setup>
definePage({
	meta: {
		/** 字典 */
		title: "devTeam.configManage.dictionary.pageTitle",
		icon: "mdi:book",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.dictionary"),
	},
});

import { computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	type DictionaryDetailItem,
	type DictionaryListItem,
	type DictionaryQueryParams,
	dictionaryTypeOptions,
} from "@01s-11comm/type";
import {
	createDictionary,
	deleteDictionary,
	getDictionaryDetail,
	updateDictionary,
	useDictionaryListQuery,
} from "@/api/dev-team/config-manage/dictionary";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type DictionaryFormData, type DictionaryFormProps, defaultForm } from "./components/form";
import DictionaryForm from "./components/form.vue";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

const dictionaryTypeLabelKeyMap = {
	system: "devTeam.configManage.dictionary.form.options.system",
	business: "devTeam.configManage.dictionary.form.options.business",
	region: "devTeam.configManage.dictionary.form.options.region",
	status: "devTeam.configManage.dictionary.form.options.status",
	config: "devTeam.configManage.dictionary.form.options.config",
} as const;

const translatedDictionaryTypeOptions = computed(() =>
	dictionaryTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(dictionaryTypeLabelKeyMap[String(option.value) as keyof typeof dictionaryTypeLabelKeyMap])),
	})),
);

/** 搜索默认值与正式字典列表接口参数保持一致，重置时用 cloneDeep 恢复空查询。 */
const plusSearchModelRef: FieldValues & Partial<DictionaryQueryParams> = {
	dictionaryName: "",
	dictionaryCode: "",
	dictionaryType: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useDictionaryListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryName"))),
		prop: "dictionaryName",
		width: 180,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode"))),
		prop: "dictionaryCode",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryType"))),
		prop: "dictionaryType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.description"))),
		prop: "dictionaryDescription",
		width: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.dictionary.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.configManage.dictionary.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryName")),
		prop: "dictionaryName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode")),
		prop: "dictionaryCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryType")),
		prop: "dictionaryType",
		valueType: "select",
		options: translatedDictionaryTypeOptions.value,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索时同时清空本地模型和 query hook 参数，避免旧条件继续请求正式接口。 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 搜索统一回到第一页，再把 PlusSearch 当前模型传给正式列表 hook。 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { setMode, isAdd, isEdit, isInfo } = useMode();
const dictionaryFormInstance = ref<InstanceType<typeof DictionaryForm> | null>(null);

/** 详情、编辑、删除都只向接口传 id，避免把列表行展示字段误当查询条件。 */
function toDetailPayload(row: DictionaryListItem) {
	return {
		id: row.id,
	};
}

/** 详情接口是弹窗数据源，这里把可空字段收敛成表格和表单稳定可用的字符串。 */
function mapDetailToListItem(detail: DictionaryDetailItem): DictionaryListItem {
	return {
		...detail,
		dictionaryName: String(detail.dictionaryName || ""),
		dictionaryCode: String(detail.dictionaryCode || ""),
		dictionaryType: String(detail.dictionaryType || ""),
		dictionaryDescription: String(detail.dictionaryDescription || ""),
		remark: String(detail.remark || ""),
		createTime: String(detail.createTime || ""),
		updateTime: String(detail.updateTime || ""),
	};
}

function toFormData(row?: Partial<DictionaryListItem>): DictionaryFormData {
	return {
		...cloneDeep(defaultForm),
		dictionaryName: row?.dictionaryName || "",
		dictionaryCode: row?.dictionaryCode || "",
		dictionaryType: row?.dictionaryType || "",
		dictionaryDescription: row?.dictionaryDescription || "",
		remark: row?.remark || "",
	};
}

/** 标题通过函数延迟求值，保证弹窗打开后切换语言时仍能读取当前 i18n 文案。 */
function getDialogTitle() {
	if (isAdd.value) {
		return transformI18n($t("devTeam.configManage.dictionary.dialogs.addTitle"));
	}
	if (isEdit.value) {
		return transformI18n($t("devTeam.configManage.dictionary.dialogs.editTitle"));
	}
	return transformI18n($t("common.buttons.info"));
}

function getCurrentDictionaryFormData(): DictionaryFormData | undefined {
	const formComputed = dictionaryFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	/** formComputed 可能是 computed ref，也可能是组件暴露的普通对象，提交前统一解包并克隆。 */
	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as DictionaryFormData;
}

function openDialog(params: { mode: Mode; row?: DictionaryListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formData = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	/** form 和 defaultValues 使用同一份初始值，供重置和关闭前脏数据判断共同使用。 */
	const props: DictionaryFormProps = {
		form: formData,
		defaultValues: formData,
	};
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: getDialogTitle,
		props,
		hideFooter: isInfo.value,
		contentRenderer: () =>
			h(DictionaryForm, {
				ref: dictionaryFormInstance,
				...props,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentDictionaryFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentDictionaryFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					dictionaryFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** info 模式是只读详情弹窗，即使误触发提交回调也不能调用写接口。 */
					if (isInfo.value) {
						return;
					}

					const res = await dictionaryFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentDictionaryFormData();
							if (!formData) {
								return;
							}

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，避免表单污染主键。 */
							if (isAdd.value) {
								await createDictionary(formData);
							} else if (isEdit.value && row?.id) {
								await updateDictionary({
									id: row.id,
									...formData,
								});
							}
							closeDialog(options, index);
							await doFetch();
						} finally {
							if (button.btn) {
								button.btn.loading = false;
							}
						}
					}
				},
			},
		],
	});
}

async function viewDictionaryDetails(row: DictionaryListItem) {
	const response = await getDictionaryDetail(toDetailPayload(row));
	const detail = response.data;
	if (!detail) {
		return;
	}

	openDialog({
		mode: "info",
		/** 详情弹窗必须以详情接口返回值为准，列表行只负责提供 id。 */
		row: mapDetailToListItem(detail),
	});
}

async function editDictionary(row: DictionaryListItem) {
	const response = await getDictionaryDetail(toDetailPayload(row));
	const detail = response.data;

	openDialog({
		mode: "edit",
		row: detail ? mapDetailToListItem(detail) : row,
	});
}

async function deleteDictionaryRow(row: DictionaryListItem) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.dictionaryName} (${row.dictionaryCode})`,
			transformI18n($t("common.buttons.del")),
			{
				type: "warning",
				confirmButtonText: transformI18n($t("common.buttons.pureConfirm")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
			},
		);
	} catch {
		return;
	}

	/** 删除接口 payload 只允许 id，不能把整行字典数据提交给删除接口。 */
	await deleteDictionary({
		id: row.id,
	});
	ElMessage.success(transformI18n($t("common.buttons.del")));
	await doFetch();
}

const { gotoDetailPage } = useGotoDetailsPage();

function gotoDictionaryItemsPage(row: DictionaryListItem) {
	/** 跳转工具的路由参数类型暂未覆盖动态详情页，当前先保留既有字典项跳转逻辑。 */
	// @ts-ignore
	gotoDetailPage({
		name: "dev-team-config-manage--detail-page-dictionary-items-[id]",
		params: {
			id: row.id,
		},
	});
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
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
				<PureTable
					:="pureTableProps"
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="viewDictionaryDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editDictionary(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteDictionaryRow(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton type="info" @click="gotoDictionaryItemsPage(row)">
							{{ transformI18n($t("devTeam.configManage.dictionary.buttons.manageItems")) }}
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
