<script lang="ts" setup>
definePage({
	meta: {
		// 数据权限
		title: "settingManage.organizeManage.dataPermission.pageTitle",
		icon: "mdi:shield-account",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.dataPermission"),
	},
});

import { computed, ref, useTemplateRef, watch } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import UnitAuthTable from "./components/unit-auth/table.vue";
import StaffRelationTable from "./components/staff-relation/table.vue";
import type { DataPermission } from "@01s-11comm/type";
import { useDataPermissionListQuery } from "@/api/setting-manage/organize-manage/data-permission";

const { locale, withLocale } = useI18nConfig();

const staffRelationTableRef = useTemplateRef("staffRelationTableRef");

const { tableData, isFetching } = useDataPermissionListQuery({});

const dataPermissionList = computed<DataPermission[]>(() => tableData.value);
const selectedItem = ref<DataPermission | null>(null);
const activeTab = ref("unitAuth");

watch(
	dataPermissionList,
	(list) => {
		if (!selectedItem.value && list.length > 0) {
			selectedItem.value = list[0];
		}
	},
	{ immediate: true },
);

const rightTitle = withLocale(() => {
	if (selectedItem.value?.name) {
		return selectedItem.value.name;
	}

	return transformI18n($t("settingManage.organizeManage.dataPermission.defaultTitle"));
});

const tabLabels = withLocale(() => ({
	unitAuth: transformI18n($t("settingManage.organizeManage.dataPermission.tabs.unitAuth")),
	staffRelation: transformI18n($t("settingManage.organizeManage.dataPermission.tabs.staffRelation")),
}));

function handleItemClick(item: DataPermission) {
	selectedItem.value = item;
}

async function handleTabClick(tab: any) {
	if (tab.props.name === "staffRelation") {
		await staffRelationTableRef.value?.doResetTableAdaptive?.();
	}
}
</script>

<template>
	<section :key="locale" class="index-root">
		<div class="data-permission-container">
			<div class="left-tree-panel" v-loading="isFetching">
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
								:key="item.id"
								class="list-item"
								:class="{ active: selectedItem?.id === item.id }"
								@click="handleItemClick(item)"
							>
								<span class="item-label">{{ item.name }}</span>
							</div>
						</div>
					</ElScrollbar>
				</div>
			</div>

			<div class="right-content-panel">
				<div class="content-header">
					<h2 class="dynamic-title">{{ rightTitle }}</h2>
				</div>

				<div class="content-tabs">
					<ElTabs v-model="activeTab" type="card" @tab-click="handleTabClick">
						<ElTabPane :label="tabLabels.unitAuth" name="unitAuth">
							<UnitAuthTable />
						</ElTabPane>
						<ElTabPane :label="tabLabels.staffRelation" name="staffRelation">
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
