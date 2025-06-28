# 简单版本的验证码组件

ReImageVerifySimple 是一个简单易用的验证码组件，支持点击刷新验证码功能。

## 功能特性

- ✅ 自动获取验证码
- 🔄 点击刷新验证码
- ⏳ Element Plus v-loading 加载动效
- 🚫 防重复点击
- 💡 Hover 交互效果
- 🎨 现代化 UI 设计
- 📱 响应式布局
- 🔧 空状态友好提示

## 基础用法

```vue
<template>
	<div>
		<ReImageVerifySimple @captcha-loaded="handleCaptchaLoaded" />
	</div>
</template>

<script setup lang="ts">
import { ReImageVerifySimple, type CaptchaResult } from "@/components/ReImageVerifySimple";

const handleCaptchaLoaded = (data: CaptchaResult) => {
	console.log("验证码数据:", data);
	// data.captchaImage: 验证码图片 base64
	// data.uuid: 验证码唯一标识
};
</script>
```

## 尺寸配置

### 自适应容器（推荐）

```vue
<template>
	<!-- 组件默认占据100%容器大小，适合放在输入框append区域 -->
	<ReImageVerifySimple @captcha-loaded="handleCaptchaLoaded" />
</template>
```

### 自定义固定尺寸

```vue
<template>
	<ReImageVerifySimple width="150px" height="50px" @captcha-loaded="handleCaptchaLoaded" />
</template>
```

### 在容器中使用

```vue
<template>
	<div style="width: 200px; height: 60px;">
		<ReImageVerifySimple @captcha-loaded="handleCaptchaLoaded" />
	</div>
</template>
```

## 手动控制加载

```vue
<template>
	<div>
		<ReImageVerifySimple
			ref="captchaRef"
			:auto-load="false"
			@captcha-loaded="handleCaptchaLoaded"
			@captcha-error="handleCaptchaError"
		/>
		<button @click="refreshCaptcha">手动刷新</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ReImageVerifySimple, type CaptchaResult } from "@/components/ReImageVerifySimple";

const captchaRef = ref();

const refreshCaptcha = () => {
	captchaRef.value?.refresh();
};

const handleCaptchaLoaded = (data: CaptchaResult) => {
	console.log("验证码加载成功:", data);
};

const handleCaptchaError = (error: any) => {
	console.error("验证码加载失败:", error);
};
</script>
```

## API

### Props

| 参数     | 说明               | 类型               | 默认值   |
| -------- | ------------------ | ------------------ | -------- |
| width    | 验证码图片宽度     | `string \| number` | `'100%'` |
| height   | 验证码图片高度     | `string \| number` | `'100%'` |
| autoLoad | 是否自动加载验证码 | `boolean`          | `true`   |

### Events

| 事件名         | 说明                 | 回调参数                        |
| -------------- | -------------------- | ------------------------------- |
| captcha-loaded | 验证码加载成功时触发 | `(data: CaptchaResult) => void` |
| captcha-error  | 验证码加载失败时触发 | `(error: any) => void`          |

### Methods

通过 `ref` 可以调用以下方法：

| 方法名  | 说明           | 参数 |
| ------- | -------------- | ---- |
| refresh | 手动刷新验证码 | -    |

### Expose

组件暴露以下响应式数据（只读）：

| 属性名      | 说明           | 类型                                   |
| ----------- | -------------- | -------------------------------------- |
| captchaData | 当前验证码数据 | `Readonly<Ref<CaptchaResult \| null>>` |
| isLoading   | 是否正在加载   | `Readonly<Ref<boolean>>`               |

## 类型定义

```typescript
interface CaptchaResult {
	/** 验证码图片 base64 */
	captchaImage: string;
	/** 验证码唯一标识 */
	uuid: string;
}
```

## 注意事项

1. **自适应设计**：组件默认占据 100%容器大小，适合放在输入框附加区域
2. **图片处理**：组件会自动处理 base64 图片格式转换
3. **加载动效**：使用 Element Plus 的 v-loading 指令实现加载动效
4. **防重复请求**：加载期间会禁用点击，防止重复请求
5. **错误重试**：支持错误重试，点击错误提示可重新加载
6. **空状态提示**：空状态下显示友好的提示信息
7. **最小尺寸**：组件设置了最小尺寸 80px × 32px，确保内容可见
8. **使用场景**：建议在登录表单中使用，配合表单验证
