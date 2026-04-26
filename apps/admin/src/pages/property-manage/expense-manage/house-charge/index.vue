<script lang="ts" setup>
/**
 * 房屋收费页面后续开发待办说明
 *
 * 当前阶段状态：
 * - Phase5 仅完成 `houseCharge` 的列表与详情读取联调。
 * - 页面保留新增、编辑、删除按钮入口，但这些入口当前只是后续接线坐标，不代表写接口已经完成。
 * - 当前禁止使用 mock、testAsync 或静默成功来伪造 create/update/delete，否则会误导后续联调和验收。
 *
 * 业务判断：
 * - “房屋收费”业务本身需要新增、编辑、删除/作废类操作入口，这不是业务上说不通。
 * - 但当前页面表单字段有一批更像“收费项目配置”的字段，例如费用类型、收费项目、缴费类型、
 *   账户抵扣、手机缴费、取整方式、计算公式、计费单价、固定费用等。
 * - 这些字段更贴近 `expenseItemSetting` / `exExpenseItems`，不能直接写入房屋收费账单表 `exHouseCharges`。
 *
 * 后续必须完成的字段调整：
 * - 将本页面的新增/编辑表单调整为真正的房屋收费账单模型。
 * - 推荐围绕以下字段重新设计表单：
 *   - `houseId`：关联房屋。
 *   - `expenseItem`：收费项目名称或收费项目引用。
 *   - `receivableAmount`：应收金额。
 *   - `receivedAmount`：已收金额，通常新增时默认为 0。
 *   - `billingPeriod`：账单周期。
 *   - `billDate`：账单生成日期。
 *   - `dueDate`：到期日期。
 *   - `status`：缴费状态，例如 unpaid/partial/paid/cancelled 等。
 *   - `remark`：备注。
 * - 若需要从收费项目配置生成房屋账单，应设计为“选择收费项目后生成账单”的业务动作，
 *   不应把收费项目配置字段混入房屋收费账单表单。
 *
 * 后续必须补齐的后端与接口：
 * - 在字段归属确认后，再为 `houseCharge` 补齐 create/update/delete 或更准确的业务 action。
 * - create/update 必须使用 `apps/type/src/business/property-manage/expense-manage/schema.ts`
 *   中 `exHouseCharges` 对应的 Drizzle/Zod schema 做校验。
 * - 删除不应默认做物理删除；需要先确认账单删除策略。
 *   - 未缴且未生效账单：可评审是否允许删除。
 *   - 已缴账单：通常不能删除，应考虑作废、退款、冲正或审计保留。
 *   - 部分缴费账单：必须有明确业务规则后才能开放操作。
 *
 * 后续前端接线要求：
 * - 保留本页面按钮入口，用 TODO/disabled/pending 提示表达“待实现”，不要直接删除入口。
 * - 后端接口完成后，在 `apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`
 *   增加对应 hook，再把本页面 `openDialog` 和删除入口接到真实 mutation。
 * - 联调时必须走 `/api-shadow` 命中独立 `apps/api`，并用真实 Neon 验证写入、查询和清理测试数据。
 */
definePage({
	meta: {
		// 房屋收费
		title: "property-manage_expense-manage.house-charge.pageTitle",
		icon: "mdi:home-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.houseCharge"),
	},
});

import { ref, onMounted, h } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { useMode, type Mode } from "@/composables/use-mode";

import { type HouseChargeFormProps, defaultForm } from "./components/form";
import type { HouseChargeFormVO } from "@01s-11comm/type";
import HouseChargeForm from "./components/form.vue";

// 从类型库导入正确的类型
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";
import { statusOptions } from "@01s-11comm/type";
import { getHouseChargeDetail, useHouseChargeListQuery } from "@/api/property-manage/expense-manage/house-charge";
import { defaultAddDialogParams } from "@/config/constant";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { ElMessage } from "element-plus";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();
const houseChargeMutationPendingMessage =
	"房屋收费写接口尚未完成字段归属与删除策略评审，当前仅保留前端入口，不提交数据。";

/** 表单组件实例 */
const houseChargeFormInstance = ref<InstanceType<typeof HouseChargeForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<HouseChargeQueryParams> = {
	name: "",
	status: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

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
} = useHouseChargeListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("property-manage_expense-manage.house-charge.fields.name"))),
		prop: "name",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.house-charge.fields.status")),
		),
		prop: "status",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.house-charge.fields.createTime")),
		),
		prop: "createTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.house-charge.fields.updateTime")),
		),
		prop: "updateTime",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.house-charge.fields.remark")),
		),
		prop: "remark",
		minWidth: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 260,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.house-charge.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 名称 */
	{
		label: transformI18n($t("property-manage_expense-manage.house-charge.search.name")),
		prop: "name",
		valueType: "input",
	},

	/** 状态 */
	{
		label: transformI18n($t("property-manage_expense-manage.house-charge.search.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

async function handleDetail(row: HouseChargeListItem) {
	try {
		const response = await getHouseChargeDetail({ id: row.id });
		const detail = response.data;
		ElMessage.success(detail?.name || detail?.expenseItem || row.name || "查询成功");
	} catch (error) {
		ElMessage.error("查询详情失败");
	}
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: HouseChargeListItem;
}

/** 模式控制 */
const { mode, setMode, isAdd, isEdit } = useMode();

function warnHouseChargeMutationPending() {
	ElMessage.warning(houseChargeMutationPendingMessage);
}

function handleDeletePending(row: HouseChargeListItem) {
	ElMessage.warning(`${row.name || "房屋收费"}：${houseChargeMutationPendingMessage}`);
}

/**
 * TODO(Phase5 后续波次):
 * 这是 houseCharge create/update 的前端入口占位。
 * 只有字段归属确认写入 `exHouseCharges` 正确，且后端补齐 create/update 后，才能在这里接真实 hook。
 * 当前禁止复用 mock/testAsync 假提交，避免把收费项目配置字段错误写入房屋收费账单。
 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const formVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? ({
					...defaultForm,
					expenseType: "物业费",
					chargeItem: row?.name || "",
					feeIdentifier: "recurring",
					paymentType: "prepaid",
					paymentCycleMonths: "1",
					prepaidPeriodDays: "30",
					unit: "元/平方米·月",
					accountDeduction: "yes",
					mobilePayment: "yes",
					roundingMethod: "round",
					decimalPlaces: "2",
					status: row?.status || "enabled",
					calculationFormula: "",
					billingUnitPrice: "",
					fixedFee: "",
				} as HouseChargeFormVO)
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: HouseChargeFormProps = {
		form: formVO,
		defaultValues: formVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.house-charge.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.house-charge.dialogs.editTitle")),

		contentRenderer: () =>
			h(HouseChargeForm, {
				ref: houseChargeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = houseChargeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = houseChargeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					houseChargeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await houseChargeFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						warnHouseChargeMutationPending();
					}
				},
			},
		],
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
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
				<!--
					TODO(Phase5 后续波次):
					保留 houseCharge 新增入口，等待 create 接口和字段归属评审完成后接入真实 hook。
				-->
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<!--
							TODO(Phase5 后续波次):
							编辑入口仅用于保留前端接线位置；后端 create/update 未完成前不提交数据。
						-->
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info" @click="handleDetail(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<!--
							TODO(Phase5 后续波次):
							exHouseCharges 当前没有 deletedAt；delete 只有在业务确认软删除/物理删除策略后才能接真实 hook。
						-->
						<ElButton type="danger" @click="handleDeletePending(row)">
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
