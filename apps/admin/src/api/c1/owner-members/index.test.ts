import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { queryMember, modifyMember, addMember, removeMember } from ".";

describe("c1/业主成员", () => {
	it("使用 queryMember 接口 - 分页查询业主成员", async () => {
		const { execute, data } = queryMember({
			onSuccess(data) {
				console.warn("分页查询业主成员成功", printFormat(data));
			},
			onError(error) {
				console.warn("分页查询业主成员失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "张三",
				link: "13800138000",
				idCard: "110101199001010001",
				ownerTypeCd: "1001",
				sex: "0",
				address: "北京市朝阳区",
				remark: "业主",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyMember 接口 - 根据member_id修改业主成员信息", async () => {
		const { execute, data } = modifyMember({
			onSuccess(data) {
				console.warn("修改业主成员信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改业主成员信息失败", printFormat(error));
			},
		});

		await execute({
			data: {
				memberId: "123456789",
				name: "李四",
				link: "13900139000",
				idCard: "110101199002020002",
				sex: "1",
				ownerTypeCd: "1001",
				address: "北京市海淀区",
				remark: "家属",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addMember 接口 - 新增一条业主成员", async () => {
		const { execute, data } = addMember({
			onSuccess(data) {
				console.warn("新增业主成员成功", printFormat(data));
			},
			onError(error) {
				console.warn("新增业主成员失败", printFormat(error));
			},
		});

		await execute({
			data: {
				name: "王五",
				link: "13700137000",
				idCard: "110101199003030003",
				sex: "0",
				ownerTypeCd: "1002",
				address: "北京市西城区",
				remark: "新增业主",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 removeMember 接口 - 根据member_id删除数据，且支持批量", async () => {
		const { execute, data } = removeMember({
			onSuccess(data) {
				console.warn("删除业主成员成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除业主成员失败", printFormat(error));
			},
		});

		await execute({
			data: ["123456789", "123456790", "123456791"],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
