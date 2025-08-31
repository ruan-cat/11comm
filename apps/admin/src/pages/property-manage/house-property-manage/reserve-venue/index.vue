<script lang="ts" setup>
definePage({
	meta: {
		title: "场地预约",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.reserveVenue"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type ReserveVenueFormProps, defaultForm } from "./components/form";
import ReserveVenueForm from "./components/form.vue";

const reserveVenueFormInstance = ref<InstanceType<typeof ReserveVenueForm> | null>(null);

interface 场地预约_列表数据 {
	预约时间: string;
	篮球馆: string;
	羽毛球馆: string;
	棒球馆: string;
	乒乓球馆: string;
}

const tableDataItem: 场地预约_列表数据 = {
	预约时间: "0",
	篮球馆: "不可预约",
	羽毛球馆: "不可预约",
	棒球馆: "不可预约",
	乒乓球馆: "不可预约",
};

/** 表格数据 */
const tableData = ref<场地预约_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "预约时间",
		prop: "预约时间",
		width: 120,
		fixed: true,
	},
	{
		label: "篮球馆",
		prop: "篮球馆",
		width: 120,
	},
	{
		label: "羽毛球馆",
		prop: "羽毛球馆",
		width: 120,
	},
	{
		label: "棒球馆",
		prop: "棒球馆",
		width: 120,
	},
	{
		label: "乒乓球馆",
		prop: "乒乓球馆",
		width: 120,
	},

	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
});
/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "场地预约",
	columns: columns.value,
});

interface 场地预约_列表查询_VO {
	预约日期?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 场地预约_列表查询_VO = {
	预约日期: "",
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
	// 预约日期
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-reservation.fieldDate")),
		prop: "预约日期",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},

	// 装修申请开始时间
	// {
	// 	label: transformI18n($t("propertyManage_communityManage.house-decoration.startTimeForDecorationApplication")),
	// 	prop: "装修申请开始时间",
	// 	valueType: "date-picker",
	// 	fieldProps: {
	// 		type: "date",
	// 		valueFormat: "YYYY-MM-DD",
	// 		format: "YYYY-MM-DD",
	// 	},
	// },

	// 装修申请结束时间
	// {
	// 	label: transformI18n($t("propertyManage_communityManage.house-decoration.endTimeForDecorationApplication")),
	// 	prop: "装修申请结束时间",
	// 	valueType: "date-picker",
	// 	fieldProps: {
	// 		type: "date",
	// 		valueFormat: "YYYY-MM-DD",
	// 		format: "YYYY-MM-DD",
	// 	},
	// },
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 1,
});

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}
/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 场地预约_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}场地预约`;

	/** 表单组件需要的props */
	const formProps: ReserveVenueFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: ReserveVenueFormProps = {
		form: {
			...defaultForm,
			费用类型: "水费",
			收费项目: "水费历史欠费",
			费用标识: "周期性费用",
			付费类型: "预付费",
			计费单价: "230.1",
			账户抵扣: "是",
			状态: "启用",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value
		? formProps
		: {
				form: isEdit.value ? testEditProps.form : cloneDeep(row),
				defaultValues: cloneDeep(row),
			};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ReserveVenueForm, {
				ref: reserveVenueFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reserveVenueFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = reserveVenueFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					reserveVenueFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reserveVenueFormInstance.value.plusFormInstance.handleSubmit();
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
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
