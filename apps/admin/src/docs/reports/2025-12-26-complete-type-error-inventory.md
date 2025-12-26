<!-- TODO: 作为提示词持续使用 未完成 -->

# 2025-12-26 完整类型错误清单报告

你的核心任务是，根据本文的类型报错报告，根据优先级和具体的`修复建议`，生成 openspec 长任务。

实际执行类型修复的是 openspec 的长任务。本文件作为`fix-type-error-20251226`任务的核心指导文件。

1. 全面阅读本文。深度思考。
2. 新建一个 openspec 任务，任务名称为 `fix-type-error-20251226` 。
3. 根据修复错误的的难易程度、和危害紧迫度，划分任务清单。做好内部的任务评级。务必新建一个清晰的 tasks.md 任务清单文件。
4. 禁止编写脚本完成批处理任务：
   > **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
5. 主动开启多个后台运行的子代理并行完成任务：
   - 请你主动的开启多个独立并行的修改子代理，加快修改任务。
   - 你新建的子代理**必须**是**后台运行**的子代理。

## 上下文要求

请务必先主动阅读 CLAUDE.md 和 .claude 目录内的全部的指导文件。
不需要你阅读以下文件：

- .claude\settings.json
- .claude\statusline.sh
  你的修改必须按照这些 claude code 文档的要求和约束来做。特别是 agents 和 skills 的要求。

## 执行任务时的思考模式

请你以 `ultrathink` 的思考模式，认真阅读并思考文档要求。

1. 增加你的思考预算： 请你大胆的多使用 token 做深度的，全面的，细致的推理思考。
2. 鼓励你多花时间思考： 请你在执行任务前，主动使用尽可能多的 token 做充分详实完善完整的思考，允许你多花费时间做阅读，对比，思考。
3. 复杂任务类型： 这是一揽子复杂的，多步骤的任务。请你先思考任务之间的前后关系，然后再动态编排任务。
4. 严格按照文档要求落实： 你必须非常严格的按照文档的要求做，不允许出现缺漏。

## 1. 执行概述

### 1.1 执行时间

- 报告生成时间：2025-12-26
- 类型检查命令执行时间：2025-12-26

### 1.2 检查范围

- **类型项目**（`@01s-11comm/type`）：✅ 无类型错误
- **后台项目**（`@01s-11comm/admin`）：❌ 发现 61 个类型错误，分布在 26 个文件中

### 1.3 检查命令

```bash
# 类型项目类型检查
pnpm -F @01s-11comm/type typecheck

# 后台项目类型检查
pnpm -F @01s-11comm/admin typecheck
```

## 2. 类型错误统计总览

### 2.1 总体统计

|   统计项   | 数量 |
| :--------: | :--: |
|  错误总数  |  61  |
| 涉及文件数 |  26  |

### 2.2 按错误类型分类统计

|       错误类型        | 数量 |                  说明                   |
| :-------------------: | :--: | :-------------------------------------: |
|  TS2352 类型转换错误  |  6   |        FieldValues 类型转换问题         |
|   TS2322 类型不匹配   |  6   |             类型赋值不兼容              |
|   TS2304 找不到名称   |  23  |         变量/类型未定义或未导入         |
|  TS2305 模块导出缺失  |  4   |       模块中不存在指定的导出成员        |
|   TS2339 属性不存在   |  13  | 对象上不存在指定属性（主要是 doFetch）  |
|  TS2724 导出成员错误  |  4   |        导出成员名称错误或不存在         |
|  TS2749 值被用作类型  |  3   |           值被错误地用作类型            |
| TS2769 函数重载不匹配 |  2   |        dayjs 函数参数类型不兼容         |
|  TS1361 类型导入错误  |  1   | 使用 import type 导入的值不能作为值使用 |
| TS2353 对象字面量错误 |  1   |         对象字面量包含未知属性          |

### 2.3 按业务模块分类统计

|     业务模块      | 错误数量 |
| :---------------: | :------: |
| 物业管理-报表管理 |    31    |
| 物业管理-社区管理 |    6     |
| 物业管理-维修管理 |    9     |
| 物业管理-停车管理 |    3     |
| 物业管理-巡检管理 |    1     |
| 物业管理-房产管理 |    2     |
| 物业管理-合同管理 |    1     |
| 运营团队-数据管理 |    1     |
| 运营团队-系统管理 |    2     |
| 开发团队-配置管理 |    2     |
| 设置管理-组织管理 |    2     |
| 设置管理-系统管理 |    5     |
|     通用视图      |    1     |

## 3. 详细错误清单

### 3.1 FieldValues 类型转换错误（TS2352）

#### 3.1.1 错误描述

类型转换可能是错误的，因为两种类型没有充分重叠。缺少字符串索引签名。

#### 3.1.2 涉及文件（6 个错误）

1. **`src/pages/dev-team/config-manage/type/components/form.vue`**（2 个错误）

```log
src/pages/dev-team/config-manage/type/components/form.vue:23:23 - error TS2352: Conversion of type 'DictionaryTypeFormVO' to type 'FieldValues & DictionaryTypeFormVO' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'DictionaryTypeFormVO' is not comparable to type 'FieldValues'.
    Index signature for type 'string' is missing in type 'DictionaryTypeFormVO'.

23 const defaultValues = props.defaultValues as FieldValues & DictionaryTypeFormVO;
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/pages/dev-team/config-manage/type/components/form.vue:34:19 - error TS2352: Conversion of type 'DictionaryTypeFormVO' to type 'FieldValues & DictionaryTypeFormVO' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'DictionaryTypeFormVO' is not comparable to type 'FieldValues'.
    Index signature for type 'string' is missing in type 'DictionaryTypeFormVO'.

34 const toRefForm = cloneDeep(props.form) as FieldValues & DictionaryTypeFormVO;
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

2. **`src/pages/operation-team/system-manage/initialize-cell/components/form.vue`**（2 个错误）

```log
src/pages/operation-team/system-manage/initialize-cell/components/form.vue:16:23 - error TS2352: Conversion of type 'InitializeCellFormVO' to type 'FieldValues & InitializeCellFormVO' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'InitializeCellFormVO' is not comparable to type 'FieldValues'.
    Index signature for type 'string' is missing in type 'InitializeCellFormVO'.

16 const defaultValues = props.defaultValues as FieldValues & InitializeCellFormVO;
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/pages/operation-team/system-manage/initialize-cell/components/form.vue:29:19 - error TS2352: Conversion of type 'InitializeCellFormVO' to type 'FieldValues & InitializeCellFormVO' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'InitializeCellFormVO' is not comparable to type 'FieldValues'.
    Index signature for type 'string' is missing in type 'InitializeCellFormVO'.

29 const toRefForm = structuredClone(props.form) as FieldValues & InitializeCellFormVO;
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

#### 3.1.3 修复建议

为业务类型添加字符串索引签名，或使用 `unknown` 作为中间类型进行转换。

### 3.2 类型不匹配错误（TS2322）

#### 3.2.1 错误描述

类型赋值不兼容，实际类型与期望类型不匹配。

#### 3.2.2 涉及文件（6 个错误）

1. **`src/pages/property-manage/community-manage/house-decoration/index.vue:264`**

```log
src/pages/property-manage/community-manage/house-decoration/index.vue:264:8 - error TS2322: Type '{ houseNumber: string; contactName: string; contactPhone: string; decorationTime: string; applicationTime: string; decorationCompany: string; managerPhone: string; status: string; isDelayed: string; delayTime: string; isViolated: string; violationDescription: string; remarks: string; }' is not assignable to type 'HouseDecorationFormVO'.
  Types of property 'status' are incompatible.
    Type 'string' is not assignable to type 'HouseDecorationStatusType'.

264  const formData: HouseDecorationFormVO = isAdd.value
           ~~~~~~~~
```

**问题**：`status` 字段类型应该是 `HouseDecorationStatusType` 而不是 `string`。

2. **`src/pages/property-manage/house-property-manage/house/index.vue`**（2 个错误）

```log
src/pages/property-manage/house-property-manage/house/index.vue:29:2 - error TS2322: Type '""' is not assignable to type 'HouseStatus'.

29  houseStatus: "",
    ~~~~~~~~~~~

src/pages/property-manage/house-property-manage/house/index.vue:30:2 - error TS2322: Type '""' is not assignable to type 'HouseType'.

30  houseType: "",
    ~~~~~~~~~
```

**问题**：空字符串不能赋值给枚举类型 `HouseStatus` 和 `HouseType`。

3. **`src/pages/property-manage/parking-manage/parking-lot/index.vue`**（2 个错误）

```log
src/pages/property-manage/parking-manage/parking-lot/index.vue:31:2 - error TS2322: Type '"地下停车场"' is not assignable to type '"ground" | "underground" | "multi_level" | "roadside"'.

31  parkingLotType: "地下停车场",
    ~~~~~~~~~~~~~~

src/pages/property-manage/parking-manage/parking-lot/index.vue:32:2 - error TS2322: Type '"标准车位"' is not assignable to type '"large" | "visitor" | "standard" | "accessible" | "charging"'.

32  parkingSpaceType: "标准车位",
    ~~~~~~~~~~~~~~~~
```

**问题**：使用了中文值，但类型定义要求英文枚举值。

4. **`src/pages/property-manage/patrol-manage/detail/index.vue:263`**

```log
src/pages/property-manage/patrol-manage/detail/index.vue:263:8 - error TS2322: Type '{ patrolPointName: string; patrolPlanName: string; patrolRouteName: string; plannedPatrolPerson: string; patrolMethod: string; location: string; patrolSituation: string; }' is not assignable to type 'PatrolDetailFormVO'.
  Types of property 'patrolMethod' are incompatible.
    Type 'string' is not assignable to type '"" | PatrolMethodType'.

263  const patrolDetailFormVO: PatrolDetailFormVO = isAdd.value
           ~~~~~~~~~~~~~~~~~~
```

**问题**：`patrolMethod` 字段类型应该是 `"" | PatrolMethodType` 而不是 `string`。

#### 3.2.3 修复建议

- 使用正确的枚举类型值
- 将中文值映射为对应的英文枚举值
- 对于可选的枚举字段，使用 `undefined` 而不是空字符串

### 3.3 找不到名称错误（TS2304）

#### 3.3.1 错误描述

变量、类型或函数未定义或未正确导入。

#### 3.3.2 涉及文件（23 个错误）

1. **`src/pages/property-manage/contract-manage/draft-contract/index.vue:81`**

```log
src/pages/property-manage/contract-manage/draft-contract/index.vue:81:12 - error TS2304: Cannot find name 'contractTypeOptionsData'.

81   options: contractTypeOptionsData,
              ~~~~~~~~~~~~~~~~~~~~~~~
```

2. **`src/pages/property-manage/report-manage/deposit-report/index.vue`**（3 个错误）

```log
src/pages/property-manage/report-manage/deposit-report/index.vue:172:12 - error TS2304: Cannot find name 'feeItemNameOptions'.

172   options: feeItemNameOptions,
               ~~~~~~~~~~~~~~~~~~

src/pages/property-manage/report-manage/deposit-report/index.vue:184:12 - error TS2304: Cannot find name 'chargeObjectTypeOptions'.

184   options: chargeObjectTypeOptions,
               ~~~~~~~~~~~~~~~~~~~~~~~

src/pages/property-manage/report-manage/deposit-report/index.vue:200:12 - error TS2304: Cannot find name 'refundStatusOptions'.

200   options: refundStatusOptions,
               ~~~~~~~~~~~~~~~~~~~
```

3. **`src/pages/property-manage/report-manage/fee-reminder/index.vue:142`**

```log
src/pages/property-manage/report-manage/fee-reminder/index.vue:142:12 - error TS2304: Cannot find name '提醒类型Options'.

142   options: 提醒类型Options,
               ~~~~~~~~~~~
```

4. **`src/pages/property-manage/report-manage/owner-payment-details/index.vue`**（4 个错误）

```log
src/pages/property-manage/report-manage/owner-payment-details/index.vue:145:8 - error TS2304: Cannot find name 'tableData'.

145  data: tableData.value,
           ~~~~~~~~~

src/pages/property-manage/report-manage/owner-payment-details/index.vue:147:14 - error TS2304: Cannot find name 'pagination'.

147  pagination: pagination.value,
                 ~~~~~~~~~~

src/pages/property-manage/report-manage/owner-payment-details/index.vue:237:2 - error TS2304: Cannot find name 'resetParams'.

237  resetParams();
     ~~~~~~~~~~~

src/pages/property-manage/report-manage/owner-payment-details/index.vue:242:2 - error TS2304: Cannot find name 'updateParams'.

242  updateParams({ ...plusSearchModel.value, pageIndex: 1 });
     ~~~~~~~~~~~~
```

5. **`src/pages/property-manage/report-manage/patrol-report/index.vue`**（4 个错误）

```log
src/pages/property-manage/report-manage/patrol-report/index.vue:126:12 - error TS2304: Cannot find name '巡检类型Options'.

126   options: 巡检类型Options,
               ~~~~~~~~~~~

src/pages/property-manage/report-manage/patrol-report/index.vue:132:12 - error TS2304: Cannot find name '巡检级别Options'.

132   options: 巡检级别Options,
               ~~~~~~~~~~~

src/pages/property-manage/report-manage/patrol-report/index.vue:143:12 - error TS2304: Cannot find name '状态Options'.

143   options: 状态Options,
               ~~~~~~~~~

src/pages/property-manage/report-manage/patrol-report/index.vue:149:12 - error TS2304: Cannot find name '小区Options'.

149   options: 小区Options,
               ~~~~~~~~~
```

6. **`src/pages/property-manage/report-manage/payment-details-form/index.vue`**（6 个错误）

```log
src/pages/property-manage/report-manage/payment-details-form/index.vue:19:9 - error TS2304: Cannot find name 'mockTableData'.

19  total: mockTableData.length,
           ~~~~~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:186:12 - error TS2304: Cannot find name '支付方式Options'.

186   options: 支付方式Options,
               ~~~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:192:12 - error TS2304: Cannot find name '费用状态Options'.

192   options: 费用状态Options,
               ~~~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:198:12 - error TS2304: Cannot find name 'feeTypeOptions'.

198   options: feeTypeOptions,
               ~~~~~~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:204:12 - error TS2304: Cannot find name '费用项Options'.

204   options: 费用项Options,
               ~~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:215:12 - error TS2304: Cannot find name '小区Options'.

215   options: 小区Options,
               ~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:230:21 - error TS2304: Cannot find name 'mockTableData'.

230  let filteredData = mockTableData;
                        ~~~~~~~~~~~~~
```

7. **`src/pages/setting-manage/system-manage/initialize-cell/components/form.vue`**（2 个错误）

```log
src/pages/setting-manage/system-manage/initialize-cell/components/form.vue:8:60 - error TS2304: Cannot find name 'InitializeCommunityFormVO'.

8 const defaultValues = props.defaultValues as FieldValues & InitializeCommunityFormVO;
                                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~

src/pages/setting-manage/system-manage/initialize-cell/components/form.vue:21:64 - error TS2304: Cannot find name 'InitializeCommunityFormVO'.

21 const toRefForm = structuredClone(props.form) as FieldValues & InitializeCommunityFormVO;
                                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~
```

#### 3.3.3 修复建议

- 从 `@01s-11comm/type` 或本地模块正确导入缺失的类型和变量
- 检查变量名拼写是否正确
- 确认导出的成员名称与导入的名称一致

### 3.4 属性不存在错误（TS2339）

#### 3.4.1 错误描述

对象上不存在指定的属性，主要是 `doFetch` 方法缺失。

#### 3.4.2 涉及文件（13 个错误）

1. **`src/pages/operation-team/data-manage/-detail-page/manage-community-[id].vue:279`**

```log
src/pages/operation-team/data-manage/-detail-page/manage-community-[id].vue:279:49 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: FieldValues; plusSearchProps: { [x: string]: any; [x: number]: any; [x: symbol]: any; modelValue?: FieldValues; defaultValues?: FieldValues; ... 42 more ...; class?: any; }; ... 52 more ...; $loading: { ...; }; }'.

279   <PureTableBar :="pureTableBarProps" @refresh="doFetch">
                                                    ~~~~~~~
```

2. **`src/pages/property-manage/report-manage/owner-payment-details/index.vue`**（2 个错误）

```log
src/pages/property-manage/report-manage/owner-payment-details/index.vue:256:49 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: { [x: string]: FieldValueType; [x: number]: FieldValueType; [x: symbol]: FieldValueType; houseNumberContractName?: string; ... 7 more ...; pageSize: number; }; ... 49 more ...; $loading: { ...; }; }'.

256   <PureTableBar :="pureTableBarProps" @refresh="doFetch">
                                                    ~~~~~~~

src/pages/property-manage/report-manage/owner-payment-details/index.vue:258:35 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: { [x: string]: FieldValueType; [x: number]: FieldValueType; [x: symbol]: FieldValueType; houseNumberContractName?: string; ... 7 more ...; pageSize: number; }; ... 49 more ...; $loading: { ...; }; }'.

258     <ElButton type="info" @click="doFetch">
                                      ~~~~~~~
```

3. **`src/pages/property-manage/report-manage/payment-details-form/index.vue:319`**

```log
src/pages/property-manage/report-manage/payment-details-form/index.vue:319:49 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: { [x: string]: FieldValueType; [x: number]: FieldValueType; [x: symbol]: FieldValueType; time?: string; expenseItemId?: string; expenseItemName?: string; status?: string; pageIndex?: number; pageSize?: number; }; ... 51 more ...; $loading: { ...; }; }'.

319   <PureTableBar :="pureTableBar Props" @refresh="doFetch">
                                                    ~~~~~~~
```

4. **`src/pages/property-manage/report-manage/repair-report-form/index.vue:300`**

```log
src/pages/property-manage/report-manage/repair-report-form/index.vue:300:49 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: { [x: string]: FieldValueType; [x: number]: FieldValueType; [x: symbol]: FieldValueType; repairType?: string; repairStatus?: string; ... 8 more ...; pageSize: number; }; ... 51 more ...; $loading: { ...; }; }'.

300   <PureTableBar :="pureTableBarProps" @refresh="doFetch">
                                                    ~~~~~~~
```

5. **`src/pages/property-manage/report-manage/repair-reports-summary-table/index.vue:196`**

```log
src/pages/property-manage/report-manage/repair-reports-summary-table/index.vue:196:49 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: { [x: string]: FieldValueType; [x: number]: FieldValueType; [x: symbol]: FieldValueType; repairType?: string; repairStatus?: string; ... 5 more ...; pageSize?: number; }; ... 52 more ...; $loading: { ...; }; }'.

196   <PureTableBar :="pureTableBarProps" @refresh="doFetch">
                                                    ~~~~~~~
```

6. **`src/pages/setting-manage/organize-manage/data-permission/components/staff-relation/table.vue:163`**

```log
src/pages/setting-manage/organize-manage/data-permission/components/staff-relation/table.vue:163:49 - error TS2339: Property 'doFetch' does not exist on type '{ plusSearchModel: { [x: string]: FieldValueType; [x: number]: FieldValueType; [x: symbol]: FieldValueType; name?: string; phone?: string; }; ... 51 more ...; $loading: { ...; }; }'.

163   <PureTableBar :="pureTableBarProps" @refresh="doFetch">
                                                    ~~~~~~~
```

7. **`src/pages/setting-manage/organize-manage/data-permission/components/unit-auth/table.vue:190`**

```log
src/pages/setting-manage/organize-manage/data-permission/components/unit-auth/table.vue:190:49 - error TS2339: Property 'doFetch' does not exist on type '{ pureTableBarProps: { title?: string; columns?: { hide?: boolean | CallableFunction; slot?: string; headerSlot?: string; filterIconSlot?: string; expandSlot?: string; children?: ...[]; ... 30 more ...; tooltipFormatter?: (data: { ...; }) => string | VNode<...>; }[]; tableKey?: string | number; isExpandAll?: boolean...'.

190   <PureTableBar :="pureTableBarProps" @refresh="doFetch">
                                                    ~~~~~~~
```

8. **`src/pages/property-manage/repairs-manage/return-visit/index.vue`**（7 个错误）

```log
src/pages/property-manage/repairs-manage/return-visit/index.vue:206:28 - error TS2339: Property 'workOrderNumber' does not exist on type 'ReturnVisitListItem'.

206      workOrderNumber: row?.workOrderNumber || "",
                               ~~~~~~~~~~~~~~~

src/pages/property-manage/repairs-manage/return-visit/index.vue:207:21 - error TS2339: Property 'location' does not exist on type 'ReturnVisitListItem'.

207      location: row?.location || "",
                        ~~~~~~~~

src/pages/property-manage/repairs-manage/return-visit/index.vue:208:23 - error TS2339: Property 'repairType' does not exist on type 'ReturnVisitListItem'.

208      repairType: row?.repairType || "",
                          ~~~~~~~~~~

src/pages/property-manage/repairs-manage/return-visit/index.vue:209:21 - error TS2339: Property 'reporter' does not exist on type 'ReturnVisitListItem'.

209      reporter: row?.reporter || "",
                        ~~~~~~~~

src/pages/property-manage/repairs-manage/return-visit/index.vue:210:24 - error TS2339: Property 'contactInfo' does not exist on type 'ReturnVisitListItem'.

210      contactInfo: row?.contactInfo || "",
                           ~~~~~~~~~~~

src/pages/property-manage/repairs-manage/return-visit/index.vue:211:28 - error TS2339: Property 'appointmentTime' does not exist on type 'ReturnVisitListItem'.

211      appointmentTime: row?.appointmentTime || "",
                               ~~~~~~~~~~~~~~~

src/pages/property-manage/repairs-manage/return-visit/index.vue:212:30 - error TS2339: Property 'returnVisitStatus' does not exist on type 'ReturnVisitListItem'.

212      returnVisitStatus: row?.returnVisitStatus || "",
                                 ~~~~~~~~~~~~~~~~~
```

#### 3.4.3 修复建议

- 确保 `useListQuery` 组合式函数返回了 `doFetch` 方法
- 检查 `ReturnVisitListItem` 类型定义，补充缺失的属性
- 验证组合式函数的返回值类型定义

### 3.5 模块导出缺失错误（TS2305）

#### 3.5.1 错误描述

模块中不存在指定的导出成员。

#### 3.5.2 涉及文件（4 个错误）

1. **`src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.vue:8`**

```log
src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.vue:8:49 - error TS2305: Module '"./form"' has no exported member '车位结构图表单_VO'.

8 import { ParkingSpaceStructureDiagramFormProps, 车位结构图表单_VO } from "./form";
                                                  ~~~~~~~~~~
```

2. **`src/pages/setting-manage/system-manage/initialize-cell/components/form.vue:3`**

```log
src/pages/setting-manage/system-manage/initialize-cell/components/form.vue:3:45 - error TS2305: Module '"./form"' has no exported member 'statusOptions'.

3 import { type InitializeCommunityFormProps, statusOptions } from "./form";
                                              ~~~~~~~~~~~~~
```

3. **`src/pages/setting-manage/system-manage/system-config/index.vue:22`**

```log
src/pages/setting-manage/system-manage/system-config/index.vue:22:15 - error TS2305: Module '"@01s-11comm/type"' has no exported member 'SystemConfig'.

22 import type { SystemConfig } from "@01s-11comm/type";
                 ~~~~~~~~~~~~
```

#### 3.5.3 修复建议

- 检查模块是否正确导出了指定的成员
- 确认导出的成员名称拼写正确
- 如果成员不存在，需要在对应模块中添加导出

### 3.6 导出成员名称错误（TS2724）

#### 3.6.1 错误描述

导出成员名称错误或不存在，TypeScript 提供了可能的正确名称建议。

#### 3.6.2 涉及文件（4 个错误）

1. **`src/pages/property-manage/repairs-manage/repairs-have-done/components/form.vue:4`**

```log
src/pages/property-manage/repairs-manage/repairs-have-done/components/form.vue:4:41 - error TS2724: '"./form"' has no exported member named 'RepairsHaveDoneFormVO'. Did you mean 'RepairsHaveDoneFormProps'?

4 import { RepairsHaveDoneFormProps, type RepairsHaveDoneFormVO } from "./form";
                                          ~~~~~~~~~~~~~~~~~~~~~
```

2. **`src/pages/property-manage/repairs-manage/repairs-have-done/index.vue:16`**

```log
src/pages/property-manage/repairs-manage/repairs-have-done/index.vue:16:59 - error TS2724: '"./components/form"' has no exported member named 'RepairsHaveDoneFormVO'. Did you mean 'RepairsHaveDoneFormProps'?

16 import { type RepairsHaveDoneFormProps, defaultForm, type RepairsHaveDoneFormVO } from "./components/form";
                                                             ~~~~~~~~~~~~~~~~~~~~~
```

3. **`src/pages/property-manage/report-manage/statement-expenses/index.vue:17`**

```log
src/pages/property-manage/report-manage/statement-expenses/index.vue:17:2 - error TS2724: '"@01s-11comm/type"' has no exported member named 'expenseStatusOptions'. Did you mean 'expireStatusOptions'?

17  expenseStatusOptions,
    ~~~~~~~~~~~~~~~~~~~~
```

4. **`src/pages/setting-manage/system-manage/system-config/index.vue:14`**

```log
src/pages/setting-manage/system-manage/system-config/index.vue:14:56 - error TS2724: '"./components/form"' has no exported member named 'SystemConfigFormVO'. Did you mean 'SystemConfigFormProps'?

14 import { type SystemConfigFormProps, defaultForm, type SystemConfigFormVO } from "./components/form";
                                                        ~~~~~~~~~~~~~~~~~~
```

#### 3.6.3 修复建议

- 使用 TypeScript 建议的正确名称
- 检查类型定义文件，确认正确的导出名称
- 如果需要使用的类型确实不存在，需要在对应模块中添加

### 3.7 值被用作类型错误（TS2749）

#### 3.7.1 错误描述

值被错误地用作类型，应该使用 `typeof` 操作符。

#### 3.7.2 涉及文件（3 个错误）

**`src/pages/property-manage/community-manage/my/index.vue`**（3 个错误）

```log
src/pages/property-manage/community-manage/my/index.vue:224:33 - error TS2749: 'CommunityManageMyFormVO' refers to a value, but is being used as a type here. Did you mean 'typeof CommunityManageMyFormVO'?

224  const CommunityManageMyFormVO: CommunityManageMyFormVO = isAdd.value
                                    ~~~~~~~~~~~~~~~~~~~~~~~

src/pages/property-manage/community-manage/my/index.vue:229:34 - error TS2749: 'CommunityManageMyFormVO' refers to a value, but is being used as a type here. Did you mean 'typeof CommunityManageMyFormVO'?

229      province: (row?.province as CommunityManageMyFormVO["province"]) || "福建省",
                                     ~~~~~~~~~~~~~~~~~~~~~~~

src/pages/property-manage/community-manage/my/index.vue:238:30 - error TS2749: 'CommunityManageMyFormVO' refers to a value, but is being used as a type here. Did you mean 'typeof CommunityManageMyFormVO'?

238      status: (row?.status as CommunityManageMyFormVO["status"]) || "正常运营",
                                 ~~~~~~~~~~~~~~~~~~~~~~~
```

#### 3.7.3 修复建议

- 使用 `typeof CommunityManageMyFormVO` 而不是直接使用 `CommunityManageMyFormVO` 作为类型
- 或者将 `CommunityManageMyFormVO` 定义为类型而不是值

### 3.8 函数重载不匹配错误（TS2769）

#### 3.8.1 错误描述

dayjs 函数的参数类型不兼容，不能将 `FieldValueType` 类型的值传递给 dayjs。

#### 3.8.2 涉及文件（2 个错误）

**`src/pages/property-manage/report-manage/payment-details-form/index.vue`**（2 个错误）

```log
src/pages/property-manage/report-manage/payment-details-form/index.vue:233:23 - error TS2769: No overload matches this call.
  Overload 1 of 3, '(date?: string | number | Date | Dayjs): Dayjs', gave the following error.
    Argument of type 'string | number | true | string[] | Date | number[] | [string, string] | [number, number] | boolean[] | string[][] | [Date, Date] | Date[] | number[][] | RecordType' is not assignable to parameter of type 'string | number | Date | Dayjs'.
      Type 'boolean' is not assignable to type 'string | number | Date | Dayjs'.
  Overload 2 of 3, '(date?: string | number | Date | Dayjs, format?: OptionType, strict?: boolean): Dayjs', gave the following error.
    Argument of type 'string | number | true | string[] | Date | number[] | [string, string] | [number, number] | boolean[] | string[][] | [Date, Date] | Date[] | number[][] | RecordType' is not assignable to parameter of type 'string | number | Date | Dayjs'.
      Type 'boolean' is not assignable to type 'string | number | Date | Dayjs'.
  Overload 3 of 3, '(date?: string | number | Date | Dayjs, format?: OptionType, locale?: string, strict?: boolean): Dayjs', gave the following error.
    Argument of type 'string | number | true | string[] | Date | number[] | [string, string] | [number, number] | boolean[] | string[][] | [Date, Date] | Date[] | number[][] | RecordType' is not assignable to parameter of type 'string | number | Date | Dayjs'.
      Type 'boolean' is not assignable to type 'string | number | Date | Dayjs'.

233   const start = dayjs(plusSearchModel.value.缴费开始时间);
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/pages/property-manage/report-manage/payment-details-form/index.vue:234:21 - error TS2769: No overload matches this call.
  Overload 1 of 3, '(date?: string | number | Date | Dayjs): Dayjs', gave the following error.
    Argument of type 'string | number | true | string[] | Date | number[] | [string, string] | [number, number] | boolean[] | string[][] | [Date, Date] | Date[] | number[][] | RecordType' is not assignable to parameter of type 'string | number | Date | Dayjs'.
      Type 'boolean' is not assignable to type 'string | number | Date | Dayjs'.
  Overload 2 of 3, '(date?: string | number | Date | Dayjs, format?: OptionType, strict?: boolean): Dayjs', gave the following error.
    Argument of type 'string | number | true | string[] | Date | number[] | [string, string] | [number, number] | boolean[] | string[][] | [Date, Date] | Date[] | number[][] | RecordType' is not assignable to parameter of type 'string | number | Date | Dayjs'.
      Type 'boolean' is not assignable to type 'string | number | Date | Dayjs'.
  Overload 3 of 3, '(date?: string | number | Date | Dayjs, format?: OptionType, locale?: string, strict?: boolean): Dayjs', gave the following error.
    Argument of type 'string | number | true | string[] | Date | number[] | [string, string] | [number, number] | boolean[] | string[][] | [Date, Date] | Date[] | number[][] | RecordType' is not assignable to parameter of type 'string | number | Date | Dayjs'.
      Type 'boolean' is not assignable to type 'string | number | Date | Dayjs'.

234   const end = dayjs(plusSearchModel.value.缴费结束时间);
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

#### 3.8.3 修复建议

- 在传递给 dayjs 之前，先进行类型断言或类型守卫
- 确保传递的值是 `string | number | Date | Dayjs` 类型之一

### 3.9 类型导入错误（TS1361）

#### 3.9.1 错误描述

使用 `import type` 导入的值不能作为值使用。

#### 3.9.2 涉及文件（1 个错误）

**`src/pages/property-manage/report-manage/fee-reminder/index.vue:132`**

```log
src/pages/property-manage/report-manage/fee-reminder/index.vue:132:12 - error TS1361: 'expenseItemNameOptions' cannot be used as a value because it was imported using 'import type'.

132   options: expenseItemNameOptions,
               ~~~~~~~~~~~~~~~~~~~~~~

  src/pages/property-manage/report-manage/fee-reminder/index.vue:18:2
    18  expenseItemNameOptions,
        ~~~~~~~~~~~~~~~~~~~~~~
    'expenseItemNameOptions' was imported here.
```

#### 3.9.3 修复建议

- 将 `import type { expenseItemNameOptions }` 改为 `import { expenseItemNameOptions }`
- 因为 `expenseItemNameOptions` 是一个值（常量），不是类型

### 3.10 对象字面量错误（TS2353）

#### 3.10.1 错误描述

对象字面量包含未知属性。

#### 3.10.2 涉及文件（1 个错误）

**`src/views/tabs/index.vue:84`**

```log
src/views/tabs/index.vue:84:5 - error TS2353: Object literal may only specify known properties, and 'value' does not exist in type 'TreeOptionProps'.

84     value: 'uniqueId',
       ~~~~~

  ../../node_modules/.pnpm/element-plus@2.13.0_vue@3.5.26_typescript@5.9.3_/node_modules/element-plus/es/components/tree-select/src/tree-select.vue.d.ts:401:5
    401     props: import("element-plus/es/components/tree").TreeOptionProps;
            ~~~~~
    The expected type comes from property 'props' which is declared here on type 'Partial<{ data: TreeData; disabled: EpPropMergeType<BooleanConstructor, unknown, unknown>; tabindex: EpPropMergeType<(StringConstructor | NumberConstructor)[], unknown, unknown>; ... 47 more ...; cacheData: unknown[]; }> & Omit<...> & Record<...>'
```

#### 3.10.3 修复建议

- 检查 Element Plus TreeSelect 组件的 `props` 配置
- 使用正确的属性名称，可能应该使用 `key` 而不是 `value`

## 4. 按文件分类的错误清单

### 4.1 开发团队模块

#### 4.1.1 配置管理-类型管理

**文件**：`src/pages/dev-team/config-manage/type/components/form.vue`

**错误数量**：2

**错误类型**：TS2352 - FieldValues 类型转换错误

**错误详情**：

- 第 23 行：`defaultValues` 类型转换错误
- 第 34 行：`toRefForm` 类型转换错误

### 4.2 运营团队模块

#### 4.2.1 数据管理-社区详情页

**文件**：`src/pages/operation-team/data-manage/-detail-page/manage-community-[id].vue`

**错误数量**：1

**错误类型**：TS2339 - 属性不存在

**错误详情**：

- 第 279 行：`doFetch` 方法不存在

#### 4.2.2 系统管理-初始化小区

**文件**：`src/pages/operation-team/system-manage/initialize-cell/components/form.vue`

**错误数量**：2

**错误类型**：TS2352 - FieldValues 类型转换错误

**错误详情**：

- 第 16 行：`defaultValues` 类型转换错误
- 第 29 行：`toRefForm` 类型转换错误

### 4.3 物业管理模块

#### 4.3.1 社区管理-房屋装修

**文件**：`src/pages/property-manage/community-manage/house-decoration/index.vue`

**错误数量**：1

**错误类型**：TS2322 - 类型不匹配

**错误详情**：

- 第 264 行：`status` 字段类型不匹配

#### 4.3.2 社区管理-我的社区

**文件**：`src/pages/property-manage/community-manage/my/index.vue`

**错误数量**：3

**错误类型**：TS2749 - 值被用作类型

**错误详情**：

- 第 224 行：`CommunityManageMyFormVO` 被错误地用作类型
- 第 229 行：`CommunityManageMyFormVO["province"]` 类型使用错误
- 第 238 行：`CommunityManageMyFormVO["status"]` 类型使用错误

#### 4.3.3 社区管理-车位结构图

**文件**：`src/pages/property-manage/community-manage/parking-space-structure-diagram/components/form.vue`

**错误数量**：1

**错误类型**：TS2305 - 模块导出缺失

**错误详情**：

- 第 8 行：`车位结构图表单_VO` 导出成员不存在

#### 4.3.4 合同管理-合同草稿

**文件**：`src/pages/property-manage/contract-manage/draft-contract/index.vue`

**错误数量**：1

**错误类型**：TS2304 - 找不到名称

**错误详情**：

- 第 81 行：`contractTypeOptionsData` 未定义

#### 4.3.5 房产管理-房屋管理

**文件**：`src/pages/property-manage/house-property-manage/house/index.vue`

**错误数量**：2

**错误类型**：TS2322 - 类型不匹配

**错误详情**：

- 第 29 行：`houseStatus` 空字符串不能赋值给枚举类型
- 第 30 行：`houseType` 空字符串不能赋值给枚举类型

#### 4.3.6 停车管理-停车场管理

**文件**：`src/pages/property-manage/parking-manage/parking-lot/index.vue`

**错误数量**：2

**错误类型**：TS2322 - 类型不匹配

**错误详情**：

- 第 31 行：`parkingLotType` 中文值不匹配英文枚举
- 第 32 行：`parkingSpaceType` 中文值不匹配英文枚举

#### 4.3.7 巡检管理-巡检详情

**文件**：`src/pages/property-manage/patrol-manage/detail/index.vue`

**错误数量**：1

**错误类型**：TS2322 - 类型不匹配

**错误详情**：

- 第 263 行：`patrolMethod` 字段类型不匹配

#### 4.3.8 维修管理-已完成维修

**文件**：

- `src/pages/property-manage/repairs-manage/repairs-have-done/components/form.vue`
- `src/pages/property-manage/repairs-manage/repairs-have-done/index.vue`

**错误数量**：2

**错误类型**：TS2724 - 导出成员名称错误

**错误详情**：

- `RepairsHaveDoneFormVO` 导出成员不存在，应该使用 `RepairsHaveDoneFormProps`

#### 4.3.9 维修管理-回访管理

**文件**：`src/pages/property-manage/repairs-manage/return-visit/index.vue`

**错误数量**：7

**错误类型**：TS2339 - 属性不存在

**错误详情**：

- 第 206-212 行：`ReturnVisitListItem` 类型缺少多个属性定义

#### 4.3.10 报表管理-押金报表

**文件**：`src/pages/property-manage/report-manage/deposit-report/index.vue`

**错误数量**：3

**错误类型**：TS2304 - 找不到名称

**错误详情**：

- 第 172 行：`feeItemNameOptions` 未定义
- 第 184 行：`chargeObjectTypeOptions` 未定义
- 第 200 行：`refundStatusOptions` 未定义

#### 4.3.11 报表管理-费用提醒

**文件**：`src/pages/property-manage/report-manage/fee-reminder/index.vue`

**错误数量**：2

**错误类型**：

- TS1361 - 类型导入错误（1 个）
- TS2304 - 找不到名称（1 个）

**错误详情**：

- 第 132 行：`expenseItemNameOptions` 使用 `import type` 导入但作为值使用
- 第 142 行：`提醒类型Options` 未定义

#### 4.3.12 报表管理-业主缴费明细

**文件**：`src/pages/property-manage/report-manage/owner-payment-details/index.vue`

**错误数量**：6

**错误类型**：

- TS2304 - 找不到名称（4 个）
- TS2339 - 属性不存在（2 个）

**错误详情**：

- 第 145 行：`tableData` 未定义
- 第 147 行：`pagination` 未定义
- 第 237 行：`resetParams` 未定义
- 第 242 行：`updateParams` 未定义
- 第 256 行：`doFetch` 方法不存在
- 第 258 行：`doFetch` 方法不存在

#### 4.3.13 报表管理-巡检报表

**文件**：`src/pages/property-manage/report-manage/patrol-report/index.vue`

**错误数量**：4

**错误类型**：TS2304 - 找不到名称

**错误详情**：

- 第 126 行：`巡检类型Options` 未定义
- 第 132 行：`巡检级别Options` 未定义
- 第 143 行：`状态Options` 未定义
- 第 149 行：`小区Options` 未定义

#### 4.3.14 报表管理-缴费明细表

**文件**：`src/pages/property-manage/report-manage/payment-details-form/index.vue`

**错误数量**：10

**错误类型**：

- TS2304 - 找不到名称（7 个）
- TS2769 - 函数重载不匹配（2 个）
- TS2339 - 属性不存在（1 个）

**错误详情**：

- 第 19 行：`mockTableData` 未定义
- 第 186 行：`支付方式Options` 未定义
- 第 192 行：`费用状态Options` 未定义
- 第 198 行：`feeTypeOptions` 未定义
- 第 204 行：`费用项Options` 未定义
- 第 215 行：`小区Options` 未定义
- 第 230 行：`mockTableData` 未定义
- 第 233 行：dayjs 参数类型不兼容
- 第 234 行：dayjs 参数类型不兼容
- 第 319 行：`doFetch` 方法不存在

#### 4.3.15 报表管理-维修报表

**文件**：`src/pages/property-manage/report-manage/repair-report-form/index.vue`

**错误数量**：1

**错误类型**：TS2339 - 属性不存在

**错误详情**：

- 第 300 行：`doFetch` 方法不存在

#### 4.3.16 报表管理-维修汇总表

**文件**：`src/pages/property-manage/report-manage/repair-reports-summary-table/index.vue`

**错误数量**：1

**错误类型**：TS2339 - 属性不存在

**错误详情**：

- 第 196 行：`doFetch` 方法不存在

#### 4.3.17 报表管理-费用报表

**文件**：`src/pages/property-manage/report-manage/statement-expenses/index.vue`

**错误数量**：1

**错误类型**：TS2724 - 导出成员名称错误

**错误详情**：

- 第 17 行：`expenseStatusOptions` 不存在，应该使用 `expireStatusOptions`

### 4.4 设置管理模块

#### 4.4.1 组织管理-数据权限-员工关系

**文件**：`src/pages/setting-manage/organize-manage/data-permission/components/staff-relation/table.vue`

**错误数量**：1

**错误类型**：TS2339 - 属性不存在

**错误详情**：

- 第 163 行：`doFetch` 方法不存在

#### 4.4.2 组织管理-数据权限-单位授权

**文件**：`src/pages/setting-manage/organize-manage/data-permission/components/unit-auth/table.vue`

**错误数量**：1

**错误类型**：TS2339 - 属性不存在

**错误详情**：

- 第 190 行：`doFetch` 方法不存在

#### 4.4.3 系统管理-初始化小区

**文件**：`src/pages/setting-manage/system-manage/initialize-cell/components/form.vue`

**错误数量**：3

**错误类型**：

- TS2305 - 模块导出缺失（1 个）
- TS2304 - 找不到名称（2 个）

**错误详情**：

- 第 3 行：`statusOptions` 导出成员不存在
- 第 8 行：`InitializeCommunityFormVO` 未定义
- 第 21 行：`InitializeCommunityFormVO` 未定义

#### 4.4.4 系统管理-系统配置

**文件**：`src/pages/setting-manage/system-manage/system-config/index.vue`

**错误数量**：2

**错误类型**：

- TS2724 - 导出成员名称错误（1 个）
- TS2305 - 模块导出缺失（1 个）

**错误详情**：

- 第 14 行：`SystemConfigFormVO` 不存在，应该使用 `SystemConfigFormProps`
- 第 22 行：`SystemConfig` 类型在 `@01s-11comm/type` 中不存在

### 4.5 通用视图模块

#### 4.5.1 标签页管理

**文件**：`src/views/tabs/index.vue`

**错误数量**：1

**错误类型**：TS2353 - 对象字面量错误

**错误详情**：

- 第 84 行：TreeSelect 组件的 `props` 配置中 `value` 属性不存在

## 5. 修复优先级建议

### 5.1 高优先级（影响多个模块的通用问题）

1. **FieldValues 类型转换问题**（6 个错误）
   - 影响范围：开发团队、运营团队模块
   - 修复方式：统一处理 FieldValues 类型转换逻辑

2. **doFetch 方法缺失**（8 个错误）
   - 影响范围：多个报表管理页面、数据权限页面
   - 修复方式：检查 `useListQuery` 组合式函数的返回值类型定义

3. **Options 变量未定义**（15 个错误）
   - 影响范围：多个报表管理页面
   - 修复方式：从 `@01s-11comm/type` 正确导入或定义缺失的 Options

### 5.2 中优先级（影响单个模块但错误较多）

1. **ReturnVisitListItem 类型定义不完整**（7 个错误）
   - 影响范围：维修管理-回访管理
   - 修复方式：补充 `ReturnVisitListItem` 类型的属性定义

2. **payment-details-form 页面问题**（10 个错误）
   - 影响范围：报表管理-缴费明细表
   - 修复方式：补充缺失的变量定义和修复 dayjs 类型问题

### 5.3 低优先级（单个错误或影响范围小）

1. **导出成员名称错误**（4 个错误）
   - 修复方式：使用正确的导出成员名称

2. **值被用作类型**（3 个错误）
   - 修复方式：使用 `typeof` 操作符或修改类型定义

3. **其他单个错误**
   - 逐个分析并修复

## 6. 修复策略建议

### 6.1 批量修复策略

#### 6.1.1 FieldValues 类型转换统一处理

**问题文件**：

- `src/pages/dev-team/config-manage/type/components/form.vue`
- `src/pages/operation-team/system-manage/initialize-cell/components/form.vue`

**统一修复方案**：

```typescript
// 方案 1：通过 unknown 中间类型转换
const defaultValues = props.defaultValues as unknown as FieldValues & DictionaryTypeFormVO;
const toRefForm = cloneDeep(props.form) as unknown as FieldValues & DictionaryTypeFormVO;

// 方案 2：为业务类型添加索引签名（推荐）
// 在类型定义文件中
export interface DictionaryTypeFormVO {
	[key: string]: any; // 添加索引签名
	// ... 其他属性
}
```

#### 6.1.2 doFetch 方法缺失统一处理

**问题文件**：8 个文件涉及 `doFetch` 方法缺失

**统一修复方案**：

```typescript
// 检查 useListQuery 组合式函数的返回值
// 确保返回了 doFetch 方法
const {
	plusSearchModel,
	pureTableBarProps,
	doFetch, // 确保导出了 doFetch
	// ... 其他返回值
} = useListQuery({
	// ... 配置
});
```

#### 6.1.3 Options 变量批量导入

**问题文件**：多个报表管理页面

**统一修复方案**：

```typescript
// 从 @01s-11comm/type 统一导入
import {
	feeItemNameOptions,
	chargeObjectTypeOptions,
	refundStatusOptions,
	expenseItemNameOptions,
	feeTypeOptions,
	// ... 其他 Options
} from "@01s-11comm/type";
```

### 6.2 专项修复策略

#### 6.2.1 枚举类型值修复

**问题**：中文值不匹配英文枚举类型

**修复方案**：

```typescript
// 错误写法
parkingLotType: "地下停车场",
parkingSpaceType: "标准车位",

// 正确写法
parkingLotType: "underground",
parkingSpaceType: "standard",

// 或者使用映射函数
const parkingLotTypeMap = {
  "地下停车场": "underground",
  "地上停车场": "ground",
  // ...
};
```

#### 6.2.2 空字符串枚举问题修复

**问题**：空字符串不能赋值给枚举类型

**修复方案**：

```typescript
// 错误写法
houseStatus: "",
houseType: "",

// 正确写法 1：使用 undefined
houseStatus: undefined,
houseType: undefined,

// 正确写法 2：使用枚举的默认值
houseStatus: HouseStatus.Available,
houseType: HouseType.Residential,
```

#### 6.2.3 import type 错误修复

**问题**：使用 `import type` 导入的值不能作为值使用

**修复方案**：

```typescript
// 错误写法
import type { expenseItemNameOptions } from "@01s-11comm/type";

// 正确写法
import { expenseItemNameOptions } from "@01s-11comm/type";
```

### 6.3 类型定义补充策略

#### 6.3.1 ReturnVisitListItem 类型补充

**文件**：`apps/type/src/business/property-manage/repairs-manage/return-visit.ts`

**需要补充的属性**：

```typescript
export interface ReturnVisitListItem {
	// 现有属性...

	// 需要补充的属性
	workOrderNumber?: string; // 工单号
	location?: string; // 位置
	repairType?: string; // 维修类型
	reporter?: string; // 报修人
	contactInfo?: string; // 联系方式
	appointmentTime?: string; // 预约时间
	returnVisitStatus?: string; // 回访状态
}
```

#### 6.3.2 缺失类型定义补充

**需要在类型项目中补充的类型**：

1. `SystemConfig` - 系统配置类型
2. `车位结构图表单_VO` - 车位结构图表单类型
3. `InitializeCommunityFormVO` - 初始化社区表单类型
4. `RepairsHaveDoneFormVO` - 已完成维修表单类型
5. `SystemConfigFormVO` - 系统配置表单类型

## 7. 执行计划

### 7.1 第一阶段：批量修复（预计修复 35+ 错误）

1. **FieldValues 类型转换**（6 个错误）
   - 为业务类型添加索引签名
   - 或使用 unknown 中间类型

2. **doFetch 方法缺失**（8 个错误）
   - 检查并修复 useListQuery 返回值类型

3. **Options 变量导入**（15+ 个错误）
   - 统一从 @01s-11comm/type 导入
   - 补充缺失的 Options 定义

### 7.2 第二阶段：专项修复（预计修复 15+ 错误）

1. **枚举类型值修复**（6 个错误）
   - 中文值转英文枚举值
   - 空字符串改为 undefined 或默认值

2. **ReturnVisitListItem 类型补充**（7 个错误）
   - 补充缺失的属性定义

3. **import type 错误修复**（1 个错误）
   - 移除不必要的 type 关键字

### 7.3 第三阶段：剩余错误修复（预计修复 10+ 错误）

1. **导出成员名称错误**（4 个错误）
   - 使用正确的导出成员名称

2. **值被用作类型**（3 个错误）
   - 使用 typeof 或修改类型定义

3. **其他单个错误**（3 个错误）
   - 逐个分析并修复

## 8. 验证方法

### 8.1 类型检查命令

```bash
# 检查类型项目
pnpm -F @01s-11comm/type typecheck

# 检查后台项目
pnpm -F @01s-11comm/admin typecheck

# 检查特定模块
pnpm -F @01s-11comm/admin typecheck 2>&1 | grep "property-manage/report-manage"
```

### 8.2 分阶段验证

1. **第一阶段验证**：错误数量应减少到 26 个以下
2. **第二阶段验证**：错误数量应减少到 11 个以下
3. **第三阶段验证**：错误数量应为 0

## 9. 注意事项

### 9.1 修复过程中的注意事项

1. **不要破坏现有功能**：修复类型错误时，确保不改变业务逻辑
2. **保持类型一致性**：使用统一的类型定义和命名规范
3. **及时测试验证**：每修复一批错误后，运行类型检查验证
4. **记录修复过程**：对于复杂的修复，记录修复思路和方案

### 9.2 长期维护建议

1. **建立类型检查 CI**：在 CI/CD 流程中加入类型检查步骤
2. **定期类型审查**：定期运行类型检查，及时发现和修复新的类型错误
3. **类型文档维护**：维护类型定义文档，方便团队成员查阅
4. **代码审查关注类型**：在代码审查时，重点关注类型定义的正确性

## 10. 总结

### 10.1 当前状态

- **类型项目**：✅ 无类型错误，状态良好
- **后台项目**：❌ 存在 61 个类型错误，需要系统性修复

### 10.2 主要问题

1. **FieldValues 类型转换**：6 个错误，需要统一处理
2. **doFetch 方法缺失**：8 个错误，组合式函数返回值类型问题
3. **Options 变量未定义**：15+ 个错误，导入和定义问题
4. **类型定义不完整**：多个业务类型缺少属性定义
5. **枚举类型使用不当**：中文值、空字符串等问题

### 10.3 预期成果

按照本报告提供的修复策略和执行计划，预计可以：

- 第一阶段修复 35+ 个错误（约 57%）
- 第二阶段修复 15+ 个错误（约 25%）
- 第三阶段修复剩余 10+ 个错误（约 18%）
- 最终实现零类型错误

### 10.4 后续行动

1. 按照优先级和执行计划逐步修复
2. 每个阶段完成后进行验证
3. 建立长期的类型检查和维护机制
4. 持续优化类型定义和使用规范

---

**报告生成时间**：2025-12-26  
**报告版本**：v1.0  
**下次更新**：修复完成后
