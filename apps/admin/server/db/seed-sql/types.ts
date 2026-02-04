/**
 * @file 类型定义
 * @description 定义种子数据生成相关的接口和类型
 */

import { IdMapRegistry } from "./id-map";

/** SQL 语句对象 */
export interface SqlStatement {
	/** 表名 */
	table: string;
	/** INSERT SQL 语句 */
	sql: string;
	/** 插入记录数 */
	recordCount: number;
}

/** 模块 SQL 生成函数签名 */
export type GeneratorFunction = (idMap: IdMapRegistry) => Promise<SqlStatement[]> | SqlStatement[];

/** 种子数据模块配置 */
export interface SeedModuleConfig {
	/** 模块编号 (如 "00", "01") */
	id: string;
	/** 模块名称 (如 "community") */
	name: string;
	/** 模块显示名称 (如 "社区管理") */
	displayName: string;
	/** 依赖的模块名称数组 */
	dependencies: string[];
	/** SQL 生成函数 */
	generator: GeneratorFunction;
}
