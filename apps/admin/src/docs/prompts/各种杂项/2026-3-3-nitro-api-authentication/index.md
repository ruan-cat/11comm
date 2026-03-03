<!-- 本项目不再考虑严格的鉴权功能 -->

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

## 002 生产环境出现严重的 500 错误

考虑放弃该任务，不想实现 nitro 接口鉴权了。好麻烦，代码越来越糟糕。

---

我们项目搭建了 neon 鉴权功能，但是出现严重错误。访问生产环境 `https://01s-11comm.ruan-cat.com/` 时，出现以下错误：

```log
{
  "error": true,
  "url": "https://01s-11comm.ruan-cat.com/",
  "status": 500,
  "message": "Server Error"
}
```

自从搭建了 neon 鉴权功能以来，就无法访问了。请你解决这个故障。

## 003 阅读上一次修改的记忆体，根据记忆，编写提交信息

请你阅读上一次完成的内容，和会话沟通记忆，为本次关于 neon 和 nitro 接口放弃，禁用鉴权能力的一些列修改，编写提交信息。

1. 大量的接口不再编写鉴权。
2. 删除了很多接口中间件。
3. 修改 AI 文档，声明本项目不考虑鉴权。
4. 删改了风险报告，不考虑鉴权。
5. 删除掉过时的无用报告。

## 004 <!-- TODO: --> 解决生产环境无法访问的故障

我们项目曾经搭建了 neon 鉴权功能，但是现在不需要了。可以是在访问生产环境 `https://01s-11comm.ruan-cat.com/` 时，仍然出现以下错误：

```log
{
  "error": true,
  "url": "https://01s-11comm.ruan-cat.com/",
  "status": 500,
  "message": "Server Error"
}
```

可能是我们项目对 neon 鉴权这一部分没有完全的实现删除和调整，请你现在仔细检查。并确保生产环境可以正常运行。

你可以本地构建，然后对 nitro 的构建结果，使用本地运行和 preview 的手段，对打包构建的产物工件做检查。实现对生产环境的检查。

主动使用谷歌浏览器 MCP 完成任务。
