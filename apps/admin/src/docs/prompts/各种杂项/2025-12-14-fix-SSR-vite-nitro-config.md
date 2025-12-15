<!-- TODO: 一次性提示词 未完成 -->

# 2025-12-14 处理 vite 项目在接入集成 nitro 插件时出现的 SSR 服务端渲染适配问题，并适当的重构 vite admin 管理后台项目

1. 阅读清楚 vite SSR 文档，了解清楚正确的代码编写写法：
   - https://cn.vitejs.dev/guide/ssr
   - https://cn.vitejs.dev/config/ssr-options
2. nitro v3 插件文档与仓库：
   - https://github.com/unjs/nitro
   - https://v3.nitro.build/
3. nitro v3 插件的特点：
   - 不提供具体的 vite 配置
   - 本身变成了一个 vite 插件
4. nitro + vite SSR 改造案例：
   - 绝对路径内： `D:\code\github-desktop-store\nitro__nitrojs\examples\vite-ssr-vue-router` 的这个目录内的项目写法。
   - 请你重点模仿该项目的代码写法，学会在 vite SSR 场景下，如何恰当的改造项目。
   - 搞清楚参考项目的特征，与本项目的特性。按照该项目的方案，改造改写 admin 后台项目。
   - 注意让 `apps\admin\src\main.ts` 从客户端代码写法，迁移到 `apps\admin\src\entry-client.ts` 内。
   - 注意编写完整完善的 `apps\admin\src\entry-server.ts` 写法。
5. vite 服务端构建，需要排除忽略其他客户端依赖，否则会导致接口故障。
6. 制作区分度高的，能够区分服务端和客户端的入口文件。
7. 主动使用谷歌浏览器 MCP 做测试。
   - 主动访问 `http://localhost:8080/#/dev-team/config-manage/center` 地址。
   - 如果被重定向，进入到了登录页面，请你自己点击登录按钮即可。无需输入验证码。
   - 在 `http://localhost:8080/#/dev-team/config-manage/center` 页面内。重点关注 `/api/dev-team/config-manage/center/list` 这个 post 请求的返回值，这个接口的返回值应该是一个正常的对象，返回数组。
   - 这个接口现在出现非常严重的错误，出现了服务端 500 的错误。报错内容属于服务端代码错误导入客户端代码所引起的故障。
   - 你不需要去考虑客户端的代码是否有故障，你只需要确保改造后的项目，在服务端入口内，能够正确访问专用的服务端模块即可。
   - 只要 `/api/dev-team/config-manage/center/list` 接口这个 post 请求，能够在包含筛选条件的前提下，能够正常的请求接口数据，并作出筛选，返回正确的数据，那么就认定为整个 nitro + vite SSR 改造成功。

## 01 <!-- TODO: --> 改造成功的后续步骤

1. 对于全部名称为的 `CLAUDE.md` 、`project.md` 和 `AGENTS.md` 文件，做出适当的拓展更新。说明清楚 admin 项目的客户端与服务端入口文件。
2. 对本次改造更新，编写一整套完善的，详实的改造报告文档。
