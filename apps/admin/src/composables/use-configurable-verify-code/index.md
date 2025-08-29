# useConfigurableVerifyCode

基于 Vue 3 Composition API 的验证码配置管理组合式函数。

## 概述

`useConfigurableVerifyCode` 是一个专门用于管理验证码配置的组合式 API，它提供了统一的方式来访问和处理验证码相关的配置信息。

## 基本用法

```typescript
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

export default {
	setup() {
		const { isImageCaptchaEnabled, isSmsCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

		return {
			isImageCaptchaEnabled,
			isSmsCaptchaEnabled,
			buildLoginParams,
		};
	},
};
```

## API 参考

### 返回值

#### isImageCaptchaEnabled

- **类型**: `ComputedRef<boolean>`
- **默认值**: `false`
- **描述**: 是否启用图片验证码
- **用途**: 用于控制登录页面图片验证码的显示和验证逻辑

```vue
<el-form-item v-if="isImageCaptchaEnabled" prop="verifyCode">
  <!-- 验证码输入框 -->
</el-form-item>
```

#### isSmsCaptchaEnabled

- **类型**: `ComputedRef<boolean>`
- **默认值**: `true`
- **描述**: 是否启用短信验证码
- **用途**: 用于控制手机登录和忘记密码页面的短信验证码功能

```vue
<el-form-item v-if="isSmsCaptchaEnabled" prop="smsCode">
  <!-- 短信验证码输入框 -->
</el-form-item>
```

#### captchaConfig

- **类型**: `ComputedRef<CaptchaConfig>`
- **描述**: 完整的验证码配置对象
- **用途**: 获取完整的验证码配置信息

```typescript
interface CaptchaConfig {
	isImageCaptchaEnabled?: boolean;
	isSmsCaptchaEnabled?: boolean;
}
```

#### isVerificationRequired

- **类型**: `ComputedRef<boolean>`
- **描述**: 是否需要任何类型的验证码
- **用途**: 判断当前是否启用了任何验证码功能

```typescript
if (isVerificationRequired.value) {
	// 需要验证码的提交逻辑
} else {
	// 不需要验证码的快速提交
}
```

#### buildLoginParams

- **类型**: `(baseParams: BaseParams, captchaData?: CaptchaData) => LoginParams`
- **描述**: 根据配置构建登录参数
- **用途**: 自动根据验证码配置构建完整的登录参数对象

```typescript
// 参数类型定义
interface BaseParams {
	username: string;
	password: string;
}

interface CaptchaData {
	verifyCode?: string; // 图片验证码
	uuid?: string; // 验证码UUID
	smsCode?: string; // 短信验证码
	phone?: string; // 手机号
}

// 使用示例
const loginParams = buildLoginParams(
	{
		username: "admin",
		password: "123456",
	},
	{
		verifyCode: "1234",
		uuid: "abc-123-def",
		smsCode: "567890",
		phone: "13800138000",
	},
);
```

## 实际应用示例

### 登录页面集成

```vue
<template>
	<el-form ref="loginForm" :model="form">
		<!-- 用户名 -->
		<el-form-item prop="username">
			<el-input v-model="form.username" placeholder="用户名" />
		</el-form-item>

		<!-- 密码 -->
		<el-form-item prop="password">
			<el-input v-model="form.password" type="password" placeholder="密码" />
		</el-form-item>

		<!-- 图片验证码 - 根据配置显示 -->
		<el-form-item v-if="isImageCaptchaEnabled" prop="verifyCode">
			<el-input v-model="form.verifyCode" placeholder="验证码">
				<template #append>
					<CaptchaImage @loaded="handleCaptchaLoaded" />
				</template>
			</el-input>
		</el-form-item>

		<el-button @click="handleLogin" :loading="loading"> 登录 </el-button>
	</el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

const { isImageCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

const form = reactive({
	username: "",
	password: "",
	verifyCode: "",
});

const captchaInfo = ref(null);
const loading = ref(false);

const handleCaptchaLoaded = (data) => {
	captchaInfo.value = data;
};

const handleLogin = async () => {
	// 根据配置自动构建登录参数
	const loginParams = buildLoginParams(
		{
			username: form.username,
			password: form.password,
		},
		{
			verifyCode: form.verifyCode,
			uuid: captchaInfo.value?.uuid,
		},
	);

	loading.value = true;
	try {
		await loginApi(loginParams);
		// 登录成功处理
	} catch (error) {
		// 错误处理
	} finally {
		loading.value = false;
	}
};
</script>
```

### 手机登录页面集成

```vue
<template>
	<el-form ref="phoneForm" :model="phoneForm">
		<!-- 手机号 -->
		<el-form-item prop="phone">
			<el-input v-model="phoneForm.phone" placeholder="手机号" />
		</el-form-item>

		<!-- 短信验证码 - 根据配置显示 -->
		<el-form-item v-if="isSmsCaptchaEnabled" prop="smsCode">
			<el-input v-model="phoneForm.smsCode" placeholder="短信验证码">
				<template #append>
					<el-button @click="sendSmsCode">获取验证码</el-button>
				</template>
			</el-input>
		</el-form-item>

		<el-button @click="handlePhoneLogin">手机登录</el-button>
	</el-form>
</template>

<script setup>
import { reactive } from "vue";
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

const { isSmsCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

const phoneForm = reactive({
	phone: "",
	smsCode: "",
});

const handlePhoneLogin = async () => {
	const loginParams = buildLoginParams(
		{
			username: phoneForm.phone, // 使用手机号作为用户名
			password: "", // 手机登录可能不需要密码
		},
		{
			smsCode: phoneForm.smsCode,
			phone: phoneForm.phone,
		},
	);

	await phoneLoginApi(loginParams);
};
</script>
```

## 配置依赖

该组合式函数依赖于项目配置文件中的 `CaptchaConfig` 配置：

```json
{
	"CaptchaConfig": {
		"isImageCaptchaEnabled": false,
		"isSmsCaptchaEnabled": true
	}
}
```

配置读取通过 `getConfig()` 函数实现，确保与项目的配置管理体系保持一致。

## 响应式特性

所有返回值都是响应式的，当配置发生变化时（如热更新），组件会自动重新渲染：

```typescript
// 配置变化时自动更新
watch(isImageCaptchaEnabled, (newValue) => {
	console.log("图片验证码配置变更为:", newValue);
});

watch(
	captchaConfig,
	(newConfig) => {
		console.log("验证码配置更新:", newConfig);
	},
	{ deep: true },
);
```

## 错误处理

该组合式函数具有完善的错误处理机制：

1. **配置缺失**: 当配置文件中没有相关配置时，自动使用默认值
2. **配置错误**: 当配置值类型不正确时，自动类型转换或使用默认值
3. **参数验证**: `buildLoginParams` 函数会验证必要参数，自动过滤无效参数

## 性能优化

- 使用 `computed` 创建响应式配置，自动缓存计算结果
- 配置读取仅在必要时进行，避免不必要的计算
- 参数构建函数采用浅拷贝，性能开销最小

## 扩展说明

如需添加新的验证码类型，只需：

1. 在配置接口中添加新的配置项
2. 在组合式函数中添加对应的 computed 属性
3. 在 `buildLoginParams` 函数中添加相应的参数处理逻辑

```typescript
// 示例：添加语音验证码支持
const isVoiceCaptchaEnabled = computed(() => {
	return getConfig()?.CaptchaConfig?.isVoiceCaptchaEnabled ?? false;
});
```
