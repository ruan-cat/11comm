import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { removeCommittee, addCommittee, modifyCommittee } from ".";

describe("业委会管理接口测试", () => {
	describe("业委会成员管理", () => {
		it("添加业委会成员", async () => {
			const { execute, data } = addCommittee({
				onSuccess(data) {
					console.warn("添加业委会成功", printFormat(data));
				},
				onError(error) {
					console.warn("添加业委会失败", printFormat(error));
				},
			});

			await execute({
				data: {
					address: "01社区01栋",
					appointTime: "2022",
					curTime: "1",
					idCard: "420403199911117300",
					link: "13333333333",
					name: "张三",
					position: "保安",
					post: "保安",
					postDesc: "负责小区门口安全巡逻",
					sex: "B",
					state: "1000",
					contacts: [
						{
							address: "01社区01栋",
							link: "13888888888",
							name: "李四",
							relName: "父子",
						},
					],
				},
			});

			console.warn("查看简单的 data.value", printFormat(data.value));
		});

		it("修改业委会成员信息", async () => {
			const { execute, data } = modifyCommittee({
				onSuccess(data) {
					console.warn("修改业委会成功", printFormat(data));
				},
				onError(error) {
					console.warn("修改业委会失败", printFormat(error));
				},
			});

			await execute({
				data: {
					ocId: "102025025155370000",
					address: "01社区01栋",
					appointTime: "2022",
					curTime: "1",
					idCard: "420403199911117300",
					link: "13333333333",
					name: "张三",
					position: "保安",
					post: "保安",
					postDesc: "负责小区门口安全巡逻",
					sex: "B",
					state: "1000",
					contacts: [
						{
							address: "01社区01栋",
							link: "13888888888",
							name: "李四",
							relName: "父子",
						},
					],
				},
			});

			console.warn("查看简单的 data.value", printFormat(data.value));
		});

		it("删除业委会成员", async () => {
			const { execute, data } = removeCommittee({
				onSuccess(data) {
					console.warn("删除业委会成功", printFormat(data));
				},
				onError(error) {
					console.warn("删除业委会失败", printFormat(error));
				},
			});

			await execute({
				params: {
					ocId: "123",
				},
			});

			console.warn("查看简单的 data.value", printFormat(data.value));
		});
	});
});
