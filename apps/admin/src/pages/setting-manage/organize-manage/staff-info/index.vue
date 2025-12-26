<script lang="ts" setup>
definePage({
	meta: {
		title: "员工信息",
		icon: "mdi:account-multiple",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.staffInfo"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "plugins/i18n.ts";
import { type StaffInfoFormProps, defaultForm } from "./components/form.ts";
import type { StaffInfoFormVO } from "@01s-11comm/type";
import StaffInfoForm from "./components/form.vue";
import { useStaffInfoListQuery } from "@/api/setting-manage/organize-manage/staff-info";
import type { StaffInfo, StaffInfoListQuery } from "@01s-11comm/type";

/** 表单组件实例引用 */
const staffInfoFormInstance = ref<InstanceType<typeof StaffInfoForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<StaffInfoListQuery> = {
	id: "",
	name: "",
	phone: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用列表查询 Hook */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useStaffInfoListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "员工编号",
		prop: "employeeNumber",
		minWidth: 180,
		fixed: true,
	},
	{
		label: "姓名",
		prop: "name",
		width: 120,
	},
	{
		label: "手机号",
		prop: "phone",
		width: 140,
	},
	{
		label: "关联组织",
		prop: "orgName",
		width: 200,
	},
	{
		label: "岗位",
		prop: "position",
		width: 140,
	},
	{
		label: "邮箱",
		prop: "email",
		width: 180,
	},
	{
		label: "地址",
		prop: "address",
		minWidth: 160,
	},
	{
		label: "性别",
		prop: "gender",
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "员工管理",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 员工ID
	{
		label: "员工ID",
		prop: "id",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入员工ID",
		},
	},

	// 员工姓名
	{
		label: "员工姓名",
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入员工姓名",
		},
	},

	// 手机号
	{
		label: "手机号",
		prop: "phone",
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: StaffInfo;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}员工`;

	/** 表单组件需要的props */
	const formProps: StaffInfoFormProps = {
		form: structuredClone(defaultForm),
		defaultValues: structuredClone(defaultForm),
	};

	const testEditProps: StaffInfoFormProps = {
		form: {
			name: row?.name || "",
			gender: row?.gender || "",
			position: row?.position || "",
			email: row?.email || "",
			phone: row?.phone || "",
			address: row?.address || "",
			orgName: row?.orgName || "",
			avatar: row?.avatar || "",
		},
		defaultValues: {
			name: row?.name || "",
			gender: row?.gender || "",
			position: row?.position || "",
			email: row?.email || "",
			phone: row?.phone || "",
			address: row?.address || "",
			orgName: row?.orgName || "",
			avatar: row?.avatar || "",
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
function handleEdit(row: StaffInfo) {
	openDialog({ mode: "edit", row });
}

/** 重置密码 */
function handleResetPassword(row: StaffInfo) {
	console.log("重置密码", row);
	// TODO: 实现重置密码功能
}

/** 删除员工 */
function handleDelete(row: StaffInfo) {
	console.log("删除员工", row);
	// TODO: 实现删除员工功能
}

/** 查看详情 */
function handleDetail(row: StaffInfo) {
	console.log("查看详情", row);
	// TODO: 实现查看员工详情
}
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
					:loading="isFetching"
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
