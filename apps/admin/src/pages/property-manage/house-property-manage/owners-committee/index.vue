<script lang="ts" setup>
definePage({
	meta: {
		title: "业委会",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownersCommittee"),
	},
});

import { ref } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type OwnersCommitteeProps, defaultForm } from "./components/form";
import OwnersCommittee from "./components/form.vue"; //？
const OwnersCommitteeInstance = ref<InstanceType<typeof OwnersCommittee> | null>(null);

const {
	execute: queryCommitteeListExecute,
	data: queryCommitteeListData,
	isLoading: queryCommitteeListIsLoading,
} = queryCommitteeList({
	onSuccess(data) {
		tableData.value = data.data.rows;
	},
	onError(error) {},
});

/** 获取业委会列表 */
async function doQueryCommitteeListExecute() {
	await queryCommitteeListExecute({
		params: {
			name: plusSearchModel.value.name,
			link: plusSearchModel.value.link,
			state: plusSearchModel.value.state,
			pageIndex: pagination.value.currentPage,
			pageSize: pagination.value.pageSize,
		},
	});
}

/** 表格数据 */
const tableData = ref<CommitteeMemberListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "编号",
		prop: "ocId",
		width: 120,
		fixed: true,
	},
	{
		label: "姓名",
		prop: "name",
		width: 120,
	},
	{
		label: "性别",
		prop: "sex",
		width: 120,
	},
	{
		label: "电话",
		prop: "link",
		width: 120,
	},
	{
		label: "身份证",
		prop: "idCard",
		width: 120,
	},
	{
		label: "住址",
		prop: "address",
		width: 120,
	},
	{
		label: "职位",
		prop: "position",
		width: 120,
	},
	{
		label: "岗位",
		prop: "post",
		width: 120,
	},
	{
		label: "届期",
		prop: "appointTime",
		width: 120,
	},
	{
		label: "任期",
		prop: "curTime",
		width: 120,
	},
	{
		label: "状态",
		prop: "state",
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
	await doQueryCommitteeListExecute();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await doQueryCommitteeListExecute();
}

/** 表格配置 */
const pureTableProps = computed<PureTableProps>(() => {
	return {
		...defaultPureTableProps,
		data: tableData.value,
		columns: [],
		loading: queryCommitteeListIsLoading.value,
		pagination: pagination.value,
	};
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业委会",
	columns: columns.value,
});

interface 业委会_列表查询_VO {
	姓名?: string;
	电话?: string;
	状态?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<QueryCommitteeListParams> = {
	name: "",
	link: "",
	// TODO: 必填字段
	state: "",
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
		prop: "name",
		valueType: "input",
	},

	// 电话
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.phone")),
		prop: "link",
		valueType: "input",
	},

	// 状态
	{
		label: transformI18n($t("propertyManage_housePropertyManage.owners-committee.status")),
		prop: "state",
		valueType: "select",
		// TODO: 未来对接 数据字典全局对象 获取下拉列表
		options: [
			{
				label: "在职",
				value: "在职",
			},
			{
				label: "离职",
				value: "离职",
			},
		],
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

async function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: CommitteeMemberListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业委会`;

	/** 表单组件需要的props */
	const formProps: OwnersCommitteeProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};
	// 模拟情况：从外部获得值
	const testEditProps: OwnersCommitteeProps = {
		form: {
			...defaultForm,
			姓名: "test_",
			性别: "男",
			电话: "12334567654",
			身份证号码: "350427199004256701",
			住址: "福建省福州市福州大学",
			职位: "666",
			岗位: "666",
			岗位描述: "666",
			届期: "6",
			任期: "6",
			状态: "在职",
			备注: "测试",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value //不要照抄，根据业务情况具体分析
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
			h(OwnersCommittee, {
				ref: OwnersCommitteeInstance,
				...formProps, //不生效：避免类型报错
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnersCommitteeInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = OwnersCommitteeInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					OwnersCommitteeInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await OwnersCommitteeInstance.value.plusFormInstance.handleSubmit();
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

onMounted(async () => {
	// 组件挂载后查询业委会列表
	await doQueryCommitteeListExecute();
});
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
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						<ElButton type="info">
							{{ transformI18n($t("propertyManage_housePropertyManage.owners-committee.detail")) }}
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
