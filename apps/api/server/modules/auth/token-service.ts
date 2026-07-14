import { AuthError } from "./errors";
import type { AuthActor, AuthTokenPayload, AuthTokenType, AuthTokens } from "./types";

export interface TokenService {
	issue(actor: AuthActor): Promise<AuthTokens>;
	verify(token: string, expectedTokenType: AuthTokenType): Promise<AuthTokenPayload>;
}

export interface CreateTokenServiceOptions {
	secret?: string;
	accessTokenTtlSeconds?: number;
	refreshTokenTtlSeconds?: number;
	now?: () => number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function createTokenService(options: CreateTokenServiceOptions): TokenService {
	if (!options.secret) {
		throw new AuthError("认证令牌签名密钥未配置", 500);
	}

	const cryptoApi = getCryptoApi();
	const now = options.now || (() => Date.now());
	const accessTokenTtlSeconds = options.accessTokenTtlSeconds || 60 * 60;
	const refreshTokenTtlSeconds = options.refreshTokenTtlSeconds || 60 * 60 * 24 * 30;
	const signingKey = cryptoApi.subtle.importKey(
		"raw",
		encoder.encode(options.secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	);

	return {
		async issue(actor) {
			const issuedAt = Math.floor(now() / 1000);
			const [accessToken, refreshToken] = await Promise.all([
				signToken(createPayload(actor, "access", issuedAt, accessTokenTtlSeconds), signingKey, cryptoApi),
				signToken(createPayload(actor, "refresh", issuedAt, refreshTokenTtlSeconds), signingKey, cryptoApi),
			]);

			return { accessToken, refreshToken, accessExpiresIn: accessTokenTtlSeconds, refreshExpiresIn: refreshTokenTtlSeconds };
		},
		async verify(token, expectedTokenType) {
			const [encodedHeader, encodedPayload, encodedSignature, ...extraParts] = token.split(".");
			if (!encodedHeader || !encodedPayload || !encodedSignature || extraParts.length > 0) {
				throw new AuthError("登录态无效", 401);
			}

			const signatureValid = await cryptoApi.subtle.verify(
				"HMAC",
				await signingKey,
				toArrayBuffer(decodeBase64Url(encodedSignature)),
				encoder.encode(`${encodedHeader}.${encodedPayload}`),
			);
			if (!signatureValid) {
				throw new AuthError("登录态无效", 401);
			}

			const payload = parsePayload(encodedPayload);
			if (payload.tokenType !== expectedTokenType || payload.exp <= Math.floor(now() / 1000)) {
				throw new AuthError("登录态已过期或无效", 401);
			}

			return payload;
		},
	};
}

export async function sha256Hex(value: string): Promise<string> {
	const hash = await getCryptoApi().subtle.digest("SHA-256", encoder.encode(value));
	return [...new Uint8Array(hash)].map((item) => item.toString(16).padStart(2, "0")).join("");
}

function createPayload(actor: AuthActor, tokenType: AuthTokenType, issuedAt: number, ttlSeconds: number): AuthTokenPayload {
	return {
		version: 1,
		tokenType,
		actorId: actor.actorId,
		role: actor.role,
		tenantId: actor.tenantId,
		openidHash: actor.openidHash,
		iat: issuedAt,
		exp: issuedAt + ttlSeconds,
	};
}

async function signToken(payload: AuthTokenPayload, signingKey: Promise<CryptoKey>, cryptoApi: Crypto): Promise<string> {
	const encodedHeader = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const encodedPayload = encodeBase64Url(JSON.stringify(payload));
	const signature = await cryptoApi.subtle.sign("HMAC", await signingKey, encoder.encode(`${encodedHeader}.${encodedPayload}`));
	return `${encodedHeader}.${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

function parsePayload(encodedPayload: string): AuthTokenPayload {
	try {
		const payload = JSON.parse(decoder.decode(decodeBase64Url(encodedPayload))) as Partial<AuthTokenPayload>;
		if (
			payload.version !== 1 ||
			(payload.tokenType !== "access" && payload.tokenType !== "refresh") ||
			typeof payload.actorId !== "string" ||
			typeof payload.role !== "string" ||
			typeof payload.tenantId !== "string" ||
			typeof payload.openidHash !== "string" ||
			!Number.isSafeInteger(payload.iat) ||
			!Number.isSafeInteger(payload.exp)
		) {
			throw new Error("invalid payload");
		}

		return payload as AuthTokenPayload;
	} catch {
		throw new AuthError("登录态无效", 401);
	}
}

function getCryptoApi(): Crypto {
	if (!globalThis.crypto?.subtle || !globalThis.crypto.getRandomValues) {
		throw new AuthError("当前运行时不支持认证加密能力", 500);
	}

	return globalThis.crypto;
}

function encodeBase64Url(value: string | Uint8Array): string {
	const bytes = typeof value === "string" ? encoder.encode(value) : value;
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string): Uint8Array {
	if (!/^[A-Za-z0-9_-]+$/.test(value)) {
		throw new AuthError("登录态无效", 401);
	}

	const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
	const binary = atob(base64);
	return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
	const copy = new Uint8Array(value.byteLength);
	copy.set(value);
	return copy.buffer;
}
