## Context

本项目基于 `docs/prompts/route-migration-map.yml` 定义的 140 个页面迁移映射，从 Vue2（gitee-example）向 Vue3（uni-app + TypeScript + Vite5 + UnoCSS + wot-design-uni）进行全面迁移。

当前已有一份初步报告（`docs/reports/2026-03-03-migration-progress-report.md`），但该报告存在以下局限：

- 仅基于文件是否存在进行判断，缺乏代码质量和 Skills 合规性的深度验证
- 部分模块（already-migrated 模块）从未被专项检查子代理逐文件核查
- 报告中的数据可能与实际情况存在偏差

本次设计的目标是建立一套**系统性、可重复**的迁移进度核查流程，并产出一份权威的最终报告。

## Goals / Non-Goals

**Goals:**

- 通过多个并行子代理（Explorer Agents），对照迁移映射表全面扫描目标 Vue3 文件的存在性
- 对每一个已存在的迁移文件，独立启动专项检查子代理，逐项对比 Skills 技能规范（包括：`code-migration`、`component-migration`、`style-migration`、`api-migration`、`use-wd-form`、`z-paging-integration`、`api-error-handling`、`beautiful-component-design`）
- 将所有发现汇聚为一份结构化报告，写入 `docs/reports/2026-03-03-migration-progress-report.md`

**Non-Goals:**

- 不对任何未迁移页面进行实际迁移开发
- 不修改已迁移页面的代码（本次仅检查，不修复）
- 不涉及 E2E 测试、构建验证或运行时检查

## Decisions

### 决策 1：按模块分组，并行执行存在性扫描

**决策**：将 14 个功能模块分组（每次 3~4 个模块），对每组并行启动 Explorer 子代理，使用 `Glob` 工具扫描目标文件是否存在。

**理由**：串行扫描 140 个文件耗时过长；按模块分组可以充分利用并行化加速，同时避免单个子代理上下文过大。

**备选方案**：全量顺序扫描——被排除，因为效率低且容易因上下文溢出遗漏结果。

---

### 决策 2：对每个已存在文件启动独立专项检查子代理

**决策**：每个已迁移文件分配一个独立子代理，读取对应技能文档后逐项检查代码规范合规性。

**理由**：每个文件的检查深度和上下文互不干扰；独立子代理可以聚焦单一文件，提高检查精度。

**备选方案**：一个子代理检查整个模块——被排除，因为单模块文件数多时容易遗漏细节。

---

### 决策 3：Skills 合规性检查项目矩阵

对每个已迁移文件，按以下矩阵逐项检查：

|           检查维度           |      适用条件      |                                      检查要点                                      |
| :--------------------------: | :----------------: | :--------------------------------------------------------------------------------: |
|       `code-migration`       |      所有文件      | `<script setup lang="ts">` 写法、Composition API、JSDoc 注释、文件顶部页面说明注释 |
|    `component-migration`     |      所有文件      |                    组件使用 wot-design-uni、无 ColorUI 组件残留                    |
|      `style-migration`       |      所有文件      |                       使用 UnoCSS 原子类、无 `cu-` 类名残留                        |
|       `api-migration`        |    含 API 调用     |            使用 Alova + useRequest、无 `uni.request` / `Java110Context`            |
|     `api-error-handling`     |    含 API 调用     |                               onError 回调有错误提示                               |
|        `use-wd-form`         | 含表单 `<wd-form>` |              wd-picker 替代 wd-radio-group、FormSectionTitle 分区标题              |
|    `z-paging-integration`    |     含分页列表     |                        z-paging 组件 + useRequest 正确集成                         |
| `beautiful-component-design` |   含表单/选择器    |                     FormSectionTitle、Carbon Icons、响应式设计                     |

---

### 决策 4：报告结构保持并扩充现有文件

**决策**：在现有 `docs/reports/2026-03-03-migration-progress-report.md` 的基础上补充和修订，不另建新文件。

**理由**：该报告已有初步框架，扩充内容比另起炉灶更高效。

## Risks / Trade-offs

- **[风险] 子代理检查结论不一致** → 缓解：制定统一的检查评分标准（Pass / Warn / Fail），所有子代理按同一标准输出
- **[风险] 部分文件存在但内容为空或为 placeholder** → 缓解：存在性检查同时验证文件行数（>20 行才算有效迁移）
- **[风险] 已有报告数据不准确** → 缓解：以本次扫描为准，覆盖旧数据
- **[权衡] 深度检查耗时较长** → 接受：通过并行子代理最大化吞吐量，全面性优先于速度
