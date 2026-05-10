import { and, eq } from "drizzle-orm";
import { hpHouses } from "@01s-11comm/type";
import type { DbType } from "../../db";
import type { Floor, FloorListQuery, FloorListResult } from "./types";

export interface FloorRepository {
	getFloorById: (floorId: string) => Promise<Floor | undefined>;
	listFloors: (params: FloorListQuery) => Promise<FloorListResult>;
}

export function createFloorRepository(options: { db?: DbType } = {}): FloorRepository {
	return options.db ? createDbFloorRepository(options.db) : createInMemoryFloorRepository();
}

export function createInMemoryFloorRepository(): FloorRepository {
	return new InMemoryFloorRepository();
}

export function createDbFloorRepository(db: DbType): FloorRepository {
	const fallback = createInMemoryFloorRepository();

	return Object.assign(fallback, {
		async getFloorById(floorId: string) {
			const floors = await loadDbFloors(db, parseDbFloorId(floorId)?.communityId);
			return floors.find((floor) => floor.floorId === floorId);
		},
		async listFloors(params: FloorListQuery) {
			let data = await loadDbFloors(db, params.communityId);

			if (params.floorNum) {
				data = data.filter((f) => f.floorNum.includes(params.floorNum!));
			}
			if (params.keyword) {
				const kw = params.keyword.toLowerCase();
				data = data.filter((f) => f.floorName.toLowerCase().includes(kw) || f.floorNum.toLowerCase().includes(kw));
			}

			return paginateFloors(data, params.page, params.row);
		},
	} satisfies Partial<FloorRepository>);
}

class InMemoryFloorRepository implements FloorRepository {
	private readonly floors: Floor[];

	constructor() {
		this.floors = generateFloors();
	}

	async getFloorById(floorId: string): Promise<Floor | undefined> {
		const floor = this.floors.find((f) => f.floorId === floorId);
		return floor ? structuredClone(floor) : undefined;
	}

	async listFloors(params: FloorListQuery): Promise<FloorListResult> {
		let data = [...this.floors];

		if (params.communityId) {
			data = data.filter((f) => f.communityId === params.communityId);
		}
		if (params.floorNum) {
			data = data.filter((f) => f.floorNum.includes(params.floorNum!));
		}
		if (params.keyword) {
			const kw = params.keyword.toLowerCase();
			data = data.filter((f) => f.floorName.toLowerCase().includes(kw) || f.floorNum.toLowerCase().includes(kw));
		}

		return paginateFloors(data, params.page, params.row);
	}
}

interface HouseFloorRecord {
	communityId?: string | null;
	buildingNo?: string | null;
	floor?: number | string | null;
}

async function loadDbFloors(db: DbType, communityId?: string): Promise<Floor[]> {
	const conditions = [];
	if (communityId && isUuid(communityId)) {
		conditions.push(eq(hpHouses.communityId, communityId));
	}
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const rows = await db
		.select()
		.from(hpHouses)
		.where(where)
		.orderBy(hpHouses.communityId, hpHouses.buildingNo, hpHouses.floor);
	return aggregateHouseFloors(rows);
}

export function aggregateHouseFloors(rows: HouseFloorRecord[]): Floor[] {
	const floors = new Map<string, Floor>();

	for (const row of rows) {
		const communityId = toStringOrEmpty(row.communityId);
		const buildingNo = toStringOrEmpty(row.buildingNo);
		const floorNum = toStringOrEmpty(row.floor);
		if (!communityId || !buildingNo || !floorNum) {
			continue;
		}

		const key = `${communityId}\u0000${buildingNo}\u0000${floorNum}`;
		if (!floors.has(key)) {
			floors.set(key, {
				floorId: encodeDbFloorId(communityId, buildingNo, floorNum),
				floorNum,
				floorName: `${buildingNo}-${floorNum}`,
				communityId,
			});
		}
	}

	return [...floors.values()];
}

function paginateFloors(data: Floor[], page: number, row: number): FloorListResult {
	const total = data.length;
	const normalizedPage = page > 0 ? page : 1;
	const normalizedRow = row > 0 ? row : 50;
	const start = (normalizedPage - 1) * normalizedRow;
	const end = start + normalizedRow;

	return {
		list: structuredClone(data.slice(start, end)),
		total,
		page: normalizedPage,
		pageSize: normalizedRow,
		hasMore: end < total,
	};
}

function encodeDbFloorId(communityId: string, buildingNo: string, floorNum: string): string {
	return `DB_${communityId}_${encodeURIComponent(buildingNo)}_${encodeURIComponent(floorNum)}`;
}

function parseDbFloorId(floorId: string): { communityId: string } | undefined {
	const match = /^DB_([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})_/i.exec(floorId);
	return match ? { communityId: match[1] } : undefined;
}

function toStringOrEmpty(value: unknown): string {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value);
}

function isUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function generateFloors(): Floor[] {
	const communities = ["COMM_001", "COMM_002", "COMM_003"];
	const buildingLabels = ["住宅楼", "商住楼", "公寓楼", "高层住宅", "小高层"];
	const floors: Floor[] = [];

	for (const communityId of communities) {
		for (let index = 1; index <= 30; index++) {
			const buildingLabel = buildingLabels[(index - 1) % buildingLabels.length];
			floors.push({
				floorId: `F_${communityId}_${index.toString().padStart(3, "0")}`,
				floorNum: index.toString(),
				floorName: `${index}${buildingLabel}`,
				communityId,
			});
		}
	}

	return floors;
}
