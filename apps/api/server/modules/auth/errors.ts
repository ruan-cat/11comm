export class AuthError extends Error {
	constructor(
		message: string,
		readonly statusCode: number,
	) {
		super(message);
		this.name = "AuthError";
	}
}

export function toAuthError(error: unknown): AuthError {
	if (error instanceof AuthError) {
		return error;
	}

	return new AuthError("认证服务暂不可用", 500);
}
