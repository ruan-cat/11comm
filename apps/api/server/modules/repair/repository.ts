import type {
	CreateRepairInput,
	RepairItem,
	RepairListQuery,
	RepairListResult,
	RepairSettingItem,
	RepairStateDictionaryItem,
} from "./types";

export interface RepairRepository {
	listOwnerRepairs: (params: RepairListQuery) => Promise<RepairListResult>;
	getOwnerRepair: (params: { repairId: string }) => Promise<RepairItem | undefined>;
	createOwnerRepair: (input: CreateRepairInput) => Promise<RepairItem>;
	listRepairSettings: (params: { page: number; row: number; publicArea?: string }) => Promise<RepairSettingItem[]>;
	listRepairStates: () => Promise<RepairStateDictionaryItem[]>;
}

interface InMemoryRepairSeed {
	repairs: RepairItem[];
	settings: RepairSettingItem[];
	states: RepairStateDictionaryItem[];
}

export function createRepairRepository(): RepairRepository {
	return createInMemoryRepairRepository();
}

export function createInMemoryRepairRepository(seed?: Partial<InMemoryRepairSeed>): RepairRepository {
	return new InMemoryRepairRepository(seed);
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
