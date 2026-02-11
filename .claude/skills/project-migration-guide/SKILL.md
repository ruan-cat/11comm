---
name: project-migration-guide
description: 项目范围迁移的策略和协议，特别关注数据库 schema 和类型系统的影子迁移（Shadow Migration）策略。
license: MIT
---

# 项目迁移指南 (Project Migration Guide)

本技能记录项目内大规模架构迁移的策略。

## 核心策略：影子迁移 (Shadow Migration)

项目对关键基础设施变更（如数据库 Schema 位置）采用 **影子迁移（Shadow Migration）** 策略。

- **原则**: 添加新实现 > 验证 > 切换 > 删除旧实现。
- **目标**: 最小化破坏并确保可逆性。
- **参考**: [Shadow Migration 策略](references/shadow-migration.md)

## 迁移检查清单 (Migration Checklist)

执行迁移时：

1.  [ ] 在旧实现旁边创建新实现。
2.  [ ] 验证新实现在隔离环境中工作正常。
3.  [ ] 切换配置以指向新实现。
4.  [ ] 验证系统稳定性（Drift Checks, Type Checks）。
5.  [ ] 删除旧实现。
