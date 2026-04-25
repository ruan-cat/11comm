import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

describe('home index template', () => {
  test('renders static image fallbacks before iconify css icons', () => {
    const source = readFileSync(resolve(__dirname, '../index.vue'), 'utf8')

    expect(source).toContain('v-if="entry.iconImage"')
    expect(source).toContain(`:class="getEntryImageClass('feature')"`)
    expect(source).toContain(`:class="getEntryImageClass('grid')"`)
    expect(source).toContain(':class="getEntryShellClass(entry)"')
    expect(source).toContain(`<view v-else :class="getEntryIconClass(entry, 'feature')" />`)
    expect(source).toContain(`<view v-else :class="getEntryIconClass(entry, 'grid')" />`)
    expect(source).not.toContain('<wd-icon')
    expect(source).not.toContain(':class="entry.bgClass"')
  })
})
