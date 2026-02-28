/**
 * 敏感数据处理工具
 * @description 用于掩码处理敏感个人信息
 */

/**
 * 手机号掩码
 * @param phone 手机号
 * @returns 掩码后的手机号，如 138****1234
 */
export function maskPhone(phone: string): string {
	if (!phone) return "";
	if (phone.length < 7) return phone;
	return phone.slice(0, 3) + "****" + phone.slice(-4);
}

/**
 * 身份证号掩码
 * @param idCard 身份证号
 * @returns 掩码后的身份证号，如 110101****1234****
 */
export function maskIdCard(idCard: string): string {
	if (!idCard) return "";
	if (idCard.length < 8) return idCard;
	return idCard.slice(0, 4) + "********" + idCard.slice(-4);
}

/**
 * 邮箱掩码
 * @param email 邮箱
 * @returns 掩码后的邮箱，如 a***d@example.com
 */
export function maskEmail(email: string): string {
	if (!email) return "";
	const [username, domain] = email.split("@");
	if (!domain) return maskPhone(email);
	if (username.length <= 2) return "*".repeat(username.length) + "@" + domain;
	return username[0] + "*".repeat(username.length - 2) + username.slice(-1) + "@" + domain;
}

/**
 * 银行卡号掩码
 * @param cardNumber 银行卡号
 * @returns 掩码后的银行卡号，如 6222 **** **** 1234
 */
export function maskBankCard(cardNumber: string): string {
	if (!cardNumber) return "";
	const cleaned = cardNumber.replace(/\s/g, "");
	if (cleaned.length < 8) return cardNumber;
	return cleaned.slice(0, 4) + " **** **** " + cleaned.slice(-4);
}

/**
 * 地址掩码
 * @param address 地址
 * @returns 掩码后的地址，保留省市信息
 */
export function maskAddress(address: string): string {
	if (!address) return "";
	// 保留前6个字符，其余掩码
	if (address.length <= 6) return address;
	return address.slice(0, 6) + "*".repeat(address.length - 6);
}

/**
 * 姓名掩码
 * @param name 姓名
 * @returns 掩码后的姓名，如 张*
 */
export function maskName(name: string): string {
	if (!name) return "";
	if (name.length === 1) return name;
	if (name.length === 2) return name[0] + "*";
	return name[0] + "*".repeat(name.length - 2) + name.slice(-1);
}

/**
 * 掩码类型枚举
 */
export enum MaskType {
	PHONE = "phone",
	ID_CARD = "idCard",
	EMAIL = "email",
	BANK_CARD = "bankCard",
	ADDRESS = "address",
	NAME = "name",
}

/**
 * 根据字段类型自动掩码
 * @param value 原始值
 * @param type 掩码类型
 * @returns 掩码后的值
 */
export function maskByType(value: string, type: MaskType): string {
	if (!value) return "";

	switch (type) {
		case MaskType.PHONE:
			return maskPhone(value);
		case MaskType.ID_CARD:
			return maskIdCard(value);
		case MaskType.EMAIL:
			return maskEmail(value);
		case MaskType.BANK_CARD:
			return maskBankCard(value);
		case MaskType.ADDRESS:
			return maskAddress(value);
		case MaskType.NAME:
			return maskName(value);
		default:
			return value;
	}
}

/**
 * 批量掩码对象中的敏感字段
 * @param data 原始数据对象
 * @param fields 需要掩码的字段配置 { fieldName: MaskType }
 * @returns 掩码后的数据对象
 */
export function maskSensitiveFields<T extends Record<string, any>>(data: T, fields: Record<string, MaskType>): T {
	if (!data || typeof data !== "object") return data;

	const result = { ...data };

	for (const [field, type] of Object.entries(fields)) {
		if (field in result && result[field]) {
			result[field] = maskByType(result[field], type);
		}
	}

	return result;
}

/**
 * 批量掩码数组中的敏感字段
 * @param list 数据数组
 * @param fields 需要掩码的字段配置
 * @returns 掩码后的数组
 */
export function maskSensitiveList<T extends Record<string, any>>(list: T[], fields: Record<string, MaskType>): T[] {
	if (!Array.isArray(list)) return list;
	return list.map((item) => maskSensitiveFields(item, fields));
}

/**
 * 常用字段配置
 */
export const commonSensitiveFields = {
	phone: MaskType.PHONE,
	telephone: MaskType.PHONE,
	mobile: MaskType.PHONE,
	idCard: MaskType.ID_CARD,
	id_card: MaskType.ID_CARD,
	email: MaskType.EMAIL,
	bankCard: MaskType.BANK_CARD,
	bank_card: MaskType.BANK_CARD,
	cardNumber: MaskType.BANK_CARD,
	address: MaskType.ADDRESS,
	homeAddress: MaskType.ADDRESS,
	realName: MaskType.NAME,
	name: MaskType.NAME,
};

/**
 * 密码掩码
 * @returns 掩码后的密码
 */
export function maskPassword(): string {
	return "***";
}

/**
 * 支付密码掩码
 * @returns 掩码后的支付密码
 */
export function maskPayPassword(): string {
	return "******";
}

/**
 * 授权令牌掩码
 * @param token 授权令牌
 * @returns 掩码后的令牌，显示前6位
 * @example 掩码结果: eyJhbGciOi***（显示前6位）
 */
export function maskToken(token: string | null | undefined): string {
	if (!token) return "";
	if (token.length <= 6) return "***";
	return token.slice(0, 6) + "***";
}

/**
 * 根据模块类型自动掩码敏感字段
 * @param data - 原始数据对象
 * @param module - 模块类型 (staff | owner | user)
 * @returns 掩码后的数据对象
 * @example
 * ```typescript
 * const masked = maskByModule(ownerData, 'owner');
 * ```
 */
export function maskByModule<T extends Record<string, any>>(data: T, module: "staff" | "owner" | "user"): T {
	if (!data || typeof data !== "object") return data;

	const moduleFieldsMap: Record<string, string[]> = {
		staff: ["phone", "idCard", "address", "realName"],
		owner: ["phone", "idCard", "address", "bankCard", "realName"],
		user: ["phone", "email", "realName"],
	};

	const fields = moduleFieldsMap[module];
	if (!fields) return data;

	// 构建字段配置
	const fieldConfig: Record<string, MaskType> = {};
	for (const field of fields) {
		if (field === "idCard") fieldConfig[field] = MaskType.ID_CARD;
		else if (field === "phone") fieldConfig[field] = MaskType.PHONE;
		else if (field === "email") fieldConfig[field] = MaskType.EMAIL;
		else if (field === "bankCard") fieldConfig[field] = MaskType.BANK_CARD;
		else if (field === "address") fieldConfig[field] = MaskType.ADDRESS;
		else if (field === "realName") fieldConfig[field] = MaskType.NAME;
	}

	return maskSensitiveFields(data, fieldConfig);
}

export default {
	maskPhone,
	maskIdCard,
	maskEmail,
	maskBankCard,
	maskAddress,
	maskName,
	maskPassword,
	maskPayPassword,
	maskToken,
	maskByType,
	maskSensitiveFields,
	maskSensitiveList,
	maskByModule,
	MaskType,
	commonSensitiveFields,
};
