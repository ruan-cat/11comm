# 场地预约单管理模块

## 📋 模块概述

场地预约单管理模块负责处理场地预约订单的查询和管理功能，包括订单列表查询和取消预约等操作。

## 🔧 功能接口

### 1. 获取预约订单列表（条件+分页）

- **接口名称**: `queryOrderList`
- **请求方式**: GET
- **接口路径**: `/c3-paceapp/query-order-page`
- **功能描述**: 分页获取场地预约订单列表，支持多条件查询

### 2. 取消预约

- **接口名称**: `removeOrder`
- **请求方式**: DELETE
- **接口路径**: `/c3-paceapp/remove-order`
- **功能描述**: 根据订单编号取消预约订单

## 📊 数据类型

### OrderDTO

预约订单信息的数据模型，包含订单编号、场馆场地信息、预约人信息、费用信息、订单状态等。

### QueryOrderListParams

用于分页查询订单列表的参数，支持按社区、场地、状态、预约人等多条件筛选。

### OrderIdDTO

取消预约时的参数，包含订单编号。

## 🧪 测试用例

模块包含完整的测试套件，覆盖所有接口的功能测试。

## 📝 使用示例

```typescript
import { queryOrderList, removeOrder } from "@/api/c3/housing-manage/venueres-reserve-order";

// 查询订单列表
const { execute: queryList } = queryOrderList({
	onSuccess(data) {
		console.log("订单列表", data);
	},
});

// 取消预约
const { execute: cancelOrder } = removeOrder({
	onSuccess(data) {
		console.log("取消成功", data);
	},
});
```

## 📝 业务说明

### 订单状态说明

- **S**: 预约成功
- **F**: 预约失败
- **W**: 待审核
- **F**: 待支付
- **CL**: 已取消

### 支付方式说明

- **1**: 现金
- **2**: 微信
- **3**: 支付宝
