<script lang="ts" setup>
definePage({
	meta: {
		title: "管理小区",
		icon: "f7:menu",
	},
	beforeEnter: (to, from, next) => {
		const { handleDetailPageBeforeEnter } = useGotoDetailsPage();
		handleDetailPageBeforeEnter(to, from, next);
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { type CommunityManagementFormProps, defaultForm } from "./components/community-anagement-form";
import CommunityManagementForm from "./components/community-anagement-form.vue";
const CommunityManagementFormInstance = ref<InstanceType<typeof CommunityManagementForm> | null>(null);

const router = useRouter();
import {
	type 管理小区_列表数据,
	type 管理小区_列表查询_VO,
	tableData as mockTableData,
} from "./manage-community-[id]-test-data";

/** 表格数据 */
const tableData = ref<管理小区_列表数据[]>(mockTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "小区ID",
		prop: "小区ID",
		width: 200,
		fixed: true,
	},
	{
		label: "小区名称",
		prop: "小区名称",
		width: 200,
	},
	{
		label: "附近地标",
		prop: "附近地标",
		width: 200,
	},
	{
		label: "城市编码",
		prop: "城市编码",
		width: 200,
	},
	{
		label: "状态",
		prop: "状态",
		width: 200,
	},
	{
		label: transformI18n($t("common.table.operation")),
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
	title: "小区信息",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 管理小区_列表查询_VO = {
	小区编号: "",
	小区名称: "",
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
	// 小区编号
	{
		label: transformI18n(
			$t("operation-team_data-manage.property-management-company-community-management.communityNumber"),
		),
		prop: "小区编号",
		valueType: "input",
	},

	// 小区名称
	{
		label: transformI18n(
			$t("operation-team_data-manage.property-management-company-community-management.communityName"),
		),
		prop: "小区名称",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 2,
});

async function handleReSearch() {
	console.log("重新搜索");
	// 重置搜索条件并重新加载数据
	pagination.value.currentPage = 1;
}

async function handleSearch() {
	console.log("搜索");
	// 根据搜索条件过滤数据
	pagination.value.currentPage = 1;
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 管理小区_列表数据;
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
	const title = `${modeText.value}`;

	/** 表单组件需要的props */
	const formProps: CommunityManagementFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};
	// 模拟情况：从外部获得值
	const testEditProps: CommunityManagementFormProps = {
		form: {
			...defaultForm,
			开通小区: "0011小区",
			功能: "",
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
			h(CommunityManagementForm, {
				ref: CommunityManagementFormInstance,
				...formProps, //不生效：避免类型报错
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = CommunityManagementFormInstance.value.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = CommunityManagementFormInstance.value.formComputed;
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
					CommunityManagementFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await CommunityManagementFormInstance.value.plusFormInstance.handleSubmit();
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

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{
						transformI18n(
							$t("operation-team_data-manage.property-management-company-community-management.joinCommunity"),
						)
					}}
				</ElButton>
				<ElButton type="warning" :icon="useRenderIcon('tdesign:rollback')" @click="() => router.back()">
					{{ transformI18n($t("common.buttons.back")) }}
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
						<ElButton type="danger">
							{{
								transformI18n(
									$t("operation-team_data-manage.property-management-company-community-management.quitCommunity"),
								)
							}}
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
