# 关于使用 TailwindCSS

对于 unibest 项目使用 TailwindCSS 的评估如下：

1. **直接使用 TailwindCSS 的限制**：
   - 原生 TailwindCSS 是为 Web 设计的，在小程序环境下会有兼容性问题
   - 不支持 rpx 单位，在小程序适配上有困难
   - 需要额外配置 postcss 和 purgeCSS 才能在小程序工作

2. **当前 UnoCSS 的优势**：
   - 您的项目已经配置了`unocss-applet`，专门为小程序优化
   - 支持 rpx 单位转换（通过 presetRemRpx）
   - 支持小程序属性化写法（transformerAttributify）
   - 体积更小，按需生成样式

3. **替代方案建议**：
   - 保持使用 UnoCSS，它已经实现了 Tailwind 的大部分功能
   - 可以通过安装`@unocss/preset-wind`来获得 Tailwind 风格的类名：

   ```bash
   pnpm add -D @unocss/preset-wind
   ```

   然后在 uno.config.ts 中添加：

   ```typescript
   import { presetWind } from "@unocss/preset-wind";

   export default defineConfig({
   	presets: [
   		presetWind(),
   		// 其他presets...
   	],
   });
   ```

4. **结论**：
   在 uni-app 项目中，UnoCSS 是比原生 TailwindCSS 更合适的选择，特别是针对小程序开发。通过`preset-wind`可以获得类似 Tailwind 的开发体验。
