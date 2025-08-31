import { describe, it, expect, beforeEach } from "vitest";
import { getRouteRank } from "../getRouteRank";

describe("getRouteRank", () => {
	describe("一级路由测试", () => {
		it("应该返回 settingManage 的正确排序值", () => {
			expect(getRouteRank("settingManage")).toBe(10000);
		});

		it("应该返回 devTeam 的正确排序值", () => {
			expect(getRouteRank("devTeam")).toBe(20000);
		});

		it("应该返回 operationTeam 的正确排序值", () => {
			expect(getRouteRank("operationTeam")).toBe(30000);
		});

		it("应该返回 propertyManage 的正确排序值", () => {
			expect(getRouteRank("propertyManage")).toBe(40000);
		});
	});

	describe("二级路由测试", () => {
		it("应该返回 devTeam.menuManage 的正确排序值", () => {
			expect(getRouteRank("devTeam.menuManage")).toBe(20000 + 100);
		});

		it("应该返回 devTeam.cacheManage 的正确排序值", () => {
			expect(getRouteRank("devTeam.cacheManage")).toBe(20000 + 200);
		});

		it("应该返回 settingManage.organizeManage 的正确排序值", () => {
			expect(getRouteRank("settingManage.organizeManage")).toBe(10000 + 100);
		});

		it("应该返回 settingManage.systemManage 的正确排序值", () => {
			expect(getRouteRank("settingManage.systemManage")).toBe(10000 + 200);
		});
	});

	describe("三级路由测试", () => {
		it("应该返回 devTeam.menuManage.catalog 的正确排序值", () => {
			expect(getRouteRank("devTeam.menuManage.catalog")).toBe(20000 + 100 + 10);
		});

		it("应该返回 devTeam.menuManage.group 的正确排序值", () => {
			expect(getRouteRank("devTeam.menuManage.group")).toBe(20000 + 100 + 20);
		});

		it("应该返回 devTeam.menuManage.item 的正确排序值", () => {
			expect(getRouteRank("devTeam.menuManage.item")).toBe(20000 + 100 + 30);
		});

		it("应该返回 devTeam.cacheManage.refreshCache 的正确排序值", () => {
			expect(getRouteRank("devTeam.cacheManage.refreshCache")).toBe(20000 + 200 + 10);
		});

		it("应该返回 settingManage.organizeManage.orgInfo 的正确排序值", () => {
			expect(getRouteRank("settingManage.organizeManage.orgInfo")).toBe(10000 + 100 + 10);
		});

		it("应该返回 settingManage.organizeManage.staffInfo 的正确排序值", () => {
			expect(getRouteRank("settingManage.organizeManage.staffInfo")).toBe(10000 + 100 + 20);
		});

		it("应该返回 settingManage.systemManage.changePassword 的正确排序值", () => {
			expect(getRouteRank("settingManage.systemManage.changePassword")).toBe(10000 + 200 + 10);
		});

		it("应该返回 settingManage.systemManage.systemConfig 的正确排序值", () => {
			expect(getRouteRank("settingManage.systemManage.systemConfig")).toBe(10000 + 200 + 20);
		});
	});

	describe("operation-team 路由测试", () => {
		it("应该返回 operationTeam.systemManage 的正确排序值", () => {
			expect(getRouteRank("operationTeam.systemManage")).toBe(30000 + 100);
		});

		it("应该返回 operationTeam.dataManage 的正确排序值", () => {
			expect(getRouteRank("operationTeam.dataManage")).toBe(30000 + 200);
		});

		it("应该返回 operationTeam.merchantManage 的正确排序值", () => {
			expect(getRouteRank("operationTeam.merchantManage")).toBe(30000 + 300);
		});

		it("应该返回 operationTeam.reportConfiguration 的正确排序值", () => {
			expect(getRouteRank("operationTeam.reportConfiguration")).toBe(30000 + 400);
		});

		it("应该返回 operationTeam.dataManage.communityInformation 的正确排序值", () => {
			expect(getRouteRank("operationTeam.dataManage.communityInformation")).toBe(30000 + 200 + 10);
		});

		it("应该返回 operationTeam.dataManage.propertyManagementCompany 的正确排序值", () => {
			expect(getRouteRank("operationTeam.dataManage.propertyManagementCompany")).toBe(30000 + 200 + 20);
		});

		it("应该返回 operationTeam.merchantManage.merchantInfo 的正确排序值", () => {
			expect(getRouteRank("operationTeam.merchantManage.merchantInfo")).toBe(30000 + 300 + 10);
		});

		it("应该返回 operationTeam.reportConfiguration.reportGroup 的正确排序值", () => {
			expect(getRouteRank("operationTeam.reportConfiguration.reportGroup")).toBe(30000 + 400 + 10);
		});
	});

	describe("property-manage 路由测试", () => {
		it("应该返回 propertyManage.communityManage 的正确排序值", () => {
			expect(getRouteRank("propertyManage.communityManage")).toBe(40000 + 100);
		});

		it("应该返回 propertyManage.contractManage 的正确排序值", () => {
			expect(getRouteRank("propertyManage.contractManage")).toBe(40000 + 400);
		});

		it("应该返回 propertyManage.communityManage.houseDecoration 的正确排序值", () => {
			expect(getRouteRank("propertyManage.communityManage.houseDecoration")).toBe(40000 + 100 + 30);
		});
	});

	describe("边界情况测试", () => {
		it("不存在的路径应该返回部分累加值", () => {
			// 假设路径不存在，应该返回已找到部分的累加值
			const result = getRouteRank("devTeam.nonExistentRoute" as any);
			expect(result).toBe(20000); // 只累加到 devTeam
		});
	});

	describe("类型安全测试", () => {
		it("函数应该接受正确的路径类型", () => {
			// 这些调用应该在编译时通过类型检查
			const result1 = getRouteRank("devTeam");
			const result2 = getRouteRank("devTeam.menuManage");
			const result3 = getRouteRank("devTeam.menuManage.item");

			expect(typeof result1).toBe("number");
			expect(typeof result2).toBe("number");
			expect(typeof result3).toBe("number");
		});
	});
});
