# Vue2 旧项目路由跳转关系脑图（完整版）

本文档展示了 `gitee-example` 目录下 Vue2 uni-app 项目的**完整**路由跳转关系。

## 说明

- 只展示 `uni.navigateTo()`, `uni.redirectTo()`, `uni.reLaunch()` 三种 forward 跳转
- 忽略返回操作 (`navigateBack`) 和 Tab 切换 (`switchTab`)
- 标注了关键的跳转参数
- **本版本已覆盖所有主要业务模块（18 个模块，180+ 页面）**

## 目录

- [Vue2 旧项目路由跳转关系脑图（完整版）](#vue2-旧项目路由跳转关系脑图完整版)
  - [说明](#说明)
  - [目录](#目录)
  - [1. 总览图：以首页/工作台为中心的导航结构](#1-总览图以首页工作台为中心的导航结构)
  - [2. 维修工单流程模块](#2-维修工单流程模块)
  - [3. 投诉处理流程模块](#3-投诉处理流程模块)
  - [4. 巡检管理流程模块](#4-巡检管理流程模块)
  - [5. 空置房管理流程模块](#5-空置房管理流程模块)
  - [6. 装修管理流程模块](#6-装修管理流程模块)
  - [7. 设备保养流程模块](#7-设备保养流程模块)
  - [8. 采购/资源管理流程模块](#8-采购资源管理流程模块)
  - [9. 费用管理模块](#9-费用管理模块)
  - [10. 抄表管理模块](#10-抄表管理模块)
  - [11. 业主管理模块](#11-业主管理模块)
  - [12. 车辆管理模块](#12-车辆管理模块)
  - [13. OA 工作流模块](#13-oa-工作流模块)
  - [14. 工作单模块](#14-工作单模块)
  - [15. 报表统计模块](#15-报表统计模块)
  - [16. 个人中心模块](#16-个人中心模块)
  - [17. 公告活动模块](#17-公告活动模块)
  - [18. 其他辅助功能](#18-其他辅助功能)
    - [18.1 房屋选择流程](#181-房屋选择流程)
    - [18.2 其他功能页面](#182-其他功能页面)
  - [模块统计总览](#模块统计总览)
  - [关键跳转模式总结](#关键跳转模式总结)
  - [参数传递方式](#参数传递方式)
  - [主要业务流程路径](#主要业务流程路径)
    - [1. 维修工单流程](#1-维修工单流程)
    - [2. 投诉处理流程](#2-投诉处理流程)
    - [3. 巡检流程](#3-巡检流程)
    - [4. 空置房管理流程](#4-空置房管理流程)
    - [5. 装修管理流程](#5-装修管理流程)
    - [6. 采购流程](#6-采购流程)
    - [7. 费用管理流程](#7-费用管理流程)
    - [8. 抄表流程](#8-抄表流程)

## 1. 总览图：以首页/工作台为中心的导航结构

```mermaid
graph TB
    %% 入口页面（TabBar）
    Index["首页<br/>pages/index/index"]
    Work["工作台<br/>pages/index/work"]
    AddressList["通讯录<br/>pages/addressList/addressList"]
    My["我的<br/>pages/my/my"]

    %% 主要功能模块入口
    RepairOrder["维修工单池"]
    ComplaintList["投诉受理单"]
    Inspection["巡检打卡"]
    ApplyRoom["空置房管理"]
    RoomRenovation["装修管理"]
    Maintainance["设备保养"]
    PurchaseManage["采购管理"]
    FeeManage["费用管理"]
    MeterReading["抄表管理"]
    OwnerManage["业主管理"]
    CarManage["车辆管理"]
    DataReport["报表统计"]

    %% 个人中心功能
    UserInfo["个人信息"]
    ChangePwd["修改密码"]
    ChangeCommunity["切换小区"]
    Login["登录页"]

    %% 从"我的"页面的跳转
    My --> ChangeCommunity
    My --> UserInfo
    My --> ChangePwd
    My -->|退出系统| Login
    ChangePwd -->|修改成功| Login

    %% 标注：首页、工作台、通讯录、我的是TabBar主入口
    style Index fill:#e1f5ff
    style Work fill:#e1f5ff
    style AddressList fill:#e1f5ff
    style My fill:#e1f5ff
    style Login fill:#ffe1e1
```

## 2. 维修工单流程模块

```mermaid
graph TB
    %% 维修工单主要页面
    RepairOrder["维修工单池<br/>pages/repairOrder/repairOrder"]
    RepairDispatch["维修待办单<br/>pages/repairDispatch/repairDispatch"]
    RepairDetail["维修详情<br/>pages/repairDetail/repairDetail"]
    RepairHandle["订单处理<br/>pages/repairHandle/repairHandle"]
    RepairAdd["添加维修记录<br/>pages/repairAdd/repairAdd"]
    RepairFinish["维修已办<br/>pages/repairDispatchFinish"]
    AppraiseRepair["回访工单<br/>pages/appraiseRepair/appraiseRepair"]
    RepairEnd["结束订单<br/>pages/repairOrder/repairEnd"]
    ReplyAppraise["回复评价<br/>pages/repairOrder/replyRepairAppraise"]
    SelectResource["选择物品<br/>pages/repairHandle/selectResource"]

    %% 选择房屋相关页面
    SelectFloor["选择楼栋<br/>pages/selectFloor/selectFloor"]
    SelectUnit["选择单元<br/>pages/selectUnit/selectUnit"]
    SelectRoom["选择房屋<br/>pages/selectRoom/selectRoom"]

    %% 维修工单池的跳转
    RepairOrder -->|查看详情<br/>参数: repairId, storeId| RepairDetail
    RepairOrder -->|派单<br/>参数: action=DISPATCH<br/>repairId, repairType| RepairHandle
    RepairOrder -->|结束订单<br/>参数: repairId, communityId| RepairEnd

    %% 维修待办单的跳转
    RepairDispatch -->|查看详情<br/>参数: repairId, storeId| RepairDetail
    RepairDispatch -->|转单/退单/办结<br/>参数: action, repairId| RepairHandle
    RepairDispatch -->|回访<br/>参数: repairId, repairType| AppraiseRepair

    %% 维修详情的跳转
    RepairDetail -->|回复评价<br/>参数: ruId, repairId| ReplyAppraise

    %% 订单处理的跳转
    RepairHandle -->|选择物品<br/>参数: feeFlag| SelectResource
    RepairHandle -.->|派单成功| RepairOrder
    RepairHandle -.->|处理成功| RepairDispatch

    %% 添加维修记录的跳转
    RepairAdd -->|选择楼栋| SelectFloor
    RepairAdd -->|选择单元<br/>参数: floorId| SelectUnit
    RepairAdd -->|选择房屋<br/>参数: floorId, unitId| SelectRoom
    RepairAdd -.->|提交成功| RepairOrder

    %% 维修已办的跳转
    RepairFinish -->|查看详情<br/>参数: repairId, storeId| RepairDetail

    %% 样式
    style RepairOrder fill:#fff4e6
    style RepairDispatch fill:#fff4e6
    style RepairHandle fill:#ffe6e6
    style AppraiseRepair fill:#e6ffe6
```

## 3. 投诉处理流程模块

```mermaid
graph TB
    %% 投诉处理主要页面
    ComplaintList["投诉受理单<br/>pages/complaintList/complaintList"]
    ComplaintOrder["投诉录单<br/>pages/complaintOrder/complaintOrder"]
    ComplaintDetail["投诉单详情<br/>pages/complaintOrderDetail/complaintOrderDetail"]
    AuditComplaint["处理投诉单<br/>pages/auditComplaintOrder/auditComplaintOrder"]
    ComplaintHandle["投诉处理<br/>pages/complaintHandle/complaintHandle"]
    ComplaintFinish["投诉已办单<br/>pages/complaintFinish/complaintFinish"]
    ReplyAppraise["回复评价<br/>pages/complaintOrderDetail/replyComplainAppraise"]

    %% 选择房屋相关页面
    FloorList["楼栋列表<br/>pages/floorList/floorList"]
    UnitList["单元列表<br/>pages/unitList/unitList"]
    RoomList["房屋列表<br/>pages/roomList/roomList"]

    %% 投诉受理单的跳转
    ComplaintList -->|查看详情<br/>参数: complaintId| ComplaintDetail
    ComplaintList -->|处理<br/>参数: complaintId, taskId| ComplaintHandle

    %% 投诉录单的跳转
    ComplaintOrder -->|查看详情<br/>参数: complaintId| ComplaintDetail
    ComplaintOrder -->|选择楼栋<br/>参数: communityId| FloorList
    ComplaintOrder -->|选择单元<br/>参数: communityId| UnitList
    ComplaintOrder -->|选择房屋<br/>参数: communityId| RoomList

    %% 投诉单详情的跳转
    ComplaintDetail -->|回复评价<br/>参数: appraiseId, communityId| ReplyAppraise

    %% 投诉已办单的跳转
    ComplaintFinish -->|查看详情<br/>参数: complaintId| ComplaintDetail

    %% 样式
    style ComplaintList fill:#e6f3ff
    style ComplaintOrder fill:#ffe6f0
    style ComplaintHandle fill:#ffe6e6
    style ComplaintFinish fill:#e6ffe6
```

## 4. 巡检管理流程模块

```mermaid
graph TB
    %% 巡检管理主要页面
    Inspection["巡检打卡<br/>pages/inspection/inspection"]
    InspectionTodayReport["今日巡检<br/>pages/inspection/inspectionTodayReport"]
    StaffNoInspection["员工未巡检<br/>pages/inspection/staffNoInspection"]
    ExcuteInspection["巡检过程<br/>pages/excuteInspection/excuteInspection"]
    ExcuteOne["执行巡检<br/>pages/excuteOneInspection/excuteOneInspection"]
    QrCodeInspection["二维码巡检<br/>pages/excuteOneQrCodeInspection/excuteOneQrCodeInspection"]
    InspectionReexamine["巡检补检<br/>pages/inspectionReexamine/inspectionReexamine"]
    InspectionTransfer["任务流转<br/>pages/inspectionTransfer/inspectionTransfer"]

    %% 巡检打卡的跳转
    Inspection -->|开始巡检<br/>参数: taskId, inspectionPlanName| ExcuteInspection
    Inspection -->|任务流转<br/>参数: task对象JSON| InspectionTransfer
    Inspection -->|补检| InspectionReexamine

    %% 巡检过程的跳转
    ExcuteInspection -->|单项巡检<br/>参数: taskDetailId, taskId<br/>inspectionId, inspectionName, itemId| ExcuteOne

    %% 执行巡检的跳转
    ExcuteOne -.->|提交成功| Inspection
    ExcuteOne -->|二维码巡检<br/>参数: taskDetailId, taskId等| QrCodeInspection

    %% 二维码巡检的跳转
    QrCodeInspection -->|执行单项<br/>参数: taskDetailId, taskId等| ExcuteOne

    %% 巡检补检的跳转
    InspectionReexamine -->|开始巡检<br/>参数: taskId, inspectionPlanName| ExcuteInspection

    %% 任务流转的跳转
    InspectionTransfer -.->|流转成功| Inspection

    %% 样式
    style Inspection fill:#e6f7ff
    style ExcuteInspection fill:#fff7e6
    style ExcuteOne fill:#ffe6f0
    style InspectionTransfer fill:#ffe6e6
```

## 5. 空置房管理流程模块

> ⭐ **重要模块**：此模块之前被遗漏，现已补充完整

```mermaid
graph TB
    %% 空置房管理主要页面
    ApplyRoom["空置房列表<br/>pages/applyRoom/applyRoom"]
    ApplyRoomDetail["空置房详情<br/>pages/applyRoomDetail/applyRoomDetail"]
    ApplyRoomRecord["跟踪记录列表<br/>pages/applyRoomRecord/applyRoomRecord"]
    ApplyRoomRecordHandle["添加跟踪记录<br/>pages/applyRoomRecordHandle/applyRoomRecordHandle"]
    ApplyRoomRecordDetail["跟踪记录详情<br/>pages/applyRoomRecordDetail/applyRoomRecordDetail"]

    %% 空置房列表的跳转
    ApplyRoom -->|查看详情<br/>参数: ardId, communityId| ApplyRoomDetail

    %% 空置房详情的跳转
    ApplyRoomDetail -->|查看跟踪记录<br/>参数: apply对象JSON| ApplyRoomRecord
    ApplyRoomDetail -.->|返回列表| ApplyRoom

    %% 跟踪记录列表的跳转
    ApplyRoomRecord -->|添加跟踪<br/>参数: apply对象JSON| ApplyRoomRecordHandle
    ApplyRoomRecord -->|查看详情<br/>参数: apply对象JSON| ApplyRoomRecordDetail

    %% 样式
    style ApplyRoom fill:#e6fff7
    style ApplyRoomDetail fill:#fff7e6
    style ApplyRoomRecord fill:#ffe6f0
    style ApplyRoomRecordHandle fill:#ffe6e6
```

## 6. 装修管理流程模块

> ⭐ **重要模块**：装修申请和跟踪流程

```mermaid
graph TB
    %% 装修管理主要页面
    RoomRenovation["装修记录列表<br/>pages/roomRenovation/roomRenovation"]
    RoomRenovationDetail["装修详情<br/>pages/roomRenovationDetail/roomRenovationDetail"]
    RoomRenovationRecord["跟踪记录列表<br/>pages/roomRenovationRecord/roomRenovationRecord"]
    RoomRenovationRecordHandle["添加跟踪记录<br/>pages/roomRenovationRecordHandle/roomRenovationRecordHandle"]
    RoomRenovationRecordDetail["跟踪记录详情<br/>pages/roomRenovationRecordDetail/roomRenovationRecordDetail"]

    %% 装修记录列表的跳转
    RoomRenovation -->|查看详情<br/>参数: apply对象JSON| RoomRenovationDetail

    %% 装修详情的跳转
    RoomRenovationDetail -->|查看跟踪记录<br/>参数: apply对象JSON| RoomRenovationRecord
    RoomRenovationDetail -.->|返回列表| RoomRenovation

    %% 跟踪记录列表的跳转
    RoomRenovationRecord -->|添加跟踪<br/>参数: apply对象JSON| RoomRenovationRecordHandle
    RoomRenovationRecord -->|查看详情<br/>参数: apply对象JSON| RoomRenovationRecordDetail

    %% 样式
    style RoomRenovation fill:#e6fff7
    style RoomRenovationDetail fill:#fff7e6
    style RoomRenovationRecord fill:#ffe6f0
    style RoomRenovationRecordHandle fill:#ffe6e6
```

## 7. 设备保养流程模块

> ⭐ **重要模块**：设备定期保养管理

```mermaid
graph TB
    %% 设备保养主要页面
    Maintainance["设备保养列表<br/>pages/maintainance/maintainance"]
    ExcuteMaintainance["保养执行<br/>pages/maintainance/excuteMaintainance"]
    ExcuteOneMaintainance["单项保养<br/>pages/maintainance/excuteOneMaintainance"]
    MaintainanceTransfer["保养任务流转<br/>pages/maintainance/maintainanceTransfer"]

    %% 设备保养列表的跳转
    Maintainance -->|开始保养<br/>参数: taskId| ExcuteMaintainance
    Maintainance -->|任务流转<br/>参数: task对象JSON| MaintainanceTransfer

    %% 保养执行的跳转
    ExcuteMaintainance -->|单项保养<br/>参数: taskDetailId| ExcuteOneMaintainance

    %% 任务流转的跳转
    MaintainanceTransfer -.->|流转成功| Maintainance

    %% 样式
    style Maintainance fill:#e6f7ff
    style ExcuteMaintainance fill:#fff7e6
    style ExcuteOneMaintainance fill:#ffe6f0
    style MaintainanceTransfer fill:#ffe6e6
```

## 8. 采购/资源管理流程模块

```mermaid
graph TB
    %% 采购资源管理主要页面
    PurchaseRequest["采购申请<br/>pages/purchaseRequest/purchaseRequest"]
    PurchaseManage["采购申请管理<br/>pages/resource/purchaseApplyManage"]
    AddPurchase["添加采购申请<br/>pages/resource/addPurchaseApply"]
    EditPurchase["修改采购申请<br/>pages/resource/editPurchaseApply"]
    PurchaseDetail["采购申请详情<br/>pages/resource/purchaseApplyDetail"]
    PurchaseAudit["采购审批<br/>pages/resource/purchaseApplyAuditOrders"]
    UrgentPurchase["紧急采购<br/>pages/urgentPurchaseApplyStep"]

    ItemOutManage["物品领用管理<br/>pages/resource/itemOutManage"]
    AddItemOut["领用申请<br/>pages/resource/addItemOut"]
    ItemOutAudit["领用审批<br/>pages/resource/itemOutAuditOrders"]
    ItemOutDo["物品发放<br/>pages/resource/itemOutDo"]
    ItemEnterDo["物品入库<br/>pages/resource/itemEnterDo"]

    AllocationManage["调拨列表<br/>pages/resource/allocationStorehouseManage"]
    AllocationApply["物品调拨<br/>pages/resource/allocationStorehouseApply"]
    AllocationAudit["调拨审批<br/>pages/resource/allocationStorehouseAuditOrders"]
    AllocationDetail["调拨详情<br/>pages/resource/allocationStorehouseApplyDetail"]
    AllocationEnter["调拨入库<br/>pages/resource/allocationEnterDo"]

    ResourceStore["我的物品<br/>pages/resourceStoreManage/resourceStoreManage"]
    ResourceReturn["物品退还<br/>pages/resourceStoreReturn/resourceStoreReturn"]
    ResourceScrap["物品损耗<br/>pages/resourceStoreScrap/resourceScrap"]
    ResourceTransfer["物品转赠<br/>pages/resourceStoreTransfer/resourceStoreTransfer"]

    PurchaseList["选择类型<br/>pages/purchaseList/purchaseList"]

    %% 采购申请的跳转
    PurchaseRequest -->|选择类型<br/>参数: communityId| PurchaseList

    %% 采购申请管理的跳转
    PurchaseManage -->|查看详情<br/>参数: apply对象JSON| PurchaseDetail
    PurchaseManage -->|新增申请| AddPurchase
    PurchaseManage -->|修改申请<br/>参数: purchaseApplyId| EditPurchase
    PurchaseManage -->|紧急采购| UrgentPurchase

    %% 物品领用管理的跳转
    ItemOutManage -->|查看详情<br/>参数: apply对象JSON| PurchaseDetail
    ItemOutManage -->|新增领用| AddItemOut
    ItemOutManage -->|审批<br/>参数: itemOutId| ItemOutAudit

    %% 调拨管理的跳转
    AllocationManage -->|新增调拨| AllocationApply
    AllocationManage -->|查看详情<br/>参数: applyId| AllocationDetail

    %% 我的物品的跳转
    ResourceStore -->|物品退还| ResourceReturn
    ResourceStore -->|物品损耗| ResourceScrap
    ResourceStore -->|物品转赠| ResourceTransfer

    %% 样式
    style PurchaseManage fill:#e6fff7
    style ItemOutManage fill:#fff7e6
    style AllocationManage fill:#ffe6f0
    style ResourceStore fill:#e6ffe6
```

## 9. 费用管理模块

> ⭐ **重要模块**：费用收取、催缴管理

```mermaid
graph TB
    %% 费用管理主要页面
    RoomPayFee["收银台<br/>pages/fee/roomPayFee"]
    FeeDetail["费用详情<br/>pages/feeDetail/feeDetail"]
    CreateFee["创建费用<br/>pages/fee/createFee"]
    OweFeeCallable["催缴登记列表<br/>pages/fee/oweFeeCallable"]
    WriteOweFeeCallable["添加催缴登记<br/>pages/fee/writeOweFeeCallable"]
    PayFeeByQrCode["扫码支付<br/>pages/fee/payFeeByQrCode"]

    %% 收银台的跳转
    RoomPayFee -->|查看费用详情<br/>参数: feeId| FeeDetail
    RoomPayFee -->|创建费用<br/>参数: payerObjId, payerObjName| CreateFee

    %% 催缴登记的跳转
    OweFeeCallable -->|添加催缴<br/>参数: roomId, roomName| WriteOweFeeCallable

    %% 样式
    style RoomPayFee fill:#e6fff7
    style CreateFee fill:#ffe6f0
    style OweFeeCallable fill:#fff7e6
```

## 10. 抄表管理模块

> ⭐ **重要模块**：水电抄表功能

```mermaid
graph TB
    %% 抄表管理主要页面
    MeterReading["水电抄表列表<br/>pages/meter/meterReading"]
    AddMeter["手工抄表<br/>pages/meter/addmeter"]
    QrCodeMeter["二维码抄表<br/>pages/meter/qrcodeMeter"]
    ShareMeter["公摊抄表<br/>pages/meter/shareMeter"]
    AddShareReading["添加公摊读数<br/>pages/meter/addShareReading"]
    AuditShareReading["审核公摊读数<br/>pages/meter/auditShareReading"]

    %% 抄表列表的跳转
    MeterReading -->|手工抄表<br/>参数: meterType| AddMeter
    MeterReading -->|二维码抄表| QrCodeMeter

    %% 手工抄表的跳转
    AddMeter -.->|提交成功| MeterReading

    %% 二维码抄表的跳转
    QrCodeMeter -->|录入数据<br/>参数: meterId| AddMeter
    QrCodeMeter -.->|返回列表| MeterReading

    %% 公摊抄表的跳转
    ShareMeter -->|添加读数| AddShareReading
    ShareMeter -->|审核读数<br/>参数: readingId| AuditShareReading

    %% 样式
    style MeterReading fill:#e6fff7
    style AddMeter fill:#fff7e6
    style QrCodeMeter fill:#ffe6f0
```

## 11. 业主管理模块

> ⭐ **重要模块**：业主信息管理

```mermaid
graph TB
    %% 业主管理主要页面
    Owner["业主列表<br/>pages/owner/owner"]
    AddOwner["新增业主<br/>pages/owner/addOwner"]
    EditOwner["编辑业主<br/>pages/owner/editOwner"]

    %% 业主列表的跳转
    Owner -->|新增业主| AddOwner
    Owner -->|编辑业主<br/>参数: ownerId| EditOwner

    %% 新增/编辑成功后返回
    AddOwner -.->|提交成功| Owner
    EditOwner -.->|保存成功| Owner

    %% 样式
    style Owner fill:#e6fff7
    style AddOwner fill:#fff7e6
    style EditOwner fill:#ffe6f0
```

## 12. 车辆管理模块

> ⭐ **重要模块**：停车场、道闸管理

```mermaid
graph TB
    %% 车辆管理主要页面
    OwnerCar["业主车辆<br/>pages/car/ownerCar"]
    BarrierGate["道闸管理<br/>pages/car/barrierGate"]
    BarrierVideo["道闸视频<br/>pages/car/barrierVideo"]
    CarInParkingArea["手工进场<br/>pages/car/carInParkingArea"]
    CarOutParkingArea["手工出场<br/>pages/car/carOutParkingArea"]

    %% 道闸管理的跳转
    BarrierGate -->|查看视频<br/>参数: machineCode| BarrierVideo
    BarrierGate -->|手工进场| CarInParkingArea
    BarrierGate -->|手工出场| CarOutParkingArea

    %% 样式
    style OwnerCar fill:#e6fff7
    style BarrierGate fill:#fff7e6
    style CarInParkingArea fill:#ffe6f0
    style CarOutParkingArea fill:#ffe6f0
```

## 13. OA 工作流模块

```mermaid
graph TB
    %% OA工作流主要页面
    OaWorkflow["OA流程<br/>pages/oaWorkflow/oaWorkflow"]
    NewOaForm["起草流程<br/>pages/newOaWorkflowForm/newOaWorkflowForm"]
    OaFormEdit["表单修改<br/>pages/newOaWorkflowFormEdit/newOaWorkflowFormEdit"]
    OaFinish["流程已办<br/>pages/newOaWorkflowFinish/newOaWorkflowFinish"]
    OaUndo["流程待办<br/>pages/newOaWorkflowUndo/newOaWorkflowUndo"]
    OaDetail["待办处理<br/>pages/newOaWorkflowDetail/newOaWorkflowDetail"]
    OaUndoAudit["流程审核<br/>pages/newOaWorkflowUndoAudit/newOaWorkflowUndoAudit"]

    %% OA流程的跳转
    OaWorkflow -->|起草流程| NewOaForm
    OaWorkflow -->|查看已办| OaFinish
    OaWorkflow -->|查看待办| OaUndo

    %% 流程待办的跳转
    OaUndo -->|处理待办<br/>参数: taskId, processId| OaDetail

    %% 待办处理的跳转
    OaDetail -->|修改表单<br/>参数: formId| OaFormEdit
    OaDetail -->|审核<br/>参数: taskId| OaUndoAudit

    %% 样式
    style OaWorkflow fill:#e6f3ff
    style NewOaForm fill:#fff7e6
    style OaUndo fill:#ffe6f0
    style OaDetail fill:#ffe6e6
```

## 14. 工作单模块

```mermaid
graph TB
    %% 工作单主要页面
    StartWork["发工作单<br/>pages/work/startWork"]
    WorkTask["工作单任务<br/>pages/work/workTask"]
    WorkDetail["工作单详情<br/>pages/work/workDetail"]
    DoWork["办理工作单<br/>pages/work/doWork"]
    DoWorkAudit["工作单审核<br/>pages/work/doWorkAudit"]
    EditWork["修改工作单<br/>pages/work/editWrok"]
    CopyWork["抄送工作单<br/>pages/work/copyWork"]
    DoCopyWork["已阅<br/>pages/work/doCopyWork"]

    %% 工作单任务的跳转
    WorkTask -->|查看详情<br/>参数: workId, taskId| WorkDetail

    %% 工作单详情的跳转
    WorkDetail -->|修改<br/>参数: workId| EditWork
    WorkDetail -.->|删除成功| WorkTask

    %% 办理工作单的跳转
    DoWork -->|查看详情<br/>参数: workId, taskId| WorkDetail
    DoWork -->|审核<br/>参数: workId, taskId| DoWorkAudit

    %% 抄送工作单的跳转
    CopyWork -->|查看任务<br/>参数: workId| WorkTask
    CopyWork -->|已阅<br/>参数: workId, copyId| DoCopyWork

    %% 样式
    style WorkDetail fill:#e6f3ff
    style DoWork fill:#fff7e6
    style DoWorkAudit fill:#ffe6e6
```

## 15. 报表统计模块

> ⭐ **重要模块**：各类数据报表

```mermaid
graph TB
    %% 报表统计主要页面
    DataReport["数据统计<br/>pages/report/dataReport"]
    ReportPayFeeDetail["缴费明细表<br/>pages/report/reportPayFeeDetail"]
    ReportRoomFee["房屋费用明细<br/>pages/report/reportRoomFee"]
    ReportFeeSummary["费用汇总表<br/>pages/report/reportFeeSummary"]
    OpenDoorLog["开门记录<br/>pages/report/openDoorLog"]
    ChargeMachineOrder["充电桩订单<br/>pages/report/chargeMachineOrder"]

    %% 数据统计的跳转（通过Tab切换）
    DataReport -.->|Tab切换| ReportPayFeeDetail
    DataReport -.->|Tab切换| ReportRoomFee
    DataReport -.->|Tab切换| ReportFeeSummary
    DataReport -.->|Tab切换| OpenDoorLog
    DataReport -.->|Tab切换| ChargeMachineOrder

    %% 样式
    style DataReport fill:#e6fff7
    style ReportPayFeeDetail fill:#fff7e6
    style ReportRoomFee fill:#ffe6f0
```

## 16. 个人中心模块

```mermaid
graph TB
    %% 个人中心主要页面
    My["我的<br/>pages/my/my"]
    UserInfo["个人信息<br/>pages/userInfo/userInfo"]
    ChangePwd["修改密码<br/>pages/changePwd/changePwd"]
    ChangeCommunity["切换小区<br/>pages/changeCommunity/changeCommunity"]
    RepairFinish["维修已办<br/>pages/repairDispatchFinish"]
    ComplaintFinish["投诉已办<br/>pages/complaintFinish"]
    StaffAttendance["员工考勤<br/>pages/my/staffDetailAttendance"]
    Login["登录页<br/>pages/login/login"]

    %% 我的页面的跳转
    My --> ChangeCommunity
    My --> UserInfo
    My --> RepairFinish
    My --> ComplaintFinish
    My --> StaffAttendance
    My --> ChangePwd
    My -->|退出系统| Login

    %% 修改密码的跳转
    ChangePwd -->|修改成功| Login

    %% 登录成功的跳转
    Login -.->|登录成功| My

    %% 样式
    style My fill:#e6f3ff
    style Login fill:#ffe6e6
    style ChangePwd fill:#fff7e6
```

## 17. 公告活动模块

> ⭐ **重要模块**：小区公告和文化活动

```mermaid
graph TB
    %% 公告活动主要页面
    Notice["公告列表<br/>pages/notice/notice"]
    NoticeDetail["公告详情<br/>pages/notice/detail/noticeDetail"]
    Activityes["小区文化<br/>pages/activityes/activityes"]
    ActivityDetail["文化详情<br/>pages/activityDetail/activityDetail"]

    %% 公告列表的跳转
    Notice -->|查看详情<br/>参数: noticeId| NoticeDetail

    %% 小区文化的跳转
    Activityes -->|查看详情<br/>参数: activitiesId, currentCommunityId| ActivityDetail

    %% 样式
    style Notice fill:#e6fff7
    style Activityes fill:#fff7e6
```

## 18. 其他辅助功能

### 18.1 房屋选择流程

```mermaid
graph LR
    SelectFloor["选择楼栋<br/>pages/selectFloor/selectFloor"]
    SelectUnit["选择单元<br/>pages/selectUnit/selectUnit"]
    SelectRoom["选择房屋<br/>pages/selectRoom/selectRoom"]
    RoomDetail["房产信息<br/>pages/roomDetail/roomDetail"]

    SelectFloor -->|选择楼栋<br/>返回floorId| SelectUnit
    SelectUnit -->|选择单元<br/>返回unitId| SelectRoom
    SelectRoom -->|选择房屋<br/>返回roomId| RoomDetail

    style SelectFloor fill:#e6fff7
    style SelectUnit fill:#fff7e6
    style SelectRoom fill:#ffe6f0
```

### 18.2 其他功能页面

```mermaid
graph TB
    %% 其他功能页面
    Appointment["预约核销<br/>pages/appointment/appointment"]
    HouOne["核销扫码<br/>pages/appointment/hou_one"]
    WriteOffCoupon["核销优惠券<br/>pages/coupon/writeOffCoupon"]
    WirteOffReserve["核销预约<br/>pages/coupon/wirteOffReserve"]
    ItemRelease["物品发布<br/>pages/itemRelease/itemRelease"]
    ItemReleaseDetail["发布详情<br/>pages/itemRelease/itemReleaseDetail"]
    Visit["访问记录<br/>pages/visit/visit"]
    VisitDetail["访问详情<br/>pages/visit/visitDetail"]
    UndoAudit["待办审核<br/>pages/audit/undoAudit"]
    VideoList["监控列表<br/>pages/video/videoList"]
    PlayVideo["观看视频<br/>pages/video/playVideo"]
    Charge["充电桩<br/>pages/charge/charge"]
    ChargeDetail["充电桩详情<br/>pages/charge/chargeDetail"]
    HcWebView["WebView<br/>pages/hcWebView/hcWebView"]

    %% 预约核销的跳转
    Appointment -->|核销扫码| HouOne

    %% 物品发布的跳转
    ItemRelease -->|查看详情<br/>参数: itemId| ItemReleaseDetail

    %% 访问记录的跳转
    Visit -->|查看详情<br/>参数: visitId| VisitDetail

    %% 监控的跳转
    VideoList -->|观看视频<br/>参数: videoUrl| PlayVideo

    %% 充电桩的跳转
    Charge -->|查看详情<br/>参数: chargeId| ChargeDetail

    %% 样式
    style Appointment fill:#e6fff7
    style VideoList fill:#fff7e6
    style Charge fill:#ffe6f0
```

## 模块统计总览

| 序号 | 模块名称       |  页面数  | 主要功能                     |
| :--: | :------------- | :------: | :--------------------------- |
|  1   | 基础模块       |    5     | 首页、工作台、通讯录、我的   |
|  2   | 维修工单流程   |   10+    | 工单派遣、处理、回访         |
|  3   | 投诉处理流程   |    7     | 投诉受理、处理、评价         |
|  4   | 巡检管理流程   |    8     | 巡检打卡、执行、补检         |
|  5   | 空置房管理流程 |    5     | 空置房申请、跟踪             |
|  6   | 装修管理流程   |    5     | 装修申请、跟踪               |
|  7   | 设备保养流程   |    4     | 设备保养任务管理             |
|  8   | 采购/资源管理  |   20+    | 采购、领用、调拨、入库       |
|  9   | 费用管理       |    6     | 收费、催缴                   |
|  10  | 抄表管理       |    6     | 水电抄表、公摊抄表           |
|  11  | 业主管理       |    3     | 业主信息维护                 |
|  12  | 车辆管理       |    5     | 车辆、道闸、进出场           |
|  13  | OA 工作流      |    7     | 流程审批                     |
|  14  | 工作单         |    8     | 工作任务管理                 |
|  15  | 报表统计       |    6     | 各类数据报表                 |
|  16  | 个人中心       |    7     | 个人信息、设置               |
|  17  | 公告活动       |    4     | 公告、小区文化活动           |
|  18  | 其他辅助功能   |   20+    | 房屋选择、预约、监控、充电桩 |
|      | **合计**       | **130+** | **18 个主要业务模块**        |

## 关键跳转模式总结

|  跳转类型  |    使用场景    | 示例              |
| :--------: | :------------: | :---------------- |
| navigateTo |  普通页面跳转  | 列表 → 详情       |
| redirectTo | 表单提交后跳转 | 提交成功 → 列表页 |
|  reLaunch  |    应用重启    | 登录成功 → 首页   |

## 参数传递方式

|      方式      | 说明     | 示例                              |
| :------------: | :------- | :-------------------------------- |
| URL 查询字符串 | 简单参数 | `?repairId=xxx&storeId=xxx`       |
|  JSON 序列化   | 复杂对象 | `?apply=` + `JSON.stringify(obj)` |
|    本地存储    | 大量数据 | `uni.setStorageSync()`            |

## 主要业务流程路径

### 1. 维修工单流程

```plain
工单池 → 工单详情 → 工单处理 → 选择物品 → 派单成功 → 工单已办
```

### 2. 投诉处理流程

```plain
投诉列表 → 投诉详情 → 投诉处理 → 投诉已办
```

### 3. 巡检流程

```plain
巡检列表 → 巡检过程 → 执行单项巡检 → 二维码巡检 → 提交完成
```

### 4. 空置房管理流程

```plain
空置房列表 → 空置房详情 → 跟踪记录列表 → 添加/查看跟踪记录
```

### 5. 装修管理流程

```plain
装修记录列表 → 装修详情 → 跟踪记录列表 → 添加/查看跟踪记录
```

### 6. 采购流程

```plain
采购管理 → 添加/编辑采购申请 → 采购详情 → 采购审批
```

### 7. 费用管理流程

```plain
收银台 → 费用详情 / 创建费用 / 催缴登记
```

### 8. 抄表流程

```plain
抄表列表 → 手工抄表 / 二维码抄表 → 提交成功
```

**生成时间**: 2025-10-20
**项目**: HC 掌上物业 Vue2 版本 (gitee-example)
**覆盖范围**: 18 个业务模块，130+ 页面
**版本**: v2.0 完整版
