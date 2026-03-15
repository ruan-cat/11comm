<script lang="ts" setup>
definePage({
	meta: {
		// 巡检路线
		title: "property-manage_patrol-manage.path.pageTitle",
		icon: "mdi:map-marker-path",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.path"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type PatrolPathFormProps, defaultForm } from "./components/form";
import PatrolPathForm from "./components/form.vue";
import { usePathListQuery } from "@/api/property-manage/patrol-manage/path";
import type { PathListItem, PathQueryParams } from "@01s-11comm/type";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.pathId"))),
		prop: "pathId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.pathName"))),
		prop: "pathName",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.pathType"))),
		prop: "pathType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.location"))),
		prop: "location",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.startTime"))),
		prop: "startTime",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.endTime"))),
		prop: "endTime",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_patrol-manage.path.fields.sortOrder"))),
		prop: "sortOrder",
		width: 80,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_patrol-manage.path.tableTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & Partial<PathQueryParams> = {
	pathName: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = usePathListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.path.fields.pathName")),
		prop: "pathName",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

const patrolPathFormInstance = ref<InstanceType<typeof PatrolPathForm> | null>(null);

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: PathListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const patrolPathFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				...row,
			});

	/** 表单组件需要的props */
	const formProps: PatrolPathFormProps = {
		form: patrolPathFormVO,
		defaultValues: patrolPathFormVO,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_patrol-manage.path.dialogs.addTitle"))
				: transformI18n($t("property-manage_patrol-manage.path.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(PatrolPathForm, {
				ref: patrolPathFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = patrolPathFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = patrolPathFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					patrolPathFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await patrolPathFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
