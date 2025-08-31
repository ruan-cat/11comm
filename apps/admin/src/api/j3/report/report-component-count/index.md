# 报表组件底层统计管理模块

## 📋 模块概述

报表组件底层统计管理模块是 J3 系统管理中报表配置的重要组成部分，负责管理报表组件的底层统计信息，提供统计数据的增删改查功能。

## 🔧 功能接口

### 1. 查询报表组件底层统计列表

- **接口名称**: `queryComponentCountList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-component-count/query-count`
- **功能描述**: 支持按组件 ID 进行条件查询，并返回分页数据

### 2. 添加报表组件底层统计

- **接口名称**: `addComponentCount`
- **请求方式**: POST
- **接口路径**: `/j3-report/report-component-count/add-count`
- **功能描述**: 新增报表组件底层统计信息

### 3. 修改报表组件底层统计

- **接口名称**: `modifyComponentCount`
- **请求方式**: PUT
- **接口路径**: `/j3-report/report-component-count/modify-count`
- **功能描述**: 更新已有报表组件底层统计信息

### 4. 删除报表组件底层统计

- **接口名称**: `removeComponentCount`
- **请求方式**: DELETE
- **接口路径**: `/j3-report/report-component-count/remove-count`
- **功能描述**: 删除指定的报表组件底层统计信息

## 📊 数据类型

### 核心数据类型

- **ReportComponentCountInfo**: 报表统计信息，包含组件编号、统计编号、名称、查询方式等
- **QueryComponentCountParams**: 查询报表统计参数，支持分页和组件 ID 筛选
- **AddComponentCountParams**: 添加报表统计参数
- **ModifyComponentCountParams**: 修改报表统计参数，包含完整的统计信息
- **RemoveComponentCountParams**: 删除报表统计参数

### 字段说明

- **componentId**: 当前底层统计所属的组件编号
- **footerId**: 底层统计编号（唯一标识）
- **name**: 统计名称
- **queryModel**: 查询方式
- **footerDescription**: 统计描述信息（可选）

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 4 个接口的功能测试：

1. 查询报表组件底层统计列表
2. 添加报表组件底层统计
3. 修改报表组件底层统计
4. 删除报表组件底层统计

## 📝 使用示例

```typescript
import {
	queryComponentCountList,
	addComponentCount,
	modifyComponentCount,
	removeComponentCount,
} from "@/api/j3/report/report-component-count";

// 查询统计列表
const { execute: queryList } = queryComponentCountList({
	onSuccess(data) {
		console.log("统计列表", data);
	},
});

// 添加统计
const { execute: addCount } = addComponentCount({
	onSuccess(data) {
		console.log("添加成功", data);
	},
});

// 修改统计
const { execute: modifyCount } = modifyComponentCount({
	onSuccess(data) {
		console.log("修改成功", data);
	},
});

// 删除统计
const { execute: removeCount } = removeComponentCount({
	onSuccess(data) {
		console.log("删除成功", data);
	},
});
```

## 🔄 代码规范应用

本模块已完全按照项目代码生成规范进行规范化：

✅ **导入规范**: 使用 `@/composables/use-request` 路径别名  
✅ **代码分隔**: 添加明显的类型定义和接口函数分隔注释  
✅ **结构优化**: 先定义全部类型，再定义全部函数  
✅ **参数标准**: 统一使用 `UseAxiosOptionsJsonVO<T>` 参数格式  
✅ **参数位置**: 统一将 options 参数放在 useRequest 配置的最后  
✅ **测试规范**: 按照标准测试格式，使用 `j3/模块名` 命名规范

## 📈 模块完成状态

**报表组件底层统计模块**: 4/4 (100%) ✅ **已完成**

所有接口都已实现并通过测试，代码符合项目规范标准。
