# 11comm 智慧社区项目 - API 接口生成进度跟踪

> 📅 创建时间: 2025-07-26  
> 📊 总体进度: 63/400+ (约 16%)  
> 🎯 目标: 完成所有业务模块的 API 接口生成

## 📈 整体进度概览

| 模块            | 已完成 | 总计 | 完成率 | 状态        |
| --------------- | ------ | ---- | ------ | ----------- |
| **C1** 房产管理 | 0      | ~30  | 0%     | ❌ 未开始   |
| **C2** 报修管理 | 9      | ~15  | 60%    | 🟡 进行中   |
| **C3** 费用管理 | 3      | ~20  | 15%    | 🟡 进行中   |
| **C4** 费用管理 | 0      | ~15  | 0%     | ❌ 未开始   |
| **C5** 费用管理 | 0      | ~20  | 0%     | ❌ 未开始   |
| **C6** 报表管理 | 8      | ~25  | 32%    | 🟡 进行中   |
| **C7** 报表管理 | 11     | ~20  | 55%    | 🟡 进行中   |
| **J1** 登录菜单 | 10     | ~12  | 83%    | 🟢 接近完成 |
| **J2** 组织管理 | 12     | ~25  | 48%    | 🟡 进行中   |
| **J3** 系统管理 | 5      | ~15  | 33%    | 🟡 进行中   |
| **J4** 数据管理 | 1      | ~20  | 5%     | 🔴 刚起步   |
| **J5** 小区管理 | 0      | ~35  | 0%     | ❌ 未开始   |
| **J6** 合同管理 | 1      | ~25  | 4%     | 🔴 刚起步   |
| **J7** 停车管理 | 1      | ~20  | 5%     | 🔴 刚起步   |
| **J8** 巡检房产 | 2      | ~40  | 5%     | 🔴 刚起步   |

---

## 📋 详细接口清单

### 🔴 C1 - 房产管理 (0/30)

#### 业主信息

- [ ] `获取业主列表`
- [ ] `添加业主`
- [ ] `修改业主`
- [ ] `删除业主`
- [ ] `退出房屋`
- [ ] `查询所有业主房屋信息`
- [ ] `打印预存收据`
- [ ] `打印预存小票`

#### 房屋管理

- [ ] `获取房屋列表`
- [ ] `新增楼栋`
- [ ] `新增一条单元数据`
- [ ] `查询楼栋信息`
- [ ] `删除房屋信息`
- [ ] `删除楼栋支持批量`

---

### 🟡 C2 - 报修管理 (9/15)

#### 报修设置

- [x] `获取报修师傅列表（条件+分页）` ✅
- [x] `添加报修师傅` ✅
- [x] `获取报修设置类型列表` ✅
- [x] `变更报修师傅` ✅
- [x] `删除报修师傅` ✅
- [x] `添加报修设置类型` ✅
- [x] `修改报修设置类型` ✅
- [x] `删除报修设置类型` ✅
- [x] `查询符合条件的所有维修师傅的名字` ✅

#### 电话报修

- [x] `添加电话报修` ✅
- [ ] `获取电话报修列表`
- [ ] `修改电话报修`
- [ ] `删除电话报修`

#### 工单池

- [ ] `获取工单池工单详情`
- [ ] `打印工单`
- [ ] `派单`
- [ ] `修改工单`
- [ ] `获取工单列表`
- [ ] `删除工单`

#### 报修待办

- [x] `报修管理-报修待办-暂停` ✅
- [x] `报修待办--分页查询获取待办列表` ✅
- [x] `查询该小区中的所有报修类型` ✅
- [x] `查询该报修类型对应的所有报修师傅` ✅
- [x] `报修待办--改单处理` ✅
- [x] `报修待办--退单处理` ✅
- [x] `报修待办--办结处理` ✅

#### 报修已办

- [x] `获取报修已办单列表` ✅

#### 报修回访

- [x] `获取回访单列表` ✅
- [x] `添加一条报修回访反馈数据` ✅

#### 强制回单

- [x] `获取强制回单列表` ✅
- [x] `强制回单操作` ✅

#### 房屋管理 - 业主账户

- [x] `获取业主账户明细（条件+分页）` ✅
- [x] `预存-根据手机号获取业主名称` ✅
- [x] `撤销预存` ✅
- [x] `预存` ✅
- [x] `获取业主账户列表（分页+查询）` ✅

#### 费用管理 - 抄表类型

- [x] `抄表类型分页查询` ✅
- [x] `新增抄表类型` ✅
- [x] `修改抄表类型` ✅
- [x] `删除抄表类型` ✅

---

### 🟡 C3 - 费用管理 (3/20)

#### 房屋管理 - 场地管理

- [x] `添加场地` ✅
- [x] `添加预约` ✅

#### 房屋管理 - 场地预约单

- [x] `获取预约订单列表（条件+分页）` ✅
- [ ] `取消预约`

#### 费用管理 - 费用项设置

- [ ] `获取费用项名称列表`
- [ ] `获取费用项列表（条件+分页）`
- [ ] `获取费用项修改记录（条件+分页）`
- [ ] `添加费用`
- [ ] `修改费用`
- [ ] `删除费用`
- [ ] `获取折扣信息（条件+分页）`

#### 费用管理 - 房屋收费

- [ ] `获取缴纳记录（条件+分页）`
- [ ] `获取缴纳记录详情`
- [ ] `获取费用修改记录（条件+分页）`

---

### ❌ C4 - 费用管理 (0/15)

#### 费用管理

- [ ] `获取车辆费用`
- [ ] `添加优惠申请`
- [ ] `创建车辆费用`
- [ ] `变更车辆费用`
- [ ] `删除车辆费用`
- [ ] `缴纳车辆费用`
- [ ] `获取车辆费用详情`
- [ ] `获取缴费记录`
- [ ] `查询折扣`
- [ ] `水电抄表分页查询`
- [ ] `删除水电抄表`
- [ ] `修改水电抄表`
- [ ] `添加水电抄表`
- [ ] `获取跟踪记录`

---

### ❌ C5 - 费用管理 (0/20)

#### 优惠类型、补打凭据、缴费审核、退费审核、取消费用、欠费信息、欠费催缴、费用汇总表

- [ ] `获取退费审核详情`
- [ ] `获取退费历史列表`
- [ ] `修改优惠类型`
- [ ] `删除优惠类型`
- [ ] `审核退费`
- [ ] `查询补打凭据列表(条件+分页)`
- [ ] `打印收据`
- [ ] `打印小票`
- [ ] `获取取消费用列表（条件+分页）`
- [ ] `获取费用汇总列表(条件+分页)`
- [ ] `删除催缴`
- [ ] `导出催缴`
- [ ] `申请退费`
- [ ] `批量审核`

---

### 🟡 C6 - 报表管理 (8/25)

#### 数据统计

- [x] `费用类统计` ✅
- [x] `工单类统计` ✅
- [x] `出入类统计` ✅

#### 费用汇总表、费用明细表、费用提醒、欠费明细表、缴费明细表

- [x] `导出实收明细` ✅
- [x] `导出实收统计` ✅
- [x] `导出收款方式` ✅
- [x] `导出欠费统计` ✅
- [x] `欠费明细` ✅
- [ ] `导出欠费明细`
- [ ] `收缴情况`
- [ ] `导出收缴情况`
- [ ] `导出费用汇总表`
- [ ] `楼栋收费率查询`
- [ ] `费用项收费率查询`
- [ ] `房屋明细查询`
- [ ] `导出房屋费用明细`
- [ ] `业主明细查询`
- [ ] `获取预缴费用提醒列表（条件+分页）`
- [ ] `导出预缴费用提醒`
- [ ] `获取到期费用提醒列表（条件+分页）`
- [ ] `导出预缴费用提醒`
- [ ] `获取缴费明细列表（条件+分页）`

---

### 🟡 C7 - 报表管理 (11/20)

#### 报表管理

- [x] `获取报修明细列表` ✅
- [x] `导出报修明细` ✅
- [x] `获取报修统计列表` ✅
- [x] `导出报修统计` ✅
- [x] `报修未完成分页查询` ✅
- [x] `导出报修未完成` ✅
- [x] `获取报修收费列表` ✅
- [x] `导出报修收费` ✅
- [x] `获取不满意报修列表` ✅
- [x] `导出不满意报修` ✅
- [x] `获取未收情况列表` ✅
- [ ] `获取未收明细列表`
- [ ] `导出未收费房屋`
- [ ] `获取业主缴费明细列表`
- [ ] `导出业主缴费明细`

---

### 🟡 J1 - 登录菜单 (6/12)

#### 首页面板 - 控制台

- [x] `小区信息` ✅
- [x] `投诉统计` ✅

#### 菜单管理 - 菜单目录

- [x] `分页查询菜单目录` ✅
- [x] `删除菜单目录` ✅

#### 菜单管理 - 菜单组

- [x] `添加菜单组` ✅
- [ ] `删除菜单组`
- [ ] `获取菜单组列表`
- [ ] `获取菜单组名称列表`
- [ ] `修改菜单组`

#### 菜单管理 - 菜单项

- [ ] `获取菜单名称树`
- [ ] `添加权限`
- [ ] `删除权限`

#### 菜单管理 - 通用菜单

- [x] `添加通用菜单` ✅
- [x] `获取所有通用菜单` ✅
- [x] `获取通用菜单名称列表` ✅
- [x] `删除通用菜单` ✅

#### 登录模块 - login

- [x] `授权登录` ✅
- [ ] `获取验证码`
- [ ] `获取当前用户`
- [ ] `获取菜单`
- [ ] `退出登录`
- [ ] `刷新登录`

---

### 🟡 J2 - 组织管理 (5/25)

#### 组织管理 - 数据权限

- [x] `添加数据权限` ✅
- [x] `修改数据权限` ✅
- [x] `获取数据权限列表（条件+分页）` ✅
- [x] `删除数据权限` ✅

#### 组织管理 - 数据权限 - 关联单元

- [x] `添加关联单元` ✅
- [x] `获取已关联单元列表（条件+分页）` ✅
- [x] `获取未关联单元列表（条件+分页）` ✅
- [x] `删除关联单元` ✅

#### 组织管理 - 数据权限 - 员工关联

- [x] `获取关联员工列表（条件+分页）` ✅
- [x] `新增关联员工` ✅
- [x] `删除关联员工` ✅

#### 组织管理 - 角色权限 - 员工关联

- [ ] `获取已关联员工列表（条件+分页）`
- [ ] `新增关联`
- [ ] `删除关联`

#### 组织管理 - 角色权限 - 角色基础信息

- [x] `添加角色` ✅
- [x] `删除角色` ✅
- [x] `获取角色列表` ✅
- [x] `修改角色` ✅

#### 组织管理 - 角色权限 - 小区授权

- [ ] `新增关联`
- [ ] `删除关联`
- [ ] `获取可关联小区列表（条件+分页）`
- [ ] `获取已关联小区列表（条件+分页）`

#### 组织管理 - 角色权限 - 功能授权

- [ ] `获取菜单名称树`
- [ ] `获取指定角色分配的权限`
- [ ] `修改角色权限`

#### 配置管理 - 配置项

- [ ] `添加配置项`
- [ ] `获取配置项名称列表`
- [ ] `删除配置项`
- [ ] `获取配置项列表（条件+分页）`
- [ ] `修改配置项`

#### 配置管理 - 配置中心

- [ ] `添加配置`
- [ ] `删除配置`
- [ ] `获取配置列表（条件+分页）`
- [ ] `修改配置`

#### 配置管理 - 字典类型

- [ ] `添加字典类型`
- [ ] `删除字典类型`
- [ ] `修改字典类型`
- [ ] `查询字典类型列表(条件+分页)`
- [ ] `查询字典类型名称列表`

#### 配置管理 - 字典

- [ ] `添加字典`
- [ ] `修改字典`
- [ ] `获取字典名称列表`
- [ ] `获取字典列表(条件+分页)`
- [ ] `删除字典`

---

### 🟡 J3 - 系统管理 (5/15)

#### 报表配置 - 组件底层统计

- [x] `删除报表组件底层统计` ✅

#### 报表配置 - 报表组件

- [x] `添加报表组件` ✅
- [x] `添加条件` ✅
- [x] `修改条件` ✅
- [x] `获取条件列表（条件+分页）` ✅
- [ ] `删除条件`
- [ ] `删除报表组件`
- [ ] `修改报表组件`
- [ ] `获取报表组件列表(条件+分页)`

#### 报表配置 - 报表信息

- [ ] `分页查询报表信息`
- [ ] `关联组件`

#### 系统管理 - 小区配置

- [ ] `提交配置项修改`
- [ ] `获取配置项数据`
- [ ] `获取配置项列表`

#### 系统管理 - 初始化小区

- [ ] `获取小区列表（分页+条件）`
- [ ] `格式化数据`

#### 系统管理 - 修改密码

- [ ] `修改密码`

#### 系统管理 - 注册协议

- [ ] `修改注册协议`

#### 系统管理 - 系统配置

- [ ] `修改系统配置`

---

### 🔴 J4 - 数据管理 (1/20)

#### 数据管理 - 物业公司接口

- [x] `添加物业公司` ✅
- [ ] `加入小区`
- [ ] `获取小区功能`
- [ ] `获取物业公司（条件+分页接口）`
- [ ] `获取加入小区列表（条件+分页）`
- [ ] `限制物业登录`
- [ ] `修改物业公司`
- [ ] `获取未加入小区列表`
- [ ] `将小区退出物业公司`
- [ ] `重置物业公司密码`
- [ ] `修改小区功能`
- [ ] `删除物业公司`

#### 组织管理 - 员工信息接口

- [ ] `添加员工`
- [ ] `删除员工`
- [ ] `获得员工排班信息`
- [ ] `获取员工列表`
- [ ] `修改员工`
- [ ] `获取员工基础信息`
- [ ] `获取员工组织权限信息`
- [ ] `重置密码`

#### 组织管理 - 组织信息接口

- [ ] `添加组织`
- [ ] `关联员工`
- [ ] `删除组织`
- [ ] `获取组织名称树`
- [ ] `修改组织`
- [ ] `关联员工之前要查询 （分页+条件）`
- [ ] `获取组织员工列表（分页+条件）`

#### 组织管理 - 排班设置接口

- [ ] `删除排班关联人员`
- [ ] `删除排班设置`
- [ ] `获取排版设置列表（条件+分页）`
- [ ] `获取排班设置名称列表`
- [ ] `添加排班关联人员`
- [ ] `添加排班设置`
- [ ] `获取排班设置详情`
- [ ] `获取关联人员列表（条件+分页）`
- [ ] `启用/停用排班设置`
- [ ] `修改排班设置`

#### 组织管理 - 排班表接口

- [ ] `获取人员排班列表（条件+分页）`

#### 组织管理 - 班次设置接口

- [ ] `添加班次信息`
- [ ] `修改班次信息`
- [ ] `获取班次列表（条件+分页）`
- [ ] `获取班次名称列表`
- [ ] `班次信息回显`
- [ ] `修改班次状态`
- [ ] `删除班次`

---

### ❌ J5 - 小区管理 (0/35)

#### 小区信息

- [ ] `添加小区`
- [ ] `修改小区`
- [ ] `获取小区列表（条件+分页）`
- [ ] `获取城市地名列表`
- [ ] `获取未入驻物业的小区名称列表`
- [ ] `删除小区`

#### 小区管理 - 楼栋结构图

- [ ] `获取指定单元楼栋结构`
- [ ] `获取一次性获取所有结构`

#### 小区管理 - 业务受理

- [ ] `修改业主反馈`
- [ ] `获取业主反馈列表（条件+分页）`
- [ ] `删除业主反馈`

#### 小区管理 - 车位结构图

- [ ] `获取指定单元车位结构`

#### 小区管理 - 产权登记

- [ ] `添加房屋产权`
- [ ] `审核房屋产权`
- [ ] `删除房屋产权`
- [ ] `修改附件项`
- [ ] `修改房屋产权`

#### 小区管理 - 房屋装修

- [ ] `查看跟进记录详情`
- [ ] `获取跟进记录列表（条件+分页）`
- [ ] `添加装修`
- [ ] `删除装修`
- [ ] `修改装修`
- [ ] `完成装修`
- [ ] `审核装修`
- [ ] `获取装修列表(条件+分页)`

#### 文件上传

- [ ] `上传客服二维码等图片文件`

---

### 🔴 J6 - 合同管理 (1/25)

#### 数据管理(导入模块)

- [ ] `添加模板`
- [ ] `删除模版`
- [ ] `修改模版`
- [ ] `获取模板下载地址`
- [ ] `获取模板列表（条件+分页）`

#### 合同管理 - 合同变更

- [ ] `查看变更明细`
- [ ] `获取合同变更列表（条件+分页）`
- [ ] `主体变更--租期调整--资产变更`

#### 合同管理 - 起草合同

- [x] `起草合同` ✅
- [ ] `删除合同`
- [ ] `打印合同`
- [ ] `修改合同`
- [ ] `获取合同详情`
- [ ] `获取合同列表（条件+分页）`
- [ ] `获取合同修改记录（条件+分页）`
- [ ] `选择合同列表（条件+分页）`

#### 合同管理 - 到期合同

- [ ] `终止合同`
- [ ] `续签合同`
- [ ] `获取到期合同列表（条件+分页）`

#### 合同管理 - 合同甲方

- [ ] `获取合同甲方名称列表`
- [ ] `删除合同甲方`
- [ ] `获取合同甲方列表（条件+分页）`
- [ ] `添加合同甲方`

#### 合同管理 - 合同类型

- [ ] `新增合同类型`
- [ ] `添加合同扩展信息`
- [ ] `修改合同甲方`
- [ ] `删除合同类型扩展信息`
- [ ] `获取合同类型名称列表`

---

### 🔴 J7 - 停车管理 (1/20)

#### 停车管理 - 业主车辆

- [x] `导出车辆数据` ✅

#### 停车管理 - 车位申请

- [ ] `添加申请`
- [ ] `修改申请`
- [ ] `获取申请列表（分页+条件）`
- [ ] `删除申请`
- [ ] `审核申请`

#### 停车管理 - 车位信息

- [ ] `批量添加车位`
- [ ] `修改车位`

#### 房产管理（发票抬头、发票） - 发票抬头

- [ ] `修改发票抬头数据`
- [ ] `获取发票抬头列表（条件+分页）`
- [ ] `删除发票抬头`

#### 房产管理（发票抬头、发票） - 发票

- [ ] `申请发票`
- [ ] `删除发票`
- [ ] `获取发票列表 (条件+分页)`
- [ ] `获取发票详情`
- [ ] `发票详情----开票明细`

---

### 🔴 J8 - 巡检房产 (2/40)

#### 巡检管理 - 巡检明细

- [ ] `获取巡检明细列表（条件+分页）`

#### 巡检管理 - 巡检项目选项管理

- [ ] `添加巡检项目选项`
- [ ] `删除巡检项目选项`
- [ ] `修改巡检项目选项`

#### 巡检管理 - 巡检项目

- [ ] `增加巡检题目`
- [ ] `添加巡检项目`
- [ ] `修改巡检题目`
- [ ] `修改巡检项目`
- [ ] `获取巡检题目列表（条件＋分页`
- [ ] `获取巡检项目列表（条件＋分页）`
- [ ] `获取巡检项目名称列表`
- [ ] `删除巡检题目`
- [ ] `删除巡检项目`

#### 巡检管理 - 巡检计划

- [ ] `添加巡检计划`
- [ ] `修改巡检计划`
- [ ] `停用巡检计划`
- [ ] `获取巡检计划详情`
- [ ] `获取巡检计划列表（条件+分页）`
- [ ] `删除巡检计划`

#### 巡检管理 - 巡检点

- [ ] `添加巡检点`
- [ ] `修改巡检点信息`
- [ ] `获取巡检点列表（条件+分页）`
- [ ] `删除巡检点`
- [ ] `获取可选巡检点列表（条件+分页）`

#### 巡检管理 - 巡检路线

- [ ] `添加巡检路线，返回添加成功的id`
- [ ] `修改巡检路线`
- [ ] `获取巡检路线名称列表`
- [ ] `获取巡检路线列表（条件+分页）`
- [ ] `获取巡检路线巡检点列表（条件+分页）`
- [ ] `删除巡检路线`

#### 巡检管理 - 巡检路线巡检点

- [ ] `新增巡检路线巡检点`
- [ ] `修改巡检路线巡检点`
- [ ] `删除巡检路线巡检点`

#### 巡检管理 - 巡检任务

- [ ] `获取巡检任务详情`
- [ ] `获取巡检任务列表（条件+分页）`
- [ ] `流转`

#### 房产管理(业委会) - 业委会

- [x] `添加业委会` ✅
- [x] `修改业委会` ✅
- [x] `删除业委会` ✅

#### 房产管理(业委会) - 业委会成员管理

- [x] `获取业委会详情` ✅
- [x] `获取业委会列表(条件+分页)` ✅

---

## 🎯 优先级建议

### 🔥 高优先级（核心业务功能）

1. **C1 房产管理** - 系统基础数据
2. **J8 巡检管理** - 核心业务流程
3. **J4 组织管理** - 权限体系基础

### 🟡 中优先级（重要功能模块）

1. **J6 合同管理** - 重要业务流程
2. **J5 小区管理** - 基础数据管理
3. **C4-C5 费用管理** - 核心收费功能

### 🟢 低优先级（辅助功能）

1. **J7 停车管理** - 辅助功能
2. **C6-C7 报表统计** - 数据展示功能

---

## 📝 更新记录

### 2025-01-27

- ✅ **修正 J2 模块数据权限接口**
  - 根据实际 API 文档修正接口 URL 和参数结构
  - 添加数据权限接口 (`/j2-orgmanager/data/add`) - 使用 POST + body 传参
  - 修改数据权限接口 (`/j2-orgmanager/data/data-privilege`) - 使用 PUT + body 传参
  - 获取数据权限列表接口 (`/j2-orgmanager/data/dataPrivilege/{communityId}`) - 使用 GET + path 传参
  - 删除数据权限接口 (`/j2-orgmanager/data/delete/{dpId}`) - 使用 DELETE + path 传参
- 🔧 **修正参数结构**：
  - 使用实际字段：`code`, `communityId`, `dpId`, `name`, `remark`
  - 移除推断字段：`description`, `scope`, `seq`, `status` 等
- 🔧 **修正 Path 传参方式**：根据 [useAxios 文档](https://utils.ruan-cat.com/vueuse/useAxios-for-01s/use.html) 正确配置 path 参数传递
- 📁 修正文件: `apps/admin/src/api/j2/organization-manage/data-permission/data-permission.ts`
- 🧪 修正测试文件: `apps/admin/src/api/j2/organization-manage/data-permission/data-permission.test.ts`
- 📊 保持 J2 模块进度: 5/25 (20%)

- ✅ **新增 J2 模块数据权限关联单元接口**
  - 添加关联单元接口 (`/j2-orgmanager/data/unit/add-related-unit`) - 使用 PUT + query 传参
  - 获取已关联单元列表接口 (`/j2-orgmanager/data/unit/has-related-unit`) - 使用 GET + query 传参，返回 `PageDTO<RelatedUnitDisplayModel>`
  - 获取未关联单元列表接口 (`/j2-orgmanager/data/unit/no-related-unit`) - 使用 GET + query 传参，返回 `PageDTO<RelatedUnitDisplayModel>`
  - 删除关联单元接口 (`/j2-orgmanager/data/unit/remove-related-unit`) - 使用 DELETE + query 传参
- 📁 创建文件: `apps/admin/src/api/j2/organization-manage/data-permission/related-unit.ts`
- 🧪 创建测试文件: `apps/admin/src/api/j2/organization-manage/data-permission/related-unit.test.ts`
- 📊 更新 J2 模块进度: 9/25 (36%)
- 📊 更新总体进度: 60/400+ (约 15%)

### 2025-07-26

- ✅ 创建 API 接口生成进度跟踪文件
- 📊 统计现有接口完成情况
- 📋 梳理所有待实现接口清单
- 🎯 制定优先级实施建议
- ✅ **新增 J1 模块通用菜单接口**
  - 添加通用菜单接口 (`/j1-menumana/commonmenu/add`)
  - 获取所有通用菜单接口 (`/j1-menumana/commonmenu/queryall`)
  - 获取通用菜单名称列表接口 (`/j1-menumana/commonmenu/queryname`)
  - 删除通用菜单接口 (`/j1-menumana/commonmenu/remove`)
- 📁 创建文件: `apps/admin/src/api/j1/manu/menu-commonmenu.ts`
- 🧪 创建测试文件: `apps/admin/src/api/j1/manu/menu-commonmenu.test.ts`

- ✅ **新增 J2 模块数据权限员工关联接口**
  - 获取关联员工列表接口 (`/orgmanager/dataprivilege/staff`) - 使用 GET + query 传参，返回 `PageDTO<StaffDTO>`
  - 新增关联员工接口 (`/orgmanager/dataprivilege/staff`) - 使用 PUT + body 传参，返回 `number`
  - 删除关联员工接口 (`/orgmanager/dataprivilege/staff/{staffId}`) - 使用 DELETE + path 传参
- 📁 创建文件: `apps/admin/src/api/j2/organization-manage/data-permission/related-staff.ts`
- 🧪 创建测试文件: `apps/admin/src/api/j2/organization-manage/data-permission/related-staff.test.ts`
- 📊 更新 J2 模块进度: 12/25 (48%)
- 📊 更新总体进度: 63/400+ (约 16%)

---

> 💡 **使用说明**: 每当完成一个接口的实现时，请将对应的 `[ ]` 修改为 `[x]` 并添加 `✅` 标记，同时更新对应模块的完成计数。
