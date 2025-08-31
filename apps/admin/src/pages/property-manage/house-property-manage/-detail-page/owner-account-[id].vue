<script lang="ts" setup>
definePage({
	meta: {
		title: "账户明细",
		icon: "f7:menu",
	},
	beforeEnter: (to, from, next) => {
		const { handleDetailPageBeforeEnter } = useGotoDetailsPage();
		handleDetailPageBeforeEnter(to, from, next);
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const router = useRouter();
</script>

<template>
	<section class="index-root">
		<h2>业主账户 详情页</h2>
		<ElButton type="warning" :icon="useRenderIcon('tdesign:rollback')" @click="() => router.back()">
			{{ transformI18n($t("common.buttons.back")) }}
		</ElButton>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
