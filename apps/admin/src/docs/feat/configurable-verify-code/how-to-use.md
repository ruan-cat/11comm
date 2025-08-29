# 可配置验证码功能使用指南

## 功能概述

本功能实现了通过项目级别配置来控制验证码功能的开启与关闭，支持图片验证码和短信验证码的独立配置。默认情况下不需要图片验证码，短信验证码功能默认开启。

> **优化说明**：本功能已优化为使用组合式 API `useConfigurableVerifyCode` 实现，提供更好的代码复用性和维护性。

## 配置说明

### 配置文件位置

配置文件位于：`apps/admin/public/platform-config.json`

### 配置项说明

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": false, // 是否启用图片验证码，默认false
		"enableSmsCaptcha": true // 是否启用短信验证码，默认true
	}
}
```

### 配置项详细说明

| 配置项               | 类型    | 默认值 | 说明                                             |
| -------------------- | ------- | ------ | ------------------------------------------------ |
| `enableImageCaptcha` | boolean | false  | 控制登录页面是否显示图片验证码输入框和验证逻辑   |
| `enableSmsCaptcha`   | boolean | true   | 控制手机登录和忘记密码页面是否显示短信验证码功能 |

## 功能影响范围

### 图片验证码配置 (`enableImageCaptcha`)

**影响页面：**

- 登录页面 (`src/views/login/index.vue`)

**功能控制：**

- 当设置为 `false` 时：
  - 隐藏验证码输入框
  - 跳过验证码验证逻辑
  - 登录接口不发送验证码相关参数

- 当设置为 `true` 时：
  - 显示验证码输入框和刷新按钮
  - 强制验证验证码输入
  - 登录接口发送验证码和 UUID 参数

### 短信验证码配置 (`enableSmsCaptcha`)

**影响页面：**

- 手机登录页面 (`src/views/login/components/LoginPhone.vue`)
- 忘记密码页面 (`src/views/login/components/LoginUpdate.vue`)

**功能控制：**

- 当设置为 `false` 时：
  - 隐藏短信验证码输入框和获取按钮
  - 相关页面可以不填写验证码直接提交

- 当设置为 `true` 时：
  - 显示短信验证码输入框和获取按钮
  - 启用短信验证码获取和验证功能

## 使用示例

### 场景一：完全关闭验证码功能

适用于开发环境或内网环境，不需要任何验证码验证。

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": false,
		"enableSmsCaptcha": false
	}
}
```

### 场景二：仅使用图片验证码

适用于不需要短信功能的环境。

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": true,
		"enableSmsCaptcha": false
	}
}
```

### 场景三：仅使用短信验证码

适用于移动端优先或需要手机验证的环境。

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": false,
		"enableSmsCaptcha": true
	}
}
```

### 场景四：启用所有验证码功能

适用于高安全性要求的生产环境。

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": true,
		"enableSmsCaptcha": true
	}
}
```

## 注意事项

1. **配置生效时间**：修改配置后需要重新加载页面才能生效。

2. **默认值处理**：如果配置文件中没有 `CaptchaConfig` 配置项，系统将使用默认值：
   - `enableImageCaptcha`: false
   - `enableSmsCaptcha`: true

3. **后端接口适配**：
   - 图片验证码关闭时，登录接口不会发送 `code` 和 `uuid` 参数
   - 短信验证码关闭时，相关页面的提交逻辑需要后端接口配合处理

4. **用户体验**：建议根据实际业务需求配置验证码功能，避免给用户带来不必要的操作负担。

5. **安全考虑**：在生产环境中建议至少启用一种验证码功能以提高安全性。

## 开发者指南

### 使用组合式 API

在组件中使用验证码配置：

```typescript
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

export default {
	setup() {
		const { enableImageCaptcha, enableSmsCaptcha, buildLoginParams } = useConfigurableVerifyCode();

		return {
			enableImageCaptcha,
			enableSmsCaptcha,
			buildLoginParams,
		};
	},
};
```

### 自动构建登录参数

```typescript
// 旧方式 - 手动构建参数
const loginData = {
	username: form.username,
	password: form.password,
	...(enableImageCaptcha.value && {
		verifyCode: form.verifyCode,
		uuid: captchaInfo.value?.uuid,
	}),
};

// 新方式 - 自动构建参数
const loginData = buildLoginParams(
	{ username: form.username, password: form.password },
	{ verifyCode: form.verifyCode, uuid: captchaInfo.value?.uuid },
);
```

## 技术实现细节

本功能通过以下方式实现：

1. **配置读取**：使用项目统一的 `getConfig()` 函数获取配置
2. **组合式 API**：封装为 `useConfigurableVerifyCode` 组合式函数
3. **响应式控制**：使用 Vue 3 的 `computed` 创建响应式配置值
4. **条件渲染**：使用 `v-if` 指令控制组件的显示与隐藏
5. **自动构建参数**：提供 `buildLoginParams` 函数自动构建登录参数

更多技术细节请参考：

- [组合式 API 技术文档](/src/composables/use-configurable-verify-code/index.md)
- [改造方案文档](/src/composables/use-configurable-verify-code/README.md)
