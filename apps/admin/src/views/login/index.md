# 登录页的优化提示词

## 001 <!-- TODO: --> 用来自 vue-bits 官方首页的组件实现动态的，美化的背景页

1. 阅读完整的 `apps\admin\src\views\login\2026-3-27-use-vue-bits-background\from-chatgpt.md` 落地方案。
2. 在 `apps\admin\src\components` 目录内新增 `PlasmaWaveBackground` 这款组件。
3. 改造优化 `apps\admin\src\views\login\index.vue` 登录页的背景效果，使用这款 `PlasmaWaveBackground` 背景组件。
4. 使用谷歌浏览器 MCP，启动后台项目的 dev 命令，在浏览器内做视觉调试，查看是否能成功应用动态效果。
5. 兼容，接入主题色背景色切换的功能。在主题色切换时，整个动态背景切换成白色的色调。
