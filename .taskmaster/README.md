# taskmaster-ai 列表页改造项目

**项目**: 01s-11comm 智慧社区后台管理系统
**目标**: 使用 taskmaster-ai MCP 系统化改造所有列表页
**任务总数**: 109 个
**开始日期**: 2025-11-09

---

## 📊 项目总览

### 项目统计
| 项目 | 数量 | 状态 |
|------|------|------|
| 总页面数 | 129 | 分析完成 |
| 需要改造 | 79 | 待开始 |
| 已符合标准 | 50+ | 已完成 |
| 任务文件 | 109 | 待执行 |

### 目录结构
```
.taskmaster/
├── README.md                          # 项目说明（本文件）
├── LIST.md                           # 详细任务清单
├── HOW-TO-USE.md                     # 使用指南
├── pages-directory-structure.md      # 目录结构分析
└── config.json                       # 项目配置

apps/admin/src/pages/                 # 目标改造目录
├── dev-team/                         # 开发团队模块（11个）
├── operation-team/                   # 运营团队模块（2个）
├── property-manage/                  # 物业管理模块（59个）
└── setting-manage/                   # 设置管理模块（32个）
```

---

## 🎯 改造目标

### 每个列表页的标准结构
```
页面目录/
├── index.vue             # 列表页组件（重构）
├── test-data.ts          # 假数据（新建）
└── components/
    ├── form.ts          # 表单类型（新建）
    └── form.vue         # 表单组件（新建）
```

### 技术要求
- [ ] 使用 `<PureTableBar>` + `<PureTable>` 组件
- [ ] 使用 `<PlusSearch>` 搜索栏
- [ ] 实现 `loadTableData()` 假分页请求
- [ ] 15-35 条假数据
- [ ] 标准响应式变量（pagination, columns, plusSearchModel 等）
- [ ] 类型安全（无 TS 错误）
- [ ] 代码风格统一

---

## 📋 任务分解

### 优先级 1: 立即处理（45 个任务）
**模块**: dev-team, operation-team, setting-manage
**预计耗时**: 2-3 周
**任务编号**: TASK-001 到 TASK-027

### 优先级 2: 次周处理（59 个任务）
**模块**: property-manage
**预计耗时**: 3-4 周
**任务编号**: TASK-028 到 TASK-086

### 优先级 3: 特殊页面（13 个任务）
**模块**: 详情页和报表页
**预计耗时**: 1-2 周
**任务编号**: TASK-087 到 TASK-109

---

## 🚀 快速开始

### 第 1 步: 准备工作

1. **确认 MCP 已连接**
   ```bash
   claude mcp list
   # 应该能看到 taskmaster-ai
   ```

2. **阅读文档**
   - [使用指南](HOW-TO-USE.md) ← 从这里开始
   - 改造要求: `.claude/commands/make-std-list-page-and-formlike-dialog.md`
   - 列表页标准: `.claude/agents/make-list-page.md`

3. **查看第一个任务**
   ```bash
   code .taskmaster/LIST.md
   # 查看 TASK-001 详情
   ```

### 第 2 步: 开始第一个任务

告诉 Claude：

```
我要开始执行 TASK-001：改造 dev-team/cache-manage 页面
```

Claude 会自动：
1. 读取任务详情
2. 分析现有代码
3. 制定改造计划
4. 执行改造
5. 运行类型检查

### 第 3 步: 提交代码

改造完成后：

```bash
# 类型检查
pnpm -F @01s-11comm/admin typecheck

# 提交（在 Claude 帮助下）
git add .
git commit -m '描述'
git push origin dev
```

### 第 4 步: 标记完成

告诉 Claude 标记任务完成，然后继续下一个任务。

---

## 📖 完整文档列表

### 必读文档
1. **使用指南** (HOW-TO-USE.md)
   - taskmaster-ai 使用方法
   - 任务执行流程
   - 故障排除

2. **改造要求** (.claude/commands/make-std-list-page-and-formlike-dialog.md)
   - 详细改造步骤
   - 子代理使用说明
   - 注意事项

3. **代码风格** (.claude/agents/code-style.md)
   - 命名规范
   - 格式要求
   - 注释规范

### 参考文档
4. **列表页标准** (.claude/agents/make-list-page.md)
   - PureTable 使用
   - PlusSearch 配置
   - 响应式变量

5. **弹框组件** (.claude/agents/make-dialog.md)
   - addDialog 函数
   - 弹框配置

6. **表单组件** (.claude/agents/make-form-for-dialog.md)
   - 表单类型
   - 表单验证

7. **类型修复** (.claude/agents/fix-type-error.md)
   - 类型约束
   - 错误修复

---

## 🔧 开发环境配置

### 必需工具
- Node.js 18+
- pnpm 8+
- Claude Code CLI
- Git

### MCP 服务器
- taskmaster-ai (已安装)
- 可选: context7 (用于查文档)

### 推荐 IDE
- VS Code + Claude 插件
- Cursor
- 或者其他支持 MCP 的编辑器

---

## 💡 每日工作流程

### 早上 (9:00-9:30)
1. 打开 Claude Code
2. 查看今天计划: "今天计划完成 TASK-XXX 到 TASK-XXX"
3. 准备环境: `pnpm install`

### 上午 (9:30-12:00)
1. 执行 1-2 个任务
2. 每个任务后运行类型检查
3. 提交代码

### 下午 (14:00-18:00)
1. 执行 2-3 个任务
2. 测试功能
3. 提交代码

### 晚上 (可选)
1. 回顾当天进度
2. 更新文档
3. 准备第二天计划

**建议**: 每天完成 3-5 个任务，保持质量优先。

---

## 📊 进度追踪

### 如何追踪进度

方法 1: 使用 taskmaster-ai
```bash
# 查看任务状态
task-master task-status

# 生成进度报告
task-master generate-report
```

方法 2: 手动更新 LIST.md
- [x] 标记完成的任务
- 添加完成日期
- 记录遇到的问题

方法 3: 使用 Git
```bash
# 查看提交记录
git log --oneline --grep="TASK-"

# 统计完成任务
 git log --oneline | grep -c "TASK-"
```

### 进度指标

- **每周目标**: 21-28 个任务（每天 3-4 个）
- **月度目标**: 84-112 个任务
- **项目总时长**: 4-6 周

---

## 🎯 成功标准

单个任务完成标准:
- [x] `test-data.ts` 创建完成，包含 35 条数据
- [x] `components/form.ts` 创建完成，类型定义正确
- [x] `components/form.vue` 创建完成，表单功能正常
- [x] `index.vue` 重构完成，使用标准模板
- [x] 类型检查通过 (`pnpm typecheck`)
- [x] 功能测试通过（浏览器中验证）
- [x] 代码提交到 Git
- [ ] 文档更新（可选）

项目完成标准:
- [x] 所有 109 个任务标记完成
- [ ] 没有 TypeScript 错误
- [x] 代码风格统一
- [x] 功能测试通过
- [x] 文档完整
- [x] 代码审查通过

---

## ⚠️ 注意事项

### 编码注意事项
1. **不要修改标准页面**: 已存在 test-data.ts + components 的页面无需改动
2. **保持业务字段**: 不要更改原有的字段名（尤其是中文名）
3. **类型安全**: 每次改造后必须运行类型检查
4. **测试充分**: 在浏览器中测试所有功能

### Git 注意事项
1. **频繁提交**: 每个任务完成后立即提交
2. **清晰的提交消息**: 包含任务编号和简短描述
3. **推送到远程**: 每天结束前推送代码
4. **代码审查**: 提交前自我审查更改

### 性能注意事项
1. **假数据**: 每个 test-data.ts 生成 35 条数据即可
2. **分页**: 不需要真实 API，但要模拟分页逻辑
3. **优化**: 不需要额外优化，保持标准实现

---

## 🤝 协作指南

### 如果你有同事协作

1. **分工明确**: 每人负责不同模块
2. **避免冲突**: 不要同时修改同一页面
3. **代码审查**: 互相审查提交的代码
4. **共享进度**: 使用 Git 查看对方进度

### 如果只有你一人

1. **保持节奏**: 每天固定工作量
2. **记录问题**: 将遇到的问题写下来
3. **寻求帮助**: 使用 Claude Code 解决问题
4. **定期回顾**: 每周回顾和总结

---

## 📞 获取帮助

### 需要帮助时

**问题**: 改造过程中遇到困难

**解决方案**:
1. 查看 `.claude/` 目录下的相关文档
2. 查看参考文件（标准格式页面）
3. 问 Claude Code:
   ```
   我在改造 TASK-XXX 时遇到了问题：
   - 问题描述
   - 错误信息
   - 相关代码

   请帮助我解决
   ```

**问题**: 不确定是否符合标准

**解决方案**:
1. 对比标准格式页面的代码
2. 运行类型检查
3. 在浏览器中测试
4. 询问 Claude Code 审查代码

---

## 🎉 项目完成

当所有任务完成后：

1. **最终构建测试**: `pnpm build`
2. **生成本报告**: taskmaster-ai 自动生成
3. **更新文档**: README.md, LIST.md
4. **代码审查**: 整体代码审查
5. **提交所有更改**
6. **庆祝**: 🎊 你完成了一项重大改进！

---

## 📝 更新日志

### 2025-11-09
- 初始化 taskmaster-ai 项目结构
- 创建任务清单（109 个任务）
- 创建使用指南
- 创建目录结构分析
- 完成项目初始化

---

## 📚 相关链接

- 项目仓库: GitHub Desktop Store
- 目标目录: `apps/admin/src/pages/`
- 文档目录: `.claude/`
- 任务目录: `.taskmaster/`

---

**项目管理者**: Claude Code + taskmaster-ai MCP
**创建日期**: 2025-11-09
**预计完成**: 2025-12-15

**祝改造顺利！** 🚀
