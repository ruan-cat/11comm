# J4 组织管理模块

本模块提供组织管理相关的接口功能，包括员工信息管理、组织信息管理、排班设置管理、排班表管理和班次设置管理等功能。

## 📁 模块结构

```plain
j4/organization-manage/
├── employee-manage/          # 员工信息管理 (8个接口)
├── organization-info/        # 组织信息管理 (7个接口)
├── schedule-setting/         # 排班设置管理 (10个接口)
├── schedule-table/           # 排班表管理 (1个接口)
├── shift-setting/           # 班次设置管理 (7个接口)
└── index.md                 # 模块说明文档
```

## 🎯 功能概览

### 员工信息管理 (employee-manage)

- 员工的增删改查
- 员工基础信息查询
- 员工组织权限管理
- 员工排班信息查询
- 员工密码重置

### 组织信息管理 (organization-info)

- 组织的增删改查
- 组织结构树查询
- 员工与组织关联管理
- 组织员工列表查询

### 排班设置管理 (schedule-setting)

- 排班设置的增删改查
- 排班关联人员管理
- 排班状态启用/停用
- 排班详情配置

### 排班表管理 (schedule-table)

- 人员排班列表查询
- 排班信息展示

### 班次设置管理 (shift-setting)

- 班次的增删改查
- 班次状态管理
- 班次信息回显
- 班次名称列表查询

## 🔧 技术实现

### 代码规范

- 严格遵循项目代码风格
- 使用 TypeScript 进行类型约束
- 统一的错误处理机制
- 完整的 JSDoc 注释

### 测试覆盖

- 每个子模块都有对应的测试文件
- 包含所有接口的测试用例
- 使用 Vitest 测试框架
- 标准化的测试结构

### 接口设计

- 基于 useRequest 封装
- 支持泛型返回类型
- 统一的参数配置
- 规范的错误回调

## 📊 接口统计

| 子模块            | 接口数量 | 主要功能         |
| ----------------- | -------- | ---------------- |
| employee-manage   | 8        | 员工信息管理     |
| organization-info | 7        | 组织信息管理     |
| schedule-setting  | 10       | 排班设置管理     |
| schedule-table    | 1        | 排班表查询       |
| shift-setting     | 7        | 班次设置管理     |
| **总计**          | **33**   | **完整组织管理** |

## 📝 使用示例

```typescript
// 员工信息管理
import { addEmployee, getEmployeeList } from "@/api/j4/organization-manage/employee-manage";

// 组织信息管理
import { addOrganization, getOrganizationTree } from "@/api/j4/organization-manage/organization-info";

// 排班设置管理
import { addSchedule, queryScheduleList } from "@/api/j4/organization-manage/schedule-setting";

// 排班表管理
import { getPersonnelScheduleList } from "@/api/j4/organization-manage/schedule-table";

// 班次设置管理
import { addShiftSetting, listShiftSetting } from "@/api/j4/organization-manage/shift-setting";
```

## 🧪 测试运行

```bash
# 运行特定模块测试
npm test j4/organization-manage/employee-manage
npm test j4/organization-manage/organization-info
npm test j4/organization-manage/schedule-setting
npm test j4/organization-manage/schedule-table
npm test j4/organization-manage/shift-setting
```

## 📚 相关文档

- [员工信息管理接口](./employee-manage/index.ts)
- [组织信息管理接口](./organization-info/index.ts)
- [排班设置管理接口](./schedule-setting/index.ts)
- [排班表管理接口](./schedule-table/index.ts)
- [班次设置管理接口](./shift-setting/index.ts)
