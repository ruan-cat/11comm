<script setup lang="ts">
import { ref, onMounted, readonly } from "vue";
import { getJ1LoginCaptcha, type CaptchaResult } from "@/api/j1/login/login";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

interface ReImageVerifySimpleProps {
	/** 验证码图片宽度 */
	width?: string | number;
	/** 验证码图片高度 */
	height?: string | number;
	/** 是否自动加载 */
	autoLoad?: boolean;
}

const props = withDefaults(defineProps<ReImageVerifySimpleProps>(), {
	width: "100%",
	height: "100%",
	autoLoad: true,
});

const emit = defineEmits<{
	/** 验证码加载成功 */
	"captcha-loaded": [data: CaptchaResult];
	/** 验证码加载失败 */
	"captcha-error": [error: any];
}>();

// 响应式数据
const captchaData = ref<CaptchaResult | null>(null);
const isLoading = ref(false);
const hasError = ref(false);

/**
 * 获取验证码
 */
async function fetchCaptcha() {
	if (isLoading.value) return;

	try {
		isLoading.value = true;
		hasError.value = false;

		const response = await getJ1LoginCaptcha();

		if (response.data) {
			captchaData.value = response.data;
			emit("captcha-loaded", response.data);
		} else {
			throw new Error("验证码数据为空");
		}
	} catch (error) {
		console.error("获取验证码失败:", error);
		hasError.value = true;
		captchaData.value = null;
		emit("captcha-error", error);
	} finally {
		isLoading.value = false;
	}
}

/**
 * 处理刷新点击事件
 */
async function handleRefresh() {
	if (isLoading.value) return;
	await fetchCaptcha();
}

/**
 * 手动刷新验证码（对外暴露的方法）
 */
async function refresh() {
	await fetchCaptcha();
}

// 对外暴露方法
defineExpose({
	refresh,
	captchaData: readonly(captchaData),
	isLoading: readonly(isLoading),
});

// 组件挂载时自动加载
onMounted(async () => {
	if (props.autoLoad) {
		await fetchCaptcha();
	}
});
</script>

<template>
	<div class="re-image-verify-simple">
		<div
			class="captcha-container"
			:class="{ loading: isLoading }"
			@click="handleRefresh"
			:title="isLoading ? '验证码加载中...' : '点击刷新验证码'"
			v-loading="isLoading"
			element-loading-text="验证码加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255, 255, 255, 0.8)"
		>
			<!-- 验证码图片 -->
			<img
				v-if="captchaData?.captchaImage && !isLoading"
				:src="`${captchaData.captchaImage}`"
				alt="验证码"
				class="captcha-image"
			/>

			<!-- 错误状态 -->
			<div v-if="hasError && !isLoading" class="error-placeholder" @click="handleRefresh">
				<component :is="useRenderIcon('material-symbols:warning')" class="error-icon" />
				<span class="error-text">加载失败，点击重试</span>
			</div>

			<!-- 空状态占位 -->
			<div v-if="!captchaData && !isLoading && !hasError" class="empty-placeholder">
				<component :is="useRenderIcon('material-symbols:image')" class="empty-icon" />
				<span class="empty-text">点击获取验证码</span>
			</div>

			<!-- 刷新提示 -->
			<div class="refresh-hint" v-show="!isLoading && !hasError && captchaData">
				<component :is="useRenderIcon('material-symbols:refresh')" class="refresh-icon" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.re-image-verify-simple {
	display: block;
	width: 100%;
	height: 100%;

	.captcha-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: v-bind('typeof props.width === "number" ? props.width + "px" : props.width');
		height: v-bind('typeof props.height === "number" ? props.height + "px" : props.height');
		min-width: 80px;
		min-height: 32px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		background-color: #f5f5f5;
		transition: all 0.3s ease;
		overflow: hidden;

		&:hover:not(.loading) {
			background-color: #e6e6e6;
			transform: translateY(-1px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

			.refresh-hint {
				opacity: 1;
			}
		}

		&.loading {
			cursor: not-allowed;
			background-color: #f9f9f9;
		}

		.captcha-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
			display: block;
		}

		.empty-placeholder {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 6px;
			color: #999;
			font-size: 12px;
			text-align: center;
			padding: 4px 8px;
			width: 100%;
			height: 100%;

			.empty-icon {
				font-size: 16px;
				width: 16px;
				height: 16px;
				opacity: 0.7;
				flex-shrink: 0;
			}

			.empty-text {
				font-size: 12px;
				line-height: 1.2;
				white-space: nowrap;
			}

			&:hover {
				color: #666;
			}
		}

		.error-placeholder {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 6px;
			color: #f56c6c;
			font-size: 12px;
			text-align: center;
			padding: 4px 8px;
			width: 100%;
			height: 100%;

			.error-icon {
				font-size: 14px;
				width: 14px;
				height: 14px;
				flex-shrink: 0;
			}

			.error-text {
				font-size: 12px;
				line-height: 1.2;
				white-space: nowrap;
			}

			&:hover {
				color: #f78989;
			}
		}

		.refresh-hint {
			position: absolute;
			top: 4px;
			right: 4px;
			background: rgba(0, 0, 0, 0.5);
			color: white;
			padding: 2px;
			border-radius: 2px;
			font-size: 10px;
			opacity: 0;
			transition: opacity 0.3s ease;
			pointer-events: none;

			.refresh-icon {
				display: inline-flex;
				width: 10px;
				height: 10px;
				animation: rotate 2s ease-in-out infinite;
			}
		}
	}
}

@keyframes rotate {
	0%,
	100% {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
}
</style>
