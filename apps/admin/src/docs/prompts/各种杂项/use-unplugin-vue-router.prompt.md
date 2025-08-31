# 项目路由写法改造

我现在要改造 pure-admin 项目，将该项目用 unplugin-vue-router 基于目录结构的路由插件来改造。

现在的路由配置方案用起来不舒服，我不希望未来在 `src\router\modules` 目录内手动写入任何路由。

我希望做到以下要求：

## 保留原来的路由配置

不要删改 `src\router\modules` 目录下的任何文件。这里面的文件都是已经准备好的页面路由配置文件。不要改动这些路由。

## 不要修改 src\views 目录内的页面

不要修改 `src\views` 目录下的任何文件。这里面的文件都是已经准备好的页面组件。不要改动这些页面。不要更改其组织层级。

## 不要修改侧边栏组件

## 原来的页面全部认定为案例路由

这些页面都是 pure-admin 项目的具体案例，我希望你能实现重写路由。比如：

`/able/verify` 路由重写为 `/sample/able/verify` 路由。我希望原来的案例路由都被认定为 `/sample` 路由下的子路由。

## 侧边栏仅仅展示自动化路由

我希望本项目的侧边栏，仅仅展示 unplugin-vue-router 生成的自动化路由。

## 告诉我额外要配置的 meta 信息

在 pure-admin 内，肯定要求配置一些固定的 meta 信息的。

我们首先是依赖于 pure-admin 的路由系统的，其次是在该路由系统的基础上，加上额外的 unplugin-vue-router 自动化路由功能。

请认真阅读 pure-admin 的文档，了解它的路由系统是如何工作的。

未来我会在 unplugin-vue-router 所要求的的 definePage() 宏内，增加所需的 meta 信息。
