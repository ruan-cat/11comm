import { it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

// @ts-ignore
import { releaseParkingSpace, removeOwnerVehicle } from "./owner-vehicle.ts";

// 修改所有测试用例，添加必要的 data 属性
it("获取合同类型扩展信息列表", async () => {
	const { execute, data } = queryAllContractTypeInfo({
		onSuccess(data) {
			console.log("获取成功", data);
		},
		onError(error) {
			console.error("获取失败", error);
		},
	});

	await execute({
		params: {
			contractTypeId: "CT001",
			pageIndex: 1,
			pageSize: 20,
			specName: "技术规范",
		},
		data: {}, // 添加空的data以满足类型要求
	});
});

it("获取合同类型模板", async () => {
	const { execute } = getContractTypeTemplate({
		onSuccess(data) {
			console.log("模板获取成功", data);
		},
	});

	await execute({
		params: { contractTypeId: "TMPL_2023" },
		data: {}, // 添加空的data属性
	});
});

it("获取合同类型名称列表", async () => {
	const { execute } = listContractTypeNames({
		onSuccess(data) {
			console.log("名称列表获取成功", data);
		},
	});

	await execute({
		data: {}, // 使用空data对象
	});
});

// 其他测试用例也需要做同样的修改...

it("删除车辆", async () => {
	const { execute } = removeOwnerVehicle({
		onSuccess(data) {
			console.log("车辆删除成功", data);
		},
		onError(error) {
			console.error("删除失败", error);
		},
	});

	await execute({
		data: { carId: "VH_2023_001" },
		// 这里不需要额外修改，因为已经是使用data传递参数
	});
});

it("合同管理接口测试", () => {
	// 每个测试用例都添加必要的data属性以满足类型要求

	it("获取合同类型扩展信息列表", async () => {
		const { execute, data } = queryAllContractTypeInfo({
			onSuccess(data) {
				console.log("获取成功", printFormat(data));
			},
			onError(error) {
				console.error("获取失败", printFormat(error));
			},
		});

		await execute({
			params: {
				contractTypeId: "CT001",
				pageIndex: 1,
				pageSize: 20,
				specName: "技术规范",
			},
			data: {}, // 添加空data满足类型要求
		});
	});

	it("获取合同类型模板", async () => {
		const { execute, data } = getContractTypeTemplate({
			onSuccess(data) {
				console.log("模板获取成功", printFormat(data));
			},
		});

		await execute({
			params: { contractTypeId: "TMPL_2023" },
			data: {}, // 添加空data
		});
	});

	it("获取合同类型名称列表", async () => {
		const { execute, data } = listContractTypeNames({
			onSuccess(data) {
				console.log("名称列表获取成功", printFormat(data));
			},
		});

		await execute({
			data: {}, // 使用空data对象
		});
	});

	it("获取合同类型列表", async () => {
		const { execute, data } = listContractTypes({
			onSuccess(data) {
				console.log("类型列表获取成功", printFormat(data));
			},
		});

		await execute({
			params: {
				typeName: "服务合同",
				pageSize: 15,
			},
			data: {},
		});
	});

	it("获取到期合同列表", async () => {
		const { execute, data } = queryAllExpiredContracts({
			onSuccess(data) {
				console.log("到期合同获取成功", printFormat(data));
			},
		});

		await execute({
			params: {
				contractNameLike: "2023年度",
				contractType: "服务类",
			},
			data: {},
		});
	});

	it("打印合同", async () => {
		const { execute, data } = createPrintTask({
			onSuccess(data) {
				console.log("打印任务创建成功", printFormat(data));
			},
		});

		await execute({
			params: {
				contractId: "CONT_1001",
				contractTypeId: "TYPE_2023",
			},
			data: {},
		});
	});
});

it("获取合同列表", async () => {
	const { execute, data } = queryContractList({
		onSuccess(data) {
			console.log("合同列表获取成功", printFormat(data));
		},
	});

	await execute({
		params: {
			contractCode: "C-2023",
			pageIndex: 2,
		},
		data: {},
	});
});

it("获取合同修改记录", async () => {
	const { execute, data } = listContractChangePlanById({
		onSuccess(data) {
			console.log("修改记录获取成功", printFormat(data));
		},
	});

	await execute({
		params: {
			contractId: "MOD_001",
			staffNameLike: "张",
		},
		data: {},
	});
});

it("选择合同列表", async () => {
	const { execute, data } = selectContractList({
		onSuccess(data) {
			console.log("可选合同列表获取成功", printFormat(data));
		},
	});

	await execute({
		params: {
			contractNameLike: "采购协议",
		},
		data: {},
	});
});

it("获取合同甲方列表", async () => {
	const { execute, data } = queryAllPartyA({
		onSuccess(data) {
			console.log("甲方列表获取成功", printFormat(data));
		},
	});

	await execute({
		params: {
			partyA: "XX科技有限公司",
			pageSize: 5,
		},
		data: {
			partyA: "",
			aContacts: "联系人",
			aLink: "",
		}, // 根据实际接口要求提供data
	});
});

it("查看变更明细", async () => {
	const { execute, data } = listChangeDetails({
		onSuccess(data) {
			console.log("变更明细获取成功", printFormat(data));
		},
	});

	await execute({
		params: {
			planId: "CHG_2023_001",
		},
		data: {},
	});
});

it("获取合同变更列表", async () => {
	const { execute, data } = listContractChanges({
		onSuccess(data) {
			console.log("变更列表获取成功", printFormat(data));
		},
	});

	await execute({
		params: {
			contractName: "技术服务协议",
			contractType: "技术类",
		},
		data: {},
	});
});

it("删除车辆", async () => {
	const { execute, data } = removeOwnerVehicle({
		onSuccess(data) {
			console.log("车辆删除成功", printFormat(data));
		},
		onError(error) {
			console.error("删除失败", printFormat(error));
		},
	});

	await execute({
		data: { carId: "VH_2023_001" },
	});
});
