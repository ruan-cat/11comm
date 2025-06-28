import { describe, it } from "vitest";
import {
	sysmanagerIconsAdd,
	sysmanagerIconsAll,
	sysmanagerIconsDelete,
	sysmanagerIconsModify,
	sysmanagerIconsNames,
	sysmanagerIconsGetById,
} from "./icons";

describe("图标接口测试", () => {
	it("图标录入接口测试", async () => {
		const { execute, data } = sysmanagerIconsAdd({
			onSuccess(data) {
				console.log("图标录入成功", data);
			},
		});

		// 调用接口
		await execute({
			data: {
				file: undefined, // 在实际应用中应该使用文件上传控件获取的文件
				iconclas: "default",
				name: "测试图标",
				type: 1, // 1系统图标/2菜单图标/3桌面图标
			},
		});

		console.log("图标录入响应数据:", data.value);
	});

	it("图标列表查询接口测试", async () => {
		const { execute, data } = sysmanagerIconsAll({
			onSuccess(data) {
				console.log("图标列表查询成功", data);
			},
		});

		// 调用接口
		await execute({
			data: {
				name: "默认", // 可选参数，根据图标名称查询
				pageIndex: 1, // 查询页码
				pageSize: 10, // 查询条数
			},
		});

		console.log("图标列表数据:", data.value);
		// 可以访问分页数据
		if (data.value && data.value.data) {
			console.log("总记录数:", data.value.data.total);
			console.log("图标列表:", data.value.data.rows);
		}
	});

	it("图标删除接口测试", async () => {
		const { execute, data } = sysmanagerIconsDelete({
			onSuccess(data) {
				console.log("图标删除成功", data);
			},
		});

		// 调用接口
		await execute({
			data: {
				id: "test-icon-id", // 要删除的图标ID
			},
		});

		console.log("图标删除响应数据:", data.value);
	});

	it("图标编辑接口测试", async () => {
		const { execute, data } = sysmanagerIconsModify({
			onSuccess(data) {
				console.log("图标编辑成功", data);
			},
		});

		// 调用接口
		await execute({
			data: {
				id: "test-icon-id", // 要编辑的图标ID
				iconclas: "new-icon-class", // 新的图标样式
				name: "新图标名称", // 新的图标名称
				type: 1, // 1系统图标/2菜单图标/3桌面图标
				url: "new/icon/path.png", // 新的图标路径
			},
		});

		console.log("图标编辑响应数据:", data.value);
	});

	it("图标名称列表查询接口测试", async () => {
		const { execute, data } = sysmanagerIconsNames({
			onSuccess(data) {
				console.log("图标名称列表查询成功", data);
			},
		});

		// 调用接口
		await execute({
			data: {
				type: 1, // 可选参数，1系统图标/2菜单图标/3桌面图标
			},
		});

		console.log("图标名称列表数据:", data.value);
		// 可以访问图标名称列表数据
		if (data.value) {
			console.log("图标名称列表:", data.value);
		}
	});

	it("根据id回显图标编辑数据接口测试", async () => {
		const iconId = "test-icon-id"; // 测试用的图标ID
		const { execute, data } = sysmanagerIconsGetById({
			onSuccess(data) {
				console.log("获取图标编辑数据成功", data);
			},
		});

		// 调用接口，使用path参数方式
		await execute({
			url: `/sysmanager/icons/${iconId}`,
		});

		console.log("图标编辑数据:", data.value);
		// 可以访问图标编辑数据
		if (data.value && data.value.data) {
			console.log("图标名称:", data.value.data.name);
			console.log("图标样式:", data.value.data.iconclas);
			console.log("图标类型:", data.value.data.type);
			console.log("图标路径:", data.value.data.url);
		}
	});
});
