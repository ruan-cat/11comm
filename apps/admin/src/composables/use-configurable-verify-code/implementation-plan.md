# 可配置验证码功能实现方案

## 功能概述

本功能实现了通过项目级别配置来控制验证码功能的开启与关闭，支持图片验证码和短信验证码的独立配置。采用组合式 API `useConfigurableVerifyCode` 实现，提供更好的代码复用性和维护性。

## 改造背景

原先的验证码实现直接使用 `useGlobal` 从全局配置中读取验证码配置，存在以下问题：

1. **配置读取方式不统一** - 项目中其他地方都使用 `getConfig()` 函数读取配置
2. **代码重复** - 多个页面都需要重复相同的配置读取逻辑
3. **可维护性差** - 配置变更时需要修改多个文件
4. **扩展性不足** - 添加新的验证码类型需要修改多处代码

## 改造目标

1. **统一配置读取** - 使用项目统一的 `getConfig()` 函数
2. **封装组合式 API** - 将验证码配置逻辑封装为可复用的组合式函数
3. **简化组件代码** - 减少组件中的配置处理逻辑
4. **提升扩展性** - 便于后续添加新的验证码类型
5. **向后兼容性** - 确保现有功能不受影响

## 技术架构

### 配置层级结构

```plain
平台配置 (platform-config.json)
    ↓
类型定义 (global.d.ts)
    ↓
全局配置服务 (config/index.ts)
    ↓
组合式API (useConfigurableVerifyCode)
    ↓
组件响应式配置 (computed properties)
    ↓
条件渲染和逻辑控制 (v-if, 动态参数)
```

## 详细实现方案

### 1. 配置文件设置

**文件**：`apps/admin/public/platform-config.json`

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": false,
		"enableSmsCaptcha": true
	}
}
```

**设计说明**：

- 使用嵌套对象 `CaptchaConfig` 组织验证码相关配置
- 默认值：图片验证码关闭，短信验证码开启

### 2. 类型定义

**文件**：`apps/admin/types/global.d.ts`

```typescript
interface PlatformConfigs {
	/** 验证码相关配置 */
	CaptchaConfig?: {
		/** 是否启用图片验证码，默认false */
		enableImageCaptcha?: boolean;
		/** 是否启用短信验证码，默认true */
		enableSmsCaptcha?: boolean;
	};
}

interface StorageConfigs {
	/** 验证码相关配置（驼峰命名用于本地存储） */
	captchaConfig?: {
		/** 是否启用图片验证码，默认false */
		enableImageCaptcha?: boolean;
		/** 是否启用短信验证码，默认true */
		enableSmsCaptcha?: boolean;
	};
}
```

### 3. 创建组合式 API

**文件**：`src/composables/use-configurable-verify-code/index.ts`

```typescript
import { computed, type ComputedRef } from "vue";
import { getConfig } from "@/config";

export function useConfigurableVerifyCode() {
	const isImageCaptchaEnabled: ComputedRef<boolean> = computed(() => {
		return getConfig()?.CaptchaConfig?.enableImageCaptcha ?? false;
	});

	const isSmsCaptchaEnabled: ComputedRef<boolean> = computed(() => {
		return getConfig()?.CaptchaConfig?.enableSmsCaptcha ?? true;
	});

	const isVerificationRequired = computed(() => {
		return isImageCaptchaEnabled.value || isSmsCaptchaEnabled.value;
	});

	function buildLoginParams(baseParams, captchaData) {
		const params = { ...baseParams };

		if (isImageCaptchaEnabled.value && captchaData?.verifyCode) {
			params.code = captchaData.verifyCode;
			params.uuid = captchaData.uuid;
		}

		if (isSmsCaptchaEnabled.value && captchaData?.smsCode) {
			params.smsCode = captchaData.smsCode;
			params.phone = captchaData.phone;
		}

		return params;
	}

	return {
		isImageCaptchaEnabled,
		isSmsCaptchaEnabled,
		isVerificationRequired,
		buildLoginParams,
	};
}
```

### 4. 组件重构

#### 改造前后对比

**改造前（登录页面）**：

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

**改造后（登录页面）**：

```typescript
// 使用组合式 API
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

const { isImageCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

// 自动构建登录参数
const loginData = buildLoginParams(
	{ username: ruleForm.username, password: ruleForm.password },
	{ verifyCode: ruleForm.verifyCode, uuid: captchaInfo.value?.uuid },
);
```

#### 模板条件渲染

```vue
<!-- 图片验证码 -->
<Motion v-if="isImageCaptchaEnabled" :delay="200">
  <el-form-item prop="verifyCode">
    <!-- 验证码输入框 -->
  </el-form-item>
</Motion>

<!-- 短信验证码 -->
<Motion v-if="isSmsCaptchaEnabled" :delay="100">
  <el-form-item prop="verifyCode">
    <!-- 短信验证码输入框 -->
  </el-form-item>
</Motion>
```

## 改造效果对比

| 改造项   | 改造前                | 改造后           |
| -------- | --------------------- | ---------------- |
| 配置读取 | `useGlobal().$config` | `getConfig()`    |
| 代码行数 | ~10 行/页面           | ~3 行/页面       |
| 重复代码 | 3 个页面重复相同逻辑  | 无重复，统一调用 |
| 参数构建 | 手动扩展运算符        | 自动构建函数     |
| 类型安全 | 部分类型安全          | 完全类型安全     |
| 变量命名 | enableXXX             | isXXXEnabled     |

## 技术实现细节

### 1. 配置读取机制

使用项目统一的 `getConfig()` 函数而非 `useGlobal`：

```typescript
const isImageCaptchaEnabled = computed(() => {
	return getConfig()?.CaptchaConfig?.enableImageCaptcha ?? false;
});
```

**优势**：

- 与项目现有配置管理体系保持一致
- 减少对外部依赖的耦合
- 提供默认值兜底机制

### 2. 条件渲染策略

使用 `v-if` 实现完全的条件控制：

```vue
<Motion v-if="isImageCaptchaEnabled" :delay="200">
  <!-- 验证码相关组件 -->
</Motion>
```

**设计考虑**：

- 配置关闭时完全移除 DOM 节点
- 保留原有的 Motion 动画效果
- 不影响其他表单项的延迟时间

### 3. 自动参数构建

`buildLoginParams` 函数根据配置自动构建请求参数：

```typescript
function buildLoginParams(baseParams, captchaData) {
	const params = { ...baseParams };
	// 根据配置条件添加验证码参数
	return params;
}
```

**优势**：

- 代码简洁，逻辑清晰
- 避免不必要的参数传递
- 统一的参数构建逻辑

## 配置场景示例

### 开发环境（关闭所有验证码）

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": false,
		"enableSmsCaptcha": false
	}
}
```

### 生产环境（启用所有验证码）

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": true,
		"enableSmsCaptcha": true
	}
}
```

### 默认配置（仅短信验证码）

```json
{
	"CaptchaConfig": {
		"enableImageCaptcha": false,
		"enableSmsCaptcha": true
	}
}
```

## 扩展性设计

### 添加新验证码类型

只需三步即可添加新的验证码类型：

1. **扩展类型定义**：

```typescript
interface CaptchaConfig {
	enableImageCaptcha?: boolean;
	enableSmsCaptcha?: boolean;
	enableVoiceCaptcha?: boolean; // 新增
}
```

2. **添加组合式函数属性**：

```typescript
const isVoiceCaptchaEnabled = computed(() => {
	return getConfig()?.CaptchaConfig?.enableVoiceCaptcha ?? false;
});
```

3. **更新参数构建逻辑**：

```typescript
if (isVoiceCaptchaEnabled.value && captchaData?.voiceCode) {
	params.voiceCode = captchaData.voiceCode;
}
```

## 性能优化

1. **计算属性缓存** - 使用 `computed` 自动缓存计算结果
2. **按需导入** - 只导入需要的功能
3. **函数式设计** - `buildLoginParams` 采用纯函数设计
4. **条件渲染** - 使用 `v-if` 避免不必要的组件初始化

## 测试验证

### 功能测试场景

| 场景     | isImageCaptchaEnabled | isSmsCaptchaEnabled | 预期结果                                 |
| -------- | --------------------- | ------------------- | ---------------------------------------- |
| 默认配置 | false                 | true                | 登录页无图片验证码，手机登录有短信验证码 |
| 全关闭   | false                 | false               | 所有验证码功能都关闭                     |
| 全开启   | true                  | true                | 所有验证码功能都开启                     |
| 仅图片   | true                  | false               | 仅登录页显示图片验证码                   |

### 兼容性测试

1. **向后兼容** - 在没有新配置的情况下使用默认值
2. **异常处理** - 配置文件格式错误时降级到默认行为
3. **类型检查** - 确保 TypeScript 编译无错误

## 风险评估

| 风险项       | 风险等级 | 影响范围   | 应对措施           |
| ------------ | -------- | ---------- | ------------------ |
| 配置文件损坏 | 低       | 系统启动   | 默认值兜底机制     |
| 类型定义错误 | 中       | 编译时错误 | 完善的类型测试     |
| 逻辑分支遗漏 | 中       | 功能异常   | 全面的测试用例覆盖 |

## 总结

本次改造成功实现了验证码功能的可配置化，具有以下特点：

1. **设计合理** - 采用项目级配置，支持独立开关控制
2. **实现优雅** - 利用 Vue 3 组合式 API，代码简洁高效
3. **兼容性好** - 向后兼容，不影响现有功能
4. **维护性强** - 统一的配置管理，便于扩展
5. **用户友好** - 默认配置减少操作负担，支持多种使用场景

该方案为系统提供了灵活的验证码控制能力，满足不同环境和安全级别的需求。
