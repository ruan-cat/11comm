import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { ContractService } from "./service";

export function createAdminContractAdapter(service: ContractService) {
	return {
		async listArchive(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listArchive({
				pageIndex,
				pageSize,
				contractName: blankToUndefined(input.contractName),
				contractNumber: blankToUndefined(input.contractNumber),
				archiveNo: blankToUndefined(input.archiveNumber ?? input.archiveNo),
				archiver: blankToUndefined(input.archiver),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listAttachment(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listAttachment({
				pageIndex,
				pageSize,
				attachmentName: blankToUndefined(input.attachmentName),
				contractNumber: blankToUndefined(input.contractNumber),
				contractName: blankToUndefined(input.contractName),
				attachmentType: blankToUndefined(input.attachmentType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listChange(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listChange({
				pageIndex,
				pageSize,
				contractName: blankToUndefined(input.contractName),
				contractNumber: blankToUndefined(input.contractNumber),
				contractType: blankToUndefined(input.contractType),
				approvalStatus: blankToUndefined(input.approvalStatus ?? input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listClause(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listClause({
				pageIndex,
				pageSize,
				clauseName: blankToUndefined(input.clauseName),
				clauseType: blankToUndefined(input.clauseType),
				templateId: blankToUndefined(input.templateId),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listDraftContract(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDraftContract({
				pageIndex,
				pageSize,
				contractName: blankToUndefined(input.contractName),
				contractNumber: blankToUndefined(input.contractNumber),
				contractType: blankToUndefined(input.contractType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listExpire(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listExpire({
				pageIndex,
				pageSize,
				contractName: blankToUndefined(input.contractName),
				contractNumber: blankToUndefined(input.contractNumber),
				contractType: blankToUndefined(input.contractType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listFirstParty(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listFirstParty({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				contactPerson: blankToUndefined(input.contactPerson),
				creditCode: blankToUndefined(input.creditCode),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listPrint(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPrint({
				pageIndex,
				pageSize,
				contractName: blankToUndefined(input.contractName),
				contractNumber: blankToUndefined(input.contractNumber),
				contractType: blankToUndefined(input.contractType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listReview(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReview({
				pageIndex,
				pageSize,
				contractName: blankToUndefined(input.contractName),
				contractNumber: blankToUndefined(input.contractNumber),
				contractType: blankToUndefined(input.contractType),
				reviewResult: blankToUndefined(input.reviewResult ?? input.reviewStatus),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listSecondParty(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listSecondParty({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name ?? input.partyB),
				partyType: blankToUndefined(input.partyType),
				contactPerson: blankToUndefined(input.contactPerson),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listTemplate(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listTemplate({
				pageIndex,
				pageSize,
				templateName: blankToUndefined(input.templateName),
				templateType: blankToUndefined(input.templateType ?? input.applicableContractType),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listContractType(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listContractType({
				pageIndex,
				pageSize,
				typeName: blankToUndefined(input.typeName),
				typeCode: blankToUndefined(input.typeCode),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async createChange(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(input, "创建成功");
		},
		async getChangeDetail(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(null);
		},
		async updateChange(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(input, "更新成功");
		},
		async deleteChange(input: { id?: string }): Promise<JsonVO<unknown>> {
			return adminSuccess(null, "删除成功");
		},

		async createDraftContract(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(input, "创建成功");
		},
		async getDraftContractDetail(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(null);
		},
		async updateDraftContract(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(input, "更新成功");
		},
		async deleteDraftContract(input: { id?: string }): Promise<JsonVO<unknown>> {
			return adminSuccess(null, "删除成功");
		},

		async uploadInit(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess({ uploadId: "mock-upload-id" }, "上传初始化成功");
		},
		async uploadSignPart(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess({ signedUrl: "" }, "签名成功");
		},
		async uploadComplete(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(null, "上传完成");
		},
		async uploadAbort(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess(null, "上传已取消");
		},
		async uploadStatus(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			return adminSuccess({ status: "unknown" });
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") return undefined;
	return `${value}`.trim();
}
