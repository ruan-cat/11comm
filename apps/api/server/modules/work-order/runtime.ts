import type { H3Event } from "nitro/h3";
import { createLegacyWorkOrderAdapter } from "./legacy-adapter";
import { createWorkOrderRepository, type WorkOrderRepository } from "./repository";
import { createWorkOrderService, type WorkOrderService } from "./service";

export interface WorkOrderRuntime {
	repository: WorkOrderRepository;
	service: WorkOrderService;
	legacyAdapter: ReturnType<typeof createLegacyWorkOrderAdapter>;
}

const fallbackRuntime = createWorkOrderRuntime(createWorkOrderRepository());

export function getWorkOrderRuntime(_event?: H3Event): WorkOrderRuntime {
	return fallbackRuntime;
}

function createWorkOrderRuntime(repository: WorkOrderRepository): WorkOrderRuntime {
	const service = createWorkOrderService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyWorkOrderAdapter(service),
	};
}
