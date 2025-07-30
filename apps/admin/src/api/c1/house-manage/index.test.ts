import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addUnit,
	queryFloor,
	addHouse,
	queryUnit,
	getHouseDetail,
	uploadFile,
	modifyUnit,
	modifyHouse,
	queryCommunityUnit,
	queryHouseSelect,
	downloadFile,
	removeUnit,
	addFloor,
	removeHouse,
	removeFloor,
	queryHouseList,
	removeHouseByHouseId,
	modifyFloor,
	queryHouseName,
	addHouseHome,
} from ".";

describe("c1/房屋管理", () => {
	it("使用 addUnit 接口 - 新增一条单元数据", async () => {
		const { execute, data } = addUnit({
			onSuccess(data) {
				console.warn("新增单元数据成功", printFormat(data));
			},
			onError(error) {
				console.warn("新增单元数据失败", printFormat(error));
			},
		});

		await execute({
			data: {
				bId: "business123",
				unitNum: "1",
				floorId: "732023120568080332",
				layerCount: 10,
				lift: "有",
				userId: "user123",
				remark: "新增单元备注",
				statusCd: "0",
				unitArea: "500.5",
				unitId: "unit123",
				createTime: "2024-01-01 10:00:00",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryFloor 接口 - 查询楼栋信息", async () => {
		const { execute, data } = queryFloor({
			onSuccess(data) {
				console.warn("查询楼栋信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询楼栋信息失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				floorNum: "2222",
				name: "001号楼",
				communityId: "2023052267100146",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addHouse 接口 - 新增房屋信息", async () => {
		const { execute, data } = addHouse({
			onSuccess(data) {
				console.warn("新增房屋信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("新增房屋信息失败", printFormat(error));
			},
		});

		await execute({
			data: {
				bId: "building123",
				roomNum: "1001",
				unitId: "unit123",
				layer: "10",
				builtUpArea: 120.5,
				feeCoefficient: 1.2,
				remark: "新增房屋备注",
				state: "0",
				roomType: "住宅",
				roomArea: 100.0,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryUnit 接口 - 获取单元", async () => {
		const { execute, data } = queryUnit({
			onSuccess(data) {
				console.warn("获取单元成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取单元失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				floorId: "732023120568080332",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 getHouseDetail 接口 - 获取房屋详细信息", async () => {
		const { execute, data } = getHouseDetail({
			onSuccess(data) {
				console.warn("获取房屋详细信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取房屋详细信息失败", printFormat(error));
			},
		});

		await execute({
			params: {
				houseId: "house123456",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 uploadFile 接口 - 导入房产文件", async () => {
		const { execute, data } = uploadFile({
			onSuccess(data) {
				console.warn("导入房产文件成功", printFormat(data));
			},
			onError(error) {
				console.warn("导入房产文件失败", printFormat(error));
			},
		});

		await execute({
			data: {
				file: new File([], "房产导入文件.xlsx"),
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyUnit 接口 - 修改一条单元数据", async () => {
		const { execute, data } = modifyUnit({
			onSuccess(data) {
				console.warn("修改单元数据成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改单元数据失败", printFormat(error));
			},
		});

		await execute({
			data: {
				bId: "business123",
				unitNum: "1",
				floorId: "732023120568080332",
				layerCount: 12,
				lift: "有",
				userId: "user123",
				remark: "修改单元备注",
				statusCd: "0",
				unitArea: "600.0",
				unitId: "unit123",
				createTime: "2024-01-01 10:00:00",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyHouse 接口 - 修改房屋信息", async () => {
		const { execute, data } = modifyHouse({
			onSuccess(data) {
				console.warn("修改房屋信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改房屋信息失败", printFormat(error));
			},
		});

		await execute({
			data: {
				roomNum: "1001",
				unitId: "unit123",
				layer: "10",
				builtUpArea: 125.0,
				feeCoefficient: 1.3,
				remark: "修改房屋备注",
				roomType: "住宅",
				roomArea: 105.0,
				section: 3,
				apartment: "2厅",
				roomRent: 3000.0,
				roomId: "room123",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryCommunityUnit 接口 - 查询某小区的单元", async () => {
		const { execute, data } = queryCommunityUnit({
			onSuccess(data) {
				console.warn("查询某小区的单元成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询某小区的单元失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "2023052267100146",
				floorNum: "1",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryHouseSelect 接口 - 选择房屋列表", async () => {
		const { execute, data } = queryHouseSelect({
			onSuccess(data) {
				console.warn("选择房屋列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("选择房屋列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				floorNum: "1",
				unitNum: "1",
				roomNum: "1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 downloadFile 接口 - 下载房产文件", async () => {
		const { execute, data } = downloadFile({
			onSuccess(data) {
				console.warn("下载房产文件成功", printFormat(data));
			},
			onError(error) {
				console.warn("下载房产文件失败", printFormat(error));
			},
		});

		await execute({
			params: {
				filename: "file/test.jpg",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 removeUnit 接口 - 删除单元数据支持批量", async () => {
		const { execute, data } = removeUnit({
			onSuccess(data) {
				console.warn("删除单元数据成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除单元数据失败", printFormat(error));
			},
		});

		await execute({
			data: ["unit123", "unit456", "unit789"],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addFloor 接口 - 新增楼栋", async () => {
		const { execute, data } = addFloor({
			onSuccess(data) {
				console.warn("新增楼栋成功", printFormat(data));
			},
			onError(error) {
				console.warn("新增楼栋失败", printFormat(error));
			},
		});

		await execute({
			data: {
				floorId: "floor123",
				bId: "business123",
				floorNum: "1",
				name: "1号楼",
				userId: "user123",
				remark: "新增楼栋备注",
				createTime: "2024-01-01 10:00:00",
				communityId: "2023052267100146",
				statusCd: "0",
				floorArea: "5000.0",
				seq: 1,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 removeHouse 接口 - 删除房屋信息", async () => {
		const { execute, data } = removeHouse({
			onSuccess(data) {
				console.warn("删除房屋信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除房屋信息失败", printFormat(error));
			},
		});

		await execute({
			data: ["house123", "house456", "house789"],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 removeFloor 接口 - 删除楼栋支持批量", async () => {
		const { execute, data } = removeFloor({
			onSuccess(data) {
				console.warn("删除楼栋成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除楼栋失败", printFormat(error));
			},
		});

		await execute({
			data: ["floor123", "floor456", "floor789"],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryHouseList 接口 - 获取房屋列表", async () => {
		const { execute, data } = queryHouseList({
			onSuccess(data) {
				console.warn("获取房屋列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取房屋列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				houseId: "house123",
				statusCd: "0",
				floorNum: "1",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 removeHouseByHouseId 接口 - 退房，出售房产(输入房屋编号)", async () => {
		const { execute, data } = removeHouseByHouseId({
			onSuccess(data) {
				console.warn("退房出售房产成功", printFormat(data));
			},
			onError(error) {
				console.warn("退房出售房产失败", printFormat(error));
			},
		});

		await execute({
			data: ["house123", "house456"],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyFloor 接口 - 修改楼栋信息", async () => {
		const { execute, data } = modifyFloor({
			onSuccess(data) {
				console.warn("修改楼栋信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改楼栋信息失败", printFormat(error));
			},
		});

		await execute({
			data: {
				floorId: "floor123",
				bId: "business123",
				floorNum: "1",
				name: "1号楼(已修改)",
				userId: "user123",
				remark: "修改楼栋备注",
				createTime: "2024-01-01 10:00:00",
				communityId: "2023052267100146",
				statusCd: "0",
				floorArea: "5500.0",
				seq: 1,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryHouseName 接口 - 获取房屋名称列表", async () => {
		const { execute, data } = queryHouseName({
			onSuccess(data) {
				console.warn("获取房屋名称列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取房屋名称列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				floorNum: "1",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addHouseHome 接口 - 交房，购入房产", async () => {
		const { execute, data } = addHouseHome({
			onSuccess(data) {
				console.warn("交房购入房产成功", printFormat(data));
			},
			onError(error) {
				console.warn("交房购入房产失败", printFormat(error));
			},
		});

		await execute({
			data: {
				bId: "building123",
				roomNum: "1002",
				unitId: "unit123",
				layer: "5",
				builtUpArea: 80.0,
				feeCoefficient: 1.0,
				remark: "交房购入备注",
				state: "1",
				roomType: "商业",
				roomArea: 75.0,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
