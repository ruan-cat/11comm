
## v0.2.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.1.0...v0.2.0)

### ✨ 新增功能

- **prompt,admin:** ⚠️  为 taskmaster-ai 初始化全部的任务。 ([5f44d2e](https://github.com/ruan-cat/11comm/commit/5f44d2e))

### 🎈 性能提升

- **config,root:** 复用配置项。 ([348a46b](https://github.com/ruan-cat/11comm/commit/348a46b))

### 📃 文档更新

- **prompt,admin:** 探究，搞清楚在 claude code 内没找到存在的 `taskmaster-ai` MCP的故障。是包本身的故障。 ([d18e15a](https://github.com/ruan-cat/11comm/commit/d18e15a))

### 🐳 其他修改

- **prompt,admin:** 解决 taskmaster-ai 无法使用的问题。 ([dfd2161](https://github.com/ruan-cat/11comm/commit/dfd2161))
- **prompt,admin:** ⚠️  解决 taskmaster-ai 无法使用的问题。 ([ea54957](https://github.com/ruan-cat/11comm/commit/ea54957))

### 🐎 持续集成

- **package.json:** 无法实现无github的推送，且不得不提供push，否则tag标签无法自动推送。 ([e825388](https://github.com/ruan-cat/11comm/commit/e825388))
- **root:** 工作流不再生成日志。 ([5376f88](https://github.com/ruan-cat/11comm/commit/5376f88))

### 📦 依赖更新

- **package.json,admin:** 升级依赖 ([eeb4e7c](https://github.com/ruan-cat/11comm/commit/eeb4e7c))

### 🔧 更新配置

- **config,root:** 不让 changelogithub 生成日志文件 ([b2be642](https://github.com/ruan-cat/11comm/commit/b2be642))
- **root:** ⚠️  更改 task-master-ai 的MCP为最初官网要求的配置。 ([ed599a8](https://github.com/ruan-cat/11comm/commit/ed599a8))
- **root:** ⚠️  设置语言 ([d3858f3](https://github.com/ruan-cat/11comm/commit/d3858f3))
- ⚠️  更新吗，MCP。很怀疑claude code的MCP写法无法正常工作。 ([4d08f31](https://github.com/ruan-cat/11comm/commit/4d08f31))

#### ⚠️ Breaking Changes

- **prompt,admin:** ⚠️  为 taskmaster-ai 初始化全部的任务。 ([5f44d2e](https://github.com/ruan-cat/11comm/commit/5f44d2e))
- **prompt,admin:** ⚠️  解决 taskmaster-ai 无法使用的问题。 ([ea54957](https://github.com/ruan-cat/11comm/commit/ea54957))
- **root:** ⚠️  更改 task-master-ai 的MCP为最初官网要求的配置。 ([ed599a8](https://github.com/ruan-cat/11comm/commit/ed599a8))
- **root:** ⚠️  设置语言 ([d3858f3](https://github.com/ruan-cat/11comm/commit/d3858f3))
- ⚠️  更新吗，MCP。很怀疑claude code的MCP写法无法正常工作。 ([4d08f31](https://github.com/ruan-cat/11comm/commit/4d08f31))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.1.0

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.0.11...v0.1.0)

### 🐎 持续集成

- **package.json:** ⚠️  不直接push提交了。避免误触，错误发包。 ([c8840cc](https://github.com/ruan-cat/11comm/commit/c8840cc))

#### ⚠️ Breaking Changes

- **package.json:** ⚠️  不直接push提交了。避免误触，错误发包。 ([c8840cc](https://github.com/ruan-cat/11comm/commit/c8840cc))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.0.11

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.0.10...v0.0.11)

### 🐎 持续集成

- **package.json:** 本地运行升级版本和生成日志时，不会自动打开github页面。 ([5ba4fc8](https://github.com/ruan-cat/11comm/commit/5ba4fc8))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v0.0.10

[compare changes](https://github.com/ruan-cat/11comm/compare/v0.0.9...v0.0.10)

### 🐞 修复缺陷

- **root:** 移除掉工作流的策略功能。 ([5962869](https://github.com/ruan-cat/11comm/commit/5962869))

### 🐳 其他修改

- **config,root:** 标记 changelogithub 不应该生成更新日志 ([7dc69b0](https://github.com/ruan-cat/11comm/commit/7dc69b0))

### 🐎 持续集成

- **root:** 制作基于输入值而驱动的策略性工作流，根据不同情况，使用不同的日志生成工具。 ([01748e7](https://github.com/ruan-cat/11comm/commit/01748e7))
- **package.json,root:** 设计基于 changelogen 的发版命令。 ([f8119a8](https://github.com/ruan-cat/11comm/commit/f8119a8))

### 📦 依赖更新

- **root,package.json,admin:** 升级依赖 ([d7d1579](https://github.com/ruan-cat/11comm/commit/d7d1579))

### 🔧 更新配置

- **config,root:** 日志生成配置，均不提供基于语义化提交生成版本号的配置。 ([95abe74](https://github.com/ruan-cat/11comm/commit/95abe74))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

