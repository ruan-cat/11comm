import type { H3Event } from "nitro/h3";
import { createLegacyContactAdapter } from "./legacy-adapter";
import { createContactRepository, type ContactRepository } from "./repository";
import { createContactService, type ContactService } from "./service";

export interface ContactRuntime {
	repository: ContactRepository;
	service: ContactService;
	legacyAdapter: ReturnType<typeof createLegacyContactAdapter>;
}

const fallbackRuntime = createContactRuntime(createContactRepository());

export function getContactRuntime(_event?: H3Event): ContactRuntime {
	return fallbackRuntime;
}

function createContactRuntime(repository: ContactRepository): ContactRuntime {
	const service = createContactService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyContactAdapter(service),
	};
}
