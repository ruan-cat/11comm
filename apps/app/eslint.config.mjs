import uniHelper from '@uni-helper/eslint-config'
import oxlint from 'eslint-plugin-oxlint'
// FIXME: 开启 prettier 的规则之后， markdown 文件的顶部标题会报错 但是不知道为什么
// import eslintConfigPrettier from 'eslint-config-prettier'
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default uniHelper(
  {
    unocss: true,
    vue: true,
    markdown: false,
    ignores: [
      'src/uni_modules/',
      'dist',
      // 忽略旧版 Vue2 示例代码
      '../../examples/gitee-example-app/',
      // unplugin-auto-import 生成的类型文件，每次提交都改变，所以加入这里吧，与 .gitignore 配合使用
      'auto-import.d.ts',
      // vite-plugin-uni-pages 生成的类型文件，每次切换分支都一堆不同的，所以直接 .gitignore
      'uni-pages.d.ts',
      // 插件生成的文件
      'src/pages.json',
      'src/manifest.json',
      // 忽略自动生成文件
      'src/service/app/**',
      'src/utils/systemInfo.ts',
      // 忽略掉 vitepress 文档的全部文件
      'docs/.vitepress/**',
      // 完全忽略所有 markdown 文件，由 prettier 单独处理
      '**/*.md',
    ],
    rules: {
      'style/no-tabs': 'off',
      'style/no-mixed-spaces-and-tabs': 'off',
      'no-useless-return': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'vue/no-unused-refs': 'off',
      'unused-imports/no-unused-vars': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-returns-description': 'off',
      'ts/no-empty-object-type': 'off',
      'no-extend-native': 'off',
      'vue/singleline-html-element-content-newline': [
        'error',
        {
          externalIgnores: ['text'],
        },
      ],
    },
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      // markdown 文件已在 ignores 中排除，由 lint-staged 单独调用 prettier 处理
    },
  },

  // 为 *.mock.ts 文件忽略 multiline-ternary 规则
  {
    files: ['**/*.mock.ts'],
    rules: {
      'style/multiline-ternary': 'off',
    },
  },

  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),

  // FIXME: 开启 prettier 的规则之后， markdown 文件的顶部标题会报错 但是不知道为什么
  // {
  //   files: ['**/*.md'],
  //   rules: {
  //     'prettier/prettier': [
  //       'error',
  //       {
  //         'space-around-alphabet': true,
  //         'space-around-number': true,
  //         'no-empty-code-lang': false,
  //         'no-empty-code': false,
  //       },
  //     ],
  //   },
  // },
  // eslintConfigPrettier,
  // eslintPluginPrettierRecommended,
)
