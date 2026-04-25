<!-- Anthropic 模型生成的报告 token金贵 不删除 -->

# 2025-12-31 技能文件触发失败深度分析

## 1. 问题概述

在处理 `src/pages-sub/inspection/execute-single.vue` 表单页面时，我犯了第二个严重错误：

- ❌ **未触发 `use-wd-form` 技能**，尽管这是一个明确的表单页面
- ❌ **使用了错误的组件**：使用 `wd-radio-group` 而非技能要求的 `wd-picker`
- ❌ **没有阅读表单规范**，凭经验编写代码

## 2. 错误对比

### 2.1. 我写的错误代码

```vue
<!-- ❌ 错误：使用 wd-radio-group -->
<wd-cell-group border class="mt-3">
  <FormSectionTitle
    title="巡检情况"
    icon="checkmark"
    icon-class="i-carbon-checkmark text-green-500"
    required
  />
  <view class="p-3">
    <wd-radio-group v-model="formData.patrolType">
      <wd-radio
        v-for="option in patrolTypeOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </wd-radio>
    </wd-radio-group>
  </view>
</wd-cell-group>
```

### 2.2. 正确的代码（符合 use-wd-form 规范）

```vue
<!-- ✅ 正确：使用 wd-picker -->
<wd-cell-group border class="mt-3">
  <FormSectionTitle
    title="巡检情况"
    icon="checkmark"
    icon-class="i-carbon-checkmark text-green-500"
    required
  />
  <wd-picker
    v-model="formData.patrolType"
    label="选择情况"
    :label-width="LABEL_WIDTH"
    :columns="patrolTypeOptions"
    label-key="label"
    value-key="value"
  />
</wd-cell-group>
```

### 2.3. 差异分析

|    对比项    |               错误做法               |          正确做法          |
| :----------: | :----------------------------------: | :------------------------: |
| **组件选择** |           `wd-radio-group`           |        `wd-picker`         |
| **布局结构** | 需要额外的 `<view class="p-3">` 包裹 | 直接使用组件，无需额外包裹 |
| **用户体验** |    占用较大空间，所有选项直接展示    |  紧凑美观，点击弹出选择器  |
|  **一致性**  |          与其他选择器不一致          |        符合项目规范        |

## 3. 根本原因分析

### 3.1. 为什么没有触发 `use-wd-form` 技能？

#### 原因 1：缺少多技能协同意识

当我看到任务时：

- ✅ **触发了** `beautiful-component-design` 技能（因为明确提到"美化"）
- ❌ **没有触发** `use-wd-form` 技能（尽管这是表单页面）

**问题**：我没有建立"一个任务可能需要多个技能"的意识。

#### 原因 2：触发条件识别不完整

`use-wd-form` 的触发条件：

> "当需要实现表单页面、编写包含用户输入的 Vue 组件、或需要统一表单代码风格时使用"

`execute-single.vue` 完全符合：

- ✅ 是表单页面（包含 `<wd-form>`）
- ✅ 包含用户输入（文本框、选择器、上传）
- ✅ 需要统一代码风格

但我**完全没有意识到**应该触发这个技能！

#### 原因 3：没有建立触发检查流程

当前我的工作流程：

1. 看到任务关键词
2. 匹配到一个技能
3. 开始执行

**缺失的步骤**：

- ❌ 没有检查"这个任务还需要哪些其他技能"
- ❌ 没有主动搜索相关的技能文件
- ❌ 没有建立"技能检查清单"

### 3.2. 技能文件的触发条件是否足够明确？

让我对比所有技能的 description：

|            技能名            |                 description                  |                触发关键词                 |
| :--------------------------: | :------------------------------------------: | :---------------------------------------: |
| `beautiful-component-design` | 移动端 uni-app + wot-design-uni 组件美化规范 |          美化、图标、文本、样式           |
|        `use-wd-form`         |      使用 wd-form 编写表单页的标准规范       |     **表单页面、用户输入、表单代码**      |
|    `component-migration`     |                 组件迁移专家                 | 迁移、组件映射、ColorUI 到 wot-design-uni |

**结论**：触发条件写得很清楚，问题在于我的执行流程！

### 3.3. 为什么使用了 wd-radio-group 而不是 wd-picker？

#### 原因 1：凭经验编码

我看到"选择正常/异常"，直接想到：

- "这是一个单选功能" → 使用 `wd-radio-group`

**错误思维**：没有先查阅项目规范，凭经验猜测。

#### 原因 2：没有阅读 use-wd-form 第 3.2 节

`use-wd-form/SKILL.md` 第 3.2 节明确说明：

> ### 3.2. 选择器（wd-picker）
>
> #### 3.2.1. 标准用法（使用 label 属性）✅
>
> ```vue
> <wd-picker v-model="model.category" label="分类" :columns="categoryOptions" label-key="name" value-key="id" />
> ```

如果我阅读了这一节，就不会犯这个错误！

## 4. 改进方案

### 4.1. 立即改进：建立技能触发检查流程

#### 改进 1：任务分析阶段必须检查所有相关技能

```plaintext
收到任务
  ↓
步骤 1：识别任务类型
  - 是否涉及表单？ → use-wd-form
  - 是否涉及美化？ → beautiful-component-design
  - 是否涉及组件迁移？ → component-migration
  - 是否涉及样式迁移？ → style-migration
  - 是否涉及 API？ → api-migration
  ↓
步骤 2：列出所有需要的技能
  - 使用 TodoWrite 创建"需要阅读的技能文件"清单
  ↓
步骤 3：逐个阅读技能文件
  - 阅读主文件
  - 阅读所有子文档
  - 查阅示例文件
  ↓
步骤 4：开始执行
```

#### 改进 2：在 CLAUDE.md 中添加技能触发矩阵

创建一个技能触发矩阵，帮助我快速识别需要哪些技能：

```markdown
## 技能触发矩阵

|                   任务特征                   |                必须使用的技能                |
| :------------------------------------------: | :------------------------------------------: |
|            包含 `<wd-form>` 组件             |                `use-wd-form`                 |
|            需要美化组件、添加图标            |         `beautiful-component-design`         |
| 需要迁移组件（从 ColorUI 到 wot-design-uni） |            `component-migration`             |
|             需要编写表单分区标题             | `beautiful-component-design` + `use-wd-form` |
|               需要实现选择功能               |           `use-wd-form` 第 3.2 节            |
|               需要实现上传功能               |           `use-wd-form` 第 3.6 节            |
```

#### 改进 3：技能文件开头添加"适用场景"检查清单

在每个技能文件开头添加：

```markdown
## 🚨 适用场景检查（触发前必读）

### 本技能适用于以下场景

- [ ] 场景 1：描述...
- [ ] 场景 2：描述...

### 本技能不适用于以下场景

- [ ] 场景 1：描述...

**如果你的任务符合"适用场景"中的任何一项，必须使用本技能！**
```

例如，在 `use-wd-form/SKILL.md` 开头添加：

```markdown
## 🚨 适用场景检查（触发前必读）

### 本技能适用于以下场景

- [ ] 文件中包含 `<wd-form>` 组件
- [ ] 需要添加选择功能（下拉选择、单选、多选）
- [ ] 需要添加文本输入、日期选择、文件上传等表单元素
- [ ] 需要实现表单校验
- [ ] 需要统一表单代码风格

### 本技能不适用于以下场景

- [ ] 纯展示页面（无用户输入）
- [ ] 列表页面（使用 z-paging）

**如果你的任务符合"适用场景"中的任何一项，必须使用本技能！**
```

### 4.2. 中期改进：增强技能文件的互相引用

#### 改进 1：在 beautiful-component-design 中引用 use-wd-form

在 `beautiful-component-design/SKILL.md` 中添加：

```markdown
## ⚠️ 关联技能（Critical）

### 如果你正在处理表单页面

**必须同时阅读**：[use-wd-form 技能](../use-wd-form/SKILL.md)

表单页面需要两个技能协同工作：

- `beautiful-component-design`：负责美化（FormSectionTitle、图标、样式）
- `use-wd-form`：负责表单结构（wd-picker、wd-input、表单校验）

**检查清单**：

- [ ] 是否包含 `<wd-form>` 组件？ → 必须使用 use-wd-form
- [ ] 是否需要实现选择功能？ → 使用 wd-picker（见 use-wd-form 第 3.2 节）
```

#### 改进 2：在 use-wd-form 中引用 beautiful-component-design

在 `use-wd-form/SKILL.md` 中添加：

```markdown
## ⚠️ 关联技能（Critical）

### 表单分区标题必须使用 FormSectionTitle 组件

**必须同时阅读**：[beautiful-component-design 技能](../beautiful-component-design/SKILL.md)

特别是：

- [form-section-title.md](../beautiful-component-design/form-section-title.md)

**禁止使用**：

- ❌ `<view class="section-title">` - 错误的自定义样式类

**必须使用**：

- ✅ `<FormSectionTitle>` 组件
```

### 4.3. 长期改进：建立技能文件自检系统

#### 改进 1：创建技能触发自检脚本

创建 `.claude/skills/check-trigger.md`：

````markdown
# 技能触发自检清单

## 任务分析阶段

收到任务后，立即回答以下问题：

### 1. 任务类型识别

- [ ] 这是一个**表单页面**吗？（包含 wd-form、用户输入）
  - ✅ 是 → 必须使用 `use-wd-form`
- [ ] 需要**美化组件**吗？（添加图标、调整样式）
  - ✅ 是 → 必须使用 `beautiful-component-design`
- [ ] 涉及**组件迁移**吗？（从 ColorUI 到 wot-design-uni）
  - ✅ 是 → 必须使用 `component-migration`

### 2. 功能需求识别

- [ ] 需要实现**选择功能**吗？
  - ✅ 是 → 使用 `wd-picker`（见 use-wd-form 第 3.2 节）
- [ ] 需要添加**表单分区标题**吗？
  - ✅ 是 → 使用 `FormSectionTitle`（见 beautiful-component-design）
- [ ] 需要**上传文件**吗？
  - ✅ 是 → 使用 `wd-upload`（见 use-wd-form 第 3.6 节）

### 3. 技能清单生成

根据上述检查，列出所有需要的技能：

```plaintext
必须阅读的技能文件：
- [ ] .claude/skills/xxx/SKILL.md
- [ ] .claude/skills/xxx/子文档.md

必须查阅的示例文件：
- [ ] src/pages-sub/xxx/xxx.vue
```
````

```plain`

#### 改进 2：在每次任务开始前强制执行自检

在我的工作流程中添加强制步骤：

```plaintext
收到任务
  ↓
🚨 强制步骤 1：技能触发自检
  - 打开 .claude/skills/check-trigger.md
  - 逐项回答问题
  - 生成技能清单
  ↓
🚨 强制步骤 2：阅读所有相关技能
  - 阅读每个技能的主文件
  - 阅读所有子文档
  - 查阅示例文件
  ↓
🚨 强制步骤 3：创建任务清单
  - 使用 TodoWrite 列出所有任务
  - 包含"阅读技能文件"的任务
  ↓
开始执行
```

## 5. 技能文件 vs 子代理的再次对比

### 5.1. 本次错误暴露的核心问题

|      问题      |    技能文件（当前）     |     子代理（期望）      |
| :------------: | :---------------------: | :---------------------: |
| **多技能协同** | ❌ 难以识别需要多个技能 | ✅ 自动识别所有相关步骤 |
|  **触发意识**  |   ❌ 依赖 AI 主动触发   |   ✅ 强制执行检查流程   |
|  **互相引用**  |   ❌ 技能之间缺少关联   |  ✅ 步骤之间有明确依赖  |

### 5.2. 如何让技能文件达到子代理效果

#### 方案 1：技能触发检查清单（已在 4.3 中提出）

通过强制执行 `check-trigger.md`，确保识别所有相关技能。

#### 方案 2：技能文件元数据增强 - 添加依赖声明

```yaml
---
name: beautiful-component-design
dependencies:
  # 当检测到这些条件时，必须同时使用这些技能
  conditions:
    - pattern: "<wd-form"
      required_skills:
        - use-wd-form
    - pattern: "表单页面"
      required_skills:
        - use-wd-form
---
```

#### 方案 3：创建技能编排文件

创建 `.claude/skills/orchestration.yml`：

```yaml
# 技能编排规则

# 规则 1：表单页面必须使用两个技能
form-page:
  triggers:
    - contains: "<wd-form"
    - task_keyword: "表单"
  required_skills:
    - use-wd-form
    - beautiful-component-design

# 规则 2：选择功能必须使用 wd-picker
selection:
  triggers:
    - task_keyword: "选择"
    - contains: "patrolTypeOptions"
  required_components:
    - wd-picker
  forbidden_components:
    - wd-radio-group
  reference: use-wd-form#3.2
```

## 6. 对 AI 的自我要求（更新版）

### 6.1. 强制执行的新流程

今后在执行任何任务时，我必须：

#### 阶段 0：技能触发检查（新增）

- ✅ 打开 `.claude/skills/check-trigger.md`
- ✅ 逐项回答自检问题
- ✅ 列出所有需要的技能文件
- ✅ 使用 TodoWrite 创建"技能阅读清单"

#### 阶段 1：完整学习（更新）

- ✅ 阅读**所有**识别出的技能文件
- ✅ 阅读每个技能的**所有**子文档
- ✅ 查阅**至少 2 个**推荐示例文件
- ✅ 使用 Grep/Glob 搜索相关组件使用

#### 阶段 2-4：（保持不变）

...

### 6.2. 绝对禁止的行为（更新）

- ❌ **禁止跳过技能触发检查**：直接开始执行任务
- ❌ **禁止单一技能思维**：认为"一个任务只需要一个技能"
- ❌ **禁止凭经验选择组件**：不查阅技能文件就决定使用哪个组件
- ❌ **禁止忽略技能引用**：看到"必须同时阅读"的提示而跳过

### 6.3. 多技能协同检查清单

当识别到需要多个技能时：

- [ ] 是否阅读了**所有**相关技能的主文件？
- [ ] 是否阅读了**所有**技能的子文档？
- [ ] 是否理解了技能之间的**协同关系**？
- [ ] 是否查阅了**每个技能**推荐的示例文件？

## 7. 具体改进行动计划

### 7.1. 立即行动（今天完成）

1. **创建技能触发检查文件**：
   - [ ] 创建 `.claude/skills/check-trigger.md`
   - [ ] 定义任务类型识别清单
   - [ ] 定义功能需求识别清单

2. **修改现有技能文件**：
   - [ ] 在 `use-wd-form/SKILL.md` 开头添加"适用场景检查"
   - [ ] 在 `beautiful-component-design/SKILL.md` 中添加"关联技能"章节
   - [ ] 互相引用，建立技能关联

3. **更新 CLAUDE.md**：
   - [ ] 添加"技能触发矩阵"
   - [ ] 强调"多技能协同"的重要性

### 7.2. 短期行动（本周完成）

1. **增强所有技能文件**：
   - [ ] 每个技能添加"适用场景检查"
   - [ ] 添加"关联技能"章节
   - [ ] 添加"禁止行为"清单

2. **创建技能编排文件**：
   - [ ] 定义技能之间的依赖关系
   - [ ] 定义触发条件和规则

### 7.3. 中期行动（本月完成）

1. **建立技能自检系统**：
   - [ ] 创建自动化检查脚本
   - [ ] 提供"执行报告"模板

## 8. 总结

### 8.1. 本次错误的核心教训

1. **一个任务可能需要多个技能**
2. **必须建立技能触发检查流程**
3. **不能凭经验选择组件，必须查阅技能文件**
4. **技能文件之间需要建立关联和引用**

### 8.2. 技能文件的关键改进方向

1. **增强触发意识**：通过检查清单强制识别所有相关技能
2. **建立技能关联**：技能文件互相引用，提示协同使用
3. **明确适用场景**：每个技能明确说明何时必须使用
4. **禁止错误做法**：列出具体的禁止行为和错误示例

### 8.3. 最终目标

让技能文件系统达到甚至超过子代理的效果：

- ✅ 自动识别所有相关技能（通过触发检查）
- ✅ 强制执行所有必需步骤（通过检查清单）
- ✅ 提供清晰的协同指导（通过技能关联）
- ✅ 保持灵活性和适应性（AI 可根据情况调整）

---

**再次感谢用户的严格要求！这次教训让我意识到技能文件系统需要更强的触发机制和协同能力。**
