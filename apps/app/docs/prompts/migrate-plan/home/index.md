# 首页

## 001 <!-- TODO: --> 处理微信小程序 icon 丢失的故障

![2026-04-03-21-17-44](https://gh-img-store.ruan-cat.com/img/2026-04-03-21-17-44.png)

在 pages/index/index 内，在微信小程序内，无法识别 icon。

这些 icon 无法识别到位：

- i-carbon-warning
  i-carbon-location
  i-carbon-task-complete
  i-carbon-task

为什么大部分的 icon 都可以正常在微信小程序内识别到位，而这些不行呢？

我希望你去看看 unocss、uniapp、微信小程序这方面的知识点，来修复这些 icon 故障。确保这些 icon 在微信小程序内，也能够正常访问。

用 uniapp 的 dev 模式构建出来的开发环境的微信小程序，其代码在 `dist\dev\mp-weixin` 内，你可以直接翻找，并检查清楚为什么在 `src\pages\index\index.vue` 内，这些 icon 图标无法正常渲染出来。

运行 `package.json` 的 `dev:mp-weixin:nitro` 命令，生成 `dist\dev\mp-weixin` 后，进入该目录并检查。注意 `dev:mp-weixin:nitro` 命令是一个长效的 watch 命令，不是一次性的 build 命令。

### 可能的错误经验

官方信息对上了：wd-icon 文档写的是“基于字体的图标集”，自定义图标也是走 iconfont 或图片；而 Wot 自己的图标实践文档对 Iconify + UnoCSS 给的推荐写法是直接 `<text>/<view class="i-carbon:...">`。首页现在把 Iconify 图标塞进 wd-icon，这条路本身就不对。
