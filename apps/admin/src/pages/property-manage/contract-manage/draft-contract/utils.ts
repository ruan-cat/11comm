import type {
	AttachmentMetaInput,
	AttachmentDetailItem,
	CompletedAttachmentAsset,
	ContractDraftDetailVO,
	ContractDraftFormVO,
	DraftContractCreatePayload,
	DraftContractListItem,
	DraftContractUpdatePayload,
} from "@01s-11comm/type";

/** 从已完成上传资产中提取后端提交所需的附件元数据 */
function buildAttachmentMetas(attachments: CompletedAttachmentAsset[]): AttachmentMetaInput[] {
	return attachments
		.filter((item) => Boolean(item.uploadSessionId))
		.map((item) => ({
			uploadSessionId: item.uploadSessionId,
			attachmentName: item.attachmentName,
			attachmentType: item.attachmentType,
		}));
}

/** 去重收集本次表单提交引用到的上传会话 ID */
function buildNewUploadSessionIds(attachments: CompletedAttachmentAsset[]) {
	return Array.from(new Set(attachments.map((item) => item.uploadSessionId).filter(Boolean)));
}

/** 将合同金额统一规整为后端约定的字符串值 */
function normalizeContractAmount(value: unknown) {
	if (value === null || value === undefined || value === "") {
		return "";
	}

	return String(value);
}

/**
 * 将详情接口返回值映射为起草表单模型。
 * @description
 * 详情里的附件结构与表单编辑态结构并不完全一致，
 * 这里负责补齐前端编辑时需要的字段。
 */
export function mapDraftContractDetailToForm(detail: ContractDraftDetailVO) {
	return {
		contractName: detail.contractName,
		contractNumber: detail.contractNumber,
		contractType: detail.contractType,
		partyA: detail.partyA,
		partyAContact: detail.partyAContact,
		partyAPhone: detail.partyAPhone,
		partyB: detail.partyB,
		partyBContact: detail.partyBContact,
		partyBPhone: detail.partyBPhone,
		handler: detail.handler,
		handlerPhone: detail.handlerPhone,
		contractAmount: detail.contractAmount,
		startTime: detail.startTime,
		endTime: detail.endTime,
		signingTime: detail.signingTime,
		description: detail.description,
		attachments: detail.attachments.map((item: AttachmentDetailItem) => ({
			uploadSessionId: item.uploadSessionId ?? "",
			attachmentName: item.attachmentName,
			attachmentType: item.attachmentType,
			fileName: item.fileName ?? item.attachmentName,
			fileSize: item.fileSize ?? 0,
			mimeType: item.mimeType ?? "",
			storageProvider: item.storageProvider,
			bucketName: item.bucketName ?? "",
			fileUrl: item.fileUrl ?? "",
			objectKey: item.objectKey ?? "",
			objectEtag: item.objectEtag ?? null,
			fileHash: item.fileHash ?? null,
			uploadStatus: item.uploadStatus,
		})),
	} satisfies ContractDraftFormVO;
}

/** 根据起草表单构造创建 payload */
export function buildDraftContractCreatePayload(form: ContractDraftFormVO): DraftContractCreatePayload {
	return {
		contractName: form.contractName,
		contractNumber: form.contractNumber,
		contractType: form.contractType,
		partyA: form.partyA,
		partyAContact: form.partyAContact,
		partyAPhone: form.partyAPhone,
		partyB: form.partyB,
		partyBContact: form.partyBContact,
		partyBPhone: form.partyBPhone,
		handler: form.handler,
		handlerPhone: form.handlerPhone,
		contractAmount: normalizeContractAmount(form.contractAmount),
		startTime: form.startTime,
		endTime: form.endTime,
		signingTime: form.signingTime,
		description: form.description,
		newUploadSessionIds: buildNewUploadSessionIds(form.attachments),
		attachmentMetas: buildAttachmentMetas(form.attachments),
		remark: undefined,
	};
}

/** 根据起草表单与附件差量构造更新 payload */
export function buildDraftContractUpdatePayload(params: {
	id: string;
	form: ContractDraftFormVO;
	retainAttachmentIds: string[];
	deleteAttachmentIds: string[];
}): DraftContractUpdatePayload {
	return {
		id: params.id,
		...buildDraftContractCreatePayload(params.form),
		retainAttachmentIds: params.retainAttachmentIds,
		deleteAttachmentIds: params.deleteAttachmentIds,
	};
}

/** 生成起草表单的默认值或由详情/列表派生出的初始值 */
export function buildDraftContractFormValue(source?: Partial<DraftContractListItem & ContractDraftDetailVO>) {
	return {
		contractName: source?.contractName ?? "",
		contractNumber: source?.contractNumber ?? "",
		contractType: source?.contractType ?? "",
		partyA: source?.partyA ?? "",
		partyAContact: source?.partyAContact ?? "",
		partyAPhone: source?.partyAPhone ?? "",
		partyB: source?.partyB ?? "",
		partyBContact: source?.partyBContact ?? "",
		partyBPhone: source?.partyBPhone ?? "",
		handler: source?.handler ?? "",
		handlerPhone: source?.handlerPhone ?? "",
		contractAmount: source?.contractAmount ?? "",
		startTime: source?.startTime ?? "",
		endTime: source?.endTime ?? "",
		signingTime: source?.signingTime ?? "",
		description: source?.description ?? "",
		attachments: [],
	} satisfies ContractDraftFormVO;
}

/** 统计仍会阻塞起草合同提交的上传会话数量 */
export function countBlockingDraftUploadSessions(sessions: Array<{ bizType?: string; status?: string }>) {
	return sessions.filter((session) => session.bizType === "draft_contract" && session.status !== "completed").length;
}
