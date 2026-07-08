import type {
	CoreDictItem,
	CoreDictQuery,
	CreateRepairInput,
	ListRepairsHaveDoneParams,
	RepairListQuery,
	RepairPayTypeItem,
	RepairResource,
	RepairStaff,
	RepairStaffRecord,
	RepairStatistics,
	RepairTypeUser,
	RepairsHaveDoneDbItem,
} from "./types";
import type { RepairRepository } from "./repository";

export interface RepairService {
	listOwnerRepairs: RepairRepository["listOwnerRepairs"];
	getOwnerRepair: RepairRepository["getOwnerRepair"];
	createOwnerRepair: (input: CreateRepairInput) => ReturnType<RepairRepository["createOwnerRepair"]>;
	listRepairSettings: RepairRepository["listRepairSettings"];
	listRepairStates: RepairRepository["listRepairStates"];
	listPayTypes: () => Promise<RepairPayTypeItem[]>;
	listRepairStaffs: (repairType?: string) => Promise<RepairStaff[]>;
	listRepairTypeUsers: (repairType?: string) => Promise<RepairTypeUser[]>;
	listResources: (rstId?: string) => Promise<{ resources: RepairResource[]; total: number }>;
	getRepairStatistics: () => Promise<RepairStatistics>;
	listRepairStaffRecords: (repairId: string) => Promise<RepairStaffRecord[]>;
	listCoreDict: (params: CoreDictQuery) => Promise<CoreDictItem[]>;
	appraiseRepair: (params: { repairId: string; context: string }) => Promise<{ success: boolean } | undefined>;
	listRepairsHaveDone: (params: ListRepairsHaveDoneParams) => Promise<{ list: RepairsHaveDoneDbItem[]; total: number }>;
	listStaffRepairs: RepairRepository["listStaffRepairs"];
	listStaffFinishRepairs: RepairRepository["listStaffFinishRepairs"];
}

export function createRepairService(repository: RepairRepository): RepairService {
	return {
		listOwnerRepairs: (params: RepairListQuery) => repository.listOwnerRepairs(params),
		getOwnerRepair: (params) => repository.getOwnerRepair(params),
		createOwnerRepair: (input) => repository.createOwnerRepair(input),
		listRepairSettings: (params) => repository.listRepairSettings(params),
		listRepairStates: () => repository.listRepairStates(),
		listPayTypes: () => repository.listPayTypes(),
		listRepairStaffs: (repairType) => repository.listRepairStaffs(repairType),
		listRepairTypeUsers: (repairType) => repository.listRepairTypeUsers(repairType),
		listResources: (rstId) => repository.listResources(rstId),
		getRepairStatistics: () => repository.getRepairStatistics(),
		listRepairStaffRecords: (repairId) => repository.listRepairStaffRecords(repairId),
		listCoreDict: (params) => repository.listCoreDict(params),
		appraiseRepair: async (params) => {
			const repair = await repository.appraiseOwnerRepair(params);
			return repair ? { success: true } : undefined;
		},
		listRepairsHaveDone: (params) => repository.listRepairsHaveDone(params),
		listStaffRepairs: (params) => repository.listStaffRepairs(params),
		listStaffFinishRepairs: (params) => repository.listStaffFinishRepairs(params),
	};
}
