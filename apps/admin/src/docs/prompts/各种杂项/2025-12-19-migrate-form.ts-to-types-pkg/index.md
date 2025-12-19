<!-- TODO: 一次性提示词 长期任务 未完成 -->

# 2025-12-19 将全部后台项目的 form.ts 文件做迁移重构

你的任务是帮我新建一个 openspec 任务。该任务的核心目的是，将后台项目全部的 form.ts 代码按照要求做调整。

## 确定任务范围

1. 根据 `apps\admin\src\router\rank\rank-route-keys.ts` 提供的 `RANK_ROUTE_KEYS` 数组，根据数组提供的 `三级路由` ，确定在后台项目内全部 form.ts 文件的存储目录。也根据此目录来确定`类型项目`内对应的业务类型要存放在哪里。
2. 阅读 `RANK_ROUTE_KEYS` 数组暴露出来的 `三级路由` ，根据三级路由的路径，明确清楚在 `apps\admin\src\pages` 目录应该检索那些文件并修改，避免出现检索范围过大的情况。

## 迁移重构要求 1： 移动业务类型到对应业务目录的`类型项目`内

1. 将 form.ts 内的涉及到的业务类型，按照目录结构，迁移到相同业务目录内的`类型项目`内。
2. 如果遇到中文命名的业务类型和字段名。请统一换成英文名。
3. 迁移业务类型时，必须保留 jsdoc 注释说明。
4. 迁移业务类型到`类型项目`后，在 form.ts 内导入刚刚迁移到`类型项目`内的业务类型。确保不会出现严重的类型报错。

## 迁移重构要求 2： 迁移下拉选项到`类型项目`内

1. 此部分的要求和 openspec\changes\migrate-static-data-to-nitro-query\specs\common-business-options\spec.md 文件所述一样。
2. 请你直接将 openspec\changes\migrate-static-data-to-nitro-query\specs\common-business-options\spec.md 文件的规范，也同步迁移一份到当前 openspec 任务规范内。

## 迁移重构要求 3： 弹框组件的组件 props 类型，无条件的增加非必填的 mode 模式字段

以下是错误的写法，没有提供 mode 字段：

```ts
/**
 * 取消费用表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CancelFeeFormProps {
	/** 表单数据 */
	form: CancelFeeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CancelFeeFormVO;
}
```

以下是正确的写法：

1. `mode` 字段是非必填项。
2. `mode` 字段的类型约束 `Mode` ，是一个全局类型，不需要你手动导入。

```ts
/**
 * 取消费用表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CancelFeeFormProps {
	/** 表单数据 */
	form: CancelFeeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CancelFeeFormVO;
	/** 表单模式 */
	mode?: Mode;
}
```
