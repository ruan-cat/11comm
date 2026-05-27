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
	// change CRUD
	createChange: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	getChangeDetail: (id: string) => Promise<Record<string, unknown> | null>;
	updateChange: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteChange: (id: string) => Promise<boolean>;
	// draft-contract CRUD
	createDraftContract: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	getDraftContractDetail: (id: string) => Promise<Record<string, unknown> | null>;
	updateDraftContract: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteDraftContract: (id: string) => Promise<boolean>;
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
				.leftJoin(ctContracts, eq(ctChanges.contractId, ctContracts.id))
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
		// change CRUD
		async createChange(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const contractId = data.contractId
				? String(data.contractId)
				: await resolveContractIdByContractNumber(data.contractNumber);
			const [row] = await db
				.insert(ctChanges)
				.values({
					contractId,
					changeType: data.changeType ? String(data.changeType) : null,
					changeReason: data.changeReason ? String(data.changeReason) : null,
					changeContent: data.changeContent ? String(data.changeContent) : null,
					changeDate: data.changeDate ? String(data.changeDate) : null,
					changer: data.changer ? String(data.changer) : null,
					description: data.description ? String(data.description) : null,
					beforeChange: data.beforeChange ? String(data.beforeChange) : null,
					afterChange: data.afterChange ? String(data.afterChange) : null,
					remark: data.remark ? String(data.remark) : null,
				})
				.returning();
			return row ?? null;
		},
		async getChangeDetail(id: string): Promise<Record<string, unknown> | null> {
			const [row] = await db.select().from(ctChanges).where(eq(ctChanges.id, id)).limit(1);
			if (!row) return null;
			return {
				id: row.id,
				contractId: row.contractId,
				changeType: row.changeType,
				changeReason: row.changeReason,
				changeContent: row.changeContent,
				changeDate: row.changeDate,
				changer: row.changer,
				description: row.description,
				beforeChange: row.beforeChange,
				afterChange: row.afterChange,
				changeTime: row.changeTime ? formatDateTime(row.changeTime) : null,
				approvalStatus: row.approvalStatus,
				approver: row.approver,
				approvalTime: row.approvalTime ? formatDateTime(row.approvalTime) : null,
				remark: row.remark,
				createTime: formatDateTime(row.createTime),
				updateTime: formatDateTime(row.updateTime),
			};
		},
		async updateChange(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.changeType !== undefined) updates.changeType = data.changeType ? String(data.changeType) : null;
			if (data.changeReason !== undefined) updates.changeReason = data.changeReason ? String(data.changeReason) : null;
			if (data.changeContent !== undefined)
				updates.changeContent = data.changeContent ? String(data.changeContent) : null;
			if (data.changeDate !== undefined) updates.changeDate = data.changeDate ? String(data.changeDate) : null;
			if (data.changer !== undefined) updates.changer = data.changer ? String(data.changer) : null;
			if (data.description !== undefined) updates.description = data.description ? String(data.description) : null;
			if (data.beforeChange !== undefined) updates.beforeChange = data.beforeChange ? String(data.beforeChange) : null;
			if (data.afterChange !== undefined) updates.afterChange = data.afterChange ? String(data.afterChange) : null;
			if (data.approvalStatus !== undefined) updates.approvalStatus = data.approvalStatus;
			if (data.approver !== undefined) updates.approver = data.approver ? String(data.approver) : null;
			if (data.remark !== undefined) updates.remark = data.remark ? String(data.remark) : null;
			const [row] = await db.update(ctChanges).set(updates).where(eq(ctChanges.id, id)).returning();
			return row ?? null;
		},
		async deleteChange(id: string): Promise<boolean> {
			const result = await db.delete(ctChanges).where(eq(ctChanges.id, id)).returning({ id: ctChanges.id });
			return result.length > 0;
		},

		// draft-contract CRUD
		async createDraftContract(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(ctContracts)
				.values({
					contractName: String(data.contractName || ""),
					contractNumber: String(data.contractNumber || `DRAFT-${Date.now()}`),
					contractType: data.contractType ? String(data.contractType) : null,
					amount: data.amount ? String(data.amount) : null,
					partyA: data.partyA ? String(data.partyA) : null,
					partyAContact: data.partyAContact ? String(data.partyAContact) : null,
					partyAPhone: data.partyAPhone ? String(data.partyAPhone) : null,
					partyB: data.partyB ? String(data.partyB) : null,
					partyBContact: data.partyBContact ? String(data.partyBContact) : null,
					partyBPhone: data.partyBPhone ? String(data.partyBPhone) : null,
					handler: data.handler ? String(data.handler) : null,
					handlerPhone: data.handlerPhone ? String(data.handlerPhone) : null,
					description: data.description ? String(data.description) : null,
					status: "draft",
					remark: data.remark ? String(data.remark) : null,
				})
				.returning();
			return row ?? null;
		},
		async getDraftContractDetail(id: string): Promise<Record<string, unknown> | null> {
			const [row] = await db.select().from(ctContracts).where(eq(ctContracts.id, id)).limit(1);
			if (!row) return null;
			return {
				id: row.id,
				contractName: row.contractName,
				contractNumber: row.contractNumber,
				contractType: row.contractType,
				amount: row.amount,
				firstPartyId: row.firstPartyId,
				secondPartyId: row.secondPartyId,
				startTime: row.startTime ? formatDateTime(row.startTime) : null,
				endTime: row.endTime ? formatDateTime(row.endTime) : null,
				signDate: row.signDate,
				partyA: row.partyA,
				partyAContact: row.partyAContact,
				partyAPhone: row.partyAPhone,
				partyB: row.partyB,
				partyBContact: row.partyBContact,
				partyBPhone: row.partyBPhone,
				handler: row.handler,
				handlerPhone: row.handlerPhone,
				description: row.description,
				status: row.status,
				remark: row.remark,
				createTime: formatDateTime(row.createTime),
				updateTime: formatDateTime(row.updateTime),
			};
		},
		async updateDraftContract(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.contractName !== undefined) updates.contractName = String(data.contractName);
			if (data.contractNumber !== undefined) updates.contractNumber = String(data.contractNumber);
			if (data.contractType !== undefined) updates.contractType = data.contractType ? String(data.contractType) : null;
			if (data.amount !== undefined) updates.amount = data.amount ? String(data.amount) : null;
			if (data.partyA !== undefined) updates.partyA = data.partyA ? String(data.partyA) : null;
			if (data.partyAContact !== undefined)
				updates.partyAContact = data.partyAContact ? String(data.partyAContact) : null;
			if (data.partyAPhone !== undefined) updates.partyAPhone = data.partyAPhone ? String(data.partyAPhone) : null;
			if (data.partyB !== undefined) updates.partyB = data.partyB ? String(data.partyB) : null;
			if (data.partyBContact !== undefined)
				updates.partyBContact = data.partyBContact ? String(data.partyBContact) : null;
			if (data.partyBPhone !== undefined) updates.partyBPhone = data.partyBPhone ? String(data.partyBPhone) : null;
			if (data.handler !== undefined) updates.handler = data.handler ? String(data.handler) : null;
			if (data.handlerPhone !== undefined) updates.handlerPhone = data.handlerPhone ? String(data.handlerPhone) : null;
			if (data.description !== undefined) updates.description = data.description ? String(data.description) : null;
			if (data.remark !== undefined) updates.remark = data.remark ? String(data.remark) : null;
			const [row] = await db.update(ctContracts).set(updates).where(eq(ctContracts.id, id)).returning();
			return row ?? null;
		},
		async deleteDraftContract(id: string): Promise<boolean> {
			const result = await db.delete(ctContracts).where(eq(ctContracts.id, id)).returning({ id: ctContracts.id });
			return result.length > 0;
		},
	}) satisfies Partial<ContractRepository>;

	async function resolveContractIdByContractNumber(value: unknown): Promise<string> {
		if (!value) return "";
		const contractNumber = String(value).trim();
		if (!contractNumber) return "";
		const [contract] = await db
			.select({ id: ctContracts.id })
			.from(ctContracts)
			.where(eq(ctContracts.contractNumber, contractNumber))
			.limit(1);
		return contract?.id ? String(contract.id) : "";
	}
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
	// change CRUD fallbacks
	async createChange(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async getChangeDetail(): Promise<Record<string, unknown> | null> {
		return null;
	}
	async updateChange(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteChange(): Promise<boolean> {
		return true;
	}
	// draft-contract CRUD fallbacks
	async createDraftContract(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async getDraftContractDetail(): Promise<Record<string, unknown> | null> {
		return null;
	}
	async updateDraftContract(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteDraftContract(): Promise<boolean> {
		return true;
	}
}

export function createInMemoryContractRepository(): ContractRepository {
	return new InMemoryContractRepository();
}
