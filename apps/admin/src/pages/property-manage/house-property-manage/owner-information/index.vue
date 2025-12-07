<script lang="ts" setup>
definePage({
	meta: {
		title: "业主信息",
		icon: "mdi:account-card",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerInformation"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";

import { type OwnerInformationFormProps, defaultForm } from "./components/form";
import OwnerInformationForm from "./components/form.vue";
import {
	type 业主信息_列表数据,
	type 业主信息_列表查询_VO,
	type 业主信息表单_VO,
	tableData as mockTableData,
	人员类型Options,
} from "./test-data";

/** 表格组件实例 */
const OwnerInformationFormInstance = ref<InstanceType<typeof OwnerInformationForm> | null>(null);

/** 表格数据 */
const tableData = ref<业主信息_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{ label: "人脸", prop: "人脸", width: 120 },
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
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
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
	title: "业主信息",
	columns: columns.value,
});

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
		label: "人员类型",
		prop: "人员类型",
		valueType: "select",
		options: 人员类型Options,
	},

	// 客户名称
	{
		label: "客户名称",
		prop: "客户名称",
		valueType: "input",
	},

	// 房屋编号
	{
		label: "房屋编号",
		prop: "房屋编号",
		valueType: "input",
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "联系方式",
		valueType: "input",
	},

	// 身份证
	{
		label: "身份证",
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

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.人员类型) {
			filteredData = filteredData.filter((item) => item.人员类型 === plusSearchModel.value.人员类型);
		}
		if (plusSearchModel.value.客户名称) {
			filteredData = filteredData.filter((item) => item.客户名称.includes(plusSearchModel.value.客户名称!));
		}
		if (plusSearchModel.value.房屋编号) {
			filteredData = filteredData.filter((item) => item.房屋数.includes(plusSearchModel.value.房屋编号!));
		}
		if (plusSearchModel.value.联系方式) {
			filteredData = filteredData.filter((item) => item.联系手机.includes(plusSearchModel.value.联系方式!));
		}
		if (plusSearchModel.value.身份证) {
			filteredData = filteredData.filter((item) => item.证件号.includes(plusSearchModel.value.身份证!));
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/** 模式控制 */
const { mode, modeText, setMode, isAdd } = useMode();

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 业主信息_列表数据;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主信息`;

	/** 业务对象 */
	const 业主信息表单对象: 业主信息表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				人员类型: row?.人员类型 || "个人",
				人员角色: row?.人员角色 || "业主",
				客户名称: row?.客户名称 || "",
				联系手机: row?.联系手机 || "",
				性别: row?.性别 || "男",
				备用手机: row?.备用手机 || "",
				地址: row?.地址 || "",
				门禁钥匙: row?.门禁钥匙 || "",
				身份证: row?.证件号 || "",
				备注: "",
			});

	/** 表单组件需要的props */
	const formProps: OwnerInformationFormProps = {
		form: 业主信息表单对象,
		defaultValues: 业主信息表单对象,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(OwnerInformationForm, {
				ref: OwnerInformationFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnerInformationFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = OwnerInformationFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					OwnerInformationFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await OwnerInformationFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 测试异步函数 */
async function testAsync() {
	await sleep(1300);
}

onMounted(async () => {
	await loadTableData();
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
