import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminFeeAdapter } from "./admin-adapter";
import { createFeeRepository, type FeeRepository } from "./repository";
import { createFeeService, type FeeService } from "./service";
import { createLegacyFeeAdapter } from "./legacy-adapter";

export interface FeeRuntime {
	repository: FeeRepository;
	service: FeeService;
	adminAdapter: ReturnType<typeof createAdminFeeAdapter>;
	legacyAdapter: ReturnType<typeof createLegacyFeeAdapter>;
}

const fallbackRuntime = createFeeRuntime(createFeeRepository());

export function getFeeRuntime(event?: H3Event): FeeRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.feeRuntime) {
		return context.feeRuntime as FeeRuntime;
	}

	const runtime = createFeeRuntime(createFeeRepository({ db: useDb(event) }));
	context.feeRuntime = runtime;
	return runtime;
}

function createFeeRuntime(repository: FeeRepository): FeeRuntime {
	const service = createFeeService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminFeeAdapter(service),
		legacyAdapter: createLegacyFeeAdapter(service),
	};
}
