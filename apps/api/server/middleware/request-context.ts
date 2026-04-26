import { defineHandler } from "nitro/h3";
import { initializeApiRequestContext } from "../shared/runtime/request-context";

export default defineHandler((event) => {
	initializeApiRequestContext(event);
});
