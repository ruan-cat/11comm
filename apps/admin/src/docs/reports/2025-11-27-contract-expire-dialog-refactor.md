# 合同到期管理弹框功能重构报告

**日期**：2025-11-27
**文件**：`apps/admin/src/pages/property-manage/contract-manage/expire/index.vue`
**描述**：按照 make-dialog 子代理要求改造弹框功能

## 修改内容

### 1. 导入语句优化

- 添加了 `useMode` 和 `Mode` 类型的正确导入
- 确保所有必要的组合式 API 函数都已正确导入

### 2. contentRenderer 修复

- **问题**：原代码传递了错误的参数 `form: defaultForm, defaultValues: defaultForm`
- **修复**：改为使用扩展运算符传递正确的 `formProps` 对象
- **代码变更**：

  ```typescript
  // 修复前
  h(ContractExpireForm, {
  	ref: contractExpireFormInstance,
  	form: defaultForm,
  	defaultValues: defaultForm,
  });

  // 修复后
  h(ContractExpireForm, {
  	ref: contractExpireFormInstance,
  	...formProps,
  });
  ```

### 3. 按钮配置规范化

- **取消按钮**：确保类型为 `info`，使用正确的 `useDoBeforeClose` 回调
- **重置按钮**：确保类型为 `warning`，直接调用表单实例的 `handleReset` 方法
- **提交按钮**：确保类型为 `success`，包含加载状态和测试异步函数

### 4. doBeforeClose 函数优化

- 移除了不必要的可选链操作符
- 确保直接调用 `formComputed` 属性
- 统一了错误处理逻辑

### 5. 模式控制完善

- 添加了 `Mode` 类型的正确导入和使用
- 确保模式判断逻辑正确
- 优化了参数接口定义

### 6. 函数签名标准化

- `openDialog` 函数名称符合要求
- 参数传递使用对象形式 `{ mode: Mode, row?: 到期合同_列表数据 }`
- `mode` 参数为必填项，`row` 参数为可选项

## 符合规范的要点

### ✅ 弹框函数名称

- 二次封装函数名称为 `openDialog`，符合要求

### ✅ 模式控制

- 使用 `useMode` 组合式 API 实现模式控制
- 正确传递 `mode` 参数
- 动态标题根据模式变化

### ✅ 弹框组件实例

- 正确创建和使用弹框组件实例
- 使用 `InstanceType` 获得实例类型

### ✅ 测试异步函数

- 包含固定的测试异步函数 `testAsync`
- 在提交按钮中正确使用

### ✅ formProps 组装

- 根据不同模式正确组装 `form` 和 `defaultValues`
- 使用深克隆避免引用问题
- 正确处理业务对象和 row 数据的映射

### ✅ 按钮配置

- 严格按照规范配置三个按钮：取消、重置、提交
- 按钮类型正确：info、warning、success
- 回调函数逻辑正确

### ✅ 关闭回调

- 正确实现 `doBeforeClose` 函数
- 使用 `useDoBeforeClose` 全局函数

## 验证结果

1. **类型检查**：无相关类型错误
2. **开发服务器**：成功启动，无语法错误
3. **功能逻辑**：弹框调用、模式切换、表单重置等功能逻辑正确

## 总结

本次重构严格按照 make-dialog 子代理的要求进行，确保了弹框功能的标准化和规范化。主要解决了参数传递错误、按钮配置不规范、模式控制不完善等问题，提高了代码的可维护性和一致性。
