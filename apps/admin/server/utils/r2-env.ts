/** Cloudflare R2 所需的环境变量键名集合 */
export const R2_ENV_KEYS = [
	"R2_ENDPOINT",
	"R2_BUCKET",
	"R2_ACCESS_KEY_ID",
	"R2_SECRET_ACCESS_KEY",
	"R2_PUBLIC_BASE_URL",
] as const;

/** Cloudflare R2 环境变量键名 */
export type R2EnvKey = (typeof R2_ENV_KEYS)[number];

/**
 * Read a required R2 environment variable.
 * R2 is a Cloudflare resource, so Nitro should read the value from the
 * explicitly configured runtime env in Vercel/local env files.
 */
export function getR2EnvRequired(key: R2EnvKey): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(
			`Missing required R2 environment variable: ${key}. Configure it in Vercel Project Settings or local env files.`,
		);
	}
	return value;
}
