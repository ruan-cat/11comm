type FormControlCandidate = {
  readonly tagName?: string
  id?: string
  name?: string
  type?: string
  getAttribute?: (name: string) => string | null
  setAttribute?: (name: string, value: string) => void
}

type FormControlRoot = {
  querySelectorAll: (selector: string) => ArrayLike<FormControlCandidate>
}

const FORM_CONTROL_SELECTOR = 'input, textarea, select'
const PATCHED_ATTR = 'data-ruancat-h5-control-attrs'
const GENERATED_ID_PREFIX = 'ruancat-h5-control'

let generatedControlId = 0
let isPatchInstalled = false
let isPatchScheduled = false
let observer: MutationObserver | undefined

/** 读取原生表单控件属性，兼容测试里的轻量 fake 对象。 */
function readControlAttr(control: FormControlCandidate, name: string) {
  const attr = control.getAttribute?.(name)
  if (attr)
    return attr

  if (name === 'id')
    return control.id || ''
  if (name === 'name')
    return control.name || ''
  if (name === 'type')
    return control.type || ''

  return ''
}

/** 写入原生表单控件属性，优先同步 property，避免 H5 控件状态与 attribute 不一致。 */
function writeControlAttr(control: FormControlCandidate, name: string, value: string) {
  if (name === 'id')
    control.id = value
  else if (name === 'name')
    control.name = value
  else if (name === 'type')
    control.type = value

  control.setAttribute?.(name, value)
}

/** 判断是否是需要补齐浏览器表单识别属性的原生控件。 */
function isPatchableControl(control: FormControlCandidate) {
  const tagName = String(control.tagName || '').toLowerCase()
  if (!['input', 'textarea', 'select'].includes(tagName))
    return false

  const inputType = readControlAttr(control, 'type').toLowerCase()
  return !(tagName === 'input' && inputType === 'hidden')
}

/** 生成不与业务字段耦合的 H5 原生控件 id/name。 */
function createGeneratedControlId() {
  generatedControlId += 1
  return `${GENERATED_ID_PREFIX}-${generatedControlId}`
}

/** 为 H5 原生表单控件补齐 Chrome 可访问性检查需要的 id/name。 */
export function patchH5FormControlAttributes(root: FormControlRoot) {
  const controls = Array.from(root.querySelectorAll(FORM_CONTROL_SELECTOR))
  let patchedCount = 0

  for (const control of controls) {
    if (!isPatchableControl(control))
      continue
    if (readControlAttr(control, PATCHED_ATTR) === 'true')
      continue
    if (readControlAttr(control, 'id') || readControlAttr(control, 'name'))
      continue

    const generatedId = createGeneratedControlId()
    writeControlAttr(control, 'id', generatedId)
    writeControlAttr(control, 'name', generatedId)

    const placeholder = readControlAttr(control, 'placeholder')
    if (placeholder && !readControlAttr(control, 'aria-label'))
      writeControlAttr(control, 'aria-label', placeholder)

    writeControlAttr(control, PATCHED_ATTR, 'true')
    patchedCount += 1
  }

  return patchedCount
}

/** 合并同一帧内的多次 DOM 变更，避免页面频繁渲染时重复扫描。 */
function schedulePatch(rootDocument: Document) {
  if (isPatchScheduled)
    return

  isPatchScheduled = true
  const runPatch = () => {
    isPatchScheduled = false
    patchH5FormControlAttributes(rootDocument)
  }

  if (typeof requestAnimationFrame === 'function')
    requestAnimationFrame(runPatch)
  else
    globalThis.setTimeout(runPatch, 0)
}

/** 在 H5 端安装全局表单控件属性补丁，覆盖 wd-input/wd-search/wd-textarea 的内部原生控件。 */
export function installH5FormControlAttributesPatch(rootDocument = document) {
  if (isPatchInstalled)
    return

  isPatchInstalled = true

  const startObserver = () => {
    schedulePatch(rootDocument)

    if (observer || typeof MutationObserver === 'undefined')
      return

    if (!rootDocument.body) {
      globalThis.setTimeout(startObserver, 16)
      return
    }

    observer = new MutationObserver(() => {
      schedulePatch(rootDocument)
    })

    observer.observe(rootDocument.body, {
      childList: true,
      subtree: true,
    })
  }

  startObserver()
}
