/**
 * @file 配置中心表单类型定义
 * @description 表单字段必须对齐配置中心新增/更新接口允许写入的字段。
 */

import type { Mode } from "@/composables/use-mode";
import type { ConfigCenterFormVO } from "@01s-11comm/type";

/** 配置中心默认表单，configType/status 使用接口枚举值，不能使用翻译后的中文 label。 */
export const defaultForm: ConfigCenterFormVO = {
	configName: "",
	configType: "system",
	configKey: "",
	configValue: "",
	defaultValue: "",
	configDescription: "",
	status: "enabled",
	sortOrder: 0,
	remark: "",
};

/**
 * 配置中心表单 props
 * @description form/defaultValues 共同服务弹窗提交和关闭前脏数据判断。
 */
export interface ConfigCenterFormProps {
	/** 弹窗当前表单数据，新增/编辑提交时会原样组装为配置中心接口 payload。 */
	form: ConfigCenterFormVO;
	/** 表单组件重置和关闭前比较使用的基准值，需要和打开弹窗时的初始 form 保持一致。 */
	defaultValues: ConfigCenterFormVO;
	/** 弹窗模式，info 模式只读展示并隐藏提交区域。 */
	mode?: Mode;
}
