import { getDomains } from '@ruan-cat/domains'

const PROJECT_NAME = '11comm'

export const PROJECT_DOMAIN_ALIASES = {
  h5: '11commAppH5',
  nitroServer: '11commAppNitroServer',
} as const

/**
 * 根据别名解析 11comm 项目的完整域名
 * @example
 * resolve11CommDomainByAlias(PROJECT_DOMAIN_ALIASES.h5)
 */
export function resolve11CommDomainByAlias(projectAlias: string): string {
  const domain = getDomains({
    projectName: PROJECT_NAME,
    projectAlias,
  })[0]

  if (!domain) {
    throw new Error(`[project-domains] 未找到 11comm 项目别名 ${projectAlias} 对应的域名配置`)
  }

  return `https://${domain}`
}

/**
 * 解析 11comm H5 生产域名
 * @example
 * resolve11CommH5BaseUrl()
 */
export function resolve11CommH5BaseUrl(): string {
  return resolve11CommDomainByAlias(PROJECT_DOMAIN_ALIASES.h5)
}

/**
 * 解析 11comm Nitro 服务端生产域名
 * @example
 * resolve11CommNitroServerBaseUrl()
 */
export function resolve11CommNitroServerBaseUrl(): string {
  return resolve11CommDomainByAlias(PROJECT_DOMAIN_ALIASES.nitroServer)
}

/**
 * 解析 11comm Nitro 上传基址
 * @example
 * resolve11CommNitroUploadBaseUrl()
 */
export function resolve11CommNitroUploadBaseUrl(): string {
  return `${resolve11CommNitroServerBaseUrl()}/upload`
}
