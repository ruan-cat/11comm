# 2026-03-02 不正确的 H3 导入路径清单

## 1. 报告概述

本报告汇总了项目中所有使用了错误 H3 导入路径 `from "h3"` 的文件。根据 Nitro v3 规范，所有来自 H3 的函数应该从 `"nitro/h3"` 导入。

### 统计摘要

|         分类          |  数量  |      状态       |
| :-------------------: | :----: | :-------------: |
| TypeScript 服务端文件 |   8    |     待修复      |
|   Markdown 文档文件   |   6    |     待修复      |
|       **总计**        | **14** | **100% 待修复** |

---

## 2. TypeScript 服务端文件列表

共 **8 个** 文件包含错误的 H3 导入，全部位于 `apps/admin/server/` 目录下。

### 2.1. 中间件文件（3 个）

|  #  |                   文件路径                   | 行号 |                             错误导入                             |                                需修改为                                |
| :-: | :------------------------------------------: | :--: | :--------------------------------------------------------------: | :--------------------------------------------------------------------: |
|  1  |  `apps/admin/server/middleware/1.logger.ts`  |  1   |             `import { defineMiddleware } from "h3";`             |             `import { defineMiddleware } from "nitro/h3";`             |
|  2  |   `apps/admin/server/middleware/2.auth.ts`   |  1   | `import { defineMiddleware, getCookie, createError } from "h3";` | `import { defineMiddleware, getCookie, createError } from "nitro/h3";` |
|  3  | `apps/admin/server/middleware/3.validate.ts` |  1   |      `import { defineMiddleware, createError } from "h3";`       |      `import { defineMiddleware, createError } from "nitro/h3";`       |

### 2.2. 工具函数文件（3 个）

|  #  |                     文件路径                      | 行号 |              错误导入               |                 需修改为                  |
| :-: | :-----------------------------------------------: | :--: | :---------------------------------: | :---------------------------------------: |
|  4  |      `apps/admin/server/utils/rate-limit.ts`      |  7   | `import { createError } from "h3";` | `import { createError } from "nitro/h3";` |
|  5  | `apps/admin/server/utils/permission-validator.ts` |  6   | `import { createError } from "h3";` | `import { createError } from "nitro/h3";` |
|  6  |  `apps/admin/server/utils/account-migration.ts`   |  9   | `import { createError } from "h3";` | `import { createError } from "nitro/h3";` |

### 2.3. API 路由文件（2 个）

|  #  |                       文件路径                       | 行号 |              错误导入               |                 需修改为                  |
| :-: | :--------------------------------------------------: | :--: | :---------------------------------: | :---------------------------------------: |
|  7  | `apps/admin/server/api/auth/forgot-password/post.ts` |  7   | `import { createError } from "h3";` | `import { createError } from "nitro/h3";` |
|  8  |     `apps/admin/server/api/auth/migrate/post.ts`     |  12  | `import { createError } from "h3";` | `import { createError } from "nitro/h3";` |

---

## 3. Markdown 文档文件列表

共 **6 个** 文件包含错误的 H3 导入示例，分布在文档和技能文件中。

### 3.1. 技能文件（1 个）

|  #  |                            文件路径                            | 行号 |                       错误内容                       |        上下文        |
| :-: | :------------------------------------------------------------: | :--: | :--------------------------------------------------: | :------------------: |
|  1  | `.claude/skills/nitro-api-development/references/mock-mode.md` |  74  | `import { defineEventHandler, readBody } from "h3";` | 代码示例（反面教材） |

### 3.2. OpenSpec 文档文件（2 个）

|  #  |                                             文件路径                                              |   行号   |                       错误内容                       |            上下文             |
| :-: | :-----------------------------------------------------------------------------------------------: | :------: | :--------------------------------------------------: | :---------------------------: |
|  2  | `openspec/changes/archive/2025-12-27-migrate-static-data-to-nitro-query/specs/nitro-api/spec.md`  |   123    | `import { defineEventHandler, readBody } from "h3";` |     代码示例（反面教材）      |
|  3  | `openspec/changes/archive/2025-12-27-migrate-static-data-to-nitro-query/specs/migration-guide.md` | 399, 437 | `import { defineEventHandler, readBody } from "h3";` | 代码示例（反面教材）- 共 2 处 |

### 3.3. 命令文件（1 个）

|  #  |                         文件路径                         | 行号 |                       错误内容                       |        上下文        |
| :-: | :------------------------------------------------------: | :--: | :--------------------------------------------------: | :------------------: |
|  4  | `.claude/commands/migrate-static-data-to-nitro-query.md` |  85  | `import { defineEventHandler, readBody } from "h3";` | 代码示例（反面教材） |

### 3.4. 其他文档（2 个）

|  #  |                    文件路径                     | 行号 |              错误内容               |        上下文        |
| :-: | :---------------------------------------------: | :--: | :---------------------------------: | :------------------: |
|  5  | `apps/admin/src/docs/prompts/各种杂项/index.md` | 351  | `import { createError } from "h3";` | 代码示例（错误示例） |

---

## 4. 修复方案

### 4.1. 修复规则

所有错误导入都遵循同一个修复规则：

```diff
- import { ... } from "h3";
+ import { ... } from "nitro/h3";
```

### 4.2. 修复优先级

| 优先级 |         类型          | 数量 |             说明             |
| :----: | :-------------------: | :--: | :--------------------------: |
| **P0** | TypeScript 服务端代码 |  8   |    生产代码，必须立即修复    |
| **P1** |   Markdown 文档示例   |  6   | 文档示例，应同步修复防止误导 |

### 4.3. 修复步骤

1. **修复 TypeScript 服务端文件（8 个）**
   - 修改第 4 个文件：更新导入语句
   - 修改第 5 个文件：更新导入语句
   - 修改第 6 个文件：更新导入语句
   - 修改第 7 个文件：更新导入语句
   - 修改第 8 个文件：更新导入语句
   - 修改第 1-3 个中间件文件：更新导入语句

2. **修复 Markdown 文档文件（6 个）**
   - 更新技能文件中的代码示例
   - 更新 OpenSpec 文档中的代码示例
   - 更新命令文件中的代码示例
   - 更新其他文档中的代码示例

3. **验证修复完整性**
   - 再次搜索 `from "h3"` 确保无遗漏
   - 运行代码检查确保导入正确
   - 更新项目文档清单

---

## 5. 根本原因分析

### 5.1. 发生原因

1. **API 文档参考错误**：某些开发人员参考了 H3 官方文档而非 Nitro v3 包装文档
2. **copy-paste 错误**：代码复制时没有适配正确的导入路径
3. **文档示例未更新**：旧版本文档中的示例未及时更新到 Nitro v3 规范

### 5.2. 预防措施

1. 在 `CLAUDE.md` 中强化 Nitro v3 导入规范
2. 在 `.claude/skills/nitro-api-development/SKILL.md` 中明确标注导入路径要求
3. 配置 ESLint 规则防止直接从 "h3" 导入
4. 定期检查文档示例的准确性

---

## 6. 相关文档

- **Nitro 官方文档**：https://v3.nitro.build/
- **H3 官方文档**：https://h3.unjs.io/
- **项目规范**：`.claude/skills/nitro-api-development/SKILL.md`
- **项目指南**：`CLAUDE.md` - 第 16.2 章节

---

## 7. 状态跟踪

|      任务项      |   状态    |     责任人     |  完成日期  |
| :--------------: | :-------: | :------------: | :--------: |
|    探索和收集    |  ✅ 完成  | explorer-agent | 2026-03-02 |
| 修复 TS 代码文件 | ⏳ 待处理 |       -        |     -      |
| 修复 MD 文档文件 | ⏳ 待处理 |       -        |     -      |
|  验证修复完整性  | ⏳ 待处理 |       -        |     -      |

---

**报告生成时间**：2026-03-02 08:00:57 UTC
**报告作者**：explorer-agent
**下一步**：等待 team-lead 分配修复任务
