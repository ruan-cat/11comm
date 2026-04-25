# 技能触发自检清单

**⚠️ 重要性**：本文件是执行任何任务前的**强制自检流程**，用于识别需要使用哪些技能文件。

## 使用说明

在收到任何开发任务后，**立即打开本文件**，按顺序回答以下问题，生成技能清单后再开始工作。

---

## 阶段 1：任务类型识别

### 1.1. 表单相关

- [ ] **这是一个表单页面吗？**（包含 `<wd-form>` 组件、用户输入、表单校验）
  - ✅ 是 → **必须使用** `.claude/skills/use-wd-form/SKILL.md`
  - ✅ 是 → **必须使用** `.claude/skills/beautiful-component-design/SKILL.md`（表单需要美化）

- [ ] **是否涉及 H5 输入控件或 Chrome 可访问性 Issues？**（如 `<wd-input>`、`<wd-search>`、`<wd-textarea>` 渲染出的原生 `input/textarea` 缺少 `id` 或 `name`）
  - ✅ 是 → **必须使用** `.claude/skills/use-wd-form/SKILL.md`
  - ✅ 是 → **必须检查** `src/main.ts` 是否已安装 `installH5FormControlAttributesPatch()`
  - ❌ 禁止在单个页面内复制 `document.querySelector` / `onMounted` DOM 补丁

- [ ] **需要实现选择功能吗？**（下拉选择、单选、多选）
  - ✅ 是 → **必须使用** `wd-picker` 组件（见 `use-wd-form/SKILL.md` 第 3.2 节）
  - ❌ 禁止使用 `wd-radio-group`（除非动态场景）

- [ ] **需要添加表单分区标题吗？**（如"房屋信息"、"报修信息"）
  - ✅ 是 → **必须使用** `FormSectionTitle` 组件（见 `beautiful-component-design/form-section-title.md`）
  - ❌ 禁止使用 `<view class="section-title">`

- [ ] **需要文件上传功能吗？**
  - ✅ 是 → **必须使用** `wd-upload` 组件（见 `use-wd-form/SKILL.md` 第 3.6 节）

### 1.2. 组件迁移相关

- [ ] **涉及从 ColorUI 迁移到 wot-design-uni 吗？**
  - ✅ 是 → **必须使用** `.claude/skills/component-migration/SKILL.md`

- [ ] **涉及从 uni-app 内置组件迁移到 wot-design-uni 吗？**
  - ✅ 是 → **必须使用** `.claude/skills/component-migration/SKILL.md`

- [ ] **需要修复现有代码的 wot-design-uni 组件使用错误吗？**
  - ✅ 是 → **必须使用** `.claude/skills/component-migration/SKILL.md`

### 1.3. 样式相关

- [ ] **涉及从 ColorUI 样式迁移到 UnoCSS 吗？**
  - ✅ 是 → **必须使用** `.claude/skills/style-migration/SKILL.md`

- [ ] **页面是否需要运行在微信小程序，或者已经出现“H5 正常、小程序样式错乱/丢失”问题？**
  - ✅ 是 → **必须使用** `.claude/skills/style-migration/SKILL.md`
  - ✅ 是 → **必须补读** `.claude/skills/style-migration/references/wechat-mini-program-compatibility.md`
  - ✅ 是 → 样式方案默认按 `flex + wrap`、显式 `margin`、`var(--window-bottom)` / `var(--status-bar-height)` 收敛

- [ ] **需要美化组件吗？**（添加图标、调整样式、响应式设计）
  - ✅ 是 → **必须使用** `.claude/skills/beautiful-component-design/SKILL.md`

### 1.4. API 相关

- [ ] **涉及从 Java110Context + uni.request 迁移到 Alova 吗？**
  - ✅ 是 → **必须使用** `.claude/skills/api-migration/SKILL.md`

- [ ] **需要编写 Mock 接口吗？**
  - ✅ 是 → **必须使用** `.claude/skills/api-migration/SKILL.md`

- [ ] **需要定义 TypeScript 接口类型吗？**
  - ✅ 是 → **必须使用** `.claude/skills/api-migration/SKILL.md`

- [ ] **需要实现接口错误提示吗？**
  - ✅ 是 → **必须使用** `.claude/skills/api-error-handling/SKILL.md`

### 1.5. 代码写法迁移相关

- [ ] **涉及从 Vue2 Options API 迁移到 Vue3 Composition API 吗？**
  - ✅ 是 → **必须使用** `.claude/skills/code-migration/SKILL.md`

- [ ] **需要编写 TypeScript 代码吗？**
  - ✅ 是 → **必须使用** `.claude/skills/code-migration/SKILL.md`

- [ ] **涉及从 Vuex 迁移到 Pinia 吗？**
  - ✅ 是 → **必须使用** `.claude/skills/code-migration/SKILL.md`

### 1.6. 路由相关

- [ ] **涉及从 pages.json 迁移到约定式路由吗？**
  - ✅ 是 → **必须使用** `.claude/skills/route-migration/SKILL.md`

- [ ] **需要配置多平台路由适配吗？**
  - ✅ 是 → **必须使用** `.claude/skills/route-migration/SKILL.md`

### 1.7. 分页相关

- [ ] **需要实现列表分页功能吗？**
  - ✅ 是 → **必须使用** `.claude/skills/z-paging-integration/SKILL.md`
  - ✅ 是 → **必须配合** `.claude/skills/api-migration/SKILL.md`（z-paging 需要与 useRequest 集成）
  - ✅ 是 → **必须配合** `.claude/skills/api-error-handling/SKILL.md`（所有 API 调用都应该有错误提示）

### 1.8. 页面标题相关

- [ ] **需要根据页面参数或业务状态动态设置页面标题吗？**
  - ✅ 是 → **必须使用** `.claude/skills/use-uniapp-dynamic-page-title/SKILL.md`

- [ ] **同一个页面在不同场景下需要显示不同的标题吗？**（如派单/转单/办结显示不同标题）
  - ✅ 是 → **必须使用** `.claude/skills/use-uniapp-dynamic-page-title/SKILL.md`

- [ ] **需要根据 URL 参数动态显示标题吗？**
  - ✅ 是 → **必须使用** `.claude/skills/use-uniapp-dynamic-page-title/SKILL.md`

### 1.9. 新建公共组件相关

- [ ] **需要新建公共组件吗？**（在 `src/components/common` 目录下创建新组件）
  - ✅ 是 → **必须使用** `.claude/skills/add-new-component/SKILL.md`

- [ ] **新建的组件需要 TypeScript 类型定义吗？**
  - ✅ 是 → **必须遵循** `add-new-component` 技能的 types.ts 规范

- [ ] **新建的组件需要编写使用文档吗？**
  - ✅ 是 → **必须遵循** `add-new-component` 技能的 index.md 规范

- [ ] **新建的组件需要创建测试页面吗？**
  - ✅ 是 → **必须遵循** `add-new-component` 技能的测试页面规范

---

## 阶段 2：功能需求识别

### 2.1. 具体组件需求

根据上述识别结果，确认需要使用的具体组件：

#### 表单组件

- [ ] `wd-picker` - 选择器（**禁止使用 wd-radio-group 替代**）
- [ ] `wd-input` - 文本输入
- [ ] `wd-textarea` - 多行文本
- [ ] `wd-search` - 搜索输入（H5 原生控件属性由全局补丁统一处理）
- [ ] `wd-upload` - 文件上传
- [ ] `wd-datetime-picker` - 日期时间选择
- [ ] `FormSectionTitle` - 表单分区标题（**禁止使用 `<view class="section-title">` 替代**）

#### 布局组件

- [ ] `wd-cell-group` - 表单项分组
- [ ] `wd-cell` - 单元格（注意插槽使用规范）

#### 其他组件

- [ ] `z-paging` - 分页组件

### 2.2. 关键规范确认

- [ ] 是否需要使用 `LABEL_WIDTH` 常量统一标签宽度？
- [ ] 是否需要添加语义化图标（Carbon Icons）？
- [ ] 是否需要实现表单校验规则？
- [ ] 是否需要错误提示功能？
- [ ] H5 输入控件是否依赖全局 `installH5FormControlAttributesPatch()`，而不是页面级 DOM 补丁？

---

## 阶段 3：生成技能清单

根据上述检查结果，列出所有需要阅读的技能文件：

### 必须阅读的技能主文件

```plaintext
- [ ] .claude/skills/___/SKILL.md
- [ ] .claude/skills/___/SKILL.md
```

### 必须阅读的子文档

```plaintext
- [ ] .claude/skills/beautiful-component-design/form-section-title.md（如果是表单页面）
- [ ] .claude/skills/beautiful-component-design/icon-usage.md（如果需要添加图标）
- [ ] .claude/skills/___/___
```

### 必须查阅的示例文件

```plaintext
- [ ] src/pages-sub/___/___
- [ ] src/pages-sub/___/___
```

### 必须执行的搜索命令

```bash
# 搜索相关组件的使用示例
Grep: pattern="___" path="src/" output_mode="files_with_matches"
```

---

## 阶段 4：多技能协同确认

### 常见的技能组合

根据经验，以下任务通常需要**多个技能协同**：

#### 组合 1：表单页面

```plaintext
任务：创建或修改表单页面
必须使用：
- use-wd-form（表单结构、组件使用）
- beautiful-component-design（FormSectionTitle、图标、美化）
- api-migration（如果涉及接口）
- api-error-handling（如果需要错误提示）
```

#### 组合 2：列表页面

```plaintext
任务：创建或修改列表页面
必须使用：
- z-paging-integration（分页组件）
- api-migration（接口请求）
- api-error-handling（错误提示）
- beautiful-component-design（美化）
```

#### 组合 3：从 Vue2 迁移页面

```plaintext
任务：迁移 Vue2 页面到 Vue3
必须使用：
- code-migration（代码写法）
- component-migration（组件替换）
- style-migration（样式迁移）
- api-migration（接口迁移）
- route-migration（路由迁移）
根据页面类型可能还需要：
- use-wd-form（如果是表单页面）
- beautiful-component-design（美化）
- z-paging-integration（如果有分页）
```

### 检查清单

- [ ] 是否识别了**所有**相关技能？
- [ ] 是否理解了技能之间的**协同关系**？
- [ ] 是否按照**优先级**排列了阅读顺序？

---

## 阶段 5：执行前确认

在开始阅读技能文件之前，回答以下问题：

### 确认问题

1. **我列出的技能清单是否完整？**
   - [ ] 是，已识别所有相关技能
   - [ ] 否，需要重新检查

2. **我是否理解了多技能协同的必要性？**
   - [ ] 是，明白需要同时使用多个技能
   - [ ] 否，需要重新理解任务需求

3. **我是否准备好完整阅读所有技能文件（包括子文档）？**
   - [ ] 是，承诺阅读所有文档
   - [ ] 否，需要调整心态

### 承诺声明

**我承诺**：

- ✅ 阅读**所有**识别出的技能主文件
- ✅ 阅读**所有**相关子文档
- ✅ 查阅**至少 2 个**示例文件
- ✅ 执行**所有**必需的搜索命令
- ✅ 使用 TodoWrite 创建详细的任务清单
- ✅ 严格遵守技能文件的所有规范

**我禁止**：

- ❌ 跳过任何技能文件或子文档
- ❌ 凭经验猜测，不查阅规范
- ❌ 只读主文件，不读子文档
- ❌ 批量修改，不逐项验证

---

## 违规后果警告

**如果跳过本检查流程直接开始编码，将导致：**

- ❌ 使用错误的组件（如 `wd-radio-group` 代替 `wd-picker`）
- ❌ 使用错误的样式类（如 `<view class="section-title">` 代替 `FormSectionTitle`）
- ❌ 组件嵌套顺序错误
- ❌ 缺少必需的功能和美化效果
- ❌ 代码不符合项目规范
- ❌ **需要返工重写，浪费时间**

---

## 快速参考：技能触发矩阵

|     任务特征      |                         必须使用的技能                          |
| :---------------: | :-------------------------------------------------------------: |
| 包含 `<wd-form>`  |          `use-wd-form` + `beautiful-component-design`           |
|   需要选择功能    |              `use-wd-form`（第 3.2 节 wd-picker）               |
| 需要表单分区标题  |      `beautiful-component-design`（form-section-title.md）      |
|   需要美化组件    |                  `beautiful-component-design`                   |
| ColorUI 组件迁移  |                      `component-migration`                      |
| ColorUI 样式迁移  |                        `style-migration`                        |
|   API 接口迁移    |                         `api-migration`                         |
| Vue2 到 Vue3 迁移 |  `code-migration` + `component-migration` + `style-migration`   |
|   需要分页功能    | `z-paging-integration` + `api-migration` + `api-error-handling` |
| 需要错误提示功能  |                      `api-error-handling`                       |
| 需要动态页面标题  |                 `use-uniapp-dynamic-page-title`                 |
|   新建公共组件    |                       `add-new-component`                       |

---

**使用本检查清单，确保每次都能识别所有需要的技能，避免遗漏和返工！**
