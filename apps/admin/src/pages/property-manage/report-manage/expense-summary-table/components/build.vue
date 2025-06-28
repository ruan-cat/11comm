<template>
	<div ref="chartDom" :style="myChartStyle"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

// 数据定义
const xData = ["高松灯", "千早爱音", "丰川祥子", "要乐奈", "椎名立希", "三角初华", "八幡海玲"];
const yData = [23, 11, 15, 7, 26, 30, 22];
const taskDate = [22, 6, 10, 20, 11, 25, 19];

const myChartStyle = {
	float: "left",
	width: "100%",
	height: "400px",
};

const chartDom = ref(null);
let myChart = null;

const initEcharts = () => {
	if (chartDom.value) {
		myChart = echarts.init(chartDom.value);

		const option = {
			xAxis: {
				data: xData,
			},
			legend: {
				data: ["户收费率", "收费率"],
				top: "0%",
			},
			yAxis: {},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
				formatter: function (params) {
					let content = `${params[0].name}<br/>`;
					params.forEach((item) => {
						content += `${item.marker} ${item.seriesName}: ${item.data.value}<br/>`;
					});
					return content;
				},
			},
			series: [
				{
					type: "bar",
					name: "户收费率",
					data: yData.map((val, index) => ({ value: val, name: xData[index] })),
					label: {
						show: false,
					},
				},
				{
					type: "bar",
					name: "收费率",
					data: taskDate.map((val, index) => ({ value: val, name: xData[index] })),
					label: {
						show: false,
					},
				},
			],
		};

		myChart.setOption(option);
	}
};

const handleResize = () => {
	if (myChart) {
		myChart.resize();
	}
};

onMounted(() => {
	initEcharts();
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	if (myChart) {
		myChart.dispose();
	}
});
</script>
