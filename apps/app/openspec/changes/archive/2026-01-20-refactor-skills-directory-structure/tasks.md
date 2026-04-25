# Tasks: 重构 Claude Code Skills 目录结构

## 1. 准备工作

- [x] 1.1 备份当前 skills 目录结构清单
- [x] 1.2 检查所有 SKILL.md 中的文件引用路径

## 2. 重构 api-migration 技能

- [x] 2.1 创建 `.claude/skills/api-migration/references/` 目录
- [x] 2.2 移动以下文件到 `references/`:
  - `api-定义示例.md`
  - `mock-规范.md`
  - `mock-实现指南.md`
  - `mock-响应格式.md`
  - `mock-重启流程.md`
  - `接口地址迁移.md`
  - `类型定义规范.md`
- [x] 2.3 更新 `SKILL.md` 中的文件引用路径

## 3. 重构 beautiful-component-design 技能

- [x] 3.1 创建 `.claude/skills/beautiful-component-design/references/` 目录
- [x] 3.2 移动以下文件到 `references/`:
  - `form-section-title.md`
  - `icon-usage.md`
  - `responsive-design.md`
  - `text-alignment.md`
  - `skill.json`
- [x] 3.3 更新 `SKILL.md` 中的文件引用路径

## 4. 重构 code-migration 技能

- [x] 4.1 创建 `.claude/skills/code-migration/references/` 目录
- [x] 4.2 移动以下文件到 `references/`:
  - `TypeScript类型规范.md`
  - `Vue2到Vue3写法对比.md`
  - `工具函数迁移.md`
  - `静态资源导入.md`
  - `生命周期迁移.md`
  - `数据字典常量规范.md`
  - `状态管理迁移.md`
  - `组合式函数规范.md`
- [x] 4.3 更新 `SKILL.md` 中的文件引用路径

## 5. 重构 component-migration 技能

- [x] 5.1 创建 `.claude/skills/component-migration/references/` 目录
- [x] 5.2 移动以下文件到 `references/`:
  - `EXECUTION-CHECKLIST.md`
  - `Icon图标迁移.md`
  - `wd-picker使用规范.md`
  - `全局反馈组件.md`
- [x] 5.3 更新 `SKILL.md` 中的文件引用路径

## 6. 重构 backend-nitro-drizzle 技能

- [x] 6.1 移动以下编号文件到已有的 `references/` 目录:
  - `01-nitro-setup.md`
  - `02-env-config.md`
  - `03-neon-drizzle.md`
  - `04-drizzle-operations.md`
  - `05-nitro-routes.md`
  - `06-integration.md`
  - `07-deployment.md`
- [x] 6.2 更新 `SKILL.md` 中的文件引用路径

## 7. 清理空目录

- [x] 7.1 删除空目录 `.claude/skills/use-wot-design-uni/`

## 8. 验证与测试

- [x] 8.1 验证所有技能的 SKILL.md 文件引用路径正确
- [x] 8.2 确认每个技能目录结构符合规范：
  ```plain
  skill-name/
  ├── SKILL.md          # Required
  └── references/       # Optional - 参考文档
  ```
- [x] 8.3 确认 `.claude/skills/check-trigger.md` 无需更新（根级别文件，AI 会通过 SKILL.md 获取正确的子文档路径）
- [x] 8.4 运行技能触发测试，确保技能仍可正常被识别和加载

## 9. 更新文档

- [ ] 9.1 更新 `CLAUDE.md` 中技能路径的描述（如有涉及）
- [x] 9.2 生成重构完成报告
