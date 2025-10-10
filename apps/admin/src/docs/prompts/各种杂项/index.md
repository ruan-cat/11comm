# 杂项提示词

各种零散的提示词都在这里编写。

## 001 处理生产环境爆出的 `DOMNodeInsertedIntoDocument` 故障

请深度思考。

1. 请你使用谷歌浏览器 MCP 访问以下地址，并打开控制台查看报错：

- https://01s-11comm.ruan-cat.com/
- https://01s-11.ruancat6312.top/

2. 这些报错大致都指向这样的信息，如下：

```text
const { message: Mzt } = require("/home/runner/work/11comm/11comm/apps/admin/src/utils/message.ts");
```

为什么打包结果会出现 `require` 呢？是怎么回事？请为我解决 `apps\admin\package.json` 包运行 build 命令后，部署到生产环境出现 require 的错误，按理说打包后不应该出现这样的 require 模块的。
