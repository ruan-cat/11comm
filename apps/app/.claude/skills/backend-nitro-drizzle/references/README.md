# 参考文档说明

> 本目录包含 `backend-nitro-drizzle` 技能的参考文档。

---

## 1. 文档清单

| 文件                           | 来源                         | 说明                            |
| :----------------------------- | :--------------------------- | :------------------------------ |
| `fullstackrecipes-original.md` | https://fullstackrecipes.com | Next.js 全栈开发食谱 (中文翻译) |

---

## 2. fullstackrecipes-original.md

### 2.1. 文档概述

这是 Fullstack Recipes 的完整中文翻译版本，原文档专注于 **Next.js + Vercel + Bun** 技术栈的全栈开发。

### 2.2. 技术栈差异

|  技术领域  | fullstackrecipes |      本项目       |
| :--------: | :--------------: | :---------------: |
|  **框架**  |   Next.js 15+    |     Nitro v3      |
| **运行时** |       Bun        |  Node.js / pnpm   |
|  **部署**  |      Vercel      |      多平台       |
|   **UI**   |    Shadcn UI     |  wot-design-uni   |
| **数据库** |  Neon + Drizzle  | Neon + Drizzle ✅ |

### 2.3. 已提取的内容

以下内容已改造并融入 `backend-nitro-drizzle` 技能文档：

| 原章节                       | 提取到                     |
| :--------------------------- | :------------------------- |
| 第 6 章: 断言辅助函数        | `01-nitro-setup.md`        |
| 第 7 章: 类型安全的环境配置  | `02-env-config.md`         |
| 第 9 章: Neon + Drizzle 设置 | `03-neon-drizzle.md`       |
| 第 11 章: Drizzle 数据库操作 | `04-drizzle-operations.md` |

### 2.4. 不适用的内容

以下章节与本项目技术栈不匹配，仅供学习参考：

- ❌ Next.js / Vercel 相关章节
- ❌ Shadcn UI 与主题
- ❌ AI SDK 相关章节
- ❌ Better Auth 认证相关
- ❌ Ralph 代理循环

---

## 3. 使用建议

1. **优先使用主技能文档**：`backend-nitro-drizzle/SKILL.md`
2. **参考原文档**：当需要了解设计思想来源时
3. **不要直接复制**：原文档代码需要适配 Nitro v3 环境
