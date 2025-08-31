import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addIntoHouse,
	querySelectOwnerList,
	queryOwnerById,
	queryCar,
	modifyOutHouse,
	addOwner,
	queryRoom,
	queryOwnerList,
	exportRpt,
	modifyOwner,
	exportSlip,
	removeOwner,
} from ".";

describe("c1/业主信息", () => {
	it("使用 addIntoHouse 接口 - 入住房屋", async () => {
		const { execute, data } = addIntoHouse({
			onSuccess(data) {
				console.warn("入住房屋成功", printFormat(data));
			},
			onError(error) {
				console.warn("入住房屋失败", printFormat(error));
			},
		});

		await execute({
			data: {
				ownerId: "d934050a8bb373e8f8eed0bf7507ec17",
				roomId: "room123456",
				userId: "user789",
				remark: "入住备注信息",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 querySelectOwnerList 接口 - 选择业主列表", async () => {
		const { execute, data } = querySelectOwnerList({
			onSuccess(data) {
				console.warn("查询选择业主列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询选择业主列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				roomNum: "1001",
				name: "li ming",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryOwnerById 接口 - 查询所有业主详细信息", async () => {
		const { execute, data } = queryOwnerById({
			onSuccess(data) {
				console.warn("查询业主详细信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询业主详细信息失败", printFormat(error));
			},
		});

		await execute({
			params: {
				ownerId: "d934050a8bb373e8f8eed0bf7507ec17",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryCar 接口 - 查询车辆信息", async () => {
		const { execute, data } = queryCar({
			onSuccess(data) {
				console.warn("查询车辆信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询车辆信息失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				carNum: "京A12345",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyOutHouse 接口 - 退出房屋", async () => {
		const { execute, data } = modifyOutHouse({
			onSuccess(data) {
				console.warn("退出房屋成功", printFormat(data));
			},
			onError(error) {
				console.warn("退出房屋失败", printFormat(error));
			},
		});

		await execute({
			data: {
				ownerId: "d934050a8bb373e8f8eed0bf7507ec17",
				roomId: "room123456",
				userId: "user789",
				remark: "退出房屋备注",
				relId: "rel456789",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addOwner 接口 - 添加业主", async () => {
		const { execute, data } = addOwner({
			onSuccess(data) {
				console.warn("添加业主成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加业主失败", printFormat(error));
			},
		});

		await execute({
			data: {
				memberId: "member123",
				ownerId: "owner456",
				bId: "business789",
				name: "张三",
				sex: "男",
				age: "30",
				link: "13800138000",
				userId: "user123",
				remark: "新增业主",
				createTime: "2024-01-01 10:00:00",
				statusCd: "0",
				ownerTypeCd: "1001",
				communityId: "community001",
				idCard: "110101199001010001",
				state: "2000",
				ownerFlag: "1",
				address: "北京市朝阳区",
				createBy: "admin",
				roomNum: "1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryRoom 接口 - 查询所有业主房屋信息", async () => {
		const { execute, data } = queryRoom({
			onSuccess(data) {
				console.warn("查询房屋信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询房屋信息失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				roomNum: "1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryOwnerList 接口 - 获取业主列表", async () => {
		const { execute, data } = queryOwnerList({
			onSuccess(data) {
				console.warn("获取业主列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取业主列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				ownerId: "owner123",
				name: "李四",
				roomNum: "1002",
				link: "13900139000",
				idCard: "110101199002020002",
				memberName: "王五",
				memberLink: "13700137000",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 exportRpt 接口 - 打印预存收据", async () => {
		const { execute, data } = exportRpt({
			onSuccess(data) {
				console.warn("打印预存收据成功", printFormat(data));
			},
			onError(error) {
				console.warn("打印预存收据失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				ownerName: "蔡徐坤",
				ownerId: "32121313",
				link: "15956132115",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyOwner 接口 - 修改业主", async () => {
		const { execute, data } = modifyOwner({
			onSuccess(data) {
				console.warn("修改业主成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改业主失败", printFormat(error));
			},
		});

		await execute({
			data: {
				ownerId: "owner123456",
				name: "赵六",
				fileRealName: "avatar.jpg",
				sex: "女",
				idCard: "110101199003030003",
				link: "13600136000",
				address: "北京市海淀区",
				houseNum: 2,
				memberNum: 3,
				carNumber: 1,
				complaintNum: 0,
				repairNum: 1,
				amountOwed: "500.00",
				contractNum: 1,
				accessControlKey: "key123456",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 exportSlip 接口 - 打印预存小票", async () => {
		const { execute, data } = exportSlip({
			onSuccess(data) {
				console.warn("打印预存小票成功", printFormat(data));
			},
			onError(error) {
				console.warn("打印预存小票失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				ownerName: "蔡徐坤",
				ownerId: "32121313",
				link: "15956132115",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 removeOwner 接口 - 删除业主", async () => {
		const { execute, data } = removeOwner({
			onSuccess(data) {
				console.warn("删除业主成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除业主失败", printFormat(error));
			},
		});

		await execute({
			data: ["owner123", "owner456", "owner789"],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
