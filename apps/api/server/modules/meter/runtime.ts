import type { H3Event } from "nitro/h3";
import { createLegacyMeterAdapter } from "./legacy-adapter";
import { createMeterRepository, type MeterRepository } from "./repository";
import { createMeterService, type MeterService } from "./service";

export interface MeterRuntime {
	repository: MeterRepository;
	service: MeterService;
	legacyAdapter: ReturnType<typeof createLegacyMeterAdapter>;
}

const fallbackRuntime = createMeterRuntime(createMeterRepository());

export function getMeterRuntime(_event?: H3Event): MeterRuntime {
	return fallbackRuntime;
}

function createMeterRuntime(repository: MeterRepository): MeterRuntime {
	const service = createMeterService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyMeterAdapter(service),
	};
}
