import type { H3Event } from "nitro/h3";
import { getRequestHeaderValue } from "../../shared/runtime/cors";
import { AuthError } from "./errors";
import { resolveAuthRuntimeConfig } from "./runtime";
import { createTokenService, type TokenService } from "./token-service";
import type { AuthActor } from "./types";

export interface ScopedAuth {
	require(event: H3Event | Record<string, unknown>): Promise<AuthActor>;
}

export function createScopedAuth(tokenService: TokenService): ScopedAuth {
	return {
		async require(event) {
			const token = extractBearerToken(event);
			const payload = await tokenService.verify(token, "access");
			const actor: AuthActor = {
				actorId: payload.actorId,
				role: payload.role,
				tenantId: payload.tenantId,
				openidHash: payload.openidHash,
			};
			((event as Record<string, any>).context ??= {}).actor = actor;
			return actor;
		},
	};
}

export async function requireScopedAuth(event: H3Event): Promise<AuthActor> {
	const runtime = resolveAuthRuntimeConfig(event);
	return createScopedAuth(
		createTokenService({
			secret: runtime.tokenSecret,
			accessTokenTtlSeconds: runtime.accessTokenTtlSeconds,
			refreshTokenTtlSeconds: runtime.refreshTokenTtlSeconds,
		}),
	).require(event);
}

export function extractBearerToken(event: H3Event | Record<string, unknown>): string {
	const authorization = getRequestHeaderValue(event, "authorization");
	const match = authorization?.match(/^Bearer\s+(.+)$/i);
	if (!match?.[1]) {
		throw new AuthError("缺少 Bearer 登录态", 401);
	}

	return match[1].trim();
}
