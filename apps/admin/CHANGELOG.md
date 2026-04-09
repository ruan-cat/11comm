# 6.0.0 (2025-04-10)

## @01s-11comm/admin@6.1.6 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.5...@01s-11comm/admin@6.1.6)

### 🔧 更新配置

- **ci:** 将 GitHub Release 生成方式从 relizy provider-release 切换为 changelogen gh release ([2fc76d77](https://github.com/ruan-cat/11comm/commit/2fc76d77))

  relizy provider-release 单独运行缺少 release 流程上下文，创建 0 个 release。
  改用 changelogen gh release all，它直接解析 CHANGELOG.md 创建 GitHub Release，
  不依赖 git log tag1...tag2，有望绕过 @scope/pkg@version 的 @ 歧义问题。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/admin@6.1.5 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.4...@01s-11comm/admin@6.1.5)

### 📖 Documentation

- **admin,type:** 补充 relizy provider-release 踩坑记录与 type 包版本发布说明 ([afdd8664](https://github.com/ruan-cat/11comm/commit/afdd8664))
  - admin: 探索报告新增 --yes 参数不兼容的踩坑记录和 provider-release 参数列表
  - type: README 新增版本发布章节，说明独立版本管理和 GitHub Release 生成方式
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/admin@6.1.4 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.3...@01s-11comm/admin@6.1.4)

### 🔧 更新配置

- **ci:** 将 release workflow 的 GitHub Release 生成工具从 changelogithub 切换为 relizy provider-release ([f1a0b2eb](https://github.com/ruan-cat/11comm/commit/f1a0b2eb))

  changelogithub 底层 changelogen 在 git log tag1...tag2 时无法解析含 @ 的
  scoped tag（如 @01s-11comm/admin@6.1.3），会产生 fatal: ambiguous argument。
  改用 relizy 自带的 provider-release 子命令，天然支持 monorepo 子包 tag 格式。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/admin@6.1.3 (2026-04-09)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.2...@01s-11comm/admin@6.1.3)

### 📖 Documentation

- **admin:** 更新杂项提示词中 relizy 相关条目状态 ([4750da1e](https://github.com/ruan-cat/11comm/commit/4750da1e))
  - 037：标记已完成并记录 Windows 下 relizy 路径识别问题的结论
  - 038：补充待 PR 合并后再优化 relizy 脚本的 TODO 说明
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **admin:** 设计登录页 vue-bits 动态背景提示词任务 ([6e5f43fb](https://github.com/ruan-cat/11comm/commit/6e5f43fb))
  - 新增 login/index.md：001 任务步骤（PlasmaWaveBackground、接入主题切换与浏览器验证）
  - 新增 2026-3-27-use-vue-bits-background/from-chatgpt.md：落地方案与组件设计备忘
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **type:** 补全 `@01s-11comm/type` README 说明文档 ([01c1eed6](https://github.com/ruan-cat/11comm/commit/01c1eed6))

  将占位说明扩展为可执行的类型项目指南：包定位与同构 SSOT、`exports` 子路径、目录与业务域、Trinity Pattern 摘要、导出/导入规范（含禁止 `@/` 与跨包相对路径）、Drizzle Kit 与 `apps/admin` 的配置关系及常用命令，并附 FAQ 与项目内技能索引。
  此次变更仅为文档，不涉及对外 API 或运行时行为的破坏性调整。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **admin:** 将全栈前端简历文档从 reports 移至 resume 目录 ([891702f2](https://github.com/ruan-cat/11comm/commit/891702f2))

  将 `2026-03-03-frontend-fullstack-resume.md` 归入 `src/docs/resume`，与报告类文档分区存放，便于维护与检索。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/admin@6.1.2 (2026-03-26)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.1...@01s-11comm/admin@6.1.2)

### 📖 Documentation

- **admin:** 同步 relizy 独立发版报告中的标准命令 ([c573b4cc](https://github.com/ruan-cat/11comm/commit/c573b4cc))

  使破坏性变更说明与当前 release 脚本一致，并链到根 README 中关于 --yes 的说明。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

- **relizy:** 同步 relizy 独立发版报告与 Windows 路径 issue 说明 ([13687d74](https://github.com/ruan-cat/11comm/commit/13687d74))
  - 将「待整合到通用工具包」类 TODO 标记为已合并状态
  - 在 Windows path / body filter issue 中补充通用文档应写明的两点结论（runner 职责边界与排错优先级）
    Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @01s-11comm/admin@6.1.1 (2026-03-25)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.1.0...@01s-11comm/admin@6.1.1)

No relevant changes for this release

## @01s-11comm/admin@6.1.0 (2026-03-25)

[compare changes](https://github.com/ruan-cat/11comm/compare/@01s-11comm/admin@6.0.0...@01s-11comm/admin@6.1.0)

### ✨ 新增功能

- **admin:** 重做登录页动效、背景与主题过渡 ([2ac3bc28](https://github.com/ruan-cat/11comm/commit/2ac3bc28))

  接入 motion-v 入场动效；极光流光与背景渐变流动；明暗主题双图层交叉淡入淡出；
  simple 布局改用 100% 宽度避免横向滚动；登录区靠右栅格；光斑与 motion 的 transform 解耦以恢复漂移动画；
  第三方登录枚举改为 titleKey 与运行时 t() 解析。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### 🐞 修复缺陷

- **admin:** 列表与弹窗深拷贝改用 cloneDeep 替代 structuredClone ([e214aa2c](https://github.com/ruan-cat/11comm/commit/e214aa2c))

  structuredClone 在 Vue reactive/proxy 场景下不稳定，易导致弹窗与搜索重置异常。
  统一使用 @pureadmin/utils 的 cloneDeep，并补全相关 import。
  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### 📖 Documentation

- **admin:** 标记杂项提示词 036 structuredClone 迁移为已完成 ([ba4ddce7](https://github.com/ruan-cat/11comm/commit/ba4ddce7))

  Co-authored-by: Cursor <199161495+cursoragent@users.noreply.github.com>

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

### ✔️ Refactor

- Refactor the icon module, use `@iconify/json` to replace the `@iconify-icons/*` dependency that is no longer maintained and updated, optimize the user experience, ensure that the icon library can be continuously updated and support `Tree-shaking`
- Upgrade `tailwindcss` to `v4` version, bringing faster build speed, simpler installation and configuration, and providing a dedicated `vite` plug-in

### 🎫 Feat

- Add `Ai` chat component example
- Add `tagOnClick` tag to switch global public events
- Add code editor example
- Add `Markdown` example
- Add slider example

### 🐞 Bug fixes

- Fix `aria-hidden` error
- Fix the problem that code hints cannot be displayed when using `this` syntax and update `pinia` related syntax

### 🍏 Perf

- Fix broken links in the waterfall infinite scrolling example
- Update `vue-flow`, related compatibility processing
- Delete the deprecated dependency package `eslint-define-config`, upgrade `eslint` to the latest version, related compatibility processing
- Optimize `src/style/dark.scss` syntax
- Optimize login parameter transfer
- Use `keydown` to replace `keypress`, the `keypress` event has been deprecated

# 5.9.0 (2024-12-10)

### ✔️Refactor

- Upgrade `vite` to `v6` version, upgrade `sass` to the latest version, reconstruct the theme writing method, and deprecate [@pureadmin/theme](https://www.npmjs.com/package/@pureadmin/theme) , click to view [Related optimization point details](https://github.com/pure-admin/vue-pure-admin/pull/1188#issue-2630095115). For users who have the [Max version](https://pure-admin.cn/pages/max/), it is strongly recommended to upgrade. Subsequent Max version users will enjoy a more modern, beautiful and highly customized theme color
- Use [code-inspector-plugin](https://www.npmjs.com/package/code-inspector-plugin) to replace [vite-plugin-vue-inspector](https://www.npmjs.com/package/vite-plugin-vue-inspector)

### 🎫Feat

- Added `ReDrawer` component
- `pure-table` adds dynamic table header example

### 🐞 Bug fixes

- Fixed an issue where the height of the table does not automatically adapt when the full screen function is enabled or disabled after the table is expanded in the menu and department management

### 🍏Perf

- Optimize the layout of the department tree on the left side of user management

# 5.8.0 (2024-08-19)

### 🎫 Feat

- Added a second button permission command (judged based on the `permissions` field returned by the login interface)
- Functional pop-up box `ReDialog` adds whether to enable the `loading` loading animation function after clicking the confirmation button
- `PureTableBar` component adds full screen and exit full screen functions
- `VxeTableBar` component adds full screen and exit full screen functions
- The OK button of the `ReDialog` component provides the close button animation `closeLoading` function
- Add development environment code debugging `vite-plugin-vue-inspector` plug-in to improve development experience
- Added `vite-plugin-checker` plugin for stricter type and `eslint` verification

### 🐞 Bug fixes

- Fixed the problem that the current tab cannot be closed after configuring the routing attribute `fixedTag` to `false`
- Fixed the issue where `logo` cannot be hidden in top menu mode

### 🍏 Perf

- Optimize type hints for custom instructions
- Optimize the press enter login function on the login page
- Optimize the mask level of the left menu on the mobile side
- Optimize system management-permission function style of role management
- Upgraded dependencies, compatible with the latest version of `element-plus`

# 5.7.0 (2024-06-04)

### 🎫 Feat

- Add Google style tabs

### 🐞 Bug fixes

- Fixed the issue where the text exceeds and is not hidden after the menu is folded in Firefox browser

# 5.6.0 (2024-05-14)

### ✔️ Refactor

- Upgrade `pnpm` to `v9` version, requiring `pnpm` version `>=9`

### 🐞 Bug fixes

- Fixed the issue where clicking on an external link would jump twice

### 🍏 Perf

- Optimize `ReSegmented` component

# 5.5.0 (2024-05-07)

### 📄 Docs

The addresses of the document site and full version preview site have been changed!

- The latest document site address: https://pure-admin.cn
- The latest full version preview site address: https://pure-admin.github.io/vue-pure-admin

### ✔️ Refactor

- Reconstruct the `layout` file naming convention to make it more readable

### 🎫 Feat

- Add new component `ReVxeTableBar` to be used with `vxe-table`

### 🐞 Bug fixes

- Fixed the issue where the background color is white when `FixedHeader` is set to `false` in dark mode
- Fixed the problem of delayed closing of functional pop-up window `ReDialog` when clicking the cancel button

### 🍏 Perf

- Optimize account settings-avatar upload function

# 5.4.0 (2024-04-18)

### 🎫 Feat

- Add global disabled attribute `disabled` to `ReSegmented` component
- Added mind map examples
- Functional pop-up box `ReDialog` adds `Popconfirm` bubble confirmation box
- `pure-table` adds `headerSlot` custom header slot usage example
- The route adds a configurable `fixedTag` attribute, which determines whether the current menu name is fixedly displayed on the tab and cannot be closed.
- Added account setting function page and compatible with mobile terminals
- Upgrade `eslint9` and related compatibility processing
- Added global configuration `MaxTagsLevel` property to set the maximum number of open tabs
- Full coverage of the internationalization of the core code of the framework (only the internationalization of the business code needs to be processed)

### 🐞 Bug fixes

- Fixed the issue where columns cannot be dragged normally when there are multiple `RePureTableBar` components on a page
- Fixed the problem of icon display style after the third-level menu is folded to the left
- Fixed the issue where the font color does not take effect after refreshing the account settings page
- Fixed the issue where the `refreshToken` parameter is empty when calling the refresh `token` interface

### 🍏 Perf

- Optimize login interface
- Optimize the logic of obtaining the top menu
- Optimize request whitelist logic and be compatible with more scenarios
- Simplified export and import usage in `store` files
- Removed unnecessary `cloc` tool dependency package, which uses the `GPL` open source license and is controversial
- Optimize the types of `post` and `get` utility functions in `src/utils/http` files

# 5.3.0 (2024-03-28)

### ✔️ Refactor

- Reconstruct internationalized file naming conventions and demo pages with code location hints

### 🎫 Feat

- Add `MQTT` example
- Added `docx` and `excel` file preview examples
- The `ReSegmented` segmented controller has a new `size` attribute, which can set three sizes
- The `RePureTableBar` component and `pure-admin-table` support international switching of table headers

# 5.2.0 (2024-03-22)

### ✔️ Refactor

- Place the full screen button at the top to make it visible and easy to operate

### 🎫 Feat

- Added `v-ripple` command (water ripple effect)
- Add global `Stretch` configuration to the content area to customize compact pages and easily find the required information
- Added roaming guidance based on `ElTour`
- Improve role management-menu permission function, novel interactive experience
- Add system monitoring-online users
- Add system monitoring-login log
- Add system monitoring-operation log
- Add system monitoring-system log
- Add more more convenient `pure-admin-table` editable table examples (overall editing, single row editing, cell editing)
- The `ReSegmented` component has a new `block` attribute to make it fit the width of the parent element
- Add [vue-flow](https://vueflow.dev/) flow chart example
- Add virtual table example
- Added Gantt chart example
- Add graphic verification code example
- Add form examples, which can be generated through `JSON` format configuration (basic form, pop-up form, drawer form, step-by-step form, search form)
- Add a folding and expanding menu function on the middle right side of the left menu

### 🐞 Bug fixes

- Fixed the scroll bar issue when clicking on the registration page under `windwos`
- Fixed the problem of scroll bars appearing in the content area when switching pages under `windows`
- Fixed the problem of status style disappearing in `pure-table` with status table under dark overall style
- Fixed the problem of turning on the gray mode and dark overall style in the project configuration and refreshing the overall style of the page.

### 🍏 Perf

- All pages of system management and system monitoring are compatible with mobile terminals

# 5.1.0 (2024-03-02)

### ✔️ Refactor

- Reconstruct the tab page `UI` to make it more convenient to click the close button

### 🎫 Feat

- Added multi-select card example
- The menu supports all browser behaviors of right-clicking on the `a` tag (opening links in new tabs, new windows, dragging and dropping to open in new tabs, etc.)
- Added search history and collection functions to menu search

### 🐞 Bug fixes

- Fixed the problem of scroll bars appearing on the login page under `windows` system

### 🍏 Perf

- Standardize the naming rules when registering local icons to better match the icon selector

# 5.0.0 (2024-02-26)

Totally `ESM` version

### ✔️ Refactor

- Upgrade `vite` to `v5` version, specify `node` version `>18.18.0`, `pnpm` version `>=8.6.10`
- Use [vite-plugin-fake-server](https://www.npmjs.com/package/vite-plugin-fake-server) to replace [vite-plugin-mock](https://www.npmjs.com/package/vite-plugin-mock), use [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) to replace [mockjs](https://www.npmjs.com/package/mockjs)
- Rename `tailwind.config.js` to `tailwind.config.ts` and update its file to `esm` syntax
- Updated `.prettierrc.js` file to `esm` syntax
- Updated `postcss.config.js` file to `esm` syntax
- Updated `commitlint.config.js` file to `esm` syntax
- Use `eslint.config.js` to replace `.eslintrc.js` and follow `esm` syntax
- Upgrade `stylelint` to `16` version and follow `esm` syntax
- All `search` search icons are uniformly replaced with `@iconify-icons/ri/search-line` which is more commonly used and put into the global offline icon
- Removed the filter effect of `iframe` in dark mode
- Bring a more beautiful and refined homepage
- Cleaner and neater pop-up panel on the right side of project configuration
- Restructure the About page to make it more compact and key information more prominent

### 🎫 Feat

- Add system management-menu management
- Improve system management-user management
- Embedded `iframe` pages support setting `keepAlive` to maintain page status
- Optimized navigation, the pop-up menu is adaptive and scrollable beyond the content area
- Added file upload example
- Added overall style adaptive operating system light, dark, and automatic theme functions
- Add footer
- Supports multi-tab pages to open systems that have already been logged in without logging in again and adds an internal login-free function (users can choose the number of days without login)
- Terminal command line that brings a high-level feel
- Add audio visualization function example
- Added video frame interception - `WebAssembly` version, supports `MP4`, `MOV`, `AVI`, `WebM`, `MKV` and other mainstream formats
- Added methods to block keyboard `F12`, browser default right-click menu, page element selection, and picture default draggability
- The secondary package `localforage` supports setting expiration time and provides complete type prompts
- Add `AnimateCss` selector component `ReAnimateSelector`
- Added `ReText` component, supports automatic omission and display of `Tooltip` function, supports multi-line omission, high reusability
- Add an art drawing board function, which can be used to draw some design idea architecture diagrams, for example
- New component - optional button example
- Add common button examples
- Added color picker component example
- Add date picker component example
- Added datetime picker example
- Added time selector example
- Added statistics component example
- Add label component example
- Added accordion panel component example
- Add progress bar component example
- Upgrade `Swiper 11`
- Add [vite-plugin-router-warn](https://www.npmjs.com/package/vite-plugin-router-warn) plug-in to eliminate unnecessary `vue-router` dynamic routing warning`No match found for location with path`

### 🐞 Bug fixes

- Fixed the problem that in `query` routing parameter passing mode, two `router` jumps will be triggered when clicking the tab page to switch operations.
- Fixed an issue in card tab mode, when passing parameters through the `query` route, the `card-active` attribute still exists after leaving the active tab, resulting in the font color not changing when the mouse `hover`
- Fixed the error in reading and parsing the same name in the `src/layout/components/appMain.vue` file
- Fixed the issue where the height of the embedded page `frameView` does not adapt after hiding the tab page.
- Fixed the problem of invalid routing `meta.transition.name` configuration
- Fixed the problem that the right-click tab page panel cannot be closed when clicking on the `iframe` page and the right-click tab page panel is blocked when on the `iframe` page
- Fixed the problem of missing parameters when clicking on breadcrumbs to jump to the page in routing `query` and `params` modes

### 🍏 Perf

- Optimize theme color
- Tabs can be slid left or right according to the sliding force
- The interface naming rules are unified into `kebab-case` string naming method
- The `label` of `el-form` is consistent with the global `label` style
- `VITE_PUBLIC_PATH` defaults to `/`, which is more friendly to `VITE_ROUTER_HISTORY` in `h5` mode
- Optimize the `transformI18n` function and support unlimited nesting levels for internationalization (of course, the platform still recommends that the fewer nesting levels, the better)
- When initializing the page, load `pinia` first and then `router`, which is compatible with more usage scenarios.
- Optimize the judgment logic of request whitelist
- The navigation style of the left menu has been adjusted to optimize the different display methods on PC and mobile when there is no logo.
- Upgrade code specification style related libraries to the latest
- Optimize login page `loading` judgment
- Optimize the `IconSelect` icon selector component to improve user experience
- Optimize the segmented controller component and add `v-model` support
- Optimize the method of obtaining platform `logo`
- Upgraded `@pureadmin/theme`, bringing more friendly `esm` support
- Optimize some functions in the `build/info.ts` file to make it friendly and support `esm`
- Optimize the column setting pop-up box of the `PureTableBar` component, set the maximum height, and scroll beyond it
- Optimize the functional pop-up component `ReDialog` to retain the closing animation
- Test the Chinese path and delete the `sass-loader` dependency
- The packaged code is changed to the browser that natively supports [ES2015](https://caniuse.com/es6) by default
- Remove the `stylelint` plug-in dependency that will be automatically installed
- Enhance the way `useRenderIcon` uses local `svg`
- Optimize the style of the expand and collapse buttons in the lower left corner of the left menu under the bright white theme color scheme
- Optimize all `description` contents of `el-empty`. Add `el-empty` when the icon selector content is empty
- The `tooltip` theme after the left menu is collapsed is consistent with the overall menu
- Update `svgo` command to `svgo -f . -r` (compress all `SVG` files in the current directory)
- Optimize project construction related functions
- Enhanced `ReTypeit` component to support slots and all `typeit` configuration items
- Optimize internationalization-related processing logic and add cache during initialization to avoid unnecessary performance consumption

# 4.5.0 (2023-06-26)

### ✔️ Refactor

- Refactor image crop `ReCropper` component, add more useful functions

### 🎫 Feat

- The menu search function supports pinyin search, such as searching for image cropping, input `tp` or `tupian` and other corresponding pinyin
- Add long press command and usage example, the long press command supports continuous callback of custom duration
- Add an example of sensitive word filtering function
- Add an example of Chinese Pinyin function

### 🐞 Bug fixes

- Fixed `V4.4.0` version, the problem that the page does not cache the page for the first time after the `keepAlive` cache is enabled
- Fixed the issue that the column setting tick option was not correctly initialized according to the `hide` property when the `RePureTableBar` component was initialized

### 🍏 Perf

- Change `VITE_PUBLIC_PATH` to `./` by default to be compatible with more path scenarios,
- Compatible with the `OSS` scene where `VITE_PUBLIC_PATH` is `url`, need to upgrade `@pureadin/theme` to the latest version

# 4.4.0 (2023-06-14)

### 🎫 Feat

- Route `meta` adds `activePath` attribute, which can activate a menu (mainly used for routes that pass parameters through `query` or `params`, when they are not displayed in the menu after configuring `showLink: false`, they will be There will be no menu highlighting, but you can get highlighting by setting `activePath` to specify the active menu, `activePath` is the `path` of the specified active menu [View details](https://github.com/pure-admin/vue-pure-admin/commit/58cafbc73ffa27253446ee93077e1e382519ce8a#commitcomment-117834411))
- Example of advanced usage of `pure-admin-table` to add adaptive content area height
- Add anti-shake, throttling and text copy instructions and standardize the prompts when custom instructions are used incorrectly and add usage examples
- Add `el-empty` component when the `notice` message prompts the component to have empty data
- Example code of functional popup window adding subcomponent `prop` as `primitive` type example
- Add `vscode-docker` plugin

### 🐞 Bug fixes

- Fix internationalization switch to English mode and refresh will return to Chinese mode
- Fixed the problem that the pop-up mask of the search menu function did not cover the left menu

### 🍏 Perf

- Page switching performance optimization, regardless of the network, the speed of page switching logic is almost `3-4` times faster than before [View optimization details](https://github.com/pure-admin/vue-pure-admin/pull/600#issuecomment-1586094078)
- Optimized tab page operation-routing parameter transfer mode usage
- All tables in the system management are changed to adaptive content area height, need to upgrade `@pureadmin/table` to the latest version
- Use the `useResizeObserver` function of `vueuse` to replace the `v-resize` custom directive, and the performance will be better from the performance after testing
- For unbound public events, unbind when the page is destroyed

# 4.3.0 (2023-06-04)

### 🎫 Feat

- Add `docker` support
- Add project version real-time update detection function
- Improve system management - role management page
- Waterfall component adds infinite scrolling
- Add `updateDialog` to the functional bullet box to change the property value of the bullet box itself
- `wangeditor` rich text add multiple rich text and custom image upload examples
- Advanced usage of `pure-table` table added keep checked `CheckBox` option example
- Added `title` slot to `RePureTableBar` component

### 🐞 Bug fixes

- Fixed the problem that the countdown to obtain the verification code will be disabled with a delay of `1s`
- Fixed the problem that the icon selector did not initialize the preview correctly
- Fixed dynamic routing redirection causing duplicate content on tabs
- Fix the problem that the `getTopMenu()` function cannot get `path` and report an error when the page is forced to refresh
- Fix the problem that the left menu does not display as a whole due to the sudden pull up after the left menu is folded
- Fixed `RePureTableBar` scrollbar issue in `windows` after turning off column settings

### 🍏 Perf

-Optimized tab page operation-routing parameter transfer mode usage

- Optimize menu search function and style
- Update `vscode` code snippets
- Optimize the initialization call timing of `dataThemeChange` theme setting

# 4.2.0 (2023-05-15)

### 🎫 Feat

- Added segment controller component and adapted to dark mode
- Static routing supports configuration array format
- Functional bullet box component adds full screen and exit full screen operation buttons
- New component - Waterfall `demo`
- Add `Exclusive` type mutual exclusion syntactic sugar

### 🍏 Perf

- Standardize the way of writing routes in `template` template, no longer use `$route` and `$router`, this way of writing `vue-tsc` fails to compile

# 4.1.0 (2023-05-12)

### 🎫 Feat

- Add a `demo` example combined with `Form` for the functional pop-up box component
- wrapper `el-col` component of `element-plus`
- Add `beforeCancel` and `beforeSure` callbacks to the functional popup component, which can suspend the closing of the popup
- Improve `System Management-Department Management` page
- Optimize `PureTableBar` component, add drag and drop function for column display

### 🐞 Bug fixes

- Fix the problem that the page cache still exists when you click the tab to reload after turning on `keepAlive`
- Fix the problem that the left menu will flicker after refreshing the tab in the mixed mode menu

### 🍏 Perf

- Optimize home page layout
- Dependency update to `vue3.3+` and remove `unplugin-vue-define-options` plugin

# 4.0.0 (2023-05-09)

[View 4.0.0 version optimization details](https://github.com/pure-admin/vue-pure-admin/issues/428#issuecomment-1422191158)

### ✔️ Refactor

- Use `css` pseudo-class `before` to refactor the activation background of the menu, similar to [ant.design-menu](https://ant.design/components/menu-cn#components-menu-demo-inline-collapsed)

### 🎫 Feat

- Optimize the extra icon on the right side of the menu name to support more icon rendering modes
- Configurable home menu display and hide
- Promote the namespace of the local reactive store into the global configuration
- Added functional popup components and `demo` examples, making it easier to use
- `PureTableBar` component adds column display function

### 🐞 Bug fixes

- Fixed the `echarts` chart on the home page not adapting to the container when the menu is collapsed or expanded
- Fixed the problem that when there is only one submenu, the search function cannot find the submenu
- Fix the problem that the global configuration `Theme` is empty cache for `light` and re-login theme configuration does not take effect
- Fixed the problem that the search boxes were not automatically gathered after the menu search function pop-up box was opened
- Fixed the problem of toolbar button text display after pressing `ESC` to exit full screen
- Fix the problem of `tooltip` click penetration in the notification bar of the mobile terminal
- Fixed the problem that the text is not displayed when switching to `horizontal` navigation mode after the left menu is collapsed
- Fixed the problem that the status cannot be reset when closing other tabs when navigating `tab`
- Fix the page hot update error caused by uninitialized environment variables in the `getHistoryMode` function
- Fixed too many `tabs` in the navigation, which caused the tabs on the left to be closed and could not be displayed normally
- Fixed the problem of full-screen error reporting when clicking on the content area
- Fixed the problem that the left navigation bar is always loading after opening `showLink:false` page under hybrid navigation and refreshing
- Fixed the left navigation memory overflow problem caused by calling `initRouter` function in mixed mode navigation
- Fixed the problem that the cached page was not destroyed when closing the left, right, other, and all tab operations
- Fix the problem that the route passes parameters through `query` or `params`, and the cache invalidation problem occurs when the tab page is closed after the cache is enabled
- Fixed the problem that the breadcrumbs could not find the parent path in the `params` route parameter passing mode

### 🍏 Perf

- Optimize `buttons` named slot of `RePureTableBar` component
- Optimize navigation style and menu collapse animation
- Optimize the extra icon on the right side of the menu name to support more icon rendering modes
- Optimize `logo` image and text layout and unified configuration
- After the routing information `showLink` is set to `false`, the current routing information will not be added to the tab
- Export `addPathMatch` function
- All `getters` in `pinia` are changed to the official recommended way of writing, and `this` is changed to `state` to automatically deduce the type
- Adapt to the `api` of the latest version of `pure-table`
- Ignore `deprecation` warnings for `sourcemap-codec` and `stable` dependencies
- Remove `"incremental": true` from `tsconfig.json` file
- Update `stylelint` and related configurations to the latest, strengthen style validation
- Breadcrumbs are removed from the homepage, and are displayed according to the selected menu. The homepage is no longer fixed in the breadcrumbs, and the routing monitoring of the breadcrumbs page is optimized

# 3.9.7 (2022-12-26)

### 🍏 Perf

- Use `path.posix.resolve` instead of `path.resolve` to avoid drive letter problems when using `electron` in `windows` environment
- By default, the `CachingAsyncRoutes` dynamic routing cache is turned off locally, making it easier to debug in the development environment. It is not necessary to clear the local cached dynamic routing every time you modify the dynamic routing. It is recommended to enable it in the production environment

# 3.9.6 (2022-12-19)

### 🎫 Chores

- Upgrade `vite4` version

### 🐞 Bug fixes

- Fix the problem that `hmr` of `vite` is slow due to the wrong way of importing `tailwind.css`

### 🍏 Perf

- Update [@pureadmin/theme](https://github.com/pure-admin/pure-admin-theme) to the latest version, bringing more friendly type hints
- Optimize [PureTableBar](https://github.com/pure-admin/vue-pure-admin/tree/main/src/components/RePureTableBar) component
- Optimize the business code of the system management page to bring better code reference

# 3.9.5 (2022-12-13)

### ✔️ Refactor

- completely removed `lodash` and its related libraries
  [Click here to see Why Removed? How to integrate it yourself?](https://pure-admin.cn/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-5-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-lodash-%E5%92%8C%E5%85%B6%E7%9B%B8%E5%85%B3%E5%BA%93-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- Add `@pureadmin/table` table dynamic column example

### 🐞 Bug fixes

- Fix dynamic route `rank` issue
- Fix dark theme styling issues

### 🍏 Perf

- optimize the route `rank`, when `rank` does not exist, it will be created automatically according to the order, the home page route will always be the first

# 3.9.4 (2022-12-05)

### ✔️ Refactor

- Completely removed `vxe-table`, after removal, the overall package size of the full version is reduced by `1.82MB`, and the initial startup time is basically the same as the lite version 🐮
  [Click here to see Why Removed? How to integrate it yourself?](https://pure-admin.cn/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-4-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-vxe-table-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- Add `@pureadmin/table` table selector (single select, multiple select) example

# 3.9.3 (2022-12-04)

### 🎫 Feat

- Add `@pureadmin/table` pagination and loading animation example

### 🐞 Bug fixes

- Fixed the problem that the refresh page would be blank due to changes in dynamic routes stored in local storage after enabling `CachingAsyncRoutes`
- Fixed `Tooltip` displayed abnormally after the menu is collapsed

### 🍏 Perf

- Expand the use of local icons, the first launch of the full version reduces `13` requests again
- When the menu loading is slow, add `loading` animation to optimize user experience
- Theme initialization is placed in `onBeforeMount` to avoid flashing of the initialization page

# 3.9.2 (2022-12-03)

### 🍏 Perf

- Global coverage of `el-dialog`, `el-drawer`, `el-message-box`, `el-notification` components of `element-plus`The style of the close icon in the upper right corner makes it more vivid [specific modification Code record](https://github.com/pure-admin/vue-pure-admin/commit/c80818d792276666aaea4b18413a0f08777f2ed1)
- The packaging output information is compatible with different packaging output paths
- Optimize some animations

# 3.9.1 (2022-12-02)

### 🎫 Feat

- Add `CachingAsyncRoutes` whether to enable dynamic route cache local global configuration, default `true`
- Add `TooltipEffect` global configuration, you can configure the `effect` attribute of all `el-tooltip` on the platform body, the default `light`, does not affect the business code
- Add directory, menu text exceeds display `Tooltip` text prompt demo

### 🍏 Perf

- Optimize `initRouter` method, compatible with `sso` scenario
- Breadcrumb animation style optimization

# 3.9.0 (2022-11-30)

### 🐞 Bug fixes

- Fixed the jitter problem caused by the scroll bar on the page when the text is too long when exiting the full screen
- Fix some type errors

### 🍏 Perf

- perf: Great optimization of the first screen loading. Compared with the version before `3.9.0`, the first screen requests are reduced by `71`, and the first screen loading resources are reduced by `4.1 MB`

# 3.8.7 (2022-11-28)

### 🍏 Perf

- perf: Great package optimization, please be sure to upgrade! Use `unplugin-vue-define-options` to replace `unplugin-vue-macros`, the packaging speed is increased several times, use `unplugin-vue-macros` to take `mac` with moderate performance as an example, the packaging time of the full version is`6` minutes😭, after replacing it with `unplugin-vue-define-options`, the packaging time on the same computer is `50` seconds☺️

# 3.8.6 (2022-11-27)

### 🎫 Feat

- Add `message` message prompt function, compatible with `Element Plus` and `Ant ​​Design` two `Message` style styles, use and package size are extremely low cost and adapt to dark mode, really fragrant 😂

### 🍏 Perf

- perf: No need to install `@vue/runtime-core`, compatible with `volar` hints of all `element-plus` components

# 3.8.5 (2022-11-26)

### 🍏 Perf

- Great optimization, remove `@pureadmin/components` and use compatible writing, the package size of the platform is reduced by `0.4` MB before compression is not enabled, and the resource of `2.3` MB is reduced for the first screen request, which is for the [lite version](https://github.com/pure-admin/pure-admin-thin) is a very big optimization, the streamlined version has synchronized code

# 3.8.0 (2022-11-26)

### 🎫 Feat

- Add `@pureadmin/table` multiple data format (deep structure) examples
- Add `@pureadmin/table` image preview example
- Add `@pureadmin/table` row and column drag example
- Add `@pureadmin/table` context menu example
- Add `@pureadmin/table` export `Excel` example
- Add `@pureadmin/table` edit cell example
- Add `@pureadmin/table` watermark example
- Add `@pureadmin/table` print example
- Add `@pureadmin/table` embedded `echarts` chart example
- Add `svgo` to compress all `svg` files on the platform to reduce the size

### 🍏 Perf

- The static routing platform automatically imports without manual import
- Improved global type hints
- Optimize `vite` to rely on pre-built configurations in the platform, and the loading speed of page switching is significantly accelerated

# 3.7.1 (2022-11-22)

### 🔥 hotfix

- Fixed the problem that the tab page may not be reset when logging out when the tab page cache is not turned on

# 3.7.0 (2022-11-21)

### ✔️ Refactor

- Replace `driver.js` with `intro.js`

### 🎫 Feat

- Add front-end single sign-on, test address https://pure-admin.github.io/vue-pure-admin/#/pure-table/index?username=sso&roles=admin&accessToken=eyJhbGciOiJIUzUxMiJ9.admin
- Add more examples for [@pureadmin/table](https://github.com/pure-admin/pure-admin-table) and `element-plus` [table](https://element-plus.org /zh-CN/component/table.html) example remains the same
- Rich watermark function page (supports customizing various colors, shadows, text, additional attributes, setting undeletable watermarks and setting watermarks for specified elements)
- Optimize the menu, add `MenuArrowIconNoTransition` global configuration, configure it in `public/platform-config.json`, for the left menu mode, the menu expansion can be set `MenuArrowIconNoTransition: true` to solve
- Replacement form designer component demo

### 🐞 Bug fixes

- Repair the in-page menu with parameters to jump to each other, the label is not selected and highlighted

### 🍏 Perf

- Removed deprecated `$baseUrl`
- Compatible importing a certain library leads to `global is not defined` error, importing `src/utils/globalPolyfills.ts` file into `src/main.ts` can solve the problem
- Remove `@vitejs/plugin-legacy`, `vue3` cannot make it support `ie` through any tool

# 3.6.4 (2022-11-10)

### 🎫 Feat

- Menu icon `icon` supports using online icons

### 🐞 Bug fixes

- Fixed `vxe-button` font color issue after mouse overlay and some other style issues

### 🍏 Perf

- Optimize the routing guard, if you have logged in and there is login information, you cannot jump to the routing whitelist, but continue to stay on the current page
- Removed `baseURL` and global environment proxy, and can be written directly in `vite.config.ts`, which is convenient and supports multiple proxy addresses

# 3.6.3 (2022-11-01)

### 🎫 Feat

- Static resource classification and packaging
- Add danmaku component `demo`

### 🐞 Bug fixes

- Fix the `collapse` property added in the latest version of `tailwindcss` conflicts with the platform `class` class name
- Fix that when the `token` expires, if the page has multiple requests, the `token` will be refreshed repeatedly

# 3.6.2 (2022-10-27)

### ✔️ Refactor

- Replace `/@/` alias with `@/` alias

# 3.6.1 (2022-10-27)

### 🎫 Feat

- Add whether to start `cdn` for packaging to replace the local library configuration, the default `false` does not start
- Added optional `gzip` and `brotli` compression modes for packaging builds

### 🐞 Bug fixes

- Fix `title` too long display style problem
- Fix the parent `name` in the route should not be repeated with the child `name`, which will cause redirection to jump `404` problem

### 🍏 Perf

- Upgrade `axios` to the latest version

# 3.6.0 (2022-10-25)

### 🎫 Feat

- Add file download `demo`
- Add typewriter component `demo`
- Added `json` editor `demo`

### ✔️ Refactor

- Refactor the permission module, adopt the most commonly used `RBAC` (Role-Based Access List): role-based permission control (User -> Role -> Permission), and update the page permission and button permission `demo` example, button Permissions support three operation modes (judging permissions in component mode, judging permissions in function mode, and judging permissions in instruction mode)

### 🐞 Bug fixes

- Fixed the theme not being emptied when clearing the cache and returning to the login page
- Fix `menu` display problem in production environment in `horizontal` mode
- Fixed the problem that the `mix` mixed mode navigation might not be displayed in the left menu of the production environment
- After the `token` expires, calling the refresh `token` interface will cause an infinite loop

### 🍏 Perf

- Removed uncommon `@apply` from `tailwind.css`
- Replace `//` comments with `/** */`, which is more friendly to the editor's intellisense
- Optimize the login enter event
- Simplified some functions, eliminated useless functions, and optimized page loading speed

# 3.5.0 (2022-9-10)

### 🎫 Feat

- Add `cssnano` to compress the size of `css` when packaging
- Add `element-plus` seamless scrolling `Table` page demo
- Open `vscode` bracket pair guide

### ✔️ Refactor

- Replace `unocss` with `tailwindcss`, add `tailwindcss` [documentation](https://pure-admin.cn/pages/tailwindcss/)

### 🐞 Bug fixes

- `token` expires, refresh the infinite loop

### 🍏 Perf

- When resetting the route, clear the cached page

# 3.4.6 (2022-8-23)

### 🐞 Bug fixes

- `process` is not defined in path
- Fixed an error when dynamic routing `children` is an empty array
- Fixed `iframe` loading failure

# 3.4.5 (2022-8-22)

### 🐞 Bug fixes

- Fix local responsive storage object setting issue

# 3.4.0 (2022-8-22)

### 🍏 Perf

- Optimized routing
- Optimized for mobile compatibility
- Optimized routing parameters (`query`, `params` way to refresh the page does not need to open the tab page cache, the parameters can be retained on the `url` and `tab page`)

# 3.3.5 (2022-8-19)

### 🎫 Feat

- Secondary encapsulation of `Table` of `element-plus` into [@pureadmin/table](https://github.com/pure-admin/pure-admin-table), providing flexible configuration items and integrating into the platform
- Secondary encapsulation of `Descriptions` of `element-plus` into [@pureadmin/descriptions](https://github.com/pure-admin/pure-admin-descriptions), providing flexible configuration items and integrating into the platform
- Centralize most of the tools and hooks of the platform to [@pureadmin/utils](https://pure-admin-utils.netlify.app), and delete the code concentrated in this library to reduce the size of the platform
- Add [unplugin-vue-define-options](https://www.npmjs.com/package/unplugin-vue-define-options) plugin, the page can directly write `defineOptions({name: custom name})`
- Add project files, language analysis tool [cloc](https://www.npmjs.com/package/cloc)
- Added landing page internationalization
- Add full routing configuration table type declaration
- Add virtual listing page demo
- Add `PDF` preview page demo
- Added export `excel` page demo
- Added blank page demo without `Layout`

### ✔️ Refactor

- Refactored the theme color to adapt to `element-plus` dark mode (also solved the problem that the same element `css` in `3.3.0` and earlier versions was overwritten many times, resulting in poor style debugging)
- Refactored route reset function

### 🍏 Perf

- The compatible project storage directory is named in Chinese, but we really do not recommend Chinese naming, because a library may not escape the Chinese path, causing the project to crash
- Optimized interface type

### 🐞 Bug fixes

- Fixed async routes with `showlink` set to `false`, not showing after refresh
- Fixed vertical navigation menu text being hidden after collapse when there is no `icon`

# 3.3.0 (2022-5-11)

### 🎫 Feat

- Add user management page demo
- Add role management page demo
- Add department management page demo
- Add card list page demo
- Integrated form designer
- Added `PPT` demo
- Added anti-shake interception demo in the function menu
- Upgrade `wangeditorV5` (and support internationalization and custom themes)
- Integrate `tauri` version
- Added barcode function
- Added QR code function
- Use the `Cascader` cascade selector in `element-plus` to write a three-level and two-level linkage demo of Chinese provinces and cities
- Integrate `Swiper` plugin
- Routing supports passing `component`, representing the component path
- Added pre-release packaging mode
- Add [hooks] to close a tag (https://github.com/pure-admin/vue-pure-admin/commit/5e8723a031923e79f507e5a17151d3bd88a51523)

### ✔️ Refactor

- Refactored the landing page to be more inclined to the actual business scenario
- Use `unocss` instead of `windicss`, `unocss` has better performance in development environment, no memory leaks, and `api` is compatible with `windicss`

### 🍏 Perf

- Optimized the style of the `split-pane` component for the platform
- Optimize internationalization, no longer pass the `i18n` field in the route, the platform automatically reads the files in the `locales` folder of the root directory for internationalization matching
- Optimized icon selector
- Optimize `layout` to display user information [commit](https://github.com/pure-admin/vue-pure-admin/commit/56f9dc85e7fbe0637605c43577c794de9f8968aa)

### 🐞 Bug fixes

- Fix route initialization problem (Cannot access 'constantRoutes' before initialization)

# 3.2.0 (2022-3-22)

### 🎫 Feat

- Icon selection component
- Menu search function
- Added results page
- Extended `element-plus` timeline component
- Extended `element-plus` tree component to support connecting lines
- Add tree selector, support single and multiple selection

### 🍏 Perf

- Optimized the error page UI
- Optimize the internationalization function
- Optimized routing `rank` sorting, compatible with the case where the value of the `rank` field in the routing `meta` is `null`

### 🐞 Bug fixes

- Fixed the situation where the menu expands and folds will freeze on some computers

# 3.1.0 (2022-3-3)

### 🎫 Feat

- iframe supports dynamic loading
- Watermark example
- Print examples (pictures, tables, echarts)
- Add running and packaging information, use `lodash-unified` to replace `lodash-es`, `lodash-unified` supports `ESM` and is compatible with `CJS`

### 🐞 Bug fixes

- Fixed jumping to another menu page alone in one menu page, the routing page jumped but the tab page was not displayed
- Fixed the route that returns dynamic level 3 and above in the background, and the menu does not correspond to the page

# 3.0 (2022-2-14)

### 🎫 Feat

- Added mix navigation

### 🐞 Bug fixes

- Fix tab page bug

# 2.9.0 (2022-2-5)

### 🎫 Feat

- Added package size analysis, command `pnpm report`

### 🍏 Perf

- Use `iconify` to introduce icons on demand, optimize icon size, and reduce network requests
- Optimize the route, the route can not pass `showLink: true`, it is displayed by default

# 2.8.5 (2022-1-21)

### 🎫 Feat

- Added `WindiCSS` support
- Add online environment remove console plugin `vite-plugin-remove-console`

### ✔️ Refactor

- Replace `@element-plus/icons-vue` with `@iconify-icons/ep`

# 2.8.0(2022-1-4)

### 🎫 Feat

-Added dark theme
-Add element-plus custom theme
-Add guide page

### 🍏 Perf

-Optimize internationalization, compatible with the vscode plug-in i18n Ally smart reminder
-Optimize the back-end return routing structure
-Optimize local storage, with four built-in buttons `responsive-configure`, `responsive-locale`, `responsive-layout`, `responsive-tags`, which are basic configuration, international configuration, layout configuration, and tab persistent configuration

# 2.7.0(2021-12-18)

### 🎫 Feat

- New tab reuse
- New message reminder template
- Added front-end menu tree structure example
- Refactor routing, optimize permissions modules, and bring a more convenient experience
- Refactor the env environment and http request to bring a more convenient experience
- Currently, the tabs of the platform are forced to associate with local storage. The next step is to put the tabs in the memory by default and support configurable persistent tabs
- Navigation menu icons support fontawesome, iconfont, remixicon, element-plus/icons, custom svg
- Update font-awesome to version 5.0, because versions below 5.0 are no longer officially maintained, but the platform will still be compatible with font-awesome4 version

### 🍏 Perf

- Optimize the tab page to bring a better interactive experience
- Routing title supports direct writing in Chinese, which can be separated from internationalization
- Route history mode is read from env and supports base parameter

# 2.6.0(2021-11-10)

### 🎫 Feat

- Refactored navigation theme color, supports multiple color schemes
- Refactored login page, illustration style

### 🍏 Perf

- Optimize the navigation style
- Eliminate strong navigation dependence on vxe-table
- Synchronously update element-plus, replace Font Icon with SVG Icon

# 2.1.0(2021-10-14)

### 🎫 Feat

- Route animation (each route can add different animations)
- Extra icons (for example, this is a newly added page, a new icon is displayed in the upper right corner of the routing menu)
- Extract the default configuration options
- Perfect type file

### 🐞 Bug fixes

- Fix the issue of element-plus internationalization
- Fix routing issues
- Fix navigation adaptation problem

# 2.0.1(2021-9-29)

### 🎫 Feat

- Feat horizontal nav

# 2.0.0(2021-4-13)

### 🎫 Chores

- Release 2.0.0 version
