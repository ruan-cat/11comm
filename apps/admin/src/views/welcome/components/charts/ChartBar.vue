<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { transformI18n } from "@/plugins/i18n";
import { type PropType, ref, computed, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
	requireData: {
		type: Array as PropType<Array<number>>,
		default: () => [],
	},
	questionData: {
		type: Array as PropType<Array<number>>,
		default: () => [],
	},
});

const { isDark } = useDark();
const { t } = useI18n();

const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, {
	theme,
});

watch(
	() => props,
	async () => {
		await nextTick(); // 确保DOM更新完成后再执行
		setOptions({
			container: ".bar-card",
			color: ["#41b6ff", "#e85f33"],
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "none",
				},
			},
			grid: {
				top: "20px",
				left: "50px",
				right: 0,
			},
			legend: {
				data: [transformI18n($t("welcome.metrics.requiredPeople")), transformI18n($t("welcome.metrics.questionCount"))],
				textStyle: {
					color: "#606266",
					fontSize: "0.875rem",
				},
				bottom: 0,
			},
			xAxis: [
				{
					type: "category",
					data: [
						transformI18n($t("welcome.weekdays.monday")),
						transformI18n($t("welcome.weekdays.tuesday")),
						transformI18n($t("welcome.weekdays.wednesday")),
						transformI18n($t("welcome.weekdays.thursday")),
						transformI18n($t("welcome.weekdays.friday")),
						transformI18n($t("welcome.weekdays.saturday")),
						transformI18n($t("welcome.weekdays.sunday")),
					],
					axisLabel: {
						fontSize: "0.875rem",
					},
					axisPointer: {
						type: "shadow",
					},
				},
			],
			yAxis: [
				{
					type: "value",
					axisLabel: {
						fontSize: "0.875rem",
					},
					splitLine: {
						show: false, // 去网格线
					},
					// name: "单位: 个"
				},
			],
			series: [
				{
					name: transformI18n($t("welcome.metrics.requiredPeople")),
					type: "bar",
					barWidth: 10,
					itemStyle: {
						color: "#41b6ff",
						borderRadius: [10, 10, 0, 0],
					},
					data: props.requireData,
				},
				{
					name: transformI18n($t("welcome.metrics.questionCount")),
					type: "bar",
					barWidth: 10,
					itemStyle: {
						color: "#e86033ce",
						borderRadius: [10, 10, 0, 0],
					},
					data: props.questionData,
				},
			],
		});
	},
	{
		deep: true,
		immediate: true,
	},
);
</script>

<template>
	<div ref="chartRef" style="width: 100%; height: 365px" />
</template>
