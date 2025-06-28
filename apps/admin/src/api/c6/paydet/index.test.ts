import { describe, it } from "vitest";
import { queryPayDet } from "./index";

describe("queryPayDet 接口测试", () => {
  it("基础调用", async () => {
    const { execute, data } = queryPayDet({
      pageIndex: 1,
      pageSize: 10,
    });
    const response = await execute();
    console.warn("queryPayDet 基础调用响应数据:", response);
  });

  it("带参数调用", async () => {
    const { execute, data } = queryPayDet({
      pageIndex: 1,
      pageSize: 10,
      paymentStartTime: "2024-01-01",
      paymentEndTime: "2024-01-31",
      paymentMethod: "微信支付",
      expenseStatus: "已缴费",
      houseOrPlateNumber: "1001",
      expenseType: "物业费",
      chargeItem: "月度物业费",
      chargeStartTime: "2024-01-01",
      chargeEndTime: "2024-01-31",
    });
    const response = await execute();
    console.warn("queryPayDet 带参数响应:", response);
  });
}); 