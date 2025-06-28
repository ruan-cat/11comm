<script lang="ts" setup>
definePage({
	meta: {
		title: "发票",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.housePropertyManage.invoice"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 发票_列表数据 {
	编号: string;
	发票类型: string;
	业主名称: string;
	申请人: string;
	发票名头: string;
	纳税人识别号: string;
	申请金额: string;
	发票号: string;
	发审核状态: string;
	申请时间: string;
}

const tableDataItem: 发票_列表数据 = {
	编号: "编号",
	发票类型: "发票类型",
	业主名称: "业主名称",
	申请人: "申请人",
	发票名头: "发票名头",
	纳税人识别号: "纳税人识别号",
	申请金额: "申请金额",
	发票号: "发票号",
	发审核状态: "发审核状态",
	申请时间: "申请时间",
};

/** 表格数据 */
const tableData = ref<发票_列表数据[]>(
	Array(25)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "编号",
		prop: "编号",
		width: 120,
		fixed: true,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		width: 120,
	},
	{
		label: "申请人",
		prop: "申请人",
		width: 120,
	},
	{
		label: "发票名头",
		prop: "发票名头",
		width: 120,
	},
	{
		label: "纳税人识别号",
		prop: "纳税人识别号",
		width: 120,
	},
	{
		label: "申请金额",
		prop: "申请金额",
		width: 120,
	},
	{
		label: "发票号",
		prop: "发票号",
		width: 120,
	},
	{
		label: "发审核状态",
		prop: "发审核状态",
		width: 120,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
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
	title: "发票",
	columns: columns.value,
});
interface 发票_列表数据_VO {
	发票号?: string;
	发票类型?: string;
	业主名称?: string; //必填？是否要去掉问号
	申请人?: string;
	纳税人识别号?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 发票_列表数据_VO = {
	发票号: "",
	发票类型: "",
	业主名称: "",
	申请人: "",
	纳税人识别号: "",
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
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.plateNumber")),
		prop: "发票号",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceNumber")),
		prop: "发票类型",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.ownerName")),
		prop: "业主名称",
		valueType: "input",
	},

	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.phone")),
		prop: "申请人",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.phone")),
		prop: "纳税人识别号",
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
async function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
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
