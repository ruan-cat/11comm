<script lang="ts" setup>
definePage({
	meta: {
		title: "数据权限",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.dataPermission"),
	},
});

import { ref, computed, useTemplateRef } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type 数据权限数据, dataPermissionListData } from "./test-data";
import UnitAuthTable from "./components/unit-auth/table.vue";
import StaffRelationTable from "./components/staff-relation/table.vue";

const staffRelationTableRef = useTemplateRef("staffRelationTableRef");

/** 左侧数据权限列表数据 */
const dataPermissionList = ref<数据权限数据[]>(dataPermissionListData);

/** 当前选中的数据权限项 */
const selectedItem = ref<数据权限数据>(dataPermissionList.value[0]);

/** 右侧动态标题 */
const rightTitle = computed(() => {
	return selectedItem.value?.名称 || "A级数据权限";
});

/** 当前激活的Tab标签页 */
const activeTab = ref("unitAuth");

/** 处理左侧列表项点击 */
function handleItemClick(item: 数据权限数据) {
	selectedItem.value = item;
	console.log("选中项:", item);
}

/** 处理Tab切换 */
async function handleTabClick(tab: any) {
	console.log("切换Tab:", tab.props.name);
	await staffRelationTableRef.value.doResetTableAdaptive();
}
</script>

<template>
	<section class="index-root">
		<div class="data-permission-container">
			<!-- 左侧组织结构树 -->
			<div class="left-tree-panel">
				<div class="tree-header">
					<div class="tree-actions">
						<ElButton type="primary">
							{{ transformI18n($t("common.buttons.add")) }}
						</ElButton>
						<ElButton type="warning">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</div>
				</div>

				<div class="list-content">
					<ElScrollbar class="scrollbar-wrapper">
						<div class="data-permission-list">
							<div
								v-for="item in dataPermissionList"
								:key="item.编号"
								class="list-item"
								:class="{ active: selectedItem.编号 === item.编号 }"
								@click="handleItemClick(item)"
							>
								<span class="item-label">{{ item.名称 }}</span>
							</div>
						</div>
					</ElScrollbar>
				</div>
			</div>

			<!-- 右侧内容区域 -->
			<div class="right-content-panel">
				<!-- 动态标题 -->
				<div class="content-header">
					<h2 class="dynamic-title">{{ rightTitle }}</h2>
				</div>

				<!-- Tab标签页 -->
				<div class="content-tabs">
					<ElTabs v-model="activeTab" type="card" @tab-click="handleTabClick">
						<!-- 单元授权Tab -->
						<ElTabPane label="单元授权" name="unitAuth">
							<UnitAuthTable />
						</ElTabPane>

						<!-- 员工关联Tab -->
						<ElTabPane label="员工关联" name="staffRelation">
							<StaffRelationTable ref="staffRelationTableRef" />
						</ElTabPane>
					</ElTabs>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
	// 待优化 高度计算 使用统一的工具实现页面高度计算 避免滚动组件撑开页面高度
	height: calc(100vh - 140px);
	overflow: hidden;

	.data-permission-container {
		display: flex;
		height: 100%;
		gap: 16px;

		.left-tree-panel {
			width: 280px;
			height: 100%;
			max-height: 100%;
			display: flex;
			flex-direction: column;
			background: var(--el-bg-color);
			border: 1px solid var(--el-border-color);
			border-radius: 6px;
			box-shadow: var(--el-box-shadow-light);
			overflow: hidden;

			.tree-header {
				flex-shrink: 0;
				padding: 16px;

				.tree-actions {
					display: flex;
					gap: 8px;
				}
			}

			.list-content {
				flex: 1;
				min-height: 0;
				overflow: hidden;

				.scrollbar-wrapper {
					height: 100%;
					padding: 0 16px;

					:deep(.el-scrollbar__view) {
						padding-bottom: 16px;
					}
				}

				.data-permission-list {
					.list-item {
						padding: 12px 16px;
						margin-bottom: 2px;
						cursor: pointer;
						transition: all 0.2s ease;
						border-radius: 4px;

						&:hover {
							background-color: var(--el-fill-color-light);
						}

						&.active {
							background-color: var(--el-color-primary);
							color: var(--el-color-white);
						}

						.item-label {
							font-size: 14px;
							font-weight: 400;
						}
					}
				}
			}
		}

		.right-content-panel {
			flex: 1;
			display: flex;
			flex-direction: column;

			.content-header {
				margin-bottom: 16px;

				.dynamic-title {
					font-size: 20px;
					font-weight: 600;
					color: var(--el-text-color-primary);
					margin: 0;
				}
			}

			.content-tabs {
				flex: 1;

				:deep(.el-tabs__content) {
					height: calc(100% - 40px);
					overflow: auto;
				}
			}
		}
	}
}
</style>
