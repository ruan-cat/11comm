
// ==================== 表单Props类型定义 ====================

/**
 * 业主账户表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerAccountFormProps {
	/** 表单数据 */
	form: 业主账户表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业主账户表单_VO;
}

// ==================== 导出表单相关 ====================

export { defaultForm, 账户类型选项, 支付方式选项 };
