import type { H3Event } from "nitro/h3";
import { createLegacyAppointmentAdapter } from "./legacy-adapter";
import { createAppointmentRepository, type AppointmentRepository } from "./repository";
import { createAppointmentService, type AppointmentService } from "./service";

export interface AppointmentRuntime {
	repository: AppointmentRepository;
	service: AppointmentService;
	legacyAdapter: ReturnType<typeof createLegacyAppointmentAdapter>;
}

const fallbackRuntime = createAppointmentRuntime(createAppointmentRepository());

export function getAppointmentRuntime(_event?: H3Event): AppointmentRuntime {
	return fallbackRuntime;
}

function createAppointmentRuntime(repository: AppointmentRepository): AppointmentRuntime {
	const service = createAppointmentService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyAppointmentAdapter(service),
	};
}
