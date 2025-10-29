<script lang="ts" setup>
definePage({
	meta: {
		title: "业主成员",
		icon: "mdi:account-group",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.ownerMember"),
	},
});

import { ref, computed, onMounted } from "vue";
import { useMode, type Mode } from "@/composables/use-mode";
import { transformI18n } from "@/plugins/i18n";
import {
	type 业主成员_列表数据,
	type 业主成员_列表查询_VO,
	type 业主成员表单_VO,
	tableData as allTableData,
} from "./test-data";
import { type OwnerMemberFormProps, defaultForm } from "./components/form";
import OwnerMemberForm from "./components/form.vue";

/** 表格数据 */
const tableData = ref<业主成员_列表数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "成员人脸",
		prop: "成员人脸",
		width: 120,
	},
	{
		label: "名称",
		prop: "名称",
		width: 120,
	},
	{
		label: "性别",
		prop: "性别",
		width: 80,
	},
	{
		label: "类型",
		prop: "类型",
		width: 100,
	},
	{
		label: "身份证",
		prop: "身份证",
		width: 160,
	},
	{
		label: "联系方式",
		prop: "联系方式",
		width: 120,
	},
	{
		label: "家庭住址",
		prop: "家庭住址",
		width: 180,
	},
	{
		label: "创建人",
		prop: "创建人",
		width: 100,
	},
	{
		label: "备注",
		prop: "备注",
		width: 120,
	},
	{
		label: "门禁钥匙",
		prop: "门禁钥匙",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 180,
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

/** 加载表格数据 */
async function loadTableData() {
	try {
		// TODO: 替换为真实的API调用
		// 当前使用模拟数据和本地搜索过滤
		let filteredData = allTableData;

		// 根据搜索条件过滤数据
		if (plusSearchModel.value.成员名称) {
			filteredData = filteredData.filter((item) => item.名称.includes(plusSearchModel.value.成员名称!));
		}
		if (plusSearchModel.value.联系方式) {
			filteredData = filteredData.filter((item) => item.联系方式.includes(plusSearchModel.value.联系方式!));
		}
		if (plusSearchModel.value.身份证) {
			filteredData = filteredData.filter((item) => item.身份证.includes(plusSearchModel.value.身份证!));
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

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业主成员",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业主成员_列表查询_VO = {
	成员名称: "",
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
	// 成员名称
	{
		label: "成员名称",
		prop: "成员名称",
		valueType: "input",
	},

	// 联系方式
	{
		label: "联系方式",
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

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const ownerMemberFormInstance = ref<InstanceType<typeof OwnerMemberForm> | null>(null);

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: 业主成员_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);
	/** 业务对象 */
	const 业务对象: 业主成员表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					成员人脸: row?.成员人脸 || "",
					名称: row?.名称 || "",
					性别: row?.性别 || "",
					类型: row?.类型 || "",
					身份证: row?.身份证 || "",
					联系方式: row?.联系方式 || "",
					家庭住址: row?.家庭住址 || "",
					创建人: row?.创建人 || "",
					备注: row?.备注 || "",
					门禁钥匙: row?.门禁钥匙 || "",
				})
			: cloneDeep(defaultForm);
	/** 表单组件需要的props */
	const formProps: OwnerMemberFormProps = {
		form: 业务对象,
		defaultValues: 业务对象,
	};
	/** 弹框组件所需的变量 */
	const props = formProps;
	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;
	/** 弹框标题 */
	const title = `${modeText.value}业主成员`;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		contentRenderer: () =>
			h(OwnerMemberForm, {
				ref: ownerMemberFormInstance,
				mode,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = ownerMemberFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = ownerMemberFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					ownerMemberFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await ownerMemberFormInstance.value.plusFormInstance.handleSubmit();
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
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
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
