import { describe, expect, test } from 'vitest'
import { workbenchCategories } from '../menu-config'
import { workbenchNavigationKeys } from '../navigation'

describe('workbench menu config', () => {
  test('all workbench menus reference registered navigation keys', () => {
    const menus = workbenchCategories.flatMap(category => category.menus)

    expect(menus.length).toBeGreaterThan(0)

    menus.forEach((menu) => {
      expect(workbenchNavigationKeys).toContain(menu.navigationKey)
    })
  })
})
