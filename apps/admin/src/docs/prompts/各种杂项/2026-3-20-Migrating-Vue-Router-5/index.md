<!-- 已完成 -->

# 2026-3-20-Migrating-Vue-Router-5 迁移到 vue-router v5 版本

- https://router.vuejs.org/guide/migration/v4-to-v5.html

我们项目使用了 `unplugin-vue-router` 来实现类型化路由，现在这个包已经被内部实现了，被整合了，所以我们项目也需要动态的更新，做出巨大的迁移更改。

## 更新项

在后台项目内，至少要更新这些内容：

- 依赖
- vite 插件
- 更新路由导入配置
- 生成的类型文件
- tsconfig.json 导入的类型文件

## 当前迁移目标

- 直接依赖 `vue-router@^5`
- Vite 插件入口改为 `vue-router/vite`
- 自动导入入口改为 `vue-router/unplugin`
- 运行时自动路由模块继续使用 `vue-router/auto-routes`
- 生成的路由类型文件改为 `apps/admin/src/route-map.d.ts`
- `tsconfig.json` 移除 `unplugin-vue-router/client`
- 如需编辑器级路由推导，补充 Vue Router v5 的 Volar 插件配置

## 更新 `apps\admin\src\docs` 内的指导说明文档

我们的 doc 文档更新可能不及时，需要及时更新说明，避免误导其他同事阅读与维护项目。
