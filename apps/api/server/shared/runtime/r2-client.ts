import { S3Client } from "@aws-sdk/client-s3";
import type { H3Event } from "nitro/h3";
import { getR2EnvRequired } from "./r2-env";

export function createR2Client(event?: H3Event | Record<string, any>): S3Client {
	return new S3Client({
		region: "auto",
		endpoint: getR2EnvRequired("R2_ENDPOINT", event),
		credentials: {
			accessKeyId: getR2EnvRequired("R2_ACCESS_KEY_ID", event),
			secretAccessKey: getR2EnvRequired("R2_SECRET_ACCESS_KEY", event),
		},
		forcePathStyle: true,
	});
}
