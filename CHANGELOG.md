## v0.6.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.5.0...v0.6.0)

### ✨ 新增功能

- **type:** 拓展返回值类型字段。timestamp success ([fd8f3736](https://github.com/ruan-cat/11comm/commit/fd8f3736))
- **admin:** 开启筛选功能。 ([05daa74c](https://github.com/ruan-cat/11comm/commit/05daa74c))
- **type,admin:** 导出固定常量。请求页码页数。 ([61ac09cf](https://github.com/ruan-cat/11comm/commit/61ac09cf))
- **admin:** 补充恢复 index.html 入口文件 ([6af1c104](https://github.com/ruan-cat/11comm/commit/6af1c104))
- **router,admin:** 补全排班表的查询字段，可以正常完成赛讯 ([26d248b8](https://github.com/ruan-cat/11comm/commit/26d248b8))
- 新建任务生成脚本。 ([972e5c94](https://github.com/ruan-cat/11comm/commit/972e5c94))
- **openspec,admin:** 单独封装专用的搜索查询工具函数，并更新规范文档的使用代码。 ([668618da](https://github.com/ruan-cat/11comm/commit/668618da))
- **admin:** 实现 配置中心 的分页查询 ([24809d76](https://github.com/ruan-cat/11comm/commit/24809d76))
- **admin:** 将列表页组件常用的响应式配置，一并整合到分页请求的 hooks 内。 ([31e56f3f](https://github.com/ruan-cat/11comm/commit/31e56f3f))
- **openspec:** ⚠️ 新建 fix-api-hooks-missing-initial-params 任务。 ([86e80b48](https://github.com/ruan-cat/11comm/commit/86e80b48))
- **openspec:** 完成 【将全部后台项目的 form.ts 文件做迁移重构】全部任务，迁移归档 openspec 全部规范文件。 ([32657933](https://github.com/ruan-cat/11comm/commit/32657933))

### 🔥 Performance

- **openspec:** 优化代码实现模板，实现更加智能化的代码写法。 ([0744e982](https://github.com/ruan-cat/11comm/commit/0744e982))

### 🐞 修复缺陷

- **admin:** ⚠️ 修复类型故障； ([16e30cf9](https://github.com/ruan-cat/11comm/commit/16e30cf9))
- **openspec:** ⚠️ 更改文档的识别内容。 ([1e70c89e](https://github.com/ruan-cat/11comm/commit/1e70c89e))
- **openspec,prompt,admin:** ⚠️ 更新 `migrate-static-data-to-nitro-query` 的 openspec 规范;确保文件满足规范 ([8e6336a2](https://github.com/ruan-cat/11comm/commit/8e6336a2))
- **openspec:** 处理文档 markdown 语法渲染错误 ([e9c1ad8c](https://github.com/ruan-cat/11comm/commit/e9c1ad8c))
- **admin:** ⚠️ 处理类型故障。 ([4ec0d018](https://github.com/ruan-cat/11comm/commit/4ec0d018))
- **admin:** 处理类型故障 type CSSProperties ([ff31ee72](https://github.com/ruan-cat/11comm/commit/ff31ee72))
- **admin:** 登录接口补全 apifox 请求地址。 ([bac93a0e](https://github.com/ruan-cat/11comm/commit/bac93a0e))
- **config,admin:** ⚠️ 修复接口无法返回数据的错误。 ([a18193c0](https://github.com/ruan-cat/11comm/commit/a18193c0))
- **router,admin:** 修复类型故障，按照严格的类型标准来检查并处理类型故障。 ([d2df8820](https://github.com/ruan-cat/11comm/commit/d2df8820))
- **admin:** 处理配置中心接口的类型故障 ([924311a5](https://github.com/ruan-cat/11comm/commit/924311a5))
- **type:** 删除重复的类型定义； ([6da28e36](https://github.com/ruan-cat/11comm/commit/6da28e36))
- **type:** 导入缺失的类型并删除重复定义 ([23c90ca8](https://github.com/ruan-cat/11comm/commit/23c90ca8))
- **type,admin:** ⚠️ 为大多数的 form.ts 补全类型；修复 type 项目内的类型，改写成纯粹的英文写法。 ([0d5413de](https://github.com/ruan-cat/11comm/commit/0d5413de))
- **admin:** 持续修复类型故障。 ([305085e8](https://github.com/ruan-cat/11comm/commit/305085e8))
- **admin:** 持续修复类型故障； ([a5f226ec](https://github.com/ruan-cat/11comm/commit/a5f226ec))
- **type,admin:** 持续处理类型报错。 ([ef475b31](https://github.com/ruan-cat/11comm/commit/ef475b31))
- **config,admin:** 尝试解决服务端接口导入错误的故障。 ([e4c3f5dd](https://github.com/ruan-cat/11comm/commit/e4c3f5dd))
- **admin:** ⚠️ 暂时注释掉筛选逻辑代码，筛选逻辑代码事实上触发了严重的读取客户端模块的 bug。 ([a26c6dbe](https://github.com/ruan-cat/11comm/commit/a26c6dbe))
- **type:** 修复类型故障。 ([4ad59531](https://github.com/ruan-cat/11comm/commit/4ad59531))
- **admin:** 处理客户端代码错误导入的路径 ([a90ba44e](https://github.com/ruan-cat/11comm/commit/a90ba44e))
- **router,admin:** 从正确的位置导入 createMemoryHistory, ([0f98aedd](https://github.com/ruan-cat/11comm/commit/0f98aedd))
- **admin:** 更新产物的打包地址，不再是固定的 dist ([aece53ea](https://github.com/ruan-cat/11comm/commit/aece53ea))
- **admin:** 更新 viteBuildInfo 插件，避免使用写死的 dist 目录。 ([8f45d5f0](https://github.com/ruan-cat/11comm/commit/8f45d5f0))
- **admin:** 项目不使用 viteBuildInfo 插件。 ([d8f30327](https://github.com/ruan-cat/11comm/commit/d8f30327))
- **router,admin:** ⚠️ 彻底修复了自动路由模块混入服务端代码的错误。 ([e7c1ee46](https://github.com/ruan-cat/11comm/commit/e7c1ee46))
- **openspec:** 处理 openspec 出现的文本格式故障。 ([5d63dc3c](https://github.com/ruan-cat/11comm/commit/5d63dc3c))
- **admin:** 处理错误的 useDoBeforeClose 导入。 ([2ee69192](https://github.com/ruan-cat/11comm/commit/2ee69192))
- **admin:** 修复 filterDataByQuery 出现的类型故障。 ([fd09e0ea](https://github.com/ruan-cat/11comm/commit/fd09e0ea))
- **admin:** 处理 配置中心 列表页出现的错误名称，。 ([d326a3f4](https://github.com/ruan-cat/11comm/commit/d326a3f4))
- **admin:** 将不存在的 common.buttons.view 换成 common.buttons.info ([b416c4e6](https://github.com/ruan-cat/11comm/commit/b416c4e6))
- **type,admin:** 持续修复类型故障； ([fd635ca5](https://github.com/ruan-cat/11comm/commit/fd635ca5))
- **router,admin:** 删除旧的路由文件；补全假数据； ([97d91bd5](https://github.com/ruan-cat/11comm/commit/97d91bd5))
- **admin:** 大规模处理代码，处理了 93 份文件。 ([c4786897](https://github.com/ruan-cat/11comm/commit/c4786897))
- **admin:** 重构代码。持续处理类型故障 ([c349f7bb](https://github.com/ruan-cat/11comm/commit/c349f7bb))
- **admin:** 处理类型故障 ([2507ca46](https://github.com/ruan-cat/11comm/commit/2507ca46))
- **admin:** 持续从回购项目，修复类型报错 ([c42b9118](https://github.com/ruan-cat/11comm/commit/c42b9118))
- **type,prompt,server,admin:** ⚠️ 大规模修复类型故障，共计 92 份文件。 ([b2ca7397](https://github.com/ruan-cat/11comm/commit/b2ca7397))
- **admin:** 处理类型报错 ([509165b7](https://github.com/ruan-cat/11comm/commit/509165b7))
- **prompt,admin:** 错别字 ([c4ef9120](https://github.com/ruan-cat/11comm/commit/c4ef9120))
- **type,admin:** 手动删改，处理完全错误的修改。 ([8a6e99bd](https://github.com/ruan-cat/11comm/commit/8a6e99bd))
- **type:** 修复代码编写故障。 ([f34c5fcf](https://github.com/ruan-cat/11comm/commit/f34c5fcf))

### 🦄 代码重构

- 重构 merchant-info 的 test-data.ts，更新商户类型和经营状态选项为字面量数组，并调整相关导出 ([b3bf4d5a](https://github.com/ruan-cat/11comm/commit/b3bf4d5a))
- 更新 report-configuration 的 test-data.ts，调整字段名称为报表组，并重构相关接口和组件 ([3363a010](https://github.com/ruan-cat/11comm/commit/3363a010))
- ⚠️ 归档 refactor-test-data-literal-array 任务 ([f9e412a5](https://github.com/ruan-cat/11comm/commit/f9e412a5))
- 移动单元格类型和状态选项常量至 test-data.ts，避免重复定义 ([fd7ec787](https://github.com/ruan-cat/11comm/commit/fd7ec787))
- **admin:** 更新各模块的 test-data.ts，重构表格数据为具体示例，移除随机生成函数以提高可读性 ([2055ce6d](https://github.com/ruan-cat/11comm/commit/2055ce6d))
- **admin:** 更新各模块的 test-data.ts，重构表格数据为具体示例， 移除随机生成函数以提高可读性 ([43f2b830](https://github.com/ruan-cat/11comm/commit/43f2b830))
- **admin:** 持续完成数据格式更改的任务 ([3f530629](https://github.com/ruan-cat/11comm/commit/3f530629))
- **admin:** 持续完成数据格式更改的任务 ([24d2fd91](https://github.com/ruan-cat/11comm/commit/24d2fd91))
- **admin:** 重构各模块的 test-data.ts，更新为具体示例数据，移除随机生成逻辑以提升可读性 ([3ae4f332](https://github.com/ruan-cat/11comm/commit/3ae4f332))
- 标记任务完成 ([a2e7605c](https://github.com/ruan-cat/11comm/commit/a2e7605c))
- **prompt,admin:** ⚠️ 迁移出单独的一份【2025-12-12 将本地假数据改造，迁移成 nitro 接口】长期维护的提示词。 ([5c19f929](https://github.com/ruan-cat/11comm/commit/5c19f929))
- **openspec,type,package.json,config,admin:** ⚠️ 大规模的执行 migrate-static-data-to-nitro-query 任务，大范围的自动化重构与更改。 ([aa2895e4](https://github.com/ruan-cat/11comm/commit/aa2895e4))
- **openspec,type,admin:** ⚠️ 继续执行 migrate-static-data-to-nitro-query 任务，大批量生成代码。 ([9da8a295](https://github.com/ruan-cat/11comm/commit/9da8a295))
- **admin:** ⚠️ 处理路径导入地址。 ([049b4f50](https://github.com/ruan-cat/11comm/commit/049b4f50))
- **openspec,type,admin:** ⚠️ 持续完成 migrate-static-data-to-nitro-query 任务。 ([2ce73ac7](https://github.com/ruan-cat/11comm/commit/2ce73ac7))
- **openspec,admin:** ⚠️ 持续执行 migrate-static-data-to-nitro-query 任务。 ([e2a6bcb8](https://github.com/ruan-cat/11comm/commit/e2a6bcb8))
- **admin:** 临时将接口换成 get 请求，做本地测绘师 ([6ee87737](https://github.com/ruan-cat/11comm/commit/6ee87737))
- **admin:** 代码写法改写。增强类型约束。 ([6dd99ce6](https://github.com/ruan-cat/11comm/commit/6dd99ce6))
- **openspec,type,router,admin:** ⚠️ 执行 migrate-static-data-to-nitro-query 任务 ([057ed8c8](https://github.com/ruan-cat/11comm/commit/057ed8c8))
- **admin:** 执行 migrate-static-data-to-nitro-query 任务 ([5a71fd9e](https://github.com/ruan-cat/11comm/commit/5a71fd9e))
- **openspec,type,admin:** ⚠️ 执行大规模的执行 migrate-static-data-to-nitro-query 任务，修改新增将近 540 份文件；修改规范和设计文件。 ([b969f4d3](https://github.com/ruan-cat/11comm/commit/b969f4d3))
- **openspec,prompt,admin:** ### 05 增加新的严格任务执行规范，并重构任务列表 ([4640bd8c](https://github.com/ruan-cat/11comm/commit/4640bd8c))
- **type,admin:** ⚠️ 大多数 from 表单，更改引用的类型为英文类型； ([0b4860a5](https://github.com/ruan-cat/11comm/commit/0b4860a5))
- **type,admin:** ⚠️ 大规模的更改代码写法，处理类型错误。 ([496996ee](https://github.com/ruan-cat/11comm/commit/496996ee))
- **type,admin:** 持续处理类型报错。 ([8658e695](https://github.com/ruan-cat/11comm/commit/8658e695))
- **admin:** ⚠️ 创建 app 改成 createSSRApp，创建 SSR 专用 app。 ([e402d709](https://github.com/ruan-cat/11comm/commit/e402d709))
- **admin:** 恢复使用 createApp。因为开发环境出现明显的水和错误 ([89da5443](https://github.com/ruan-cat/11comm/commit/89da5443))
- **type:** 重构下拉选项类型，准备将部分下拉选择统一整合到一个文件内。 ([61ad993c](https://github.com/ruan-cat/11comm/commit/61ad993c))
- **openspec,type,admin:** ⚠️ 大规模执行 migrate-static-data-to-nitro-query 任务，修改了 119 份文件。 ([671d5841](https://github.com/ruan-cat/11comm/commit/671d5841))
- **type,admin:** ⚠️ 手动整理公共通用使用的业务类型。将合同类型统一整理。 ([2bc1e083](https://github.com/ruan-cat/11comm/commit/2bc1e083))
- **type:** 类型项目内，统一清退，不使用中文命名的拜年了。 ([e6a4dad2](https://github.com/ruan-cat/11comm/commit/e6a4dad2))
- **type,admin:** 重构代码，避免代码出现中文变量名。 ([d98609c8](https://github.com/ruan-cat/11comm/commit/d98609c8))
- **type,admin:** ⚠️ 大批量更新代码，更改替换掉很多中文变量名写法。修改 95 份文件。 ([a17c56a9](https://github.com/ruan-cat/11comm/commit/a17c56a9))
- **type,admin:** 持续修改代码，避免项目使用中文变量名。 ([4f2a4e71](https://github.com/ruan-cat/11comm/commit/4f2a4e71))
- **type,admin:** ⚠️ 替换中文变量名； ([70cb0a59](https://github.com/ruan-cat/11comm/commit/70cb0a59))
- **type,admin:** ⚠️ 使用 GLM 大批量的做代码结构调整，导入纯英文的下拉选择工具。修改 28 份文件。 ([22bfbe19](https://github.com/ruan-cat/11comm/commit/22bfbe19))
- **type,admin:** 持续完成 migrate-static-data-to-nitro-query 任务 ([8133e3a3](https://github.com/ruan-cat/11comm/commit/8133e3a3))
- **vite,config,router,prompt,package.json,admin:** ⚠️ 重大重构。手动的模仿 nitro 的案例写法，将项目的入口改造成正统的 SSR 项目写法，并让多款 vite 插件开启 SSR 适配。现在项目本地可以正常 dev 运行。 ([9430d2b1](https://github.com/ruan-cat/11comm/commit/9430d2b1))
- **type,admin:** 持续完成 migrate-static-data-to-nitro-query 任务。 ([eb915e92](https://github.com/ruan-cat/11comm/commit/eb915e92))
- **openspec,type,admin:** 成功完成了 migrate-static-data-to-nitro-query 任务的优先部分工作 ([d107a480](https://github.com/ruan-cat/11comm/commit/d107a480))
- **type,admin:** 持续完成 migrate-static-data-to-nitro-query 任务。 ([626d0164](https://github.com/ruan-cat/11comm/commit/626d0164))
- **openspec,admin:** 持续完成【migrate-static-data-to-nitro-query】 ([f7a08055](https://github.com/ruan-cat/11comm/commit/f7a08055))
- **type,admin:** 持续的做改造，和类型修复。 ([d908b291](https://github.com/ruan-cat/11comm/commit/d908b291))
- **admin:** 接口不使用本地数据 ([1391612a](https://github.com/ruan-cat/11comm/commit/1391612a))
- **admin:** 放弃全局自动导入 api 的接口模块。 ([377fe460](https://github.com/ruan-cat/11comm/commit/377fe460))
- **router,admin:** ⚠️ 完全从全新的 pure-admin 内获取到代码写法，重新的简单接入代码写法。现在接口能够正常使用。 ([743eaab9](https://github.com/ruan-cat/11comm/commit/743eaab9))
- **admin:** 从其他测试性质的子项目内，更新迭代后的代码列表查询 hooks 工具。 ([1c8d694a](https://github.com/ruan-cat/11comm/commit/1c8d694a))
- **openspec:** 清空任务清单，准备重做 ([d8e860c0](https://github.com/ruan-cat/11comm/commit/d8e860c0))
- **openspec,type,admin:** 持续完成 migrate-static-data-to-nitro-query 任务 ([bfc5fa2d](https://github.com/ruan-cat/11comm/commit/bfc5fa2d))
- **prompt,admin:** 单独将【常用的，高强度服用的类型修复提示词】功能迁移到任务清单内 ([6ddd0008](https://github.com/ruan-cat/11comm/commit/6ddd0008))
- **openspec,tsc,config,admin:** 更新 filterDataByQuery 函数在服务端内的路径写法，并设置了 server 路径别名。 ([4dada130](https://github.com/ruan-cat/11comm/commit/4dada130))
- **admin:** 将数据分页请求函数迁移到 hooks 内 ([82c586d2](https://github.com/ruan-cat/11comm/commit/82c586d2))
- **prompt,admin:** 移动迁移 nitro 接口的提示词 ([56f8e0e4](https://github.com/ruan-cat/11comm/commit/56f8e0e4))
- **openspec,admin:** ⚠️ 完全重写，手写 data-fetching 数据获取规范。 ([d8ae86a4](https://github.com/ruan-cat/11comm/commit/d8ae86a4))
- **openspec:** ⚠️ 手动重写，重构 list-page-pattern 列表页编写模式的代码写法和代码案例。 ([af5167ba](https://github.com/ruan-cat/11comm/commit/af5167ba))
- **prompt,admin:** ⚠️ 重构任务【重构 `migrate-static-data-to-nitro-query` 任务的规范执行步骤和代码参考案例】 ([95b838f9](https://github.com/ruan-cat/11comm/commit/95b838f9))
- **openspec,claude:** ⚠️ 重构重写一次全部的 migrate-static-data-to-nitro-query 任务规范文件。用 Anthropic 模型完成。 ([9b122a4b](https://github.com/ruan-cat/11comm/commit/9b122a4b))
- **openspec,type,admin:** 持续完成 migrate-static-data-to-nitro-query 任务 ([ff573a69](https://github.com/ruan-cat/11comm/commit/ff573a69))
- **admin:** 持续重构列表页 ([bf0959e7](https://github.com/ruan-cat/11comm/commit/bf0959e7))
- **admin:** ⚠️ 大批量处理 api hooks 的代码写法，统一补全了接口参数，并使用了接口参数。 ([32f3ad27](https://github.com/ruan-cat/11comm/commit/32f3ad27))
- **openspec:** ⚠️ 完成任务【增加严格规范以便处理重复类型声明的故障】，增加严格的执行规范，处理类型故障 ([67d91944](https://github.com/ruan-cat/11comm/commit/67d91944))
- **openspec,admin:** 继续完成类型修复和代码写法改写的任务。 ([cf9383d3](https://github.com/ruan-cat/11comm/commit/cf9383d3))
- **admin:** 批量重构代码。处理代码写法问题。 ([33a8d576](https://github.com/ruan-cat/11comm/commit/33a8d576))
- **admin:** 持续完成 openspec 重构任务 ([7cada55a](https://github.com/ruan-cat/11comm/commit/7cada55a))
- **openspec,admin:** 持续完成代码重构任务 ([8d3c7a68](https://github.com/ruan-cat/11comm/commit/8d3c7a68))
- **admin:** ⚠️ 代码写法批量重构，避免写冗余的类型约束。 ([f62e4417](https://github.com/ruan-cat/11comm/commit/f62e4417))
- **type,server,admin:** 持续完成代码重构任务 ([07dc8403](https://github.com/ruan-cat/11comm/commit/07dc8403))
- **server,admin:** 持续完成重构任务 ([0d5ba70e](https://github.com/ruan-cat/11comm/commit/0d5ba70e))
- **claude:** 将不再使用的子代理，迁移到其他地方去。避免 AI 误用这些子代理。 ([d80fcab8](https://github.com/ruan-cat/11comm/commit/d80fcab8))
- **server,admin:** 持续更改优化代码写法 ([b3da62b1](https://github.com/ruan-cat/11comm/commit/b3da62b1))
- **admin:** 持续完成代码结构更新 ([3076c01c](https://github.com/ruan-cat/11comm/commit/3076c01c))
- **openspec,admin:** 持续完成任务 ([d2307de0](https://github.com/ruan-cat/11comm/commit/d2307de0))
- **openspec:** 重新生成一次任务规范 ([43b3de9b](https://github.com/ruan-cat/11comm/commit/43b3de9b))
- **openspec,type,admin:** ⚠️ 完成 form.ts 的代码重构。将业务类型统一拆分迁移。 ([deeb3ff5](https://github.com/ruan-cat/11comm/commit/deeb3ff5))
- **type,server,admin:** 执行任务，高强度的新建大量的代码，修改大量的代码。 ([9296e299](https://github.com/ruan-cat/11comm/commit/9296e299))
- **prompt,admin:** 重构提示词，提高优先级。 ([82c9b065](https://github.com/ruan-cat/11comm/commit/82c9b065))
- **type,server,admin:** 大批量的改代码，处理类型错误 ([2cf4b06f](https://github.com/ruan-cat/11comm/commit/2cf4b06f))
- **openspec,type,server,admin:** 持续完成代码重构任务 ([4aa4da30](https://github.com/ruan-cat/11comm/commit/4aa4da30))
- **prompt,admin:** 将【更新迭代 `migrate-static-data-to-nitro-query` 的 `list-page-pattern` 列表页改造规范，避免出现删改多余内容的情况】任务迁移到专门的文件内 ([77740e71](https://github.com/ruan-cat/11comm/commit/77740e71))
- **admin:** 持续完成代码重构任务 ([8bd5735d](https://github.com/ruan-cat/11comm/commit/8bd5735d))
- **server,admin:** 持续完成代码改造任务 ([c1b944ea](https://github.com/ruan-cat/11comm/commit/c1b944ea))
- **type:** 持续完成代码改写任务 ([4d4a7a2d](https://github.com/ruan-cat/11comm/commit/4d4a7a2d))
- **admin:** 持续完成代码重构任务 ([341e2726](https://github.com/ruan-cat/11comm/commit/341e2726))

### 📖 Documentation

- **claude:** 更新 openspec 的 yaml 格式；格式化文件； ([59ffc64a](https://github.com/ruan-cat/11comm/commit/59ffc64a))
- **prompt,admin:** 逐步编写规范。 ([f5456b11](https://github.com/ruan-cat/11comm/commit/f5456b11))
- **prompt,admin:** 编写【确定 openspec 精细化任务工作范围的方案】 ([d8966afb](https://github.com/ruan-cat/11comm/commit/d8966afb))
- **admin:** ⚠️ 新增报告： 2025-12-12 静态假数据迁移至 Nitro + TanStack Query 实施计划 ([0b2ef15d](https://github.com/ruan-cat/11comm/commit/0b2ef15d))
- **prompt,admin:** 故意触发部署，尝试 <!-- 触发部署 SKIP_DEPENDENCY_INSTALL = 1 --> 。 ([dd0b114d](https://github.com/ruan-cat/11comm/commit/dd0b114d))
- **admin:** ⚠️ 更新【Nitro 接口模板】 ([0fc3c356](https://github.com/ruan-cat/11comm/commit/0fc3c356))
- **openspec:** 完成【增加完成 nitro 接口生成后需要及时删除掉旧 `test-data.ts` 的行为规范】 ([466f8113](https://github.com/ruan-cat/11comm/commit/466f8113))
- **openspec:** ⚠️ 增加 nitro 编写接口的代码规范和代码写法检查任务 ([9c09c17e](https://github.com/ruan-cat/11comm/commit/9c09c17e))
- **admin:** 说明依赖的工具包为最新版本 ([2ac368a9](https://github.com/ruan-cat/11comm/commit/2ac368a9))
- **openspec,admin:** ⚠️ 更新类型导入，确保从 `@01s-11comm/type` 导入 `JsonVO` 和 `PageDTO`，移除对 `@ruan-cat/utils` 的依赖 ([9eee1c1c](https://github.com/ruan-cat/11comm/commit/9eee1c1c))
- **admin:** 更新技术文档，标记 vueuse 为已废弃，添加 nitro 和 @tanstack/vue-query 的相关信息 ([912a940d](https://github.com/ruan-cat/11comm/commit/912a940d))
- **openspec,claude:** ⚠️ 为新增的 `@01s-11comm/type` 包，更新 AI 指导文件 ([6d2a8375](https://github.com/ruan-cat/11comm/commit/6d2a8375))
- **claude:** 增加全局用于说明 ([b73762a0](https://github.com/ruan-cat/11comm/commit/b73762a0))
- **prompt,admin:** 记录【修复 nitro 接口的故障】提示词。尚未修复。 ([379b1b8e](https://github.com/ruan-cat/11comm/commit/379b1b8e))
- **claude:** 准备要求 claude code 阅读技术文档； ([1cc49789](https://github.com/ruan-cat/11comm/commit/1cc49789))
- **prompt,admin:** 设计【手动整理公共通用使用的业务类型，并设计新的公共下拉选择数组的新规范】任务 ([f0d2b922](https://github.com/ruan-cat/11comm/commit/f0d2b922))
- **openspec:** 新增规范 公共业务下拉选择数组集中管理 。 ([25729af1](https://github.com/ruan-cat/11comm/commit/25729af1))
- **openspec:** ⚠️ 更新 公共业务下拉选择数组集中管理 使用错误的中文写法。 ([33a0e126](https://github.com/ruan-cat/11comm/commit/33a0e126))
- **claude:** 类型错误修复方法论，补充增加对类型项目的说明和使用 ([fbb5daab](https://github.com/ruan-cat/11comm/commit/fbb5daab))
- **claude:** 补充术语； ([d176ec49](https://github.com/ruan-cat/11comm/commit/d176ec49))
- **prompt,admin:** 记录事故经验。 ([59c21499](https://github.com/ruan-cat/11comm/commit/59c21499))
- **claude:** ⚠️ 证据严格的编码规范。禁止编写脚本完成批处理任务。 ([05b553fb](https://github.com/ruan-cat/11comm/commit/05b553fb))
- **prompt,admin:** 补全设计完整的【2025-12-14 处理 vite 项目在接入集成 nitro 插件时出现的 SSR 服务端渲染适配问题，并适当的重构 vite admin 管理后台项目】nitro 整改 reuse。 ([78dc2d4b](https://github.com/ruan-cat/11comm/commit/78dc2d4b))
- **openspec:** 更新迭代标准。 ([7150ec84](https://github.com/ruan-cat/11comm/commit/7150ec84))
- **openspec:** 统一更新 openspec 规范文档，说明清楚执行步骤。 ([e72ee5cc](https://github.com/ruan-cat/11comm/commit/e72ee5cc))
- **claude:** 增加【openspec 使用规范】 ([c5fdbc69](https://github.com/ruan-cat/11comm/commit/c5fdbc69))
- **openspec,admin:** 规范文档增加的严格的代码写法规范。 ([e1c92aa1](https://github.com/ruan-cat/11comm/commit/e1c92aa1))
- **openspec:** 删改 nitro-api 规范冗余的写法。 ([ff16cc52](https://github.com/ruan-cat/11comm/commit/ff16cc52))
- **claude:** 增加【找不到正确的 `PlusFormRules` 类型】的类型处理办法。 ([fc5079b0](https://github.com/ruan-cat/11comm/commit/fc5079b0))
- **openspec:** 完成【批量的针对性改写现存的 index.vue 列表页代码写法】任务，新建独立的规范文件。 ([c45959f3](https://github.com/ruan-cat/11comm/commit/c45959f3))
- **openspec,prompt,admin:** 完成【批量的针对性修复现存的 api hooks 接口请求代码写法】任务，并且归档任务。 ([fdc9188b](https://github.com/ruan-cat/11comm/commit/fdc9188b))
- **prompt,admin:** 增加【请你主动的开启多个独立并行的修改子代理，加快修改任务。】要求 ([3bc2a516](https://github.com/ruan-cat/11comm/commit/3bc2a516))
- **admin:** 删除多个无意义的报告；新增迁移报告； ([679cd738](https://github.com/ruan-cat/11comm/commit/679cd738))
- **prompt,admin:** 新增长期运行使用的【2025-12-19 将全部后台项目的 form.ts 文件做迁移重构】任务 ([1dea8bc4](https://github.com/ruan-cat/11comm/commit/1dea8bc4))
- **openspec,prompt,admin:** 更新规范，避免 AI 迁移额外的内容 ([c2d8504d](https://github.com/ruan-cat/11comm/commit/c2d8504d))
- **prompt,admin:** 细化执行任务的细节。 ([a793ef33](https://github.com/ruan-cat/11comm/commit/a793ef33))
- **prompt,admin:** 增加要求【常用的，高强度服用的类型修复提示词】 ([af265eb0](https://github.com/ruan-cat/11comm/commit/af265eb0))
- **prompt,admin:** 持续拓展修复类型报错的要求 ([388dc3b8](https://github.com/ruan-cat/11comm/commit/388dc3b8))
- **claude:** 增加要求。【在错误的地方导入 `TableColumnList` 类型】 ([62d42046](https://github.com/ruan-cat/11comm/commit/62d42046))
- **claude:** 避免在考虑自动导入 clone 函数 ([4a9d883d](https://github.com/ruan-cat/11comm/commit/4a9d883d))
- **claude:** 增加【用导入的 mode 类型来优化手写的 mode 模式类型】要求 ([c779fcc2](https://github.com/ruan-cat/11comm/commit/c779fcc2))
- **claude:** 增加要求【使用错误的，不存在的，容易带来误导的 `mode?: "add" (["edit"](https://github.com/ruan-cat/11comm/commit/ "edit"))
- **claude:** 声明清楚客户端和服务端代码的却别。 ([f1866498](https://github.com/ruan-cat/11comm/commit/f1866498))
- **claude:** 增加业务路径的概念。 ([9f808b7b](https://github.com/ruan-cat/11comm/commit/9f808b7b))
- **claude:** ⚠️ 重点说明类型项目不应该出现 mode 类型。 ([364b664c](https://github.com/ruan-cat/11comm/commit/364b664c))
- **prompt,admin:** 增加要求 至少要启动 4 个独立的类型修复子代理，完成修复。 ([000e2d3c](https://github.com/ruan-cat/11comm/commit/000e2d3c))
- **claude:** 增加要求【不要写向后兼容的类型】 ([e691c6fb](https://github.com/ruan-cat/11comm/commit/e691c6fb))
- **claude:** 更新标题名称。 ([b7c7cba1](https://github.com/ruan-cat/11comm/commit/b7c7cba1))
- **claude:** 错误导入 getRouteRank 函数 ([c267cd62](https://github.com/ruan-cat/11comm/commit/c267cd62))
- **claude:** 声明错误导入 FieldValues 类型 ([a04d7947](https://github.com/ruan-cat/11comm/commit/a04d7947))
- **claude:** 错误导入全局类型 TableColumnList ([b04d7579](https://github.com/ruan-cat/11comm/commit/b04d7579))
- **claude:** [错误导入全局类型 PureTableBarProps] ([e29571e5](https://github.com/ruan-cat/11comm/commit/e29571e5))
- **claude:** [错误导入全局类型] ([5f2b7eb1](https://github.com/ruan-cat/11comm/commit/5f2b7eb1))
- **claude:** 【错误导入来自 `plus-pro-components` 模块的全局类型】 ([8f2fca81](https://github.com/ruan-cat/11comm/commit/8f2fca81))
- **claude:** 更新序号； ([5cb1ae6b](https://github.com/ruan-cat/11comm/commit/5cb1ae6b))
- **claude:** 更新序号 ([b5ae4ccc](https://github.com/ruan-cat/11comm/commit/b5ae4ccc))
- **claude:** 增加【执行长任务时的策略与注意事项】 ([999c2aad](https://github.com/ruan-cat/11comm/commit/999c2aad))
- **claude:** 补充【执行长任务时的策略与注意事项】 ([378dbd41](https://github.com/ruan-cat/11comm/commit/378dbd41))
- **openspec:** 更新类型处理规范，避免出现任何兼容性的写法 ([2d9a9c86](https://github.com/ruan-cat/11comm/commit/2d9a9c86))
- **prompt,admin:** 设计任务【更新迭代 `migrate-static-data-to-nitro-query` 的全部文档，避免出现编写兼容性的中文类型变量】 ([2fa219aa](https://github.com/ruan-cat/11comm/commit/2fa219aa))
- **prompt,admin:** 设计任务【更新迭代 `migrate-static-data-to-nitro-query` 的 `list-page-pattern` 列表页改造规范，避免出现删改多余内容的情况】 ([bec1c381](https://github.com/ruan-cat/11comm/commit/bec1c381))
- **prompt,admin:** 不要胡乱删改打开弹框组件的处理逻辑。 ([7fa98815](https://github.com/ruan-cat/11comm/commit/7fa98815))
- **prompt,admin:** 不要胡乱删改掉打开弹框函数 openDialog 本来就有的按钮配置逻辑。 ([535db4b8](https://github.com/ruan-cat/11comm/commit/535db4b8))
- **prompt,admin:** 增加要求【不要更改掉 definePage 宏的排布顺序】 ([2930ef72](https://github.com/ruan-cat/11comm/commit/2930ef72))
- **prompt,admin:** 增加要求【表格列配置 columns 数组的类型约束，就是全局类型 `TableColumnList` ，不要换掉】 ([a16f6262](https://github.com/ruan-cat/11comm/commit/a16f6262))
- **prompt,admin:** 增加不要删掉本来就写好的全局类型约束 `PureTableBarProps`，保持原样即可 ([dca6a45b](https://github.com/ruan-cat/11comm/commit/dca6a45b))
- **prompt,admin:** 【无条件的按照 `fix-type-error` 来处理类型错误】 ([91d61b8f](https://github.com/ruan-cat/11comm/commit/91d61b8f))
- **prompt,admin:** 更新标题序号 ([9b67f227](https://github.com/ruan-cat/11comm/commit/9b67f227))
- **prompt,admin:** 【不要增加本来就有的，`definePage` 宏专用的 `getRouteRank` 全局函数】 ([a535fa49](https://github.com/ruan-cat/11comm/commit/a535fa49))

### 🏡 Chore

- **package.json:** 安装根包依赖，准备重新配置有效的 turbo 配置。 ([694fc4bf](https://github.com/ruan-cat/11comm/commit/694fc4bf))
- ⚠️ 要求新的任务完成就任务。 ([cc029e42](https://github.com/ruan-cat/11comm/commit/cc029e42))
- **admin:** 持续完成测试假数据的格式调整。 ([fd474e3b](https://github.com/ruan-cat/11comm/commit/fd474e3b))
- **claude:** 标记任务完成； ([f17bd90f](https://github.com/ruan-cat/11comm/commit/f17bd90f))
- ⚠️ 完成 sync-taskmaster-test-data-backlog 任务。 ([ea0ced38](https://github.com/ruan-cat/11comm/commit/ea0ced38))
- **prompt,admin:** 设计巨大的任务【将本地静态写死的数据转换成真实的 nitro 接口，并在各个页面内使用基于 `@tanstack/vue-query` 的接口请求库】 ([3343f30f](https://github.com/ruan-cat/11comm/commit/3343f30f))
- **prompt,admin:** 逐步编写完善完整的类型约束写法，和代码编写要求。 ([c7e896cf](https://github.com/ruan-cat/11comm/commit/c7e896cf))
- **prompt,admin:** 不需要考虑链接数据库. ([06bdcc85](https://github.com/ruan-cat/11comm/commit/06bdcc85))
- **prompt,admin:** 设计任务【更新 `migrate-static-data-to-nitro-query` 的 openspec 规范】 ([ee3d31e6](https://github.com/ruan-cat/11comm/commit/ee3d31e6))
- **prompt,admin:** 设计任务【更新补全 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务列表】 ([bab2bf58](https://github.com/ruan-cat/11comm/commit/bab2bf58))
- **openspec:** 补全任务清单 ([ad31bf7d](https://github.com/ruan-cat/11comm/commit/ad31bf7d))
- **prompt,admin:** 设计待办任务【增加完成 nitro 接口生成后需要及时删除掉旧 `test-data.ts` 的行为规范】 ([74cda709](https://github.com/ruan-cat/11comm/commit/74cda709))
- **prompt,admin:** <!-- 触发部署 NPM_CONFIG_PACKAGE_MANAGER = pnpm --> ([ccf56e2f](https://github.com/ruan-cat/11comm/commit/ccf56e2f))
- **prompt,admin:** 触发部署 npm_config_user_agent = pnpm 。 ([fd871c37](https://github.com/ruan-cat/11comm/commit/fd871c37))
- **admin:** 尝试手动实现一个接口 ([a40f9669](https://github.com/ruan-cat/11comm/commit/a40f9669))
- **admin:** 尝试调整数据 ([a2f6489a](https://github.com/ruan-cat/11comm/commit/a2f6489a))
- **prompt,admin:** ⚠️ 增加任务【增加 nitro 编写接口的代码规范和代码写法检查任务】 ([16b5ea3c](https://github.com/ruan-cat/11comm/commit/16b5ea3c))
- **prompt,admin:** 标记完成【增加完成 nitro 接口生成后需要及时删除掉旧 `test-data.ts` 的行为规范】 ([3bbe1503](https://github.com/ruan-cat/11comm/commit/3bbe1503))
- **prompt,admin:** 标记【增加 nitro 编写接口的代码规范和代码写法检查任务】完成 ([da5b678d](https://github.com/ruan-cat/11comm/commit/da5b678d))
- **prompt,admin:** 设计任务【为新增的 `@01s-11comm/type` 包，更新 AI 指导文件】 ([4c385516](https://github.com/ruan-cat/11comm/commit/4c385516))
- **prompt,admin:** 设置手动任务，手动实现代码写法更改。 ([b399425a](https://github.com/ruan-cat/11comm/commit/b399425a))
- **prompt,admin:** 设计任务【增加新的严格任务执行规范】 ([a2c0a307](https://github.com/ruan-cat/11comm/commit/a2c0a307))
- **config,admin:** 无法实现全局类型导入. ([0e18d0c9](https://github.com/ruan-cat/11comm/commit/0e18d0c9))
- **prompt,admin:** 完成【为新增的 `@01s-11comm/type` 包，更新 AI 指导文件】 ([76c6311f](https://github.com/ruan-cat/11comm/commit/76c6311f))
- **prompt,admin:** 设计任务 【运行后台项目的类型检查命令】 ([93e84977](https://github.com/ruan-cat/11comm/commit/93e84977))
- **prompt,admin:** 设计处理接口请求故障的提示词 ([ddcd2542](https://github.com/ruan-cat/11comm/commit/ddcd2542))
- **prompt,admin:** 设计提示词，处理 【修复 nitro 接口的故障】 ([822a8d0d](https://github.com/ruan-cat/11comm/commit/822a8d0d))
- **prompt,admin:** 设计任务【以当前暂存区文件为索引，按照任务要求，修改对应 vue 组件和类型文件】 ([b3a9c717](https://github.com/ruan-cat/11comm/commit/b3a9c717))
- **admin:** 2025-12-13 类型错误修复总结报告 ([1455879d](https://github.com/ruan-cat/11comm/commit/1455879d))
- **prompt,admin:** 持续迭代【运行后台项目的类型检查命令】 ([0403fb5e](https://github.com/ruan-cat/11comm/commit/0403fb5e))
- **prompt,admin:** 标记暂且搞清楚了【修复 nitro 接口的故障】。 ([db54a4fd](https://github.com/ruan-cat/11comm/commit/db54a4fd))
- **prompt,admin:** 设计【更新 `common-business-options` 规范，禁止类型项目使用含有中文的变量名】任务 ([b4939418](https://github.com/ruan-cat/11comm/commit/b4939418))
- **prompt,admin:** 标记任务完成的先后次序。 ([2abfbc92](https://github.com/ruan-cat/11comm/commit/2abfbc92))
- **prompt,admin:** 补充【运行后台项目的类型检查命令，整体性的解决项目的类型报错问题】任务的执行细节。 ([56ed1092](https://github.com/ruan-cat/11comm/commit/56ed1092))
- **prompt,admin:** 更新错别字； ([7838f406](https://github.com/ruan-cat/11comm/commit/7838f406))
- **prompt,admin:** 标记完成【手动整理公共通用使用的业务类型，并设计新的公共下拉选择数组的新规范】 ([6b9fd960](https://github.com/ruan-cat/11comm/commit/6b9fd960))
- **prompt,admin:** 标记完成【更新 `common-business-options` 规范，禁止类型项目使用含有中文的变量名】任务 ([d99b5b29](https://github.com/ruan-cat/11comm/commit/d99b5b29))
- **openspec,admin:** 执行 migrate-static-data-to-nitro-query 任务 ([11eb61f6](https://github.com/ruan-cat/11comm/commit/11eb61f6))
- **router,admin:** 尝试不使用服务端导入路由，但是失败。 ([17c0a161](https://github.com/ruan-cat/11comm/commit/17c0a161))
- **admin:** 尝试让欢迎页面的欢迎数据，实现最基本的分页。 ([dee6ff04](https://github.com/ruan-cat/11comm/commit/dee6ff04))
- **admin:** 标记专用的 SSR 入口文件被放弃 ([2a408796](https://github.com/ruan-cat/11comm/commit/2a408796))
- **vite,config,router,admin:** 尝试删改代码，简化项目对路由的使用。 ([2f639002](https://github.com/ruan-cat/11comm/commit/2f639002))
- **prompt,admin:** 放弃用 AI 来处理故障 ([7ae5304f](https://github.com/ruan-cat/11comm/commit/7ae5304f))
- **prompt,admin:** 设计任务【清空重设任务清单】 ([d67389c1](https://github.com/ruan-cat/11comm/commit/d67389c1))
- **openspec:** 删除掉可能误导的文档报告地址 ([108e023c](https://github.com/ruan-cat/11comm/commit/108e023c))
- **openspec:** 重新生成任务列表文件。 ([73024fc7](https://github.com/ruan-cat/11comm/commit/73024fc7))
- **admin:** 补充计划模式生成的文档报告。 ([1bd59230](https://github.com/ruan-cat/11comm/commit/1bd59230))
- **prompt,admin:** 完成 清空重设任务清单。 ([63abc766](https://github.com/ruan-cat/11comm/commit/63abc766))
- **prompt,admin:** ⚠️ 设计任务【单独封装专用的搜索查询工具函数，并更新规范文档的使用代码】 ([d8b58bd1](https://github.com/ruan-cat/11comm/commit/d8b58bd1))
- **prompt,admin:** 完成【单独封装专用的搜索查询工具函数，并更新规范文档的使用代码】 ([407e7526](https://github.com/ruan-cat/11comm/commit/407e7526))
- **openspec:** 更新路径，便于识别。 ([3248258d](https://github.com/ruan-cat/11comm/commit/3248258d))
- **prompt,admin:** 完成【重构 `migrate-static-data-to-nitro-query` 任务的规范执行步骤和代码参考案例】 ([e3e0e5ca](https://github.com/ruan-cat/11comm/commit/e3e0e5ca))
- **router,admin:** 处理类型故障； ([3ad3f47d](https://github.com/ruan-cat/11comm/commit/3ad3f47d))
- **prompt,admin:** ⚠️ 新增要求【禁止编写脚本完成批处理任务】 ([f6d3719f](https://github.com/ruan-cat/11comm/commit/f6d3719f))
- **prompt,admin:** 设计任务【批量的针对性修复现存的 api hooks 接口请求代码写法】 ([0043a0c9](https://github.com/ruan-cat/11comm/commit/0043a0c9))
- **prompt,admin:** 简单设计了 【批量的针对性改写现存的 index.vue 列表页代码写法】 任务 ([c11538e0](https://github.com/ruan-cat/11comm/commit/c11538e0))
- **prompt,admin:** 标记 批量的针对性修复现存的 api hooks 接口请求代码写法 已完成。 ([440acbcb](https://github.com/ruan-cat/11comm/commit/440acbcb))
- **prompt,admin:** 完成【批量的针对性改写现存的 index.vue 列表页代码写法】任务 ([5982976e](https://github.com/ruan-cat/11comm/commit/5982976e))
- **prompt,admin:** 简单记录两个长期使用的提示词，便于高强度复用。 ([6df813f9](https://github.com/ruan-cat/11comm/commit/6df813f9))
- **prompt,admin:** 增加【增加严格规范以便处理重复类型声明的故障】任务 ([1d3ba39b](https://github.com/ruan-cat/11comm/commit/1d3ba39b))
- **prompt,admin:** 设计简单的待办任务 ([b51a4600](https://github.com/ruan-cat/11comm/commit/b51a4600))
- **prompt,admin:** 完成【正则文本手动替换任务】 ([3b716bb7](https://github.com/ruan-cat/11comm/commit/3b716bb7))
- **prompt,admin:** 增加严格的提示词。【执行本任务使用的提示词】 ([60c5bc16](https://github.com/ruan-cat/11comm/commit/60c5bc16))
- 更新任务清单状态，标记 devTeam 8 个路由迁移已完成 ([f6a4f3b8](https://github.com/ruan-cat/11comm/commit/f6a4f3b8))
- 更新任务清单状态，标记 operationTeam 12 个路由迁移已完成 ([a58093fe](https://github.com/ruan-cat/11comm/commit/a58093fe))
- **prompt,admin:** 记录 【migrate-form-ts-to-types-pkg】 的任务 ([fb70dbf8](https://github.com/ruan-cat/11comm/commit/fb70dbf8))
- **prompt,admin:** 标记【将全部后台项目的 form.ts 文件做迁移重构】已完成 ([adb3aa54](https://github.com/ruan-cat/11comm/commit/adb3aa54))
- **type:** 持续完成任务 ([7a7e4461](https://github.com/ruan-cat/11comm/commit/7a7e4461))
- **admin:** 增加报告 ([80f95f2d](https://github.com/ruan-cat/11comm/commit/80f95f2d))
- **openspec:** 更新任务记录 ([b3470cb7](https://github.com/ruan-cat/11comm/commit/b3470cb7))

### 🎨 Styles

- **openspec:** 格式化； ([1fbf6f65](https://github.com/ruan-cat/11comm/commit/1fbf6f65))
- **openspec:** 更新 markdown 格式 ([e4117a6d](https://github.com/ruan-cat/11comm/commit/e4117a6d))
- **openspec:** 更新 markdown 格式 ([83efaf54](https://github.com/ruan-cat/11comm/commit/83efaf54))
- **openspec:** 处理 markdown 文本错误 ([0ccaad92](https://github.com/ruan-cat/11comm/commit/0ccaad92))
- **admin:** 换成函数写法 ([41714164](https://github.com/ruan-cat/11comm/commit/41714164))

### 🤖 CI

- **package.json:** ⚠️ 工作流恢复使用 ci 命令。 ([97223f19](https://github.com/ruan-cat/11comm/commit/97223f19))
- **package.json,admin:** 增加 nitro 命令，便于测试 ([4dba1437](https://github.com/ruan-cat/11comm/commit/4dba1437))
- **package.json,admin:** 将 typecheck 命令的优先级提前 ([0bfc0c36](https://github.com/ruan-cat/11comm/commit/0bfc0c36))

### 🔧 更新配置

- **vitepress,admin:** ⚠️ 复制粘贴 claude code 提示词时，更改存储的目录路径。 ([d60e5317](https://github.com/ruan-cat/11comm/commit/d60e5317))
- **admin:** 更新路径配置 ([b16b4732](https://github.com/ruan-cat/11comm/commit/b16b4732))
- **turbo,config:** 重构 turbo 依赖关系。 ([d5517519](https://github.com/ruan-cat/11comm/commit/d5517519))
- **prompt,config,admin:** 配置 wrangler 的 cloudflare worker 环境变量。尝试实现完整的依赖安装。 ([22a8ec93](https://github.com/ruan-cat/11comm/commit/22a8ec93))
- **config,admin:** 尝试设置环境变量 SKIP_DEPENDENCY_INSTALL = 1 ，来实现有效的部署。 ([9ab6765b](https://github.com/ruan-cat/11comm/commit/9ab6765b))
- **root:** 允许将 pnpm 包锁文件，上传到 git 仓库内，触发自动工作流的安装行为。 ([2c2dc72a](https://github.com/ruan-cat/11comm/commit/2c2dc72a))
- **config,admin:** 删除掉 cloudflare worker 用途的环境变量，现在项目可以继续使用 pnpm 来安装依赖了。 ([1ec6a108](https://github.com/ruan-cat/11comm/commit/1ec6a108))
- **admin:** ⚠️ 在 nitro 全栈项目内，axios 不需要配置 baseURL 地址了。 ([b5ea350b](https://github.com/ruan-cat/11comm/commit/b5ea350b))
- **config,admin:** 尝试配置 nitro 的自动类型生成和导入 ([00be28de](https://github.com/ruan-cat/11comm/commit/00be28de))
- **config,admin:** 增加命令运行位置； ([ecaef3fb](https://github.com/ruan-cat/11comm/commit/ecaef3fb))
- **tsc,admin:** 增加 "nitro/tsconfig" 配置。 ([21e461e1](https://github.com/ruan-cat/11comm/commit/21e461e1))
- **tsc,admin:** 关闭掉 "noUnusedLocals": false, 过于严格的检查 ([d99054dc](https://github.com/ruan-cat/11comm/commit/d99054dc))
- **tsc,admin:** "verbatimModuleSyntax": false, 关掉过于强的类型检查 ([a24039ed](https://github.com/ruan-cat/11comm/commit/a24039ed))
- **config,admin:** ⚠️ Cloudflare worker 的名称，项目名称改成【01s-11comm-admin】 ([e9f66a7d](https://github.com/ruan-cat/11comm/commit/e9f66a7d))
- **config,admin:** 尝试配置 nitro 的自动导入。 ([c9109524](https://github.com/ruan-cat/11comm/commit/c9109524))
- **config,admin:** 尝试实现全局类型导入。 ([ec92fc35](https://github.com/ruan-cat/11comm/commit/ec92fc35))
- **admin:** 取消导入 nitro/tsconfig 以降低类型检查严格性 ([0c8c5fc7](https://github.com/ruan-cat/11comm/commit/0c8c5fc7))
- **tsc,admin:** 为了解决接口莫名其妙的 500 报错，临时将类型 tsconfig.json 加上。 ([8a65f851](https://github.com/ruan-cat/11comm/commit/8a65f851))
- **config,admin:** 恢复补全 nitro 配置的 imports 注释，和 alias 路径导入配置。 ([122a05a2](https://github.com/ruan-cat/11comm/commit/122a05a2))
- **vite,config,admin:** 增加 SSR 依赖忽略配置。 ([69718b43](https://github.com/ruan-cat/11comm/commit/69718b43))
- **vite,config,admin:** 放弃不稳定的 environments 环境配置 ([c69ad32d](https://github.com/ruan-cat/11comm/commit/c69ad32d))
- **router,admin:** 设置路由布局工具 setupLayouts 。 ([3537712d](https://github.com/ruan-cat/11comm/commit/3537712d))
- **config,admin:** 更新 utils 作为服务端的专门别名 ([80827dab](https://github.com/ruan-cat/11comm/commit/80827dab))
- **tsc,admin:** 取消导入该类型配置预设 该预设过于严格 ([ab76d1a4](https://github.com/ruan-cat/11comm/commit/ab76d1a4))

#### ⚠️ Breaking Changes

- **openspec:** ⚠️ 新建 fix-api-hooks-missing-initial-params 任务。 ([86e80b48](https://github.com/ruan-cat/11comm/commit/86e80b48))
- **admin:** ⚠️ 修复类型故障； ([16e30cf9](https://github.com/ruan-cat/11comm/commit/16e30cf9))
- **openspec:** ⚠️ 更改文档的识别内容。 ([1e70c89e](https://github.com/ruan-cat/11comm/commit/1e70c89e))
- **openspec,prompt,admin:** ⚠️ 更新 `migrate-static-data-to-nitro-query` 的 openspec 规范;确保文件满足规范 ([8e6336a2](https://github.com/ruan-cat/11comm/commit/8e6336a2))
- **admin:** ⚠️ 处理类型故障。 ([4ec0d018](https://github.com/ruan-cat/11comm/commit/4ec0d018))
- **config,admin:** ⚠️ 修复接口无法返回数据的错误。 ([a18193c0](https://github.com/ruan-cat/11comm/commit/a18193c0))
- **type,admin:** ⚠️ 为大多数的 form.ts 补全类型；修复 type 项目内的类型，改写成纯粹的英文写法。 ([0d5413de](https://github.com/ruan-cat/11comm/commit/0d5413de))
- **admin:** ⚠️ 暂时注释掉筛选逻辑代码，筛选逻辑代码事实上触发了严重的读取客户端模块的 bug。 ([a26c6dbe](https://github.com/ruan-cat/11comm/commit/a26c6dbe))
- **router,admin:** ⚠️ 彻底修复了自动路由模块混入服务端代码的错误。 ([e7c1ee46](https://github.com/ruan-cat/11comm/commit/e7c1ee46))
- **type,prompt,server,admin:** ⚠️ 大规模修复类型故障，共计 92 份文件。 ([b2ca7397](https://github.com/ruan-cat/11comm/commit/b2ca7397))
- ⚠️ 归档 refactor-test-data-literal-array 任务 ([f9e412a5](https://github.com/ruan-cat/11comm/commit/f9e412a5))
- **prompt,admin:** ⚠️ 迁移出单独的一份【2025-12-12 将本地假数据改造，迁移成 nitro 接口】长期维护的提示词。 ([5c19f929](https://github.com/ruan-cat/11comm/commit/5c19f929))
- **openspec,type,package.json,config,admin:** ⚠️ 大规模的执行 migrate-static-data-to-nitro-query 任务，大范围的自动化重构与更改。 ([aa2895e4](https://github.com/ruan-cat/11comm/commit/aa2895e4))
- **openspec,type,admin:** ⚠️ 继续执行 migrate-static-data-to-nitro-query 任务，大批量生成代码。 ([9da8a295](https://github.com/ruan-cat/11comm/commit/9da8a295))
- **admin:** ⚠️ 处理路径导入地址。 ([049b4f50](https://github.com/ruan-cat/11comm/commit/049b4f50))
- **openspec,type,admin:** ⚠️ 持续完成 migrate-static-data-to-nitro-query 任务。 ([2ce73ac7](https://github.com/ruan-cat/11comm/commit/2ce73ac7))
- **openspec,admin:** ⚠️ 持续执行 migrate-static-data-to-nitro-query 任务。 ([e2a6bcb8](https://github.com/ruan-cat/11comm/commit/e2a6bcb8))
- **openspec,type,router,admin:** ⚠️ 执行 migrate-static-data-to-nitro-query 任务 ([057ed8c8](https://github.com/ruan-cat/11comm/commit/057ed8c8))
- **openspec,type,admin:** ⚠️ 执行大规模的执行 migrate-static-data-to-nitro-query 任务，修改新增将近 540 份文件；修改规范和设计文件。 ([b969f4d3](https://github.com/ruan-cat/11comm/commit/b969f4d3))
- **type,admin:** ⚠️ 大多数 from 表单，更改引用的类型为英文类型； ([0b4860a5](https://github.com/ruan-cat/11comm/commit/0b4860a5))
- **type,admin:** ⚠️ 大规模的更改代码写法，处理类型错误。 ([496996ee](https://github.com/ruan-cat/11comm/commit/496996ee))
- **admin:** ⚠️ 创建 app 改成 createSSRApp，创建 SSR 专用 app。 ([e402d709](https://github.com/ruan-cat/11comm/commit/e402d709))
- **openspec,type,admin:** ⚠️ 大规模执行 migrate-static-data-to-nitro-query 任务，修改了 119 份文件。 ([671d5841](https://github.com/ruan-cat/11comm/commit/671d5841))
- **type,admin:** ⚠️ 手动整理公共通用使用的业务类型。将合同类型统一整理。 ([2bc1e083](https://github.com/ruan-cat/11comm/commit/2bc1e083))
- **type,admin:** ⚠️ 大批量更新代码，更改替换掉很多中文变量名写法。修改 95 份文件。 ([a17c56a9](https://github.com/ruan-cat/11comm/commit/a17c56a9))
- **type,admin:** ⚠️ 替换中文变量名； ([70cb0a59](https://github.com/ruan-cat/11comm/commit/70cb0a59))
- **type,admin:** ⚠️ 使用 GLM 大批量的做代码结构调整，导入纯英文的下拉选择工具。修改 28 份文件。 ([22bfbe19](https://github.com/ruan-cat/11comm/commit/22bfbe19))
- **vite,config,router,prompt,package.json,admin:** ⚠️ 重大重构。手动的模仿 nitro 的案例写法，将项目的入口改造成正统的 SSR 项目写法，并让多款 vite 插件开启 SSR 适配。现在项目本地可以正常 dev 运行。 ([9430d2b1](https://github.com/ruan-cat/11comm/commit/9430d2b1))
- **router,admin:** ⚠️ 完全从全新的 pure-admin 内获取到代码写法，重新的简单接入代码写法。现在接口能够正常使用。 ([743eaab9](https://github.com/ruan-cat/11comm/commit/743eaab9))
- **openspec,admin:** ⚠️ 完全重写，手写 data-fetching 数据获取规范。 ([d8ae86a4](https://github.com/ruan-cat/11comm/commit/d8ae86a4))
- **openspec:** ⚠️ 手动重写，重构 list-page-pattern 列表页编写模式的代码写法和代码案例。 ([af5167ba](https://github.com/ruan-cat/11comm/commit/af5167ba))
- **prompt,admin:** ⚠️ 重构任务【重构 `migrate-static-data-to-nitro-query` 任务的规范执行步骤和代码参考案例】 ([95b838f9](https://github.com/ruan-cat/11comm/commit/95b838f9))
- **openspec,claude:** ⚠️ 重构重写一次全部的 migrate-static-data-to-nitro-query 任务规范文件。用 Anthropic 模型完成。 ([9b122a4b](https://github.com/ruan-cat/11comm/commit/9b122a4b))
- **admin:** ⚠️ 大批量处理 api hooks 的代码写法，统一补全了接口参数，并使用了接口参数。 ([32f3ad27](https://github.com/ruan-cat/11comm/commit/32f3ad27))
- **openspec:** ⚠️ 完成任务【增加严格规范以便处理重复类型声明的故障】，增加严格的执行规范，处理类型故障 ([67d91944](https://github.com/ruan-cat/11comm/commit/67d91944))
- **admin:** ⚠️ 代码写法批量重构，避免写冗余的类型约束。 ([f62e4417](https://github.com/ruan-cat/11comm/commit/f62e4417))
- **openspec,type,admin:** ⚠️ 完成 form.ts 的代码重构。将业务类型统一拆分迁移。 ([deeb3ff5](https://github.com/ruan-cat/11comm/commit/deeb3ff5))
- **admin:** ⚠️ 新增报告： 2025-12-12 静态假数据迁移至 Nitro + TanStack Query 实施计划 ([0b2ef15d](https://github.com/ruan-cat/11comm/commit/0b2ef15d))
- **admin:** ⚠️ 更新【Nitro 接口模板】 ([0fc3c356](https://github.com/ruan-cat/11comm/commit/0fc3c356))
- **openspec:** ⚠️ 增加 nitro 编写接口的代码规范和代码写法检查任务 ([9c09c17e](https://github.com/ruan-cat/11comm/commit/9c09c17e))
- **openspec,admin:** ⚠️ 更新类型导入，确保从 `@01s-11comm/type` 导入 `JsonVO` 和 `PageDTO`，移除对 `@ruan-cat/utils` 的依赖 ([9eee1c1c](https://github.com/ruan-cat/11comm/commit/9eee1c1c))
- **openspec,claude:** ⚠️ 为新增的 `@01s-11comm/type` 包，更新 AI 指导文件 ([6d2a8375](https://github.com/ruan-cat/11comm/commit/6d2a8375))
- **openspec:** ⚠️ 更新 公共业务下拉选择数组集中管理 使用错误的中文写法。 ([33a0e126](https://github.com/ruan-cat/11comm/commit/33a0e126))
- **claude:** ⚠️ 证据严格的编码规范。禁止编写脚本完成批处理任务。 ([05b553fb](https://github.com/ruan-cat/11comm/commit/05b553fb))
- **claude:** ⚠️ 重点说明类型项目不应该出现 mode 类型。 ([364b664c](https://github.com/ruan-cat/11comm/commit/364b664c))
- ⚠️ 要求新的任务完成就任务。 ([cc029e42](https://github.com/ruan-cat/11comm/commit/cc029e42))
- ⚠️ 完成 sync-taskmaster-test-data-backlog 任务。 ([ea0ced38](https://github.com/ruan-cat/11comm/commit/ea0ced38))
- **prompt,admin:** ⚠️ 增加任务【增加 nitro 编写接口的代码规范和代码写法检查任务】 ([16b5ea3c](https://github.com/ruan-cat/11comm/commit/16b5ea3c))
- **prompt,admin:** ⚠️ 设计任务【单独封装专用的搜索查询工具函数，并更新规范文档的使用代码】 ([d8b58bd1](https://github.com/ruan-cat/11comm/commit/d8b58bd1))
- **prompt,admin:** ⚠️ 新增要求【禁止编写脚本完成批处理任务】 ([f6d3719f](https://github.com/ruan-cat/11comm/commit/f6d3719f))
- **package.json:** ⚠️ 工作流恢复使用 ci 命令。 ([97223f19](https://github.com/ruan-cat/11comm/commit/97223f19))
- **vitepress,admin:** ⚠️ 复制粘贴 claude code 提示词时，更改存储的目录路径。 ([d60e5317](https://github.com/ruan-cat/11comm/commit/d60e5317))
- **admin:** ⚠️ 在 nitro 全栈项目内，axios 不需要配置 baseURL 地址了。 ([b5ea350b](https://github.com/ruan-cat/11comm/commit/b5ea350b))
- **config,admin:** ⚠️ Cloudflare worker 的名称，项目名称改成【01s-11comm-admin】 ([e9f66a7d](https://github.com/ruan-cat/11comm/commit/e9f66a7d))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.5.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.4.0...v0.5.0)

### 🔧 更新配置

- **config:** ⚠️ 更新配置，使用过滤语法筛选出需要的类型。 ([64ae5ba](https://github.com/ruan-cat/11comm/commit/64ae5ba))

#### ⚠️ Breaking Changes

- **config:** ⚠️ 更新配置，使用过滤语法筛选出需要的类型。 ([64ae5ba](https://github.com/ruan-cat/11comm/commit/64ae5ba))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.4.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.3.0...v0.4.0)

### 🐞 修复缺陷

- **config:** ⚠️ 处理配置故障，只要满足一个配置，就生成。 ([be55b23](https://github.com/ruan-cat/11comm/commit/be55b23))

### 🦄 代码重构

- **config,package.json:** ⚠️ 按照 vercel-deploy-tool 的新版本要求，重构配置文件。 ([b676cf4](https://github.com/ruan-cat/11comm/commit/b676cf4))

### 📃 文档更新

- **claude:** ⚠️ 增加规范，不允许使用函数的形式批量生成。 ([57972c6](https://github.com/ruan-cat/11comm/commit/57972c6))

### 🐳 其他修改

- **prompt,admin:** ⚠️ 设计任务【根据 `.taskmaster\tasks\tasks.json` ，初始化 openspec 规格的任务】 ([7a2d2d2](https://github.com/ruan-cat/11comm/commit/7a2d2d2))

### 📦 依赖更新

- **package.json:** 根包安装工具包项目，便于复用配置。 ([715e425](https://github.com/ruan-cat/11comm/commit/715e425))

### 🔧 更新配置

- **config:** ⚠️ 更新发版工具的版本号生成配置。 ([49c77a1](https://github.com/ruan-cat/11comm/commit/49c77a1))
- **config:** 调整生成标题的逻辑 ([bd6b8f0](https://github.com/ruan-cat/11comm/commit/bd6b8f0))

#### ⚠️ Breaking Changes

- **config:** ⚠️ 处理配置故障，只要满足一个配置，就生成。 ([be55b23](https://github.com/ruan-cat/11comm/commit/be55b23))
- **config,package.json:** ⚠️ 按照 vercel-deploy-tool 的新版本要求，重构配置文件。 ([b676cf4](https://github.com/ruan-cat/11comm/commit/b676cf4))
- **claude:** ⚠️ 增加规范，不允许使用函数的形式批量生成。 ([57972c6](https://github.com/ruan-cat/11comm/commit/57972c6))
- **prompt,admin:** ⚠️ 设计任务【根据 `.taskmaster\tasks\tasks.json` ，初始化 openspec 规格的任务】 ([7a2d2d2](https://github.com/ruan-cat/11comm/commit/7a2d2d2))
- **config:** ⚠️ 更新发版工具的版本号生成配置。 ([49c77a1](https://github.com/ruan-cat/11comm/commit/49c77a1))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.3.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.2.3...v0.3.0)

### 🐞 修复缺陷

- **admin:** 补全缺少的 系统管理 路由控制页面。确保页面可以正常显示。 ([a0575ea](https://github.com/ruan-cat/11comm/commit/a0575ea))
- **admin:** 处理 markdown 渲染故障 ([3739785](https://github.com/ruan-cat/11comm/commit/3739785))
- **admin:** 修复 Nitro/Vite 构建问题，新增依赖 @vue/compiler-sfc 和 @vue/shared，调整路径别名配置以支持 SSR ([3f7ab45](https://github.com/ruan-cat/11comm/commit/3f7ab45))
- **package.json,admin:** ⚠️ 处理 nitro 在 github workflow 运行时出现的故障。 ([7cefaad](https://github.com/ruan-cat/11comm/commit/7cefaad))
- **prompt,package.json,admin:** ⚠️ 使用 overrides 覆盖依赖的方案，处理 Vite 7.2.7 的 createRequire 故障。 ([a96906d](https://github.com/ruan-cat/11comm/commit/a96906d))
- **package.json,admin:** ⚠️ 锁定@ruan-cat/utils 版本至 4.16.0 以解决 Nitro 构建失败问题。 ([2dc7d40](https://github.com/ruan-cat/11comm/commit/2dc7d40))
- 处理报告代码块语言错误。 ([917db41](https://github.com/ruan-cat/11comm/commit/917db41))
- 处理文档【2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误】的语法错误。 ([31477c3](https://github.com/ruan-cat/11comm/commit/31477c3))

### 🦄 代码重构

- **package.json,config:** ⚠️ 更新命令。增加尾缀说明。 ([de71de7](https://github.com/ruan-cat/11comm/commit/de71de7))
- **admin:** ⚠️ 改造 operation-team/data-manage/property-management-company 列表页 ([9b93c4e](https://github.com/ruan-cat/11comm/commit/9b93c4e))
- **admin:** ⚠️ 改造 operation-team/merchant-manage/merchant-info 列表页。 ([75d0168](https://github.com/ruan-cat/11comm/commit/75d0168))
- **admin:** ⚠️ 改造 operation-team/merchant-manage/merchant-admin 列表页 ([f5b9c9c](https://github.com/ruan-cat/11comm/commit/f5b9c9c))
- **admin:** ⚠️ 已成功完成所有 report-configuration 模块的列表页改造任务 ([a0866da](https://github.com/ruan-cat/11comm/commit/a0866da))
- **admin:** ⚠️ 改造 property-manage/community-manage/house-decoration 列表页 ([cd46e09](https://github.com/ruan-cat/11comm/commit/cd46e09))
- **admin:** ⚠️ 改造 property-manage/community-manage/building-space-structure-diagram 列表页 ([8a2136d](https://github.com/ruan-cat/11comm/commit/8a2136d))
- **admin:** ⚠️ 完成 property-manage/community-manage 列表页的改造，更新任务状态为已完成并添加完成时间 ([d2f33c8](https://github.com/ruan-cat/11comm/commit/d2f33c8))
- **admin:** ⚠️ 改造 property-manage/community-manage/my 列表页 ([3eeb23c](https://github.com/ruan-cat/11comm/commit/3eeb23c))
- **admin:** ⚠️ 改造 property-manage/community-manage/parking-space-structure-diagram 列表页 ([a0b869c](https://github.com/ruan-cat/11comm/commit/a0b869c))
- **admin:** ⚠️ 完成 property-manage/contract-manage 模块的改造，更新任务状态为已完成并添加完成时间，新增合同变更和到期处理表单组件 ([6e92627](https://github.com/ruan-cat/11comm/commit/6e92627))
- **admin:** ⚠️ 改造 property-manage/contract-manage/expire 列表页 ([1037c4b](https://github.com/ruan-cat/11comm/commit/1037c4b))
- **admin:** ⚠️ 改造 property-manage/contract-manage/first-party 列表页 ([941129f](https://github.com/ruan-cat/11comm/commit/941129f))
- **admin:** ⚠️ 改造 property-manage/contract-manage/type 列表页 ([ad82dc8](https://github.com/ruan-cat/11comm/commit/ad82dc8))
- **admin:** ⚠️ 完成 property-manage/expense-manage 模块的改造，更新多个列表页的任务状态为已完成并添加完成时间，优化表单组件的字段属性和校验规则 ([53cd736](https://github.com/ruan-cat/11comm/commit/53cd736))
- **admin:** ⚠️ 改造 property-manage/expense-manage/water-and-electricity-meter-reading 列表页 ([fea3408](https://github.com/ruan-cat/11comm/commit/fea3408))
- **admin:** ⚠️ 改造 property-manage/expense-manage/vehicle-charge 列表页 ([4f96be8](https://github.com/ruan-cat/11comm/commit/4f96be8))
- **admin:** ⚠️ 改造 property-manage/expense-manage/reminder-for-overdue-payments 列表页 ([3823364](https://github.com/ruan-cat/11comm/commit/3823364))
- **admin:** ⚠️ 改造 property-manage/expense-manage/reprint-voucher 列表页 ([42d927f](https://github.com/ruan-cat/11comm/commit/42d927f))
- **admin:** 改造 property-manage/expense-manage/overdue-payment-information 列表页 ([7c56858](https://github.com/ruan-cat/11comm/commit/7c56858))
- **admin:** ⚠️ 改造 property-manage/expense-manage/payment-review 列表页 ([ee6f6b0](https://github.com/ruan-cat/11comm/commit/ee6f6b0))
- **admin:** ⚠️ 改造 property-manage/expense-manage/refund-review 列表页 ([cc289d7](https://github.com/ruan-cat/11comm/commit/cc289d7))
- **admin:** ⚠️ 改造 property-manage/expense-manage/house-charge 列表页 ([d740484](https://github.com/ruan-cat/11comm/commit/d740484))
- **admin:** 更换 初始化单元格 的 icon。 ([f15e246](https://github.com/ruan-cat/11comm/commit/f15e246))
- **admin:** ⚠️ 改造 property-manage/expense-manage/house-charge 列表页 ([ab3a629](https://github.com/ruan-cat/11comm/commit/ab3a629))
- **admin:** ⚠️ 改造 property-manage/expense-manage/meter-reading-type 列表页 ([738f1bb](https://github.com/ruan-cat/11comm/commit/738f1bb))
- **admin:** ⚠️ 改造 property-manage/expense-manage/discount-type 列表页 ([daf55ed](https://github.com/ruan-cat/11comm/commit/daf55ed))
- **admin:** ⚠️ 改造 property-manage/expense-manage/expense-summary-table 列表页 ([b9e4936](https://github.com/ruan-cat/11comm/commit/b9e4936))
- **admin:** ⚠️ 改造 property-manage/expense-manage/discount-apply 列表页 ([d9cae33](https://github.com/ruan-cat/11comm/commit/d9cae33))
- **admin:** ⚠️ 改造 property-manage/expense-manage/discount-setting 列表页 ([2641773](https://github.com/ruan-cat/11comm/commit/2641773))
- **admin:** ⚠️ 改造 property-manage/expense-manage/contracte-charge 列表页 ([2c7e7bc](https://github.com/ruan-cat/11comm/commit/2c7e7bc))
- **admin:** ⚠️ 改造 property-manage/expense-manage/cancel-fee 列表页 ([2b5e0a1](https://github.com/ruan-cat/11comm/commit/2b5e0a1))
- ⚠️ 直接用 claude code 的文件，覆盖掉 gemini 的全局记忆文件。 ([0c7aaa6](https://github.com/ruan-cat/11comm/commit/0c7aaa6))
- **admin:** ⚠️ 改造 property-manage/expense-manage/cancel-fee 列表页 ([dc96218](https://github.com/ruan-cat/11comm/commit/dc96218))
- **admin:** ⚠️ 更新 property-manage/house-property-manage/house 列表页，修改状态为完成并优化表单逻辑 ([caaf337](https://github.com/ruan-cat/11comm/commit/caaf337))
- **admin:** ⚠️ 更新 property-manage/house-property-manage/invoice 列表页，修改状态为完成并优化表单和查询逻辑 ([a4ba32f](https://github.com/ruan-cat/11comm/commit/a4ba32f))
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
- ⚠️ 标记列表页迁移的任务都完成了。准备新建全新的任务。 ([bc8cee3](https://github.com/ruan-cat/11comm/commit/bc8cee3))
- 移动文件 ([f416dda](https://github.com/ruan-cat/11comm/commit/f416dda))
- **prompt,admin:** 专门移动重构【处理 nitro 插件在 github workflow 出现的故障】的提示词。 ([f5fca11](https://github.com/ruan-cat/11comm/commit/f5fca11))
- **config,package.json,admin,claude:** ⚠️ 更新 prettier 配置，并且全量格式化一次； ([ab5da32](https://github.com/ruan-cat/11comm/commit/ab5da32))

### 📃 文档更新

- **claude:** 专门声明清楚项目不要生成 不要生成 `*.ts.backup` 文件 。 ([429fbdf](https://github.com/ruan-cat/11comm/commit/429fbdf))
- **claude:** ⚠️ 常见的 i18n 文本。纠正 AI 生成 key。 ([7ccb7dd](https://github.com/ruan-cat/11comm/commit/7ccb7dd))
- **claude:** ⚠️ 重点说明不允许项目执行多个任务，避免出现质量过低的情况。 ([ad23358](https://github.com/ruan-cat/11comm/commit/ad23358))
- **claude:** ⚠️ 获取技术栈对应的上下文 ([6652e0d](https://github.com/ruan-cat/11comm/commit/6652e0d))
- **claude:** ⚠️ 更新执行任务子代理的行为。 ([ab950b5](https://github.com/ruan-cat/11comm/commit/ab950b5))
- **claude:** 增加 nitro 作为记忆。 ([4fa1479](https://github.com/ruan-cat/11comm/commit/4fa1479))
- 2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误 ([d71bacd](https://github.com/ruan-cat/11comm/commit/d71bacd))
- ⚠️ 对报告的一级标题做约束说明。 ([c81b85a](https://github.com/ruan-cat/11comm/commit/c81b85a))
- ⚠️ 增加报告日志信息的代码块语言的约束要求。 ([6ddb253](https://github.com/ruan-cat/11comm/commit/6ddb253))
- **admin,root:** 补充关于 cloudflare worker 构建的部署文档细则。 ([05a793d](https://github.com/ruan-cat/11comm/commit/05a793d))
- **claude:** 更新运行一次性连续执行多个任务 ([63c256e](https://github.com/ruan-cat/11comm/commit/63c256e))
- ⚠️ 设置 openspec 的项目规范。 ([a708b5c](https://github.com/ruan-cat/11comm/commit/a708b5c))

### 🐳 其他修改

- 标记待办任务。暂时没办法修复 bug。 ([8f6470c](https://github.com/ruan-cat/11comm/commit/8f6470c))
- **config:** ⚠️ 换回更加稳定的 changelog:conventional-changelog 。 ([f9ae81b](https://github.com/ruan-cat/11comm/commit/f9ae81b))
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
- **.gitignore:** 更新忽略文件，替换.vercel 为.wrangler 以适应新的部署配置。 ([03c33df](https://github.com/ruan-cat/11comm/commit/03c33df))
- **package.json,pnpm-workspace,admin,01s-origin:** Update package versions and pnpm to 10.25.0, including various dependency upgrades for improved compatibility and performance. ([42447aa](https://github.com/ruan-cat/11comm/commit/42447aa))
- 修复 cz 无法运行并交互的错误 ([1a51141](https://github.com/ruan-cat/11comm/commit/1a51141))
- 设计任务【尝试不使用 overrides 配置】 ([b7cb446](https://github.com/ruan-cat/11comm/commit/b7cb446))
- 要求 AI 检查 overrides 依赖。 ([7474349](https://github.com/ruan-cat/11comm/commit/7474349))
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

- **package.json:** ⚠️ 拓展可以删除的内容。 rimraf -g '\*\*/{dist,.turbo,.vercel,.output,.cache,.temp}' ([80a4cfe](https://github.com/ruan-cat/11comm/commit/80a4cfe))
- **package.json,admin:** ⚠️ 提供专用的运行命令，在 github 内运行，且携带指定的环境变量。 ([ffd6272](https://github.com/ruan-cat/11comm/commit/ffd6272))
- **package.json,admin:** ⚠️ 更新运行命令，在 github workflow 运行 nitro 预设 github 。 ([5340e94](https://github.com/ruan-cat/11comm/commit/5340e94))
- **package.json,prompt,admin:** ⚠️ 更新 cloudflare 部署时，专门使用 nitro 的 cloudflare worker 环境变量。 ([8fea669](https://github.com/ruan-cat/11comm/commit/8fea669))

### 📦 依赖更新

- **package.json:** 安装依赖 commit-and-tag-version 。pnpm i -w -D commit-and-tag-version ([9cd7a96](https://github.com/ruan-cat/11comm/commit/9cd7a96))
- **package.json,admin:** Pnpm -F=@01s-11comm/admin i -P nitro ([d605ed8](https://github.com/ruan-cat/11comm/commit/d605ed8))
- **package.json,admin:** 升级依赖 ([c31fa49](https://github.com/ruan-cat/11comm/commit/c31fa49))
- **package.json,admin:** ⚠️ 按照 AI 要求，安装一些列对等依赖。 ([a913afe](https://github.com/ruan-cat/11comm/commit/a913afe))
- 升级依赖 ([6552e00](https://github.com/ruan-cat/11comm/commit/6552e00))
- **package.json:** ⚠️ 不需要通过降低版本的方式，解决 nitro 构建故障。 ([fbaf178](https://github.com/ruan-cat/11comm/commit/fbaf178))

### 🎉 初始化项目

- 初始化 .versionrc.js 配置。尝试用 commit-and-tag-version 来完成本地更新日志的生成。 ([31293f2](https://github.com/ruan-cat/11comm/commit/31293f2))
- **claude:** 初始化 openspec 的提示词文件。 ([df6d1f9](https://github.com/ruan-cat/11comm/commit/df6d1f9))

### 🔧 更新配置

- **package.json,config:** 预备 commit-and-tag-version 的生成命令。 ([569708b](https://github.com/ruan-cat/11comm/commit/569708b))
- **config:** ⚠️ Bumpp 开始使用 commit-and-tag-version 实现后继钩子任务。 ([abe7ddd](https://github.com/ruan-cat/11comm/commit/abe7ddd))
- ⚠️ 关闭掉 commit-and-tag-version 的一部分默认行为。 ([9953565](https://github.com/ruan-cat/11comm/commit/9953565))
- **config,admin:** ⚠️ 模仿 create-nitro-app 新建的项目，初始化 nitro vite 插件配置。 ([88bcd97](https://github.com/ruan-cat/11comm/commit/88bcd97))
- **config,admin:** 排除掉 nitro 插件。 ([84cc05d](https://github.com/ruan-cat/11comm/commit/84cc05d))
- 新增配置 gitmcp**plus-pro-components**plus-pro-components 。 ([348cf8e](https://github.com/ruan-cat/11comm/commit/348cf8e))
- **admin,root:** 添加 .output 到忽略列表。 ([1662155](https://github.com/ruan-cat/11comm/commit/1662155))
- **prompt,config,admin:** ⚠️ 配置 nitro 部署到 cloudflare worker 内 ([2c41183](https://github.com/ruan-cat/11comm/commit/2c41183))
- **nitro:** 添加 Cloudflare Worker 名称配置以支持部署 ([89cbfad](https://github.com/ruan-cat/11comm/commit/89cbfad))
- **config,admin:** ⚠️ 不指定写死的 nitro 构建预设。 ([3e408f7](https://github.com/ruan-cat/11comm/commit/3e408f7))

### 🔪 删除垃圾

- 删除掉冗余的文件，避免误导 ([3282f83](https://github.com/ruan-cat/11comm/commit/3282f83))

#### ⚠️ Breaking Changes

- **package.json,admin:** ⚠️ 处理 nitro 在 github workflow 运行时出现的故障。 ([7cefaad](https://github.com/ruan-cat/11comm/commit/7cefaad))
- **prompt,package.json,admin:** ⚠️ 使用 overrides 覆盖依赖的方案，处理 Vite 7.2.7 的 createRequire 故障。 ([a96906d](https://github.com/ruan-cat/11comm/commit/a96906d))
- **package.json,admin:** ⚠️ 锁定@ruan-cat/utils 版本至 4.16.0 以解决 Nitro 构建失败问题。 ([2dc7d40](https://github.com/ruan-cat/11comm/commit/2dc7d40))
- **package.json,config:** ⚠️ 更新命令。增加尾缀说明。 ([de71de7](https://github.com/ruan-cat/11comm/commit/de71de7))
- **admin:** ⚠️ 改造 operation-team/data-manage/property-management-company 列表页 ([9b93c4e](https://github.com/ruan-cat/11comm/commit/9b93c4e))
- **admin:** ⚠️ 改造 operation-team/merchant-manage/merchant-info 列表页。 ([75d0168](https://github.com/ruan-cat/11comm/commit/75d0168))
- **admin:** ⚠️ 改造 operation-team/merchant-manage/merchant-admin 列表页 ([f5b9c9c](https://github.com/ruan-cat/11comm/commit/f5b9c9c))
- **admin:** ⚠️ 已成功完成所有 report-configuration 模块的列表页改造任务 ([a0866da](https://github.com/ruan-cat/11comm/commit/a0866da))
- **admin:** ⚠️ 改造 property-manage/community-manage/house-decoration 列表页 ([cd46e09](https://github.com/ruan-cat/11comm/commit/cd46e09))
- **admin:** ⚠️ 改造 property-manage/community-manage/building-space-structure-diagram 列表页 ([8a2136d](https://github.com/ruan-cat/11comm/commit/8a2136d))
- **admin:** ⚠️ 完成 property-manage/community-manage 列表页的改造，更新任务状态为已完成并添加完成时间 ([d2f33c8](https://github.com/ruan-cat/11comm/commit/d2f33c8))
- **admin:** ⚠️ 改造 property-manage/community-manage/my 列表页 ([3eeb23c](https://github.com/ruan-cat/11comm/commit/3eeb23c))
- **admin:** ⚠️ 改造 property-manage/community-manage/parking-space-structure-diagram 列表页 ([a0b869c](https://github.com/ruan-cat/11comm/commit/a0b869c))
- **admin:** ⚠️ 完成 property-manage/contract-manage 模块的改造，更新任务状态为已完成并添加完成时间，新增合同变更和到期处理表单组件 ([6e92627](https://github.com/ruan-cat/11comm/commit/6e92627))
- **admin:** ⚠️ 改造 property-manage/contract-manage/expire 列表页 ([1037c4b](https://github.com/ruan-cat/11comm/commit/1037c4b))
- **admin:** ⚠️ 改造 property-manage/contract-manage/first-party 列表页 ([941129f](https://github.com/ruan-cat/11comm/commit/941129f))
- **admin:** ⚠️ 改造 property-manage/contract-manage/type 列表页 ([ad82dc8](https://github.com/ruan-cat/11comm/commit/ad82dc8))
- **admin:** ⚠️ 完成 property-manage/expense-manage 模块的改造，更新多个列表页的任务状态为已完成并添加完成时间，优化表单组件的字段属性和校验规则 ([53cd736](https://github.com/ruan-cat/11comm/commit/53cd736))
- **admin:** ⚠️ 改造 property-manage/expense-manage/water-and-electricity-meter-reading 列表页 ([fea3408](https://github.com/ruan-cat/11comm/commit/fea3408))
- **admin:** ⚠️ 改造 property-manage/expense-manage/vehicle-charge 列表页 ([4f96be8](https://github.com/ruan-cat/11comm/commit/4f96be8))
- **admin:** ⚠️ 改造 property-manage/expense-manage/reminder-for-overdue-payments 列表页 ([3823364](https://github.com/ruan-cat/11comm/commit/3823364))
- **admin:** ⚠️ 改造 property-manage/expense-manage/reprint-voucher 列表页 ([42d927f](https://github.com/ruan-cat/11comm/commit/42d927f))
- **admin:** ⚠️ 改造 property-manage/expense-manage/payment-review 列表页 ([ee6f6b0](https://github.com/ruan-cat/11comm/commit/ee6f6b0))
- **admin:** ⚠️ 改造 property-manage/expense-manage/refund-review 列表页 ([cc289d7](https://github.com/ruan-cat/11comm/commit/cc289d7))
- **admin:** ⚠️ 改造 property-manage/expense-manage/house-charge 列表页 ([d740484](https://github.com/ruan-cat/11comm/commit/d740484))
- **admin:** ⚠️ 改造 property-manage/expense-manage/house-charge 列表页 ([ab3a629](https://github.com/ruan-cat/11comm/commit/ab3a629))
- **admin:** ⚠️ 改造 property-manage/expense-manage/meter-reading-type 列表页 ([738f1bb](https://github.com/ruan-cat/11comm/commit/738f1bb))
- **admin:** ⚠️ 改造 property-manage/expense-manage/discount-type 列表页 ([daf55ed](https://github.com/ruan-cat/11comm/commit/daf55ed))
- **admin:** ⚠️ 改造 property-manage/expense-manage/expense-summary-table 列表页 ([b9e4936](https://github.com/ruan-cat/11comm/commit/b9e4936))
- **admin:** ⚠️ 改造 property-manage/expense-manage/discount-apply 列表页 ([d9cae33](https://github.com/ruan-cat/11comm/commit/d9cae33))
- **admin:** ⚠️ 改造 property-manage/expense-manage/discount-setting 列表页 ([2641773](https://github.com/ruan-cat/11comm/commit/2641773))
- **admin:** ⚠️ 改造 property-manage/expense-manage/contracte-charge 列表页 ([2c7e7bc](https://github.com/ruan-cat/11comm/commit/2c7e7bc))
- **admin:** ⚠️ 改造 property-manage/expense-manage/cancel-fee 列表页 ([2b5e0a1](https://github.com/ruan-cat/11comm/commit/2b5e0a1))
- ⚠️ 直接用 claude code 的文件，覆盖掉 gemini 的全局记忆文件。 ([0c7aaa6](https://github.com/ruan-cat/11comm/commit/0c7aaa6))
- **admin:** ⚠️ 改造 property-manage/expense-manage/cancel-fee 列表页 ([dc96218](https://github.com/ruan-cat/11comm/commit/dc96218))
- **admin:** ⚠️ 更新 property-manage/house-property-manage/house 列表页，修改状态为完成并优化表单逻辑 ([caaf337](https://github.com/ruan-cat/11comm/commit/caaf337))
- **admin:** ⚠️ 更新 property-manage/house-property-manage/invoice 列表页，修改状态为完成并优化表单和查询逻辑 ([a4ba32f](https://github.com/ruan-cat/11comm/commit/a4ba32f))
- ⚠️ 标记列表页迁移的任务都完成了。准备新建全新的任务。 ([bc8cee3](https://github.com/ruan-cat/11comm/commit/bc8cee3))
- **config,package.json,admin,claude:** ⚠️ 更新 prettier 配置，并且全量格式化一次； ([ab5da32](https://github.com/ruan-cat/11comm/commit/ab5da32))
- **claude:** ⚠️ 常见的 i18n 文本。纠正 AI 生成 key。 ([7ccb7dd](https://github.com/ruan-cat/11comm/commit/7ccb7dd))
- **claude:** ⚠️ 重点说明不允许项目执行多个任务，避免出现质量过低的情况。 ([ad23358](https://github.com/ruan-cat/11comm/commit/ad23358))
- **claude:** ⚠️ 获取技术栈对应的上下文 ([6652e0d](https://github.com/ruan-cat/11comm/commit/6652e0d))
- **claude:** ⚠️ 更新执行任务子代理的行为。 ([ab950b5](https://github.com/ruan-cat/11comm/commit/ab950b5))
- ⚠️ 对报告的一级标题做约束说明。 ([c81b85a](https://github.com/ruan-cat/11comm/commit/c81b85a))
- ⚠️ 增加报告日志信息的代码块语言的约束要求。 ([6ddb253](https://github.com/ruan-cat/11comm/commit/6ddb253))
- ⚠️ 设置 openspec 的项目规范。 ([a708b5c](https://github.com/ruan-cat/11comm/commit/a708b5c))
- **config:** ⚠️ 换回更加稳定的 changelog:conventional-changelog 。 ([f9ae81b](https://github.com/ruan-cat/11comm/commit/f9ae81b))
- **package.json:** ⚠️ 拓展可以删除的内容。 rimraf -g '\*\*/{dist,.turbo,.vercel,.output,.cache,.temp}' ([80a4cfe](https://github.com/ruan-cat/11comm/commit/80a4cfe))
- **package.json,admin:** ⚠️ 提供专用的运行命令，在 github 内运行，且携带指定的环境变量。 ([ffd6272](https://github.com/ruan-cat/11comm/commit/ffd6272))
- **package.json,admin:** ⚠️ 更新运行命令，在 github workflow 运行 nitro 预设 github 。 ([5340e94](https://github.com/ruan-cat/11comm/commit/5340e94))
- **package.json,prompt,admin:** ⚠️ 更新 cloudflare 部署时，专门使用 nitro 的 cloudflare worker 环境变量。 ([8fea669](https://github.com/ruan-cat/11comm/commit/8fea669))
- **package.json,admin:** ⚠️ 按照 AI 要求，安装一些列对等依赖。 ([a913afe](https://github.com/ruan-cat/11comm/commit/a913afe))
- **package.json:** ⚠️ 不需要通过降低版本的方式，解决 nitro 构建故障。 ([fbaf178](https://github.com/ruan-cat/11comm/commit/fbaf178))
- **config:** ⚠️ Bumpp 开始使用 commit-and-tag-version 实现后继钩子任务。 ([abe7ddd](https://github.com/ruan-cat/11comm/commit/abe7ddd))
- ⚠️ 关闭掉 commit-and-tag-version 的一部分默认行为。 ([9953565](https://github.com/ruan-cat/11comm/commit/9953565))
- **config,admin:** ⚠️ 模仿 create-nitro-app 新建的项目，初始化 nitro vite 插件配置。 ([88bcd97](https://github.com/ruan-cat/11comm/commit/88bcd97))
- **prompt,config,admin:** ⚠️ 配置 nitro 部署到 cloudflare worker 内 ([2c41183](https://github.com/ruan-cat/11comm/commit/2c41183))
- **config,admin:** ⚠️ 不指定写死的 nitro 构建预设。 ([3e408f7](https://github.com/ruan-cat/11comm/commit/3e408f7))

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
