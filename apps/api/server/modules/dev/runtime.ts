import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminDevAdapter } from "./admin-adapter";
import { createDevRepository, type DevRepository } from "./repository";
import { createDevService, type DevService } from "./service";

export interface DevRuntime {
	repository: DevRepository;
	service: DevService;
	adminAdapter: ReturnType<typeof createAdminDevAdapter>;
}

const fallbackRuntime = createDevRuntime(createDevRepository());

export function getDevRuntime(event?: H3Event): DevRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.devRuntime) {
		return context.devRuntime as DevRuntime;
	}

	const runtime = createDevRuntime(createDevRepository({ db: useDb(event) }));
	context.devRuntime = runtime;
	return runtime;
}

function createDevRuntime(repository: DevRepository): DevRuntime {
	const service = createDevService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminDevAdapter(service),
	};
}
