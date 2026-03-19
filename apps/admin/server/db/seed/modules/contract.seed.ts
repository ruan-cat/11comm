import {
	ctFirstParties,
	ctSecondParties,
	ctTemplates,
	ctClauses,
	ctTypes,
	ctContracts,
	ctAttachments,
	ctChanges,
	ctArchives,
	ctPrints,
	ctReviews,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "contract",
	dependencies: ["house-property"],
	async seed(db) {
		await db.insert(ctFirstParties).values(
			rows([
				{
					id: sid("first-party", "sunshine"),
					name: "阳光物业公司",
					contactPerson: "张三",
					contactPhone: "13800000001",
					address: "北京市朝阳区阳光大厦",
					creditCode: "91110105MA01XXXX01",
					establishedDate: new Date("2015-03-01"),
					legalRepresentative: "张三",
					businessScope: "物业管理服务",
					status: "enabled",
				},
				{
					id: sid("first-party", "greentown"),
					name: "绿城物业公司",
					contactPerson: "李四",
					contactPhone: "13800000002",
					address: "北京市海淀区绿城广场",
					creditCode: "91110105MA01XXXX02",
					establishedDate: new Date("2018-06-15"),
					legalRepresentative: "李四",
					businessScope: "物业管理及咨询服务",
					status: "enabled",
				},
				{
					id: sid("first-party", "huarun"),
					name: "华润物业公司",
					contactPerson: "王五",
					contactPhone: "13800000003",
					address: "北京市丰台区华润中心",
					creditCode: "91110105MA01XXXX03",
					establishedDate: new Date("2010-01-10"),
					legalRepresentative: "王五",
					businessScope: "物业管理及房地产咨询",
					status: "enabled",
				},
			]),
		);

		await db.insert(ctSecondParties).values(
			rows([
				{
					id: sid("second-party", "construction"),
					name: "某某建筑公司",
					contactPerson: "赵六",
					contactPhone: "13900000001",
					address: "北京市西城区建设路1号",
					creditCode: "91110105MA02XXXX01",
					status: "enabled",
				},
				{
					id: sid("second-party", "cleaning"),
					name: "某某清洁公司",
					contactPerson: "钱七",
					contactPhone: "13900000002",
					address: "北京市东城区清洁街2号",
					creditCode: "91110105MA02XXXX02",
					status: "enabled",
				},
				{
					id: sid("second-party", "security"),
					name: "某某安保公司",
					contactPerson: "孙八",
					contactPhone: "13900000003",
					address: "北京市朝阳区安保路3号",
					creditCode: "91110105MA02XXXX03",
					status: "enabled",
				},
			]),
		);

		await db.insert(ctTemplates).values(
			rows([
				{
					id: sid("ct-template", "service"),
					templateName: "物业服务合同模板",
					templateNumber: "TPL-001",
					applicableContractType: "物业服务",
					templateVersion: "v1.0",
					templateContent: "合同模板内容...",
					status: "published",
				},
				{
					id: sid("ct-template", "lease"),
					templateName: "设备租赁合同模板",
					templateNumber: "TPL-002",
					applicableContractType: "设备租赁",
					templateVersion: "v1.0",
					templateContent: "合同模板内容...",
					status: "published",
				},
			]),
		);

		await db.insert(ctClauses).values(
			rows([
				{
					id: sid("clause", "service"),
					templateId: sid("ct-template", "service"),
					clauseName: "服务条款",
					clauseContent: "甲方应按约定提供物业管理服务...",
					clauseType: "general",
					sortOrder: 1,
				},
				{
					id: sid("clause", "fee"),
					templateId: sid("ct-template", "service"),
					clauseName: "费用条款",
					clauseContent: "乙方应按约定支付相关费用...",
					clauseType: "general",
					sortOrder: 2,
				},
				{
					id: sid("clause", "breach"),
					templateId: sid("ct-template", "lease"),
					clauseName: "违约条款",
					clauseContent: "任何一方违约应承担相应责任...",
					clauseType: "general",
					sortOrder: 1,
				},
			]),
		);

		await db.insert(ctTypes).values(
			rows([
				{
					id: sid("ct-type", "service"),
					typeName: "物业服务",
					typeCode: "CT-1",
					isAudit: true,
					description: "物业管理服务合同",
					status: "enabled",
				},
				{
					id: sid("ct-type", "lease"),
					typeName: "设备租赁",
					typeCode: "CT-2",
					isAudit: true,
					description: "设备租赁相关合同",
					status: "enabled",
				},
				{
					id: sid("ct-type", "maintenance"),
					typeName: "维保合同",
					typeCode: "CT-3",
					isAudit: true,
					description: "设备维护保养合同",
					status: "enabled",
				},
			]),
		);

		await db.insert(ctContracts).values(
			rows([
				{
					id: sid("contract", "HT2024001"),
					contractName: "阳光花园物业服务合同",
					contractNumber: "HT2024001",
					contractType: "物业服务",
					firstPartyId: sid("first-party", "sunshine"),
					secondPartyId: sid("second-party", "cleaning"),
					amount: "100000.00",
					startTime: new Date("2024-01-01"),
					endTime: new Date("2025-12-31"),
					status: "effective",
				},
				{
					id: sid("contract", "HT2024002"),
					contractName: "设备租赁合同",
					contractNumber: "HT2024002",
					contractType: "设备租赁",
					firstPartyId: sid("first-party", "greentown"),
					secondPartyId: sid("second-party", "construction"),
					amount: "50000.00",
					startTime: new Date("2024-03-01"),
					endTime: new Date("2025-02-28"),
					status: "effective",
				},
				{
					id: sid("contract", "HT2024003"),
					contractName: "电梯维保合同",
					contractNumber: "HT2024003",
					contractType: "维保合同",
					firstPartyId: sid("first-party", "huarun"),
					secondPartyId: sid("second-party", "security"),
					amount: "80000.00",
					startTime: new Date("2024-06-01"),
					endTime: new Date("2026-05-31"),
					status: "effective",
				},
			]),
		);

		await db.insert(ctAttachments).values(
			rows([
				{
					id: sid("ct-attach", "1"),
					contractId: sid("contract", "HT2024001"),
					attachmentName: "合同正文扫描件",
					attachmentType: "contract_body",
					filePath: "/uploads/contracts/HT2024001.pdf",
					fileSize: 2048000,
				},
				{
					id: sid("ct-attach", "2"),
					contractId: sid("contract", "HT2024002"),
					attachmentName: "营业执照复印件",
					attachmentType: "license",
					filePath: "/uploads/contracts/HT2024002_license.jpg",
					fileSize: 1024000,
				},
			]),
		);

		await db
			.insert(ctChanges)
			.values(
				rows([
					{
						id: sid("ct-change", "1"),
						contractId: sid("contract", "HT2024001"),
						changeType: "amount_adjustment",
						changeReason: "因服务范围调整，合同金额变更",
						approver: "张三",
						approvalStatus: "approved",
						approvalTime: new Date("2024-06-05"),
					},
				]),
			);

		await db
			.insert(ctArchives)
			.values(
				rows([
					{
						id: sid("ct-archive", "1"),
						contractId: sid("contract", "HT2024001"),
						archiveNo: "AR-2024-001",
						archiveDate: new Date("2024-02-01").toISOString().slice(0, 10),
						archiver: "李四",
						archiveLocation: "档案室A-3-12",
					},
				]),
			);

		await db
			.insert(ctPrints)
			.values(
				rows([
					{
						id: sid("ct-print", "1"),
						contractId: sid("contract", "HT2024001"),
						printCount: 1,
						printTime: new Date("2024-01-10"),
						printer: "张三",
					},
				]),
			);

		await db
			.insert(ctReviews)
			.values(
				rows([
					{
						id: sid("ct-review", "1"),
						contractId: sid("contract", "HT2024001"),
						reviewer: "李四",
						reviewTime: new Date("2024-01-03"),
						reviewResult: "approved",
						reviewOpinion: "同意",
					},
				]),
			);
	},
});
