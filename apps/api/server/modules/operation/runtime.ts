import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminOperationAdapter } from "./admin-adapter";
import { createOperationRepository, type OperationRepository } from "./repository";
import { createOperationService, type OperationService } from "./service";

export interface OperationRuntime {
	repository: OperationRepository;
	service: OperationService;
	adminAdapter: ReturnType<typeof createAdminOperationAdapter>;
}

const fallbackRuntime = createOperationRuntime(createOperationRepository());

export function getOperationRuntime(event?: H3Event): OperationRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.operationRuntime) {
		return context.operationRuntime as OperationRuntime;
	}

	const runtime = createOperationRuntime(createOperationRepository({ db: useDb(event) }));
	context.operationRuntime = runtime;
	return runtime;
}

function createOperationRuntime(repository: OperationRepository): OperationRuntime {
	const service = createOperationService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminOperationAdapter(service),
	};
}
