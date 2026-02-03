/**
 * @file 运营团队模块 Schema
 * @description 定义运营团队相关的表结构，前缀 op_
 */

import {
	index,
	pgTable,
	text,
	timestamp,
	varchar,
	integer,
	decimal,
	date,
	boolean,
	jsonb,
	uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps, remarkField, statusEnum } from "./common";
import { cmCommunities } from "./community";

/** 商户信息表 */
export const opMerchants = pgTable(
	"op_merchants",
	{
		id: primaryId(),
		/** 商户名称 */
		merchantName: varchar("merchant_name", { length: 100 }).notNull(),
		/** 商户编码 */
		merchantCode: varchar("merchant_code", { length: 50 }).notNull(),
		/** 商户类型 */
		merchantType: varchar("merchant_type", { length: 50 }),
		/** 联系人 */
		contactPerson: varchar("contact_person", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 营业执照 */
		businessLicense: varchar("business_license", { length: 100 }),
		/** 法定代表人 */
		legalRepresentative: varchar("legal_representative", { length: 50 }),
		/** 注册地址 */
		registeredAddress: text("registered_address"),
		/** 注册资本 */
		registeredCapital: decimal("registered_capital", { precision: 14, scale: 2 }),
		/** 成立日期 */
		establishedDate: date("established_date"),
		/** 经营地址 */
		businessAddress: text("business_address"),
		/** 经营范围 */
		businessScope: text("business_scope"),
		/** 营业时间 */
		businessHours: varchar("business_hours", { length: 100 }),
		/** 经营面积 */
		businessArea: decimal("business_area", { precision: 10, scale: 2 }),
		/** 服务小区（多选，逗号分隔） */
		serviceCommunities: text("service_communities"),
		/** 合同开始日期 */
		contractStartDate: date("contract_start_date"),
		/** 合同结束日期 */
		contractEndDate: date("contract_end_date"),
		/** 开户银行 */
		bankName: varchar("bank_name", { length: 100 }),
		/** 银行账号 */
		bankAccount: varchar("bank_account", { length: 50 }),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("op_merchants_name_idx").on(table.merchantName),
		index("op_merchants_code_idx").on(table.merchantCode),
	],
);

/** 商户管理员表 */
export const opMerchantAdmins = pgTable("op_merchant_admins", {
	id: primaryId(),
	/** 关联商户 ID */
	merchantId: uuid("merchant_id")
		.references(() => opMerchants.id)
		.notNull(),
	/** 管理员姓名 */
	adminName: varchar("admin_name", { length: 50 }).notNull(),
	/** 手机号 */
	phone: varchar("phone", { length: 20 }),
	/** 邮箱 */
	email: varchar("email", { length: 100 }),
	/** 账号 */
	account: varchar("account", { length: 50 }),
	/** 角色 */
	role: varchar("role", { length: 50 }),
	...timestamps,
});

/** 物业公司表 */
export const opPropertyCompanies = pgTable(
	"op_property_companies",
	{
		id: primaryId(),
		/** 公司名称 */
		companyName: varchar("company_name", { length: 100 }).notNull(),
		/** 公司编码 */
		companyCode: varchar("company_code", { length: 50 }),
		/** 联系人 */
		contactPerson: varchar("contact_person", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 公司地址 */
		address: text("address"),
		/** 资质等级 */
		qualificationLevel: varchar("qualification_level", { length: 50 }),
		/** 资质证书编号 */
		qualificationCertNo: varchar("qualification_cert_no", { length: 100 }),
		/** 资质有效期 */
		qualificationValidUntil: date("qualification_valid_until"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("op_property_companies_name_idx").on(table.companyName)],
);

/** 运营侧小区信息表 */
export const opCommunityInfo = pgTable("op_community_info", {
	id: primaryId(),
	/** 关联小区 ID */
	communityId: uuid("community_id")
		.references(() => cmCommunities.id)
		.notNull(),
	/** 运营状态 */
	operationStatus: varchar("operation_status", { length: 50 }),
	/** 管理员 */
	administrator: varchar("administrator", { length: 50 }),
	/** 运营配置（JSON） */
	operationConfig: jsonb("operation_config"),
	...timestamps,
});

/** 小区配置表 */
export const opCommunityConfigs = pgTable("op_community_configs", {
	id: primaryId(),
	/** 关联小区 ID */
	communityId: uuid("community_id")
		.references(() => cmCommunities.id)
		.notNull(),
	/** 配置类型 */
	configType: varchar("config_type", { length: 50 }),
	/** 配置键 */
	configKey: varchar("config_key", { length: 100 }).notNull(),
	/** 配置值 */
	configValue: text("config_value"),
	/** 配置分组 */
	configGroup: varchar("config_group", { length: 50 }),
	...timestamps,
});

/** 报表分组表 */
export const opReportGroups = pgTable("op_report_groups", {
	id: primaryId(),
	/** 分组名称 */
	groupName: varchar("group_name", { length: 100 }).notNull(),
	/** 分组编码 */
	groupCode: varchar("group_code", { length: 50 }),
	/** 分组描述 */
	groupDescription: text("group_description"),
	/** 排序序号 */
	sortOrder: integer("sort_order").default(0),
	...timestamps,
});

/** 报表信息表 */
export const opReportInfos = pgTable("op_report_infos", {
	id: primaryId(),
	/** 关联分组 ID */
	groupId: uuid("group_id").references(() => opReportGroups.id),
	/** 报表名称 */
	reportName: varchar("report_name", { length: 100 }).notNull(),
	/** 报表编码 */
	reportCode: varchar("report_code", { length: 50 }),
	/** 报表类型 */
	reportType: varchar("report_type", { length: 50 }),
	/** 数据源配置 */
	dataSourceConfig: text("data_source_config"),
	...timestamps,
});

/** 报表组件表 */
export const opReportComponents = pgTable("op_report_components", {
	id: primaryId(),
	/** 关联报表 ID */
	reportId: uuid("report_id")
		.references(() => opReportInfos.id)
		.notNull(),
	/** 组件名称 */
	componentName: varchar("component_name", { length: 100 }).notNull(),
	/** 组件类型 */
	componentType: varchar("component_type", { length: 50 }),
	/** 组件配置（JSON） */
	componentConfig: jsonb("component_config"),
	...timestamps,
});

/** 运营侧注册协议表 */
export const opRegisterProtocols = pgTable("op_register_protocols", {
	id: primaryId(),
	/** 协议类型 */
	protocolType: varchar("protocol_type", { length: 50 }),
	/** 协议标题 */
	protocolTitle: varchar("protocol_title", { length: 200 }).notNull(),
	/** 协议内容 */
	protocolContent: text("protocol_content"),
	/** 是否必选 */
	isRequired: boolean("is_required").default(true),
	...timestamps,
});
