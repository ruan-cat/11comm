import { defineHandler } from "nitro/h3";
import { adminSuccess } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async () => {
	return adminSuccess([]);
});
