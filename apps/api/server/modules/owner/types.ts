export interface OwnerMember {
	memberId: string;
	ownerId: string;
	communityId: string;
	name: string;
	ownerTypeCd: "1001" | "1002" | "1003";
	ownerTypeName: string;
	personRole?: string;
	personType?: string;
	roomName: string;
	roomId: string;
	link: string;
	idCard: string;
	address: string;
	remark?: string;
	sex?: string;
	faceUrl?: string;
}

export interface OwnerListQuery {
	communityId: string;
	page: number;
	row: number;
	memberId?: string;
	name?: string;
	link?: string;
	roomName?: string;
}

export interface OwnerListResult {
	list: OwnerMember[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface OwnerWriteInput {
	[key: string]: unknown;
}

export interface OwnerGuardDecision {
	code: 409;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
