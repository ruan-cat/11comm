import { defineHandler, readBody } from "nitro/h3";
import { getAuthService } from "../../modules/auth/auth-service";
import { authFailure, authSuccess } from "../../modules/auth/route-response";

export default defineHandler(async (event) => {
	try {
		return authSuccess(await getAuthService(event).refresh(await readBody(event)), "登录态已刷新");
	} catch (error) {
		return authFailure(event, error);
	}
});
