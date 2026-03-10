<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

const { t } = useI18n();
const { loading, columns, dataList, pagination, Empty, onCurrentChange } = useColumns();
</script>

<template>
	<pure-table
		row-key="id"
		alignWhole="center"
		showOverflowTooltip
		:loading="loading"
		:loading-config="{ background: 'transparent' }"
		:data="
			dataList.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)
		"
		:columns="columns"
		:pagination="pagination"
		@page-current-change="onCurrentChange"
	>
		<template #empty>
			<el-empty :description="transformI18n($t('welcome.table.noData'))" :image-size="60">
				<template #image>
					<Empty />
				</template>
			</el-empty>
		</template>
		<template #operation="{ row }">
			<el-button
				plain
				circle
				size="small"
				:title="t('welcome.table.viewDetailTitle', { id: row.id })"
				:icon="useRenderIcon('ri:search-line')"
			/>
		</template>
	</pure-table>
</template>

<style lang="scss">
.pure-table-filter {
	.el-table-filter__list {
		min-width: 80px;
		padding: 0;

		li {
			line-height: 28px;
		}
	}
}
</style>

<style lang="scss" scoped>
:deep(.el-table) {
	--el-table-border: none;
	--el-table-border-color: transparent;

	.el-empty__description {
		margin: 0;
	}

	.el-scrollbar__bar {
		display: none;
	}
}
</style>
