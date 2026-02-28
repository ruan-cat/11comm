# 数据库迁移说明

本文档说明如何执行 RLS（行级安全策略）相关的数据库迁移。

## 迁移文件列表

| 文件名                         | 描述                | 依赖                     |
| ------------------------------ | ------------------- | ------------------------ |
| `0001_auth_rls_policy.sql`     | 认证相关表 RLS 策略 | 无                       |
| `0002_business_rls_policy.sql` | 业务表 RLS 策略     | 0001_auth_rls_policy.sql |

## 执行顺序

**重要**: 必须按照以下顺序执行迁移：

1. **首先执行**: `0001_auth_rls_policy.sql`
   - 创建认证相关表（auth_user_mapping, auth_roles, auth_user_roles）
   - 为现有表添加 neon_auth_id 字段
   - 启用 RLS 并创建基础策略
   - 创建组织隔离函数（get_user_organization_ids, get_user_community_ids）

2. **然后执行**: `0002_business_rls_policy.sql`
   - 为所有业务表启用 RLS
   - 创建业务表的数据隔离策略
   - 创建 get_user_property_ids 函数

## 执行方式

### 方式一：使用 pnpm 命令（推荐）

```bash
# 在 apps/admin 目录下执行
cd apps/admin

# 执行所有待执行迁移
pnpm db:migrate
```

### 方式二：直接执行 SQL 文件

使用 psql 或 Neon 控制台直接执行 SQL 文件：

```bash
# 使用 psql 执行
psql $DATABASE_URL -f drizzle/0001_auth_rls_policy.sql
psql $DATABASE_URL -f drizzle/0002_business_rls_policy.sql
```

## 迁移内容概述

### 0001_auth_rls_policy.sql

1. **创建认证表**
   - `auth_user_mapping`: Neon Auth 用户映射表
   - `auth_roles`: 角色定义表
   - `auth_user_roles`: 用户角色关联表

2. **扩展现有表**
   - 为 `sm_staff` 添加 `neon_auth_id` 字段
   - 为 `hp_owners` 添加 `neon_auth_id` 字段

3. **创建 RLS 策略**
   - 认证相关表的 SELECT/INSERT/UPDATE 策略
   - 员工表、小区表、房屋表、业主表的数据隔离

4. **创建辅助函数**
   - `get_user_organization_ids()`: 获取用户可访问的组织 ID 列表
   - `get_user_community_ids()`: 获取用户可访问的小区 ID 列表

5. **插入默认角色数据**
   - 超级管理员 (super_admin)
   - 组织管理员 (org_admin)
   - 小区管理员 (community_admin)
   - 物业员工 (staff)
   - 业主/住户 (owner)

### 0002_business_rls_policy.sql

1. **费用管理相关表** (ex\_\*)
   - 费用项、房屋收费、车辆收费、合同收费
   - 缴费记录、缴费审核、退款审核
   - 优惠类型、优惠设置、优惠申请
   - 抄表类型、抄表记录、退费记录
   - 催缴提醒、补打凭证、费用汇总

2. **报修管理相关表** (rp\_\*)
   - 报修工单、工单历史、回访记录
   - 报修设置、报修类型、必回访问题、电话报修

3. **巡检管理相关表** (pt\_\*)
   - 巡检计划、巡检路线、巡检点
   - 巡检项、巡检任务、巡检详情

4. **停车管理相关表** (pk\_\*)
   - 停车场结构、车位、车库
   - 业主车辆、车位申请

5. **合同管理相关表** (ct\_\*)
   - 甲方、乙方、合同模板、合同条款
   - 合同类型、合同、合同附件
   - 合同变更、合同审核、合同归档、合同打印

6. **房产相关表** (hp\_\*)
   - 业主成员、业主账户
   - 发票、发票抬头
   - 场地预约、场地管理、业主委员会

7. **组织架构相关表** (sm\_\*)
   - 组织、角色、权限
   - 角色权限、员工角色、数据权限
   - 班次、排班设置、工作日程
   - 系统配置、注册协议

8. **社区管理相关表** (cm\_\*)
   - 通知公告、业务办理
   - 装修管理、物品放行、楼栋结构

9. **报表相关表** (rpt\_\*)
   - 费用汇总、押金报表、缴费明细
   - 业主缴费明细、费用催缴、未缴费房屋
   - 欠费明细、巡检报表、报修报表
   - 报修汇总、费用明细、数据统计

10. **运营相关表** (op\_\*)
    - 商户、商户管理员、物业公司
    - 社区信息、社区配置
    - 报表分组、报表信息、报表组件、注册协议

11. **新增辅助函数**
    - `get_user_property_ids()`: 获取用户可访问的小区 ID 列表

## 角色权限说明

| 角色            | 组织权限   | 小区权限         | 数据权限 |
| --------------- | ---------- | ---------------- | -------- |
| super_admin     | 所有       | 所有             | 全部     |
| org_admin       | 所管理组织 | 所有             | 全部     |
| community_admin | 所属组织   | 所管理小区       | 全部     |
| staff           | 所属组织   | 所管理小区       | 按职责   |
| owner           | -          | 自有房产所在小区 | 自有数据 |

## 故障排查

### 迁移失败

1. 检查依赖是否已正确执行
2. 确认数据库连接配置正确
3. 查看错误日志确定具体原因

### RLS 策略不生效

1. 确认 RLS 已启用：`SELECT relname, relrowsecurity FROM pg_class WHERE relrowsecurity = true;`
2. 检查策略是否正确创建：`SELECT * FROM pg_policies;`
3. 验证辅助函数是否正常工作

### 权限问题

1. 确认用户上下文设置正确
2. 检查 current_setting 函数返回的值
3. 验证用户角色分配是否正确
