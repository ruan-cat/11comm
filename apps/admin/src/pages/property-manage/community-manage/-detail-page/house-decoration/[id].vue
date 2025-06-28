<script lang="ts" setup>
definePage({
	meta: {
		title: "装修跟踪记录",
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
		<h2>房屋装修 详情页</h2>
		<ElButton type="warning" :icon="useRenderIcon('tdesign:rollback')" @click="() => router.back()">
			{{ transformI18n($t("common.buttons.back")) }}
		</ElButton>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
