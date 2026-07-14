import { defineHandler } from "nitro/h3";
import { authFailure, authSuccess } from "../../modules/auth/route-response";
import { requireScopedAuth } from "../../modules/auth/scoped-auth";

export default defineHandler(async (event) => {
	try {
		const actor = await requireScopedAuth(event);
		return authSuccess(
			{
				userId: actor.actorId,
				username: actor.actorId,
				nickname: "微信用户",
				actorId: actor.actorId,
				role: actor.role,
				tenantId: actor.tenantId,
			},
			"查询成功",
		);
	} catch (error) {
		return authFailure(event, error);
	}
});
