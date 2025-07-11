<script lang="ts" setup>
definePage({
	meta: {
		title: "系统配置",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});

import { ref } from "vue";

/** 系统配置数据 */
const systemConfig = ref({
	title: "HC小区管理系统",
	subtitle: "智慧物业系统",
	shortName: "HC",
	companyName: "java110团队",
	logoUrl: "/img/logo.png",
	staticUrl: "http://demo.homecommunity.cn",
	defaultCommunityCode: "20230522671001146",
	ownerTitle: "HC智慧家园",
	propertyMobileTitle: "HC掌上物业",
	qqMapKey: "123123",
	mallUrl: "http://mallapp.homecommunity.cn",
});

/** 系统基本信息配置 */
const basicColumns = [
	{
		label: "标题名称",
		value: systemConfig.value.title,
		minWidth: 120,
	},
	{
		label: "副标题",
		value: systemConfig.value.subtitle,
		minWidth: 120,
	},
	{
		label: "简写名称",
		value: systemConfig.value.shortName,
		minWidth: 120,
	},
	{
		label: "公司名称",
		value: systemConfig.value.companyName,
		minWidth: 120,
	},
];

/** 系统地址配置 */
const urlColumns = [
	{
		label: "logo地址",
		value: systemConfig.value.logoUrl,
		minWidth: 120,
		copy: true,
	},
	{
		label: "静态url",
		value: systemConfig.value.staticUrl,
		minWidth: 120,
		copy: true,
	},
	{
		label: "商城地址",
		value: systemConfig.value.mallUrl,
		minWidth: 120,
		copy: true,
	},
];

/** 业务配置 */
const businessColumns = [
	{
		label: "默认小区编号",
		value: systemConfig.value.defaultCommunityCode,
		minWidth: 120,
		copy: true,
	},
	{
		label: "业主标题",
		value: systemConfig.value.ownerTitle,
		minWidth: 120,
	},
	{
		label: "物业手机标题",
		value: systemConfig.value.propertyMobileTitle,
		minWidth: 120,
	},
	{
		label: "qq地图key",
		value: systemConfig.value.qqMapKey,
		minWidth: 120,
		copy: true,
	},
];
</script>

<template>
	<div class="system-config-container">
		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">系统基本信息</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions border :columns="basicColumns" :column="2" size="default" />
			</ElScrollbar>
		</ElCard>

		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">系统地址配置</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions border :columns="urlColumns" :column="1" size="default" />
			</ElScrollbar>
		</ElCard>

		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">业务配置</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions border :columns="businessColumns" :column="2" size="default" />
			</ElScrollbar>
		</ElCard>
	</div>
</template>

<style lang="scss" scoped>
.system-config-container {
	padding: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.box-card {
	margin-bottom: 16px;
}

:deep(.el-descriptions__body) {
	background: transparent;
}

:deep(.el-descriptions__table) {
	.el-descriptions__cell {
		padding: 12px 16px;
	}
}
</style>
