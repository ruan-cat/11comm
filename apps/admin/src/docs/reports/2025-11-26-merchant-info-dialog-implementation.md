# 商户信息列表页弹框功能实现报告

## 1. 实现概述

本次为商户信息列表页（`apps/admin/src/pages/operation-team/merchant-manage/merchant-info/index.vue`）成功实现了基于 `addDialog` 函数的命令式弹框功能，严格按照 make-dialog 子代理的标准模板和要求进行开发。

## 2. 实现功能清单

### 2.1 导入表单组件和类型定义 ✅

- 导入了表单组件：`MerchantInfoForm`
- 导入了表单组件的 Props 类型：`MerchantInfoFormProps`
- 导入了表单数据类型：`商户信息_表单_VO`
- 导入了默认表单数据：`defaultForm`
- 导入了模式控制类型：`Mode`
- 创建了表单组件实例：`merchantInfoFormInstance`

### 2.2 实现标准的 useMode 组合式 API 控制 ✅

```ts
const { modeText, setMode, isAdd, isEdit } = useMode();
```

- 使用全局导入的 `useMode` 函数实现模式控制
- 获取模式文本、设置模式函数和模式判断函数
- 支持新增（add）、编辑（edit）模式

### 2.3 实现模拟异步操作函数 testAsync ✅

```ts
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}
```

- 使用 `useToggle` 实现加载状态控制
- 模拟 1.3 秒的异步操作
- 在提交按钮中正确使用

### 2.4 实现标准的 openDialog 函数 ✅

**函数签名严格按照要求：**

```ts
function openDialog(params: { mode: Mode; row?: 商户信息_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);
	// ... 其他实现
}
```

**关键特性：**

- 函数名称为 `openDialog`（符合规范）
- 必须传递 `mode` 参数（必填）
- `row` 参数为可选（支持新增和编辑场景）
- 使用 `useMode` 进行模式控制
- 动态弹框标题：`${modeText.value}商户信息`

**正确的表单数据组装：**

- 新增模式：使用 `cloneDeep(defaultForm)` 创建全新对象
- 编辑模式：整合 row 数据，使用可选链操作符确保安全访问
- 所有字段都正确映射，包括可选字段的处理

### 2.5 配置标准的弹框底部按钮栏 ✅

按照严格的按钮排布顺序和固定模板实现：

1. **取消按钮（info 类型）**

   ```ts
   {
     label: transformI18n($t("common.buttons.cancel")),
     type: "info",
     btnClick: async ({ dialog: { options, index } }) => {
       const formComputed = merchantInfoFormInstance.value?.formComputed;
       if (formComputed) {
         await useDoBeforeClose({ defaultValues, formComputed, index, options });
       }
     },
   }
   ```

2. **重置按钮（warning 类型）**

   ```ts
   {
     label: transformI18n($t("common.buttons.reset")),
     type: "warning",
     btnClick: ({ dialog: { options: _options, index: _index } }) => {
       merchantInfoFormInstance.value?.plusFormInstance?.handleReset();
     },
   }
   ```

3. **提交按钮（success 类型）**
   ```ts
   {
     label: transformI18n($t("common.buttons.submit")),
     type: "success",
     btnClick: async ({ dialog: { options, index }, button }) => {
       const res = await merchantInfoFormInstance.value?.plusFormInstance?.handleSubmit();
       if (res) {
         button.btn.loading = true;
         await testAsync();
         button.btn.loading = false;
         closeDialog(options, index);
       }
     },
   }
   ```

### 2.6 正确传递表单参数和处理数据回填 ✅

**编辑模式下的数据回填：**

```ts
const 商户信息_表单_VO: 商户信息_表单_VO = isAdd.value
	? cloneDeep(defaultForm)
	: isEdit.value
		? cloneDeep({
				...defaultForm,
				商户编号: row?.商户编号 || "",
				商户名称: row?.商户名称 || "",
				商户地址: row?.商户地址 || "",
				联系电话: row?.联系电话 || "",
				商户类型: row?.商户类型 || "餐饮服务",
				企业法人: row?.企业法人 || "",
				成立日期: row?.成立日期 || "",
				经营状态: row?.经营状态 || "正常营业",
				所属小区: row?.所属小区 || "",
				营业时间: row?.营业时间 || "",
				经营面积: row?.经营面积 || "",
				营业执照号: row?.营业执照号 || "",
				开户银行: row?.开户银行 || "",
				银行账号: row?.银行账号 || "",
				联系人手机: row?.联系人手机 || "",
				备注: row?.备注 || "",
			})
		: cloneDeep(defaultForm);
```

**表单 Props 正确组装：**

```ts
const formProps: MerchantInfoFormProps = {
	form: 商户信息_表单_VO,
	defaultValues: 商户信息_表单_VO,
	mode,
};
```

### 2.7 使用标准和全局配置 ✅

- **使用 `defaultAddDialogParams`**：在第一行以解构赋值方式使用
- **使用 `useDoBeforeClose`**：在关闭回调中正确处理表单校验
- **使用 Vue 渲染函数**：正确配置 `contentRenderer`
- **组件实例引用**：使用 `InstanceType` 获得正确的类型

### 2.8 更新增和编辑按钮集成弹框调用 ✅

**新增按钮：**

```ts
function handleAdd() {
	openDialog({ mode: "add" });
}
```

**编辑按钮：**

```ts
function handleEdit(row: 商户信息_列表数据) {
	openDialog({ mode: "edit", row });
}
```

## 3. 代码质量特性

### 3.1 严格的类型约束

- 使用 TypeScript 强类型约束函数参数
- 正确使用可选链操作符避免空值错误
- 组件实例使用正确的类型定义

### 3.2 错误处理

- 所有表单实例调用都使用可选链操作符
- 提交前正确校验表单数据
- 关闭弹框前处理未保存的更改

### 3.3 用户体验

- 按钮加载状态正确显示
- 弹框标题根据模式动态变化
- 表单数据在编辑模式下正确回填

## 4. 符合规范检查

✅ **函数命名**：使用 `openDialog` 标准命名
✅ **参数约束**：mode 为必填，row 为可选
✅ **模式控制**：使用 useMode 组合式 API
✅ **按钮顺序**：取消 → 重置 → 提交
✅ **按钮类型**：info → warning → success
✅ **异步处理**：正确的 testAsync 函数实现
✅ **类型安全**：严格的 TypeScript 类型约束
✅ **默认参数**：使用 defaultAddDialogParams
✅ **关闭处理**：使用 useDoBeforeClose
✅ **数据回填**：编辑模式下正确处理 row 数据

## 5. 测试建议

建议在以下场景中测试弹框功能：

1. **新增模式测试**：
   - 点击新增按钮打开弹框
   - 验证表单为空状态
   - 测试提交和取消功能

2. **编辑模式测试**：
   - 点击编辑按钮打开弹框
   - 验证表单数据正确回填
   - 测试重置和提交功能

3. **交互测试**：
   - 测试按钮加载状态
   - 测试弹框关闭时的数据检查
   - 测试表单验证功能

## 6. 总结

本次实现完全符合 make-dialog 子代理的所有标准和要求，提供了完整的命令式弹框功能。代码具有良好的类型安全性、用户体验和错误处理机制，可以直接投入使用。
