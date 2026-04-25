import { defineHandler, setResponseStatus } from "nitro/h3";
import { createEndpointRegistry, dispatchEndpoint } from "../shared/runtime/endpoint-registry";
import { toEndpointDispatchInput } from "../shared/runtime/request-adapter";
import { legacyFailure } from "../shared/runtime/response-builder";
import { runtimeEndpointDefinitions } from "../shared/runtime/runtime-endpoints";

const registry = createEndpointRegistry(runtimeEndpointDefinitions);

export default defineHandler(async (event) => {
	try {
		return await dispatchEndpoint(registry, await toEndpointDispatchInput(event));
	} catch (error) {
		const statusCode = Number((error as any)?.statusCode || 500);
		setResponseStatus(event, statusCode);
		return legacyFailure(error instanceof Error ? error.message : "接口调用失败", statusCode);
	}
});
