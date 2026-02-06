/**
 * @file 合同管理模块 Schema
 * @description 定义合同管理相关的表结构，前缀 ct_
 */

import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
	decimal,
	date,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { isNull } from "drizzle-orm";
import { primaryId, timestamps, softDelete, remarkField, statusEnum, auditStatusEnum } from "./common";
import { hpOwners } from "./house-property";

/** 合同状态枚举 - 草稿/待审核/已生效/已到期/已终止 */
export const contractStatusEnum = pgEnum("contract_status", [
	"draft",
	"pending_review",
	"effective",
	"expired",
	"terminated",
]);

/** 模板状态枚举 - 草稿/已发布/已停用 */
export const templateStatusEnum = pgEnum("template_status", ["draft", "published", "disabled"]);

/** 合同甲方表 */
export const ctFirstParties = pgTable(
	"ct_first_parties",
	{
		id: primaryId(),
		/** 甲方名称 */
		name: varchar("name", { length: 200 }).notNull(),
		/** 联系人 */
		contactPerson: varchar("contact_person", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 地址 */
		address: text("address"),
		/** 统一社会信用代码 */
		creditCode: varchar("credit_code", { length: 50 }),
		/** 成立日期 */
		establishedDate: date("established_date"),
		/** 法定代表人 */
		legalRepresentative: varchar("legal_representative", { length: 50 }),
		/** 经营范围 */
		businessScope: text("business_scope"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_first_parties_status_idx").on(table.status)],
);

/** 合同乙方表 */
export const ctSecondParties = pgTable(
	"ct_second_parties",
	{
		id: primaryId(),
		/** 乙方名称 */
		name: varchar("name", { length: 200 }).notNull(),
		/** 乙方类型 */
		partyType: varchar("party_type", { length: 50 }),
		/** 联系人 */
		contactPerson: varchar("contact_person", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 地址 */
		address: text("address"),
		/** 关联业主 ID（可选） */
		ownerId: uuid("owner_id").references(() => hpOwners.id),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_second_parties_owner_id_idx").on(table.ownerId)],
);

/** 合同模板表 */
export const ctTemplates = pgTable(
	"ct_templates",
	{
		id: primaryId(),
		/** 模板名称 */
		templateName: varchar("template_name", { length: 200 }).notNull(),
		/** 模板类型 */
		templateType: varchar("template_type", { length: 50 }),
		/** 模板内容 */
		templateContent: text("template_content"),
		/** 版本号 */
		version: varchar("version", { length: 20 }),
		/** 状态 */
		status: templateStatusEnum("status").default("draft"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_templates_status_idx").on(table.status)],
);

/** 合同条款表 */
export const ctClauses = pgTable(
	"ct_clauses",
	{
		id: primaryId(),
		/** 关联模板 ID */
		templateId: uuid("template_id")
			.references(() => ctTemplates.id)
			.notNull(),
		/** 条款名称 */
		clauseName: varchar("clause_name", { length: 200 }).notNull(),
		/** 条款内容 */
		clauseContent: text("clause_content"),
		/** 条款类型 */
		clauseType: varchar("clause_type", { length: 50 }),
		/** 排序号 */
		sortOrder: integer("sort_order").default(0),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_clauses_template_id_idx").on(table.templateId)],
);

/** 合同类型表 */
export const ctTypes = pgTable("ct_types", {
	id: primaryId(),
	/** 类型名称 */
	typeName: varchar("type_name", { length: 100 }).notNull(),
	/** 类型编码 */
	typeCode: varchar("type_code", { length: 50 }),
	/** 类型描述 */
	typeDescription: text("type_description"),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 合同信息表 */
export const ctContracts = pgTable(
	"ct_contracts",
	{
		id: primaryId(),
		/** 合同名称 */
		contractName: varchar("contract_name", { length: 200 }).notNull(),
		/** 合同编号 */
		contractNumber: varchar("contract_number", { length: 100 }).notNull(),
		/** 合同类型 */
		contractType: varchar("contract_type", { length: 50 }),
		/** 合同金额 */
		amount: decimal("amount", { precision: 12, scale: 2 }),
		/** 甲方 ID */
		firstPartyId: uuid("first_party_id").references(() => ctFirstParties.id),
		/** 乙方 ID */
		secondPartyId: uuid("second_party_id").references(() => ctSecondParties.id),
		/** 开始时间 */
		startTime: timestamp("start_time"),
		/** 结束时间 */
		endTime: timestamp("end_time"),
		/** 签订日期 */
		signDate: date("sign_date"),
		/** 合同状态 */
		status: contractStatusEnum("status").default("draft"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
		...softDelete,
	},
	(table) => [
		uniqueIndex("ct_contracts_contract_number_idx").on(table.contractNumber).where(isNull(table.deletedAt)),
		index("ct_contracts_status_idx").on(table.status),
		index("ct_contracts_first_party_id_idx").on(table.firstPartyId),
		index("ct_contracts_second_party_id_idx").on(table.secondPartyId),
	],
);

/** 合同附件表 */
export const ctAttachments = pgTable(
	"ct_attachments",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id, { onDelete: "cascade" })
			.notNull(),
		/** 附件名称 */
		attachmentName: varchar("attachment_name", { length: 200 }).notNull(),
		/** 附件类型 */
		attachmentType: varchar("attachment_type", { length: 50 }),
		/** 文件路径 */
		filePath: text("file_path"),
		/** 文件大小（字节） */
		fileSize: integer("file_size"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_attachments_contract_id_idx").on(table.contractId)],
);

/** 合同变更表 */
export const ctChanges = pgTable(
	"ct_changes",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 变更类型 */
		changeType: varchar("change_type", { length: 50 }),
		/** 变更原因 */
		changeReason: text("change_reason"),
		/** 变更内容 */
		changeContent: text("change_content"),
		/** 变更日期 */
		changeDate: date("change_date"),
		/** 审批状态 */
		approvalStatus: auditStatusEnum("approval_status").default("pending"),
		/** 审批人 */
		approver: varchar("approver", { length: 50 }),
		/** 审批时间 */
		approvalTime: timestamp("approval_time"),
		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [
		index("ct_changes_contract_id_idx").on(table.contractId),
		index("ct_changes_approval_status_idx").on(table.approvalStatus),
	],
);

/** 合同审核表 */
export const ctReviews = pgTable(
	"ct_reviews",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 审核人 */
		reviewer: varchar("reviewer", { length: 50 }),
		/** 审核意见 */
		reviewOpinion: text("review_opinion"),
		/** 审核结果 */
		reviewResult: auditStatusEnum("review_result"),
		/** 审核时间 */
		reviewTime: timestamp("review_time"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_reviews_contract_id_idx").on(table.contractId)],
);

/** 合同归档表 */
export const ctArchives = pgTable(
	"ct_archives",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 归档编号 */
		archiveNo: varchar("archive_no", { length: 100 }),
		/** 归档日期 */
		archiveDate: date("archive_date"),
		/** 归档位置 */
		archiveLocation: varchar("archive_location", { length: 200 }),
		/** 归档人 */
		archiver: varchar("archiver", { length: 50 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_archives_contract_id_idx").on(table.contractId)],
);

/** 合同打印记录表 */
export const ctPrints = pgTable(
	"ct_prints",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 打印人 */
		printer: varchar("printer", { length: 50 }),
		/** 打印时间 */
		printTime: timestamp("print_time"),
		/** 打印份数 */
		printCount: integer("print_count").default(1),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_prints_contract_id_idx").on(table.contractId)],
);
