import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, type DbType, useDb } from "../../db";
import { createAdminContractAdapter } from "./admin-adapter";
import { createContractRepository, type ContractRepository } from "./repository";
import { createContractService, type ContractService } from "./service";
import {
	createContractUploadService,
	createDbUploadRepository,
	createUnavailableContractUploadService,
} from "./upload-service";

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

	const db = useDb(event);
	const runtime = createContractRuntime(createContractRepository({ db }), db, event);
	context.contractRuntime = runtime;
	return runtime;
}

function createContractRuntime(repository: ContractRepository, db?: DbType, event?: H3Event): ContractRuntime {
	const uploadService = db
		? createContractUploadService({ event, repository: createDbUploadRepository(db) })
		: createUnavailableContractUploadService(
				"Database URL is not configured. Contract upload sessions require persistent database storage.",
			);
	const service = createContractService(repository, uploadService);
	return {
		repository,
		service,
		adminAdapter: createAdminContractAdapter(service),
	};
}
