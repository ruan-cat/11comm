import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { rpRepairOrders, rpRepairSettings, rpRepairTypes } from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	CoreDictItem,
	CreateRepairInput,
	ListRepairsHaveDoneParams,
	RepairItem,
	RepairListQuery,
	RepairListResult,
	RepairSettingItem,
	RepairStateDictionaryItem,
	RepairsHaveDoneDbItem,
} from "./types";

export interface RepairRepository {
	listOwnerRepairs: (params: RepairListQuery) => Promise<RepairListResult>;
	getOwnerRepair: (params: { repairId: string }) => Promise<RepairItem | undefined>;
	createOwnerRepair: (input: CreateRepairInput) => Promise<RepairItem>;
	listRepairSettings: (params: { page: number; row: number; publicArea?: string }) => Promise<RepairSettingItem[]>;
	listRepairStates: () => Promise<RepairStateDictionaryItem[]>;
	listCoreDict: (params: { name?: string; type?: string; domain?: string }) => Promise<CoreDictItem[]>;
	appraiseOwnerRepair: (params: { repairId: string; context: string }) => Promise<RepairItem | undefined>;
	listRepairsHaveDone: (params: ListRepairsHaveDoneParams) => Promise<{ list: RepairsHaveDoneDbItem[]; total: number }>;
}

interface InMemoryRepairSeed {
	repairs: RepairItem[];
	settings: RepairSettingItem[];
	states: RepairStateDictionaryItem[];
}

export function createRepairRepository(options: { db?: DbType } = {}): RepairRepository {
	return options.db ? createDbRepairRepository(options.db) : createInMemoryRepairRepository();
}

export function createInMemoryRepairRepository(seed?: Partial<InMemoryRepairSeed>): RepairRepository {
	return new InMemoryRepairRepository(seed);
}

export function createDbRepairRepository(db: DbType): RepairRepository {
	const fallback = createInMemoryRepairRepository();
	const inMemoryListCoreDict = fallback.listCoreDict.bind(fallback);

	return Object.assign(fallback, {
		async listOwnerRepairs(params) {
			const conditions = [];
			if (params.statusCd) {
				conditions.push(eq(rpRepairOrders.status, toRepairDbStatus(params.statusCd) as any));
			}
			if (params.repairType) {
				conditions.push(eq(rpRepairOrders.repairType, params.repairType));
			}
			if (params.keyword) {
				const keyword = `%${params.keyword}%`;
				conditions.push(
					sql`(${rpRepairOrders.workOrderNumber} like ${keyword} or ${rpRepairOrders.problemDescription} like ${keyword} or ${rpRepairOrders.reporterName} like ${keyword} or ${rpRepairOrders.contactPhone} like ${keyword} or ${rpRepairOrders.repairLocation} like ${keyword})`,
				);
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rpRepairOrders)
				.where(where);
			const rows = await db
				.select()
				.from(rpRepairOrders)
				.where(where)
				.orderBy(desc(rpRepairOrders.createTime))
				.limit(params.row)
				.offset((params.page - 1) * params.row);
			const typeNames = await loadRepairTypeNames(db);

			return {
				list: rows.map((row) => mapRepairOrderToItem(row, typeNames)),
				total: Number(countResult[0]?.total || 0),
				page: params.page,
				row: params.row,
			};
		},
		async getOwnerRepair(params) {
			const rows = await db.select().from(rpRepairOrders).where(eq(rpRepairOrders.id, params.repairId)).limit(1);
			if (!rows[0]) {
				return undefined;
			}

			return mapRepairOrderToItem(rows[0], await loadRepairTypeNames(db));
		},
		async listRepairSettings(params) {
			const offset = (params.page - 1) * params.row;
			const settings = await db
				.select()
				.from(rpRepairSettings)
				.orderBy(desc(rpRepairSettings.createTime))
				.limit(params.row)
				.offset(offset);
			const types = await db.select().from(rpRepairTypes).orderBy(rpRepairTypes.sortOrder);
			const typeNames = new Map(types.map((type) => [type.id, type.typeName || type.id]));

			if (settings.length > 0) {
				return filterSettingsByPublicArea(
					settings.map((setting) => mapRepairSettingToItem(setting, typeNames)),
					params.publicArea,
				);
			}

			return filterSettingsByPublicArea(
				types.map((type) => mapRepairTypeToSetting(type)),
				params.publicArea,
			).slice(offset, offset + params.row);
		},
		async listRepairStates() {
			return mapRepairStatesToLegacy();
		},
		async listCoreDict(params) {
			if (params.domain === "repair_type") {
				const rows = await db.select().from(rpRepairTypes).orderBy(rpRepairTypes.sortOrder);
				return rows.map((row) => ({ statusCd: row.id, name: row.typeName || row.id }));
			}
			if (params.domain === "repair_status") {
				return mapRepairStatesToCoreDict();
			}
			return inMemoryListCoreDict(params);
		},
		async listRepairsHaveDone(params) {
			const conditions = [];

			conditions.push(eq(rpRepairOrders.status, "completed" as any));

			if (params.workOrderNumber) {
				conditions.push(like(rpRepairOrders.workOrderNumber, `%${params.workOrderNumber}%`));
			}

			if (params.reporter) {
				conditions.push(like(rpRepairOrders.reporterName, `%${params.reporter}%`));
			}

			if (params.repairPhone) {
				conditions.push(like(rpRepairOrders.contactPhone, `%${params.repairPhone}%`));
			}

			if (params.repairType) {
				conditions.push(eq(rpRepairOrders.repairType, params.repairType));
			}

			if (params.maintenanceType) {
				conditions.push(eq(rpRepairOrders.maintenanceType, params.maintenanceType));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;

			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rpRepairOrders)
				.where(where);

			const sortFieldMap: Record<string, any> = {
				createTime: rpRepairOrders.createTime,
				updateTime: rpRepairOrders.updateTime,
			};
			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const orderByColumn = sortFieldMap[sortBy] || rpRepairOrders.createTime;
			const orderByClause = sortOrder === "desc" ? desc(orderByColumn) : asc(orderByColumn);

			const rows = await db
				.select({
					id: rpRepairOrders.id,
					workOrderNumber: rpRepairOrders.workOrderNumber,
					repairType: rpRepairOrders.repairType,
					maintenanceType: rpRepairOrders.maintenanceType,
					reporterName: rpRepairOrders.reporterName,
					contactPhone: rpRepairOrders.contactPhone,
					repairLocation: rpRepairOrders.repairLocation,
					appointmentTime: rpRepairOrders.appointmentTime,
					status: rpRepairOrders.status,
					remark: rpRepairOrders.remark,
					createTime: rpRepairOrders.createTime,
					updateTime: rpRepairOrders.updateTime,
				})
				.from(rpRepairOrders)
				.where(where)
				.orderBy(orderByClause)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				list: rows,
				total: Number(countResult[0]?.total || 0),
			};
		},
	} satisfies Partial<RepairRepository>);
}

interface RepairOrderRecord {
	id: string;
	workOrderNumber: string;
	repairType?: string | null;
	reporterName?: string | null;
	contactPhone?: string | null;
	repairLocation?: string | null;
	problemDescription?: string | null;
	status?: string | null;
	remark?: string | null;
	createTime?: Date | string | number | null;
	updateTime?: Date | string | number | null;
}

interface RepairTypeRecord {
	id: string;
	typeName?: string | null;
}

interface RepairSettingRecord {
	id: string;
	settingType?: string | null;
	serviceArea?: string | null;
}

export function mapRepairOrderToItem(row: RepairOrderRecord, typeNames: Map<string, string> = new Map()): RepairItem {
	const repairType = row.repairType || "";
	const description = row.problemDescription || row.remark || "";
	const location = row.repairLocation || "";
	const status = row.status || "pending";
	const legacyStatus = toRepairLegacyStatus(status);

	return {
		repairId: row.id,
		workOrderNumber: row.workOrderNumber,
		title: description,
		context: description,
		repairName: row.reporterName || "",
		tel: row.contactPhone || "",
		address: location,
		repairObjName: location,
		repairType,
		repairTypeName: typeNames.get(repairType) || repairType,
		statusCd: legacyStatus.statusCd,
		statusName: legacyStatus.name,
		communityId: "COMM_001",
		createTime: formatDateTime(row.createTime),
		updateTime: formatDateTime(row.updateTime),
	};
}

async function loadRepairTypeNames(db: DbType): Promise<Map<string, string>> {
	const rows = await db.select().from(rpRepairTypes);
	return new Map(rows.map((row) => [row.id, row.typeName || row.id]));
}

function mapRepairTypeToSetting(row: RepairTypeRecord): RepairSettingItem {
	return {
		repairType: row.id,
		repairTypeName: row.typeName || row.id,
		publicArea: "F",
		payFeeFlag: "F",
		priceScope: "0",
	};
}

function mapRepairSettingToItem(
	row: RepairSettingRecord,
	typeNames: Map<string, string> = new Map(),
): RepairSettingItem {
	const publicArea = row.serviceArea === "public_area" ? "T" : "F";
	return {
		repairType: row.id,
		repairTypeName: row.settingType || typeNames.get(row.id) || row.id,
		publicArea,
		payFeeFlag: "F",
		priceScope: row.serviceArea || "0",
	};
}

function filterSettingsByPublicArea(settings: RepairSettingItem[], publicArea?: string): RepairSettingItem[] {
	return publicArea === "T" || publicArea === "F"
		? settings.filter((item) => item.publicArea === publicArea)
		: settings;
}

function mapRepairStatesToLegacy(): RepairStateDictionaryItem[] {
	return [
		{ statusCd: "10001", name: "待派单" },
		{ statusCd: "10002", name: "已派单" },
		{ statusCd: "10003", name: "处理中" },
		{ statusCd: "10004", name: "已完成" },
		{ statusCd: "10005", name: "已取消" },
		{ statusCd: "10006", name: "暂停" },
	];
}

function mapRepairStatesToCoreDict(): CoreDictItem[] {
	return [
		{ statusCd: "PENDING", name: "待派单" },
		{ statusCd: "ASSIGNED", name: "已派单" },
		{ statusCd: "IN_PROGRESS", name: "处理中" },
		{ statusCd: "COMPLETED", name: "已完成" },
		{ statusCd: "CANCELLED", name: "已取消" },
	];
}

const repairDbStatusByLegacyCode: Record<string, string> = {
	"10001": "pending",
	"10002": "processing",
	"10003": "processing",
	"10004": "completed",
	"10005": "cancelled",
	"10006": "paused",
};

const repairLegacyStatusByDbStatus: Record<string, RepairStateDictionaryItem> = {
	pending: { statusCd: "10001", name: "待派单" },
	processing: { statusCd: "10003", name: "处理中" },
	completed: { statusCd: "10004", name: "已完成" },
	cancelled: { statusCd: "10005", name: "已取消" },
	paused: { statusCd: "10006", name: "暂停" },
};

export function toRepairDbStatus(statusCd: string): string {
	return repairDbStatusByLegacyCode[statusCd] || statusCd;
}

function toRepairLegacyStatus(status: string): RepairStateDictionaryItem {
	return repairLegacyStatusByDbStatus[status] || { statusCd: status, name: status };
}

class InMemoryRepairRepository implements RepairRepository {
	private readonly repairs: RepairItem[];
	private readonly settings: RepairSettingItem[];
	private readonly states: RepairStateDictionaryItem[];

	constructor(seed?: Partial<InMemoryRepairSeed>) {
		this.repairs = structuredClone(seed?.repairs ?? defaultRepairs);
		this.settings = structuredClone(seed?.settings ?? defaultRepairSettings);
		this.states = structuredClone(seed?.states ?? defaultRepairStates);
	}

	async listOwnerRepairs(params: RepairListQuery): Promise<RepairListResult> {
		let data = [...this.repairs];
		if (params.communityId) {
			data = data.filter((item) => item.communityId === params.communityId);
		}
		if (params.statusCd) {
			data = data.filter((item) => item.statusCd === params.statusCd);
		}
		if (params.repairType) {
			data = data.filter((item) => item.repairType === params.repairType);
		}
		if (params.keyword) {
			const keyword = params.keyword.toLowerCase();
			data = data.filter((item) =>
				[item.workOrderNumber, item.title, item.context, item.repairName, item.tel, item.address]
					.join(" ")
					.toLowerCase()
					.includes(keyword),
			);
		}
		data.sort((left, right) => right.createTime.localeCompare(left.createTime));
		return paginate(data, params.page, params.row);
	}

	async getOwnerRepair(params: { repairId: string }): Promise<RepairItem | undefined> {
		const item = this.repairs.find((repair) => repair.repairId === params.repairId);
		return item ? structuredClone(item) : undefined;
	}

	async createOwnerRepair(input: CreateRepairInput): Promise<RepairItem> {
		const repairType = input.repairType || "1001";
		const item: RepairItem = {
			repairId: `REPAIR_${String(this.repairs.length + 1).padStart(3, "0")}`,
			workOrderNumber: `WO20260425${String(this.repairs.length + 1).padStart(4, "0")}`,
			title: input.title || "Owner repair",
			context: input.context || "",
			repairName: input.repairName || "Owner",
			tel: input.tel || "",
			address: input.address || "",
			repairType,
			repairTypeName: toRepairTypeName(repairType, this.settings),
			statusCd: "10001",
			statusName: toStatusName("10001", this.states),
			communityId: input.communityId || "COMM_001",
			createTime: "2026-04-25 09:00:00",
			updateTime: "2026-04-25 09:00:00",
		};
		this.repairs.unshift(item);
		return structuredClone(item);
	}

	async listRepairSettings(params: { page: number; row: number; publicArea?: string }): Promise<RepairSettingItem[]> {
		let data = [...this.settings];
		if (params.publicArea === "T" || params.publicArea === "F") {
			data = data.filter((item) => item.publicArea === params.publicArea);
		}
		return paginate(data, params.page, params.row).list;
	}

	async listRepairStates(): Promise<RepairStateDictionaryItem[]> {
		return structuredClone(this.states);
	}

	async listCoreDict(params: { name?: string; type?: string; domain?: string }): Promise<CoreDictItem[]> {
		const domain = params.domain;
		const name = params.name;
		const type = params.type;

		// property-application merged semantics: name+type takes precedence when domain is absent
		if (!domain && name && type) {
			if (name === "apply_room_discount" && type === "state") {
				return [
					{ statusCd: "0", name: "待提交" },
					{ statusCd: "1", name: "待验房" },
					{ statusCd: "2", name: "待审核" },
					{ statusCd: "3", name: "验房不通过" },
					{ statusCd: "4", name: "审批通过" },
					{ statusCd: "5", name: "审批不通过" },
					{ statusCd: "6", name: "已取消" },
				];
			}
			return [];
		}

		const dictData: Record<string, CoreDictItem[]> = {
			repair_status: [
				{ statusCd: "PENDING", name: "待派单" },
				{ statusCd: "ASSIGNED", name: "已派单" },
				{ statusCd: "IN_PROGRESS", name: "处理中" },
				{ statusCd: "COMPLETED", name: "已完成" },
				{ statusCd: "CANCELLED", name: "已取消" },
			],
			repair_type: [
				{ statusCd: "1001", name: "水电维修" },
				{ statusCd: "1002", name: "门窗维修" },
				{ statusCd: "1003", name: "空调维修" },
				{ statusCd: "1004", name: "电梯维修" },
				{ statusCd: "1005", name: "管道疏通" },
				{ statusCd: "1006", name: "墙面修补" },
				{ statusCd: "1007", name: "其他维修" },
			],
			maintenance_type: [
				{ statusCd: "1001", name: "有偿用料" },
				{ statusCd: "1002", name: "无偿用料" },
				{ statusCd: "1003", name: "有偿不用料" },
				{ statusCd: "1004", name: "无偿不用料" },
			],
		};
		return structuredClone(domain ? dictData[domain] || [] : []);
	}

	async listRepairsHaveDone(
		_params: ListRepairsHaveDoneParams,
	): Promise<{ list: RepairsHaveDoneDbItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async appraiseOwnerRepair(params: { repairId: string; context: string }): Promise<RepairItem | undefined> {
		const repair = this.repairs.find((item) => item.repairId === params.repairId);
		if (!repair) {
			return undefined;
		}

		repair.evaluation = {
			rating: 5,
			comment: params.context,
			evaluateTime: "2026-04-25 09:00:00",
		};
		repair.updateTime = "2026-04-25 09:00:00";

		return structuredClone(repair);
	}
}

function paginate<T>(data: T[], page: number, row: number) {
	const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
	const normalizedRow = Number.isFinite(row) && row > 0 ? row : 10;
	const start = (normalizedPage - 1) * normalizedRow;
	const end = start + normalizedRow;
	return {
		list: structuredClone(data.slice(start, end)),
		total: data.length,
		page: normalizedPage,
		row: normalizedRow,
	};
}

function toRepairTypeName(repairType: string, settings: RepairSettingItem[]): string {
	return settings.find((item) => item.repairType === repairType)?.repairTypeName || "General repair";
}

function toStatusName(statusCd: string, states: RepairStateDictionaryItem[]): string {
	return states.find((item) => item.statusCd === statusCd)?.name || "Pending";
}

const defaultRepairStates: RepairStateDictionaryItem[] = [
	{ statusCd: "10001", name: "Pending" },
	{ statusCd: "10002", name: "Processing" },
	{ statusCd: "10003", name: "Finished" },
];

const defaultRepairSettings: RepairSettingItem[] = [
	{
		repairType: "1001",
		repairTypeName: "Water and electricity",
		publicArea: "F",
		payFeeFlag: "F",
		priceScope: "0",
	},
	{
		repairType: "1002",
		repairTypeName: "Public area",
		publicArea: "T",
		payFeeFlag: "T",
		priceScope: "50-200",
	},
];

const defaultRepairs: RepairItem[] = [
	{
		repairId: "REPAIR_001",
		workOrderNumber: "WO202604250001",
		title: "Kitchen pipe leaking",
		context: "Kitchen pipe is leaking under the sink",
		repairName: "Zhang San",
		tel: "13800138001",
		address: "Building 1 Room 101",
		repairType: "1001",
		repairTypeName: "Water and electricity",
		statusCd: "10001",
		statusName: "Pending",
		communityId: "COMM_001",
		createTime: "2026-04-24 09:00:00",
		updateTime: "2026-04-24 09:00:00",
	},
	{
		repairId: "REPAIR_002",
		workOrderNumber: "WO202604250002",
		title: "Corridor lamp broken",
		context: "Public corridor lamp does not work",
		repairName: "Li Si",
		tel: "13800138002",
		address: "Building 2 Corridor",
		repairType: "1002",
		repairTypeName: "Public area",
		statusCd: "10002",
		statusName: "Processing",
		communityId: "COMM_001",
		createTime: "2026-04-24 10:00:00",
		updateTime: "2026-04-24 10:30:00",
	},
];
