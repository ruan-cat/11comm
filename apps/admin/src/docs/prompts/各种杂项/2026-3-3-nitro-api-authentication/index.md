<!-- TODO: 需要实现完整的接口鉴权功能 -->

# nitro 接口鉴权

- 鉴权集成方案报告： apps\admin\src\docs\reports\2026-02-21-nitro-neon-auth-integration-research.md

## 001 处理接口出现 token 过期错误

`openspec\changes\nitro-api-authentication` 任务说已经完成了接口鉴权的工作，但是我访问本地时，出现这个错误。

如下图所示：

![2026-03-03-05-17-26](https://gh-img-store.ruan-cat.com/01s-docs/11comm/2026-03-03-05-17-26.png)

日志如下：

```log
HTTPError {▼
  stack: '未登录或 Token 已过期\n' +
  'at createError (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/h3@2.0.1-rc.14_crossws@0.4.4_srvx@0.10.1_/node_modules/h3/dist/h3-Dol7UbDx.mjs:2251:9)\n' +
  'at D:/code/github-desktop-store/01s-11comm/apps/admin/server/middleware/2.auth.ts:69:9)\n' +
  'at callMiddleware (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/h3@2.0.1-rc.14_crossws@0.4.4_srvx@0.10.1_/node_modules/h3/dist/h3-Dol7UbDx.mjs:325:14)\n' +
  'at next (D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/h3@2.0.1-rc.14_crossws@0.4.4_srvx@0.10.1_/node_modules/h3/dist/h3-Dol7UbDx.mjs:322:16)\n' +
  'at D:/code/github-desktop-store/01s-11comm/node_modules/.pnpm/h3@2.0.1-rc.14_crossws@0.4.4_srvx@0.10.1_/node_modules/h3/dist/h3-Dol7UbDx.mjs:326:134)\n' +
  '    at processTicksAndRejections (node:internal/process/task_queues:105:5)',
  message: '未登录或 Token 已过期',
  cause: Object {▼},
  status: 401,
  statusText: undefined,
  headers: undefined,
  data: null,
  body: undefined,
  unhandled: undefined,
}
```

请问是我缺少配置什么了么？我需要在 neon 内配置什么么？
