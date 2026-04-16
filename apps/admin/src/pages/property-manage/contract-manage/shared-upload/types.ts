export type ResumableUploadBizType = "draft_contract" | "change";

export type ResumableUploadSessionStatus = "initiated" | "uploading" | "paused" | "completed" | "aborted" | "expired";

export type ResumableUploadItemStatus = "queued" | "uploading" | "paused" | "completed" | "failed";

export interface ResumableUploadPartState {
	partNumber: number;
	etag: string;
	uploadedAt: number;
}

export interface ResumableUploadCompletedAsset {
	uploadSessionId: string;
	attachmentName: string;
	attachmentType: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
	fileUrl: string;
	objectKey: string;
}

export interface ResumableUploadQueueItem {
	localId: string;
	file: File;
	bizType: ResumableUploadBizType;
	fingerprint: string;
	sessionId?: string;
	status: ResumableUploadItemStatus;
	chunkSize: number;
	totalParts: number;
	uploadedParts: ResumableUploadPartState[];
	missingPartNumbers: number[];
	progress: number;
	completedAsset?: ResumableUploadCompletedAsset;
	errorMessage?: string;
}

export interface ResumableUploadSessionSnapshot {
	fingerprint: string;
	bizType: ResumableUploadBizType;
	sessionId: string;
	fileName: string;
	mimeType: string;
	fileSize: number;
	chunkSize: number;
	totalParts: number;
	status: ResumableUploadSessionStatus;
	uploadedParts: ResumableUploadPartState[];
	completedAsset?: ResumableUploadCompletedAsset;
	updatedAt: number;
}

export interface ResumableUploadCache {
	saveSession(snapshot: ResumableUploadSessionSnapshot): Promise<void>;
	restoreSession(fingerprint: string): Promise<ResumableUploadSessionSnapshot | null>;
	removeSession(fingerprint: string): Promise<void>;
	clear(): Promise<void>;
	listSessions(): Promise<ResumableUploadSessionSnapshot[]>;
}

export interface ResumableUploadAttachmentTypeOption {
	label: string;
	value: string;
}
