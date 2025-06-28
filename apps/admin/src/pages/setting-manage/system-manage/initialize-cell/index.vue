<script lang="ts" setup>
definePage({
	meta: {
		title: "初始化小区",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.initializeCell"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "plugins/i18n.ts";

interface 初始化小区_获取小区列表 {
	小区ID: string;
	小区名称: string;
	附近地标: string;
	城市编码: string;
	状态: string;
}

const tableDataItem: 初始化小区_获取小区列表 = {
	小区ID: "小区ID",
	小区名称: "小区名称",
	附近地标: "附近地标",
	城市编码: "城市编码",
	状态: "状态",
};

/** 表格数据 */
const tableData = ref<初始化小区_获取小区列表[]>(
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
			label: "小区ID",
			prop: "小区ID",
			width: 120,
			fixed: true,
		},
		{
			label: "小区名称",
			prop: "小区名称",
			width: 150,
		},
		{
			label: "附近地标",
			prop: "附近地标",
			width: 150,
		},
		{
			label: "城市编码",
			prop: "城市编码",
			width: 120,
		},
		{
			label: "状态",
			prop: "状态",
			width: 100,
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
		<h2>初始化小区</h2>

		<!-- @vue-ignore-->

		<PureTable :="pureTableProps">
			<template #operation="{ row }">
				        <ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
			</template>
		</PureTable>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
