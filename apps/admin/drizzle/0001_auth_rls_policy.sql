-- 认证相关表 RLS 策略迁移
-- 执行方式: pnpm db:migrate

-- ==========================================
-- 1. 创建认证相关表（如果不存在）
-- ==========================================

-- 1.1 Neon Auth 用户映射表
CREATE TABLE IF NOT EXISTS auth_user_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    neon_auth_id UUID NOT NULL UNIQUE,
    staff_id UUID,
    owner_id UUID,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('staff', 'owner')),
    migrated BOOLEAN DEFAULT false,
    migrated_at TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_user_mapping_neon_auth_id_idx ON auth_user_mapping(neon_auth_id);
CREATE INDEX IF NOT EXISTS auth_user_mapping_staff_id_idx ON auth_user_mapping(staff_id);
CREATE INDEX IF NOT EXISTS auth_user_mapping_owner_id_idx ON auth_user_mapping(owner_id);

-- 1.2 角色定义表
CREATE TABLE IF NOT EXISTS auth_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT DEFAULT '[]',
    is_system BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_roles_role_code_idx ON auth_roles(role_code);

-- 1.3 用户角色关联表
CREATE TABLE IF NOT EXISTS auth_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_mapping_id UUID NOT NULL REFERENCES auth_user_mapping(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES auth_roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_user_roles_user_mapping_id_idx ON auth_user_roles(user_mapping_id);
CREATE INDEX IF NOT EXISTS auth_user_roles_role_id_idx ON auth_user_roles(role_id);

-- ==========================================
-- 2. 为现有表添加 neon_auth_id 字段
-- ==========================================

-- 2.1 为员工表添加 neon_auth_id 字段
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sm_staff' AND column_name = 'neon_auth_id') THEN
        ALTER TABLE sm_staff ADD COLUMN neon_auth_id UUID;
        CREATE INDEX IF NOT EXISTS sm_staff_neon_auth_id_idx ON sm_staff(neon_auth_id);
    END IF;
END $$;

-- 2.2 为业主表添加 neon_auth_id 字段
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hp_owners' AND column_name = 'neon_auth_id') THEN
        ALTER TABLE hp_owners ADD COLUMN neon_auth_id UUID;
        CREATE INDEX IF NOT EXISTS hp_owners_neon_auth_id_idx ON hp_owners(neon_auth_id);
    END IF;
END $$;

-- ==========================================
-- 3. 启用 RLS
-- ==========================================

-- 3.1 为 auth_user_mapping 表启用 RLS
ALTER TABLE auth_user_mapping ENABLE ROW LEVEL SECURITY;

-- 3.2 为 auth_roles 表启用 RLS
ALTER TABLE auth_roles ENABLE ROW LEVEL SECURITY;

-- 3.3 为 auth_user_roles 表启用 RLS
ALTER TABLE auth_user_roles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. 创建 RLS 策略
-- ==========================================

-- 4.1 auth_user_mapping 表策略

-- 允许已认证用户读取自己的映射记录
CREATE POLICY auth_user_mapping_select_policy ON auth_user_mapping
    FOR SELECT
    USING (
        neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        OR current_setting('app.current_role', true) = 'super_admin'
    );

-- 允许已认证用户更新自己的映射记录
CREATE POLICY auth_user_mapping_update_policy ON auth_user_mapping
    FOR UPDATE
    USING (
        neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        OR current_setting('app.current_role', true) = 'super_admin'
    );

-- 4.2 auth_roles 表策略

-- 允许所有人读取角色
CREATE POLICY auth_roles_select_policy ON auth_roles
    FOR SELECT
    USING (enabled = true);

-- 4.3 auth_user_roles 表策略

-- 允许已认证用户读取自己的角色
CREATE POLICY auth_user_roles_select_policy ON auth_user_roles
    FOR SELECT
    USING (
        user_mapping_id IN (
            SELECT id FROM auth_user_mapping
            WHERE neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        )
        OR current_setting('app.current_role', true) = 'super_admin'
    );

-- ==========================================
-- 5. 创建组织隔离相关函数
-- ==========================================

-- 5.1 获取用户可访问的组织 ID 列表
CREATE OR REPLACE FUNCTION get_user_organization_ids()
RETURNS TABLE(organization_id UUID) AS $$
BEGIN
    -- 如果是超级管理员，返回所有组织
    IF current_setting('app.current_role', true) = 'super_admin' THEN
        RETURN QUERY SELECT id FROM sm_organizations;
        RETURN;
    END IF;

    -- 如果是组织管理员，返回所管理的组织
    IF current_setting('app.current_role', true) = 'org_admin' THEN
        RETURN QUERY
        SELECT DISTINCT sm_staff.org_id
        FROM sm_staff
        WHERE sm_staff.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        AND sm_staff.org_id IS NOT NULL;
        RETURN;
    END IF;

    -- 其他角色返回其所属组织
    RETURN QUERY
    SELECT DISTINCT sm_staff.org_id
    FROM sm_staff
    WHERE sm_staff.neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
    AND sm_staff.org_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.2 获取用户可访问的小区 ID 列表
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
        -- 这里需要关联查询，实际应根据员工的 community_ids 字段
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

-- ==========================================
-- 6. 创建业务表的数据隔离策略
-- ==========================================

-- 6.1 员工表数据隔离
ALTER TABLE sm_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY sm_staff_select_policy ON sm_staff
    FOR SELECT
    USING (
        -- 公开数据或满足以下条件之一
        org_id IN (SELECT * FROM get_user_organization_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 6.2 小区表数据隔离
ALTER TABLE cm_communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY cm_communities_select_policy ON cm_communities
    FOR SELECT
    USING (
        -- 所有认证用户都可以读取小区信息
        -- 公开数据
        1=1
    );

-- 6.3 房屋表数据隔离
ALTER TABLE hp_houses ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_houses_select_policy ON hp_houses
    FOR SELECT
    USING (
        community_id IN (SELECT * FROM get_user_community_ids())
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
    );

-- 6.4 业主表数据隔离
ALTER TABLE hp_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY hp_owners_select_policy ON hp_owners
    FOR SELECT
    USING (
        neon_auth_id = current_setting('app.current_neon_auth_id', true)::uuid
        OR current_setting('app.current_role', true) = 'super_admin'
        OR current_setting('app.current_role', true) = 'org_admin'
        OR current_setting('app.current_role', true) = 'community_admin'
        OR current_setting('app.current_role', true) = 'staff'
    );

-- ==========================================
-- 7. 插入默认角色数据
-- ==========================================

INSERT INTO auth_roles (role_name, role_code, description, permissions, is_system, enabled)
VALUES
    ('超级管理员', 'super_admin', '系统超级管理员，拥有所有权限', '["*"]', true, true),
    ('组织管理员', 'org_admin', '组织管理员，管理所属组织和小区', '["community:*", "staff:*", "house:*", "expense:*", "repair:*", "patrol:*", "parking:*", "contract:*"]', true, true),
    ('小区管理员', 'community_admin', '小区管理员，管理所属小区', '["community:read", "staff:*", "house:*", "expense:*", "repair:*", "patrol:*", "parking:*", "contract:read"]', true, true),
    ('物业员工', 'staff', '物业员工，按权限访问数据', '["community:read", "house:read", "expense:read", "repair:*", "patrol:*", "parking:read"]', true, true),
    ('业主/住户', 'owner', '业主/住户，访问自有房产数据', '["house:read", "expense:read", "repair:create", "repair:read", "parking:read"]', true, true)
ON CONFLICT (role_code) DO NOTHING;
