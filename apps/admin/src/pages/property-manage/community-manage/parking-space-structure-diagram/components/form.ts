import { type Mode } from "@/composables/use-mode";

/**
 * 车位结构图表单数据类型
 * Parking space structure diagram form VO
 */
export interface ParkingSpaceStructureDiagramFormVO {
	/** 车位编号 */
	parkingSpaceNumber: string;
	/** 车位类型 */
	parkingSpaceType: string;
	/** 车位位置 */
	parkingSpaceLocation: string;
	/** 车位面积 */
	parkingSpaceArea: string;
	/** 车位状态 */
	parkingSpaceStatus: string;
	/** 业主姓名 */
	ownerName: string;
	/** 联系电话 */
	contactPhone: string;
	/** 车牌号码 */
	licensePlateNumber: string;
	/** 车辆品牌 */
	vehicleBrand: string;
	/** 购买时间 */
	purchaseTime: string;
	/** 到期时间 */
	expiryTime: string;
	/** 月租金 */
	monthlyRent: number;
	/** 管理费 */
	managementFee: number;
	/** 车位朝向 */
	parkingSpaceOrientation: string;
	/** 楼层区域 */
	floorArea: string;
	/** 是否充电桩 */
	hasEvChargingPile: string;
	/** 充电桩功率 */
	chargingPilePower: string;
	/** 备注信息 */
	remark: string;
}

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
