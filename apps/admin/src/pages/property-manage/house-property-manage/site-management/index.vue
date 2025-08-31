<script lang="ts" setup>
definePage({
	meta: {
		title: "场地管理",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.siteManagement"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type SiteManagementFormProps, defaultForm } from "./components/form";
import SiteManagementForm from "./components/form.vue";

const SiteManagementFormInstance = ref<InstanceType<typeof SiteManagementForm> | null>(null);

interface 场地管理_列表数据 {
	编号: string;
	名称: string;
	开场时间: string;
	关场时间: string;
	每小时费用: string;
	管理员: string;
	管理员电话: string;
	状态: string;
}

const tableDataItem: 场地管理_列表数据 = {
	编号: "102025051289880227",
	名称: "篮球馆",
	开场时间: "00:00",
	关场时间: "23:59",
	每小时费用: "23:59",
	管理员: "张三",
	管理员电话: "13232323232",
	状态: "可预约",
};

/** 表格数据 */
const tableData = ref<场地管理_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "编号",
		prop: "编号",
		width: 120,
		fixed: true,
	},
	{
		label: "名称",
		prop: "名称",
		width: 120,
	},
	{
		label: "开场时间",
		prop: "开场时间",
		width: 120,
	},
	{
		label: "关场时间",
		prop: "关场时间",
		width: 120,
	},
	{
		label: "每小时费用",
		prop: "每小时费用",
		width: 120,
	},
	{
		label: "管理员",
		prop: "管理员",
		width: 120,
	},
	{
		label: "管理员电话",
		prop: "管理员电话",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
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
	title: "场地管理",
	columns: columns.value,
});

interface 场地管理_列表查询_VO {
	房屋编号?: string;
	状态?: string;
	房屋类型?: string;
	当前楼栋单元?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 场地管理_列表查询_VO = {
	房屋编号: "",
	状态: "",
	房屋类型: "",
	当前楼栋单元: "",
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
	// 场地编号
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-management.fieldNumber")),
		prop: "场地编号",
		valueType: "input",
	},

	// 请选择名称
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-management.fieldType")),
		prop: "请选择名称",
		valueType: "input",
	},

	// 状态
	{
		label: transformI18n($t("propertyManage_housePropertyManage.field-management.fieldState")),
		prop: "场地状态",
		valueType: "select",
		options: [
			{
				label: "可预约",
				value: "可预约",
			},
			{
				label: "不可预约",
				value: "不可预约",
			},
		],
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
	showNumber: 3,
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
	row?: 场地管理_列表数据;
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
	const title = `${modeText.value}场地管理`;

	/** 表单组件需要的props */
	const formProps: SiteManagementFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: SiteManagementFormProps = {
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
			h(SiteManagementForm, {
				ref: SiteManagementFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = SiteManagementFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = SiteManagementFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					SiteManagementFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await SiteManagementFormInstance.value.plusFormInstance.handleSubmit();
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
