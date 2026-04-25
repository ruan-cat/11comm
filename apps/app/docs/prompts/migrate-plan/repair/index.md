# 维修模块 迁移提示词

这是一系列迁移用途的提示词。长度过长，拆分到下一个提示词文件内。

## 017 `维修工单流程模块` 系列页面迁移

我需要你帮我实现一整个 `维修工单流程模块` 系列页面的迁移。

目前全部按照 `docs\reports\repair-module-migration-plan.md` 文档重新整理的一套迁移计划，来完成该模块的集中迁移。

### 01 按照路由要求，新建简单占位符页面

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确清楚要处理的页面。
2. 阅读 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容。
3. 我们一共需要新建 13 个页面。按照 `维修工单流程模块` 的说明。需要新建 13 个页面。
4. 阅读 `route-migration` 子代理文档。
5. 开始新建我需要的这 13 个页面。按照上述文档的要求，新增满足正确路径的页面文件。
6. 每个页面文件的最顶上，必须包括文本注释，注释说明
7. 在 `docs\prompts\route-migration-map.yml` 标记 `3. 维修管理模块 (10个页面)` 都迁移完成了。

### 02 新建路由跳转函数并在页面内使用

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确清楚跳路由时需要传递的参数。
2. 通过 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，针对性的阅读关于路由跳转的函数，针对性的用 `uni.navigateTo` 函数在 `旧项目` 的 vue 组件内查询清楚跳路由时的传参。
3. 按照 `route-migration` 子代理的要求，新建整个 `维修工单流程模块` 所需要的强类型路由跳转函数。
4. 在 `维修工单流程模块系列页面` 内，每一个 vue 组件顶部都补全说明跳转路由的地址、并且提供一个临时性质的按钮，和临时性质的，写死的假数据，实现点击按钮即可跳路由的功能，我需要尽早在 `维修工单流程模块系列页面` 内模拟整个跳路由的业务流程。

### 03 新建接口

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，理清楚这 13 个页面的接口。
3. 按照 `api-migration` 子代理的要求，完成接口迁移。
4. 在 `src\types\repair.ts` 内补全业务类型。
5. 允许在页面内以简陋的方式，输出全部的数据。本阶段不考虑任何美观，只考虑接口迁移，和数据展示。
6. 务必确保 `维修工单流程模块系列页面` 内，都能看到接口数据。

### 04 迁移组件

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，准备实现组件迁移。
3. 按照 `component-migration` 子代理的要求，完成全部 `维修工单流程模块系列页面` 的组件迁移。
4. 这个阶段只负责实现组件迁移，不考虑样式迁移。

#### 01 更改正确的图片预览写法

针对 `src\pages-sub\repair\order-detail.vue` 的 `wd-image-preview` 组件，这个组件是不存在的。

1. 请阅读 `https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/img.md` 文档。学会使用 `<wd-img>` 的预览功能写法。
2. 阅读`旧项目`代码 `gitee-example/pages/repairDetail/repairDetail.vue` 。think hard 了解清楚旧项目如何使用图片预览的。
3. 按照 `component-migration` 子代理的要求，修复 `src\pages-sub\repair\order-detail.vue` 组件错误使用不存在组件 `wd-image-preview` 的故障。

### 05 迁移样式

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，准备实现样式迁移。
3. 按照 `style-migration` 子代理的要求，完成全部 `维修工单流程模块系列页面` 的样式迁移。

### 06 代码写法迁移

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，准备实现代码迁移。
3. 按照 `code-migration` 子代理的要求，完成全部 `维修工单流程模块系列页面` 的代码迁移。

### 07 整体性检查

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `docs\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件。
3. 对全部的 `维修工单流程模块系列页面` 组件，使用全部的迁移子代理，做全面的检查，最后输出一个查漏补缺的文档。

### 08 整体性修复

1. 按照检查报告，对全部的 `维修工单流程模块系列页面` 组件，做统一的修复处理。

## 018 手动的实现 `维修工单流程模块系列页面` 的故障处理

### 01 处理类型故障

阅读以下文件出现的类型故障，并修复。

- src\api\repair.ts
- src\pages-sub\repair\add-order.vue
- src\pages-sub\repair\order-detail.vue
- src\pages-sub\repair\order-list.vue
- src\pages-sub\repair\select-resource.vue
- src\pages-sub\repair\dispatch.vue
- src\pages-sub\repair\handle.vue

请你阅读 `api-migration` code-migration component-migration 这三个子代理文件，并按照子代理的要求，修复上述文件的类型报错。并在必要的时候改写代码写法，改换合适的组件。

**绝对不要独立运行子代理**。现在的业务场景是混合上下文场景，不需要独立上下文，请你不要独立运行子代理。

你敢未经我允许就独立运行子代理，消耗了过多的 token。下次 claude code 调查文件出来的时候，我就给你打差评。

听懂了么？阅读子代理，而不是运行子代理。

### 02 继续处理类型故障

请继续处理以下文件出现的类型故障，请你通过运行类型检查命令的方式，统一处理这些类型报错：

src\api\repair.ts
src\api\mock\repair.mock.ts
src\pages-sub\repair\add-order.vue
src\pages-sub\repair\order-detail.vue
src\pages-sub\repair\select-resource.vue
src\pages-sub\repair\end-order.vue
src\pages-sub\repair\finish.vue

src\pages-sub\repair\add-order.vue
src\pages-sub\repair\order-detail.vue
src\pages-sub\repair\select-resource.vue
src\pages-sub\repair\finish.vue
src\pages-sub\repair\dispatch.vue
src\pages-sub\repair\handle.vue

请你在处理类型报错时，以 `src\types\repair.ts` 提供的类型为准，以 `src\api\repair.ts` 接口的字段为准，适当的修改上述 vue 组件的代码，确保满足类型约束。使得上述代码不出现类型报错。

---

请你以 ultrathink 的思考模式，认真阅读并思考文档要求。在思考上，请你大胆的多使用 token 做深度的，全面的，细致的推理思考。这是一个复杂的多步骤任务，请你认真的动态编排。执行每一个步骤时，都务必要主动使用尽可能多的 token 做充分详实完善完整的思考，允许你多花费时间做阅读，对比，思考。最后严格按照文档要求落实。

## 019 按照 `api-migration` 的要求重构代码

1. 认真阅读 `api-migration` 的要求。
2. 你要处理 `维修工单流程模块系列页面` 涉及到的 vue 组件。
3. 检查我列举给你的代码，确保这些异步请求，是否都统一使用了 `api-migration` 所要求的 `useRequest` 函数。如果没有，请按照 `api-migration` 的要求做
4. 检查是否缺少了 `immediate: false` 配置。缺少了就手动补全。

## 020 补全 `src\api\mock\repair.mock.ts` 的 mock 接口

1. 完整阅读 `api-migration` 子代理文件。
2. 完整阅读 `src\api\repair.ts` 接口。
3. 完整阅读 `src\api\mock\repair.mock.ts` 接口。
4. 在不允许修改 `src\api\repair.ts` 接口的情况下，按照 `api-migration` 的要求，为 `src\api\mock\repair.mock.ts` mock 接口文件，补充接口。
5. 独立运行 `api-migration` 子代理。

### 01

1. 补充的 mock 接口请注意按照注释说明的序号，做好排序。
2. 在 `docs\reports\2025-11-16-api-migration-validation-repair.md` 编写你的报告。
3. 继续按照 `api-migration` 子代理的要求实现，独立运行子代理。

## 021 设计迁移 selectFloor selectUnit selectRoom 这三个页面的迁移计划

1. 阅读 `docs\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确清楚该模块的引用关系。
2. 重点阅读 `选择房屋相关页面` 和其他模块的关联关系。
3. 从 `维修工单流程模块` 的 `选择房屋相关页面` 内，得知 `旧项目` 的代码，搞清楚这三个页面在旧项目的 `维修工单流程模块` 内，是如何使用的。
4. 阅读 `docs\prompts\route-migration-map.yml` 关于 `选择器页面 (3个)` 的内容。明确清楚这三个旧页面在新项目内如何新建页面，如何新建路由。
5. 安排任务，依次按照子代理的要求，对这三个 `选择器页面` 实现代码迁移改造。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。
6. 按照顺序，按照上述子代理的要求，逐步对三个 `选择器页面` 实现代码迁移改造。
7. 这是复杂的任务，请你设计好合适的任务执行步骤。
8. 在你执行时，请**不要直接运行子代理**。否则 token 的消耗会过快。
9. 请你先设计好一个完整的，全面的迁移计划，未来我会择机要求你独立执行完整的迁移任务计划。
10. 有疑问请直接咨询我。

### 01

1. 生成你的迁移计划 markdown 文档，生成在 `docs\prompts\migrate-plan` 目录内。
2. 不要更新 `docs\vue2-route-navigation-map.md` 文档，你应该更新 `docs\prompts\route-migration-map.yml` 的 `选择器页面 (3个)` 部分，来标记你已完成迁移任务。

## 022 补全完善接口

阅读以下文件：

1. src\api\floor.ts
2. src\api\room.ts
3. src\api\unit.ts

根据 `api-migration` 代理的要求，同时阅读相关的，与文件名对应的 mock 接口文件。

1. 按照 `api-migration` 代理的要求，运行 `api-migration` 代理，修复这些接口文件不规范的部分。
2. 运行 `api-migration` 代理，修复这些对应 mock 接口的内容，确保每一个接口都有对应的 mock 接口实现。
3. 不要修改掉上述文件的接口，以上述文件接口为数据源，以 `api-migration` 代理为要求，补全，修复内容。
4. 请你修复接口文件不规范的部分，但是不要新增，删除接口。接口数目不应该变化。
5. 修复完接口文件后，请你修复，补全对应的 mock 接口文件。

## 023 处理代码报错

1. 阅读 `docs\prompts\migrate-plan\2025-11-17-select-floor-unit-room-migration-plan.md` 迁移报告。
2. 阅读 `docs\prompts\route-migration-map.yml` `选择器页面 (3个)` 部分的路由迁移映射。
3. 反向阅读旧项目内对应的代码。
4. 针对 `src\pages-sub\selector` 目录下的几个选择用途的页面。
5. 这几个页面出现明显的故障，请对这三个页面，安排任务，依次按照子代理的要求，对这三个 `选择器页面` 实现代码迁移改造。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。

## 024 对接口代码做处理

阅读以下文件：

1. src\api\floor.ts
2. src\api\room.ts
3. src\api\unit.ts

根据 `api-migration` 代理的要求，同时阅读相关的，与文件名对应的 mock 接口文件。

1. 按照 `api-migration` 代理的要求，运行 `api-migration` 代理，修复这些接口文件不规范的部分。
2. 不要修改掉上述文件的接口，以上述文件接口为数据源，以 `api-migration` 代理为要求，补全，修复内容。
3. 请你修复接口文件不规范的部分，但是不要新增，删除接口。接口数目不应该变化。

## 025 处理代码的组件使用错误

1. 阅读 `docs\prompts\migrate-plan\2025-11-17-select-floor-unit-room-migration-plan.md` 迁移报告。
2. 阅读 `docs\prompts\route-migration-map.yml` `选择器页面 (3个)` 部分的路由迁移映射。
3. 反向阅读旧项目内对应的代码。
4. 针对 `src\pages-sub\selector` 目录下的几个选择用途的页面。
5. 这几个页面出现明显的故障，请对这三个页面，安排任务，依次按照子代理的要求，对这三个 `选择器页面` 实现代码迁移改造。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。

## 026 添加维修记录 页面，补全选择列表的入口页面

1. 阅读 `src\pages-sub\repair\add-order.vue` 出现的 TODO 部分。
2. 阅读 `src\pages-sub\selector` 目录下的几个选择用途的页面。
3. 目前已经实现了这些选择器页面，请你在 `添加维修记录` 页面内，对接实现这些功能。
4. 实现路由跳转时，请务必使用 `.claude\agents\route-migration.md` 子代理，按照 `路由迁移子代理` 的要求实现页面跳转。
5. 请你主动使用谷歌浏览器 MCP，实现该页面的测试，测试 `添加维修记录` 页面是否能访问这些选择页面。
6. `添加维修记录` 页面可访问的 url 地址，在 `src\pages-sub\repair\add-order.vue` 文件最上面提供的 url 内可见。

## 027 反向检查业务字段是否准确

1. 请你阅读 `docs\vue2-route-navigation-map.md` 的 `维修工单流程模块` 。
2. 根据 `docs\prompts\route-migration-map.yml` ，反向的阅读旧代码对应的 vue2 代码，确定在旧代码内，已经有的业务类型。
3. 检查 `src\pages-sub\repair` 和 `src\pages-sub\selector` 的 vue 组件，确保这些组件内的代码均满足旧代码的业务类型。
4. 按照 `docs\prompts\migrate-plan\2025-11-17-select-floor-unit-room-migration-plan.md` 文档的要求，修改对应的迁移后的代码。
5. 修改以下几个接口文件，确保这些接口文件所对应的业务类型都是准确的：
   - src\api\floor.ts
   - src\api\room.ts
   - src\api\unit.ts
   - src\api\repair.ts
6. 修改以上几个业务接口对应的 mock 接口，确保这些接口满足正确的业务类型命名。不要出现任何兼容字段名的写法。确保字段缺漏的校验写法，满足业务类型字段的要求。
7. 请你确定以旧代码出现的业务类型为准，修改现有代码的业务类型。

### 01 回答 AI 问题

1. 维修类型值：旧版 repairAdd 从 listRepairSettings 拿到的 repairType 是代码（如 1001/1002...），repairTypeName 才是中文。当前新代码的类型/Mock 使用中文枚举（如“水电维修”）。需要改成 `以代码为准，配合 repairTypeName 字段`。同时要去掉 RepairOrder 里与中文枚举绑定的类型定义（改成 string）。`repairType` 和 `repairTypeName` 都一起使用。
2. 兼容字段清理：Repair 类型里现在有 description/context、ownerName/repairName、ownerPhone/tel 等并存。按照严格的“**不要出现兼容字段名**”的要求，**全部收敛为旧版主字段**（如 context/repairName/tel 等），并同步页面/Mock。
3. 选择器接口响应形态：旧版返回字段是 apiFloorDataVoList / rooms 等，新版 API/Mock 统一返回 { list,total,... }，页面用 z-paging 直接吃 list。**保持新版分页形态**，只保证**列表元素字段**（floorId/floorNum/floorName 等）对齐旧版即可。
4. 单元/房屋字段取值：旧版 unitNum/roomNum 是纯编号，新版 Mock 里 unitNum 带了“单元”后缀，roomNum 也有构造规则。需要改成纯编号（与旧版一致）。需要补充 communityId 返回到单元/房屋项里。并且去对应使用 `unitNum/roomNum` 字段的前端页面内，加上基于 computed 的字段格式化，加上“单元”后缀。
5. 维修状态/字典：旧版状态/字典字段是 statusCd/name。当前 API/Mock 已用 statusCd/name，但 RepairStatus 类型枚举是英文单词。需要把列表里的 status/state 完全切换为 statusCd 代码（与旧版一致）。

## 028 `维修工单池` 列表页 `src\pages-sub\repair\order-list.vue`

1. 针对 `src\pages-sub\repair\order-list.vue` 维修工单池 列表页的代码。
2. 阅读其旧代码 `gitee-example/pages/repairOrder/repairOrder.vue` 。
3. 维修工单池列表页，其 `z-paging` 组件的使用并没有按照 `z-paging 分页组件集成方案` 来做，请按照 `z-paging 分页组件集成方案` 的要求来修改。
4. 维修工单池列表页，请按照 `组件迁移子代理` 的要求更改。

### 01 优化 `维修工单池` 的 UI 前端界面

如图：

![2025-12-07-16-12-12](https://s2.loli.net/2025/12/07/MQlxa29OYKGDeAV.png)

整个 `维修工单池` 的 UI 前端界面，很不美观，很不好看。

1. 请参考结合 `src\pages-sub\selector\select-floor.vue` 选择页，对这个列表页，也使用相同的 `z-paging` 组件写法。补全，完成空状态、加载态的内容。
2. 必须遵守 `component-migration` 子代理的要求。
3. 保留按钮的颜色，文本字段的排序位置。
4. 重点修改文本的响应式效果。避免出现文字一个大一个小的情况。
5. 重点避免页面出现明显的滚动条。这是移动端页面，不应该出现任何形式的滚动条。

### 02 业务理解，为什么 `维修工单池` 可以结束工单？

1. 阅读 src\pages-sub\repair\order-list.vue 、src\pages-sub\repair\dispatch.vue 及其对应的旧代码。
2. 我很疑惑的是，为什么 `维修工单池` 可以结束工单，而 `维修待办单` 却不允许结束工单？

### 03 代码参数理解，url 参数 `statusCd` 的作用

1. 阅读 src\pages-sub\repair\order-list.vue 及其对应的旧代码。
2. 根据旧代码的路由跳转情况，为我解释一下，`维修工单池` 列表页的上级页面是那个？是什么逻辑传递了参数 `statusCd` ？
3. 这个参数在 `维修工单池` 页面内，是怎么使用的？

## 029 维修工单流程模块 - 通用迁移任务

### 01 处理类型故障

阅读以下文件出现的类型故障，并修复。

- src\api\repair.ts
- src\pages-sub\repair\add-order.vue
- src\pages-sub\repair\order-detail.vue
- src\pages-sub\repair\order-list.vue
- src\pages-sub\repair\select-resource.vue
- src\pages-sub\repair\dispatch.vue
- src\pages-sub\repair\handle.vue

请你阅读 `api-migration` code-migration component-migration 这三个子代理文件，并按照子代理的要求，修复上述文件的类型报错。并在必要的时候改写代码写法，改换合适的组件。

**绝对不要独立运行子代理**。现在的业务场景是混合上下文场景，不需要独立上下文，请你不要独立运行子代理。

你敢未经我允许就独立运行子代理，消耗了过多的 token。下次 claude code 调查文件出来的时候，我就给你打差评。

听懂了么？阅读子代理，而不是运行子代理。

### 02 继续处理类型故障

请继续处理以下文件出现的类型故障，请你通过运行类型检查命令的方式，统一处理这些类型报错：

src\api\repair.ts
src\api\mock\repair.mock.ts
src\pages-sub\repair\add-order.vue
src\pages-sub\repair\order-detail.vue
src\pages-sub\repair\select-resource.vue
src\pages-sub\repair\end-order.vue
src\pages-sub\repair\finish.vue

src\pages-sub\repair\add-order.vue
src\pages-sub\repair\order-detail.vue
src\pages-sub\repair\select-resource.vue
src\pages-sub\repair\finish.vue
src\pages-sub\repair\dispatch.vue
src\pages-sub\repair\handle.vue

请你在处理类型报错时，以 `src\types\repair.ts` 提供的类型为准，以 `src\api\repair.ts` 接口的字段为准，适当的修改上述 vue 组件的代码，确保满足类型约束。使得上述代码不出现类型报错。

---

请你以 ultrathink 的思考模式，认真阅读并思考文档要求。在思考上，请你大胆的多使用 token 做深度的，全面的，细致的推理思考。这是一个复杂的多步骤任务，请你认真的动态编排。执行每一个步骤时，都务必要主动使用尽可能多的 token 做充分详实完善完整的思考，允许你多花费时间做阅读，对比，思考。最后严格按照文档要求落实。

## 030 按照 `api-migration` 的要求重构代码

针对 `src\pages-sub\repair\add-order.vue` `添加维修记录` 表单页。

1. 先阅读该文件所对应的旧代码。明确清楚代码写法。
2. 根据 `.claude\skills\use-wd-form\SKILL.md` 技能文件，优化 `添加维修记录` 表单页的代码写法。
3. 在优化的时候，请你陆续的对 `添加维修记录` 表单页，依次使用这五个子代理，完成代码写法的迁移修改。确保满足下面这 5 个子代理的编写要求。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。
4. 在改造时，务必要遵循 `api-error-handling` 和 `use-wd-form` 这两个技能文件的要求来修改。

## 031 `结束维修工单` 表单页 `src\pages-sub\repair\end-order.vue`

### 01 优化 `结束维修工单` 表单页的代码写法

针对 `src\pages-sub\repair\end-order.vue` `结束维修工单` 表单页。

1. 先阅读该文件所对应的旧代码 `gitee-example/pages/repairOrder/repairEnd.vue` 。明确清楚代码写法。
2. 根据 `.claude\skills\use-wd-form\SKILL.md` 技能文件，优化 `结束维修工单` 表单页的代码写法。
3. 在优化的时候，请你陆续的对 `结束维修工单` 表单页，依次使用这五个子代理，完成代码写法的迁移修改。确保满足下面这 5 个子代理的编写要求。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。
4. 在改造时，务必要遵循 `api-error-handling` 和 `use-wd-form` 这两个技能文件的要求来修改。

### 02 补全 结束维修工单` 表单页的表单标题组件

1. 针对 `src\pages-sub\repair\end-order.vue` `结束维修工单` 表单页。
2. 按照 `use-wd-form` 等技能的要求，重新优化、补全 `结束维修工单` 表单页的表单标题组件。
3. 根据多款技能的要求，检查代码写法，是否还有继续被优化、缺省缺漏的地方。
4. 补全 form-section-title 组件。

## 032 优化 `维修工单详情` 页

针对 `src\pages-sub\repair\order-detail.vue` 文件。

1. 先阅读该文件所对应的旧代码 `gitee-example/pages/repairDetail/repairDetail.vue` 。明确清楚代码写法。
2. 大量的使用 `wot-design-uni` 组件库，优化内部的代码写法。
   - https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component
   - https://wot-ui.cn/guide/quick-use.html
3. 在优化的时候，请你陆续的对该页面，依次使用这五个子代理，完成代码写法的迁移修改。确保满足下面这 5 个子代理的编写要求。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。

### 01 优化图标的显示效果

如图，请阅读这些 url 图片：

![2025-12-21-20-40-47](https://s2.loli.net/2025/12/21/DrnOZAF4sq1a6hy.png)

![2025-12-21-20-41-17](https://s2.loli.net/2025/12/21/G4McmCTXhYFxwH3.png)

![2025-12-21-20-41-28](https://s2.loli.net/2025/12/21/KZgdJD6kbPEpMfL.png)

在 `src\pages-sub\repair\order-detail.vue` 维修工单详情 内，这些 icon 标签的显示效果很差，和文本的大小不统一，且有错位的情况。请修改代码，确保 icon 显示效果整齐对齐。

请使用谷歌浏览器 MCP 来访问 `http://localhost:3000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001` 页面，自主检查这些 icon 对齐效果如何。

### 02 处理图标大小和文本大小

如图，请阅读这些 url 图片：

![2025-12-21-22-06-27](https://s2.loli.net/2025/12/21/8jy2MxCFutowKAD.png)

1. 将图标对齐，不要有靠左上角偏移的情况。
2. 文本整体性的放大一点，和下面的内容相匹配。

### 03 处理文本在响应式情况下显示太小的情况

如图，请阅读这些 url 图片：

![2025-12-21-22-18-22](https://s2.loli.net/2025/12/21/F3eMGUSmanAcY7w.png)

1. 在响应式场景下，文本应该和 icon 的大小相同。请处理。
2. 启动本地服务器，然后用 谷歌浏览器 MCP 来访问 `http://localhost:3000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001` 页面。自主检查。

## 033 编写完整的 skill 文件

1. 将 `src\pages-sub\repair\order-detail.vue` 关于 icon，文本，对齐，响应式的修改，全部整理成 skill。便于以后学习优化。编写到 `.claude\skills\beautiful-component-design` 目录内。
2. 确保 skill 文件满足要求格式要求，阅读以下文档，编写合适的 skill 文档。
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices

## 034 优化 `处理维修工单` 页

针对 `src\pages-sub\repair\handle.vue` 文件。

1. 先阅读该文件所对应的旧代码 `gitee-example/pages/repairHandle/repairHandle.vue` 。明确清楚代码写法。
2. 大量的使用 `wot-design-uni` 组件库，优化内部的代码写法。
   - https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component
   - https://wot-ui.cn/guide/quick-use.html
3. 在优化的时候，请你陆续的对该页面，依次使用这五个子代理，完成代码写法的迁移修改。确保满足下面这 5 个子代理的编写要求。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。
4. 优化的时候，确保你已经充分阅读了全部的 `.claude\skills` 目录内的 claude code 技能文件。
5. 这是一个`表单页面`，请你务必按照`表单的方式`来优化该页面。使用 `.claude\skills\use-wd-form` 来改造，改写该页面的代码组织形式。

### 01 处理 `处理维修工单` 页出现的类型故障

1. 处理 `src\pages-sub\repair\handle.vue` 出现的类型故障。请主动访问 https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component 文档，来处理 `wot-design-uni` 组件的使用问题。
2. 我注意到你在使用 `wot-design-uni` 组件库时，总是不能正确的访问文档。请你排查一下 CLAUDE.md 和 README.md 文档，出示一份报告，告诉我为什么你在使用 `wot-design-uni` 组件库时总是不能正确的使用组件库的配置？

## 035 处理 `处理维修工单` 页无法选择有效师傅的故障

针对 `src\pages-sub\repair\handle.vue` 页面

如下 url 图所示：

![2025-12-25-23-53-27](https://s2.loli.net/2025/12/25/RgwCLXxajNH7q82.png)

我在从 `维修工单池` 的`src\pages-sub\repair\order-list.vue`文件内，选择一个待派单的工单进入`处理维修工单`页面，访问 `http://localhost:3000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_022&repairType=1004&preStaffId=undefined&preStaffName=undefined&repairObjType=undefined` 地址，结果发现无法选择任何有效的师傅。

在我会直接访问这个地址时，`http://localhost:3000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001&repairType=%E6%B0%B4%E7%94%B5%E7%BB%B4%E4%BF%AE&repairObjType=001` ，如下图所示，我又可以选择有效的师傅了。

![2025-12-25-23-55-33](https://s2.loli.net/2025/12/25/PWIOdDFlwJz8c1L.png)

请帮我排查故障。告诉我为什么在不同的 url 参数下，我为什么不能稳定的选择合适的师傅？

1. 请问是 `src\pages-sub\repair\order-list.vue` 传递给 `src\pages-sub\repair\handle.vue` 页面时，传递的路由参数不够么？
2. 请问是 `/app/ownerRepair.listRepairStaffs` 接口传参不合适而导致的返回数据不合适吗？
3. 请解决上述问题，并出示一份报告给我。供我复盘。

## 036 处理 `处理维修工单` 页无法选择师傅后不显示内容的故障

针对 `src\pages-sub\repair\handle.vue` 页面，如下 url 图所示：

![2025-12-26-00-18-06](https://s2.loli.net/2025/12/26/KbX4a8qezYdCicw.png)

选择完毕师傅后，无法在表单内看到师傅的信息。

请你按照 `.claude\skills\use-wd-form` 技能的要求，修复无法看到师傅信息的 bug。

### 01

如以下 url 图片所示，在 `src\pages-sub\repair\add-order.vue` 内，下拉选择的效果是这样的。

![2025-12-26-00-26-44](https://s2.loli.net/2025/12/26/cXFweng8KNuP3ro.png)

内容很美观，也对齐。所以在现在的 `src\pages-sub\repair\handle.vue` 文件内，其选择用户后的效果是这样的：

![2025-12-26-00-28-05](https://s2.loli.net/2025/12/26/DVwtuNeKbkAIOhY.png)

`处理维修工单` 页面选择好用户后，效果很不美观。

1. 请你模仿 `src\pages-sub\repair\add-order.vue` 的代码写法，确保在 `处理维修工单` 页面选择玩用户后，其显示效果也很美观。
2. 请你总结经验，将使用相关组件的经验，写入到 `.claude\skills\use-wd-form\SKILL.md` claude code 技能文件内。
3. 本次更改涉及到优化美化组件的使用，请你将编写经验，以 claude code 技能的方式，写入到 `.claude\skills\beautiful-component-design` 目录内。
4. 你需要在技能文件内写入适当的使用经验文本，请你遵照 claude code skill 的编写文档，正确的编写 claude code 技能文件。
   - 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
   - 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices

## 037 `维修待办单` `src\pages-sub\repair\dispatch.vue`

### 01 对齐代码写法，优化 `维修待办单` 的代码

1. 阅读 src\pages-sub\repair\dispatch.vue 维修待办单 页面。`维修待办单` 页面是需要被优化的页面，里面的很多写法和最终的效果展示，很不好看。
2. 阅读 src\pages-sub\repair\order-list.vue 维修工单池 页面。`维修工单池` 页面是正常的，美观的，好看的页面。是需要学习的页面。
3. 请你优化 `维修待办单` 列表页的写法，这两个页面的结构是很相似的，只需要保留原本的功能，做代码写法对比，并迁移好的代码写法，优化 `维修待办单` 代码即可。
4. 请注意需要同时遵守多项编码规范。请你也提前阅读清楚这些代码规范，确保在迁移改写代码时，符合全部的编码规范：
   - 全部的 `.claude\agents` 代码迁移与改写规范。
   - 全部的 `.claude\skills` 技能规范。

### 02 协助理解按钮对应的业务流

1. 针对 维修待办单 `src\pages-sub\repair\dispatch.vue` 。
2. 阅读 `<template #action>` 部分的按钮处理逻辑，这里是根据维修单的状态做出不用情况的按钮行为。
3. 我很疑惑这些按钮对应的真实业务逻辑是否合情合理，请你帮我拓展阅读 `gitee-example/pages/repairDispatch/repairDispatch.vue` 旧代码，通过旧代码逐步索引，帮我看看，在旧代码内，是怎么做根据订单状态决定按钮状态的？
4. 我很疑惑 `退单按钮` 是不是都是无条件的？难道已完成的订单，也可以退单么？
5. 我很疑惑 `回访按钮` ，待办维修单，不应该是专门罗列出正在待办，处理中的单子么？为什么可以看到已完成的状态呢？旧代码的处理逻辑本身就是这样的么？
6. 那么 `src\pages-sub\repair\finish.vue` 维修已办单 列表页的逻辑是做什么的？`回访按钮`，回访这个动作，是一个需要待办，待处理的任务么？

### 03 补全搜索栏的状态下拉列表

1. 阅读以下 url 图片：

- 在 `/pages-sub/repair/order-list` 内，可以选择订单状态：

![2026-01-05-14-34-56](https://s2.loli.net/2026/01/05/8Nwtdgu64VhRjnx.png)

- 在 `/pages-sub/repair/dispatch` 内，无法选择有效的订单状态，无法做出有效的筛选：

![2026-01-05-14-35-34](https://s2.loli.net/2026/01/05/iVUSeA49jR5fzYP.png)

- 在 `/pages-sub/repair/finish` 内，可以选择有效的订单状态：

![2026-01-05-14-37-46](https://s2.loli.net/2026/01/05/KtPE9h2oAWG7CYk.png)

2. 针对 `src\pages-sub\repair\dispatch.vue` 的搜索栏，请补全关键的订单状态筛选能力。

### 04 回访按钮理解与`维修工单评价页`之间的关系

我很疑惑 `src\pages-sub\repair\dispatch.vue` 的回访按钮所体现出来的业务设计。

1. 在 `src\pages-sub\repair\dispatch.vue` 内，这是用来显示待处理的维修工单列表的页面，这是显示给谁看到？是维修师傅还是业主呢？维修师傅需要使用回访按钮么？
2. 在 `src\pages-sub\repair\appraise.vue` 内，这是业主对维修服务进行评分和评价的页面。这个页面是给业主还是维修师傅用的？
3. 回访按钮，这个名字设计的好么？
4. 请问在旧项目内，回访按钮和 `维修工单评价页` 的关系是怎么样的？旧项目的业务逻辑是怎么样的？
5. 请你对应的阅读上述两个页面对应的旧代码，理解业务走向，并为我解惑。为我提供分析报告。

## 038 `选择维修物资` `src\pages-sub\repair\select-resource.vue` 页面

1. 阅读 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 这个页面应该是一个**表单页**。请你按照 `.claude\skills\use-wd-form` 技能来优化改造。
3. 阅读旧代码 `gitee-example/pages/repairHandle/selectResource.vue` ，明确清楚该页面和其他页面的交互传参形式。
4. 按照 `.claude\agents` 全部子代理的要求，优化 `选择维修物资` 页面。

### 01 处理错误使用 `wd-stepper` 组件的故障

1. 针对 `src\pages-sub\repair\select-resource.vue` 页面。
2. 不存在 `wd-stepper` 组件，请替换，用`InputNumber`组件来代替。
3. 阅读 `https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/input-number.md` 文档，使用 `wd-input-number` 组件代替。
4. 注意遵循 claude code 技能，和子代理的要求。

### 02 处理表单项无法点击使用的故障

1. 针对 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 我无法点击选择里面的表单项内容。这是严重的故障。
3. 请你阅读以下几个类似的表单页，看清楚其他页面是如何组织组件的。
   - `src\pages-sub\repair\add-order.vue`
   - `src\pages-sub\repair\handle.vue`
4. 模仿学习其他页面是如何组织表单代码的，并修改 `选择维修物资` 页面。
5. 用谷歌浏览器 MCP，访问 `http://localhost:3000/#/pages-sub/repair/select-resource?feeFlag=1001` 页面，自主测试几个表单项是否能正常选取。
6. 修复完故障后，请你总结清楚组件使用的经验，更新以下文件，确保你以后再使用类似组件时，不会出现类似的错误。
   - `.claude\skills\use-wd-form\SKILL.md`
   - `.claude\agents\component-migration.md`

### 03 检查并更新 `beautiful-component-design` 技能

1. 请更新 `.claude\skills\beautiful-component-design` 内的写法，避免里面的写法导致组件使用的错误。

### 04 处理下拉列表不能选择有意义内容的故障

1. 针对 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 请你阅读以下 url 图片：

![2025-12-27-22-42-23](https://s2.loli.net/2025/12/27/DTbcGCpq4Vx2FBa.png)

![2025-12-27-22-42-46](https://s2.loli.net/2025/12/27/5xMJZnBd67eIat8.png)

如图，我在 `选择维修物资` 页面，无法选择有效的下拉列表。我希望能够选择到有效的下拉列表数据。

3. 请问是当前页面的 `http://localhost:3000/#/pages-sub/repair/select-resource?feeFlag=1001` feeFlag 参数影响了下拉列表的数据选择么？
4. 请问是该页面对应的下拉选择接口有问题么？是对应的 mock 接口返回的数据不够么？如果是，请为 mock 接口增加数据，便于我实现有意义的下拉选择功能。
5. 请问页面 `pages-sub/repair/select-resource` 的 feeFlag 参数还可以填写那些值呢？这个值在 `选择维修物资` 页面内，是如何使用的？
6. 请阅读 `docs\vue2-route-navigation-map.md` 的 `维修工单流程模块` 部分，结合本项目跳路由的工具，告诉我。 `选择维修物资` 页面的上一级页面是从哪里进入的？我该怎么确保能够充分的进入到该页面的每一种情况，便于我自主测试？
7. 回答上述的全部问题，便于我学习了解。

### 05 处理 `选择维修物资` 页面的接口故障

1. 针对 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 请你阅读以下 url 图片：

![2025-12-27-23-36-09](https://s2.loli.net/2025/12/27/DMLrvcRlVjW9yFh.png)

```log
TypeError: result.data is not iterable
```

3. 我怀疑是你刚才更改的 `src\api\mock\repair.mock.ts` 文件写法有问题，检查该 mock 接口的写法。检查 `选择维修物资` 页面使用异步数据的写法。
4. 请务必遵循 `.claude\agents\api-migration.md` 迁移规范的写法。
5. 请你使用谷歌浏览器 MCP，访问地址 `http://localhost:3000/#/pages-sub/repair/select-resource?feeFlag=1001` 并自我测试。

### 06 处理选择商品类型后出现的故障

1. 针对 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 请你阅读以下 url 图片：

![2025-12-27-23-58-30](https://s2.loli.net/2025/12/27/QDfSqIezoGr8Vu7.png)

```log
vue.runtime.esm.js:1443 TypeError: Cannot read properties of undefined (reading 'rstId')
    at handleParentTypeChange (select-resource.vue:216:1)
    at callWithErrorHandling (vue.runtime.esm.js:1381:19)
    at callWithAsyncErrorHandling (vue.runtime.esm.js:1388:17)
    at emit (vue.runtime.esm.js:1907:5)
    at vue.runtime.esm.js:9132:45
    at handleConfirm (wd-picker.vue:217:7)
    at onConfirm (wd-picker.vue:202:9)
    at callWithErrorHandling (vue.runtime.esm.js:1381:19)
    at callWithAsyncErrorHandling (vue.runtime.esm.js:1388:17)
    at HTMLElement.invoker (vue.runtime.esm.js:10209:5)
logError	@	vue.runtime.esm.js:1443
errorHandler	@	uni-h5.es.js:16148
callWithErrorHandling	@	vue.runtime.esm.js:1381
handleError	@	vue.runtime.esm.js:1421
callWithErrorHandling	@	vue.runtime.esm.js:1383
callWithAsyncErrorHandling	@	vue.runtime.esm.js:1388
emit	@	vue.runtime.esm.js:1907
(anonymous)	@	vue.runtime.esm.js:9132
handleConfirm	@	wd-picker.vue:217
onConfirm	@	wd-picker.vue:202
callWithErrorHandling	@	vue.runtime.esm.js:1381
callWithAsyncErrorHandling	@	vue.runtime.esm.js:1388
invoker	@	vue.runtime.esm.js:10209
```

请处理该故障，确保选择完毕商品类型后，不会出现后续故障。

### 07 优化改写组件使用，美化视觉效果

1. 针对 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 请你阅读以下 url 图片：

![2025-12-28-03-04-49](https://s2.loli.net/2025/12/28/GNMYWmvIcbLH7Ej.png)

3. 价格范围的显示效果很不好看，和其他页面看起来很不统一。请你让`价格范围`的显示效果，和`规格`的显示效果相同。使用相同的组件来渲染。

### 08 整合重复的 onLoad 生命周期函数

1. 针对 `src\pages-sub\repair\select-resource.vue` `选择维修物资` 页面。
2. 把重复冗余的 onLoad 函数整合在一起，不要分开写逻辑。

## 039 迭代更新多个表单页对 `wd-cell` 组件的使用

1. 请阅读以下文件，按照最新的技能文件要求，和 `component-migration` 子代理的要求，改写以下页面的组件使用用法。

- /pages-sub/repair/add-order
- /pages-sub/repair/handle
- /pages-sub/repair/select-resource

## 040 优化表单页的标题风格不统一，不美观的问题；制作专门的标题组件

1. 阅读以下 url 图片地址，观察各个表单页的标题部分的显示效果：
2. /pages-sub/repair/select-resource `商品类型`、`商品选择`、`购买数量`
   > ![2025-12-28-04-05-23](https://s2.loli.net/2025/12/28/zmOlqU3Tw57cfr8.png)
3. /pages-sub/repair/handle `维修师傅`、`处理意见`
   > ![2025-12-28-04-06-01](https://s2.loli.net/2025/12/28/JbrsX1nYfDuZ8Ap.png)
4. /pages-sub/repair/add-order `房屋信息`、`报修信息`、`报修内容`、`相关图片`
   > ![2025-12-28-04-06-52](https://s2.loli.net/2025/12/28/1fekBOVEruhFWpH.png)
5. 这几个标题的显示效果参差不齐，大家的表现效果都不统一。我希望你制作一个美观的通用组件。并实现上述这 3 个表单页面都能够使用美观的标题组件。
   - 标题主题使用 https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/cell.md `wd-cell` 组件。重点发挥 `wd-cell` 组件的 `#title` 插槽，并充分的使用 unocss 实现美观的背景呼吸动效。
   - 标题组件的背景色默认是淡灰色。和常见的白色背景的表单项，形成对比。
   - 模仿 `src\components\common\z-paging-loading` 组件的组织方式，这款标题组件也使用相同的组织方式。在 `src\components\common` 目录下编写组件。
   - 在 `src\pages\test-use` 目录内，也新建单独的组件演示页面，演示你新建的标题组件。
6. 设计好美观的标题组件后，对上述的 3 个表单页面，应用该组件。
7. 主动使用谷歌浏览器 MCP，逐项访问上述页面提供的`完整示例`url 地址，主动观察视觉效果，确保标题的视觉效果在你设计的组件的加持下，实现较好的美观度。
8. 更新文档：
   - `.claude\agents\component-migration.md` 在组件迁移文档内，在`旧项目`内，凡是遇到类似的标题组件写法，都是用你提供的标题组件实现。
   - `.claude\skills\beautiful-component-design` 这款技能，请增加一个单独的文档来说明在实现美观的情况下，如何恰当的使用这款组件。请精简的表述即可。

## 041 优化 `处理维修工单` 页面的动态标题切换功能

1. 针对 `src\pages-sub\repair\handle.vue` `处理维修工单` 页面
2. 使用 uni.setNavigationBarTitle 和 onReady 来完成进入本页面，根据路由参数，动态变化标题。

## 042 优化 `src\pages-sub\repair\dispatch.vue` 维修待办单的视觉效果

1. 针对 `维修待办单` 页面。
2. 阅读以下 url 图片地址：

![2025-12-29-12-23-39](https://s2.loli.net/2025/12/29/9KhxEICin5MHuaO.png)

3. 不使用 `popup` 组件来实现弹框打开和输入信息的功能，显示效果很不美观。换 `message-box` 组件来实现。在 `src\pages-sub\repair\dispatch.vue` 内，已经有类似的写法实现 `message-box` 的使用了。请你替换写法。
   - 参考资料： https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/message-box.md
4. 更新相关技能： 我不希望你之后的代码写法，仍旧出现类似的生成不美观代码的错误。需要你将相关经验，总结成具体可复用的 claude code 技能。
   - `.claude\skills\component-migration` 在组件迁移技能内，重点说明弹框交互式的组件选型，选型为 `wd-message-box` 而不是 `wd-popup` 组件。
   - `.claude\skills\beautiful-component-design` 在美观组件设计技能内，增加该内容。说明使用正确的组件选型。

## 043 维修待办单 `src\pages-sub\repair\dispatch.vue`

1. 针对 `src\pages-sub\repair\dispatch.vue` `维修待办单` 代码。

### 01 补全对应 mock 列表查询接口的返回值

1. 针对 `src\pages-sub\repair\dispatch.vue` `维修待办单` 代码。阅读全部的 `card-actions` 部分。可以得知这里有很多不同的按钮。
2. 深刻阅读理解 `维修待办单` 页面的状态逻辑，找到对应的 mock 接口代码，并增加足够的 mock 数据，确保全部种类的 `card-actions` 按钮都能够显示出来，便于我测试。

### 02 抽象状态 `RepairStatus` 专用的标签组件

1. 阅读代码：
   - src\pages-sub\repair\dispatch.vue
   - src\pages-sub\repair\order-list.vue
2. 针对性阅读这一小段代码：

```vue
<template>
	<wd-tag :type="getStatusTagType(item.statusCd)" plain>
		{{ item.statusName || "待处理" }}
	</wd-tag>
</template>
```

3. 我希望你新建一个专门的组件，实现重复代码的集中管理，避免业务代码出现重复相同代码。按照 `add-new-component` 技能要求的规范，新建组件。在 `src\components\common\repair-status-tag` 内新建这款 `repair-status-tag` `维修状态标签组件`。
4. `维修状态标签组件` 是和业务类型高度绑定关联的组件，应该大胆的，直接的使用来自 `src\types\repair.ts` 提供的业务类型。
5. 请阅读以下 url 图片：
   - ![2026-01-01-03-18-52](https://s2.loli.net/2026/01/01/GPWXZlSqNCpOVRj.png)
   - 如图，我希望`处理中`的状态下，其状态按钮的背景显示有动态的呼吸动效，从左到右的波浪丝绸动效。
   - 丝绸动效的颜色和按钮的主题色相似。允许你出现一部分的主题色差异。务必发挥 UI 设计能力，确保动态波浪动效的颜色和效果不会喧宾夺主。
   - 请积极主动的调用 gemini 的能力，主动使用 gemini MCP，实现美观的 UI 动效设计。
   - 设计动效时，请务必使用 unocss 原子类来实现样式编写。
6. 整体略微增加组件大小和文本大小，便于更好的展示动效背景和文本。
7. 在代码结构上，适当的做向后拓展的抽象。该组件要做好随时增加美观动效的准备。未来我可能会要求你给其他状态增加不同形式的动效。

### 03 设计报修的公共业务组件 `repair-list-item`，优化 `src\pages-sub\repair\dispatch.vue` 和 `src\pages-sub\repair\order-list.vue` 的代码写法

1. 针对 `src\pages-sub\repair\dispatch.vue` 和 `src\pages-sub\repair\order-list.vue` 。
2. 注意针对性阅读以下 class 选择器的部分：
   - repair-card
   - card-header
   - card-body
   - card-actions
3. 这两个都是列表页，大部分内容和布局，都是相通相似的。我要求你抽象出一个公共的组件 `repair-list-item`，实现重复冗余代码的整体优化。
4. 组件编写位置： `src\components\common\repair-list-item` 。
5. 插槽设计： `card-actions` 是很明显的区别项。我要求你必须设计明显的插槽位置，暴露给具体的列表页组件来填充按钮。
6. 编写技能要求： 按照 `add-new-component` 技能的要求来做。
7. 美观设计要求：
   - 现在的列表项其实很不美观，我要求你主动使用 gemini MCP，设计一个根据美观的，好看的列表页项目。
   - 充分使用 `wot-design-uni` 组件库提供的组件，设计出美观、好看、一致的列表页项目组件。 `repair-list-item` 。

## 044 维修已办单 维修已办列表页 `src\pages-sub\repair\finish.vue`

### 01 改造改写代码，并且同步列表页的代码写法

1. 先阅读 `src\pages-sub\repair\finish.vue` `维修已办单` 列表页的代码。
2. 这是一个列表页，我需要你同步相似的代码写法。我需要 `维修已办单` 的代码写法整体上与 `维修工单池` 和 `维修待办单` 保持相同。
   - src\pages-sub\repair\order-list.vue 维修工单池
   - src\pages-sub\repair\dispatch.vue 维修待办单
3. 在你全面改造 `维修已办单` 的代码写法时，请注意务必，至少要遵循以下几个技能的要求：
   - z-paging-integration
   - api-migration
   - code-migration
   - component-migration
   - route-migration
   - api-error-handling
4. 这是一个要求很细致的任务，认真做好任务规划和上下文管理。

### 02 处理列表页切换状态时，列表分页组件没有加载动效的情况

1. 阅读以下列表页：
   - src\pages-sub\repair\order-list.vue
   - src\pages-sub\repair\dispatch.vue
   - src\pages-sub\repair\finish.vue
2. 在这些列表页开始切换顶部的订单状态时，每个列表页的 `<template #loading>` 部分，都没有被及时的加载动效。请问是什么缘故？
3. 请问在 `z-paging` 组件内，怎么去触发数据更新的动效？我在主动执行异步函数的时候，怎么触发已经在 `<template #loading>` 插槽内定义的动效组件？
4. 以下是关于 `z-paging` 组件的上下文，请适当的阅读以下信息，看看在列表页请求时，应该怎么触发加载等待动效。
   - 仓库： https://github.com/SmileZXLee/uni-z-paging
   - 文档： https://z-paging.zxlee.cn/
   - 文档的仓库： https://github.com/SmileZXLee/uni-z-paging-doc

---

全局设置 props `auto-hide-loading-after-first-loaded` 即可。

### 03 抽象出专门维修列表页专项搜索栏组件

1. 阅读报修模块的 3 列表页的 `<template #top>` 组件部分，我们可以得知，这些页面都有着共同的代码写法。都有公共的搜索栏功能。
   - src\pages-sub\repair\order-list.vue
   - src\pages-sub\repair\dispatch.vue
   - src\pages-sub\repair\finish.vue
2. 我需要你抽象出一个单独的，业务专用的 `search-bar` 组件。在 `src\components\common\repair-list-search-bar` 目录内新建搜索栏组件。目的是为了减少重复代码冗余的情况。
3. 值得注意的是，我需要你多做一个 props 配置功能，配置是否开启基于状态栏的筛选能力。这些列表页的搜索栏有区分情况。就比如 src\pages-sub\repair\finish.vue 维修已办单 列表页，就不需要做任何工单筛选。只需要查询即可。至少设计一个特定的 props ，`isUseStateOptions` ，是否使用基于状态栏的筛选功能。默认值为 `true` 。
4. 内部封装 `加载维修状态字典` 函数，将 `getRepairStates` 函数逻辑也整合到该组件内，也使用 `useRequest` 的方式完成请求。
5. `isUseStateOptions` 不仅仅要实现组件显隐的渲染控制，还要控制使用 `useRequest` 的 `getRepairStates` 数据请求逻辑。如果 `isUseStateOptions` 为 `true`，那么请求的 `immediate` 就设置为 `true` 。需要下拉选项，就需要立刻做出接口请求。
6. 严格按照 `.claude\skills\add-new-component\SKILL.md` 技能的要求来新建组件。

## 045 维修工单评价页 `src\pages-sub\repair\appraise.vue`

1. 针对 `src\pages-sub\repair\appraise.vue` `维修工单评价页` 代码。

### 01 严格按照表单页的技能来修改优化代码

1. 针对 `src\pages-sub\repair\appraise.vue` `维修工单评价页` 代码。
2. 先阅读对应的旧代码 `gitee-example/pages/appraiseRepair/appraiseRepair.vue` ，了解被迁移的内容项目。
3. 这是一个表单页，但是很多代码写法不满足 `.claude\skills\use-wd-form\SKILL.md` `使用 wd-form 表单组件编写表单页的实施规范` 技能，需要你按照技能文档，严格落实代码写法。统一并优化代码写法。

### 02 分析 `维修工单评价页` 的上级页面

1. 针对 `src\pages-sub\repair\appraise.vue` `维修工单评价页` 代码。
2. 我不清楚该页面的上级页面是那个，请结合路由配置，和对应的旧代码，分析出该页面的上级页面和进入的入口有那些。

---

是 `src\pages-sub\repair\dispatch.vue` 页面

### 03 应用全部的技能文件来优化 `维修工单评价页`

1. 针对 `src\pages-sub\repair\appraise.vue` `维修工单评价页` 代码。
2. 首先阅读全部的技能文件要求。检查清楚本页面是否在不满足技能文件的诸多要求。
3. 列举具体的计划，按照技能文件的细致要求，优化代码。

## 046 维修工单流程模块 - 样式迁移任务

样式写法一律使用 unocss 来完成

1. 阅读 `style-migration` 样式迁移子代理。
2. 针对 `维修工单流程模块系列页面` 的 vue 组件，存在额外使用 scss 的情况。请你用 `style-migration` 来改造代码，使其满足子代理的要求。

## 047 工作台、首页入口集成

### 01 <!-- TODO: --> 检查 `维修已办单` `维修待办单` `维修工单池` 这三个列表页的首页入口集成情况

1. 阅读 docs\vue2-route-navigation-map.md `维修工单流程模块` .
2. 维修工单池 维修待办单 维修已办 这三个列表页，在旧项目内，是否有明确的上级页面？他们在工作台或首页入口内，是否有集成？请阅读旧代码并检索其逻辑。
3. 首页或者是工作台内，没有专门针对维修报修工单模块的入口么？
4. 请增加专门的`维修报修工单模块`模块的列表页入口。合理设计入口。
