# 商户管理模块

## 📋 模块概述

商户管理模块是 J3 系统管理的重要组成部分，负责管理商户信息和商户管理员的全生命周期操作。该模块提供了商户管理员的状态控制、列表查询以及商户信息的查询功能，涵盖商户管理员管理和商户信息管理两个子模块。

## 🔧 功能接口

### 商户管理员管理

#### 1. 限制登录

- **接口名称**: `modifyMerchantAdminStatus`
- **请求方式**: PUT
- **接口路径**: `/j3-merchant/merchant-admin/modify-status`
- **功能描述**: 修改商户管理员的登录状态，支持正常状态和限制登录

#### 2. 获取商户管理员列表（条件+分页）

- **接口名称**: `queryMerchantAdminList`
- **请求方式**: GET
- **接口路径**: `/j3-merchant/merchant-admin/query`
- **功能描述**: 支持按管理员名称、物业名称、电话进行条件查询，并返回分页数据

### 商户信息管理

#### 3. 获取商户列表（条件+分页）

- **接口名称**: `queryMerchantList`
- **请求方式**: GET
- **接口路径**: `/j3-merchant/merchant-message/query`
- **功能描述**: 支持按商户名称、商户类型、电话进行条件查询，并返回分页数据

## 📊 数据类型

### 商户管理员相关类型

- **ModifyMerchantAdminStatusParams**: 状态信息传输模型，用于修改管理员登录状态
- **QueryMerchantAdminParams**: 商户管理员查询参数，支持多条件筛选和分页
- **MerchantAdminDTO**: 商户管理员信息传输模型，包含管理员详细信息

### 商户信息相关类型

- **QueryMerchantParams**: 商户信息查询参数，支持多条件筛选和分页
- **MerchantDTO**: 商户信息传输模型，包含商户完整信息

### 字段说明

#### 商户管理员字段

- **userId**: 管理员 ID（唯一标识）
- **name**: 管理员名称
- **storeName**: 物业名称
- **tel**: 电话
- **status**: 状态（48001 商户正常状态，48002 限制商户登录）
- **statusText**: 状态文本描述
- **createTime**: 创建时间

#### 商户信息字段

- **storeId**: 商户 ID（唯一标识）
- **storeName**: 商户名称
- **storeType**: 商户类型
- **address**: 商户地址
- **corporate**: 企业法人
- **establishDate**: 成立日期
- **tel**: 电话
- **state**: 状态
- **stateText**: 状态文本
- **createTime**: 创建时间

#### 状态说明

##### 商户管理员状态

- **48001**: 商户正常状态
- **48002**: 限制商户登录

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有 3 个接口的功能测试：

### 商户管理员管理测试

1. 限制登录 - 修改管理员状态
2. 获取商户管理员列表（条件+分页）

### 商户信息管理测试

3. 获取商户列表（条件+分页）

## 📝 使用示例

```typescript
import { modifyMerchantAdminStatus, queryMerchantAdminList, queryMerchantList } from "@/api/j3/merchant-manage";

// 限制商户管理员登录
const { execute: modifyStatus } = modifyMerchantAdminStatus({
	onSuccess(data) {
		console.log("状态修改成功", data);
	},
});

// 获取商户管理员列表
const { execute: queryAdmins } = queryMerchantAdminList({
	onSuccess(data) {
		console.log("管理员列表", data);
	},
});

// 获取商户列表
const { execute: queryMerchants } = queryMerchantList({
	onSuccess(data) {
		console.log("商户列表", data);
	},
});
```

## 🔄 代码规范应用

本模块完全按照项目代码生成规范进行开发：

✅ **导入规范**: 使用 `@/composables/use-request` 路径别名  
✅ **代码分隔**: 添加明显的类型定义和接口函数分隔注释  
✅ **结构优化**: 先定义全部类型，再定义全部函数  
✅ **参数标准**: 统一使用 `UseAxiosOptionsJsonVO<T>` 参数格式  
✅ **参数位置**: 统一将 options 参数放在 useRequest 配置的最后  
✅ **测试规范**: 按照标准测试格式编写，使用 `j3/模块名` 命名规范  
✅ **上传类型**: 正确使用 `upType: UpType.json` 标识请求类型  
✅ **参数传递**: GET 接口正确使用 `params`，PUT 接口使用 `data`  
✅ **JSDoc 规范**: 统一 JSDoc 描述格式

## 📈 业务场景

### 商户管理员管理场景

1. **状态管理**: 根据违规行为或政策需要，可以限制特定管理员的登录权限
2. **监控查询**: 通过多条件查询快速定位特定的商户管理员
3. **批量管理**: 支持分页查询，便于大量数据的管理和操作

### 商户信息管理场景

1. **商户筛选**: 根据商户类型、名称等条件快速筛选目标商户
2. **信息查看**: 查看商户的详细信息，包括法人、地址、成立时间等
3. **状态监控**: 监控商户的运营状态和相关信息

## 📈 模块完成状态

**商户管理模块**: 3/3 (100%) ✅ **已完成**

所有接口都已实现、测试完毕，代码完全符合项目规范标准。模块现在可以安全、正确地在项目中使用。该模块为 J3 系统提供了完善的商户和商户管理员管理能力，支持灵活的查询和状态管理功能。
