# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

HC 掌上物业是一个完全开源的智慧社区物业管理系统移动端应用，基于 uni-app Vue2 框架开发，支持一次编码多端运行（H5、微信小程序、APP、支付宝小程序等）。项目面向物业工作人员，提供工单维修、巡检打卡、采购管理、物品领用、投诉处理、房产管理、通讯录、公告发布等完整的物业管理功能。

### 项目特色

- **Java110 生态体系**: 配套 HomeCommunity 智慧社区后端系统
- **物业专业化**: 专门针对物业管理场景的业务设计
- **全平台支持**: H5、微信小程序、APP 多端统一
- **开源免费**: 完全开源，可自由定制和部署

## 开发环境配置

### 技术栈版本

- **前端框架**: uni-app (基于 Vue2)
- **开发语言**: JavaScript (非 TypeScript)
- **UI 组件库**: ColorUI + uni-app 内置组件
- **状态管理**: Vuex 2.x
- **地图服务**: 腾讯地图 API
- **构建工具**: HBuilderX IDE

### 运行和构建命令

此项目使用传统 uni-app 开发模式，主要通过 HBuilderX IDE 进行开发和构建：

**开发调试**:

- 在 HBuilderX 中打开项目根目录
- 选择"运行" → "运行到浏览器" (H5)
- 选择"运行" → "运行到小程序模拟器" → "微信开发者工具"
- 选择"运行" → "运行到手机或模拟器"

**生产构建**:

- 选择"发行" → "网站-H5 手机版"
- 选择"发行" → "小程序-微信"
- 选择"发行" → "App-云打包"

### 核心配置文件

- **`conf/config.js`** - 项目核心配置，包含服务器地址、地图密钥等
- **`pages.json`** - 页面路由配置和导航样式
- **`manifest.json`** - 应用基本信息和平台特定配置
- **`package.json`** - npm 依赖管理 (仅 2 个依赖: file-saver, vue-jsonp)
- **`main.js`** - 应用入口文件和全局配置
- **`App.vue`** - 应用根组件

### 环境配置关键点

在 `conf/config.js` 中需要根据部署环境修改：

```javascript
// H5 环境代理配置
let baseUrl = "/"; // H5 使用代理

// 小程序/APP 环境
let baseUrl = "http://demo.homecommunity.cn/"; // 直接后端地址

// 其他重要配置
let commonBaseUrl = "http://demo.homecommunity.cn/"; // 图片资源服务器
let QQMapKey = ""; // 腾讯地图 API 密钥
let appPayKey = ""; // APP 支付密钥
```

## 项目架构详解

### 目录结构解析

```plain
gitee-example/
├── api/                    # API 接口层 - 按业务模块组织
│   ├── apply/             # 申请类接口
│   ├── complaint/         # 投诉处理接口
│   ├── community/         # 小区管理接口
│   ├── fee/               # 收费管理接口
│   ├── inspection/        # 巡检管理接口
│   ├── maintainance/      # 维修维护接口
│   ├── oa/                # OA 办公接口
│   └── ...               # 其他业务模块
├── components/            # 全局公用组件
├── conf/                  # 配置文件目录
│   └── config.js         # 核心配置文件
├── constant/              # 常量定义
│   └── url.js            # API 接口 URL 统一管理
├── lib/                   # 第三方库和核心工具
│   ├── java110/          # Java110 生态核心库
│   │   ├── Java110Context.js  # 统一上下文对象
│   │   ├── api/          # 核心 API 封装
│   │   ├── utils/        # 工具类集合
│   │   └── factory/      # 工厂模式组件
│   ├── colorui/          # ColorUI 组件库
│   ├── qqmap-wx-jssdk.min.js  # 腾讯地图SDK
│   └── weapp-qrcode.js   # 小程序二维码生成
├── pages/                 # 页面目录 - 按功能模块组织
│   ├── index/            # 首页模块
│   ├── login/            # 登录模块
│   ├── my/               # 个人中心
│   ├── addressList/      # 通讯录
│   ├── notice/           # 公告管理
│   ├── repairOrder/      # 维修工单
│   ├── complaint*/       # 投诉处理系列页面
│   ├── inspection*/      # 巡检管理系列页面
│   ├── resource*/        # 资源管理系列页面
│   ├── purchas*/         # 采购管理系列页面
│   └── ...              # 其他功能模块
├── static/               # 静态资源
├── store/                # Vuex 状态管理
│   └── index.js         # 基础 store 配置
├── style/                # 全局样式
├── uni_modules/          # uni-app 插件模块
├── App.vue              # 应用根组件
├── main.js              # 应用入口
├── pages.json           # 页面配置
├── manifest.json        # 应用清单
└── uni.scss            # uni-app 全局样式
```

### 核心架构模式

#### 1. Java110Context 统一上下文模式

这是项目最重要的架构特色，通过统一的上下文对象管理所有工具方法和 API 调用：

```javascript
// main.js 中的全局注册
Vue.prototype.java110Context = Java110Context;
Vue.prototype.java110Constant = Java110Context.constant;
Vue.prototype.java110Factory = Java110Context.factory;
Vue.prototype.java110Util = Java110Context.util;

// 在页面中使用
this.java110Context.getHeaders(); // 获取请求头
this.java110Util.wxuuid(); // 生成UUID
this.java110Factory.createRequest(); // 创建请求对象
```

#### 2. 模块化 API 设计

API 层按业务领域严格分模块，每个模块独立管理：

- **维修模块**: `api/maintainance/` - 处理维修工单
- **投诉模块**: `api/complaint/` - 处理投诉工单
- **巡检模块**: `api/inspection/` - 处理巡检任务
- **采购模块**: `api/resource/` - 处理采购申请
- **OA 模块**: `api/oa/` - 处理办公流程

#### 3. 页面路由组织策略

页面按功能模块组织，支持复杂的业务流程：

- **工单处理流**: 工单列表 → 工单详情 → 工单处理 → 工单完成
- **巡检流程**: 巡检任务 → 执行巡检 → 巡检转移 → 巡检复验
- **采购流程**: 采购申请 → 采购审核 → 采购清单 → 采购进度

### 核心技术组件

#### 前端技术栈

- **Vue.js 2.x**: 基础框架，使用 Options API
- **uni-app**: 跨平台开发框架
- **Vuex 2.x**: 状态管理 (当前为基础配置)
- **ColorUI**: 主要 UI 组件库
- **腾讯地图**: 地图和位置服务
- **file-saver**: 文件下载处理
- **vue-jsonp**: JSONP 请求支持

#### 核心工具库

- **Java110Context**: 统一上下文管理
- **request.js**: 网络请求封装
- **DateUtil**: 日期时间工具
- **StringUtil**: 字符串处理工具
- **DesUtil**: 加密解密工具
- **SeqUtil**: 序列号生成工具

### 业务功能模块

#### 1. 用户认证与权限管理

```plain
登录流程: pages/login/login.vue
会话管理: lib/java110/api/Java110SessionApi.js
权限检查: hasPrivilege() 方法
小区切换: pages/changeCommunity/changeCommunity.vue
```

#### 2. 工单管理体系

**维修工单**:

- `pages/repairOrder/` - 维修工单列表
- `pages/repairAdd/` - 新增维修工单
- `pages/repairDetail/` - 工单详情查看
- `pages/repairDispatch/` - 工单派遣处理
- `pages/repairHandle/` - 工单处理
- `pages/repairDispatchFinish/` - 工单完成

**投诉处理**:

- `pages/complaintList/` - 投诉列表
- `pages/complaintOrder/` - 投诉工单详情
- `pages/complaintHandle/` - 投诉处理
- `pages/complaintFinish/` - 投诉完成
- `pages/auditComplaintOrder/` - 投诉审核

#### 3. 巡检管理体系

- `pages/inspection/` - 巡检任务列表
- `pages/excuteInspection/` - 执行巡检
- `pages/excuteOneInspection/` - 单项巡检
- `pages/excuteOneQrCodeInspection/` - 二维码巡检
- `pages/inspectionTransfer/` - 巡检转移
- `pages/inspectionReexamine/` - 巡检复验

#### 4. 资源采购管理

- `pages/purchaseRequest/` - 采购申请
- `pages/purchaseReview/` - 采购审核
- `pages/purchaseList/` - 采购清单
- `pages/purchasingSchedule/` - 采购进度
- `pages/urgentPurchaseApplyStep/` - 紧急采购申请

#### 5. 办公管理 (OA)

- `pages/oaWorkflow/` - OA 工作流
- `pages/newOaWorkflowForm/` - 新建工作流表单
- `pages/newOaWorkflowUndo/` - 待办工作流
- `pages/newOaWorkflowFinish/` - 已完成工作流

### 平台适配策略

#### 条件编译指令

```javascript
// H5 环境
// #ifdef H5
let baseUrl = "/";
// #endif

// 小程序环境
// #ifndef H5
let baseUrl = "http://demo.homecommunity.cn/";
// #endif

// 微信小程序特定
// #ifdef MP-WEIXIN
Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
// #endif

// 支付宝小程序特定
// #ifdef MP-ALIPAY
Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
// #endif
```

#### 平台特性处理

- **H5**: 使用代理解决跨域，隐藏导航栏
- **小程序**: 适配不同小程序平台的导航栏高度
- **APP**: 处理状态栏高度，权限申请

## 开发规范与最佳实践

### 代码组织规范

1. **API 接口规范**:
   - 所有接口在 `constant/url.js` 中统一定义
   - API 调用统一使用 `lib/java110/request.js`
   - 接口按业务模块分文件组织

2. **页面开发规范**:
   - 页面文件按功能模块分目录
   - 复杂业务使用多页面流程设计
   - 统一使用 ColorUI 组件规范

3. **数据存储规范**:
   - 使用 `uni.setStorageSync/getStorageSync` 本地存储
   - 通过 Java110Context 的 `setJson/getJson` 处理复杂对象
   - 敏感信息使用 DesUtil 加密存储

### 环境部署注意事项

1. **配置文件修改**:
   - 修改 `conf/config.js` 中的服务器地址
   - 配置腾讯地图 API 密钥
   - 设置支付相关密钥

2. **跨域处理**:
   - H5 环境需要配置代理或后端 CORS
   - 小程序需要在后台配置合法域名
   - APP 需要处理网络权限

3. **平台发布**:
   - 小程序需要提交审核
   - APP 需要配置证书和权限
   - H5 需要配置域名和 HTTPS

### 常见问题解决

1. **接口调用失败**: 检查 `conf/config.js` 中的 baseUrl 配置
2. **地图显示异常**: 确认 QQMapKey 配置正确
3. **小程序授权问题**: 检查 manifest.json 中的权限配置
4. **跨域问题**: H5 环境需要配置代理或后端支持 CORS

### 项目扩展建议

1. **TypeScript 迁移**: 可考虑渐进式迁移到 TypeScript
2. **Vue3 升级**: 未来可考虑升级到 uni-app Vue3 版本
3. **组件库升级**: 可考虑使用更现代的 UI 组件库
4. **状态管理增强**: 完善 Vuex store 的模块化设计
