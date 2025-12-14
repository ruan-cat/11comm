import type { DiscountSettingListItem } from "@01s-11comm/type";

/**
 * @description discount-setting模拟数据
 * DiscountSetting mock data
 */
export const mockDiscountSettingData: DiscountSettingListItem[] = [
	{
		id: "1",
		discountId: "D001",
		discountName: "预缴一年9折",
		discountType: "百分比折扣",
		ruleName: "预缴优惠",
		rule: "预缴12个月物业费，享9折优惠",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "这是示例数据1",
	},
	{
		id: "2",
		discountId: "D002",
		discountName: "预缴半年95折",
		discountType: "百分比折扣",
		ruleName: "预缴优惠",
		rule: "预缴6个月物业费，享95折优惠",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "这是示例数据2",
	},
	{
		id: "3",
		discountId: "D003",
		discountName: "空置房减免",
		discountType: "百分比折扣",
		ruleName: "空置房政策",
		rule: "空置房物业费减免30%",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "这是示例数据3",
	},
	{
		id: "4",
		discountId: "D004",
		discountName: "老带新优惠",
		discountType: "固定金额折扣",
		ruleName: "营销活动",
		rule: "老业主推荐新业主，减免100元",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "5",
		discountId: "D005",
		discountName: "节日特惠",
		discountType: "固定金额折扣",
		ruleName: "节日活动",
		rule: "春节期间缴费立减50元",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "这是示例数据5",
	},
];
