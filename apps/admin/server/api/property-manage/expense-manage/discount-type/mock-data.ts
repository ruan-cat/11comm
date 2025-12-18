import type { DiscountTypeListItem } from "@01s-11comm/type";

/**
 * @description discount-type模拟数据
 * DiscountType mock data
 */
export const mockDiscountTypeData: DiscountTypeListItem[] = [
	{
		id: "1",
		name: "示例项目1",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "这是示例数据1",
		discountType: "金额折扣",
		ruleName: "满100减10",
		rule: "消费满100元可享受10元优惠",
	},
	{
		id: "2",
		name: "示例项目2",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "这是示例数据2",
		discountType: "百分比折扣",
		ruleName: "9折优惠",
		rule: "所有费用享受9折优惠",
	},
	{
		id: "3",
		name: "示例项目3",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "这是示例数据3",
		discountType: "固定减免",
		ruleName: "减免50元",
		rule: "每月固定减免50元费用",
	},
	{
		id: "4",
		name: "示例项目4",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
		discountType: "阶梯折扣",
		ruleName: "阶梯优惠",
		rule: "按消费金额分阶梯享受不同折扣",
	},
	{
		id: "5",
		name: "示例项目5",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "这是示例数据5",
		discountType: "会员专享",
		ruleName: "VIP8折",
		rule: "VIP会员享受8折优惠",
	},
];
