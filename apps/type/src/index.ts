/**
 * @file 业务类型库入口文件
 * @description 本文件作为业务类型的统一导出入口
 */

// 导出通用类型 - 先导出 common
export * from "./common";

// 导出业务类型 - 后导出 business，避免冲突时使用命名导出
export { patrolMethodOptions, patrolPointStatusOptions, returnVisitStatusOptions } from "./common";

// 选择性导出业务模块，避免重复导出
export * from "./business/dev-team";
export * from "./business/operation-team";
export * from "./business/property-manage";
export * from "./business/setting-manage";

// 导出常量
export * from "./constant";
