<script lang="ts" setup>
import { computed, h, ref } from "vue";
import { useToggle } from "@vueuse/core";
import { sleep } from "@antfu/utils";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { defaultForm, type UnitAuthFormProps } from "./form";
import UnitAuthForm from "./form.vue";

interface UnitAuthItem {
	building: string;
	unit: string;
}

const { locale, withLocale, createHeaderRenderer } = useI18nConfig();

const tableData = ref<UnitAuthItem[]>([]);
const unitAuthFormInstance = ref<InstanceType<typeof UnitAuthForm> | null>(null);
const [isLoadingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.building")),
		),
		prop: "building",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.dataPermission.unitAuth.fields.unit")),
		),
		prop: "unit",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 90,
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
	title: transformI18n($t("settingManage.organizeManage.dataPermission.unitAuth.title")),
	columns: columns.value,
}));

function openUnitAuthDialog() {
	const props: UnitAuthFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => transformI18n($t("settingManage.organizeManage.dataPermission.unitAuth.dialogTitle")),
		width: "900px",
		contentRenderer: () =>
			h(UnitAuthForm, {
				ref: unitAuthFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = unitAuthFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = unitAuthFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					unitAuthFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const selectedData = unitAuthFormInstance.value?.getSelectedData?.() ?? [];
					if (selectedData.length === 0) {
						message(transformI18n($t("settingManage.organizeManage.common.messages.unitRequired")), {
							type: "warning",
						});
						return;
					}

					button.btn.loading = true;
					await testAsync();
					button.btn.loading = false;

					const newData = selectedData.map((item) => ({
						building: item.buildingCode,
						unit: item.unitCode,
					}));

					tableData.value.push(...newData);
					message(transformI18n($t("settingManage.organizeManage.common.messages.unitAssociateSuccess")), {
						type: "success",
					});
					closeDialog(options, index);
				},
			},
		],
	});
}

function handleDelete(row: UnitAuthItem) {
	const index = tableData.value.findIndex((item) => item.building === row.building && item.unit === row.unit);
	if (index > -1) {
		tableData.value.splice(index, 1);
		message(transformI18n($t("settingManage.organizeManage.common.messages.deleteSuccess")), { type: "success" });
	}
}

async function doFetch() {}
</script>

<template>
	<section :key="locale" class="unit-auth-table-root">
		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="primary" @click="openUnitAuthDialog">
					{{ transformI18n($t("settingManage.organizeManage.common.buttons.associateUnit")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size">
					<template #operation="{ row }">
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.unit-auth-table-root {
}
</style>
