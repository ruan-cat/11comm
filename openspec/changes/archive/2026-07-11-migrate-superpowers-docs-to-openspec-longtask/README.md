# Phase 7: Migrate Superpowers Docs to OpenSpec Longtask

本文档目录用于管理将 Superpowers Markdown 文件迁移到 OpenSpec 规范的长任务。

## 目录结构

```plain
openspec/changes/migrate-superpowers-docs-to-openspec-longtask/
├── .openspec.yaml          # OpenSpec 配置
├── proposal.md              # 变更提案
├── design.md                # 设计文档
├── tasks.md                 # 任务清单（唯一可执行任务源）
├── specs/                   # OpenSpec 规范文档
│   ├── admin-api-cutover/
│   ├── admin-special-cases/
│   ├── agent-team-batch-execution/
│   ├── app-legacy-cutover/
│   ├── browser-and-environment-verification/
│   ├── db-readiness-and-write-verification/
│   ├── legacy-superpowers-content-transcription/
│   ├── phase7-evidence-model/
│   ├── retirement-gate-and-archive/
│   ├── source-history-and-memory-governance/
│   ├── unified-nitro-api-consolidation/
│   └── vitest-and-runtime-verification/
├── reports/                 # 报告与审计文档
│   ├── phase7-audits/      # 审计报告
│   │   ├── 2026-05-09-legacy-nitro-directory-dependency-audit.md
│   │   ├── 2026-05-09-legacy-nitro-retirement-execution-plan.md
│   │   ├── 2026-05-20-contract-boundary-audit.md
│   │   ├── 2026-05-20-contract-manage-list-coverage-audit.md
│   │   ├── 2026-05-20-nitro-h3-auth-audit.md
│   │   ├── 2026-05-20-route-inventory.md
│   │   ├── 2026-05-20-route-inventory-details.csv.md
│   │   ├── 2026-05-20-runtime-evidence-alignment-audit.md
│   │   ├── 2026-05-20-schema-wiring-audit.md
│   │   ├── 2026-05-20-status-evidence-field-audit.md
│   │   ├── 2026-05-22-db-connection-scope-audit.md
│   │   └── 2026-05-22-module-layering-audit.md
│   └── phase7-progress/    # 进度报告
│       ├── 2026-05-25-admin-resolver-fresh-scan.md
│       ├── 2026-05-25-edge-debug-shared-system-route-classification.md
│       ├── 2026-07-10-agent-findings.md
│       └── 2026-07-10-agent-progress.md
├── ledger/                  # 分类台账
│   ├── 2026-05-25-admin-retirement-ledger.md
│   └── 2026-05-25-app-retirement-ledger.md
├── evidence-matrix/         # 证据矩阵
│   ├── 2026-05-25-old-service-retirement-candidates.md
│   └── 2026-05-25-retirement-evidence-matrix.md
└── retirement-ledger-overlays/  # 台账覆盖层
```

## 文档命名规范

- 报告文件：使用 `YYYY-MM-DD-{描述性名称}.md` 格式
- OpenSpec artifacts：遵循 OpenSpec 规范命名
- 审计报告：放在 `reports/phase7-audits/` 目录
- 进度报告：放在 `reports/phase7-progress/` 目录
- 分类台账：放在 `ledger/` 目录
- 证据矩阵：放在 `evidence-matrix/` 目录

## 核心文件

| 文件              | 说明                                        |
| ----------------- | ------------------------------------------- |
| `proposal.md`     | 变更提案，定义 Why 和 What Changes          |
| `design.md`       | 设计文档，包含架构决策                      |
| `tasks.md`        | 唯一可执行任务源，包含 P0-P8 批次和当前任务 |
| `specs/*/spec.md` | OpenSpec 规范文档                           |

## 验证报告

生产环境验证报告位于 `reports/phase7-verification/` 目录。

## 更多信息

- [变更提案](./proposal.md)
- [设计文档](./design.md)
- [任务清单](./tasks.md)
