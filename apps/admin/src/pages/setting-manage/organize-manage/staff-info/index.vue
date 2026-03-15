<script lang="ts" setup>
definePage({
	meta: {
		// 员工信息
		title: "settingManage.organizeManage.staffInfo.pageTitle",
		icon: "mdi:account-multiple",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.staffInfo"),
	},
});

import { h, ref, computed } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type Mode } from "@/composables/use-mode";
import { useMode } from "@/composables/use-mode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useStaffInfoListQuery } from "@/api/setting-manage/organize-manage/staff-info";
import type { StaffInfo, StaffInfoFormVO, StaffInfoListQuery } from "@01s-11comm/type";
import { defaultForm, type StaffInfoFormProps } from "./components/form";
import StaffInfoForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<StaffInfoListQuery> = {
	id: "",
	name: "",
	phone: "",
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useStaffInfoListQuery(plusSearchDefaultValues);

const genderLabelMap = {
	男: "settingManage.organizeManage.staffInfo.form.options.gender.male",
	女: "settingManage.organizeManage.staffInfo.form.options.gender.female",
	male: "settingManage.organizeManage.staffInfo.form.options.gender.male",
	female: "settingManage.organizeManage.staffInfo.form.options.gender.female",
} as const;

function normalizeGenderValue(value?: string | null) {
	if (!value) {
		return "";
	}

	if (value === "男" || value === "male") {
		return "male";
	}

	if (value === "女" || value === "female") {
		return "female";
	}

	return value;
}

function translateGenderLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = genderLabelMap[value as keyof typeof genderLabelMap];
	return key ? transformI18n($t(key)) : value;
}

const staffInfoFormInstance = ref<InstanceType<typeof StaffInfoForm> | null>(null);

const columns = computed<TableColumnList>(() => [
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.staffInfo.fields.employeeNumber")),
		),
		prop: "employeeNumber",
		minWidth: 180,
		fixed: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.name"))),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.phone"))),
		prop: "phone",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.orgName"))),
		prop: "orgName",
		width: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.position"))),
		prop: "position",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.email"))),
		prop: "email",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.address"))),
		prop: "address",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.staffInfo.fields.gender"))),
		prop: "gender",
		width: 100,
		cellRenderer: ({ row }) => translateGenderLabel(row.gender),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 330,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.organizeManage.staffInfo.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.staffInfo.fields.employeeId")),
		prop: "id",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.staffInfo.fields.employeeId")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.staffInfo.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.staffInfo.fields.name")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.staffInfo.fields.phone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.staffInfo.fields.phone")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	labelWidth: 100,
	searchText: transformI18n($t("common.buttons.search")),
	resetText: transformI18n($t("common.buttons.reset")),
});

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog({ mode, row }: { mode: Mode; row?: StaffInfo }) {
	setMode(mode);

	const formVO: StaffInfoFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					name: row?.name || "",
					gender: normalizeGenderValue(row?.gender),
					position: row?.position || "",
					email: row?.email || "",
					phone: row?.phone || "",
					address: row?.address || "",
					orgName: row?.orgName || "",
					avatar: row?.avatar || "",
				})
			: cloneDeep(defaultForm);

	const props: StaffInfoFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("settingManage.organizeManage.staffInfo.dialogs.addTitle"))
				: transformI18n($t("settingManage.organizeManage.staffInfo.dialogs.editTitle")),
		width: "60%",
		props,
		contentRenderer: () =>
			h(StaffInfoForm, {
				ref: staffInfoFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = staffInfoFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = staffInfoFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					staffInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await staffInfoFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleResetPassword(row: StaffInfo) {
	console.log("重置密码", row);
}

function handleDelete(row: StaffInfo) {
	console.log("删除员工", row);
}

function handleDetail(row: StaffInfo) {
	console.log("查看详情", row);
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="success" @click="handleResetPassword(row)">
							{{ transformI18n($t("settingManage.organizeManage.common.buttons.resetPassword")) }}
						</ElButton>
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
.index-root {
}
</style>
