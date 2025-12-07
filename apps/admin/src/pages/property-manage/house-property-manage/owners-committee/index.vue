<script lang="ts" setup>
definePage({
	meta: {
		title: "业委会",
		icon: "mdi:account-tie",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownersCommittee"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type OwnersCommitteeProps, defaultForm } from "./components/form";
import OwnersCommittee from "./components/form.vue";
import { useMode, type Mode } from "@/composables/use-mode";
import {
	type 业委会_列表数据,
	type 业委会_列表查询_VO,
	tableData as mockTableData,
	状态选项,
	type 业委会表单_VO,
} from "./test-data";

/** 表单组件实例 */
const ownersCommitteeFormInstance = ref<InstanceType<typeof OwnersCommittee> | null>(null);

/** 模式控制 */
const { mode, modeText, setMode, isAdd } = useMode();

/** 表格数据 */
const tableData = ref<业委会_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "编号",
		width: 120,
	},
	{
		label: "姓名",
		prop: "姓名",
		width: 120,
	},
	{
		label: "性别",
		prop: "性别",
		width: 80,
	},
	{
		label: "电话",
		prop: "电话",
		width: 150,
	},
	{
		label: "身份证",
		prop: "身份证",
		width: 180,
	},
	{
		label: "住址",
		prop: "住址",
		minWidth: 200,
	},
	{
		label: "职位",
		prop: "职位",
		width: 100,
	},
	{
		label: "岗位",
		prop: "岗位",
		width: 120,
	},
	{
		label: "届期",
		prop: "届期",
		width: 80,
	},
	{
		label: "任期",
		prop: "任期",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 80,
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

/** 表格配置 */
const pureTableProps = computed<PureTableProps>(() => {
	return {
		...defaultPureTableProps,
		data: tableData.value,
		columns: [],
		pagination: pagination.value,
	};
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业委会",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业委会_列表查询_VO = {
	姓名: "",
	电话: "",
	状态: "",
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
	// 姓名
	{
		label: transformI18n($t("propertyManage_housePropertyManage.owners-committee.name")),
		prop: "姓名",
		valueType: "input",
	},

	// 电话
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.phone")),
		prop: "电话",
		valueType: "input",
	},

	// 状态
	{
		label: transformI18n($t("propertyManage_housePropertyManage.owners-committee.status")),
		prop: "状态",
		valueType: "select",
		options: 状态选项,
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
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.姓名) {
			filteredData = filteredData.filter((item) => item.姓名.includes(plusSearchModel.value.姓名!));
		}
		if (plusSearchModel.value.电话) {
			filteredData = filteredData.filter((item) => item.电话.includes(plusSearchModel.value.电话!));
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
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
	}
}

const [isLoadingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 业委会_列表数据;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业委会`;

	/** 业务对象 */
	const 业委会表单对象: 业委会表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				姓名: row?.姓名 || "",
				性别: row?.性别 || "",
				电话: row?.电话 || "",
				身份证号码: row?.身份证 || "",
				住址: row?.住址 || "",
				职位: row?.职位 || "",
				岗位: row?.岗位 || "",
				岗位描述: row?.岗位描述 || "",
				届期: row?.届期 || "",
				任期: row?.任期 || "",
				状态: row?.状态 || "",
				备注: row?.备注 || "",
			});

	/** 表单组件需要的props */
	const formProps: OwnersCommitteeProps = {
		form: 业委会表单对象,
		defaultValues: 业委会表单对象,
	};

	/** 弹框组件所需的变量 */
	const props = formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(OwnersCommittee, {
				ref: ownersCommitteeFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = ownersCommitteeFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownersCommitteeFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownersCommitteeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ownersCommitteeFormInstance.value?.plusFormInstance?.handleSubmit();
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
