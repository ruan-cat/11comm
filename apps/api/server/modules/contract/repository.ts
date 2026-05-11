import { and, desc, eq, like, sql } from "drizzle-orm";
import {
	ctArchives,
	ctAttachments,
	ctChanges,
	ctClauses,
	ctContracts,
	ctFirstParties,
	ctPrints,
	ctReviews,
	ctSecondParties,
	ctTemplates,
	ctTypes,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminArchiveListItem,
	AdminAttachmentListItem,
	AdminChangeListItem,
	AdminClauseListItem,
	AdminDraftContractListItem,
	AdminExpireListItem,
	AdminFirstPartyListItem,
	AdminPrintListItem,
	AdminReviewListItem,
	AdminSecondPartyListItem,
	AdminTemplateListItem,
	AdminContractTypeListItem,
	ListArchiveParams,
	ListAttachmentParams,
	ListChangeParams,
	ListClauseParams,
	ListDraftContractParams,
	ListExpireParams,
	ListFirstPartyParams,
	ListPrintParams,
	ListReviewParams,
	ListSecondPartyParams,
	ListTemplateParams,
	ListContractTypeParams,
} from "./types";

export interface ContractRepository {
	listArchive: (params: ListArchiveParams) => Promise<{ list: AdminArchiveListItem[]; total: number }>;
	listAttachment: (params: ListAttachmentParams) => Promise<{ list: AdminAttachmentListItem[]; total: number }>;
	listChange: (params: ListChangeParams) => Promise<{ list: AdminChangeListItem[]; total: number }>;
	listClause: (params: ListClauseParams) => Promise<{ list: AdminClauseListItem[]; total: number }>;
	listDraftContract: (
		params: ListDraftContractParams,
	) => Promise<{ list: AdminDraftContractListItem[]; total: number }>;
	listExpire: (params: ListExpireParams) => Promise<{ list: AdminExpireListItem[]; total: number }>;
	listFirstParty: (params: ListFirstPartyParams) => Promise<{ list: AdminFirstPartyListItem[]; total: number }>;
	listPrint: (params: ListPrintParams) => Promise<{ list: AdminPrintListItem[]; total: number }>;
	listReview: (params: ListReviewParams) => Promise<{ list: AdminReviewListItem[]; total: number }>;
	listSecondParty: (params: ListSecondPartyParams) => Promise<{ list: AdminSecondPartyListItem[]; total: number }>;
	listTemplate: (params: ListTemplateParams) => Promise<{ list: AdminTemplateListItem[]; total: number }>;
	listContractType: (params: ListContractTypeParams) => Promise<{ list: AdminContractTypeListItem[]; total: number }>;
}

export function createContractRepository(options: { db?: DbType } = {}): ContractRepository {
	return options.db ? createDbContractRepository(options.db) : createInMemoryContractRepository();
}

export function createDbContractRepository(db: DbType): ContractRepository {
	const fallback = createInMemoryContractRepository();

	return Object.assign(fallback, {
		async listArchive(params: ListArchiveParams): Promise<{ list: AdminArchiveListItem[]; total: number }> {
			const conditions = [];
			if (params.contractName) conditions.push(like(ctContracts.contractName, `%${params.contractName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));
			if (params.archiveNo) conditions.push(like(ctArchives.archiveNo, `%${params.archiveNo}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countSubQuery = db
				.select({ archiveId: ctArchives.id })
				.from(ctArchives)
				.leftJoin(ctContracts, eq(ctArchives.contractId, ctContracts.id))
				.where(where)
				.as("count_sub");
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(countSubQuery);

			const rows = await db
				.select({
					id: ctArchives.id,
					contractName: ctContracts.contractName,
					contractNumber: ctContracts.contractNumber,
					contractType: ctContracts.contractType,
					partyA: ctFirstParties.name,
					partyB: ctSecondParties.name,
					contractAmount: ctContracts.amount,
					startTime: ctContracts.startTime,
					endTime: ctContracts.endTime,
					archiveDate: ctArchives.archiveDate,
					archiver: ctArchives.archiver,
					archiveNo: ctArchives.archiveNo,
					archiveLocation: ctArchives.archiveLocation,
					status: ctContracts.status,
					remark: ctArchives.remark,
					createTime: ctArchives.createTime,
					updateTime: ctArchives.updateTime,
				})
				.from(ctArchives)
				.leftJoin(ctContracts, eq(ctArchives.contractId, ctContracts.id))
				.leftJoin(ctFirstParties, eq(ctContracts.firstPartyId, ctFirstParties.id))
				.leftJoin(ctSecondParties, eq(ctContracts.secondPartyId, ctSecondParties.id))
				.where(where)
				.orderBy(desc(ctArchives.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractName: row.contractName || "",
					contractNumber: row.contractNumber || "",
					contractType: row.contractType || "",
					partyA: row.partyA || "",
					partyB: row.partyB || "",
					archiveNo: row.archiveNo || "",
					archiveDate: row.archiveDate || "",
					archiveLocation: row.archiveLocation || "",
					archiver: row.archiver || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listAttachment(params: ListAttachmentParams): Promise<{ list: AdminAttachmentListItem[]; total: number }> {
			const conditions = [];
			if (params.attachmentName) conditions.push(like(ctAttachments.attachmentName, `%${params.attachmentName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));
			if (params.attachmentType) conditions.push(eq(ctAttachments.attachmentType, params.attachmentType));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctAttachments)
				.where(where);
			const rows = await db
				.select({
					id: ctAttachments.id,
					contractId: ctAttachments.contractId,
					contractName: ctContracts.contractName,
					contractNumber: ctContracts.contractNumber,
					attachmentName: ctAttachments.attachmentName,
					attachmentType: ctAttachments.attachmentType,
					mimeType: ctAttachments.mimeType,
					fileSize: ctAttachments.fileSize,
					filePath: ctAttachments.filePath,
					uploadStatus: ctAttachments.uploadStatus,
					remark: ctAttachments.remark,
					createTime: ctAttachments.createTime,
					updateTime: ctAttachments.updateTime,
				})
				.from(ctAttachments)
				.leftJoin(ctContracts, eq(ctAttachments.contractId, ctContracts.id))
				.where(where)
				.orderBy(desc(ctAttachments.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractId: row.contractId || "",
					contractName: row.contractName || "",
					attachmentName: row.attachmentName || "",
					contractNumber: row.contractNumber || "",
					attachmentType: row.attachmentType || "",
					mimeType: row.mimeType || "",
					fileSize: row.fileSize,
					filePath: row.filePath || "",
					uploadStatus: row.uploadStatus || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listChange(params: ListChangeParams): Promise<{ list: AdminChangeListItem[]; total: number }> {
			const conditions = [];
			if (params.contractName) conditions.push(like(ctContracts.contractName, `%${params.contractName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));
			if (params.approvalStatus) conditions.push(eq(ctChanges.approvalStatus, params.approvalStatus as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctChanges)
				.where(where);
			const rows = await db
				.select({
					id: ctChanges.id,
					contractId: ctChanges.contractId,
					contractName: ctContracts.contractName,
					contractNumber: ctContracts.contractNumber,
					contractType: ctContracts.contractType,
					partyA: ctFirstParties.name,
					partyB: ctSecondParties.name,
					changeType: ctChanges.changeType,
					changer: ctChanges.changer,
					changeTime: ctChanges.changeTime,
					description: ctChanges.description,
					approvalStatus: ctChanges.approvalStatus,
					remark: ctChanges.remark,
					createTime: ctChanges.createTime,
					updateTime: ctChanges.updateTime,
				})
				.from(ctChanges)
				.leftJoin(ctContracts, eq(ctChanges.contractId, ctContracts.id))
				.leftJoin(ctFirstParties, eq(ctContracts.firstPartyId, ctFirstParties.id))
				.leftJoin(ctSecondParties, eq(ctContracts.secondPartyId, ctSecondParties.id))
				.where(where)
				.orderBy(desc(ctChanges.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractName: row.contractName || "",
					contractNumber: row.contractNumber || "",
					contractType: row.contractType || "",
					partyA: row.partyA || "",
					partyB: row.partyB || "",
					changeType: row.changeType || "",
					changer: row.changer || "",
					changeTime: formatDateTime(row.changeTime),
					description: row.description || "",
					approvalStatus: row.approvalStatus || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listClause(params: ListClauseParams): Promise<{ list: AdminClauseListItem[]; total: number }> {
			const conditions = [];
			if (params.clauseName) conditions.push(like(ctClauses.clauseName, `%${params.clauseName}%`));
			if (params.clauseType) conditions.push(eq(ctClauses.clauseType, params.clauseType));
			if (params.templateId) conditions.push(eq(ctClauses.templateId, params.templateId));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctClauses)
				.where(where);
			const rows = await db
				.select()
				.from(ctClauses)
				.where(where)
				.orderBy(desc(ctClauses.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					templateId: row.templateId || "",
					clauseName: row.clauseName || "",
					clauseType: row.clauseType || "",
					clauseContent: row.clauseContent || "",
					sortOrder: row.sortOrder || 0,
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listDraftContract(
			params: ListDraftContractParams,
		): Promise<{ list: AdminDraftContractListItem[]; total: number }> {
			const conditions = [eq(ctContracts.status, "draft" as any)];
			if (params.contractName) conditions.push(like(ctContracts.contractName, `%${params.contractName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));
			if (params.contractType) conditions.push(eq(ctContracts.contractType, params.contractType));

			const where = and(...conditions);
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctContracts)
				.where(where);
			const rows = await db
				.select()
				.from(ctContracts)
				.where(where)
				.orderBy(desc(ctContracts.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractName: row.contractName || "",
					contractNumber: row.contractNumber || "",
					contractType: row.contractType || "",
					amount: row.amount || "",
					partyA: row.partyA || "",
					partyB: row.partyB || "",
					startTime: formatDateTime(row.startTime),
					endTime: formatDateTime(row.endTime),
					signDate: row.signDate || "",
					status: row.status || "draft",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listExpire(params: ListExpireParams): Promise<{ list: AdminExpireListItem[]; total: number }> {
			const conditions = [];
			if (params.contractName) conditions.push(like(ctContracts.contractName, `%${params.contractName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));
			if (params.contractType) conditions.push(eq(ctContracts.contractType, params.contractType));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctContracts)
				.where(where);
			const rows = await db
				.select()
				.from(ctContracts)
				.where(where)
				.orderBy(desc(ctContracts.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractName: row.contractName || "",
					contractNumber: row.contractNumber || "",
					contractType: row.contractType || "",
					amount: row.amount || "",
					startTime: formatDateTime(row.startTime),
					endTime: formatDateTime(row.endTime),
					signDate: row.signDate || "",
					status: row.status || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listFirstParty(params: ListFirstPartyParams): Promise<{ list: AdminFirstPartyListItem[]; total: number }> {
			const conditions = [];
			if (params.name) conditions.push(like(ctFirstParties.name, `%${params.name}%`));
			if (params.contactPerson) conditions.push(like(ctFirstParties.contactPerson, `%${params.contactPerson}%`));
			if (params.creditCode) conditions.push(like(ctFirstParties.creditCode, `%${params.creditCode}%`));
			if (params.status) conditions.push(eq(ctFirstParties.status, params.status as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctFirstParties)
				.where(where);
			const rows = await db
				.select()
				.from(ctFirstParties)
				.where(where)
				.orderBy(desc(ctFirstParties.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.name || "",
					contactPerson: row.contactPerson || "",
					contactPhone: row.contactPhone || "",
					address: row.address || "",
					creditCode: row.creditCode || "",
					establishedDate: row.establishedDate || "",
					legalRepresentative: row.legalRepresentative || "",
					businessScope: row.businessScope || "",
					status: row.status || "enabled",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listPrint(params: ListPrintParams): Promise<{ list: AdminPrintListItem[]; total: number }> {
			const conditions = [];
			if (params.contractName) conditions.push(like(ctContracts.contractName, `%${params.contractName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctPrints)
				.where(where);
			const rows = await db
				.select({
					id: ctPrints.id,
					contractId: ctPrints.contractId,
					contractName: ctContracts.contractName,
					contractNumber: ctContracts.contractNumber,
					contractType: ctContracts.contractType,
					partyA: ctFirstParties.name,
					partyB: ctSecondParties.name,
					printCount: ctPrints.printCount,
					printTime: ctPrints.printTime,
					printer: ctPrints.printer,
					createTime: ctPrints.createTime,
					updateTime: ctPrints.updateTime,
				})
				.from(ctPrints)
				.leftJoin(ctContracts, eq(ctPrints.contractId, ctContracts.id))
				.leftJoin(ctFirstParties, eq(ctContracts.firstPartyId, ctFirstParties.id))
				.leftJoin(ctSecondParties, eq(ctContracts.secondPartyId, ctSecondParties.id))
				.where(where)
				.orderBy(desc(ctPrints.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractName: row.contractName || "",
					contractNumber: row.contractNumber || "",
					contractType: row.contractType || "",
					partyA: row.partyA || "",
					partyB: row.partyB || "",
					printCount: row.printCount || 0,
					printTime: formatDateTime(row.printTime),
					printer: row.printer || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listReview(params: ListReviewParams): Promise<{ list: AdminReviewListItem[]; total: number }> {
			const conditions = [];
			if (params.contractName) conditions.push(like(ctContracts.contractName, `%${params.contractName}%`));
			if (params.contractNumber) conditions.push(like(ctContracts.contractNumber, `%${params.contractNumber}%`));
			if (params.reviewResult) conditions.push(eq(ctReviews.reviewResult, params.reviewResult as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctReviews)
				.where(where);
			const rows = await db
				.select({
					id: ctReviews.id,
					contractId: ctReviews.contractId,
					contractName: ctContracts.contractName,
					contractNumber: ctContracts.contractNumber,
					contractType: ctContracts.contractType,
					partyA: ctFirstParties.name,
					partyB: ctSecondParties.name,
					contractAmount: ctContracts.amount,
					reviewer: ctReviews.reviewer,
					reviewTime: ctReviews.reviewTime,
					reviewResult: ctReviews.reviewResult,
					reviewOpinion: ctReviews.reviewOpinion,
					createTime: ctReviews.createTime,
					updateTime: ctReviews.updateTime,
				})
				.from(ctReviews)
				.leftJoin(ctContracts, eq(ctReviews.contractId, ctContracts.id))
				.leftJoin(ctFirstParties, eq(ctContracts.firstPartyId, ctFirstParties.id))
				.leftJoin(ctSecondParties, eq(ctContracts.secondPartyId, ctSecondParties.id))
				.where(where)
				.orderBy(desc(ctReviews.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					contractName: row.contractName || "",
					contractNumber: row.contractNumber || "",
					contractType: row.contractType || "",
					partyA: row.partyA || "",
					partyB: row.partyB || "",
					contractAmount: row.contractAmount || "",
					reviewer: row.reviewer || "",
					reviewTime: formatDateTime(row.reviewTime),
					reviewResult: row.reviewResult || "",
					reviewOpinion: row.reviewOpinion || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listSecondParty(params: ListSecondPartyParams): Promise<{ list: AdminSecondPartyListItem[]; total: number }> {
			const conditions = [];
			if (params.name) conditions.push(like(ctSecondParties.name, `%${params.name}%`));
			if (params.contactPerson) conditions.push(like(ctSecondParties.contactPerson, `%${params.contactPerson}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctSecondParties)
				.where(where);
			const rows = await db
				.select()
				.from(ctSecondParties)
				.where(where)
				.orderBy(desc(ctSecondParties.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.name || "",
					partyType: row.partyType || "",
					contactPerson: row.contactPerson || "",
					contactPhone: row.contactPhone || "",
					address: row.address || "",
					ownerId: row.ownerId,
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listTemplate(params: ListTemplateParams): Promise<{ list: AdminTemplateListItem[]; total: number }> {
			const conditions = [];
			if (params.templateName) conditions.push(like(ctTemplates.templateName, `%${params.templateName}%`));
			if (params.templateType) conditions.push(eq(ctTemplates.templateType, params.templateType));
			if (params.status) conditions.push(eq(ctTemplates.status, params.status as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctTemplates)
				.where(where);
			const rows = await db
				.select()
				.from(ctTemplates)
				.where(where)
				.orderBy(desc(ctTemplates.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					templateName: row.templateName || "",
					templateType: row.templateType || "",
					version: row.version || "",
					status: row.status || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listContractType(
			params: ListContractTypeParams,
		): Promise<{ list: AdminContractTypeListItem[]; total: number }> {
			const conditions = [];
			if (params.typeName) conditions.push(like(ctTypes.typeName, `%${params.typeName}%`));
			if (params.typeCode) conditions.push(like(ctTypes.typeCode, `%${params.typeCode}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ctTypes)
				.where(where);
			const rows = await db
				.select()
				.from(ctTypes)
				.where(where)
				.orderBy(desc(ctTypes.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					typeName: row.typeName || "",
					typeCode: row.typeCode || "",
					typeDescription: row.typeDescription || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},
	}) satisfies Partial<ContractRepository>;
}

class InMemoryContractRepository implements ContractRepository {
	async listArchive(): Promise<{ list: AdminArchiveListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listAttachment(): Promise<{ list: AdminAttachmentListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listChange(): Promise<{ list: AdminChangeListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listClause(): Promise<{ list: AdminClauseListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listDraftContract(): Promise<{ list: AdminDraftContractListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listExpire(): Promise<{ list: AdminExpireListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listFirstParty(): Promise<{ list: AdminFirstPartyListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listPrint(): Promise<{ list: AdminPrintListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listReview(): Promise<{ list: AdminReviewListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listSecondParty(): Promise<{ list: AdminSecondPartyListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listTemplate(): Promise<{ list: AdminTemplateListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listContractType(): Promise<{ list: AdminContractTypeListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
}

export function createInMemoryContractRepository(): ContractRepository {
	return new InMemoryContractRepository();
}
