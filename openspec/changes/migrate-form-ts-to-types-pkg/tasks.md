# 将 form.ts 文件业务类型迁移到类型包 - 任务清单

## 阶段一：准备和分析 (Phase 1: Preparation and Analysis)

### 任务 1.1: 分析现有 form.ts 文件结构
- [ ] 扫描所有 form.ts 文件位置
  - 路径：`apps/admin/src/pages/**/components/form.ts`
- [ ] 统计文件总数和按模块分布情况
- [ ] 记录每个文件中的业务类型数量
- [ ] 识别中文命名的类型和字段
- [ ] 识别下拉选项数组定义
- [ ] 识别表单 props 类型定义

**依赖**: 无
**预计产出**: form.ts 文件清单和分析报告

### 任务 1.2: 创建迁移映射表
- [ ] 根据 RANK_ROUTE_KEYS 建立路径映射关系
- [ ] 确定每个 form.ts 对应的类型包文件路径
- [ ] 标记已存在的类型文件和需要创建的文件
- [ ] 识别重复的业务类型定义

**依赖**: 1.1
**预计产出**: 迁移映射表 (form.ts → type package)

### 任务 1.3: 检查类型包现有结构
- [ ] 验证 apps/type/src/business/ 目录结构完整性
- [ ] 检查已有的业务类型文件内容
- [ ] 验证 business-options.ts 文件状态
- [ ] 确认 Mode 类型定义和可用性

**依赖**: 无
**预计产出**: 类型包结构验证报告

## 阶段二：业务类型迁移 (Phase 2: Business Type Migration)

### 任务 2.1: 迁移 property-manage 模块业务类型
- [ ] contract-manage 子模块
  - [ ] first-party.ts: 迁移 FirstPartyFormVO
  - [ ] type.ts: 迁移 ContractTypeFormVO (如果存在)
  - [ ] change.ts: 迁移相关表单类型
  - [ ] draft-contract.ts: 迁移草稿合同表单类型
  - [ ] expire.ts: 迁移到期合同表单类型
- [ ] expense-manage 子模块
  - [ ] cancel-fee.ts: 迁移 CancelFeeFormVO
  - [ ] house-charge.ts: 迁移 HouseChargeFormVO
  - [ ] 其他费用相关文件类型迁移
- [ ] house-property-manage 子模块
  - [ ] house.ts: 迁移房屋信息表单类型
  - [ ] owner-information.ts: 迁移业主信息表单类型
  - [ ] owner-member.ts: 迁移业主成员表单类型
- [ ] 其他子模块按同样模式处理

**依赖**: 1.2, 1.3
**验收标准**:
- 运行 `pnpm -F @01s-11comm/type typecheck` 无报错
- 所有类型都有正确的 JSDoc 注释
- 中文命名已转换为英文

### 任务 2.2: 迁移 operation-team 模块业务类型
- [ ] data-manage 子模块业务类型迁移
- [ ] merchant-manage 子模块业务类型迁移
- [ ] report-configuration 子模块业务类型迁移
- [ ] system-manage 子模块业务类型迁移

**依赖**: 2.1
**验收标准**: 同 2.1

### 任务 2.3: 迁移 dev-team 模块业务类型
- [ ] menu-manage 子模块业务类型迁移
- [ ] cache-manage 子模块业务类型迁移
- [ ] config-manage 子模块业务类型迁移

**依赖**: 2.2
**验收标准**: 同 2.1

### 任务 2.4: 迁移 setting-manage 模块业务类型
- [ ] organize-manage 子模块业务类型迁移
- [ ] system-manage 子模块业务类型迁移

**依赖**: 2.3
**验收标准**: 同 2.1

## 阶段三：下拉选项迁移 (Phase 3: Dropdown Options Migration)

### 任务 3.1: 识别和分析下拉选项
- [ ] 扫描所有 form.ts 文件中的选项数组
- [ ] 统计选项的使用频率和分布
- [ ] 识别公共选项候选
- [ ] 创建选项迁移清单

**依赖**: 2.4
**预计产出**: 下拉选项分析报告

### 任务 3.2: 迁移公共选项到 business-options.ts
- [ ] 审核状态选项 (auditStatusOptions)
- [ ] 通用状态选项 (enableStatusOptions)
- [ ] 合同类型选项 (contractTypeOptions)
- [ ] 其他识别出的公共选项

**依赖**: 3.1
**验收标准**:
- 所有公共选项集中在 business-options.ts
- 运行类型检查无报错
- 选项命名规范化

### 任务 3.3: 迁移模块特定选项
- [ ] 将模块特定选项迁移到对应业务类型文件
- [ ] 更新选项导入路径
- [ ] 删除 form.ts 中的重复定义

**依赖**: 3.2
**验收标准**:
- 模块选项正确分类
- 无重复定义
- 导入路径正确

## 阶段四：更新 form.ts 文件 (Phase 4: Update form.ts Files)

### 任务 4.1: 更新 property-manage 模块 form.ts 文件
- [ ] 添加类型导入语句
- [ ] 删除已迁移的类型定义
- [ ] 创建类型别名（保持向后兼容）
- [ ] 更新选项导入
- [ ] 保留 defaultForm 和 FormProps 类型

**依赖**: 2.1, 3.3
**验收标准**:
- 运行 `pnpm -F @01s-11comm/admin typecheck` 无报错
- 功能验证正常

### 任务 4.2: 更新 operation-team 模块 form.ts 文件
- [ ] 同 4.1 的更新步骤

**依赖**: 2.2, 3.3
**验收标准**: 同 4.1

### 任务 4.3: 更新 dev-team 模块 form.ts 文件
- [ ] 同 4.1 的更新步骤

**依赖**: 2.3, 3.3
**验收标准**: 同 4.1

### 任务 4.4: 更新 setting-manage 模块 form.ts 文件
- [ ] 同 4.1 的更新步骤

**依赖**: 2.4, 3.3
**验收标准**: 同 4.1

## 阶段五：添加 Mode 字段 (Phase 5: Add Mode Field)

### 任务 5.1: 为 property-manage 模块添加 mode 字段
- [ ] 识别所有 FormProps 类型
- [ ] 检查是否已有 mode 字段
- [ ] 为缺少 mode 字段的类型添加 `mode?: Mode`
- [ ] 验证类型定义正确

**依赖**: 4.1
**验收标准**:
- 所有表单 props 都有 mode 字段
- 类型检查通过

### 任务 5.2: 为其他模块添加 mode 字段
- [ ] operation-team 模块
- [ ] dev-team 模块
- [ ] setting-manage 模块

**依赖**: 4.2, 4.3, 4.4
**验收标准**: 同 5.1

## 阶段六：验证和测试 (Phase 6: Validation and Testing)

### 任务 6.1: 全面类型检查
- [ ] 运行 `pnpm -F @01s-11comm/type typecheck`
- [ ] 运行 `pnpm -F @01s-11comm/admin typecheck`
- [ ] 修复所有类型错误
- [ ] 确保无类型警告

**依赖**: 5.2
**验收标准**: 所有类型检查通过

### 任务 6.2: 功能验证测试
- [ ] 启动 Admin 项目
- [ ] 访问各模块页面
- [ ] 测试表单显示和功能
- [ ] 验证下拉选项正确
- [ ] 测试表单提交功能

**依赖**: 6.1
**验收标准**: 所有功能正常工作

### 任务 6.3: 性能和构建验证
- [ ] 运行 `pnpm build:admin`
- [ ] 检查构建是否成功
- [ ] 验证打包大小合理性
- [ ] 检查是否有未使用的导入

**依赖**: 6.2
**验收标准**: 构建成功，无明显问题

## 阶段七：文档和清理 (Phase 7: Documentation and Cleanup)

### 任务 7.1: 更新类型包索引文件
- [ ] 更新各模块的 index.ts 文件
- [ ] 确保新导出的类型可被正确引用
- [ ] 验证导入路径正确性

**依赖**: 6.3
**验收标准**: 类型包结构清晰，导入方便

### 任务 7.2: 编写迁移文档
- [ ] 记录迁移过程和遇到的问题
- [ ] 编写类型使用指南
- [ ] 更新开发规范文档

**依赖**: 7.1
**预计产出**: 完整的迁移文档

### 任务 7.3: 代码清理
- [ ] 移除无用的注释和调试代码
- [ ] 统一代码格式
- [ ] 确保所有文件都有适当的版权信息

**依赖**: 7.2
**验收标准**: 代码整洁，符合项目规范

## 执行注意事项

1. **顺序执行**: 必须按照阶段顺序执行，每个阶段完成后再进入下一阶段
2. **及时验证**: 每完成一个任务都要运行相应的验证命令
3. **备份重要**: 在大规模修改前建议创建代码备份
4. **渐进处理**: 可以按模块逐步处理，避免一次性修改过多文件
5. **问题记录**: 遇到问题及时记录，并在完成后总结解决方案

## 验收标准总结

- ✅ 所有业务类型已迁移到类型包
- ✅ 所有下拉选项已正确分类和迁移
- ✅ 所有表单 props 都有 mode 字段
- ✅ 类型检查完全通过
- ✅ 功能测试正常
- ✅ 构建成功
- ✅ 代码整洁，文档完整