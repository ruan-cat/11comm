<script lang="ts" setup>
definePage({
	meta: {
		title: "注册协议",
		icon: "mdi:file-document",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.registerProtocol"),
	},
});

import { computed } from "vue";
import { useRegisterProtocolListQuery } from "@/api/setting-manage/system-manage/register-protocol";
import type { RegisterProtocol } from "@01s-11comm/type";

// 使用注册协议列表查询 Hook
const { tableData, isFetching } = useRegisterProtocolListQuery({});

/** 注册协议数据 */
const registerProtocol = computed<RegisterProtocol>(() => {
	if (tableData.value && tableData.value.length > 0) {
		return tableData.value[0];
	}
	// 返回默认空值
	return {
		id: "",
		title: "",
		content: "",
		version: "",
		status: "",
		createTime: "",
		updateTime: "",
	};
});
</script>

<template>
	<div v-loading="isFetching" class="register-protocol-container">
		<ElCard class="box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">注册协议</span>
				</div>
			</template>
			<div class="protocol-content">
				<div class="title">{{ registerProtocol.title }}</div>
				<div class="content">{{ registerProtocol.content }}</div>
			</div>
		</ElCard>
	</div>
</template>

<style lang="scss" scoped>
.register-protocol-container {
	padding: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.protocol-content {
	padding: 20px;

	.title {
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20px;
	}

	.content {
		line-height: 1.6;
		white-space: pre-wrap;
	}
}
</style>
