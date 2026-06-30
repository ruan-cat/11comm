import type { H3Event } from "nitro/h3";
import { createLegacyStaffAdapter } from "./legacy-adapter";
import { createStaffRepository, type StaffRepository } from "./repository";
import { createStaffService, type StaffService } from "./service";

export interface StaffRuntime {
	repository: StaffRepository;
	service: StaffService;
	legacyAdapter: ReturnType<typeof createLegacyStaffAdapter>;
}

const fallbackRuntime = createStaffRuntime(createStaffRepository());

export function getStaffRuntime(_event?: H3Event): StaffRuntime {
	return fallbackRuntime;
}

function createStaffRuntime(repository: StaffRepository): StaffRuntime {
	const service = createStaffService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyStaffAdapter(service),
	};
}
