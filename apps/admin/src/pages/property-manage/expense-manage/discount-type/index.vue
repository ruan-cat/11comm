<script lang="ts" setup>
definePage({
	meta: {
		title: "优惠类型",
		icon: "mdi:tag-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountType"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { ElMessage, ElMessageBox } from "element-plus";

import { type DiscountTypeFormProps, defaultForm, type DiscountTypeFormVO, type DiscountType } from "./components/form";
import DiscountTypeForm from "./components/form.vue";
import { useDiscountTypeListQuery } from "@/api/property-manage/expense-manage/discount-type";
import {type DiscountTypeListItem, type DiscountTypeQueryParams,, discountTypeOptions} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useDiscountTypeListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		prop: "id", // DiscountTypeListItem has id, assuming discountId is not in item but only in form? No, I updated list item to not have specific keys.
		// Wait, I updated DiscountSettingListItem but NOT DiscountTypeListItem.
		// Let me check type definition again.
		// DiscountTypeListItem has: id, name, status, createTime, updateTime, remark.
		// But in index.vue I see: 折扣ID, 折扣名称, 折扣类型, 规则名称, 规则.
		// I must update DiscountTypeListItem as well.
		label: "折扣ID",
		width: 120,
		fixed: true,
	},
	{
		prop: "name", // Mapping 折扣名称 -> name
		label: "折扣名称",
		width: 200,
	},
	{
		prop: "discountType", // I need to add this to type definition
		label: "折扣类型",
		width: 200,
	},
	{
		prop: "ruleName", // I need to add this to type definition
		label: "规则名称",
		width: 200,
	},
	{
		prop: "rule", // I need to add this to type definition
		label: "规则",
		width: 200,
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}
/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});
/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "优惠类型",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<DiscountTypeQueryParams> = {
	name: "", // Map 折扣名称 -> name
	// Need to add other fields to DiscountTypeQueryParams if needed.
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 折扣ID */
	{
		label: "折扣ID",
		prop: "id", // Use id for discountId
		valueType: "input",
	},
	/** 折扣名称 */
	{
		label: "折扣名称",
		prop: "name",
		valueType: "input",
	},
	/** 折扣类型 */
	{
		label: "折扣类型",
		prop: "discountType", // Need to add to query params
		valueType: "select",
		options: discountTypeOptions,
	},
	/** 规则名称 */
	{
		label: "规则名称",
		prop: "ruleName", // Need to add to query params
		valueType: "input",
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<DiscountTypeQueryParams>);
}

/** 删除优惠类型 */
async function handleDelete(row: DiscountTypeListItem) {
	try {
		await ElMessageBox.confirm(
			`确认删除优惠类型"${row.name}"吗？`, // Map 折扣名称 -> name
			"删除确认",
			{
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				type: "warning",
			}
		);

		/** TODO: 替换为真实的API调用 */
		/** 模拟删除操作 */
		console.log("删除优惠类型:", row.id);

		/** 显示成功提示 */
		ElMessage.success("删除成功");

		/** 重新加载数据 */
		await refetch();
	} catch (error) {
		if (error !== "cancel") {
			console.error("删除失败:", error);
			ElMessage.error("删除失败");
		}
	}
}

/** 弹框相关功能 */
const DiscountTypeFormInstance = ref<InstanceType<typeof DiscountTypeForm> | null>(null);
/** 模式控制 */
const { mode, modeText, setMode, isAdd, isEdit, isInfo } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: DiscountTypeListItem }) {
	const { row } = params;
	setMode(params.mode);

	/** 弹框标题 */
	const title = `${modeText.value}优惠类型`;

	/** 业务对象 */
	const 业务对象: DiscountTypeFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: (isEdit.value || isInfo.value)
			? cloneDeep({
					...defaultForm,
					discountName: row?.name || "",
					discountType: (row?.discountType || "百分比折扣") as DiscountType,
					ruleName: row?.ruleName || "",
					rule: row?.rule || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: DiscountTypeFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
		disabled: isInfo.value,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	/** 构建底部按钮 */
	const footerButtons = [];

	/** 取消按钮 - 所有模式都有 */
	footerButtons.push({
		label: transformI18n($t("common.buttons.cancel")),
		type: "info",
		btnClick: async ({ dialog: { options, index } }) => {
			const formComputed = DiscountTypeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
	});

	/** 重置按钮 - 非查看模式有 */
	if (!isInfo.value) {
		footerButtons.push({
			label: transformI18n($t("common.buttons.reset")),
			type: "warning",
			btnClick: () => {
				DiscountTypeFormInstance.value.plusFormInstance.handleReset();
			},
		});
	}

	/** 提交按钮 - 非查看模式有 */
	if (!isInfo.value) {
		footerButtons.push({
			label: transformI18n($t("common.buttons.submit")),
			type: "success",
			btnClick: async ({ dialog: { options, index }, button }) => {
				const res = await DiscountTypeFormInstance.value.plusFormInstance.handleSubmit();
				if (res) {
					button.btn.loading = true;
					await testAsync();
					button.btn.loading = false;
					closeDialog(options, index);
					await refetch();
				}
			},
		});
	}

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(DiscountTypeForm, {
				ref: DiscountTypeFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			if (!isInfo.value) {
				const formComputed = DiscountTypeFormInstance.value.formComputed;
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			} else {
				closeDialog(options, index);
			}
		},
		footerButtons,
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
</script>

<template>
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.view")) }}
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
	/* 样式预留 */
}
</style>
