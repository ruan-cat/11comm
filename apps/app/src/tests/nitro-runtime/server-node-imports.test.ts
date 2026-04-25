import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'

const serverRoot = path.resolve(process.cwd(), 'server')

describe('server node import compatibility', () => {
  test('uses explicit extensions for relative runtime imports', () => {
    const offenders: string[] = []
    const aliasOffenders: string[] = []

    for (const file of listServerFiles(serverRoot)) {
      const source = fs.readFileSync(file, 'utf8')

      for (const specifier of extractRelativeSpecifiers(source)) {
        if (!/\.(?:[cm]?js|json|node|ts|mts|cts)$/u.test(specifier)) {
          offenders.push(`${path.relative(process.cwd(), file)} -> ${specifier}`)
        }
      }

      for (const specifier of extractAliasSpecifiers(source)) {
        aliasOffenders.push(`${path.relative(process.cwd(), file)} -> ${specifier}`)
      }
    }

    expect(offenders).toEqual([])
    expect(aliasOffenders).toEqual([])
  })
})

function listServerFiles(directory: string): string[] {
  const files: string[] = []

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...listServerFiles(fullPath))
      continue
    }

    if (entry.isFile() && fullPath.endsWith('.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

function extractRelativeSpecifiers(source: string): string[] {
  const specifiers: string[] = []
  const patterns = [
    /from\s+['"](\.{1,2}\/[^'"]+)['"]/gu,
    /import\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/gu,
  ]

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      specifiers.push(match[1])
    }
  }

  return specifiers
}

function extractAliasSpecifiers(source: string): string[] {
  const specifiers: string[] = []
  const patterns = [
    /from\s+['"](@\/[^'"]+)['"]/gu,
    /import\(\s*['"](@\/[^'"]+)['"]\s*\)/gu,
  ]

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      specifiers.push(match[1])
    }
  }

  return specifiers
}
