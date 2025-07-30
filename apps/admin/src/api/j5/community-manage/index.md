# J5 小区管理模块

## 模块结构

本模块包含 7 个子模块，共计 39 个接口：

### 1. 楼栋结构图 (building-structure) - 4 个接口

- 获取指定单元楼栋结构
- 获取一次性获取所有结构
- 获取指定社区楼栋结构
- 获取指定小区结构

### 2. 我的小区 (my-community) - 2 个接口

- 修改入驻小区（部分信息）
- 查看入驻小区

### 3. 业务受理 (business-handling) - 9 个接口

- 添加跟进进度
- 转报修单
- 获取跟进进度列表（条件+分页）
- 查询可报修类型
- 删除跟进进度
- 添加业主反馈
- 修改业主反馈
- 获取业主反馈列表（条件+分页）
- 删除业主反馈

### 4. 车位结构图 (parking-structure) - 1 个接口

- 获取指定单元车位结构

### 5. 产权登记 (property-registration) - 8 个接口

- 添加房屋产权
- 审核房屋产权
- 删除房屋产权
- 修改附件项
- 修改房屋产权
- 获取房屋产权详情
- 获取房屋产权列表（条件+分页）
- 上传产权详情里的图片

### 6. 小区公示 (community-announcement) - 5 个接口

- 添加公示
- 修改公示
- 删除公示
- 获取公示详情
- 获取公示列表（条件+分页）

### 7. 房屋装修 (house-decoration) - 10 个接口

- 添加跟进记录
- 删除跟进记录
- 查看跟进记录详情
- 获取跟进记录列表（条件+分页）
- 添加装修
- 删除装修
- 修改装修
- 完成装修
- 审核装修
- 获取装修列表(条件+分页)

## 文件结构

```plain
community-manage/
├── building-structure/          # 楼栋结构图
│   ├── index.ts
│   └── index.test.ts
├── my-community/               # 我的小区
│   ├── index.ts
│   └── index.test.ts
├── business-handling/          # 业务受理
│   ├── index.ts
│   └── index.test.ts
├── parking-structure/          # 车位结构图
│   ├── index.ts
│   └── index.test.ts
├── property-registration/      # 产权登记
│   ├── index.ts
│   └── index.test.ts
├── community-announcement/     # 小区公示
│   ├── index.ts
│   └── index.test.ts
├── house-decoration/          # 房屋装修
│   ├── index.ts
│   └── index.test.ts
└── index.md                   # 本文件
```

## 开发指南

每个子模块的 `index.ts` 文件需要：

1. 定义相关的数据类型
2. 实现对应的接口函数
3. 遵循项目的代码规范

每个子模块的 `index.test.ts` 文件需要：

1. 导入对应的接口函数
2. 编写测试用例
3. 遵循测试规范
