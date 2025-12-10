/**
 * 车位结构图表单类型定义
 * 此文件将由其他子代理完成表单类型的详细实现
 */

export interface 车位结构图表单_VO {
	/** 车位编号 */
	车位编号: string;
	/** 车位类型 */
	车位类型: string;
	/** 车位位置 */
	车位位置: string;
	/** 车位面积 */
	车位面积: string;
	/** 车位状态 */
	车位状态: string;
	/** 业主姓名 */
	业主姓名: string;
	/** 联系电话 */
	联系电话: string;
	/** 车牌号码 */
	车牌号码: string;
	/** 车辆品牌 */
	车辆品牌: string;
	/** 购买时间 */
	购买时间: string;
	/** 到期时间 */
	到期时间: string;
	/** 月租金 */
	月租金: string;
	/** 管理费 */
	管理费: string;
	/** 车位朝向 */
	车位朝向: string;
	/** 楼层区域 */
	楼层区域: string;
	/** 是否充电桩 */
	是否充电桩: string;
	/** 充电桩功率 */
	充电桩功率: string;
	/** 备注信息 */
	备注信息: string;
}

export interface ParkingSpaceStructureDiagramFormProps {
	form: 车位结构图表单_VO;
	defaultValues: 车位结构图表单_VO;
	mode?: string;
}

export const defaultForm: 车位结构图表单_VO = {
	车位编号: "",
	车位类型: "",
	车位位置: "",
	车位面积: "",
	车位状态: "",
	业主姓名: "",
	联系电话: "",
	车牌号码: "",
	车辆品牌: "",
	购买时间: "",
	到期时间: "",
	月租金: "",
	管理费: "",
	车位朝向: "",
	楼层区域: "",
	是否充电桩: "",
	充电桩功率: "",
	备注信息: "",
};
