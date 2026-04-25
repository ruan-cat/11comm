const METHOD_ORDER = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const
const GROUP_ORDER = ['system', '/app', '/callComponent', 'other'] as const

/** 可被目录页消费的 endpoint 最小定义。 */
export interface CatalogEndpointDefinition {
  method: string | string[]
  url: string
}

/** 目录页中的单条接口记录。 */
export interface EndpointCatalogEntry {
  accessHint: string
  canOpenDirectly: boolean
  groupKey: string
  groupLabel: string
  isDynamic: boolean
  methods: string[]
  url: string
}

/** 目录页的分组统计。 */
export interface EndpointCatalogGroupSummary {
  count: number
  key: string
  label: string
}

/** 目录页的汇总信息。 */
export interface EndpointCatalogSummary {
  groups: EndpointCatalogGroupSummary[]
  totalDefinitions: number
  totalMethodMappings: number
  totalUrls: number
}

/** 根地址目录页使用的标准数据结构。 */
export interface EndpointCatalog {
  entries: EndpointCatalogEntry[]
  generatedAt: string
  summary: EndpointCatalogSummary
}

/** 基于共享 endpoint 定义生成稳定的目录数据。 */
export function createEndpointCatalog(definitions: CatalogEndpointDefinition[]): EndpointCatalog {
  const uniqueMethodMappings = Array.from(
    new Map(
      definitions.flatMap((definition) => {
        return normalizeMethods(definition.method).map((method) => {
          const normalizedUrl = normalizeUrl(definition.url)

          return [
            `${method} ${normalizedUrl}`,
            {
              method,
              url: normalizedUrl,
            },
          ] as const
        })
      }),
    ).values(),
  )

  const groupedMethods = new Map<string, Set<string>>()
  for (const mapping of uniqueMethodMappings) {
    const existingMethods = groupedMethods.get(mapping.url) || new Set<string>()
    existingMethods.add(mapping.method)
    groupedMethods.set(mapping.url, existingMethods)
  }

  const entries = Array.from(groupedMethods.entries())
    .map(([url, methodSet]) => {
      const { key: groupKey, label: groupLabel } = resolveGroup(url)
      const methods = Array.from(methodSet).sort(compareMethods)
      const isDynamic = url.includes('/:')

      return {
        url,
        methods,
        groupKey,
        groupLabel,
        isDynamic,
        canOpenDirectly: !isDynamic && methods.includes('GET'),
        accessHint: resolveAccessHint(methods, isDynamic),
      } satisfies EndpointCatalogEntry
    })
    .sort(compareEntries)

  const groups = Array.from(
    entries.reduce((accumulator, entry) => {
      const existingGroup = accumulator.get(entry.groupKey)
      if (existingGroup) {
        existingGroup.count += 1
        return accumulator
      }

      accumulator.set(entry.groupKey, {
        key: entry.groupKey,
        label: entry.groupLabel,
        count: 1,
      })

      return accumulator
    }, new Map<string, EndpointCatalogGroupSummary>()),
  )
    .map(([, group]) => group)
    .sort(compareGroups)

  return {
    generatedAt: new Date().toISOString(),
    entries,
    summary: {
      groups,
      totalDefinitions: definitions.length,
      totalMethodMappings: uniqueMethodMappings.length,
      totalUrls: entries.length,
    },
  }
}

/** 渲染根地址可直接浏览的 HTML 接口目录页。 */
export function renderEndpointCatalogHtml(catalog: EndpointCatalog): string {
  const sections = catalog.summary.groups
    .map((group) => {
      const rows = catalog.entries
        .filter(entry => entry.groupKey === group.key)
        .map(renderEntryRow)
        .join('')

      return `
        <section class="group-section">
          <div class="group-header">
            <h2>${escapeHtml(group.label)}</h2>
            <span class="group-count">${group.count}</span>
          </div>
          <div class="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>URL</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </section>
      `
    })
    .join('')

  const statCards = [
    renderStatCard('原始定义数', String(catalog.summary.totalDefinitions)),
    renderStatCard('唯一 URL 数', String(catalog.summary.totalUrls)),
    renderStatCard('Method 映射数', String(catalog.summary.totalMethodMappings)),
    renderStatCard('生成时间', escapeHtml(catalog.generatedAt)),
  ].join('')

  return `
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>11comm-app Nitro 接口目录</title>
        <style>
          :root {
            color-scheme: light;
            --bg: #f5f7fb;
            --panel: #ffffff;
            --panel-weak: #eef3ff;
            --line: #d8e0ef;
            --text: #10233f;
            --muted: #5d6f8b;
            --accent: #165dff;
            --accent-weak: #dce8ff;
            --shadow: 0 20px 45px rgba(16, 35, 63, 0.08);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
            background:
              radial-gradient(circle at top left, rgba(22, 93, 255, 0.09), transparent 28%),
              linear-gradient(180deg, #f8fbff 0%, var(--bg) 100%);
            color: var(--text);
          }

          main {
            max-width: 1280px;
            margin: 0 auto;
            padding: 40px 20px 64px;
          }

          .hero {
            margin-bottom: 28px;
            padding: 28px;
            border: 1px solid rgba(22, 93, 255, 0.12);
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow);
          }

          .hero h1 {
            margin: 0 0 12px;
            font-size: clamp(28px, 3.4vw, 42px);
            line-height: 1.05;
          }

          .hero p {
            margin: 0;
            max-width: 820px;
            font-size: 15px;
            line-height: 1.7;
            color: var(--muted);
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
            gap: 14px;
            margin: 20px 0 28px;
          }

          .stat-card {
            padding: 18px 20px;
            border: 1px solid var(--line);
            border-radius: 18px;
            background: var(--panel);
            box-shadow: 0 12px 24px rgba(16, 35, 63, 0.05);
          }

          .stat-card span {
            display: block;
            font-size: 12px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .stat-card strong {
            display: block;
            margin-top: 10px;
            font-size: 18px;
            line-height: 1.4;
            word-break: break-word;
          }

          .group-section {
            margin-top: 22px;
            padding: 20px;
            border: 1px solid var(--line);
            border-radius: 22px;
            background: var(--panel);
            box-shadow: 0 10px 28px rgba(16, 35, 63, 0.05);
          }

          .group-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 16px;
          }

          .group-header h2 {
            margin: 0;
            font-size: 22px;
          }

          .group-count {
            min-width: 44px;
            padding: 7px 12px;
            border-radius: 999px;
            background: var(--panel-weak);
            color: var(--accent);
            font-size: 13px;
            font-weight: 700;
            text-align: center;
          }

          .table-shell {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 14px 12px;
            border-top: 1px solid rgba(216, 224, 239, 0.8);
            text-align: left;
            vertical-align: top;
          }

          th {
            color: var(--muted);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .method-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .method-chip {
            display: inline-flex;
            align-items: center;
            min-width: 64px;
            justify-content: center;
            padding: 6px 10px;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: #f8fbff;
            font-size: 12px;
            font-weight: 700;
          }

          .method-get {
            color: #0f7b4b;
            background: #e5fff2;
            border-color: #b8efd1;
          }

          .method-post {
            color: #8a5300;
            background: #fff4df;
            border-color: #f3d39a;
          }

          .method-put,
          .method-patch {
            color: #6941c6;
            background: #f1e9ff;
            border-color: #d8c5ff;
          }

          .method-delete {
            color: #b42318;
            background: #feeceb;
            border-color: #f7c4be;
          }

          .url-code {
            display: inline-flex;
            padding: 2px 0;
            font-family: "Cascadia Code", "Consolas", monospace;
            font-size: 14px;
            color: var(--text);
            word-break: break-all;
          }

          a.url-code {
            color: var(--accent);
            text-decoration: none;
          }

          a.url-code:hover {
            text-decoration: underline;
          }

          .hint {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
          }

          @media (max-width: 720px) {
            main {
              padding: 24px 14px 40px;
            }

            .hero {
              padding: 22px 18px;
            }

            .group-section {
              padding: 16px;
            }

            th,
            td {
              padding: 12px 10px;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <section class="hero">
            <h1>11comm-app Nitro 接口目录</h1>
            <p>
              当前页面直接基于 Nitro 运行时实际注册的 endpoint 定义生成，
              用于查看本项目在生产 / 预览 / 本地独立 Nitro 服务中可分发的接口地址。
              静态 GET 地址可直接点击访问，动态路径或非 GET 接口请按提示补充参数后再调用。
            </p>
          </section>
          <section class="stats">${statCards}</section>
          ${sections}
        </main>
      </body>
    </html>
  `
}

/** 渲染统计卡片。 */
function renderStatCard(label: string, value: string): string {
  return `
    <article class="stat-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `
}

/** 渲染单条 endpoint 目录行。 */
function renderEntryRow(entry: EndpointCatalogEntry): string {
  const methods = entry.methods
    .map((method) => {
      const modifier = `method-${method.toLowerCase()}`

      return `<span class="method-chip ${modifier}">${escapeHtml(method)}</span>`
    })
    .join('')

  const urlLabel = `<span class="url-code">${escapeHtml(entry.url)}</span>`
  const urlContent = entry.canOpenDirectly
    ? `<a class="url-code" href="${escapeAttribute(entry.url)}" target="_blank" rel="noreferrer">${escapeHtml(entry.url)}</a>`
    : urlLabel

  return `
    <tr>
      <td>
        <div class="method-list">${methods}</div>
      </td>
      <td>${urlContent}</td>
      <td class="hint">${escapeHtml(entry.accessHint)}</td>
    </tr>
  `
}

/** 统一收敛 method 定义并去除重复值。 */
function normalizeMethods(method: string | string[]): string[] {
  const methods = Array.isArray(method) ? method : [method]

  return Array.from(new Set(methods.map(item => item.toUpperCase())))
}

/** 统一清理 URL 尾部空白。 */
function normalizeUrl(url: string): string {
  return url.trim() || '/'
}

/** 根据 URL 归类目录分组。 */
function resolveGroup(url: string): { key: string, label: string } {
  if (url === '/' || url.startsWith('/__nitro/')) {
    return {
      key: 'system',
      label: '系统接口',
    }
  }

  if (url.startsWith('/app/')) {
    return {
      key: '/app',
      label: '/app 业务接口',
    }
  }

  if (url.startsWith('/callComponent/')) {
    return {
      key: '/callComponent',
      label: '/callComponent 业务接口',
    }
  }

  return {
    key: 'other',
    label: '其他接口',
  }
}

/** 生成接口访问提示。 */
function resolveAccessHint(methods: string[], isDynamic: boolean): string {
  if (isDynamic) {
    return '动态路径，访问前请先替换路径参数。'
  }

  if (methods.includes('GET')) {
    return '包含 GET，可直接在浏览器中打开。'
  }

  return '不包含 GET，请使用对应 method 发起请求。'
}

/** 按预设的 HTTP method 顺序排序。 */
function compareMethods(left: string, right: string): number {
  return resolveMethodWeight(left) - resolveMethodWeight(right) || left.localeCompare(right)
}

/** 按目录分组与 URL 稳定排序。 */
function compareEntries(left: EndpointCatalogEntry, right: EndpointCatalogEntry): number {
  return compareGroups(
    { key: left.groupKey, label: left.groupLabel, count: 0 },
    { key: right.groupKey, label: right.groupLabel, count: 0 },
  ) || left.url.localeCompare(right.url)
}

/** 按固定组序输出统计区块。 */
function compareGroups(
  left: EndpointCatalogGroupSummary,
  right: EndpointCatalogGroupSummary,
): number {
  return resolveGroupWeight(left.key) - resolveGroupWeight(right.key) || left.label.localeCompare(right.label)
}

/** 获取 HTTP method 的排序权重。 */
function resolveMethodWeight(method: string): number {
  const index = METHOD_ORDER.indexOf(method as typeof METHOD_ORDER[number])
  return index === -1 ? METHOD_ORDER.length : index
}

/** 获取目录分组的排序权重。 */
function resolveGroupWeight(groupKey: string): number {
  const index = GROUP_ORDER.indexOf(groupKey as typeof GROUP_ORDER[number])
  return index === -1 ? GROUP_ORDER.length : index
}

/** 转义 HTML 文本内容。 */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}

/** 转义 HTML 属性值。 */
function escapeAttribute(value: string): string {
  return escapeHtml(value)
}
