# 物业公司管理模块

## 📋 模块概述

物业公司管理模块是 J4 数据管理的核心组成部分，负责管理物业公司的完整生命周期，包括物业公司的基础信息管理、小区加入与退出管理、权限控制以及小区功能配置等。该模块提供了物业公司从注册到运营的全流程管理功能。

## 🔧 功能接口

### 物业公司基础信息管理

#### 1. 添加物业公司

- **接口名称**: `addPropertyCompany`
- **请求方式**: POST
- **接口路径**: `/j4-datamanager/addCompany`
- **功能描述**: 添加新的物业公司信息，包括基本信息和功能权限

#### 2. 修改物业公司信息

- **接口名称**: `modifyPropertyCompany`
- **请求方式**: PUT
- **接口路径**: `/j4-datamanager/modifyCompany/{storeId}`
- **功能描述**: 修改物业公司信息，支持路径参数传递公司 ID

#### 3. 获取物业公司列表

- **接口名称**: `getCompanyList`
- **请求方式**: GET
- **接口路径**: `/j4-datamanager/getCompanyList`
- **功能描述**: 获取物业公司列表，支持条件查询和分页

#### 4. 删除物业公司

- **接口名称**: `deleteCompany`
- **请求方式**: DELETE
- **接口路径**: `/j4-datamanager/updateCompany/{storeId}`
- **功能描述**: 删除指定的物业公司

#### 5. 重置物业公司密码

- **接口名称**: `resetCompanyPassword`
- **请求方式**: PUT
- **接口路径**: `/j4-datamanager/resetCompanyPassword/{storeId}`
- **功能描述**: 重置指定物业公司的密码

#### 6. 限制物业登录

- **接口名称**: `limitCompanyLogin`
- **请求方式**: PUT
- **接口路径**: `/j4-datamanager/limitCompanyLogin/{storeId}/operate/{operate}`
- **功能描述**: 通过 storeId 和 operate 限制物业公司登录

### 小区管理功能

#### 7. 加入小区

- **接口名称**: `addJoinCommunity`
- **请求方式**: PUT
- **接口路径**: `/j4-datamanager/addJoinCommunity`
- **功能描述**: 物业公司加入指定小区，并配置功能权限

#### 8. 获取加入小区列表

- **接口名称**: `getJoinCommunityList`
- **请求方式**: GET
- **接口路径**: `/j4-datamanager/joinCommunityList`
- **功能描述**: 获取加入小区列表，支持条件查询和分页

#### 9. 退出小区

- **接口名称**: `quitJoinCommunity`
- **请求方式**: PUT
- **接口路径**: `/j4-datamanager/quitJoinCommunity/{communityId}`
- **功能描述**: 物业公司退出指定小区

#### 10. 获取小区功能

- **接口名称**: `getCommunityMenuGroupList`
- **请求方式**: GET
- **接口路径**: `/j4-datamanager/getCommunityMenuGroupList/{communityId}`
- **功能描述**: 根据 communityId 获取小区功能菜单组

#### 11. 修改小区功能

- **接口名称**: `updateCommunityMenuGroup`
- **请求方式**: PUT
- **接口路径**: `/j4-datamanager/updateCommunityMenuGroup`
- **功能描述**: 修改指定小区的功能菜单组

#### 12. 获取未加入小区列表

- **接口名称**: `getNoJoinCommunityList`
- **请求方式**: GET
- **接口路径**: `/j4-datamanager/noJoinCommunityList/{communityMemberId}`
- **功能描述**: 获取未加入小区列表，返回字符串数组

## 📊 数据类型

### 物业公司相关类型

- **PropertyCompanyParams**: 物业公司新增和修改参数，包含地址、成立日期、功能权限等
- **PropertyCompanyResult**: 物业公司查询返回结果，包含完整的公司信息
- **GetCompanyListParams**: 获取物业公司列表参数，支持多条件筛选和分页

### 小区管理相关类型

- **CommunityFunction**: 小区功能配置，包含小区信息和菜单组列表
- **MenuGroup**: 菜单组配置，包含菜单组名称和状态
- **JoinCommunityList**: 加入小区列表信息
- **GetJoinCommunityListParams**: 获取加入小区列表参数
- **CommunityMenuGroup**: 小区功能菜单组
- **GetNoJoinCommunityListParams**: 获取未加入小区列表参数

### 字段说明

#### 物业公司字段

- **storeId**: 物业公司 ID（唯一标识）
- **storeName**: 公司名称
- **address**: 公司地址
- **createDate**: 成立日期
- **userName**: 公司法人
- **tel**: 联系电话
- **nearbyLandmarks**: 附近地标
- **functions**: 功能权限列表
- **administrator**: 管理员信息

#### 小区管理字段

- **communityId**: 小区 ID（唯一标识）
- **communityName**: 小区名称
- **communityAddress**: 小区地址
- **cityCode**: 城市编码
- **state**: 状态信息
- **menuGroups**: 菜单组列表
- **gid**: 菜单组 ID
- **statusCd**: 状态码

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 12 个接口的功能测试：

### 物业公司基础信息管理测试

1. 添加物业公司
2. 修改物业公司信息
3. 获取物业公司列表
4. 删除物业公司
5. 重置物业公司密码
6. 限制物业登录

### 小区管理功能测试

7. 加入小区
8. 获取加入小区列表
9. 退出小区
10. 获取小区功能
11. 修改小区功能
12. 获取未加入小区列表

## 📝 使用示例

```typescript
import {
	addPropertyCompany,
	getCompanyList,
	addJoinCommunity,
	getJoinCommunityList,
	getNoJoinCommunityList,
	modifyPropertyCompany,
	deleteCompany,
} from "@/api/j4/data-manage/property-manage-company";

// 添加物业公司
const { execute: addCompany } = addPropertyCompany({
	onSuccess(data) {
		console.log("添加成功", data);
	},
});

// 获取物业公司列表
const { execute: getList } = getCompanyList({
	onSuccess(data) {
		console.log("公司列表", data);
	},
});

// 加入小区
const { execute: joinCommunity } = addJoinCommunity({
	onSuccess(data) {
		console.log("加入小区成功", data);
	},
});

// 获取加入小区列表
const { execute: getCommunityList } = getJoinCommunityList({
	onSuccess(data) {
		console.log("小区列表", data);
	},
});

// 获取未加入小区列表
const { execute: getNoJoinList } = getNoJoinCommunityList({
	onSuccess(data) {
		console.log("未加入小区列表", data);
	},
});
```

## 🔄 代码规范应用

本模块已完全按照项目代码生成规范进行修复和规范化：

✅ **导入规范**: 修复导入路径，使用 `@/composables/use-request` 路径别名  
✅ **代码分隔**: 添加明显的类型定义和接口函数分隔注释  
✅ **结构优化**: 先定义全部类型，再定义全部函数  
✅ **参数标准**: 统一使用 `UseAxiosOptionsJsonVO<T>` 参数格式  
✅ **参数位置**: 统一将 options 参数放在 useRequest 配置的最后  
✅ **测试规范**: 按照标准测试格式重构，使用 `j4/模块名` 命名规范  
✅ **上传类型**: 正确使用 `upType: UpType.json` 标识请求类型  
✅ **参数传递**: GET 接口正确使用 `params`，POST/PUT 接口使用 `data`  
✅ **JSDoc 规范**: 统一 JSDoc 描述格式

## 🚨 修复的关键问题

### 1. 导入路径错误

- **问题**: 使用了错误的相对路径导入 `"composables/use-request"`
- **影响**: 可能导致模块解析失败
- **修复**: 统一使用标准路径别名 `"@/composables/use-request"`

### 2. 代码结构混乱

- **问题**: 缺少分隔注释，类型定义和函数定义混在一起
- **影响**: 降低代码可读性和维护性
- **修复**: 添加标准分隔注释，重新组织代码结构

### 3. options 参数位置不一致

- **问题**: 有些接口 options 参数在前，有些在后
- **影响**: 影响代码一致性
- **修复**: 统一将 options 参数放在最后

### 4. 缺少 upType 字段

- **问题**: POST/PUT 请求缺少 `upType: UpType.json` 标识
- **影响**: 可能影响请求头设置
- **修复**: 为所有 POST/PUT 请求添加 `upType: UpType.json`

### 5. JSDoc 格式问题

- **问题**: JSDoc 描述格式不统一，存在多行描述
- **影响**: 影响代码文档的一致性
- **修复**: 统一为单行 `@description` 格式

### 6. 测试文件格式问题

- **问题**: 嵌套 describe 结构，命名规范不统一
- **影响**: 降低测试代码的可读性
- **修复**: 简化为单层结构，统一命名规范

## 📈 业务价值

### 物业公司管理价值

1. **完整生命周期**: 从注册、信息维护到权限控制的全流程管理
2. **灵活查询**: 支持多条件筛选和分页查询，便于大量数据管理
3. **安全控制**: 支持密码重置和登录限制，确保系统安全

### 小区管理价值

1. **动态配置**: 支持物业公司动态加入和退出小区
2. **权限管理**: 灵活配置小区功能权限，满足不同业务需求
3. **状态监控**: 实时了解物业公司与小区的关联状态

## 📈 模块完成状态

**物业公司管理模块**: 12/12 (100%) ✅ **已完成**

所有接口都已实现、测试并通过代码规范修复，代码完全符合项目规范标准。模块现在可以安全、正确地在项目中使用。该模块为 J4 数据管理系统提供了完善的物业公司管理能力，支持物业公司的全生命周期管理和灵活的小区关联管理功能。新增的"获取未加入小区列表"接口为物业公司提供了查看可加入小区的功能，进一步完善了小区管理体系。
