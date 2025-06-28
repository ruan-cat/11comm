<script lang="ts" setup>
definePage({
	meta: {
		title: "业务受理",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.handingBusiness"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 业务受理_列表数据 {
	费用项目: string;
	费用标识: string;
	费用类型: string;
	应收金额: string;
	建账时间: string;
	应收时间段: string;
	说明: string;
	状态: string;
}

const tableDataItem: 业务受理_列表数据 = {
	费用项目: "费用项目",
	费用标识: "费用标识",
	费用类型: "费用类型",
	应收金额: "应收金额",
	建账时间: "建账时间",
	应收时间段: "应收时间段",
	说明: "说明",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<业务受理_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "费用项目",
		prop: "费用项目",
		width: 120,
		fixed: true,
	},
	{
		label: "费用标识",
		prop: "费用标识",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		width: 120,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		width: 120,
	},
	{
		label: "建账时间",
		prop: "建账时间",
		width: 120,
	},
	{
		label: "应收时间段",
		prop: "应收时间段",
		width: 120,
	},
	{
		label: "说明",
		prop: "说明",
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
	title: "业务受理",
	columns: columns.value,
});

function handleReSearch() {
	console.log("重新搜索");
}
</script>

<template>
	<section class="index-root">
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
