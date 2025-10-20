<script lang="ts" setup>
definePage({
	meta: {
		title: "产权登记",
		icon: "mdi:file-document",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.propertyRegister"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 产权登记_列表数据, type 产权登记_列表查询_VO, tableData as mockTableData } from "./test-data";

import type { PropertyRegisterFormProps } from "./components/form";
import PropertyRegisterForm from "./components/form.vue";
import {
	审核状态Options,
	楼栋Options,
	单元Options,
	defaultForm,
} from "./test-data";

const PropertyRegisterFormInstance = ref<InstanceType<typeof PropertyRegisterForm> | null>(null);

/** 表格数据 */
const tableData = ref<产权登记_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "房屋产权ID",
		prop: "房屋产权ID",
		width: 120,
	},
	{
		label: "房屋ID",
		prop: "房屋ID",
		width: 120,
	},
	{
		label: "房屋编号",
		prop: "房屋编号",
		width: 120,
	},
	{
		label: "姓名",
		prop: "姓名",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "联系方式",
		width: 120,
	},
	{
		label: "身份证号",
		prop: "身份证号",
		width: 120,
	},
	{
		label: "地址",
		prop: "地址",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
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
	title: "产权登记",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 产权登记_列表查询_VO = {
	房屋ID: "",
	房屋编号: "",
	姓名: "",
	联系方式: "",
	身份证号: "",
	地址: "",
	审核状态: "",
	楼栋: "",
	单元: "",
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
	// 房屋ID
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.houseID")),
		prop: "房屋ID",
		valueType: "input",
	},

	// 房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 姓名
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.name")),
		prop: "姓名",
		valueType: "input",
	},

	// 联系方式
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.contactWay")),
		prop: "联系方式",
		valueType: "input",
	},

	// 身份证号
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.idNumber")),
		prop: "身份证号",
		valueType: "input",
	},

	// 地址
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.address")),
		prop: "地址",
		valueType: "input",
	},

	// 审核状态
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.auditStatus")),
		prop: "审核状态",
		valueType: "select",
		options: 审核状态Options,
	},

	// 楼栋
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.building")),
		prop: "楼栋",
		valueType: "select",
		options: 楼栋Options,
	},

	// 单元
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.unit")),
		prop: "单元",
		valueType: "select",
		options: 单元Options,
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = mockTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.房屋ID) {
			filteredData = filteredData.filter((item) => item.房屋ID.includes(plusSearchModel.value.房屋ID!));
		}
		if (plusSearchModel.value.房屋编号) {
			filteredData = filteredData.filter((item) => item.房屋编号.includes(plusSearchModel.value.房屋编号!));
		}
		if (plusSearchModel.value.姓名) {
			filteredData = filteredData.filter((item) => item.姓名.includes(plusSearchModel.value.姓名!));
		}
		if (plusSearchModel.value.联系方式) {
			filteredData = filteredData.filter((item) => item.联系方式.includes(plusSearchModel.value.联系方式!));
		}
		if (plusSearchModel.value.身份证号) {
			filteredData = filteredData.filter((item) => item.身份证号.includes(plusSearchModel.value.身份证号!));
		}
		if (plusSearchModel.value.地址) {
			filteredData = filteredData.filter((item) => item.地址.includes(plusSearchModel.value.地址!));
		}
		if (plusSearchModel.value.审核状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.审核状态);
		}

		// 更新总数
		pagination.value.total = filteredData.length;

		// 分页处理
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		// 更新表格配置
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		// TODO: 显示错误提示
	}
}

async function handleReSearch() {
	console.log("重新搜索");
	// 重置搜索条件并重新加载数据
	pagination.value.currentPage = 1;
	await loadTableData();
}

async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	// 根据搜索条件过滤数据
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 产权登记_列表数据;
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
	const title = `${modeText.value}产权登记`;

	/** 表单组件需要的props */
	const formProps: PropertyRegisterFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	// 模拟情况：从外部获得值
	const testEditProps: PropertyRegisterFormProps = {
		form: {
			...defaultForm,
			房屋产权ID: row?.房屋产权ID || "FR001",
			房屋ID: row?.房屋ID || "H001",
			房屋编号: row?.房屋编号 || "1-101",
			姓名: row?.姓名 || "张三",
			联系方式: row?.联系方式 || "13800138000",
			身份证号: row?.身份证号 || "320101199001011234",
			地址: row?.地址 || "江苏省南京市某某街道某某号",
			状态: row?.状态 || "审核通过",
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
			h(PropertyRegisterForm, {
				ref: PropertyRegisterFormInstance,
				...formProps,
				mode: mode,
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
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
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
					}
				},
			},
		],
	});
}

onMounted(async () => {
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

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
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">
							{{ transformI18n($t("common.buttons.info")) }}
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
