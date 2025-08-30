# 可配置的验证码

基于 Vue 3 Composition API 的验证码配置管理组合式函数。

## 概述

`useConfigurableVerifyCode` 是一个专门用于管理验证码配置的组合式 API，它提供了统一的方式来访问和处理验证码相关的配置信息。

## 基本用法

::: details 基本使用示例

<<< ./tests/basic-usage-example.ts

:::

## API 参考

### 返回值

#### isImageCaptchaEnabled

- **类型**: `ComputedRef<boolean>`
- **默认值**: `false`
- **描述**: 是否启用图片验证码
- **用途**: 用于控制登录页面图片验证码的显示和验证逻辑

::: details 模板使用示例

<<< ./tests/template-usage-example.vue

:::

#### isSmsCaptchaEnabled

- **类型**: `ComputedRef<boolean>`
- **默认值**: `true`
- **描述**: 是否启用短信验证码
- **用途**: 用于控制手机登录和忘记密码页面的短信验证码功能

::: details 短信验证码模板示例

<<< ./tests/sms-template-example.vue

:::

#### isSystemCaptchaEnabled

- **类型**: `ComputedRef<boolean>`
- **默认值**: `true`
- **描述**: 是否启用系统自带的前端验证码
- **用途**: 用于控制是否使用框架自带的 ReImageVerify 验证码组件

::: details 系统验证码组件示例

<<< ./tests/system-captcha-example.vue

:::

#### captchaConfig

- **类型**: `ComputedRef<CaptchaConfig>`
- **描述**: 完整的验证码配置对象
- **用途**: 获取完整的验证码配置信息

```typescript
interface CaptchaConfig {
	isImageCaptchaEnabled?: boolean;
	isSmsCaptchaEnabled?: boolean;
	isSystemCaptchaEnabled?: boolean;
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
::: details 构建登录参数示例

<<< ./tests/build-login-params-example.ts

:::
```

## 实际应用示例

### 登录页面集成

::: details 登录页面集成示例

<<< ./tests/login-page-example.vue

:::

### 手机登录页面集成

::: details 手机登录页面集成示例

<<< ./tests/phone-login-example.vue

:::

## 配置依赖

该组合式函数依赖于项目配置文件中的 `CaptchaConfig` 配置：

```json
{
	"CaptchaConfig": {
		"isImageCaptchaEnabled": false,
		"isSmsCaptchaEnabled": true,
		"isSystemCaptchaEnabled": true
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
