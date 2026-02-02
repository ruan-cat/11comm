# Neon Python SDK

`neon-api` Python SDK 是 Neon REST API 的 Python 风格封装。它提供了管理所有 Neon 资源的方法，包括项目、分支、端点、角色和数据库。

有关核心概念（组织、项目、分支、端点等），请参阅 `what-is-neon.md`。

## 文档

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/reference/python-sdk
```

## 安装

```bash
pip install neon-api
```

## 身份验证

```python
import os
from neon_api import NeonAPI

api_key = os.getenv("NEON_API_KEY")
if not api_key:
    raise ValueError("NEON_API_KEY environment variable is not set.")

neon = NeonAPI(api_key=api_key)
```

## 项目

### 列出项目

```python
all_projects = neon.projects()
```

### 创建项目

```python
new_project = neon.project_create(
    project={
        'name': 'my-new-project',
        'pg_version': 17
    }
)
```

### 获取项目详情

```python
project = neon.project(project_id='your-project-id')
```

### 更新项目

```python
neon.project_update(
    project_id='your-project-id',
    project={
        'name': 'renamed-project',
        'default_endpoint_settings': {
            'autoscaling_limit_min_cu': 1,
            'autoscaling_limit_max_cu': 2,
        }
    }
)
```

### 删除项目

```python
neon.project_delete(project_id='project-to-delete')
```

### 获取连接 URI

```python
uri = neon.connection_uri(
    project_id='your-project-id',
    database_name='neondb',
    role_name='neondb_owner'
)
print(f"Connection URI: {uri.uri}")
```

## 分支

### 创建分支

```python
new_branch = neon.branch_create(
    project_id='your-project-id',
    branch={'name': 'feature-branch'},
    endpoints=[
        {'type': 'read_write', 'autoscaling_limit_max_cu': 1}
    ]
)
```

### 列出分支

```python
branches = neon.branches(project_id='your-project-id')
```

### 获取分支详情

```python
branch = neon.branch(project_id='your-project-id', branch_id='br-xxx')
```

### 更新分支

```python
neon.branch_update(
    project_id='your-project-id',
    branch_id='br-xxx',
    branch={'name': 'updated-branch-name'}
)
```

### 删除分支

```python
neon.branch_delete(project_id='your-project-id', branch_id='br-xxx')
```

## 数据库

### 创建数据库

```python
neon.database_create(
    project_id='your-project-id',
    branch_id='br-xxx',
    database={'name': 'my-app-db', 'owner_name': 'neondb_owner'}
)
```

### 列出数据库

```python
databases = neon.databases(project_id='your-project-id', branch_id='br-xxx')
```

### 删除数据库

```python
neon.database_delete(
    project_id='your-project-id',
    branch_id='br-xxx',
    database_id='my-app-db'
)
```

## 角色

### 创建角色

```python
new_role = neon.role_create(
    project_id='your-project-id',
    branch_id='br-xxx',
    role_name='app_user'
)
print(f"Password: {new_role.role.password}")
```

### 列出角色

```python
roles = neon.roles(project_id='your-project-id', branch_id='br-xxx')
```

### 删除角色

```python
neon.role_delete(
    project_id='your-project-id',
    branch_id='br-xxx',
    role_name='app_user'
)
```

## 端点

### 创建端点

```python
neon.endpoint_create(
    project_id='your-project-id',
    endpoint={
        'branch_id': 'br-xxx',
        'type': 'read_only'
    }
)
```

### 启动/暂停端点

```python
# 启动
neon.endpoint_start(project_id='your-project-id', endpoint_id='ep-xxx')

# 暂停
neon.endpoint_suspend(project_id='your-project-id', endpoint_id='ep-xxx')
```

### 更新端点

```python
neon.endpoint_update(
    project_id='your-project-id',
    endpoint_id='ep-xxx',
    endpoint={'autoscaling_limit_max_cu': 2}
)
```

### 删除端点

```python
neon.endpoint_delete(project_id='your-project-id', endpoint_id='ep-xxx')
```

## API 密钥

### 列出 API 密钥

```python
api_keys = neon.api_keys()
```

### 创建 API 密钥

```python
new_key = neon.api_key_create(key_name='my-script-key')
print(f"Key (store securely!): {new_key.key}")
```

### 撤销 API 密钥

```python
neon.api_key_revoke(1234)  # key ID
```

## 操作

### 列出操作

```python
ops = neon.operations(project_id='your-project-id')
```

### 获取操作详情

```python
op = neon.operation(project_id='your-project-id', operation_id='op-xxx')
```
