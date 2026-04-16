import type { AttachmentDetailItem } from "@01s-11comm/type";
import type {
	ChangeAttachmentDraft,
	ChangeCreatePayload,
	ChangeUpdatePayload,
	NewChangeAttachmentDraft,
} from "@01s-11comm/type";
import type { ResumableUploadCompletedAsset } from "../../shared-upload/types";

/** 将金额统一规整为后端约定的字符串值 */
function normalizeContractAmount(value: unknown) {
	if (value === null || value === undefined || value === "") {
		return "";
	}

	return String(value);
}

/**
 * 将已有附件详情转换为变更页草稿项
 * @description
 * 旧附件默认视为保留，编辑时仅通过 deleted 标记控制删除态
 */
export function createExistingChangeAttachmentDraft(attachment: AttachmentDetailItem): ChangeAttachmentDraft {
	return {
		...attachment,
		source: "existing",
		deleted: false,
	};
}

/**
 * 将共享上传层产出的完成态附件转换为变更页草稿项
 * @description
 * 新上传附件统一保留上传会话信息，便于后续提交时组装差量 payload
 */
export function createNewChangeAttachmentDraft(asset: ResumableUploadCompletedAsset): NewChangeAttachmentDraft {
	return {
		...asset,
		storageProvider: "r2",
		bucketName: "",
		uploadStatus: "ready",
		source: "new",
		deleted: false,
	};
}

/**
 * 规范化变更页附件草稿
 * @description
 * 保留既有顺序，避免弹窗反复打开后出现草稿态抖动
 */
export function normalizeChangeAttachmentDrafts(attachments: ChangeAttachmentDraft[]) {
	return attachments.map((attachment) => ({ ...attachment }));
}

/**
 * 合并新上传附件与已有草稿
 * @description
 * 旧附件保持原有保留/删除状态；新上传附件则覆盖同 uploadSessionId 的重复项
 */
export function mergeChangeAttachmentDrafts(
	currentDrafts: ChangeAttachmentDraft[],
	uploadedAssets: ResumableUploadCompletedAsset[],
) {
	const existingDrafts = currentDrafts.filter((item) => item.source === "existing");
	const nextNewDrafts = uploadedAssets.map((asset) => createNewChangeAttachmentDraft(asset));

	return [...existingDrafts, ...nextNewDrafts];
}

/**
 * 构建变更页附件差量提交结构
 * @description
 * - existing 且未删除：进入 retainAttachmentIds
 * - existing 且已删除：进入 deleteAttachmentIds
 * - new 且未删除：进入新上传会话与附件元数据
 */
export function buildChangeAttachmentDiff(attachments: ChangeAttachmentDraft[]) {
	const retainAttachmentIds: string[] = [];
	const deleteAttachmentIds: string[] = [];
	const newUploadSessionIds: string[] = [];
	const attachmentMetas: ChangeCreatePayload["attachmentMetas"] = [];

	for (const attachment of attachments) {
		if (attachment.source === "existing") {
			if (attachment.deleted) {
				deleteAttachmentIds.push(attachment.id);
			} else {
				retainAttachmentIds.push(attachment.id);
			}
			continue;
		}

		if (attachment.deleted) {
			continue;
		}

		newUploadSessionIds.push(attachment.uploadSessionId);
		attachmentMetas.push({
			uploadSessionId: attachment.uploadSessionId,
			attachmentName: attachment.attachmentName,
			attachmentType: attachment.attachmentType,
		});
	}

	return {
		retainAttachmentIds,
		deleteAttachmentIds,
		newUploadSessionIds,
		attachmentMetas,
	};
}

/**
 * 组装创建态 payload
 */
export function buildChangeCreatePayload(
	form: Omit<ChangeCreatePayload, "newUploadSessionIds" | "attachmentMetas">,
	attachments: ChangeAttachmentDraft[],
): ChangeCreatePayload {
	const diff = buildChangeAttachmentDiff(attachments);

	return {
		...form,
		contractAmount: normalizeContractAmount(form.contractAmount),
		newUploadSessionIds: diff.newUploadSessionIds,
		attachmentMetas: diff.attachmentMetas,
	};
}

/**
 * 组装更新态 payload
 */
export function buildChangeUpdatePayload(
	form: Omit<
		ChangeUpdatePayload,
		"retainAttachmentIds" | "deleteAttachmentIds" | "newUploadSessionIds" | "attachmentMetas"
	>,
	attachments: ChangeAttachmentDraft[],
): ChangeUpdatePayload {
	const diff = buildChangeAttachmentDiff(attachments);

	return {
		...form,
		contractAmount: normalizeContractAmount(form.contractAmount),
		retainAttachmentIds: diff.retainAttachmentIds,
		deleteAttachmentIds: diff.deleteAttachmentIds,
		newUploadSessionIds: diff.newUploadSessionIds,
		attachmentMetas: diff.attachmentMetas,
	};
}
