<script lang="ts" setup>
definePage({
	meta: {
		title: "我的小区",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.my"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";
import ExpenseItemSettingForm from "./components/form.vue";

const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

interface 我的小区_列表数据 {
	省份: string;
	市州: string;
	区县: string;
	小区名称: string;
	小区编码: string;
	客服电话: string;
	面积: string;
	开始时间: string;
	结束时间: string;
	状态: string;
}

const tableDataItem: 我的小区_列表数据 = {
	省份: "省份",
	市州: "市州",
	区县: "区县",
	小区名称: "小区名称",
	小区编码: "小区编码",
	客服电话: "客服电话",
	面积: "面积",
	开始时间: "开始时间",
	结束时间: "结束时间",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<我的小区_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "省份",
		prop: "省份",
		width: 120,
		fixed: true,
	},
	{
		label: "市州",
		prop: "市州",
		width: 120,
	},
	{
		label: "区县",
		prop: "区县",
		width: 120,
	},
	{
		label: "小区名称",
		prop: "小区名称",
		width: 120,
	},
	{
		label: "小区编码",
		prop: "小区编码",
		width: 120,
	},
	{
		label: "客服电话",
		prop: "客服电话",
		width: 120,
	},
	{
		label: "面积",
		prop: "面积",
		width: 120,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 120,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "我的小区",
	columns: columns.value,
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
	row?: 我的小区_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}修改小区`;

	/** 表单组件需要的props */
	const formProps: ExpenseItemSettingFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	const testEditProps: ExpenseItemSettingFormProps = {
		form: {
			...defaultForm,
			// 费用类型: "水费",
			// 收费项目: "水费历史欠费",
			// 费用标识: "周期性费用",
			// 付费类型: "预付费",
			// 计费单价: "230.1",
			// 账户抵扣: "是",
			// 状态: "启用",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 自己根据业务判断*/
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
						// await testAsync();
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
		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size">
					<template #operation="{ row }">
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
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
