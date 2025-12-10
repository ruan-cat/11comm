import type { OptionsType } from "plus-pro-components";

/** 刷新缓存 列表数据 */
export interface 刷新缓存_列表数据 {
	/** 缓存ID */
	缓存ID: string;
	/** 缓存编码 */
	缓存编码: string;
	/** 缓存名称 */
	名称: string;
	/** 缓存键名 */
	缓存键名: string;
	/** 缓存类型 */
	缓存类型: string;
	/** 缓存分组 */
	缓存分组: string;
	/** 过期时间（秒） */
	过期时间: number;
	/** 缓存描述 */
	缓存描述: string;
	/** 刷新策略 */
	刷新策略: string;
	/** 状态 */
	状态: string;
	/** 创建时间 */
	创建时间: string;
	/** 最后更新时间 */
	最后更新时间: string;
}

/** 刷新缓存 列表查询 VO */
export interface 刷新缓存_列表查询_VO {
	缓存ID?: string;
	缓存编码?: string;
	缓存名称?: string;
	缓存键名?: string;
	缓存类型?: string;
	缓存分组?: string;
	状态?: string;
	刷新策略?: string;
}

/** 缓存类型选项 */
export const 缓存类型选项: OptionsType = [
	{ label: "Redis", value: "Redis" },
	{ label: "Memory", value: "Memory" },
	{ label: "Memcached", value: "Memcached" },
	{ label: "Ehcache", value: "Ehcache" },
	{ label: "Caffeine", value: "Caffeine" },
	{ label: "Guava Cache", value: "Guava Cache" },
	{ label: "Hazelcast", value: "Hazelcast" },
	{ label: "Infinispan", value: "Infinispan" },
];

/** 刷新策略选项 */
export const 刷新策略选项: OptionsType = [
	{ label: "定时刷新", value: "定时刷新" },
	{ label: "手动刷新", value: "手动刷新" },
	{ label: "懒加载刷新", value: "懒加载刷新" },
	{ label: "事件触发刷新", value: "事件触发刷新" },
	{ label: "TTL过期刷新", value: "TTL过期刷新" },
	{ label: "LRU淘汰刷新", value: "LRU淘汰刷新" },
];

/** 缓存状态选项 */
export const 缓存状态选项: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
	{ label: "维护中", value: "维护中" },
];

// 生成随机时间
function generateRandomDate(startDaysAgo: number, endDaysAgo: number = 0): string {
	const now = new Date();
	const start = new Date(now.getTime() - startDaysAgo * 24 * 60 * 60 * 1000);
	const end = new Date(now.getTime() - endDaysAgo * 24 * 60 * 60 * 1000);
	const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
	const date = new Date(randomTime);
	return date.toISOString().replace("T", " ").substring(0, 19);
}

// 缓存数据生成
const 缓存数据模板 = [
	{
		名称: "用户信息缓存",
		缓存键名: "user:info:{userId}",
		缓存类型: "Redis",
		缓存分组: "user",
		过期时间: 3600,
		缓存描述: "存储用户基本信息，包括用户名、头像、权限等级等核心数据",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "商品详情缓存",
		缓存键名: "product:detail:{productId}",
		缓存类型: "Redis",
		缓存分组: "product",
		过期时间: 7200,
		缓存描述: "商品详情页数据缓存，包含商品基本信息、价格、库存等",
		刷新策略: "事件触发刷新",
		状态: "启用",
	},
	{
		名称: "系统配置缓存",
		缓存键名: "system:config:{module}",
		缓存类型: "Memory",
		缓存分组: "system",
		过期时间: 86400,
		缓存描述: "系统全局配置参数，包括数据库连接、API接口地址等配置信息",
		刷新策略: "手动刷新",
		状态: "启用",
	},
	{
		名称: "订单状态缓存",
		缓存键名: "order:status:{orderId}",
		缓存类型: "Redis",
		缓存分组: "order",
		过期时间: 1800,
		缓存描述: "订单处理状态缓存，跟踪订单从创建到完成的整个生命周期",
		刷新策略: "事件触发刷新",
		状态: "启用",
	},
	{
		名称: "权限验证缓存",
		缓存键名: "auth:permission:{userId}:{resource}",
		缓存类型: "Caffeine",
		缓存分组: "auth",
		过期时间: 600,
		缓存描述: "用户权限验证结果缓存，提升系统安全校验性能",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "API限流缓存",
		缓存键名: "rate:limit:{api}:{clientIp}",
		缓存类型: "Redis",
		缓存分组: "api",
		过期时间: 60,
		缓存描述: "API接口访问频率限制，防止恶意请求和系统过载",
		刷新策略: "LRU淘汰刷新",
		状态: "启用",
	},
	{
		名称: "导航菜单缓存",
		缓存键名: "menu:navigation:{userId}",
		缓存类型: "Memory",
		缓存分组: "ui",
		过期时间: 3600,
		缓存描述: "用户个性化导航菜单配置，包含快捷入口和常用功能",
		刷新策略: "懒加载刷新",
		状态: "启用",
	},
	{
		名称: "搜索结果缓存",
		缓存键名: "search:result:{keyword}:{page}",
		缓存类型: "Memcached",
		缓存分组: "search",
		过期时间: 900,
		缓存描述: "热门搜索关键词结果缓存，减少数据库查询压力",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "统计数据缓存",
		缓存键名: "statistics:daily:{date}:{type}",
		缓存类型: "Redis",
		缓存分组: "stats",
		过期时间: 43200,
		缓存描述: "日常运营统计数据，包括用户活跃度、订单量、收入等关键指标",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "文件上传临时缓存",
		缓存键名: "upload:temp:{uploadId}",
		缓存类型: "Memory",
		缓存分组: "file",
		过期时间: 300,
		缓存描述: "文件分片上传临时数据，包含已上传分片信息和校验码",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "消息推送队列缓存",
		缓存键名: "message:queue:{userId}",
		缓存类型: "Redis",
		缓存分组: "message",
		过期时间: 1800,
		缓存描述: "用户消息推送队列，存储待发送的系统通知和业务消息",
		刷新策略: "事件触发刷新",
		状态: "维护中",
	},
	{
		名称: "分布式锁缓存",
		缓存键名: "lock:distributed:{resource}:{lockId}",
		缓存类型: "Redis",
		缓存分组: "lock",
		过期时间: 30,
		缓存描述: "分布式系统资源锁，防止并发操作冲突和数据不一致",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "地理位置服务缓存",
		缓存键名: "geo:location:{address}",
		缓存类型: "Redis",
		缓存分组: "geo",
		过期时间: 7200,
		缓存描述: "地址解析和地理位置信息缓存，提升定位服务响应速度",
		刷新策略: "懒加载刷新",
		状态: "启用",
	},
	{
		名称: "验证码缓存",
		缓存键名: "captcha:verify:{session}:{type}",
		缓存类型: "Redis",
		缓存分组: "security",
		过期时间: 300,
		缓存描述: "图形验证码和短信验证码临时存储，用于用户身份验证",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "热点数据缓存",
		缓存键名: "hot:data:{category}:{itemId}",
		缓存类型: "Guava Cache",
		缓存分组: "hot",
		过期时间: 1200,
		缓存描述: "系统热点访问数据，如热门商品、热门文章等高频访问内容",
		刷新策略: "LRU淘汰刷新",
		状态: "启用",
	},
	{
		名称: "计算结果缓存",
		缓存键名: "compute:result:{algorithm}:{params}",
		缓存类型: "Ehcache",
		缓存分组: "compute",
		过期时间: 2400,
		缓存描述: "复杂算法计算结果缓存，避免重复计算提升系统性能",
		刷新策略: "懒加载刷新",
		状态: "启用",
	},
	{
		名称: "库存数据缓存",
		缓存键名: "inventory:stock:{productId}:{warehouse}",
		缓存类型: "Redis",
		缓存分组: "inventory",
		过期时间: 600,
		缓存描述: "实时库存数量缓存，支持高并发查询和订单库存扣减",
		刷新策略: "事件触发刷新",
		状态: "启用",
	},
	{
		名称: "用户会话缓存",
		缓存键名: "session:user:{sessionId}",
		缓存类型: "Redis",
		缓存分组: "session",
		过期时间: 7200,
		缓存描述: "用户登录会话信息，包含登录状态、权限令牌等敏感数据",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "支付流水缓存",
		缓存键名: "payment:transaction:{transactionId}",
		缓存类型: "Redis",
		缓存分组: "payment",
		过期时间: 900,
		缓存描述: "支付交易流水状态，跟踪支付进度和结果回调",
		刷新策略: "事件触发刷新",
		状态: "启用",
	},
	{
		名称: "邮件队列缓存",
		缓存键名: "email:queue:{batchId}",
		缓存类型: "Hazelcast",
		缓存分组: "notification",
		过期时间: 1800,
		缓存描述: "邮件发送队列缓存，存储待发送的营销邮件和系统通知邮件",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "配置中心缓存",
		缓存键名: "config:center:{environment}:{key}",
		缓存类型: "Infinispan",
		缓存分组: "config",
		过期时间: 600,
		缓存描述: "动态配置中心数据缓存，支持应用运行时配置热更新",
		刷新策略: "事件触发刷新",
		状态: "维护中",
	},
	{
		名称: "API接口文档缓存",
		缓存键名: "api:doc:{version}:{endpoint}",
		缓存类型: "Memory",
		缓存分组: "doc",
		过期时间: 3600,
		缓存描述: "RESTful API接口文档缓存，包含请求参数说明和响应示例",
		刷新策略: "手动刷新",
		状态: "启用",
	},
	{
		名称: "数据报表缓存",
		缓存键名: "report:data:{reportId}:{dateRange}",
		缓存类型: "Redis",
		缓存分组: "report",
		过期时间: 1800,
		缓存描述: "业务数据报表生成结果缓存，包含图表数据和汇总统计",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "用户行为记录缓存",
		缓存键名: "behavior:log:{userId}:{action}",
		缓存类型: "Caffeine",
		缓存分组: "behavior",
		过期时间: 3600,
		缓存描述: "用户操作行为日志缓存，用于用户画像分析和个性化推荐",
		刷新策略: "LRU淘汰刷新",
		状态: "启用",
	},
	{
		名称: "CDN节点状态缓存",
		缓存键名: "cdn:node:{nodeId}:{region}",
		缓存类型: "Redis",
		缓存分组: "cdn",
		过期时间: 120,
		缓存描述: "CDN节点健康状态和负载情况缓存，支持智能路由选择",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "数据库连接池缓存",
		缓存键名: "db:pool:{instance}",
		缓存类型: "Memory",
		缓存分组: "database",
		过期时间: 300,
		缓存描述: "数据库连接池状态缓存，监控连接数、空闲连接等关键指标",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "微服务注册缓存",
		缓存键名: "service:registry:{serviceName}",
		缓存类型: "Hazelcast",
		缓存分组: "microservice",
		过期时间: 60,
		缓存描述: "微服务实例注册信息缓存，包含服务地址、健康状态等",
		刷新策略: "事件触发刷新",
		状态: "启用",
	},
	{
		名称: "日志分析缓存",
		缓存键名: "log:analysis:{app}:{level}:{timeRange}",
		缓存类型: "Elasticsearch",
		缓存分组: "log",
		过期时间: 900,
		缓存描述: "应用日志分析结果缓存，包含错误统计、性能趋势等",
		刷新策略: "定时刷新",
		状态: "禁用",
	},
	{
		名称: "图片处理缓存",
		缓存键名: "image:process:{imageUrl}:{size}",
		缓存类型: "Redis",
		缓存分组: "media",
		过期时间: 86400,
		缓存描述: "图片缩略图和处理结果缓存，提升图片访问和加载速度",
		刷新策略: "懒加载刷新",
		状态: "启用",
	},
	{
		名称: "短信发送限制缓存",
		缓存键名: "sms:limit:{phone}:{type}",
		缓存类型: "Redis",
		缓存分组: "sms",
		过期时间: 3600,
		缓存描述: "短信发送频率限制缓存，防止短信轰炸和恶意使用",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "监控告警缓存",
		缓存键名: "monitor:alert:{metric}:{threshold}",
		缓存类型: "Infinispan",
		缓存分组: "monitor",
		过期时间: 300,
		缓存描述: "系统监控告警状态缓存，包含告警级别、处理状态等信息",
		刷新策略: "事件触发刷新",
		状态: "维护中",
	},
	{
		名称: "任务调度缓存",
		缓存键名: "task:schedule:{jobId}",
		缓存类型: "Redis",
		缓存分组: "schedule",
		过期时间: 86400,
		缓存描述: "定时任务调度状态缓存，包含执行历史、下次执行时间等",
		刷新策略: "定时刷新",
		状态: "启用",
	},
	{
		名称: "数据字典缓存",
		缓存键名: "dict:data:{type}:{key}",
		缓存类型: "Memory",
		缓存分组: "dict",
		过期时间: 43200,
		缓存描述: "系统数据字典缓存，包含枚举值、状态码等基础数据",
		刷新策略: "手动刷新",
		状态: "启用",
	},
	{
		名称: "文件元数据缓存",
		缓存键名: "file:metadata:{fileHash}",
		缓存类型: "Redis",
		缓存分组: "storage",
		过期时间: 7200,
		缓存描述: "文件存储元数据缓存，包含文件大小、类型、存储位置等",
		刷新策略: "懒加载刷新",
		状态: "启用",
	},
	{
		名称: "OAuth令牌缓存",
		缓存键名: "oauth:token:{clientId}:{userId}",
		缓存类型: "Redis",
		缓存分组: "oauth",
		过期时间: 3600,
		缓存描述: "OAuth2.0访问令牌和刷新令牌缓存，支持第三方应用授权",
		刷新策略: "TTL过期刷新",
		状态: "启用",
	},
	{
		名称: "设备指纹缓存",
		缓存键名: "device:fingerprint:{deviceId}",
		缓存类型: "Redis",
		缓存分组: "security",
		过期时间: 86400,
		缓存描述: "设备指纹信息缓存，用于设备识别和安全风险控制",
		刷新策略: "懒加载刷新",
		状态: "启用",
	},
	{
		名称: "多语言翻译缓存",
		缓存键名: "i18n:translation:{lang}:{key}",
		缓存类型: "Memory",
		缓存分组: "i18n",
		过期时间: 3600,
		缓存描述: "国际化翻译文本缓存，支持多语言界面动态切换",
		刷新策略: "手动刷新",
		状态: "启用",
	},
];

/** 表格数据 */
export const tableData: 刷新缓存_列表数据[] = 缓存数据模板.map((item, index) => {
	const 创建时间 = generateRandomDate(60, 1);
	const 最后更新时间 = generateRandomDate(30, 0);

	return {
		缓存ID: `CACHE_${(index + 1).toString().padStart(3, "0")}`,
		缓存编码: `${item.缓存类型.toUpperCase()}_${(index + 1).toString().padStart(3, "0")}`,
		...item,
		创建时间,
		最后更新时间,
	};
});
