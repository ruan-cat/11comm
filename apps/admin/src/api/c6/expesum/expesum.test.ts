import { describe, it, expect } from "vitest";
import {
  expesumQuery,
  expesumQueryBuildingRates,
  expesumQueryFeeItemRates,
  expesumExport,
  type ExpeSumQueryParams,
  type BuildingRateQueryParams,
  type FeeItemRateQueryParams,
  type ExpesumExportQueryParams,
} from "./expesum";

describe("费用汇总模块", () => {
  describe("expesumQuery", () => {
    it("调用费用汇总查询接口，不传参数", async () => {
      const { execute } = expesumQuery();
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
      // 例如：expect(res.data).toHaveProperty("totalRoomCount");
    });

    it("调用费用汇总查询接口，传入查询参数", async () => {
      const params: ExpeSumQueryParams = {
        timeBegin: "2025-01-01",
        timeEnd: "2025-12-31",
        ownerName: "张三",
        buildNumber: "A1",
        ownerPhone: "13800138000",
      };
      const { execute } = expesumQuery({
        config: {
          data: params,
        },
      });
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
    });
  });

  describe("expesumQueryBuildingRates", () => {
    it("调用楼栋收费率查询接口，不传参数", async () => {
      const { execute } = expesumQueryBuildingRates();
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
      // 例如：expect(res.data).toHaveProperty("pageIndex");
    });

    it("调用楼栋收费率查询接口，传入查询参数", async () => {
      const params: BuildingRateQueryParams = {
        pageIndex: 2,
        pageSize: 20,
        buildingName: "A栋",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        ownerName: "张三",
        ownerNumber: "13800138000",
        communityIds: "123",
        feeTypes: "物业费",
        roomNum: "A1-101",
      };
      const { execute } = expesumQueryBuildingRates({
        config: {
          data: params,
        },
      });
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
    });
  });

  describe("expesumQueryFeeItemRates", () => {
    it("调用费用项目费率查询接口，不传参数", async () => {
      const { execute } = expesumQueryFeeItemRates();
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
      // 例如：expect(res.data).toHaveProperty("pageIndex");
    });

    it("调用费用项目费率查询接口，传入查询参数", async () => {
      const params: FeeItemRateQueryParams = {
        pageIndex: 2,
        pageSize: 20,
        buildingName: "A栋",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        ownerName: "张三",
        ownerNumber: "13800138000",
        communityIds: "123",
        feeTypes: "物业费",
        roomNum: "A1-101",
      };
      const { execute } = expesumQueryFeeItemRates({
        config: {
          data: params,
        },
      });
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
    });
  });

  describe("expesumExport", () => {
    it("调用费用汇总导出接口，不传参数", async () => {
      const { execute } = expesumExport();
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
    });

    it("调用费用汇总导出接口，传入查询参数", async () => {
      const params: ExpesumExportQueryParams = {
        timeBegin: "2025-01-01",
        timeEnd: "2025-12-31",
        ownerName: "张三",
        buildNumber: "A1",
        ownerPhone: "13800138000",
      };
      const { execute } = expesumExport({
        config: {
          data: params,
        },
      });
      const res = await execute();
      expect(res).toBeDefined();
      // 根据实际返回数据结构进行断言
    });
  });
}); 