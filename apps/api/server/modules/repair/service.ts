import type {
	CoreDictItem,
	CoreDictQuery,
	CreateRepairInput,
	ListRepairsHaveDoneParams,
	RepairListQuery,
	RepairsHaveDoneDbItem,
} from "./types";
import type { RepairRepository } from "./repository";

export interface RepairService {
	listOwnerRepairs: RepairRepository["listOwnerRepairs"];
	getOwnerRepair: RepairRepository["getOwnerRepair"];
	createOwnerRepair: (input: CreateRepairInput) => ReturnType<RepairRepository["createOwnerRepair"]>;
	listRepairSettings: RepairRepository["listRepairSettings"];
	listRepairStates: RepairRepository["listRepairStates"];
	listCoreDict: (params: CoreDictQuery) => Promise<CoreDictItem[]>;
	appraiseRepair: (params: { repairId: string; context: string }) => Promise<{ success: boolean } | undefined>;
	listRepairsHaveDone: (params: ListRepairsHaveDoneParams) => Promise<{ list: RepairsHaveDoneDbItem[]; total: number }>;
}

export function createRepairService(repository: RepairRepository): RepairService {
	return {
		listOwnerRepairs: (params: RepairListQuery) => repository.listOwnerRepairs(params),
		getOwnerRepair: (params) => repository.getOwnerRepair(params),
		createOwnerRepair: (input) => repository.createOwnerRepair(input),
		listRepairSettings: (params) => repository.listRepairSettings(params),
		listRepairStates: () => repository.listRepairStates(),
		listCoreDict: (params) => repository.listCoreDict(params),
		appraiseRepair: async (params) => {
			const repair = await repository.appraiseOwnerRepair(params);
			return repair ? { success: true } : undefined;
		},
		listRepairsHaveDone: (params) => repository.listRepairsHaveDone(params),
	};
}
