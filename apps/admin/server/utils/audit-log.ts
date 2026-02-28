/**
 * 审计日志工具
 * @description 记录用户操作日志
 */

import type { H3Event } from "nitro/h3";
import type { UserContext } from "./rls-helpers";

/**
 * 审计日志级别
 */
export enum AuditLevel {
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
}

/**
 * 审计操作类型
 */
export enum AuditAction {
	// 认证相关
	LOGIN = "auth:login",
	LOGOUT = "auth:logout",
	REFRESH_TOKEN = "auth:refresh_token",
	OAUTH_LOGIN = "auth:oauth_login",
	PASSWORD_CHANGE = "auth:password_change",

	// 数据访问
	DATA_READ = "data:read",
	DATA_CREATE = "data:create",
	DATA_UPDATE = "data:update",
	DATA_DELETE = "data:delete",

	// 文件操作
	FILE_UPLOAD = "file:upload",
	FILE_DOWNLOAD = "file:download",
	FILE_DELETE = "file:delete",

	// 系统操作
	CONFIG_VIEW = "config:view",
	CONFIG_UPDATE = "config:update",
	USER_CREATE = "user:create",
	USER_UPDATE = "user:update",
	USER_DELETE = "user:delete",
	ROLE_ASSIGN = "user:role_assign",
}

/**
 * 审计日志内容
 */
export interface AuditLogEntry {
	/** 时间戳 */
	timestamp: string;
	/** 请求 ID */
	requestId?: string;
	/** 用户 ID */
	userId?: string;
	/** 用户邮箱 */
	userEmail?: string;
	/** 用户角色 */
	userRole?: string;
	/** 操作类型 */
	action: AuditAction;
	/** 日志级别 */
	level: AuditLevel;
	/** 操作描述 */
	message: string;
	/** 目标资源 */
	resource?: string;
	/** 资源 ID */
	resourceId?: string;
	/** 请求方法 */
	method?: string;
	/** 请求路径 */
	path?: string;
	/** 客户端 IP */
	ip?: string;
	/** 用户代理 */
	userAgent?: string;
	/** 额外数据 */
	metadata?: Record<string, any>;
	/** 错误信息 */
	error?: string;
}

/**
 * 获取客户端 IP
 */
function getClientIp(event: H3Event): string {
	// 检查 X-Forwarded-For 头（反向代理）
	const forwarded = event.request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	// 检查 X-Real-IP 头
	const realIp = event.request.headers.get("x-real-ip");
	if (realIp) {
		return realIp;
	}

	// 从连接获取
	return event.node.req.socket?.remoteAddress || "unknown";
}

/**
 * 获取用户代理
 */
function getUserAgent(event: H3Event): string {
	return event.request.headers.get("user-agent") || "unknown";
}

/**
 * 创建审计日志条目
 */
function createAuditEntry(
	event: H3Event,
	action: AuditAction,
	message: string,
	level: AuditLevel = AuditLevel.INFO,
	metadata?: Record<string, any>,
): AuditLogEntry {
	const user = event.context.user as UserContext | undefined;

	const entry: AuditLogEntry = {
		timestamp: new Date().toISOString(),
		requestId: event.context.requestId,
		action,
		level,
		message,
		method: event.method,
		path: event.path,
		ip: getClientIp(event),
		userAgent: getUserAgent(event),
		metadata,
	};

	if (user) {
		entry.userId = user.id;
		entry.userEmail = user.email;
		entry.userRole = user.role;
	}

	return entry;
}

/**
 * 写入审计日志
 */
function writeAuditLog(entry: AuditLogEntry): void {
	// 根据级别选择日志方法
	switch (entry.level) {
		case AuditLevel.ERROR:
			console.error(JSON.stringify(entry));
			break;
		case AuditLevel.WARN:
			console.warn(JSON.stringify(entry));
			break;
		default:
			console.log(JSON.stringify(entry));
	}
}

/**
 * 审计日志记录器
 */
export const auditLog = {
	/**
	 * 记录登录
	 */
	login(event: H3Event, success: boolean, metadata?: Record<string, any>) {
		const entry = createAuditEntry(
			event,
			AuditAction.LOGIN,
			success ? "用户登录成功" : "用户登录失败",
			success ? AuditLevel.INFO : AuditLevel.WARN,
			{ ...metadata, success },
		);
		writeAuditLog(entry);
	},

	/**
	 * 记录登出
	 */
	logout(event: H3Event) {
		const entry = createAuditEntry(event, AuditAction.LOGOUT, "用户登出", AuditLevel.INFO);
		writeAuditLog(entry);
	},

	/**
	 * 记录 Token 刷新
	 */
	refreshToken(event: H3Event, success: boolean) {
		const entry = createAuditEntry(
			event,
			AuditAction.REFRESH_TOKEN,
			success ? "Token 刷新成功" : "Token 刷新失败",
			success ? AuditLevel.INFO : AuditLevel.WARN,
		);
		writeAuditLog(entry);
	},

	/**
	 * 记录 OAuth 登录
	 */
	oauthLogin(event: H3Event, provider: string, success: boolean) {
		const entry = createAuditEntry(
			event,
			AuditAction.OAUTH_LOGIN,
			`OAuth 登录 (${provider}): ${success ? "成功" : "失败"}`,
			success ? AuditLevel.INFO : AuditLevel.WARN,
			{ provider, success },
		);
		writeAuditLog(entry);
	},

	/**
	 * 记录数据访问
	 */
	dataAccess(
		event: H3Event,
		action: AuditAction.DATA_READ | AuditAction.DATA_CREATE | AuditAction.DATA_UPDATE | AuditAction.DATA_DELETE,
		resource: string,
		resourceId?: string,
	) {
		const actionMap = {
			[AuditAction.DATA_READ]: "查询",
			[AuditAction.DATA_CREATE]: "创建",
			[AuditAction.DATA_UPDATE]: "更新",
			[AuditAction.DATA_DELETE]: "删除",
		};
		const entry = createAuditEntry(event, action, `${actionMap[action]} ${resource}`, AuditLevel.INFO, {
			resource,
			resourceId,
		});
		entry.resource = resource;
		entry.resourceId = resourceId;
		writeAuditLog(entry);
	},

	/**
	 * 记录文件操作
	 */
	fileOperation(
		event: H3Event,
		action: AuditAction.FILE_UPLOAD | AuditAction.FILE_DOWNLOAD | AuditAction.FILE_DELETE,
		filename: string,
	) {
		const actionMap = {
			[AuditAction.FILE_UPLOAD]: "上传",
			[AuditAction.FILE_DOWNLOAD]: "下载",
			[AuditAction.FILE_DELETE]: "删除",
		};
		const entry = createAuditEntry(event, action, `${actionMap[action]} 文件: ${filename}`, AuditLevel.INFO, {
			filename,
		});
		writeAuditLog(entry);
	},

	/**
	 * 记录配置变更
	 */
	configUpdate(event: H3Event, configKey: string, oldValue?: any, newValue?: any) {
		const entry = createAuditEntry(event, AuditAction.CONFIG_UPDATE, `更新配置: ${configKey}`, AuditLevel.INFO, {
			configKey,
			oldValue,
			newValue,
		});
		writeAuditLog(entry);
	},

	/**
	 * 记录用户操作
	 */
	userOperation(
		event: H3Event,
		action: AuditAction.USER_CREATE | AuditAction.USER_UPDATE | AuditAction.USER_DELETE | AuditAction.ROLE_ASSIGN,
		targetUserId: string,
		metadata?: Record<string, any>,
	) {
		const actionMap = {
			[AuditAction.USER_CREATE]: "创建用户",
			[AuditAction.USER_UPDATE]: "更新用户",
			[AuditAction.USER_DELETE]: "删除用户",
			[AuditAction.ROLE_ASSIGN]: "分配角色",
		};
		const entry = createAuditEntry(event, action, `${actionMap[action]}: ${targetUserId}`, AuditLevel.INFO, {
			targetUserId,
			...metadata,
		});
		entry.resourceId = targetUserId;
		writeAuditLog(entry);
	},

	/**
	 * 记录错误
	 */
	error(event: H3Event, action: AuditAction, message: string, error?: Error) {
		const entry = createAuditEntry(event, action, message, AuditLevel.ERROR, {
			error: error?.message,
			stack: error?.stack,
		});
		entry.error = error?.message;
		writeAuditLog(entry);
	},

	/**
	 * 自定义审计日志
	 */
	custom(
		event: H3Event,
		action: AuditAction | string,
		message: string,
		level: AuditLevel = AuditLevel.INFO,
		metadata?: Record<string, any>,
	) {
		const entry = createAuditEntry(event, action as AuditAction, message, level, metadata);
		writeAuditLog(entry);
	},

	/**
	 * 记录敏感数据访问
	 * @description 当访问敏感个人数据时记录审计日志
	 */
	sensitiveDataAccess(event: H3Event, dataType: string, resourceId?: string, fields?: string[]) {
		const entry = createAuditEntry(event, AuditAction.DATA_READ, `访问敏感数据: ${dataType}`, AuditLevel.INFO, {
			dataType,
			resourceId,
			fields,
		});
		entry.resource = dataType;
		entry.resourceId = resourceId;
		writeAuditLog(entry);
	},

	/**
	 * 记录密码修改
	 */
	passwordChange(event: H3Event, targetUserId: string, success: boolean) {
		const entry = createAuditEntry(
			event,
			AuditAction.PASSWORD_CHANGE,
			success ? "密码修改成功" : "密码修改失败",
			success ? AuditLevel.INFO : AuditLevel.WARN,
			{ targetUserId, success },
		);
		entry.resourceId = targetUserId;
		writeAuditLog(entry);
	},

	/**
	 * 记录权限不足
	 */
	permissionDenied(event: H3Event, requiredPermission: string) {
		const entry = createAuditEntry(
			event,
			AuditAction.DATA_READ,
			`权限不足: 需要 ${requiredPermission}`,
			AuditLevel.WARN,
			{ requiredPermission },
		);
		writeAuditLog(entry);
	},

	/**
	 * 记录数据导出
	 */
	dataExport(event: H3Event, resource: string, recordCount: number) {
		const entry = createAuditEntry(
			event,
			AuditAction.DATA_READ,
			`导出数据: ${resource} (${recordCount} 条记录)`,
			AuditLevel.INFO,
			{ resource, recordCount },
		);
		entry.resource = resource;
		writeAuditLog(entry);
	},
};
