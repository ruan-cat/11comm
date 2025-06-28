import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	removeOwnerVehicle,
	releaseParkingSpace,
	addCar,
	addMemberVehicle,
	exportVehicle,
	importVehicle,
	getMemberVehicleList,
	modifyCar,
	modifyOwnerVehicle,
	getModifyRecordList,
	getCarList,
	getVehicleBasicInfo,
	renewParkingSpaceLease,
	deleteMemberVehicle,
} from "./owner-vehicle";

describe("业主车辆管理接口测试", () => {
	it("添加车辆接口", async () => {
		const { execute, data } = addCar({
			immediate: false,
		});

		const result = await execute({
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

		console.warn("添加车辆结果:", printFormat(result));
	});

	it("添加成员车辆接口", async () => {
		const { execute, data } = addMemberVehicle({
			immediate: false,
		});

		const result = await execute({
			params: {
				carBrand: "本田",
				carColor: "黑色",
				carNum: "渝B67890",
				carType: "9901",
				carId: "car123456",
				memberId: "member123456",
				remark: "成员车辆",
			},
		});

		console.warn("添加成员车辆结果:", printFormat(result));
	});

	it("导出车辆数据接口", async () => {
		const { execute, data } = exportVehicle({
			immediate: false,
		});

		const result = await execute({
			params: {
				carTypeCd: "9901",
				communityId: "2024022643710121",
				carNum: "渝A12345",
				leaseType: "H",
				link: "15044108708",
				memberCarNum: "渝B67890",
				name: "测试业主",
				num: "A01",
				valid: 1,
			},
		});

		console.warn("导出车辆数据结果:", printFormat(result));
	});

	it("导入车辆接口", async () => {
		const { execute, data } = importVehicle({
			immediate: false,
		});

		// 跳过实际文件上传测试，避免Node环境中File对象不支持
		console.warn("导入车辆接口测试跳过 - 需要实际文件上传环境");
	});

	it("获取成员车辆列表接口", async () => {
		const { execute, data } = getMemberVehicleList({
			immediate: false,
		});

		const result = await execute({
			params: {
				carId: "car123456",
				memberId: "member123456",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("获取成员车辆列表结果:", printFormat(result));
	});

	it("修改车辆接口", async () => {
		const { execute, data } = modifyCar({
			immediate: false,
		});

		const result = await execute({
			data: {
				carId: "car123456",
				carNum: "渝A12345",
				carType: "9901",
				communityId: "2024022643710121",
				leaseType: "H",
				memberId: "member123456",
				carBrand: "丰田",
				carColor: "白色",
				startTime: "2024-01-01 00:00:00",
				endTime: "2024-12-31 23:59:59",
				remark: "修改后的车辆信息",
			},
		});

		console.warn("修改车辆结果:", printFormat(result));
	});

	it("修改成员车辆接口", async () => {
		const { execute, data } = modifyOwnerVehicle({
			immediate: false,
		});

		const result = await execute({
			data: {
				id: "vehicle123456",
				carType: "9901",
				carBrand: "本田",
				carColor: "黑色",
				carNum: "渝B67890",
				remark: "修改后的成员车辆信息",
			},
		});

		console.warn("修改成员车辆结果:", printFormat(result));
	});

	it("获取车辆修改记录接口", async () => {
		const { execute, data } = getModifyRecordList({
			immediate: false,
		});

		const result = await execute({
			params: {
				carId: "car123456",
				memberId: "member123456",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("获取车辆修改记录结果:", printFormat(result));
	});

	it("获取车辆列表接口", async () => {
		const { execute, data } = getCarList({
			immediate: false,
		});

		const result = await execute({
			params: {
				communityId: "2024022643710121",
				pageIndex: 1,
				pageSize: 10,
				carNum: "渝A12345",
				leaseType: "H",
				link: "15044108708",
				memberCarNum: "渝B67890",
				name: "测试业主",
				num: "A01",
				valid: 1,
			},
		});

		console.warn("获取车辆列表结果:", printFormat(result));
	});

	it("获取车辆基础信息接口", async () => {
		const { execute, data } = getVehicleBasicInfo({
			immediate: false,
		});

		const result = await execute({
			params: {
				carId: "car123456",
			},
		});

		console.warn("获取车辆基础信息结果:", printFormat(result));
	});

	it("续租车位接口", async () => {
		const { execute, data } = renewParkingSpaceLease({
			immediate: false,
		});

		const result = await execute({
			data: {
				carId: "car123456",
				psId: "ps123456",
				startTime: "2024-01-01 00:00:00",
				endTime: "2024-12-31 23:59:59",
				remark: "续租车位",
			},
		});

		console.warn("续租车位结果:", printFormat(result));
	});

	it("删除成员车辆接口", async () => {
		const { execute, data } = deleteMemberVehicle({
			immediate: false,
		});

		const result = await execute({
			params: {
				carId: "car123456",
			},
		});

		console.warn("删除成员车辆结果:", printFormat(result));
	});

	it("释放车位接口", async () => {
		const { execute, data } = releaseParkingSpace({
			immediate: false,
		});

		const result = await execute({
			params: {
				carId: "car123456",
			},
		});

		console.warn("释放车位结果:", printFormat(result));
	});

	it("删除车辆接口", async () => {
		const { execute, data } = removeOwnerVehicle({
			immediate: false,
		});

		const result = await execute({
			params: {
				carId: "car123456",
			},
		});

		console.warn("删除车辆结果:", printFormat(result));
	});
});
