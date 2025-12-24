<!-- 作为提示词持续使用 已完成 -->

# 2025-12-24 类型错误清单报告

核心任务：

1. 务必要完整阅读 `CLAUDE.md` 文档的全部规范要求。
2. 阅读本文。
3. 按照本文所述的优先级，合理安排子代理的修改任务。按照次序逐步修复故障。
4. 禁止编写脚本完成批处理任务：
   > **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
5. 主动开启多个后台运行的子代理并行完成任务：
   - 请你主动的开启多个独立并行的修改子代理，加快修改任务。
   - 你新建的子代理**必须**是**后台运行**的子代理。

## 一、错误统计总览

| 项目                           | 错误数量 | 错误类型                                        |
| ------------------------------ | -------- | ----------------------------------------------- |
| `@01s-11comm/type` (类型项目)  | 4        | 导出冲突、导出成员缺失                          |
| `@01s-11comm/admin` (后台项目) | 224      | Mock 数据类型不匹配、类型导出缺失、类型名称错误 |
| **总计**                       | **228**  | -                                               |

---

## 二、类型项目错误清单 (`@01s-11comm/type`)

### 2.1 导出冲突问题 (TS2308)

**文件位置**: `src/business/index.ts`

| 序号 | 错误代码 | 冲突成员名                  | 说明                                                             |
| ---- | -------- | --------------------------- | ---------------------------------------------------------------- |
| 1    | `TS2308` | `RegisterProtocolListQuery` | 模块 `./setting-manage` 已导出此成员，考虑显式重新导出以解决歧义 |
| 2    | `TS2308` | `SystemConfig`              | 模块 `./setting-manage` 已导出此成员，考虑显式重新导出以解决歧义 |
| 3    | `TS2308` | `SystemConfigListQuery`     | 模块 `./setting-manage` 已导出此成员，考虑显式重新导出以解决歧义 |

**根因分析**: `RegisterProtocolListQuery`、`SystemConfig`、`SystemConfigListQuery` 这三个类型在多个模块中被导出，导致命名冲突。

---

### 2.2 导出成员缺失问题 (TS2724)

**文件位置**: `src/business/property-manage/contract-manage/index.ts`

| 序号 | 错误代码 | 错误位置           | 期望成员                  | 建议修正                             |
| ---- | -------- | ------------------ | ------------------------- | ------------------------------------ |
| 1    | `TS2724` | `./draft-contract` | `contractTypeOptionsData` | 使用 `draftContractTypeOptions` 替代 |

**根因分析**: `contractTypeOptionsData` 不存在，应使用 `draftContractTypeOptions`。

---

## 三、后台项目错误清单 (`@01s-11comm/admin`)

### 3.1 Mock 数据类型不匹配 (TS2322)

**文件位置**: `server/api/operation-team/data-manage/property-company/mock-data.ts`

此文件存在大量类型不匹配错误，主要涉及以下三个枚举类型：

| 枚举类型              | 错误值             | 说明         |
| --------------------- | ------------------ | ------------ |
| `PropertyCompanyType` | `"国企"`、`"民企"` | 期望值不匹配 |
| `ServiceLevel`        | `"一级"`、`"二级"` | 期望值不匹配 |
| `OperationStatus`     | `"正常运营"`       | 期望值不匹配 |

**错误分布** (共 156 处):

| 行号    | PropertyCompanyType | ServiceLevel | OperationStatus |
| ------- | ------------------- | ------------ | --------------- |
| 19-21   | "国企"              | "一级"       | "正常运营"      |
| 35-37   | "民企"              | "一级"       | "正常运营"      |
| 51-53   | "民企"              | "一级"       | "正常运营"      |
| 67-69   | "民企"              | "二级"       | "正常运营"      |
| 83-85   | "民企"              | "二级"       | "正常运营"      |
| 99-101  | "民企"              | "二级"       | "正常运营"      |
| 115-117 | "民企"              | "二级"       | "正常运营"      |
| 131-133 | "民企"              | "二级"       | "正常运营"      |
| 147-149 | "民企"              | "二级"       | "正常运营"      |
| 163-165 | "民企"              | "二级"       | "正常运营"      |
| 179-181 | "民企"              | "一级"       | "正常运营"      |
| 195-197 | "民企"              | "二级"       | "正常运营"      |
| 211-213 | "民企"              | "二级"       | "正常运营"      |
| 227-229 | "民企"              | "二级"       | "正常运营"      |
| 243-245 | "民企"              | "二级"       | "正常运营"      |
| 259-261 | "民企"              | "二级"       | "正常运营"      |
| 275-277 | "民企"              | "二级"       | "正常运营"      |
| ...     | 以此类推            | 以此类推     | 以此类推        |

**根因分析**: Mock 数据中使用的字符串值与类型定义中的枚举值不匹配。

---

### 3.2 类型导出缺失 (TS2305)

**文件位置**: 多处

| 序号 | 文件路径                                                                            | 缺失的导出成员           | 说明             |
| ---- | ----------------------------------------------------------------------------------- | ------------------------ | ---------------- |
| 1    | `src/api/operation-team/data-manage/property-company/index.ts`                      | `propertyCompanyOptions` | 模块无此导出成员 |
| 2    | `src/pages/operation-team/merchant-manage/merchant-admin/components/form.ts`        | `propertyCompanyOptions` | 模块无此导出成员 |
| 3    | `src/pages/operation-team/merchant-manage/merchant-info/components/form.ts`         | `MerchantType`           | 模块无此导出成员 |
| 4    | `src/pages/operation-team/merchant-manage/merchant-info/components/form.ts`         | `BusinessStatus`         | 模块无此导出成员 |
| 5    | `src/pages/operation-team/system-manage/community-configuration/components/form.ts` | `CommunityConfigFormVO`  | 模块无此导出成员 |
| 6    | `src/pages/setting-manage/system-manage/system-config/components/form.ts`           | `SystemConfigType`       | 模块无此导出成员 |
| 7    | `src/pages/setting-manage/system-manage/system-config/components/form.ts`           | `SystemConfigGroup`      | 模块无此导出成员 |
| 8    | `src/pages/setting-manage/system-manage/system-config/components/form.ts`           | `SystemConfigStatus`     | 模块无此导出成员 |
| 9    | `src/pages/property-manage/community-manage/handing-business/components/form.ts`    | `HandingBusinessFormVO`  | 模块无此导出成员 |
| 10   | `src/pages/property-manage/community-manage/notice/components/form.ts`              | `listDataToFormData`     | 模块无此导出成员 |

---

### 3.3 类型名称拼写/引用错误 (TS2724)

**文件位置**: 多处

| 序号 | 文件路径                                                                            | 错误成员名                      | 建议修正                            |
| ---- | ----------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------- |
| 1    | `src/api/operation-team/data-manage/property-company/index.ts`                      | `PropertyCompanyListQuery`      | 使用 `PropertyCompanyFormVO`        |
| 2    | `src/api/operation-team/data-manage/property-company/index.ts`                      | `PropertyCompanyTypeQuery`      | 使用 `PropertyCompanyType`          |
| 3    | `src/pages/operation-team/merchant-manage/merchant-info/components/form.ts`         | `merchantTypeOptions`           | 使用 `merchantInfoTypeOptions`      |
| 4    | `src/pages/operation-team/merchant-manage/merchant-info/components/form.ts`         | `businessStatusOptions`         | 使用 `houseStatusOptions`           |
| 5    | `src/pages/operation-team/system-manage/community-configuration/components/form.ts` | `CommunityConfigFormVO`         | 使用 `SettingCommunityConfigFormVO` |
| 6    | `src/pages/operation-team/system-manage/system-config/components/form.ts`           | `SystemConfigType`              | 使用 `SystemConfig`                 |
| 7    | `src/pages/operation-team/system-manage/system-config/components/form.ts`           | `SystemConfigGroup`             | 使用 `SystemConfig`                 |
| 8    | `src/pages/operation-team/system-manage/system-config/components/form.ts`           | `SystemConfigStatus`            | 使用 `SystemConfig`                 |
| 9    | `src/pages/operation-team/system-manage/system-config/components/form.ts`           | `systemConfigTypeOptionsAlias`  | 使用 `systemConfigTypeOptions`      |
| 10   | `src/pages/operation-team/system-manage/system-config/components/form.ts`           | `configGroupOptions`            | 使用 `configTypeOptions`            |
| 11   | `src/pages/operation-team/system-manage/system-config/components/form.ts`           | `systemConfigStatusOptionsCN`   | 使用 `configStatusOptions`          |
| 12   | `src/pages/property-manage/community-manage/handing-business/components/form.ts`    | `businessHandlingStatusOptions` | 使用 `handlingStatusOptions`        |

---

### 3.4 表单值类型不匹配 (TS2322)

**文件位置**: 多处

| 序号 | 文件路径                                                                  | 错误类型           | 错误值         | 期望类型     |
| ---- | ------------------------------------------------------------------------- | ------------------ | -------------- | ------------ |
| 1    | `src/pages/property-manage/contract-manage/type/components/form.ts`       | `IsAuditType`      | `"是"`         | 枚举值不匹配 |
| 2    | `src/pages/property-manage/parking-manage/parking-lot/components/form.ts` | `ParkingLotType`   | `"地下停车场"` | 期望值不匹配 |
| 3    | `src/pages/property-manage/parking-manage/parking-lot/components/form.ts` | `ParkingSpaceType` | `"标准车位"`   | 期望值不匹配 |

---

### 3.5 类型定义属性错误 (TS2353)

**文件位置**: `src/pages/setting-manage/system-manage/system-config/components/form.ts`

| 序号 | 错误代码 | 错误属性 | 说明                                                                       |
| ---- | -------- | -------- | -------------------------------------------------------------------------- |
| 1    | `TS2353` | `title`  | 对象字面量仅能指定已知属性，`SystemConfigFormVO` 类型中不存在 `title` 属性 |

---

## 四、错误分类汇总

| 错误类别            | 错误代码 | 数量                        |
| ------------------- | -------- | --------------------------- |
| 导出冲突            | TS2308   | 7 (类型项目 3 + 后台项目 4) |
| 导出成员缺失        | TS2305   | 约 10                       |
| 导出成员名称错误    | TS2724   | 约 34                       |
| Mock 数据类型不匹配 | TS2322   | 约 156                      |
| 类型定义属性错误    | TS2353   | 约 1                        |
| 表单值类型不匹配    | TS2322   | 约 5                        |
| 重复的类型项目错误  | -        | 4                           |
| **总计**            | -        | **约 228**                  |

---

## 五、处理优先级建议

### 优先级 1: 修复类型项目导出冲突 (4 处)

优先解决类型项目中的导出冲突问题，这是其他错误的根源之一。

处理方式：

1. 将公共的类型提取出来，确保在`类型项目`内单独导出类型和变量。

### 优先级 2: 修复 Mock 数据类型不匹配 (约 156 处)

此问题集中在 `server/api/operation-team/data-manage/property-company/mock-data.ts` 文件中，需要更新枚举值。

1. 更新枚举值即可，不允许修改类型项目的类型。

### 优先级 3: 统一类型命名规范 (约 34 处)

修正类型名称拼写和引用错误，统一使用项目规范中的命名约定。

### 优先级 4: 添加缺失的类型导出 (约 10 处)

在类型项目中添加缺失的类型和选项导出。

---

## 执行任务时的思考模式

请你以 `ultrathink` 的思考模式，认真阅读并思考文档要求。

1. 增加你的思考预算： 请你大胆的多使用 token 做深度的，全面的，细致的推理思考。
2. 鼓励你多花时间思考： 请你在执行任务前，主动使用尽可能多的 token 做充分详实完善完整的思考，允许你多花费时间做阅读，对比，思考。
3. 复杂任务类型： 这是一揽子复杂的，多步骤的任务。请你先思考任务之间的前后关系，然后再动态编排任务。
4. 严格按照文档要求落实： 你必须非常严格的按照文档的要求做，不允许出现缺漏。
