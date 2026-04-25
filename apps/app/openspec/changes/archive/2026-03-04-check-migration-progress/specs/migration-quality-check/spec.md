## ADDED Requirements

### Requirement: 对每个已迁移文件启动独立专项检查子代理

系统 SHALL 为每一个「✅ 已迁移」的文件启动一个独立的专项检查子代理，该子代理须先阅读相关 Skills 技能文档，再对文件进行逐项合规性检查。

#### Scenario: 子代理完成合规性检查

- **WHEN** 专项检查子代理被分配到一个已迁移文件
- **THEN** 子代理须依次检查以下所有适用维度，并输出 Pass / Warn / Fail 评级

#### Scenario: 文件不适用某项检查维度

- **WHEN** 已迁移文件不包含 API 调用（无 `useRequest`）
- **THEN** `api-migration` 和 `api-error-handling` 维度标记为「N/A」，不算入合规分数

### Requirement: code-migration 合规性检查

每个已迁移文件 SHALL 满足以下 code-migration 规范。

#### Scenario: 使用 script setup 写法

- **WHEN** 检查文件的 `<script>` 标签
- **THEN** 必须为 `<script setup lang="ts">`，否则标记 Fail

#### Scenario: 文件顶部提供业务说明注释

- **WHEN** 检查文件首行 HTML 注释
- **THEN** 必须包含业务名称和访问地址说明，否则标记 Warn

#### Scenario: TypeScript 类型注解完整

- **WHEN** 检查函数和变量定义
- **THEN** 关键变量和函数参数有类型注解，JSDoc 格式注释，否则标记 Warn

### Requirement: component-migration 合规性检查

每个已迁移文件 SHALL 满足以下 component-migration 规范。

#### Scenario: 无 ColorUI 组件残留

- **WHEN** 检查模板中的组件标签
- **THEN** 不得出现 `cu-` 前缀组件或 `uni-*` 非标准组件，否则标记 Fail

#### Scenario: 使用 wot-design-uni 组件

- **WHEN** 检查模板中的组件标签
- **THEN** UI 组件应使用 `wd-*` 前缀的 wot-design-uni 组件

### Requirement: style-migration 合规性检查

每个已迁移文件 SHALL 满足以下 style-migration 规范。

#### Scenario: 无 ColorUI 类名残留

- **WHEN** 检查模板 class 属性和 style 标签
- **THEN** 不得出现 `cu-`、`text-`（ColorUI 版本）等 ColorUI 类名，否则标记 Fail

#### Scenario: 使用 UnoCSS 原子类

- **WHEN** 检查模板 class 属性
- **THEN** 样式类应为 UnoCSS 原子类风格（如 `flex`、`items-center`、`text-sm` 等）

### Requirement: api-migration 合规性检查（适用于含 API 调用的文件）

含 API 调用的已迁移文件 SHALL 满足以下 api-migration 规范。

#### Scenario: 无旧式 API 调用残留

- **WHEN** 检查 `<script>` 区域
- **THEN** 不得出现 `uni.request`、`Java110Context`、`$.ajax` 等旧式调用，否则标记 Fail

#### Scenario: 使用 Alova useRequest

- **WHEN** 检查 API 调用方式
- **THEN** 必须通过 `useRequest` 或 Alova 方法发起请求，并有对应的 `src/api/` 类型定义文件

### Requirement: api-error-handling 合规性检查（适用于含 API 调用的文件）

含 API 调用的已迁移文件 SHALL 提供统一的接口错误提示。

#### Scenario: onError 回调有错误提示

- **WHEN** 检查 `useRequest` 的错误回调
- **THEN** 必须有 `onError` 回调且触发用户可见的错误提示（如 toast），否则标记 Fail

### Requirement: use-wd-form 合规性检查（适用于含表单的文件）

含 `<wd-form>` 的已迁移文件 SHALL 满足以下 use-wd-form 规范。

#### Scenario: 选择组件使用 wd-picker

- **WHEN** 检查表单中的选择功能
- **THEN** 选择功能必须使用 `wd-picker`，禁止使用 `wd-radio-group`，否则标记 Fail

#### Scenario: 表单分区使用 FormSectionTitle

- **WHEN** 检查表单分区标题
- **THEN** 必须使用 `FormSectionTitle` 组件，禁止 `<view class="section-title">` 写法，否则标记 Fail

### Requirement: z-paging-integration 合规性检查（适用于含分页列表的文件）

含分页列表的已迁移文件 SHALL 正确集成 z-paging 组件。

#### Scenario: z-paging 与 useRequest 正确集成

- **WHEN** 检查分页列表实现
- **THEN** 必须使用 `z-paging` 组件且通过回调钩子模式与 useRequest 集成，否则标记 Fail
