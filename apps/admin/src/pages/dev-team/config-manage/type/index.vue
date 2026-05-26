<script lang="ts" setup>
definePage({
	meta: {
		/** 字典类型 */
		title: "devTeam.configManage.type.pageTitle",
		icon: "lucide:book-open",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.type"),
	},
});

import { computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	createDictionaryType,
	deleteDictionaryType,
	getDictionaryTypeDetail,
	updateDictionaryType,
	useDictionaryTypeListQuery,
	type DictionaryTypeQueryParams,
} from "@/api/dev-team/config-manage/type";
import type { DictionaryTypeDetailItem, DictionaryTypeListItem } from "@01s-11comm/type";
import { type DictionaryTypeFormData, type DictionaryTypeFormProps, defaultForm } from "./components/form";
import DictionaryTypeForm from "./components/form.vue";

const dictionaryTypeFormInstance = ref<InstanceType<typeof DictionaryTypeForm> | null>(null);

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 搜索默认值与正式字典类型列表接口参数保持一致，重置时用 cloneDeep 恢复空查询。 */
const plusSearchModelRef: FieldValues & Partial<DictionaryTypeQueryParams> = {
	typeName: "",
	typeCode: "",
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
} = useDictionaryTypeListQuery(plusSearchDefaultValues);

const columns = computed<TableColumnList>(() => [
	defaultPureTableIndexColumn,
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.typeName"))),
		prop: "typeName",
		width: 150,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.typeCode"))),
		prop: "typeCode",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.typeDescription"))),
		prop: "typeDescription",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.sortOrder"))),
		prop: "sortOrder",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.createTime"))),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("devTeam.configManage.type.fields.updateTime"))),
		prop: "updateTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 220,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("devTeam.configManage.type.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.type.fields.typeName")),
		prop: "typeName",
		valueType: "input",
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.typeCode")),
		prop: "typeCode",
		valueType: "input",
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

/** 详情、编辑、删除都只向接口传 id，避免把列表行展示字段误当查询条件。 */
function toDetailPayload(row: DictionaryTypeListItem) {
	return {
		id: row.id,
	};
}

/** 详情接口是弹窗数据源，这里把可空字段收敛成表格和表单稳定可用的类型。 */
function mapDetailToListItem(detail: DictionaryTypeDetailItem): DictionaryTypeListItem {
	return {
		...detail,
		typeName: detail.typeName || "",
		typeCode: detail.typeCode || "",
		typeDescription: detail.typeDescription || "",
		sortOrder: Number(detail.sortOrder || 0),
		createTime: detail.createTime || "",
		updateTime: detail.updateTime || "",
	};
}

function toFormData(row?: Partial<DictionaryTypeListItem>): DictionaryTypeFormData {
	return {
		...cloneDeep(defaultForm),
		typeName: row?.typeName || "",
		typeCode: row?.typeCode || "",
		typeDescription: row?.typeDescription || "",
		sortOrder: Number(row?.sortOrder || 0),
	};
}

/** 标题通过函数延迟求值，保证弹窗打开后切换语言时仍能读取当前 i18n 文案。 */
function getDialogTitle() {
	if (isAdd.value) {
		return transformI18n($t("devTeam.configManage.type.dialogs.addTitle"));
	}
	if (isEdit.value) {
		return transformI18n($t("devTeam.configManage.type.dialogs.editTitle"));
	}
	return transformI18n($t("common.buttons.info"));
}

function getCurrentDictionaryTypeFormData(): DictionaryTypeFormData | undefined {
	const formComputed = dictionaryTypeFormInstance.value?.formComputed;
	if (!formComputed) {
		return;
	}

	/** formComputed 可能是 computed ref，也可能是组件暴露的普通对象，提交前统一解包并克隆。 */
	const payload = typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;
	return cloneDeep(payload) as DictionaryTypeFormData;
}

function openDialog(params: { mode: Mode; row?: DictionaryTypeListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formData = isAdd.value ? cloneDeep(defaultForm) : toFormData(row);
	/** form 和 defaultValues 使用同一份初始值，供重置和关闭前脏数据判断共同使用。 */
	const props: DictionaryTypeFormProps = {
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
			h(DictionaryTypeForm, {
				ref: dictionaryTypeFormInstance,
				...props,
				mode,
			}),
		async doBeforeClose({ options, index }) {
			const formData = getCurrentDictionaryTypeFormData();
			if (formData) {
				await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formData = getCurrentDictionaryTypeFormData();
					if (formData) {
						await useDoBeforeClose({ defaultValues, formComputed: formData, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					dictionaryTypeFormInstance.value?.plusFormInstance?.handleReset();
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

					const res = await dictionaryTypeFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formData = getCurrentDictionaryTypeFormData();
							if (!formData) {
								return;
							}

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，避免表单污染主键。 */
							if (isAdd.value) {
								await createDictionaryType(formData);
							} else if (isEdit.value && row?.id) {
								await updateDictionaryType({
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

async function viewDictionaryTypeDetails(row: DictionaryTypeListItem) {
	const response = await getDictionaryTypeDetail(toDetailPayload(row));
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

async function editDictionaryType(row: DictionaryTypeListItem) {
	const response = await getDictionaryTypeDetail(toDetailPayload(row));
	const detail = response.data;

	openDialog({
		mode: "edit",
		row: detail ? mapDetailToListItem(detail) : row,
	});
}

async function deleteDictionaryTypeRow(row: DictionaryTypeListItem) {
	try {
		await ElMessageBox.confirm(
			`${transformI18n($t("common.buttons.del"))}: ${row.typeName} (${row.typeCode})`,
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

	/** 删除接口 payload 只允许 id，不能把整行字典类型数据提交给删除接口。 */
	await deleteDictionaryType({
		id: row.id,
	});
	ElMessage.success(transformI18n($t("common.buttons.del")));
	await doFetch();
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
						<ElButton type="info" @click="viewDictionaryTypeDetails(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="editDictionaryType(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="deleteDictionaryTypeRow(row)">
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
