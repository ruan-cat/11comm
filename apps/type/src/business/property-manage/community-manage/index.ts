/**
 * @file 社区管理模块类型导出
 * @description 统一导出社区管理相关的所有业务类型
 */

export * from "./notice";
export * from "./handing-business";
export * from "./building-space-structure-diagram";
export * from "./house-decoration";
export * from "./my";
export * from "./parking-space-structure-diagram";
export * from "./property-register";

// 显式导出选项变量
export { noticeTypeOptions } from "./notice";

// 导出默认值和类型
export { defaultForm } from "./property-register";
export type { PropertyRegisterFormVO } from "./property-register";

