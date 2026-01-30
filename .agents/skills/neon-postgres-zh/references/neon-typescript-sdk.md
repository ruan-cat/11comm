# Neon TypeScript SDK

`@neondatabase/api-client` TypeScript SDK 是 Neon REST API 的类型化封装。它提供了管理所有 Neon 资源的方法，包括项目、分支、端点、角色和数据库。

有关核心概念（组织、项目、分支、端点等），请参阅 `what-is-neon.md`。

## 文档

```bash
curl -H "Accept: text/markdown" https://neon.com/docs/reference/typescript-sdk
```

## 安装

```bash
npm install @neondatabase/api-client
```

## 身份验证

```typescript
import { createApiClient } from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY;
if (!apiKey) {
	throw new Error("NEON_API_KEY environment variable is not set.");
}

const apiClient = createApiClient({ apiKey });
```

## 项目

### 列出项目

```typescript
const response = await apiClient.listProjects({});
console.log("Projects:", response.data.projects);
```

### 创建项目

```typescript
const response = await apiClient.createProject({
	project: { name: "my-project", pg_version: 17, region_id: "aws-us-east-2" },
});
console.log("Connection URI:", response.data.connection_uris[0]?.connection_uri);
```

### 获取项目

```typescript
const response = await apiClient.getProject("your-project-id");
```

### 更新项目

```typescript
await apiClient.updateProject("your-project-id", {
	project: { name: "new-name" },
});
```

### 删除项目

```typescript
await apiClient.deleteProject("project-id");
```

### 获取连接 URI

```typescript
const response = await apiClient.getConnectionUri({
	projectId: "your-project-id",
	database_name: "neondb",
	role_name: "neondb_owner",
	pooled: true,
});
console.log("URI:", response.data.uri);
```

## 分支

### 创建分支

```typescript
import { EndpointType } from "@neondatabase/api-client";

const response = await apiClient.createProjectBranch("your-project-id", {
	branch: { name: "feature-branch" },
	endpoints: [{ type: EndpointType.ReadWrite, autoscaling_limit_max_cu: 1 }],
});
```

### 列出分支

```typescript
const response = await apiClient.listProjectBranches({
	projectId: "your-project-id",
});
```

### 获取分支

```typescript
const response = await apiClient.getProjectBranch("your-project-id", "br-xxx");
```

### 更新分支

```typescript
await apiClient.updateProjectBranch("your-project-id", "br-xxx", {
	branch: { name: "updated-name" },
});
```

### 删除分支

```typescript
await apiClient.deleteProjectBranch("your-project-id", "br-xxx");
```

## 数据库

### 创建数据库

```typescript
await apiClient.createProjectBranchDatabase("your-project-id", "br-xxx", {
	database: { name: "my-app-db", owner_name: "neondb_owner" },
});
```

### 列出数据库

```typescript
const response = await apiClient.listProjectBranchDatabases("your-project-id", "br-xxx");
```

### 删除数据库

```typescript
await apiClient.deleteProjectBranchDatabase("your-project-id", "br-xxx", "my-app-db");
```

## 角色

### 创建角色

```typescript
const response = await apiClient.createProjectBranchRole("your-project-id", "br-xxx", {
	role: { name: "app_user" },
});
console.log("Password:", response.data.role.password);
```

### 列出角色

```typescript
const response = await apiClient.listProjectBranchRoles("your-project-id", "br-xxx");
```

### 删除角色

```typescript
await apiClient.deleteProjectBranchRole("your-project-id", "br-xxx", "app_user");
```

## 端点

### 创建端点

```typescript
import { EndpointType } from "@neondatabase/api-client";

const response = await apiClient.createProjectEndpoint("your-project-id", {
	endpoint: { branch_id: "br-xxx", type: EndpointType.ReadOnly },
});
```

### 列出端点

```typescript
const response = await apiClient.listProjectEndpoints("your-project-id");
```

### 启动/暂停/重启端点

```typescript
// 启动
await apiClient.startProjectEndpoint("your-project-id", "ep-xxx");

// 暂停
await apiClient.suspendProjectEndpoint("your-project-id", "ep-xxx");

// 重启
await apiClient.restartProjectEndpoint("your-project-id", "ep-xxx");
```

### 更新端点

```typescript
await apiClient.updateProjectEndpoint("your-project-id", "ep-xxx", {
	endpoint: { autoscaling_limit_max_cu: 2 },
});
```

### 删除端点

```typescript
await apiClient.deleteProjectEndpoint("your-project-id", "ep-xxx");
```

## API 密钥

### 列出 API 密钥

```typescript
const response = await apiClient.listApiKeys();
```

### 创建 API 密钥

```typescript
const response = await apiClient.createApiKey({ key_name: "my-script-key" });
console.log("Key:", response.data.key); // 安全存储！
```

### 撤销 API 密钥

```typescript
await apiClient.revokeApiKey(1234);
```

## 操作

### 列出操作

```typescript
const response = await apiClient.listProjectOperations({
	projectId: "your-project-id",
});
```

### 获取操作

```typescript
const response = await apiClient.getProjectOperation("your-project-id", "op-xxx");
```

## 组织

### 获取组织

```typescript
const response = await apiClient.getOrganization("org-xxx");
```

### 列出成员

```typescript
const response = await apiClient.getOrganizationMembers("org-xxx");
```

### 创建组织 API 密钥

```typescript
const response = await apiClient.createOrgApiKey("org-xxx", {
	key_name: "ci-key",
	project_id: "project-xxx", // 可选：限定到项目
});
```

### 邀请成员

```typescript
import { MemberRole } from "@neondatabase/api-client";

await apiClient.createOrganizationInvitations("org-xxx", {
	invitations: [{ email: "dev@example.com", role: MemberRole.Member }],
});
```

## 错误处理

```typescript
async function safeApiOperation(projectId: string) {
	try {
		const response = await apiClient.getProject(projectId);
		return response.data;
	} catch (error: any) {
		if (error.isAxiosError) {
			const status = error.response?.status;
			switch (status) {
				case 401:
					console.error("Check your NEON_API_KEY");
					break;
				case 404:
					console.error("Resource not found");
					break;
				case 429:
					console.error("Rate limit exceeded");
					break;
				default:
					console.error("API error:", error.response?.data?.message);
			}
		}
		return null;
	}
}
```
