<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费催缴",
		icon: "mdi:bell-alert-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reminderForOverduePayments"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import ReminderForOverduePaymentsForm from "./components/form.vue";
import type {
	ReminderForOverduePaymentsListItem,
	ReminderForOverduePaymentsQueryParams,
	ReminderForOverduePaymentsFormVO,
} from "@01s-11comm/type";
import { reminderMethodOptions, reminderStatusOptions } from "@01s-11comm/type";
import { useMode, type Mode } from "@/composables/use-mode";
import { useReminderForOverduePaymentsListQuery } from "@/api/property-manage/expense-manage/reminder-for-overdue-payments";

/** 表单组件 Props 类型 */
interface ReminderForOverduePaymentsFormProps {
	form: ReminderForOverduePaymentsFormVO;
	defaultValues: ReminderForOverduePaymentsFormVO;
}

/** 默认表单数据 */
const defaultForm: ReminderForOverduePaymentsFormVO = {
	ownerName: "",
	paymentObject: "",
	feeName: "",
	reminderAmount: "",
	reminderMethod: "",
	reminderStatus: "",
	reminderTime: "",
	reminderRemark: "",
};

const reminderForOverduePaymentsFormInstance = ref<InstanceType<typeof ReminderForOverduePaymentsForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ReminderForOverduePaymentsQueryParams> = {
	name: "",
	status: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useReminderForOverduePaymentsListQuery(plusSearchDefaultValues);

const { modeText, setMode, isAdd, isEdit } = useMode();

const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "名称",
		prop: "name",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 180,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 名称 */
	{
		label: "名称",
		prop: "name",
		valueType: "input",
	},
	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: reminderStatusOptions,
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 表格操作栏组件 配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费催缴",
	columns: columns.value,
});

/**
 * 打开弹框
 * @param params 弹框参数，包含模式和行数据
 * @param params.mode 弹框模式：新增、编辑、查看详情
 * @param params.row 当前的行数据（编辑和查看详情时需要）
 * @description 根据不同模式打开相应的弹框，支持新增、编辑和查看详情功能
 */
function openDialog(params: { mode: Mode; row?: ReminderForOverduePaymentsListItem }) {
	try {
		const { mode, row } = params;

		// 验证模式参数
		if (!["add", "edit", "info"].includes(mode)) {
			console.error("无效的弹框模式:", mode);
			return;
		}

		setMode(mode);

		/** 弹框标题 */
		const title = `${modeText.value}欠费催缴`;

		/** 业务对象 */
		const formData = isAdd.value
			? structuredClone(defaultForm)
			: isEdit.value
				? structuredClone({
						...defaultForm,
						ownerName: row?.name || "",
						reminderStatus: row?.status || "",
					})
				: structuredClone({
						...defaultForm,
						ownerName: row?.name || "",
						reminderStatus: row?.status || "",
					});

		/** 表单组件需要的props */
		const formProps: ReminderForOverduePaymentsFormProps = {
			form: formData,
			defaultValues: formData,
		};

		/** 根据不同模式下 变化的表单默认重置对象 */
		const defaultValues = formProps.defaultValues;

		addDialog({
			...defaultAddDialogParams,
			title,
			props: formProps,

			contentRenderer: () =>
				h(ReminderForOverduePaymentsForm, {
					ref: reminderForOverduePaymentsFormInstance,
					...formProps,
				}),

			async doBeforeClose({ options, index }) {
				const formComputed = reminderForOverduePaymentsFormInstance.value?.formComputed;
				if (formComputed) {
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				}
			},

			footerButtons: [
				{
					label: transformI18n($t("common.buttons.cancel")),
					type: "info",
					btnClick: async ({ dialog: { options, index }, button }) => {
						const formComputed = reminderForOverduePaymentsFormInstance.value?.formComputed;
						if (formComputed) {
							await useDoBeforeClose({ defaultValues, formComputed, index, options });
						}
					},
				},

				{
					label: transformI18n($t("common.buttons.reset")),
					type: "warning",
					btnClick: ({ dialog: { options, index }, button }) => {
						reminderForOverduePaymentsFormInstance.value?.plusFormInstance?.handleReset();
					},
				},

				{
					label: transformI18n($t("common.buttons.submit")),
					type: "success",
					btnClick: async ({ dialog: { options, index }, button }) => {
						const res = await reminderForOverduePaymentsFormInstance.value?.plusFormInstance?.handleSubmit();
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
	} catch (error) {
		console.error("打开弹框失败:", error);
	}
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info">立即催缴</ElButton>
						<ElButton type="info" @click="openDialog({ mode: 'info', row })">查看详情</ElButton>
						<ElButton type="danger">{{ transformI18n($t("common.buttons.del")) }}</ElButton>
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
