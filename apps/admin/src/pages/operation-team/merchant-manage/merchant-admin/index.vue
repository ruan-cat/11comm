<script lang="ts" setup>
definePage({
	meta: {
		// 商户管理员
		title: "operation-team_merchant-manage.merchant-admin.pageTitle",
		icon: "mdi:account-tie",
		roles: ["运营团队"],
		rank: getRouteRank("operationTeam.merchantManage.merchantAdmin"),
	},
});

import { h, ref } from "vue";
import { ElMessage } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { useMode, type Mode } from "@/composables/use-mode";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import {
	merchantAdminStatusOptions,
	type MerchantAdminFormVO,
	type MerchantAdminListItem,
	type MerchantAdminQueryParams,
} from "@01s-11comm/type";
import { useMerchantAdminListQuery } from "@/api/operation-team/merchant-manage/merchant-admin";
import { defaultForm, type MerchantAdminFormProps } from "./components/form";
import MerchantAdminForm from "./components/form.vue";

const { locale, withLocale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const merchantAdminFormInstance = ref<InstanceType<typeof MerchantAdminForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<MerchantAdminQueryParams> = {
	merchantName: "",
	adminName: "",
	phone: "",
	status: undefined,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps,
} = useMerchantAdminListQuery(plusSearchDefaultValues);

const statusLabelKeyMap = {
	normal: $t("operation-team_merchant-manage.merchant-admin.options.status.normal"),
	disabled: $t("operation-team_merchant-manage.merchant-admin.options.status.disabled"),
	pending: $t("operation-team_merchant-manage.merchant-admin.options.status.pending"),
	resigned: $t("operation-team_merchant-manage.merchant-admin.options.status.resigned"),
	正常: $t("operation-team_merchant-manage.merchant-admin.options.status.normal"),
	禁用: $t("operation-team_merchant-manage.merchant-admin.options.status.disabled"),
	待审核: $t("operation-team_merchant-manage.merchant-admin.options.status.pending"),
	已离职: $t("operation-team_merchant-manage.merchant-admin.options.status.resigned"),
} as const;

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedStatusOptions = withLocale(() =>
	merchantAdminStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.propertyName")),
		),
		prop: "propertyName",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.adminName")),
		),
		prop: "adminName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.adminPhone")),
		),
		prop: "adminPhone",
		width: 130,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.id"))),
		prop: "id",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.status")),
		),
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => translateStatus(row.status),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.affiliatedCommunityCount")),
		),
		prop: "affiliatedCommunityCount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.loginCount")),
		),
		prop: "loginCount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.lastLoginTime")),
		),
		prop: "lastLoginTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.createTime")),
		),
		prop: "createTime",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 350,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("operation-team_merchant-manage.merchant-admin.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.propertyName")),
		prop: "merchantName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.adminName")),
		prop: "adminName",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.adminPhone")),
		prop: "phone",
		valueType: "input",
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.status")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog(params: { mode: Mode; row?: MerchantAdminListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				propertyCompany: row?.propertyName || "",
				adminName: row?.adminName || "",
				adminPhone: row?.adminPhone || "",
				adminEmail: "",
				idCardNo: "",
				accountStatus: row?.status || "正常",
				loginPassword: "",
				confirmPassword: "",
				contactAddress: "",
				remarks: "",
			});

	const props: MerchantAdminFormProps = {
		form: formVO as MerchantAdminFormVO,
		defaultValues: cloneDeep(formVO) as MerchantAdminFormVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("operation-team_merchant-manage.merchant-admin.dialogs.addTitle"))
				: transformI18n($t("operation-team_merchant-manage.merchant-admin.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(MerchantAdminForm, {
				ref: merchantAdminFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = merchantAdminFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = merchantAdminFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					merchantAdminFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await merchantAdminFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						doFetch();
					}
				},
			},
		],
	});
}

function handleViewCommunities() {
	ElMessage.info(transformI18n($t("operation-team_merchant-manage.merchant-admin.messages.communitiesComingSoon")));
}

function handleLogin() {
	ElMessage.info(transformI18n($t("operation-team_merchant-manage.merchant-admin.messages.loginComingSoon")));
}

function handleRestrictLogin() {
	ElMessage.info(transformI18n($t("operation-team_merchant-manage.merchant-admin.messages.restrictLoginComingSoon")));
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
					:loading="isFetching"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="handleViewCommunities">
							{{ transformI18n($t("operation-team_merchant-manage.merchant-admin.buttons.communities")) }}
						</ElButton>
						<ElButton type="info" @click="handleLogin">
							{{ transformI18n($t("operation-team_merchant-manage.merchant-admin.buttons.login")) }}
						</ElButton>
						<ElButton type="warning" @click="handleRestrictLogin">
							{{ transformI18n($t("operation-team_merchant-manage.merchant-admin.buttons.restrictLogin")) }}
						</ElButton>
						<ElButton type="danger">
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
