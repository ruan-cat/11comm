/**
 * 组织层级与角色数据隔离 RLS 策略迁移
 *
 * 本迁移文件用于：
 * 1. 完善组织层级关系（支持多级组织）
 * 2. 配置组织级别 RLS 隔离策略
 * 3. 创建组织管理员、小区管理员、物业员工、业主/住户的 RLS 策略
 *
 * 执行方式: pnpm db:migrate
 * 依赖: 0001_auth_rls_policy.sql, 0002_business_rls_policy.sql, 0010_add_org_community_relation.sql
 */

import { sql } from "drizzle-orm";

/**
 * 迁移说明：
 *
 * 1. 组织层级关系完善：
 *    - 添加 parent_id 索引（已存在）
 *    - 添加子组织查询函数
 *    - 添加获取组织树函数
 *
 * 2. RLS 策略配置：
 *    - 组织管理员：可访问所属组织及所有子组织的数据
 *    - 小区管理员：可访问所管理的小区的数据
 *    - 物业员工：只能访问其所属小区的数据
 *    - 业主/住户：只能访问与自己房产相关的数据
 *
 * 3. 组织与小区关联：
 *    - 组织可以管理多个小区（通过 sm_organizations.community_id）
 *    - 小区只属于一个组织（通过 cm_communities.organization_id）
 */

export const up = sql`
-- ==========================================
-- 1. 创建组织层级辅助函数
-- ==========================================

-- 1.1 获取所有子组织 ID（包括直接子组织和孙组织）
CREATE OR REPLACE FUNCTION get_child_organization_ids(parent_org_id UUID)
RETURNS TABLE(organization_id UUID) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE org_tree AS (
        -- 基础情况：直接子组织
        SELECT id, parent_id, org_name, level, org_path
        FROM sm_organizations
        WHERE parent_id = parent_org_id

        UNION ALL

        -- 递归情况：孙组织
        SELECT o.id, o.parent_id, o.org_name, o.level, o.org_path
        FROM sm_organizations o
        INNER JOIN org_tree ON o.parent_id = org_tree.id
    )
    SELECT org_tree.id FROM org_tree;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.2 获取组织的完整树路径（包含当前组织及所有父组织）
CREATE OR REPLACE FUNCTION get_organization_tree_path(org_id UUID)
RETURNS TABLE(organization_id UUID, org_name VARCHAR, level INTEGER) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE org_tree AS (
        -- 基础情况：从当前组织开始
        SELECT id, parent_id, org_name, level
        FROM sm_organizations
        WHERE id = org_id

        UNION ALL

        -- 递归情况：向上查找父组织
        SELECT o.id, o.parent_id, o.org_name, o.level
        FROM sm_organizations o
        INNER JOIN org_tree ON o.id = org_tree.parent_id
    )
    SELECT org_tree.id, org_tree.org_name, org_tree.level FROM org_tree;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.3 获取用户所属组织的完整信息（包含层级和路径）
CREATE OR REPLACE FUNCTION get_user_organization_info()
RETURNS TABLE(
    organization_id UUID,
    org_name VARCHAR,
    parent_id UUID,
    level INTEGER,
    org_path VARCHAR,
    community_id UUID
) AS $$
BEGIN
    -- 如果是超级管理员，返回所有组织的信息
    IF current_setting('app.current_role', true) = 'super_admin' THEN
        RETURN QUERY
        SELECT
            o.id,
            o.org_name,
            o.parent_id,
            o.level,
            o.org_path,
            o.community_id
        FROM sm_organizations o;
        RETURN;
    END IF;

    -- 如果是组织管理员，返回所管理的组织信息
    IF current_setting('app.current_role', true) = 'org_admin' THEN
        RETURN QUERY
        SELECT
            o.id,
            o.org_name,
            o.parent_id,
            o.level,
            o.org_path,
            o.community_id
        FROM sm_organizations o
        WHERE o.id IN (SELECT * FROM get_user_organization_ids());
        RETURN;
    END IF;

    -- 其他角色返回其所属组织的信息
    RETURN QUERY
    SELECT
        o.id,
        o.org_name,
        o.parent_id,
        o.level,
        o.org_path,
        o.community_id
    FROM sm_organizations o
    INNER JOIN sm_staff ON sm_staff.org_id = o.id
    WHERE sm_staff.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. 启用组织表的 RLS
-- ==========================================

-- 2.1 启用 sm_organizations 表的 RLS
ALTER TABLE sm_organizations ENABLE ROW LEVEL SECURITY;

-- 组织表 SELECT 策略：所有人都可以读取组织信息
CREATE POLICY sm_organizations_select_policy ON sm_organizations
    FOR SELECT
    USING (true);

-- 组织表 INSERT 策略：只有超级管理员可以创建
CREATE POLICY sm_organizations_insert_policy ON sm_organizations
    FOR INSERT
    WITH CHECK (
        current_setting('app.current_role', true) = 'super_admin'
    );

-- 组织表 UPDATE 策略：只有超级管理员可以更新
CREATE POLICY sm_organizations_update_policy ON sm_organizations
    FOR UPDATE
    USING (
        current_setting('app.current_role', true) = 'super_admin'
    );

-- 组织表 DELETE 策略：只有超级管理员可以删除
CREATE POLICY sm_organizations_delete_policy ON sm_organizations
    FOR DELETE
    USING (
        current_setting('app.current_role', true) = 'super_admin'
    );

-- ==========================================
-- 3. 组织管理员 RLS 策略
-- ==========================================

-- 3.1 组织管理员可以访问其所属组织及所有子组织的数据
-- 组织管理员可以访问：
-- - 所属组织的数据
-- - 所有子组织的数据
-- - 所属组织管理的小区的数据

-- sm_staff 表：组织管理员可以访问其组织及子组织的员工
DROP POLICY IF EXISTS sm_staff_org_admin_select_policy ON sm_staff;
CREATE POLICY sm_staff_org_admin_select_policy ON sm_staff
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员：可访问所属组织及子组织的员工
        (
            current_setting('app.current_role', true) = 'org_admin'
            AND (
                org_id IN (SELECT * FROM get_user_organization_ids())
                OR org_id IN (
                    SELECT get_child_organization_ids(o.id)
                    FROM sm_organizations o
                    WHERE o.id IN (SELECT * FROM get_user_organization_ids())
                )
            )
        )
    );

-- sm_organizations 表：组织管理员可以访问其组织及子组织
DROP POLICY IF EXISTS sm_organizations_org_admin_select_policy ON sm_organizations;
CREATE POLICY sm_organizations_org_admin_select_policy ON sm_organizations
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员：可访问所属组织及子组织
        (
            current_setting('app.current_role', true) = 'org_admin'
            AND (
                id IN (SELECT * FROM get_user_organization_ids())
                OR id IN (
                    SELECT get_child_organization_ids(o.id)
                    FROM sm_organizations o
                    WHERE o.id IN (SELECT * FROM get_user_organization_ids())
                )
            )
        )
    );

-- cm_communities 表：组织管理员可以访问其组织管理的小区
DROP POLICY IF EXISTS cm_communities_org_admin_select_policy ON cm_communities;
CREATE POLICY cm_communities_org_admin_select_policy ON cm_communities
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员：可访问所属组织管理的小区
        (
            current_setting('app.current_role', true) = 'org_admin'
            AND (
                id IN (
                    -- 直接关联的小区
                    SELECT community_id FROM sm_organizations
                    WHERE id IN (SELECT * FROM get_user_organization_ids())
                    UNION
                    -- 子组织管理的小区
                    SELECT community_id FROM sm_organizations
                    WHERE id IN (
                        SELECT get_child_organization_ids(o.id)
                        FROM sm_organizations o
                        WHERE o.id IN (SELECT * FROM get_user_organization_ids())
                    )
                )
                OR organization_id IN (SELECT * FROM get_user_organization_ids())
                OR organization_id IN (
                    SELECT get_child_organization_ids(o.id)
                    FROM sm_organizations o
                    WHERE o.id IN (SELECT * FROM get_user_organization_ids())
                )
            )
        )
    );

-- ==========================================
-- 4. 小区管理员 RLS 策略
-- ==========================================

-- 4.1 小区管理员可以访问其所管理的小区的数据

-- sm_staff 表：小区管理员可以访问其小区的员工
DROP POLICY IF EXISTS sm_staff_community_admin_select_policy ON sm_staff;
CREATE POLICY sm_staff_community_admin_select_policy ON sm_staff
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员：可访问其小区的员工
        (
            current_setting('app.current_role', true) = 'community_admin'
            AND community_id IN (SELECT * FROM get_user_community_ids())
        )
    );

-- cm_communities 表：小区管理员可以访问其所管理的小区
DROP POLICY IF EXISTS cm_communities_community_admin_select_policy ON cm_communities;
CREATE POLICY cm_communities_community_admin_select_policy ON cm_communities
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员：可访问其管理的小区
        (
            current_setting('app.current_role', true) = 'community_admin'
            AND id IN (SELECT * FROM get_user_community_ids())
        )
    );

-- ==========================================
-- 5. 物业员工 RLS 策略
-- ==========================================

-- 5.1 物业员工只能访问其所属小区的数据

-- sm_staff 表：物业员工可以访问其小区的员工
DROP POLICY IF EXISTS sm_staff_staff_select_policy ON sm_staff;
CREATE POLICY sm_staff_staff_select_policy ON sm_staff
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员无限制
        current_setting('app.current_role', true) = 'community_admin'
        OR
        -- 物业员工：可访问其小区的员工
        (
            current_setting('app.current_role', true) = 'staff'
            AND community_id IN (SELECT * FROM get_user_community_ids())
        )
    );

-- cm_communities 表：物业员工可以访问其所属小区
DROP POLICY IF EXISTS cm_communities_staff_select_policy ON cm_communities;
CREATE POLICY cm_communities_staff_select_policy ON cm_communities
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员无限制
        current_setting('app.current_role', true) = 'community_admin'
        OR
        -- 物业员工：可访问其所属小区
        (
            current_setting('app.current_role', true) = 'staff'
            AND id IN (SELECT * FROM get_user_community_ids())
        )
    );

-- ==========================================
-- 6. 业主/住户 RLS 策略
-- ==========================================

-- 6.1 业主/住户只能访问与自己房产相关的数据

-- hp_houses 表：业主可以访问自己的房产
DROP POLICY IF EXISTS hp_houses_owner_select_policy ON hp_houses;
CREATE POLICY hp_houses_owner_select_policy ON hp_houses
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员/物业员工可以访问其小区的所有房产
        current_setting('app.current_role', true) IN ('community_admin', 'staff')
        OR
        -- 业主：只能访问自己的房产
        (
            current_setting('app.current_role', true) = 'owner'
            AND community_id IN (SELECT * FROM get_user_community_ids())
        )
    );

-- hp_owners 表：业主可以访问自己的信息
DROP POLICY IF EXISTS hp_owners_owner_select_policy ON hp_owners;
CREATE POLICY hp_owners_owner_select_policy ON hp_owners
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员/物业员工可以访问其小区的所有业主
        current_setting('app.current_role', true) IN ('community_admin', 'staff')
        OR
        -- 业主：只能访问自己的信息
        (
            current_setting('app.current_role', true) = 'owner'
            AND neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
    );

-- hp_owner_members 表：业主可以访问家庭成员信息
DROP POLICY IF EXISTS hp_owner_members_owner_select_policy ON hp_owner_members;
CREATE POLICY hp_owner_members_owner_select_policy ON hp_owner_members
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员/物业员工可以访问其小区的所有家庭成员
        current_setting('app.current_role', true) IN ('community_admin', 'staff')
        OR
        -- 业主：只能访问自己家庭成员的信息
        (
            current_setting('app.current_role', true) = 'owner'
            AND owner_id IN (
                SELECT id FROM hp_owners
                WHERE neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
            )
        )
    );

-- ==========================================
-- 7. 完善费用管理表的 RLS 策略（业主/住户）
-- ==========================================

-- ex_payments 表：业主可以查看自己的缴费记录
DROP POLICY IF EXISTS ex_payments_owner_select_policy ON ex_payments;
CREATE POLICY ex_payments_owner_select_policy ON ex_payments
    FOR SELECT
    USING (
        -- 超级管理员无限制
        current_setting('app.current_role', true) = 'super_admin'
        OR
        -- 组织管理员无限制
        current_setting('app.current_role', true) = 'org_admin'
        OR
        -- 小区管理员/物业员工可以访问其小区的所有缴费记录
        current_setting('app.current_role', true) IN ('community_admin', 'staff')
        OR
        -- 业主：只能查看自己的缴费记录
        (
            current_setting('app.current_role', true) = 'owner'
            AND community_id IN (SELECT * FROM get_user_community_ids())
        )
    );

-- ==========================================
-- 8. 更新 get_user_community_ids 函数支持多角色
-- ==========================================

CREATE OR REPLACE FUNCTION get_user_community_ids()
RETURNS TABLE(community_id UUID) AS $$
BEGIN
    -- 如果是超级管理员或组织管理员，返回所有小区
    IF current_setting('app.current_role', true) IN ('super_admin', 'org_admin') THEN
        RETURN QUERY SELECT id FROM cm_communities;
        RETURN;
    END IF;

    -- 小区管理员和物业员工返回所管理的小区
    IF current_setting('app.current_role', true) IN ('community_admin', 'staff') THEN
        -- 从员工表中获取员工所属的小区
        RETURN QUERY
        SELECT DISTINCT sm_staff.community_id
        FROM sm_staff
        WHERE sm_staff.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        AND sm_staff.community_id IS NOT NULL
        UNION
        -- 从组织关联的小区中获取
        SELECT DISTINCT cm_communities.id
        FROM cm_communities
        INNER JOIN sm_organizations ON sm_organizations.community_id = cm_communities.id
        WHERE sm_organizations.id IN (SELECT * FROM get_user_organization_ids())
        AND cm_communities.id IS NOT NULL;
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

-- ==========================================
-- 9. 添加数据访问日志表（可选）
-- ==========================================

CREATE TABLE IF NOT EXISTS sm_data_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    neon_auth_id UUID,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    organization_id UUID,
    community_id UUID
);

CREATE INDEX IF NOT EXISTS sm_data_access_logs_user_id_idx ON sm_data_access_logs(user_id);
CREATE INDEX IF NOT EXISTS sm_data_access_logs_neon_auth_id_idx ON sm_data_access_logs(neon_auth_id);
CREATE INDEX IF NOT EXISTS sm_data_access_logs_table_name_idx ON sm_data_access_logs(table_name);
CREATE INDEX IF NOT EXISTS sm_data_access_logs_access_time_idx ON sm_data_access_logs(access_time);
`;

export const down = sql`
-- ==========================================
-- 回滚操作
-- ==========================================

-- 删除 RLS 策略
DROP POLICY IF EXISTS sm_staff_org_admin_select_policy ON sm_staff;
DROP POLICY IF EXISTS sm_organizations_org_admin_select_policy ON sm_organizations;
DROP POLICY IF EXISTS cm_communities_org_admin_select_policy ON cm_communities;

DROP POLICY IF EXISTS sm_staff_community_admin_select_policy ON sm_staff;
DROP POLICY IF EXISTS cm_communities_community_admin_select_policy ON cm_communities;

DROP POLICY IF EXISTS sm_staff_staff_select_policy ON sm_staff;
DROP POLICY IF EXISTS cm_communities_staff_select_policy ON cm_communities;

DROP POLICY IF EXISTS hp_houses_owner_select_policy ON hp_houses;
DROP POLICY IF EXISTS hp_owners_owner_select_policy ON hp_owners;
DROP POLICY IF EXISTS hp_owner_members_owner_select_policy ON hp_owner_members;
DROP POLICY IF EXISTS ex_payments_owner_select_policy ON ex_payments;

-- 禁用 RLS
ALTER TABLE sm_organizations DISABLE ROW LEVEL SECURITY;

-- 删除辅助函数
DROP FUNCTION IF EXISTS get_child_organization_ids(UUID);
DROP FUNCTION IF EXISTS get_organization_tree_path(UUID);
DROP FUNCTION IF EXISTS get_user_organization_info();

-- 恢复原来的 get_user_community_ids 函数
DROP FUNCTION IF EXISTS get_user_community_ids();

-- 删除日志表
DROP TABLE IF EXISTS sm_data_access_logs;
`;
