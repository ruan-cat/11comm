<script lang="ts" setup>
definePage({
	meta: {
		// 角色权限
		title: "settingManage.organizeManage.rolePermission.pageTitle",
		icon: "mdi:shield-key",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.rolePermission"),
	},
});

import { h, ref, computed } from "vue";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useRolePermissionListQuery } from "@/api/setting-manage/organize-manage/role-permission";
import type { RolePermission, RolePermissionFormVO, RolePermissionListQuery } from "@01s-11comm/type";
import { defaultForm, type RolePermissionFormProps } from "./components/form";
import RolePermissionForm from "./components/form.vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const plusSearchModelRef: FieldValues & Partial<RolePermissionListQuery> = {
	name: "",
	code: "",
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
} = useRolePermissionListQuery(plusSearchDefaultValues);

const rolePermissionFormInstance = ref<InstanceType<typeof RolePermissionForm> | null>(null);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.rolePermission.fields.name"))),
		prop: "name",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("settingManage.organizeManage.rolePermission.fields.code"))),
		prop: "code",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.rolePermission.fields.status")),
		),
		prop: "enabled",
		width: 100,
		cellRenderer: ({ row }) =>
			row.enabled
				? transformI18n($t("settingManage.organizeManage.rolePermission.status.enabled"))
				: transformI18n($t("settingManage.organizeManage.rolePermission.status.disabled")),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("settingManage.organizeManage.rolePermission.fields.description")),
		),
		prop: "description",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("settingManage.organizeManage.rolePermission.tableTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.rolePermission.fields.name")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.rolePermission.fields.code")),
		prop: "code",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.rolePermission.fields.code")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, {
	searchText: transformI18n($t("common.buttons.search")),
	resetText: transformI18n($t("common.buttons.reset")),
});

const { setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog({ mode, row }: { mode: Mode; row?: RolePermission }) {
	setMode(mode);

	const formVO: RolePermissionFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					id: row?.id || "",
					name: row?.name || "",
					code: row?.code || "",
					enabled: row?.enabled ?? true,
					description: row?.description || "",
				})
			: cloneDeep(defaultForm);

	const props: RolePermissionFormProps = {
		form: formVO,
		defaultValues: formVO,
		mode,
	};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("settingManage.organizeManage.rolePermission.dialogs.addTitle"))
				: transformI18n($t("settingManage.organizeManage.rolePermission.dialogs.editTitle")),
		props,
		contentRenderer: () =>
			h(RolePermissionForm, {
				ref: rolePermissionFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = rolePermissionFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = rolePermissionFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					rolePermissionFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await rolePermissionFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

function handleDelete(row: RolePermission) {
	ElMessage.warning(
		i18n.global.t($t("settingManage.organizeManage.common.messages.deletePending"), { name: row.name }),
	);
}

function handleViewPermissions(row: RolePermission) {
	ElMessage.info(
		i18n.global.t($t("settingManage.organizeManage.common.messages.viewPermissionPending"), { name: row.name }),
	);
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
						<ElButton type="info" @click="handleViewPermissions(row)">
							{{ transformI18n($t("settingManage.organizeManage.common.buttons.permissionConfig")) }}
						</ElButton>
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
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
