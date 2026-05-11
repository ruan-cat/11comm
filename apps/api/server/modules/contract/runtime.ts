import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminContractAdapter } from "./admin-adapter";
import { createContractRepository, type ContractRepository } from "./repository";
import { createContractService, type ContractService } from "./service";

export interface ContractRuntime {
	repository: ContractRepository;
	service: ContractService;
	adminAdapter: ReturnType<typeof createAdminContractAdapter>;
}

const fallbackRuntime = createContractRuntime(createContractRepository());

export function getContractRuntime(event?: H3Event): ContractRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.contractRuntime) {
		return context.contractRuntime as ContractRuntime;
	}

	const runtime = createContractRuntime(createContractRepository({ db: useDb(event) }));
	context.contractRuntime = runtime;
	return runtime;
}

function createContractRuntime(repository: ContractRepository): ContractRuntime {
	const service = createContractService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminContractAdapter(service),
	};
}
