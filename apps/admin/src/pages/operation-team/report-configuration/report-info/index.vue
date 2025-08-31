<script lang="ts" setup>
definePage({
	meta: {
		title: "报表信息",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("operationTeam.reportConfiguration.reportInfo"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";
import ExpenseItemSettingForm from "./components/form.vue";
const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

interface 报表信息_列表数据 {
	报表编号: string;
	报表组: string;
	选项标题: string;
	排序: string;
	描述: string;
}

const tableDataItem: 报表信息_列表数据 = {
	报表编号: "报表编号",
	报表组: "报表组",
	选项标题: "选项标题",
	排序: "排序",
	描述: "描述",
};

/** 表格数据 */
const tableData = ref<报表信息_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "报表编号",
		prop: "报表编号",
		width: 120,
		fixed: true,
	},
	{
		label: "报表组",
		prop: "报表组",
		width: 150,
	},
	{
		label: "选项标题",
		prop: "选项标题",
		width: 150,
	},
	{
		label: "排序",
		prop: "排序",
		width: 100,
	},
	{
		label: "描述",
		prop: "描述",
		width: 200,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		label: transformI18n($t("common.table.operation")),
		minWidth: 300,
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
	title: "报表信息",
	columns: columns.value,
});

interface 报表信息_列表查询_VO {
	报表编号?: string;
	组编号?: string;
	选项标题?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
/** 搜索字段初始值 */
const plusSearchModelRef: FieldValues & 报表信息_列表查询_VO = {
	报表编号: "",
	组编号: "",
	选项标题: "",
};
/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 表格搜索栏组件 表单配置 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "报表编号",
		prop: "报表编号",
		valueType: "input",
		placeholder: "请输入报表编号",
	},
	{
		label: "组编号",
		prop: "组编号",
		valueType: "input",
		placeholder: "请输入组编号",
	},
	{
		label: "选项标题",
		prop: "选项标题",
		valueType: "input",
		placeholder: "请输入选项标题",
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
	row?: 报表信息_列表数据;
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
	const title = `${modeText.value}报表`;

	/** 表单组件需要的props */
	const formProps: ExpenseItemSettingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: ExpenseItemSettingFormProps = {
		//填在这里的目前是默认填充的值
		form: {
			...defaultForm,
			选项标题: "默认填充选项标题",
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
			h(ExpenseItemSettingForm, {
				ref: expenseItemSettingFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = expenseItemSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = expenseItemSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					expenseItemSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await expenseItemSettingFormInstance.value.plusFormInstance.handleSubmit();
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
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore -->
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
