<script lang="ts" setup>
definePage({
	meta: {
		// 产权登记
		title: "propertyManage_communityManage.property-register.pageTitle",
		icon: "mdi:file-document",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.propertyRegister"),
	},
});

import { h, ref, computed } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessageBox, ElTag } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { usePropertyRegisterListQuery } from "@/api/property-manage/community-manage/property-register";
import type { PropertyRegisterFormProps } from "./components/form";
import type { PropertyRegisterFormVO, PropertyRegisterListItem, PropertyRegisterQueryParams } from "@01s-11comm/type";
import { defaultForm } from "./components/form";
import PropertyRegisterForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<PropertyRegisterQueryParams> = {
	houseId: "",
	houseNumber: "",
	ownerName: "",
	contactInfo: "",
	idCardNumber: "",
	address: "",
	status: "",
	building: "",
	unit: "",
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
} = usePropertyRegisterListQuery(plusSearchDefaultValues);

const propertyRegisterFormInstance = ref<InstanceType<typeof PropertyRegisterForm> | null>(null);
const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

const statusLabelKeyMap = {
	启用: "propertyManage_communityManage.property-register.options.status.enabled",
	禁用: "propertyManage_communityManage.property-register.options.status.disabled",
	enabled: "propertyManage_communityManage.property-register.options.status.enabled",
	disabled: "propertyManage_communityManage.property-register.options.status.disabled",
} as const;

const buildingLabelKeyMap = {
	"1栋": "propertyManage_communityManage.property-register.options.building.building1",
	"2栋": "propertyManage_communityManage.property-register.options.building.building2",
	"3栋": "propertyManage_communityManage.property-register.options.building.building3",
	A栋: "propertyManage_communityManage.property-register.options.building.buildingA",
	B栋: "propertyManage_communityManage.property-register.options.building.buildingB",
	C栋: "propertyManage_communityManage.property-register.options.building.buildingC",
} as const;

const unitLabelKeyMap = {
	"1单元": "propertyManage_communityManage.property-register.options.unit.unit1",
	"2单元": "propertyManage_communityManage.property-register.options.unit.unit2",
	"3单元": "propertyManage_communityManage.property-register.options.unit.unit3",
} as const;

function translateStatusLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n($t(key)) : value;
}

const statusOptions = computed(() =>
	(["enabled", "disabled"] as const).map((value) => ({
		label: transformI18n($t(statusLabelKeyMap[value])),
		value,
	})),
);

const buildingOptions = computed(() =>
	Object.entries(buildingLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const unitOptions = computed(() =>
	Object.entries(unitLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.propertyRightId")),
		),
		prop: "propertyRightId",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.houseId")),
		),
		prop: "houseId",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.houseNumber")),
		),
		prop: "houseNumber",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.ownerName")),
		),
		prop: "ownerName",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.contactInfo")),
		),
		prop: "contactInfo",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.idCardNumber")),
		),
		prop: "idCardNumber",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.address")),
		),
		prop: "address",
		minWidth: 220,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_communityManage.property-register.fields.status")),
		),
		prop: "status",
		minWidth: 120,
		cellRenderer: ({ row }) => {
			const type = row.status === "启用" || row.status === "enabled" ? "success" : "danger";
			return h(ElTag, { type }, () => translateStatusLabel(row.status));
		},
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_communityManage.property-register.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.houseId")),
		prop: "houseId",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.houseId")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.houseNumber")),
		prop: "houseNumber",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.houseNumber")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.ownerName")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.contactInfo")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.idCardNumber")),
		prop: "idCardNumber",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.idCardNumber")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.address")),
		prop: "address",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.address")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.building")),
		prop: "building",
		valueType: "select",
		options: buildingOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.building")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.unit")),
		prop: "unit",
		valueType: "select",
		options: unitOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.unit")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

function openDialog({ mode, row }: { mode: Mode; row?: PropertyRegisterListItem }) {
	setMode(mode);

	const formVO: PropertyRegisterFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				propertyRightId: row?.propertyRightId || "",
				houseId: row?.houseId || "",
				houseNumber: row?.houseNumber || "",
				ownerName: row?.ownerName || "",
				contactInfo: row?.contactInfo || "",
				idCardNumber: row?.idCardNumber || "",
				address: row?.address || "",
				status: row?.status || "enabled",
				remark: row?.remark || "",
			});

	const formProps: PropertyRegisterFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => {
			if (isAdd.value) {
				return transformI18n($t("propertyManage_communityManage.property-register.dialogs.addTitle"));
			}

			if (isEdit.value) {
				return transformI18n($t("propertyManage_communityManage.property-register.dialogs.editTitle"));
			}

			return transformI18n($t("propertyManage_communityManage.property-register.dialogs.infoTitle"));
		},
		props: formProps,
		contentRenderer: () =>
			h(PropertyRegisterForm, {
				ref: propertyRegisterFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = propertyRegisterFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = propertyRegisterFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					propertyRegisterFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await propertyRegisterFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}

async function handleDelete(row: PropertyRegisterListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.property-register.dialogs.confirmDelete"), {
				houseNumber: row.houseNumber,
				ownerName: row.ownerName,
			}),
			transformI18n($t("propertyManage_communityManage.property-register.dialogs.deleteTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		await doFetch();
	} catch {}
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
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
.index-root {
}
</style>
