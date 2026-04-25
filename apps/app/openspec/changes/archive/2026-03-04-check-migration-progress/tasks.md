## 1. 准备阶段

- [x] 1.1 阅读 `docs/prompts/route-migration-map.yml`，整理出全部 14 个模块、140 个目标文件路径清单
- [x] 1.2 阅读所有相关 Skills 技能文档（code-migration、component-migration、style-migration、api-migration、api-error-handling、use-wd-form、z-paging-integration、beautiful-component-design）
- [x] 1.3 确认现有报告文件 `docs/reports/2026-03-03-migration-progress-report.md` 已存在并了解其现有内容

## 2. 第一批并行存在性扫描（basic / address / repair / complaint 模块）

- [x] 2.1 启动子代理扫描 basic_modules（8 个目标文件）：src/pages/index/index.vue、src/pages/work-dashboard/index.vue、src/pages/login/index.vue、src/pages/profile/index.vue、src/pages/profile/attendance.vue、src/pages/profile/user-info.vue、src/pages/profile/change-password.vue、src/pages/profile/change-community.vue
- [x] 2.2 启动子代理扫描 address_modules（1 个目标文件）：src/pages/addressList/index.vue
- [x] 2.3 启动子代理扫描 repair_modules（10 个目标文件）：src/pages-sub/repair/\*.vue
- [x] 2.4 启动子代理扫描 complaint_modules（7 个目标文件）：src/pages-sub/complaint/\*.vue
- [x] 2.5 汇总第一批扫描结果，统计存在/不存在/不完整文件数量

## 3. 第二批并行存在性扫描（inspection / resource / fee / property 模块）

- [x] 3.1 启动子代理扫描 inspection_modules（8 个目标文件）：src/pages-sub/inspection/\*.vue
- [x] 3.2 启动子代理扫描 resource_modules（29 个目标文件）：src/pages-sub/purchase/_.vue 和 src/pages-sub/resource/_.vue
- [x] 3.3 启动子代理扫描 fee_modules（14 个目标文件）：src/pages-sub/fee/_.vue 和 src/pages-sub/report/_.vue
- [x] 3.4 启动子代理扫描 property_modules（16 个目标文件）：src/pages-sub/property/\*.vue
- [x] 3.5 汇总第二批扫描结果

## 4. 第三批并行存在性扫描（selector / oa / notice / parking / work / other 模块）

- [x] 4.1 启动子代理扫描 selector_modules（3 个目标文件）：src/pages-sub/selector/\*.vue
- [x] 4.2 启动子代理扫描 oa_modules（8 个目标文件）：src/pages-sub/oa/\*.vue
- [x] 4.3 启动子代理扫描 notice_modules（4 个目标文件）：src/pages/notice/_.vue 和 src/pages/activity/_.vue
- [x] 4.4 启动子代理扫描 parking_modules（5 个目标文件）：src/pages-sub/parking/\*.vue
- [x] 4.5 启动子代理扫描 work_modules（8 个目标文件）：src/pages-sub/work/\*.vue
- [x] 4.6 启动子代理扫描 other_modules（30 个目标文件）：src/pages-sub/appointment/_.vue、src/pages-sub/meter/_.vue、src/pages-sub/coupon/_.vue、src/pages-sub/item/_.vue、src/pages-sub/maintenance/_.vue、src/pages-sub/video/_.vue、src/pages-sub/visit/_.vue、src/pages/webview/_.vue
- [x] 4.7 汇总第三批扫描结果

## 5. Skills 合规性专项检查（已迁移文件）

- [x] 5.1 对 repair_modules 全部 10 个文件：逐文件启动专项检查子代理，按检查维度矩阵评级
- [x] 5.2 对 complaint_modules 全部 7 个文件：逐文件启动专项检查子代理
- [x] 5.3 对 inspection_modules 全部 8 个文件：逐文件启动专项检查子代理
- [x] 5.4 对 selector_modules 全部 3 个文件：逐文件启动专项检查子代理
- [x] 5.5 对 work_modules 全部 8 个文件：逐文件启动专项检查子代理
- [x] 5.6 对 property_modules 已迁移的 5 个文件（apply-room 系列）：逐文件启动专项检查子代理
- [x] 5.7 对 maintenance_modules 全部 4 个文件：逐文件启动专项检查子代理
- [x] 5.8 对 notice_modules 已迁移的 2 个文件（activity 系列）：逐文件启动专项检查子代理
- [x] 5.9 对 basic_modules 已迁移的文件（index、work-dashboard）：逐文件启动专项检查子代理
- [x] 5.10 对 address_modules 已迁移的 1 个文件：启动专项检查子代理

## 6. 汇总不合规问题

- [x] 6.1 收集所有专项检查子代理的 Fail 评级问题，汇总为不合规问题列表
- [x] 6.2 按严重程度排序：Fail（必须修复）→ Warn（建议修复）

## 7. 生成最终报告

- [x] 7.1 基于全部扫描和检查结果，更新 `docs/reports/2026-03-03-migration-progress-report.md`
- [x] 7.2 报告中写入「迁移存在性统计」章节（总体统计表 + 各模块逐文件状态）
- [x] 7.3 报告中写入「Skills 合规性检查结果」章节（逐文件评级矩阵 + 不合规问题汇总）
- [x] 7.4 报告中写入「后续建议」章节（按优先级排列未迁移模块的迁移建议）
- [x] 7.5 校验报告格式：一级标题含日期、表格居中对齐、标题含数字序号，符合 AGENTS.md 第 6 节规范
