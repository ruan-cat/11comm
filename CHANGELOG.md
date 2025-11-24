## [0.2.3](https://github.com/ruan-cat/11comm/compare/v0.2.2...v0.2.3) (2025-11-24)

## <small>0.2.2 (2025-11-24)</small>

- 🐎 ci(package.json)!: 更新 changelog 命令，换成常见的【conventional-changelog -p angular -i CHANGELOG.md -s】 ([f2bc9d7](https://github.com/ruan-cat/11comm/commit/f2bc9d7))
- 🐳 chore(root): 直接用 conventional-changelog 生成本地更新日志，效果很不好看，很难绷。 ([f0c07d3](https://github.com/ruan-cat/11comm/commit/f0c07d3))
- 🔧 config(config): 设置生成的更新日志，也同步提交。 ([febe552](https://github.com/ruan-cat/11comm/commit/febe552))

## <small>0.2.1 (2025-11-24)</small>

- ✨ feat(admin): 设置全局类型 PlusFormRules ，用来约束全局的类型。 ([7d74f2c](https://github.com/ruan-cat/11comm/commit/7d74f2c))
- 🌈 style(admin): 格式化。 ([82fe8e4](https://github.com/ruan-cat/11comm/commit/82fe8e4))
- 🌈 style(prompt,admin): 格式 ([9506cc5](https://github.com/ruan-cat/11comm/commit/9506cc5))
- 🎉 init(claude): 新建子代理【do-tasks】，实现直接使用 .taskmaster\tasks\tasks.json 记录的任务对象，来完成任务。 ([63a1296](https://github.com/ruan-cat/11comm/commit/63a1296))
- 🐎 ci(package.json,config)!: 增加 execute 配置，期望实现运行后在本地生成更新日志文件。 ([4e5f078](https://github.com/ruan-cat/11comm/commit/4e5f078))
- 🐞 fix(admin): 处理导入错误 ([a473757](https://github.com/ruan-cat/11comm/commit/a473757))
- 🐞 fix(admin): 处理明显的语法错误。 ([c36e579](https://github.com/ruan-cat/11comm/commit/c36e579))
- 🐞 fix(admin): 处理语法故障 ([b34155e](https://github.com/ruan-cat/11comm/commit/b34155e))
- 🐞 fix(tsc,router,prompt,admin)!: 修复类型故障。统一修复处理。 ([739f273](https://github.com/ruan-cat/11comm/commit/739f273))
- 🐳 chore: 标记完成任务 ([bcca849](https://github.com/ruan-cat/11comm/commit/bcca849))
- 🐳 chore: 改造 setting-manage/system-manage/initialize-cell 列表页. ([db0662d](https://github.com/ruan-cat/11comm/commit/db0662d))
- 🐳 chore: setting-manage/organize-manage/data-permission 列表页 ，不应该被更改。 ([c47c780](https://github.com/ruan-cat/11comm/commit/c47c780))
- 🐳 chore: setting-manage/system-manage/register-protocol 不予处理。 ([d381bc5](https://github.com/ruan-cat/11comm/commit/d381bc5))
- 🐳 chore: setting-manage/system-manage/system-config 不需要做更改，。 ([906bf5e](https://github.com/ruan-cat/11comm/commit/906bf5e))
- 🐳 chore(package.json): 准备增加 conventional-changelog 。实现手动生成本地更新日志。 ([7f5a6a1](https://github.com/ruan-cat/11comm/commit/7f5a6a1))
- 🐳 chore(prompt,admin): 设置任务【代码写法更换】 ([007f111](https://github.com/ruan-cat/11comm/commit/007f111))
- 📃 docs(admin): 补全文档，说明清楚 pure-admin 的文档。 ([85675ac](https://github.com/ruan-cat/11comm/commit/85675ac))
- 📃 docs(claude): 正在修改 Pure-Admin Icon 方案迁移子代理，尝试实现跨项目的复用。 ([6464402](https://github.com/ruan-cat/11comm/commit/6464402))
- 📃 docs(claude)!: 更改子代理要求，现在要求主动以子代理的形式来运行内容。 ([944c5c3](https://github.com/ruan-cat/11comm/commit/944c5c3))
- 📃 docs(claude)!: 更新文档报告路径，实现提示词文档与本项目代码高度解耦。 ([537bdfe](https://github.com/ruan-cat/11comm/commit/537bdfe))
- 📃 docs(claude)!: 类型错误修复方法论，重点说明避免使用不存在的 vue-macro 模块。 ([de4d1f8](https://github.com/ruan-cat/11comm/commit/de4d1f8))
- 📃 docs(claude)!: 类型错误修复方法论。 ([2f68ee6](https://github.com/ruan-cat/11comm/commit/2f68ee6))
- 📃 docs(claude)!: 生成命令式弹框表单子代理，细化表单校验规则 `plusFormRules` 的代码写法。 ([8097360](https://github.com/ruan-cat/11comm/commit/8097360))
- 📃 docs(claude)!: 拓展 【类型错误修复方法论】 的知识点。 ([667fbb4](https://github.com/ruan-cat/11comm/commit/667fbb4))
- 📃 docs(claude)!: 增加美观数据生成的参考文件和假数据生成要求，细化表单组件的美观性配置和验证规则。 ([45f245f](https://github.com/ruan-cat/11comm/commit/45f245f))
- 📃 docs(claude)!: 重设类型故障的处理方案。重新指定标准。 ([0596013](https://github.com/ruan-cat/11comm/commit/0596013))
- 📃 docs(prompt,admin,claude): 完成任务【生成 pure-admin 文档 icon 方案迁移子代理】 ([3577e50](https://github.com/ruan-cat/11comm/commit/3577e50))
- 📃 docs(root): 更新说明文档。 ([e246136](https://github.com/ruan-cat/11comm/commit/e246136))
- 📦 deps(package.json,admin): 升级依赖 ([d37b306](https://github.com/ruan-cat/11comm/commit/d37b306))
- 📦 deps(package.json): 安装 conventional-changelog 。 ([a91b3e4](https://github.com/ruan-cat/11comm/commit/a91b3e4))
- 🔪 delete(prompt,admin): 完成不规范的代码重构。 ([9763ced](https://github.com/ruan-cat/11comm/commit/9763ced))
- 🦄 refactor(admin): 改造 setting-manage/organize-manage/org-info 列表页。 ([4f1f639](https://github.com/ruan-cat/11comm/commit/4f1f639))
- 🦄 refactor(admin): 改造 setting-manage/organize-manage/scheduling-setting 列表页 ([1022cdb](https://github.com/ruan-cat/11comm/commit/1022cdb))
- 🦄 refactor(admin): 改造 setting-manage/system-manage/initialize-cell 列表页 ([cb7039a](https://github.com/ruan-cat/11comm/commit/cb7039a))
- 🦄 refactor(admin): 更新表单校验注释为“表单校验规则”，以提高代码可读性。 ([00982a3](https://github.com/ruan-cat/11comm/commit/00982a3))
- 🦄 refactor(admin): 将表单校验规则 `plusFormRules` 初始化为响应式引用，提升多个表单组件的灵活性和一致性。 ([71f0745](https://github.com/ruan-cat/11comm/commit/71f0745))
- 🦄 refactor(admin)!: 表单校验，不使用断言的方式，一律使用全局类型。 ([bc2266a](https://github.com/ruan-cat/11comm/commit/bc2266a))
- 🦄 refactor(admin)!: 改造 dev-team/config-manage/dictionary 列表页 ([6a0c172](https://github.com/ruan-cat/11comm/commit/6a0c172))
- 🦄 refactor(admin)!: 改造 dev-team/config-manage/item 列表页 ([b7150bc](https://github.com/ruan-cat/11comm/commit/b7150bc))
- 🦄 refactor(admin)!: 改造 setting-manage/organize-manage/role-permission 列表页 ([6b9cae4](https://github.com/ruan-cat/11comm/commit/6b9cae4))
- 🦄 refactor(admin)!: 改造 setting-manage/organize-manage/shift-setting 列表页 ([71a075a](https://github.com/ruan-cat/11comm/commit/71a075a))
- 🦄 refactor(admin)!: 改造 setting-manage/organize-manage/working-schedule 列表页。 ([e2b7c62](https://github.com/ruan-cat/11comm/commit/e2b7c62))
- 🦄 refactor(admin)!: 改造 setting-manage/system-manage/change-password 列表页 ([82bff4f](https://github.com/ruan-cat/11comm/commit/82bff4f))
- 🦄 refactor(admin)!: 改造 setting-manage/system-manage/community-configuration 列表页 |改造 dev-team/menu-m ([4130ef3](https://github.com/ruan-cat/11comm/commit/4130ef3))
- 🦄 refactor(admin)!: 更新 operation-team/system-manage/initialize-cell 和 community-configuration 列表页，集 ([3b39736](https://github.com/ruan-cat/11comm/commit/3b39736))
- 🦄 refactor(admin)!: 将表单校验规则初始化为响应式引用，提升表单处理的灵活性。 ([199efbb](https://github.com/ruan-cat/11comm/commit/199efbb))
- 🦄 refactor(admin)!: 完成 dev-team/config-manage/center 列表页的改造，集成命令式弹框组件，支持新增和编辑功能。 ([616e6d0](https://github.com/ruan-cat/11comm/commit/616e6d0))
- 🦄 refactor(admin)!: 完成 dev-team/menu-manage/group 和 item 列表页的改造，更新缓存管理相关表单及数据结构。 ([3fd9255](https://github.com/ruan-cat/11comm/commit/3fd9255))
- 🦄 refactor(admin)!: 完成 operation-team/system-manage/register-protocol 列表页的改造，集成命令式弹框组件，支持新增、编辑和查看功能 ([609548c](https://github.com/ruan-cat/11comm/commit/609548c))
- 🦄 refactor(admin)!: 完成 operation-team/system-manage/system-config 列表页的改造，集成命令式弹框组件，支持新增、编辑和查看功能。 ([938f5d8](https://github.com/ruan-cat/11comm/commit/938f5d8))

## v0.2.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.1.0...v0.2.0)

### ✨ 新增功能

- **prompt,admin:** ⚠️ 为 taskmaster-ai 初始化全部的任务。 ([5f44d2e](https://github.com/ruan-cat/11comm/commit/5f44d2e))

### 🎈 性能提升

- **config,root:** 复用配置项。 ([348a46b](https://github.com/ruan-cat/11comm/commit/348a46b))

### 📃 文档更新

- **prompt,admin:** 探究，搞清楚在 claude code 内没找到存在的 `taskmaster-ai` MCP 的故障。是包本身的故障。 ([d18e15a](https://github.com/ruan-cat/11comm/commit/d18e15a))

### 🐳 其他修改

- **prompt,admin:** 解决 taskmaster-ai 无法使用的问题。 ([dfd2161](https://github.com/ruan-cat/11comm/commit/dfd2161))
- **prompt,admin:** ⚠️ 解决 taskmaster-ai 无法使用的问题。 ([ea54957](https://github.com/ruan-cat/11comm/commit/ea54957))

### 🐎 持续集成

- **package.json:** 无法实现无 github 的推送，且不得不提供 push，否则 tag 标签无法自动推送。 ([e825388](https://github.com/ruan-cat/11comm/commit/e825388))
- **root:** 工作流不再生成日志。 ([5376f88](https://github.com/ruan-cat/11comm/commit/5376f88))

### 📦 依赖更新

- **package.json,admin:** 升级依赖 ([eeb4e7c](https://github.com/ruan-cat/11comm/commit/eeb4e7c))

### 🔧 更新配置

- **config,root:** 不让 changelogithub 生成日志文件 ([b2be642](https://github.com/ruan-cat/11comm/commit/b2be642))
- **root:** ⚠️ 更改 task-master-ai 的 MCP 为最初官网要求的配置。 ([ed599a8](https://github.com/ruan-cat/11comm/commit/ed599a8))
- **root:** ⚠️ 设置语言 ([d3858f3](https://github.com/ruan-cat/11comm/commit/d3858f3))
- ⚠️ 更新吗，MCP。很怀疑 claude code 的 MCP 写法无法正常工作。 ([4d08f31](https://github.com/ruan-cat/11comm/commit/4d08f31))

#### ⚠️ Breaking Changes

- **prompt,admin:** ⚠️ 为 taskmaster-ai 初始化全部的任务。 ([5f44d2e](https://github.com/ruan-cat/11comm/commit/5f44d2e))
- **prompt,admin:** ⚠️ 解决 taskmaster-ai 无法使用的问题。 ([ea54957](https://github.com/ruan-cat/11comm/commit/ea54957))
- **root:** ⚠️ 更改 task-master-ai 的 MCP 为最初官网要求的配置。 ([ed599a8](https://github.com/ruan-cat/11comm/commit/ed599a8))
- **root:** ⚠️ 设置语言 ([d3858f3](https://github.com/ruan-cat/11comm/commit/d3858f3))
- ⚠️ 更新吗，MCP。很怀疑 claude code 的 MCP 写法无法正常工作。 ([4d08f31](https://github.com/ruan-cat/11comm/commit/4d08f31))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.1.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.0.11...v0.1.0)

### 🐎 持续集成

- **package.json:** ⚠️ 不直接 push 提交了。避免误触，错误发包。 ([c8840cc](https://github.com/ruan-cat/11comm/commit/c8840cc))

#### ⚠️ Breaking Changes

- **package.json:** ⚠️ 不直接 push 提交了。避免误触，错误发包。 ([c8840cc](https://github.com/ruan-cat/11comm/commit/c8840cc))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.0.11

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.0.10...v0.0.11)

### 🐎 持续集成

- **package.json:** 本地运行升级版本和生成日志时，不会自动打开 github 页面。 ([5ba4fc8](https://github.com/ruan-cat/11comm/commit/5ba4fc8))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.0.10

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.0.9...v0.0.10)

### 🐞 修复缺陷

- **root:** 移除掉工作流的策略功能。 ([5962869](https://github.com/ruan-cat/11comm/commit/5962869))

### 🐳 其他修改

- **config,root:** 标记 changelogithub 不应该生成更新日志 ([7dc69b0](https://github.com/ruan-cat/11comm/commit/7dc69b0))

### 🐎 持续集成

- **root:** 制作基于输入值而驱动的策略性工作流，根据不同情况，使用不同的日志生成工具。 ([01748e7](https://github.com/ruan-cat/11comm/commit/01748e7))
- **package.json,root:** 设计基于 changelogen 的发版命令。 ([f8119a8](https://github.com/ruan-cat/11comm/commit/f8119a8))

### 📦 依赖更新

- **root,package.json,admin:** 升级依赖 ([d7d1579](https://github.com/ruan-cat/11comm/commit/d7d1579))

### 🔧 更新配置

- **config,root:** 日志生成配置，均不提供基于语义化提交生成版本号的配置。 ([95abe74](https://github.com/ruan-cat/11comm/commit/95abe74))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>
