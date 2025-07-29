# 系统管理模块

## 📋 模块概述

系统管理模块是 J3 系统管理的核心模块，负责管理系统配置、小区配置、用户密码、注册协议等系统级功能。该模块提供了完整的系统管理和配置功能，涵盖小区配置、初始化小区、修改密码、注册协议和系统配置等多个子模块。

## 🔧 功能接口

### 小区配置管理

#### 1. 提交配置项修改

- **接口名称**: `modifyCommunitySetting`
- **请求方式**: PUT
- **接口路径**: `/j3-system/community-setting/modify-communitysetting`
- **功能描述**: 修改小区相关设置项配置

#### 2. 获取配置项数据

- **接口名称**: `queryCommunitySettingList`
- **请求方式**: GET
- **接口路径**: `/j3-system/community-setting/query-communitysetting`
- **功能描述**: 根据小区 ID 和设置类型获取配置项数据

#### 3. 获取配置项列表

- **接口名称**: `queryCommunitySettingKeyList`
- **请求方式**: GET
- **接口路径**: `/j3-system/community-setting/query-communitysettingkey`
- **功能描述**: 获取配置项列表

### 初始化小区管理

#### 4. 获取小区列表（分页+条件）

- **接口名称**: `queryCommunitiesList`
- **请求方式**: GET
- **接口路径**: `/j3-system/init-community/query-coummunities`
- **功能描述**: 获取小区列表，支持分页和条件查询

#### 5. 格式化数据

- **接口名称**: `removeData`
- **请求方式**: DELETE
- **接口路径**: `/j3-system/init-community/remove-data`
- **功能描述**: 格式化指定小区的数据

### 密码管理

#### 6. 修改密码

- **接口名称**: `modifyStaffPwd`
- **请求方式**: PUT
- **接口路径**: `/j3-system/password/modify-staff-pwd`
- **功能描述**: 修改员工密码

### 注册协议管理

#### 7. 修改注册协议

- **接口名称**: `updateRegisterProtocol`
- **请求方式**: PUT
- **接口路径**: `/j3-system/register/update-register-protocol`
- **功能描述**: 修改用户和商家注册协议内容

### 系统配置管理

#### 8. 修改系统配置

- **接口名称**: `updateSystemInfo`
- **请求方式**: PUT
- **接口路径**: `/j3-system/system-config/update-system-info`
- **功能描述**: 修改系统配置信息

## 📊 数据类型

### 小区配置相关类型

- **CommunitySettingItem**: 修改小区相关设置项，包含主键 ID 和设置值
- **CommunitySetting**: 小区相关设置详情，包含 ID、名称、设置值、备注等
- **ModifyCommunitySettingParams**: 提交配置项修改值模型
- **QueryCommunitySettingParams**: 获取配置项数据查询参数
- **QueryCommunitySettingKeyParams**: 获取配置项列表查询参数
- **CommunitySettingKeyVO**: 获取小区配置值

### 初始化小区相关类型

- **QueryCommunitiesParams**: 获取小区列表查询参数，支持分页和多条件筛选
- **InitCommunityDTO**: 初始化小区数据传输模型，包含小区基本信息和状态
- **RemoveDataParams**: 格式化数据查询参数

### 密码管理相关类型

- **ModifyStaffPwdParams**: 修改密码数据对象，包含新旧密码和用户 ID

### 注册协议相关类型

- **UpdateRegisterProtocolParams**: 注册协议修改数据对象，包含商家和用户注册协议

### 系统配置相关类型

- **UpdateSystemInfoParams**: 系统配置修改数据对象，包含公司名称、标题、地址等系统信息

### 字段说明

#### 小区配置字段

- **csId**: 主键 ID（唯一标识）
- **settingName**: 配置项名称
- **settingValue**: 设置值
- **settingType**: 设置类型，用于筛选特定类别的配置项
- **communityId**: 小区 ID

#### 初始化小区字段

- **communityId**: 小区 ID
- **name**: 小区名称
- **cityCode**: 城市编码
- **nearbyLandmarks**: 附近地标
- **state**: 状态（1000 为待审核，1100 审核完成，1200 审核拒绝）
- **stateText**: 状态对应中文

#### 系统配置字段

- **companyName**: 公司名称
- **systemTitle**: 标题名称
- **systemSimpleTitle**: 简写标题
- **ownerTitle**: 业主标题
- **propertyTitle**: 物业手机标题
- **defaultCommunityId**: 默认小区编号

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 8 个接口的功能测试：

### 小区配置管理测试

1. 提交配置项修改
2. 获取配置项数据
3. 获取配置项列表

### 初始化小区管理测试

4. 获取小区列表（分页+条件）
5. 格式化数据

### 其他系统管理测试

6. 修改密码
7. 修改注册协议
8. 修改系统配置

## 📝 使用示例

```typescript
import {
	modifyCommunitySetting,
	queryCommunitySettingList,
	queryCommunitySettingKeyList,
	queryCommunitiesList,
	modifyStaffPwd,
	updateRegisterProtocol,
	updateSystemInfo,
	removeData,
} from "@/api/j3/system-manage";

// 获取配置项数据
const { execute: querySettings } = queryCommunitySettingList({
	onSuccess(data) {
		console.log("配置项数据", data);
	},
});

// 修改配置项
const { execute: modifySettings } = modifyCommunitySetting({
	onSuccess(data) {
		console.log("修改成功", data);
	},
});

// 获取小区列表
const { execute: queryCommunities } = queryCommunitiesList({
	onSuccess(data) {
		console.log("小区列表", data);
	},
});

// 修改密码
const { execute: modifyPwd } = modifyStaffPwd({
	onSuccess(data) {
		console.log("密码修改成功", data);
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
  - `queryCommunitySettingList`: `data` → `params`
  - `queryCommunitySettingKeyList`: `data` → `params`
  - `queryCommunitiesList`: `data` → `params`
  - `removeData`: `data` → `params`

### 2. 导入路径错误

- **问题**: 使用了错误的相对路径导入 `"composables/use-request"`
- **影响**: 可能导致模块解析失败
- **修复**: 统一使用标准路径别名 `"@/composables/use-request"`

### 3. 代码结构问题

- **问题**: 缺少分隔注释，代码结构混乱
- **影响**: 降低代码可读性和维护性
- **修复**: 添加标准分隔注释，重新组织代码结构

### 4. JSDoc 格式问题

- **问题**: JSDoc 描述格式不统一，存在多行描述
- **影响**: 影响代码文档的一致性
- **修复**: 统一为单行 `@description` 格式

## 📈 模块完成状态

**系统管理模块**: 8/8 (100%) ✅ **已完成**

所有接口都已实现、测试并通过故障修复，代码完全符合项目规范标准。模块现在可以安全、正确地在项目中使用。该模块覆盖了系统管理的核心功能，为整个 J3 系统提供了完善的配置和管理能力。
