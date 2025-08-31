import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addInspectItem,
	modifyInspectItem,
	deleteInspectItem,
	queryInspectItemList,
	queryInspectItemNameList,
	addInspectTitle,
	modifyInspectTitle,
	deleteInspectTitle,
	queryInspectTitleList,
} from ".";

describe("j8/巡检项目", () => {
	// 巡检项目相关接口测试
	it("使用 addInspectItem 接口 - 添加巡检项目", async () => {
		const { execute, data } = addInspectItem({
			onSuccess(data) {
				console.warn("添加巡检项目成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检项目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2024012252790005",
				itemName: "电梯安全巡检",
				remark: "每日电梯安全巡检",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectItem 接口 - 修改巡检项目", async () => {
		const { execute, data } = modifyInspectItem({
			onSuccess(data) {
				console.warn("修改巡检项目成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检项目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2024012252790005",
				itemId: "102022122193930560",
				itemName: "消防设备巡检",
				remark: "消防设备日常巡检",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectItem 接口 - 删除巡检项目", async () => {
		const { execute, data } = deleteInspectItem({
			onSuccess(data) {
				console.warn("删除巡检项目成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检项目失败", printFormat(error));
			},
		});

		await execute({
			url: "/j8-patrolmgt/item/remove-item/102022050608420018",
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectItemList 接口 - 获取巡检项目列表", async () => {
		const { execute, data } = queryInspectItemList({
			onSuccess(data) {
				console.warn("获取巡检项目列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检项目列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022692080516",
				pageIndex: 1,
				pageSize: 10,
				itemName: "电梯",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectItemNameList 接口 - 获取巡检项目名称列表", async () => {
		const { execute, data } = queryInspectItemNameList({
			onSuccess(data) {
				console.warn("获取巡检项目名称列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检项目名称列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022692080516",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	// 巡检题目相关接口测试
	it("使用 addInspectTitle 接口 - 增加巡检题目", async () => {
		const { execute, data } = addInspectTitle({
			onSuccess(data) {
				console.warn("增加巡检题目成功", printFormat(data));
			},
			onError(error) {
				console.warn("增加巡检题目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2024022692080516",
				itemId: "102025051504330000",
				itemTitle: "楼道是否干净",
				seq: 0,
				titleType: "1001",
				values: [
					{
						communityId: "2024022692080516",
						itemValue: "很干净",
						seq: 0,
					},
					{
						communityId: "2024022692080516",
						itemValue: "一般",
						seq: 1,
					},
				],
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectTitle 接口 - 修改巡检题目", async () => {
		const { execute, data } = modifyInspectTitle({
			onSuccess(data) {
				console.warn("修改巡检题目成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检题目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2024022692080516",
				itemId: "102025051504330000",
				itemTitle: "电梯运行是否正常",
				seq: 1,
				titleId: "1930243903590158300",
				titleType: "1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectTitle 接口 - 删除巡检题目", async () => {
		const { execute, data } = deleteInspectTitle({
			onSuccess(data) {
				console.warn("删除巡检题目成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检题目失败", printFormat(error));
			},
		});

		await execute({
			url: "/j8-patrolmgt/item/remove-inspection-item/123456",
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectTitleList 接口 - 获取巡检题目列表", async () => {
		const { execute, data } = queryInspectTitleList({
			onSuccess(data) {
				console.warn("获取巡检题目列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检题目列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022692080516",
				itemId: "102025051235020211",
				pageIndex: 1,
				pageSize: 10,
				itemTitle: "电梯",
				titleType: "1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
