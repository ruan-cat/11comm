# useConfigurableVerifyCode 改造方案

## 改造背景

原先的验证码实现直接使用 `useGlobal` 从全局配置中读取验证码配置，这种方式存在以下问题：

1. **配置读取方式不统一** - 项目中其他地方都使用 `getConfig()` 函数读取配置
2. **代码重复** - 多个页面都需要重复相同的配置读取逻辑
3. **可维护性差** - 配置变更时需要修改多个文件
4. **扩展性不足** - 添加新的验证码类型需要修改多处代码

## 改造目标

1. **统一配置读取** - 使用项目统一的 `getConfig()` 函数
2. **封装组合式 API** - 将验证码配置逻辑封装为可复用的组合式函数
3. **简化组件代码** - 减少组件中的配置处理逻辑
4. **提升扩展性** - 便于后续添加新的验证码类型

## 技术选型

### 组合式 API vs Options API

选择组合式 API 的理由：

- 更好的逻辑复用性
- 更清晰的类型推导
- 更好的 Tree-shaking 支持
- 符合 Vue 3 最佳实践

### getConfig vs useGlobal

选择 `getConfig()` 的理由：

- 与项目现有配置管理体系保持一致
- 减少对 `@pureadmin/utils` 的依赖
- 更轻量的实现方式
- 更好的性能表现

## 实现方案

### 1. 创建组合式 API

在 `src/composables/use-configurable-verify-code/index.ts` 创建组合式函数：

```typescript
import { computed, type ComputedRef } from "vue";
import { getConfig } from "@/config";

export function useConfigurableVerifyCode() {
	// 响应式配置
	const enableImageCaptcha: ComputedRef<boolean> = computed(() => {
		return getConfig()?.CaptchaConfig?.enableImageCaptcha ?? false;
	});

	const enableSmsCaptcha: ComputedRef<boolean> = computed(() => {
		return getConfig()?.CaptchaConfig?.enableSmsCaptcha ?? true;
	});

	// 工具函数
	function buildLoginParams(baseParams, captchaData) {
		// 根据配置自动构建参数
	}

	return {
		enableImageCaptcha,
		enableSmsCaptcha,
		buildLoginParams,
	};
}
```

### 2. 重构组件代码

#### 改造前（登录页面）

```typescript
// 直接使用 useGlobal
import { useGlobal } from "@pureadmin/utils";

const { $config } = useGlobal<GlobalPropertiesApi>();
const enableImageCaptcha = computed(() => $config?.CaptchaConfig?.enableImageCaptcha ?? false);

// 手动构建登录参数
const loginData = {
	username: ruleForm.username,
	password: ruleForm.password,
	...(enableImageCaptcha.value && {
		verifyCode: ruleForm.verifyCode,
		uuid: captchaInfo.value?.uuid,
	}),
};
```

#### 改造后（登录页面）

```typescript
// 使用组合式 API
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

const { enableImageCaptcha, buildLoginParams } = useConfigurableVerifyCode();

// 自动构建登录参数
const loginData = buildLoginParams(
	{
		username: ruleForm.username,
		password: ruleForm.password,
	},
	{
		verifyCode: ruleForm.verifyCode,
		uuid: captchaInfo.value?.uuid,
	},
);
```

### 3. 改造效果对比

| 改造项   | 改造前                | 改造后           |
| -------- | --------------------- | ---------------- |
| 配置读取 | `useGlobal().$config` | `getConfig()`    |
| 代码行数 | ~10 行/页面           | ~3 行/页面       |
| 重复代码 | 3 个页面重复相同逻辑  | 无重复，统一调用 |
| 参数构建 | 手动扩展运算符        | 自动构建函数     |
| 类型安全 | 部分类型安全          | 完全类型安全     |

## 优化亮点

### 1. 配置读取优化

```typescript
// 改造前：依赖外部全局状态
const { $config } = useGlobal<GlobalPropertiesApi>();
const enableImageCaptcha = computed(() => $config?.CaptchaConfig?.enableImageCaptcha ?? false);

// 改造后：直接读取配置
const enableImageCaptcha = computed(() => {
	return getConfig()?.CaptchaConfig?.enableImageCaptcha ?? false;
});
```

### 2. 参数构建优化

```typescript
// 改造前：手动条件判断
const loginParams: any = {
	username: ruleForm.username,
	password: ruleForm.password,
};

if (enableImageCaptcha.value) {
	loginParams.code = ruleForm.verifyCode;
	loginParams.uuid = captchaInfo.value?.uuid;
}

// 改造后：自动构建
const loginParams = buildLoginParams(
	{ username: ruleForm.username, password: ruleForm.password },
	{ verifyCode: ruleForm.verifyCode, uuid: captchaInfo.value?.uuid },
);
```

### 3. 组件代码简化

```typescript
// 改造前：每个组件都需要配置相关代码
import { useGlobal } from "@pureadmin/utils";
import { computed } from "vue";

const { $config } = useGlobal<GlobalPropertiesApi>();
const enableSmsCaptcha = computed(() => $config?.CaptchaConfig?.enableSmsCaptcha ?? true);

// 改造后：一行搞定
const { enableSmsCaptcha } = useConfigurableVerifyCode();
```

## 性能优化

### 1. 计算属性缓存

使用 `computed` 创建响应式配置，自动缓存计算结果：

```typescript
const enableImageCaptcha = computed(() => {
	return getConfig()?.CaptchaConfig?.enableImageCaptcha ?? false;
});
```

### 2. 按需导入

组合式 API 支持按需导入，只使用需要的功能：

```typescript
// 只导入需要的功能
const { enableImageCaptcha } = useConfigurableVerifyCode();
```

### 3. 函数式设计

`buildLoginParams` 采用纯函数设计，无副作用，便于优化：

```typescript
function buildLoginParams(baseParams, captchaData) {
	const params = { ...baseParams }; // 浅拷贝，性能最优

	// 条件添加参数，避免不必要的属性
	if (enableImageCaptcha.value && captchaData?.verifyCode) {
		params.code = captchaData.verifyCode;
		params.uuid = captchaData.uuid;
	}

	return params;
}
```

## 扩展性设计

### 1. 新增验证码类型

添加新的验证码类型只需三步：

```typescript
// 1. 在配置接口中添加
interface CaptchaConfig {
	enableImageCaptcha?: boolean;
	enableSmsCaptcha?: boolean;
	enableVoiceCaptcha?: boolean; // 新增语音验证码
}

// 2. 在组合式函数中添加计算属性
const enableVoiceCaptcha = computed(() => {
	return getConfig()?.CaptchaConfig?.enableVoiceCaptcha ?? false;
});

// 3. 在参数构建函数中添加处理逻辑
if (enableVoiceCaptcha.value && captchaData?.voiceCode) {
	params.voiceCode = captchaData.voiceCode;
}
```

### 2. 配置项扩展

支持更复杂的配置结构：

```typescript
const captchaConfig = computed(() => {
	return (
		getConfig()?.CaptchaConfig ?? {
			enableImageCaptcha: false,
			enableSmsCaptcha: true,
			imageConfig: {
				timeout: 300,
				refreshInterval: 60,
			},
			smsConfig: {
				timeout: 300,
				resendInterval: 60,
			},
		}
	);
});
```

## 测试策略

### 1. 单元测试

```typescript
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";
import { getConfig } from "@/config";

jest.mock("@/config");

describe("useConfigurableVerifyCode", () => {
	it("should return correct default values", () => {
		(getConfig as jest.Mock).mockReturnValue({});

		const { enableImageCaptcha, enableSmsCaptcha } = useConfigurableVerifyCode();

		expect(enableImageCaptcha.value).toBe(false);
		expect(enableSmsCaptcha.value).toBe(true);
	});
});
```

### 2. 集成测试

```typescript
describe("Login with configurable captcha", () => {
	it("should build correct params when image captcha enabled", () => {
		// Mock config
		mockConfig({ CaptchaConfig: { enableImageCaptcha: true } });

		const { buildLoginParams } = useConfigurableVerifyCode();
		const params = buildLoginParams({ username: "test", password: "123" }, { verifyCode: "1234", uuid: "abc" });

		expect(params).toEqual({
			username: "test",
			password: "123",
			code: "1234",
			uuid: "abc",
		});
	});
});
```

## 文档完善

### 1. API 文档

详细的 TypeScript 类型定义和使用示例。

### 2. 使用指南

面向开发者的使用指南，包含最佳实践。

### 3. 迁移指南

从旧版本迁移到新版本的步骤说明。

## 总结

通过这次改造，我们实现了：

1. **代码质量提升** - 更加统一和规范的配置读取方式
2. **可维护性提升** - 集中管理验证码相关逻辑
3. **开发效率提升** - 减少重复代码，简化组件开发
4. **扩展性提升** - 便于后续功能扩展和维护

改造后的代码更加符合 Vue 3 的最佳实践，同时保持了与项目现有架构的一致性。
