/** 楼栋单元选择表单数据 */
export interface UnitSelectionFormVO {
	buildingCode: string;
	unitCode: string;
}

/** 楼栋单元搜索条件 */
export interface UnitSelectionSearchVO {
	buildingCode?: string;
	unitCode?: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: UnitSelectionFormVO = {
	buildingCode: "",
	unitCode: "",
};

/**
 * 楼栋单元选择表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface UnitAuthFormProps {
	/** 表单数据 */
	form: UnitSelectionFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: UnitSelectionFormVO;
}

/** 楼栋单元选择列表数据 */
export interface UnitSelectionItemVO {
	buildingCode: string;
	unitCode: string;
}

/** 楼栋单元选择弹框的搜索栏配置 */
export const unitSelectionMockData: UnitSelectionItemVO[] = [
	{ buildingCode: "8", unitCode: "0" },
	{ buildingCode: "CBZMQ", unitCode: "0" },
	{ buildingCode: "CBZMQ", unitCode: "1" },
	{ buildingCode: "11111111", unitCode: "1" },
	{ buildingCode: "B1", unitCode: "1" },
	{ buildingCode: "测试0611", unitCode: "0" },
	{ buildingCode: "999999", unitCode: "1" },
	{ buildingCode: "33", unitCode: "0" },
	{ buildingCode: "3", unitCode: "2" },
	{ buildingCode: "3", unitCode: "1" },
	{ buildingCode: "A1", unitCode: "1" },
	{ buildingCode: "A1", unitCode: "2" },
	{ buildingCode: "A2", unitCode: "1" },
	{ buildingCode: "A2", unitCode: "2" },
	{ buildingCode: "A3", unitCode: "1" },
	{ buildingCode: "A3", unitCode: "2" },
	{ buildingCode: "B2", unitCode: "1" },
	{ buildingCode: "B2", unitCode: "2" },
	{ buildingCode: "B3", unitCode: "1" },
	{ buildingCode: "B3", unitCode: "2" },
	{ buildingCode: "C1", unitCode: "1" },
	{ buildingCode: "C1", unitCode: "2" },
	{ buildingCode: "C2", unitCode: "1" },
	{ buildingCode: "C2", unitCode: "2" },
	{ buildingCode: "C3", unitCode: "1" },
	{ buildingCode: "C3", unitCode: "2" },
	{ buildingCode: "D1", unitCode: "1" },
	{ buildingCode: "D1", unitCode: "2" },
	{ buildingCode: "D2", unitCode: "1" },
	{ buildingCode: "D2", unitCode: "2" },
	{ buildingCode: "E1", unitCode: "1" },
	{ buildingCode: "E1", unitCode: "2" },
	{ buildingCode: "E2", unitCode: "1" },
	{ buildingCode: "E2", unitCode: "2" },
	{ buildingCode: "F1", unitCode: "1" },
];
