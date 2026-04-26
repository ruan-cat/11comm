import { defineHandler } from "nitro/h3";
import { getPublicRuntimeConfig } from "../shared/runtime/env";

export default defineHandler(() => {
	const publicConfig = getPublicRuntimeConfig();
	return {
		success: true,
		service: publicConfig.serviceName,
		phase: publicConfig.phase,
		health: "/__nitro/health",
		ready: "/__nitro/ready",
		endpoints: "/__nitro/endpoints",
	};
});
