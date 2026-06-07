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
	RepairPayTypeItem,
	RepairResource,
	RepairResourceType,
	RepairSettingItem,
	RepairStateDictionaryItem,
	RepairStaff,
	RepairStaffRecord,
	RepairStatistics,
	RepairTypeUser,
	RepairsHaveDoneDbItem,
} from "./types";

export interface RepairRepository {
	listOwnerRepairs: (params: RepairListQuery) => Promise<RepairListResult>;
	getOwnerRepair: (params: { repairId: string }) => Promise<RepairItem | undefined>;
	createOwnerRepair: (input: CreateRepairInput) => Promise<RepairItem>;
	listRepairSettings: (params: { page: number; row: number; publicArea?: string }) => Promise<RepairSettingItem[]>;
	listRepairStates: () => Promise<RepairStateDictionaryItem[]>;
	listPayTypes: () => Promise<RepairPayTypeItem[]>;
	listRepairStaffs: (repairType?: string) => Promise<RepairStaff[]>;
	listRepairTypeUsers: (repairType?: string) => Promise<RepairTypeUser[]>;
	listResources: (rstId?: string) => Promise<{ resources: RepairResource[]; total: number }>;
	getRepairStatistics: () => Promise<RepairStatistics>;
	listRepairStaffRecords: (repairId: string) => Promise<RepairStaffRecord[]>;
	listCoreDict: (params: { name?: string; type?: string; domain?: string }) => Promise<CoreDictItem[]>;
	appraiseOwnerRepair: (params: { repairId: string; context: string }) => Promise<RepairItem | undefined>;
	listRepairsHaveDone: (params: ListRepairsHaveDoneParams) => Promise<{ list: RepairsHaveDoneDbItem[]; total: number }>;
}

interface InMemoryRepairSeed {
	repairs: RepairItem[];
	settings: RepairSettingItem[];
	states: RepairStateDictionaryItem[];
	payTypes: RepairPayTypeItem[];
	staffs: RepairStaff[];
	resourceTypes: RepairResourceType[];
	resources: RepairResource[];
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
	private readonly payTypes: RepairPayTypeItem[];
	private readonly staffs: RepairStaff[];
	private readonly resourceTypes: RepairResourceType[];
	private readonly resources: RepairResource[];

	constructor(seed?: Partial<InMemoryRepairSeed>) {
		this.repairs = structuredClone(seed?.repairs ?? defaultRepairs);
		this.settings = structuredClone(seed?.settings ?? defaultRepairSettings);
		this.states = structuredClone(seed?.states ?? defaultRepairStates);
		this.payTypes = structuredClone(seed?.payTypes ?? defaultPayTypes);
		this.staffs = structuredClone(seed?.staffs ?? defaultRepairStaffs);
		this.resourceTypes = structuredClone(seed?.resourceTypes ?? defaultRepairResourceTypes);
		this.resources = structuredClone(seed?.resources ?? defaultRepairResources);
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

	async listPayTypes(): Promise<RepairPayTypeItem[]> {
		return structuredClone(this.payTypes);
	}

	async listRepairStaffs(repairType?: string): Promise<RepairStaff[]> {
		return structuredClone(filterRepairStaffs(this.staffs, repairType, this.settings));
	}

	async listRepairTypeUsers(repairType?: string): Promise<RepairTypeUser[]> {
		return filterRepairStaffs(this.staffs, repairType, this.settings).map((staff) => ({
			userId: staff.staffId,
			userName: staff.staffName,
		}));
	}

	async listResources(rstId?: string): Promise<{ resources: RepairResource[]; total: number }> {
		let resources = [...this.resources];
		if (rstId) {
			const resourceType = this.resourceTypes.find((item) => item.rstId === rstId);
			if (resourceType) {
				resources = resources.filter((item) => item.resTypeName === resourceType.name);
			}
		}

		return {
			resources: structuredClone(resources),
			total: resources.length,
		};
	}

	async getRepairStatistics(): Promise<RepairStatistics> {
		const statusStats = countBy(this.repairs, (repair) => repair.statusCd || "UNKNOWN");
		const typeStats = countBy(this.repairs, (repair) => repair.repairType || "UNKNOWN");
		const monthlyStats = countBy(this.repairs, (repair) => (repair.createTime || "").slice(0, 7) || "UNKNOWN");
		const evaluatedRepairs = this.repairs.filter((repair) => repair.evaluation);
		const satisfiedCount = evaluatedRepairs.filter((repair) => (repair.evaluation?.rating || 0) >= 4).length;
		const satisfactionRate =
			evaluatedRepairs.length > 0 ? `${Math.round((satisfiedCount / evaluatedRepairs.length) * 100)}%` : "0%";

		return {
			total: this.repairs.length,
			statusStats,
			typeStats,
			monthlyStats,
			avgResponseTime: "2.5小时",
			satisfactionRate,
		};
	}

	async listRepairStaffRecords(repairId: string): Promise<RepairStaffRecord[]> {
		const repair = this.repairs.find((item) => item.repairId === repairId);
		if (!repair) {
			return [];
		}

		const records: RepairStaffRecord[] = [
			{
				ruId: "RU_001",
				repairId,
				staffId: "STAFF_001",
				staffName: "张师傅",
				statusCd: "10001",
				statusName: "待派单",
				startTime: repair.createTime,
				endTime: repair.statusCd !== "10001" ? addHours(repair.createTime, 1) : undefined,
				context: "工单已创建",
			},
		];

		if (["10002", "10003", "10004"].includes(repair.statusCd)) {
			records.push({
				ruId: "RU_002",
				repairId,
				staffId: "STAFF_002",
				staffName: "李师傅",
				statusCd: "10002",
				statusName: "已派单",
				startTime: addHours(repair.createTime, 1),
				endTime: repair.statusCd !== "10002" ? addHours(repair.createTime, 2) : undefined,
				context: "已派单给维修师傅",
			});
		}

		if (["10003", "10004"].includes(repair.statusCd)) {
			records.push({
				ruId: "RU_003",
				repairId,
				staffId: "STAFF_002",
				staffName: "李师傅",
				statusCd: "10003",
				statusName: "处理中",
				startTime: addHours(repair.createTime, 2),
				endTime: repair.statusCd === "10004" ? addHours(repair.createTime, 3) : undefined,
				context: "正在处理维修问题",
			});
		}

		if (repair.statusCd === "10004") {
			records.push({
				ruId: "RU_004",
				repairId,
				staffId: "STAFF_002",
				staffName: "李师傅",
				statusCd: "10004",
				statusName: "已完成",
				startTime: addHours(repair.createTime, 3),
				endTime: addHours(repair.createTime, 3),
				context: "维修已完成，问题已解决",
			});
		}

		if (repair.evaluation) {
			records.push({
				ruId: "RU_005",
				repairId,
				staffId: "STAFF_002",
				staffName: "李师傅",
				statusCd: "10007",
				statusName: "业主评价",
				startTime: repair.evaluation.evaluateTime,
				endTime: repair.evaluation.evaluateTime,
				context: repair.evaluation.comment,
			});
		}

		return structuredClone(records);
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

function countBy<T>(items: T[], selector: (item: T) => string): Record<string, number> {
	return items.reduce(
		(result, item) => {
			const key = selector(item);
			result[key] = (result[key] || 0) + 1;
			return result;
		},
		{} as Record<string, number>,
	);
}

function addHours(dateTime: string, hours: number): string {
	const timestamp = Date.parse(dateTime.replace(" ", "T"));
	if (!Number.isFinite(timestamp)) {
		return dateTime;
	}

	return formatDateTime(timestamp + hours * 60 * 60 * 1000);
}

function filterRepairStaffs(
	staffs: RepairStaff[],
	repairType: string | undefined,
	settings: RepairSettingItem[],
): RepairStaff[] {
	if (!repairType) {
		return staffs;
	}

	const repairTypeName = toRepairTypeName(repairType, settings);
	return staffs.filter((staff) => staff.repairTypes.includes(repairType) || staff.repairTypes.includes(repairTypeName));
}

const defaultRepairStates: RepairStateDictionaryItem[] = [
	{ statusCd: "10001", name: "Pending" },
	{ statusCd: "10002", name: "Processing" },
	{ statusCd: "10003", name: "Finished" },
];

const defaultPayTypes: RepairPayTypeItem[] = [
	{ statusCd: "1001", name: "有偿服务" },
	{ statusCd: "1002", name: "无偿服务" },
	{ statusCd: "1003", name: "有偿不使用材料" },
	{ statusCd: "1004", name: "无偿不使用材料" },
];

const defaultRepairSettings: RepairSettingItem[] = [
	{
		repairType: "1001",
		repairTypeName: "水电维修",
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

const defaultRepairStaffs: RepairStaff[] = [
	{ staffId: "STAFF_001", staffName: "张师傅", repairTypes: ["水电维修", "管道疏通"] },
	{ staffId: "STAFF_002", staffName: "李师傅", repairTypes: ["门窗维修", "墙面修补"] },
	{ staffId: "STAFF_003", staffName: "王师傅", repairTypes: ["空调维修", "电梯维修"] },
	{ staffId: "STAFF_004", staffName: "赵师傅", repairTypes: ["水电维修", "其他维修"] },
	{ staffId: "STAFF_005", staffName: "刘师傅", repairTypes: ["管道疏通", "墙面修补"] },
];

const defaultRepairResourceTypes: RepairResourceType[] = [
	{ rstId: "RST_001", name: "水电材料", parentRstId: "0" },
	{ rstId: "RST_002", name: "五金材料", parentRstId: "0" },
	{ rstId: "RST_003", name: "空调材料", parentRstId: "0" },
	{ rstId: "RST_004", name: "装修材料", parentRstId: "0" },
	{ rstId: "RST_001_01", name: "水管类", parentRstId: "RST_001" },
	{ rstId: "RST_001_02", name: "电线类", parentRstId: "RST_001" },
	{ rstId: "RST_001_03", name: "开关插座", parentRstId: "RST_001" },
	{ rstId: "RST_002_01", name: "门锁类", parentRstId: "RST_002" },
	{ rstId: "RST_002_02", name: "密封条", parentRstId: "RST_002" },
	{ rstId: "RST_002_03", name: "滑轨配件", parentRstId: "RST_002" },
	{ rstId: "RST_003_01", name: "制冷剂", parentRstId: "RST_003" },
	{ rstId: "RST_003_02", name: "滤网", parentRstId: "RST_003" },
	{ rstId: "RST_004_01", name: "瓷砖类", parentRstId: "RST_004" },
	{ rstId: "RST_004_02", name: "涂料类", parentRstId: "RST_004" },
];

const defaultRepairResources: RepairResource[] = [
	{
		resId: "RES_001",
		resName: "水龙头",
		resTypeName: "水管类",
		specName: "普通型",
		price: 50,
		outLowPrice: 40,
		outHighPrice: 60,
		unit: "个",
		stock: 20,
	},
	{
		resId: "RES_008",
		resName: "管道胶",
		resTypeName: "水管类",
		specName: "防水型",
		price: 35,
		outLowPrice: 30,
		outHighPrice: 40,
		unit: "瓶",
		stock: 15,
	},
	{
		resId: "RES_007",
		resName: "电线",
		resTypeName: "电线类",
		specName: "2.5平方",
		price: 8,
		outLowPrice: 7,
		outHighPrice: 10,
		unit: "米",
		stock: 500,
	},
	{
		resId: "RES_009",
		resName: "网线",
		resTypeName: "电线类",
		specName: "六类线",
		price: 3,
		outLowPrice: 2.5,
		outHighPrice: 3.5,
		unit: "米",
		stock: 300,
	},
	{
		resId: "RES_002",
		resName: "插座",
		resTypeName: "开关插座",
		specName: "五孔",
		price: 15,
		outLowPrice: 12,
		outHighPrice: 18,
		unit: "个",
		stock: 50,
	},
	{
		resId: "RES_010",
		resName: "开关",
		resTypeName: "开关插座",
		specName: "单开",
		price: 10,
		outLowPrice: 8,
		outHighPrice: 12,
		unit: "个",
		stock: 60,
	},
	{
		resId: "RES_003",
		resName: "门锁",
		resTypeName: "门锁类",
		specName: "防盗型",
		price: 120,
		outLowPrice: 100,
		outHighPrice: 150,
		unit: "把",
		stock: 10,
	},
	{
		resId: "RES_011",
		resName: "智能门锁",
		resTypeName: "门锁类",
		specName: "指纹识别",
		price: 800,
		outLowPrice: 700,
		outHighPrice: 900,
		unit: "把",
		stock: 5,
	},
	{
		resId: "RES_004",
		resName: "窗户密封条",
		resTypeName: "密封条",
		specName: "隔音型",
		price: 30,
		outLowPrice: 25,
		outHighPrice: 35,
		unit: "米",
		stock: 100,
	},
	{
		resId: "RES_012",
		resName: "门缝密封条",
		resTypeName: "密封条",
		specName: "防风型",
		price: 25,
		outLowPrice: 20,
		outHighPrice: 30,
		unit: "米",
		stock: 80,
	},
	{
		resId: "RES_005",
		resName: "空调氟利昂",
		resTypeName: "制冷剂",
		specName: "R410A",
		price: 200,
		outLowPrice: 180,
		outHighPrice: 220,
		unit: "瓶",
		stock: 5,
	},
	{
		resId: "RES_013",
		resName: "R32制冷剂",
		resTypeName: "制冷剂",
		specName: "环保型",
		price: 180,
		outLowPrice: 160,
		outHighPrice: 200,
		unit: "瓶",
		stock: 8,
	},
	{
		resId: "RES_014",
		resName: "空调滤网",
		resTypeName: "滤网",
		specName: "通用型",
		price: 40,
		outLowPrice: 35,
		outHighPrice: 45,
		unit: "个",
		stock: 20,
	},
	{
		resId: "RES_006",
		resName: "瓷砖",
		resTypeName: "瓷砖类",
		specName: "釉面砖",
		price: 25,
		outLowPrice: 20,
		outHighPrice: 30,
		unit: "片",
		stock: 200,
	},
	{
		resId: "RES_015",
		resName: "地砖",
		resTypeName: "瓷砖类",
		specName: "防滑型",
		price: 35,
		outLowPrice: 30,
		outHighPrice: 40,
		unit: "片",
		stock: 150,
	},
	{
		resId: "RES_016",
		resName: "乳胶漆",
		resTypeName: "涂料类",
		specName: "环保型",
		price: 120,
		outLowPrice: 100,
		outHighPrice: 140,
		unit: "桶",
		stock: 10,
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
