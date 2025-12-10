## v0.5.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.4.0...v0.5.0)

### 🔧 更新配置

- **config:** ⚠️  更新配置，使用过滤语法筛选出需要的类型。 ([64ae5ba](https://github.com/ruan-cat/11comm/commit/64ae5ba))

#### ⚠️ Breaking Changes

- **config:** ⚠️  更新配置，使用过滤语法筛选出需要的类型。 ([64ae5ba](https://github.com/ruan-cat/11comm/commit/64ae5ba))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.4.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.3.0...v0.4.0)

### 🐞 修复缺陷

- **config:** ⚠️  处理配置故障，只要满足一个配置，就生成。 ([be55b23](https://github.com/ruan-cat/11comm/commit/be55b23))

### 🦄 代码重构

- **config,package.json:** ⚠️  按照 vercel-deploy-tool 的新版本要求，重构配置文件。 ([b676cf4](https://github.com/ruan-cat/11comm/commit/b676cf4))

### 📃 文档更新

- **claude:** ⚠️  增加规范，不允许使用函数的形式批量生成。 ([57972c6](https://github.com/ruan-cat/11comm/commit/57972c6))

### 🐳 其他修改

- **prompt,admin:** ⚠️  设计任务【根据 `.taskmaster\tasks\tasks.json` ，初始化 openspec 规格的任务】 ([7a2d2d2](https://github.com/ruan-cat/11comm/commit/7a2d2d2))

### 📦 依赖更新

- **package.json:** 根包安装工具包项目，便于复用配置。 ([715e425](https://github.com/ruan-cat/11comm/commit/715e425))

### 🔧 更新配置

- **config:** ⚠️  更新发版工具的版本号生成配置。 ([49c77a1](https://github.com/ruan-cat/11comm/commit/49c77a1))
- **config:** 调整生成标题的逻辑 ([bd6b8f0](https://github.com/ruan-cat/11comm/commit/bd6b8f0))

#### ⚠️ Breaking Changes

- **config:** ⚠️  处理配置故障，只要满足一个配置，就生成。 ([be55b23](https://github.com/ruan-cat/11comm/commit/be55b23))
- **config,package.json:** ⚠️  按照 vercel-deploy-tool 的新版本要求，重构配置文件。 ([b676cf4](https://github.com/ruan-cat/11comm/commit/b676cf4))
- **claude:** ⚠️  增加规范，不允许使用函数的形式批量生成。 ([57972c6](https://github.com/ruan-cat/11comm/commit/57972c6))
- **prompt,admin:** ⚠️  设计任务【根据 `.taskmaster\tasks\tasks.json` ，初始化 openspec 规格的任务】 ([7a2d2d2](https://github.com/ruan-cat/11comm/commit/7a2d2d2))
- **config:** ⚠️  更新发版工具的版本号生成配置。 ([49c77a1](https://github.com/ruan-cat/11comm/commit/49c77a1))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.3.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.2.3...v0.3.0)

### 🐞 修复缺陷

- **admin:** 补全缺少的 系统管理 路由控制页面。确保页面可以正常显示。 ([a0575ea](https://github.com/ruan-cat/11comm/commit/a0575ea))
- **admin:** 处理markdown渲染故障 ([3739785](https://github.com/ruan-cat/11comm/commit/3739785))
- **admin:** 修复 Nitro/Vite 构建问题，新增依赖 @vue/compiler-sfc 和 @vue/shared，调整路径别名配置以支持 SSR ([3f7ab45](https://github.com/ruan-cat/11comm/commit/3f7ab45))
- **package.json,admin:** ⚠️  处理nitro在github workflow运行时出现的故障。 ([7cefaad](https://github.com/ruan-cat/11comm/commit/7cefaad))
- **prompt,package.json,admin:** ⚠️  使用 overrides 覆盖依赖的方案，处理 Vite 7.2.7 的 createRequire 故障。 ([a96906d](https://github.com/ruan-cat/11comm/commit/a96906d))
- **package.json,admin:** ⚠️  锁定@ruan-cat/utils版本至4.16.0以解决Nitro构建失败问题。 ([2dc7d40](https://github.com/ruan-cat/11comm/commit/2dc7d40))
- 处理报告代码块语言错误。 ([917db41](https://github.com/ruan-cat/11comm/commit/917db41))
- 处理文档【2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误】的语法错误。 ([31477c3](https://github.com/ruan-cat/11comm/commit/31477c3))

### 🦄 代码重构

- **package.json,config:** ⚠️  更新命令。增加尾缀说明。 ([de71de7](https://github.com/ruan-cat/11comm/commit/de71de7))
- **admin:** ⚠️  改造 operation-team/data-manage/property-management-company 列表页 ([9b93c4e](https://github.com/ruan-cat/11comm/commit/9b93c4e))
- **admin:** ⚠️  改造 operation-team/merchant-manage/merchant-info 列表页。 ([75d0168](https://github.com/ruan-cat/11comm/commit/75d0168))
- **admin:** ⚠️  改造 operation-team/merchant-manage/merchant-admin 列表页 ([f5b9c9c](https://github.com/ruan-cat/11comm/commit/f5b9c9c))
- **admin:** ⚠️  已成功完成所有report-configuration模块的列表页改造任务 ([a0866da](https://github.com/ruan-cat/11comm/commit/a0866da))
- **admin:** ⚠️  改造 property-manage/community-manage/house-decoration 列表页 ([cd46e09](https://github.com/ruan-cat/11comm/commit/cd46e09))
- **admin:** ⚠️  改造 property-manage/community-manage/building-space-structure-diagram 列表页 ([8a2136d](https://github.com/ruan-cat/11comm/commit/8a2136d))
- **admin:** ⚠️  完成 property-manage/community-manage 列表页的改造，更新任务状态为已完成并添加完成时间 ([d2f33c8](https://github.com/ruan-cat/11comm/commit/d2f33c8))
- **admin:** ⚠️  改造 property-manage/community-manage/my 列表页 ([3eeb23c](https://github.com/ruan-cat/11comm/commit/3eeb23c))
- **admin:** ⚠️  改造 property-manage/community-manage/parking-space-structure-diagram 列表页 ([a0b869c](https://github.com/ruan-cat/11comm/commit/a0b869c))
- **admin:** ⚠️  完成 property-manage/contract-manage 模块的改造，更新任务状态为已完成并添加完成时间，新增合同变更和到期处理表单组件 ([6e92627](https://github.com/ruan-cat/11comm/commit/6e92627))
- **admin:** ⚠️  改造 property-manage/contract-manage/expire 列表页 ([1037c4b](https://github.com/ruan-cat/11comm/commit/1037c4b))
- **admin:** ⚠️  改造 property-manage/contract-manage/first-party 列表页 ([941129f](https://github.com/ruan-cat/11comm/commit/941129f))
- **admin:** ⚠️  改造 property-manage/contract-manage/type 列表页 ([ad82dc8](https://github.com/ruan-cat/11comm/commit/ad82dc8))
- **admin:** ⚠️  完成 property-manage/expense-manage 模块的改造，更新多个列表页的任务状态为已完成并添加完成时间，优化表单组件的字段属性和校验规则 ([53cd736](https://github.com/ruan-cat/11comm/commit/53cd736))
- **admin:** ⚠️  改造 property-manage/expense-manage/water-and-electricity-meter-reading 列表页 ([fea3408](https://github.com/ruan-cat/11comm/commit/fea3408))
- **admin:** ⚠️  改造 property-manage/expense-manage/vehicle-charge 列表页 ([4f96be8](https://github.com/ruan-cat/11comm/commit/4f96be8))
- **admin:** ⚠️  改造 property-manage/expense-manage/reminder-for-overdue-payments 列表页 ([3823364](https://github.com/ruan-cat/11comm/commit/3823364))
- **admin:** ⚠️  改造 property-manage/expense-manage/reprint-voucher 列表页 ([42d927f](https://github.com/ruan-cat/11comm/commit/42d927f))
- **admin:** 改造 property-manage/expense-manage/overdue-payment-information 列表页 ([7c56858](https://github.com/ruan-cat/11comm/commit/7c56858))
- **admin:** ⚠️  改造 property-manage/expense-manage/payment-review 列表页 ([ee6f6b0](https://github.com/ruan-cat/11comm/commit/ee6f6b0))
- **admin:** ⚠️  改造 property-manage/expense-manage/refund-review 列表页 ([cc289d7](https://github.com/ruan-cat/11comm/commit/cc289d7))
- **admin:** ⚠️  改造 property-manage/expense-manage/house-charge 列表页 ([d740484](https://github.com/ruan-cat/11comm/commit/d740484))
- **admin:** 更换 初始化单元格 的icon。 ([f15e246](https://github.com/ruan-cat/11comm/commit/f15e246))
- **admin:** ⚠️  改造 property-manage/expense-manage/house-charge 列表页 ([ab3a629](https://github.com/ruan-cat/11comm/commit/ab3a629))
- **admin:** ⚠️  改造 property-manage/expense-manage/meter-reading-type 列表页 ([738f1bb](https://github.com/ruan-cat/11comm/commit/738f1bb))
- **admin:** ⚠️  改造 property-manage/expense-manage/discount-type 列表页 ([daf55ed](https://github.com/ruan-cat/11comm/commit/daf55ed))
- **admin:** ⚠️  改造 property-manage/expense-manage/expense-summary-table 列表页 ([b9e4936](https://github.com/ruan-cat/11comm/commit/b9e4936))
- **admin:** ⚠️  改造 property-manage/expense-manage/discount-apply 列表页 ([d9cae33](https://github.com/ruan-cat/11comm/commit/d9cae33))
- **admin:** ⚠️  改造 property-manage/expense-manage/discount-setting 列表页 ([2641773](https://github.com/ruan-cat/11comm/commit/2641773))
- **admin:** ⚠️  改造 property-manage/expense-manage/contracte-charge 列表页 ([2c7e7bc](https://github.com/ruan-cat/11comm/commit/2c7e7bc))
- **admin:** ⚠️  改造 property-manage/expense-manage/cancel-fee 列表页 ([2b5e0a1](https://github.com/ruan-cat/11comm/commit/2b5e0a1))
- ⚠️  直接用claude code的文件，覆盖掉gemini的全局记忆文件。 ([0c7aaa6](https://github.com/ruan-cat/11comm/commit/0c7aaa6))
- **admin:** ⚠️  改造 property-manage/expense-manage/cancel-fee 列表页 ([dc96218](https://github.com/ruan-cat/11comm/commit/dc96218))
- **admin:** ⚠️  更新 property-manage/house-property-manage/house 列表页，修改状态为完成并优化表单逻辑 ([caaf337](https://github.com/ruan-cat/11comm/commit/caaf337))
- **admin:** ⚠️  更新 property-manage/house-property-manage/invoice 列表页，修改状态为完成并优化表单和查询逻辑 ([a4ba32f](https://github.com/ruan-cat/11comm/commit/a4ba32f))
- **admin:** Simplify component rendering and improve code consistency across ReAuth, ReCountTo, ReCropper, RePerms, RePureTableBar, ReQrcode, ReSegmented, ReSelector, ReSplitPane, ReTypeit, and ReVxeTableBar components. ([94d4f90](https://github.com/ruan-cat/11comm/commit/94d4f90))
- **admin:** Enhance captcha functionality in system-captcha-example.vue and streamline parameter handling in redirect.vue; update data imports and remove fixed property in various dev-team pages. ([318bddc](https://github.com/ruan-cat/11comm/commit/318bddc))
- **admin:** Update validation messages in community-manage form and adjust component imports in owner-member form; enhance table properties in outstanding fees analysis and owner payment details pages. ([fd33288](https://github.com/ruan-cat/11comm/commit/fd33288))
- **admin:** Add TypeScript checks to various components, update validation message handling in community-manage form, and enhance router push syntax for better type safety. ([33c29f1](https://github.com/ruan-cat/11comm/commit/33c29f1))
- **admin:** Add a comprehensive guide for handling TypeScript type errors in third-party components, including strategies for JSX and router type mismatches. ([5d2c02c](https://github.com/ruan-cat/11comm/commit/5d2c02c))
- **admin:** 改造 property-manage/house-property-manage/invoice-title 列表页 ([478fc2b](https://github.com/ruan-cat/11comm/commit/478fc2b))
- **admin:** 改造 property-manage/house-property-manage/owner-account 列表页 ([59ad137](https://github.com/ruan-cat/11comm/commit/59ad137))
- **admin:** 改造 property-manage/house-property-manage/owner-information 列表页 ([8b97aaf](https://github.com/ruan-cat/11comm/commit/8b97aaf))
- **admin:** 改造 property-manage/house-property-manage/owner-member 列表页 ([a590b3b](https://github.com/ruan-cat/11comm/commit/a590b3b))
- **admin:** 完成 property-manage/house-property-manage/owners-committee 列表页的改造，更新表单校验规则并优化组件导入 ([e49f7de](https://github.com/ruan-cat/11comm/commit/e49f7de))
- **admin:** 完成 property-manage/house-property-manage/reserve-venue 列表页的改造，更新表单校验规则并优化组件逻辑 ([16f7875](https://github.com/ruan-cat/11comm/commit/16f7875))
- **admin:** 完成 property-manage/house-property-manage/reserve-venue-order 列表页的改造，更新表单字段类型和校验规则，优化组件逻辑 ([5647929](https://github.com/ruan-cat/11comm/commit/5647929))
- **admin:** 完成 property-manage/house-property-manage/site-management 列表页的改造，更新表单字段状态和校验规则，优化组件逻辑 ([f73c500](https://github.com/ruan-cat/11comm/commit/f73c500))
- **admin:** 完成 property-manage/parking-manage/carport-apply 列表页的改造，更新表单字段状态和校验规则，优化组件逻辑 ([31a0497](https://github.com/ruan-cat/11comm/commit/31a0497))
- **admin:** 完成 property-manage/parking-manage/carport-info 列表页的改造，更新表单字段状态和校验规则，优化组件逻辑 ([8ee1fa2](https://github.com/ruan-cat/11comm/commit/8ee1fa2))
- **admin:** 完成 property-manage/parking-manage/owner-vehicle 列表页的改造，更新状态为完成，优化表单字段和校验规则 ([e44b9c0](https://github.com/ruan-cat/11comm/commit/e44b9c0))
- **admin:** 完成 property-manage/parking-manage/parking-lot 列表页的改造，更新状态为完成，优化表单字段和校验规则 ([70acf5e](https://github.com/ruan-cat/11comm/commit/70acf5e))
- **admin:** 完成 property-manage/patrol-manage/detail 和 item 列表页的改造，更新状态为完成，优化表单字段和校验规则 ([378e5e0](https://github.com/ruan-cat/11comm/commit/378e5e0))
- **admin:** 完成 property-manage/patrol-manage/path 列表页的改造，更新状态为完成，优化表单逻辑和组件交互 ([59df0ac](https://github.com/ruan-cat/11comm/commit/59df0ac))
- **admin:** 完成 property-manage/patrol-manage/plan 列表页的改造，更新状态为完成，优化表单逻辑和组件交互 ([e95681f](https://github.com/ruan-cat/11comm/commit/e95681f))
- **admin:** 完成 property-manage/patrol-manage/point 列表页的改造，更新状态为完成，优化表单逻辑和组件交互 ([57591b3](https://github.com/ruan-cat/11comm/commit/57591b3))
- **admin:** 完成 property-manage/patrol-manage/task 列表页的改造，更新状态为完成，优化表单逻辑和组件交互 ([2dd1fb1](https://github.com/ruan-cat/11comm/commit/2dd1fb1))
- **admin:** 完成 property-manage/repairs-manage/issues 列表页的改造，更新状态为完成，优化表单逻辑和组件交互 ([d2fac0d](https://github.com/ruan-cat/11comm/commit/d2fac0d))
- **admin:** 完成 property-manage/repairs-manage/mandatory-return-issue 列表页的改造，更新状态为完成，优化表单逻辑和组件交互 ([f3e31f4](https://github.com/ruan-cat/11comm/commit/f3e31f4))
- **admin:** 完成 property-manage/repairs-manage/phone-report-repairs 列表页的改造，更新状态为完成，优化表单字段和校验规则，调整数据加载逻辑 ([dff38e7](https://github.com/ruan-cat/11comm/commit/dff38e7))
- **admin:** 完成 property-manage/repairs-manage/repairs-have-done 列表页的改造，更新状态为完成，优化表单逻辑和数据加载，新增表单组件和测试数据 ([f59e6cf](https://github.com/ruan-cat/11comm/commit/f59e6cf))
- **admin:** 完成 property-manage/repairs-manage/repairs-setting 列表页的改造，更新状态为完成，优化表单逻辑，新增测试数据和表单字段选项 ([fd41438](https://github.com/ruan-cat/11comm/commit/fd41438))
- **admin:** 完成 property-manage/repairs-manage/repairs-todo 列表页的改造，更新状态为完成，优化表单逻辑，新增表单组件和测试数据 ([4ae2b6a](https://github.com/ruan-cat/11comm/commit/4ae2b6a))
- **admin:** 完成 property-manage/repairs-manage/return-visit 列表页的改造，新增表单组件和测试数据，优化数据加载和表单逻辑 ([b03d555](https://github.com/ruan-cat/11comm/commit/b03d555))
- **admin:** 完成 property-manage/report-manage/arrears-details-list 列表页的改造，更新状态为完成，优化表单逻辑，新增表单组件和测试数据 ([19d20cc](https://github.com/ruan-cat/11comm/commit/19d20cc))
- **admin:** 完成 property-manage/report-manage/data-statistics 列表页的改造，更新状态为完成，优化表单逻辑，新增测试数据和搜索功能 ([3ee33ea](https://github.com/ruan-cat/11comm/commit/3ee33ea))
- **admin:** 完成 property-manage/report-manage/deposit-report 列表页的改造，更新状态为完成，优化表单逻辑，新增测试数据和搜索功能 ([9e6b66c](https://github.com/ruan-cat/11comm/commit/9e6b66c))
- **admin:** 完成 property-manage/report-manage/expense-summary-table 列表页的改造，更新状态为完成，优化表单逻辑，新增测试数据和搜索功能 ([c268813](https://github.com/ruan-cat/11comm/commit/c268813))
- **admin:** 完成 property-manage/report-manage/fee-reminder 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([e867341](https://github.com/ruan-cat/11comm/commit/e867341))
- **admin:** 完成 property-manage/report-manage/no-charge-house 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([330444d](https://github.com/ruan-cat/11comm/commit/330444d))
- **admin:** 完成 property-manage/report-manage/outstanding-fees-analysis 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([b8bbac5](https://github.com/ruan-cat/11comm/commit/b8bbac5))
- **admin:** 完成 property-manage/report-manage/owner-payment-details 列表页的改造，更新状态为完成，优化表单逻辑，新增测试数据和搜索功能 ([72e15f4](https://github.com/ruan-cat/11comm/commit/72e15f4))
- **admin:** 完成 property-manage/report-manage/patrol-report 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([1cf9194](https://github.com/ruan-cat/11comm/commit/1cf9194))
- **admin:** 完成 property-manage/report-manage/payment-details-form 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([6783edb](https://github.com/ruan-cat/11comm/commit/6783edb))
- **admin:** 完成 property-manage/report-manage/repair-report-form 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([af6a4e7](https://github.com/ruan-cat/11comm/commit/af6a4e7))
- **admin:** 完成 property-manage/report-manage/repair-reports-summary-table 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([0041d41](https://github.com/ruan-cat/11comm/commit/0041d41))
- **admin:** 完成 property-manage/report-manage/statement-expenses 列表页的改造，更新状态为完成，优化表单逻辑，新增表格数据和搜索功能 ([419a2b4](https://github.com/ruan-cat/11comm/commit/419a2b4))
- ⚠️  标记列表页迁移的任务都完成了。准备新建全新的任务。 ([bc8cee3](https://github.com/ruan-cat/11comm/commit/bc8cee3))
- 移动文件 ([f416dda](https://github.com/ruan-cat/11comm/commit/f416dda))
- **prompt,admin:** 专门移动重构【处理 nitro 插件在 github workflow 出现的故障】的提示词。 ([f5fca11](https://github.com/ruan-cat/11comm/commit/f5fca11))
- **config,package.json,admin,claude:** ⚠️  更新prettier配置，并且全量格式化一次； ([ab5da32](https://github.com/ruan-cat/11comm/commit/ab5da32))

### 📃 文档更新

- **claude:** 专门声明清楚项目不要生成 不要生成 `*.ts.backup` 文件 。 ([429fbdf](https://github.com/ruan-cat/11comm/commit/429fbdf))
- **claude:** ⚠️  常见的 i18n 文本。纠正AI生成key。 ([7ccb7dd](https://github.com/ruan-cat/11comm/commit/7ccb7dd))
- **claude:** ⚠️  重点说明不允许项目执行多个任务，避免出现质量过低的情况。 ([ad23358](https://github.com/ruan-cat/11comm/commit/ad23358))
- **claude:** ⚠️  获取技术栈对应的上下文 ([6652e0d](https://github.com/ruan-cat/11comm/commit/6652e0d))
- **claude:** ⚠️  更新执行任务子代理的行为。 ([ab950b5](https://github.com/ruan-cat/11comm/commit/ab950b5))
- **claude:** 增加 nitro 作为记忆。 ([4fa1479](https://github.com/ruan-cat/11comm/commit/4fa1479))
- 2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误 ([d71bacd](https://github.com/ruan-cat/11comm/commit/d71bacd))
- ⚠️  对报告的一级标题做约束说明。 ([c81b85a](https://github.com/ruan-cat/11comm/commit/c81b85a))
- ⚠️  增加报告日志信息的代码块语言的约束要求。 ([6ddb253](https://github.com/ruan-cat/11comm/commit/6ddb253))
- **admin,root:** 补充关于cloudflare worker构建的部署文档细则。 ([05a793d](https://github.com/ruan-cat/11comm/commit/05a793d))
- **claude:** 更新运行一次性连续执行多个任务 ([63c256e](https://github.com/ruan-cat/11comm/commit/63c256e))
- ⚠️  设置 openspec 的项目规范。 ([a708b5c](https://github.com/ruan-cat/11comm/commit/a708b5c))

### 🐳 其他修改

- 标记待办任务。暂时没办法修复bug。 ([8f6470c](https://github.com/ruan-cat/11comm/commit/8f6470c))
- **config:** ⚠️  换回更加稳定的 changelog:conventional-changelog 。 ([f9ae81b](https://github.com/ruan-cat/11comm/commit/f9ae81b))
- **admin:** 存储报告 ([5affa9f](https://github.com/ruan-cat/11comm/commit/5affa9f))
- **admin:** 测试 plus-pro-components gitmcp 能否正常使用。 ([f362723](https://github.com/ruan-cat/11comm/commit/f362723))
- **claude:** 已经完成全部定义在任务文件的任务了。 ([eae6539](https://github.com/ruan-cat/11comm/commit/eae6539))
- **prompt,admin:** 设计任务【处理 `nitro/vite` 插件导致的故障】 ([c2d04c5](https://github.com/ruan-cat/11comm/commit/c2d04c5))
- **config,admin:** 删除掉已经完成的待办任务。 ([9ce8b55](https://github.com/ruan-cat/11comm/commit/9ce8b55))
- **prompt,admin:** 设计任务 【设计数据结构重构的任务清单，设定一揽子长效运行的数据格式更改任务】 ([2519cb3](https://github.com/ruan-cat/11comm/commit/2519cb3))
- **prompt,admin:** 记录任务【处理故障】 ([d18fa14](https://github.com/ruan-cat/11comm/commit/d18fa14))
- **prompt,admin:** 完成【设计数据结构重构的任务清单，设定一揽子长效运行的数据格式更改任务】 ([ef11cae](https://github.com/ruan-cat/11comm/commit/ef11cae))
- **prompt,admin:** 回答问题 ([93b1a11](https://github.com/ruan-cat/11comm/commit/93b1a11))
- **prompt,admin:** 升级依赖。 ([bb7bbab](https://github.com/ruan-cat/11comm/commit/bb7bbab))
- **prompt,admin:** 设计任务【消除 peer warning】 ([3f109f4](https://github.com/ruan-cat/11comm/commit/3f109f4))
- **.gitignore:** 更新忽略文件，替换.vercel为.wrangler以适应新的部署配置。 ([03c33df](https://github.com/ruan-cat/11comm/commit/03c33df))
- **package.json,pnpm-workspace,admin,01s-origin:** Update package versions and pnpm to 10.25.0, including various dependency upgrades for improved compatibility and performance. ([42447aa](https://github.com/ruan-cat/11comm/commit/42447aa))
- 修复 cz 无法运行并交互的错误 ([1a51141](https://github.com/ruan-cat/11comm/commit/1a51141))
- 设计任务【尝试不使用 overrides 配置】 ([b7cb446](https://github.com/ruan-cat/11comm/commit/b7cb446))
- 要求AI检查 overrides 依赖。 ([7474349](https://github.com/ruan-cat/11comm/commit/7474349))
- 编写【尝试不使用 overrides 配置】任务，稍后继续跟进该故障。 ([edd7a61](https://github.com/ruan-cat/11comm/commit/edd7a61))
- 设计任务【修复文档在构建报告时出现的语法错误故障】 ([6f527f9](https://github.com/ruan-cat/11comm/commit/6f527f9))
- 标记【修复文档在构建报告时出现的语法错误故障】已完成 ([d3663cf](https://github.com/ruan-cat/11comm/commit/d3663cf))
- 标记【尝试不使用 overrides 配置】的工作进度 ([afe0ed0](https://github.com/ruan-cat/11comm/commit/afe0ed0))
- **prompt,admin:** 完成任务【尝试不使用 overrides 配置】 ([a9cd736](https://github.com/ruan-cat/11comm/commit/a9cd736))
- **claude:** 标记子代理继续开始工作。 ([6c6b650](https://github.com/ruan-cat/11comm/commit/6c6b650))
- **admin:** 完成一小部分的代码格式化转换。 ([ac62844](https://github.com/ruan-cat/11comm/commit/ac62844))

### 🧪 测试相关

- **root:** 格式化。但是没有发现 conventional-changelog 生成出任何有效的更新内容。很奇怪。 ([f8d1d0a](https://github.com/ruan-cat/11comm/commit/f8d1d0a))

### 🌈 代码格式

- **package.json,admin:** 增加换行。 ([bd3078d](https://github.com/ruan-cat/11comm/commit/bd3078d))
- **config:** 格式化 ([e16ccf4](https://github.com/ruan-cat/11comm/commit/e16ccf4))

### 🐎 持续集成

- **package.json:** ⚠️  拓展可以删除的内容。 rimraf -g '**/{dist,.turbo,.vercel,.output,.cache,.temp}' ([80a4cfe](https://github.com/ruan-cat/11comm/commit/80a4cfe))
- **package.json,admin:** ⚠️  提供专用的运行命令，在github内运行，且携带指定的环境变量。 ([ffd6272](https://github.com/ruan-cat/11comm/commit/ffd6272))
- **package.json,admin:** ⚠️  更新运行命令，在github workflow运行nitro预设 github 。 ([5340e94](https://github.com/ruan-cat/11comm/commit/5340e94))
- **package.json,prompt,admin:** ⚠️  更新cloudflare部署时，专门使用nitro的cloudflare worker环境变量。 ([8fea669](https://github.com/ruan-cat/11comm/commit/8fea669))

### 📦 依赖更新

- **package.json:** 安装依赖 commit-and-tag-version 。pnpm i -w -D commit-and-tag-version ([9cd7a96](https://github.com/ruan-cat/11comm/commit/9cd7a96))
- **package.json,admin:** Pnpm -F=@01s-11comm/admin i -P nitro ([d605ed8](https://github.com/ruan-cat/11comm/commit/d605ed8))
- **package.json,admin:** 升级依赖 ([c31fa49](https://github.com/ruan-cat/11comm/commit/c31fa49))
- **package.json,admin:** ⚠️  按照AI要求，安装一些列对等依赖。 ([a913afe](https://github.com/ruan-cat/11comm/commit/a913afe))
- 升级依赖 ([6552e00](https://github.com/ruan-cat/11comm/commit/6552e00))
- **package.json:** ⚠️  不需要通过降低版本的方式，解决nitro构建故障。 ([fbaf178](https://github.com/ruan-cat/11comm/commit/fbaf178))

### 🎉 初始化项目

- 初始化 .versionrc.js 配置。尝试用 commit-and-tag-version 来完成本地更新日志的生成。 ([31293f2](https://github.com/ruan-cat/11comm/commit/31293f2))
- **claude:** 初始化 openspec 的提示词文件。 ([df6d1f9](https://github.com/ruan-cat/11comm/commit/df6d1f9))

### 🔧 更新配置

- **package.json,config:** 预备 commit-and-tag-version 的生成命令。 ([569708b](https://github.com/ruan-cat/11comm/commit/569708b))
- **config:** ⚠️  Bumpp 开始使用 commit-and-tag-version 实现后继钩子任务。 ([abe7ddd](https://github.com/ruan-cat/11comm/commit/abe7ddd))
- ⚠️  关闭掉 commit-and-tag-version 的一部分默认行为。 ([9953565](https://github.com/ruan-cat/11comm/commit/9953565))
- **config,admin:** ⚠️  模仿 create-nitro-app 新建的项目，初始化 nitro vite 插件配置。 ([88bcd97](https://github.com/ruan-cat/11comm/commit/88bcd97))
- **config,admin:** 排除掉 nitro 插件。 ([84cc05d](https://github.com/ruan-cat/11comm/commit/84cc05d))
- 新增配置 gitmcp__plus-pro-components__plus-pro-components 。 ([348cf8e](https://github.com/ruan-cat/11comm/commit/348cf8e))
- **admin,root:** 添加 .output 到忽略列表。 ([1662155](https://github.com/ruan-cat/11comm/commit/1662155))
- **prompt,config,admin:** ⚠️  配置 nitro 部署到 cloudflare worker 内 ([2c41183](https://github.com/ruan-cat/11comm/commit/2c41183))
- **nitro:** 添加 Cloudflare Worker 名称配置以支持部署 ([89cbfad](https://github.com/ruan-cat/11comm/commit/89cbfad))
- **config,admin:** ⚠️  不指定写死的nitro构建预设。 ([3e408f7](https://github.com/ruan-cat/11comm/commit/3e408f7))

### 🔪 删除垃圾

- 删除掉冗余的文件，避免误导 ([3282f83](https://github.com/ruan-cat/11comm/commit/3282f83))

#### ⚠️ Breaking Changes

- **package.json,admin:** ⚠️  处理nitro在github workflow运行时出现的故障。 ([7cefaad](https://github.com/ruan-cat/11comm/commit/7cefaad))
- **prompt,package.json,admin:** ⚠️  使用 overrides 覆盖依赖的方案，处理 Vite 7.2.7 的 createRequire 故障。 ([a96906d](https://github.com/ruan-cat/11comm/commit/a96906d))
- **package.json,admin:** ⚠️  锁定@ruan-cat/utils版本至4.16.0以解决Nitro构建失败问题。 ([2dc7d40](https://github.com/ruan-cat/11comm/commit/2dc7d40))
- **package.json,config:** ⚠️  更新命令。增加尾缀说明。 ([de71de7](https://github.com/ruan-cat/11comm/commit/de71de7))
- **admin:** ⚠️  改造 operation-team/data-manage/property-management-company 列表页 ([9b93c4e](https://github.com/ruan-cat/11comm/commit/9b93c4e))
- **admin:** ⚠️  改造 operation-team/merchant-manage/merchant-info 列表页。 ([75d0168](https://github.com/ruan-cat/11comm/commit/75d0168))
- **admin:** ⚠️  改造 operation-team/merchant-manage/merchant-admin 列表页 ([f5b9c9c](https://github.com/ruan-cat/11comm/commit/f5b9c9c))
- **admin:** ⚠️  已成功完成所有report-configuration模块的列表页改造任务 ([a0866da](https://github.com/ruan-cat/11comm/commit/a0866da))
- **admin:** ⚠️  改造 property-manage/community-manage/house-decoration 列表页 ([cd46e09](https://github.com/ruan-cat/11comm/commit/cd46e09))
- **admin:** ⚠️  改造 property-manage/community-manage/building-space-structure-diagram 列表页 ([8a2136d](https://github.com/ruan-cat/11comm/commit/8a2136d))
- **admin:** ⚠️  完成 property-manage/community-manage 列表页的改造，更新任务状态为已完成并添加完成时间 ([d2f33c8](https://github.com/ruan-cat/11comm/commit/d2f33c8))
- **admin:** ⚠️  改造 property-manage/community-manage/my 列表页 ([3eeb23c](https://github.com/ruan-cat/11comm/commit/3eeb23c))
- **admin:** ⚠️  改造 property-manage/community-manage/parking-space-structure-diagram 列表页 ([a0b869c](https://github.com/ruan-cat/11comm/commit/a0b869c))
- **admin:** ⚠️  完成 property-manage/contract-manage 模块的改造，更新任务状态为已完成并添加完成时间，新增合同变更和到期处理表单组件 ([6e92627](https://github.com/ruan-cat/11comm/commit/6e92627))
- **admin:** ⚠️  改造 property-manage/contract-manage/expire 列表页 ([1037c4b](https://github.com/ruan-cat/11comm/commit/1037c4b))
- **admin:** ⚠️  改造 property-manage/contract-manage/first-party 列表页 ([941129f](https://github.com/ruan-cat/11comm/commit/941129f))
- **admin:** ⚠️  改造 property-manage/contract-manage/type 列表页 ([ad82dc8](https://github.com/ruan-cat/11comm/commit/ad82dc8))
- **admin:** ⚠️  完成 property-manage/expense-manage 模块的改造，更新多个列表页的任务状态为已完成并添加完成时间，优化表单组件的字段属性和校验规则 ([53cd736](https://github.com/ruan-cat/11comm/commit/53cd736))
- **admin:** ⚠️  改造 property-manage/expense-manage/water-and-electricity-meter-reading 列表页 ([fea3408](https://github.com/ruan-cat/11comm/commit/fea3408))
- **admin:** ⚠️  改造 property-manage/expense-manage/vehicle-charge 列表页 ([4f96be8](https://github.com/ruan-cat/11comm/commit/4f96be8))
- **admin:** ⚠️  改造 property-manage/expense-manage/reminder-for-overdue-payments 列表页 ([3823364](https://github.com/ruan-cat/11comm/commit/3823364))
- **admin:** ⚠️  改造 property-manage/expense-manage/reprint-voucher 列表页 ([42d927f](https://github.com/ruan-cat/11comm/commit/42d927f))
- **admin:** ⚠️  改造 property-manage/expense-manage/payment-review 列表页 ([ee6f6b0](https://github.com/ruan-cat/11comm/commit/ee6f6b0))
- **admin:** ⚠️  改造 property-manage/expense-manage/refund-review 列表页 ([cc289d7](https://github.com/ruan-cat/11comm/commit/cc289d7))
- **admin:** ⚠️  改造 property-manage/expense-manage/house-charge 列表页 ([d740484](https://github.com/ruan-cat/11comm/commit/d740484))
- **admin:** ⚠️  改造 property-manage/expense-manage/house-charge 列表页 ([ab3a629](https://github.com/ruan-cat/11comm/commit/ab3a629))
- **admin:** ⚠️  改造 property-manage/expense-manage/meter-reading-type 列表页 ([738f1bb](https://github.com/ruan-cat/11comm/commit/738f1bb))
- **admin:** ⚠️  改造 property-manage/expense-manage/discount-type 列表页 ([daf55ed](https://github.com/ruan-cat/11comm/commit/daf55ed))
- **admin:** ⚠️  改造 property-manage/expense-manage/expense-summary-table 列表页 ([b9e4936](https://github.com/ruan-cat/11comm/commit/b9e4936))
- **admin:** ⚠️  改造 property-manage/expense-manage/discount-apply 列表页 ([d9cae33](https://github.com/ruan-cat/11comm/commit/d9cae33))
- **admin:** ⚠️  改造 property-manage/expense-manage/discount-setting 列表页 ([2641773](https://github.com/ruan-cat/11comm/commit/2641773))
- **admin:** ⚠️  改造 property-manage/expense-manage/contracte-charge 列表页 ([2c7e7bc](https://github.com/ruan-cat/11comm/commit/2c7e7bc))
- **admin:** ⚠️  改造 property-manage/expense-manage/cancel-fee 列表页 ([2b5e0a1](https://github.com/ruan-cat/11comm/commit/2b5e0a1))
- ⚠️  直接用claude code的文件，覆盖掉gemini的全局记忆文件。 ([0c7aaa6](https://github.com/ruan-cat/11comm/commit/0c7aaa6))
- **admin:** ⚠️  改造 property-manage/expense-manage/cancel-fee 列表页 ([dc96218](https://github.com/ruan-cat/11comm/commit/dc96218))
- **admin:** ⚠️  更新 property-manage/house-property-manage/house 列表页，修改状态为完成并优化表单逻辑 ([caaf337](https://github.com/ruan-cat/11comm/commit/caaf337))
- **admin:** ⚠️  更新 property-manage/house-property-manage/invoice 列表页，修改状态为完成并优化表单和查询逻辑 ([a4ba32f](https://github.com/ruan-cat/11comm/commit/a4ba32f))
- ⚠️  标记列表页迁移的任务都完成了。准备新建全新的任务。 ([bc8cee3](https://github.com/ruan-cat/11comm/commit/bc8cee3))
- **config,package.json,admin,claude:** ⚠️  更新prettier配置，并且全量格式化一次； ([ab5da32](https://github.com/ruan-cat/11comm/commit/ab5da32))
- **claude:** ⚠️  常见的 i18n 文本。纠正AI生成key。 ([7ccb7dd](https://github.com/ruan-cat/11comm/commit/7ccb7dd))
- **claude:** ⚠️  重点说明不允许项目执行多个任务，避免出现质量过低的情况。 ([ad23358](https://github.com/ruan-cat/11comm/commit/ad23358))
- **claude:** ⚠️  获取技术栈对应的上下文 ([6652e0d](https://github.com/ruan-cat/11comm/commit/6652e0d))
- **claude:** ⚠️  更新执行任务子代理的行为。 ([ab950b5](https://github.com/ruan-cat/11comm/commit/ab950b5))
- ⚠️  对报告的一级标题做约束说明。 ([c81b85a](https://github.com/ruan-cat/11comm/commit/c81b85a))
- ⚠️  增加报告日志信息的代码块语言的约束要求。 ([6ddb253](https://github.com/ruan-cat/11comm/commit/6ddb253))
- ⚠️  设置 openspec 的项目规范。 ([a708b5c](https://github.com/ruan-cat/11comm/commit/a708b5c))
- **config:** ⚠️  换回更加稳定的 changelog:conventional-changelog 。 ([f9ae81b](https://github.com/ruan-cat/11comm/commit/f9ae81b))
- **package.json:** ⚠️  拓展可以删除的内容。 rimraf -g '**/{dist,.turbo,.vercel,.output,.cache,.temp}' ([80a4cfe](https://github.com/ruan-cat/11comm/commit/80a4cfe))
- **package.json,admin:** ⚠️  提供专用的运行命令，在github内运行，且携带指定的环境变量。 ([ffd6272](https://github.com/ruan-cat/11comm/commit/ffd6272))
- **package.json,admin:** ⚠️  更新运行命令，在github workflow运行nitro预设 github 。 ([5340e94](https://github.com/ruan-cat/11comm/commit/5340e94))
- **package.json,prompt,admin:** ⚠️  更新cloudflare部署时，专门使用nitro的cloudflare worker环境变量。 ([8fea669](https://github.com/ruan-cat/11comm/commit/8fea669))
- **package.json,admin:** ⚠️  按照AI要求，安装一些列对等依赖。 ([a913afe](https://github.com/ruan-cat/11comm/commit/a913afe))
- **package.json:** ⚠️  不需要通过降低版本的方式，解决nitro构建故障。 ([fbaf178](https://github.com/ruan-cat/11comm/commit/fbaf178))
- **config:** ⚠️  Bumpp 开始使用 commit-and-tag-version 实现后继钩子任务。 ([abe7ddd](https://github.com/ruan-cat/11comm/commit/abe7ddd))
- ⚠️  关闭掉 commit-and-tag-version 的一部分默认行为。 ([9953565](https://github.com/ruan-cat/11comm/commit/9953565))
- **config,admin:** ⚠️  模仿 create-nitro-app 新建的项目，初始化 nitro vite 插件配置。 ([88bcd97](https://github.com/ruan-cat/11comm/commit/88bcd97))
- **prompt,config,admin:** ⚠️  配置 nitro 部署到 cloudflare worker 内 ([2c41183](https://github.com/ruan-cat/11comm/commit/2c41183))
- **config,admin:** ⚠️  不指定写死的nitro构建预设。 ([3e408f7](https://github.com/ruan-cat/11comm/commit/3e408f7))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

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
