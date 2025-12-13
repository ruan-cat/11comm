# Change: Migrate static test-data to Nitro + TanStack Query

## Why

当前 98 个列表页使用本地假数据（`test-data.ts`），导致以下问题：

1. **无法模拟真实后端交互** - 本地过滤逻辑无法反映真实 API 行为
2. **类型系统分散** - 业务类型散落在各个页面文件中，缺乏统一管理
3. **中文字段名** - 不符合国际化和代码规范要求
4. **缺乏现代数据管理** - 没有缓存、重试、loading 状态等现代 Web 应用特性
5. **前后端未分离** - 假数据与页面组件耦合，难以后续接入真实数据库

## What Changes

本变更将实现以下核心改动（**BREAKING CHANGE**）：

### 1. 类型系统重构

- 初始化 `apps/type` 作为独立的 TypeScript 类型库（monorepo 包）
- **BREAKING**: 所有业务类型字段名从中文切换为英文（驼峰命名法）
- 使用 JSDoc 注释提供中英文双语说明
- 按模块目录组织类型文件（与 `pages/` 目录结构对应）

### 2. Nitro 全栈接口

- 启用 Nitro 服务端功能（`serverDir: "server"`）
- 创建 98 个 POST 接口，路径与页面目录对应
- 假数据从 `pages/*/test-data.ts` 迁移到 `server/api/*/mock-data.ts`
- 所有接口返回统一格式：`JsonVO<PageDTO<T>>`
- 实现请求参数筛选和分页逻辑

### 3. TanStack Query 集成

- 安装 `@tanstack/vue-query` ^5.62.8
- 创建通用列表查询 Hook (`useListQuery`)
- 为 98 个列表页创建专用查询 Hook
- 替换 `loadTableData` 函数为响应式数据获取

### 4. 列表页迁移

- 删除本地 `import test-data`
- 使用 TanStack Query hooks 获取数据
- 监听数据变化自动更新表格
- 支持 loading 状态、自动缓存、重试机制

## Impact

### 影响的规范

- **test-data-quality** - 假数据从页面迁移到服务端，字段名切换为英文
- **test-data-backlog** - 需要更新任务清单，反映新的迁移步骤
- **list-page-pattern** - 列表页数据获取方式完全改变
- **新增**: type-naming-convention - 类型命名和字段规范
- **新增**: nitro-api-standard - Nitro 接口编写规范
- **新增**: data-fetching-pattern - 数据获取模式规范

### 影响的代码

**修改的现有文件：**

- `apps/admin/package.json` - 添加 @tanstack/vue-query 依赖
- `apps/admin/nitro.config.ts` - 启用 serverDir
- `apps/admin/src/main.ts` - 初始化 VueQueryPlugin
- `apps/admin/src/pages/**/index.vue` - 126 个列表页

**新增的文件：**

- `apps/type/` - 完整的类型库包
  - `package.json`, `tsconfig.json`, `index.ts`
  - `src/business/**/*.ts` - 98 个业务类型文件
- `apps/admin/server/api/` - Nitro 接口层
  - `**/**/list.post.ts` - 98 个分页查询接口
  - `**/**/mock-data.ts` - 98 个假数据文件
- `apps/admin/src/api/` - API 客户端层
  - `**/**/index.ts` - 98 个 TanStack Query hooks
- `apps/admin/src/composables/useListQuery.ts` - 通用查询模板

**删除的文件：**

- `apps/admin/src/pages/**/test-data.ts` - 98 个假数据文件（迁移后删除）

### 向后兼容性

**破坏性变更：**

1. 所有业务类型字段名从中文切换为英文，无兼容层
2. `test-data.ts` 文件完全删除
3. 列表页的 `loadTableData` 函数移除
4. 需要一次性迁移所有页面，无法部分迁移

**缓解措施：**

- 按模块增量迁移（dev-team → operation-team → property-manage → setting-manage）
- 每完成一个模块立即验证功能正常
- 提供详细的字段映射表和代码模板
- 建议编写自动化脚本减少手动工作

## Acceptance Criteria

### 代码质量

- [ ] `pnpm -F @01s-11comm/type typecheck` 无报错
- [ ] `pnpm -F @01s-11comm/admin typecheck` 无报错
- [ ] 所有 Nitro 接口返回格式统一为 `JsonVO<PageDTO<T>>`
- [ ] 所有类型字段名为英文，包含 JSDoc 注释
- [ ] 所有列表页使用 TanStack Query 获取数据

### 功能验证

- [ ] 所有列表页初始加载正常显示数据
- [ ] 所有搜索功能正常（筛选条件生效）
- [ ] 所有分页功能正常（页码切换、每页大小调整）
- [ ] loading 状态正确显示
- [ ] 错误状态正确提示

### 文档完善

- [ ] 更新 `.claude/agents/make-list-page.md`（反映新的数据获取方式）
- [ ] 编写迁移总结报告（`apps/admin/src/docs/reports/`）
- [ ] 更新 `CLAUDE.md` 项目说明
- [ ] OpenSpec 规范通过 `openspec validate --strict`

## Migration Path

### 阶段 1: 基础设施（1 周）

1. 初始化 apps/type 类型库
2. 安装 @tanstack/vue-query
3. 创建 useListQuery 通用模板
4. 完成 1 个试点页面验证方案

### 阶段 2-5: 模块迁移（10 周）

- dev-team: 8 页面（1 周）
- operation-team: 14 页面（2 周）
- property-manage: 60 页面（6 周）
- setting-manage: 7 页面（1 周）

### 阶段 6: 验证清理（1 周）

1. 类型检查和功能测试
2. 删除旧的 test-data.ts 文件
3. 更新文档和代码注释

**总计：** 12 周，~490 个子任务

## Risks and Mitigation

|               风险               | 影响等级 |                缓解措施                |
| :------------------------------: | :------: | :------------------------------------: |
| 一步到位策略导致大量页面同时失效 |  **高**  | 按模块增量迁移，每完成一个模块立即验证 |
|   字段名转换错误导致数据不显示   |  **中**  |   使用映射表自动化转换，编写脚本验证   |
| Nitro 接口与 Vite 开发服务器冲突 |  **中**  |    使用 Nitro 的开发模式，分离端口     |
|     98 个文件迁移工作量巨大      |  **高**  |   编写脚本自动化生成类型、接口、hook   |
|     类型库构建失败影响主应用     |  **低**  |     在 CI/CD 中单独构建 apps/type      |

## Dependencies

- 依赖 Nitro 3.0.1-alpha.1 已安装
- 需要新增 @tanstack/vue-query ^5.62.8
- 需要 pnpm workspace 支持本地类型库引用

## References

- 详细迁移计划：`apps/admin/src/docs/reports/2025-12-12-static-data-migration-to-nitro-query-plan.md`
- 代码模板和字段映射表见报告第 6-7 章
- 现有规范：`test-data-quality`, `test-data-backlog`
- 相关 Agent：`.claude/agents/make-list-page.md`
