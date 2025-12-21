<script lang="ts" setup>
definePage({
	meta: {
		title: "场地预约订单",
		icon: "mdi:calendar-clock",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.reserveVenueOrder"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import type {
	ReserveVenueOrderListItem,
	ReserveVenueOrderQueryParams,
	ReserveVenueOrderFormVO,
} from "@01s-11comm/type";
import { reserveVenueOrderStatusOptions, reservedVenueOptions } from "@01s-11comm/type";
import { type ReserveVenueOrderFormProps, defaultForm } from "./components/form";
import ReserveVenueOrderForm from "./components/form.vue";
import { useReserveVenueOrderListQuery } from "@/api/property-manage/house-property-manage/reserve-venue-order";

const reserveVenueOrderFormInstance = ref<InstanceType<typeof ReserveVenueOrderForm> | null>(null);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "订单编号",
		prop: "orderNumber",
		width: 120,
	},
	{
		label: "场馆",
		prop: "venue",
		width: 120,
	},
	{
		label: "场地",
		prop: "site",
		width: 120,
	},
	{
		label: "预约人",
		prop: "reserver",
		width: 120,
	},
	{
		label: "预约电话",
		prop: "reservationPhone",
		width: 120,
	},
	{
		label: "预约日期",
		prop: "reservationDate",
		width: 120,
	},
	{
		label: "预约时间",
		prop: "reservationTime",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "receivableAmount",
		width: 120,
	},
	{
		label: "实收金额",
		prop: "receivedAmount",
		width: 120,
	},
	{
		label: "支付方式",
		prop: "paymentMethod",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "备注",
		prop: "remark",
		width: 150,
		showOverflowTooltip: true,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "场地预约订单",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ReserveVenueOrderQueryParams> = {
	orderNumber: "",
	venue: "",
	reserver: "",
	reservationPhone: "",
	status: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

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
} = useReserveVenueOrderListQuery(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "订单编号",
		prop: "orderNumber",
		valueType: "input",
	},
	{
		label: "场馆",
		prop: "venue",
		valueType: "input",
	},
	{
		label: "预约人",
		prop: "reserver",
		valueType: "input",
	},
	{
		label: "预约电话",
		prop: "reservationPhone",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: reserveVenueOrderStatusOptions,
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

/** 模式控制 */
const { modeText, setMode, isAdd } = useMode();

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ReserveVenueOrderListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}场地预约订单`;

	/** 业务对象 */
	const formData: ReserveVenueOrderFormVO = isAdd.value
		? structuredClone(defaultForm)
		: structuredClone({
				...defaultForm,
				orderNumber: row?.orderNumber || "",
				venue: row?.venue || "",
				site: row?.site || "",
				reserver: row?.reserver || "",
				reservationPhone: row?.reservationPhone || "",
				reservationDate: row?.reservationDate || "",
				reservationTime: row?.reservationTime || "",
				receivableAmount: row?.receivableAmount || "",
				receivedAmount: row?.receivedAmount || "",
				paymentMethod: row?.paymentMethod || "",
				status: row?.status || "",
				createTime: row?.createTime || "",
				remark: row?.remark || "",
			});

	/** 表单组件需要的props */
	const formProps: ReserveVenueOrderFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(ReserveVenueOrderForm, {
				ref: reserveVenueOrderFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reserveVenueOrderFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = reserveVenueOrderFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					reserveVenueOrderFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await reserveVenueOrderFormInstance.value?.plusFormInstance?.handleSubmit();
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
