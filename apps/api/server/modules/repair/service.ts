import type { CreateRepairInput, RepairListQuery } from "./types";
import type { RepairRepository } from "./repository";

export interface RepairService {
	listOwnerRepairs: RepairRepository["listOwnerRepairs"];
	getOwnerRepair: RepairRepository["getOwnerRepair"];
	createOwnerRepair: (input: CreateRepairInput) => ReturnType<RepairRepository["createOwnerRepair"]>;
	listRepairSettings: RepairRepository["listRepairSettings"];
	listRepairStates: RepairRepository["listRepairStates"];
}

export function createRepairService(repository: RepairRepository): RepairService {
	return {
		listOwnerRepairs: (params: RepairListQuery) => repository.listOwnerRepairs(params),
		getOwnerRepair: (params) => repository.getOwnerRepair(params),
		createOwnerRepair: (input) => repository.createOwnerRepair(input),
		listRepairSettings: (params) => repository.listRepairSettings(params),
		listRepairStates: () => repository.listRepairStates(),
	};
}
