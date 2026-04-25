# 代码实现纠错

## ADDED Requirements

### Requirement: 单选场景必须使用 wd-picker，禁止使用 wd-radio-group

根据 use-wd-form 技能规范，单选场景必须使用 wd-picker，禁止使用 wd-radio-group。

#### Scenario: 检查 do-copy-work.vue 组件替换

- **WHEN** 查看 src/pages-sub/work/do-copy-work.vue 文件
- **THEN** 不应包含 wd-radio-group，应替换为 wd-picker

### Requirement: useRequest 必须使用链式回调写法

根据 z-paging-integration 技能规范，useRequest 必须使用链式回调写法 `.onSuccess()` + `.onError()`，禁止使用组合式解构写法。

#### Scenario: 检查 apply-room.vue useRequest 写法

- **WHEN** 查看 src/pages-sub/property/apply-room.vue 文件
- **THEN** 应使用链式回调写法，不应从 useRequest 解构 onSuccess/onError 后在外部调用

### Requirement: 路由跳转必须使用 TypedRouter

根据 code-migration 技能规范，路由跳转必须使用 TypedRouter，禁止直接使用 uni.navigateTo 等方法。

#### Scenario: 检查 complaint/order.vue 路由跳转

- **WHEN** 查看 src/pages-sub/complaint/order.vue 文件
- **THEN** 应使用 TypedRouter，不应直接使用 uni.navigateTo/redirectTo/reLaunch/switchTab

#### Scenario: 检查 complaint/detail.vue 路由跳转

- **WHEN** 查看 src/pages-sub/complaint/detail.vue 文件
- **THEN** 应使用 TypedRouter

#### Scenario: 检查 complaint/finish.vue 路由跳转

- **WHEN** 查看 src/pages-sub/complaint/finish.vue 文件
- **THEN** 应使用 TypedRouter

#### Scenario: 检查 complaint/list.vue 路由跳转

- **WHEN** 查看 src/pages-sub/complaint/list.vue 文件
- **THEN** 应使用 TypedRouter

#### Scenario: 检查 property/apply-room-detail.vue 路由跳转

- **WHEN** 查看 src/pages-sub/property/apply-room-detail.vue 文件
- **THEN** 应使用 TypedRouter

### Requirement: 表单分区标题必须使用 FormSectionTitle 组件

根据 beautiful-component-design 技能规范，禁止使用 `<view class="section-title">` 或 `<text class="section-title">`，必须使用 FormSectionTitle 组件。

#### Scenario: 检查 repair-list-item.vue FormSectionTitle 使用

- **WHEN** 查看 src/pages/test-use/repair-list-item.vue 文件
- **THEN** 不应包含 `<view class="section-title">`，应使用 FormSectionTitle 组件

#### Scenario: 检查 property-application-example.vue FormSectionTitle 使用

- **WHEN** 查看 src/examples/property-application-example.vue 文件
- **THEN** 不应包含 `<text class="section-title">`，应使用 FormSectionTitle 组件

### Requirement: wd-cell #value 插槽说明必须正确

beautiful-component-design/SKILL.md 中关于 wd-cell #value 插槽的说明必须正确。

#### Scenario: 检查 beautiful-component-design wd-cell 说明

- **WHEN** 查看 beautiful-component-design/SKILL.md 中关于 wd-cell 的说明
- **THEN** 应明确说明 wd-cell 有 #value 插槽，但禁止嵌套 wd-picker
