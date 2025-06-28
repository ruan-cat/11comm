# 验证码逻辑迁移分析与方案

## 一、新旧项目验证码功能对比

### 旧项目验证码特点（examples/01s-origin）

#### 1. 功能完善度 ⭐⭐⭐⭐⭐

**支持验证类型**：

- **滑块验证码**（blockPuzzle）：拖拽滑块完成拼图验证
- **点击文字验证码**（clickWord）：点击指定文字完成验证
- 支持弹窗模式和嵌入模式

**核心组件架构**：

```plain
src/components/verifition/
├── Verify.vue           # 主验证码组件（分发器）
├── verify/
│   ├── VerifySlide.vue  # 滑块验证码组件
│   └── VerifyPoints.vue # 点击文字验证码组件
├── api/                 # 验证码相关API
└── utils/              # 工具函数
```

**使用方式**：

```vue
<template>
	<Verify
		mode="pop"
		:captchaType="captchaType"
		:imgSize="{ width: '400px', height: '200px' }"
		ref="verify"
		@success="handleSuccess"
	/>
</template>

<script>
// 弹出验证码
function useVerify(type: string) {
  captchaType.value = type  // 'blockPuzzle' 或 'clickWord'
  if (verify.value) verify.value.show()
}

// 验证成功回调
function handleSuccess(res: { captchaVerification: string }) {
  doLogin(res.captchaVerification)
}
</script>
```

#### 2. 特性分析

**优势**：

- ✅ **交互体验优秀**：滑块验证和点击验证体验流畅
- ✅ **安全性高**：支持后端图片生成和验证
- ✅ **可配置性强**：支持尺寸、模式、样式自定义
- ✅ **兼容性好**：支持移动端触摸事件
- ✅ **防刷机制完善**：集成刷新、重试等功能

**技术特点**：

- 基于 Canvas 图片处理
- AES 加密传输
- 支持移动端和桌面端
- 完整的生命周期管理

### 新项目验证码特点（apps/admin）

#### 1. 当前实现 ⭐⭐⭐

**支持验证类型**：

- **图片验证码**：简单的数字字符验证码
- **短信验证码**：手机号短信验证

**核心组件**：

```plain
src/components/ReImageVerify/
├── src/
│   ├── index.vue       # 图片验证码组件
│   └── hooks.ts        # Canvas绘制逻辑
src/views/login/utils/
└── verifyCode.ts       # 短信验证码工具
```

**使用方式**：

```vue
<template>
	<!-- 图片验证码 -->
	<ReImageVerify v-model:code="imgCode" />

	<!-- 短信验证码 -->
	<el-button @click="useVerifyCode().start(formRef, 'phone')"> 获取验证码 </el-button>
</template>
```

#### 2. 特性分析

**优势**：

- ✅ **轻量级**：实现简单，代码量少
- ✅ **TypeScript 支持**：完整的类型定义
- ✅ **组合式 API**：使用 Vue 3 Composition API

**不足**：

- ❌ **安全性较低**：前端生成的图片验证码容易被破解
- ❌ **交互体验一般**：缺乏现代化验证体验
- ❌ **功能单一**：只支持简单数字验证码

## 二、迁移必要性评估

### 迁移必要性：**强烈建议** ⭐⭐⭐⭐⭐

**原因分析**：

1. **安全性提升**：

   - 旧项目的验证码由后端生成，安全性更高
   - 支持复杂的图形验证，防止机器人攻击
   - 新项目的前端验证码容易被绕过

2. **用户体验改善**：

   - 滑块验证和点击验证比输入数字更直观
   - 减少用户输入错误的概率
   - 支持移动端友好的触摸操作

3. **功能完整性**：
   - 旧项目提供完整的验证码解决方案
   - 支持多种验证方式，适应不同场景
   - 可配置性更强，便于定制

## 三、具体迁移方案

### 第一阶段：组件迁移

#### 1. 复制验证码组件

将旧项目的验证码组件迁移到新项目：

```bash
# 目标目录结构
apps/admin/src/components/ReVerify/
├── index.ts            # 导出文件
├── src/
│   ├── Verify.vue      # 主验证码组件
│   ├── VerifySlide.vue # 滑块验证码
│   ├── VerifyPoints.vue# 点击验证码
│   ├── hooks.ts        # 组合式API封装
│   └── types.ts        # TypeScript类型定义
├── api/
│   └── index.ts        # 验证码API
└── utils/
    ├── ase.ts          # AES加密工具
    └── util.ts         # 工具函数
```

#### 2. TypeScript 重构

将旧项目的 JavaScript 代码重构为 TypeScript：

```typescript
// apps/admin/src/components/ReVerify/src/types.ts

export interface VerifyProps {
	/** 验证码类型 */
	captchaType: "blockPuzzle" | "clickWord";
	/** 显示模式 */
	mode?: "pop" | "fixed";
	/** 图片尺寸 */
	imgSize?: {
		width: string;
		height: string;
	};
	/** 滑块尺寸 */
	blockSize?: {
		width: string;
		height: string;
	};
	/** 操作条尺寸 */
	barSize?: {
		width: string;
		height: string;
	};
}

export interface VerifyEmits {
	/** 验证成功事件 */
	(e: "success", result: VerifyResult): void;
	/** 验证失败事件 */
	(e: "error", error: string): void;
}

export interface VerifyResult {
	/** 验证通过凭证 */
	captchaVerification: string;
	/** 验证用时 */
	captchaUseTime: number;
}
```

#### 3. 组合式 API 封装

创建现代化的 hooks：

```typescript
// apps/admin/src/components/ReVerify/src/hooks.ts

import { ref, reactive, computed } from "vue";
import type { VerifyProps, VerifyResult } from "./types";

export const useVerify = (props: VerifyProps) => {
	const visible = ref(false);
	const loading = ref(false);
	const captchaType = ref(props.captchaType);

	const config = reactive({
		imgSize: props.imgSize || { width: "310px", height: "155px" },
		blockSize: props.blockSize || { width: "50px", height: "50px" },
		barSize: props.barSize || { width: "310px", height: "40px" },
	});

	const show = () => {
		if (props.mode === "pop") {
			visible.value = true;
		}
	};

	const hide = () => {
		visible.value = false;
	};

	const refresh = () => {
		// 刷新验证码逻辑
	};

	const handleSuccess = (result: VerifyResult) => {
		hide();
		// 触发成功事件
	};

	const handleError = (error: string) => {
		// 处理错误
	};

	return {
		visible,
		loading,
		captchaType,
		config,
		show,
		hide,
		refresh,
		handleSuccess,
		handleError,
	};
};
```

### 第二阶段：API 适配

#### 1. 验证码 API 封装

```typescript
// apps/admin/src/components/ReVerify/api/index.ts

import { http } from "@/utils/http";
import type { DataUpType } from "@/utils/http/types.d";

export interface CaptchaGetParams {
	captchaType: string;
}

export interface CaptchaGetResult {
	repCode: string;
	repData: {
		originalImageBase64: string;
		jigsawImageBase64: string;
		token: string;
		secretKey: string;
	};
	repMsg: string;
	success: boolean;
}

export interface CaptchaVerifyParams {
	captchaType: string;
	pointJson: string;
	token: string;
}

export interface CaptchaVerifyResult {
	repCode: string;
	repData: {
		captchaVerification: string;
	};
	repMsg: string;
	success: boolean;
}

/** 获取验证码 */
export const getCaptcha = (data: CaptchaGetParams) => {
	return http.post<CaptchaGetResult>("/captcha/get", { data }, { upType: DataUpType.FORM });
};

/** 验证验证码 */
export const verifyCaptcha = (data: CaptchaVerifyParams) => {
	return http.post<CaptchaVerifyResult>("/captcha/check", { data }, { upType: DataUpType.FORM });
};
```

#### 2. 集成到登录流程

修改登录页面以使用新的验证码组件：

```vue
<!-- apps/admin/src/views/login/index.vue -->
<template>
	<div class="login-container">
		<!-- 现有登录表单 -->
		<el-form>
			<!-- 用户名、密码等字段 -->

			<!-- 替换原有的简单验证码 -->
			<!-- <ReImageVerify v-model:code="imgCode" /> -->

			<!-- 使用新的验证码组件 -->
			<el-form-item>
				<el-button @click="showVerify" type="primary" style="width: 100%"> 登录 </el-button>
			</el-form-item>
		</el-form>

		<!-- 验证码组件 -->
		<ReVerify
			ref="verifyRef"
			:captcha-type="verifyType"
			mode="pop"
			:img-size="{ width: '400px', height: '200px' }"
			@success="handleVerifySuccess"
			@error="handleVerifyError"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ReVerify } from "@/components/ReVerify";
import type { VerifyResult } from "@/components/ReVerify/src/types";

const verifyRef = ref();
const verifyType = ref<"blockPuzzle" | "clickWord">("blockPuzzle");

// 显示验证码
const showVerify = () => {
	// 可以根据需要切换验证类型
	verifyType.value = Math.random() > 0.5 ? "blockPuzzle" : "clickWord";
	verifyRef.value?.show();
};

// 验证成功处理
const handleVerifySuccess = async (result: VerifyResult) => {
	try {
		// 执行登录逻辑
		const loginResult = await useUserStoreHook().loginByUsername({
			username: ruleForm.username,
			password: ruleForm.password,
			captchaVerification: result.captchaVerification,
		});

		if (loginResult.success) {
			// 登录成功后续处理
			message(t("common.login.pureLoginSuccess"), { type: "success" });
			router.push(getTopMenu(true).path);
		}
	} catch (error) {
		message(t("common.login.pureLoginFail"), { type: "error" });
	}
};

// 验证失败处理
const handleVerifyError = (error: string) => {
	message(error || "验证失败，请重试", { type: "error" });
};
</script>
```

### 第三阶段：兼容性处理

#### 1. 保留现有验证码组件

为确保平滑迁移，可以同时保留两套验证码系统：

```typescript
// apps/admin/src/components/ReVerify/index.ts

// 导出新的验证码组件
export { default as ReVerify } from "./src/Verify.vue";
export { default as ReVerifySlide } from "./src/VerifySlide.vue";
export { default as ReVerifyPoints } from "./src/VerifyPoints.vue";

// 导出类型
export * from "./src/types";
export * from "./api";

// 保持原有组件的兼容性
export { default as ReImageVerify } from "../ReImageVerify/src/index.vue";
```

#### 2. 配置化切换

通过配置文件控制使用哪种验证码：

```typescript
// apps/admin/src/config/verify.ts

export const verifyConfig = {
	// 验证码类型：'simple' | 'advanced'
	type: import.meta.env.VITE_VERIFY_TYPE || "advanced",

	// 高级验证码配置
	advanced: {
		// 默认验证类型
		defaultType: "blockPuzzle" as "blockPuzzle" | "clickWord",
		// 是否随机选择验证类型
		randomType: true,
		// API 接口配置
		apiEndpoint: {
			get: "/captcha/get",
			verify: "/captcha/check",
		},
	},

	// 简单验证码配置
	simple: {
		width: 120,
		height: 40,
		length: 4,
	},
};
```

### 第四阶段：样式和主题适配

#### 1. 样式现代化

更新验证码组件样式以匹配 Pure-Admin 设计风格：

```scss
// apps/admin/src/components/ReVerify/src/styles/index.scss

.re-verify {
	// 使用 Pure-Admin 的设计规范
	--el-border-radius-base: 4px;
	--el-color-primary: var(--el-color-primary);

	.verify-modal {
		border-radius: var(--el-border-radius-base);
		box-shadow: var(--el-box-shadow-dark);
	}

	.verify-slide-track {
		background: var(--el-bg-color-page);
		border: 1px solid var(--el-border-color);
	}

	.verify-slide-button {
		background: var(--el-color-primary);
		&:hover {
			background: var(--el-color-primary-light-3);
		}
	}
}
```

#### 2. 响应式适配

确保验证码组件在不同设备上都有良好的体验：

```typescript
// apps/admin/src/components/ReVerify/src/composables/useResponsive.ts

import { ref, computed, onMounted, onUnmounted } from "vue";

export const useResponsive = () => {
	const screenWidth = ref(window.innerWidth);

	const isMobile = computed(() => screenWidth.value < 768);
	const isTablet = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024);
	const isDesktop = computed(() => screenWidth.value >= 1024);

	const verifySize = computed(() => {
		if (isMobile.value) {
			return {
				imgSize: { width: "280px", height: "140px" },
				barSize: { width: "280px", height: "36px" },
			};
		} else if (isTablet.value) {
			return {
				imgSize: { width: "320px", height: "160px" },
				barSize: { width: "320px", height: "40px" },
			};
		} else {
			return {
				imgSize: { width: "400px", height: "200px" },
				barSize: { width: "400px", height: "44px" },
			};
		}
	});

	const handleResize = () => {
		screenWidth.value = window.innerWidth;
	};

	onMounted(() => {
		window.addEventListener("resize", handleResize);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", handleResize);
	});

	return {
		isMobile,
		isTablet,
		isDesktop,
		verifySize,
	};
};
```

## 四、迁移计划和时间线

### 第一周：基础迁移

- [ ] 复制验证码组件到新项目
- [ ] 基础 TypeScript 类型定义
- [ ] 简单的功能验证

### 第二周：功能完善

- [ ] API 接口适配
- [ ] 组合式 API 重构
- [ ] 错误处理和用户反馈

### 第三周：集成测试

- [ ] 登录流程集成
- [ ] 多种验证类型测试
- [ ] 移动端兼容性测试

### 第四周：优化上线

- [ ] 样式优化和主题适配
- [ ] 性能优化
- [ ] 文档完善

## 五、风险评估和应对措施

### 潜在风险

1. **API 兼容性**：后端可能需要相应的 API 支持
2. **依赖冲突**：可能与现有组件产生样式或功能冲突
3. **学习成本**：团队需要熟悉新的验证码组件使用方式

### 应对措施

1. **渐进式迁移**：先在部分页面试用，逐步推广
2. **向后兼容**：保留原有验证码组件作为备选方案
3. **充分测试**：在多种环境和设备上进行测试
4. **文档支持**：提供详细的使用文档和示例

## 六、预期效果

### 安全性提升

- 🔒 防止机器人攻击
- 🔒 提高验证码破解难度
- 🔒 支持后端生成和验证

### 用户体验改善

- 🎯 更直观的交互方式
- 🎯 减少输入错误
- 🎯 支持移动端友好操作

### 技术债务清理

- 🛠️ 现代化的 Vue 3 组合式 API
- 🛠️ 完整的 TypeScript 类型支持
- 🛠️ 更好的代码组织结构

通过这次验证码迁移，项目将获得更强的安全性、更好的用户体验和更现代化的技术架构。

## 七、详细实施指南

### 第一步：组件文件迁移

#### 1. 创建目录结构并复制文件

```bash
# 在新项目中创建验证码组件目录
mkdir -p apps/admin/src/components/ReVerify/src
mkdir -p apps/admin/src/components/ReVerify/api
mkdir -p apps/admin/src/components/ReVerify/utils
```

**文件迁移清单**：

```bash
# 从旧项目复制到新项目
examples/01s-origin/src/components/verifition/Verify.vue
→ apps/admin/src/components/ReVerify/src/Verify.vue

examples/01s-origin/src/components/verifition/verify/VerifySlide.vue
→ apps/admin/src/components/ReVerify/src/VerifySlide.vue

examples/01s-origin/src/components/verifition/verify/VerifyPoints.vue
→ apps/admin/src/components/ReVerify/src/VerifyPoints.vue

examples/01s-origin/src/components/verifition/api/
→ apps/admin/src/components/ReVerify/api/

examples/01s-origin/src/components/verifition/utils/
→ apps/admin/src/components/ReVerify/utils/
```

#### 2. 创建 TypeScript 类型定义

```typescript
// apps/admin/src/components/ReVerify/src/types.ts

export interface VerifyProps {
	/** 验证码类型 */
	captchaType: "blockPuzzle" | "clickWord";
	/** 显示模式 */
	mode?: "pop" | "fixed";
	/** 图片尺寸 */
	imgSize?: {
		width: string;
		height: string;
	};
	/** 滑块尺寸 */
	blockSize?: {
		width: string;
		height: string;
	};
	/** 操作条尺寸 */
	barSize?: {
		width: string;
		height: string;
	};
	/** 垂直间距 */
	vSpace?: number;
	/** 说明文字 */
	explain?: string;
}

export interface VerifyEmits {
	/** 验证成功事件 */
	(e: "success", result: VerifyResult): void;
	/** 验证失败事件 */
	(e: "error", error: string): void;
	/** 组件准备完成 */
	(e: "ready"): void;
}

export interface VerifyResult {
	/** 验证通过凭证 */
	captchaVerification: string;
	/** 验证用时 */
	captchaUseTime: number;
}

export interface VerifyInstance {
	/** 显示验证码弹窗 */
	show(): void;
	/** 隐藏验证码弹窗 */
	hide(): void;
	/** 刷新验证码 */
	refresh(): void;
}
```

#### 3. 重构主验证码组件

```vue
<!-- apps/admin/src/components/ReVerify/src/Verify.vue -->
<template>
	<div :class="mode === 'pop' ? 'mask' : ''" v-show="showBox">
		<div :class="mode === 'pop' ? 'verifybox' : ''" :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }">
			<div class="verifybox-top" v-if="mode === 'pop'">
				请完成安全验证
				<span class="verifybox-close" @click="closeBox">
					<el-icon><Close /></el-icon>
				</span>
			</div>
			<div class="verifybox-bottom" :style="{ padding: mode === 'pop' ? '15px' : '0' }">
				<!-- 验证码容器 -->
				<component
					v-if="componentType"
					:is="componentType"
					:captcha-type="captchaType"
					:type="verifyType"
					:mode="mode"
					:v-space="vSpace"
					:explain="explain"
					:img-size="imgSize"
					:block-size="blockSize"
					:bar-size="barSize"
					ref="instanceRef"
					@success="handleSuccess"
					@error="handleError"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineExpose } from "vue";
import { Close } from "@element-plus/icons-vue";
import VerifySlide from "./VerifySlide.vue";
import VerifyPoints from "./VerifyPoints.vue";
import type { VerifyProps, VerifyEmits, VerifyResult, VerifyInstance } from "./types";

defineOptions({
	name: "ReVerify",
	components: {
		VerifySlide,
		VerifyPoints,
	},
});

const props = withDefaults(defineProps<VerifyProps>(), {
	mode: "pop",
	imgSize: () => ({
		width: "310px",
		height: "155px",
	}),
	blockSize: () => ({
		width: "50px",
		height: "50px",
	}),
	barSize: () => ({
		width: "310px",
		height: "40px",
	}),
	vSpace: 5,
	explain: "向右滑动完成验证",
});

const emit = defineEmits<VerifyEmits>();

const clickShow = ref(false);
const verifyType = ref<string>();
const componentType = ref<string>();
const instanceRef = ref();

const showBox = computed(() => {
	return props.mode === "pop" ? clickShow.value : true;
});

// 根据验证码类型设置组件
watch(
	() => props.captchaType,
	(newType) => {
		switch (newType) {
			case "blockPuzzle":
				verifyType.value = "2";
				componentType.value = "VerifySlide";
				break;
			case "clickWord":
				verifyType.value = "";
				componentType.value = "VerifyPoints";
				break;
		}
	},
	{ immediate: true },
);

const show = () => {
	if (props.mode === "pop") {
		clickShow.value = true;
	}
};

const hide = () => {
	clickShow.value = false;
	refresh();
};

const refresh = () => {
	if (instanceRef.value?.refresh) {
		instanceRef.value.refresh();
	}
};

const closeBox = () => {
	hide();
};

const handleSuccess = (result: VerifyResult) => {
	emit("success", result);
	if (props.mode === "pop") {
		hide();
	}
};

const handleError = (error: string) => {
	emit("error", error);
};

// 暴露实例方法
defineExpose<VerifyInstance>({
	show,
	hide,
	refresh,
});
</script>

<style scoped>
.mask {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2000;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, 0.3);
	transition: all 0.5s;
}

.verifybox {
	position: relative;
	box-sizing: border-box;
	border-radius: var(--el-border-radius-base);
	border: 1px solid var(--el-border-color);
	background-color: var(--el-bg-color);
	box-shadow: var(--el-box-shadow-dark);
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.verifybox-top {
	padding: 0 15px;
	height: 50px;
	line-height: 50px;
	text-align: left;
	font-size: 16px;
	color: var(--el-text-color-primary);
	border-bottom: 1px solid var(--el-border-color);
	box-sizing: border-box;
	position: relative;
}

.verifybox-bottom {
	padding: 15px;
	box-sizing: border-box;
}

.verifybox-close {
	position: absolute;
	top: 13px;
	right: 15px;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--el-text-color-regular);
	transition: color 0.3s;
}

.verifybox-close:hover {
	color: var(--el-color-primary);
}
</style>
```

### 第二步：API 接口适配

#### 1. 验证码 API 重构

```typescript
// apps/admin/src/components/ReVerify/api/index.ts

import { http } from "@/utils/http";
import { DataUpType } from "@/utils/http/types.d";

export interface CaptchaGetParams {
	captchaType: string;
	clientUid?: string;
	ts?: number;
}

export interface CaptchaGetResult {
	repCode: string;
	repData: {
		originalImageBase64: string;
		jigsawImageBase64?: string;
		wordImageBase64?: string;
		token: string;
		secretKey: string;
		clientUid: string;
	};
	repMsg: string;
	success: boolean;
}

export interface CaptchaVerifyParams {
	captchaType: string;
	pointJson: string;
	token: string;
	captchaVerification?: string;
}

export interface CaptchaVerifyResult {
	repCode: string;
	repData: {
		captchaVerification: string;
	};
	repMsg: string;
	success: boolean;
}

/** 获取验证码图片 */
export const getCaptcha = (data: CaptchaGetParams) => {
	return http.post<CaptchaGetResult>("/captcha/get", { data }, { upType: DataUpType.FORM });
};

/** 校验验证码 */
export const verifyCaptcha = (data: CaptchaVerifyParams) => {
	return http.post<CaptchaVerifyResult>("/captcha/check", { data }, { upType: DataUpType.FORM });
};
```

#### 2. 工具函数适配

```typescript
// apps/admin/src/components/ReVerify/utils/index.ts

import CryptoJS from "crypto-js";

/**
 * AES 加密
 */
export function aesEncrypt(word: string, keyStr: string): string {
	const key = CryptoJS.enc.Utf8.parse(keyStr);
	const srcs = CryptoJS.enc.Utf8.parse(word);
	const encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encrypted.toString();
}

/**
 * 重置组件尺寸
 */
export function resetSize(vm: any) {
	const imgSize = vm.imgSize;
	const barSize = vm.barSize;

	return {
		imgHeight: imgSize.height,
		imgWidth: imgSize.width,
		barHeight: barSize.height,
		barWidth: barSize.width,
	};
}

/**
 * 生成随机字符串
 */
export function generateUUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
```

### 第三步：集成到登录系统

#### 1. 修改登录页面

```vue
<!-- apps/admin/src/views/login/index.vue -->
<template>
	<div class="login-form">
		<el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules">
			<!-- 用户名 -->
			<el-form-item prop="username">
				<el-input v-model="ruleForm.username" :placeholder="t('common.login.pureUsername')" clearable />
			</el-form-item>

			<!-- 密码 -->
			<el-form-item prop="password">
				<el-input
					v-model="ruleForm.password"
					type="password"
					:placeholder="t('common.login.purePassword')"
					show-password
					clearable
				/>
			</el-form-item>

			<!-- 简单验证码（可选保留） -->
			<el-form-item prop="verifyCode" v-if="useSimpleVerify">
				<el-input v-model="ruleForm.verifyCode" :placeholder="t('common.login.pureVerifyCode')" clearable>
					<template #append>
						<ReImageVerify v-model:code="imgCode" />
					</template>
				</el-input>
			</el-form-item>

			<!-- 登录按钮 -->
			<el-form-item>
				<el-button class="w-full" size="default" type="primary" :loading="loading" @click="onLogin(ruleFormRef)">
					{{ t("common.login.pureLogin") }}
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 高级验证码组件 -->
		<ReVerify
			ref="verifyRef"
			:captcha-type="captchaType"
			mode="pop"
			:img-size="{ width: '400px', height: '200px' }"
			@success="handleVerifySuccess"
			@error="handleVerifyError"
		/>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { ReImageVerify } from "@/components/ReImageVerify";
import { ReVerify } from "@/components/ReVerify";
import type { VerifyResult } from "@/components/ReVerify/src/types";

const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const verifyRef = ref();
const imgCode = ref("");

// 验证码配置
const verifyConfig = {
	// 是否使用简单验证码（开发环境默认true，生产环境false）
	useSimple: import.meta.env.DEV,
	// 高级验证码类型
	advancedTypes: ["blockPuzzle", "clickWord"] as const,
};

const useSimpleVerify = computed(() => verifyConfig.useSimple);
const captchaType = ref<"blockPuzzle" | "clickWord">("blockPuzzle");

// 表单数据
const ruleForm = reactive({
	username: "",
	password: "",
	verifyCode: "",
});

// 表单验证规则
const loginRules = {
	username: [{ required: true, message: t("common.login.pureUsernameReg"), trigger: "blur" }],
	password: [{ required: true, message: t("common.login.purePasswordReg"), trigger: "blur" }],
	verifyCode: [
		{
			required: useSimpleVerify.value,
			message: t("common.login.pureVerifyCodeReg"),
			trigger: "blur",
		},
	],
};

const ruleFormRef = ref<FormInstance>();

// 登录逻辑
const onLogin = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;

	await formEl.validate((valid) => {
		if (valid) {
			loading.value = true;

			if (useSimpleVerify.value) {
				// 使用简单验证码直接登录
				performLogin();
			} else {
				// 显示高级验证码
				showAdvancedVerify();
			}
		}
	});
};

// 显示高级验证码
const showAdvancedVerify = () => {
	// 随机选择验证码类型
	const types = verifyConfig.advancedTypes;
	captchaType.value = types[Math.floor(Math.random() * types.length)];

	verifyRef.value?.show();
	loading.value = false;
};

// 高级验证码验证成功
const handleVerifySuccess = async (result: VerifyResult) => {
	try {
		loading.value = true;
		await performLogin(result.captchaVerification);
	} catch (error) {
		loading.value = false;
		ElMessage.error(t("common.login.pureLoginFail"));
	}
};

// 高级验证码验证失败
const handleVerifyError = (error: string) => {
	loading.value = false;
	ElMessage.error(error || "验证失败，请重试");
};

// 执行登录
const performLogin = async (captchaVerification?: string) => {
	try {
		const loginData = {
			username: ruleForm.username,
			password: ruleForm.password,
			verifyCode: useSimpleVerify.value ? ruleForm.verifyCode : undefined,
			captchaVerification: captchaVerification,
		};

		const res = await useUserStoreHook().loginByUsername(loginData);

		if (res.success) {
			ElMessage.success(t("common.login.pureLoginSuccess"));

			// 登录成功后的处理逻辑
			// 可以根据需要添加用户信息加载、菜单加载等

			router.push("/welcome");
		} else {
			throw new Error(res.message || "登录失败");
		}
	} catch (error: any) {
		ElMessage.error(error.message || t("common.login.pureLoginFail"));
	} finally {
		loading.value = false;
	}
};

// 初始化
onMounted(() => {
	// 可以在这里做一些初始化工作
});
</script>
```

#### 2. 更新用户 Store

```typescript
// apps/admin/src/store/modules/user.ts 中添加

export interface LoginParams {
	username: string;
	password: string;
	verifyCode?: string;
	captchaVerification?: string;
}

// 在 actions 中修改登录方法
async loginByUsername(data: LoginParams) {
	return new Promise<UserResult>((resolve, reject) => {
		loginApi(data)
			.then((data: any) => {
				if (data?.success) {
					setToken(data.data);
					resolve(data);
				} else {
					reject(data);
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}
```

#### 3. 更新 API 接口

```typescript
// apps/admin/src/api/user.ts 中修改

export interface LoginParams {
	username: string;
	password: string;
	verifyCode?: string;
	captchaVerification?: string;
}

export const loginApi = (data: LoginParams) => {
	// 根据验证码类型选择不同的上传方式
	const upType = data.captchaVerification ? DataUpType.FORM : DataUpType.JSON;

	return http.request<UserResult>("post", "/login", { data }, { upType });
};
```

### 第四步：样式主题适配

#### 1. 全局样式文件

```scss
// apps/admin/src/components/ReVerify/src/styles/index.scss

.re-verify {
	// 继承 Element Plus 主题变量
	.verify-tips {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 30px;
		line-height: 30px;
		color: #fff;
		text-align: center;
		font-size: 12px;
		transition: bottom 0.5s;
	}

	.suc-bg {
		background-color: var(--el-color-success);
	}

	.err-bg {
		background-color: var(--el-color-error);
	}

	// 滑块验证码样式
	.verify-bar-area {
		position: relative;
		background: var(--el-bg-color-page);
		text-align: center;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-border-radius-base);
		overflow: hidden;
	}

	.verify-left-bar {
		position: absolute;
		top: 0;
		left: 0;
		background: var(--el-color-primary-light-9);
		border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
		border: 1px solid var(--el-color-primary-light-7);
	}

	.verify-move-block {
		position: absolute;
		top: 0;
		left: 0;
		background: var(--el-color-primary);
		color: #fff;
		border-radius: var(--el-border-radius-base);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s;

		&:hover {
			background: var(--el-color-primary-light-3);
		}
	}

	.verify-img-panel {
		position: relative;
		border-radius: var(--el-border-radius-base);
		overflow: hidden;

		.verify-refresh {
			position: absolute;
			top: 10px;
			right: 10px;
			width: 32px;
			height: 32px;
			background: rgba(0, 0, 0, 0.5);
			color: #fff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: background-color 0.3s;

			&:hover {
				background: rgba(0, 0, 0, 0.7);
			}
		}
	}

	// 响应式样式
	@media (max-width: 768px) {
		.verifybox {
			width: 90% !important;
			max-width: 350px !important;
		}

		.verifybox-top {
			font-size: 14px;
			height: 45px;
			line-height: 45px;
		}
	}
}
```

#### 2. 组件样式引入

```typescript
// apps/admin/src/components/ReVerify/index.ts

import { App } from "vue";
import Verify from "./src/Verify.vue";
import "./src/styles/index.scss";

// 单独导出组件
export { default as ReVerify } from "./src/Verify.vue";
export { default as ReVerifySlide } from "./src/VerifySlide.vue";
export { default as ReVerifyPoints } from "./src/VerifyPoints.vue";

// 导出类型
export * from "./src/types";
export * from "./api";

// 插件安装方法
export default {
	install(app: App) {
		app.component("ReVerify", Verify);
	},
};
```

### 第五步：配置和环境变量

#### 1. 环境变量配置

```bash
# apps/admin/.env.development
# 验证码类型：simple(简单) | advanced(高级)
VITE_VERIFY_TYPE=simple

# apps/admin/.env.production
VITE_VERIFY_TYPE=advanced
```

#### 2. 全局配置文件

```typescript
// apps/admin/src/config/verify.ts

export interface VerifyConfig {
	type: "simple" | "advanced";
	advanced: {
		defaultType: "blockPuzzle" | "clickWord";
		randomType: boolean;
		apiEndpoint: {
			get: string;
			verify: string;
		};
		imgSize: {
			width: string;
			height: string;
		};
	};
	simple: {
		width: number;
		height: number;
		length: number;
	};
}

export const verifyConfig: VerifyConfig = {
	type: (import.meta.env.VITE_VERIFY_TYPE as "simple" | "advanced") || "advanced",

	advanced: {
		defaultType: "blockPuzzle",
		randomType: true,
		apiEndpoint: {
			get: "/captcha/get",
			verify: "/captcha/check",
		},
		imgSize: {
			width: "400px",
			height: "200px",
		},
	},

	simple: {
		width: 120,
		height: 40,
		length: 4,
	},
};

// 工具方法
export const getVerifyConfig = () => verifyConfig;
export const isAdvancedVerify = () => verifyConfig.type === "advanced";
export const isSimpleVerify = () => verifyConfig.type === "simple";
```

### 第六步：组件注册和使用

#### 1. 全局组件注册

```typescript
// apps/admin/src/main.ts

import { createApp } from "vue";
import App from "./App.vue";
import ReVerify from "@/components/ReVerify";

const app = createApp(App);

// 注册验证码组件
app.use(ReVerify);

app.mount("#app");
```

#### 2. 在其他页面中使用

```vue
<!-- 任意需要验证码的页面 -->
<template>
	<div>
		<el-button @click="showVerify('blockPuzzle')">显示滑块验证</el-button>
		<el-button @click="showVerify('clickWord')">显示点击验证</el-button>

		<ReVerify ref="verifyRef" :captcha-type="currentType" mode="pop" @success="handleSuccess" @error="handleError" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { VerifyResult } from "@/components/ReVerify/src/types";

const verifyRef = ref();
const currentType = ref<"blockPuzzle" | "clickWord">("blockPuzzle");

const showVerify = (type: "blockPuzzle" | "clickWord") => {
	currentType.value = type;
	verifyRef.value?.show();
};

const handleSuccess = (result: VerifyResult) => {
	console.log("验证成功:", result);
	// 处理验证成功逻辑
};

const handleError = (error: string) => {
	console.error("验证失败:", error);
	// 处理验证失败逻辑
};
</script>
```

### 第七步：测试和调试

#### 1. 单元测试

```typescript
// apps/admin/tests/components/ReVerify.test.ts

import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ReVerify from "@/components/ReVerify/src/Verify.vue";

describe("ReVerify", () => {
	it("应该正确渲染滑块验证码", () => {
		const wrapper = mount(ReVerify, {
			props: {
				captchaType: "blockPuzzle",
				mode: "fixed",
			},
		});

		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find(".verify-slide").exists()).toBe(true);
	});

	it("应该在点击时显示弹窗", async () => {
		const wrapper = mount(ReVerify, {
			props: {
				captchaType: "clickWord",
				mode: "pop",
			},
		});

		await wrapper.vm.show();
		expect(wrapper.find(".mask").isVisible()).toBe(true);
	});
});
```

#### 2. E2E 测试

```typescript
// apps/admin/tests/e2e/login.spec.ts

import { test, expect } from "@playwright/test";

test("登录页面验证码功能", async ({ page }) => {
	await page.goto("/login");

	// 填写用户名密码
	await page.fill('[placeholder="用户名"]', "admin");
	await page.fill('[placeholder="密码"]', "admin123");

	// 点击登录按钮
	await page.click('[type="submit"]');

	// 验证验证码弹窗是否出现
	await expect(page.locator(".verifybox")).toBeVisible();

	// 验证滑块验证码组件
	await expect(page.locator(".verify-bar-area")).toBeVisible();
});
```

### 第八步：文档和使用指南

#### 1. 组件文档

````markdown
<!-- apps/admin/src/components/ReVerify/README.md -->

# ReVerify 验证码组件

## 简介

ReVerify 是一个现代化的验证码组件，支持滑块验证和点击文字验证两种方式。

## 基本用法

```vue
<template>
	<ReVerify ref="verifyRef" captcha-type="blockPuzzle" mode="pop" @success="handleSuccess" @error="handleError" />
</template>

<script setup>
import { ref } from "vue";

const verifyRef = ref();

const handleSuccess = (result) => {
	console.log("验证成功:", result);
};

const handleError = (error) => {
	console.error("验证失败:", error);
};

// 显示验证码
const showVerify = () => {
	verifyRef.value.show();
};
</script>
```
````

## API

### Props

| 参数         | 说明       | 类型   | 可选值                | 默认值                            |
| ------------ | ---------- | ------ | --------------------- | --------------------------------- |
| captcha-type | 验证码类型 | string | blockPuzzle/clickWord | blockPuzzle                       |
| mode         | 显示模式   | string | pop/fixed             | pop                               |
| img-size     | 图片尺寸   | object | -                     | {width: '310px', height: '155px'} |
| bar-size     | 操作条尺寸 | object | -                     | {width: '310px', height: '40px'}  |

### Events

| 事件名  | 说明     | 回调参数               |
| ------- | -------- | ---------------------- |
| success | 验证成功 | (result: VerifyResult) |
| error   | 验证失败 | (error: string)        |

### Methods

| 方法名  | 说明       | 参数 |
| ------- | ---------- | ---- |
| show    | 显示验证码 | -    |
| hide    | 隐藏验证码 | -    |
| refresh | 刷新验证码 | -    |

```plain

通过以上详细的实施指南，你可以将旧项目的完整验证码组件成功迁移到新项目中，并确保与现有功能的良好集成。整个迁移过程采用渐进式方法，既保持了向后兼容性，又提供了现代化的技术架构和更好的用户体验。
```
