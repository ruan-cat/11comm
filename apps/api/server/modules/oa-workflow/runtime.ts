import type { H3Event } from "nitro/h3";
import { createLegacyOaWorkflowAdapter } from "./legacy-adapter";
import { createOaWorkflowRepository } from "./repository";
import { createOaWorkflowService, type OaWorkflowService } from "./service";
import type { OaWorkflowRepository } from "./types";

export interface OaWorkflowRuntime {
	repository: OaWorkflowRepository;
	service: OaWorkflowService;
	legacyAdapter: ReturnType<typeof createLegacyOaWorkflowAdapter>;
}

const fallbackRuntime = createOaWorkflowRuntime(createOaWorkflowRepository());

export function getOaWorkflowRuntime(_event?: H3Event): OaWorkflowRuntime {
	return fallbackRuntime;
}

export function createOaWorkflowRuntime(repository: OaWorkflowRepository): OaWorkflowRuntime {
	const service = createOaWorkflowService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyOaWorkflowAdapter(service),
	};
}
