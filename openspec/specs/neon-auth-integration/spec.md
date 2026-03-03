# neon-auth-integration Specification

## Purpose

TBD - created by archiving change nitro-api-authentication. Update Purpose after archive.

## Requirements

### Requirement: Neon Auth 服务配置

系统 SHALL 支持通过环境变量配置 Neon Auth 服务连接信息。

#### Scenario: 生产环境配置

- **WHEN** 部署到生产环境时配置了 `NEON_AUTH_BASE_URL` 和 `NEON_AUTH_COOKIE_SECRET`
- **THEN** 系统 SHALL 使用配置的认证服务进行用户认证

#### Scenario: 开发环境配置

- **WHEN** 开发环境配置了测试用 Auth 凭证
- **THEN** 系统 SHALL 支持使用 Neon 提供的共享 OAuth 凭证进行登录测试

### Requirement: 用户注册

系统 SHALL 支持用户通过邮箱密码注册新账户。

#### Scenario: 邮箱注册成功

- **WHEN** 用户提交有效的邮箱和密码（至少 8 位）
- **THEN** 系统 SHALL 创建用户账户并返回成功响应

#### Scenario: 邮箱注册失败 - 已存在

- **WHEN** 用户使用已注册的邮箱注册
- **THEN** 系统 SHALL 返回错误提示"邮箱已被注册"

### Requirement: 用户登录

系统 SHALL 支持用户使用邮箱密码登录系统。

#### Scenario: 登录成功

- **WHEN** 用户提交正确的邮箱和密码
- **THEN** 系统 SHALL 返回 JWT Token 和用户信息

#### Scenario: 登录失败 - 密码错误

- **WHEN** 用户提交正确的邮箱但错误的密码
- **THEN** 系统 SHALL 返回错误提示"密码错误"

#### Scenario: 登录失败 - 用户不存在

- **WHEN** 用户提交不存在的邮箱
- **THEN** 系统 SHALL 返回错误提示"用户不存在"

### Requirement: OAuth 社交登录

系统 SHALL 支持用户通过第三方 OAuth 提供商登录。

#### Scenario: Google 登录

- **WHEN** 用户选择使用 Google 账号登录
- **THEN** 系统 SHALL 重定向到 Google 授权页面，授权后创建/关联账户

#### Scenario: GitHub 登录

- **WHEN** 用户选择使用 GitHub 账号登录
- **THEN** 系统 SHALL 重定向到 GitHub 授权页面，授权后创建/关联账户

### Requirement: 用户登出

系统 SHALL 支持已登录用户安全登出。

#### Scenario: 正常登出

- **WHEN** 已登录用户点击登出按钮
- **THEN** 系统 SHALL 清除用户 Session 并返回成功响应

### Requirement: 获取当前用户信息

系统 SHALL 支持已登录用户获取自身账户信息。

#### Scenario: 获取用户信息成功

- **WHEN** 已登录用户请求获取自身信息
- **THEN** 系统 SHALL 返回用户 ID、邮箱、昵称、头像等基本信息

#### Scenario: 获取用户信息失败 - 未登录

- **WHEN** 未登录用户请求获取用户信息
- **THEN** 系统 SHALL 返回 401 未授权错误
