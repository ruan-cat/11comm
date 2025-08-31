<script lang="ts" setup>
definePage({
	meta: {
		title: "未收费房屋",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.noChargeHouse"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { PlusColumn } from "plus-pro-components";

interface 报表管理_未收费房屋 {
	序号: string;
	楼栋: string;
	单元: string;
	房屋: string;
	业主名称: string;
	联系电话: string;
}

const tableDataItem: 报表管理_未收费房屋 = {
	序号: "1",
	楼栋: "1栋",
	单元: "1单元",
	房屋: "101",
	业主名称: "张三",
	联系电话: "13800138000",
};

const tableData = ref<报表管理_未收费房屋[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value,

	columns: [
		{
			label: "序号",
			prop: "序号",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "楼栋",
			prop: "楼栋",
			minWidth: 120,
		},
		{
			label: "单元",
			prop: "单元",
			minWidth: 120,
		},
		{
			label: "房屋",
			prop: "房屋",
			minWidth: 120,
		},
		{
			label: "业主名称",
			prop: "业主名称",
			minWidth: 120,
		},
		{
			label: "联系电话",
			prop: "联系电话",
			minWidth: 120,
		},
		// {
		// 	label: transformI18n($t("common.table.operation")),
		// 	minWidth: 240,
		// 	fixed: "right",
		// 	slot: "operation",
		// },
	],
});

// 表單配置
const state = ref({
	status: "0",
	time: new Date().toString(),
});

const columns: PlusColumn[] = [
	{
		label: "名称",
		prop: "name",
		valueType: "copy",
		tooltip: "名称最多显示6个字符",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: [
			{
				label: "未解决",
				value: "0",
				color: "red",
			},
			{
				label: "已解决",
				value: "1",
				color: "blue",
			},
			{
				label: "解决中",
				value: "2",
				color: "yellow",
			},
			{
				label: "失败",
				value: "3",
				color: "red",
			},
		],
	},
	{
		label: "时间",
		prop: "time",
		valueType: "date-picker",
	},
	{
		label: "数量",
		prop: "number",
		valueType: "input-number",
		fieldProps: { precision: 2, step: 2 },
	},
	{
		label: "城市",
		prop: "city",
		valueType: "cascader",
		options: [
			{
				value: "0",
				label: "陕西",
				children: [
					{
						value: "0-0",
						label: "西安",
						children: [
							{
								value: "0-0-0",
								label: "新城区",
							},
							{
								value: "0-0-1",
								label: "高新区",
							},
							{
								value: "0-0-2",
								label: "灞桥区",
							},
						],
					},
				],
			},
			{
				value: "1",
				label: "山西",
				children: [
					{
						value: "1-0",
						label: "太原",
						children: [
							{
								value: "1-0-0",
								label: "小店区",
							},
							{
								value: "1-0-1",
								label: "古交市",
							},
							{
								value: "1-0-2",
								label: "万柏林区",
							},
						],
					},
				],
			},
		],
	},
];

const handleChange = (values: any) => {
	console.log(values, "change");
};
const handleSearch = (values: any) => {
	console.log(values, "search");
};
const handleReset = () => {
	console.log("handleReset");
};
</script>

<template>
	<section class="index-root">
		<h2>未收费房屋</h2>
		<el-card>
			<PlusSearch
				v-model="state"
				:columns="columns"
				:show-number="2"
				@change="handleChange"
				@search="handleSearch"
				@reset="handleReset"
			/>
		</el-card>
		<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
		<PureTable :="pureTableProps">
			<template #operation="{ row }">
				<!-- <ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
				<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
				<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton> -->
			</template>
		</PureTable>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
