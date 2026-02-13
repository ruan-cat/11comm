/**
 * @file 数据库错误处理工具测试
 * @description 测试 handleDbError 函数的错误码映射和处理逻辑
 */

import { describe, it, expect, vi } from "vitest";
import { handleDbError, parseDbErrorMessage, isUniqueConstraintError, isForeignKeyError } from "./handle-db-error";

describe("handleDbError", () => {
	describe("唯一约束冲突 (23505)", () => {
		it("应该返回状态码 409 和正确的错误消息", () => {
			const error = new Error("duplicate key value violates unique constraint") as any;
			error.code = "23505";

			const result = handleDbError(error);

			expect(result.statusCode).toBe(409);
			expect(result.message).toBe("数据已存在，请勿重复创建");
		});

		it("应该正确处理 cause 对象中的错误码", () => {
			const error = new Error("duplicate key") as any;
			error.cause = { code: "23505" };

			const result = handleDbError(error);

			expect(result.statusCode).toBe(409);
			expect(result.message).toBe("数据已存在，请勿重复创建");
		});
	});

	describe("外键约束冲突 (23503)", () => {
		it("应该返回状态码 400 和正确的错误消息", () => {
			const error = new Error("foreign key violation") as any;
			error.code = "23503";

			const result = handleDbError(error);

			expect(result.statusCode).toBe(400);
			expect(result.message).toBe("关联数据不存在，请检查输入");
		});
	});

	describe("检查约束冲突 (23502)", () => {
		it("应该返回状态码 400 和正确的错误消息", () => {
			const error = new Error("null value violates not-null constraint") as any;
			error.code = "23502";

			const result = handleDbError(error);

			expect(result.statusCode).toBe(400);
			expect(result.message).toBe("必填字段缺失");
		});
	});

	describe("事务回滚 (40001)", () => {
		it("应该返回状态码 500 和正确的错误消息", () => {
			const error = new Error("could not serialize access") as any;
			error.code = "40001";

			const result = handleDbError(error);

			expect(result.statusCode).toBe(500);
			expect(result.message).toBe("数据操作冲突，请重试");
		});
	});

	describe("未知错误码", () => {
		it("应该返回默认状态码 500", () => {
			const error = new Error("some unknown error") as any;
			error.code = "99999";

			const result = handleDbError(error);

			expect(result.statusCode).toBe(500);
			expect(result.message).toBe("操作失败");
		});

		it("应该使用自定义默认消息", () => {
			const error = new Error("some unknown error") as any;
			error.code = "99999";

			const result = handleDbError(error, "自定义错误消息");

			expect(result.statusCode).toBe(500);
			expect(result.message).toBe("自定义错误消息");
		});
	});

	describe("空错误对象", () => {
		it("应该返回默认状态码 500", () => {
			const error = "string error" as any;

			const result = handleDbError(error);

			expect(result.statusCode).toBe(500);
			expect(result.message).toBe("操作失败");
		});
	});

	describe("错误 cause 链", () => {
		it("应该正确传递 cause 对象", () => {
			const originalError = new Error("Original error");
			const error = new Error("Wrapper error") as any;
			error.cause = originalError;

			const result = handleDbError(error);

			expect(result.cause).toBeDefined();
		});
	});
});

describe("parseDbErrorMessage", () => {
	it("应该返回唯一约束冲突的错误消息", () => {
		const error = new Error("duplicate") as any;
		error.code = "23505";

		const message = parseDbErrorMessage(error);

		expect(message).toBe("数据已存在，请勿重复创建");
	});

	it("应该返回外键约束冲突的错误消息", () => {
		const error = new Error("foreign key") as any;
		error.code = "23503";

		const message = parseDbErrorMessage(error);

		expect(message).toBe("关联数据不存在，请检查输入");
	});

	it("应该返回默认错误消息", () => {
		const error = new Error("unknown") as any;
		error.code = "99999";

		const message = parseDbErrorMessage(error);

		expect(message).toBe("操作失败，请稍后重试");
	});

	it("应该正确处理 cause 对象中的错误码", () => {
		const error = new Error("unknown") as any;
		error.cause = { code: "23505" };

		const message = parseDbErrorMessage(error);

		expect(message).toBe("数据已存在，请勿重复创建");
	});
});

describe("isUniqueConstraintError", () => {
	it("应该正确检测唯一约束错误", () => {
		const error = new Error("duplicate") as any;
		error.code = "23505";

		expect(isUniqueConstraintError(error)).toBe(true);
	});

	it("应该正确检测 cause 中的唯一约束错误", () => {
		const error = new Error("unknown") as any;
		error.cause = { code: "23505" };

		expect(isUniqueConstraintError(error)).toBe(true);
	});

	it("应该正确排除非唯一约束错误", () => {
		const error = new Error("foreign key") as any;
		error.code = "23503";

		expect(isUniqueConstraintError(error)).toBe(false);
	});
});

describe("isForeignKeyError", () => {
	it("应该正确检测外键约束错误", () => {
		const error = new Error("foreign key violation") as any;
		error.code = "23503";

		expect(isForeignKeyError(error)).toBe(true);
	});

	it("应该正确检测 cause 中的外键约束错误", () => {
		const error = new Error("unknown") as any;
		error.cause = { code: "23503" };

		expect(isForeignKeyError(error)).toBe(true);
	});

	it("应该正确排除非外键约束错误", () => {
		const error = new Error("duplicate") as any;
		error.code = "23505";

		expect(isForeignKeyError(error)).toBe(false);
	});
});
