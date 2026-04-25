<!-- 有用的指导文件 不要删除 -->

# 2025-01-06 维修工单评价页上级页面分析报告

## 一、分析目标

针对 `src/pages-sub/repair/appraise.vue`（维修工单评价页），分析其上级页面和进入入口。

## 二、页面基本信息

### 2.1. 页面概述

|    项目    |                          内容                           |
| :--------: | :-----------------------------------------------------: |
|  页面名称  |                     维修工单评价页                      |
|  文件路径  |           `src/pages-sub/repair/appraise.vue`           |
|  访问地址  |   `http://localhost:3000/#/pages-sub/repair/appraise`   |
| 旧代码路径 | `gitee-example/pages/appraiseRepair/appraiseRepair.vue` |
|  页面类型  |                         表单页                          |
|  主要功能  |              业主对维修服务进行评分和评价               |

### 2.2. 页面参数

根据代码分析，该页面接收以下参数：

|     参数名      |   类型   | 必填 |     说明     |
| :-------------: | :------: | :--: | :----------: |
|   `repairId`    | `string` |  是  | 维修工单 ID  |
|  `repairType`   | `string` |  否  | 维修工单类型 |
| `repairChannel` | `string` |  否  | 维修工单渠道 |
|  `publicArea`   | `string` |  否  | 是否公共区域 |
|  `communityId`  | `string` |  是  |   小区 ID    |

**完整示例 URL**：

```plain
http://localhost:3000/#/pages-sub/repair/appraise?repairId=REP_001&repairType=水电维修&communityId=COMM_001
```

## 三、上级页面分析

### 3.1. 主要上级页面：维修待办单页面

#### 3.1.1. 页面信息

|    项目    |                          内容                           |
| :--------: | :-----------------------------------------------------: |
|  页面名称  |                       维修待办单                        |
|  文件路径  |           `src/pages-sub/repair/dispatch.vue`           |
|  访问地址  |   `http://localhost:3000/#/pages-sub/repair/dispatch`   |
| 旧代码路径 | `gitee-example/pages/repairDispatch/repairDispatch.vue` |

#### 3.1.2. 跳转逻辑

**新项目代码**（`src/pages-sub/repair/dispatch.vue:251-259`）：

```typescript
/** 回访 */
function handleAppraise(item: RepairOrder) {
	TypedRouter.toAppraiseRepair({
		repairId: item.repairId!,
		repairType: item.repairType || "",
		repairChannel: item.repairChannel,
		publicArea: item.publicArea,
		communityId: item.communityId!,
	});
}
```

**旧项目代码**（`gitee-example/pages/repairDispatch/repairDispatch.vue:246-256`）：

```javascript
dealAppraise: function(item) {
  console.log(item);
  this.context.navigateTo({
    url: '/pages/appraiseRepair/appraiseRepair?' + "repairId=" + item.repairId +
      "&repairType=" + item.repairType +
      "&preStaffId=" + item.preStaffId +
      "&preStaffName=" + item.preStaffName +
      "&repairObjType=" + item.repairObjType +
      "&repairType=" + item.repairType +
      "&repairChannel=" + item.repairChannel +
      "&publicArea=" + item.publicArea +
      "&communityId=" + item.communityId
  })
}
```

#### 3.1.3. 触发条件

**新项目**（`src/pages-sub/repair/dispatch.vue:295-298`）：

```typescript
/** 是否显示回访按钮（已完成且需回访） */
function canAppraise(item: RepairOrder): boolean {
	return item.statusCd === "10004" && item.returnVisitFlag === "003" && checkAuth("502021040151320003");
}
```

**旧项目**（`gitee-example/pages/repairDispatch/repairDispatch.vue:58`）：

```html
<button
	class="cu-btn sm bg-green margin-left"
	v-if="item.state == '1800' && item.returnVisitFlag == '003' && checkAuth('502021040151320003')"
	@click="dealAppraise(item)"
>
	回访
</button>
```

**触发条件总结**：

1. **工单状态**：`statusCd === '10004'`（已完成状态，旧项目为 `state == '1800'`）
2. **回访标志**：`returnVisitFlag === '003'`（需要回访）
3. **权限检查**：`checkAuth('502021040151320003')`（拥有回访权限）

#### 3.1.4. 按钮位置

在维修待办单列表的每个工单卡片底部操作区，当满足上述条件时，会显示"回访"按钮。

### 3.2. 次要上级页面：维修工单详情页

#### 3.2.1. 页面信息

|    项目    |                          内容                           |
| :--------: | :-----------------------------------------------------: |
|  页面名称  |                      维修工单详情                       |
|  文件路径  |         `src/pages-sub/repair/order-detail.vue`         |
|  访问地址  | `http://localhost:3000/#/pages-sub/repair/order-detail` |
| 旧代码路径 |   `gitee-example/pages/repairDetail/repairDetail.vue`   |

#### 3.2.2. 跳转逻辑

**注意**：在新项目的维修工单详情页中，**没有直接跳转到评价页的功能**。

但在旧项目中，维修工单详情页的流转记录中有"回复评价"功能（`gitee-example/pages/repairDetail/repairDetail.vue:149-153`）：

```javascript
_replyRepairAppraise:function(_repairUser){
  uni.navigateTo({
    url: "/pages/repairOrder/replyRepairAppraise?ruId=" + _repairUser.ruId + '&repairId=' + _repairUser.repairId
  });
}
```

这个功能跳转到的是**回复评价页**（`appraise-reply.vue`），而不是评价页（`appraise.vue`）。

**新项目中的对应实现**（`src/pages-sub/repair/order-detail.vue:127-134`）：

```typescript
/**
 * 回复评价
 * @param record - 工单流转记录
 * @example handleReplyAppraise(staffRecord)
 */
function handleReplyAppraise(record: RepairStaffRecord) {
	if (!record.ruId) {
		toast.error("缺少评价记录ID");
		return;
	}
	TypedRouter.toReplyAppraise(record.ruId, repairId.value);
}
```

**结论**：维修工单详情页**不是**评价页的直接上级页面，它只有"回复评价"功能，跳转到的是 `appraise-reply.vue`。

### 3.3. 其他可能的上级页面

#### 3.3.1. 维修已办单页面

|    项目    |                                内容                                 |
| :--------: | :-----------------------------------------------------------------: |
|  页面名称  |                             维修已办单                              |
|  文件路径  |                  `src/pages-sub/repair/finish.vue`                  |
|  访问地址  |          `http://localhost:3000/#/pages-sub/repair/finish`          |
| 旧代码路径 | `gitee-example/pages/repairDispatchFinish/repairDispatchFinish.vue` |

**分析结果**：

- 旧项目中，维修已办单页面**没有**跳转到评价页的功能
- 新项目中，维修已办单页面也**没有**跳转到评价页的功能
- 该页面只有"详情"按钮，跳转到维修工单详情页

**结论**：维修已办单页面**不是**评价页的上级页面。

## 四、路由配置分析

### 4.1. 路由类型定义

**文件路径**：`src/types/routes.ts`

```typescript
'/pages-sub/repair/appraise': {
  repairId: string
  repairType: string
  repairChannel: string
  publicArea: string
  communityId: string
}
```

### 4.2. 路由辅助方法

**文件路径**：`src/router/helpers.ts:123-125`

```typescript
/** 跳转到回访工单 */
static toAppraiseRepair(params: PageParams['/pages-sub/repair/appraise']) {
  return navigateToTyped('/pages-sub/repair/appraise', params)
}
```

### 4.3. 路由映射表

**文件路径**：`docs/prompts/route-migration-map.yml`

```yaml
repair_modules:
  gitee-example/pages/appraiseRepair/appraiseRepair.vue: src/pages-sub/repair/appraise.vue
```

## 五、业务流程分析

### 5.1. 完整业务流程

```plain
1. 维修工单创建
   ↓
2. 维修工单派单
   ↓
3. 维修人员处理
   ↓
4. 维修工单完成（statusCd = '10004'）
   ↓
5. 系统标记需要回访（returnVisitFlag = '003'）
   ↓
6. 维修待办单页面显示"回访"按钮
   ↓
7. 点击"回访"按钮 → 跳转到评价页
   ↓
8. 业主填写评分和评价内容
   ↓
9. 提交评价
   ↓
10. 返回维修待办单页面
```

### 5.2. 评价页的业务定位

- **业务角色**：维修人员（物业员工）
- **业务场景**：维修工单完成后，维修人员主动联系业主进行回访，记录业主的评价
- **业务目的**：收集业主对维修服务的满意度反馈

### 5.3. 与"回复评价"的区别

|    对比项    |       评价页（appraise.vue）       |  回复评价页（appraise-reply.vue）  |
| :----------: | :--------------------------------: | :--------------------------------: |
| **操作主体** |         维修人员（代业主）         |          维修人员（自己）          |
| **业务场景** |    维修完成后，主动回访收集评价    |    业主评价后，维修人员回复评价    |
| **入口位置** |     维修待办单列表的"回访"按钮     | 维修工单详情页流转记录的"回复"按钮 |
| **触发条件** | 工单已完成 + 需要回访 + 有回访权限 |      工单流转记录中有评价记录      |
| **表单内容** |          评分 + 回访建议           |              回复内容              |

## 六、代码搜索验证

### 6.1. 搜索方法

使用以下搜索命令验证跳转关系：

```bash
# 搜索 toAppraiseRepair 方法的调用
grepSearch: pattern="toAppraiseRepair" includePattern="**/*.vue"

# 搜索直接跳转到评价页的代码
grepSearch: pattern="navigateTo.*appraise" includePattern="**/*.vue"

# 搜索旧项目中的跳转代码
grepSearch: pattern="pages/appraiseRepair" includePattern="gitee-example/**/*.vue"
```

### 6.2. 搜索结果

**新项目搜索结果**：

- 只在 `src/pages-sub/repair/dispatch.vue` 中找到 `toAppraiseRepair` 的调用
- 没有找到其他直接跳转到评价页的代码

**旧项目搜索结果**：

- 只在 `gitee-example/pages/repairDispatch/repairDispatch.vue` 中找到跳转到评价页的代码
- 没有找到其他页面跳转到评价页

**结论**：评价页的**唯一上级页面**是维修待办单页面。

## 七、总结

### 7.1. 上级页面确认

**唯一上级页面**：

- **页面名称**：维修待办单
- **文件路径**：`src/pages-sub/repair/dispatch.vue`
- **访问地址**：`http://localhost:3000/#/pages-sub/repair/dispatch`

### 7.2. 进入入口

**唯一入口**：

- **位置**：维修待办单列表的工单卡片底部操作区
- **按钮文本**：回访
- **触发条件**：
  1. 工单状态为已完成（`statusCd === '10004'`）
  2. 回访标志为需要回访（`returnVisitFlag === '003'`）
  3. 用户拥有回访权限（`checkAuth('502021040151320003')`）

### 7.3. 业务关系图

```plain
维修待办单页面（dispatch.vue）
    ↓
  [回访按钮]
    ↓
维修工单评价页（appraise.vue）
    ↓
  [提交评价]
    ↓
返回维修待办单页面
```

### 7.4. 关键发现

1. **单一入口**：评价页只有一个上级页面和一个进入入口
2. **业务闭环**：评价功能是维修工单流程的最后一个环节
3. **权限控制**：需要特定权限才能看到回访按钮
4. **状态依赖**：只有已完成且需要回访的工单才会显示回访按钮
5. **代码一致性**：新旧项目的业务逻辑保持一致，只是实现方式从 Vue2 迁移到 Vue3

### 7.5. 建议

1. **文档完善**：建议在评价页的注释中明确说明其上级页面和触发条件
2. **测试覆盖**：建议测试以下场景：
   - 工单状态为已完成但不需要回访时，不显示回访按钮
   - 工单状态为已完成且需要回访，但用户无权限时，不显示回访按钮
   - 正常回访流程的完整测试
3. **用户体验**：建议在评价页顶部显示工单基本信息，方便维修人员确认是哪个工单的回访

## 八、附录

### 8.1. 相关文件清单

|     文件类型     |                        文件路径                         |
| :--------------: | :-----------------------------------------------------: |
|   评价页（新）   |           `src/pages-sub/repair/appraise.vue`           |
|   评价页（旧）   | `gitee-example/pages/appraiseRepair/appraiseRepair.vue` |
| 维修待办单（新） |           `src/pages-sub/repair/dispatch.vue`           |
| 维修待办单（旧） | `gitee-example/pages/repairDispatch/repairDispatch.vue` |
|   路由类型定义   |                  `src/types/routes.ts`                  |
|   路由辅助方法   |                 `src/router/helpers.ts`                 |
|    路由映射表    |         `docs/prompts/route-migration-map.yml`          |

### 8.2. 相关 API 接口

|     接口名称     |         文件路径          |       说明       |
| :--------------: | :-----------------------: | :--------------: |
| `appraiseRepair` | `src/api/repair/index.ts` | 提交维修工单评价 |

### 8.3. 相关类型定义

|   类型名称    |       文件路径        |       说明       |
| :-----------: | :-------------------: | :--------------: |
| `RepairOrder` | `src/types/repair.ts` | 维修工单数据类型 |
| `PageParams`  | `src/types/routes.ts` | 页面参数类型定义 |
