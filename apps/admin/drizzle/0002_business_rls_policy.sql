-- 业务表 RLS 策略迁移
-- 执行方式: pnpm db:migrate
-- 依赖: 0001_auth_rls_policy.sql (必须先执行)

-- ==========================================
-- 1. 费用管理相关表 (Expense - ex)
-- ==========================================

-- 1.1 费用项表
ALTER TABLE ex_expense_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_expense_items_select_policy ON ex_expense_items
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.2 房屋收费表
ALTER TABLE ex_house_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_house_charges_select_policy ON ex_house_charges
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_house_charges_insert_policy ON ex_house_charges
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_house_charges_update_policy ON ex_house_charges
    FOR UPDATE
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.3 车辆收费表
ALTER TABLE ex_vehicle_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_vehicle_charges_select_policy ON ex_vehicle_charges
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_vehicle_charges_insert_policy ON ex_vehicle_charges
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_vehicle_charges_update_policy ON ex_vehicle_charges
    FOR UPDATE
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.4 合同收费表
ALTER TABLE ex_contract_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_contract_charges_select_policy ON ex_contract_charges
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.5 缴费记录表
ALTER TABLE ex_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_payments_select_policy ON ex_payments
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_payments_insert_policy ON ex_payments
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.6 缴费审核表
ALTER TABLE ex_payment_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_payment_reviews_select_policy ON ex_payment_reviews
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_payment_reviews_insert_policy ON ex_payment_reviews
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.7 退款审核表
ALTER TABLE ex_refund_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_refund_reviews_select_policy ON ex_refund_reviews
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_refund_reviews_insert_policy ON ex_refund_reviews
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.8 优惠类型表
ALTER TABLE ex_discount_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_discount_types_select_policy ON ex_discount_types
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.9 优惠设置表
ALTER TABLE ex_discount_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_discount_settings_select_policy ON ex_discount_settings
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.10 优惠申请表
ALTER TABLE ex_discount_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_discount_applications_select_policy ON ex_discount_applications
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_discount_applications_insert_policy ON ex_discount_applications
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.11 抄表类型表
ALTER TABLE ex_meter_reading_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_meter_reading_types_select_policy ON ex_meter_reading_types
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.12 抄表记录表
ALTER TABLE ex_meter_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_meter_readings_select_policy ON ex_meter_readings
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_meter_readings_insert_policy ON ex_meter_readings
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.13 退费记录表
ALTER TABLE ex_cancel_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_cancel_fees_select_policy ON ex_cancel_fees
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ex_cancel_fees_insert_policy ON ex_cancel_fees
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.14 催缴提醒表
ALTER TABLE ex_overdue_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_overdue_reminders_select_policy ON ex_overdue_reminders
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.15 补打凭证表
ALTER TABLE ex_reprint_vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_reprint_vouchers_select_policy ON ex_reprint_vouchers
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 1.16 费用汇总表
ALTER TABLE ex_expense_summary_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY ex_expense_summary_tables_select_policy ON ex_expense_summary_tables
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 2. 报修管理相关表 (Repairs - rp)
-- ==========================================

-- 2.1 报修工单表
ALTER TABLE rp_repair_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_repair_orders_select_policy ON rp_repair_orders
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的报修单
        OR (current_setting('app.current_role', true) = 'owner'
            AND EXISTS (
                SELECT 1 FROM hp_houses
                WHERE hp_houses.id = rp_repair_orders.house_id
                AND hp_houses.owner_id IN (
                    SELECT id FROM hp_owners
                    WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
                )
            ))
    );

CREATE POLICY rp_repair_orders_insert_policy ON rp_repair_orders
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'owner'
    );

CREATE POLICY rp_repair_orders_update_policy ON rp_repair_orders
    FOR UPDATE
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 2.2 报修工单历史表
ALTER TABLE rp_repair_order_histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_repair_order_histories_select_policy ON rp_repair_order_histories
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 2.3 回访记录表
ALTER TABLE rp_return_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_return_visits_select_policy ON rp_return_visits
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY rp_return_visits_insert_policy ON rp_return_visits
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 2.4 报修设置表
ALTER TABLE rp_repair_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_repair_settings_select_policy ON rp_repair_settings
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 2.5 报修类型表
ALTER TABLE rp_repair_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_repair_types_select_policy ON rp_repair_types
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 2.6 必回访问题表
ALTER TABLE rp_mandatory_return_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_mandatory_return_issues_select_policy ON rp_mandatory_return_issues
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 2.7 电话报修记录表
ALTER TABLE rp_phone_repair_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY rp_phone_repair_reports_select_policy ON rp_phone_repair_reports
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY rp_phone_repair_reports_insert_policy ON rp_phone_repair_reports
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 3. 巡检管理相关表 (Patrol - pt)
-- ==========================================

-- 3.1 巡检计划表
ALTER TABLE pt_patrol_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY pt_patrol_plans_select_policy ON pt_patrol_plans
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY pt_patrol_plans_insert_policy ON pt_patrol_plans
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY pt_patrol_plans_update_policy ON pt_patrol_plans
    FOR UPDATE
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 3.2 巡检路线表
ALTER TABLE pt_patrol_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY pt_patrol_paths_select_policy ON pt_patrol_paths
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY pt_patrol_paths_insert_policy ON pt_patrol_paths
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 3.3 巡检点表
ALTER TABLE pt_patrol_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY pt_patrol_points_select_policy ON pt_patrol_points
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 3.4 巡检项表
ALTER TABLE pt_patrol_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY pt_patrol_items_select_policy ON pt_patrol_items
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 3.5 巡检任务表
ALTER TABLE pt_patrol_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY pt_patrol_tasks_select_policy ON pt_patrol_tasks
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY pt_patrol_tasks_insert_policy ON pt_patrol_tasks
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 3.6 巡检详情表
ALTER TABLE pt_patrol_task_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY pt_patrol_task_details_select_policy ON pt_patrol_task_details
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 4. 停车管理相关表 (Parking - pk)
-- ==========================================

-- 4.1 停车场结构表
ALTER TABLE pk_parking_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY pk_parking_structures_select_policy ON pk_parking_structures
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 4.2 车位表
ALTER TABLE pk_parking_lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY pk_parking_lots_select_policy ON pk_parking_lots
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 4.3 车库/车位表
ALTER TABLE pk_carports ENABLE ROW LEVEL SECURITY;

CREATE POLICY pk_carports_select_policy ON pk_carports
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY pk_carports_insert_policy ON pk_carports
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 4.4 业主车辆表
ALTER TABLE pk_owner_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY pk_owner_vehicles_select_policy ON pk_owner_vehicles
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的车辆
        OR (current_setting('app.current_role', true) = 'owner'
            AND owner_id IN (
                SELECT id FROM hp_owners
                WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
            ))
    );

CREATE POLICY pk_owner_vehicles_insert_policy ON pk_owner_vehicles
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'owner'
    );

-- 4.5 车位申请表
ALTER TABLE pk_carport_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY pk_carport_applications_select_policy ON pk_carport_applications
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的申请
        OR (current_setting('app.current_role', true) = 'owner'
            AND applicant_id IN (
                SELECT id FROM hp_owners
                WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
            ))
    );

CREATE POLICY pk_carport_applications_insert_policy ON pk_carport_applications
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'owner'
    );

-- ==========================================
-- 5. 合同管理相关表 (Contract - ct)
-- ==========================================

-- 5.1 甲方表
ALTER TABLE ct_first_parties ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_first_parties_select_policy ON ct_first_parties
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.2 乙方表
ALTER TABLE ct_second_parties ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_second_parties_select_policy ON ct_second_parties
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.3 合同模板表
ALTER TABLE ct_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_templates_select_policy ON ct_templates
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.4 合同条款表
ALTER TABLE ct_clauses ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_clauses_select_policy ON ct_clauses
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.5 合同类型表
ALTER TABLE ct_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_types_select_policy ON ct_types
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.6 合同表
ALTER TABLE ct_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_contracts_select_policy ON ct_contracts
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ct_contracts_insert_policy ON ct_contracts
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ct_contracts_update_policy ON ct_contracts
    FOR UPDATE
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.7 合同附件表
ALTER TABLE ct_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_attachments_select_policy ON ct_attachments
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.8 合同变更表
ALTER TABLE ct_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_changes_select_policy ON ct_changes
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.9 合同审核表
ALTER TABLE ct_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_reviews_select_policy ON ct_reviews
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY ct_reviews_insert_policy ON ct_reviews
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.10 合同归档表
ALTER TABLE ct_archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_archives_select_policy ON ct_archives
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 5.11 合同打印表
ALTER TABLE ct_prints ENABLE ROW LEVEL SECURITY;

CREATE POLICY ct_prints_select_policy ON ct_prints
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 6. 房产相关表 (House Property - hp)
-- ==========================================

-- 6.1 业主成员表
ALTER TABLE hp_owner_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_owner_members_select_policy ON hp_owner_members
    FOR SELECT
    USING (
        -- 业主可以查看自己家庭的成员
        owner_id IN (
            SELECT id FROM hp_owners
            WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'community_admin'
        OR current_setting('app.current_role', true) = 'staff'
    );

-- 6.2 业主账户表
ALTER TABLE hp_owner_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_owner_accounts_select_policy ON hp_owner_accounts
    FOR SELECT
    USING (
        -- 业主可以查看自己的账户
        owner_id IN (
            SELECT id FROM hp_owners
            WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'community_admin'
        OR current_setting('app.current_role', true) = 'staff'
    );

-- 6.3 发票表
ALTER TABLE hp_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_invoices_select_policy ON hp_invoices
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的发票
        OR (current_setting('app.current_role', true) = 'owner'
            AND owner_id IN (
                SELECT id FROM hp_owners
                WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
            ))
    );

-- 6.4 发票抬头表
ALTER TABLE hp_invoice_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_invoice_titles_select_policy ON hp_invoice_titles
    FOR SELECT
    USING (
        -- 业主可以查看自己的发票抬头
        owner_id IN (
            SELECT id FROM hp_owners
            WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'community_admin'
        OR current_setting('app.current_role', true) = 'staff'
    );

-- 6.5 场地预约表
ALTER TABLE hp_reserve_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_reserve_venues_select_policy ON hp_reserve_venues
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 6.6 场地预约订单表
ALTER TABLE hp_reserve_venue_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_reserve_venue_orders_select_policy ON hp_reserve_venue_orders
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的预约订单
        OR (current_setting('app.current_role', true) = 'owner'
            AND owner_id IN (
                SELECT id FROM hp_owners
                WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
            ))
    );

CREATE POLICY hp_reserve_venue_orders_insert_policy ON hp_reserve_venue_orders
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'owner'
    );

-- 6.7 场地管理表
ALTER TABLE hp_site_managements ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_site_managements_select_policy ON hp_site_managements
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 6.8 业主委员会表
ALTER TABLE hp_owners_committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_owners_committees_select_policy ON hp_owners_committees
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 7. 组织架构相关表 (Setting - sm)
-- ==========================================

-- 7.1 组织表
ALTER TABLE sm_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_organizations_select_policy ON sm_organizations
    FOR SELECT
    USING (
        id IN (SELECT * FROM get_user_organization_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
    );

-- 7.2 角色表
ALTER TABLE sm_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_roles_select_policy ON sm_roles
    FOR SELECT
    USING (enabled = true);

-- 7.3 权限表
ALTER TABLE sm_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_permissions_select_policy ON sm_permissions
    FOR SELECT
    USING (enabled = true);

-- 7.4 角色权限关联表
ALTER TABLE sm_role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_role_permissions_select_policy ON sm_role_permissions
    FOR SELECT
    USING (
        role_id IN (SELECT id FROM sm_roles WHERE enabled = true)
    );

-- 7.5 员工角色关联表
ALTER TABLE sm_staff_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_staff_roles_select_policy ON sm_staff_roles
    FOR SELECT
    USING (
        staff_id IN (
            SELECT id FROM sm_staff
            WHERE neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 7.6 数据权限表
ALTER TABLE sm_data_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_data_permissions_select_policy ON sm_data_permissions
    FOR SELECT
    USING (
        staff_id IN (
            SELECT id FROM sm_staff
            WHERE neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 7.7 班次表
ALTER TABLE sm_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_shifts_select_policy ON sm_shifts
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 7.8 排班设置表
ALTER TABLE sm_scheduling_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_scheduling_settings_select_policy ON sm_scheduling_settings
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 7.9 工作日程表
ALTER TABLE sm_working_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_working_schedules_select_policy ON sm_working_schedules
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 7.10 系统配置表
ALTER TABLE sm_system_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_system_configs_select_policy ON sm_system_configs
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
    );

-- 7.11 注册协议表
ALTER TABLE sm_register_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_register_protocols_select_policy ON sm_register_protocols
    FOR SELECT
    USING (enabled = true);

-- ==========================================
-- 8. 社区管理相关表 (Community - cm)
-- ==========================================

-- 8.1 通知公告表
ALTER TABLE cm_notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY cm_notices_select_policy ON cm_notices
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

CREATE POLICY cm_notices_insert_policy ON cm_notices
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 8.2 业务办理表
ALTER TABLE cm_handing_business ENABLE ROW LEVEL SECURITY;

CREATE POLICY cm_handing_business_select_policy ON cm_handing_business
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 8.3 装修管理表
ALTER TABLE cm_house_decorations ENABLE ROW LEVEL SECURITY;

CREATE POLICY cm_house_decorations_select_policy ON cm_house_decorations
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的装修申请
        OR (current_setting('app.current_role', true) = 'owner'
            AND house_id IN (
                SELECT id FROM hp_houses
                WHERE hp_houses.owner_id IN (
                    SELECT id FROM hp_owners
                    WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
                )
            ))
    );

CREATE POLICY cm_house_decorations_insert_policy ON cm_house_decorations
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'owner'
    );

-- 8.4 物品放行表
ALTER TABLE cm_property_registers ENABLE ROW LEVEL SECURITY;

CREATE POLICY cm_property_registers_select_policy ON cm_property_registers
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        -- 业主可以查看自己的放行记录
        OR (current_setting('app.current_role', true) = 'owner'
            AND house_id IN (
                SELECT id FROM hp_houses
                WHERE hp_houses.owner_id IN (
                    SELECT id FROM hp_owners
                    WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
                )
            ))
    );

CREATE POLICY cm_property_registers_insert_policy ON cm_property_registers
    FOR INSERT
    WITH CHECK (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'owner'
    );

-- 8.5 楼栋结构表
ALTER TABLE cm_building_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY cm_building_structures_select_policy ON cm_building_structures
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 9. 报表相关表 (Report - rpt)
-- ==========================================

-- 9.1 费用汇总报表
ALTER TABLE rpt_expense_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_expense_summaries_select_policy ON rpt_expense_summaries
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.2 押金报表
ALTER TABLE rpt_deposit_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_deposit_reports_select_policy ON rpt_deposit_reports
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.3 缴费明细报表
ALTER TABLE rpt_payment_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_payment_details_select_policy ON rpt_payment_details
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.4 业主缴费明细报表
ALTER TABLE rpt_owner_payment_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_owner_payment_details_select_policy ON rpt_owner_payment_details
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.5 费用催缴报表
ALTER TABLE rpt_fee_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_fee_reminders_select_policy ON rpt_fee_reminders
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.6 未缴费房屋报表
ALTER TABLE rpt_no_charge_houses ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_no_charge_houses_select_policy ON rpt_no_charge_houses
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.7 欠费明细报表
ALTER TABLE rpt_outstanding_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_outstanding_fees_select_policy ON rpt_outstanding_fees
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.8 巡检报表
ALTER TABLE rpt_patrol_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_patrol_reports_select_policy ON rpt_patrol_reports
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.9 报修报表
ALTER TABLE rpt_repair_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_repair_reports_select_policy ON rpt_repair_reports
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.10 报修汇总报表
ALTER TABLE rpt_repair_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_repair_summaries_select_policy ON rpt_repair_summaries
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.11 费用明细报表
ALTER TABLE rpt_statement_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_statement_expenses_select_policy ON rpt_statement_expenses
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 9.12 数据统计报表
ALTER TABLE rpt_data_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY rpt_data_statistics_select_policy ON rpt_data_statistics
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- ==========================================
-- 10. 运营相关表 (Operation - op)
-- ==========================================

-- 10.1 商户表
ALTER TABLE op_merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_merchants_select_policy ON op_merchants
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.2 商户管理员表
ALTER TABLE op_merchant_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_merchant_admins_select_policy ON op_merchant_admins
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.3 物业公司表
ALTER TABLE op_property_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_property_companies_select_policy ON op_property_companies
    FOR SELECT
    USING (
        id IN (SELECT * FROM get_user_organization_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
    );

-- 10.4 社区信息表
ALTER TABLE op_community_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_community_info_select_policy ON op_community_info
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.5 社区配置表
ALTER TABLE op_community_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_community_configs_select_policy ON op_community_configs
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.6 报表分组表
ALTER TABLE op_report_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_report_groups_select_policy ON op_report_groups
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.7 报表信息表
ALTER TABLE op_report_infos ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_report_infos_select_policy ON op_report_infos
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.8 报表组件表
ALTER TABLE op_report_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_report_components_select_policy ON op_report_components
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 10.9 注册协议表
ALTER TABLE op_register_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY op_register_protocols_select_policy ON op_register_protocols
    FOR SELECT
    USING (enabled = true);

-- ==========================================
-- 11. 创建设置用户可访问的小区 ID 列表的函数
-- ==========================================

-- 11.1 新增获取用户可访问的小区 ID 列表（基于员工的小区权限）
CREATE OR REPLACE FUNCTION get_user_property_ids()
RETURNS TABLE(community_id UUID) AS $$
BEGIN
    -- 如果是超级管理员或组织管理员，返回所有小区
    IF current_setting('app.current_role', true) IN ('super_admin', 'org_admin') THEN
        RETURN QUERY SELECT id FROM cm_communities;
        RETURN;
    END IF;

    -- 小区管理员和物业员工返回所管理的小区
    IF current_setting('app.current_role', true) IN ('community_admin', 'staff') THEN
        RETURN QUERY
        SELECT DISTINCT cm_communities.id
        FROM cm_communities
        WHERE cm_communities.org_id IN (SELECT * FROM get_user_organization_ids());
        RETURN;
    END IF;

    -- 业主返回自己房产所在的小区
    IF current_setting('app.current_role', true) = 'owner' THEN
        RETURN QUERY
        SELECT DISTINCT hp_houses.community_id
        FROM hp_houses
        INNER JOIN hp_owners ON hp_owners.id = hp_houses.owner_id
        WHERE hp_owners.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        AND hp_houses.community_id IS NOT NULL;
        RETURN;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
