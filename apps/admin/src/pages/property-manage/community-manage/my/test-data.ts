import type { OptionsType } from "plus-pro-components";
import type { CommunityManageMyFormVO, CommunityStatusType, ProvinceType } from "./components/form";

// ==================== 类型定义 ====================

/**
 * 我的小区列表数据类型
 */
export interface 我的小区_列表Data {
	/** 省份 */
	省份: ProvinceType;
	/** 市州 */
	市州: string;
	/** 区县 */
	区县: string;
	/** 小区名称 */
	小区名称: string;
	/** 小区编码 */
	小区编码: string;
	/** 客服电话 */
	客服电话: string;
	/** 面积 */
	面积: string;
	/** 开始时间 */
	开始时间: string;
	/** 结束时间 */
	结束时间: string;
	/** 状态 */
	状态: CommunityStatusType;
}

/**
 * 我的小区列表查询参数类型
 */
export interface 我的小区_列表查询_VO {
	/** 省份 */
	省份?: ProvinceType;
	/** 市州 */
	市州?: string;
	/** 区县 */
	区县?: string;
	/** 小区名称 */
	小区名称?: string;
	/** 小区编码 */
	小区编码?: string;
	/** 状态 */
	状态?: CommunityStatusType;
}

// ==================== 常量定义 ====================

/**
 * 省份选项
 */
export const 省份选项: OptionsType = [
	{
		label: "全部",
		value: "",
	},
	{
		label: "福建省",
		value: "福建省",
	},
	{
		label: "广东省",
		value: "广东省",
	},
	{
		label: "浙江省",
		value: "浙江省",
	},
	{
		label: "江苏省",
		value: "江苏省",
	},
	{
		label: "北京市",
		value: "北京市",
	},
	{
		label: "上海市",
		value: "上海市",
	},
	{
		label: "四川省",
		value: "四川省",
	},
	{
		label: "湖北省",
		value: "湖北省",
	},
	{
		label: "山东省",
		value: "山东省",
	},
	{
		label: "湖南省",
		value: "湖南省",
	},
	{
		label: "河北省",
		value: "河北省",
	},
	{
		label: "河南省",
		value: "河南省",
	},
	{
		label: "江西省",
		value: "江西省",
	},
	{
		label: "安徽省",
		value: "安徽省",
	},
];

/**
 * 状态选项
 */
export const 状态选项: OptionsType = [
	{
		label: "全部",
		value: "",
	},
	{
		label: "正常运营",
		value: "正常运营",
	},
	{
		label: "筹备中",
		value: "筹备中",
	},
	{
		label: "维护中",
		value: "维护中",
	},
	{
		label: "已停用",
		value: "已停用",
	},
];

// ==================== 辅助函数 ====================

/** 生成随机日期 */
function generateRandomDate(startYear: number = 2016, endYear: number = 2024): string {
	const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
	const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
	const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/** 生成结束时间（开始时间 + 30年） */
function generateEndTime(startTime: string): string {
	const date = new Date(startTime);
	date.setFullYear(date.getFullYear() + 30);
	return date.toISOString().split("T")[0];
}

/** 生成随机面积 */
function generateArea(): string {
	const area = (Math.random() * 40 + 10).toFixed(1);
	return `${area}万㎡`;
}

/** 生成随机手机号 */
function generatePhoneNumber(): string {
	const prefix = ["138", "139", "150", "151", "152", "158", "159", "186", "187", "188"];
	const selectedPrefix = prefix[Math.floor(Math.random() * prefix.length)];
	const suffix = String(Math.floor(Math.random() * 100000000)).padStart(8, "0");
	return `${selectedPrefix}${suffix}`;
}

// ==================== 表格假数据 ====================

/** 表格假数据 */
export const tableData: 我的小区_列表Data[] = [
	{
		省份: "福建省",
		市州: "福州市",
		区县: "鼓楼区",
		小区名称: "阳光花园",
		小区编码: "SQ000001",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2019-03-15",
		结束时间: "2049-03-15",
		状态: "正常运营",
	},
	{
		省份: "福建省",
		市州: "厦门市",
		区县: "思明区",
		小区名称: "碧桂园滨海花园",
		小区编码: "SQ000002",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-05-20",
		结束时间: "2050-05-20",
		状态: "正常运营",
	},
	{
		省份: "广东省",
		市州: "广州市",
		区县: "天河区",
		小区名称: "万科城市花园",
		小区编码: "SQ000003",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2018-08-10",
		结束时间: "2048-08-10",
		状态: "正常运营",
	},
	{
		省份: "广东省",
		市州: "深圳市",
		区县: "南山区",
		小区名称: "恒大名都",
		小区编码: "SQ000004",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-11-05",
		结束时间: "2051-11-05",
		状态: "筹备中",
	},
	{
		省份: "浙江省",
		市州: "杭州市",
		区县: "西湖区",
		小区名称: "保利花园",
		小区编码: "SQ000005",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2019-09-12",
		结束时间: "2049-09-12",
		状态: "正常运营",
	},
	{
		省份: "浙江省",
		市州: "宁波市",
		区县: "江北区",
		小区名称: "龙湖春江彼岸",
		小区编码: "SQ000006",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-12-18",
		结束时间: "2050-12-18",
		状态: "维护中",
	},
	{
		省份: "江苏省",
		市州: "南京市",
		区县: "鼓楼区",
		小区名称: "华润置地",
		小区编码: "SQ000007",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2017-04-22",
		结束时间: "2047-04-22",
		状态: "正常运营",
	},
	{
		省份: "江苏省",
		市州: "苏州市",
		区县: "工业园区",
		小区名称: "中海国际社区",
		小区编码: "SQ000008",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-07-30",
		结束时间: "2051-07-30",
		状态: "正常运营",
	},
	{
		省份: "北京市",
		市州: "北京市",
		区县: "朝阳区",
		小区名称: "金科天宸",
		小区编码: "SQ000009",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2016-10-08",
		结束时间: "2046-10-08",
		状态: "正常运营",
	},
	{
		省份: "上海市",
		市州: "上海市",
		区县: "浦东新区",
		小区名称: "融创玖玺台",
		小区编码: "SQ000010",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2018-02-14",
		结束时间: "2048-02-14",
		状态: "正常运营",
	},
	{
		省份: "四川省",
		市州: "成都市",
		区县: "锦江区",
		小区名称: "阳光水岸",
		小区编码: "SQ000011",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2022-01-20",
		结束时间: "2052-01-20",
		状态: "筹备中",
	},
	{
		省份: "湖北省",
		市州: "武汉市",
		区县: "武昌区",
		小区名称: "碧桂园凤凰城",
		小区编码: "SQ000012",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2019-06-25",
		结束时间: "2049-06-25",
		状态: "正常运营",
	},
	{
		省份: "山东省",
		市州: "济南市",
		区县: "历下区",
		小区名称: "万科城",
		小区编码: "SQ000013",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-09-15",
		结束时间: "2050-09-15",
		状态: "正常运营",
	},
	{
		省份: "福建省",
		市州: "泉州市",
		区县: "丰泽区",
		小区名称: "恒大绿洲",
		小区编码: "SQ000014",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-03-10",
		结束时间: "2051-03-10",
		状态: "维护中",
	},
	{
		省份: "广东省",
		市州: "东莞市",
		区县: "东城区",
		小区名称: "保利百合花园",
		小区编码: "SQ000015",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2022-05-08",
		结束时间: "2052-05-08",
		状态: "筹备中",
	},
	{
		省份: "浙江省",
		市州: "温州市",
		区县: "鹿城区",
		小区名称: "龙湖天琅",
		小区编码: "SQ000016",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-11-22",
		结束时间: "2050-11-22",
		状态: "正常运营",
	},
	{
		省份: "江苏省",
		市州: "无锡市",
		区县: "滨湖区",
		小区名称: "华润万象城",
		小区编码: "SQ000017",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2017-08-30",
		结束时间: "2047-08-30",
		状态: "正常运营",
	},
	{
		省份: "北京市",
		市州: "北京市",
		区县: "海淀区",
		小区名称: "中海寰宇天下",
		小区编码: "SQ000018",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2019-12-05",
		结束时间: "2049-12-05",
		状态: "正常运营",
	},
	{
		省份: "上海市",
		市州: "上海市",
		区县: "静安区",
		小区名称: "金科王府",
		小区编码: "SQ000019",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-04-18",
		结束时间: "2051-04-18",
		状态: "正常运营",
	},
	{
		省份: "四川省",
		市州: "绵阳市",
		区县: "涪城区",
		小区名称: "融创观澜府",
		小区编码: "SQ000020",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2022-07-12",
		结束时间: "2052-07-12",
		状态: "筹备中",
	},
	{
		省份: "湖北省",
		市州: "宜昌市",
		区县: "西陵区",
		小区名称: "阳光新城",
		小区编码: "SQ000021",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-02-28",
		结束时间: "2050-02-28",
		状态: "正常运营",
	},
	{
		省份: "山东省",
		市州: "青岛市",
		区县: "市南区",
		小区名称: "碧桂园翡翠湾",
		小区编码: "SQ000022",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2018-10-15",
		结束时间: "2048-10-15",
		状态: "正常运营",
	},
	{
		省份: "福建省",
		市州: "漳州市",
		区县: "芗城区",
		小区名称: "万科金域华府",
		小区编码: "SQ000023",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-08-20",
		结束时间: "2051-08-20",
		状态: "维护中",
	},
	{
		省份: "广东省",
		市州: "佛山市",
		区县: "禅城区",
		小区名称: "恒大金碧天下",
		小区编码: "SQ000024",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2019-05-12",
		结束时间: "2049-05-12",
		状态: "正常运营",
	},
	{
		省份: "浙江省",
		市州: "绍兴市",
		区县: "越城区",
		小区名称: "保利玫瑰园",
		小区编码: "SQ000025",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2022-03-25",
		结束时间: "2052-03-25",
		状态: "筹备中",
	},
	{
		省份: "江苏省",
		市州: "常州市",
		区县: "新北区",
		小区名称: "龙湖原著",
		小区编码: "SQ000026",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2017-12-08",
		结束时间: "2047-12-08",
		状态: "正常运营",
	},
	{
		省份: "北京市",
		市州: "北京市",
		区县: "丰台区",
		小区名称: "华润昆仑域",
		小区编码: "SQ000027",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2016-06-18",
		结束时间: "2046-06-18",
		状态: "正常运营",
	},
	{
		省份: "上海市",
		市州: "上海市",
		区县: "徐汇区",
		小区名称: "中海瀛台",
		小区编码: "SQ000028",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2018-09-10",
		结束时间: "2048-09-10",
		状态: "正常运营",
	},
	{
		省份: "四川省",
		市州: "德阳市",
		区县: "旌阳区",
		小区名称: "金科集美嘉悦",
		小区编码: "SQ000029",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-01-15",
		结束时间: "2051-01-15",
		状态: "正常运营",
	},
	{
		省份: "湖北省",
		市州: "襄阳市",
		区县: "襄城区",
		小区名称: "融创南湖桃花岭",
		小区编码: "SQ000030",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-06-22",
		结束时间: "2050-06-22",
		状态: "维护中",
	},
	{
		省份: "山东省",
		市州: "烟台市",
		区县: "芝罘区",
		小区名称: "阳光海岸",
		小区编码: "SQ000031",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2019-11-08",
		结束时间: "2049-11-08",
		状态: "正常运营",
	},
	{
		省份: "福建省",
		市州: "龙岩市",
		区县: "新罗区",
		小区名称: "碧桂园钻石郡",
		小区编码: "SQ000032",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2022-09-30",
		结束时间: "2052-09-30",
		状态: "筹备中",
	},
	{
		省份: "广东省",
		市州: "中山市",
		区县: "石岐区",
		小区名称: "万科城市之光",
		小区编码: "SQ000033",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2017-03-25",
		结束时间: "2047-03-25",
		状态: "正常运营",
	},
	{
		省份: "浙江省",
		市州: "嘉兴市",
		区县: "南湖区",
		小区名称: "恒大御景湾",
		小区编码: "SQ000034",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2020-04-12",
		结束时间: "2050-04-12",
		状态: "正常运营",
	},
	{
		省份: "湖南省",
		市州: "长沙市",
		区县: "岳麓区",
		小区名称: "阳光100国际新城",
		小区编码: "SQ000035",
		客服电话: generatePhoneNumber(),
		面积: generateArea(),
		开始时间: "2021-06-18",
		结束时间: "2051-06-18",
		状态: "已停用",
	},
];
