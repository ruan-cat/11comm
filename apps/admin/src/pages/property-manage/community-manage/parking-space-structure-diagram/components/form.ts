import { type Mode } from "@/composables/use-mode";
import type { ParkingSpaceStructureDiagramFormVO } from "@01s-11comm/type";

export interface ParkingSpaceStructureDiagramFormProps {
	form: ParkingSpaceStructureDiagramFormVO;
	defaultValues: ParkingSpaceStructureDiagramFormVO;
	mode?: Mode;
}

export const defaultForm: ParkingSpaceStructureDiagramFormVO = {
	parkingSpaceNumber: "",
	parkingSpaceType: "",
	parkingSpaceLocation: "",
	parkingSpaceArea: "",
	parkingSpaceStatus: "",
	ownerName: "",
	contactPhone: "",
	licensePlateNumber: "",
	vehicleBrand: "",
	purchaseTime: "",
	expiryTime: "",
	monthlyRent: 0,
	managementFee: 0,
	parkingSpaceOrientation: "",
	floorArea: "",
	hasEvChargingPile: "否",
	chargingPilePower: "",
	remark: "",
};
