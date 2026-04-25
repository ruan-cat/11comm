import { defineHandler } from "nitro/h3";

export default defineHandler(() => ({
	success: true,
	service: "@01s-11comm/api",
	phase: "phase2-shadow",
	health: "/__nitro/health",
}));
