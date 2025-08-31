# 报表组件管理模块

## 📋 模块概述

报表组件管理模块是 J3 系统管理中的核心模块，负责管理报表组件及其相关条件的增删改查操作。该模块提供了完整的报表组件生命周期管理功能。

## 🔧 功能接口

### 报表组件管理

#### 1. 获取报表组件列表(条件+分页)

- **接口名称**: `queryReportComponentList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-component/query`
- **功能描述**: 支持按组件 id、组件类型、组件名称进行条件查询，并返回分页数据

#### 2. 添加报表组件

- **接口名称**: `addReportComponent`
- **请求方式**: POST
- **接口路径**: `/j3-report/report-component/add`
- **功能描述**: 新增报表组件，返回组件 ID

#### 3. 修改报表组件

- **接口名称**: `modifyReportComponent`
- **请求方式**: PUT
- **接口路径**: `/j3-report/report-component/modify`
- **功能描述**: 更新已有报表组件的信息

#### 4. 删除报表组件

- **接口名称**: `deleteReportComponent`
- **请求方式**: DELETE
- **接口路径**: `/j3-report/report-component/delete`
- **功能描述**: 根据组件 ID 删除报表组件

### 组件条件管理

#### 5. 获取条件列表（条件+分页）

- **接口名称**: `queryComponentConditionList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-component/condition/query`
- **功能描述**: 根据组件 ID 获取条件列表，列表为空返回查询失败（null)

#### 6. 添加条件

- **接口名称**: `addComponentCondition`
- **请求方式**: POST
- **接口路径**: `/j3-report/report-component/condition/add`
- **功能描述**: 新增报表组件条件，返回条件 ID

#### 7. 修改条件

- **接口名称**: `modifyComponentCondition`
- **请求方式**: PUT
- **接口路径**: `/j3-report/report-component/condition/modify`
- **功能描述**: 修改报表组件条件，返回条件 ID

#### 8. 删除条件

- **接口名称**: `deleteComponentCondition`
- **请求方式**: DELETE
- **接口路径**: `/j3-report/report-component/condition/remove/{id}`
- **功能描述**: 根据条件 ID 删除条件

## 📊 数据类型

### 报表组件相关类型

- **ReportComponentQueryParams**: 报表组件查询参数
- **RCCVO**: 报表组件信息
- **AddReportComponentParams**: 添加报表组件参数
- **ModifyReportComponentParams**: 修改报表组件参数
- **DeleteReportComponentParams**: 删除报表组件参数

### 组件条件相关类型

- **ComponentConditionQueryParams**: 条件查询参数
- **ComponentConditionVO**: 报表自定义组件条件信息
- **AddComponentConditionParams**: 添加条件参数
- **ModifyComponentConditionParams**: 修改条件参数

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 8 个接口的功能测试：

1. 获取报表组件列表
2. 条件查询报表组件列表
3. 添加报表组件
4. 获取条件列表
5. 删除条件
6. 删除报表组件
7. 修改报表组件
8. 添加条件
9. 修改条件

## 📝 使用示例

```typescript
import {
	queryReportComponentList,
	addReportComponent,
	modifyComponentCondition,
} from "@/api/j3/report/report-component";

// 查询报表组件列表
const { execute: queryList } = queryReportComponentList({
	onSuccess(data) {
		console.log("组件列表", data);
	},
});

// 添加报表组件
const { execute: addComponent } = addReportComponent({
	onSuccess(data) {
		console.log("添加成功", data);
	},
});

// 修改条件
const { execute: modifyCondition } = modifyComponentCondition({
	onSuccess(data) {
		console.log("修改成功", data);
	},
});
```

## 🔄 代码规范应用

本模块已完全按照项目代码生成规范进行重构：

✅ **导入规范**: 使用 `@/composables/use-request` 路径别名  
✅ **代码分隔**: 添加明显的类型定义和接口函数分隔注释  
✅ **结构优化**: 先定义全部类型，再定义全部函数  
✅ **参数标准**: 统一使用 `UseAxiosOptionsJsonVO<T>` 参数格式  
✅ **测试规范**: 按照标准测试格式重构，使用 `j3/模块名` 命名规范  
✅ **接口完整**: 补充了缺失的"添加报表组件"和"修改条件"接口

## 📈 模块完成状态

**报表组件模块**: 8/8 (100%) ✅ **已完成**

所有接口都已实现并通过测试，代码符合项目规范标准。
