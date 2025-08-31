import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	deleteMemberVehicle,
	renewParkingSpaceLease,
	getVehicleBasicInfo,
	addCar,
	addMemberVehicle,
	exportVehicle,
	importVehicle,
	getMemberVehicleList,
	modifyCar,
	modifyOwnerVehicle,
	getModifyRecordList,
	getCarList,
	releaseParkingSpace,
	removeOwnerVehicle,
} from "./index";

describe("j7/停车管理/业主车辆", () => {
	it("使用 query 接口 - 删除成员车辆", async () => {
		const { execute, data } = deleteMemberVehicle({
			onSuccess(data) {
				console.warn("deleteMemberVehicle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteMemberVehicle onError", error);
			},
		});
		await execute({
			params: {
				carId: "car123456",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 续租车位", async () => {
		const { execute, data } = renewParkingSpaceLease({
			onSuccess(data) {
				console.warn("renewParkingSpaceLease onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("renewParkingSpaceLease onError", error);
			},
		});
		await execute({
			data: {
				carId: "car123456",
				endTime: "2025-12-31 23:59:59",
				psId: "ps123456",
				startTime: "2025-01-01 00:00:00",
				remark: "续租一年",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取车辆基础信息", async () => {
		const { execute, data } = getVehicleBasicInfo({
			onSuccess(data) {
				console.warn("getVehicleBasicInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getVehicleBasicInfo onError", error);
			},
		});
		await execute({
			params: {
				carId: "car123456",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加车辆", async () => {
		const { execute, data } = addCar({
			onSuccess(data) {
				console.warn("addCar onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addCar onError", error);
			},
		});
		await execute({
			data: {
				carNum: "渝A12345",
				carType: "9901",
				communityId: "2024022643710121",
				leaseType: "H",
				ownerId: "802024022527394000",
				psId: "ps123456",
				carBrand: "丰田",
				carColor: "白色",
				startTime: "2024-01-01 00:00:00",
				endTime: "2024-12-31 23:59:59",
				remark: "测试车辆",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加成员车辆", async () => {
		const { execute, data } = addMemberVehicle({
			onSuccess(data) {
				console.warn("addMemberVehicle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addMemberVehicle onError", error);
			},
		});
		await execute({
			data: {
				carBrand: "本田",
				carColor: "黑色",
				carId: "car123456",
				carNum: "渝B67890",
				carType: "9901",
				memberId: "member123",
				remark: "成员车辆",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 导出车辆数据", async () => {
		const { execute, data } = exportVehicle({
			onSuccess(data) {
				console.warn("exportVehicle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("exportVehicle onError", error);
			},
		});
		await execute({
			params: {
				carTypeCd: "9901",
				communityId: "2024022643710121",
				carNum: "渝A",
				leaseType: "H",
				name: "张三",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	// 警告 该接口无法通过 vitest 进行文件上传测试
	// it("使用 body 接口 - 导入车辆", async () => {
	// 	const { execute, data } = importVehicle({
	// 		onSuccess(data) {
	// 			console.warn("importVehicle onSuccess", printFormat(data));
	// 		},
	// 		onError(error) {
	// 			console.error("importVehicle onError", error);
	// 		},
	// 	});
	// 	// 创建一个模拟的文件对象
	// 	const file = new File(["车辆数据"], "vehicles.xlsx", {
	// 		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	// 	});
	// 	await execute({
	// 		data: {
	// 			file: file,
	// 		},
	// 	});
	// 	console.warn("查看简单的 data.value ", printFormat(data.value));
	// });

	it("使用 query 接口 - 获取成员车辆列表（条件+分页）", async () => {
		const { execute, data } = getMemberVehicleList({
			onSuccess(data) {
				console.warn("getMemberVehicleList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getMemberVehicleList onError", error);
			},
		});
		await execute({
			params: {
				carId: "car123456",
				memberId: "member123",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改车辆", async () => {
		const { execute, data } = modifyCar({
			onSuccess(data) {
				console.warn("modifyCar onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyCar onError", error);
			},
		});
		await execute({
			data: {
				carId: "car123456",
				carNum: "渝A12345",
				carType: "9901",
				communityId: "2024022643710121",
				leaseType: "H",
				memberId: "member123",
				carBrand: "丰田（已修改）",
				carColor: "银色",
				startTime: "2024-01-01 00:00:00",
				endTime: "2025-12-31 23:59:59",
				remark: "修改后的车辆信息",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改成员车辆", async () => {
		const { execute, data } = modifyOwnerVehicle({
			onSuccess(data) {
				console.warn("modifyOwnerVehicle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyOwnerVehicle onError", error);
			},
		});
		await execute({
			data: {
				carType: "9902",
				id: "memberCar123",
				carBrand: "大众",
				carColor: "红色",
				carNum: "渝C11111",
				remark: "修改后的成员车辆",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取车辆修改记录（条件+分页）", async () => {
		const { execute, data } = getModifyRecordList({
			onSuccess(data) {
				console.warn("getModifyRecordList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getModifyRecordList onError", error);
			},
		});
		await execute({
			params: {
				carId: "car123456",
				memberId: "member123",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取车辆列表（条件+分页）", async () => {
		const { execute, data } = getCarList({
			onSuccess(data) {
				console.warn("getCarList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getCarList onError", error);
			},
		});
		await execute({
			params: {
				communityId: "2024022643710121",
				pageIndex: 1,
				pageSize: 10,
				carNum: "渝A",
				leaseType: "H",
				name: "张三",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 释放车位", async () => {
		const { execute, data } = releaseParkingSpace({
			onSuccess(data) {
				console.warn("releaseParkingSpace onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("releaseParkingSpace onError", error);
			},
		});
		await execute({
			params: {
				carId: "car123456",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除车辆", async () => {
		const { execute, data } = removeOwnerVehicle({
			onSuccess(data) {
				console.warn("removeOwnerVehicle onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeOwnerVehicle onError", error);
			},
		});
		await execute({
			params: {
				carId: "car123456",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
