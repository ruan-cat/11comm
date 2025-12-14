/**
 * 车位结构图表单类型定义
 * 此文件将由其他子代理完成表单类型的详细实现
 */

export interface 车位结构图表单_VO {
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

export interface ParkingSpaceStructureDiagramFormProps {
	form: 车位结构图表单_VO;
	defaultValues: 车位结构图表单_VO;
	mode?: string;
}

export const defaultForm: 车位结构图表单_VO = {
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
