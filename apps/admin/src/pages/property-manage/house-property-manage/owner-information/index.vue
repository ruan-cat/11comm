<script lang="ts" setup>
definePage({
	meta: {
		title: "业主信息",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerInformation"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type OwnerInformationFormProps, defaultForm } from "./components/form";
import OwnerInformationForm from "./components/form.vue";

const OwnerInformationFormInstance = ref<InstanceType<typeof OwnerInformationForm> | null>(null);

interface 业主信息_列表数据 {
	人脸: string;
	客户名称: string;
	人员类型: string;
	人员角色: string;
	性别: string;
	证件号: string;
	联系手机: string;
	备用手机: string;
	地址: string;
	房屋数: string;
	业主成员: string;
	车辆数: string;
	欠费: string;
	门禁钥匙: string;
}

const tableDataItem: 业主信息_列表数据 = {
	人脸: "人脸",
	客户名称: "客户名称",
	人员类型: "人员类型",
	人员角色: "人员角色",
	性别: "性别",
	证件号: "证件号",
	联系手机: "联系手机",
	备用手机: "备用手机",
	地址: "地址",
	房屋数: "房屋数",
	业主成员: "业主成员",
	车辆数: "车辆数",
	欠费: "欠费",
	门禁钥匙: "门禁钥匙",
};

/** 表格数据 */
const tableData = ref<业主信息_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{ label: "人脸", prop: "人脸", width: 120, fixed: true },
	{ label: "客户名称", prop: "客户名称", width: 120 },
	{ label: "人员类型", prop: "人员类型", width: 120 },
	{ label: "人员角色", prop: "人员角色", width: 120 },
	{ label: "性别", prop: "性别", width: 80 },
	{ label: "证件号", prop: "证件号", width: 160 },
	{ label: "联系手机", prop: "联系手机", width: 120 },
	{ label: "备用手机", prop: "备用手机", width: 120 },
	{ label: "地址", prop: "地址", width: 180 },
	{ label: "房屋数", prop: "房屋数", width: 80 },
	{ label: "业主成员", prop: "业主成员", width: 100 },
	{ label: "车辆数", prop: "车辆数", width: 80 },
	{ label: "欠费", prop: "欠费", width: 100 },
	{ label: "门禁钥匙", prop: "门禁钥匙", width: 100 },
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 180,
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
	title: "业主信息",
	columns: columns.value,
});

interface 业主信息_列表查询_VO {
	人员类型?: string;
	客户名称?: string;
	房屋编号?: string;
	联系方式?: string;
	身份证?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业主信息_列表查询_VO = {
	人员类型: "",
	客户名称: "",
	房屋编号: "",
	联系方式: "",
	身份证: "",
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
	// 人员类型
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "人员类型",
		valueType: "select",
		options: [
			{
				label: "个人",
				value: "个人",
			},
			{
				label: "公司",
				value: "公司",
			},
		],
	},

	// 客户名称
	{
		label: transformI18n($t("propertyManage_housePropertyManage.owners-committee.name")),
		prop: "成员名称",
		valueType: "input",
	},

	// 房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},

	// 联系电话
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.phone")),
		prop: "联系电话",
		valueType: "input",
	},

	// 身份证
	{
		label: transformI18n($t("propertyManage_housePropertyManage.houses.idCard")),
		prop: "身份证",
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

function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 业主信息_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}添加`;

	/** 表单组件需要的props */
	const formProps: OwnerInformationFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	// 模拟情况：从外部获得值
	const testEditProps: OwnerInformationFormProps = {
		form: {
			...defaultForm,
			人员类型: "个人",
			人员角色: "业主",
			客户名称: "2233",
			联系手机: "12316518120",
			性别: "男",
			备用手机: "12316518120",
			地址: "江苏省连云港市",
			门禁钥匙: "无",
			身份证: "xxxxxxxxxxx",
			备注: "无",
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
			h(OwnerInformationForm, {
				ref: OwnerInformationFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnerInformationFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = OwnerInformationFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					OwnerInformationFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await OwnerInformationFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true; //加载
						await testAsync(); //异步函数
						button.btn.loading = false; //不加载
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
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
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
