# 生成简单版本的验证码组件

请你帮我生成一个简单的验证码插件。

## 需要索引的上下文

- 接口 `apps\admin\src\api\j1\login\login.ts`
- 组件使用文档 `apps\admin\src\components\ReImageVerifySimple\index.md`
- useRenderIcon 函数 `apps\admin\src\components\ReIcon\src\hooks.ts`

## 组件位置

- apps\admin\src\components\ReImageVerifySimple

## 使用接口 getJ1LoginCaptcha

请你使用全局的函数 getJ1LoginCaptcha 。实现验证码的获取。

## icon 图标要求

icon 一律用 iconify 字符串来实现渲染。icon 图标在树组件内部的渲染逻辑使用 useRenderIcon 函数实现渲染。

## 点击验证码可以刷新验证码

用户点击验证码时，可以刷新验证码，重新加载一次验证码。并且验证码这一块有加载等待的交互效果，避免用户多次重复点击验证码。

## 加载等待效果用 v-loading 实现动效

请使用 element-plus 的 v-loading 指令，实现动效加载。

- https://element-plus.org/zh-CN/component/loading.html

## 对外暴露出接口返回值 CaptchaResult

对外提供一个点击事件，接口请求成功后，对外出事件，将接口返回值暴露出去。

## 模仿其他组件的文件组织结构

请你参考本目录内其他组件的文件组织结构，并保持相同的文件组织结构。

## 编写使用文档

请先实现完组件功能，最后根据我的指令来编写组件文档。
