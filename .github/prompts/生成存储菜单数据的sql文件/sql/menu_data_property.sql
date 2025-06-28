-- ===================================================================
-- 物业管理菜单项数据补充SQL文件
-- 这是menu_data.sql的扩展部分，包含所有物业管理相关菜单项
-- ===================================================================

USE `zo_community`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Records of m_menu (物业管理菜单项 - 继续)
-- ----------------------------
INSERT INTO `m_menu` (`m_id`, `name`, `g_id`, `url`, `seq`, `p_id`, `description`, `create_time`, `status_cd`, `is_show`) VALUES

-- 物业管理 > 小区
('m_028_002', '我的小区', 'g_009_002', '/property-manage/community-manage/my', 40110, 'p_028_002', '我的小区', '2024-01-01 00:00:57', '0', 'Y'),
('m_029_002', '业务受理', 'g_009_002', '/property-manage/community-manage/handing-business', 40120, 'p_029_002', '业务受理', '2024-01-01 00:00:58', '0', 'Y'),
('m_030_002', '房屋装修', 'g_009_002', '/property-manage/community-manage/house-decoration', 40130, 'p_030_002', '房屋装修', '2024-01-01 00:00:59', '0', 'Y'),
('m_031_002', '楼栋结构图', 'g_009_002', '/property-manage/community-manage/building-space-structure-diagram', 40140, 'p_031_002', '楼栋结构图', '2024-01-01 00:01:00', '0', 'Y'),
('m_032_002', '车位结构图', 'g_009_002', '/property-manage/community-manage/parking-space-structure-diagram', 40150, 'p_032_002', '车位结构图', '2024-01-01 00:01:01', '0', 'Y'),
('m_033_002', '产权登记', 'g_009_002', '/property-manage/community-manage/property-register', 40160, 'p_033_002', '产权登记', '2024-01-01 00:01:02', '0', 'Y'),
('m_034_002', '小区公示', 'g_009_002', '/property-manage/community-manage/notice', 40170, 'p_034_002', '小区公示', '2024-01-01 00:01:03', '0', 'Y'),

-- 物业管理 > 房产管理
('m_035_002', '房屋管理', 'g_010_002', '/property-manage/house-property-manage/house', 40210, 'p_035_002', '房屋管理', '2024-01-01 00:01:04', '0', 'Y'),
('m_036_002', '业主信息', 'g_010_002', '/property-manage/house-property-manage/owner-information', 40215, 'p_036_002', '业主信息', '2024-01-01 00:01:05', '0', 'Y'),
('m_037_002', '业主成员', 'g_010_002', '/property-manage/house-property-manage/owner-member', 40220, 'p_037_002', '业主成员', '2024-01-01 00:01:06', '0', 'Y'),
('m_038_002', '业主账户', 'g_010_002', '/property-manage/house-property-manage/owner-account', 40225, 'p_038_002', '业主账户', '2024-01-01 00:01:07', '0', 'Y'),
('m_039_002', '场地管理', 'g_010_002', '/property-manage/house-property-manage/site-management', 40230, 'p_039_002', '场地管理', '2024-01-01 00:01:08', '0', 'Y'),
('m_040_002', '场地预约', 'g_010_002', '/property-manage/house-property-manage/reserve-venue', 40235, 'p_040_002', '场地预约', '2024-01-01 00:01:09', '0', 'Y'),
('m_041_002', '场地预约订单', 'g_010_002', '/property-manage/house-property-manage/reserve-venue-order', 40240, 'p_041_002', '场地预约订单', '2024-01-01 00:01:10', '0', 'Y'),
('m_042_002', '业委会', 'g_010_002', '/property-manage/house-property-manage/owners-committee', 40245, 'p_042_002', '业委会', '2024-01-01 00:01:11', '0', 'Y'),
('m_043_002', '发票抬头', 'g_010_002', '/property-manage/house-property-manage/invoice-title', 40250, 'p_043_002', '发票抬头', '2024-01-01 00:01:12', '0', 'Y'),
('m_044_002', '发票', 'g_010_002', '/property-manage/house-property-manage/invoice', 40255, 'p_044_002', '发票', '2024-01-01 00:01:13', '0', 'Y'),

-- 物业管理 > 停车管理
('m_045_002', '车位申请', 'g_011_002', '/property-manage/parking-manage/carport-apply', 40310, 'p_045_002', '车位申请', '2024-01-01 00:01:14', '0', 'Y'),
('m_046_002', '车位信息', 'g_011_002', '/property-manage/parking-manage/carport-info', 40320, 'p_046_002', '车位信息', '2024-01-01 00:01:15', '0', 'Y'),
('m_047_002', '业主车辆', 'g_011_002', '/property-manage/parking-manage/owner-vehicle', 40330, 'p_047_002', '业主车辆', '2024-01-01 00:01:16', '0', 'Y'),
('m_048_002', '停车场管理', 'g_011_002', '/property-manage/parking-manage/parking-lot', 40340, 'p_048_002', '停车场管理', '2024-01-01 00:01:17', '0', 'Y'),

-- 物业管理 > 合同管理 (根据JSON数据这些菜单项原来roles未定义，按物业团队处理)
('m_049_002', '合同变更', 'g_012_002', '/property-manage/contract-manage/change', 20000, 'p_049_002', '合同变更', '2024-01-01 00:01:18', '0', 'Y'),
('m_050_002', '起草合同', 'g_012_002', '/property-manage/contract-manage/draft-contract', 20001, 'p_050_002', '起草合同', '2024-01-01 00:01:19', '0', 'Y'),
('m_051_002', '到期合同', 'g_012_002', '/property-manage/contract-manage/expire', 20002, 'p_051_002', '到期合同', '2024-01-01 00:01:20', '0', 'Y'),
('m_052_002', '合同甲方', 'g_012_002', '/property-manage/contract-manage/first-party', 20003, 'p_052_002', '合同甲方', '2024-01-01 00:01:21', '0', 'Y'),
('m_053_002', '合同类型', 'g_012_002', '/property-manage/contract-manage/type', 40410, 'p_053_002', '合同类型', '2024-01-01 00:01:22', '0', 'Y'),

-- 物业管理 > 费用管理 (根据JSON数据这些菜单项原来roles未定义，按物业团队处理)
('m_054_002', '费用项设置', 'g_013_002', '/property-manage/expense-manage/expense-item-setting', 40510, 'p_054_002', '费用项设置', '2024-01-01 00:01:23', '0', 'Y'),
('m_055_002', '抄表类型', 'g_013_002', '/property-manage/expense-manage/meter-reading-type', 40515, 'p_055_002', '抄表类型', '2024-01-01 00:01:24', '0', 'Y'),
('m_056_002', '水电抄表', 'g_013_002', '/property-manage/expense-manage/water-and-electricity-meter-reading', 40520, 'p_056_002', '水电抄表', '2024-01-01 00:01:25', '0', 'Y'),
('m_057_002', '折扣设置', 'g_013_002', '/property-manage/expense-manage/discount-setting', 40525, 'p_057_002', '折扣设置', '2024-01-01 00:01:26', '0', 'Y'),
('m_058_002', '房屋收费', 'g_013_002', '/property-manage/expense-manage/house-charge', 40530, 'p_058_002', '房屋收费', '2024-01-01 00:01:27', '0', 'Y'),
('m_059_002', '车辆收费', 'g_013_002', '/property-manage/expense-manage/vehicle-charge', 40535, 'p_059_002', '车辆收费', '2024-01-01 00:01:28', '0', 'Y'),
('m_060_002', '合同收费', 'g_013_002', '/property-manage/expense-manage/contracte-charge', 40540, 'p_060_002', '合同收费', '2024-01-01 00:01:29', '0', 'Y'),
('m_061_002', '优惠类型', 'g_013_002', '/property-manage/expense-manage/discount-type', 40545, 'p_061_002', '优惠类型', '2024-01-01 00:01:30', '0', 'Y'),
('m_062_002', '优惠申请', 'g_013_002', '/property-manage/expense-manage/discount-apply', 40550, 'p_062_002', '优惠申请', '2024-01-01 00:01:31', '0', 'Y'),
('m_063_002', '补打收据', 'g_013_002', '/property-manage/expense-manage/reprint-voucher', 40555, 'p_063_002', '补打收据', '2024-01-01 00:01:32', '0', 'Y'),
('m_064_002', '缴费审核', 'g_013_002', '/property-manage/expense-manage/payment-review', 40560, 'p_064_002', '缴费审核', '2024-01-01 00:01:33', '0', 'Y'),
('m_065_002', '退费审核', 'g_013_002', '/property-manage/expense-manage/refund-review', 40565, 'p_065_002', '退费审核', '2024-01-01 00:01:34', '0', 'Y'),
('m_066_002', '取消费用', 'g_013_002', '/property-manage/expense-manage/cancel-fee', 40570, 'p_066_002', '取消费用', '2024-01-01 00:01:35', '0', 'Y'),
('m_067_002', '欠费信息', 'g_013_002', '/property-manage/expense-manage/overdue-payment-information', 40575, 'p_067_002', '欠费信息', '2024-01-01 00:01:36', '0', 'Y'),
('m_068_002', '欠费催缴', 'g_013_002', '/property-manage/expense-manage/reminder-for-overdue-payments', 40580, 'p_068_002', '欠费催缴', '2024-01-01 00:01:37', '0', 'Y'),
('m_069_002', '费用汇总表', 'g_013_002', '/property-manage/expense-manage/expense-summary-table', 40585, 'p_069_002', '费用汇总表', '2024-01-01 00:01:38', '0', 'Y'),

-- 物业管理 > 报修管理
('m_070_002', '报修设置', 'g_014_002', '/property-manage/repairs-manage/repairs-setting', 40610, 'p_070_002', '报修设置', '2024-01-01 00:01:39', '0', 'Y'),
('m_071_002', '电话报修', 'g_014_002', '/property-manage/repairs-manage/phone-report-repairs', 40620, 'p_071_002', '电话报修', '2024-01-01 00:01:40', '0', 'Y'),
('m_072_002', '工单池', 'g_014_002', '/property-manage/repairs-manage/issues', 40630, 'p_072_002', '工单池', '2024-01-01 00:01:41', '0', 'Y'),
('m_073_002', '报修待办', 'g_014_002', '/property-manage/repairs-manage/repairs-todo', 40640, 'p_073_002', '报修待办', '2024-01-01 00:01:42', '0', 'Y'),
('m_074_002', '报修已办', 'g_014_002', '/property-manage/repairs-manage/repairs-have-done', 40650, 'p_074_002', '报修已办', '2024-01-01 00:01:43', '0', 'Y'),
('m_075_002', '报修回访', 'g_014_002', '/property-manage/repairs-manage/return-visit', 40660, 'p_075_002', '报修回访', '2024-01-01 00:01:44', '0', 'Y'),
('m_076_002', '强制回单', 'g_014_002', '/property-manage/repairs-manage/mandatory-return-issue', 40670, 'p_076_002', '强制回单', '2024-01-01 00:01:45', '0', 'Y'),

-- 物业管理 > 巡检管理
('m_077_002', '巡检项目', 'g_015_002', '/property-manage/patrol-manage/item', 40710, 'p_077_002', '巡检项目', '2024-01-01 00:01:46', '0', 'Y'),
('m_078_002', '巡检点', 'g_015_002', '/property-manage/patrol-manage/point', 40720, 'p_078_002', '巡检点', '2024-01-01 00:01:47', '0', 'Y'),
('m_079_002', '巡检路线', 'g_015_002', '/property-manage/patrol-manage/path', 40730, 'p_079_002', '巡检路线', '2024-01-01 00:01:48', '0', 'Y'),
('m_080_002', '巡检计划', 'g_015_002', '/property-manage/patrol-manage/plan', 40740, 'p_080_002', '巡检计划', '2024-01-01 00:01:49', '0', 'Y'),
('m_081_002', '巡检任务', 'g_015_002', '/property-manage/patrol-manage/task', 40750, 'p_081_002', '巡检任务', '2024-01-01 00:01:50', '0', 'Y'),
('m_082_002', '巡检明细', 'g_015_002', '/property-manage/patrol-manage/detail', 40760, 'p_082_002', '巡检明细', '2024-01-01 00:01:51', '0', 'Y'),

-- 物业管理 > 报表管理
('m_083_002', '数据统计', 'g_016_002', '/property-manage/report-manage/data-statistics', 40810, 'p_083_002', '数据统计', '2024-01-01 00:01:52', '0', 'Y'),
('m_084_002', '费用汇总表', 'g_016_002', '/property-manage/report-manage/expense-summary-table', 40815, 'p_084_002', '费用汇总表', '2024-01-01 00:01:53', '0', 'Y'),
('m_085_002', '费用明细表', 'g_016_002', '/property-manage/report-manage/statement-expenses', 40820, 'p_085_002', '费用明细表', '2024-01-01 00:01:54', '0', 'Y'),
('m_086_002', '费用提醒', 'g_016_002', '/property-manage/report-manage/fee-reminder', 40825, 'p_086_002', '费用提醒', '2024-01-01 00:01:55', '0', 'Y'),
('m_087_002', '欠费明细表', 'g_016_002', '/property-manage/report-manage/arrears-details-list', 40830, 'p_087_002', '欠费明细表', '2024-01-01 00:01:56', '0', 'Y'),
('m_088_002', '缴费明细表', 'g_016_002', '/property-manage/report-manage/payment-details-form', 40835, 'p_088_002', '缴费明细表', '2024-01-01 00:01:57', '0', 'Y'),
('m_089_002', '业主缴费明细', 'g_016_002', '/property-manage/report-manage/owner-payment-details', 40840, 'p_089_002', '业主缴费明细', '2024-01-01 00:01:58', '0', 'Y'),
('m_090_002', '未收费房屋', 'g_016_002', '/property-manage/report-manage/no-charge-house', 40845, 'p_090_002', '未收费房屋', '2024-01-01 00:01:59', '0', 'Y'),
('m_091_002', '欠费分析', 'g_016_002', '/property-manage/report-manage/outstanding-fees-analysis', 40850, 'p_091_002', '欠费分析', '2024-01-01 00:02:00', '0', 'Y'),
('m_092_002', '押金报表', 'g_016_002', '/property-manage/report-manage/deposit-report', 40855, 'p_092_002', '押金报表', '2024-01-01 00:02:01', '0', 'Y'),
('m_093_002', '报修汇总表', 'g_016_002', '/property-manage/report-manage/repair-reports-summary-table', 40860, 'p_093_002', '报修汇总表', '2024-01-01 00:02:02', '0', 'Y'),
('m_094_002', '报修报表', 'g_016_002', '/property-manage/report-manage/repair-report-form', 40865, 'p_094_002', '报修报表', '2024-01-01 00:02:03', '0', 'Y'),
('m_095_002', '巡检报表', 'g_016_002', '/property-manage/report-manage/patrol-report', 40870, 'p_095_002', '巡检报表', '2024-01-01 00:02:04', '0', 'Y');

SET FOREIGN_KEY_CHECKS = 1; 