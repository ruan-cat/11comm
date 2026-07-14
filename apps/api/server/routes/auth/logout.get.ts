import { defineHandler } from "nitro/h3";
import { authSuccess } from "../../modules/auth/route-response";

export default defineHandler(() =>
	authSuccess({ serverRevocation: false }, "服务端未维护吊销表，请客户端清理本地登录态"),
);
