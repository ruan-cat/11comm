import { describe, it } from "vitest";
import { queryUnpaidHouse } from "./index";

describe("queryUnpaidHouse 接口测试", () => {
  it("基础调用", async () => {
    const { execute, data } = queryUnpaidHouse({
      pageIndex: 1,
      pageSize: 10,
      communityId: "2024022692080516",
    });
    const response = await execute();
    console.warn("queryUnpaidHouse 基础调用响应数据:", response);
  });

  it("带参数调用", async () => {
    const { execute, data } = queryUnpaidHouse({
      pageIndex: 1,
      pageSize: 10,
      communityId: "2024022692080516",
      floorId: "732025052809640133",
      unitId: "742025052876120134",
      roomId: "752025052884790135",
      ownerName: "Li Hua",
      link: "13111111111",
    });
    const response = await execute();
    console.warn("queryUnpaidHouse 带参数响应:", response);
  });
}); 