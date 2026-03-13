<!--
  楼栋单元选择表单
  用于在弹框中选择楼栋单元
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import {
	type UnitSelectionFormVO,
	type UnitSelectionItemVO,
	type UnitSelectionSearchVO,
	type UnitAuthFormProps,
	unitSelectionMockData,
} from "./form";

const props = defineProps<UnitAuthFormProps>();
const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & UnitSelectionFormVO;
const plusFormInstance = useTemplateRef<any>("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & UnitSelectionFormVO);
const formComputed = computed(() => form.value);

const searchForm = ref<UnitSelectionSearchVO>({
	buildingCode: "",
	unitCode: "",
});

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.buildingCode")),
		prop: "buildingCode",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.buildingCode")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.unitCode")),
		prop: "unitCode",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.unitCode")),
		},
	},
]);

const plusSearchProps = searchProps(searchForm.value, { showNumber: 2 });

const tableData = ref<UnitSelectionItemVO[]>(unitSelectionMockData);

const filteredTableData = computed(() =>
	tableData.value.filter((item) => {
		const buildingMatch =
			!searchForm.value.buildingCode || item.buildingCode.includes(searchForm.value.buildingCode);
		const unitMatch = !searchForm.value.unitCode || item.unitCode.includes(searchForm.value.unitCode);
		return buildingMatch && unitMatch;
	}),
);

const columns = withLocale<TableColumnList>(() => [
	{
		type: "selection",
		width: 55,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.buildingCode"))),
		prop: "buildingCode",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(renderI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.unitCode"))),
		prop: "unitCode",
		minWidth: 200,
	},
]);

const selectedRows = ref<UnitSelectionItemVO[]>([]);

const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: filteredTableData.value.length,
}));

const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: filteredTableData.value,
	columns: [],
	pagination: pagination.value,
}));

function handleSearch() {}

function handleReset() {
	searchForm.value = {
		buildingCode: "",
		unitCode: "",
	};
}

function handleSelectionChange(selection: UnitSelectionItemVO[]) {
	selectedRows.value = selection;
}

function getSelectedData() {
	return selectedRows.value;
}

defineExpose({
	plusFormInstance,
	formComputed,
	getSelectedData,
});
</script>

<template>
	<div :key="locale" class="form-root">
		<PlusSearch
			:key="locale"
			v-model="searchForm"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReset"
		/>

		<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
		<PureTable
			:="pureTableProps"
			:columns="columns"
			:data="filteredTableData"
			@selection-change="handleSelectionChange"
		/>

		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:default-values="defaultValues"
			:columns="[]"
			:has-footer="false"
			style="display: none"
		/>
	</div>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
