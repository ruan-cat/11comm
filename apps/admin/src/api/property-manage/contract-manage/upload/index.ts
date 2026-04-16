import { http } from "@/utils/http";

export type UploadBizType = "draft_contract" | "change";

export interface UploadInitPayload {
	bizType: UploadBizType;
	fileName: string;
	mimeType: string;
	fileSize: number;
	chunkSize: number;
	resumeFingerprint: string;
}

export interface UploadInitResult {
	sessionId: string;
	chunkSize: number;
	totalParts: number;
	objectKey: string;
	status: string;
}

export interface UploadStatusPayload {
	sessionId: string;
}

export interface UploadStatusResult {
	status: string;
	uploadedParts: Array<{
		partNumber: number;
		etag: string;
	}>;
}

export interface UploadSignPartPayload {
	sessionId: string;
	partNumber: number;
}

export interface UploadSignPartResult {
	signedUrl: string;
	expiresIn: number;
}

export interface UploadCompletePayload {
	sessionId: string;
	parts: Array<{
		partNumber: number;
		etag: string;
	}>;
	attachmentName: string;
	attachmentType: string;
}

export interface UploadCompleteResult {
	sessionId: string;
	fileUrl: string;
	objectKey: string;
}

export interface UploadAbortPayload {
	sessionId: string;
}

const BASE_URL = "/api/property-manage/contract-manage/upload";

export function uploadInit(payload: UploadInitPayload) {
	return http.post<UploadInitResult, UploadInitPayload>(`${BASE_URL}/init`, { data: payload });
}

export function uploadStatus(payload: UploadStatusPayload) {
	return http.post<UploadStatusResult, UploadStatusPayload>(`${BASE_URL}/status`, { data: payload });
}

export function uploadSignPart(payload: UploadSignPartPayload) {
	return http.post<UploadSignPartResult, UploadSignPartPayload>(`${BASE_URL}/sign-part`, { data: payload });
}

export function uploadComplete(payload: UploadCompletePayload) {
	return http.post<UploadCompleteResult, UploadCompletePayload>(`${BASE_URL}/complete`, { data: payload });
}

export function uploadAbort(payload: UploadAbortPayload) {
	return http.post<void, UploadAbortPayload>(`${BASE_URL}/abort`, { data: payload });
}

export default {
	uploadInit,
	uploadStatus,
	uploadSignPart,
	uploadComplete,
	uploadAbort,
};
