# 报表组管理模块

## 📋 模块概述

报表组管理模块是 J3 系统管理中报表配置的重要组成部分，负责管理报表组的基本信息，提供报表组的增删改查功能。报表组用于组织和分类不同类型的报表。

## 🔧 功能接口

### 1. 获取报表组列表（条件+分页）

- **接口名称**: `queryReportGroupList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-group/query-all`
- **功能描述**: 支持按组ID、组名称、组url进行条件查询，并返回分页数据

### 2. 获取报表组名称列表

- **接口名称**: `queryReportGroupNameList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-group/query-report-component-name`
- **功能描述**: 获取所有报表组的基本信息列表

### 3. 添加报表组

- **接口名称**: `addReportGroup`
- **请求方式**: POST
- **接口路径**: `/j3-report/report-group/add-group`
- **功能描述**: 创建新的报表组

### 4. 修改报表组

- **接口名称**: `modifyReportGroup`
- **请求方式**: PUT
- **接口路径**: `/j3-report/report-group/modify-group`
- **功能描述**: 更新已有报表组的信息

### 5. 删除报表组

- **接口名称**: `deleteReportGroup`
- **请求方式**: DELETE
- **接口路径**: `/j3-report/report-group/remove-group`
- **功能描述**: 根据组ID删除指定的报表组

## 📊 数据类型

### 核心数据类型

- **ReportGroupInfo**: 报表组信息模型，包含组ID、组名称、描述、组url等
- **ReportGroupQueryParams**: 报表组查询参数，支持分页和多条件筛选
- **AddReportGroupParams**: 添加报表组参数
- **ModifyReportGroupParams**: 修改报表组参数，包含完整的组信息
- **DeleteReportGroupParams**: 删除报表组参数

### 字段说明

- **groupId**: 组ID（唯一标识）
- **name**: 组名称
- **remark**: 描述信息
- **url**: 组url地址
- **pageIndex**: 查询页码
- **pageSize**: 查询条数

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 5 个接口的功能测试：

1. 获取报表组列表（条件+分页）
2. 条件查询报表组列表
3. 获取报表组名称列表
4. 添加报表组
5. 修改报表组
6. 删除报表组

## 📝 使用示例

```typescript
import {
	queryReportGroupList,
	queryReportGroupNameList,
	addReportGroup,
	modifyReportGroup,
	deleteReportGroup,
} from "@/api/j3/report/report-group";

// 查询报表组列表
const { execute: queryList } = queryReportGroupList({
	onSuccess(data) {
		console.log("报表组列表", data);
	},
});

// 添加报表组
const { execute: addGroup } = addReportGroup({
	onSuccess(data) {
		console.log("添加成功", data);
	},
});

// 修改报表组
const { execute: modifyGroup } = modifyReportGroup({
	onSuccess(data) {
		console.log("修改成功", data);
	},
});

// 删除报表组
const { execute: deleteGroup } = deleteReportGroup({
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
✅ **上传类型**: 正确使用 `upType: UpType.json` 标识请求类型  

## 📈 模块完成状态

**报表组管理模块**: 5/5 (100%) ✅ **已完成**

所有接口都已实现并通过测试，代码符合项目规范标准。 