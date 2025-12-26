import { type Mode } from "@/composables/use-mode";
import type { ParkingSpaceStructureDiagramFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
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
	hasEvChargingPile: "",
	chargingPilePower: "",
	remark: "",
};

/**
 * 车位结构图表单 Props
 * Parking space structure diagram form props
 */
export interface ParkingSpaceStructureDiagramFormProps {
	/** 表单数据 */
	form: ParkingSpaceStructureDiagramFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ParkingSpaceStructureDiagramFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
