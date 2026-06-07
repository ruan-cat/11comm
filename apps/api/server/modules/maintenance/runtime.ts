import type { H3Event } from "nitro/h3";
import { createLegacyMaintenanceAdapter } from "./legacy-adapter";
import { createMaintenanceRepository, type MaintenanceRepository } from "./repository";
import { createMaintenanceService, type MaintenanceService } from "./service";

export interface MaintenanceRuntime {
	repository: MaintenanceRepository;
	service: MaintenanceService;
	legacyAdapter: ReturnType<typeof createLegacyMaintenanceAdapter>;
}

const fallbackRuntime = createMaintenanceRuntime(createMaintenanceRepository());

export function getMaintenanceRuntime(_event?: H3Event): MaintenanceRuntime {
	return fallbackRuntime;
}

function createMaintenanceRuntime(repository: MaintenanceRepository): MaintenanceRuntime {
	const service = createMaintenanceService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyMaintenanceAdapter(service),
	};
}
