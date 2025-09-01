# 报表组 列表页 提示词

## 001

请深度思考。
在 apps\admin\src\pages\operation-team\report-configuration\report-group\index.vue 和 apps\admin\src\pages\operation-team\report-configuration\report-group\test-data.ts 内，临时更改，不使用假的 `报表组_列表数据` 和 `报表组_列表查询_VO` ，改用真实的类型和字段。
`报表组_列表数据` 换成 ReportGroupInfo 类型。
`报表组_列表查询_VO` 换成 `RemovePageIndexAndPageSize<ReportGroupQueryParams>` 类型。
