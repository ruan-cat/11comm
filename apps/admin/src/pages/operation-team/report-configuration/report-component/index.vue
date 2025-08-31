<script lang="ts" setup>
definePage({
	meta: {
		title: "报表组件",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportComponent"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type ReportComponentFormProps, defaultForm } from "./components/form";
import ReportComponentForm from "./components/form.vue";

const reportComponentFormInstance = ref<InstanceType<typeof ReportComponentForm> | null>(null);

interface 报表组件_列表数据 {
	组件ID: string;
	组件名称: string;
	组件类型: string;
	查询方式: string;
	sql: string;
	java: string;
	描述: string;
}

const tableDataItem: 报表组件_列表数据 = {
	组件ID: "组件ID",
	组件名称: "组件名称",
	组件类型: "组件类型",
	查询方式: "查询方式",
	sql: "sql",
	java: "java",
	描述: "描述",
};

/** 表格数据 */
const tableData = ref<报表组件_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "组件ID",
		prop: "组件ID",
		width: 100,
		fixed: true,
	},
	{
		label: "组件名称",
		prop: "组件名称",
		width: 150,
	},
	{
		label: "组件类型",
		prop: "组件类型",
		width: 120,
	},
	{
		label: "查询方式",
		prop: "查询方式",
		width: 120,
	},
	{
		label: "描述",
		prop: "描述",
		width: 200,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		minWidth: 200,
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

/** 表格组件配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: columns.value,
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报表组件信息",
	columns: columns.value,
});

interface 报表组件_列表查询_VO {
	组件ID?: string;
	组件名称?: string;
	组件类型?: string;
	查询方式?: string;
}

/** 搜索字段初始值 */
const plusSearchModelRef: FieldValues & 报表组件_列表查询_VO = {
	组件ID: "",
	组件名称: "",
	组件类型: "",
	查询方式: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件 表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "组件ID",
		prop: "组件ID",
		valueType: "input",
		placeholder: "请输入组件ID",
	},
	{
		label: "组件名称",
		prop: "组件名称",
		valueType: "input",
		placeholder: "请输入组件名称",
	},
	{
		label: "组件类型",
		prop: "组件类型",
		valueType: "select",
		options: [
			{ label: "表格", value: "表格" },
			{ label: "饼状图", value: "饼状图" },
		],
		placeholder: "请选择组件类型",
	},
	{
		label: "查询方式",
		prop: "查询方式",
		valueType: "select",
		options: [
			{ label: "SQL", value: "sql" },
			{ label: "JAVA", value: "java" },
		],
		placeholder: "请选择查询方式",
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
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 报表组件_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	console.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	console.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);
	const title = `${modeText.value}报表组件`;

	const formProps: ReportComponentFormProps = {
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
			h(ReportComponentForm, {
				ref: reportComponentFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = reportComponentFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = reportComponentFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					reportComponentFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await reportComponentFormInstance.value.plusFormInstance.handleSubmit();
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
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
