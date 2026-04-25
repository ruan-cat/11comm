# 技能冲突修复任务清单

## 1. 技能文件格式修复

### 1.1 表格格式修复（居中对齐）

- [x] 1.1.1 修复 component-migration/SKILL.md 表格为居中对齐
- [x] 1.1.2 修复 style-migration/SKILL.md 表格为居中对齐
- [x] 1.1.3 修复 route-migration/SKILL.md 表格为居中对齐
- [x] 1.1.4 修复 api-migration/SKILL.md 表格为居中对齐

### 1.2 Vue 代码块格式修复（添加 template 标签）

- [x] 1.2.1 修复 component-migration/SKILL.md Vue 代码块格式
- [x] 1.2.2 修复 use-wd-form/SKILL.md Vue 代码块格式
- [x] 1.2.3 修复 beautiful-component-design/SKILL.md Vue 代码块格式

### 1.3 Markdown 标题序号修复

- [x] 1.3.1 检查并修复所有技能文件的标题序号

## 2. 技能组合矩阵统一

- [x] 2.1 修复 component-migration/SKILL.md 技能组合矩阵（与 CLAUDE.md 一致）
- [x] 2.2 修复 check-trigger.md 技能名称简写（统一为完整名称）
- [x] 2.3 修复 check-trigger.md 分页功能技能组合（添加 api-error-handling）
- [x] 2.4 修复 component-migration 协同技能说明（添加 api-migration）

## 3. 技能文档内容修正

- [x] 3.1 修正 beautiful-component-design/SKILL.md 中 wd-cell #value 插槽说明

## 4. 代码实现修复

### 4.1 wd-radio-group 替换为 wd-picker

- [x] 4.1.1 修复 src/pages-sub/work/do-copy-work.vue 第 154、177 行

### 4.2 useRequest 链式回调写法修复

- [x] 4.2.1 修复 src/pages-sub/property/apply-room.vue useRequest 写法

### 4.3 TypedRouter 替换

- [x] 4.3.1 修复 src/pages-sub/complaint/order.vue 路由跳转
- [x] 4.3.2 修复 src/pages-sub/complaint/detail.vue 路由跳转
- [x] 4.3.3 修复 src/pages-sub/complaint/finish.vue 路由跳转
- [x] 4.3.4 修复 src/pages-sub/complaint/list.vue 路由跳转
- [x] 4.3.5 修复 src/pages-sub/property/apply-room-detail.vue 路由跳转

### 4.4 FormSectionTitle 组件替换

- [x] 4.4.1 修复 src/pages/test-use/repair-list-item.vue 第 50、64 行
- [x] 4.4.2 修复 src/examples/property-application-example.vue 第 344、366、393、403、413、423 行

## 5. 验证与归档

- [x] 5.1 检查所有修复是否完成
- [ ] 5.2 OpenSpec 归档
