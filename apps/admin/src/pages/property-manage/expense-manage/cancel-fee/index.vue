<script lang="ts" setup>
definePage({
	meta: {
		title: "取消费用",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.cancelFee"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 取消费用_列表数据 {
	批次号: string;
	员工: string;
	时间: string;
	取消原因: string;
	审核状态: string;
	审核意见: string;
	操作: string;
}
const tableDataItem: 取消费用_列表数据 = {
	批次号: "批次号",
	员工: "员工",
	时间: "时间",
	取消原因: "取消原因",
	审核状态: "审核状态",
	审核意见: "审核意见",
	操作: "操作",
};
/** 表格数据 */
const tableData = ref<取消费用_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [
		{
			prop: "批次号",
			label: "批次号",
			width: 120,
		},
		{
			prop: "员工",
			label: "员工",
			width: 120,
		},
		{
			prop: "时间",
			label: "时间",
			width: 120,
		},
		{
			prop: "取消原因",
			label: "取消原因",
			width: 120,
		},
		{
			prop: "审核状态",
			label: "审核状态",
			width: 120,
		},
		{
			prop: "审核意见",
			label: "审核意见",
			width: 120,
		},
		{
			prop: "操作",
			label: "操作",
			width: 120,
		},
		{
			label: transformI18n($t("common.table.operation")),
			minWidth: 240,
			fixed: "right",
			slot: "operation",
		},
	],
});
</script>

<template>
	<section class="index-root">
		<h2>取消费用</h2>
		<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
		<PureTable :="pureTableProps">
			<template #operation="{ row }">
				<ElButton type="default">{{ transformI18n($t("欠费缴费")) }}</ElButton>
				<ElButton type="info">{{ transformI18n($t("common.buttons.info")) }}</ElButton>
				<ElButton type="default">{{ transformI18n($t("查看费用")) }}</ElButton>
			</template>
		</PureTable>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
