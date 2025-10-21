# 生成本地数据较为美观的列表页

你需要对我提供的列表页 {{ $ARGUMENTS }} 进行修改。具体来说，要按照数个子代理文档的要求，对 {{ $ARGUMENTS }} 文件做出修改。

请按照以下步骤进行操作：

1. 明确目录结构

通常意义下，你要处理的文件目录结构如下：

```txt
│  index.vue     # 列表页
│  test-data.ts  # 假数据文件
└─components
        form.ts  # 表单类型文件
        form.vue # 表单
```

- 如果你看到了相关的文件，就做好准备，使用以下的子代理完成修改。
- 如果你没有看到文件，就按照子代理的要求，新增上述文件。

2. 仔细阅读 {{ $ARGUMENTS }} 文件的内容。
3. 仔细阅读三个子代理文档的内容，明确修改要求。并严格按照子代理的要求做出更改。
   - 请你 ultrathink 地深度阅读，并思考 `代码风格子代理` `.claude\agents\code-style.md` 文件。
   - 请你 ultrathink 地深度阅读，并思考 `生成弹框子代理` `.claude\agents\make-dialog.md` 文件。
   - 请你 ultrathink 地深度阅读，并思考 `生成标准列表页子代理` `.claude\agents\make-list-page.md` 文件。
   - 请你 ultrathink 地深度阅读，并思考 `生成用于弹框的表单子代理` `.claude\agents\make-form-for-dialog.md` 文件。
4. 请你主动的扩大处理的文件范围。比如我提供给你了一个 `index.vue` 列表页文件，请你按照子代理说明的文件夹目录结构，自主地去寻找该 `index.vue` 列表页所附属的几个文件，并一同地对这几个文件做修改。
5. 按照子代理文档的要求做，而不是主动运行子代理。在没有具体的，明确的说明下，不要运行子代理。
