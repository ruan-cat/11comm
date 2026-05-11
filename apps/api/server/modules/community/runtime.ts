import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminCommunityAdapter } from "./admin-adapter";
import { createCommunityRepository, type CommunityRepository } from "./repository";
import { createCommunityService, type CommunityService } from "./service";

export interface CommunityRuntime {
	repository: CommunityRepository;
	service: CommunityService;
	adminAdapter: ReturnType<typeof createAdminCommunityAdapter>;
}

const fallbackRuntime = createCommunityRuntime(createCommunityRepository());

export function getCommunityRuntime(event?: H3Event): CommunityRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.communityRuntime) {
		return context.communityRuntime as CommunityRuntime;
	}

	const runtime = createCommunityRuntime(createCommunityRepository({ db: useDb(event) }));
	context.communityRuntime = runtime;
	return runtime;
}

function createCommunityRuntime(repository: CommunityRepository): CommunityRuntime {
	const service = createCommunityService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminCommunityAdapter(service),
	};
}
