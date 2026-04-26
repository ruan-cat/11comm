import type { H3Event } from "nitro/h3";
import { createAdminRepairAdapter } from "./admin-adapter";
import { createLegacyRepairAdapter } from "./legacy-adapter";
import { createRepairRepository, type RepairRepository } from "./repository";
import { createRepairService, type RepairService } from "./service";

export interface RepairRuntime {
	repository: RepairRepository;
	service: RepairService;
	adminAdapter: ReturnType<typeof createAdminRepairAdapter>;
	legacyAdapter: ReturnType<typeof createLegacyRepairAdapter>;
}

const fallbackRuntime = createRepairRuntime(createRepairRepository());

export function getRepairRuntime(event?: H3Event): RepairRuntime {
	void event;
	return fallbackRuntime;
}

export function createRepairRuntime(repository: RepairRepository): RepairRuntime {
	const service = createRepairService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminRepairAdapter(service),
		legacyAdapter: createLegacyRepairAdapter(service),
	};
}
