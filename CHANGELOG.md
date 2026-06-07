## v1.3.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.2-beta.5...v1.3.0)

### ✨ 新增功能

- **api:** 新增数据库 seed 命令入口 ([f77df195](https://github.com/ruan-cat/11comm/commit/f77df195))
- **api:** 新增优惠券旧端只读接口 ([0083e3f0](https://github.com/ruan-cat/11comm/commit/0083e3f0))
- **api:** 新增巡检旧端接口适配 ([0af91b0c](https://github.com/ruan-cat/11comm/commit/0af91b0c))
- **api:** 新增抄表旧端接口适配 ([0f432a58](https://github.com/ruan-cat/11comm/commit/0f432a58))
- **api:** 新增物品放行旧端接口适配 ([a1d8f989](https://github.com/ruan-cat/11comm/commit/a1d8f989))
- **api:** 新增设备维保旧端接口适配 ([63c12893](https://github.com/ruan-cat/11comm/commit/63c12893))
- **api:** 新增房屋优惠申请旧端接口 ([6f7978f7](https://github.com/ruan-cat/11comm/commit/6f7978f7))
- **api:** 扩展费用充电设备旧端接口 ([fdbe5ed4](https://github.com/ruan-cat/11comm/commit/fdbe5ed4))
- **api:** 扩展报修旧端只读接口 ([98c056e6](https://github.com/ruan-cat/11comm/commit/98c056e6))
- **api:** 为活动旧端写接口加保护 ([b93cb08b](https://github.com/ruan-cat/11comm/commit/b93cb08b))
- **api:** 为个人中心旧端写接口加保护 ([97a06e0a](https://github.com/ruan-cat/11comm/commit/97a06e0a))
- **api:** 为访客审核旧端写接口加保护 ([86b16164](https://github.com/ruan-cat/11comm/commit/86b16164))
- **api:** 为工单旧端写接口加保护 ([88f9eda7](https://github.com/ruan-cat/11comm/commit/88f9eda7))
- **api:** 将 R2 配置纳入 ready 门禁 ([7cdb92b1](https://github.com/ruan-cat/11comm/commit/7cdb92b1))
- **api:** 支持关闭旧端 fallback 代理 ([6bda0eeb](https://github.com/ruan-cat/11comm/commit/6bda0eeb))
- **api:** 注册批量旧端迁移清单 ([416e5003](https://github.com/ruan-cat/11comm/commit/416e5003))
- **api:** 为保养旧端写接口加保护 ([2cdf2373](https://github.com/ruan-cat/11comm/commit/2cdf2373))
- **api:** 补齐卡券预约旧接口 exact 迁移 ([b21a91a5](https://github.com/ruan-cat/11comm/commit/b21a91a5))
- **api:** 补齐采购旧接口 exact 迁移 ([7db39e96](https://github.com/ruan-cat/11comm/commit/7db39e96))
- **api:** 补齐资源旧接口 exact 迁移 ([8cd0a27d](https://github.com/ruan-cat/11comm/commit/8cd0a27d))

### 🐞 修复缺陷

- **admin:** 避免上传 hash 引入 Node crypto ([de8149b4](https://github.com/ruan-cat/11comm/commit/de8149b4))

### 🦄 代码重构

- **app:** 本地化 mock 共享工具 ([1387b8a3](https://github.com/ruan-cat/11comm/commit/1387b8a3))
- **app:** 本地化活动保养抄表 mock ([1c91ea05](https://github.com/ruan-cat/11comm/commit/1c91ea05))
- **app:** 本地化预约投诉 mock ([9a1da00d](https://github.com/ruan-cat/11comm/commit/9a1da00d))
- **app:** 本地化卡券巡检放行 mock ([f444e313](https://github.com/ruan-cat/11comm/commit/f444e313))
- **app:** 本地化费用 mock ([8604a703](https://github.com/ruan-cat/11comm/commit/8604a703))
- **app:** 本地化楼栋房屋单元 mock ([fc7eb730](https://github.com/ruan-cat/11comm/commit/fc7eb730))
- **app:** 本地化 OA 流程 mock ([8c6a12f5](https://github.com/ruan-cat/11comm/commit/8c6a12f5))
- **app:** 本地化停车 mock ([0f06719d](https://github.com/ruan-cat/11comm/commit/0f06719d))
- **app:** 本地化业主资料 mock ([d66611df](https://github.com/ruan-cat/11comm/commit/d66611df))
- **app:** 本地化物业申请 mock ([4be46632](https://github.com/ruan-cat/11comm/commit/4be46632))
- **app:** 本地化采购员工装修 mock ([5102155d](https://github.com/ruan-cat/11comm/commit/5102155d))
- **app:** 本地化报修 mock ([d47f0ca8](https://github.com/ruan-cat/11comm/commit/d47f0ca8))
- **app:** 本地化资源预约 mock ([1b0544ec](https://github.com/ruan-cat/11comm/commit/1b0544ec))
- **app:** 本地化视频访客公告 mock ([24bd706f](https://github.com/ruan-cat/11comm/commit/24bd706f))
- **app:** 本地化工单测试 mock ([94e86db5](https://github.com/ruan-cat/11comm/commit/94e86db5))

### 📖 Documentation

- **admin:** 记录旧 Nitro 退役初步结论 ([3063dcff](https://github.com/ruan-cat/11comm/commit/3063dcff))
- **openspec:** 归档旧 Nitro 退役评审 ([19b9a31a](https://github.com/ruan-cat/11comm/commit/19b9a31a))
- **admin:** 更新统一 API 迁移指南 ([e3fb930d](https://github.com/ruan-cat/11comm/commit/e3fb930d))
- **openspec:** 建立旧 Nitro 退役执行门禁 ([a6016a8a](https://github.com/ruan-cat/11comm/commit/a6016a8a))
- **openspec:** 扩展旧 Nitro 退役任务规范 ([a2f9ac50](https://github.com/ruan-cat/11comm/commit/a2f9ac50))
- **openspec:** 刷新 app legacy 退役台账 ([8dcc72ae](https://github.com/ruan-cat/11comm/commit/8dcc72ae))
- **openspec:** 记录采购旧接口迁移证据 ([96d9191a](https://github.com/ruan-cat/11comm/commit/96d9191a))

### 🔨 构建相关

- **admin:** 退役内置 Nitro 构建入口 ([0b5839f8](https://github.com/ruan-cat/11comm/commit/0b5839f8))
- **scripts:** 将任务生成器指向 apps-api ([a7128cb6](https://github.com/ruan-cat/11comm/commit/a7128cb6))
- **app:** 将 Nitro 联调脚本指向统一 API ([4755af44](https://github.com/ruan-cat/11comm/commit/4755af44))
- **app:** 移除内置 Nitro 构建配置 ([e0aba784](https://github.com/ruan-cat/11comm/commit/e0aba784))

### 🏡 Chore

- 设计提示词，标记待办任务。 ([98c2370d](https://github.com/ruan-cat/11comm/commit/98c2370d))

### ✅ Tests

- **api:** 补齐旧端运行时注册测试 ([b2121165](https://github.com/ruan-cat/11comm/commit/b2121165))
- **api:** 补齐旧服务退役门禁 ([39e25a46](https://github.com/ruan-cat/11comm/commit/39e25a46))
- **app:** 覆盖员工列表分组回归 ([55c7dc9a](https://github.com/ruan-cat/11comm/commit/55c7dc9a))
- **api:** 覆盖卡券旧接口 exact 迁移边界 ([d677a6ba](https://github.com/ruan-cat/11comm/commit/d677a6ba))
- **api:** 覆盖采购旧接口 exact 迁移边界 ([54da761a](https://github.com/ruan-cat/11comm/commit/54da761a))
- **api:** 覆盖资源旧接口 exact 迁移边界 ([669808c8](https://github.com/ruan-cat/11comm/commit/669808c8))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.2-beta.5

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.2-beta.4...v1.2.2-beta.5)

### 🐞 修复缺陷

- **admin:** 收敛自动路由与登录令牌写入 ([ef99971c](https://github.com/ruan-cat/11comm/commit/ef99971c))

### 🦄 代码重构

- **admin-api:** 收敛空查询参数类型 ([015e5a3e](https://github.com/ruan-cat/11comm/commit/015e5a3e))
- **admin-ui:** 清理表单与页面层类型噪音 ([c36f26fc](https://github.com/ruan-cat/11comm/commit/c36f26fc))
- **admin-shared:** 清理公共工具未使用引用 ([437f8cfc](https://github.com/ruan-cat/11comm/commit/437f8cfc))

### 📖 Documentation

- **openspec:** 记录 Phase7 最终验证与退役边界 ([64af91e6](https://github.com/ruan-cat/11comm/commit/64af91e6))

### 🔨 构建相关

- **admin:** 清理构建插件未使用导入 ([c84f43db](https://github.com/ruan-cat/11comm/commit/c84f43db))

### ✅ Tests

- **admin:** 稳定默认 Vitest 运行边界 ([34cb4c99](https://github.com/ruan-cat/11comm/commit/34cb4c99))
- **admin:** 清理旧 API smoke 测试导入 ([6ba45c83](https://github.com/ruan-cat/11comm/commit/6ba45c83))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.2-beta.4

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.2-beta.3...v1.2.2-beta.4)

### 📖 Documentation

- **openspec:** 记录长任务前驱门进度 ([c65fd2ba](https://github.com/ruan-cat/11comm/commit/c65fd2ba))
- **openspec:** 记录 Drizzle 接管前置审计边界 ([70068ef1](https://github.com/ruan-cat/11comm/commit/70068ef1))
- **type:** 同步 Drizzle 迁移入口说明 ([d0eacb1d](https://github.com/ruan-cat/11comm/commit/d0eacb1d))
- **skills:** 规范 schema 变更迁移入口 ([e27311a6](https://github.com/ruan-cat/11comm/commit/e27311a6))
- **type-project:** 更新基础设施 Drizzle 参考 ([eb86a7ad](https://github.com/ruan-cat/11comm/commit/eb86a7ad))
- **nitro:** 指向 api 子包服务端入口 ([cf3f2e1f](https://github.com/ruan-cat/11comm/commit/cf3f2e1f))
- **admin:** ⚠️ 将数据库运维入口改为 api ([09adaacc](https://github.com/ruan-cat/11comm/commit/09adaacc))
- **env:** ⚠️ 标注 api 数据库命令边界 ([a9c95785](https://github.com/ruan-cat/11comm/commit/a9c95785))
- **schema:** ⚠️ 将 schema 工作流迁移到 api ([6ed18677](https://github.com/ruan-cat/11comm/commit/6ed18677))
- **seed:** 收窄 admin seed 兼容说明 ([6d9838a3](https://github.com/ruan-cat/11comm/commit/6d9838a3))
- **openspec:** 记录 Drizzle 接管任务进度 ([1cb0d35e](https://github.com/ruan-cat/11comm/commit/1cb0d35e))
- **ai-memory:** ⚠️ 将迁移生成入口切换到 api ([0b13ce03](https://github.com/ruan-cat/11comm/commit/0b13ce03))
- **openspec:** 关闭 Drizzle 接管复核记录 ([4c71ca37](https://github.com/ruan-cat/11comm/commit/4c71ca37))

### ✅ Tests

- **api:** 覆盖 Drizzle 配置接管约束 ([d683ee3e](https://github.com/ruan-cat/11comm/commit/d683ee3e))

### 🔧 更新配置

- **api:** 增加 Drizzle Kit 运维入口 ([72ed6f4b](https://github.com/ruan-cat/11comm/commit/72ed6f4b))
- **api:** 承接 Drizzle 迁移历史 ([53ff8731](https://github.com/ruan-cat/11comm/commit/53ff8731))
- **admin:** ⚠️ 降级 admin DB 运维入口为兼容路径 ([1154d0de](https://github.com/ruan-cat/11comm/commit/1154d0de))

#### ⚠️ Breaking Changes

- **admin:** ⚠️ 将数据库运维入口改为 api ([09adaacc](https://github.com/ruan-cat/11comm/commit/09adaacc))
- **env:** ⚠️ 标注 api 数据库命令边界 ([a9c95785](https://github.com/ruan-cat/11comm/commit/a9c95785))
- **schema:** ⚠️ 将 schema 工作流迁移到 api ([6ed18677](https://github.com/ruan-cat/11comm/commit/6ed18677))
- **ai-memory:** ⚠️ 将迁移生成入口切换到 api ([0b13ce03](https://github.com/ruan-cat/11comm/commit/0b13ce03))
- **admin:** ⚠️ 降级 admin DB 运维入口为兼容路径 ([1154d0de](https://github.com/ruan-cat/11comm/commit/1154d0de))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.2-beta.3

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.2-beta.2...v1.2.2-beta.3)

### ✨ 新增功能

- 支持 admin shadow-off 直连独立 API ([b4204976](https://github.com/ruan-cat/11comm/commit/b4204976))

### 🐞 修复缺陷

- 修复合同变更列表查询与新增关联 ([1ddb0078](https://github.com/ruan-cat/11comm/commit/1ddb0078))
- 清理已完成的合同上传对象残留 ([430f15eb](https://github.com/ruan-cat/11comm/commit/430f15eb))

### 📖 Documentation

- 记录 Phase7 页面证据与退役台账 ([7b6d1b48](https://github.com/ruan-cat/11comm/commit/7b6d1b48))
- ⚠️ 固化 Phase7 前驱排雷门禁 ([1450bcc3](https://github.com/ruan-cat/11comm/commit/1450bcc3))
- 记录 Phase7 接力风险与提示词 ([bcc919de](https://github.com/ruan-cat/11comm/commit/bcc919de))

### ✅ Tests

- 补齐报表与费用独立 API 解析验证 ([7e8ef749](https://github.com/ruan-cat/11comm/commit/7e8ef749))

#### ⚠️ Breaking Changes

- ⚠️ 固化 Phase7 前驱排雷门禁 ([1450bcc3](https://github.com/ruan-cat/11comm/commit/1450bcc3))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.2-beta.2

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.2-beta.1...v1.2.2-beta.2)

### ✨ 新增功能

- **api-contract:** 接入合同附件 R2 上传服务 ([84ef0574](https://github.com/ruan-cat/11comm/commit/84ef0574))
- **api-setting:** 完善系统管理写入适配 ([c06f404d](https://github.com/ruan-cat/11comm/commit/c06f404d))
- **admin-config:** 接入配置管理真实接口 ([027e56e3](https://github.com/ruan-cat/11comm/commit/027e56e3))
- **admin-setting:** 接入系统管理真实接口 ([c6f8c6d6](https://github.com/ruan-cat/11comm/commit/c6f8c6d6))

### 🦄 代码重构

- **record-bug-fix-memory:** ⚠️ 拆分事故记忆为双层存储 ([917a19ae](https://github.com/ruan-cat/11comm/commit/917a19ae))

### 📖 Documentation

- **ai-memory:** 同步根级 AI 记忆文件 ([3967e24c](https://github.com/ruan-cat/11comm/commit/3967e24c))
- **openspec:** 补充 Neon 读写验证规范 ([ee5a1db0](https://github.com/ruan-cat/11comm/commit/ee5a1db0))
- **openspec:** 记录长任务接力进度 ([b5238dcb](https://github.com/ruan-cat/11comm/commit/b5238dcb))

### 🏡 Chore

- **prompt,admin:** 格式化。 ([0f683bd0](https://github.com/ruan-cat/11comm/commit/0f683bd0))
- **prompt,admin:** 继续推进进度。 ([a1c3a694](https://github.com/ruan-cat/11comm/commit/a1c3a694))

### ✅ Tests

- **api-contract:** 补充上传与草稿删除验证 ([ba5b0145](https://github.com/ruan-cat/11comm/commit/ba5b0145))
- **api-setting:** 补充系统管理写入用例 ([a59934c0](https://github.com/ruan-cat/11comm/commit/a59934c0))
- **runtime:** 覆盖 fallback 关闭与地址解析 ([26aa009f](https://github.com/ruan-cat/11comm/commit/26aa009f))
- **admin-config:** 补充配置管理接线验证 ([794328b9](https://github.com/ruan-cat/11comm/commit/794328b9))
- **admin-setting:** 补充系统管理接线验证 ([8af18109](https://github.com/ruan-cat/11comm/commit/8af18109))
- **admin-report:** 补充报表 shadow 边界验证 ([057eb37e](https://github.com/ruan-cat/11comm/commit/057eb37e))

### 🔧 更新配置

- **api:** 忽略 Vercel 本地目录 ([bf8c322c](https://github.com/ruan-cat/11comm/commit/bf8c322c))

#### ⚠️ Breaking Changes

- **record-bug-fix-memory:** ⚠️ 拆分事故记忆为双层存储 ([917a19ae](https://github.com/ruan-cat/11comm/commit/917a19ae))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.2-beta.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.1...v1.2.2-beta.1)

### ✨ 新增功能

- **api-app-legacy:** 接入 phase7 app 业务模块运行时 ([459e6ebf](https://github.com/ruan-cat/11comm/commit/459e6ebf))
- **app-runtime:** 放行 phase7 app 只读 shadow 端点 ([af5672f7](https://github.com/ruan-cat/11comm/commit/af5672f7))

### 🐞 修复缺陷

- **admin-contract:** 统一草稿合同接口基址解析 ([753cb017](https://github.com/ruan-cat/11comm/commit/753cb017))

### 📖 Documentation

- **openspec:** 更新 phase7 长任务进度与阻断记录 ([52319008](https://github.com/ruan-cat/11comm/commit/52319008))
- **openspec:** 建立旧服务退役台账 ([98f28a60](https://github.com/ruan-cat/11comm/commit/98f28a60))

### ✅ Tests

- **api-app-legacy:** 补齐 phase7 legacy 契约回归 ([72ea39f7](https://github.com/ruan-cat/11comm/commit/72ea39f7))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.1-beta.1...v1.2.1)

### ✨ 新增功能

- 补齐合同类型列表统一接口证据 ([ff73478d](https://github.com/ruan-cat/11comm/commit/ff73478d))
- **app:** 固化 App 影子放行与 runtime-base 路由 ([0e7f11cf](https://github.com/ruan-cat/11comm/commit/0e7f11cf))

### 🦄 代码重构

- **api:** 统一 App 旧端点分层与输入合并 ([534612dc](https://github.com/ruan-cat/11comm/commit/534612dc))

### 📖 Documentation

- **openspec:** 增加任务树纠偏与动态补全设计 ([7f06aba9](https://github.com/ruan-cat/11comm/commit/7f06aba9))
- **openspec:** 收敛长任务实施优先队列 ([a3c0e3c8](https://github.com/ruan-cat/11comm/commit/a3c0e3c8))
- **openspec:** 强化长任务收尾与接口自检规范 ([b63861dd](https://github.com/ruan-cat/11comm/commit/b63861dd))

### ✅ Tests

- **api:** 固化 App 旧端点清单与契约回归 ([06d822d9](https://github.com/ruan-cat/11comm/commit/06d822d9))
- **api:** 固化活动端点未完成边界 ([06fa62b7](https://github.com/ruan-cat/11comm/commit/06fa62b7))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.1-beta.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.2.0...v1.2.1-beta.1)

### ✨ 新增功能

- **api:** 扩展 Phase7 admin 接口清单 ([25f32a75](https://github.com/ruan-cat/11comm/commit/25f32a75))

### 🐞 修复缺陷

- **api:** ⚠️ 阻断合同上传占位成功响应 ([d65d01e3](https://github.com/ruan-cat/11comm/commit/d65d01e3))

### 📖 Documentation

- **codex:** 记录 goal 暂停复盘与使用提示 ([35452837](https://github.com/ruan-cat/11comm/commit/35452837))
- **openspec:** 补齐 Phase7 证据审计记录 ([8adc7b77](https://github.com/ruan-cat/11comm/commit/8adc7b77))

### ✅ Tests

- **phase7:** 补充 admin 接口迁移覆盖 ([95f352b0](https://github.com/ruan-cat/11comm/commit/95f352b0))

#### ⚠️ Breaking Changes

- **api:** ⚠️ 阻断合同上传占位成功响应 ([d65d01e3](https://github.com/ruan-cat/11comm/commit/d65d01e3))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.2.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.6...v1.2.0)

### 📖 Documentation

- **openspec:** ⚠️ 建立 Phase7 统一 Nitro 迁移任务体系 ([3f4cec16](https://github.com/ruan-cat/11comm/commit/3f4cec16))
- **superpowers:** ⚠️ 将 Phase7 历史入口指向 OpenSpec ([f95583c5](https://github.com/ruan-cat/11comm/commit/f95583c5))
- **prompts:** 更新 Phase7 OpenSpec 迁移提示 ([5f72732a](https://github.com/ruan-cat/11comm/commit/5f72732a))
- **openspec:** ⚠️ 建立 Phase7 长任务 canonical 体系 ([ffbf20f4](https://github.com/ruan-cat/11comm/commit/ffbf20f4))
- **superpowers:** ⚠️ 退场 Phase7 旧任务载体 ([c4ed26ca](https://github.com/ruan-cat/11comm/commit/c4ed26ca))

#### ⚠️ Breaking Changes

- **openspec:** ⚠️ 建立 Phase7 统一 Nitro 迁移任务体系 ([3f4cec16](https://github.com/ruan-cat/11comm/commit/3f4cec16))
- **superpowers:** ⚠️ 将 Phase7 历史入口指向 OpenSpec ([f95583c5](https://github.com/ruan-cat/11comm/commit/f95583c5))
- **openspec:** ⚠️ 建立 Phase7 长任务 canonical 体系 ([ffbf20f4](https://github.com/ruan-cat/11comm/commit/ffbf20f4))
- **superpowers:** ⚠️ 退场 Phase7 旧任务载体 ([c4ed26ca](https://github.com/ruan-cat/11comm/commit/c4ed26ca))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.1.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.6...v1.1.1)

### 📖 Documentation

- **openspec:** ⚠️ 建立 Phase7 统一 Nitro 迁移任务体系 ([3f4cec16](https://github.com/ruan-cat/11comm/commit/3f4cec16))
- **superpowers:** ⚠️ 将 Phase7 历史入口指向 OpenSpec ([f95583c5](https://github.com/ruan-cat/11comm/commit/f95583c5))
- **prompts:** 更新 Phase7 OpenSpec 迁移提示 ([5f72732a](https://github.com/ruan-cat/11comm/commit/5f72732a))
- **openspec:** ⚠️ 建立 Phase7 长任务 canonical 体系 ([ffbf20f4](https://github.com/ruan-cat/11comm/commit/ffbf20f4))
- **superpowers:** ⚠️ 退场 Phase7 旧任务载体 ([c4ed26ca](https://github.com/ruan-cat/11comm/commit/c4ed26ca))

#### ⚠️ Breaking Changes

- **openspec:** ⚠️ 建立 Phase7 统一 Nitro 迁移任务体系 ([3f4cec16](https://github.com/ruan-cat/11comm/commit/3f4cec16))
- **superpowers:** ⚠️ 将 Phase7 历史入口指向 OpenSpec ([f95583c5](https://github.com/ruan-cat/11comm/commit/f95583c5))
- **openspec:** ⚠️ 建立 Phase7 长任务 canonical 体系 ([ffbf20f4](https://github.com/ruan-cat/11comm/commit/ffbf20f4))
- **superpowers:** ⚠️ 退场 Phase7 旧任务载体 ([c4ed26ca](https://github.com/ruan-cat/11comm/commit/c4ed26ca))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.1.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.6...v1.1.0)

### 📖 Documentation

- **openspec:** ⚠️ 建立 Phase7 统一 Nitro 迁移任务体系 ([3f4cec16](https://github.com/ruan-cat/11comm/commit/3f4cec16))
- **superpowers:** ⚠️ 将 Phase7 历史入口指向 OpenSpec ([f95583c5](https://github.com/ruan-cat/11comm/commit/f95583c5))
- **prompts:** 更新 Phase7 OpenSpec 迁移提示 ([5f72732a](https://github.com/ruan-cat/11comm/commit/5f72732a))
- **openspec:** ⚠️ 建立 Phase7 长任务 canonical 体系 ([ffbf20f4](https://github.com/ruan-cat/11comm/commit/ffbf20f4))
- **superpowers:** ⚠️ 退场 Phase7 旧任务载体 ([c4ed26ca](https://github.com/ruan-cat/11comm/commit/c4ed26ca))

#### ⚠️ Breaking Changes

- **openspec:** ⚠️ 建立 Phase7 统一 Nitro 迁移任务体系 ([3f4cec16](https://github.com/ruan-cat/11comm/commit/3f4cec16))
- **superpowers:** ⚠️ 将 Phase7 历史入口指向 OpenSpec ([f95583c5](https://github.com/ruan-cat/11comm/commit/f95583c5))
- **openspec:** ⚠️ 建立 Phase7 长任务 canonical 体系 ([ffbf20f4](https://github.com/ruan-cat/11comm/commit/ffbf20f4))
- **superpowers:** ⚠️ 退场 Phase7 旧任务载体 ([c4ed26ca](https://github.com/ruan-cat/11comm/commit/c4ed26ca))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.2-beta.6

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.5...v1.0.2-beta.6)

### ✨ 新增功能

- **report-manage:** ⚠️ 接入费用汇总表独立 Nitro 链路 ([614e8f07](https://github.com/ruan-cat/11comm/commit/614e8f07))
- **api:** 补齐阶段 7 admin 列表运行时清单 ([6696f3f1](https://github.com/ruan-cat/11comm/commit/6696f3f1))

### 📖 Documentation

- **phase7:** 同步费用汇总表迁移进度 ([04a8e56c](https://github.com/ruan-cat/11comm/commit/04a8e56c))
- **phase7:** 记录 admin 列表迁移接力状态 ([6bf1dbc2](https://github.com/ruan-cat/11comm/commit/6bf1dbc2))

### ✅ Tests

- **report-manage:** 覆盖费用汇总表迁移链路 ([121f7c00](https://github.com/ruan-cat/11comm/commit/121f7c00))
- **api:** 覆盖阶段 7 admin 列表护栏 ([f722833a](https://github.com/ruan-cat/11comm/commit/f722833a))

### 🔧 更新配置

- **admin:** 修复 Windows 开发服务启动 ([9c2a62c0](https://github.com/ruan-cat/11comm/commit/9c2a62c0))

#### ⚠️ Breaking Changes

- **report-manage:** ⚠️ 接入费用汇总表独立 Nitro 链路 ([614e8f07](https://github.com/ruan-cat/11comm/commit/614e8f07))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.2-beta.5

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.4...v1.0.2-beta.5)

### ✨ 新增功能

- **admin:** ⚠️ 完成全部 admin 前端 hook resolver 迁移至 resolveAdminApiRequestUrl ([a80ade31](https://github.com/ruan-cat/11comm/commit/a80ade31))
- **api:** 补齐 repairs-manage 3 个缺失路由实现 ([1b5a076b](https://github.com/ruan-cat/11comm/commit/1b5a076b))
- **api:** 补齐 admin 48 个未覆盖旧路径的 CRUD route 实现 ([770fd33c](https://github.com/ruan-cat/11comm/commit/770fd33c))
- **api:** Dev-team/config-manage 16 个 CRUD 方法接入真实 Drizzle DB ([c804084f](https://github.com/ruan-cat/11comm/commit/c804084f))
- **api:** Setting-manage/system-manage 15 个 CUD 方法接入真实 Drizzle DB ([2e63a94a](https://github.com/ruan-cat/11comm/commit/2e63a94a))
- **api:** Contract-manage change/draft-contract 8 个 CRUD 方法接入真实 Drizzle DB ([1c62c1eb](https://github.com/ruan-cat/11comm/commit/1c62c1eb))

### 🐞 修复缺陷

- **api:** 修复 callComponent/core/list 无限递归 bug ([69e6c019](https://github.com/ruan-cat/11comm/commit/69e6c019))

### 📖 Documentation

- **phase7:** 更新批量迁移计划进度与接力摘要 ([a4479a1c](https://github.com/ruan-cat/11comm/commit/a4479a1c))
- **phase7:** 记录 Chrome MCP 页面 Network 验证 44/44 通过 ([058a9680](https://github.com/ruan-cat/11comm/commit/058a9680))
- **phase7:** 记录 Neon main DB_READY 验收通过 ([0a68f7d7](https://github.com/ruan-cat/11comm/commit/0a68f7d7))
- **phase7:** 记录 shadow-off/fallback 演练 44/44 通过 ([b3c94e2f](https://github.com/ruan-cat/11comm/commit/b3c94e2f))
- **phase7:** 更新矩阵和计划进度，记录 48 个 CRUD route 覆盖完成 ([f9d0fe6d](https://github.com/ruan-cat/11comm/commit/f9d0fe6d))
- **phase7:** 记录 39 个 CRUD/CUD DB 实现、HTTP gate 验证和 Upload R2 评审结论 ([1969bbac](https://github.com/ruan-cat/11comm/commit/1969bbac))

#### ⚠️ Breaking Changes

- **admin:** ⚠️ 完成全部 admin 前端 hook resolver 迁移至 resolveAdminApiRequestUrl ([a80ade31](https://github.com/ruan-cat/11comm/commit/a80ade31))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.2-beta.4

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.3...v1.0.2-beta.4)

### ✨ 新增功能

- **api:** Phase7 批量迁移 admin 接口至独立 Nitro API server ([6b7c9264](https://github.com/ruan-cat/11comm/commit/6b7c9264))
- **api:** 接入 Phase7 报表管理 P1 只读端点 ([b819a760](https://github.com/ruan-cat/11comm/commit/b819a760))
- **admin:** Operation-team 全模块接入 shadow resolver ([2b59b02d](https://github.com/ruan-cat/11comm/commit/2b59b02d))
- **admin:** Expense-manage 全模块接入 shadow resolver ([3fb19700](https://github.com/ruan-cat/11comm/commit/3fb19700))
- **admin:** Setting-manage 与 dev-team 接入 shadow resolver ([eff30705](https://github.com/ruan-cat/11comm/commit/eff30705))

### 🐞 修复缺陷

- **api:** 补齐报表 P1 端点过滤验收 ([6fb9cd2a](https://github.com/ruan-cat/11comm/commit/6fb9cd2a))
- **admin:** 接入报表列表 shadow resolver ([8881ab74](https://github.com/ruan-cat/11comm/commit/8881ab74))
- **admin:** 接入系统设置列表 shadow resolver ([774a730c](https://github.com/ruan-cat/11comm/commit/774a730c))
- **admin:** 接入开发配置列表 shadow resolver ([1889e243](https://github.com/ruan-cat/11comm/commit/1889e243))
- **admin:** 修正物业管理公司页面误用 property-company hook ([7afb0e53](https://github.com/ruan-cat/11comm/commit/7afb0e53))
- **api:** 修正 report-manage P1 端点字段映射与过滤条件 ([87d2cd37](https://github.com/ruan-cat/11comm/commit/87d2cd37))

### 📖 Documentation

- **phase7:** 重写阶段 7 矩阵与接力计划口径 ([e3b377fa](https://github.com/ruan-cat/11comm/commit/e3b377fa))
- **phase7:** 同步接力进度快照 ([ee212e25](https://github.com/ruan-cat/11comm/commit/ee212e25))
- **phase7:** 更新迁移计划进度与端点矩阵 ([3e527718](https://github.com/ruan-cat/11comm/commit/3e527718))

### 🔧 更新配置

- **memorix:** 移除高频噪音 hooks 配置，仅保留会话生命周期事件 ([9bacce29](https://github.com/ruan-cat/11comm/commit/9bacce29))
- 统一添加 package.json 的 author 字段 ([a05b1cf6](https://github.com/ruan-cat/11comm/commit/a05b1cf6))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.2-beta.3

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.2...v1.0.2-beta.3)

### ✨ 新增功能

- **api:** 接入 Phase7 巡检与车位只读端点 ([8a752fda](https://github.com/ruan-cat/11comm/commit/8a752fda))

### 🐞 修复缺陷

- **admin:** 修正 Phase7 页面 API 地址解析 ([3409b52a](https://github.com/ruan-cat/11comm/commit/3409b52a))
- **admin:** 补齐账号设置返回菜单索引 ([0bdc0dad](https://github.com/ruan-cat/11comm/commit/0bdc0dad))

### 📖 Documentation

- **phase7:** 更新迁移接力与 Neon main 验收方案 ([cf85abbd](https://github.com/ruan-cat/11comm/commit/cf85abbd))

### ✅ Tests

- **api:** 补充 Phase7 巡检与车位迁移测试 ([ab9c6a55](https://github.com/ruan-cat/11comm/commit/ab9c6a55))
- **admin:** 覆盖 Phase7 shadow 地址解析 ([dd5043dd](https://github.com/ruan-cat/11comm/commit/dd5043dd))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.2-beta.2

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.2-beta.1...v1.0.2-beta.2)

### ✨ 新增功能

- **api:** ⚠️ 接入 Phase7 admin P1 只读端点批量迁移，新增 17 个 canonical route ([47ecb60f](https://github.com/ruan-cat/11comm/commit/47ecb60f))
- **api:** ⚠️ 接入 Phase7 expense-manage 剩余 5 个 P1 端点 ([81c3c9fa](https://github.com/ruan-cat/11comm/commit/81c3c9fa))
- **api:** ⚠️ 接入 Phase7 admin P2 house-property-manage 与 community-manage 模块 ([09f86e0e](https://github.com/ruan-cat/11comm/commit/09f86e0e))
- **api:** ⚠️ 补全 house-property-manage 路由并新增 patrol-manage 模块 ([429f5392](https://github.com/ruan-cat/11comm/commit/429f5392))

### 📖 Documentation

- **superpowers:** 记录 Phase7 接力进度 ([fce573c2](https://github.com/ruan-cat/11comm/commit/fce573c2))
- **superpowers:** 更新 Phase7 迁移矩阵、计划和综合报告至 Batch 6a/b/c 完成状态 ([ea3d83d0](https://github.com/ruan-cat/11comm/commit/ea3d83d0))
- **superpowers:** 更新 Phase7 接力进度至 Batch 7a 完成状态 ([13e0cbd6](https://github.com/ruan-cat/11comm/commit/13e0cbd6))
- **superpowers:** 最终更新 Phase7 计划、设计和接力快照 ([e89f2c49](https://github.com/ruan-cat/11comm/commit/e89f2c49))

#### ⚠️ Breaking Changes

- **api:** ⚠️ 接入 Phase7 admin P1 只读端点批量迁移，新增 17 个 canonical route ([47ecb60f](https://github.com/ruan-cat/11comm/commit/47ecb60f))
- **api:** ⚠️ 接入 Phase7 expense-manage 剩余 5 个 P1 端点 ([81c3c9fa](https://github.com/ruan-cat/11comm/commit/81c3c9fa))
- **api:** ⚠️ 接入 Phase7 admin P2 house-property-manage 与 community-manage 模块 ([09f86e0e](https://github.com/ruan-cat/11comm/commit/09f86e0e))
- **api:** ⚠️ 补全 house-property-manage 路由并新增 patrol-manage 模块 ([429f5392](https://github.com/ruan-cat/11comm/commit/429f5392))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.2-beta.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.9...v1.0.2-beta.1)

### ✨ 新增功能

- **api:** ⚠️ 接入 Phase7 legacy 只读端点迁移 ([26d18de2](https://github.com/ruan-cat/11comm/commit/26d18de2))

### 🐞 修复缺陷

- **app:** 稳定 maintenance mock 任务状态 ([288f466a](https://github.com/ruan-cat/11comm/commit/288f466a))

### 📖 Documentation

- **superpowers:** 完成阶段 7 分批次迁移计划与整合探索报告 ([611c5f99](https://github.com/ruan-cat/11comm/commit/611c5f99))
- **superpowers:** 更新 Phase7 批量迁移进度矩阵 ([828a019e](https://github.com/ruan-cat/11comm/commit/828a019e))

### ✅ Tests

- **api:** 补充 Phase7 legacy 迁移回归覆盖 ([5873a123](https://github.com/ruan-cat/11comm/commit/5873a123))

#### ⚠️ Breaking Changes

- **api:** ⚠️ 接入 Phase7 legacy 只读端点迁移 ([26d18de2](https://github.com/ruan-cat/11comm/commit/26d18de2))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.9

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.8...v1.0.1-beta.9)

### 🔧 更新配置

- **pnpm:** 启用工作区依赖提升兼容 pnpm v11 ([a5ec5bd9](https://github.com/ruan-cat/11comm/commit/a5ec5bd9))
- **turbo:** 同步 Vercel 构建环境变量白名单 ([cfafb4a2](https://github.com/ruan-cat/11comm/commit/cfafb4a2))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.8

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.7...v1.0.1-beta.8)

### 📖 Documentation

- **ai:** 补充生产环境地址来源规范 ([44510741](https://github.com/ruan-cat/11comm/commit/44510741))
- 新增生产环境地址对照表与项目结构说明 ([5c29a3c2](https://github.com/ruan-cat/11comm/commit/5c29a3c2))
- **phase7:** 追加生产三端复验结论与退役卡点清单 ([ca0e56a6](https://github.com/ruan-cat/11comm/commit/ca0e56a6))
- **migration:** 更新 phase2 迁移计划文档 ([03dbc36c](https://github.com/ruan-cat/11comm/commit/03dbc36c))

### 🔧 更新配置

- **app:** 更新 homepage 为生产域名 ([9a9251e4](https://github.com/ruan-cat/11comm/commit/9a9251e4))
- **workspace:** 更新 pnpm-workspace 配置并清理冗余锁文件 ([00c1a692](https://github.com/ruan-cat/11comm/commit/00c1a692))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.7

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.6...v1.0.1-beta.7)

### ✨ 新增功能

- **api:** 接入 Phase7 运行时兜底链路 ([049b8185](https://github.com/ruan-cat/11comm/commit/049b8185))

### 📖 Documentation

- **api:** 更新 Phase7 生产接入记录 ([6bd88441](https://github.com/ruan-cat/11comm/commit/6bd88441))

### 🔨 构建相关

- **app:** 添加 Vercel H5 构建入口 ([807ee16e](https://github.com/ruan-cat/11comm/commit/807ee16e))

### ✅ Tests

- **api:** 覆盖 Phase7 运行时契约 ([9f4c9f93](https://github.com/ruan-cat/11comm/commit/9f4c9f93))
- **app:** 覆盖生产统一 server 地址解析 ([32a54e9e](https://github.com/ruan-cat/11comm/commit/32a54e9e))
- **admin:** 补充物业表单接线用例 ([74a8f5a2](https://github.com/ruan-cat/11comm/commit/74a8f5a2))

### 🔧 更新配置

- **api:** 设置 Nitro 服务主页地址 ([0ab51b08](https://github.com/ruan-cat/11comm/commit/0ab51b08))
- **api:** 切换生产环境 API 配置 ([ee172363](https://github.com/ruan-cat/11comm/commit/ee172363))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.6

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.5...v1.0.1-beta.6)

### ✨ 新增功能

- **api:** 增加 Nitro 环境变量观测接口 ([fbef591b](https://github.com/ruan-cat/11comm/commit/fbef591b))

### 📖 Documentation

- **vercel:** 编写 Nitro 独立部署方案 ([1ec7a387](https://github.com/ruan-cat/11comm/commit/1ec7a387))

### 🔨 构建相关

- **api:** 串联 Nitro Vercel 构建产物搬运 ([88d65603](https://github.com/ruan-cat/11comm/commit/88d65603))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.5

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.4...v1.0.1-beta.5)

### ✨ 新增功能

- **admin:** 接入统一 API shadow 切流 ([eaed1c8f](https://github.com/ruan-cat/11comm/commit/eaed1c8f))

### 📖 Documentation

- **api-migration:** 补充 Phase6 计划与 Phase7 门禁 ([22da5b95](https://github.com/ruan-cat/11comm/commit/22da5b95))

### ✅ Tests

- **api-migration:** 补齐 legacy shadow 契约测试 ([850c97f1](https://github.com/ruan-cat/11comm/commit/850c97f1))

### 🔧 更新配置

- **app:** 修复 H5 lint 提交前校验 ([d3e7af1a](https://github.com/ruan-cat/11comm/commit/d3e7af1a))
- **app:** 配置统一 API shadow 环境 ([37ff767a](https://github.com/ruan-cat/11comm/commit/37ff767a))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.4

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.3...v1.0.1-beta.4)

### ✨ 新增功能

- **api:** 迁移费用管理 Phase5 后台接口 ([bad86f7c](https://github.com/ruan-cat/11comm/commit/bad86f7c))
- **admin:** 接入费用管理 Phase5 影子接口 ([6a4d268e](https://github.com/ruan-cat/11comm/commit/6a4d268e))

### 📖 Documentation

- **api-migration:** 记录 Phase5 完成门禁 ([b142ef63](https://github.com/ruan-cat/11comm/commit/b142ef63))

### ✅ Tests

- **api:** 补充费用管理 Phase5 后端验证 ([1fd7d4c0](https://github.com/ruan-cat/11comm/commit/1fd7d4c0))
- **admin:** 补充费用管理 Phase5 hook 测试 ([e584dc64](https://github.com/ruan-cat/11comm/commit/e584dc64))

### 🔧 更新配置

- **admin:** 增加 API 影子代理中间件 ([148e344c](https://github.com/ruan-cat/11comm/commit/148e344c))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.3

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.2...v1.0.1-beta.3)

### ✨ 新增功能

- **api:** 迁入 repair Wave4A 最小兼容切片 ([e55ed2ee](https://github.com/ruan-cat/11comm/commit/e55ed2ee))

### 📖 Documentation

- **cloudbase:** 整理小程序登录与文件服务方案 ([96ec53a3](https://github.com/ruan-cat/11comm/commit/96ec53a3))
- **api:** 完成 Phase4 迁移计划与响应格式调研 ([12e08437](https://github.com/ruan-cat/11comm/commit/12e08437))

### ✅ Tests

- **api:** 覆盖 repair Wave4A 迁移门禁 ([e9959632](https://github.com/ruan-cat/11comm/commit/e9959632))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.2

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.1-beta.1...v1.0.1-beta.2)

### ✨ 新增功能

- **api:** 加固 Phase3 Nitro 基础设施 ([c2f94446](https://github.com/ruan-cat/11comm/commit/c2f94446))
- **app:** 增加 Nitro shadow 接入策略 ([b151b8a6](https://github.com/ruan-cat/11comm/commit/b151b8a6))
- **admin:** 增加 API shadow 接入策略 ([d49017c6](https://github.com/ruan-cat/11comm/commit/d49017c6))

### 📖 Documentation

- 合并 Phase2 汇总报告并更新交接规范 ([0f8f7ac6](https://github.com/ruan-cat/11comm/commit/0f8f7ac6))
- 修复 VitePress 报告构建解析错误 ([637458e0](https://github.com/ruan-cat/11comm/commit/637458e0))
- 补充 Phase3 启动准则 ([9bc508ed](https://github.com/ruan-cat/11comm/commit/9bc508ed))
- **api:** 补充 Phase3 迁移计划 ([4ed95770](https://github.com/ruan-cat/11comm/commit/4ed95770))
- **admin:** 记录 CloudBase 登录边界 ([88e5ecb4](https://github.com/ruan-cat/11comm/commit/88e5ecb4))

### 🤖 CI

- 修复 GitHub Actions 依赖安装与 Turbo 调用 ([520bdeff](https://github.com/ruan-cat/11comm/commit/520bdeff))
- 加固 Phase3 API 验收门禁 ([a232a69c](https://github.com/ruan-cat/11comm/commit/a232a69c))

### 🔧 更新配置

- 忽略 VitePress 缓存与临时目录 ([180d3498](https://github.com/ruan-cat/11comm/commit/180d3498))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.1-beta.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v1.0.0...v1.0.1-beta.1)

### ✨ 新增功能

- **api:** ⚠️ 新增 Nitro 影子服务纵切样板 ([c747fe6a](https://github.com/ruan-cat/11comm/commit/c747fe6a))

### 📖 Documentation

- **migration:** 补充 app 类型目录对账证据 ([d2721759](https://github.com/ruan-cat/11comm/commit/d2721759))
- **api-migration:** 细化 Phase2 Nitro 迁移方案 ([497e5aba](https://github.com/ruan-cat/11comm/commit/497e5aba))

### ✅ Tests

- **api:** 覆盖 Phase2 fee 接口契约 ([484392b4](https://github.com/ruan-cat/11comm/commit/484392b4))

### 🤖 CI

- **app:** 先生成 app 类型声明再执行 type-check ([b83a67a3](https://github.com/ruan-cat/11comm/commit/b83a67a3))

#### ⚠️ Breaking Changes

- **api:** ⚠️ 新增 Nitro 影子服务纵切样板 ([c747fe6a](https://github.com/ruan-cat/11comm/commit/c747fe6a))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v1.0.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.11.5-beta.1...v1.0.0)

### 🦄 代码重构

- **admin:** 收敛入口类型与 tsconfig 范围 ([dbe36127](https://github.com/ruan-cat/11comm/commit/dbe36127))

### 📖 Documentation

- **release:** 记录技能升级计划与排障背景 ([df1f9748](https://github.com/ruan-cat/11comm/commit/df1f9748))
- **prompts:** 标记 bumpp push 迭代任务已完成 ([3f85b793](https://github.com/ruan-cat/11comm/commit/3f85b793))
- **architecture:** 记录 app 迁入与唯一 API 设计 ([2af48327](https://github.com/ruan-cat/11comm/commit/2af48327))
- 沉淀迁移规格与 relizy 任务状态 ([ae9b7b03](https://github.com/ruan-cat/11comm/commit/ae9b7b03))
- 细化 app 迁入文档治理策略 ([dd6c5078](https://github.com/ruan-cat/11comm/commit/dd6c5078))
- 细化 11comm app 迁入设计的字符集与 AI 记忆合并规范 ([cc50fec0](https://github.com/ruan-cat/11comm/commit/cc50fec0))
- **admin:** 补充 app 迁移双端 API 矩阵 ([39ea2f11](https://github.com/ruan-cat/11comm/commit/39ea2f11))
- 补充 app 迁移自测验收方案 ([024c4785](https://github.com/ruan-cat/11comm/commit/024c4785))
- 补充 app Memorix 迁移保全方案 ([edc7a693](https://github.com/ruan-cat/11comm/commit/edc7a693))
- **migration:** 收口 Phase1 迁移文档 ([e9af24f4](https://github.com/ruan-cat/11comm/commit/e9af24f4))

### ✅ Tests

- **release:** 补充 bumpp push 策略校验 ([933e10d8](https://github.com/ruan-cat/11comm/commit/933e10d8))

### 🤖 CI

- 升级 GitHub Actions 到 Node 24 运行时 ([8d33e576](https://github.com/ruan-cat/11comm/commit/8d33e576))

### 🔧 更新配置

- **release:** 改用 bumpp 官方参数控制 push 策略 ([bcc53d54](https://github.com/ruan-cat/11comm/commit/bcc53d54))
- **workspace:** 限定 lint-staged 只处理文本文件 ([dfb785e2](https://github.com/ruan-cat/11comm/commit/dfb785e2))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.11.5-beta.1

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.11.4...v0.11.5-beta.1)

### ✨ 新增功能

- **contract-manage:** 落地合同断点续传服务端链路 ([539c82bf](https://github.com/ruan-cat/11comm/commit/539c82bf))
- **contract-manage:** 接入合同页面断点续传上传 ([6fb6c5ea](https://github.com/ruan-cat/11comm/commit/6fb6c5ea))

### 📖 Documentation

- **prompts:** 新增 nitro 大文件上传面试提示草案 ([46fdc151](https://github.com/ruan-cat/11comm/commit/46fdc151))
- Add resumable upload interview design ([f719bf5b](https://github.com/ruan-cat/11comm/commit/f719bf5b))
- **contract-manage:** 补充断点续传方案与面试材料 ([dd81b0be](https://github.com/ruan-cat/11comm/commit/dd81b0be))
- **skills:** 补充断点续传排错经验 ([b9f69cab](https://github.com/ruan-cat/11comm/commit/b9f69cab))
- **release:** 同步发版文档并补充 relizy-runner 升级计划 ([d55ef40b](https://github.com/ruan-cat/11comm/commit/d55ef40b))
- **status:** 标记方案与报告文档为已完成 ([ce7fa986](https://github.com/ruan-cat/11comm/commit/ce7fa986))

### 🔧 更新配置

- **release:** ⚠️ 切换根包发版链路到 bumpp + changelogen ([86d4d14b](https://github.com/ruan-cat/11comm/commit/86d4d14b))

#### ⚠️ Breaking Changes

- **release:** ⚠️ 切换根包发版链路到 bumpp + changelogen ([86d4d14b](https://github.com/ruan-cat/11comm/commit/86d4d14b))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## [0.11.4](https://github.com/ruan-cat/11comm/compare/v0.11.3...v0.11.4) (2026-04-09)

- 📦 deps(root)!: 卸载 commit-and-tag-version 并消除旧链路依赖污染 ([8b2706a](https://github.com/ruan-cat/11comm/commit/8b2706adb5a30224d02bb897505b0811c985b712))

### BREAKING CHANGES

- 移除根级 `changelog:commit-and-tag-version` 脚本与 `commit-and-tag-version` 开发依赖。若 CI 或本地脚本仍调用该命令，请改用 `pnpm run changelog:conventional-changelog`、relizy 或 bumpp 既有发版链路。

Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

## <small>0.11.3 (2026-04-09)</small>

- 🐞 fix(ci): 修复 Vercel 部署工作流 pnpm 透传 `--` 导致 vdt deploy 参数解析失败 ([5789904](https://github.com/ruan-cat/11comm/commit/5789904))
- 📃 docs(reports): 新增 monorepo 发版落地指南并标注探索报告保留说明 ([abfed64](https://github.com/ruan-cat/11comm/commit/abfed64))
- 📢 publish: release @01s-11comm/admin@6.1.9, @01s-11comm/type@1.1.6 ([1e4da2b](https://github.com/ruan-cat/11comm/commit/1e4da2b))
- 🦄 refactor(type): 故意触发发版。 ([3dbbe57](https://github.com/ruan-cat/11comm/commit/3dbbe57))

## <small>0.11.2 (2026-04-09)</small>

- 📢 publish: release @01s-11comm/admin@6.1.8 ([d96b579](https://github.com/ruan-cat/11comm/commit/d96b579))
- 🔧 config(release): 统一发版流程为 relizy + bumpp + 单次 push ([6b29922](https://github.com/ruan-cat/11comm/commit/6b29922))
- 🔧 config(release): 移除 bumpp 和 changelogen commit message 模板中的 v 前缀 ([f8c947f](https://github.com/ruan-cat/11comm/commit/f8c947f))

## <small>0.11.1 (2026-04-09)</small>

- 📃 docs(admin): 完善探索报告并清理 release workflow 临时配置 ([5c03726](https://github.com/ruan-cat/11comm/commit/5c03726))
- 📢 publish: release package v@01s-11comm/admin@6.1.6, @01s-11comm/type@1.1.4 ([245991e](https://github.com/ruan-cat/11comm/commit/245991e))
- 📢 publish: release package v@01s-11comm/admin@6.1.7, @01s-11comm/type@1.1.5 ([7be388e](https://github.com/ruan-cat/11comm/commit/7be388e))
- 🔧 config(ci): 改用 gh release create 从 CHANGELOG.md 创建 GitHub Release ([6697622](https://github.com/ruan-cat/11comm/commit/6697622))
- 🔧 config(ci): 将 GitHub Release 生成方式从 relizy provider-release 切换为 changelogen gh release ([2fc76d7](https://github.com/ruan-cat/11comm/commit/2fc76d7))
- 🔧 config(ci): 临时增加 dev 分支触发和 debug 日志，加速 provider-release 调试 ([194432c](https://github.com/ruan-cat/11comm/commit/194432c))

# Changelog

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.10 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.9...@01s-11comm/admin@6.1.10)

### 📖 Documentation

- **admin:** 新增 conventional-changelog angular 预设与 hoist 冲突分析报告 ([e23e582b](https://github.com/ruan-cat/11comm/commit/e23e582b))

  说明 01s-11comm 与 eams-component-lib 在相同 conventional-changelog 命令下
  标题格式（`<small>` 与 compare-link）差异的根因：旧链路与新链路包混装、
  preset-loader@5 解析到根目录 angular@6.0.0、writer 默认模板回退；
  并补充 Mermaid 包混装关系图与修复建议。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.9 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.8...@01s-11comm/admin@6.1.9)

### 📖 Documentation

- **reports:** 新增 monorepo 发版落地指南并标注探索报告保留说明 ([abfed646](https://github.com/ruan-cat/11comm/commit/abfed646))

  补充可在他仓复现的 relizy + bumpp + GitHub Actions 全流程文档；在子包 GitHub Release 探索报告顶部增加保留说明，避免误删高价值调研记录。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/type@1.1.6 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.1.5...@01s-11comm/type@1.1.6)

### 🦄 代码重构

- **type:** 故意触发发版。 ([3dbbe57e](https://github.com/ruan-cat/11comm/commit/3dbbe57e))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.8 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.7...@01s-11comm/admin@6.1.8)

### 📖 Documentation

- **admin:** 完善探索报告并清理 release workflow 临时配置 ([5c037269](https://github.com/ruan-cat/11comm/commit/5c037269))
  - 移除 dev 分支的临时工作流触发
  - 探索报告新增 changelogen gh release 和 gh release create 的完整验证记录
  - 记录最终结论：gh release create 自定义脚本是 monorepo scoped tag 场景下的最佳方案
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.7 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.6...@01s-11comm/admin@6.1.7)

### 🔧 更新配置

- **ci:** 改用 gh release create 从 CHANGELOG.md 创建 GitHub Release ([66976225](https://github.com/ruan-cat/11comm/commit/66976225))

  changelogen gh release 的 tag 映射为 v\* 格式，无法关联 relizy 的 scoped tag。
  改用 gh CLI 直接创建 release，将 tag 名作为普通字符串处理，无 @ 歧义。
  脚本从根 CHANGELOG.md 提取触发 tag 对应的版本 section 作为 release notes。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/type@1.1.5 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.1.4...@01s-11comm/type@1.1.5)

### 🔧 更新配置

- **ci:** 改用 gh release create 从 CHANGELOG.md 创建 GitHub Release ([66976225](https://github.com/ruan-cat/11comm/commit/66976225))

  changelogen gh release 的 tag 映射为 v\* 格式，无法关联 relizy 的 scoped tag。
  改用 gh CLI 直接创建 release，将 tag 名作为普通字符串处理，无 @ 歧义。
  脚本从根 CHANGELOG.md 提取触发 tag 对应的版本 section 作为 release notes。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.6 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.5...@01s-11comm/admin@6.1.6)

### 🔧 更新配置

- **ci:** 将 GitHub Release 生成方式从 relizy provider-release 切换为 changelogen gh release ([2fc76d77](https://github.com/ruan-cat/11comm/commit/2fc76d77))

  relizy provider-release 单独运行缺少 release 流程上下文，创建 0 个 release。
  改用 changelogen gh release all，它直接解析 CHANGELOG.md 创建 GitHub Release，
  不依赖 git log tag1...tag2，有望绕过 @scope/pkg@version 的 @ 歧义问题。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/type@1.1.4 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.1.3...@01s-11comm/type@1.1.4)

### 🔧 更新配置

- **ci:** 将 GitHub Release 生成方式从 relizy provider-release 切换为 changelogen gh release ([2fc76d77](https://github.com/ruan-cat/11comm/commit/2fc76d77))

  relizy provider-release 单独运行缺少 release 流程上下文，创建 0 个 release。
  改用 changelogen gh release all，它直接解析 CHANGELOG.md 创建 GitHub Release，
  不依赖 git log tag1...tag2，有望绕过 @scope/pkg@version 的 @ 歧义问题。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.5 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.4...@01s-11comm/admin@6.1.5)

### 📖 Documentation

- **admin,type:** 补充 relizy provider-release 踩坑记录与 type 包版本发布说明 ([afdd8664](https://github.com/ruan-cat/11comm/commit/afdd8664))
  - admin: 探索报告新增 --yes 参数不兼容的踩坑记录和 provider-release 参数列表
  - type: README 新增版本发布章节，说明独立版本管理和 GitHub Release 生成方式
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/type@1.1.3 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.1.2...@01s-11comm/type@1.1.3)

### 📖 Documentation

- **admin,type:** 补充 relizy provider-release 踩坑记录与 type 包版本发布说明 ([afdd8664](https://github.com/ruan-cat/11comm/commit/afdd8664))
  - admin: 探索报告新增 --yes 参数不兼容的踩坑记录和 provider-release 参数列表
  - type: README 新增版本发布章节，说明独立版本管理和 GitHub Release 生成方式
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.4 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.3...@01s-11comm/admin@6.1.4)

### 🔧 更新配置

- **ci:** 将 release workflow 的 GitHub Release 生成工具从 changelogithub 切换为 relizy provider-release ([f1a0b2eb](https://github.com/ruan-cat/11comm/commit/f1a0b2eb))

  changelogithub 底层 changelogen 在 git log tag1...tag2 时无法解析含 @ 的
  scoped tag（如 @01s-11comm/admin@6.1.3），会产生 fatal: ambiguous argument。
  改用 relizy 自带的 provider-release 子命令，天然支持 monorepo 子包 tag 格式。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @01s-11comm/admin@6.1.3 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.2...@01s-11comm/admin@6.1.3)

### 📖 Documentation

- **admin:** 更新杂项提示词中 relizy 相关条目状态 ([4750da1e](https://github.com/ruan-cat/11comm/commit/4750da1e))
  - 037：标记已完成并记录 Windows 下 relizy 路径识别问题的结论
  - 038：补充待 PR 合并后再优化 relizy 脚本的 TODO 说明
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **admin:** 设计登录页 vue-bits 动态背景提示词任务 ([6e5f43fb](https://github.com/ruan-cat/11comm/commit/6e5f43fb))
  - 新增 login/index.md：001 任务步骤（PlasmaWaveBackground、接入主题切换与浏览器验证）
  - 新增 2026-3-27-use-vue-bits-background/from-chatgpt.md：落地方案与组件设计备忘
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **type:** 补全 `@01s-11comm/type` README 说明文档 ([01c1eed6](https://github.com/ruan-cat/11comm/commit/01c1eed6))

  将占位说明扩展为可执行的类型项目指南：包定位与同构 SSOT、`exports` 子路径、目录与业务域、Trinity Pattern 摘要、导出/导入规范（含禁止 `@/` 与跨包相对路径）、Drizzle Kit 与 `apps/admin` 的配置关系及常用命令，并附 FAQ 与项目内技能索引。
  此次变更仅为文档，不涉及对外 API 或运行时行为的破坏性调整。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **admin:** 将全栈前端简历文档从 reports 移至 resume 目录 ([891702f2](https://github.com/ruan-cat/11comm/commit/891702f2))

  将 `2026-03-03-frontend-fullstack-resume.md` 归入 `src/docs/resume`，与报告类文档分区存放，便于维护与检索。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/type@1.1.2 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.1.1...@01s-11comm/type@1.1.2)

### 📖 Documentation

- **type:** 补全 `@01s-11comm/type` README 说明文档 ([01c1eed6](https://github.com/ruan-cat/11comm/commit/01c1eed6))

  将占位说明扩展为可执行的类型项目指南：包定位与同构 SSOT、`exports` 子路径、目录与业务域、Trinity Pattern 摘要、导出/导入规范（含禁止 `@/` 与跨包相对路径）、Drizzle Kit 与 `apps/admin` 的配置关系及常用命令，并附 FAQ 与项目内技能索引。
  此次变更仅为文档，不涉及对外 API 或运行时行为的破坏性调整。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-03-26

## @01s-11comm/admin@6.1.2 (2026-03-26)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.1...@01s-11comm/admin@6.1.2)

### 📖 Documentation

- **admin:** 同步 relizy 独立发版报告中的标准命令 ([c573b4cc](https://github.com/ruan-cat/11comm/commit/c573b4cc))

  使破坏性变更说明与当前 release 脚本一致，并链到根 README 中关于 --yes 的说明。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **relizy:** 同步 relizy 独立发版报告与 Windows 路径 issue 说明 ([13687d74](https://github.com/ruan-cat/11comm/commit/13687d74))
  - 将「待整合到通用工具包」类 TODO 标记为已合并状态
  - 在 Windows path / body filter issue 中补充通用文档应写明的两点结论（runner 职责边界与排错优先级）
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/type@1.1.1 (2026-03-26)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.1.0...@01s-11comm/type@1.1.1)

No relevant changes for this release

**Multiple Packages Updated** - 2026-03-25

## @01s-11comm/admin@6.1.1 (2026-03-25)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.0...@01s-11comm/admin@6.1.1)

No relevant changes for this release

## @01s-11comm/type@1.1.0 (2026-03-25)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/type@1.0.0...@01s-11comm/type@1.1.0)

### ✨ 新增功能

- **type:** 新增类型项目的文档。 ([dba1d161](https://github.com/ruan-cat/11comm/commit/dba1d161))

  本次提交只是用来测试发版工具的。

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-03-25

## @01s-11comm/admin@6.1.0 (2026-03-25)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.0.0...@01s-11comm/admin@6.1.0)

### ✨ 新增功能

- **admin:** 重做登录页动效、背景与主题过渡 ([2ac3bc28](https://github.com/ruan-cat/11comm/commit/2ac3bc28))

  接入 motion-v 入场动效；极光流光与背景渐变流动；明暗主题双图层交叉淡入淡出；
  simple 布局改用 100% 宽度避免横向滚动；登录区靠右栅格；光斑与 motion 的 transform 解耦以恢复漂移动画；
  第三方登录枚举改为 titleKey 与运行时 t() 解析。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### 🐞 修复缺陷

- **admin:** 列表与弹窗深拷贝改用 cloneDeep 替代 structuredClone ([e214aa2c](https://github.com/ruan-cat/11comm/commit/e214aa2c))

  structuredClone 在 Vue reactive/proxy 场景下不稳定，易导致弹窗与搜索重置异常。
  统一使用 @pureadmin/utils 的 cloneDeep，并补全相关 import。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### 📖 Documentation

- **admin:** 标记杂项提示词 036 structuredClone 迁移为已完成 ([ba4ddce7](https://github.com/ruan-cat/11comm/commit/ba4ddce7))

  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## v0.11.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.10.0...v0.11.0)

### ✨ 新增功能

- **auth:** 实现 Neon Auth 认证服务后端 API ([5186b2b4](https://github.com/ruan-cat/11comm/commit/5186b2b4))
- **auth:** 实现 Nitro 认证中间件 ([bd3aac9f](https://github.com/ruan-cat/11comm/commit/bd3aac9f))
- **auth:** 实现 RLS 数据隔离和权限工具 ([c82e7ee7](https://github.com/ruan-cat/11comm/commit/c82e7ee7))
- **types:** 添加 Auth Schema 和权限码类型定义 ([ed9b2020](https://github.com/ruan-cat/11comm/commit/ed9b2020))
- **frontend:** 集成前端登录和 OAuth 认证 ([5541e753](https://github.com/ruan-cat/11comm/commit/5541e753))
- **memorix:** 使用 memorix hooks install 集成 AI 记忆系统 ([e5118650](https://github.com/ruan-cat/11comm/commit/e5118650))
- **api:** 新增首页常用菜单 Mock 接口 ([6157c861](https://github.com/ruan-cat/11comm/commit/6157c861))
- 补充 33 个空表的 seed 数据生成逻辑 ([cc190d8b](https://github.com/ruan-cat/11comm/commit/cc190d8b))
- **skills:** 新增 record-bug-fix-memory 错误经验沉淀技能 ([45160f18](https://github.com/ruan-cat/11comm/commit/45160f18))

### 🐞 修复缺陷

- **server/middleware:** 修复中间件 h3 模块导入路径 ([a599fd2c](https://github.com/ruan-cat/11comm/commit/a599fd2c))
- **server/utils:** 修复服务端工具函数 h3 模块导入路径 ([df096cc7](https://github.com/ruan-cat/11comm/commit/df096cc7))
- **server/api/auth:** 修复认证 API 路由 h3 模块导入路径 ([bdb0b2dc](https://github.com/ruan-cat/11comm/commit/bdb0b2dc))
- **types:** 修复全量 TypeScript 类型错误 ([aa659901](https://github.com/ruan-cat/11comm/commit/aa659901))
- **seed:** 修复 seed-sql 文件的导入路径 ([faabc02a](https://github.com/ruan-cat/11comm/commit/faabc02a))
- **auth:** 修复未登录访问首页返回 401 错误 ([82692dbd](https://github.com/ruan-cat/11comm/commit/82692dbd))
- **seed:** 修复 seed 脚本环境变量加载顺序导致 db 为 null ([44c5f85b](https://github.com/ruan-cat/11comm/commit/44c5f85b))
- **seed:** 修复 seed 脚本数据库连接 null 错误 ([1afa364b](https://github.com/ruan-cat/11comm/commit/1afa364b))
- **auth:** 修复认证中间件 401 错误 ([2fcf40cc](https://github.com/ruan-cat/11comm/commit/2fcf40cc))
- **auth:** 修复生产环境 500 错误 ([d3b0f005](https://github.com/ruan-cat/11comm/commit/d3b0f005))
- **auth:** 修复 auth 插件空指针错误 ([8f0bec9a](https://github.com/ruan-cat/11comm/commit/8f0bec9a))
- **use-list-query:** 修复分页切换缓存未命中与重复请求 ([0978ec64](https://github.com/ruan-cat/11comm/commit/0978ec64))
- **middleware:** 恢复日志中间件中 Node.js/Cloudflare Workers 环境差异的排错经验注释 ([dbc54271](https://github.com/ruan-cat/11comm/commit/dbc54271))
- **test:** 修复测试用例中 setup-neon 的模块解析错误 ([eb783616](https://github.com/ruan-cat/11comm/commit/eb783616))

### 🦄 代码重构

- **auth:** ⚠️ 删除鉴权中间件和插件，放弃 Neon Auth 集成 ([6b54844f](https://github.com/ruan-cat/11comm/commit/6b54844f))
- **auth:** 删除鉴权工具函数 ([e970e44c](https://github.com/ruan-cat/11comm/commit/e970e44c))
- **api:** 删除所有鉴权 API 端点 ([683d8f21](https://github.com/ruan-cat/11comm/commit/683d8f21))
- **docs:** 重构 MiniMax 驱动技术报告为目录结构 ([f1064813](https://github.com/ruan-cat/11comm/commit/f1064813))
- **neon-db-query:** 将 neon-db-list 技能升级为 neon-db-query ([48b9e8d2](https://github.com/ruan-cat/11comm/commit/48b9e8d2))
- **admin:** 移除 print 工具中的 as any 断言 ([f5379a3e](https://github.com/ruan-cat/11comm/commit/f5379a3e))
- **admin-i18n-plugin:** ⚠️ 重整 admin i18n 插件的运行时入口 ([766a7e5a](https://github.com/ruan-cat/11comm/commit/766a7e5a))
- **use-i18n-config:** ⚠️ 收缩 use-i18n-config 为结构层组合式 API ([bcfb34fa](https://github.com/ruan-cat/11comm/commit/bcfb34fa))
- **redialog:** ⚠️ 让 ReDialog 支持函数型标题与按钮文案 ([e5fb7242](https://github.com/ruan-cat/11comm/commit/e5fb7242))

### 📖 Documentation

- 添加认证系统文档和使用指南 ([029661f6](https://github.com/ruan-cat/11comm/commit/029661f6))
- 更新认证系统任务进度为全部完成 ([bf26c4fa](https://github.com/ruan-cat/11comm/commit/bf26c4fa))
- 同步 Memorix 规则到 CLAUDE.md ([ddbef016](https://github.com/ruan-cat/11comm/commit/ddbef016))
- **openspec:** 更新 nitro-api-authentication 任务文档 ([5f703f9a](https://github.com/ruan-cat/11comm/commit/5f703f9a))
- 新增 029 和 030 号任务到「各种杂项」文档 ([a62935c4](https://github.com/ruan-cat/11comm/commit/a62935c4))
- **nitro-api-development:** 补充 h3 导入路径高频错误陷阱说明 ([247617c3](https://github.com/ruan-cat/11comm/commit/247617c3))
- **CLAUDE.md:** 新增 h3 导入规范说明 ([b55a06be](https://github.com/ruan-cat/11comm/commit/b55a06be))
- **openspec/nitro-api-authentication:** 更新认证规范文档并新增分析报告 ([8898cb21](https://github.com/ruan-cat/11comm/commit/8898cb21))
- **CLAUDE.md:** 压缩 Memorix 规则为 3 条核心规则 ([2d3c9393](https://github.com/ruan-cat/11comm/commit/2d3c9393))
- **CLAUDE.md:** 恢复意外删除的 §16 获取技术栈上下文 ([82ad2ea4](https://github.com/ruan-cat/11comm/commit/82ad2ea4))
- **CLAUDE.md:** 删除 §14 项目架构（可从代码目录直接推断） ([7cc35579](https://github.com/ruan-cat/11comm/commit/7cc35579))
- **CLAUDE.md:** 删除 §13 常用开发命令（可从 package.json 查阅） ([96d306d7](https://github.com/ruan-cat/11comm/commit/96d306d7))
- **CLAUDE.md:** 合并压缩 §8-10 Gemini 协作规范为单一章节 ([e21cbc0e](https://github.com/ruan-cat/11comm/commit/e21cbc0e))
- **CLAUDE.md:** 删除 §6.3 具体路由举例，保留核心规则 ([8f943d96](https://github.com/ruan-cat/11comm/commit/8f943d96))
- **CLAUDE.md:** 压缩 §4 类型项目导出规范，引用 type-project-organization 技能 ([3d1d9bc2](https://github.com/ruan-cat/11comm/commit/3d1d9bc2))
- **CLAUDE.md:** 删除原 §3 代码格式要求（由 code-style 技能覆盖） ([d10bef61](https://github.com/ruan-cat/11comm/commit/d10bef61))
- **CLAUDE.md:** 重新编号所有章节，修复 §3 重复 Bug ([77696443](https://github.com/ruan-cat/11comm/commit/77696443))
- **prompts:** 删除标题中的 TODO 注释标记 ([bd374d5d](https://github.com/ruan-cat/11comm/commit/bd374d5d))
- **skills:** 新增 TypeScript 类型错误修复和 Nitro API 开发 gotcha ([3960e142](https://github.com/ruan-cat/11comm/commit/3960e142))
- 新增 TypeScript 类型错误修复复盘报告 ([d062c7e8](https://github.com/ruan-cat/11comm/commit/d062c7e8))
- 删除过期的类型错误修复复盘报告 ([6065875a](https://github.com/ruan-cat/11comm/commit/6065875a))
- 清理 prompts 文档中的 TODO 注释标记 ([12ef5317](https://github.com/ruan-cat/11comm/commit/12ef5317))
- **auth:** 标记 nitro-api-authentication 任务全部完成 ([60c99a7d](https://github.com/ruan-cat/11comm/commit/60c99a7d))
- 清理 prompts 文档中的 TODO 注释标记并新增认证系统任务文档 ([a5010b44](https://github.com/ruan-cat/11comm/commit/a5010b44))
- **report:** 生成前端/全栈求职简历素材 ([ec854a85](https://github.com/ruan-cat/11comm/commit/ec854a85))
- 修复文档中的 TODO 注释 ([f4d84d84](https://github.com/ruan-cat/11comm/commit/f4d84d84))
- 新增数据库填充任务规划 ([37ce146f](https://github.com/ruan-cat/11comm/commit/37ce146f))
- **openspec:** 归档 nitro-api-authentication 任务并同步 specs ([4b6f1d99](https://github.com/ruan-cat/11comm/commit/4b6f1d99))
- 整理 500 错误排查报告文档 ([df96951b](https://github.com/ruan-cat/11comm/commit/df96951b))
- 更新文档声明放弃鉴权，删除过时报告 ([89dcd357](https://github.com/ruan-cat/11comm/commit/89dcd357))
- 清理文档中的 TODO 标记 ([474cee98](https://github.com/ruan-cat/11comm/commit/474cee98))
- 补充生产环境故障排查的提示文档 ([29058510](https://github.com/ruan-cat/11comm/commit/29058510))
- **admin:** 添加生产环境 500 错误调试报告 ([21b5d77b](https://github.com/ruan-cat/11comm/commit/21b5d77b))
- **admin:** 添加在 Claude Code 会话中驱动 MiniMax 模型的技术报告 ([26197a3e](https://github.com/ruan-cat/11comm/commit/26197a3e))
- **admin:** 标记 MiniMax 驱动技术报告为高价值内容 ([fd3bc9f5](https://github.com/ruan-cat/11comm/commit/fd3bc9f5))
- ⚠️ 标记驱动 MiniMax 模型技术报告为重要参考资料 ([1240a51f](https://github.com/ruan-cat/11comm/commit/1240a51f))
- 新增 fill-database-tables OpenSpec 变更规范 ([4868c02d](https://github.com/ruan-cat/11comm/commit/4868c02d))
- **openspec:** 为 fill-database-tables 任务添加 Agent Team 并行执行策略 ([bc682b16](https://github.com/ruan-cat/11comm/commit/bc682b16))
- ⚠️ 细粒化 fill-database-tables 任务清单为待办列表格式 ([cdc910df](https://github.com/ruan-cat/11comm/commit/cdc910df))
- 删除 index.md 中的过时 TODO 标记 ([2f09e1ec](https://github.com/ruan-cat/11comm/commit/2f09e1ec))
- **neon-db-query:** 更新技能中的数据库表清单 ([1e4efe65](https://github.com/ruan-cat/11comm/commit/1e4efe65))
- **openspec:** 同步多代理 OpenSpec 技能与命令文档 ([3a4695f2](https://github.com/ruan-cat/11comm/commit/3a4695f2))
- **openspec:** 归档 fill-database-tables 变更 ([ddfb2b40](https://github.com/ruan-cat/11comm/commit/ddfb2b40))
- **reports:** 更新风险评估报告筛选标准 ([67403366](https://github.com/ruan-cat/11comm/commit/67403366))
- **prompts:** 添加风险报告更新任务提示词 ([d62f6d07](https://github.com/ruan-cat/11comm/commit/d62f6d07))
- **ai-guidelines:** 同步并精简代理记忆与技能说明 ([9db8efb2](https://github.com/ruan-cat/11comm/commit/9db8efb2))
- **prompts:** 更新杂项提示中的 i18n 任务记录 ([5031875b](https://github.com/ruan-cat/11comm/commit/5031875b))
- **report:** 追加生产环境 i18n 复核与修复进度 ([e32cf7dd](https://github.com/ruan-cat/11comm/commit/e32cf7dd))
- **code-style:** ⚠️ 重写 code-style 技能中的 admin i18n 规范 ([1558bd1f](https://github.com/ruan-cat/11comm/commit/1558bd1f))
- **frontend-development:** ⚠️ 同步 frontend-development 技能到当前列表页与表单页写法 ([82c86663](https://github.com/ruan-cat/11comm/commit/82c86663))
- **i18n-progress-plan:** ⚠️ 新增按业务路由索引的 i18n 改造进度账本 ([fa575619](https://github.com/ruan-cat/11comm/commit/fa575619))
- **i18n-prompts:** ⚠️ 整理 i18n 提示词与杂项索引文档 ([3ccee807](https://github.com/ruan-cat/11comm/commit/3ccee807))
- **i18n-audit-report:** ⚠️ 补充 admin i18n 审计路线与修复进度报告 ([054bdcd9](https://github.com/ruan-cat/11comm/commit/054bdcd9))
- **i18n-prompts:** 更新 i18n 改造提示词文档 ([52e3a80f](https://github.com/ruan-cat/11comm/commit/52e3a80f))
- **i18n-progress:** 更新 i18n 路由进度计划至 A=36 B=0 D=64 ([2a3e1225](https://github.com/ruan-cat/11comm/commit/2a3e1225))
- **i18n-progress:** 更新 i18n 路由改造进度文档至全部完成 ([b96da583](https://github.com/ruan-cat/11comm/commit/b96da583))
- **skills:** 在三个 AI 记忆文件中同步新增技能表章节 ([f7709819](https://github.com/ruan-cat/11comm/commit/f7709819))
- **admin:** 更新 i18n 相关计划进度与提示词文档 ([be64b2e7](https://github.com/ruan-cat/11comm/commit/be64b2e7))

### 🔨 构建相关

- **typed-router:** ⚠️ 修正自动路由排除规则以隐藏 components 子路由 ([ed2d53a7](https://github.com/ruan-cat/11comm/commit/ed2d53a7))
- **type,package.json,admin:** 升级依赖；更新依赖锁文件。 ([1f77ec83](https://github.com/ruan-cat/11comm/commit/1f77ec83))
- **type,package.json,admin:** ⚠️ 升级依赖 ([6442bf58](https://github.com/ruan-cat/11comm/commit/6442bf58))

### 🏡 Chore

- 添加 IDE 配置文件 ([013dd328](https://github.com/ruan-cat/11comm/commit/013dd328))
- **db:** 添加 Neon Auth RLS 策略数据库迁移 ([6504ff81](https://github.com/ruan-cat/11comm/commit/6504ff81))
- **db:** 清理过期的 drizzle 迁移文件 ([4a6abe1f](https://github.com/ruan-cat/11comm/commit/4a6abe1f))
- **seed:** 生成开发环境 seed SQL 数据文件 ([241d3e52](https://github.com/ruan-cat/11comm/commit/241d3e52))
- **admin:** 更新文档和日志中间件 ([b07ec868](https://github.com/ruan-cat/11comm/commit/b07ec868))
- 标记生产环境故障排查任务已完成 ([8e3e6535](https://github.com/ruan-cat/11comm/commit/8e3e6535))
- 标记 fill-database-tables 任务优化已完成 ([029600bd](https://github.com/ruan-cat/11comm/commit/029600bd))
- 标记 fill-database-tables 任务已完成 ([f7a65a8c](https://github.com/ruan-cat/11comm/commit/f7a65a8c))
- 修复 seed-sql 模块 TypeScript 类型错误 ([503a8f82](https://github.com/ruan-cat/11comm/commit/503a8f82))
- 更新数据库 seed SQL 文件 ([7ea6c040](https://github.com/ruan-cat/11comm/commit/7ea6c040))
- 标记 fill-database-tables 任务全部完成 ([3eeb0ec0](https://github.com/ruan-cat/11comm/commit/3eeb0ec0))
- 修复 5 个空表的 seed 数据生成逻辑 ([2f796288](https://github.com/ruan-cat/11comm/commit/2f796288))
- 更新 seed SQL 文件 ([072337b9](https://github.com/ruan-cat/11comm/commit/072337b9))
- 更新 Claude Code 状态栏配置 ([50e97abc](https://github.com/ruan-cat/11comm/commit/50e97abc))

### ✅ Tests

- **auth:** 新增认证系统集成测试 ([6baa9580](https://github.com/ruan-cat/11comm/commit/6baa9580))

### 🎨 Styles

- **neon-db-query:** 格式化表格对齐 ([761cfecd](https://github.com/ruan-cat/11comm/commit/761cfecd))

### 🔧 更新配置

- 更新认证相关配置 ([ab8ce810](https://github.com/ruan-cat/11comm/commit/ab8ce810))
- 添加 local_cache 到 .gitignore 忽略配置 ([a59fc7d0](https://github.com/ruan-cat/11comm/commit/a59fc7d0))
- 添加 Claude Code 和 Gemini 本地配置文件 ([791053d9](https://github.com/ruan-cat/11comm/commit/791053d9))
- **nitro:** 移除不支持的 middleware 配置 ([6afd7066](https://github.com/ruan-cat/11comm/commit/6afd7066))
- **admin:** ⚠️ 清理 Neon Auth 相关配置 ([24b68722](https://github.com/ruan-cat/11comm/commit/24b68722))
- **i18n-ally:** ⚠️ 收紧 VSCode i18n Ally 的自定义识别入口 ([82eb06d9](https://github.com/ruan-cat/11comm/commit/82eb06d9))
- **deps:** 迁移 drizzle-orm 的 overrides 配置到 pnpm-workspace.yaml ([eb90d51b](https://github.com/ruan-cat/11comm/commit/eb90d51b))

#### ⚠️ Breaking Changes

- **auth:** ⚠️ 删除鉴权中间件和插件，放弃 Neon Auth 集成 ([6b54844f](https://github.com/ruan-cat/11comm/commit/6b54844f))
- **admin-i18n-plugin:** ⚠️ 重整 admin i18n 插件的运行时入口 ([766a7e5a](https://github.com/ruan-cat/11comm/commit/766a7e5a))
- **use-i18n-config:** ⚠️ 收缩 use-i18n-config 为结构层组合式 API ([bcfb34fa](https://github.com/ruan-cat/11comm/commit/bcfb34fa))
- **redialog:** ⚠️ 让 ReDialog 支持函数型标题与按钮文案 ([e5fb7242](https://github.com/ruan-cat/11comm/commit/e5fb7242))
- ⚠️ 标记驱动 MiniMax 模型技术报告为重要参考资料 ([1240a51f](https://github.com/ruan-cat/11comm/commit/1240a51f))
- ⚠️ 细粒化 fill-database-tables 任务清单为待办列表格式 ([cdc910df](https://github.com/ruan-cat/11comm/commit/cdc910df))
- **code-style:** ⚠️ 重写 code-style 技能中的 admin i18n 规范 ([1558bd1f](https://github.com/ruan-cat/11comm/commit/1558bd1f))
- **frontend-development:** ⚠️ 同步 frontend-development 技能到当前列表页与表单页写法 ([82c86663](https://github.com/ruan-cat/11comm/commit/82c86663))
- **i18n-progress-plan:** ⚠️ 新增按业务路由索引的 i18n 改造进度账本 ([fa575619](https://github.com/ruan-cat/11comm/commit/fa575619))
- **i18n-prompts:** ⚠️ 整理 i18n 提示词与杂项索引文档 ([3ccee807](https://github.com/ruan-cat/11comm/commit/3ccee807))
- **i18n-audit-report:** ⚠️ 补充 admin i18n 审计路线与修复进度报告 ([054bdcd9](https://github.com/ruan-cat/11comm/commit/054bdcd9))
- **typed-router:** ⚠️ 修正自动路由排除规则以隐藏 components 子路由 ([ed2d53a7](https://github.com/ruan-cat/11comm/commit/ed2d53a7))
- **type,package.json,admin:** ⚠️ 升级依赖 ([6442bf58](https://github.com/ruan-cat/11comm/commit/6442bf58))
- **admin:** ⚠️ 清理 Neon Auth 相关配置 ([24b68722](https://github.com/ruan-cat/11comm/commit/24b68722))
- **i18n-ally:** ⚠️ 收紧 VSCode i18n Ally 的自定义识别入口 ([82eb06d9](https://github.com/ruan-cat/11comm/commit/82eb06d9))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## v0.10.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.9.0...v0.10.0)

### ✨ 新增功能

- **server,admin:** 增加获取环境变量的健壮性写法 ([d659a8ad](https://github.com/ruan-cat/11comm/commit/d659a8ad))
- **skills:** ✨ 新增 schema-and-seed-guardian 技能以规范数据库开发 ([4e94448a](https://github.com/ruan-cat/11comm/commit/4e94448a))
- **type,openspec:** 完成全栈类型统一改造试点迁移（Phase 1-2） ([a3e587ce](https://github.com/ruan-cat/11comm/commit/a3e587ce))
- **type:** 建立通用枚举与基础 Zod 校验 Schema ([3bb8b4e8](https://github.com/ruan-cat/11comm/commit/3bb8b4e8))
- **type:** 迁移运营团队模块 Drizzle Schema ([4d7b6735](https://github.com/ruan-cat/11comm/commit/4d7b6735))
- **type:** 迁移社区、房产与停车管理模块 Drizzle Schema ([a5dd15fc](https://github.com/ruan-cat/11comm/commit/a5dd15fc))
- **type:** 迁移合同、费用与报修管理模块 Drizzle Schema ([5463dc35](https://github.com/ruan-cat/11comm/commit/5463dc35))
- **type:** 迁移巡检与报表管理模块 Drizzle Schema ([c1aa8731](https://github.com/ruan-cat/11comm/commit/c1aa8731))
- **type:** 建立系统设置相关子模块 Drizzle Schema ([8e2e55b1](https://github.com/ruan-cat/11comm/commit/8e2e55b1))
- **api:** 补全配置管理 CRUD 接口 ([e6d3d6c3](https://github.com/ruan-cat/11comm/commit/e6d3d6c3))
- **type:** 增加配置管理导出入口 ([bc410e78](https://github.com/ruan-cat/11comm/commit/bc410e78))
- **type:** 为 JsonVO 增加 error 和 stack 可选字段 ([f490a5e7](https://github.com/ruan-cat/11comm/commit/f490a5e7))
- **admin:** 实现增强版数据库错误处理工具 ([b7cabdcd](https://github.com/ruan-cat/11comm/commit/b7cabdcd))
- **type:** DtCacheConfigs 表新增 5 个字段 ([59a5da97](https://github.com/ruan-cat/11comm/commit/59a5da97))
- **admin:** 生成 dtCacheConfigs 新增字段的数据库迁移 ([cb6922ae](https://github.com/ruan-cat/11comm/commit/cb6922ae))
- **admin:** 新增 dt_cache_configs 种子数据生成逻辑 ([86093f4a](https://github.com/ruan-cat/11comm/commit/86093f4a))
- **admin:** 缓存管理前端页面同步新增字段 ([083a0673](https://github.com/ruan-cat/11comm/commit/083a0673))
- **admin:** 为 22 个列表页补全 PureTable loading 属性 ([9734136e](https://github.com/ruan-cat/11comm/commit/9734136e))
- **admin:** 为 data-permission 页面树组件添加 loading 状态 ([e16e9a5c](https://github.com/ruan-cat/11comm/commit/e16e9a5c))
- **schema:** 新增费用汇总表和密码记录表定义 ([ba4926b8](https://github.com/ruan-cat/11comm/commit/ba4926b8))
- **api:** 重写运营团队 API 为 Drizzle 数据库查询 ([263f1daf](https://github.com/ruan-cat/11comm/commit/263f1daf))
- **api:** 重写合同管理和费用管理 API 为 Drizzle 数据库查询 ([484fa9bb](https://github.com/ruan-cat/11comm/commit/484fa9bb))
- **api:** 重写房产、停车、巡检管理 API 为 Drizzle 数据库查询 ([d5eec774](https://github.com/ruan-cat/11comm/commit/d5eec774))
- **api:** 重写报修管理和报表管理 API 为 Drizzle 数据库查询 ([eaf8c0f4](https://github.com/ruan-cat/11comm/commit/eaf8c0f4))
- **api:** 重写设置管理 API 为 Drizzle 数据库查询 ([cb090630](https://github.com/ruan-cat/11comm/commit/cb090630))
- **db:** 新增三个数据库表的迁移文件 ([57a92875](https://github.com/ruan-cat/11comm/commit/57a92875))
- **server:** 新增日期格式化工具函数 ([76cc4f8b](https://github.com/ruan-cat/11comm/commit/76cc4f8b))
- **.vscode:** 添加 AI 大模型记忆文件折叠配置 ([67743d94](https://github.com/ruan-cat/11comm/commit/67743d94))
- **admin:** 新增 smCommunityConfigurations 表的数据库迁移 ([63f9fd7c](https://github.com/ruan-cat/11comm/commit/63f9fd7c))
- **nitro-api:** 新增 system-manage 模块的 CRUD 接口 ([70c8d534](https://github.com/ruan-cat/11comm/commit/70c8d534))
- **type:** 新增 smCommunityConfigurations 表及 updateSmChangePasswordRecordSchema ([a674f729](https://github.com/ruan-cat/11comm/commit/a674f729))
- **type:** 为 system-manage 模块补充前端业务类型 ([034e6fd1](https://github.com/ruan-cat/11comm/commit/034e6fd1))
- **server:** 支持从 Cloudflare 环境变量读取数据库连接 ([a2280446](https://github.com/ruan-cat/11comm/commit/a2280446))

### 🐞 修复缺陷

- **claude:** ⚠️ 处理 vitepress 文档构建故障，避免出现未闭合的标签。 ([e97053b2](https://github.com/ruan-cat/11comm/commit/e97053b2))
- **admin:** 尝试处理 sql 脚本生成逻辑。 ([dffb0841](https://github.com/ruan-cat/11comm/commit/dffb0841))
- **server,admin:** ⚠️ 尝试解决 schema 数据库表内存在的隐藏故障。 ([c6830e02](https://github.com/ruan-cat/11comm/commit/c6830e02))
- **admin:** 尝试处理 sql 生成脚本的故障 ([55f7cb44](https://github.com/ruan-cat/11comm/commit/55f7cb44))
- **server,admin:** ⚠️ 补全数据库生成脚本，尝试处理故障 ([5c52e6b1](https://github.com/ruan-cat/11comm/commit/5c52e6b1))
- **admin:** 修复数据库播种脚本的多个崩溃问题 (外键约束, 日期格式, 数据映射) ([caa926db](https://github.com/ruan-cat/11comm/commit/caa926db))
- **type:** 修复 schema.ts 使用 @/ 路径别名导致跨项目构建失败 ([e99c7aa6](https://github.com/ruan-cat/11comm/commit/e99c7aa6))
- **admin:** 修复迁移后的 Seed 脚本与组件类型报错 ([d964a269](https://github.com/ruan-cat/11comm/commit/d964a269))
- **admin:** 修正配置中心列表查询参数处理 ([04cc9dec](https://github.com/ruan-cat/11comm/commit/04cc9dec))
- **admin:** 补全缓存管理列表接口的字段映射函数 ([fd9622b3](https://github.com/ruan-cat/11comm/commit/fd9622b3))
- **nitro-api:** 修复 community-configuration 列表接口使用错误的表 ([4d1d9295](https://github.com/ruan-cat/11comm/commit/4d1d9295))
- **nitro-api:** 补全 devTeam 模块列表接口的日期格式化函数 ([11038dea](https://github.com/ruan-cat/11comm/commit/11038dea))
- **nitro-api:** 补全 communityManage 和 reportManage 模块列表接口的日期格式化函数 ([8259e0f6](https://github.com/ruan-cat/11comm/commit/8259e0f6))
- **nitro-api:** 补全 reportManage 模块列表接口的日期格式化函数 ([fcc7d33d](https://github.com/ruan-cat/11comm/commit/fcc7d33d))
- **nitro-api:** 补全 propertyManage 各子模块列表接口的日期格式化函数 ([a00cf588](https://github.com/ruan-cat/11comm/commit/a00cf588))
- **nitro-api:** 统一 devTeam 和 operationTeam 模块接口的日期字段命名 ([2de85132](https://github.com/ruan-cat/11comm/commit/2de85132))
- **nitro-api:** 统一 propertyManage communityManage 和 contractManage 模块接口的日期字段命名 ([516e4091](https://github.com/ruan-cat/11comm/commit/516e4091))
- **nitro-api:** 统一 propertyManage expenseManage 模块接口的日期字段命名 ([b42b0df6](https://github.com/ruan-cat/11comm/commit/b42b0df6))
- **nitro-api:** 统一 propertyManage housePropertyManage 和 parkingManage 模块接口的日期字段命名 ([bcb9fe73](https://github.com/ruan-cat/11comm/commit/bcb9fe73))
- **nitro-api:** 统一 propertyManage patrolManage repairsManage reportManage 模块接口的日期字段命名 ([8a53f8e2](https://github.com/ruan-cat/11comm/commit/8a53f8e2))
- **nitro-api:** 统一 settingManage 模块接口的日期字段命名 ([6199dcf6](https://github.com/ruan-cat/11comm/commit/6199dcf6))
- **seed-sql:** 统一数据库 Seed SQL 的日期字段命名 ([54ca7e82](https://github.com/ruan-cat/11comm/commit/54ca7e82))
- **type:** 统一类型项目 Schema 的日期字段命名 ([00e7d4f4](https://github.com/ruan-cat/11comm/commit/00e7d4f4))
- **type:** 统一时间戳字段命名为 create_time 和 update_time ([09a4e2bf](https://github.com/ruan-cat/11comm/commit/09a4e2bf))
- **contract-manage:** 修复列表接口数组类型嵌套问题 ([4e6c14cf](https://github.com/ruan-cat/11comm/commit/4e6c14cf))
- **api:** 修复 delete 接口参数类型问题 ([4ed3bbf0](https://github.com/ruan-cat/11comm/commit/4ed3bbf0))
- **api:** 修复 community-configuration 接口 Drizzle 字段问题 ([52941ff0](https://github.com/ruan-cat/11comm/commit/52941ff0))
- **api:** 修复 cancel-fee 列表接口缺失字段问题 ([ce63a427](https://github.com/ruan-cat/11comm/commit/ce63a427))
- **type:** 修复类型项目 ListItem 类型的时间戳类型定义 ([5488e5de](https://github.com/ruan-cat/11comm/commit/5488e5de))
- **api:** 修复 Nitro API 接口使用类型项目的正确类型 ([32d71f90](https://github.com/ruan-cat/11comm/commit/32d71f90))
- **mock:** 修复 Mock Data 枚举值类型错误 ([825f73cb](https://github.com/ruan-cat/11comm/commit/825f73cb))
- **frontend:** 修复前端页面字段名称不匹配问题 ([4f6e102e](https://github.com/ruan-cat/11comm/commit/4f6e102e))
- **db:** 合并精简 Drizzle 迁移文件 ([896642a4](https://github.com/ruan-cat/11comm/commit/896642a4))
- **db:** 添加合并后的 Drizzle 迁移文件 ([5c83ffd8](https://github.com/ruan-cat/11comm/commit/5c83ffd8))
- **dev-team:** 修复 detail 接口 formatDateTime 使用并复用类型项目类型 ([678ad5aa](https://github.com/ruan-cat/11comm/commit/678ad5aa))
- **operation-team:** 修复 formatDateTime 未使用问题 ([b9e57084](https://github.com/ruan-cat/11comm/commit/b9e57084))
- **property-manage:** 修复 JsonVO<any> 和 toISOString 类型问题 ([28536006](https://github.com/ruan-cat/11comm/commit/28536006))
- **setting-manage:** 修复 JsonVO 类型和 formatDateTime 使用问题 ([43395d87](https://github.com/ruan-cat/11comm/commit/43395d87))
- **admin:** 修改数据库连接使用正确的环境变量访问方式 ([cb929ebf](https://github.com/ruan-cat/11comm/commit/cb929ebf))
- **admin:** 修复 Nitro v3 破坏性变更 - h3 导入路径 ([1fb6aabd](https://github.com/ruan-cat/11comm/commit/1fb6aabd))
- **env-pull:** 修复 Cloudflare Worker 环境中无法获取 VERCEL_TOKEN 的问题 ([04be9431](https://github.com/ruan-cat/11comm/commit/04be9431))
- **package.json:** ⚠️ 处理 "cp": "shx cp -r apps/admin/.vercel/output .vercel", 出现的故障，删除掉多余的目录移动 ([2e4ba619](https://github.com/ruan-cat/11comm/commit/2e4ba619))
- **server:** ⚠️ 修复 Cloudflare Worker 环境变量名称大小写 ([c6d87867](https://github.com/ruan-cat/11comm/commit/c6d87867))
- **server:** ⚠️ 修复 Cloudflare Worker 环境下 useDb 获取环境变量失败的问题 ([f71c7c10](https://github.com/ruan-cat/11comm/commit/f71c7c10))
- **server:** ⚠️ 修复 Cloudflare Worker 通过 Dashboard 设置的 Secrets 无法被读取的问题 ([ec30b22d](https://github.com/ruan-cat/11comm/commit/ec30b22d))
- **server:** ⚠️ 修复 Cloudflare Worker 环境下数据库 URL 获取失败的根本原因 ([bf15e586](https://github.com/ruan-cat/11comm/commit/bf15e586))

### 🦄 代码重构

- **server,admin:** ⚠️ 删改 schema 数据库表，多余的字段。 ([c2aed05f](https://github.com/ruan-cat/11comm/commit/c2aed05f))
- **admin:** 切换 Drizzle 数据源至 @01s-11comm/type ([fd102f1a](https://github.com/ruan-cat/11comm/commit/fd102f1a))
- **claude,skill:** 将 openspec 规范整合迁移到 skills ([ba47825b](https://github.com/ruan-cat/11comm/commit/ba47825b))
- **admin:** ⚠️ 全部 config-manage 接口强制 JsonVO 类型注解约束 ([13d20ecf](https://github.com/ruan-cat/11comm/commit/13d20ecf))
- **admin:** Menu-manage 列表接口从 Mock 迁移到 Drizzle 查询 ([00dee822](https://github.com/ruan-cat/11comm/commit/00dee822))
- **type:** 迁移密码修改记录类型到 Schema 驱动模式 ([06eb2c6c](https://github.com/ruan-cat/11comm/commit/06eb2c6c))
- **type:** 迁移三个模块的前端类型到 Schema 驱动模式 ([d02746da](https://github.com/ruan-cat/11comm/commit/d02746da))
- **type:** 转换前端类型时间字段为字符串格式 ([fd696425](https://github.com/ruan-cat/11comm/commit/fd696425))
- **mock:** Mock 数据改用 DB 层类型 ([e8ce4dea](https://github.com/ruan-cat/11comm/commit/e8ce4dea))
- **type:** 重构前端类型定义，转换时间字段格式 ([4255be68](https://github.com/ruan-cat/11comm/commit/4255be68))
- **frontend:** 前端组件适配新类型定义 ([c2bf462f](https://github.com/ruan-cat/11comm/commit/c2bf462f))
- **seed:** 修正 initialize-cell 种子数据映射 ([17c2613a](https://github.com/ruan-cat/11comm/commit/17c2613a))
- **api:** API Handler 统一使用 formatDateTime 工具函数 ([bfb11f1e](https://github.com/ruan-cat/11comm/commit/bfb11f1e))
- 社区配置列表接口从 Mock 数据切换为 Drizzle 数据库查询 ([34ed9fb8](https://github.com/ruan-cat/11comm/commit/34ed9fb8))
- **api:** Dev-team 模块 API 使用懒加载数据库 ([bab2ab71](https://github.com/ruan-cat/11comm/commit/bab2ab71))
- **api:** Operation-team 模块 API 使用懒加载数据库 ([0e708f6f](https://github.com/ruan-cat/11comm/commit/0e708f6f))
- **api:** Community-manage 模块 API 使用懒加载数据库 ([60ede67a](https://github.com/ruan-cat/11comm/commit/60ede67a))
- **api:** Contract-manage 模块 API 使用懒加载数据库 ([5f76b61a](https://github.com/ruan-cat/11comm/commit/5f76b61a))
- **api:** Expense-manage 模块 API 使用懒加载数据库 ([080b8496](https://github.com/ruan-cat/11comm/commit/080b8496))
- **api:** House-property-manage 模块 API 使用懒加载数据库 ([95fe2b41](https://github.com/ruan-cat/11comm/commit/95fe2b41))
- **api:** Parking-manage 模块 API 使用懒加载数据库 ([15ae7e4c](https://github.com/ruan-cat/11comm/commit/15ae7e4c))
- **api:** Patrol-manage 模块 API 使用懒加载数据库 ([a9c50be7](https://github.com/ruan-cat/11comm/commit/a9c50be7))
- **api:** Repairs-manage 模块 API 使用懒加载数据库 ([8d6ad781](https://github.com/ruan-cat/11comm/commit/8d6ad781))
- **api:** Report-manage 模块 API 使用懒加载数据库 ([957987f9](https://github.com/ruan-cat/11comm/commit/957987f9))
- **api:** Setting-manage 模块 API 使用懒加载数据库 ([c0c472cd](https://github.com/ruan-cat/11comm/commit/c0c472cd))
- **api:** Dev-team cache-manage 模块错误响应简化 ([56ce1c92](https://github.com/ruan-cat/11comm/commit/56ce1c92))
- **api:** Dev-team config-manage/center 模块错误响应简化 ([763b312f](https://github.com/ruan-cat/11comm/commit/763b312f))
- **api:** Dev-team config-manage/dictionary 模块错误响应简化 ([5c542639](https://github.com/ruan-cat/11comm/commit/5c542639))
- **api:** Dev-team config-manage/item 和 type 模块错误响应简化 ([dbb8be8f](https://github.com/ruan-cat/11comm/commit/dbb8be8f))
- **api:** Dev-team menu-manage 模块错误响应简化 ([bc82a608](https://github.com/ruan-cat/11comm/commit/bc82a608))
- **api:** Operation-team data-manage 模块错误响应简化 ([cd7ad6bc](https://github.com/ruan-cat/11comm/commit/cd7ad6bc))
- **api:** Operation-team merchant-manage 和 report-configuration 模块错误响应简化 ([e8447f7b](https://github.com/ruan-cat/11comm/commit/e8447f7b))
- **api:** Operation-team system-manage 模块错误响应简化 ([1f9060ed](https://github.com/ruan-cat/11comm/commit/1f9060ed))
- **api:** Property-manage community-manage 模块错误响应简化 ([c76f56e0](https://github.com/ruan-cat/11comm/commit/c76f56e0))
- **api:** Property-manage contract-manage 模块错误响应简化 ([0f7c4e7d](https://github.com/ruan-cat/11comm/commit/0f7c4e7d))
- **api:** Property-manage expense-manage 模块错误响应简化 ([a3d5c198](https://github.com/ruan-cat/11comm/commit/a3d5c198))
- **api:** Property-manage house-property-manage 模块错误响应简化 ([efd80267](https://github.com/ruan-cat/11comm/commit/efd80267))
- **api:** Property-manage parking-manage 和 patrol-manage 模块错误响应简化 ([ad9cb94e](https://github.com/ruan-cat/11comm/commit/ad9cb94e))
- **api:** Property-manage repairs-manage 模块错误响应简化 ([21b21a5c](https://github.com/ruan-cat/11comm/commit/21b21a5c))
- **api:** Property-manage report-manage 模块错误响应简化 ([fea4c555](https://github.com/ruan-cat/11comm/commit/fea4c555))
- **api:** Setting-manage organize-manage 模块错误响应简化 ([1fee7929](https://github.com/ruan-cat/11comm/commit/1fee7929))
- **api:** Setting-manage system-manage/change-password 和 community-configuration 模块错误响应简化 ([d05105b4](https://github.com/ruan-cat/11comm/commit/d05105b4))
- **api:** Setting-manage system-manage/initialize-cell 和 register-protocol 模块错误响应简化 ([a7170d6c](https://github.com/ruan-cat/11comm/commit/a7170d6c))
- **api:** Setting-manage system-manage/system-config 模块错误响应简化 ([adc58cc2](https://github.com/ruan-cat/11comm/commit/adc58cc2))

### 📖 Documentation

- **admin:** 更新播种脚本修复报告并添加 reseed 便捷命令 ([5c7521f6](https://github.com/ruan-cat/11comm/commit/5c7521f6))
- **admin:** 检查过往规范和文档对于类型项目操作规范的冲突 ([b4abb4a5](https://github.com/ruan-cat/11comm/commit/b4abb4a5))
- **admin:** ⚠️ 标记报告【full-stack-type-transformation-conflict-analysis】重要。 ([1683558c](https://github.com/ruan-cat/11comm/commit/1683558c))
- **openspec:** ⚠️ 完成类型转型冲突解决的文档清理与配置更新 ([27f9a23d](https://github.com/ruan-cat/11comm/commit/27f9a23d))
- **openspec:** 细化 Schema 编写规范，增加 drizzle-zod 兼容性指南 ([060fc65d](https://github.com/ruan-cat/11comm/commit/060fc65d))
- **openspec,skill:** 增加类型项目路径别名限制规范，禁止源码中使用 @/ 别名 ([87a1bf07](https://github.com/ruan-cat/11comm/commit/87a1bf07))
- **openspec:** 更新全栈类型转换任务进度记录 ([85aae9f6](https://github.com/ruan-cat/11comm/commit/85aae9f6))
- **openspec:** 归档全栈类型转换任务并同步核心标准至主规范 ([510f030b](https://github.com/ruan-cat/11comm/commit/510f030b))
- **claude,skill:** 更新 CLAUDE.md 和 type-project-organization 技能文档 ([aeaa626b](https://github.com/ruan-cat/11comm/commit/aeaa626b))
- **claude:** 更新 CLAUDE.md 对话沟通术语表和数据库 Schema 规范 ([0de18911](https://github.com/ruan-cat/11comm/commit/0de18911))
- **openspec:** 统一 nitro-interface-rewrite 规范与示例 ([9cf979de](https://github.com/ruan-cat/11comm/commit/9cf979de))
- **openspec:** 补充接口实施经验与约束 ([8c255e8d](https://github.com/ruan-cat/11comm/commit/8c255e8d))
- **openspec:** 补充 readValidatedBody 类型回填规范 ([6917b09e](https://github.com/ruan-cat/11comm/commit/6917b09e))
- **skills:** 补充类型回填指引 ([1979314a](https://github.com/ruan-cat/11comm/commit/1979314a))
- **openspec:** 补齐配置管理任务进度 ([bd944d82](https://github.com/ruan-cat/11comm/commit/bd944d82))
- **skills:** 重写 nitro-api-development 技能，强制 JsonVO 类型注解约束 ([e98c5f55](https://github.com/ruan-cat/11comm/commit/e98c5f55))
- **openspec:** 更新 nitro-interface-rewrite 任务执行规范 ([b84fff7d](https://github.com/ruan-cat/11comm/commit/b84fff7d))
- **skills:** 同步更新 schema 参考文档与数据库表清单 ([ffb83371](https://github.com/ruan-cat/11comm/commit/ffb83371))
- **skills:** 新增 schema-change-sync 技能文档 ([3a95fb10](https://github.com/ruan-cat/11comm/commit/3a95fb10))
- **schema-change-sync:** 新增 Schema 驱动的前端业务类型生成规范 ([4bcd5e27](https://github.com/ruan-cat/11comm/commit/4bcd5e27))
- **prompts:** 新增列表页 loading props 补全任务 ([57179876](https://github.com/ruan-cat/11comm/commit/57179876))
- **openspec:** 新增列表页 loading props 补全任务 ([ceba14fc](https://github.com/ruan-cat/11comm/commit/ceba14fc))
- **openspec:** 更新 nitro-interface-rewrite 任务进度并添加完成报告 ([dc9e8986](https://github.com/ruan-cat/11comm/commit/dc9e8986))
- **reports:** 为迁移完成报告添加注释标记 ([c11e9c1c](https://github.com/ruan-cat/11comm/commit/c11e9c1c))
- **skills:** 更新数据库表清单和 Schema Registry 文档 ([0503e0c7](https://github.com/ruan-cat/11comm/commit/0503e0c7))
- **skill:** 新增 Nitro API 时间字段格式化规范 ([301d023e](https://github.com/ruan-cat/11comm/commit/301d023e))
- **prompts:** 新增 seed 命令文档更新任务 ([0f25d898](https://github.com/ruan-cat/11comm/commit/0f25d898))
- **git-commit:** 更新 Windows/PowerShell 提交方式指南 ([fca9e83b](https://github.com/ruan-cat/11comm/commit/fca9e83b))
- 更新 Drizzle Neon 开发文档，增加 vitest 测试规划 ([042cac56](https://github.com/ruan-cat/11comm/commit/042cac56))
- **admin:** 更新 seed 命令文档说明 db:reseed 命令并补充 Schema 同步流程 ([a0f3318d](https://github.com/ruan-cat/11comm/commit/a0f3318d))
- **neon-db-list:** 更新小区配置表清单 ([182aaaf3](https://github.com/ruan-cat/11comm/commit/182aaaf3))
- 更新 drizzle-neon 开发文档中 createdAt 和 updatedAt 字段设计差异 ([f7a80fa5](https://github.com/ruan-cat/11comm/commit/f7a80fa5))
- 更新 neon-postgres-zh 技能文档内容 ([662d9607](https://github.com/ruan-cat/11comm/commit/662d9607))
- 同步时间戳字段命名规范文档 ([df4e038f](https://github.com/ruan-cat/11comm/commit/df4e038f))
- 添加类型检查修复进度报告 ([9113ab59](https://github.com/ruan-cat/11comm/commit/9113ab59))
- **prompt:** 新增全面检查 nitro 接口规范执行程度的任务 ([518371c8](https://github.com/ruan-cat/11comm/commit/518371c8))
- **drizzle-neon:** 标记完成 nitro 接口技能检查任务 ([eed5a103](https://github.com/ruan-cat/11comm/commit/eed5a103))
- **drizzle-neon:** 更新 nitro 测试任务描述并移除已完成章节 ([d1cefc70](https://github.com/ruan-cat/11comm/commit/d1cefc70))
- 添加 Nitro 接口测试命令文档和教程 ([c4da493b](https://github.com/ruan-cat/11comm/commit/c4da493b))
- **skills:** 添加 Nitro 接口测试参考文档 ([52f829cd](https://github.com/ruan-cat/11comm/commit/52f829cd))
- **drizzle-neon:** 清理文档中已完成的 TODO 标记 ([2dc479b3](https://github.com/ruan-cat/11comm/commit/2dc479b3))
- 更新项目 README 说明新的 Schema 架构 ([af0cf40b](https://github.com/ruan-cat/11comm/commit/af0cf40b))
- **skills:** 更新 Skills 路径引用 ([9e10c457](https://github.com/ruan-cat/11comm/commit/9e10c457))
- 更新文档反映懒加载实现 ([53e917b0](https://github.com/ruan-cat/11comm/commit/53e917b0))
- **skills:** 更新 nitro-api-development 技能文档 ([ee7bb8cf](https://github.com/ruan-cat/11comm/commit/ee7bb8cf))
- 更新项目任务进度文档 ([71bd6adf](https://github.com/ruan-cat/11comm/commit/71bd6adf))
- 新增 task 025 Cloudflare Worker 部署命令的任务要求 ([380cb85e](https://github.com/ruan-cat/11comm/commit/380cb85e))
- 新增全栈项目风险分析报告 ([315f6f9a](https://github.com/ruan-cat/11comm/commit/315f6f9a))
- **admin:** 新增 Nitro Cloudflare Worker 部署环境变量配置指南 ([141e156f](https://github.com/ruan-cat/11comm/commit/141e156f))
- **admin:** 更新 Nitro 文档和 TODO 状态 ([48fbf777](https://github.com/ruan-cat/11comm/commit/48fbf777))
- 新增运行命令流程说明 - test:nitro 需先运行 dev ([ca0eef37](https://github.com/ruan-cat/11comm/commit/ca0eef37))
- 更新任务 027 状态为已完成 ([a38de6e5](https://github.com/ruan-cat/11comm/commit/a38de6e5))
- **admin:** 新增 Nitro + Neon Auth 集成调研报告 ([935962fe](https://github.com/ruan-cat/11comm/commit/935962fe))
- **openspec:** 新增 Nitro API 认证变更任务 ([e0340027](https://github.com/ruan-cat/11comm/commit/e0340027))
- **openspec:** 新增认证相关规范文档 ([4ca6fa9f](https://github.com/ruan-cat/11comm/commit/4ca6fa9f))
- **admin:** 更新 Drizzle Neon 笔记文档 ([61f91e45](https://github.com/ruan-cat/11comm/commit/61f91e45))
- 同步更新文档中的环境变量名称 ([aa2196ad](https://github.com/ruan-cat/11comm/commit/aa2196ad))
- 更新 drizzle-neon 文档状态标记 ([1aa792db](https://github.com/ruan-cat/11comm/commit/1aa792db))
- **reports:** 新增 2026-02-27 项目全面风险评估报告 ([077ccb0c](https://github.com/ruan-cat/11comm/commit/077ccb0c))
- **reports:** ⚠️ 移除 error.stack 作为独立风险项，重新评估风险等级 ([93aa542e](https://github.com/ruan-cat/11comm/commit/93aa542e))
- **openspec:** ⚠️ 修正 nitro-api-authentication 设计文档中全部违反 Skill 规范的代码示例 ([d6538924](https://github.com/ruan-cat/11comm/commit/d6538924))
- **reports:** 新增 Nitro v3 Cloudflare Worker 环境变量深度分析报告 ([c97dc242](https://github.com/ruan-cat/11comm/commit/c97dc242))
- **skills:** ⚠️ 扩展 nitro-api-development 技能，新增多平台数据库连接与 Cloudflare 环境变量获取规范 ([ceab997f](https://github.com/ruan-cat/11comm/commit/ceab997f))
- **reports:** 标记分析报告已沉淀为全局技能 ([254ec0ce](https://github.com/ruan-cat/11comm/commit/254ec0ce))

### 🔨 构建相关

- **db:** 重新生成种子数据文件 ([8a87ee50](https://github.com/ruan-cat/11comm/commit/8a87ee50))
- **admin:** 新增 Cloudflare Worker 部署的 turbo 命令链 ([6c4f879f](https://github.com/ruan-cat/11comm/commit/6c4f879f))

### 🏡 Chore

- **admin:** 更新种子 seed 初始化 sql 文件。 ([6fe45796](https://github.com/ruan-cat/11comm/commit/6fe45796))
- **prompt,admin:** 为提示词增加标签序号。 ([21326d00](https://github.com/ruan-cat/11comm/commit/21326d00))
- **prompt,admin:** 增加 `analyze-mock-data-and-create-db-seed` 标签。 ([82631762](https://github.com/ruan-cat/11comm/commit/82631762))
- **prompt,admin:** 设计任务【排查现有的 schema 是否存在冲突配置】 ([7a49184a](https://github.com/ruan-cat/11comm/commit/7a49184a))
- **prompt,admin:** 设计任务【检查 seed 生成脚本内隐藏的风险项】 ([4d6b25a9](https://github.com/ruan-cat/11comm/commit/4d6b25a9))
- **admin:** ⚠️ 尝试解决填充数据库出现的故障。 ([4f3987b4](https://github.com/ruan-cat/11comm/commit/4f3987b4))
- **admin:** ⚠️ 重新生成 seed 数据库初始化脚本。 ([dcbd00e4](https://github.com/ruan-cat/11comm/commit/dcbd00e4))
- **admin:** 增加处理 sql 语句的报告，未来酌情删除该报告。 ([5d39f204](https://github.com/ruan-cat/11comm/commit/5d39f204))
- **admin:** ⚠️ 重新生成一大批 sql，尝试解决 seed 初始化数据库出现的故障。 ([05ce88b4](https://github.com/ruan-cat/11comm/commit/05ce88b4))
- **prompt,admin:** 完成任务【排查现有的 schema 是否存在冲突配置】 ([6bf2b456](https://github.com/ruan-cat/11comm/commit/6bf2b456))
- **admin:** 重新生成数据库脚本 ([59348fd1](https://github.com/ruan-cat/11comm/commit/59348fd1))
- **admin:** 重新生成数据库表迁移脚本。 ([bc6dd758](https://github.com/ruan-cat/11comm/commit/bc6dd758))
- **prompt,admin:** 完成任务【检查 seed 生成脚本内隐藏的风险项】 ([f303dccb](https://github.com/ruan-cat/11comm/commit/f303dccb))
- 为 gemini 专项增加项目级别的技能，便于 Antigravity 识别使用。 ([c46af5b7](https://github.com/ruan-cat/11comm/commit/c46af5b7))
- **prompt,admin:** 设计任务【总结故障，并编写合适的 skills 技能，避免未来在处理 schema 数据库表、和生成 seed 种子数据时，出现故障】 ([ba8ae867](https://github.com/ruan-cat/11comm/commit/ba8ae867))
- **prompt,admin:** 完成任务【总结故障，并编写合适的 skills 技能，避免未来在处理 schema 数据库表、和生成 seed 种子数据时，出现故障】 ([d23d46d9](https://github.com/ruan-cat/11comm/commit/d23d46d9))
- **admin:** 标记报告可以被删除 ([e918d3d1](https://github.com/ruan-cat/11comm/commit/e918d3d1))
- **prompt,admin:** 拓展任务细节【检查过往规范和文档对于类型项目操作规范的冲突】 ([0ee18a49](https://github.com/ruan-cat/11comm/commit/0ee18a49))
- **prompt,admin:** 拓展任务细节【检查过往规范和文档对于类型项目操作规范的冲突】 ([68427916](https://github.com/ruan-cat/11comm/commit/68427916))
- **prompt,admin:** 完成任务【检查过往规范和文档对于类型项目操作规范的冲突】 ([a5087635](https://github.com/ruan-cat/11comm/commit/a5087635))
- **openspec:** 归档任务 ([cc7555fb](https://github.com/ruan-cat/11comm/commit/cc7555fb))
- **prompt,admin:** 设计任务【完成 `resolve-type-transformation-conflicts` 相关的清理与重构任务】 ([b964eef5](https://github.com/ruan-cat/11comm/commit/b964eef5))
- **type,openspec:** 完成类型项目基础设施升级与任务验证 ([0fce69d2](https://github.com/ruan-cat/11comm/commit/0fce69d2))
- **openspec:** 归档已完成的 resolve-type-transformation-conflicts 任务 ([7c207d4f](https://github.com/ruan-cat/11comm/commit/7c207d4f))
- **prompt,admin:** 标记完成任务【完成 `resolve-type-transformation-conflicts` 相关的清理与重构任务】 ([275a0eb3](https://github.com/ruan-cat/11comm/commit/275a0eb3))
- 同步 AI 记忆文档。 ([36140b24](https://github.com/ruan-cat/11comm/commit/36140b24))
- **prompt,admin:** 设计复杂任务【完成 nitro 接口改写任务】 ([6b03607b](https://github.com/ruan-cat/11comm/commit/6b03607b))
- **prompt,admin:** ⚠️ 经过仔细检查，确认完成【`full-stack-type-transformation`】全栈类型迁移与改造任务。 ([9d26c485](https://github.com/ruan-cat/11comm/commit/9d26c485))
- **prompt,admin:** 设计任务【清除掉过时的 `对话沟通术语表` ，并更新该表】 ([89a8936a](https://github.com/ruan-cat/11comm/commit/89a8936a))
- **prompt,admin:** Openspec\specs ([ae9b6a6d](https://github.com/ruan-cat/11comm/commit/ae9b6a6d))
- **prompt,admin:** 设计完整任务【压缩合并 openspec 现存的 spec 规范，整理归纳成概括性强的 skills 技能规范】 ([7474f02e](https://github.com/ruan-cat/11comm/commit/7474f02e))
- **prompt,admin:** 完成任务【清除掉过时的 `对话沟通术语表` ，并更新该表】 ([2204c1d4](https://github.com/ruan-cat/11comm/commit/2204c1d4))
- **prompt,admin:** 完成任务【压缩合并 openspec 现存的 spec 规范，整理归纳成概括性强的 skills 技能规范】 ([d2f74883](https://github.com/ruan-cat/11comm/commit/d2f74883))
- **prompt,admin:** 增加 nitro-interface-rewrite 说明注释。 ([24e5ba02](https://github.com/ruan-cat/11comm/commit/24e5ba02))
- **prompt,admin:** 设计任务【继续改进现有的 `nitro-interface-rewrite` 任务】 ([4a61eab3](https://github.com/ruan-cat/11comm/commit/4a61eab3))
- 手动更新 AI 记忆文件。 ([e74d04e8](https://github.com/ruan-cat/11comm/commit/e74d04e8))
- **prompt,admin:** ⚠️ 设计任务【迭代更新现有的接口：补全错误处理、参数获取、返回值字段等来自`nitro-api-development`技能的新要求】 ([27e7fa4a](https://github.com/ruan-cat/11comm/commit/27e7fa4a))
- **prompt,admin:** 完成任务【迭代更新现有的接口：补全错误处理、参数获取、返回值字段等来自`nitro-api-development`技能的新要求】 ([247b9967](https://github.com/ruan-cat/11comm/commit/247b9967))
- **openspec:** 更新 nitro-interface-rewrite 任务设计文档 ([05a1971e](https://github.com/ruan-cat/11comm/commit/05a1971e))
- **openspec:** 更新 nitro-interface-rewrite 任务进度 ([b47a8da2](https://github.com/ruan-cat/11comm/commit/b47a8da2))
- **openspec:** 更新 cache-manage 和 menu-manage 任务完成状态 ([67d42abf](https://github.com/ruan-cat/11comm/commit/67d42abf))
- **db:** 合并数据库迁移文件并修复种子数据 ([c8cb96a6](https://github.com/ruan-cat/11comm/commit/c8cb96a6))
- **openspec:** 归档 add-loading-props-to-index-pages 变更 ([b1ff5074](https://github.com/ruan-cat/11comm/commit/b1ff5074))
- **prompt,admin:** 完成任务【为全部的 index.vue 列表页文件，补全 `:loading="isFetching"` 的组件 props 使用】 ([c5bd3ffd](https://github.com/ruan-cat/11comm/commit/c5bd3ffd))
- **prompt,admin:** 设计任务【根据增加的 schema 数据库表，及时补全对应的文档和内容】 ([d60d8153](https://github.com/ruan-cat/11comm/commit/d60d8153))
- **prompt,admin:** 设计任务【根据报告提及到的特殊情况，继续完成对应 nitro 接口的改造】 ([15ea2f90](https://github.com/ruan-cat/11comm/commit/15ea2f90))
- **claude:** 增加 git commit 本地技能，便于 kiro 识别使用。 ([e2bada09](https://github.com/ruan-cat/11comm/commit/e2bada09))
- **prompt,admin:** 完成任务【### 03 根据增加的 schema 数据库表，及时补全对应的文档和内容】 ([c2be544d](https://github.com/ruan-cat/11comm/commit/c2be544d))
- 更新 Drizzle Neon 开发文档，新增格式化函数补全任务 ([a8ed7c2d](https://github.com/ruan-cat/11comm/commit/a8ed7c2d))
- **admin:** 标记任务 024 seed 命令文档更新为已完成 ([bbe359de](https://github.com/ruan-cat/11comm/commit/bbe359de))
- **admin:** 标记任务 04 nitro 接口改造为已完成 ([7867833a](https://github.com/ruan-cat/11comm/commit/7867833a))
- **prompt,admin:** 更新任务进度记录，准备处理不统一的 nitro 接口写法细节问题。 ([cce22084](https://github.com/ruan-cat/11comm/commit/cce22084))
- **prompt,admin:** 完成任务【更新迭代 createdAt 和 updatedAt 的字段设计差异】 ([6f591626](https://github.com/ruan-cat/11comm/commit/6f591626))
- **openspec:** 归档 nitro-interface-rewrite 变更 ([6feb4dd0](https://github.com/ruan-cat/11comm/commit/6feb4dd0))
- 手动同步信息。 ([28e7f907](https://github.com/ruan-cat/11comm/commit/28e7f907))
- **server:** 实现数据库连接懒加载模式 ([48714b65](https://github.com/ruan-cat/11comm/commit/48714b65))
- **prompt,admin:** 设计完整的 wrangler.toml 环境变量写入方案。 ([c24ce76b](https://github.com/ruan-cat/11comm/commit/c24ce76b))
- 添加 Vercel 部署构建命令 ([a08a209d](https://github.com/ruan-cat/11comm/commit/a08a209d))
- **admin:** 标记任务 026 全栈项目风险分析为已完成 ([42310c35](https://github.com/ruan-cat/11comm/commit/42310c35))
- **admin:** 标记任务 012 nitro 接口生产环境故障处理为已完成 ([0c365b45](https://github.com/ruan-cat/11comm/commit/0c365b45))
- **server:** 新增临时调试端点排查 Cloudflare Worker 环境变量问题 ([ce02423a](https://github.com/ruan-cat/11comm/commit/ce02423a))
- **server:** 修复调试端点的 Cloudflare Worker 部署错误 ([09512638](https://github.com/ruan-cat/11comm/commit/09512638))
- **server:** 更新调试端点 v2 — 深入探查 Nitro 上下文和 Cloudflare 原生 API ([fd3d587d](https://github.com/ruan-cat/11comm/commit/fd3d587d))
- **server:** 更新调试端点 v3 — 新增 event.req.runtime.cloudflare.env 路径探查 ([ed3a1bf5](https://github.com/ruan-cat/11comm/commit/ed3a1bf5))
- **skills:** 同步链接 .agents 目录中的现存 git-commit 规则 ([ccff6ee8](https://github.com/ruan-cat/11comm/commit/ccff6ee8))

### ✅ Tests

- 添加 Nitro 接口测试环境配置和 100+ 测试用例 ([c3566d45](https://github.com/ruan-cat/11comm/commit/c3566d45))

### 🎨 Styles

- **openspec:** 格式化 ([6b849a51](https://github.com/ruan-cat/11comm/commit/6b849a51))
- 格式化多个 Vue 组件和配置文件 ([d51f85f2](https://github.com/ruan-cat/11comm/commit/d51f85f2))

### 🤖 CI

- **package.json:** ⚠️ 更新 cloudflare worker 的部署索引命令。 ([fb8edaba](https://github.com/ruan-cat/11comm/commit/fb8edaba))
- **config,package.json,admin:** 增加命令 nitro:build:vercel ([1edcd49f](https://github.com/ruan-cat/11comm/commit/1edcd49f))
- **package.json,admin:** 编写 postbuild:vercel:admin 的附属文件移动命令，尝试实现在 vercel 平台内完成部署。 ([20bfba7c](https://github.com/ruan-cat/11comm/commit/20bfba7c))

### 🔧 更新配置

- **vitepress,admin:** ⚠️ 更新配置，不再复制粘贴 agent 目录，而是命令目录和 skills 目录。 ([67380ce5](https://github.com/ruan-cat/11comm/commit/67380ce5))
- **vitepress,admin:** ⚠️ 不再提供复制粘贴 claude 文件的配置。 ([035d517b](https://github.com/ruan-cat/11comm/commit/035d517b))
- **vsc:** ⚠️ 增加面向大语言模型的记忆文件。 ([a7e2a4a2](https://github.com/ruan-cat/11comm/commit/a7e2a4a2))
- **config,admin:** ⚠️ Cloudflare 开启可观察日志。 ([6dae0289](https://github.com/ruan-cat/11comm/commit/6dae0289))
- **vitest:** 添加 Nitro 接口测试环境配置 ([5b3bdb57](https://github.com/ruan-cat/11comm/commit/5b3bdb57))
- **admin:** 添加 cloudflare.wrangler.vars 环境变量配置 ([c967f78b](https://github.com/ruan-cat/11comm/commit/c967f78b))
- 配置 Vercel 部署的 Turbo 任务和构建脚本 ([a16cfd85](https://github.com/ruan-cat/11comm/commit/a16cfd85))
- **server,config,admin:** ⚠️ 重点设置各个平台提供的破坏性兼容性日期配置。确保 nitro 接口经可能兼容多个平台。 ([9d8a741e](https://github.com/ruan-cat/11comm/commit/9d8a741e))
- ⚠️ 优化 Cloudflare 构建命令，移除环境变量拉取依赖 ([5df2e1a8](https://github.com/ruan-cat/11comm/commit/5df2e1a8))
- **admin:** ⚠️ 更改后台默认主题为深色红色混合布局 ([29d31fda](https://github.com/ruan-cat/11comm/commit/29d31fda))
- **skills:** 添加 skills-lock.json 技能依赖锁定配置 ([97a6ebe1](https://github.com/ruan-cat/11comm/commit/97a6ebe1))

#### ⚠️ Breaking Changes

- **claude:** ⚠️ 处理 vitepress 文档构建故障，避免出现未闭合的标签。 ([e97053b2](https://github.com/ruan-cat/11comm/commit/e97053b2))
- **server,admin:** ⚠️ 尝试解决 schema 数据库表内存在的隐藏故障。 ([c6830e02](https://github.com/ruan-cat/11comm/commit/c6830e02))
- **server,admin:** ⚠️ 补全数据库生成脚本，尝试处理故障 ([5c52e6b1](https://github.com/ruan-cat/11comm/commit/5c52e6b1))
- **package.json:** ⚠️ 处理 "cp": "shx cp -r apps/admin/.vercel/output .vercel", 出现的故障，删除掉多余的目录移动 ([2e4ba619](https://github.com/ruan-cat/11comm/commit/2e4ba619))
- **server:** ⚠️ 修复 Cloudflare Worker 环境变量名称大小写 ([c6d87867](https://github.com/ruan-cat/11comm/commit/c6d87867))
- **server:** ⚠️ 修复 Cloudflare Worker 环境下 useDb 获取环境变量失败的问题 ([f71c7c10](https://github.com/ruan-cat/11comm/commit/f71c7c10))
- **server:** ⚠️ 修复 Cloudflare Worker 通过 Dashboard 设置的 Secrets 无法被读取的问题 ([ec30b22d](https://github.com/ruan-cat/11comm/commit/ec30b22d))
- **server:** ⚠️ 修复 Cloudflare Worker 环境下数据库 URL 获取失败的根本原因 ([bf15e586](https://github.com/ruan-cat/11comm/commit/bf15e586))
- **server,admin:** ⚠️ 删改 schema 数据库表，多余的字段。 ([c2aed05f](https://github.com/ruan-cat/11comm/commit/c2aed05f))
- **admin:** ⚠️ 全部 config-manage 接口强制 JsonVO 类型注解约束 ([13d20ecf](https://github.com/ruan-cat/11comm/commit/13d20ecf))
- **admin:** ⚠️ 标记报告【full-stack-type-transformation-conflict-analysis】重要。 ([1683558c](https://github.com/ruan-cat/11comm/commit/1683558c))
- **openspec:** ⚠️ 完成类型转型冲突解决的文档清理与配置更新 ([27f9a23d](https://github.com/ruan-cat/11comm/commit/27f9a23d))
- **reports:** ⚠️ 移除 error.stack 作为独立风险项，重新评估风险等级 ([93aa542e](https://github.com/ruan-cat/11comm/commit/93aa542e))
- **openspec:** ⚠️ 修正 nitro-api-authentication 设计文档中全部违反 Skill 规范的代码示例 ([d6538924](https://github.com/ruan-cat/11comm/commit/d6538924))
- **skills:** ⚠️ 扩展 nitro-api-development 技能，新增多平台数据库连接与 Cloudflare 环境变量获取规范 ([ceab997f](https://github.com/ruan-cat/11comm/commit/ceab997f))
- **admin:** ⚠️ 尝试解决填充数据库出现的故障。 ([4f3987b4](https://github.com/ruan-cat/11comm/commit/4f3987b4))
- **admin:** ⚠️ 重新生成 seed 数据库初始化脚本。 ([dcbd00e4](https://github.com/ruan-cat/11comm/commit/dcbd00e4))
- **admin:** ⚠️ 重新生成一大批 sql，尝试解决 seed 初始化数据库出现的故障。 ([05ce88b4](https://github.com/ruan-cat/11comm/commit/05ce88b4))
- **prompt,admin:** ⚠️ 经过仔细检查，确认完成【`full-stack-type-transformation`】全栈类型迁移与改造任务。 ([9d26c485](https://github.com/ruan-cat/11comm/commit/9d26c485))
- **prompt,admin:** ⚠️ 设计任务【迭代更新现有的接口：补全错误处理、参数获取、返回值字段等来自`nitro-api-development`技能的新要求】 ([27e7fa4a](https://github.com/ruan-cat/11comm/commit/27e7fa4a))
- **package.json:** ⚠️ 更新 cloudflare worker 的部署索引命令。 ([fb8edaba](https://github.com/ruan-cat/11comm/commit/fb8edaba))
- **vitepress,admin:** ⚠️ 更新配置，不再复制粘贴 agent 目录，而是命令目录和 skills 目录。 ([67380ce5](https://github.com/ruan-cat/11comm/commit/67380ce5))
- **vitepress,admin:** ⚠️ 不再提供复制粘贴 claude 文件的配置。 ([035d517b](https://github.com/ruan-cat/11comm/commit/035d517b))
- **vsc:** ⚠️ 增加面向大语言模型的记忆文件。 ([a7e2a4a2](https://github.com/ruan-cat/11comm/commit/a7e2a4a2))
- **config,admin:** ⚠️ Cloudflare 开启可观察日志。 ([6dae0289](https://github.com/ruan-cat/11comm/commit/6dae0289))
- **server,config,admin:** ⚠️ 重点设置各个平台提供的破坏性兼容性日期配置。确保 nitro 接口经可能兼容多个平台。 ([9d8a741e](https://github.com/ruan-cat/11comm/commit/9d8a741e))
- ⚠️ 优化 Cloudflare 构建命令，移除环境变量拉取依赖 ([5df2e1a8](https://github.com/ruan-cat/11comm/commit/5df2e1a8))
- **admin:** ⚠️ 更改后台默认主题为深色红色混合布局 ([29d31fda](https://github.com/ruan-cat/11comm/commit/29d31fda))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## v0.9.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.8.0...v0.9.0)

### ✨ 新增功能

- **admin:** 实现 Vercel Neon 环境变量前缀机制 ([a9ade902](https://github.com/ruan-cat/11comm/commit/a9ade902))
- **admin,db:** 实现 Neon 数据库 Schema 并生成初始迁移 ([448a5e28](https://github.com/ruan-cat/11comm/commit/448a5e28))
- **admin/scripts:** 添加数据库 mock 数据生成与种子填充脚本 ([f4269e24](https://github.com/ruan-cat/11comm/commit/f4269e24))
- 添加了初始化 Neon 数据库模式的设计和任务文档。 ([50fcbc2e](https://github.com/ruan-cat/11comm/commit/50fcbc2e))
- 添加停车结构数据库表及其 Drizzle 模式和迁移文件。 ([49a6d2e2](https://github.com/ruan-cat/11comm/commit/49a6d2e2))
- **type:** ⚠️ 为解决数据库数据生成问题，补全类型项目内出现的业务类型字段。 ([9cde5f82](https://github.com/ruan-cat/11comm/commit/9cde5f82))
- **agent:** 新增 neon-db-list 技能 ([3cbc5c0a](https://github.com/ruan-cat/11comm/commit/3cbc5c0a))
- **db:** ✨ 同步业务类型定义至数据库 Schema ([ad5441a4](https://github.com/ruan-cat/11comm/commit/ad5441a4))

### 🐞 修复缺陷

- **server,admin:** ⚠️ 处理生成 seed 数据库数据脚本的类型报错。 ([61301d09](https://github.com/ruan-cat/11comm/commit/61301d09))

### 🦄 代码重构

- **claude:** ⚠️ 重构技能文件。 ([a8fa576c](https://github.com/ruan-cat/11comm/commit/a8fa576c))
- **turbo,openspec,config,type,server,package.json,admin,root,claude:** ⚠️ 初始化 lintstage 配置，并且默认对全部代码做一个全量的 prettier 格式化。 ([01eb1aae](https://github.com/ruan-cat/11comm/commit/01eb1aae))
- **claude:** ⚠️ 重命名文件，改成 use 开头的技能，避免被误导。 ([3deeae0f](https://github.com/ruan-cat/11comm/commit/3deeae0f))
- **claude:** ⚠️ 及时更新技能的名称 use-nitro 。 ([bcd0e7b1](https://github.com/ruan-cat/11comm/commit/bcd0e7b1))
- **claude:** ⚠️ Claude 的技能文件不允许设置成符号链接的目录文件。 ([745d4ba5](https://github.com/ruan-cat/11comm/commit/745d4ba5))
- **admin:** 移动报告位置。 ([794c563d](https://github.com/ruan-cat/11comm/commit/794c563d))
- **env,admin,root:** ⚠️ 改造 Vercel 环境变量存储与获取方式 ([230f7c76](https://github.com/ruan-cat/11comm/commit/230f7c76))
- **prompt,admin:** ⚠️ Create-git-commit 认定为不再使用的 AI 文档。现在被 git-commit 技能替代了 ([107f5d31](https://github.com/ruan-cat/11comm/commit/107f5d31))
- **claude:** ⚠️ 技能重做，同时提供 mock 和 neon 两种编写模式。 ([ae65183e](https://github.com/ruan-cat/11comm/commit/ae65183e))
- **openspec:** ⚠️ 重新设计 analyze-mock-data-and-create-db-seed 任务。 ([d2063b35](https://github.com/ruan-cat/11comm/commit/d2063b35))
- **openspec:** 手动回退任务 ([a5f8f28f](https://github.com/ruan-cat/11comm/commit/a5f8f28f))
- **admin:** ⚠️ 全面更新 sql 语句，用于生成 seed 初始化数据库内容。 ([ed4456a4](https://github.com/ruan-cat/11comm/commit/ed4456a4))
- **openspec:** ⚠️ 拓展非常详细清晰的 `full-stack-type-transformation` 任务 ([4f4c0762](https://github.com/ruan-cat/11comm/commit/4f4c0762))
- **openspec:** 重构 full-stack-type-transformation 目录结构 ([a4ef6cf3](https://github.com/ruan-cat/11comm/commit/a4ef6cf3))

### 📖 Documentation

- **claude:** 补充【pure-admin 后台框架模板】 ([d654988f](https://github.com/ruan-cat/11comm/commit/d654988f))
- **claude:** Pure-admin 注册路由 ([4a35d9a4](https://github.com/ruan-cat/11comm/commit/4a35d9a4))
- **claude:** 补充 claude code skill 作为公共技术栈要学习 ([72c289e6](https://github.com/ruan-cat/11comm/commit/72c289e6))
- **claude:** 增加 gemini 的提示词 ([7486d3e3](https://github.com/ruan-cat/11comm/commit/7486d3e3))
- **prompt,admin:** 完成任务【编写面向 nitro v3 接口写法的完整 claude code 技能规范】 ([75df3813](https://github.com/ruan-cat/11comm/commit/75df3813))
- **claude:** ⚠️ 一次性初始化全部 neon 的 skills。使用 neonctl 完成初始化。 ([a1135561](https://github.com/ruan-cat/11comm/commit/a1135561))
- ⚠️ 完成 neon 技能的翻译。 ([850cb3ca](https://github.com/ruan-cat/11comm/commit/850cb3ca))
- **admin:** Add git commit skills research report ([bb3ddd9e](https://github.com/ruan-cat/11comm/commit/bb3ddd9e))
- **prompt,admin:** 初始化 neon 数据库的数据库表字段定义。 ([95eab4a3](https://github.com/ruan-cat/11comm/commit/95eab4a3))
- **openspec,admin:** 完成 Neon 数据库 schema 规范设计 ([105e8ce2](https://github.com/ruan-cat/11comm/commit/105e8ce2))
- **admin,db:** 添加数据库迁移故障事故报告 ([16660e42](https://github.com/ruan-cat/11comm/commit/16660e42))
- **openspec:** 设计基于 seed 插入 mock 数据的 neon 数据库初始化方案。 ([9363f6bc](https://github.com/ruan-cat/11comm/commit/9363f6bc))
- **admin/reports:** 添加数据库种子生成与检查报告 ([86e3aeff](https://github.com/ruan-cat/11comm/commit/86e3aeff))
- 为 admin 应用添加 README 和 seed 命令指南。 ([8c01c84b](https://github.com/ruan-cat/11comm/commit/8c01c84b))
- **neon-db-list:** 完善目录结构并汉化来源标注 ([6d0d7c62](https://github.com/ruan-cat/11comm/commit/6d0d7c62))
- 同步更新 AI 文档。 ([7fde87c8](https://github.com/ruan-cat/11comm/commit/7fde87c8))
- **admin:** 新建报告【2026-02-06 全栈类型统一改造深度评估与实施方案】 ([a5ced27a](https://github.com/ruan-cat/11comm/commit/a5ced27a))
- **claude:** ⚠️ 记录严格的操作规范，【禁止全局安装工具包】 ([98b01288](https://github.com/ruan-cat/11comm/commit/98b01288))
- **openspec:** 完善全栈类型改造的任务清单与基础设施规范 ([9ee01ad1](https://github.com/ruan-cat/11comm/commit/9ee01ad1))

### 🏡 Chore

- **prompt,admin:** 阅读每一个页面，检查代码写法是否正常，是否有需要微调的部分。 ([9eacdef2](https://github.com/ruan-cat/11comm/commit/9eacdef2))
- **claude:** 排序 ([b208f091](https://github.com/ruan-cat/11comm/commit/b208f091))
- 同步全局 AI 记忆文件 ([e2e1e105](https://github.com/ruan-cat/11comm/commit/e2e1e105))
- **prompt,admin:** 设计任务【改造 agent 文件为 skills 技能文件】 ([0a5bbbdd](https://github.com/ruan-cat/11comm/commit/0a5bbbdd))
- **prompt,admin:** 标记任务进度【接入 drizzle 和 neon 数据库，改造项目的 nitro 接口，实现真实的后端】 ([97d80693](https://github.com/ruan-cat/11comm/commit/97d80693))
- **claude:** 用自动化工具，完成内容重设。 ([3d494904](https://github.com/ruan-cat/11comm/commit/3d494904))
- **prompt,admin:** 新建长任务【制作`neon-postgres`的一系列技能翻译】 ([1954fcc7](https://github.com/ruan-cat/11comm/commit/1954fcc7))
- **openspec:** 标记完成任务进度 ([70d78d66](https://github.com/ruan-cat/11comm/commit/70d78d66))
- **openspec:** ⚠️ 归档任务 ([cc0aca23](https://github.com/ruan-cat/11comm/commit/cc0aca23))
- **prompt,admin:** 标记任务【制作`neon-postgres`的一系列技能翻译】已完成 ([d09be278](https://github.com/ruan-cat/11comm/commit/d09be278))
- **prompt,admin:** 删除 stylelint ([e6dd1de1](https://github.com/ruan-cat/11comm/commit/e6dd1de1))
- **admin:** 准备记录 package.json 命令。 ([3e4b3b35](https://github.com/ruan-cat/11comm/commit/3e4b3b35))
- **prompt,admin:** 设计任务【从其他项目模仿 neon 的初始化配置】 ([60ca6c14](https://github.com/ruan-cat/11comm/commit/60ca6c14))
- **prompt,admin:** ⚠️ 设计复杂提示词任务 ([db67369f](https://github.com/ruan-cat/11comm/commit/db67369f))
- **prompt,admin:** 更改 link 的过程，修改脚本。 ([6cc8b394](https://github.com/ruan-cat/11comm/commit/6cc8b394))
- **admin:** .claude/skills/commit-work 符号链接调查报告。 ([f69502f4](https://github.com/ruan-cat/11comm/commit/f69502f4))
- **prompt,admin:** ⚠️ 设计复杂任务【设计专用的前缀变量，重设 admin 项目使用】 ([2b965c38](https://github.com/ruan-cat/11comm/commit/2b965c38))
- **prompt,admin:** 完成任务【设计专用的前缀变量，重设 admin 项目使用】 ([c6cda029](https://github.com/ruan-cat/11comm/commit/c6cda029))
- **prompt,admin:** 设计任务【初始化 neon 数据库的数据库表字段定义】 ([0c5f31ce](https://github.com/ruan-cat/11comm/commit/0c5f31ce))
- **admin,db:** 提交初始数据库迁移 SQL 文件 ([3b36bcba](https://github.com/ruan-cat/11comm/commit/3b36bcba))
- **openspec:** 初始化 neon 数据库 schema 规范 ([3d2004bf](https://github.com/ruan-cat/11comm/commit/3d2004bf))
- 重置并应用数据库迁移 ([1e8f8602](https://github.com/ruan-cat/11comm/commit/1e8f8602))
- **prompt,admin:** 设计任务【排查 `openspec\specs` 存在的潜在冲突与风险内容】 ([fcdd8c99](https://github.com/ruan-cat/11comm/commit/fcdd8c99))
- **prompt,admin:** 完成任务【初始化 neon 数据库的数据库表字段定义】 ([64463db8](https://github.com/ruan-cat/11comm/commit/64463db8))
- 设计迁移 use-nitro 本地技能的子任务。 ([80ca340d](https://github.com/ruan-cat/11comm/commit/80ca340d))
- 初步编写 nitro 旧规范的迁移报告。 ([45692d96](https://github.com/ruan-cat/11comm/commit/45692d96))
- 增加进一步的技能拆分要求。 ([bb395240](https://github.com/ruan-cat/11comm/commit/bb395240))
- 更新改造 openspec\specs\nitro-api\spec.md 规范，迁移到 openspec\specs\nitro-api-with-mock\spec.md 规范。 ([e129fed8](https://github.com/ruan-cat/11comm/commit/e129fed8))
- **prompt,admin:** 设计任务【分析 nitro 假数据并编写 neon 数据库插入脚本】 ([46234bdc](https://github.com/ruan-cat/11comm/commit/46234bdc))
- **admin:** 2026-02-03 Neon + Drizzle 数据库初始化方案探索报告 ([a4ffb3ef](https://github.com/ruan-cat/11comm/commit/a4ffb3ef))
- **admin:** 设计【更新 `apps\admin\README.md` 文档】任务 ([3dbfaf0c](https://github.com/ruan-cat/11comm/commit/3dbfaf0c))
- **admin:** 设计【更新 `apps\admin\README.md` 文档】任务 ([e90bc8af](https://github.com/ruan-cat/11comm/commit/e90bc8af))
- **admin/db:** 添加生成的数据库初始化 sql 种子文件 ([cd47aa4f](https://github.com/ruan-cat/11comm/commit/cd47aa4f))
- **admin:** 标记报告文档有参考意义。 ([7b9ab326](https://github.com/ruan-cat/11comm/commit/7b9ab326))
- **prompt,admin:** 拓展【更新 `apps\admin\README.md` 文档】任务要求和细节。 ([2d068553](https://github.com/ruan-cat/11comm/commit/2d068553))
- **prompt,admin:** 设计任务【处理 `apps\admin\server\db\seed-sql` 内文件出现的类型报错】 ([96db1812](https://github.com/ruan-cat/11comm/commit/96db1812))
- **prompt,admin:** 设计任务【重启任务并自我复查是否有缺漏缺省的内容】 ([7096c430](https://github.com/ruan-cat/11comm/commit/7096c430))
- **prompt,admin:** ⚠️ 要求复查，重做完整的任务列表列表，仔细检查是否有缺漏的数据库表。 ([8340eece](https://github.com/ruan-cat/11comm/commit/8340eece))
- 手动更新 AI 记忆文档。 ([30a0e604](https://github.com/ruan-cat/11comm/commit/30a0e604))
- **claude:** 更新文档标题排序。 ([6884116d](https://github.com/ruan-cat/11comm/commit/6884116d))
- 设计 init-neon-db-schema 的任务清单 ([c88b22a2](https://github.com/ruan-cat/11comm/commit/c88b22a2))
- 提供任务完整性报告； ([a4fc03ca](https://github.com/ruan-cat/11comm/commit/a4fc03ca))
- 归档 init-neon-db-schema 任务 ([8ca348bd](https://github.com/ruan-cat/11comm/commit/8ca348bd))
- **prompt,admin:** 完成任务【检查任务并自我复查是否有缺漏缺省的内容】 ([83b43c0a](https://github.com/ruan-cat/11comm/commit/83b43c0a))
- 完成任务【更新 `apps\admin\README.md` 文档】 ([8c9fde49](https://github.com/ruan-cat/11comm/commit/8c9fde49))
- 为新增加的数据库表，补全增加 seed 种子数据的初始化配置。 ([872f0134](https://github.com/ruan-cat/11comm/commit/872f0134))
- 完成【继续执行 `analyze-mock-data-and-create-db-seed` 任务】任务 ([37ea3bc6](https://github.com/ruan-cat/11comm/commit/37ea3bc6))
- 手动赋值粘贴【2026-02-05 11comm 终极全栈类型统一改造计划 】报告，来自 gemini 生成。 ([aa348766](https://github.com/ruan-cat/11comm/commit/aa348766))
- 扩充任务【处理 `apps\admin\server\db\seed-sql` 内文件出现的类型报错，并评估 `analyze-mock-data-and-create-db-seed` 任务是否已经完整的执行完成了】 ([1b1b1184](https://github.com/ruan-cat/11comm/commit/1b1b1184))
- **openspec:** ⚠️ 补全 seed 数据库记录生成任务项。 ([1c77853c](https://github.com/ruan-cat/11comm/commit/1c77853c))
- **prompt,admin:** 评估类型项目改造报告，并生成一份完整的全栈类型改造评估报告. ([ba3bb5f4](https://github.com/ruan-cat/11comm/commit/ba3bb5f4))
- **prompt,admin:** 完成任务【处理 `apps\admin\server\db\seed-sql` 内文件出现的类型报错，并评估 `analyze-mock-data-and-create-db-seed` 任务是否已经完整的执行完成了】 ([3e89c5d0](https://github.com/ruan-cat/11comm/commit/3e89c5d0))
- **prompt,admin:** ⚠️ 设计任务【列举说明清楚 schema 目录内全部的数据库表，便于查询了解】、【增加类型项目内的字段，是否要同步去增加 schema 目录内数据库表字段？】 ([108b69a7](https://github.com/ruan-cat/11comm/commit/108b69a7))
- **prompt,admin:** 完成任务【列举说明清楚 schema 目录内全部的数据库表，便于查询了解】 ([68f9f88e](https://github.com/ruan-cat/11comm/commit/68f9f88e))
- **prompt,admin:** 完成任务【增加类型项目内的字段，是否要同步去增加 schema 目录内数据库表字段？】 ([793f3820](https://github.com/ruan-cat/11comm/commit/793f3820))
- **prompt,admin:** 完成任务【评估类型项目改造报告，并生成一份完整的全栈类型改造评估报告】 ([07b0d479](https://github.com/ruan-cat/11comm/commit/07b0d479))
- **prompt,admin:** 标记项目生成出有效的项目产出。 ([5557d7ac](https://github.com/ruan-cat/11comm/commit/5557d7ac))
- **admin:** 生成基于类型项目做全栈改造的报告。并标记报告有参考意义； ([7756bc0e](https://github.com/ruan-cat/11comm/commit/7756bc0e))
- **prompt,admin:** ⚠️ 之前参考的报告文章错了。需要重新生成报告文档。 ([5aff19a7](https://github.com/ruan-cat/11comm/commit/5aff19a7))
- **admin:** 标记【2026-02-06 全栈类型统一改造深度评估与实施方案】不予删除 ([2c8bdb07](https://github.com/ruan-cat/11comm/commit/2c8bdb07))
- **prompt,admin:** 记录【apps\admin\src\docs\reports\2026-02-06-full-stack-type-transformation-assessment.md】为有效产出的参考文档。 ([ea18335e](https://github.com/ruan-cat/11comm/commit/ea18335e))
- **prompt,admin:** 设计任务【检查报告之间的内容潜在冲突校验】 ([8c799f0a](https://github.com/ruan-cat/11comm/commit/8c799f0a))
- **prompt,admin:** 提供报告类表 ([a3014041](https://github.com/ruan-cat/11comm/commit/a3014041))
- **prompt,admin:** 要求 AI 重新拓展非常详细清晰的 `full-stack-type-transformation` 任务 ([26f7d3ab](https://github.com/ruan-cat/11comm/commit/26f7d3ab))
- **prompt,admin:** ⚠️ 设计任务【检查过往规范和文档对于类型项目操作规范的冲突】 ([b3fa0800](https://github.com/ruan-cat/11comm/commit/b3fa0800))

### 🎨 Styles

- **claude:** AI 文档排序 ([34321565](https://github.com/ruan-cat/11comm/commit/34321565))

### 🤖 CI

- **package.json,admin:** 增加拉取环境变量的命令。 ([98d63bf2](https://github.com/ruan-cat/11comm/commit/98d63bf2))

### 🔧 更新配置

- 更新 MCP 的长度，删减长度，避免对接其他工具时出现错误。 ([ea1cf61b](https://github.com/ruan-cat/11comm/commit/ea1cf61b))
- **root:** ⚠️ 拉取环境变量，并忽略 vercel 的敏感环境变量文件。 ([c30a864a](https://github.com/ruan-cat/11comm/commit/c30a864a))
- **claude:** 安装 commit-work 技能。 ([38467bac](https://github.com/ruan-cat/11comm/commit/38467bac))
- **claude:** ⚠️ 增加 Antigravity 的 openspec 配置。 ([a66ed6f9](https://github.com/ruan-cat/11comm/commit/a66ed6f9))
- 专门为 Antigravity 安装能够被识别的 skills，安装本地级别的 skills。 ([69541018](https://github.com/ruan-cat/11comm/commit/69541018))

#### ⚠️ Breaking Changes

- **type:** ⚠️ 为解决数据库数据生成问题，补全类型项目内出现的业务类型字段。 ([9cde5f82](https://github.com/ruan-cat/11comm/commit/9cde5f82))
- **server,admin:** ⚠️ 处理生成 seed 数据库数据脚本的类型报错。 ([61301d09](https://github.com/ruan-cat/11comm/commit/61301d09))
- **claude:** ⚠️ 重构技能文件。 ([a8fa576c](https://github.com/ruan-cat/11comm/commit/a8fa576c))
- **turbo,openspec,config,type,server,package.json,admin,root,claude:** ⚠️ 初始化 lintstage 配置，并且默认对全部代码做一个全量的 prettier 格式化。 ([01eb1aae](https://github.com/ruan-cat/11comm/commit/01eb1aae))
- **claude:** ⚠️ 重命名文件，改成 use 开头的技能，避免被误导。 ([3deeae0f](https://github.com/ruan-cat/11comm/commit/3deeae0f))
- **claude:** ⚠️ 及时更新技能的名称 use-nitro 。 ([bcd0e7b1](https://github.com/ruan-cat/11comm/commit/bcd0e7b1))
- **claude:** ⚠️ Claude 的技能文件不允许设置成符号链接的目录文件。 ([745d4ba5](https://github.com/ruan-cat/11comm/commit/745d4ba5))
- **env,admin,root:** ⚠️ 改造 Vercel 环境变量存储与获取方式 ([230f7c76](https://github.com/ruan-cat/11comm/commit/230f7c76))
- **prompt,admin:** ⚠️ Create-git-commit 认定为不再使用的 AI 文档。现在被 git-commit 技能替代了 ([107f5d31](https://github.com/ruan-cat/11comm/commit/107f5d31))
- **claude:** ⚠️ 技能重做，同时提供 mock 和 neon 两种编写模式。 ([ae65183e](https://github.com/ruan-cat/11comm/commit/ae65183e))
- **openspec:** ⚠️ 重新设计 analyze-mock-data-and-create-db-seed 任务。 ([d2063b35](https://github.com/ruan-cat/11comm/commit/d2063b35))
- **admin:** ⚠️ 全面更新 sql 语句，用于生成 seed 初始化数据库内容。 ([ed4456a4](https://github.com/ruan-cat/11comm/commit/ed4456a4))
- **openspec:** ⚠️ 拓展非常详细清晰的 `full-stack-type-transformation` 任务 ([4f4c0762](https://github.com/ruan-cat/11comm/commit/4f4c0762))
- **claude:** ⚠️ 一次性初始化全部 neon 的 skills。使用 neonctl 完成初始化。 ([a1135561](https://github.com/ruan-cat/11comm/commit/a1135561))
- ⚠️ 完成 neon 技能的翻译。 ([850cb3ca](https://github.com/ruan-cat/11comm/commit/850cb3ca))
- **claude:** ⚠️ 记录严格的操作规范，【禁止全局安装工具包】 ([98b01288](https://github.com/ruan-cat/11comm/commit/98b01288))
- **openspec:** ⚠️ 归档任务 ([cc0aca23](https://github.com/ruan-cat/11comm/commit/cc0aca23))
- **prompt,admin:** ⚠️ 设计复杂提示词任务 ([db67369f](https://github.com/ruan-cat/11comm/commit/db67369f))
- **prompt,admin:** ⚠️ 设计复杂任务【设计专用的前缀变量，重设 admin 项目使用】 ([2b965c38](https://github.com/ruan-cat/11comm/commit/2b965c38))
- **prompt,admin:** ⚠️ 要求复查，重做完整的任务列表列表，仔细检查是否有缺漏的数据库表。 ([8340eece](https://github.com/ruan-cat/11comm/commit/8340eece))
- **openspec:** ⚠️ 补全 seed 数据库记录生成任务项。 ([1c77853c](https://github.com/ruan-cat/11comm/commit/1c77853c))
- **prompt,admin:** ⚠️ 设计任务【列举说明清楚 schema 目录内全部的数据库表，便于查询了解】、【增加类型项目内的字段，是否要同步去增加 schema 目录内数据库表字段？】 ([108b69a7](https://github.com/ruan-cat/11comm/commit/108b69a7))
- **prompt,admin:** ⚠️ 之前参考的报告文章错了。需要重新生成报告文档。 ([5aff19a7](https://github.com/ruan-cat/11comm/commit/5aff19a7))
- **prompt,admin:** ⚠️ 设计任务【检查过往规范和文档对于类型项目操作规范的冲突】 ([b3fa0800](https://github.com/ruan-cat/11comm/commit/b3fa0800))
- **root:** ⚠️ 拉取环境变量，并忽略 vercel 的敏感环境变量文件。 ([c30a864a](https://github.com/ruan-cat/11comm/commit/c30a864a))
- **claude:** ⚠️ 增加 Antigravity 的 openspec 配置。 ([a66ed6f9](https://github.com/ruan-cat/11comm/commit/a66ed6f9))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.8.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.7.0...v0.8.0)

### 🐞 修复缺陷

- **claude:** ⚠️ 处理状态栏不显示正常上下文窗口额度的错误。 ([7e563a11](https://github.com/ruan-cat/11comm/commit/7e563a11))

### 🦄 代码重构

- **openspec,type,admin:** 大规模完成`no-form-ts-redundant-export`任务 ([41e49521](https://github.com/ruan-cat/11comm/commit/41e49521))
- **openspec,type,server,admin:** 持续完成任务 ([01933da5](https://github.com/ruan-cat/11comm/commit/01933da5))
- **openspec,type,server,admin:** 持续完成任务 ([d3e80a98](https://github.com/ruan-cat/11comm/commit/d3e80a98))
- **openspec:** 归档【fix-type-error-20251226】任务 ([be667b20](https://github.com/ruan-cat/11comm/commit/be667b20))

### 📖 Documentation

- **openspec,prompt,admin:** 归档 `no-form-ts-redundant-export` 任务 ([f79a143c](https://github.com/ruan-cat/11comm/commit/f79a143c))

### 🏡 Chore

- **admin:** 标记【完整类型错误清单报告】作为任务，已完成 ([740274ef](https://github.com/ruan-cat/11comm/commit/740274ef))
- **prompt,admin:** 提供待办注释 ([06e12999](https://github.com/ruan-cat/11comm/commit/06e12999))
- **admin:** Kiro 称【migrate-static-data-to-nitro-query】任务已经全部完成。 ([a4c0bc23](https://github.com/ruan-cat/11comm/commit/a4c0bc23))
- **openspec,admin:** Gemini 称全面完成了【migrate-static-data-to-nitro-query】任务 ([322d4fa4](https://github.com/ruan-cat/11comm/commit/322d4fa4))
- **prompt,admin:** 调整制作方向。 ([069871e4](https://github.com/ruan-cat/11comm/commit/069871e4))
- **prompt,admin:** 完成【制作 claude code 命令】 ([555da221](https://github.com/ruan-cat/11comm/commit/555da221))
- **prompt,admin:** 完成任务【改写`本地假数据`成 nitro 接口，并改写列表页的写法】 ([e004f171](https://github.com/ruan-cat/11comm/commit/e004f171))
- **prompt,admin:** 完成任务【apps\admin\src\docs\prompts\各种杂项\2025-12-12-migrate-static-data-to-nitro-query\prompts.md】 ([89cba3eb](https://github.com/ruan-cat/11comm/commit/89cba3eb))
- **prompt,admin:** 完成任务【按照指定要求来修复类型错误、修改代码】 ([4361f6b8](https://github.com/ruan-cat/11comm/commit/4361f6b8))
- **openspec:** ⚠️ 归档【migrate-static-data-to-nitro-query】任务 ([ec72d8ed](https://github.com/ruan-cat/11comm/commit/ec72d8ed))

#### ⚠️ Breaking Changes

- **claude:** ⚠️ 处理状态栏不显示正常上下文窗口额度的错误。 ([7e563a11](https://github.com/ruan-cat/11comm/commit/7e563a11))
- **openspec:** ⚠️ 归档【migrate-static-data-to-nitro-query】任务 ([ec72d8ed](https://github.com/ruan-cat/11comm/commit/ec72d8ed))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.7.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.6.0...v0.7.0)

### 🔥 Performance

- **type:** 避免单独导出代码的写法 ([efb5054f](https://github.com/ruan-cat/11comm/commit/efb5054f))
- **prompt,admin:** 优化 fix-list-pages-code-patterns 提示词 ([e14f353a](https://github.com/ruan-cat/11comm/commit/e14f353a))
- **config:** 精简写法 ([97fca661](https://github.com/ruan-cat/11comm/commit/97fca661))
- **openspec,claude:** [不要将非业务类型迁移到类型项目内，特别是表单弹框组件类型] ([2772c43e](https://github.com/ruan-cat/11comm/commit/2772c43e))

### 🐞 修复缺陷

- **prompt,admin:** 处理 markdown 语法错误 ([6729b7b0](https://github.com/ruan-cat/11comm/commit/6729b7b0))
- **prompt,admin:** 修改错别字； ([f7cc30b1](https://github.com/ruan-cat/11comm/commit/f7cc30b1))
- **type,admin:** 修复错误；并提供类型报错的调研文档。 ([95b7eb8e](https://github.com/ruan-cat/11comm/commit/95b7eb8e))
- **admin:** 处理错误的 vue 组件对外导出写法 ([bf4f9601](https://github.com/ruan-cat/11comm/commit/bf4f9601))

### 🦄 代码重构

- **type:** ⚠️ 手动修改，重写类型项目导出类型的写法。 ([256b1b02](https://github.com/ruan-cat/11comm/commit/256b1b02))
- **openspec,type,admin:** 持续完成代码修改任务 ([9c74134b](https://github.com/ruan-cat/11comm/commit/9c74134b))
- **admin:** 文本替换。 ([237a042c](https://github.com/ruan-cat/11comm/commit/237a042c))
- **type,admin:** 处理 form.ts 被错误迁移的业务类型 ([4aad8ec0](https://github.com/ruan-cat/11comm/commit/4aad8ec0))
- **type,server,admin:** 持续完成任务 ([9d3ae6a8](https://github.com/ruan-cat/11comm/commit/9d3ae6a8))
- **type,admin:** 持续完成任务 ([7a88bf61](https://github.com/ruan-cat/11comm/commit/7a88bf61))
- **prompt,admin:** 将【不要将非业务类型迁移到类型项目内，特别是表单弹框组件类型】迁移到单独的文件夹内 ([9d8cb8d2](https://github.com/ruan-cat/11comm/commit/9d8cb8d2))
- **openspec,prompt,admin:** ⚠️ 完全重构一次 spec 规范文件。精简文件，归纳一份关键的修改规范表。 ([22219661](https://github.com/ruan-cat/11comm/commit/22219661))
- **server,admin:** 大批量重写服务端接口，写成标准的代码格式。修改 31 份文件。 ([19d5e17b](https://github.com/ruan-cat/11comm/commit/19d5e17b))
- **type,admin:** 持续完成任务，将克隆写法换成浏览器原生支持的深克隆写法。 ([f974f53e](https://github.com/ruan-cat/11comm/commit/f974f53e))
- **openspec,type,admin:** 持续完成任务。 ([65487b57](https://github.com/ruan-cat/11comm/commit/65487b57))
- **server,admin:** 持续完成任务，接口满足格式要求； ([bc38a1ae](https://github.com/ruan-cat/11comm/commit/bc38a1ae))
- **type,admin:** 持续完成代码重构任务 ([621a5c05](https://github.com/ruan-cat/11comm/commit/621a5c05))
- **server,admin:** ⚠️ 大规模改写接口。实现 160 份文件更改。但是出现部分的模拟假数据类型字段不匹配的情况，需要专门修复。 ([9eced93d](https://github.com/ruan-cat/11comm/commit/9eced93d))
- **admin:** 持续完成任务。修改 api hooks 接口 ([6c98f242](https://github.com/ruan-cat/11comm/commit/6c98f242))
- **type,admin:** 持续完成重构任务 ([f11e27bf](https://github.com/ruan-cat/11comm/commit/f11e27bf))
- **openspec,type,admin:** 持续完成任务 ([20a2aee8](https://github.com/ruan-cat/11comm/commit/20a2aee8))
- **server,admin:** 持续完成任务 ([40d3a347](https://github.com/ruan-cat/11comm/commit/40d3a347))
- **type,server,admin:** 持续完成任务 ([d4a0b80d](https://github.com/ruan-cat/11comm/commit/d4a0b80d))
- **openspec,prompt,admin:** ⚠️ 用 gemini 重构一次提示词内容。 ([044beaae](https://github.com/ruan-cat/11comm/commit/044beaae))
- **server,admin:** 拓展代码块 ([1c39999e](https://github.com/ruan-cat/11comm/commit/1c39999e))
- **server,admin:** 持续完成任务 ([29eec1d7](https://github.com/ruan-cat/11comm/commit/29eec1d7))
- **prompt,admin:** 准备新建【将错误迁移的表单组件类型和默认表单数据，迁移回到 form.ts 内存储】规范 ([99a09ddb](https://github.com/ruan-cat/11comm/commit/99a09ddb))
- **type:** 重命名，换成正常的业务路径命名 ([2bde9519](https://github.com/ruan-cat/11comm/commit/2bde9519))
- **type,admin:** 持续完成任务 ([ec0c3a88](https://github.com/ruan-cat/11comm/commit/ec0c3a88))
- **admin:** 持续完成任务 ([c99afb4d](https://github.com/ruan-cat/11comm/commit/c99afb4d))
- **type:** 持续完成任务 ([be463196](https://github.com/ruan-cat/11comm/commit/be463196))
- **type,admin:** 持续完成任务 ([89d557c5](https://github.com/ruan-cat/11comm/commit/89d557c5))
- **type,admin:** 持续完成任务 ([1c0a1e4f](https://github.com/ruan-cat/11comm/commit/1c0a1e4f))
- **type:** 完成任务 ([4a50ded4](https://github.com/ruan-cat/11comm/commit/4a50ded4))
- **admin:** 完成任务 ([f99dfbcb](https://github.com/ruan-cat/11comm/commit/f99dfbcb))
- **type,admin:** 持续完成任务 ([275523a8](https://github.com/ruan-cat/11comm/commit/275523a8))
- **type,admin:** 持续完成任务 ([abd959b7](https://github.com/ruan-cat/11comm/commit/abd959b7))
- **server,admin:** 持续完成任务 ([acb5723c](https://github.com/ruan-cat/11comm/commit/acb5723c))
- **type,server,admin:** 持续完成任务 ([12701bb3](https://github.com/ruan-cat/11comm/commit/12701bb3))
- **type,server,admin:** 持续完成任务。 ([211bb0ab](https://github.com/ruan-cat/11comm/commit/211bb0ab))
- **type,server,admin:** 持续完成任务 ([8075afce](https://github.com/ruan-cat/11comm/commit/8075afce))
- **type,admin:** 持续完成任务 ([51ebec63](https://github.com/ruan-cat/11comm/commit/51ebec63))
- **admin:** 持续完成任务。 ([37095298](https://github.com/ruan-cat/11comm/commit/37095298))
- **openspec,type,admin:** 持续完成任务 ([dc009ec7](https://github.com/ruan-cat/11comm/commit/dc009ec7))
- **openspec,type,admin:** 持续完成任务 ([da0159cf](https://github.com/ruan-cat/11comm/commit/da0159cf))
- **openspec,type,admin:** 持续完成任务 ([7127ccec](https://github.com/ruan-cat/11comm/commit/7127ccec))
- **openspec,type,admin:** 持续完成任务 ([07970b3d](https://github.com/ruan-cat/11comm/commit/07970b3d))
- **openspec,type,admin:** 持续完成任务 ([a0eb85bd](https://github.com/ruan-cat/11comm/commit/a0eb85bd))
- **openspec:** ⚠️ 重新调整【no-chinese-and-alias】任务，避免出现执行时和【no-form-ts-redundant-export】冲突返工的情况。 ([f9b50bbe](https://github.com/ruan-cat/11comm/commit/f9b50bbe))
- **openspec,type,server,admin:** 持续完成任务 ([52405079](https://github.com/ruan-cat/11comm/commit/52405079))
- **openspec,type,server,admin:** 持续完成任务 ([6b472c68](https://github.com/ruan-cat/11comm/commit/6b472c68))
- **openspec:** 归档【no-chinese-and-alias】任务 ([7ca52e85](https://github.com/ruan-cat/11comm/commit/7ca52e85))
- **type,admin:** 持续完成任务 ([de620ec4](https://github.com/ruan-cat/11comm/commit/de620ec4))
- **admin:** 持续完成任务 ([35696405](https://github.com/ruan-cat/11comm/commit/35696405))
- **type,admin:** 持续完成任务 ([3a6c939c](https://github.com/ruan-cat/11comm/commit/3a6c939c))
- **claude:** 重做状态栏； ([de7c676a](https://github.com/ruan-cat/11comm/commit/de7c676a))
- **openspec,admin:** 持续完成任务 ([26750e08](https://github.com/ruan-cat/11comm/commit/26750e08))
- **admin:** 持续完成任务 ([3e09c43d](https://github.com/ruan-cat/11comm/commit/3e09c43d))
- **openspec,type,admin:** 持续完成任务，处理了全部的类型故障写法。 ([0a7d118f](https://github.com/ruan-cat/11comm/commit/0a7d118f))

### 📖 Documentation

- **prompt,admin:** 设计【对`类型项目`的代码组织方式，和代码写法，做出细致要求】任务 ([78f41037](https://github.com/ruan-cat/11comm/commit/78f41037))
- **admin:** 标记报告文档的参考价值下级 ([b649864e](https://github.com/ruan-cat/11comm/commit/b649864e))
- **openspec:** ⚠️ 更新迭代 `migrate-static-data-to-nitro-query` 的全部文档，避免出现编写兼容性的中文类型变量 ([71dfe5a9](https://github.com/ruan-cat/11comm/commit/71dfe5a9))
- **openspec:** ⚠️ 更新迭代 `migrate-static-data-to-nitro-query` 的 `list-page-pattern` 列表页改造规范，避免出现删改多余内容的情况 ([0ceb6cd4](https://github.com/ruan-cat/11comm/commit/0ceb6cd4))
- **openspec,claude:** ⚠️ 为多个文件，增加严格的【类型项目的代码组织方式与导出规范】 ([0bc2639b](https://github.com/ruan-cat/11comm/commit/0bc2639b))
- **claude:** 增加【type-project-organization】技能文件 ([1fda52a5](https://github.com/ruan-cat/11comm/commit/1fda52a5))
- **claude:** 说明【类型项目代码组织规范技能】 ([1f1c2d03](https://github.com/ruan-cat/11comm/commit/1f1c2d03))
- **openspec:** ⚠️ 补充列表页处理的规范 ([900d6b0c](https://github.com/ruan-cat/11comm/commit/900d6b0c))
- **prompt,admin:** 完成任务【fix-list-pages-code-patterns 任务提示词】 ([3b5ab760](https://github.com/ruan-cat/11comm/commit/3b5ab760))
- **prompt,admin:** 设置规范【不要将非业务类型迁移到类型项目内，特别是表单弹框组件类型】 ([b052b95d](https://github.com/ruan-cat/11comm/commit/b052b95d))
- **prompt,admin:** 补全细化【执行本任务使用的提示词】 ([f3a004f4](https://github.com/ruan-cat/11comm/commit/f3a004f4))
- **prompt,admin:** 专门处理【自检文件是否有冲突模糊的情况】 ([bf1c10a6](https://github.com/ruan-cat/11comm/commit/bf1c10a6))
- **prompt,admin:** 重新设计【执行本任务使用的提示词】 ([ab7c0722](https://github.com/ruan-cat/11comm/commit/ab7c0722))
- **prompt,admin:** 针对子代理执行任务失败的情况，做细化， ([704c751a](https://github.com/ruan-cat/11comm/commit/704c751a))
- **prompt,admin:** 【你新建的子代理**必须**是**后台运行**的子代理。】 ([6323545f](https://github.com/ruan-cat/11comm/commit/6323545f))
- **prompt,admin:** 【子代理工作量划分事项】 ([a95560e3](https://github.com/ruan-cat/11comm/commit/a95560e3))
- **prompt,admin:** 补充规范 ([e091b358](https://github.com/ruan-cat/11comm/commit/e091b358))
- **claude:** 删除掉主动做类型检查的要求； ([9494e44c](https://github.com/ruan-cat/11comm/commit/9494e44c))
- **claude:** 设计规范【基于`业务路径`做任务划分时的主代理与子代理任务划分规范】 ([f48c586c](https://github.com/ruan-cat/11comm/commit/f48c586c))
- **claude:** 设计【主从代理`调度设计`、`职责说明`与`通信反馈`规范】 ([89b20dd6](https://github.com/ruan-cat/11comm/commit/89b20dd6))
- **claude:** 统一整理【主从代理的相关规范】 ([f304e550](https://github.com/ruan-cat/11comm/commit/f304e550))
- **prompt,admin:** 删除类型别名并且完成替换 ([fde22fd2](https://github.com/ruan-cat/11comm/commit/fde22fd2))
- **prompt,admin:** 新建规范【将形如 `xxxDefaultForm` 的变量迁移回 `form.ts` 内】 ([fa858bfe](https://github.com/ruan-cat/11comm/commit/fa858bfe))
- **prompt,admin:** 新建规范【根据`业务路径`，检查全部的`类型项目`的文件命名与文件夹组织模式，是否严格满足`业务路径`的要求】 ([0706d9f7](https://github.com/ruan-cat/11comm/commit/0706d9f7))
- **prompt,admin:** 清退类型别名 FormVO ([5b5aae68](https://github.com/ruan-cat/11comm/commit/5b5aae68))
- **prompt,admin:** 新增规范【务必要完整阅读 `CLAUDE.md` 文档的全部规范要求。】 ([97526bbe](https://github.com/ruan-cat/11comm/commit/97526bbe))
- **prompt,admin:** [全部的类型项目和后台项目，检索字符串 `FormVO` 将字符串 `FormVO` 这款固定写法的类型别名，全面清退替换掉，换成原本的类型。] ([85f73b04](https://github.com/ruan-cat/11comm/commit/85f73b04))
- **prompt,admin:** 运行类型检查命令，生成完整的错误清单报告。 ([1de90eac](https://github.com/ruan-cat/11comm/commit/1de90eac))
- **admin:** 删除多余报告；增加类型错误的清单报告。 ([18088709](https://github.com/ruan-cat/11comm/commit/18088709))
- **admin:** 改造【2025-12-24 类型错误清单报告】作为提示词； ([37c0adc7](https://github.com/ruan-cat/11comm/commit/37c0adc7))
- **prompt,admin:** 迭代提示词【针对性修复类型项目出现的中文命名，和中间变量别名】 ([cad6430b](https://github.com/ruan-cat/11comm/commit/cad6430b))
- **openspec,prompt,admin:** 初始化【执行 `no-chinese-and-alias` 任务】提示词 ([547760fc](https://github.com/ruan-cat/11comm/commit/547760fc))
- **prompt,admin:** 设计任务【重新调整对 `./form` 路径内的模块导出方式】 ([ea476a0d](https://github.com/ruan-cat/11comm/commit/ea476a0d))
- **prompt,admin:** 补全完善【重新调整对 `./form` 路径内的模块导出方式】 ([3e6019ab](https://github.com/ruan-cat/11comm/commit/3e6019ab))
- **openspec:** 新建 no-form-ts-redundant-export 任务 ([a353e79c](https://github.com/ruan-cat/11comm/commit/a353e79c))
- **openspec:** 设计任务【no-form-ts-redundant-export】提示词。 ([8f3dd711](https://github.com/ruan-cat/11comm/commit/8f3dd711))
- 更新迭代 AI 识别用的文档·1 ([71e0cc3f](https://github.com/ruan-cat/11comm/commit/71e0cc3f))
- **openspec:** 约束识别范围 ([1814cf67](https://github.com/ruan-cat/11comm/commit/1814cf67))
- **prompt,admin:** 标记任务已完成 ([4f53abf7](https://github.com/ruan-cat/11comm/commit/4f53abf7))
- **admin:** 增加类型检查报告文件。 ([68b2743a](https://github.com/ruan-cat/11comm/commit/68b2743a))
- **claude:** 增加类型项目的字段处理规范 ([fdd8f589](https://github.com/ruan-cat/11comm/commit/fdd8f589))
- **admin:** 设计【`fix-type-error-20251226`】任务 ([cf4ce198](https://github.com/ruan-cat/11comm/commit/cf4ce198))
- **prompt,admin:** 标记任务【针对性修复类型项目出现的中文命名，和中间变量别名】需要继续处理。 ([d7d1e7f8](https://github.com/ruan-cat/11comm/commit/d7d1e7f8))

### 🏡 Chore

- **prompt,admin:** 标记完成【更新迭代 `migrate-static-data-to-nitro-query` 的全部文档，避免出现编写兼容性的中文类型变量】任务 ([9e47fb47](https://github.com/ruan-cat/11comm/commit/9e47fb47))
- **prompt,admin:** 标记【更新迭代 `migrate-static-data-to-nitro-query` 的 `list-page-pattern` 列表页改造规范，避免出现删改多余内容的情况】已完成 ([3f78eab1](https://github.com/ruan-cat/11comm/commit/3f78eab1))
- **prompt,admin:** 改名【`类型项目`的代码组织方式与导出规范】 ([b0560acd](https://github.com/ruan-cat/11comm/commit/b0560acd))
- **claude:** 更新序号 ([b9b7a9cc](https://github.com/ruan-cat/11comm/commit/b9b7a9cc))
- **prompt,admin:** 标记【`类型项目`的代码组织方式与导出规范】已完成 ([58e2cf7b](https://github.com/ruan-cat/11comm/commit/58e2cf7b))
- **prompt,admin:** 新建任务【补充列表页处理的规范】 ([2141331d](https://github.com/ruan-cat/11comm/commit/2141331d))
- **prompt,admin:** 完成【补充列表页处理的规范】 ([8eb5fa13](https://github.com/ruan-cat/11comm/commit/8eb5fa13))
- **config:** 待办任务【changelogogenUseTypes in @ruan-cat/commitlint-config】 ([ba66a1d1](https://github.com/ruan-cat/11comm/commit/ba66a1d1))
- **prompt,admin:** 新建任务【代码写法手动批量替换】 ([fe0ce613](https://github.com/ruan-cat/11comm/commit/fe0ce613))
- **openspec,router,admin:** 格式化代码；归档任务。 ([30647a8f](https://github.com/ruan-cat/11comm/commit/30647a8f))
- **prompt,admin:** 完成任务【码写法手动批量替换】 ([15710b01](https://github.com/ruan-cat/11comm/commit/15710b01))
- **prompt,admin:** [不要将非业务类型迁移到类型项目内，特别是表单弹框组件类型] ([77edd267](https://github.com/ruan-cat/11comm/commit/77edd267))
- 手动清空全部的任务清单 ([e3f1693f](https://github.com/ruan-cat/11comm/commit/e3f1693f))
- **admin:** 持续完成任务。 ([767083ad](https://github.com/ruan-cat/11comm/commit/767083ad))
- **openspec:** 更新任务进度 ([1654283a](https://github.com/ruan-cat/11comm/commit/1654283a))
- **openspec:** 取消掉任务进度，大部分文件处理不合适。 ([be494882](https://github.com/ruan-cat/11comm/commit/be494882))
- **claude:** 更新标题序号。 ([e9f3304b](https://github.com/ruan-cat/11comm/commit/e9f3304b))
- **prompt,admin:** 序号格式化 ([99e4727a](https://github.com/ruan-cat/11comm/commit/99e4727a))
- **prompt,admin:** 标记【2025-12-24 类型错误清单报告】已完成 ([3cfdf50a](https://github.com/ruan-cat/11comm/commit/3cfdf50a))
- **type,admin:** 删除误导性的标记 ([e53aad7a](https://github.com/ruan-cat/11comm/commit/e53aad7a))
- **openspec:** 标记进度[`no-form-ts-redundant-export`] ([d27cc4f1](https://github.com/ruan-cat/11comm/commit/d27cc4f1))
- **openspec:** 标记【no-chinese-and-alias】已完成 ([3db76893](https://github.com/ruan-cat/11comm/commit/3db76893))

### 🎨 Styles

- **root:** 格式化 ([827a7678](https://github.com/ruan-cat/11comm/commit/827a7678))
- **openspec:** 格式 ([af2f6339](https://github.com/ruan-cat/11comm/commit/af2f6339))
- **prompt,admin:** 格式化 ([3ddbc93c](https://github.com/ruan-cat/11comm/commit/3ddbc93c))

### 🤖 CI

- 移除掉不需要的全局包 ([18d7fb1f](https://github.com/ruan-cat/11comm/commit/18d7fb1f))
- 删除掉冗余的全局命令 ([d8ba3030](https://github.com/ruan-cat/11comm/commit/d8ba3030))

### 🔧 更新配置

- **openspec:** ⚠️ 重置任务清单，重做。 ([c17573b4](https://github.com/ruan-cat/11comm/commit/c17573b4))

#### ⚠️ Breaking Changes

- **type:** ⚠️ 手动修改，重写类型项目导出类型的写法。 ([256b1b02](https://github.com/ruan-cat/11comm/commit/256b1b02))
- **openspec,prompt,admin:** ⚠️ 完全重构一次 spec 规范文件。精简文件，归纳一份关键的修改规范表。 ([22219661](https://github.com/ruan-cat/11comm/commit/22219661))
- **server,admin:** ⚠️ 大规模改写接口。实现 160 份文件更改。但是出现部分的模拟假数据类型字段不匹配的情况，需要专门修复。 ([9eced93d](https://github.com/ruan-cat/11comm/commit/9eced93d))
- **openspec,prompt,admin:** ⚠️ 用 gemini 重构一次提示词内容。 ([044beaae](https://github.com/ruan-cat/11comm/commit/044beaae))
- **openspec:** ⚠️ 重新调整【no-chinese-and-alias】任务，避免出现执行时和【no-form-ts-redundant-export】冲突返工的情况。 ([f9b50bbe](https://github.com/ruan-cat/11comm/commit/f9b50bbe))
- **openspec:** ⚠️ 更新迭代 `migrate-static-data-to-nitro-query` 的全部文档，避免出现编写兼容性的中文类型变量 ([71dfe5a9](https://github.com/ruan-cat/11comm/commit/71dfe5a9))
- **openspec:** ⚠️ 更新迭代 `migrate-static-data-to-nitro-query` 的 `list-page-pattern` 列表页改造规范，避免出现删改多余内容的情况 ([0ceb6cd4](https://github.com/ruan-cat/11comm/commit/0ceb6cd4))
- **openspec,claude:** ⚠️ 为多个文件，增加严格的【类型项目的代码组织方式与导出规范】 ([0bc2639b](https://github.com/ruan-cat/11comm/commit/0bc2639b))
- **openspec:** ⚠️ 补充列表页处理的规范 ([900d6b0c](https://github.com/ruan-cat/11comm/commit/900d6b0c))
- **openspec:** ⚠️ 重置任务清单，重做。 ([c17573b4](https://github.com/ruan-cat/11comm/commit/c17573b4))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

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
