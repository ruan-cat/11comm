<template v-slot:append v-if="isImageCaptchaEnabled">
	<!-- 系统自带验证码组件 -->
	<ReImageVerify v-if="isSystemCaptchaEnabled" v-model:code="imgCode" />
	<!-- 自定义验证码组件 -->
	<ReImageVerifySimple v-else ref="captchaRef" @captcha-loaded="handleCaptchaLoaded" />
</template>