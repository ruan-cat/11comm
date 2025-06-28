# HTTP 请求拦截器迁移方案

## 一、新旧项目 HTTP 处理对比分析

### 旧项目特点（examples/01s-origin）

#### 1. 核心特性

- **基于 Axios + Pinia**
- **自定义数据上传类型**：支持 form、json、file、stream 四种数据格式
- **丰富的 HTTP 状态码定义**：自定义业务状态码体系
- **完善的权限处理**：支持 token 刷新、权限不足、登录过期等场景
- **Request 工具类**：提供静态方法的请求封装

#### 2. 数据上传类型

```typescript
export const DataUpType = {
	form: 0, // 表单类型：application/x-www-form-urlencoded
	json: 1, // JSON类型：application/json
	file: 2, // 文件类型：multipart/form-data
	stream: 3, // 文件流类型：application/octet-stream
};
```

#### 3. 业务状态码体系

```typescript
http.httpcode = {
	UNAUTHORIZED: 401, // 暂未登录或TOKEN已经过期
	FORBIDDEN: 403, // 没有相关权限
	NOT_FOUND: 404, // 访问页面未找到
	SERVER_ERROR: 9994, // 服务器错误
	PARAMS_INVALID: 9995, // 上传参数异常
	CONTENT_TYPE_ERR: 9996, // ContentType错误
	API_UN_IMPL: 9997, // 功能尚未实现
	SERVER_BUSY: 9998, // 服务器繁忙
	FAIL: 9999, // 操作失败
	SUCCESS: 10000, // 操作成功
};
```

### 新项目特点（apps/admin）

#### 1. 核心特性

- **基于 Axios + Pinia**
- **TypeScript 类型安全**
- **统一的响应拦截**
- **Token 自动刷新机制**
- **请求去重和防护**

#### 2. 已有的优势功能

- ✅ **Token 过期自动刷新**
- ✅ **请求重连机制**
- ✅ **TypeScript 类型支持**
- ✅ **进度条集成（NProgress）**
- ✅ **请求白名单机制**

## 二、需要迁移的核心功能

### 1. 数据上传类型支持

**旧项目优势**：支持多种 Content-Type 的智能切换

### 2. 业务状态码处理

**旧项目优势**：完善的业务错误码体系和对应处理逻辑

### 3. Request 工具类

**旧项目优势**：更简洁的 API 调用方式

### 4. 错误处理机制

**旧项目优势**：更细致的错误分类和用户提示

## 三、具体迁移方案

### 第一阶段：扩展类型定义

在 `apps/admin/src/utils/http/types.d.ts` 中添加：

```typescript
// 扩展数据上传类型
export enum DataUpType {
	FORM = 0, // 表单类型
	JSON = 1, // JSON类型
	FILE = 2, // 文件类型
	STREAM = 3, // 文件流类型
}

// 业务状态码
export enum HttpCode {
	UNAUTHORIZED = 401, // 暂未登录或TOKEN已经过期
	FORBIDDEN = 403, // 没有相关权限
	NOT_FOUND = 404, // 访问页面未找到
	SERVER_ERROR = 9994, // 服务器错误
	PARAMS_INVALID = 9995, // 上传参数异常
	CONTENT_TYPE_ERR = 9996, // ContentType错误
	API_UN_IMPL = 9997, // 功能尚未实现
	SERVER_BUSY = 9998, // 服务器繁忙
	FAIL = 9999, // 操作失败
	SUCCESS = 10000, // 操作成功
}

// 扩展请求配置
export interface PureHttpRequestConfig extends AxiosRequestConfig {
	upType?: DataUpType; // 数据上传类型
	beforeRequestCallback?: (config: PureHttpRequestConfig) => void;
	beforeResponseCallback?: (response: PureHttpResponse) => void;
}

// 业务响应结构
export interface BusinessResponse<T = any> {
	code: number;
	message: string;
	data: T;
	success?: boolean;
}
```

### 第二阶段：增强请求拦截器

修改 `apps/admin/src/utils/http/index.ts` 的请求拦截器：

```typescript
/** 请求拦截 */
private httpInterceptorsRequest(): void {
  PureHttp.axiosInstance.interceptors.request.use(
    async (config: PureHttpRequestConfig): Promise<any> => {
      // 开启进度条动画
      NProgress.start();

      // 处理数据上传类型
      this.handleContentType(config);

      // 处理 Token 逻辑（保留原有逻辑）
      // ... 原有的 token 处理逻辑

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

/** 处理 Content-Type 和数据序列化 */
private handleContentType(config: PureHttpRequestConfig): void {
  const { upType = DataUpType.JSON, data } = config;

  switch (upType) {
    case DataUpType.JSON:
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
      break;

    case DataUpType.FORM:
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      if (data && config.method?.toLowerCase() !== 'get') {
        config.data = stringify(data, { arrayFormat: 'repeat' });
      }
      break;

    case DataUpType.FILE:
      config.headers['Content-Type'] = 'multipart/form-data';
      break;

    case DataUpType.STREAM:
      config.headers['Content-Type'] = 'application/octet-stream';
      break;
  }
}
```

### 第三阶段：增强响应拦截器

修改响应拦截器以支持业务状态码：

```typescript
/** 响应拦截 */
private httpInterceptorsResponse(): void {
  const instance = PureHttp.axiosInstance;
  instance.interceptors.response.use(
    (response: PureHttpResponse) => {
      // 关闭进度条动画
      NProgress.done();

      // 处理业务状态码
      if (response.status === 200 && 'code' in response.data) {
        return this.handleBusinessCode(response);
      }

      // 保留原有逻辑
      const $config = response.config;
      if (typeof $config.beforeResponseCallback === "function") {
        $config.beforeResponseCallback(response);
        return response.data;
      }
      if (PureHttp.initConfig.beforeResponseCallback) {
        PureHttp.initConfig.beforeResponseCallback(response);
        return response.data;
      }
      return response.data;
    },
    (error: PureHttpError) => {
      // 保留原有错误处理逻辑
      const $error = error;
      $error.isCancelRequest = Axios.isCancel($error);
      NProgress.done();

      // 增强网络错误处理
      this.handleNetworkError(error);

      return Promise.reject($error);
    }
  );
}

/** 处理业务状态码 */
private handleBusinessCode(response: PureHttpResponse): Promise<any> {
  const data = response.data as BusinessResponse;
  const userStore = useUserStoreHook();

  switch (data.code) {
    case HttpCode.SUCCESS:
      return Promise.resolve(data);

    case HttpCode.FORBIDDEN:
      ElMessage.error('权限不够，请联系管理员');
      return Promise.reject(data);

    case HttpCode.UNAUTHORIZED:
      // 判断是否是 JWT 过期
      if (typeof data.data === 'string' && data.data.indexOf('Jwt expired at') >= 0) {
        // 触发 token 刷新逻辑（可复用现有机制）
        return this.handleTokenExpired(response);
      } else {
        // 未登录，跳转登录页
        this.handleUnauthorized();
        return Promise.reject(data);
      }

    case HttpCode.NOT_FOUND:
      ElMessage.warning(data.message || '404访问页面不存在');
      return Promise.reject(data);

    case HttpCode.CONTENT_TYPE_ERR:
    case HttpCode.PARAMS_INVALID:
      ElMessage.warning(data.message || '请求参数或请求头错误');
      return Promise.reject(data);

    case HttpCode.SERVER_ERROR:
    case HttpCode.SERVER_BUSY:
      ElMessage.error(data.message || '服务器异常，请稍后重试');
      return Promise.reject(data);

    case HttpCode.API_UN_IMPL:
      ElMessage.warning(data.message || '功能尚未实现');
      return Promise.reject(data);

    default:
      // 其他错误码
      if (data.message) {
        ElMessage.error(data.message);
      }
      return Promise.reject(data);
  }
}

/** 处理 Token 过期 */
private async handleTokenExpired(response: PureHttpResponse): Promise<any> {
  const userStore = useUserStoreHook();
  await userStore.reloadToken();
  userStore.setLoaded(false);

  // 可以选择重新发起原请求或跳转首页
  router.push('/home');
  return Promise.reject(response.data);
}

/** 处理未授权 */
private handleUnauthorized(): void {
  const userStore = useUserStoreHook();
  userStore.resetSaveData();
  router.push('/login');
}

/** 处理网络错误 */
private handleNetworkError(error: any): void {
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    ElMessage.error('连接服务器失败！');
  } else if (error.response?.status === 404) {
    ElMessage.warning('404访问页面不存在');
  }
}
```

### 第四阶段：创建 Request 工具类

创建 `apps/admin/src/utils/http/request.ts`：

```typescript
import { http } from "./index";
import { DataUpType } from "./types.d";

/**
 * 请求回调函数
 */
export type RequestCallback = (res: any) => void;

/**
 * 封装一个Http请求工具类（兼容旧项目API）
 */
export default class Request {
	/** get请求 */
	static get GET() {
		return 1;
	}
	/** post请求 */
	static get POST() {
		return 2;
	}
	/** put请求 */
	static get PUT() {
		return 3;
	}
	/** delete请求 */
	static get DELETE() {
		return 4;
	}

	/**
	 * 发送请求
	 * @param method 请求方式，如Request.GET
	 * @param url 请求地址
	 * @param data 上传数据
	 * @param upType 上传数据方式，如DataUpType.FORM
	 * @param options [可选]其他配置选项
	 * @returns {Promise} 请求发送后的Promise对象
	 */
	static request(method: number, url: string, data: any, upType: DataUpType, options?: any) {
		const config = {
			upType: upType,
			...options,
		};

		switch (method) {
			case Request.GET:
				return http.get(url, { params: data }, config);
			case Request.POST:
				return http.post(url, { data }, config);
			case Request.PUT:
				return http.request("put", url, { data }, config);
			case Request.DELETE:
				return http.request("delete", url, { data }, config);
		}
	}

	/**
	 * 发送表单请求
	 */
	static requestForm(method: number, url: string, data: any, options?: any) {
		return Request.request(method, url, data, DataUpType.FORM, options);
	}

	/**
	 * 发送JSON请求
	 */
	static requestJson(method: number, url: string, data: any, options?: any) {
		return Request.request(method, url, data, DataUpType.JSON, options);
	}

	/**
	 * 发送带文件上传的请求
	 */
	static postFile(url: string, data: any, options?: any) {
		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}
		return Request.request(Request.POST, url, formData, DataUpType.FILE, options);
	}

	/**
	 * 以二进制的方式上传文件
	 */
	static postFileStream(url: string, file: any, success: RequestCallback, fail: RequestCallback, options?: any) {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = function () {
			if (reader.error) {
				fail("文件读取失败");
				return;
			}
			Request.request(Request.POST, url, reader.result, DataUpType.STREAM, options)
				.then((res) => {
					success(res);
				})
				.catch((err) => {
					fail(err);
				});
		};
	}
}

// 导出数据上传类型（兼容旧项目）
export { DataUpType };
```

### 第五阶段：更新 API 调用方式

在 `apps/admin/src/api/` 目录下，现在可以同时使用两种方式：

**方式一：使用新的 http 实例（推荐）**

```typescript
import { http } from "@/utils/http";
import { DataUpType } from "@/utils/http/types.d";

export const loginApi = (data: LoginParams) => {
	return http.post<LoginResult>("/login", { data }, { upType: DataUpType.FORM });
};
```

**方式二：使用 Request 工具类（兼容旧项目）**

```typescript
import Request, { DataUpType } from "@/utils/http/request";

export const loginApi = (data: LoginParams) => {
	return Request.requestForm(Request.POST, "/login", data);
};
```

## 四、可以保留复用的功能

### 1. Token 管理机制 ✅

- 自动 Token 刷新
- Token 过期检测
- 请求重连机制

### 2. TypeScript 类型支持 ✅

- 完整的类型定义
- 泛型支持
- 类型安全

### 3. 进度条集成 ✅

- NProgress 进度指示
- 请求开始/结束自动控制

### 4. 请求配置灵活性 ✅

- 回调函数支持
- 配置选项扩展

## 五、迁移注意事项

### 1. 向后兼容

- 保持原有 API 调用方式不变
- 新功能以扩展方式添加
- 渐进式迁移，避免一次性大改

### 2. 错误处理

- 统一错误提示组件（ElMessage）
- 分层错误处理（网络层、业务层）
- 用户友好的错误信息

### 3. 性能考虑

- 避免重复的拦截器逻辑
- 合理使用缓存机制
- 请求去重和防抖

### 4. 测试验证

- 单元测试覆盖关键逻辑
- 集成测试验证完整流程
- 错误场景测试

## 六、实施步骤

1. **第一步**：扩展类型定义
2. **第二步**：增强请求拦截器
3. **第三步**：增强响应拦截器
4. **第四步**：创建 Request 工具类
5. **第五步**：更新部分 API 调用
6. **第六步**：测试和优化

## 七、验证清单

- [ ] 支持多种 Content-Type
- [ ] 业务状态码正确处理
- [ ] Token 过期自动刷新
- [ ] 权限错误正确跳转
- [ ] 网络错误友好提示
- [ ] 文件上传功能正常
- [ ] 原有功能不受影响
- [ ] TypeScript 类型检查通过
