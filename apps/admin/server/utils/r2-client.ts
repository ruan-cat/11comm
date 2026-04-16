import { S3Client } from "@aws-sdk/client-s3";
import { getR2EnvRequired } from "./r2-env";

/**
 * 创建指向 Cloudflare R2 的 S3 兼容客户端。
 * @description
 * 当前项目统一通过自定义环境变量提供 R2 endpoint 与凭据，
 * 这里不做额外推断，只负责按固定配置构造 SDK 客户端。
 */
export function createR2Client(): S3Client {
	return new S3Client({
		region: "auto",
		endpoint: getR2EnvRequired("R2_ENDPOINT"),
		credentials: {
			accessKeyId: getR2EnvRequired("R2_ACCESS_KEY_ID"),
			secretAccessKey: getR2EnvRequired("R2_SECRET_ACCESS_KEY"),
		},
		forcePathStyle: true,
	});
}
