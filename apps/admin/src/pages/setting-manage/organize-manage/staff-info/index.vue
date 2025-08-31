<script lang="ts" setup>
definePage({
	meta: {
		title: "员工信息",
		icon: "f7:menu",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.staffInfo"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "plugins/i18n.ts";
import { type 员工信息_列表数据, type 员工信息_列表查询_VO, tableData as mockTableData } from "./test-data.ts";
import { type StaffInfoFormProps, defaultForm } from "./components/form.ts";
import StaffInfoForm from "./components/form.vue";

/** 表单组件实例引用 */
const staffInfoFormInstance = ref<InstanceType<typeof StaffInfoForm> | null>(null);

/** 表格数据 */
const tableData = ref<员工信息_列表数据[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "员工编号",
		prop: "员工编号",
		minWidth: 180,
		fixed: true,
	},
	{
		label: "姓名",
		prop: "姓名",
		width: 120,
	},
	{
		label: "手机号",
		prop: "手机号",
		width: 140,
	},
	{
		label: "关联组织",
		prop: "关联组织",
		width: 200,
	},
	{
		label: "岗位",
		prop: "岗位",
		width: 140,
	},
	{
		label: "邮箱",
		prop: "邮箱",
		width: 180,
	},
	{
		label: "地址",
		prop: "地址",
		minWidth: 160,
	},
	{
		label: "性别",
		prop: "性别",
		width: 80,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 330,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: tableData.value.length,
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
	title: "员工管理",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 员工信息_列表查询_VO = {
	员工ID: "",
	员工姓名: "",
	手机号: "",
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
	// 员工ID
	{
		label: "员工ID",
		prop: "员工ID",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入员工ID",
		},
	},

	// 员工姓名
	{
		label: "员工姓名",
		prop: "员工姓名",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入员工姓名",
		},
	},

	// 手机号
	{
		label: "手机号",
		prop: "手机号",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入手机号",
		},
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 100,
	labelPosition: "right",
	showNumber: 3,
});

async function handleReSearch() {
	console.log("重新搜索");
	// 重置搜索条件并重新加载数据
	pagination.value.currentPage = 1;
}

async function handleSearch() {
	console.log("搜索", plusSearchModel.value);
	// 根据搜索条件过滤数据
	pagination.value.currentPage = 1;
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 员工信息_列表数据;
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
	const title = `${modeText.value}员工`;

	/** 表单组件需要的props */
	const formProps: StaffInfoFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: StaffInfoFormProps = {
		form: {
			员工名称: row?.姓名 || "",
			员工性别: row?.性别 || "",
			员工岗位: row?.岗位 || "",
			员工邮箱: row?.邮箱 || "",
			手机: row?.手机号 || "",
			家庭住址: row?.地址 || "",
			关联组织: row?.关联组织 || "",
			照片: "",
		},
		defaultValues: {
			员工名称: row?.姓名 || "",
			员工性别: row?.性别 || "",
			员工岗位: row?.岗位 || "",
			员工邮箱: row?.邮箱 || "",
			手机: row?.手机号 || "",
			家庭住址: row?.地址 || "",
			关联组织: row?.关联组织 || "",
			照片: "",
		},
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value ? formProps : testEditProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		width: "60%",
		props,

		contentRenderer: () =>
			h(StaffInfoForm, {
				ref: staffInfoFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = staffInfoFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = staffInfoFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					staffInfoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await staffInfoFormInstance.value?.plusFormInstance?.handleSubmit();
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

/** 新增员工 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑员工 */
function handleEdit(row: 员工信息_列表数据) {
	openDialog({ mode: "edit", row });
}

/** 重置密码 */
function handleResetPassword(row: 员工信息_列表数据) {
	console.log("重置密码", row);
	// TODO: 实现重置密码功能
}

/** 删除员工 */
function handleDelete(row: 员工信息_列表数据) {
	console.log("删除员工", row);
	// TODO: 实现删除员工功能
}

/** 查看详情 */
function handleDetail(row: 员工信息_列表数据) {
	console.log("查看详情", row);
	// TODO: 实现查看员工详情
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="handleAdd">
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
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="success" @click="handleResetPassword(row)"> 重置密码 </ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton type="info" @click="handleDetail(row)">
							{{ transformI18n($t("common.buttons.info")) }}
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
