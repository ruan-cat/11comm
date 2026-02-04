/**
 * @file ID 映射管理
 * @description 管理 Mock 数据 ID 到数据库 UUID 的映射，确保确定性
 */

import { v5 as uuidv5 } from "uuid";

/** 命名空间 UUID，用于生成确定性 UUID (随机生成的固定值) */
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

/** 根据 mock ID 和表名生成确定性 UUID */
export function generateUuid(tableName: string, mockId: string): string {
	return uuidv5(`${tableName}:${mockId}`, NAMESPACE);
}

/** ID 映射注册表 */
export class IdMapRegistry {
	private map = new Map<string, string>();

	/**
	 * 注册 mock ID 到 UUID 的映射
	 * @param tableName 表名
	 * @param mockId mock 数据中的 ID
	 * @returns 生成的 UUID
	 */
	register(tableName: string, mockId: string): string {
		const uuid = generateUuid(tableName, mockId);
		this.map.set(`${tableName}:${mockId}`, uuid);
		return uuid;
	}

	/**
	 * 查找 UUID
	 * @param tableName 表名
	 * @param mockId mock 数据中的 ID
	 * @returns 对应的 UUID，未找到返回 null
	 */
	get(tableName: string, mockId: string): string | null {
		return this.map.get(`${tableName}:${mockId}`) ?? null;
	}
}
