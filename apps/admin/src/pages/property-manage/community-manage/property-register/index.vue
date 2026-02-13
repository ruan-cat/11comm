<script lang="ts" setup>
definePage({
	meta: {
		title: "产权登记",
		icon: "mdi:file-document",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.propertyRegister"),
	},
});

import { ref, computed } from "vue";
import { h } from "vue";
import { ElMessageBox, ElTag } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import type { PropertyRegisterFormProps } from "./components/form";
import type { PropertyRegisterFormVO } from "@01s-11comm/type";
import { defaultForm } from "./components/form";
import PropertyRegisterForm from "./components/form.vue";
import { usePropertyRegisterListQuery } from "@/api/property-manage/community-manage/property-register";
import {
	type PropertyRegisterListItem,
	type PropertyRegisterQueryParams,
	auditStatusOptions,
	buildingOptions,
	unitOptions,
} from "@01s-11comm/type";
import { useMode, type Mode } from "@/composables/use-mode";

const PropertyRegisterFormInstance = ref<InstanceType<typeof PropertyRegisterForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
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

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 房屋ID */
	{
		label: "房屋ID",
		prop: "houseId",
		valueType: "input",
	},

	/** 房屋编号 */
	{
		label: "房屋编号",
		prop: "houseNumber",
		valueType: "input",
	},

	/** 姓名 */
	{
		label: "姓名",
		prop: "ownerName",
		valueType: "input",
	},

	/** 联系方式 */
	{
		label: "联系方式",
		prop: "contactInfo",
		valueType: "input",
	},

	/** 身份证号 */
	{
		label: "身份证号",
		prop: "idCardNumber",
		valueType: "input",
	},

	/** 地址 */
	{
		label: "地址",
		prop: "address",
		valueType: "input",
	},

	/** 审核状态 */
	{
		label: "审核状态",
		prop: "status",
		valueType: "select",
		options: auditStatusOptions,
	},

	/** 楼栋 */
	{
		label: "楼栋",
		prop: "building",
		valueType: "select",
		options: buildingOptions,
	},

	/** 单元 */
	{
		label: "单元",
		prop: "unit",
		valueType: "select",
		options: unitOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = usePropertyRegisterListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋产权ID",
		prop: "propertyRightId",
		width: 120,
	},
	{
		label: "房屋ID",
		prop: "houseId",
		width: 120,
	},
	{
		label: "房屋编号",
		prop: "houseNumber",
		width: 120,
	},
	{
		label: "姓名",
		prop: "ownerName",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "contactInfo",
		width: 120,
	},
	{
		label: "身份证号",
		prop: "idCardNumber",
		width: 180,
	},
	{
		label: "地址",
		prop: "address",
		width: 200,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => {
			const statusMap = {
				启用: { type: "success", text: "启用" },
				禁用: { type: "danger", text: "禁用" },
			};
			const statusInfo = statusMap[row.status] || { type: "info", text: row.status };
			return h(ElTag, { type: statusInfo.type }, () => statusInfo.text);
		},
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "产权登记",
	columns: columns.value,
});

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: PropertyRegisterListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}产权登记`;

	/** 业务对象 */
	const propertyRegisterFormVO: PropertyRegisterFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					propertyRightId: row?.propertyRightId || "",
					houseId: row?.houseId || "",
					houseNumber: row?.houseNumber || "",
					ownerName: row?.ownerName || "",
					contactInfo: row?.contactInfo || "",
					idCardNumber: row?.idCardNumber || "",
					address: row?.address || "",
					status: row?.status || "",
				})
			: structuredClone(defaultForm);

	/** 表单组件需要的props */
	const formProps: PropertyRegisterFormProps = {
		form: propertyRegisterFormVO,
		defaultValues: propertyRegisterFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(PropertyRegisterForm, {
				ref: PropertyRegisterFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = PropertyRegisterFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = PropertyRegisterFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					PropertyRegisterFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await PropertyRegisterFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 删除单个产权登记 */
async function handleDelete(row: PropertyRegisterListItem) {
	try {
		await ElMessageBox.confirm(`确认删除产权登记记录：${row.houseNumber} - ${row.ownerName}？`, "删除确认", {
			confirmButtonText: transformI18n($t("common.buttons.del")),
			cancelButtonText: transformI18n($t("common.buttons.cancel")),
			type: "warning",
		});

		// TODO: 调用删除API
		// 模拟删除操作
		await new Promise((resolve) => setTimeout(resolve, 300));

		// 刷新表格数据
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			// TODO: 显示错误提示
		}
	}
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

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
