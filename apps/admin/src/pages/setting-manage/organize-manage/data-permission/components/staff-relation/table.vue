<script lang="ts" setup>
import { computed, ref, useTemplateRef, nextTick } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";

interface StaffRelationItem {
	name: string;
	phone: string;
	email: string;
	address: string;
	gender: string;
}

interface StaffRelationSearchForm {
	name?: string;
	phone?: string;
}

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const tableRef = useTemplateRef("tableRef");
const tableData = ref<StaffRelationItem[]>([]);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.name")),
		),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.phone")),
		),
		prop: "phone",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.email")),
		),
		prop: "email",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.address")),
		),
		prop: "address",
		minWidth: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.gender")),
		),
		prop: "gender",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 160,
		fixed: "right",
		slot: "operation",
	},
]);

const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: tableData.value.length,
}));

const pureTableProps = computed<PureTableProps>(() => ({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
}));

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.title")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & StaffRelationSearchForm = {
	name: "",
	phone: "",
};

const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.employeeName")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.employeeName")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.employeePhone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.dataPermission.staffRelation.fields.employeePhone")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, { showNumber: 2 });

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
}

async function handleSearch() {}

async function doFetch() {
	await handleSearch();
}

function handleDelete(row: StaffRelationItem) {
	void row;
}

function handleDetail(row: StaffRelationItem) {
	void row;
}

async function doResetTableAdaptive() {
	await nextTick();
	// @ts-ignore
	await tableRef.value?.setAdaptive?.();
}

defineExpose({
	doResetTableAdaptive,
});
</script>

<template>
	<section :key="locale" class="staff-relation-table-root">
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
				<ElButton type="primary">
					{{ transformI18n($t("settingManage.organizeManage.common.buttons.associateEmployee")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable ref="tableRef" :="pureTableProps" :columns="dynamicColumns" :size="size">
					<template #operation="{ row }">
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton type="info" @click="handleDetail(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.staff-relation-table-root {
}
</style>
