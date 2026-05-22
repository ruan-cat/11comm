# 2026-05-20 apps/api Route Inventory

This artifact supports `tasks.md` task 113. It records the current route inventory snapshot for `apps/api` and the mapping boundaries between route files, runtime keys, legacy paths, canonical paths, methods, and owner modules. The full route-level CSV detail is in `route-inventory-details.csv.md`.

## Scope

- Scanned `apps/api/server/routes/api/**/*.ts`.
- Scanned `apps/api/server/shared/runtime/runtime-endpoints.ts`, `endpoint-registry.ts`, `legacy-fallback.ts`, and `apps/api/server/handlers/legacy-dispatch.ts`.
- Scanned `apps/api/server/modules/**/{runtime,index,admin-adapter,legacy-adapter,legacy-endpoints}.ts`.
- Compared admin legacy source `apps/admin/server/api/**/*.ts`.
- Compared app legacy dispatch source `apps/app/server/modules/**/endpoints.ts` and `apps/app/server/handlers/legacy-dispatch.ts`.

This is an inventory artifact only. It does not upgrade endpoint completion, production `DB_READY`, real DB sample evidence, shadow-off/fallback evidence, write-read-rollback evidence, or old service retirement status.

## Snapshot Summary

| Stream                              | Current finding                                                                                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api` route files              | 160 total: 154 `POST`, 5 `GET`, 1 file-route with no method suffix (`j1-dashboard/center/commonmenu/get.ts`)                                                                              |
| admin legacy files                  | 155 files under `apps/admin/server/api/**/*.ts`; all 155 have same-path route files under `apps/api/server/routes/api`                                                                    |
| extra `apps/api` admin routes       | 5 fee routes do not have same-path admin legacy files: `expense-item-setting/{create,delete,detail,update}` and `house-charge/detail`                                                     |
| runtime manifest                    | 142 admin canonical entries in `runtimeEndpointManifest`; app legacy entries are built from 21 `EndpointDefinition` rows                                                                  |
| app legacy registered in `apps/api` | 21 explicit legacy definitions: `fee` 12, `repair` 7, `floor` 2                                                                                                                           |
| app legacy remaining fallback       | `apps/app` has 214 unique legacy paths; after 21 explicit `apps/api` definitions, 193 `/app/**` or `/callComponent/**` paths still rely on fallback proxy if requested through `apps/api` |
| `/test/**` app paths                | present in app module definitions, but neither `apps/api` nor `apps/app` Nitro config mounts `/test/**` into legacy dispatch                                                              |

## Mapping Rules

| Field          | Admin canonical route source                                                                       | App legacy route source                                                 |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| route file     | `apps/api/server/routes/api/<path>.<method>.ts`                                                    | no file route; handled by `apps/api/server/handlers/legacy-dispatch.ts` |
| runtime key    | normally `${METHOD} ${canonicalPath}`; file suffix decides method                                  | `endpoint-registry.ts` uses `${METHOD} ${legacyPath}`                   |
| legacy path    | same as canonical path for admin old `/api/**` coverage, except diagnostic routes                  | `EndpointDefinition.url`, e.g. `/app/fee.listFee`                       |
| canonical path | `/api/<route file path without method suffix>`                                                     | none; app legacy keeps old path and response envelope                   |
| method         | `.post.ts` => `POST`, `.get.ts` => `GET`; `commonmenu/get.ts` is `ANY/needs explicit verification` | `EndpointDefinition.method`; arrays produce multiple runtime keys       |
| owner module   | derived from route domain or manifest owner                                                        | declared in `runtimeEndpointEntries`: `fee`, `repair`, `floor`          |

Admin canonical route files call module runtime/admin adapters directly. They do not enter `runtimeEndpointDefinitions`. App legacy requests enter `legacy-dispatch`, which first tries the endpoint registry and then proxies `/app/**` or `/callComponent/**` fallback when the registry returns 404.

For all 160 admin canonical route rows, use `route-inventory-details.csv.md`. That detail artifact also marks the 142 admin canonical manifest rows through `manifestPhase` and `manifestStatus`.

## Owner Module Matrix

| owner group                             | route files | owner module                                                   | module files                                                                                                                                                                                                                                        |
| --------------------------------------- | ----------: | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `debug-env`                             |           1 | `debug`                                                        | no business module                                                                                                                                                                                                                                  |
| `dev-team/cache-manage`                 |           1 | `dev`                                                          | `dev`: runtime/admin adapter                                                                                                                                                                                                                        |
| `dev-team/config-manage`                |          20 | `dev`                                                          | `dev`: runtime/admin adapter                                                                                                                                                                                                                        |
| `dev-team/menu-manage`                  |           3 | `dev`                                                          | `dev`: runtime/admin adapter                                                                                                                                                                                                                        |
| `j1-dashboard/center`                   |           1 | `j1-dashboard`                                                 | no business module; special file route                                                                                                                                                                                                              |
| `operation-team/data-manage`            |           3 | `operation`                                                    | `operation`: runtime/admin adapter                                                                                                                                                                                                                  |
| `operation-team/merchant-manage`        |           2 | `operation`                                                    | `operation`: runtime/admin adapter                                                                                                                                                                                                                  |
| `operation-team/report-configuration`   |           3 | `operation`                                                    | `operation`: runtime/admin adapter                                                                                                                                                                                                                  |
| `operation-team/system-manage`          |           5 | `operation`                                                    | `operation`: runtime/admin adapter                                                                                                                                                                                                                  |
| `property-manage/community-manage`      |           7 | `community`                                                    | `community`: runtime/admin adapter                                                                                                                                                                                                                  |
| `property-manage/contract-manage`       |          25 | `contract`                                                     | `contract`: runtime/admin adapter; task77-task80 have 12 normal list manifest entries, task101 adds 8 change/draft-contract CUD/detail manifest entries, and task102 keeps 5 upload/R2 routes manifest-missing with explicit adapter-level blocking |
| `property-manage/expense-manage`        |          21 | `fee`                                                          | `fee`: runtime/admin adapter + legacy adapter + legacy endpoints                                                                                                                                                                                    |
| `property-manage/house-property-manage` |          10 | `house-property` in manifest, maps to `house` module directory |
| `property-manage/parking-manage`        |           4 | `parking`                                                      | `parking`: runtime/admin adapter                                                                                                                                                                                                                    |
| `property-manage/patrol-manage`         |           6 | `patrol`                                                       | `patrol`: runtime/admin adapter                                                                                                                                                                                                                     |
| `property-manage/repairs-manage`        |           7 | `repair`                                                       | `repair`: runtime/admin adapter + legacy adapter + legacy endpoints                                                                                                                                                                                 |
| `property-manage/report-manage`         |          13 | `fee-report` in manifest, no independent module directory      |
| `setting-manage/organize-manage`        |           8 | `setting`                                                      | `setting`: runtime/admin adapter; edge checkpoint adds local contract/repository and local admin H5 Network coverage for `org-info/tree`; remaining organize rows stay manifest-missing                                                             |
| `setting-manage/system-manage`          |          20 | `setting`                                                      | `setting`: runtime/admin adapter                                                                                                                                                                                                                    |

## Contract And Fee Route Rows

These two groups are the immediate next admin areas. `legacyPath` equals `canonicalPath` for admin old `/api/**` exact coverage unless otherwise noted. The complete 160-row inventory is in `route-inventory-details.csv.md`; the table below is the focused next-slice extract.

```csv
routeFile,runtimeKey,legacyPath,canonicalPath,method,ownerModule
property-manage/contract-manage/archive/list.post.ts,POST /api/property-manage/contract-manage/archive/list,/api/property-manage/contract-manage/archive/list,/api/property-manage/contract-manage/archive/list,POST,contract
property-manage/contract-manage/attachment/list.post.ts,POST /api/property-manage/contract-manage/attachment/list,/api/property-manage/contract-manage/attachment/list,/api/property-manage/contract-manage/attachment/list,POST,contract
property-manage/contract-manage/change/create.post.ts,POST /api/property-manage/contract-manage/change/create,/api/property-manage/contract-manage/change/create,/api/property-manage/contract-manage/change/create,POST,contract
property-manage/contract-manage/change/delete.post.ts,POST /api/property-manage/contract-manage/change/delete,/api/property-manage/contract-manage/change/delete,/api/property-manage/contract-manage/change/delete,POST,contract
property-manage/contract-manage/change/detail.post.ts,POST /api/property-manage/contract-manage/change/detail,/api/property-manage/contract-manage/change/detail,/api/property-manage/contract-manage/change/detail,POST,contract
property-manage/contract-manage/change/list.post.ts,POST /api/property-manage/contract-manage/change/list,/api/property-manage/contract-manage/change/list,/api/property-manage/contract-manage/change/list,POST,contract
property-manage/contract-manage/change/update.post.ts,POST /api/property-manage/contract-manage/change/update,/api/property-manage/contract-manage/change/update,/api/property-manage/contract-manage/change/update,POST,contract
property-manage/contract-manage/clause/list.post.ts,POST /api/property-manage/contract-manage/clause/list,/api/property-manage/contract-manage/clause/list,/api/property-manage/contract-manage/clause/list,POST,contract
property-manage/contract-manage/draft-contract/create.post.ts,POST /api/property-manage/contract-manage/draft-contract/create,/api/property-manage/contract-manage/draft-contract/create,/api/property-manage/contract-manage/draft-contract/create,POST,contract
property-manage/contract-manage/draft-contract/delete.post.ts,POST /api/property-manage/contract-manage/draft-contract/delete,/api/property-manage/contract-manage/draft-contract/delete,/api/property-manage/contract-manage/draft-contract/delete,POST,contract
property-manage/contract-manage/draft-contract/detail.post.ts,POST /api/property-manage/contract-manage/draft-contract/detail,/api/property-manage/contract-manage/draft-contract/detail,/api/property-manage/contract-manage/draft-contract/detail,POST,contract
property-manage/contract-manage/draft-contract/list.post.ts,POST /api/property-manage/contract-manage/draft-contract/list,/api/property-manage/contract-manage/draft-contract/list,/api/property-manage/contract-manage/draft-contract/list,POST,contract
property-manage/contract-manage/draft-contract/update.post.ts,POST /api/property-manage/contract-manage/draft-contract/update,/api/property-manage/contract-manage/draft-contract/update,/api/property-manage/contract-manage/draft-contract/update,POST,contract
property-manage/contract-manage/expire/list.post.ts,POST /api/property-manage/contract-manage/expire/list,/api/property-manage/contract-manage/expire/list,/api/property-manage/contract-manage/expire/list,POST,contract
property-manage/contract-manage/first-party/list.post.ts,POST /api/property-manage/contract-manage/first-party/list,/api/property-manage/contract-manage/first-party/list,/api/property-manage/contract-manage/first-party/list,POST,contract
property-manage/contract-manage/print/list.post.ts,POST /api/property-manage/contract-manage/print/list,/api/property-manage/contract-manage/print/list,/api/property-manage/contract-manage/print/list,POST,contract
property-manage/contract-manage/review/list.post.ts,POST /api/property-manage/contract-manage/review/list,/api/property-manage/contract-manage/review/list,/api/property-manage/contract-manage/review/list,POST,contract
property-manage/contract-manage/second-party/list.post.ts,POST /api/property-manage/contract-manage/second-party/list,/api/property-manage/contract-manage/second-party/list,/api/property-manage/contract-manage/second-party/list,POST,contract
property-manage/contract-manage/template/list.post.ts,POST /api/property-manage/contract-manage/template/list,/api/property-manage/contract-manage/template/list,/api/property-manage/contract-manage/template/list,POST,contract
property-manage/contract-manage/type/list.post.ts,POST /api/property-manage/contract-manage/type/list,/api/property-manage/contract-manage/type/list,/api/property-manage/contract-manage/type/list,POST,contract
property-manage/contract-manage/upload/abort.post.ts,POST /api/property-manage/contract-manage/upload/abort,/api/property-manage/contract-manage/upload/abort,/api/property-manage/contract-manage/upload/abort,POST,contract
property-manage/contract-manage/upload/complete.post.ts,POST /api/property-manage/contract-manage/upload/complete,/api/property-manage/contract-manage/upload/complete,/api/property-manage/contract-manage/upload/complete,POST,contract
property-manage/contract-manage/upload/init.post.ts,POST /api/property-manage/contract-manage/upload/init,/api/property-manage/contract-manage/upload/init,/api/property-manage/contract-manage/upload/init,POST,contract
property-manage/contract-manage/upload/sign-part.post.ts,POST /api/property-manage/contract-manage/upload/sign-part,/api/property-manage/contract-manage/upload/sign-part,/api/property-manage/contract-manage/upload/sign-part,POST,contract
property-manage/contract-manage/upload/status.post.ts,POST /api/property-manage/contract-manage/upload/status,/api/property-manage/contract-manage/upload/status,/api/property-manage/contract-manage/upload/status,POST,contract
property-manage/expense-manage/cancel-fee/list.post.ts,POST /api/property-manage/expense-manage/cancel-fee/list,/api/property-manage/expense-manage/cancel-fee/list,/api/property-manage/expense-manage/cancel-fee/list,POST,fee
property-manage/expense-manage/contracte-charge/list.post.ts,POST /api/property-manage/expense-manage/contracte-charge/list,/api/property-manage/expense-manage/contracte-charge/list,/api/property-manage/expense-manage/contracte-charge/list,POST,fee
property-manage/expense-manage/discount-apply/list.post.ts,POST /api/property-manage/expense-manage/discount-apply/list,/api/property-manage/expense-manage/discount-apply/list,/api/property-manage/expense-manage/discount-apply/list,POST,fee
property-manage/expense-manage/discount-setting/list.post.ts,POST /api/property-manage/expense-manage/discount-setting/list,/api/property-manage/expense-manage/discount-setting/list,/api/property-manage/expense-manage/discount-setting/list,POST,fee
property-manage/expense-manage/discount-type/list.post.ts,POST /api/property-manage/expense-manage/discount-type/list,/api/property-manage/expense-manage/discount-type/list,/api/property-manage/expense-manage/discount-type/list,POST,fee
property-manage/expense-manage/expense-item-setting/create.post.ts,POST /api/property-manage/expense-manage/expense-item-setting/create,/api/property-manage/expense-manage/expense-item-setting/create,/api/property-manage/expense-manage/expense-item-setting/create,POST,fee
property-manage/expense-manage/expense-item-setting/delete.post.ts,POST /api/property-manage/expense-manage/expense-item-setting/delete,/api/property-manage/expense-manage/expense-item-setting/delete,/api/property-manage/expense-manage/expense-item-setting/delete,POST,fee
property-manage/expense-manage/expense-item-setting/detail.post.ts,POST /api/property-manage/expense-manage/expense-item-setting/detail,/api/property-manage/expense-manage/expense-item-setting/detail,/api/property-manage/expense-manage/expense-item-setting/detail,POST,fee
property-manage/expense-manage/expense-item-setting/list.post.ts,POST /api/property-manage/expense-manage/expense-item-setting/list,/api/property-manage/expense-manage/expense-item-setting/list,/api/property-manage/expense-manage/expense-item-setting/list,POST,fee
property-manage/expense-manage/expense-item-setting/update.post.ts,POST /api/property-manage/expense-manage/expense-item-setting/update,/api/property-manage/expense-manage/expense-item-setting/update,/api/property-manage/expense-manage/expense-item-setting/update,POST,fee
property-manage/expense-manage/expense-summary-table/list.post.ts,POST /api/property-manage/expense-manage/expense-summary-table/list,/api/property-manage/expense-manage/expense-summary-table/list,/api/property-manage/expense-manage/expense-summary-table/list,POST,fee
property-manage/expense-manage/house-charge/detail.post.ts,POST /api/property-manage/expense-manage/house-charge/detail,/api/property-manage/expense-manage/house-charge/detail,/api/property-manage/expense-manage/house-charge/detail,POST,fee
property-manage/expense-manage/house-charge/list.post.ts,POST /api/property-manage/expense-manage/house-charge/list,/api/property-manage/expense-manage/house-charge/list,/api/property-manage/expense-manage/house-charge/list,POST,fee
property-manage/expense-manage/meter-reading-type/list.post.ts,POST /api/property-manage/expense-manage/meter-reading-type/list,/api/property-manage/expense-manage/meter-reading-type/list,/api/property-manage/expense-manage/meter-reading-type/list,POST,fee
property-manage/expense-manage/overdue-payment-information/list.post.ts,POST /api/property-manage/expense-manage/overdue-payment-information/list,/api/property-manage/expense-manage/overdue-payment-information/list,/api/property-manage/expense-manage/overdue-payment-information/list,POST,fee
property-manage/expense-manage/payment-review/list.post.ts,POST /api/property-manage/expense-manage/payment-review/list,/api/property-manage/expense-manage/payment-review/list,/api/property-manage/expense-manage/payment-review/list,POST,fee
property-manage/expense-manage/refund-review/list.post.ts,POST /api/property-manage/expense-manage/refund-review/list,/api/property-manage/expense-manage/refund-review/list,/api/property-manage/expense-manage/refund-review/list,POST,fee
property-manage/expense-manage/reminder-for-overdue-payments/list.post.ts,POST /api/property-manage/expense-manage/reminder-for-overdue-payments/list,/api/property-manage/expense-manage/reminder-for-overdue-payments/list,/api/property-manage/expense-manage/reminder-for-overdue-payments/list,POST,fee
property-manage/expense-manage/reprint-voucher/list.post.ts,POST /api/property-manage/expense-manage/reprint-voucher/list,/api/property-manage/expense-manage/reprint-voucher/list,/api/property-manage/expense-manage/reprint-voucher/list,POST,fee
property-manage/expense-manage/vehicle-charge/list.post.ts,POST /api/property-manage/expense-manage/vehicle-charge/list,/api/property-manage/expense-manage/vehicle-charge/list,/api/property-manage/expense-manage/vehicle-charge/list,POST,fee
property-manage/expense-manage/water-and-electricity-meter-reading/list.post.ts,POST /api/property-manage/expense-manage/water-and-electricity-meter-reading/list,/api/property-manage/expense-manage/water-and-electricity-meter-reading/list,/api/property-manage/expense-manage/water-and-electricity-meter-reading/list,POST,fee
```

## App Legacy Explicit Registry

`runtimeEndpointDefinitions` currently registers only app legacy definitions. Arrays create more than one runtime key.

```csv
ownerModule,legacyPath,method,runtimeKeys,cutoverStatus
fee,/app/fee.listFee,GET+POST,GET /app/fee.listFee; POST /app/fee.listFee,app-shadow-allowlist
fee,/app/fee.queryFeeDetail,GET+POST,GET /app/fee.queryFeeDetail; POST /app/fee.queryFeeDetail,app-shadow-allowlist
fee,/app/feeApi/listOweFees,GET+POST,GET /app/feeApi/listOweFees; POST /app/feeApi/listOweFees,app-shadow-allowlist
fee,/app/payment.nativeQrcodePayment,POST,POST /app/payment.nativeQrcodePayment,blocked-for-execution
fee,/app/oweFeeCallable.listOweFeeCallable,GET+POST,GET /app/oweFeeCallable.listOweFeeCallable; POST /app/oweFeeCallable.listOweFeeCallable,app-shadow-allowlist
fee,/app/oweFeeCallable.writeOweFeeCallable,POST,POST /app/oweFeeCallable.writeOweFeeCallable,blocked-for-execution
fee,/app/fee.saveRoomCreateFee,POST,POST /app/fee.saveRoomCreateFee,blocked-for-execution
fee,/app/feeConfig.listFeeConfigs,GET+POST,GET /app/feeConfig.listFeeConfigs; POST /app/feeConfig.listFeeConfigs,app-shadow-allowlist
fee,/app/reportFeeMonthStatistics.queryReportFeeSummary,GET+POST,GET /app/reportFeeMonthStatistics.queryReportFeeSummary; POST /app/reportFeeMonthStatistics.queryReportFeeSummary,app-shadow-allowlist
fee,/app/reportFeeMonthStatistics/queryPayFeeDetail,GET+POST,GET /app/reportFeeMonthStatistics/queryPayFeeDetail; POST /app/reportFeeMonthStatistics/queryPayFeeDetail,app-shadow-allowlist
fee,/app/reportFeeMonthStatistics.queryReportFeeDetailRoom,GET+POST,GET /app/reportFeeMonthStatistics.queryReportFeeDetailRoom; POST /app/reportFeeMonthStatistics.queryReportFeeDetailRoom,app-shadow-allowlist
fee,/app/dataReport.queryFeeDataReport,GET+POST,GET /app/dataReport.queryFeeDataReport; POST /app/dataReport.queryFeeDataReport,app-shadow-allowlist
repair,/app/ownerRepair.listOwnerRepairs,GET+POST,GET /app/ownerRepair.listOwnerRepairs; POST /app/ownerRepair.listOwnerRepairs,app-shadow-allowlist
repair,/app/ownerRepair.queryOwnerRepair,GET+POST,GET /app/ownerRepair.queryOwnerRepair; POST /app/ownerRepair.queryOwnerRepair,app-shadow-allowlist
repair,/app/ownerRepair.saveOwnerRepair,POST,POST /app/ownerRepair.saveOwnerRepair,blocked-for-execution
repair,/app/repairSetting.listRepairSettings,GET+POST,GET /app/repairSetting.listRepairSettings; POST /app/repairSetting.listRepairSettings,app-shadow-allowlist
repair,/app/dict.queryRepairStates,GET+POST,GET /app/dict.queryRepairStates; POST /app/dict.queryRepairStates,app-shadow-allowlist
repair,/callComponent/core/list,GET+POST,GET /callComponent/core/list; POST /callComponent/core/list,app-shadow-allowlist
repair,/callComponent/ownerRepair.appraiseRepair,POST,POST /callComponent/ownerRepair.appraiseRepair,blocked-for-execution
floor,/app/floor.queryFloors,GET+POST,GET /app/floor.queryFloors; POST /app/floor.queryFloors,app-shadow-allowlist
floor,/app/floor.queryFloorDetail,GET+POST,GET /app/floor.queryFloorDetail; POST /app/floor.queryFloorDetail,app-shadow-allowlist
```

## Current Gaps

- `contract` has 25 route files and `createAdminContractAdapter`; task77-task80 have added manifest entries for all 12 normal list routes, and task101 has added manifest entries for `change/{create,detail,update,delete}` plus `draft-contract/{create,detail,update,delete}` with status `available-in-apps-api-not-caller-verified`. These 20 manifest-covered rows still do not prove production create/update/delete, write-read-rollback, admin H5 Network, `DB_READY`, shadow-off/fallback, or retirement. The remaining contract manifest gaps are the 5 `upload/*` R2 multipart routes.
- `dev` has 24 route files across config/menu/cache. Task92-task95 added manifest entries for `dev-team/config-manage/center/{list,create,detail,update,delete}`, `dev-team/config-manage/dictionary/{list,create,detail,update,delete}`, `dev-team/config-manage/item/{list,create,detail,update,delete}`, and `dev-team/config-manage/type/{list,create,detail,update,delete}`. The remaining `dev` rows, including `cache-manage` and `menu-manage`, must stay manifest-missing until explicit manifest entries are added and verified.
- `setting` has 28 route files across organize/system. Task96-task100 added manifest entries for `setting-manage/system-manage/change-password/{list,create,update,delete}`, `setting-manage/system-manage/community-configuration/{list,create,update,delete}`, `setting-manage/system-manage/initialize-cell/{list,create,update,delete}`, `setting-manage/system-manage/register-protocol/{list,create,update,delete}`, and `setting-manage/system-manage/system-config/{list,create,update,delete}`. The edge-route checkpoint adds `setting-manage/organize-manage/org-info/tree` with phase `phase7-setting-organize-manage-admin-edge` plus local admin H5 `/api-shadow` Network evidence; the other `organize-manage` rows remain manifest-missing until explicit manifest entries are added and verified.
- Edge route decisions: `debug-env.get.ts` remains a diagnostic route and is excluded from admin business migration manifest/retirement candidate counts; `j1-dashboard/center/commonmenu/get.ts` remains a placeholder file route without method suffix and is excluded from method-specific migration evidence until a real caller/business module is proven; `org-info/tree` has local apps/api contract/repository coverage, local admin H5 Network evidence, and production admin H5 caller evidence. Production API/admin H5 are reachable, but 2026-05-21 production sampling returned `data=[]` for `org-info/tree` while `org-info/list` returned 5 rows, and `/__nitro/ready` still reported `READY_CONFIGURED` rather than `DB_READY`; therefore `org-info/tree` still lacks production tree data parity, `DB_READY`, shadow-off/fallback, and retirement ledger evidence.
- `contract-manage/upload/*` routes call `contract.adminAdapter.upload*`; task102 changed the default adapter behavior from placeholder/mock-like success to explicit `409` R2 blocked responses. These 5 routes remain manifest-missing and still do not prove full R2 multipart behavior.
- `fee-report` and `house-property` appear as manifest owner modules but do not have matching module directories; they map to existing module implementations by domain and need explicit documentation before retirement decisions.
- Admin canonical manifest is manually authored, not generated from file routes; route existence and manifest coverage must be verified separately.
- App legacy registry covers only `fee`, `repair`, and `floor`; the remaining app legacy paths are fallback-proxy candidates, not migrated runtime endpoints.
- `apps/api` legacy dispatch uses exact `METHOD path` keys and does not support `:param`; `apps/app` legacy dispatch supports dynamic single-segment params.
- `j1-dashboard/center/commonmenu/get.ts` is a file route without `.get.ts` method suffix. Its runtime method and real caller must be verified before using it as a method-specific business migration evidence row.
