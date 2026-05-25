import type { OwnerGuardDecision, OwnerListQuery, OwnerListResult, OwnerMember, OwnerWriteInput } from "./types";

export interface OwnerRepository {
	listOwners(query: OwnerListQuery): Promise<OwnerListResult>;
	getWriteGuardDecision(endpoint: string, input: OwnerWriteInput): Promise<OwnerGuardDecision>;
}

const ownerTypeNameMap: Record<OwnerMember["ownerTypeCd"], string> = {
	1001: "Owner",
	1002: "Family Member",
	1003: "Tenant",
};

const ownerRows: OwnerMember[] = Array.from({ length: 36 }, (_, index) => createOwner(index + 1));

export function createOwnerRepository(): OwnerRepository {
	return {
		async listOwners(query) {
			return paginateOwners(filterOwners(ownerRows, query), query.page, query.row);
		},

		async getWriteGuardDecision(endpoint, input) {
			void input;
			return {
				code: 409,
				message: `Phase7 mutation guard blocked ${endpoint}; owner writes require controlled write, read-back, rollback, and guard restore evidence.`,
				errorCode: "PHASE7_MUTATION_GUARDED",
			};
		},
	};
}

function createOwner(sequence: number): OwnerMember {
	const id = String(sequence).padStart(4, "0");
	const communityId = getSeedCommunityId(sequence);
	const ownerTypeCd: OwnerMember["ownerTypeCd"] = sequence % 4 === 0 ? "1003" : sequence % 3 === 0 ? "1002" : "1001";
	const roomOrder = getRoomOrder(sequence);
	const roomName = `${roomOrder.floor}楼${roomOrder.unit}单元${roomOrder.room}室`;

	return {
		memberId: `MEM_${id}`,
		ownerId: `OWN_${id}`,
		communityId,
		name: `Owner ${String(sequence).padStart(3, "0")}`,
		ownerTypeCd,
		ownerTypeName: ownerTypeNameMap[ownerTypeCd],
		personRole: sequence % 4 === 0 ? "2" : "3",
		personType: sequence % 5 === 0 ? "C" : "P",
		roomName,
		roomId: `ROOM_${id}`,
		link: `1380000${String(sequence).padStart(4, "0")}`,
		idCard: `440100199001${String(sequence).padStart(2, "0")}000${sequence % 10}`,
		address: `${communityId} Building ${roomOrder.floor}-${roomOrder.unit}-${roomOrder.room}`,
		remark: "Phase7 deterministic owner compatibility seed",
		sex: String(sequence % 2),
		faceUrl: `https://example.test/owner-${id}.png`,
	};
}

function getSeedCommunityId(sequence: number): string {
	if (sequence === 3) {
		return "COMM_001";
	}
	if (sequence === 4) {
		return "COMM_002";
	}

	const communityIndex = ((sequence - 1) % 3) + 1;
	return `COMM_${String(communityIndex).padStart(3, "0")}`;
}

function getRoomOrder(sequence: number): { floor: number; unit: number; room: string } {
	if (sequence === 3) {
		return { floor: 1, unit: 1, room: "103" };
	}

	const floor = Math.floor((sequence - 1) / 12) + 1;
	const unit = (Math.floor((sequence - 1) / 4) % 3) + 1;
	const room = `${floor}${String(((sequence - 1) % 4) + 1).padStart(2, "0")}`;
	return { floor, unit, room };
}

function filterOwners(owners: OwnerMember[], query: OwnerListQuery): OwnerMember[] {
	let filtered = [...owners];

	if (query.communityId) {
		filtered = filtered.filter((owner) => owner.communityId === query.communityId);
	}

	if (query.memberId) {
		filtered = filtered.filter((owner) => owner.memberId === query.memberId);
	}

	if (query.name) {
		filtered = filtered.filter((owner) => owner.name.includes(query.name ?? ""));
	}

	if (query.link) {
		filtered = filtered.filter((owner) => owner.link.includes(query.link ?? ""));
	}

	if (query.roomName) {
		filtered = filtered.filter((owner) => owner.roomName.includes(query.roomName ?? ""));
	}

	return filtered.sort((left, right) => left.memberId.localeCompare(right.memberId));
}

function paginateOwners(items: OwnerMember[], page: number, row: number): OwnerListResult {
	const start = (page - 1) * row;
	const end = start + row;

	return {
		list: cloneValue(items.slice(start, end)),
		total: items.length,
		page,
		pageSize: row,
		hasMore: end < items.length,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
