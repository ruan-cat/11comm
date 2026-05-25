import type { H3Event } from "nitro/h3";
import { createLegacyComplaintAdapter } from "./legacy-adapter";
import { createComplaintRepository, type ComplaintRepository } from "./repository";
import { createComplaintService, type ComplaintService } from "./service";

export interface ComplaintRuntime {
	repository: ComplaintRepository;
	service: ComplaintService;
	legacyAdapter: ReturnType<typeof createLegacyComplaintAdapter>;
}

const fallbackRuntime = createComplaintRuntime(createComplaintRepository());

export function getComplaintRuntime(_event?: H3Event): ComplaintRuntime {
	return fallbackRuntime;
}

function createComplaintRuntime(repository: ComplaintRepository): ComplaintRuntime {
	const service = createComplaintService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyComplaintAdapter(service),
	};
}
