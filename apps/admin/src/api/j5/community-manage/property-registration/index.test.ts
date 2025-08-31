import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addProperty,
	checkProperty,
	deleteProperty,
	modifyFileRel,
	modifyProperty,
	queryPropertyDetail,
	queryPropertyList,
	uploadPropertyImage,
} from ".";

describe("j5/产权登记", () => {
	it("使用 addProperty 接口 - 添加房屋产权", async () => {
		const { execute, data } = addProperty({
			onSuccess(data) {
				console.warn("添加房屋产权成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加房屋产权失败", printFormat(error));
			},
		});

		await execute({
			data: {
				address: "北京中路999号",
				backIdCardImage: new File([], "idcard_back.jpg"),
				communityId: "2023052267100146",
				contractImages: [new File([], "contract1.jpg"), new File([], "contract2.jpg")],
				floorName: "1栋",
				frontIdCardImage: new File([], "idcard_front.jpg"),
				fundIsPaid: "否",
				idCard: "111222333444556560",
				link: "13452452141",
				name: "Jungle",
				objId: "772023061990825000",
				roomNum: "1001",
				taxIsPaid: "否",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 checkProperty 接口 - 审核房屋产权", async () => {
		const { execute, data } = checkProperty({
			onSuccess(data) {
				console.warn("审核房屋产权成功", printFormat(data));
			},
			onError(error) {
				console.warn("审核房屋产权失败", printFormat(error));
			},
		});

		await execute({
			data: {
				prrId: "1929925019366985700",
				roomNum: "1001",
				state: "1",
				remark: "房屋产权审核通过",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteProperty 接口 - 删除房屋产权", async () => {
		const { execute, data } = deleteProperty({
			onSuccess(data) {
				console.warn("删除房屋产权成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除房屋产权失败", printFormat(error));
			},
		});

		await execute({
			data: {
				prrId: "1928681637822992400",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyFileRel 接口 - 修改附件项", async () => {
		const { execute, data } = modifyFileRel({
			onSuccess(data) {
				console.warn("修改附件项成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改附件项失败", printFormat(error));
			},
		});

		await execute({
			data: {
				createTime: "2022-12-24 16:16:45",
				fileRealName: "身份证正面照片.jpg",
				isTrue: "是",
				prrdId: "112022122438600860",
				securities: "001",
				statusCd: "0",
				url: "http://example.com/images/idcard.jpg",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyProperty 接口 - 修改房屋产权", async () => {
		const { execute, data } = modifyProperty({
			onSuccess(data) {
				console.warn("修改房屋产权成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改房屋产权失败", printFormat(error));
			},
		});

		await execute({
			data: {
				address: "北京中路999号",
				communityId: "2023052267100146",
				floorName: "1栋",
				idCard: "111222333444556560",
				link: "13452452141",
				name: "Jungle",
				objId: "772023061990825000",
				prrId: "1929925019366985700",
				roomNum: "1001",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryPropertyDetail 接口 - 获取房屋产权详情", async () => {
		const { execute, data } = queryPropertyDetail({
			onSuccess(data) {
				console.warn("获取房屋产权详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取房屋产权详情失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2021080494780158",
				floorNum: "2",
				pageIndex: 1,
				pageSize: 10,
				prrId: "102024022019845984",
				roomNum: "110",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryPropertyList 接口 - 获取房屋产权列表（条件+分页）", async () => {
		const { execute, data } = queryPropertyList({
			onSuccess(data) {
				console.warn("获取房屋产权列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取房屋产权列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2021080494780158",
				pageIndex: 1,
				pageSize: 10,
				address: "啊啊啊",
				floorNum: "2",
				idCard: "768681189007243679",
				link: "18947314754",
				name: "啊吧啊吧",
				roomId: "752022121911900401",
				roomNum: "3-201",
				state: "0",
				unitNum: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 uploadPropertyImage 接口 - 上传产权详情里的图片", async () => {
		const { execute, data } = uploadPropertyImage({
			onSuccess(data) {
				console.warn("上传产权详情里的图片成功", printFormat(data));
			},
			onError(error) {
				console.warn("上传产权详情里的图片失败", printFormat(error));
			},
		});

		await execute({
			data: {
				file: new File([], "property_image.jpg"),
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
