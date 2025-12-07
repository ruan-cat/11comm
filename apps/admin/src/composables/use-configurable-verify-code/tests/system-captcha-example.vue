<script setup lang="ts">
import { computed, ref } from "vue";
import ReImageVerify from "@/components/ReImageVerify/index.vue";
import ReImageVerifySimple from "@/components/ReImageVerifySimple/index.vue";

const imgCode = ref("");
const captchaRef = ref<InstanceType<typeof ReImageVerifySimple> | null>(null);
const isSystemCaptchaEnabled = computed(() => true);
const isImageCaptchaEnabled = computed(() => true);

function handleCaptchaLoaded() {
	captchaRef.value?.refresh?.();
}
</script>

<template v-slot:append v-if="isImageCaptchaEnabled">
	<!-- 系统自带验证码组件 -->
	<ReImageVerify v-if="isSystemCaptchaEnabled" v-model:code="imgCode" />
	<!-- 自定义验证码组件 -->
	<ReImageVerifySimple v-else ref="captchaRef" @captcha-loaded="handleCaptchaLoaded" />
</template>
