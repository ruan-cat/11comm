<script lang="ts" setup>
definePage({
	meta: {
		title: "报表组",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportGroup"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type ReportGroupFormProps, defaultForm } from "./components/form";
import ReportGroupForm from "./components/form.vue";

const reportGroupFormInstance = ref<InstanceType<typeof ReportGroupForm> | null>(null);

const {
	execute: queryReportGroupListExecute,
	data: queryReportGroupListData,
	isLoading: queryReportGroupListIsLoading,
} = queryReportGroupList({
	onSuccess(data) {
		tableData.value = data.data.rows;
		// tableData.value = queryReportGroupListData.value.data.rows;
		// console.log("查询报表组列表成功:", data);
	},
	onError(error) {
		console.error("查询报表组列表失败:", error);
	},
});

async function doQueryReportGroupListExecute() {
	const params: ReportGroupQueryParams = {
		pageIndex: pagination.value.currentPage,
		pageSize: pagination.value.pageSize,
	};
	Object.keys(plusSearchModel.value).forEach((key) => {
		if (!isEmpty(plusSearchModel.value[key])) {
			params[key] = plusSearchModel.value[key];
		}
	});
	await queryReportGroupListExecute({ params });
}

/** 表格数据 */
const tableData = ref<ReportGroupInfo[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "组ID",
		prop: "groupId",
		width: 100,
		fixed: true,
	},
	{
		label: "组名称",
		prop: "name",
		width: 150,
	},
	{
		label: "组url",
		prop: "url",
		minWidth: 200,
	},
	{
		label: "描述",
		prop: "remark",
		minWidth: 200,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 160,
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
	await doQueryReportGroupListExecute();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await doQueryReportGroupListExecute();
}

/** 表格组件配置 */
const pureTableProps = computed<PureTableProps>(() => {
	return {
		...defaultPureTableProps,
		data: tableData.value,
		columns: [],
		pagination: pagination.value,
		loading: queryReportGroupListIsLoading.value,
	};
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报表组信息",
	columns: columns.value,
});

interface 报表组_列表查询_VO {
	组ID?: string;
	组名称?: string;
	组url?: string;
}

/** 搜索字段初始值 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<ReportGroupQueryParams> = {
	groupId: "",
	name: "",
	url: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件 表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "组ID",
		prop: "groupId",
		valueType: "input",
	},
	{
		label: "组名称",
		prop: "name",
		valueType: "input",
	},
	{
		label: "组url",
		prop: "url",
		valueType: "input",
	},
]);

const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

async function handleReSearch() {
	await doQueryReportGroupListExecute();
}

async function handleSearch() {
	await doQueryReportGroupListExecute();
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ReportGroupInfo;
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
	const title = `${modeText.value}报表组`;

	const formProps: ReportGroupFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const props = isAdd.value
		? formProps
		: {
				form: isEdit.value ? { ...defaultForm } : cloneDeep(row),
				defaultValues: cloneDeep(row),
			};

	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(ReportGroupForm, {
				ref: reportGroupFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reportGroupFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportGroupFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportGroupFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reportGroupFormInstance.value.plusFormInstance.handleSubmit();
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
	await queryReportGroupListExecute();
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
