import { describe, it } from "vitest";
import { queryOwnerPaymentDetail } from "./index";

describe("queryOwnerPaymentDetail 接口测试", () => {
  it("基础调用", async () => {
    const { execute, data } = queryOwnerPaymentDetail({
      pageIndex: 1,
      pageSize: 10,
    });
    const response = await execute();
    console.warn("queryOwnerPaymentDetail 基础调用响应数据:", response);
  });

  it("带参数调用", async () => {
    const { execute, data } = queryOwnerPaymentDetail({
      pageIndex: 1,
      pageSize: 10,
      feeTypeCd: "物业费",
      configName: "水费",
      roomName: "101",
      ownerName: "张三",
      pfYear: "2024",
    });
    const response = await execute();
    console.warn("queryOwnerPaymentDetail 带参数响应:", response);
  });
}); 