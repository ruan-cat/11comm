import {
	pkParkingLots,
	pkCarports,
	pkOwnerVehicles,
	pkCarportApplications,
	pkParkingStructures,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "parking",
	dependencies: ["house-property"],
	async seed(db) {
		await db.insert(pkParkingLots).values(
			rows([
				{
					id: sid("parking-lot", "1"),
					communityId: sid("community", "sunshine"),
					lotName: "1号停车场",
					lotType: "underground",
					totalSpaces: 100,
					availableSpaces: 50,
				},
				{
					id: sid("parking-lot", "2"),
					communityId: sid("community", "sunshine"),
					lotName: "2号停车场",
					lotType: "ground",
					totalSpaces: 80,
					availableSpaces: 35,
				},
			]),
		);

		await db.insert(pkCarports).values(
			rows([
				{
					id: sid("carport", "A001"),
					parkingLotId: sid("parking-lot", "1"),
					carportNumber: "A-001",
					area: "15.00",
					monthlyRent: "300.00",
					ownerName: "张三",
					status: "sold",
				},
				{
					id: sid("carport", "A002"),
					parkingLotId: sid("parking-lot", "1"),
					carportNumber: "A-002",
					area: "16.00",
					monthlyRent: "350.00",
					ownerName: "李四",
					status: "rented",
				},
				{
					id: sid("carport", "B001"),
					parkingLotId: sid("parking-lot", "2"),
					carportNumber: "B-001",
					area: "18.00",
					monthlyRent: "280.00",
					ownerName: null,
					status: "available",
				},
			]),
		);

		await db.insert(pkOwnerVehicles).values(
			rows([
				{
					id: sid("vehicle", "1"),
					ownerId: sid("owner", "zhangsan"),
					licensePlate: "京A12345",
					plateType: "blue",
					vehicleType: "sedan",
					vehicleColor: "黑色",
					validityStart: new Date("2024-01-01"),
					validityEnd: new Date("2025-12-31"),
				},
				{
					id: sid("vehicle", "2"),
					ownerId: sid("owner", "lisi"),
					licensePlate: "京B67890",
					plateType: "blue",
					vehicleType: "suv",
					vehicleColor: "白色",
					validityStart: new Date("2024-03-01"),
					validityEnd: new Date("2025-02-28"),
				},
				{
					id: sid("vehicle", "3"),
					ownerId: sid("owner", "wangwu"),
					licensePlate: "京C11223",
					plateType: "blue",
					vehicleType: "sedan",
					vehicleColor: "银色",
					validityStart: new Date("2024-06-01"),
					validityEnd: new Date("2025-05-31"),
				},
			]),
		);

		await db.insert(pkCarportApplications).values(
			rows([
				{ id: sid("carport-app", "1"), applicant: "张三", carportType: "standard", status: "已通过" },
				{ id: sid("carport-app", "2"), applicant: "王五", carportType: "standard", status: "待审核" },
			]),
		);

		await db.insert(pkParkingStructures).values(
			rows([
				{
					id: sid("parking-struct", "1"),
					parkingLotId: sid("parking-lot", "1"),
					regionName: "A区",
					structureData: JSON.stringify({ levels: 2, spacesPerLevel: 50 }),
					sortOrder: 1,
				},
				{
					id: sid("parking-struct", "2"),
					parkingLotId: sid("parking-lot", "2"),
					regionName: "B区",
					structureData: JSON.stringify({ levels: 1, spacesPerLevel: 80 }),
					sortOrder: 2,
				},
			]),
		);
	},
});
