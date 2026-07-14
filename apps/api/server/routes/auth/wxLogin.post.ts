import { defineHandler, readBody } from "nitro/h3";
import { getAuthService } from "../../modules/auth/auth-service";
import { authFailure, authSuccess } from "../../modules/auth/route-response";

export default defineHandler(async (event) => {
	try {
		return authSuccess(await getAuthService(event).login(await readBody(event)), "微信登录成功");
	} catch (error) {
		return authFailure(event, error);
	}
});
