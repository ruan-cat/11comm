import { describe, expect, test } from 'vitest'
import { patchH5FormControlAttributes } from '../utils/h5-form-control-attributes'

class FakeControl {
  readonly attributes = new Map<string, string>()
  id = ''
  name = ''
  type = ''

  constructor(
    readonly tagName: string,
    attrs: Record<string, string> = {},
  ) {
    for (const [key, value] of Object.entries(attrs)) {
      this.setAttribute(key, value)
    }
  }

  getAttribute(name: string) {
    if (name === 'id')
      return this.id || null
    if (name === 'name')
      return this.name || null
    if (name === 'type')
      return this.type || null
    return this.attributes.get(name) ?? null
  }

  setAttribute(name: string, value: string) {
    if (name === 'id') {
      this.id = value
      return
    }
    if (name === 'name') {
      this.name = value
      return
    }
    if (name === 'type') {
      this.type = value
      return
    }
    this.attributes.set(name, value)
  }
}

class FakeRoot {
  constructor(private readonly controls: FakeControl[]) {}

  querySelectorAll() {
    return this.controls
  }
}

describe('patchH5FormControlAttributes', () => {
  test('adds id name and aria-label to visible controls without browser form identifiers', () => {
    const input = new FakeControl('input', {
      placeholder: '输入姓名或部门搜索',
    })

    const patchedCount = patchH5FormControlAttributes(new FakeRoot([input]))

    expect(patchedCount).toBe(1)
    expect(input.id).toMatch(/^ruancat-h5-control-\d+$/)
    expect(input.name).toBe(input.id)
    expect(input.getAttribute('aria-label')).toBe('输入姓名或部门搜索')
  })

  test('does not override existing id or name', () => {
    const namedInput = new FakeControl('input', {
      name: 'keyword',
      placeholder: '搜索关键字',
    })
    const identifiedTextarea = new FakeControl('textarea', {
      id: 'remark-input',
      placeholder: '备注',
    })

    const patchedCount = patchH5FormControlAttributes(new FakeRoot([namedInput, identifiedTextarea]))

    expect(patchedCount).toBe(0)
    expect(namedInput.id).toBe('')
    expect(namedInput.name).toBe('keyword')
    expect(namedInput.getAttribute('aria-label')).toBeNull()
    expect(identifiedTextarea.id).toBe('remark-input')
    expect(identifiedTextarea.name).toBe('')
  })

  test('skips hidden inputs', () => {
    const hiddenInput = new FakeControl('input', {
      type: 'hidden',
      value: 'internal',
    })

    const patchedCount = patchH5FormControlAttributes(new FakeRoot([hiddenInput]))

    expect(patchedCount).toBe(0)
    expect(hiddenInput.id).toBe('')
    expect(hiddenInput.name).toBe('')
  })
})
