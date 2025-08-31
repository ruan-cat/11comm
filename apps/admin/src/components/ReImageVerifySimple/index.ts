import { withInstall } from "@pureadmin/utils";
import reImageVerifySimple from "./src/index.vue";

/** 简单版本的验证码组件 */
export const ReImageVerifySimple = withInstall(reImageVerifySimple);

export default ReImageVerifySimple;

// 导出类型
export type { CaptchaResult } from "@/api/j1/login/login";
