export type MenuSurfaceTheme = 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red'

const surfaceThemeVars: Record<MenuSurfaceTheme, Record<string, string>> = {
  blue: {
    '--surface-start': 'rgba(238, 245, 255, 0.96)',
    '--surface-end': 'rgba(223, 236, 255, 0.92)',
    '--surface-border': 'rgba(84, 138, 255, 0.18)',
    '--surface-shadow': 'rgba(58, 108, 214, 0.14)',
    '--tile-start': 'rgba(255, 255, 255, 0.92)',
    '--tile-end': 'rgba(236, 243, 255, 0.84)',
    '--tile-border': 'rgba(84, 138, 255, 0.14)',
    '--title-tint': 'rgba(59, 130, 246, 0.12)',
  },
  cyan: {
    '--surface-start': 'rgba(235, 250, 252, 0.96)',
    '--surface-end': 'rgba(216, 244, 247, 0.92)',
    '--surface-border': 'rgba(58, 188, 203, 0.18)',
    '--surface-shadow': 'rgba(20, 154, 170, 0.14)',
    '--tile-start': 'rgba(255, 255, 255, 0.92)',
    '--tile-end': 'rgba(232, 248, 249, 0.84)',
    '--tile-border': 'rgba(58, 188, 203, 0.14)',
    '--title-tint': 'rgba(6, 182, 212, 0.12)',
  },
  green: {
    '--surface-start': 'rgba(239, 249, 241, 0.96)',
    '--surface-end': 'rgba(225, 244, 230, 0.92)',
    '--surface-border': 'rgba(92, 190, 116, 0.18)',
    '--surface-shadow': 'rgba(68, 148, 87, 0.14)',
    '--tile-start': 'rgba(255, 255, 255, 0.92)',
    '--tile-end': 'rgba(235, 247, 237, 0.84)',
    '--tile-border': 'rgba(92, 190, 116, 0.14)',
    '--title-tint': 'rgba(34, 197, 94, 0.12)',
  },
  orange: {
    '--surface-start': 'rgba(255, 246, 236, 0.96)',
    '--surface-end': 'rgba(252, 236, 219, 0.92)',
    '--surface-border': 'rgba(246, 157, 74, 0.18)',
    '--surface-shadow': 'rgba(225, 129, 45, 0.14)',
    '--tile-start': 'rgba(255, 255, 255, 0.92)',
    '--tile-end': 'rgba(255, 243, 230, 0.84)',
    '--tile-border': 'rgba(246, 157, 74, 0.14)',
    '--title-tint': 'rgba(249, 115, 22, 0.12)',
  },
  purple: {
    '--surface-start': 'rgba(245, 241, 255, 0.96)',
    '--surface-end': 'rgba(236, 229, 252, 0.92)',
    '--surface-border': 'rgba(150, 113, 227, 0.18)',
    '--surface-shadow': 'rgba(123, 92, 196, 0.14)',
    '--tile-start': 'rgba(255, 255, 255, 0.92)',
    '--tile-end': 'rgba(244, 239, 255, 0.84)',
    '--tile-border': 'rgba(150, 113, 227, 0.14)',
    '--title-tint': 'rgba(139, 92, 246, 0.12)',
  },
  red: {
    '--surface-start': 'rgba(255, 241, 241, 0.96)',
    '--surface-end': 'rgba(252, 228, 228, 0.92)',
    '--surface-border': 'rgba(237, 99, 99, 0.18)',
    '--surface-shadow': 'rgba(208, 76, 76, 0.14)',
    '--tile-start': 'rgba(255, 255, 255, 0.92)',
    '--tile-end': 'rgba(255, 239, 239, 0.84)',
    '--tile-border': 'rgba(237, 99, 99, 0.14)',
    '--title-tint': 'rgba(239, 68, 68, 0.12)',
  },
}

/** Resolve surface tokens from an icon color class. */
export function resolveSurfaceTheme(iconClass: string): MenuSurfaceTheme {
  if (iconClass.includes('red'))
    return 'red'
  if (iconClass.includes('orange'))
    return 'orange'
  if (iconClass.includes('green'))
    return 'green'
  if (iconClass.includes('purple'))
    return 'purple'
  if (iconClass.includes('cyan'))
    return 'cyan'
  return 'blue'
}

/** Get inherited CSS variables for a themed surface. */
export function getSurfaceThemeVars(theme: MenuSurfaceTheme) {
  return surfaceThemeVars[theme]
}
