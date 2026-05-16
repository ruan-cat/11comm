import { defineHandler } from "nitro/h3";
import { adminSuccess } from "../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	return adminSuccess({
		nodeEnv: process.env.NODE_ENV || "development",
		nitro: true,
	});
});
