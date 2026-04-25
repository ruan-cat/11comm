# 组件迁移/修复强制执行检查清单

> **⚠️ 本清单必须在每次修改 wot-design-uni 组件前执行，不得跳过任何步骤！**

## 📋 执行前检查（每个组件修改前必做）

### ✅ 步骤 1：识别组件类型

**检查项**：

- [ ] 我要修改的是哪个 wot-design-uni 组件？（如：wd-button, wd-picker, wd-textarea）
- [ ] 我要修改哪些属性？（列出所有要修改的属性名）
- [ ] 这是类型错误、组件用法错误，还是新增组件？

**示例**：

```plain
组件：wd-loading
属性：type
错误类型：类型错误（TypeScript 报错）
```

---

### ✅ 步骤 2：查阅官方文档（**强制执行，不得省略**）

**检查项**：

- [ ] 我已使用 WebFetch 获取该组件的官方文档
- [ ] 我已阅读该属性的类型定义（string | number | boolean 等）
- [ ] 我已查看官方示例代码
- [ ] 我已确认该属性是否需要 v-bind（冒号绑定）

**执行命令**：

```typescript
WebFetch({
	url: "https://wot-ui.cn/component/[组件名].html",
	prompt: "请提取 wd-[组件名] 组件的 [属性名] 属性的类型定义、所有有效值和使用示例",
});
```

**示例**：

```typescript
WebFetch({
	url: "https://wot-ui.cn/component/loading.html",
	prompt: "请提取 wd-loading 组件的 type 属性的类型定义、所有有效值和使用示例",
});
```

---

### ✅ 步骤 3：查阅项目示例（推荐执行）

**检查项**：

- [ ] 我已搜索 `src/pages-sub/repair/*.vue` 中是否有相同组件的正确用法
- [ ] 我已对比官方文档和项目示例的差异
- [ ] 我已理解该组件在项目中的标准用法

**执行命令**：

```bash
Grep: pattern="wd-[组件名]" path="src/pages-sub/repair" glob="*.vue" output_mode="content"
```

---

### ✅ 步骤 4：制定修改方案

**检查项**：

- [ ] 我已根据文档确定正确的属性值
- [ ] 我已确认是否需要 v-bind 绑定
- [ ] 我已确认属性值的单位（如 px, rpx, %）
- [ ] 我已准备好修改代码

**决策表**：

|   属性类型    | 是否需要 v-bind | 示例                     |
| :-----------: | :-------------: | :----------------------- |
| string 字面量 |       ❌        | `type="ring"`            |
|    number     |       ✅        | `:maxlength="512"`       |
|    boolean    |       ✅        | `:disabled="true"`       |
| string + 单位 |       ❌        | `title-width="120rpx"`   |
|  变量/表达式  |       ✅        | `:value="formData.name"` |

---

### ✅ 步骤 5：执行修改

**检查项**：

- [ ] 我只修改了这一个组件/属性（不批量修改）
- [ ] 我已仔细核对修改内容
- [ ] 我已使用 Edit 工具进行修改

**⚠️ 禁止行为**：

- ❌ 一次性修改多个文件的相同错误
- ❌ 没有查文档就修改
- ❌ 凭经验猜测属性用法

---

### ✅ 步骤 6：验证修改

**检查项**：

- [ ] 我已使用 IDE 诊断工具检查类型错误是否消失
- [ ] 我已对比修改后的代码与官方示例
- [ ] 如果还有错误，我已重新查阅文档

**执行命令**：

```typescript
mcp__ide__getDiagnostics({
	uri: "file:///d:/code/.../[文件名].vue",
});
```

---

### ✅ 步骤 7：记录进度

**检查项**：

- [ ] 我已使用 TodoWrite 标记该任务为 completed
- [ ] 我已准备好修改下一个组件

---

## 🚨 红线原则（绝对禁止）

### ❌ 禁止行为清单

1. **禁止跳过文档查阅**
   - ❌ 不查文档就修改代码
   - ❌ 只看技能文件，不看官方文档
   - ❌ 凭经验或从其他文件推断用法

2. **禁止批量修改**
   - ❌ 一次性修改多个文件
   - ❌ 一次性修改多个组件
   - ❌ 没有验证就继续修改下一个

3. **禁止假设**
   - ❌ 假设属性类型
   - ❌ 假设是否需要 v-bind
   - ❌ 假设属性的有效值

---

## ✅ 正确流程示例

### 场景：修复 wd-loading type="circular" 类型错误

```markdown
1. ✅ 识别：组件 wd-loading，属性 type，类型错误

2. ✅ 查文档：
   WebFetch('https://wot-ui.cn/component/loading.html',
   '请提取 wd-loading 组件的 type 属性的所有有效值')

   结果：type 可选值为 'ring', 'outline'，类型为 string

3. ✅ 查示例：
   Grep: pattern="wd-loading" path="src/pages-sub/repair"

   结果：其他文件使用 type="ring"

4. ✅ 制定方案：
   - type 是 string 类型，不需要 v-bind
   - 有效值只有 'ring' 和 'outline'
   - 修改为 type="ring"

5. ✅ 执行修改：
   Edit: type="circular" → type="ring"

6. ✅ 验证：
   mcp**ide**getDiagnostics() → 无错误

7. ✅ 记录：
   TodoWrite: 标记为 completed
```

---

## 📝 批量错误处理策略

**情况**：发现多个文件有相同的组件错误

### ❌ 错误做法

```plain
一次性修改所有文件 → 可能引入更多错误
```

### ✅ 正确做法

```plain
1. 查阅文档，确认正确用法
2. 修改第一个文件
3. 验证修改结果
4. 确认无误后，再修改第二个文件
5. 重复步骤 3-4
```

**使用 TodoWrite 跟踪**：

```typescript
TodoWrite([
	{ content: "修复 file1.vue 的 wd-loading type 错误", status: "in_progress" },
	{ content: "修复 file2.vue 的 wd-loading type 错误", status: "pending" },
	{ content: "修复 file3.vue 的 wd-loading type 错误", status: "pending" },
]);
```

---

## 🎯 成功标准

**只有满足以下所有条件，才算成功完成组件修复**：

- ✅ 每个组件修改前都查阅了官方文档
- ✅ 所有修改都基于文档，而非经验
- ✅ 所有类型错误都已消失
- ✅ 修改后的代码符合官方示例
- ✅ 使用 TodoWrite 完整记录了修改过程

---

## 📚 常用文档速查

### wot-design-uni 组件文档

|    组件     | 文档地址                                  | 常见属性                    |
| :---------: | :---------------------------------------- | :-------------------------- |
| wd-loading  | https://wot-ui.cn/component/loading.html  | type, size, color           |
| wd-textarea | https://wot-ui.cn/component/textarea.html | maxlength, show-word-limit  |
|  wd-picker  | https://wot-ui.cn/component/picker.html   | v-model, columns, label-key |
|   wd-cell   | https://wot-ui.cn/component/cell.html     | title-width, is-link        |
|  wd-upload  | https://wot-ui.cn/component/upload.html   | @success, @remove           |

---

## 🔄 持续改进

**每次完成组件修复后，思考**：

1. 这次是否严格遵守了检查清单？
2. 是否有跳过某些步骤？
3. 下次如何避免类似错误？

**记录经验**：

- 记录易错的组件和属性
- 记录文档与实际用法的差异
- 更新检查清单
