import {
	ctFirstParties,
	ctSecondParties,
	ctTemplates,
	ctClauses,
	ctTypes,
	ctContracts,
	ctAttachments,
	ctChanges,
} from "@01s-11comm/type";

import { mockFirstPartyData } from "../../api/property-manage/contract-manage/first-party/mock-data";
import { mockSecondPartyData } from "../../api/property-manage/contract-manage/second-party/mock-data";
import { mockTemplateData } from "../../api/property-manage/contract-manage/template/mock-data";
import { mockClauseData } from "../../api/property-manage/contract-manage/clause/mock-data";
import { mockTypeData as mockContractTypeData } from "../../api/property-manage/contract-manage/type/mock-data";
import { mockDraftContractData } from "../../api/property-manage/contract-manage/draft-contract/mock-data";
import { mockAttachmentData } from "../../api/property-manage/contract-manage/attachment/mock-data";
import { mockChangeData } from "../../api/property-manage/contract-manage/change/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap } from "./index";
import { db } from "../index";

const contractStatusMap: Record<string, "draft" | "pending_review" | "effective" | "expired" | "terminated"> = {
	草稿: "draft",
	审批中: "pending_review",
	已生效: "effective",
	已到期: "expired",
	已终止: "terminated",
};

const templateStatusMap: Record<string, "draft" | "published" | "disabled"> = {
	草稿: "draft",
	已发布: "published",
	启用: "published",
	已停用: "disabled",
	禁用: "disabled",
};

/**
 * 生成合同管理模块的 SQL
 */
export function generateContractSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 pg_first_parties (甲方)
	// ==========================================
	console.log("正在生成 ct_first_parties SQL...");
	const firstPartyRecords = mockFirstPartyData.map((item) => {
		const id = idMap.register("ct_first_parties", item.partyA);
		return {
			id,
			name: item.partyA,
			contactPerson: item.contactPerson,
			contactPhone: item.contactPhone,
			address: item.address,
			creditCode: item.creditCode,
			establishedDate: item.establishmentDate ? item.establishmentDate : null,
			legalRepresentative: item.legalRepresentative,
			businessScope: item.businessScope,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (firstPartyRecords.length > 0) {
		const query = db.insert(ctFirstParties).values(firstPartyRecords).toSQL();
		statements.push({
			table: "ct_first_parties",
			sql: toFullSql(query.sql, query.params),
			recordCount: firstPartyRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 ct_second_parties (乙方)
	// ==========================================
	console.log("正在生成 ct_second_parties SQL...");
	const secondPartyRecords = mockSecondPartyData.map((item) => {
		const id = idMap.register("ct_second_parties", item.partyB);
		return {
			id,
			name: item.partyB,
			partyType: null, // Mock data missing partyType
			contactPerson: item.contactPerson,
			contactPhone: item.contactPhone,
			address: item.address,
			ownerId: null,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (secondPartyRecords.length > 0) {
		const query = db.insert(ctSecondParties).values(secondPartyRecords).toSQL();
		statements.push({
			table: "ct_second_parties",
			sql: toFullSql(query.sql, query.params),
			recordCount: secondPartyRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 ct_templates (合同模板)
	// ==========================================
	console.log("正在生成 ct_templates SQL...");
	const templateRecords = mockTemplateData.map((item) => {
		const id = idMap.register("ct_templates", item.templateName);
		return {
			id,
			templateName: item.templateName,
			templateType: item.applicableContractType,
			templateContent: "Mock Template Content...",
			version: item.templateVersion,
			status: templateStatusMap[item.status] || "draft",
			remark: item.templateDescription,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (templateRecords.length > 0) {
		const query = db.insert(ctTemplates).values(templateRecords).toSQL();
		statements.push({
			table: "ct_templates",
			sql: toFullSql(query.sql, query.params),
			recordCount: templateRecords.length,
		});
	}

	// ==========================================
	// 4. 生成 ct_clauses (合同条款)
	// ==========================================
	console.log("正在生成 ct_clauses SQL...");
	const clauseRecords = mockClauseData
		.map((item, index) => {
			const id = idMap.register("ct_clauses", item.clauseName);

			// Find matching template by type or name
			const template = mockTemplateData.find((t) => t.applicableContractType === item.applicableContractType);
			const templateId = template ? idMap.get("ct_templates", template.templateName) : null;

			// Skip if template not found
			if (!templateId) return null;

			return {
				id,
				templateId,
				clauseName: item.clauseName,
				clauseContent: item.clauseContent,
				clauseType: "general",
				sortOrder: index,
				remark: item.remark,
				createdAt: item.createTime ? new Date(item.createTime) : new Date(),
				updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter(Boolean);

	if (clauseRecords.length > 0) {
		const query = db.insert(ctClauses).values(clauseRecords).toSQL();
		statements.push({
			table: "ct_clauses",
			sql: toFullSql(query.sql, query.params),
			recordCount: clauseRecords.length,
		});
	}

	// ==========================================
	// 5. 生成 ct_types (合同类型)
	// ==========================================
	console.log("正在生成 ct_types SQL...");
	const typeRecords = mockContractTypeData.map((item, idx) => {
		const id = idMap.register("ct_types", item.typeName);
		return {
			id,
			typeName: item.typeName,
			typeCode: `CT-${idx + 1}`, // Generate code
			typeDescription: item.description,
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (typeRecords.length > 0) {
		const query = db.insert(ctTypes).values(typeRecords).toSQL();
		statements.push({
			table: "ct_types",
			sql: toFullSql(query.sql, query.params),
			recordCount: typeRecords.length,
		});
	}

	// ==========================================
	// 6. 生成 ct_contracts (合同信息)
	// ==========================================
	console.log("正在生成 ct_contracts SQL...");
	const contractRecords = mockDraftContractData.map((item) => {
		const id = idMap.register("ct_contracts", item.contractNumber);

		const firstPartyId = idMap.get("ct_first_parties", item.partyA) || null;
		const secondPartyId = idMap.get("ct_second_parties", item.partyB) || null;

		return {
			id,
			contractName: item.contractName,
			contractNumber: item.contractNumber,
			contractType: item.contractType,
			amount: item.contractAmount ? String(item.contractAmount) : null,
			firstPartyId: firstPartyId,
			secondPartyId: secondPartyId,
			startTime: item.startTime ? new Date(item.startTime) : null,
			endTime: item.endTime ? new Date(item.endTime) : null,
			signDate: item.startTime ? new Date(item.startTime) : null,
			status: contractStatusMap[item.status] || "draft",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (contractRecords.length > 0) {
		const query = db.insert(ctContracts).values(contractRecords).toSQL();
		statements.push({
			table: "ct_contracts",
			sql: toFullSql(query.sql, query.params),
			recordCount: contractRecords.length,
		});
	}

	// ==========================================
	// 7. 生成 ct_attachments (合同附件)
	// ==========================================
	console.log("正在生成 ct_attachments SQL...");
	const attachmentRecords = mockAttachmentData
		.map((item, idx) => {
			// Use attachmentName as the primary field name (from mock data)
			const fileName = item.fileName ?? item.attachmentName;
			const id = idMap.register("ct_attachments", fileName + idx);
			// attachment mock data has `contractName`
			const contractId = idMap.get("ct_contracts", item.contractName);

			// Try to find contract by name in mock data to get number
			let realContractId = contractId;
			if (!realContractId) {
				const contract = mockDraftContractData.find((c) => c.contractName === item.contractName);
				if (contract) {
					realContractId = idMap.get("ct_contracts", contract.contractNumber);
				}
			}

			if (!realContractId) return null;

			// Parse file size - handle various formats like "2.5MB", "1.2MB", "0.5MB"
			let fileSizeBytes = 0;
			const fileSizeStr = item.fileSize;
			if (fileSizeStr.includes("MB")) {
				fileSizeBytes = parseFloat(fileSizeStr.replace("MB", "")) * 1024 * 1024;
			} else if (fileSizeStr.includes("KB")) {
				fileSizeBytes = parseFloat(fileSizeStr.replace("KB", "")) * 1024;
			} else {
				fileSizeBytes = parseFloat(fileSizeStr) || 0;
			}

			return {
				id,
				contractId: realContractId,
				attachmentName: fileName,
				attachmentType: item.fileType ?? item.attachmentType,
				filePath: "/uploads/mock/" + fileName,
				fileSize: Math.round(fileSizeBytes),
				remark: item.remark,
				createdAt: item.uploadTime ? new Date(item.uploadTime) : new Date(),
				updatedAt: new Date(),
			};
		})
		.filter(Boolean);

	if (attachmentRecords.length > 0) {
		const query = db.insert(ctAttachments).values(attachmentRecords).toSQL();
		statements.push({
			table: "ct_attachments",
			sql: toFullSql(query.sql, query.params),
			recordCount: attachmentRecords.length,
		});
	}

	// ==========================================
	// 8. 生成 ct_changes (合同变更)
	// ==========================================
	console.log("正在生成 ct_changes SQL...");
	const changeRecords = mockChangeData
		.map((item, idx) => {
			const id = idMap.register("ct_changes", item.contractNumber + idx);
			const contractId = idMap.get("ct_contracts", item.contractNumber);
			if (!contractId) return null;

			return {
				id,
				contractId,
				changeType: item.changeType,
				// Use changeReason if available, fallback to description
				changeReason: item.changeReason ?? item.description,
				// Use changeContent if available, fallback to description
				changeContent: item.changeContent ?? item.description,
				// Use changeTime if available, fallback to applyTime
				changeDate: item.changeTime ? new Date(item.changeTime) : item.applyTime ? new Date(item.applyTime) : null,
				approvalStatus: item.status === "已通过" ? "approved" : "pending",
				approver: "Administrator",
				approvalTime: null,
				remark: item.remark,
				createdAt: item.createTime ? new Date(item.createTime) : new Date(),
				updatedAt: new Date(),
			};
		})
		.filter(Boolean);

	if (changeRecords.length > 0) {
		const query = db.insert(ctChanges).values(changeRecords).toSQL();
		statements.push({
			table: "ct_changes",
			sql: toFullSql(query.sql, query.params),
			recordCount: changeRecords.length,
		});
	}

	return statements;
}
