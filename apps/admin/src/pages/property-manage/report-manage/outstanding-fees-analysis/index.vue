<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费分析",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.outstandingFeesAnalysis"),
	},
});
// TODO:这里的表格数据没有跟随页面的变化而变化，需要优化OR直接使用GET请求
import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { PlusColumn } from "plus-pro-components";
import type { TableColumns } from "plus-pro-components";
//表格数据
interface 欠费分析_未收情况表 {
	one: string; //楼栋号
	two: string; //总未收金额(截止2025-05-27)
	three: string; //2025年1-5月未收金额
	four: string; //2025年前未收金额
}
interface 欠费分析_未收明细表 {
	one: string; //房号
	two: string; //面积
	three: string; //费用
	four: string; //费用开始时间
	five: string; //费用截止时间
	six: string; //总未收金额
	seven: string; //2025年1-5月未收金额
	eight: string; //2025年前未收金额
}
interface 欠费分析_当月收费情况表 {
	one: string; //楼栋号
	two: string; //每月应收
	three: string; //5 月实收
	four: string; //5 月实收中属于2025 年1-4 月部分
	five: string; //5 月实收中属于2025 年5 月部分
	six: string; //5 月实收中属于2025年6月 起预收部分
	seven: string; //5 月实收中属于收2025 年前部分
}
interface 欠费分析_总数据 {
	one: 欠费分析_未收情况表[];
	two: 欠费分析_未收明细表[];
	three: 欠费分析_当月收费情况表[];
}

const tableDataItemOne: 欠费分析_未收情况表 = {
	one: "3栋",
	two: "10086",
	three: "12316",
	four: "911",
};
const tableDataItemTwo: 欠费分析_未收明细表 = {
	one: "101",
	two: "100",
	three: "物业费",
	four: "2025-01-01",
	five: "2025-05-31",
	six: "1000",
	seven: "200",
	eight: "800",
};
const tableDataItemThree: 欠费分析_当月收费情况表 = {
	one: "3栋",
	two: "1000",
	three: "500",
	four: "400",
	five: "100",
	six: "50",
	seven: "50",
};
//表格抬头数据
interface 欠费分析_抬头数据 {
	one: TableColumns[]; //未收情况表
	two: TableColumns[]; //未收明细表
	three: TableColumns[]; //当月收费情况表
}
const tableDataHead = ref<欠费分析_抬头数据>({
	one: [
		{
			label: "楼栋号",
			prop: "楼栋号",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "总未收金额(截止2025-05-27)",
			prop: "总未收金额(截止2025-05-27)",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "2025年1-5月未收金额",
			prop: "2025年1-5月未收金额",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "2025年前未收金额",
			prop: "2025年前未收金额",
			minWidth: 120,
			fixed: true,
		},
	],
	two: [
		{
			label: "房号",
			prop: "房号",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "面积",
			prop: "面积",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "费用",
			prop: "费用",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "费用开始时间",
			prop: "费用开始时间",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "费用截止时间",
			prop: "费用截止时间",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "总未收金额",
			prop: "总未收金额",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "2025年1-5月未收金额",
			prop: "2025年1-5月未收金额",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "2025年前未收金额",
			prop: "2025年前未收金额",
			minWidth: 120,
			fixed: true,
		},
	],
	three: [
		{
			label: "楼栋号",
			prop: "楼栋号",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "每月应收",
			prop: "每月应收",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "5 月实收",
			prop: "5 月实收",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "5 月实收中属于2025 年1-4 月部分",
			prop: "5 月实收中属于2025 年1-4 月部分",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "5 月实收中属于2025 年5 月部分",
			prop: "5 月实收中属于2025 年5 月部分",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "5 月实收中属于2025年6月 起预收部分",
			prop: "5 月实收中属于2025年6月 起预收部分",
			minWidth: 120,
			fixed: true,
		},
		{
			label: "5 月实收中属于收2025 年前部分",
			prop: "5 月实收中属于收2025 年前部分",
			minWidth: 120,
			fixed: true,
		},
	],
});
const tableData = ref<欠费分析_总数据>({
	one: Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItemOne })),
	two: Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItemTwo })),
	three: Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItemThree })),
});

//表格配置
const pureTableProps = ref<PureTableProps>({
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value.one,
	columns: tableDataHead.value.one,
});

//表单配置
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

const handleClick = (type: string) => {
	console.log(type, "click");
	if (type === "one") {
		pureTableProps.value.data = tableData.value.one;
		pureTableProps.value.columns = tableDataHead.value.one;
	} else if (type === "two") {
		pureTableProps.value.data = tableData.value.two;
		pureTableProps.value.columns = tableDataHead.value.two;
	} else if (type === "three") {
		pureTableProps.value.data = tableData.value.three;
		pureTableProps.value.columns = tableDataHead.value.three;
	}
};
</script>

<template>
	<section class="index-root">
		<h2>欠费分析</h2>
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
		<div class="table-container flex">
			<button @click="handleClick('one')">未收情况表</button>
			<button @click="handleClick('two')">未收明细表</button>
			<button @click="handleClick('three')">当月收费情况表</button>
		</div>
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
