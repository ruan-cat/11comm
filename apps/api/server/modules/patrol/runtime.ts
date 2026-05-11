import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminPatrolAdapter } from "./admin-adapter";
import { createPatrolRepository, type PatrolRepository } from "./repository";
import { createPatrolService, type PatrolService } from "./service";

export interface PatrolRuntime {
	repository: PatrolRepository;
	service: PatrolService;
	adminAdapter: ReturnType<typeof createAdminPatrolAdapter>;
}

const fallbackRuntime = createPatrolRuntime(createPatrolRepository());

export function getPatrolRuntime(event?: H3Event): PatrolRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.patrolRuntime) {
		return context.patrolRuntime as PatrolRuntime;
	}

	const runtime = createPatrolRuntime(createPatrolRepository({ db: useDb(event) }));
	context.patrolRuntime = runtime;
	return runtime;
}

function createPatrolRuntime(repository: PatrolRepository): PatrolRuntime {
	const service = createPatrolService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminPatrolAdapter(service),
	};
}
