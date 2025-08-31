<script lang="ts" setup>
import { ref } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 单元授权_列表数据, unitAuthTableData } from "../../test-data";
import { type UnitAuthFormProps, defaultForm } from "./form";
import UnitAuthForm from "./form.vue";

/** 表格数据 */
const tableData = ref<单元授权_列表数据[]>(unitAuthTableData);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "楼栋",
		prop: "楼栋",
		minWidth: 200,
	},
	{
		label: "单元",
		prop: "单元",
		minWidth: 200,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 90,
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
}

/** 处理页码变化 */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
}

/** 表格组件配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "单元授权",
	columns: columns.value,
});

async function handleReSearch() {
	console.log("重新搜索");
}

/** 表单组件实例 */
const unitAuthFormInstance = ref<InstanceType<typeof UnitAuthForm> | null>(null);

/** 模拟异步操作 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开关联单元弹框 */
function openUnitAuthDialog() {
	/** 表单组件需要的props */
	const formProps: UnitAuthFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: "楼栋单元",
		width: "900px",

		contentRenderer: () =>
			h(UnitAuthForm, {
				ref: unitAuthFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = unitAuthFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = unitAuthFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			// TODO: 警告 此处的业务不是传统的打开表单弹框 而是打开一个表格 选择表格项 应该手动重写
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					unitAuthFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 获取选中的数据
					const selectedData = unitAuthFormInstance.value.getSelectedData();

					if (!selectedData || selectedData.length === 0) {
						message("请选择要关联的单元", { type: "warning" });
						return;
					}

					button.btn.loading = true;
					await testAsync();
					button.btn.loading = false;

					// 添加到表格数据
					const newData = selectedData.map((item) => ({
						楼栋: item.楼栋编号,
						单元: item.单元编号,
					}));

					tableData.value.push(...newData);
					pagination.value.total = tableData.value.length;

					message("关联单元成功", { type: "success" });
					closeDialog(options, index);
				},
			},
		],
	});
}

/** 删除操作 */
function handleDelete(row: 单元授权_列表数据) {
	console.log("删除单元授权", row);
	const index = tableData.value.findIndex((item) => item.楼栋 === row.楼栋 && item.单元 === row.单元);
	if (index > -1) {
		tableData.value.splice(index, 1);
		pagination.value.total = tableData.value.length;
		message("删除成功", { type: "success" });
	}
}
</script>

<template>
	<section class="unit-auth-table-root">
		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openUnitAuthDialog"> 关联单元 </ElButton>
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
						<ElButton type="danger" @click="handleDelete(row)"> 删除 </ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.unit-auth-table-root {
}
</style>
