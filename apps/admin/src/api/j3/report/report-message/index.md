# 报表信息管理模块

## 📋 模块概述

报表信息管理模块是 J3 系统管理中报表配置的核心组成部分，负责管理报表信息的完整生命周期以及报表与组件的关联关系。该模块提供了报表信息的增删改查功能，以及报表组件关联的管理功能。

## 🔧 功能接口

### 报表信息管理

#### 1. 分页查询报表信息

- **接口名称**: `queryReportMessageList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-message/query-all`
- **功能描述**: 支持按报表编号、组编号、选项标题进行条件查询，并返回分页数据

#### 2. 新增报表信息

- **接口名称**: `addReportMessage`
- **请求方式**: POST
- **接口路径**: `/j3-report/report-message/add-report-message`
- **功能描述**: 创建新的报表信息记录

#### 3. 修改报表信息

- **接口名称**: `modifyReportMessage`
- **请求方式**: PUT
- **接口路径**: `/j3-report/report-message/modify-report-message`
- **功能描述**: 更新已有报表信息记录

#### 4. 删除报表信息

- **接口名称**: `deleteReportMessage`
- **请求方式**: DELETE
- **接口路径**: `/j3-report/report-message/delete-report-message`
- **功能描述**: 根据报表编号删除报表信息

### 报表组件关系管理

#### 5. 分页获取关联组件列表

- **接口名称**: `queryComponentRelList`
- **请求方式**: GET
- **接口路径**: `/j3-report/report-message/component-rel/pageList`
- **功能描述**: 支持按报表编号、组件关系编号进行条件查询，并返回分页数据

#### 6. 关联组件

- **接口名称**: `addComponentRel`
- **请求方式**: POST
- **接口路径**: `/j3-report/report-message/save-component-rel`
- **功能描述**: 添加报表组件关系

#### 7. 删除关联组件

- **接口名称**: `deleteComponentRel`
- **请求方式**: DELETE
- **接口路径**: `/j3-report/report-message/delete-component-rel`
- **功能描述**: 根据组件 ID、报表编号和组件关系编号删除关联组件

## 📊 数据类型

### 报表信息相关类型

- **ReportMessageInfo**: 报表信息模型，包含报表编号、标题、描述、排序序号等
- **ReportMessageQueryParams**: 报表信息查询参数，支持分页和多条件筛选
- **AddReportMessageParams**: 新增报表信息参数
- **ModifyReportMessageParams**: 修改报表信息参数，包含完整的报表信息
- **DeleteReportMessageParams**: 删除报表信息参数

### 组件关系相关类型

- **ComponentRelInfo**: 报表组件关系信息，包含组件 ID、名称、类型、关系编号等详细信息
- **ComponentRelQueryParams**: 报表组件关系查询参数，支持分页和条件筛选
- **AddComponentRelParams**: 添加报表组件关系参数
- **DeleteComponentRelParams**: 删除报表组件关系参数

### 字段说明

#### 报表信息字段

- **customId**: 报表编号（唯一标识）
- **title**: 选项标题
- **groupId**: 报表组 ID
- **groupName**: 组编号对应的组名称
- **remark**: 描述信息
- **seq**: 排序序号

#### 组件关系字段

- **componentId**: 组件 ID
- **componentName**: 组件名称
- **componentType**: 组件类型
- **componentGroup**: 组件组
- **relId**: 组件关系编号
- **queryModel**: 查询模型
- **statusCd**: 状态
- **createTime**: 创建时间

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 7 个接口的功能测试：

### 报表信息管理测试

1. 分页查询报表信息
2. 条件查询报表信息列表
3. 新增报表信息
4. 修改报表信息
5. 删除报表信息

### 组件关系管理测试

6. 分页获取关联组件列表
7. 条件查询关联组件列表
8. 关联组件
9. 删除关联组件

## 📝 使用示例

```typescript
import {
	queryReportMessageList,
	addReportMessage,
	modifyReportMessage,
	deleteReportMessage,
	queryComponentRelList,
	addComponentRel,
	deleteComponentRel,
} from "@/api/j3/report/report-message";

// 查询报表信息列表
const { execute: queryMessages } = queryReportMessageList({
	onSuccess(data) {
		console.log("报表信息列表", data);
	},
});

// 新增报表信息
const { execute: addMessage } = addReportMessage({
	onSuccess(data) {
		console.log("新增成功", data);
	},
});

// 查询关联组件列表
const { execute: queryRels } = queryComponentRelList({
	onSuccess(data) {
		console.log("关联组件列表", data);
	},
});

// 关联组件
const { execute: addRel } = addComponentRel({
	onSuccess(data) {
		console.log("关联成功", data);
	},
});
```

## 🔄 代码规范应用

本模块已完全按照项目代码生成规范进行修复和规范化：

✅ **导入规范**: 使用 `@/composables/use-request` 路径别名  
✅ **代码分隔**: 添加明显的类型定义和接口函数分隔注释  
✅ **结构优化**: 先定义全部类型，再定义全部函数  
✅ **参数标准**: 统一使用 `UseAxiosOptionsJsonVO<T>` 参数格式  
✅ **参数位置**: 统一将 options 参数放在 useRequest 配置的最后  
✅ **测试规范**: 按照标准测试格式重构，使用 `j3/模块名` 命名规范  
✅ **上传类型**: 正确使用 `upType: UpType.json` 标识请求类型  
✅ **参数传递**: 修复了关键故障，GET/DELETE 接口正确使用 `params`，POST/PUT 接口使用 `data`

## 🚨 修复的关键故障

### 1. 参数传递方式错误（关键故障）

- **问题**: query 接口错误使用了 `data` 而不是 `params`
- **影响**: 导致 API 调用失败，参数无法正确传递到后端
- **修复**:
  - `queryReportMessageList`: `data` → `params`
  - `queryComponentRelList`: `data` → `params`
  - `deleteReportMessage`: `data` → `params`

### 2. 导入路径错误

- **问题**: 使用了错误的相对路径导入
- **影响**: 可能导致模块解析失败
- **修复**: 统一使用标准路径别名

### 3. 代码结构问题

- **问题**: 缺少分隔注释，代码结构混乱
- **影响**: 降低代码可读性和维护性
- **修复**: 添加标准分隔注释，重新组织代码结构

## 📈 模块完成状态

**报表信息管理模块**: 7/7 (100%) ✅ **已完成**

所有接口都已实现、测试并通过故障修复，代码完全符合项目规范标准。模块现在可以安全、正确地在项目中使用。
